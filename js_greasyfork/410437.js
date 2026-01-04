// ==UserScript==
// @name        愛看書吧廣告移除+功能修復
// @namespace   https://www.youtube.com/channel/UCXgnKgUBxUlRABoWK7a5A5Q
// @description 愛看書吧廣告移除、修復基本功能、新增快速加入書籤功能
// @author       The Walking Fish
// @include     https://m.aikanshu8.com/*
// @version     1.1
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/410437/%E6%84%9B%E7%9C%8B%E6%9B%B8%E5%90%A7%E5%BB%A3%E5%91%8A%E7%A7%BB%E9%99%A4%2B%E5%8A%9F%E8%83%BD%E4%BF%AE%E5%BE%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/410437/%E6%84%9B%E7%9C%8B%E6%9B%B8%E5%90%A7%E5%BB%A3%E5%91%8A%E7%A7%BB%E9%99%A4%2B%E5%8A%9F%E8%83%BD%E4%BF%AE%E5%BE%A9.meta.js
// ==/UserScript==


function doc_keyUp(e) {
    switch (e.keyCode) {
        case 37:
            document.getElementsByClassName('btn btn-default')[0].click()
            break;
        case 13:
            document.getElementsByClassName('btn btn-default')[1].click()
            break;
        case 39:
            document.getElementsByClassName('btn btn-default')[2].click()
            break;
        case 107:
            document.getElementsByClassName('red one-pan-link-mark')[0].click()
            break;
        case 109:
            document.getElementsByClassName('btn btn-default')[3].click()
            break;

    }
}
document.addEventListener('keyup', doc_keyUp, false);
document.getElementsByClassName('beautiful')[0].remove()