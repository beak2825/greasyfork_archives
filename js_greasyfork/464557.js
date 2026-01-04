// ==UserScript==
// @name         NickGPT
// @namespace    https://ugpt.nickname4th.vip/
// @version      0.10
// @description  Use NickGPT on Google Search page!
// @author       InJeCTrL
// @match        *://www.google.com/search*
// @match        *://www.google.com.hk/search*
// @match        *://www.google.co.uk/search*
// @match        *://www.baidu.com*
// @match        *://www.baidu.com/s*
// @match        *://so.toutiao.com/search*
// @match        *://cn.bing.com/search*
// @match        *://www.bing.com/search*
// @match        *://duckduckgo.com/?*
// @match        *://www.so.com/s?*
// @match        *://www.sogou.com/*
// @match        *://*.search.yahoo.com/search*
// @grant        window.onurlchange
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://s1.ax1x.com/2023/04/21/p9E40Ve.png
// @require      https://code.jquery.com/jquery-3.6.0.js
// @require      https://cdn.bootcdn.net/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @resource css https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464557/NickGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/464557/NickGPT.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getSearchContent() {
        var url = window.location.href;
        if (url.indexOf("www.baidu.com") != -1) {
            return document.getElementById('kw').value;
        } else if (url.indexOf("www.google.") != -1) {
            return document.getElementsByTagName('textarea')[0].textContent;
        } else if (url.indexOf("so.toutiao.com") != -1) {
            return document.getElementsByTagName('input')[0].value;
        } else if (url.indexOf("bing.com") != -1) {
            return document.getElementById('sb_form_q').value;
        } else if (url.indexOf("duckduckgo.com") != -1) {
            return document.getElementById('search_form_input').value;
        } else if (url.indexOf("www.so.com") != -1) {
            return document.getElementById('keyword').value;
        } else if (url.indexOf("www.sogou.com") != -1) {
            return document.getElementById('upquery').value;
        } else if (url.indexOf("search.yahoo.com") != -1) {
            return document.getElementById('yschsp').value;
        }
    }

    function searchKeyword() {
        document.getElementById('nickgpt-wnd')
            .contentWindow.postMessage({
            "nickGPT": getSearchContent()
        }, '*');
    }

    function nickgptHandler(message) {
        if (message.data == "chatready") {
            searchKeyword();
        }
    }

    function insertWnd() {
        var box = document.createElement("div");
        box.id = "nickgpt-box";
        if (window.location.href.indexOf("www.so.com") != -1) {
            document.body.firstElementChild.appendChild(box);
        } else {
            document.body.insertBefore(box, document.body.firstChild);
        }

        var funcBtn = document.createElement("div");
        funcBtn.innerText = "停用NickGPT";
        funcBtn.id = "funcBtn";
        box.appendChild(funcBtn);

        var enabled = GM_getValue("enabled_nickgpt");
        insertStyle(enabled);
        if (enabled === true) {
            var ifr = document.createElement("iframe");
            ifr.id = "nickgpt-wnd";
            ifr.src = "https://ugpt.nickname4th.vip";
            GM_addElement(box, 'iframe', {
                src: "https://ugpt.nickname4th.vip",
                id: "nickgpt-wnd"
            });
            window.addEventListener("message", nickgptHandler);
            funcBtn.onclick = function(){
                GM_setValue("enabled_nickgpt", false);
                window.location.reload();
            }

            if (window.onurlchange === null &&
                (window.location.href.indexOf("www.so.com") != -1 || window.location.href.indexOf("www.baidu.com") != -1)) {
                window.addEventListener('urlchange', (info) => {
                    searchKeyword();
                });
            }
        } else {
            funcBtn.innerText = "启用NickGPT";
            funcBtn.onclick = function(){
                GM_setValue("enabled_nickgpt", true);
                window.location.reload();
            }
        }

        $(function () {
            $("#nickgpt-box").draggable();
        });
    }

    function insertStyle(enabled) {
        if (enabled === true) {
            var css = "\
#nickgpt-box {\
border: 1px solid #cceff5;\
position: fixed;\
right: 10%;\
top: 8%;\
width: 30%;\
height: 80%;\
z-index: 50000;\
background: #1E90FF;\
cursor: grab;\
border-radius: 25px;\
box-shadow: 1px 1px 1px 1px grey;\
}\
#nickgpt-wnd {\
border: none;\
width: 100%;\
height: calc(100% - 40px);\
z-index: 50001;\
background: white;\
border-radius: 0px 0px 25px 25px;\
}\
#funcBtn {\
float: right;\
color: black;\
height: 40px;\
width: 110px;\
font-size: 16px;\
display: flex;\
justify-content: center;\
align-items:center;\
background: #7FFFD4;\
border-radius: 0px 25px 0px 0px;\
cursor: pointer;\
}";
        } else {
            var css = "\
#nickgpt-box {\
border: 1px solid #cceff5;\
position: fixed;\
right: 10%;\
top: 8%;\
width: 30%;\
height: 40px;\
z-index: 50000;\
background: #1E90FF;\
cursor: grab;\
border-radius: 25px;\
box-shadow: 1px 1px 1px 1px grey;\
}\
#funcBtn {\
float: right;\
color: black;\
height: 40px;\
width: 110px;\
font-size: 16px;\
display: flex;\
justify-content: center;\
align-items:center;\
background: #7FFFD4;\
border-radius: 0px 25px 25px 0px;\
cursor: pointer;\
}";
        }

        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.children[0].appendChild(style);
    }

    insertWnd();
})();