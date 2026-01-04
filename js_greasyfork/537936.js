// ==UserScript==
// @name         DIEHARD INDEX
// @namespace    https://note.com/neyagawanyan/diehardindex
// @version      0.2
// @description  diehardtales.com　上の記事リンクを管理するスクリプトです
// @author       @neyagawanyan
// @match        https://diehardtales.com/*
// @match        https://note.com/neyagawanyan/*
// @license      GNU AGPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537936/DIEHARD%20INDEX.user.js
// @updateURL https://update.greasyfork.org/scripts/537936/DIEHARD%20INDEX.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // iframe内なら実行しない（note記事内の埋込対策）
    if (window.top !== window) return;

    const STORAGE_KEY = 'diehardToc';
    let dragSrcEl = null;
    let isTocVisible = true;
    let showingAltMenu = false; // 目次フレームは表示済みか


    //----ここから共通処理用のユーティリティ関数-----//

    // スタイル適用ユーティリティ関数
    const applyStyles = (element, styles) => {
        Object.assign(element.style, styles);
    };

    // カスタム要素を作成するユーティリティ関数（要素作成の共通化）
    const createCustomElement = (tag, attributes = {}, textContent = '', style = {}) => {
        const el = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));
        if (textContent) el.textContent = textContent;
        if (Object.keys(style).length) applyStyles(el, style);
        return el;
    };

    // ボタン生成関数（createCustomElement を使って統一）
    const createButton = ({ text, onClick, style = {}, attributes = {} }) => {
        const btn = createCustomElement(
            'button',
            attributes,
            text,
            {
                padding: '8px 12px',
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                ...style
            }
        );
        btn.onclick = onClick;
        return btn;
    };

    // メニュー状態定義
    const menuStateStyles = {
        alt: {
            bg: 'rgba(255, 255, 255, 0.8)',
            width: '360px',
            buttonText: '記事リンク',
            addButtonDisplay: 'none',
            loadFunc: (menuList) => showAltIndex(menuList) // 関数をラップすることで引数を渡す
        },
        toc: {
            bg: 'rgba(0, 0, 0, 0.8)',
            width: '270px',
            buttonText: '目次抽出',
            addButtonDisplay: 'block',
            loadFunc: (menuList) => loadSavedToc(menuList) // 関数をラップすることで引数を渡す
        }
    };

    //-----ユーティリティ関数ここまで-----//


    //メニュー画面を生成
    const createMenu = () => {
        const menuContainer = document.createElement('div');
        applyStyles(menuContainer, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '270px',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            padding: '20px',
            paddingTop: '60px',
            paddingBottom: '20px',
            overflowY: 'auto',
            zIndex: '9999',
            transition: 'background-color 0.3s ease, width 0.3s ease, transform 0.3s ease',
            transform: 'translateX(-100%)'
        });

        document.body.appendChild(menuContainer);

        //メニューリストの定義
        const menuList = document.createElement('ul');
        menuList.style.listStyleType = 'none';
        menuContainer.appendChild(menuList);

        //記事リンクの追加ボタンを実装
        const addButton = createButton({
            text: '＋現在の記事を追加',
            onClick: () => {
                // リンク追加処理
                addCurrentPageToList(menuList, addButton);
            },
            style: {
                marginTop: '10px',
                padding: '10px 15px',
                backgroundColor: '#4fa3ff',
                color: '#fff',
                borderRadius: '4px',
                position: 'sticky',
                bottom: '0px',
                zIndex: '10',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                cursor: 'pointer'
            },
            attributes: {
                class: 'addlink-button'
            }
        });
        menuContainer.appendChild(addButton);


        // メニュー切替ボタン
        const tabSwitchButton = createButton({
            text: '目次抽出',
            onClick: () => {
                showingAltMenu = !showingAltMenu;
                const state = showingAltMenu ? 'alt' : 'toc';
                const s = menuStateStyles[state];
                tabSwitchButton.textContent = s.buttonText;
                menuContainer.style.backgroundColor = s.bg;
                menuContainer.style.width = s.width;
                addButton.style.display = s.addButtonDisplay;
                menuList.innerHTML = '';
                s.loadFunc(menuList);
            },
            style: {
                position: 'fixed',
                top: '10px',
                left: '150px',
                zIndex: '10000',
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'transform 0.3s ease',
                transform: 'translateX(-100%)'
            }
        });

        document.body.appendChild(tabSwitchButton);


        // トグルボタン
        const toggleButton = createButton({
            text: 'DIEHARD INDEX',
            onClick: () => {
                const isOpen = menuContainer.style.transform === 'translateX(0%)';
                const transformValue = isOpen ? 'translateX(-100%)' : 'translateX(0%)';
                menuContainer.style.transform = transformValue;
                tabSwitchButton.style.transform = transformValue;
            },
            style: {
                position: 'fixed',
                top: '10px',
                left: '10px',
                zIndex: '10000',
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
            }
        });
        document.body.appendChild(toggleButton);


        // ページ読み込み時にスクロール復元
        const savedScrollTop = localStorage.getItem('diehardTocScrollTop');
        if (savedScrollTop !== null && savedScrollTop !== "null") {
            setTimeout(() => {
                menuContainer.scrollTop = parseInt(savedScrollTop, 10);
                // 一時的にトランジションを無効化
                menuContainer.style.transition = 'none';
                menuContainer.style.transform = 'translateX(0%)';
                void menuContainer.offsetHeight; // 強制再描画で反映
                menuContainer.style.transition = 'background-color 0.3s ease, width 0.3s ease, transform 0.3s ease'; // トランジションを元に戻す

                // タブ切り替えボタンも同様に
                tabSwitchButton.style.transition = 'none';
                tabSwitchButton.style.transform = 'translateX(0%)';
                void tabSwitchButton.offsetHeight;
                tabSwitchButton.style.transition = 'transform 0.3s ease';

                // スクロール位置が復元されたなら、目次を開く
                menuContainer.style.transform = 'translateX(0%)';
                tabSwitchButton.style.transform = 'translateX(0%)';
                localStorage.setItem('diehardTocScrollTop', null); // 一度開いたらクリアしておく

            }, 0);
        }

        //保存済みの目次データを読み込み
        loadSavedToc(menuList);
    };

    //////////////////////////////////////////



    // noteの目次機能からリンクを抽出して表示
    const showAltIndex = (menuList) => {
        menuList.innerHTML = '';  // 現在の目次をクリア

        const nav = document.querySelector('nav[aria-label="目次"]');
        if (!nav) {
            menuList.appendChild(createCustomElement('li', {}, '目次が見つかりません'));
            return;
        }

        // 「すべて表示」ボタンが存在する場合、クリックして展開
        const moreButton = nav.querySelector('.o-tableOfContents__more button');
        if (moreButton) moreButton.click();

        // 目次が展開されるのを待つため、少し遅延を入れる
        setTimeout(() => {
            const links = nav.querySelectorAll('.o-tableOfContents__link span');
            if (!links.length) {
                menuList.appendChild(createCustomElement('li', {}, 'リンクが見つかりません'));
                return;
            }

            links.forEach(link => {
                const text = link.textContent.trim();
                const encodedId = encodeURIComponent(text);

                // 見出し要素（idがあるh2またはh3）を探す
                const heading = [...document.querySelectorAll('h2[id], h3[id]')].find(el =>
                                                                                      el.id === encodedId || encodeURIComponent(el.textContent.trim()) === encodedId
                                                                                     );

                const href = heading ? `#${heading.id}` : `#${encodedId}`;
                const indent = heading && heading.tagName === 'H3' ? '　' : '';  // 全角スペースでインデント

                const a = createCustomElement(
                    'a',
                    { href, class: 'toc-link', title: text },
                    indent + text
                );
                const li = createCustomElement('li');
                li.appendChild(a);
                menuList.appendChild(li);
            });
        }, 50); // 50ms待つ
    };

    //各種表示スタイル/アニメーションを設定
    const style = document.createElement('style');
    style.textContent = `
    .toc-link {
        display: inline-block;
        padding: 4px 10px;
        margin: 0 0 4px 0;
        background-color: #f5f5f5;
        color: #333;
        text-decoration: none;
        border: none;
        font-size: 12px;
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: background-color 0.3s ease, color 0.3s ease;
    }

    /* ホバー時のスタイル */
    .toc-link:hover {
        background-color: #e0e0e0;
        color: #0077cc;
        cursor: pointer;
    }

    /* クリック時のスタイル */
    .toc-link:active {
        background-color: #d1d1d1;
        color: #005fa3;
    }

    /* h2リンクにインデントを追加 */
    .toc-link[data-level="h2"] {
    margin-left: 20px;
    }

    /* 新規追加リンクのハイライトアニメーション */
    @keyframes pop-in {
        0% {
            transform: scale(1.15);
            opacity: 0;
            background-color: orange;
        }
        100% {
            transform: scale(1);
            opacity: 1;
            background-color: transparent;
        }
    }
    .pop-in {
        animation: pop-in 0.6s ease-out;
    }

    //リンク追加ボタンクリック時のアニメーション
    .addlink-button {
      transition: transform 0.1s ease, filter 0.1s ease;
    }

    .addlink-button:active {
      transform: scale(0.95);
      filter: brightness(1.1);
    }`;

    document.head.appendChild(style); // スタイルをページに追加


    // 目次リンクを作成する部分（リンクURLにエンコードを使用）
    const tocLinks = document.querySelectorAll('.o-tableOfContents__link');

    tocLinks.forEach(link => {
        const linkText = link.querySelector('span').innerText.trim();
        const encodedLink = encodeURIComponent(linkText);

        const newLink = createElement('a', {
            attributes: {
                href: `#${encodedLink}`,
                class: 'toc-link',
                title: linkText
            },
            textContent: linkText
        });

        // 既存のリンクを新しいリンクに差し替え
        link.replaceWith(newLink);
    });

    // 現在のページをリストに追加
