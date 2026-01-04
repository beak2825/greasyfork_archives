// ==UserScript==
// @name         ハーメルン - タグフィルター
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  ハーメルンのランキングページでタグによるフィルタリングを可能にします
// @author       Damseleng
// @match        https://syosetu.org/?mode=rank*
// @match        https://syosetu.org/?mode=search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531876/%E3%83%8F%E3%83%BC%E3%83%A1%E3%83%AB%E3%83%B3%20-%20%E3%82%BF%E3%82%B0%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/531876/%E3%83%8F%E3%83%BC%E3%83%A1%E3%83%AB%E3%83%B3%20-%20%E3%82%BF%E3%82%B0%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%83%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectedTags = new Set();
    let isAndMode = true;
    let hideViewedNovels = false;
    const viewedNovels = new Set();
    let observer;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isSearchPage = window.location.href.includes('mode=search');
    const isSP = document.querySelector('link[href*="sp_v3.css"]') !== null;
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // カラーパレット
    const colors = {
        light: {
            bg: 'white',
            text: '#333',
            border: '#ccc',
            shadow: 'rgba(0,0,0,0.2)',
            buttonBg: '#f8f8f8',
            buttonText: '#333',
            tagBg: '#f8f8f8',
            tagText: '#333',
            secondaryText: '#666',
            headerBorder: '#eee',
            alertText: '#ff0000',
        },
        dark: {
            bg: '#2c2c2c',
            text: '#f1f1f1',
            border: '#555',
            shadow: 'rgba(0,0,0,0.5)',
            buttonBg: '#444',
            buttonText: '#f1f1f1',
            tagBg: '#3a3a3a',
            tagText: '#f1f1f1',
            secondaryText: '#aaa',
            headerBorder: '#444',
            alertText: '#ff4d4d',
        }
    };
    const C = isDarkMode ? colors.dark : colors.light;

    // タグの色情報を保持するMap
    const tagColorMap = new Map();

    // 小説IDを取得する関数
    function getNovelId(novelElement) {
        // 小説コンテナ内の /novel/ を含む最初のリンクを探す
        const link = novelElement.querySelector('a[href*="/novel/"]');
        if (link) {
            const match = link.href.match(/\/novel\/(\d+)/);
            if (match) {
                return match[1];
            }
        }
        // デバッグ用：IDが見つからなかった要素をログに出力
        console.log('Could not find a valid novel ID for element:', novelElement);
        return null;
    }

    // タグを含む要素を取得するセレクタ
    function getTagElements() {
        if (isSP) {
            return Array.from(document.querySelectorAll('.search_box p')).filter(p =>
                p.textContent.trim().startsWith('タグ：')
            );
        } else {
            return document.querySelectorAll('.section3 .all_keyword');
        }
    }

    // タグを正規化する関数
    function normalizeTag(tag) {
        return tag.trim()
            .replace(/[\s　]+/g, '') // 全ての空白文字（全角含む）を除去
            .replace(/\[\+\]/g, '') // [+]ボタンのテキストを除去
            .normalize('NFKC'); // 互換文字を正規化
    }

    // タグのテキストを抽出する関数
    function extractTagText(element) {
        // タグを含む要素から[+]ボタンを除いたテキストを取得
        const tagNodes = Array.from(element.childNodes).filter(node => 
            node.nodeType === Node.TEXT_NODE || // テキストノード
            (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('tag-plus-button')) // [+]ボタン以外の要素
        );
        return tagNodes.map(node => node.textContent).join('');
    }

    // タグを抽出する関数
    function extractTags(element, isNovel = false) {
        const tags = new Set();
        
        if (isSP) {
            // タグを含む段落のテキストを取得
            const alertSpan = element.querySelector('.alert_color');
            if (alertSpan) {
                // alert_colorタグを処理
                const alertText = extractTagText(alertSpan);
                alertText.split(/[\s　]+/).forEach(tag => {
                    const cleanTag = normalizeTag(tag);
                    if (cleanTag) {
                        tags.add(cleanTag);
                        if (!isNovel) tagColorMap.set(cleanTag, C.alertText);
                    }
                });
            }

            // 通常のタグを処理（alert_color以外）
            const fullText = extractTagText(element).replace(/^タグ[：:]/u, '');
            const normalText = alertSpan ? 
                fullText.replace(extractTagText(alertSpan), '') : fullText;
            
            normalText.split(/[\s　]+/).forEach(tag => {
                const cleanTag = normalizeTag(tag);
                if (cleanTag) tags.add(cleanTag);
            });
        } else {
            // PC版の処理
            element.querySelectorAll('a').forEach(a => {
                const cleanTag = normalizeTag(a.textContent);
                if (cleanTag) {
                    tags.add(cleanTag);
                    if (!isNovel && a.classList.contains('alert_color')) {
                        tagColorMap.set(cleanTag, C.alertText);
                    }
                }
            });
        }

        return Array.from(tags);
    }

    // タグの横に[+]ボタンを追加する関数
    function addPlusButtons() {
        getTagElements().forEach(container => {
            const tags = extractTags(container);
            
            // コンテナの内容をクリア
            if (isSP) {
                container.textContent = 'タグ：';
            } else {
                container.innerHTML = '';
            }

            // alert_colorタグと通常タグを分離
            const alertTags = tags.filter(tag => tagColorMap.has(tag));
            const normalTags = tags.filter(tag => !tagColorMap.has(tag));

            if (isSP) {
                // スマホ版の処理
                if (alertTags.length > 0) {
                    const alertSpan = document.createElement('span');
                    alertSpan.className = 'alert_color';
                    alertTags.forEach((tag, i) => {
                        if (i > 0) alertSpan.appendChild(document.createTextNode(' '));
                        
                        const tagSpan = document.createElement('span');
                        tagSpan.textContent = tag;
                        tagSpan.style.color = C.alertText;
                        alertSpan.appendChild(tagSpan);

                        const plusButton = createPlusButton(tag);
                        alertSpan.appendChild(plusButton);
                    });
                    container.appendChild(alertSpan);
                    if (normalTags.length > 0) {
                        container.appendChild(document.createTextNode(' '));
                    }
                }
            } else {
                // PC版の処理
                alertTags.forEach((tag, i) => {
                    if (i > 0) container.appendChild(document.createTextNode(' '));
                    
                    const tagLink = document.createElement('a');
                    tagLink.href = '#';
                    tagLink.className = 'alert_color';
                    tagLink.textContent = tag;
                    container.appendChild(tagLink);

                    const plusButton = createPlusButton(tag);
                    container.appendChild(plusButton);
                });

                if (alertTags.length > 0 && normalTags.length > 0) {
                    container.appendChild(document.createTextNode(' '));
                }
            }

            // 通常タグを追加
            normalTags.forEach((tag, i) => {
                if (i > 0 || (alertTags.length > 0 && !isSP)) {
                    container.appendChild(document.createTextNode(' '));
                }

                if (!isSP) {
                    const tagLink = document.createElement('a');
                    tagLink.href = '#';
                    tagLink.textContent = tag;
                    container.appendChild(tagLink);
                } else {
                    const tagSpan = document.createElement('span');
                    tagSpan.textContent = tag;
                    container.appendChild(tagSpan);
                }

                const plusButton = createPlusButton(tag);
                container.appendChild(plusButton);
            });
        });
    }

    // [+]ボタンを作成する関数
    function createPlusButton(tag) {
        const plusButton = document.createElement('span');
        plusButton.textContent = '[+]';
        plusButton.className = 'tag-plus-button';
        plusButton.style.cssText = `
            cursor: pointer;
            color: ${C.secondaryText};
            margin: 0 4px;
            user-select: none;
            ${isMobile ? 'padding: 5px 8px;' : ''}
        `;
        plusButton.title = 'このタグでフィルター';

        plusButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!selectedTags.has(tag)) {
                selectedTags.add(tag);
                updateSelectedTagsDisplay();
                filterNovels();
            }
        });

        return plusButton;
    }

    // タグセレクターを作成する関数
    function createTagSelector() {
        const container = document.createElement('div');
        container.id = 'tag-filter-container';
        container.style.cssText = `
            position: fixed;
            background: ${C.bg};
            color: ${C.text};
            padding: ${isMobile ? '10px' : '15px'};
            border: 1px solid ${C.border};
            border-radius: 5px;
            box-shadow: 0 2px 5px ${C.shadow};
            z-index: 9999;
            font-size: ${isMobile ? '14px' : '14px'};
            ${isMobile ? `
                bottom: 10px;
                left: 10px;
                right: 10px;
                max-height: 30vh;
                max-width: calc(100vw - 20px);
            ` : `
                top: 10px;
                right: 10px;
                min-width: 220px;
            `}
        `;

        // フィルターヘッダー
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            ${isMobile ? `padding-bottom: 10px; border-bottom: 1px solid ${C.headerBorder};` : ''}
        `;

        const title = document.createElement('h3');
        title.textContent = 'フィルター中のタグ';
        title.style.cssText = `
            margin: 0;
            font-size: ${isMobile ? '16px' : '16px'};
        `;
        header.appendChild(title);

        // モード切り替えボタン
        const modeButton = document.createElement('button');
        modeButton.id = 'mode-toggle-button';
        updateModeButtonText(modeButton);
        modeButton.style.cssText = `
            padding: ${isMobile ? '6px 10px' : '3px 8px'};
            border: 1px solid ${C.border};
            border-radius: 3px;
            background: ${C.buttonBg};
            color: ${C.buttonText};
            cursor: pointer;
            font-size: ${isMobile ? '14px' : '14px'};
        `;
        modeButton.addEventListener('click', () => {
            isAndMode = !isAndMode;
            updateModeButtonText(modeButton);
            filterNovels();
        });
        header.appendChild(modeButton);
        container.appendChild(header);

        // タグリスト
        const tagList = document.createElement('div');
        tagList.id = 'selected-tags-list';
        tagList.style.cssText = `
            overflow-y: auto;
            padding-right: 5px;
            ${isMobile ? 'max-height: calc(30vh - 120px);' : 'max-height: 60vh;'}
        `;
        container.appendChild(tagList);

        // オプション設定
        const optionsContainer = document.createElement('div');
        optionsContainer.style.cssText = `
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid ${C.headerBorder};
        `;

        // 既読非表示チェックボックス
        const hideViewedContainer = document.createElement('div');
        hideViewedContainer.style.cssText = 'margin-bottom: 10px;';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'hide-viewed-checkbox';
        checkbox.checked = hideViewedNovels;
        checkbox.style.marginRight = '8px';
        checkbox.addEventListener('change', (e) => {
            hideViewedNovels = e.target.checked;
            localStorage.setItem('hideViewedNovels', hideViewedNovels);
            filterNovels();
        });

        const label = document.createElement('label');
        label.htmlFor = 'hide-viewed-checkbox';
        label.textContent = '既読した小説を隠す';
        label.style.cursor = 'pointer';

        hideViewedContainer.appendChild(checkbox);
        hideViewedContainer.appendChild(label);
        optionsContainer.appendChild(hideViewedContainer);

        // すべてクリアボタン
        const clearButton = document.createElement('button');
        clearButton.textContent = 'すべてのタグをクリア';
        clearButton.style.cssText = `
            padding: ${isMobile ? '8px' : '5px 10px'};
            border: 1px solid ${C.border};
            border-radius: 3px;
            background: ${C.buttonBg};
            color: ${C.buttonText};
            cursor: pointer;
            width: 100%;
            font-size: ${isMobile ? '14px' : '14px'};
            margin-bottom: 5px;
        `;
        clearButton.addEventListener('click', () => {
            selectedTags.clear();
            updateSelectedTagsDisplay();
            filterNovels();
        });
        optionsContainer.appendChild(clearButton);

        // 既読履歴リセットボタン
        const resetViewedButton = document.createElement('button');
        resetViewedButton.textContent = '既読履歴をリセット';
        resetViewedButton.style.cssText = clearButton.style.cssText;
        resetViewedButton.addEventListener('click', () => {
            if (confirm('本当に既読履歴をリセットしますか？')) {
                viewedNovels.clear();
                localStorage.removeItem('viewedNovelIds');
                filterNovels();
            }
        });
        optionsContainer.appendChild(resetViewedButton);

        container.appendChild(optionsContainer);

        return container;
    }

    // モードボタンのテキストを更新
    function updateModeButtonText(button) {
        button.textContent = isAndMode ? 'AND' : 'OR';
        button.title = isAndMode ? 
            'すべてのタグを含む小説を表示（タップでORモードに切替）' : 
            'いずれかのタグを含む小説を表示（タップでANDモードに切替）';
    }

    // 選択タグの表示を更新
    function updateSelectedTagsDisplay() {
        const tagList = document.getElementById('selected-tags-list');
        if (!tagList) return;

        tagList.innerHTML = '';

        if (selectedTags.size === 0) {
            const message = document.createElement('div');
            message.style.cssText = `
                color: ${C.secondaryText};
                padding: ${isMobile ? '8px 0' : '5px 0'};
            `;
            message.textContent = 'タグが選択されていません';
            tagList.appendChild(message);
            return;
        }

        Array.from(selectedTags).sort().forEach(tag => {
            const tagDiv = document.createElement('div');
            tagDiv.style.cssText = `
                margin: 4px 0;
                padding: ${isMobile ? '8px' : '5px'};
                background: ${C.tagBg};
                border-radius: 3px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;

            const tagText = document.createElement('span');
            tagText.textContent = tag;
            if (tagColorMap.has(tag)) {
                tagText.style.color = tagColorMap.get(tag);
            }
            tagText.style.marginRight = '10px';

            const removeButton = document.createElement('span');
            removeButton.textContent = '×';
            removeButton.style.cssText = `
                cursor: pointer;
                color: ${C.secondaryText};
                padding: ${isMobile ? '5px 10px' : '0 5px'};
                font-size: ${isMobile ? '18px' : '14px'};
            `;
            removeButton.addEventListener('click', () => {
                selectedTags.delete(tag);
                updateSelectedTagsDisplay();
                filterNovels();
            });

            tagDiv.appendChild(tagText);
            tagDiv.appendChild(removeButton);
            tagList.appendChild(tagDiv);
        });
    }

    function filterNovels() {
        console.log(`Filtering novels. Hide viewed: ${hideViewedNovels}. Total viewed: ${viewedNovels.size}`);
        const selector = isSP ? '.search_box' : '.section3';
        document.querySelectorAll(selector).forEach(novel => {
            let shouldShow = true;
            const novelId = getNovelId(novel);

            // 既読フィルター
            if (hideViewedNovels && novelId && viewedNovels.has(novelId)) {
                console.log(`Hiding viewed novel: ${novelId}`);
                shouldShow = false;
            }

            // タグフィルター
            if (shouldShow && selectedTags.size > 0) {
                const tagContainer = isSP ?
                    Array.from(novel.querySelectorAll('p')).find(p =>
                        p.textContent.trim().startsWith('タグ：')
                    ) :
                    novel.querySelector('.all_keyword');

                if (!tagContainer) {
                    shouldShow = false;
                } else {
                    const novelTags = extractTags(tagContainer, true).map(tag => normalizeTag(tag));
                    const normalizedSelectedTags = Array.from(selectedTags).map(tag => normalizeTag(tag));

                    if (isAndMode) {
                        shouldShow = normalizedSelectedTags.every(selectedTag =>
                            novelTags.some(novelTag => novelTag === selectedTag)
                        );
                    } else {
                        shouldShow = normalizedSelectedTags.some(selectedTag =>
                            novelTags.some(novelTag => novelTag === selectedTag)
                        );
                    }
                }
            }

            novel.style.display = shouldShow ? '' : 'none';
        });
    }

    // 既読小説を監視するObserverを初期化
    function setupIntersectionObserver() {
        const selector = isSP ? '.search_box' : '.section3';
        const novels = document.querySelectorAll(selector);

        // スマホでフィルターパネルに隠れる問題を考慮して、より厳しい条件にする
        const options = {
            threshold: isMobile ? 0.7 : 0.3, // スマホでは70%、PCでは30%が見える必要がある
            rootMargin: isMobile ? '0px 0px -200px 0px' : '0px' // スマホでは下部200px分を除外
        };

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // isIntersectingに関わらず、Observerの動作をすべてログに出力する
                console.log('IntersectionObserver entry:', entry);
                if (entry.isIntersecting) {
                    const novelId = getNovelId(entry.target);
                    if (novelId && !viewedNovels.has(novelId)) {
                        console.log(`Marking novel as viewed: ${novelId}`);
                        viewedNovels.add(novelId);
                        localStorage.setItem('viewedNovelIds', JSON.stringify(Array.from(viewedNovels)));
                    }
                }
            });
        }, options);

        novels.forEach(novel => observer.observe(novel));
    }

    // データをロードする
    function loadData() {
        const storedIds = localStorage.getItem('viewedNovelIds');
        if (storedIds) {
            JSON.parse(storedIds).forEach(id => viewedNovels.add(id));
        }
        hideViewedNovels = localStorage.getItem('hideViewedNovels') === 'true';
    }

    // メイン処理
    function init() {
        console.log(`Script start. isSP: ${isSP}, isMobile: ${isMobile}`);
        loadData();

        const waitForContent = () => {
            const contentSelector = isSP ? '.search_box' : '.section3';
            if (!document.querySelector(contentSelector)) {
                setTimeout(waitForContent, 500);
                return;
            }

            // スマホ表示の場合、フィルターパネルにコンテンツが隠れないように下部にダミーのスペーサー要素を追加
            if (isSP && !document.getElementById('userscript-bottom-spacer')) {
                const spacer = document.createElement('div');
                spacer.id = 'userscript-bottom-spacer';
                // フィルターパネルの高さを考慮してスペーサーを大きくする
                spacer.style.height = '50vh';
                spacer.style.minHeight = '300px'; // 最小高さを保証
                // 考えられるメインコンテナにスペーサーを追加する
                const mainContainer = document.getElementById('main') || document.getElementById('container') || document.body;
                mainContainer.appendChild(spacer);
                console.log('Spacer added to:', mainContainer.tagName, mainContainer.id ? `#${mainContainer.id}`: '');
            }

            const tagSelector = createTagSelector();
            document.body.appendChild(tagSelector);
            addPlusButtons();
            updateSelectedTagsDisplay();
            setupIntersectionObserver();
            filterNovels(); // 初期フィルタリング
        };

        waitForContent();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();