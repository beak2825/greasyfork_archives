// ==UserScript==
// @name         B站导航栏添加 'Wiki'
// @namespace    http://asjun.net/
// @version      0.2
// @description  B站导航栏添加 'Wiki' 链接
// @author       Asjun
// @match        https://*.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425372/B%E7%AB%99%E5%AF%BC%E8%88%AA%E6%A0%8F%E6%B7%BB%E5%8A%A0%20%27Wiki%27.user.js
// @updateURL https://update.greasyfork.org/scripts/425372/B%E7%AB%99%E5%AF%BC%E8%88%AA%E6%A0%8F%E6%B7%BB%E5%8A%A0%20%27Wiki%27.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var time = setInterval(function () {
        var nav = document.getElementsByClassName('nav-link-ul')[0];
        if (nav != undefined &&
            document.getElementById('wiki') == null) {
            nav.append(createWikiLink());
        } else {
            clearInterval(time);
        }
    }, 1000);

})();


function createWikiLink() {
    var link = document.createElement('a');
    link.classList.add('link');
    link.id = 'wiki';
    link.href = 'https://wiki.biligame.com/wiki/%E9%A6%96%E9%A1%B5';
    link.text = 'Wiki'

    var node = document.createElement('li');
    node.classList.add('nav-link-item');
    node.append(link);

    return node;
}