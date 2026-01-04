// ==UserScript==
// @name         CSDN Reformater
// @namespace    http://www.csdn.net/
// @version      0.1.2
// @description  hide everything except author information and main content.
// @author       Mianjune Hong
// @license      GPL version 3
// @match        *://blog.csdn.net/*/article/details/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/369834/CSDN%20Reformater.user.js
// @updateURL https://update.greasyfork.org/scripts/369834/CSDN%20Reformater.meta.js
// ==/UserScript==


(function () {
    'use strict';

    $('#btn-readmore').click();
    $('script').remove();

    var info = $('<aside style="float: none;"></aside>');
    $('#asideProfile > .aside-title').remove();
    info.append($('#asideProfile'));
    info.mouseleave(function(){$('#asideProfile').css('display','none');});
    $('#mainBox>main div.article-title-box').mouseenter(function(){$('#asideProfile').css('display','');}).mouseleave(function(){$('#asideProfile').css('display','none');});

    $('#mainBox>main div.article-title-box').append(info);
    $('#mainBox').attr('style', 'margin: 2em auto;max-width: 66em;');

    $('html>head').append('<style type="text/css">body>*, #mainBox>*, main>*, recommend-ad-box{display:none!important;}#mainBox, #mainBox>main, main>.blog-content-box, main, #author>aside{display:block!important;} main{width:100%!important;} body{min-width:0!important;background:#f5f6f7!important;}</style>');
    // div.recommend-box{display: block !important;padding-top: 6em;}

    info.mouseleave();
})();
