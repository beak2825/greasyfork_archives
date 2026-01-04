// ==UserScript==
// @name         Steamcommunity Links Unblocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Steamcommunity Links Unblocker 解除steam社区链接屏蔽限制
// @author       You
// @match        https://steamcommunity.com/app/*
// @match        https://steamcommunity.com/id/*/recommended/*
// @match        https://steamcommunity.com/profiles/*/recommended/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374310/Steamcommunity%20Links%20Unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/374310/Steamcommunity%20Links%20Unblocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let white_list = ['https://pan.baidu.com'];

    function do_unlock() {
        let doms = Array.from(document.querySelectorAll('a[style="display: none;"]'));
        for (let link_item of doms) {
            for (let white_url of white_list) {
                if (link_item.innerHTML.startsWith(white_url)) {
                    link_item.style.display = 'inline-block';
                    link_item.style.color = 'yellow';
                }
            }
        }
    }


    // hook scrolling load
    let cards_root = document.getElementById('AppHubCards');
    if (cards_root) {
        var observer = new MutationObserver(function(mutationsList, observer) {
            console.log('do unlock');
            do_unlock();
        });

        observer.observe(cards_root, {childList: true, subtree: true});
    }


    // automatic run on load
    do_unlock();
})();