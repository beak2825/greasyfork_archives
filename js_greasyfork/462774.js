// ==UserScript==
// @name         谷歌学术期刊查询
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于谷歌学术期刊查询，点击引用按钮会出现查询期刊按钮
// @author       You
// @match        https://scholar.google.com/*
// @match        https://scholar.google.com.hk/*
// @icon         https://www.google.com/scholar/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462774/%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AF%E6%9C%9F%E5%88%8A%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/462774/%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AF%E6%9C%9F%E5%88%8A%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const targetElement = document.querySelector('#gs_cit-x');

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const addedNode = mutation.addedNodes[0];
                if (addedNode.id === 'gs_citt') {
                    let venue = document.querySelectorAll('.gs_cith')[1].nextElementSibling.querySelector('td > :first-child > i').innerText;
                    console.log(venue)
                    const link = document.createElement('a');
                    link.href = 'https://www.myhuiban.com/search?SearchForm%5Bkey%5D='+venue;
                    link.innerText = "查询期刊"
                    link.target = '_blank';
                    document.querySelector('#gs_citi').appendChild(link)
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

})();