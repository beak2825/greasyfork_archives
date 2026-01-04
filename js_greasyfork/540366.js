// ==UserScript==
// @name 🈲css new
// @namespace   ScriptCat
// @include       *

// @exclude   *sina*
// @exclude   *pan*
// @exclude   *baidu*
// @exclude  *weather.com.*
// @exclude   *file:///android_asset/*
// @exclude   *bing.com*
// @exclude   *google*
// @exclude   *youtube*
// @exclude   *123.com*
// @exclude   *ysepan*
// @exclude   *jianguoyun*
// @exclude   *jd.com*


// @exclude    https://go.itab.link/#

// @exclude  *www.fxnzw.com*



// @grant       none
// @version     1.0
// @author      -
// @run-at       document-body
// @description css字体大小 内容屏蔽  id # class .

// @downloadURL https://update.greasyfork.org/scripts/540366/%F0%9F%88%B2css%20new.user.js
// @updateURL https://update.greasyfork.org/scripts/540366/%F0%9F%88%B2css%20new.meta.js
// ==/UserScript==

/*body > [href^="固定/批量匹配"]{}无^固定指定
body > embed[id][src]{display:none !important}

.com:*.js?v=17$third-party

||stescud.com^$third-party
! 广告网址 stescud.com

m.biquge365.net^$script

m.xsbiquge.la###chaptercontent > p:nth-of-type(1)

www.sudugu.com##a[href="/xianxia/"]


*/


!(function() {
    'use strict';

    // 通过CSS预先隐藏元素，避免闪烁
    var css = `
div.cccvvv{font-size:22px}
8html{margin-left: 5px;margin-right:45px}
#content,
#cContent,
.content,
.container,
#mycontent,
div#htmlContent,
DIV#chaptercontent,
DIV.chapter-content,
#txt,DIV.txt,DIV.con,
DIV.txtnav,
DIV.articlecontent,
DIV#novelcontent,
div#nr1,
DIV#Lab_Contents,
DIV#neirong1{background:#fff;color:#000;font-size:23px;line-height: 38px;text-indent: 0em;padding-left: 26px;padding-right:24px}
DIV.###{background:#fff;color:#000;font-size:4px;padding-left: 26px;padding-right:24px}


P.cp{background:#fff;color:#000;font-size:23px;line-height: 38px;text-indent: 0em;}


DIV.fixed.bottom-48px.right-21px.z-1{display:none !important}
/*qidian*/

DIV#device,
DIV.read_tj{display:none !important}
#zuoyoufy{display:none !important}
script{display:none!important;}


DIV.vsbdl,DIV.sqtio,DIV#y2mmzi3uno{display:none!important;}




    `;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // 确保元素在DOM加载后依然隐藏
    document.addEventListener('DOMContentLoaded', function() {
        var elements = ['A.btn-addbs','DIV.m-setting'];
        elements.forEach(function(selector) {
            var element = document.querySelector(selector);
            if (element) {
                element.style.display = 'none';
            }
        });
    });


})();


