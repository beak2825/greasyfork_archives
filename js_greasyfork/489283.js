// ==UserScript==
// @name         添加DOTA2版块到S1快速访问
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  将DOTA2版块添加到saraba1st论坛的导航栏中，并移除了导航栏多余的元素
// @author       S1傻狗
// @match        https://*.stage1st.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489283/%E6%B7%BB%E5%8A%A0DOTA2%E7%89%88%E5%9D%97%E5%88%B0S1%E5%BF%AB%E9%80%9F%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/489283/%E6%B7%BB%E5%8A%A0DOTA2%E7%89%88%E5%9D%97%E5%88%B0S1%E5%BF%AB%E9%80%9F%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove specific links
    function removeLinks() {
        document.querySelectorAll('a').forEach(link => {
            if (link.textContent.includes('s1义父捐助') || link.textContent.includes('购买邀请码')) {
                link.parentElement.remove();
            }
        });
    }

    // Function to add the DOTA2 link
    function addDota2Link(position) {
        // Create a new list item
        var newItem = document.createElement('li');

        // Create a new anchor element
        var newLink = document.createElement('a');
        newLink.href = 'https://stage1st.com/2b/forum-138-1.html';
        newLink.textContent = 'DOTA2';

        // Append the anchor to the list item
        newItem.appendChild(newLink);

        // Get the navigation bar
        var navBar = document.querySelector('#nv ul');

        // Insert the new item at the specified position
        if (position === 'first') {
            navBar.insertBefore(newItem, navBar.firstChild);
        } else if (position === 'last') {
            navBar.appendChild(newItem);
        }
    }

    // Register menu commands to set the position
    GM_registerMenuCommand('将DOTA2板块置于导航栏最前', function() {
        GM_setValue('dota2LinkPosition', 'first');
        location.reload();
    });

    GM_registerMenuCommand('将DOTA2板块置于导航栏最后', function() {
        GM_setValue('dota2LinkPosition', 'last');
        location.reload();
    });

    // Get the saved position from settings
    var position = GM_getValue('dota2LinkPosition', 'first');

    // Remove specific links
    removeLinks();

    // Add the DOTA2 link at the desired position
    addDota2Link(position);
})();