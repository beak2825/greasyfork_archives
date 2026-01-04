// ==UserScript==
// @name         网页鼠标自定义
// @namespace    http://tampermonkey.net/MyCursor-MyStyle
// @version      2020.08.06.2
// @description:zh-CN  自定义你的网页鼠标样式，在www.cursor.cc安装新的鼠标样式
// @description:zh-TW  自定義你的網頁滑鼠樣式，在www.cursor.cc安裝新的滑鼠樣式
// @description:en-US  Customize your mouse style, install various different mouse styles on www.cursor.cc
// @author       PY-DNG
// @include      *
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @description 自定义你的网页鼠标样式，在www.cursor.cc安装新的鼠标样式
// @downloadURL https://update.greasyfork.org/scripts/407983/%E7%BD%91%E9%A1%B5%E9%BC%A0%E6%A0%87%E8%87%AA%E5%AE%9A%E4%B9%89.user.js
// @updateURL https://update.greasyfork.org/scripts/407983/%E7%BD%91%E9%A1%B5%E9%BC%A0%E6%A0%87%E8%87%AA%E5%AE%9A%E4%B9%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //样式处理部分
    let AddStyle = function(NewStyle, SytleId){
        if(SytleId && document.getElementById(SytleId)){
            document.getElementById(SytleId).remove();
        }
        let NewStyleElement = document.createElement("style");
        NewStyleElement.type = "text/css";
        if(SytleId){NewStyleElement.id = SytleId;};
        NewStyleElement.appendChild(document.createTextNode(NewStyle));
        let HeadElement = document.getElementsByTagName("head")[0];
        HeadElement.appendChild(NewStyleElement);
    };
    //当前域名
    let site = window.location.href.replace(/https?:\/\//, '');
    site = site.substring(0, site.indexOf('/'));
    //默认鼠标样式
    let defaultCursor = "body { cursor: url('data:image/x-icon;base64,AAACAAEAICAAAAAAAACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAABgAAAAcAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6PAX/ejwF/wAAAAAAAAAAejwF/3o8Bf8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAejwF/72de/+9nXv/ejwF/3o8Bf+1cWn/tXFp/3o8Bf8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6PAX/vZ17///jxP+9nXv/vZ17/72de/+1cWn/ejwF/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHo8Bf+9nXv/vZ17/72de/+9nXv/vZ17/7Vxaf96PAX/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6PAX/2cvK/72de/+9nXv/vZ17/72de/+9nXv//+PE/7Vxaf96PAX/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHo8Bf/Zy8r/2cvK/72de///48T/vZ17/72de/+9nXv/tXFp/3o8Bf8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHo8Bf96PAX/ejwF/72de/+9nXv/ejwF/3o8Bf96PAX/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6PAX/2cvK/72de/96PAX/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6PAX/ejwF/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAejwF/3o8Bf8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6PAX/tXFp/3o8Bf8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHo8Bf+9nXv/tXFp/3o8Bf96PAX/ejwF/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAejwF/72de///48T/tXFp/7Vxaf96PAX/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6PAX/vZ17/72de/+1cWn/ejwF/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHo8Bf//48T/vZ17/3o8Bf8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAejwF/72de/96PAX/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6PAX/ejwF/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHo8Bf8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA///////////////////////////////////////////////////////////////////////////5n///8A////AP///wD///4Af//+AH///wD////D////5///8/////H////wP///8D////B////w////8f////P////3////8='), auto; }";
    if(GM_getValue('default', '') === '') {GM_setValue('default', defaultCursor); };
    //当前鼠标样式
    let myCursor = GM_getValue(site, GM_getValue('default', ''));
    //忽略的域名
    let ignoreList = GM_getValue('ignoreList', '');
    //样式的Element.id
    let cursorId = 'mycursor';
    //样式应用函数
    let applyCursor = function() {
        //如果忽略此域名就不添加鼠标样式
        if(ignoreList.indexOf(site) !== -1){return; };
        /*
        已弃用，换用下面所写的优先级更高的内联样式表
        -------------------------------------
        //去除原有鼠标样式定义
        document.querySelector('body').style.cursor = '';
        //添加自定义鼠标样式
        AddStyle(myCursor, cursorId);
        */
        //内联样式文本
        let insideCursorText = myCursor.replace(/body *{ *cursor *: */, '').replace(/ *; *}/, '')
        if(site === 'www.baidu.com') {
            //百度首页有特殊处理过，需要专门适配
            document.getElementById('wrapper').style.cursor = insideCursorText;
            document.getElementById('head').style.cursor = insideCursorText;
            document.getElementById('s_tab').style.cursor = insideCursorText;
            document.getElementById('wrapper_wrapper').style.cursor = insideCursorText;
        } else {
            //无特殊情况，直接在body上设置.style.cursor内联样式
            document.querySelector('body').style.cursor = insideCursorText;
        }
    };
    window.addEventListener('load', applyCursor);
    //用户交互部分
    let lang = navigator.appName=="Netscape"?navigator.language:navigator.userLanguage;
    let menu={};
    switch (lang){
        case "zh-CN":
            menu={
                specific: "为此网站自定义鼠标样式",
                on_off: "",
                //------------display------------
                ignore: "忽略此网站",
                apply: "在此网站上启用自定义鼠标样式",
                enterCSS: "请输入新的CSS内容："
            };
            break;
        case "zh-TW":
            menu={
                specific: "為此網站自定義滑鼠樣式",
                on_off: "",
                //------------display------------
                ignore: "忽略此網站",
                apply: "在此網站上啟用自定義滑鼠樣式",
                enterCSS: "請輸入新的CSS內容："
            };
            break;
        default:
            menu={
                specific: "Set Another Cursor for this site only",
                on_off: "",
                //------------display------------
                ignore: "Ignore this site",
                apply: "Apply Cursor on this site",
                enterCSS: "Enter new CSS style: "
            };
            break;
    }
    if(ignoreList.indexOf(site) === -1) {
        menu.on_off = menu.ignore;
    } else {
        menu.on_off = menu.apply;
    }
    //自定义鼠标样式函数
    let setCursor = function() {
        myCursor = prompt(menu.enterCSS, myCursor);
        GM_setValue('default', myCursor);
        applyCursor();
    };
    //是否忽略此网站函数
    let on_off = function() {
        if(ignoreList.indexOf(site) === -1) {
            ignoreList = ignoreList + '|' + site;
            GM_setValue('ignoreList', ignoreList);
            document.getElementById(cursorId).parentElement.removeChild(document.getElementById(cursorId));
        } else {
            ignoreList = ignoreList.replace('|' + site, '');
            GM_setValue('ignoreList', ignoreList);
            applyCursor();
        }
    };
    //为当前网站单独定义鼠标样式
    let specific = function() {
        myCursor = prompt(menu.enterCSS, myCursor);
        GM_setValue(site, myCursor);
        applyCursor();
    };
    GM_registerMenuCommand(menu.specific, specific);
    GM_registerMenuCommand(menu.on_off, on_off);
    //www.cursor.cc添加安装功能
    if(site === 'www.cursor.cc') {
        //添加安装按钮（PS: 白嫖别人写好的样式果然就是爽！doge）
        let b = document.getElementById('download_copy_form').parentElement.children[2];
        let installButton = document.createElement('a');
        installButton.className = b.className;
        installButton.style.cssText = b.style.cssText;
        installButton.style.cursor = 'pointer';
        installButton.textContent = '------ Install ------';
        installButton.id = 'installer'
        b.parentElement.insertBefore(installButton, b.parentElement.children[3]);
        installButton.addEventListener('click', function() {
            /*let all = document.getElementsByClassName('howto')[1].children[1].textContent;
            myCursor = all.replace('<style type=\"text/css\">', '').replace('</style>', '');*/
            myCursor = 'body { cursor: ' + document.getElementsByClassName('icon_row')[0].style.cursor + '; }';
            console.log('myCursor = "' + myCursor + '"');
            GM_setValue('default', myCursor);
            applyCursor();
        });
    }
})();