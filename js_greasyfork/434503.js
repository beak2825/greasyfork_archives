// ==UserScript==
// @name         神奇宝贝百科脚本
// @namespace    poke52_mianmian_script
// @version      0.30
// @description  神奇宝贝百科脚本，能够为神奇宝贝百科搜索框增加一个在Bing搜索的按钮，方便使用Bing搜索神奇宝贝百科
// @author       JamLin
// @include      *://wiki.52poke.com/*
// @connect      wiki.52poke.com
// @connect      cn.bing.com
// @icon         https://wiki.52poke.com/favicon.ico
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @license      MIT
// @charset      UTF-8
// @downloadURL https://update.greasyfork.org/scripts/434503/%E7%A5%9E%E5%A5%87%E5%AE%9D%E8%B4%9D%E7%99%BE%E7%A7%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/434503/%E7%A5%9E%E5%A5%87%E5%AE%9D%E8%B4%9D%E7%99%BE%E7%A7%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var btn = '<input id="bingSearch" type="button" title="Bing一下" value="Bing" style="background-color: transparent; position: absolute; top: 1px; bottom: 1px; right: 30px; min-width: 24px; border: 0; padding: 0; cursor: pointer; white-space: nowrap; overflow: hidden; z-index: 1;">';
    var input = $('#simpleSearch');
    input.append(btn);
    $('#bingSearch').click(() => {
        var key = $('#searchInput').val();
        if (!(typeof key == "undefined" || key == null || key == "")) {
            var url = 'https://cn.bing.com/search?q=' + key + '+site:wiki.52poke.com'
            window.open(url);
        }
    });
})();