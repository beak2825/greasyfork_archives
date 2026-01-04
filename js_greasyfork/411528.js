// ==UserScript==
// @name         去你妈的复制链接跳转
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  简书不复制跳转
// @author       阿土
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.0/dist/jquery.min.js
// @match        *://*.jianshu.com/*
// @match        *://*.mcbbs.net/*
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/411528/%E5%8E%BB%E4%BD%A0%E5%A6%88%E7%9A%84%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/411528/%E5%8E%BB%E4%BD%A0%E5%A6%88%E7%9A%84%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
//<a href="https://links.jianshu.com/go?to=https%3A%2F%2Fanaconda.org%2Fbioconda%2Frepo" target="_blank" one-link-mark="yes">https://anaconda.org/bioconda/repo</a>
(function() {
    'use strict';
    $(".ouvJEz a").attr("href", function(i,origValue){
        console.log(origValue);
    return unescape(origValue.replace("https://links.jianshu.com/go?to=",""));
    });
    $(".plhin a").attr("href", function(i,origValue){
        console.log(origValue);
    return unescape(origValue.replace("https://www.mcbbs.net/plugin.php?id=link_redirect&target=",""));
    });
    // Your code here...
         })();