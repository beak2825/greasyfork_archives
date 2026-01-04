// ==UserScript==
// @name         YOUTUBE_VIDEO_HIDDEN
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  YouTubeの見たくない動画を非表示
// @author       Your Name
// @match        *://www.youtube.com/*
// @match        *://www.youtube.com/results?search_query=*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/494284/YOUTUBE_VIDEO_HIDDEN.user.js
// @updateURL https://update.greasyfork.org/scripts/494284/YOUTUBE_VIDEO_HIDDEN.meta.js
// ==/UserScript==
(function() {

    'use strict';

    // 検索動画
    const RECOMMEND_VIDEO_SELECTOR = 'ytd-video-renderer[is-search][use-search-ui][use-bigger-thumbs][inline-title-icon]';

    // おすすめ動画
    const SEARCH_VIDEO_SELECTOR = 'ytd-rich-grid-media.style-scope.ytd-rich-item-renderer';

    // チャンネル
    const CHANNEL_SELECTOR = '.ytd-channel-renderer';
    // 関連動画
    const RELATED_VIDEO = 'ytd-compact-video-renderer.style-scope.ytd-item-section-renderer';

    // ショート
    const SHORT_VIDEO_SELECTOR = 'ytd-reel-shelf-renderer';
    // 広告
    const AD_SELECTOR = 'ytd-ad-slot-renderer';
    // ミックスリスト
    const MIXLIST_SELECTOR = 'ytd-radio-renderer';
    // アイコン
    const CHANNEL_ICON_SELECTOR = 'ytd-channel-renderer';

    // スタイルシートを追加してサムネイルを非表示にする
    var style = document.createElement('style');

    // 現在URLによって処理を分岐
    function handlePageSpecificTasks() {
        const currentUrl = window.location.href;
        let nodes;

        if (currentUrl === 'https://www.youtube.com/') {
            // YouTubeのホームページの場合の処理
            nodes = document.querySelectorAll(SEARCH_VIDEO_SELECTOR);
        } else if (currentUrl.startsWith('https://www.youtube.com/results?search_query=')) {
            // YouTubeの検索結果ページの場合の処理
            nodes = document.querySelectorAll(RECOMMEND_VIDEO_SELECTOR);
        } else {
            nodes = null;
        }
        return nodes;
    }

    // 非表示にするチャンネル名の配列
    let hiddenChannels = [];

    // 初期化関数
    async function initialize() {
        hiddenCheckBox();
        addShowPopupButton();
        hiddenChannels = await gmGetValue('hiddenChannels', []);
        observeDOMChanges();
        handleExistingNodes();
    }

    // DOMの変更を監視する
    function observeDOMChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node instanceof HTMLElement){
                            handleNewNode(node);
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ページ読み込み時に既存の要素を処理する
    function handleExistingNodes() {
        handleThumbnails(handlePageSpecificTasks());
    }

    // 新しい要素が追加されたときに処理する
    function handleNewNode(node) {
        if (node.matches(RECOMMEND_VIDEO_SELECTOR+ ', ' +SEARCH_VIDEO_SELECTOR)) {
            handleThumbnails([node]);
        }
    }

    // 指定されたビデオのサムネイルを処理する
    function handleThumbnails(thumbnails) {
        thumbnails.forEach(thumbnail => {
            const channelElement = thumbnail.querySelector('#text a');
            if (channelElement) {
                const channelName = channelElement.textContent.trim();
                const isHidden = hiddenChannels.includes(channelName);
                toggleThumbnail(thumbnail, isHidden);
                if (!isHidden) {
                    addButtonToThumbnail(thumbnail, channelName);
                }
            }
        });
    }

    // サムネイルの表示を切り替える
    function toggleThumbnail(thumbnail, hide) {
        thumbnail.style.display = hide ? 'none' : '';
    }

    // サムネイルに非表示ボタンを追加する
    function addButtonToThumbnail(thumbnail, channelName) {
        if (!thumbnail.querySelector('.custom-button')) {
            const button = document.createElement('button');
            button.textContent = '非表示: ' + channelName;
            button.style.marginTop = '5px';
            button.addEventListener('click', async () => {
                await addChannelToHiddenList(channelName);
                handleThumbnails(handlePageSpecificTasks());
                updatePopupContent();
            });
            button.classList.add('custom-button');
            thumbnail.appendChild(button);
        }
    }

    // 非表示にするチャンネル名をリストに追加する
    async function addChannelToHiddenList(channelName) {
        hiddenChannels.push(channelName);
        await gmSetValue('hiddenChannels', hiddenChannels);
    }

    // 非表示チャンネルリスト表示用のボタンを追加する
    function addShowPopupButton() {
        const button = document.createElement('button');
        button.textContent = '設定';
        button.addEventListener('click', () => {

            const existingPopup = document.querySelector('#ng-channel-popup');
            if (existingPopup) {
                existingPopup.remove();
            }else{
                createPopup();
            }
        });
        const searchForm = document.querySelector('ytd-masthead');
        if (searchForm) {
            const searchButton = searchForm.querySelector('button#search-icon-legacy');
            if (searchButton) {
                searchButton.insertAdjacentElement('afterend', button);
            }
        }
    }

    // 非表示チャンネルリスト用のポップアップを作成する
    function createPopup() {
        const existingPopup = document.querySelector('#ng-channel-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        const popupContainer = document.createElement('div');
        popupContainer.id = 'ng-channel-popup';
        popupContainer.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #ffffff;
                padding: 20px;
                border: 1px solid #cccccc;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                z-index: 9999;
                font-weight: bold;
                font-size: 24px;
                overflow: auto;
                max-height: 400px;
            `;

        const sectionMenuButton = document.createElement('div');
        sectionMenuButton.style.marginBottom = '20px';

        const sectionHiddenCheckBox = document.createElement('div');
        sectionHiddenCheckBox.style.marginBottom = '20px';

        const sectionHiddenChannelList = document.createElement('div');
        sectionHiddenChannelList.style.marginBottom = '20px';


        const closeButton = document.createElement('button');
        closeButton.textContent = '閉じる';
        closeButton.style.fontWeight = 'bold';
        closeButton.addEventListener('click', () => {
            popupContainer.remove();
        });

        const importButton = document.createElement('button');
        importButton.textContent = 'インポート';
        importButton.style.fontWeight = 'bold';
        importButton.addEventListener('click', function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json'; // JSONファイルのみ受け入れる

            // ファイルが選択されたときの処理
            fileInput.addEventListener('change', function(event) {
                const file = event.target.files[0]; // 選択されたファイルを取得

                if (!file) {
                    console.error('ファイルが選択されていません。');
                    return;
                }

                const reader = new FileReader(); // ファイルを読み込むためのFileReaderオブジェクトを作成

                // ファイル読み込み完了時の処理
                reader.onload = async function(e) {
                    const content = e.target.result; // 読み込んだファイルの内容を取得
                    try {
                        const jsonData = JSON.parse(content); // JSONを解析

                        await gmDeleteValue('hiddenChannels');
                        await gmSetValue('hiddenChannels', jsonData);
                        hiddenChannels = await gmGetValue('hiddenChannels', []);
                        handleThumbnails(handlePageSpecificTasks());
                        updatePopupContent();
                    } catch (error) {
                        console.error('JSONファイルの読み込みに失敗しました:', error);
                    }
                };

                reader.readAsText(file); // ファイルをテキストとして読み込む
            });

            // ファイル選択ダイアログを開く
            fileInput.click();
        });

        const exportButton = document.createElement('button');
        exportButton.textContent = 'エクスポート';
        exportButton.style.fontWeight = 'bold';
        exportButton.addEventListener('click', async () => {

            // 保存されたデータを取得
            const savedData = await gmGetValue('hiddenChannels', []); // 'hiddenChannels' は保存時に使ったキーです

            // JSON文字列に変換
            const jsonDataString = JSON.stringify(savedData);

            // Blobオブジェクトを作成
            const blob = new Blob([jsonDataString], { type: 'application/json' });

            // ダウンロード用リンクを作成
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'exported_data.json'; // ダウンロードするファイル名を指定

            // リンクをクリックしてダウンロードをトリガー
            document.body.appendChild(a);
            a.click();

            // リンク要素を削除
            document.body.removeChild(a);

            // URLオブジェクトを解放
            URL.revokeObjectURL(url);

        });

        sectionMenuButton.appendChild(closeButton);
        sectionMenuButton.appendChild(importButton);
        sectionMenuButton.appendChild(exportButton);
        popupContainer.appendChild(sectionMenuButton);

        const hiddenLabel = document.createElement('h2');
        hiddenLabel.textContent = '非表示チェックボックス一覧';
        hiddenLabel.style.fontSize = '14px';
        hiddenLabel.style.verticalAlign = 'bottom';
        popupContainer.appendChild(hiddenLabel);

        const shortCheckBox = document.createElement('input');
        shortCheckBox.type = 'checkbox';
        shortCheckBox.id = 'shortCheckBoxID';
        shortCheckBox.style.fontWeight = 'bold';
        shortCheckBox.style.marginLeft = '4px';
        shortCheckBox.checked = gmGetValue('shortVideoHidden', false);
        shortCheckBox.addEventListener('change',async (event) => {
            if (event.target.checked) {
                await gmSetValue('shortVideoHidden', true);
            }else{
                await gmSetValue('shortVideoHidden', false);
            }
            hiddenCheckBox();
        });

        // チェックボックスのラベルを作成する
        const shortLabel = document.createElement('label');
        shortLabel.textContent = 'ショート';
        shortLabel.style.fontWeight = 'bold';
        shortLabel.style.marginLeft = '4px';
        shortLabel.style.fontSize = '10px';
        shortLabel.htmlFor = 'shortCheckBoxID';

        const mixListCheckBox = document.createElement('input');
        mixListCheckBox.type = 'checkbox';
        mixListCheckBox.id = 'mixListCheckBoxID';
        mixListCheckBox.style.fontWeight = 'bold';
        mixListCheckBox.style.marginLeft = '4px';
        mixListCheckBox.checked = gmGetValue('mixListHidden', false);
        mixListCheckBox.addEventListener('change', async (event) => {
            if (event.target.checked) {
                await gmSetValue('mixListHidden', true );
            }else{
                await gmSetValue('mixListHidden', false);
            }
            hiddenCheckBox();
        });

        // チェックボックスのラベルを作成する
        const mixListLabel = document.createElement('label');
        mixListLabel.textContent = 'ミックスリスト';
        mixListLabel.style.fontWeight = 'bold';
        mixListLabel.style.marginLeft = '4px';
        mixListLabel.style.fontSize = '10px';
        mixListLabel.htmlFor = 'mixListCheckBoxID';

        const channelIconCheckBox = document.createElement('input');
        channelIconCheckBox.type = 'checkbox';
        channelIconCheckBox.id = 'channelIconCheckBoxID';
        channelIconCheckBox.style.fontWeight = 'bold';
        channelIconCheckBox.style.marginLeft = '4px';
        channelIconCheckBox.checked = gmGetValue('channelIconHidden', false);
        channelIconCheckBox.addEventListener('change', async (event) => {
            if (event.target.checked) {
                await gmSetValue('channelIconHidden', true );
            }else{
                await gmSetValue('channelIconHidden', false);
            }
            hiddenCheckBox();
        });

        // チェックボックスのラベルを作成する
        const channelIconLabel = document.createElement('label');
        channelIconLabel.textContent = 'チャンネルアイコン';
        channelIconLabel.style.fontWeight = 'bold';
        channelIconLabel.style.marginLeft = '4px';
        channelIconLabel.style.fontSize = '10px';
        channelIconLabel.htmlFor = 'channelIconCheckBoxID';

        const adCheckBox = document.createElement('input');
        adCheckBox.type = 'checkbox';
        adCheckBox.id = 'adCheckBoxID';
        adCheckBox.style.fontWeight = 'bold';
        adCheckBox.style.marginLeft = '4px';
        adCheckBox.checked = gmGetValue('adHidden', false);
        adCheckBox.addEventListener('change', async (event) => {
            if (event.target.checked) {
                await gmSetValue('adHidden', true);
            }else{
                await gmSetValue('adHidden', false);
            }
            hiddenCheckBox();
        });

        // チェックボックスのラベルを作成する
        const adLabel = document.createElement('label');
        adLabel.textContent = '広告';
        adLabel.style.fontWeight = 'bold';
        adLabel.style.marginLeft = '4px';
        adLabel.style.fontSize = '10px';
        adLabel.htmlFor = 'adCheckBoxID';

        sectionHiddenCheckBox.appendChild(shortCheckBox);
        sectionHiddenCheckBox.appendChild(shortLabel);
        sectionHiddenCheckBox.appendChild(mixListCheckBox);
        sectionHiddenCheckBox.appendChild(mixListLabel);
        sectionHiddenCheckBox.appendChild(channelIconCheckBox);
        sectionHiddenCheckBox.appendChild(channelIconLabel);
        sectionHiddenCheckBox.appendChild(adCheckBox);
        sectionHiddenCheckBox.appendChild(adLabel);
        popupContainer.appendChild(sectionHiddenCheckBox);

        const heading = document.createElement('h2');
        heading.textContent = '非表示チャンネル一覧';
        heading.style.fontSize = '14px';
        heading.style.verticalAlign = 'bottom';
        popupContainer.appendChild(heading);

        const ngChannelList = document.createElement('ul');
        ngChannelList.style.listStyleType = 'none';
        ngChannelList.style.padding = '0';
        //ngChannelList.innerHTML = '';
        ngChannelList.textContent = '';

        hiddenChannels.forEach(channelName => {
            const listItem = createNgChannelList(channelName);
            ngChannelList.appendChild(listItem);
        });

        sectionHiddenChannelList.appendChild(ngChannelList);
        popupContainer.appendChild(sectionHiddenChannelList);

        document.body.appendChild(popupContainer);
    }



    // 非表示チャンネルリストのアイテムを作成する
    function hiddenCheckBox() {

        var shortVideoDisplay = gmGetValue('shortVideoHidden', false) ? 'none': '';
        var mixListDisplay = gmGetValue('mixListHidden', false) ? 'none': '';
        var channelIconDisplay = gmGetValue('channelIconHidden', false) ? 'none': '';
        var adDisplay = gmGetValue('adHidden', false) ? 'none': '';

        style.textContent = `
    ${SHORT_VIDEO_SELECTOR} { display: ${shortVideoDisplay} ; }
    ${MIXLIST_SELECTOR} { display: ${mixListDisplay} ; }
    ${CHANNEL_ICON_SELECTOR} { display: ${channelIconDisplay} ; }
    ${AD_SELECTOR} { display: ${adDisplay} ; }
    `;
        // ヘッド要素にスタイル要素を追加
        document.head.appendChild(style);

    }


    // 非表示チャンネルリストのアイテムを作成する
    function createNgChannelList(channelName) {
        const listItem = document.createElement('li');
        listItem.style.display = 'flex';

        const unhideButton = createUnhideButton(channelName);
        listItem.appendChild(unhideButton);

        // const textElement = document.createElement('span');
        const textElement = document.createElement('span');
        textElement.textContent = channelName;
        textElement.style.display = 'flex';
        textElement.style.marginLeft = '4px';
        textElement.style.fontWeight = 'bold';
        textElement.style.fontSize = '16px';
        textElement.style.alignItems = 'center';
        listItem.appendChild(textElement);

        return listItem;
    }

    // 非表示解除ボタンを作成する
    function createUnhideButton(channelName) {
        const button = document.createElement('button');
        button.textContent = '解除 ';
        button.style.marginRight = '10px';
        button.style.alignItems = 'center';
        button.addEventListener('click', async () => {
            hiddenChannels = hiddenChannels.filter(name => name !== channelName);
            await gmSetValue('hiddenChannels', hiddenChannels);
            handleThumbnails(handlePageSpecificTasks());
            updatePopupContent();
        });
        return button;
    }

    // 非表示チャンネルリストの内容を更新する
    function updatePopupContent() {
        const popupContainer = document.querySelector('#ng-channel-popup');
        if (popupContainer) {
            const ngChannelList = popupContainer.querySelector('ul');
            if (ngChannelList) {
                //ngChannelList.innerHTML = '';
                ngChannelList.textContent = '';
                hiddenChannels.forEach(channelName => {
                    const listItem = createNgChannelList(channelName);
                    ngChannelList.appendChild(listItem);
                });
            }
        }
    }

    // GM_getValueのラッパー関数（環境に応じて処理を切り替える）
    function gmGetValue(key, value) {
        if (typeof GM_getValue !== 'undefined') {
            return GM_getValue(key, value);
        } else {
            return GM.getValue(key, value);
        }
    }

    // GM_setValueのラッパー関数（環境に応じて処理を切り替える）
    function gmSetValue(key, value) {
        if (typeof GM_setValue !== 'undefined') {
            return GM_setValue(key, value);
        } else {
            return GM.setValue(key, value);
        }
    }

    // GM_setValueのラッパー関数（環境に応じて処理を切り替える）
    function gmDeleteValue(key) {
        if (typeof GM_deleteValue !== 'undefined') {
            return GM_deleteValue(key);
        } else {
            return GM.deleteValue(key);
        }
    }

    // 初期化関数を呼び出す
    initialize();

})();
