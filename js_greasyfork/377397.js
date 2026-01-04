// ==UserScript==
// @name             巴哈姆特 - 覆寫小屋樣式
// @namespace        -
// @version          20190207
// @description      RT
// @author           LianSheng
// @match            https://home.gamer.com.tw/*
// @require          https://greasyfork.org/scripts/377302-general-source-code-injection-tool/code/General%20Source%20Code%20Injection%20Tool.js?version=667827
// @run-at           document-start
// @grant            GM_getValue
// @grant            GM_setValue
// @compatible       chrome >= 71
// @compatible       firefox >= 65
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/377397/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E8%A6%86%E5%AF%AB%E5%B0%8F%E5%B1%8B%E6%A8%A3%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/377397/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E8%A6%86%E5%AF%AB%E5%B0%8F%E5%B1%8B%E6%A8%A3%E5%BC%8F.meta.js
// ==/UserScript==

// 內部版本號: 2.0.0

(function() {
    'use strict';
    let debug = false;

    // 解決由淺色字導致導航欄搜尋框文字難以辨讀的問題。無論是否啓用小屋覆蓋。////
    let nav_input = `
input#gsc-i-id1 {
    color: #000;
}
`;
    addStyleImportant(nav_input, "html", "tm_nav_input_style");
    //////////////////////////////////////////////////////////////////

    let url_string = location.href;
    let url = new URL(url_string);
    let owner = url.searchParams.get("owner");
    let sn = `sn${url.searchParams.get("sn")}`;

    let html = `
<div style="position: absolute; top: 10px; left: 30vw; height: 24px">
    <input id="tm_open_custom_style" type="checkbox" style="width: 20px; height: 20px;">
    <span style="user-select: none; height: 22px; line-height: 22px; font-size: 22px;"> 開啓小屋覆寫樣式 </span>
</div>
`;

    if(owner != null) {
        owner = owner.toLowerCase();
        if(GM_getValue(owner)) enable();

        // 頁面讀取後才載入額外元件
        window.onload = function(){
            addHTML(html, "div#BH-top-data");
            let check_enable = document.querySelector("input#tm_open_custom_style");

            try{
                check_enable.addEventListener("change", function(){
                    console.log(check_enable.checked);
                    if(check_enable.checked) {
                        enable();
                        GM_setValue(owner, Math.round(new Date().getTime()/1000));
                    } else {
                        disable();
                        GM_setValue(owner, false);
                    }
                });
            } catch (e) {
                // 添加監聽失敗，終止腳本
                console.log(`%c【錯誤】%c在 %c"${check_enable}" %c嘗試 %caddEventListener %c失敗：\n"${e}"`, "font-size: 16px; color: red", "color: auto", "color: blue", "color: auto", "color: brown", "color: auto");
                console.log(`%c【腳本已終止】`, "font-size: 16px; color: red");
                return 0;
            }

            if(GM_getValue(owner)) check_enable.checked = true;
        };
    // 可能在創作或 homeindex.php
    } else {
        // 從創作編號 sn 判斷
        if(GM_getValue(sn)){
            let temp_owner = GM_getValue(sn);
            if(GM_getValue(temp_owner)) {
                enable();
                console.log("從 sn 判斷啓用覆蓋樣式");
            }
        } else {
            console.log(GM_getValue(sn));
        }


        // 頁面讀取後才載入額外元件
        window.onload = function(){
            // 針對創作頁面
            if(document.body.querySelector("img.msghead.gamercard")) owner = document.querySelector("img.msghead.gamercard").getAttribute("data-gamercard-userid");
            // 針對 homeindex.php
            if(document.body.querySelector("img.MSG-myavatar")) owner = document.querySelector("img.MSG-myavatar").src.match(/[a-zA-Z0-9]+\.png$/)[0].replace(/\.png$/, "");
            if(owner != null) {
                owner = owner.toLowerCase();
                if(GM_getValue(owner)) enable();

                addHTML(html, "div#BH-top-data");
                let check_enable = document.querySelector("input#tm_open_custom_style");

                try{
                    check_enable.addEventListener("change", function(){
                        console.log(check_enable.checked);
                        if(check_enable.checked) {
                            enable();
                            GM_setValue(owner, Math.round(new Date().getTime()/1000));
                        } else {
                            disable();
                            GM_setValue(owner, false);
                        }
                    });
                } catch (e) {
                    // 添加監聽失敗，終止腳本
                    console.log(`%c【錯誤】%c在 %c"${check_enable}" %c嘗試 %caddEventListener %c失敗：\n"${e}"`, "font-size: 16px; color: red", "color: auto", "color: blue", "color: auto", "color: brown", "color: auto");
                    console.log(`%c【腳本已終止】`, "font-size: 16px; color: red");
                    return 0;
                }

                if(GM_getValue(owner)) check_enable.checked = true;
            } else {
                console.log("判斷此頁爲例外。\n（非勇者小屋，無須開啓樣式覆蓋）");
            }
        };
    }

        // 判斷是否在創作相關頁面，用於預判是否載入設定 ///////////////////////////

    // 針對創作清單頁面
    (function(){
        if( url_string.match(/creation\.php/) != null || url_string.match(/creationCategory\.php/) != null) {
            owner = owner.toLowerCase();
            let full_response = get(url_string);
            let sn_origin = full_response.match(/href=\"creationDetail\.php\?sn=\d+/g);

            let prev_sn = "";
            // 擷取 sn，將其標示爲該創作頁面的勇者
            for(let i=0; i<sn_origin.length; i++){
                let single_sn = sn_origin[i].match(/\d+$/)[0];
                if( single_sn != prev_sn ) {
                    GM_setValue(`sn${single_sn}`, owner);
                    prev_sn = single_sn;
                }
            }
        }
    })();

    // 針對單篇創作頁面（底下關聯創作可能涵蓋其他勇者）（TODO）
    (function(){
        if( url_string.match(/creationDetail\.php/) != null ) {
            let creation_detail = get(location.href).replace(/\n/g, "");
            // 相關創作（對於縮圖不是勇造的文章將無法取得資訊）
            let relation_list = creation_detail.match(/class=\"HOME-mainbox1a\ BC5\">.+?creationDetail\.php\?sn=\d+?\"><img.+?l\/i\/.+?\/[a-zA-Z0-9]+?\.png\" \/>/g);
            if(relation_list != null) {
                for(let i=0; i<relation_list.length; i++){
                    let sn_author = relation_list[i].match(/i\/.+?\/([a-zA-Z0-9]+?)\.png/)[1];
                    let sn = relation_list[i].match(/creationDetail\.php\?sn=(\d+)/)[1];

                    GM_setValue(`sn${sn}`, sn_author);
                }
            }
            // 最底之前一篇與後一篇
            window.onload = function(){
                if(document.body.querySelector("img.msghead.gamercard")) {
                    owner = document.querySelector("img.msghead.gamercard").getAttribute("data-gamercard-userid");
                    let prev_sn = creation_detail.match(/<span>前一篇：.+?creationDetail\.php\?sn=(\d+?)"/);
                    let next_sn = creation_detail.match(/<span>後一篇：.+?creationDetail\.php\?sn=(\d+?)"/);
                    if(prev_sn != null) GM_setValue(`sn${prev_sn[1]}`, owner);
                    if(next_sn != null) GM_setValue(`sn${next_sn[1]}`, owner);
                    // 本篇文章
                    GM_setValue(sn, owner);
                }
            }
        }
    })();

    // 針對同標籤作品搜尋
    (function(){
        if( url_string.match(/search\.php/) != null ) {
            let same_tag_origin = get(location.href).replace(/\n/g, "");

            // 同標籤作品主要清單
            let main_list = same_tag_origin.match(/<span\ class=\"ST1\">.+?class=\"BH-txtmore\ msggoon\">/g);
            for(let i=0; i<main_list.length; i++){
                let sn_author = main_list[i].match(/href=\"\/\/home\.gamer\.com\.tw\/([a-zA-Z0-9]+?)\"/)[1];
                let sn = main_list[i].match(/href=\"creationDetail\.php\?sn=(\d+?)\"/)[1];

                GM_setValue(`sn${sn}`, sn_author);
            }

            // 最多人訂閱的小屋之最新創作
            let popular_list = same_tag_origin.match(/home\.gamer\.com\.tw\/home\.php\?owner\=.+?\"\ class=\"HOME-rbox3A\".+?href=\"creationDetail\.php\?sn=\d+?\">/g);
            for(let i=0; i<popular_list.length; i++){
                let sn_author = popular_list[i].match(/href=\"\/\/home\.gamer\.com\.tw\/home\.php\?owner=([a-zA-Z0-9]+?)\"/)[1];
                let sn = popular_list[i].match(/href=\"creationDetail\.php\?sn=(\d+?)\"/)[1];

                GM_setValue(`sn${sn}`, sn_author);
            }
        }
    })();
    ////////////////////////////////////////////////////////////////////

    function enable() {
        let css = `
/* 背景 */
body {
    background-image: url("");
    background-color: #0009;
}

/* 所有標題 */
h1, h2, h3, h4, h5, h6 {
    background-image: url("");
    background-color: #0000;
    color: #fff;
}

/* 導航欄 */
#BH-main_menu, #BH-pathbox {
    background-image: url("");
    background-color: #0004;
}

a#mmenunow{
    background-color: #0004;
}

/******************** 首頁 ********************/
/* 左側區塊 */
div[class^="BH-lbox MSG-box"] {
    background-image: url("");
    background-color: #0004;
    color: #fff;
}

/* 右側區塊 */
div[class^=BH-rbox] {
    background-image: url("");
    background-color: #0004;
}

/* 大聲說 */
#BH-talkmain2 {
    background-image: url("");
    background-color: #0004;
    border: 0;
}

/* 個人資訊（主圖） */
div.MSG-mainpic {
    background-image: url("");
    background-color: #0004;
    color: #fff;
}

/* 按鈕群內個別按鈕 */
a.BH-slave_btnA {
    background-image: url("");
    background-color: #0000;
}
a.BH-slave_btnA:hover {
    background-image: url("");
    background-color: #0000;
}

/* 其他勇者資訊（如訪客、追蹤者） */
a.user-info {
    background-image: url("");
    background-color: #0008;
    color: #fff;
}

/* 訪客留言 */
.MSG-list18 > div[id^=msg] {
    color: #fff;
}
.MSG-list18 > div[id^=msg] > .ST1 {
    color: #bbb;
}

/* 雜項 */
.HOME-mainbox1c {
    background-image: url("");
    background-color: #0004;
}

/******************** 叭啦 ********************/
[class^=BH-master] * {
    background-image: url("");
    background-color: #0004;
    color: #fff;
}

#noMsg {
    background-image: url("");
    background-color: #0004;
    color: #fff;
}

/******************** 創作 ********************/
.BH-lbox {
    background-image: url("");
    background-color: #0004;
    color: #fff;
}
a.msgdel, .prev, .next, .BH-search {
    background-image: url("");
    background-color: #0004;
    color: #fff;
}

/* 分頁選單 */
p.BH-pagebtnA > a:not(.pagenow) {
    background-image: url("");
    background-color: #0004;
}

/* 創作底下按鈕 */
.AB1, .AB2, .AB3, .AB4 {
    background-image: url("");
    background-color: #0004;
}

/* 創作留言回覆 */
.msgreport {
    background-image: url("");
    background-color: #0004;
}

/******************** 精華 ********************/
.BH-table, .TBC2 {
    background-image: url("");
    background-color: #0004;
    color: #fff;
    border: 0;
}

/******************** ACG ********************/
.ACG-star {
    background: url(https://i2.bahamut.com.tw/acg/star_s.png);
    height: 23px;
}

/******************** 好友圈 ********************/
dialog * {
    background-image: url("");
    background-color: #0004;
    color: #fff;
}

/******************** 右上通知區塊 ********************/
[id^=topBarMsg_light_] *, [id^=topBarMsg_] * {
    background-image: url("");
    background-color: #000d;
    color: #ddd;
}

/******************** 通用元素 ***********************/
li, span, p {
    color: #fff;
}

input, button, textarea {
    border: 1px white solid;
    background-color: #0004;
    color: #fff;
}

a, a * {
    color: #ffc;
}
a:hover, a *:hover {
    color: #f00;
}
`;
        addStyleImportant(css, "html", "tm_insert_custom_style");
    }

    function disable() {
        document.querySelector("style#tm_insert_custom_style").remove();
    }

    // HTTP GET
    function get(url, set=false) {
        let temp;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                temp = xhr.responseText;
            }
        }
        xhr.open('GET', url, set);
        xhr.send(null);

        return temp;
    }

    // Debug 模式：提供公開函數以利測試。
    if(debug) {
        console.log(`${GM_info.script.name}\nDebug mode: ON`);
        unsafeWindow.tm_debug = function() {
            return {
                get: function (url, set=false) {
                    return get(url, set);
                }
            }
        }();
    }
})();