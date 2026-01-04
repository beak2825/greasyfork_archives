// ==UserScript==
// @name         简书净化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  清理简书文章底部和右边的推荐，拥有更好的阅读体验
// @author       You
// @match        https://www.jianshu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474268/%E7%AE%80%E4%B9%A6%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/474268/%E7%AE%80%E4%B9%A6%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    console.log("净化简书")
    const lefts = document.getElementsByClassName("ouvJEz")

    for (let i = 0; i < lefts.length; i++) {
        const e = lefts[i]
        const eChildrens = e.getElementsByClassName("_3eq_La")
        if (eChildrens.length > 0) {
            // 移出中间部分
            e.style.display = "none";
            break
        }
    }
    const rights = document.getElementsByClassName("_2OwGUo")
    const hotStory = rights[0].childNodes[0]

    hotStory.style.display = "none";

    const domNodeInsertedFuc = function (e) {
        const buttons = document.getElementsByClassName("_23ISFX-close")
        if (buttons && buttons.length > 0) {
            const butt = buttons[0]
            setTimeout(() => {
                butt.click()
            }, 200);
        }

    }

    document.addEventListener('DOMNodeInserted', domNodeInsertedFuc, false);

})();