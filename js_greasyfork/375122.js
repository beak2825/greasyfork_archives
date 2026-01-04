// ==UserScript==
// @name         csdntools
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Freelifer
// @match        *://blog.csdn.net/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375122/csdntools.user.js
// @updateURL https://update.greasyfork.org/scripts/375122/csdntools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
    console.log('csdntools start...');
    // var $ = $ || window.$;
    // $('.hide-article-box,.text-center').remove();
    document.getElementsByClassName("hide-article-box text-center")[0].remove()
    document.getElementsByClassName("comment-box")[0].remove()
    document.getElementsByClassName("recommend-box")[0].remove()

    // $("div.article_content").removeAttr("style");
    document.getElementById('article_content').removeAttribute('style');
    console.log('csdntools end...');
})();