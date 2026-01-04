// ==UserScript==
// @name         Danbooru Tag Extractor
// @version      1.3.1
// @description  Extracts data-tag-name values from a Danbooru page
// @author       Nina_
// @match        https://danbooru.donmai.us/posts/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1387362
// @downloadURL https://update.greasyfork.org/scripts/514407/Danbooru%20Tag%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/514407/Danbooru%20Tag%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {

        const tags = document.querySelectorAll('[data-tag-name]');

        const tagNames = Array.from(tags).map(tag => tag.getAttribute('data-tag-name'));

        const tagString = tagNames.join(', ');

        console.log(tagString);

        const outputElement = document.createElement('div');
        outputElement.style.position = 'fixed';
        outputElement.style.bottom = '10%'; //Position
        outputElement.style.right = '10%'; //Position
        outputElement.style.width = '500px'; // Initial width
        outputElement.style.height = '300px'; // Initial height
        outputElement.style.backgroundColor = 'white';
        outputElement.style.padding = '10px';
        outputElement.style.border = '1px solid black';
        outputElement.style.color = 'black';
        outputElement.style.resize = 'both';
        outputElement.style.overflow = 'auto';
        outputElement.textContent = tagString;
        document.body.appendChild(outputElement);
    });
})();


/*
 * Greasy Fork Description:
 * This userscript extracts all tags (data-tag-name) from Danbooru posts and displays them in a box at the bottom-right corner of the page.
 * It allows users to easily copy the tags for use in other applications. The initial size of the box is set to 500x300 pixels.
 *
 * Greasy Fork 简介：
 * 这个脚本会从 Danbooru 帖子中提取所有标签（data-tag-name），并将它们显示在页面右下角的一个框中。标签以英文逗号分隔开。
 * 用户可以方便地复制这些标签用于其他应用程序。初始框的大小设置为 500x300 像素。
 */

