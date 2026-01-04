// ==UserScript==
// @name         B站导航栏添加 '稍后再看'
// @namespace    http://asjun.net/
// @version      0.2
// @description  B站导航栏添加 '稍后再看' 链接
// @author       Asjun
// @match        https://*.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424537/B%E7%AB%99%E5%AF%BC%E8%88%AA%E6%A0%8F%E6%B7%BB%E5%8A%A0%20%27%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%27.user.js
// @updateURL https://update.greasyfork.org/scripts/424537/B%E7%AB%99%E5%AF%BC%E8%88%AA%E6%A0%8F%E6%B7%BB%E5%8A%A0%20%27%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%27.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var time = setInterval(function() {
        var signinNode = document.getElementsByClassName('signin')[0];
        if (signinNode != undefined &&
            signinNode.getElementsByClassName('watchlater')[0] == undefined) {
            signinNode.append(createWatchlater());
        } else {
            clearInterval(time);
        }
    }, 1000);



})();

function createWatchlater() {
    var span = document.createElement('span');
    span.classList.add('name');
    span.innerText = '稍后再看';

    var link = document.createElement('a');
    link.href = 'https://www.bilibili.com/watchlater/#/list';
    link.append(span);

    var node = document.createElement('div');
    node.classList.add('item');
    node.classList.add('watchlater');
    node.append(link);

    return node;
}