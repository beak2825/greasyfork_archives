// ==UserScript==
// @name         Aqours Club EasyViewer
// @name:zh-CN   水水俱乐部护眼查看器
// @namespace    undefined
// @version      0.1
// @description  Make it easy for loveliver to read aqours club article
// @description:zh-cn 由于水水会员文章配色字号难于观看，创制脚本使其易于观看
// @author       ckyOL
// @match        https://lovelive-aqoursclub.jp/mob/news/diarKijiShw.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375307/Aqours%20Club%20EasyViewer.user.js
// @updateURL https://update.greasyfork.org/scripts/375307/Aqours%20Club%20EasyViewer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 字体颜色
    document.body.style.color = '#000';
    // 背景颜色
    var article = document.getElementsByClassName("entry");
    article[0].style.background = '#F6F1E3';
    // 字体大小
    var font = document.getElementsByClassName("entry-body");
    font[0].style['font-size'] = '24px';
})();