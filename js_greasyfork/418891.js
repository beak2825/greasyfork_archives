// ==UserScript==
// @name         豆瓣标记器
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  不用关注，也能给豆瓣用户加标签
// @author       YCY_857092
// @match        https://www.douban.com/people/*/
// @match        https://www.douban.com/group/*

// @require      https://greasyfork.org/scripts/418879-blockedlist-857092/code/BlockedList_857092.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_removeValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_info
// @grant        GM_unregisterMenuCommand
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/418891/%E8%B1%86%E7%93%A3%E6%A0%87%E8%AE%B0%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/418891/%E8%B1%86%E7%93%A3%E6%A0%87%E8%AE%B0%E5%99%A8.meta.js
// ==/UserScript==

// just let type script work.
(function() { function require(){}; require("greasemonkey"); })();

(function() {
    'use strict';

    let blockedList = new BlockedList('MyBlockList');
    if (window.location.href.startsWith('https://www.douban.com/people/')) {
        onPeoplePage();
    } else if (window.location.href.startsWith('https://www.douban.com/group/topic/')) {
        onTopicPage();
    } else if (window.location.href.startsWith('https://www.douban.com/group/')) {
        onGroupPage();
    }

    addYCYBanner();

    function getUserIdFromUrl(url) {
        var match = url.match(/https:\/\/www.douban.com\/people\/([^\/]+)\//);
        if (!match) return undefined;
        return match[1];
    }

    function tagNameInElement(element, userId) {
        element.innerHTML = element.innerHTML + '#' + blockedList.getTag(userId);
        element.style.color = "red";
    }

    function onPeoplePage() {
        var url = window.location.href;
        let userId = getUserIdFromUrl(url);
        updateProfile();
        let opt = document.querySelector('.user-opt');
        var blockButtonElement = createButtonElement();
        opt.insertBefore(blockButtonElement, opt.children[2]);

        function createButtonElement() {
            let blockButtonElement = document.createElement('a');
            blockButtonElement.text = blockedList.hasId(userId) ? '取消标记' : '标记此人';
            blockButtonElement.classList.add('a-btn');
            blockButtonElement.classList.add('mr5');
            blockButtonElement.href = '/';
            blockButtonElement.onclick = () => {
                if (blockedList.hasId(userId)) {
                    blockedList.removeId(userId);
                } else {
                    var tag = prompt("输入自定义标签","");
                    if (tag != undefined && tag != "") {
                        blockedList.addId(userId, tag);
                    }
                }
                location = location;
                return false;
            }
            return blockButtonElement;
        }

        function updateProfile() {
            if(blockedList.hasId(userId)) {
                let profile = document.querySelector('#db-usr-profile h1');
                tagNameInElement(profile, userId);
            }
        }
    }

    function onGroupPage() {
        var tbody = document.querySelectorAll('tbody');
        if(tbody && tbody.length == 2) {
            var topics = tbody[1].querySelectorAll('a');
            if(topics) {
                for (var i = 1; i < topics.length; i=i+2) {
                    var a = topics[i];
                    var userId = getUserIdFromUrl(a.href);
                    if (blockedList.hasId(userId)) {
                        tagNameInElement(a, userId);
                    }
                }
            }
        }
    }

    function onTopicPage() {

        var author = document.querySelector('.topic-content .topic-doc h3');
        if(author) {
            var a = author.querySelector('a');
            var userId = getUserIdFromUrl(a.href);
            if (blockedList.hasId(userId)) {
                tagNameInElement(a, userId);
            }
        }




        var relatives = document.querySelectorAll('.topic-reply li .reply-doc h4');
        if(relatives) {
            relatives.forEach(relative => {
                var a = relative.querySelector('a');
                var userId = getUserIdFromUrl(a.href);
                if (blockedList.hasId(userId)) {
                    tagNameInElement(a, userId);
                }
            });
        }

        var pubdates = document.querySelectorAll('.pubdate');
        if(pubdates) {
            pubdates.forEach(pubdate => {
                var a = pubdate.querySelector('a');
                var userId = getUserIdFromUrl(a.href);
                if (blockedList.hasId(userId)) {
                    tagNameInElement(a, userId);
                }
            });
        }
    }

    function addYCYBanner() {
        var a = document.createElement('a');
        a.href = "https://m.weibo.cn/u/5644764907";
        var img = document.createElement('img');
        img.src = "https://s3.ax1x.com/2020/12/20/rdpMDK.jpg";
        img.border = "0";
        img.alt = "rdpMDK.jpg";
        a.appendChild(img);
        var banner = document.querySelector('#db-nav-sns .nav-primary, #db-nav-group .nav-primary');
        banner.appendChild(a);
    }

})();