const addCurrentPageToList = async (menuList) => {
    const url = location.href;
    const title = document.title;
    const thumbnail = await fetchThumbnail(url);
    const item = { url, title, thumbnail };

    const container = menuList.parentElement;

    const previousLastChild = menuList.lastElementChild;
    appendItem(menuList, item);
    saveToStorage(menuList);

    // 追加された最後の子を取得（appendItemの直後だと反映が遅れる可能性がある）
    requestAnimationFrame(() => {
        const newLastChild = menuList.lastElementChild;
        if (!newLastChild || newLastChild === previousLastChild) return;

        const ensureScrollAndAnimate = () => {
            container.scrollTo({ behavior: 'smooth', top: container.scrollHeight });

            const checkScrollComplete = () => {
                const atBottom = Math.abs(container.scrollTop + container.clientHeight - container.scrollHeight) < 1;
                if (atBottom) {
                    newLastChild.classList.add('pop-in');
                    setTimeout(() => newLastChild.classList.remove('pop-in'), 800);
                } else {
                    requestAnimationFrame(checkScrollComplete);
                }
            };

            checkScrollComplete();
        };

        // 対象に img 等が含まれている場合の読み込み待機
        const imgs = newLastChild.querySelectorAll('img');
        if (imgs.length > 0) {
            let loadedCount = 0;
            imgs.forEach(img => {
                if (img.complete) {
                    loadedCount++;
                } else {
                    img.onload = img.onerror = () => {
                        loadedCount++;
                        if (loadedCount === imgs.length) ensureScrollAndAnimate();
                    };
                }
            });

            // すでにすべて読み込み済みだった場合
            if (loadedCount === imgs.length) {
                ensureScrollAndAnimate();
            }
        } else {
            // 画像がなければ即実行
            ensureScrollAndAnimate();
        }
    });
};

    // タイトル取得
    const fetchTitle = async (url) => {
        try {
            const res = await fetch(url);
            const html = await res.text();
            const match = html.match(/<title>(.*?)<\/title>/i);
            return match ? match[1] : url;
        } catch {
            return url;
        }
    };

    // サムネイル取得
    const fetchThumbnail = async (url) => {
        try {
            const res = await fetch(url);
            const html = await res.text();
            const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
            return match ? match[1] : '';
        } catch {
            return '';
        }
    };


    const appendItem = (menuList, item) => {
        const li = createCustomElement('li', { draggable: true }, '', {
            marginBottom: '6px',
            cursor: 'move'
        });

        const contentBlock = createCustomElement('div', {}, '', {
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '4px',
            border: '1px solid transparent',
            transition: 'background-color 0.2s, border-color 0.2s'
        });

        const thumbnailLink = createCustomElement('a', {
            href: item.url,
            target: '_self'
        }, '', {
            display: 'block',
            position: 'relative',
            width: '100%',
            textDecoration: 'none'
        });

        const thumbnailWrapper = createCustomElement('div', {}, '', {
            position: 'relative',
            width: '100%'
        });

        if (item.thumbnail) {
            const img = createCustomElement('img', { src: item.thumbnail }, '', {
                width: '100%',
                display: 'block'
            });
            thumbnailWrapper.appendChild(img);
        }

        const overlay = createCustomElement('div', {}, '', {
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            padding: '4px 8px',
            background: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            transition: 'all 0.3s ease',
            fontSize: '12px',
            maxHeight: '40px'
        });

        const titleSpan = createCustomElement('span', {}, item.title, {
            display: 'block',
            color: '#fff'
        });

        overlay.appendChild(titleSpan);
        thumbnailWrapper.appendChild(overlay);
        thumbnailLink.appendChild(thumbnailWrapper);
        contentBlock.appendChild(thumbnailLink);
        li.appendChild(contentBlock);
        menuList.appendChild(li);

        // --- ホバーでタイトル展開 ---
        thumbnailWrapper.addEventListener('mouseenter', () => {
            Object.assign(overlay.style, {
                whiteSpace: 'normal',
                maxHeight: '100%',
                background: 'rgba(0, 0, 0, 0.8)'
            });
        });
        thumbnailWrapper.addEventListener('mouseleave', () => {
            Object.assign(overlay.style, {
                whiteSpace: 'nowrap',
                maxHeight: '40px',
                background: 'rgba(0, 0, 0, 0.6)'
            });
        });

        // --- スクロール位置保存 ---
        thumbnailLink.addEventListener('click', (e) => {
            if (contentBlock.querySelector('input')) {
                e.preventDefault();
                return;
            }
            localStorage.setItem('diehardTocScrollTop', menuList.parentElement.scrollTop);
            console.log("スクロール位置保存");
        });

        // --- コンテキストメニュー定義 ---
        contentBlock.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            document.querySelectorAll('.custom-context-menu').forEach(m => m.remove());

            const menu = createCustomElement('div', { class: 'custom-context-menu' }, '', {
                position: 'fixed',
                left: `${e.clientX}px`,
                top: `${e.clientY}px`,
                backgroundColor: '#333',
                color: '#fff',
                padding: '5px',
                borderRadius: '4px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                zIndex: '99999',
                minWidth: '120px'
            });

            const makeOption = (text, handler) => {
                const option = createCustomElement('div', {}, text, {
                    padding: '5px',
                    cursor: 'pointer'
                });
                option.addEventListener('mouseenter', () => option.style.backgroundColor = '#555');
                option.addEventListener('mouseleave', () => option.style.backgroundColor = '');
                option.addEventListener('click', () => {
                    handler();
                    menu.remove();
                });
                return option;
            };

            /////////////////////////////////////////

            // 名前を変更するメニューオプションを追加
            menu.appendChild(makeOption('名前を変更', () => {
                const textarea = document.createElement('textarea');
                textarea.value = item.title;

                const setStyles = (el, styles) => Object.assign(el.style, styles);

                // スタイル設定
                setStyles(textarea, {
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #4fa3ff',
                    borderRadius: '4px',
                    backgroundColor: '#222',
                    color: '#fff',
                    fontSize: '12px',
                    boxSizing: 'border-box',
                    resize: 'none',
                    lineHeight: '1.4',
                    minHeight: '2.5em',
                    zIndex: 9999,
                    pointerEvents: 'auto'
                });

                // titleSpan を一時的に隠す
                titleSpan.style.display = 'none';
                titleSpan.parentNode.insertBefore(textarea, titleSpan);
                textarea.focus();
                textarea.select();

                // 高さ調整
                const adjustHeight = () => {
                    textarea.style.height = 'auto';
                    textarea.style.height = `${textarea.scrollHeight}px`;
                };
                textarea.addEventListener('input', adjustHeight);
                adjustHeight();

                // <a>のクリックによる画面遷移を防ぐ
                const stopClick = e => {
                    e.preventDefault();
                    e.stopPropagation();
                };
                const links = textarea.closest('a');
                if (links) {
                    links.addEventListener('click', stopClick, true);
                }

                const finalizeRename = () => {
                    const newTitle = textarea.value.trim();
                    if (newTitle) {
                        item.title = newTitle;
                        titleSpan.textContent = newTitle;
                    }
                    textarea.remove();
                    titleSpan.style.display = '';
                    if (links) {
                        links.removeEventListener('click', stopClick, true);
                    }
                    saveToStorage(menuList);
                };

                textarea.addEventListener('blur', finalizeRename);
                textarea.addEventListener('keydown', e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        textarea.blur();
                    }
                });
                textarea.addEventListener('mousedown', e => e.stopPropagation());
            }));


            /////////////////////////////////////////

            menu.appendChild(makeOption('URLを変更', () => {
                const input = createCustomElement('input', { type: 'text', value: item.url }, '', {
                    padding: '5px',
                    border: '1px solid #4fa3ff',
                    borderRadius: '4px',
                    backgroundColor: '#222',
                    color: '#fff',
                    width: '100%'
                });
                overlay.replaceWith(input);
                input.focus();
                input.select();
                input.addEventListener('blur', () => {
                    const newUrl = input.value.trim();
                    if (newUrl) {
                        item.url = newUrl;
                        thumbnailLink.href = newUrl;
                    }
                    input.replaceWith(overlay);
                    saveToStorage(menuList);
                });
                input.addEventListener('keydown', e => {
                    if (e.key === 'Enter') input.blur();
                });
            }));

            menu.appendChild(makeOption('削除', () => {
                menuList.removeChild(li);
                saveToStorage(menuList);
            }));

            document.body.appendChild(menu);
            setTimeout(() => document.addEventListener('click', () => menu.remove(), { once: true }), 0);
        });

        // --- ドラッグ処理 ---
        li.addEventListener('dragstart', e => {
            if (contentBlock.querySelector('input')) {
                e.preventDefault();
                return;
            }
            dragSrcEl = li;
            contentBlock.style.borderColor = '#4fa3ff';
            contentBlock.style.backgroundColor = 'rgba(79, 163, 255, 0.2)';
        });

        li.addEventListener('dragend', () => {
            contentBlock.style.borderColor = 'transparent';
            contentBlock.style.backgroundColor = 'transparent';
        });

        li.addEventListener('dragover', e => {
            e.preventDefault();
            li.style.borderTop = '2px solid #4fa3ff';
        });

        li.addEventListener('dragleave', () => {
            li.style.borderTop = 'none';
        });

        li.addEventListener('drop', e => {
            e.preventDefault();
            li.style.borderTop = 'none';
            if (dragSrcEl && dragSrcEl !== li) {
                menuList.insertBefore(dragSrcEl, li);
                saveToStorage(menuList);
            }
        });

        return li;
    };

    const saveToStorage = (menuList) => {
        const items = [...menuList.querySelectorAll('li')].map(li => {
            const a = li.querySelector('a');
            const img = li.querySelector('img');
            return {
                url: a.href,
                title: a.textContent,
                thumbnail: img ? img.src : ''
            };
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    };

    const loadSavedToc = (menuList) => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        try {
            const items = JSON.parse(saved);
            items.forEach(item => appendItem(menuList, item));
        } catch {}
    };


    createMenu();
})();
