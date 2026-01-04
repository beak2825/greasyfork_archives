// ==UserScript==
// @name         其乐勋章美化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  勋章美化
// @author       楪蘭楓
// @match        *://*keylol.com/*
// @require      http://cdn.staticfile.org/jquery/3.1.1/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/406459/%E5%85%B6%E4%B9%90%E5%8B%8B%E7%AB%A0%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/406459/%E5%85%B6%E4%B9%90%E5%8B%8B%E7%AB%A0%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 用户id
    var uid = "804115";
    // 勋章图片地址
    var img1_url = "https://pic.imgdb.cn/item/5efdcad714195aa59495fb15.jpg";
    var img2_url = "";

    var height = 0;
    var img1 = new Image();
    img1.src = img1_url;
    var img2 = new Image();
    img2.src = img2_url;

    function addNewStyle(newStyle) {
        var styleElement = document.getElementById('styles_js');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.id = 'styles_js';
            document.getElementsByTagName('head')[0].appendChild(styleElement);
        }
        styleElement.appendChild(document.createTextNode(newStyle));
    }

    setTimeout(function() {
        if (img1.width > 0) {
            height += img1.height / img1.width * 180;
        }
        if (img2.width > 0) {
            height += img2.height / img2.width * 180;
        }
        addNewStyle('.medal{height: ' + height + 'px !important;}');
        addNewStyle('.medal img:nth-child(1){content: url(' + img1_url + ');max-width: 180px;}');
        addNewStyle('.medal img:nth-child(2){content: url(' + img2_url + ');max-width: 180px;}');
        addNewStyle('.楪蘭楓 img{content: url(https://pic.imgdb.cn/item/5f0c5fba14195aa5948927a8.png);max-width: 180px;}');
        addNewStyle('.kazekyu img{content: url(https://pic.imgdb.cn/item/5f05b0b814195aa594144d6b.png);max-width: 180px;}');
        addNewStyle('.benaresguw img:nth-child(1){content: url(https://blob.keylol.com/forum/202010/28/234439rhqjkv2t2wkrev4b.jpg);max-width: 180px;}');
    },500);

    setInterval(function() {
        $('[href=suid-' + uid + '].avtm').parent().parent().next().next().next().next().next().addClass('medal');
        $('[href=suid-804115].avtm').parent().parent().next().next().next().addClass('楪蘭楓');
        $('[href=suid-1285681].avtm').parent().parent().next().next().next().addClass('kazekyu');
        $('[href=suid-279184].avtm').parent().parent().next().next().next().next().next().addClass('benaresguw');
    },1000);
})();
