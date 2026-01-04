// ==UserScript==
// @name           TweetDeck Custom Background Plus
// @name:ja        TweetDeck 背景透過+
// @description    Customize background script for Tweetdeck.
// @description:ja Tweetdeckに背景を付けるスクリプトです。
// @match          *://tweetdeck.twitter.com/*
// @match          *://twitter.com/i/cards/*
// @match          *://x.com/i/tweetdeck
// @version        1.01
// @author         ziopuzzle
// @namespace      https://twitter.com/puzzle_koa/
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/388257/TweetDeck%20Custom%20Background%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/388257/TweetDeck%20Custom%20Background%20Plus.meta.js
// ==/UserScript==

// matchに「*://twitter.com/i/cards/*」が存在しますが、Twitterのカード機能がiframeで読み込まれる為、スタイルを適用するために必要になります。

// htmlタグに #tdbgRoot をIDに持つdivタグを作成し、
// 子要素として #tdbg-variable, #tdbg-bg, #tdbg-style をそれぞれIDとするstyleタグを追加します。
// #tdbg-variable : 色情報やその他細かなオプションなどの値をCSSで変数として定義するstyleタグです。
// #tdbg-bg       : 背景画像の情報を変数として定義するstyleタグです。
// #tdbg-style    : 背景画像を表示させる為の透過や変数を実際に適用するstyleタグです。

