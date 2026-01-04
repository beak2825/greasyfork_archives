// ==UserScript==
// @name         知乎黑暗模式
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  黑暗模式
// @license      GNU GPLv3
// @author       lz
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @run-at document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/484475/%E7%9F%A5%E4%B9%8E%E9%BB%91%E6%9A%97%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/484475/%E7%9F%A5%E4%B9%8E%E9%BB%91%E6%9A%97%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==
let menu1 = GM_registerMenuCommand('黑暗模式', function () {
    if(location.href.endsWith("?theme=dark")||location.href.endsWith("?theme=light")){
        var stringlength = location.href.length
        if(location.href.endsWith("?theme=dark")){
              var newstring= location.href.substring(0, stringlength-11);
        }else{newstring= location.href.substring(0, stringlength-12);
        }
             location.assign(newstring+'?theme=dark');
    }else{location.assign(location.href+'?theme=dark');
}
}, 'o');

let menu2 = GM_registerMenuCommand('浅色模式', function () {
    if(location.href.endsWith("?theme=dark")||location.href.endsWith("?theme=light")){
        var stringlength = location.href.length
        if(location.href.endsWith("?theme=dark")){
              var newstring= location.href.substring(0, stringlength-11);
        }else{newstring= location.href.substring(0, stringlength-12);
        }
        location.assign(newstring+'?theme=light');
    }else{location.assign(location.href+'?theme=light');
}
}, 'o');