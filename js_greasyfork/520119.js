// ==UserScript==
// @name         [NikoAd] simplizer
// @namespace    http://tampermonkey.net/
// @version      2025-10-22-0
// @description  ニコニ広告設定窓の表示物制御
// @author       anonymous
// @match        https://nicoad.nicovideo.jp/video/publish/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520119/%5BNikoAd%5D%20simplizer.user.js
// @updateURL https://update.greasyfork.org/scripts/520119/%5BNikoAd%5D%20simplizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const collapse_settings = [
        { id: 'header-bar', query: '.header-bar' },
        { id: 'conductor', query: '.conductor' },
        { id: 'secondary-content-info', query: '.secondary-content-info' },
        { id: 'entry-basic-info', query: '#entry-basic-info' },
        { id: 'entry-thanks', query: '#entry-thanks' },
        { id: 'frame-grade-visualizer', query: '.frame-grade-visualizer' },
        { id: 'nicoad-impact', query: '#nicoad-impact' },
        { id: 'campaign-info', query: '#campaign-info' },
        { id: 'next', query: '.next' },
        { id: 'heading', query: '.heading' },
        { id: 'creator-support', query: '.sprtsprt-entry-action-button' },
    ];

    const shrink_settings = { id:"shrink", query: '.wrapper' };
    const replace_publish_button_settings = { id: "replace_publish_button", query: '.publish-button' };
    const replace_back_button_settings = { id: "replace_back_button", query: '.back-button[role="button"]' }


    // ------------------------------------------------------------------------------------------------------
    // https://qiita.com/teloppy_com/items/cd483807813af5a4a38a
    const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

    // ------------------------------------------------------------------------------------------------------

    function saveValueToStorage(id, value) {
        //console.debug(`save ${id} : ${value}` );
        localStorage.setItem(id, value);
    }

    function loadValueFromStorage(id, def_value) {
        const value = localStorage.getItem(id);

        if((value === undefined) || (value === null)){
            return def_value.toString();
        }

        //console.debug(`load ${id} : ${value}` );
        return value;
    }

    function stringToBool(str) {
        return str.toLowerCase() === 'true'; }

    // ------------------------------------------------------------------------------------------------------
    // ドロップダウンメニューをページの最下段に追加する関数を定義
    function addDropdownMenuToBottom() {
        // メニューのコンテナを作成
        const menuContainer = document.createElement('div');
        menuContainer.className = 'bottom-menu-container';

        // スタイルプロパティに直値を代入
        menuContainer.style.position = 'fixed';
        menuContainer.style.bottom = '4px';
        menuContainer.style.left = '4px';
        menuContainer.style.backgroundColor = 'white';
        menuContainer.style.border = '1px solid #ccc';
        menuContainer.style.padding = '4px';
        menuContainer.style.zIndex = '1000';

        // メニューの内容を作成
        const menuContent = document.createElement('div');
        menuContent.id = 'menuContent';
        menuContent.style.display = 'none'; // 初期状態は非表示
        menuContent.style.position = 'absolute';
        menuContent.style.bottom = '24px';
        menuContent.style.left = '4px';
        menuContent.style.backgroundColor = '#f9f9f9';
        menuContent.style.boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
        menuContent.style.zIndex = '1001';
        menuContent.style.width = '300px'; // メニューの幅を設定

        function createCheckBoxContainer(id, text, checked, onchange){
            const checkboxContainer = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = "cbx_" + id;
            checkbox.checked = checked;

            // チェック状態の保存
            checkbox.addEventListener('change', function(){
                saveValueToStorage(id, checkbox.checked);
            } );

            // 外部指定のアクション
            if(onchange){
                checkbox.addEventListener('change', function(){ onchange(checkbox); } );
            }
           
            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.appendChild(document.createTextNode(text));

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);

            return checkboxContainer;
        }

        // 項目別の表示非表示
        collapse_settings.forEach((item) => {
            const checked = stringToBool(loadValueFromStorage(item.id, true)); // デフォは表示

            // クリック時に表示非表示
            let visible_func = function(checkbox){
                let elements = getElements(item.query);
                Array.from(elements).forEach((elm)=>{
                    elm.style.display = checkbox.checked ? "block" : "none";
                });
            }

            let container = createCheckBoxContainer(item.id, item.id, checked, visible_func);
            menuContent.appendChild(container);
        });

        {
            const horizontalRule = document.createElement('hr');
            menuContent.appendChild(horizontalRule);
        }

        // 圧縮
        {
            const id = shrink_settings.id;
            const checked = stringToBool(loadValueFromStorage(id, false)); // デフォは機能オフ
            let text = "隙間を詰める(要リロード)";
            let container = createCheckBoxContainer(id, text, checked);
            menuContent.appendChild(container);
        }

        // ボタン上下入れ替え
        {
            const id = replace_publish_button_settings.id;
            const checked = stringToBool(loadValueFromStorage(id, false)); // デフォは機能オフ
            let text = "決定ボタンを上に移動(要リロード)";
            let container = createCheckBoxContainer(id, text, checked);
            menuContent.appendChild(container);
        }

        // ボタン上下入れ替え
        {
            const id = replace_back_button_settings.id;
            const checked = stringToBool(loadValueFromStorage(id, false));
            let text = "再広告ボタンを上に移動(要リロード)";
            let container = createCheckBoxContainer(id, text, checked);
            menuContent.appendChild(container);
        }

        // メニューボタンを作成
        {
            const menuButton = document.createElement('button');
            menuButton.innerText = '表示編集';
            menuButton.onclick = function() {
                menuContent.style.display = menuContent.style.display === 'block' ? 'none' : 'block';
            };

            // コンテナにボタンとメニューの内容を追加
            menuContainer.appendChild(menuButton);
        }
        menuContainer.appendChild(menuContent);

        // コンテナをボディに追加
        document.body.appendChild(menuContainer);
    }

    // ドロップダウンメニューを追加する関数を呼び出し
    addDropdownMenuToBottom();


    // ------------------------------------------------------------------------------------------------------
    // 項目の非表示処理
    // ------------------------------------------------------------------------------------------------------
    function waitForElementAppear(query){
        console.log(" wait for " +query);

        return new Promise((resolve) => {
            // 既に要素が存在する場合も対応
            {
                const query_result = document.querySelectorAll(query);
                if (query_result.length > 0) {
                    //console.log(query + " already exist");

                    resolve(query_result);
                    return;
                }
            }

            // まだないので監視
            //console.log(query + " not exist now, watching...");
            const observer = new MutationObserver((mutations) => {
                Array.from(mutations).some((mutation) => {
                    let found = false;
                    Array.from(mutation.addedNodes).some((node) => {
                        //console.log("add:" + node)

                        if(!node.parentNode.querySelectorAll){
                            return false;
                        }

                        const query_result = node.parentNode.querySelectorAll(query);
                        if(query_result.length > 0){
                            console.log(query + " matche!")

                            observer.disconnect();
                            resolve(query_result);
                            found = true;
                            return true;
                        }
                    });

                    return found;
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });

        }).then((results)=>{
            console.log(query + " found.");
            return results;
        });
    }

    async function waitForElement(query, callback) {
        let elements = await waitForElementAppear(query);
        if(callback){
             Array.from(elements).forEach((elm)=>{
                 callback(elm); // 要素をコールバック関数に渡す
             });
        }
    }


    function getElements(key){
        return document.querySelectorAll(key);
    }

    function collapseElement(element){
        element.style.display = "none";
    }

    function shrinkElement(element){
        element.style.minHeight = "0vh";
        element.style.padding = "0px";
    }

    function replaceElementToFirst(element){
        let parent = element.parentElement;
        parent.insertBefore(element, parent.firstChild);
    }

    async function mainLoop(){
        while(true){
            // 広告ボタンの出現を待つ
            await waitForElementAppear(replace_publish_button_settings.query);

            // 項目非表示
            collapse_settings.forEach((item) => {
                const value = getElements("#cbx_" + item.id)[0].checked;
                if(!value){
                    waitForElement(item.query, collapseElement);
                }
            });

            // 隙間埋め
            {
                const value = getElements("#cbx_" + shrink_settings.id)[0].checked;
                if(value){
                    waitForElement(shrink_settings.query, shrinkElement);
                }
            }

            // 決定ボタン移動
            {
                const value = getElements("#cbx_" + replace_publish_button_settings.id)[0].checked;
                if(value){
                    waitForElement(replace_publish_button_settings.query, replaceElementToFirst);
                }
            }

            // 広告設定が終わり、結果画面で戻るボタンが出現するのを待つ
            await waitForElementAppear(replace_back_button_settings.query);

            // 戻るボタンの移動
            {
                const value = getElements("#cbx_" + replace_back_button_settings.id)[0].checked;
                if(value){
                    waitForElement(replace_back_button_settings.query, replaceElementToFirst);
                }
            }

            // ループして再び広告決定ボタンの出現を待つ
        }
    }

    mainLoop();

    // 遷移の監視
    // 出稿ボタン、再出稿ボタンの存在を監視して、ページが遷移したら再度simplizeをかける


})();