(()=>{
    'use strict';

    const flagSendLog = true;
    const flagUIAnimation = true;

    // iframe等で読み込まれた場合はスクリプトを無効化
    // Disable scripts when loaded in an iframe.
    if (window.top !== window.self && new URL(document.referrer).hostname !== 'tweetdeck.twitter.com') {
        return;
    }
    // Twitterのカード機能はiframeで読み込まれる為、例外処理でスタイル適用
    // for Twitter Cards
    if (location.hostname === 'twitter.com') {
        const tag = document.createElement('style');
        tag.id = 'tdbg-card';
        tag.type = 'text/css';
        tag.innerText = '.TwitterCard-container { background-color: ' + GM_getValue('tdbg-color-card', 'rgba(0, 0, 0, 0.5)') + ' !important; }';
        document.getElementsByTagName('body').item(0).appendChild(tag);
        return;
    }

    let tag, tagBG, tagVariable, navIconSpace;
    let bgMain, bgDrawer;
    let colPanel, colColumnHeader, colColumn, colTextBase, colTextName, colTextId, colTextTweet, colTextHashtag, colTextLink;
//    deleteData();
    initializeScript();

    function initializeScript() {
        // cssを動的に変更するために用いるstyleタグの作成
        makeTag();
        //ローディングアイコン書き換え
        var svgLoadingSVG = '<?xml version="1.0" encoding="UTF-8"?><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="outline"><feDropShadow dx="-2" dy="-2" stdDeviation="0" flood-color="#000"></feDropShadow><feDropShadow dx="2" dy="-2" stdDeviation="0" flood-color="#000"></feDropShadow><feDropShadow dx="-2" dy="2" stdDeviation="0" flood-color="#000"></feDropShadow><feDropShadow dx="2" dy="2" stdDeviation="0" flood-color="#000"></feDropShadow></filter></defs><g filter="url(#outline)"><circle class="loader" cx="100" cy="100" r="85" stroke= "#ffffff" stroke-dasharray="533.8" stroke-width="13" fill="none"><animate attributeName="stroke-dashoffset" values="533.8;661.912;533.8" keyTimes="0.0;0.4;1.0" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1" dur="1.2s" repeatCount="indefinite" /><animateTransform attributeName="transform" attributeType="XML" type="rotate" values="270 100 100;630 100 100;630 100 100" keyTimes="0.0;0.8;1.0" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1" dur="1.2s" repeatCount="indefinite"/></circle></g></svg>';
        var base64LoadingSVG = 'data:image/svg+xml,' + encodeURIComponent(svgLoadingSVG);
        const elemAppLoadingImg = document.querySelector('.login-container .block .block img');
        elemAppLoadingImg.setAttribute('width', '74px');
        elemAppLoadingImg.setAttribute('height', '74px');
        elemAppLoadingImg.src = base64LoadingSVG;
        //
        navIconSpace = GM_getValue('tdbg-navicon-space', 'smallest');
        loadData(0x01); //背景読み込み
        styleBGUpdate(); // 背景適用
        styleUpdate(); // 透過処理とかもあるので1回実行（色はundefinedなのでここでは適用されない）
        // Tweetdeckのデフォルトテーマが読み込まれるまで監視
        if (flagSendLog) { console.log('[TDBG] Tweetdeck initialize waiting...'); }
        const checkElement = document.querySelector('div.js-app');
        (new MutationObserver((records, ob) => {
            records.some(record => {
                if ('class' == record.attributeName) {
                    const toClass = record.target.getAttribute(record.attributeName);
                    // div.js-appを監視して、読み込みが終わって.is-hiddenクラスが無くなったタイミングで初期化
                    if (toClass.match(/(?:(?<=\s)|^)js-app(\s|$)/) && !toClass.match(/(?:(?<=\s)|^)is-hidden(\s|$)/)) {
                        // 監視終了
                        ob.disconnect();
                        // 変数の初期化
                        if (flagSendLog) { console.log('[TDBG] Initialize...'); }
                        initializeColor();
                        loadData(0x02); // 保存されているデータの読み込み
                        makeObserver(); // SettingsパネルにBackgroundメニューを追加するオブジェクトの作成
                        styleVariableUpdate(); // 変数の適用
                        styleUpdate(); // cssを適用
                        if (flagSendLog) { console.log('[TDBG] Initialize complete!'); }
                        return true;
                    }
                }
            });
        })).observe(document.body, { attributes: true, subtree: true });
    }
    function initializeColor() {
        // デフォルトのTweetdeckで使われる色を用いて、色を管理する変数を初期化
        const theme = (()=>{ if (!document.querySelector('html.dark')) { return 'light'; } else { return 'dark'; } })();
        switch (theme) {
            case 'light':
                colPanel = '#FFFFFFFF'; colColumnHeader = '#FFFFFFFF'; colColumn = '#FFFFFFFF'; colTextBase = '#FFFFFFFF'; colTextName = '#38444D'; colTextId = '#8899A6'; colTextTweet = '#FFFFFF'; colTextHashtag = '#1DA1F2'; colTextLink = '#1DA1F2';
                break;
            case 'dark': default:
                colPanel = '#15202BFF'; colColumnHeader = '#15202BFF'; colColumn = '#15202BFF'; colTextBase = '#8899A6'; colTextName = '#FFFFFF'; colTextId = '#8899A6'; colTextTweet = '#FFFFFF'; colTextHashtag = '#1DA1F2'; colTextLink = '#1DA1F2';
                break;
            /*
            case 'blue':
                colPanel = '#FFFFFFFF'; colColumnHeader = '#000000FF'; colColumn = '#000000FF'; colTextBase = '#FFFFFF'; colTextName = '#FFFFFF'; colTextId = '#FFFFFF'; colTextTweet = '#FFFFFF'; colTextHashtag = '#FFFFFF'; colTextLink = '#FFFFFF';
                break;
            case 'green':
                colPanel = '#FFFFFFFF'; colColumnHeader = '#000000FF'; colColumn = '#000000FF'; colTextBase = '#FFFFFF'; colTextName = '#FFFFFF'; colTextId = '#FFFFFF'; colTextTweet = '#FFFFFF'; colTextHashtag = '#FFFFFF'; colTextLink = '#FFFFFF';
                break;
            case 'purple':
                colPanel = '#FFFFFFFF'; colColumnHeader = '#000000FF'; colColumn = '#000000FF'; colTextBase = '#FFFFFF'; colTextName = '#FFFFFF'; colTextId = '#FFFFFF'; colTextTweet = '#FFFFFF'; colTextHashtag = '#FFFFFF'; colTextLink = '#FFFFFF';
                break;
            */
        }
    }
    function deleteData() {
        GM_deleteValue('tdbg-bg-main');
        GM_deleteValue('tdbg-bg-drawer');
        GM_deleteValue('tdbg-navicon-space');
        GM_deleteValue('tdbg-color-panel');
        GM_deleteValue('tdbg-color-column-header');
        GM_deleteValue('tdbg-color-column');
        GM_deleteValue('tdbg-color-base');
        GM_deleteValue('tdbg-color-name');
        GM_deleteValue('tdbg-color-id');
        GM_deleteValue('tdbg-color-tweet');
        GM_deleteValue('tdbg-color-hashtag');
        GM_deleteValue('tdbg-color-link');
    }
    function saveData(f) {
        // bitフラグで種類を指定可能
        // 000X : 背景
        // 00X0 : 色データ
        if (f & 0x01) {
            GM_setValue('tdbg-bg-main', bgMain);
            GM_setValue('tdbg-bg-drawer', bgDrawer);
        }
        if (f & 0x02) {
            GM_setValue('tdbg-navicon-space', navIconSpace);
            GM_setValue('tdbg-color-panel', colPanel);
            GM_setValue('tdbg-color-column-header', colColumnHeader);
            GM_setValue('tdbg-color-column', colColumn);
            GM_setValue('tdbg-color-base', colTextBase);
            GM_setValue('tdbg-color-name', colTextName);
            GM_setValue('tdbg-color-id', colTextId);
            GM_setValue('tdbg-color-tweet', colTextTweet);
            GM_setValue('tdbg-color-hashtag', colTextHashtag);
            GM_setValue('tdbg-color-link', colTextLink);
        }
    }
    function loadData(f) {
        // 保存されているデータの読み込み
        // 引数はビットで読み込むデータの指定
        // データタイプはsaveDate()を参照
        if (f & 0x01) {
            bgMain = GM_getValue('tdbg-bg-main', null);
            bgDrawer = GM_getValue('tdbg-bg-drawer', null);
        }
        if (f & 0x02) {
            navIconSpace = GM_getValue('tdbg-navicon-space', 'smallest');
            colPanel = GM_getValue('tdbg-color-panel', colPanel);
            colColumnHeader = GM_getValue('tdbg-color-column-header', colColumnHeader);
            colColumn = GM_getValue('tdbg-color-column', colColumn);
            colTextBase = GM_getValue('tdbg-color-base', colTextBase);
            colTextName = GM_getValue('tdbg-color-name', colTextName);
            colTextId = GM_getValue('tdbg-color-id', colTextId);
            colTextTweet = GM_getValue('tdbg-color-tweet', colTextTweet);
            colTextHashtag = GM_getValue('tdbg-color-hashtag', colTextHashtag);
            colTextLink = GM_getValue('tdbg-color-link', colTextLink);
        }
    }
    function makeObserver() {
        // Settingsパネルの開閉を監視し、Backgroundsメニューの追加を行うオブジェクトの作成
        (new MutationObserver((records, ob) => {
            const nav = document.querySelector(".settings-modal");
            if (nav) {
                ob.disconnect();
                (new MutationObserver(records => {
                    records.forEach(record => {
                        record.addedNodes.forEach(node => {
                            const menu = node.querySelector("ul.js-setting-list");
                            if (menu) appendMenu(menu);
                        });
                    });
                })).observe(nav, { childList: true });
            }
        })).observe(document.body, { childList: true, subtree: true });
    }

    // 変更時適用にしてしまうとカラーピッカーで色をスライドするだけで重くなってしまうため、一定時間そのままなら適用。
    let colorChanegeWait = null;
    function funcInputColorWait(e) {
        if (colorChanegeWait) clearTimeout(colorChanegeWait);
        colorChanegeWait = setTimeout(funcInputColor, 100, e);
    }
    function funcInputColor(e) {
        colorChanegeWait = null;
        if (null == document.getElementById('tdbg-colorpicker-panel')) return true;
        if (null == document.getElementById('tdbg-colorpicker-column-header')) return true;
        if (null == document.getElementById('tdbg-colorpicker-column')) return true;
        colPanel = document.getElementById('tdbg-colorpicker-panel').value + parseInt(document.getElementById('tdbg-colorslider-panel').value).toString(16).padStart(2,'0');
        colColumnHeader = document.getElementById('tdbg-colorpicker-column-header').value + parseInt(document.getElementById('tdbg-colorslider-column-header').value).toString(16).padStart(2,'0');
        colColumn = document.getElementById('tdbg-colorpicker-column').value + parseInt(document.getElementById('tdbg-colorslider-column').value).toString(16).padStart(2,'0');
        colTextBase = document.getElementById('tdbg-colorpicker-base').value;
        colTextTweet = document.getElementById('tdbg-colorpicker-tweet').value;
        colTextHashtag = document.getElementById('tdbg-colorpicker-hashtag').value;
        colTextLink = document.getElementById('tdbg-colorpicker-link').value;
//        const selectColorPreset = document.querySelector('#tdbg-select-colorpreset');
//        selectColorPreset.value = 'custom';
        styleVariableUpdate();
        saveData(0x02);
    }

    function funcInputPicture(e) {
        const elmID = e.target.id;
        const preview = document.getElementById(elmID + '-preview');
        const url = document.getElementById(elmID + '-url');
        const file = document.getElementById(elmID).files[0];
        const reader = new FileReader();
        reader.addEventListener('load', function () { // reader.result is base64
            //preview.src = dataURItoObjectURL(reader.result);
            preview.src = reader.result;
            url.value = '[fileinput]';
            if (elmID == 'tdbg-main-input') bgMain = reader.result;
            if (elmID == 'tdbg-drawer-input') bgDrawer = reader.result;
            styleBGUpdate();
            saveData(0x01);
        }, false);
        if (file) {
            reader.readAsDataURL(file);
        }
//        styleBGUpdate();
    }
    function funcRadioIconSpace(e) {
        navIconSpace = e.target.value;
        styleVariableUpdate();
        saveData(0x02);
    }

    // 設定パネルを開いた際にこのユーザースクリプト用の設定ができる項目を"Backgrounds"として追加
    function appendMenu(menu) {
        const list = document.querySelectorAll("ul.js-setting-list li:not(.tdbg-setting)");
        list.forEach(v => {v.addEventListener("click", event => {document.querySelector(".tdbg-setting").classList.remove("selected");});});
		const a = document.createElement("a");
		a.href = "#";
        a.className = "list-link";
		a.dataset.action = "background";
		a.innerHTML = "<strong>Backgrounds</strong>";
		a.addEventListener("click", event => openSettings());
		const li = document.createElement("li");
        li.className = "tdbg-setting";
		li.appendChild(a);
		menu.appendChild(li);
	}
    // 設定パネルの中の"Backgrounds"セクションをクリックした際にメニューを表示
    function openSettings() {
        document.querySelector("ul.js-setting-list li.selected:not(.td-userscript-background-setting)").classList.remove("selected");
        const menu = document.querySelector(".tdbg-setting:not(.selected)");
        // セレクタで発見できなかったら関数を抜ける
        if (menu == undefined || menu == null) { return true; }
        menu.classList.add("selected");
        const form = document.querySelector("#global-settings");
        const nonebg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAADklEQVR4nGNgGAWDEwAAAZoAAR2CVqgAAAAASUVORK5CYII=';
        form.innerHTML = `
            <fieldset id="tdbg-settings">
                <legend>Backgrounds Settings</legend>
                <!--
                <div>
                    <i class="icon icon-small color-twitter-blue js-toggle-switch is-actionable align-top icon-toggle-off" id="tdbg-hide-modalshadow"></i>
                    <span class="margin-l--4">Hide shadow(Temporary)</span>
                </div>
                <div class="divider-bar"></div>
                -->
                <div class="control-group">
                    <label class="control-label">Navigate Icon space</label>
                    <div class="tdbg-radio-group item-3 controls">
                        <label>
                            <input type="radio" name="navIconSpace" value="default">
                            &nbsp;Default
                        </label>
                        <label>
                            <input type="radio" name="navIconSpace" value="small">
                            &nbsp;Small
                        </label>
                        <label>
                            <input type="radio" name="navIconSpace" value="smallest">
                            &nbsp;Smallest
                        </label>
                    </div>
                </div>
                <div class="divider-bar"></div>
                <!--
                <div class="tdbg-controls">
                    <select id="tdbg-theme-select" class="tdbg-select-container" name="ThemeSelect"></select>
                    <div class="tdbg-theme-new">
                        <button>New</button>
                    </div>
                    <div class="tdbg-theme-delete">
                        <button>Delete</button>
                    </div>
                </div>
                -->
                <div>
                    <div class="tdbg-controls">
                        <div>
                            <div class="tdbg-input-container">
                                <div class="tdbg-control-group">
                                    <span>Main Background</span>
                                    <div>
                                        <label>
                                            <div>&#x1F4C4;</div>
                                            <input id="tdbg-main-input" type="file" accept="image/*">
                                        </label>
                                    </div>
                                    <div>
                                        <input id="tdbg-main-input-url" type="text" name="inputBGMainImageorURL" placeholder="https://" pattern="^((https://.*)|(\[fileinput\]))$" title="URLはhttpsから始まる必要があります">
                                    </div>
                                </div>
                                <div class="tdbg-controls">
                                    <img id="tdbg-main-input-preview" class="tdbg-input-preview" src="' + nonebg + '" width="150" height="100" alt="Image preview...">
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="tdbg-input-container">
                                <div class="tdbg-control-group">
                                    <span>Drawer Background</span>
                                    <div>
                                        <label>
                                            <div>&#x1F4C4;</div>
                                            <input id="tdbg-drawer-input" type="file" accept="image/*">
                                        </label>
                                    </div>
                                    <div>
                                        <input id="tdbg-drawer-input-url" type="text" name="inputBGDrawerImageorURL" placeholder="https://" pattern="^((https://.*)|(\[fileinput\]))$" title="URLはhttpsから始まる必要があります">
                                    </div>
                                </div>
                                <div class="tdbg-controls">
                                    <img id="tdbg-drawer-input-preview" class="tdbg-input-preview" src="' + nonebg + '" width="150" height="100" alt="Image preview...">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="clear:both;">
                        <!--
                        <div>Color Preset</div>
                        <select id="tdbg-select-colorpreset" class="tdbg-select-container" name="color preset">
                            <option value="custom">Custom</option>
                            <option value="light">Light(Default theme)</option>
                            <option value="dark">Dark(Default Dark theme)</option>
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                            <option value="purple">Purple</option>
                        </select>
                        -->
                        <div id="tdbg-setting-color">
                            <div class="tdbg-flex tdbg-flex-row">
                                <div class="tdbg-flex tdbg-flex-column tdbg-flex-space-around">
                                    <label class="tdbg-colorpicker"><span>Panel</span><input id="tdbg-colorpicker-panel" type="color"></label>
                                    <label class="tdbg-colorpicker"><span>ColumnHeader</span><input id="tdbg-colorpicker-column-header" type="color"></label>
                                    <label class="tdbg-colorpicker"><span>Column</span><input id="tdbg-colorpicker-column" type="color"></label>
                                </div>
                                <div class="tdbg-flex tdbg-flex-column tdbg-flex-space-around tdbg-flex-auto">
                                    <label class="tdbg-colorslider"><input id="tdbg-colorslider-panel" type="range" min="0" max="255"></label>
                                    <label class="tdbg-colorslider"><input id="tdbg-colorslider-column-header" type="range" min="0" max="255"></label>
                                    <label class="tdbg-colorslider"><input id="tdbg-colorslider-column" type="range" min="0" max="255"></label>
                                </div>
                            </div>
                            <!--
                            <div class="tdbg-colorpicker-alpha">
                                <label class="tdbg-colorpicker">Panel<input id="tdbg-colorpicker-panel" type="color"></label>
                                <label class="tdbg-colorslider"><input id="tdbg-colorslider-panel" type="range" min="0" max="255"></label>
                            </div>
                            <div class="tdbg-colorpicker-alpha">
                                <label class="tdbg-colorpicker">Column<input id="tdbg-colorpicker-column" type="color"></label>
                                <label class="tdbg-colorslider"><input id="tdbg-colorslider-column" type="range" min="0" max="255"></label>
                            </div>
                            -->
                            <label class="tdbg-colorpicker">Base<input id="tdbg-colorpicker-base" type="color"></label>
                            <label class="tdbg-colorpicker">Name<input id="tdbg-colorpicker-name" type="color"></label>
                            <label class="tdbg-colorpicker">Tweet<input id="tdbg-colorpicker-tweet" type="color"></label>
                            <label class="tdbg-colorpicker">Hashtag<input id="tdbg-colorpicker-hashtag" type="color"></label>
                            <label class="tdbg-colorpicker">Link<input id="tdbg-colorpicker-link" type="color"></label>
                        </div>
                    </div>
                </div>
            </fieldset>
        `;
        document.querySelector('input[name=navIconSpace][value=' + navIconSpace + ']').checked = true;
        document.getElementById('tdbg-colorpicker-panel').value = colPanel.match(/#.{6}/)[0];
        document.getElementById('tdbg-colorslider-panel').value = parseInt(colPanel.match(/(?<=#.{6}).{2}/)[0], 16);
        document.getElementById('tdbg-colorpicker-column-header').value = colColumnHeader.match(/#.{6}/)[0];
        document.getElementById('tdbg-colorslider-column-header').value = parseInt(colColumnHeader.match(/(?<=#.{6}).{2}/)[0], 16);
        document.getElementById('tdbg-colorpicker-column').value = colColumn.match(/#.{6}/)[0];
        document.getElementById('tdbg-colorslider-column').value = parseInt(colColumn.match(/(?<=#.{6}).{2}/)[0], 16);
        document.getElementById('tdbg-colorpicker-base').value = colTextBase;
        document.getElementById('tdbg-colorpicker-name').value = colTextName;
        document.getElementById('tdbg-colorpicker-tweet').value = colTextTweet;
        document.getElementById('tdbg-colorpicker-hashtag').value = colTextHashtag;
        document.getElementById('tdbg-colorpicker-link').value = colTextLink;
        const radioIconSpace = document.getElementsByName('navIconSpace');
        for (let i = 0; i < radioIconSpace.length; i++) { radioIconSpace[i].addEventListener("click", funcRadioIconSpace); }
        const inputMain = document.querySelector("#tdbg-main-input");
        inputMain.addEventListener('input', funcInputPicture );
        if (bgMain !== undefined && bgMain !== null) {
            document.querySelector("#tdbg-main-input-preview").src = bgMain;
            if (isAcceptURL(bgMain)) document.querySelector("#tdbg-main-input-url").value = bgMain; else document.querySelector("#tdbg-main-input-url").value = '[fileinput]';
        }
        const inputDrawer = document.querySelector("#tdbg-drawer-input");
        inputDrawer.addEventListener('input', funcInputPicture );
        if (bgDrawer !== undefined && bgDrawer !== null) {
            document.querySelector("#tdbg-drawer-input-preview").src = bgDrawer;
            if (isAcceptURL(bgDrawer)) document.querySelector("#tdbg-drawer-input-url").value = bgDrawer; else document.querySelector("#tdbg-drawer-input-url").value = '[fileinput]';
        }
        const inputColorPickers = document.querySelectorAll('.tdbg-colorpicker input, .tdbg-colorslider input');
        inputColorPickers.forEach( function (elm) { elm.addEventListener('input', funcInputColorWait); });
        const selectColorPreset = document.querySelector('#tdbg-select-colorpreset');
        //const isDark = document.querySelector('html.dark') != null;
        //if (isDark) {selectColorPreset.value = 'dark';} else {selectColorPreset.value = 'light';}
        selectColorPreset.value = 'custom';
        selectColorPreset.addEventListener('change', (event) => {
            selectColorPreset.value
        });
    }

    // ファイルとURLを同じ変数で扱うため、URLか否かをチェックするための関数
    function isAcceptURL(str) {
        const regex = /^https:\/\/.*/;
        return regex.test(str);
    }

    // URIじゃなくてblobで表示させたかったんだけどあれなのでblobにしたかったけどTweetdeckのContent Security Policyに引っかかってしまう
/*
    function dataURItoBlob(data) {
        // URIからblobを作成します。
        var dataURI = data;
        var byteString = atob( dataURI.split(',')[1] ) ;
        var mimeType = dataURI.match( /(:)([a-z\/]+)(;)/ )[2];
        for ( var i=0, l=byteString.length, content=new Uint8Array(l); l>i; i++ ) {
            content[i] = byteString.charCodeAt(i);
        }
        return new Blob([ content ], { type: mimeType });
    }
    function dataURItoObjectURL(data) {
        // URIから作成したblobのURLを取得します
		const blob = dataURItoBlob(data);
		return blob? URL.createObjectURL(blob): null;
	}
*/

    // 動的にcssを変更するためにstyleタグを作成するための関数
    function makeTag() {
        if (!document.getElementById('tdbgRoot')) {
            // いくつかのStyleタグを作成するのでひとまとめにするためのdivタグを作成
            const tagTDBG = document.createElement('div');
            tagTDBG.id = 'tdbgRoot';
            document.getElementsByTagName('html').item(0).appendChild(tagTDBG);
            const tagsID = ['tdbg-variable', 'tdbg-bg', 'tdbg-style'];
            let tagsElement = [];
            tagsID.forEach(v => {
                const styleTag = document.createElement('style');
                styleTag.id = v;
                styleTag.type = 'text/css';
                tagTDBG.appendChild(styleTag);
                tagsElement.push(styleTag);
            });
            tagVariable = tagsElement.shift();
            tagBG = tagsElement.shift();
            tag = tagsElement.shift();
        }
    }
    function styleVariableUpdate() {
        let style = '';
        // 変数設定
        const tableNavIconSpace = { default: 45, small: 35, smallest: 31 };
        let _navIconSpacePixel = tableNavIconSpace.default;
        if (navIconSpace in tableNavIconSpace) _navIconSpacePixel = tableNavIconSpace[navIconSpace];
        (()=>{
        style += ':root {';
            if (colPanel !== undefined) style += '--tdbg-color-panel: ' + colPanel + ';';
            if (colColumnHeader !== undefined) style += '--tdbg-color-column-header: ' + colColumnHeader + ';';
            if (colColumn !== undefined) style += '--tdbg-color-column: ' + colColumn + ';';
            if (colTextTweet !== undefined) style += '--tdbg-color-tweet: ' + colTextTweet + ';';
            if (colTextHashtag !== undefined) style += '--tdbg-color-hashtag: ' + colTextHashtag + ';';
            if (colTextLink !== undefined) style += '--tdbg-color-link: ' + colTextLink + ';';

            style += '--tdbg-color-accent: rgb(224, 192, 128);';
            style += '--tdbg-color-accent-text: #4040FF;';
            style += '--tdbg-color-subaccent: rgb(160, 128, 192);';

            style += '--tdbg-navicon-space: ' + _navIconSpacePixel + 'px;';
        style += '}';
        })();
        tagVariable.innerText = style;
    }
    function styleBGUpdate() {
        let style = '';
        if (bgMain !== undefined && bgMain !== null) style += 'body { background-image: url("' + bgMain + '") !important; }'; else style += 'body { background: #4080A0 !important; }';
        if (bgDrawer !== undefined && bgDrawer !== null) style += '.drawer { background-image: url("' + bgDrawer + '") !important; }'; else style += '.drawer { background: #206080 !important; }';
        tagBG.innerText = style;
    }
    function styleUpdate() {
        // styleタグを書き換えることでcssを適用
        // 管理用styleタグが存在しないときはコンソールにエラー
        if (tag == null) { console.error('[TDBG] Failed to apply the css because the "#tdbg-style" style tag was not found.'); return true; }
        let style = '';
        // 色を設定する部分
        (()=>{
            // タイムラインパネルやポップアップパネルの色
            if (colPanel !== undefined) {
                style += '#settings-modal .js-modal-panel, .js-modal-inner { background-color: var(--tdbg-color-panel) !important; }';
                // カラム追加ポップアップ
                style += '.mdl:not(.med-fullpanel) { background-color: var(--tdbg-color-panel) !important; }';
                // 検索ポップアップ
                style += '.popover { background-color: #000000A0 !important; }';
                style += '.popover .caret-inner { border-bottom-color: var(--tdbg-color-panel) !important; }'
                style += '.js-popover-content { background-color: var(--tdbg-color-panel) !important; border-radius: 14px !important; }'
            }
            // カラム（およびカラムヘッダー）の色
            if (colColumnHeader !== undefined) {
                style += '.column .column-header, .column-options { background-color: var(--tdbg-color-column-header) !important; }';
            }
            if (colColumn !== undefined) {
                style += '.column .column-scroller, .column-message { background-color:  var(--tdbg-color-column) !important; }';
            } else {
                style += '.column .column-scroller, .column-message { background-color: rgba(0, 0, 0, 0.7) !important; }';
            }
            // ツイートに関する色
            if (colTextTweet !== undefined) style += '.tweet-text { color: var(--tdbg-color-tweet) !important }';
            if (colTextHashtag !== undefined) style += '[rel=hashtag] { color: var(--tdbg-color-hashtag) !important }';
            if (colTextLink !== undefined) style += '[data-full-url] { color: var(--tdbg-color-link) !important; }';


            // カラムヘッダー部の更新通知の色
            style += '.is-new .column-type-icon { color: var(--tdbg-color-accent) !important; }';
            style += '.more-tweets-glow { background: radial-gradient(ellipse farthest-corner at 50% 100%, var(--tdbg-color-accent) 0, var(--tdbg-color-accent) 25%,hsla(0,0%,100%,0) 75%) !important; }';
            // ナビゲーションバーの更新通知ドット
            style += '.column-nav-updates { color: var(--tdbg-color-accent) !important; }';
            // ナビゲーションバーでカラムを選択した際に選択されたカラムの周りに表示されるボーダーの色
            style += '.column.is-focused { box-shadow: 0 0 0 2px var(--tdbg-color-accent) !important; }';
            // スクロールバーの色
            style += '.antiscroll-scrollbar, ::-webkit-scrollbar-thumb { background-color: var(--tdbg-color-accent) !important; }'; //"::-webkit-scrollbar-thumb" for Blink and WebKit base browser
            style += '* { scrollbar-color: var(--tdbg-color-accent) !important; }'; //"scrollbar-color" property for Firefox
            // 各種アイコン
            style += '.column-header-link, .app-nav-link, .app-nav-tab, .app-search-fake { color: var(--tdbg-color-accent) !important; }';
            style += '.lst-launcher .icon, html .lst-launcher .is-disabled .icon, html.dark .lst-launcher .is-disabled .icon, html .lst-launcher .is-disabled a:hover .icon, html.dark .lst-launcher .is-disabled a:hover .icon,';
            style += 'html .lst-launcher .is-disabled a:focus .icon, html.dark .lst-launcher .is-disabled a:focus .icon { color: var(--tdbg-color-accent) !important; }';
            style += '.app-search-fake { color: var(--tdbg-color-accent) !important; border-color: var(--tdbg-color-accent) !important; background-color: transparent !important; }';
            // 各種ボタン
            style += '.Button, input[type="button"], button { color: var(--tdbg-color-accent) !important; border-color: var(--tdbg-color-accent) !important; }';
            // 各種アクション時
            style += '.list-item.is-selected, .list-item:hover, html .lst-group .selected, html.dark .lst-group .selected,';
            style += 'html .dropdown-menu .is-selectable.is-selected a , html.dark .dropdown-menu .is-selectable.is-selected a { color: var(--tdbg-color-accent-text) !important; background-color: var(--tdbg-color-accent) !important; }';
            // 背景を伴うアクション時
            style += '.lst-profile a:hover i, .lst-profile a:hover span, .lst-group a:hover strong, .lst-group a:hover span { color: var(--tdbg-color-accent) !important; background-color: var(--tdbg-color-accent-text) !important; }'
            // 各種テキスト
            style += '.txt-link, a:hover, a:active { color: var(--tdbg-color-accent) !important; }';


            //
//            style += '.txt-mute { color: var(--tdbg-color-subaccent) !important; }';
            style += '.lst-group .selected a:hover { color: var(--tdbg-color-subaccent) !important; }';

            style += '.lst-group .selected strong, .lst-group .selected span { color: var(--tdbg-color-accent-text) !important; }';

            // 引用ツイート
            style += '.quoted-tweet, .TwitterCard-container { background-color: rgba(0, 0, 0, 0.4) !important; }';

            //
            style += 'input[type=text], .detail-view-inline-text { background-color: #000000A0 !important; }'
        })();
        // 背景を設定する部分
        (()=>{
            // 背景が無い部分ができないように覆う設定
            style += 'body { background-size: cover !important; background-position: center center !important; }';
            style += '.drawer { background-size: cover !important; background-position: center center !important; }';
        })();
        // 背景を表示するために透過色を設置する部分
        (()=>{
            // 全体の透過
            style += '.app-content, .app-columns-container { background-color: transparent !important; }';
            // ポップアップの透過
            style += '.mdl-column-med, .med-fullpanel, .prf-meta { background-color: transparent !important; }'
            // ドロワーの透過
            style += '.compose, .old-composer-footer,';
            style += 'html .accounts-drawer, html.dark .accounts-drawer { background-color: transparent !important; }';
            // カラムの透過
            style += '.column-panel, .column-content { background-color: transparent !important; }';
            // カラムヘッダーの透過
            style += '.button-tray, .facet-type { background-color: transparent !important; }';
            // ツイート関係の透過
             // ツイートの透過
            style += 'article { background-color: transparent !important; }';
             // ツイート詳細の透過
            style += '.column-scroller, .tweet-detail-wrapper, .detail-view-inline { background-color: transparent !important; }';
            style += '.inline-reply, .reply-triangle { background-color: transparent !important; }';
            // カラム透過
            style += '.column { background-color: transparent !important; }';
            // ポップアップにカラムが表示される際の透過
            style += '.column-header-temp { background-color: transparent !important; }';
            // 404ページ用
            style += '.srt-holder .container { padding: 12px; background-color: rgba(0, 0, 0, 0.5); border-radius: 15px; }';
        })();
        // 背景設定画面
        (()=>{
            style += '#tdbg-settings .control-group { height: 1em; }';
            style += '.tdbg-radio-group label { float: left; padding-top: 6px; }';
            style += '.tdbg-radio-group.item-3 label { width: 33%; }';

            style += '.tdbg-colorpicker { float: left !important; padding-right: 10px; }';
            style += '.tdbg-colorpicker input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }';
            style += '.tdbg-colorpicker input[type="color"]::-webkit-color-swatch { border: none; }';
            style += `.tdbg-colorpicker input[type="color"] {
                -webkit-appearance: none;
                padding: 0;
                background-color: rgba(0,0,0,0);
                width: 1em;
                height: 1em;
                margin-left: 3px;
                border-radius: 0;
                border: 1px solid #FFFFFF;
                float: right;
            }`;

            // panelの色は透過度も設定できるようにしたいのでスライダーも存在する
            style += '#tdbg-setting-color .tdbg-flex .tdbg-colorpicker { vertical-align: middle; height: 2em; width: 115px; }';
            style += '#tdbg-setting-color .tdbg-flex .tdbg-colorslider { vertical-align: middle; height: 2em; }';

            style += '.tdbg-input-container label { padding: 4px 8px;}';
            style += '.tdbg-input-container .tdbg-input-preview { object-fit: cover; border: solid 1px; }';
            style += '.tdbg-input-container div { padding-bottom: 10px; }';
            style += '.tdbg-input-container .tdbg-control-group { float: left; width: 360px; margin-top: 5px; }';
            style += '.tdbg-input-container .tdbg-controls { float: right; }';

            style += '.tdbg-input-container label > input[type=file]::-webkit-file-upload-button { display: none; }';
            style += '.tdbg-input-container label > input[type=file] { flex: 1; }';
            style += '.tdbg-input-container label { padding: 0; display: flex; }';
            style += '.tdbg-input-container label div { position: absolute; padding: 6px; }';
            style += '.tdbg-input-container label > input[type=file] { padding-left: 25px; }';

            style += '.tdbg-flex { display: flex; }';
            style += '.tdbg-flex-row { flex-direction: row; }';
            style += '.tdbg-flex-column { flex-direction: column; }';
            style += '.tdbg-flex-auto { flex-grow: 1; }';
        })();
        // 見栄えの為の調整
        (()=>{
            // ロードアイコンがgifなので背景色が背景を透過した際に見栄えが悪いため非表示
//            style += '.login-container img:not(.tdbg-img) { display: none; }';
            // カラムの角を丸める
            style += '.column { border-radius: 15px !important; }';
            // カラム間の余白を詰めて上下にも余白を取る
            style += '.app-columns { padding: 2px 0 2px 2px !important; }';
            style += '.column { margin: 0 2px 0 0 !important; }';
            // ナビゲーションバーのアイコン間の余白を詰める
            style += '.column-nav-item { height: var(--tdbg-navicon-space) !important; }';
            // ナビゲーションバーのスクロールバーが透明だと使いづらいので半透明に修正
            style += '.antiscroll-scrollbar { opacity: 0.5 !important; }';
            style += '.antiscroll-scrollbar-shown { opacity: 1.0 !important; }';
            //
            style += '.app-header:not(.is-condensed) .app-search-fake .icon { opacity: 0; }';
            // インラインリプライの余白を詰める
            style += 'html .inline-reply > div, html.dark .inline-reply > div { padding-top: 0 !important; }';
            style += '.compose-text-container { margin-top: 0px !important; }';
            // リプライ入力ボックスの透過度を揃える
            style += '.detail-view-inline-text { background-color: rgba(0,0,0,0.4) !important; }';
            // ボーダー統一
            style += '[dir=ltr] [role=button], .r-aaos50, .column { border: solid 1px !important; }';
            style += '.new-composer-bottom-button, .r-18qmn74 { border: solid 1px !important; background-color: rgba(0, 0, 0, .5) !important; border-radius: 30px !important; }';
            style += '.compose-reply-tweet { border: solid 1px !important; }';
            style += '.app-content *:not(span):not(.replyto-caret), ::-webkit-scrollbar-track, [dir=ltr] [role=button], .r-aaos50, .r-18qmn74 { border-color: #808080 !important; }';
            // ポップアップを開いた際に後ろの画面を透過
            style += 'html:not(.btd-on) .med-fullpanel { background-color: #00000000 !important; }';
            style += 'html:not(.btd-on) .ovl, html:not(.btd-on) .overlay { background: #000000CC !important; }';

            // 404ページのheightが0になっていて背景の表示がおかしくなるのを修正
            style += 'html { height: 100%; }';
        })();
        // TeamInvitationsカラムが見えちゃうことがあるため、開いてないときは見えないようにする
        style += '.js-team-invitations-container, .drawer:not(.is-shifted-1) .js-contributor-manager-container { display: none !important; }';
        // アニメーション
        (()=>{
            if (!flagUIAnimation) return;
            // ナビゲーションバーのアイコン間の余白が変わったときに滑らかに推移
            style += '.column-nav-item { transition: height 0.3s ease-out; }';
            // ページロード時にカラムポップアップ演出
//            style += '@keyframes fadeIn { 0% { transform: scale(0,0); opacity: 0; animation-timing-function: cubic-bezier(.3,1.52,.51,.89); } 100% { transform: scale(1); opacity: 1; }}';
//            style += '.column { animation-name: fadeIn; animation-duration: 0.8s; animation-fill-mode: backwards; }';
//            const columns = document.querySelectorAll('.app-columns > section');
//            columns.forEach(function(e,i){ style += '.column:nth-of-type(' + (i + 1) + ') { animation-delay: ' + 0.07 * i + 's; }'; });
        })();
        // BetterTweetdeck導入時の修正
        (()=>{
            // BetterTweetdeckの設定画面を開くナビアイコンが増えたことにより、ナビアイコン列の最後が隠れてしまうのを修正
            style += '.btd-loaded .column-navigator.column-navigator-overflow { height: calc(100% - 409px) !important; }';
            // ツイート詳細画面のリプライ吹き出しに不自然なマージンが取られているのを修正
            style += '.btd-loaded .inline-reply, .detail-view-inline { margin-top: 0px !important; }';
            // カラム折りたたみ時にボーダー線が重なるのを修正
            style += '.btd-column-collapsed .column-header { border: solid 0px !important }';
            // カラム折りたたみ時にカラム透過色が見えてしまうのを修正（不自然な横幅を修正）
            style += 'html .app-content section.column.btd-column-collapsed { width: 50px !important; }';
            // 設定画面の一時的に影を消す設定を有効にしたときの補正
            style += 'html.btd-on #settings-modal.ovl.tdbg-bgtransparent { background: transparent !important; }';
        })();
        tag.innerText = style;
    }
})();