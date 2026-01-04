// ==UserScript==
// @name              画像全置換
// @name:ja           画像全置換
// @name:en           All image replace
// @namespace         https://snowshome.page.link/p
// @version           1.3.7
// @description       ページ上の画像を全て指定画像に置換する。シンプル故に悪質。
// @description:ja    ページ上の画像を全て指定画像に置換する。シンプル故に悪質。
// @description:en    Replace all images on the page with the specified image. It's malicious because it's simple.
// @author            tromtub(snows)
// @license           GPL-3.0
// @match             *://*/*
// @match             file:///*/*
// @icon              https://i.gifer.com/ZKZg.gif
// @supportURL        https://github.com/hi2ma-bu4/all-img-replace
// @supportURL        https://greasyfork.org/ja/scripts/496146-%E7%94%BB%E5%83%8F%E5%85%A8%E7%BD%AE%E6%8F%9B
// @compatible        chrome
// @compatible        edge
// @compatible        opera chromium製なので動くと仮定
// @grant             GM.addStyle
// @grant             GM.setValue
// @grant             GM.getValue
// @grant             GM.deleteValue
// @grant             GM.registerMenuCommand
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/496153/%E7%94%BB%E5%83%8F%E5%85%A8%E7%BD%AE%E6%8F%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/496153/%E7%94%BB%E5%83%8F%E5%85%A8%E7%BD%AE%E6%8F%9B.meta.js
// ==/UserScript==

/*

*/

