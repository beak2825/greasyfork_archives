// ==UserScript==
// @name          css - YouTube 隱藏「更多影片」
// @namespace     hbl917070
// @description	  YouTube 隱藏「更多影片」
// @author        hbl917070(深海異音)
// @homepage      https://home.gamer.com.tw/homeindex.php?owner=hbl917070
// @include       https://www.youtube.com/embed/*
// @include       https://www.youtube-nocookie.com/embed/*
// @run-at        document-start
// @version       0.2
// @downloadURL https://update.greasyfork.org/scripts/391025/css%20-%20YouTube%20%E9%9A%B1%E8%97%8F%E3%80%8C%E6%9B%B4%E5%A4%9A%E5%BD%B1%E7%89%87%E3%80%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/391025/css%20-%20YouTube%20%E9%9A%B1%E8%97%8F%E3%80%8C%E6%9B%B4%E5%A4%9A%E5%BD%B1%E7%89%87%E3%80%8D.meta.js
// ==/UserScript==



/**
 *
 * 最後更新日期：2020/02/27
 *
 * YouTube嵌入到其他網站上後，只要暫停影片，下面就會跳出一排「更多影片」的視窗，非常的擾人
 * 安裝這個腳本後，就不會出現這個視窗
 *
 */


(function () {

    var css = `
    /*更多影片*/
    .ytp-pause-overlay {
        display: block !important;
        overflow:  hidden !important;
        width:0px !important;
        height: 0px !important;
        pointer-events: none !important;
        opacity: 0 !important;
    }
    /*廣告*/
    .ytp-ad-image-overlay, .ytp-ad-image-overlay *{
        display: block !important;
        overflow:  hidden !important;
        width:0px !important;
        height: 0px !important;
        pointer-events: none !important;
        opacity: 0 !important;
    }
    `;



    /* 插入 CSS */
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("html");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            document.documentElement.appendChild(node);
        }
    }



})();