(function() {
    'use strict';

    // 被った時はここを変更
    const PRO_NAME = "IMRP";
    // 保存用Key
    const SD_URIS_KEY = "URIS";
    const SD_SETTING_KEY = "SETTING";
    // メニュー内部使用
    const HIDE_CLASS = PRO_NAME + "_HIDE";
    const MENU_ID = PRO_NAME + "_MENU";
    const MENU_INNER_CLASS = MENU_ID + "_INNER";
    const MENU_TOOLBAR_ID = MENU_ID + "_TOOLBAR";
    const MENU_CLOSE_ID = MENU_ID + "_CLOSE";
    const FILE_INPUT_ID = MENU_ID + "_FILE";
    const URL_INPUT_ID = MENU_ID + "_URL_IN";
    const URL_ADD_ID = MENU_ID + "_URL_ADD";
    const IMAGE_SELECT_ID = MENU_ID + "_IMSE";
    const IMAGE_DEL_ID = IMAGE_SELECT_ID + "_DEL";
    const OPT_URL_ID = IMAGE_SELECT_ID + "_URL";
    const OPT_BASE64_ID = IMAGE_SELECT_ID + "_BASE64";
    const PREVIEW_ID = MENU_ID + "_PREVIEW";
    // 探査用
    const REPLACE_BASE = PRO_NAME + "_REPLACE";
    const REPLACE_EXCLUSION_CLASS = REPLACE_BASE + "_EXCLUSION";
    const REPLACE_CHECK_CLASS = REPLACE_BASE + "_CHECK";
    const REPLACE_REDETECTION_CLASS = REPLACE_BASE + "_REDETECTION";
    const REPLACE_SVG_IMAGE_CLASS = REPLACE_BASE + "_IMAGE";
    // data属性用
    const DATA_ORIGINAL = PRO_NAME.toLowerCase() + "_origin";
    const DATA_ORIGINAL_TYPE = DATA_ORIGINAL + "_type";
    const DATA_CHANGE_KEY = PRO_NAME.toLowerCase() + "_key";

    const MAX_DATA_NAME_LEN = 50;
    const SUB_FRAME_LOG_STYLE = "color:greenyellow;font-weight:bold";

    const CORS_EVASION_URL = "https://script.google.com/macros/s/AKfycbyVHzqlKX4FvmPkvUktdu0H3hAUDfVYP5jsIgngxFoXEdKgFVUbT0cjwFebJA4ZcCfW/exec";
    const XLINK_NS = "http://www.w3.org/1999/xlink";
    const SVG_NS = "http://www.w3.org/2000/svg"

    const EXCLUSION_DOM = ["."+REPLACE_EXCLUSION_CLASS,"script", "style", "frame", "iframe", "meta"];

    const ALL_DOM_QUERY = `*:not(:is(${EXCLUSION_DOM.join(",")}))`;

    const BASE_CSS = `
.${HIDE_CLASS} {
    display: none;
}
#${MENU_ID} {
    position: fixed;
    top: 0;
    left: 0;
    max-width: 100dvw;
    min-width: 20em;
    max-height: 95dvh;
    min-height: 10em;
    background-color: rgba(230,230,230,.8);
    border: black 2px solid;
    z-index: 114514;
    user-select: none;
    overflow: auto;
}

#${MENU_ID} > div:not(#${MENU_TOOLBAR_ID}) {
    padding: 1em;
}

#${MENU_ID} input, #${PREVIEW_ID} {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.${MENU_INNER_CLASS} {
    width: 100%;
    background-color: rgba(200,200,200,.2);
    margin-bottom: .5em;
}

.${MENU_INNER_CLASS} label {
    display: inline-block;
    width: 100%;
}
.${MENU_INNER_CLASS} :is(input, select) {
    width:100%;
}

#${MENU_ID} h3 {
    margin-bottom: .5em;
}
#${MENU_ID} h4 {
    margin: 0 0 .5em .5em;
    font-size: 1.1em;
}

#${PREVIEW_ID} {
    width: 100%;
    background-color: greenyellow;
    border: black 1px solid;
}
#${PREVIEW_ID} img {
    width: 100%;
    min-height: 3em;
}

#${MENU_TOOLBAR_ID} {
    display: flex;
    position: sticky;
    flex-direction: row-reverse;
    right: 0;
    bottom: 0;
}
`

    const settingData = {
        menuOpen: false,
        repSVG: true,
        repCSS: true,
        repTag: true,
        repCooltime: 5000,
    };

    const uriData = {
        url: {},
        base64: {},
    };

    // キャッシュを保持して軽量化
    let c_urlKeys = null;
    let c_base64Keys = null;

    const isTopWindow = window == window.top;

    const menu_command_id_1 = GM.registerMenuCommand("Open Settings", function (event) {
        menuOpen();
    }, {
        accessKey: "s",
        autoClose: true,
    });

    try {
        GM.addStyle(BASE_CSS);
    }
    catch (e) {
        err(e);
    }

    // ====================================================================================================

    function log(...args){
        if(isTopWindow){
            console.log(`[${PRO_NAME}]`, ...args);
        }
        else{
            console.log(`%c[${PRO_NAME}]`, SUB_FRAME_LOG_STYLE, ...args);
        }
    }
    function err(...args){
        if(isTopWindow){
            console.error(`[${PRO_NAME}]`, ...args);
        }
        else{
            console.error(`%c[${PRO_NAME}]`, SUB_FRAME_LOG_STYLE, ...args);
        }
    }
    function acq(id){
        return document.getElementById(id);
    }
    function isDataUrl(input) {
        return /^data:([a-zA-Z0-9-]+\/[a-zA-Z0-9-]+)?(;[a-zA-Z0-9-]+=[a-zA-Z0-9-]+)*(;base64)?,[a-zA-Z0-9+/]+={0,2}$/.test(input);
    }

    function init(){
        // 設定読み込み
        loadSettingData();
        // URI読み込み
        loadUriData();

        // 読み込み待機
        let si = setInterval(() => {
            if(document?.body){
                clearInterval(si);
                DCL();
            }
        },1000);
    }

    function DCL(){
        log("body読み込み完了確認")

        // メニューを自動で開く(デバッグ用)
        if(settingData.menuOpen){
            menuOpen();
        }

        const observer = new MutationObserver(obs);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: false,
        });
        observer.observe(document.head, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: false,
        });
        let cou = getAllDOM(document.head);
        cou += getAllDOM(document.body);
        log("初回実行-変更数:", cou);

        setTimeout(()=>{
            if(!document.querySelector(`link:is([rel="icon"],[rel="shortcut icon"])`)){
                addFavicon();
            }
        }, 1000);

        // 定期リサーチ設定
        reSearch();
    }

    function obs(mutations){
        let cou = 0;
        for (const mutation of mutations) {
            if(mutation.target){
                cou += getAllDOM(mutation.target);
            }
        }
        if(cou){
            log("obs実行-変更数:", cou);
        }
    }

    function getAllDOM(elem){
        let cou = 0
        if(elem.matches(ALL_DOM_QUERY)){
            cou += changeDOM(elem);
        }
        const elems = elem.querySelectorAll(ALL_DOM_QUERY);
        for(let e of elems){
            cou += changeDOM(e);
        }
        return cou;
    }

    function changeDOM(elem){
        const ec = elem.classList;
        if(ec.contains(REPLACE_CHECK_CLASS)){
            if(!ec.contains(REPLACE_REDETECTION_CLASS)){
                return 0;
            }
        }
        else{
            ec.add(REPLACE_CHECK_CLASS);
        }
        let cou = 0;

        if(c_urlKeys.length){
            // ファビコン置き換え
            cou += replaceFavicon(elem);
            // src置き換え
            cou += replaceSrcElem(elem);
            // style置き換え
            cou += replaceStyleElem(elem);
        }
        if(c_base64Keys.length){
            // svg置き換え(これは必ず最後に設置)
            cou += replaceSvgElem(elem);
        }

        return cou;
    }

    function reSearch(){
        let cou = 0;
        // スタイルタグ再巡回
        cou += styleReSearch();

        if(cou){
            log("reSearch実行-変更数:", cou);
        }
        // wait
        setTimeout(reSearch, 1000);
    }


    function styleReSearch(){
        let cou = 0;
        const elems = document.querySelectorAll(`:is([style],[class]).${REPLACE_CHECK_CLASS}:not(.${REPLACE_REDETECTION_CLASS})`);
        for(let e of elems){
            e.classList.remove(REPLACE_CHECK_CLASS);
            cou += changeDOM(e);
        }
        return cou;
    }

    // ====================================================================================================

    function menuOpen(){
        if(!isTopWindow){
            log("サブフレームなのでメニュー表示をブロック");
            return;
        }
        let menu_elem = acq(MENU_ID);
        if(!menu_elem){
            menu_elem = menuInit();
            updateList();
            log("メニューOpen");
        }
        if(menu_elem.classList.contains(HIDE_CLASS)) {
            menu_elem.classList.remove(HIDE_CLASS);
            updateList();
            log("メニューOpen");
        }
    }

    function menuClose(){
        let menu_elem = acq(MENU_ID);
        if(menu_elem && !menu_elem.classList.contains(HIDE_CLASS)) {
            menu_elem.classList.add(HIDE_CLASS);
            log("メニューClose");
        }
    }

    function menuInit(){
        log("メニューInit");
        let menu_elem = document.createElement("div");
        menu_elem.id = MENU_ID;
        menu_elem.classList.add(REPLACE_EXCLUSION_CLASS);

        menu_elem.innerHTML = `
          <div>
            <h3>画像全置換-設定</h3>
            <div class="${MENU_INNER_CLASS}">
              <h4>画像をローカルから追加</h4>
              <label>
                <input id="${FILE_INPUT_ID}" type="file" accept=".png,.jpeg,.jpg,.gif">
              </label>
            </div>
            <div class="${MENU_INNER_CLASS}">
              <h4>画像をURL(dataURL)から追加</h4>
              <label>
                <input id="${URL_INPUT_ID}" type="url" placeholder="https://example.com/test.png">
                <input id="${URL_ADD_ID}" type="button" value="追加">
              </label>
            </div>
            <div class="${MENU_INNER_CLASS}">
              <h4>登録画像の確認と削除</h4>
              <label>
                <select id="${IMAGE_SELECT_ID}" size="10">
                  <optgroup id="${OPT_URL_ID}" label="img置換URL">
                    <option value="">--指定されていません--</option>
                  </optgroup>
                  <optgroup id="${OPT_BASE64_ID}" label="svg置換URL">
                    <option value="">--指定されていません--</option>
                  </optgroup>
                </select>
                <input id="${IMAGE_DEL_ID}" type="button" value="削除">
              </label>
              <p>プレビュー</p>
              <div id="${PREVIEW_ID}">
                <img class="${REPLACE_EXCLUSION_CLASS}" src="" alt="">
              </div>
            </div>
          </div>
          <div id="${MENU_TOOLBAR_ID}">
            <input id="${MENU_CLOSE_ID}" type="button" value="閉じる">
          </div>
`;
        document.body.appendChild(menu_elem);

        autoEvent("#"+MENU_CLOSE_ID, menuClose);
        autoEvent("#"+FILE_INPUT_ID, uploadFile, "change");
        autoEvent("#"+URL_ADD_ID, uploadUrl);
        autoEvent("#"+IMAGE_SELECT_ID, changePreview, "change");
        autoEvent("#"+IMAGE_DEL_ID, delUrl);

        return menu_elem;
    }

    function autoEvent(elem, callback, type="click"){
        if(typeof elem === "string"){
            elem = document.querySelector(elem);
        }
        elem.addEventListener(type, callback);
    }

    async function loadSettingData(){
        let saveData = await GM.getValue(SD_SETTING_KEY, null);
        if (saveData != null) {
            let jsonData = null;
            try {
                jsonData = JSON.parse(saveData);
                log("設定ロード完了");
            }
            catch (e) {
                err(e);
            }
            if(jsonData != null){
                for (let key in settingData) {
                    if (key in jsonData) {
                        settingData[key] = jsonData[key];
                    }
                }
            }
        }
    }
    async function saveSettingData(){
        try {
            await GM.setValue(SD_SETTING_KEY, JSON.stringify(settingData));
            log("設定保存完了");
        }
        catch (e) {
            err(e);
        }
    }

    async function loadUriData(){
        let saveData = await GM.getValue(SD_URIS_KEY);
        if (saveData != null) {
            let jsonData = null;
            try {
                jsonData = JSON.parse(saveData);
                log("URIロード完了");
            }
            catch (e) {
                err(e);
            }
            if(jsonData != null){
                for (let key in uriData) {
                    if (key in jsonData) {
                        uriData[key] = jsonData[key];
                    }
                }
            }
        }
        updateCache();
    }
    async function saveUriData(){
        try {
            await GM.setValue(SD_URIS_KEY, JSON.stringify(uriData));
            log("URI保存完了");
            updateCache();
        }
        catch (e) {
            err(e);
        }
    }

    function updateCache(){
        c_urlKeys = Object.keys(uriData.url);
        c_base64Keys = Object.keys(uriData.base64);
    }

    function uploadFile(e){
        const file = e.target.files[0];
        e.target.value = "";

        convertBase64(file).then(uri => {
            addUriData("url", uri, file.name);
            addUriData("base64", uri, file.name);
            saveUriData();
            updateList();
        }).catch(err);
    }
    function uploadUrl(){
        let input = acq(URL_INPUT_ID);
        const url = input.value?.trim();
        if(url == ""){
            return;
        }

        if(isDataUrl(url)){
            input.value = "";
            addUriData("url", url, url);
            addUriData("base64", url, url);
            saveUriData();
            updateList();
            return;
        }
        imageUrlToBase64(url).then(uri => {
            input.value = "";
            addUriData("url", url, url);
            addUriData("base64", uri, url);
            saveUriData();
            updateList();
        }).catch(err)
    }
    function addUriData(type, uri, name){
        if(uriData[type]){
            let key = name ?? uri;
            if (key.length > MAX_DATA_NAME_LEN) {
                key = "..." + key.slice(-MAX_DATA_NAME_LEN+3);
            }
            if(uriData[type][key]){
                err(`既に「${key}」は存在します！`);
                return false;
            }
            uriData[type][key] = uri;
        }
        return false;
    }

    function convertBase64(image){
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener("load", e => {
                const base64Text = e.currentTarget.result;

                resolve(base64Text);
                return;
            });
            reader.addEventListener("error", reject);
            reader.readAsDataURL(image);
        })
    }

    function updateList(){
        const optUrl = acq(OPT_URL_ID);
        if(optUrl){
            let ht = "";
            for(let key in uriData.url){
                ht += `<option value="url-${key}">${key}</option>`;
            }
            optUrl.innerHTML = ht;
        }
        const optBase64 = acq(OPT_BASE64_ID);
        if(optBase64){
            let ht = "";
            for(let key in uriData.base64){
                ht += `<option value="base64-${key}">${key}</option>`;
            }
            optBase64.innerHTML = ht;
        }
    }
    function changePreview(e){
        const preview = document.querySelector(`#${PREVIEW_ID} > img`);
        if(preview){
            if(e.target.value == ""){
                return;
            }
            let sp = e.target.value.split("-");
            let key = sp[0];
            if(uriData[key]){
                sp.shift();
                let name = sp.join("-");
                preview.src = uriData[key][name];
                preview.alt = name;
                preview.title = uriData[key][name];
            }
        }
    }
    function imageUrlToBase64(imageUrl) {
        return new Promise(async (resolve, reject) => {
            try {
                // CORSオリジンで怒られるのでゴリ押す
                const proxyUrl = `${CORS_EVASION_URL}?url=${encodeURIComponent(imageUrl)}`;
                const response = await fetch(proxyUrl);
                if (!response.ok) {
                    reject(`HTTP error! status: ${response.status}`);
                    return;
                }
                const jsonResponse = await response.json();
                resolve(jsonResponse.dataUrl);
            } catch (e) {
                err('画像の取得または変換中にエラーが発生しました');
                reject(e);
            }
        });
    }

    function delUrl(){
        const se = acq(IMAGE_SELECT_ID);
        if(se){
            let v = se.value.trim();
            if(v == ""){
                return;
            }
            let sp = v.split("-");
            let key = sp[0];
            if(uriData[key]){
                sp.shift();
                let name = sp.join("-");

                if(!confirm(`データ「${name}(${key})」を削除しますか？\n(この操作は取り消せません)`)){
                    return;
                }
                uriData[key][name] = undefined;
                delete uriData[key][name];
                saveUriData();
                updateList();
            }
        }
    }

    // ====================================================================================================

    function randomArr(arr){
        return arr[Math.random() * arr.length|0];
    }
    function setOriginalData(e, data, type){
        if(e.dataset[DATA_ORIGINAL]){
            return;
        }
        e.dataset[DATA_ORIGINAL] = data;
        e.dataset[DATA_ORIGINAL_TYPE] = type;
    }
    function changeUrlIO(e, key){
        if(key){
            e.dataset[DATA_CHANGE_KEY] = key;
            return key;
        }
        return e.dataset[DATA_CHANGE_KEY];
    }
    function svgImgageHerfIO(e, data){
        if(data){
            e.setAttribute("href", data);
            e.setAttributeNS(XLINK_NS, "href", data);
            return data;
        }
        let hrefValue = e.getAttribute("href");
        if (!hrefValue) {
            hrefValue = e.getAttributeNS(XLINK_NS, "href");
        }
        return hrefValue;
    }
    function autoTagSet(type, e){
        if(e[type]){
            let key = changeUrlIO(e);
            if(key && uriData.url[key] === e[type]){
                return 0;
            }
            if(!key){
                setOriginalData(e, e[type], type);
                key = randomArr(c_urlKeys);
                changeUrlIO(e, key);
            }
            e[type] = uriData.url[key];
            e.classList.add(REPLACE_REDETECTION_CLASS);
            return 1;
        }
        return 0;
    }
    function autoStyleSet(type, e, cs){
        const v = cs.getPropertyValue(type);
        if(v != "none"){
            const an = type.replace(/-([a-z])/g, (m, a) => a.toUpperCase());
            const s = e.style[an];
            const m = s.match(/url\(["'](.+?)["']\)/);
            let key;
            if(m){
                key = changeUrlIO(e);
                if(key && uriData.url[key] === m[1]){
                    return 0;
                }
            }
            else if(/url\(["'].+?["']\)/.test(v)){
                if(!e.classList.contains(REPLACE_REDETECTION_CLASS)){
                    setOriginalData(e, v, type);
                    e.classList.add(REPLACE_REDETECTION_CLASS);
                }
            }
            else{
                return 0;
            }

            if(!key){
                key = randomArr(c_urlKeys);
            }
            let tmp = v.replace(/url\(["'].+?["']\)/g, `url("${uriData.url[key]}")`);
            if(tmp == v){
                return 0;
            }
            changeUrlIO(e, key);
            e.style[an] = tmp;
            //console.log(e, v);

            return 1;
        }
        return 0;
    }


    function addFavicon(){
        log("アイコン生成")
        const icon = document.createElement("link");
        icon.rel = "icon";
        icon.href = "";
        document.head.appendChild(icon);
    }
    function replaceFavicon(e){
        if(e.tagName !== "LINK"){
            return 0;
        }
        switch(e.rel){
            case "icon":
            case "shortcut icon":
                log("アイコン変更")
                break;
            default:
                return 0;
        }
        let key = changeUrlIO(e);
        if(key && uriData.url[key] === e.href){
            return 0;
        }
        if(!key){
            setOriginalData(e, e.href, "href");
            key = randomArr(c_urlKeys);
            changeUrlIO(e, key);
            e.classList.add(REPLACE_REDETECTION_CLASS);
        }
        e.href = uriData.url[key];

        return 1;
    }
    function replaceSrcElem(e){
        let cou = 0;
        cou += autoTagSet("src", e);
        cou += autoTagSet("srcset", e);
        return cou;
    }
    function replaceStyleElem(e){
        let cou = 0;
        const s = getComputedStyle(e);
        cou += autoStyleSet("background-image", e, s);
        cou += autoStyleSet("background", e, s);
        return cou;

    }
    function replaceSvgElem(e){
        if(e.tagName !== "svg"){
            return 0;
        }
        let key = changeUrlIO(e);
        const img = e.querySelector("."+REPLACE_SVG_IMAGE_CLASS);
        if(key && img && e.children.length == 1 && uriData.base64[key] === svgImgageHerfIO(img)){
            return 0;
        }
        if(!key){
            key = randomArr(c_base64Keys);
        }
        setOriginalData(e, "", "svg");
        changeUrlIO(e, key)
        let ne = e.cloneNode(false);
        e.parentNode.replaceChild(ne, e);
        e = ne;
        const image = document.createElementNS(SVG_NS, "image");
        image.classList.add(REPLACE_CHECK_CLASS, REPLACE_SVG_IMAGE_CLASS);
        image.setAttribute("x",0);
        image.setAttribute("y",0);
        image.setAttribute("width","100%");
        svgImgageHerfIO(image, uriData.base64[key]);
        e.appendChild(image);
        e.classList.add(REPLACE_REDETECTION_CLASS);

        return 1;
    }

    init();
})();
