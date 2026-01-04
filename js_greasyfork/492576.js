// ==UserScript==
// @name         Bangumi.tv 净化
// @version      1.2
// @description  将 Bangumi.tv 中其他用户的所有活动例如评分、评论等信息隐藏，仅留下制作信息、内容介绍等客观信息。保留了收藏盒方便记录。
// @author       takuzzz
// @match        *://bgm.tv/*
// @match        *://bangumi.tv/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/65521
// @downloadURL https://update.greasyfork.org/scripts/492576/Bangumitv%20%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/492576/Bangumitv%20%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Array of text contents to match and remove
    const textContentsToRemove = [
        "讨论版", "评论", "吐槽箱", "推荐本条目的目录", "谁看这部动画?", "Sumomo Board", "小组话题", "热门条目讨论"
    ];

    // Array of element IDs to remove
    const idsToRemove = [
        "subjectPanelIndex", "subjectPanelCollect", "crtPanelCollect", "robot",
        "award2023", "home_tml"
    ];

    const classToRemove = [
        "rateInfo", "rank",
    ];

    // Array of attributes to match and remove elements
    const attributesToRemove = [
        { attribute: "rel", value: "v:rating" }
    ];

    // Function to remove elements with specific text content
    function removeElementsByTextContent() {
        // Find all h2 elements with class 'subtitle'
        const subtitles = document.querySelectorAll('h2.subtitle');

        // Loop through the found h2 elements
        subtitles.forEach(function(subtitle) {
            // Check if the text content is in the array
            if (textContentsToRemove.includes(subtitle.textContent.trim())) {
                // Get the parent div of the h2 element
                const parentDiv = subtitle.closest('div');
                // Remove the parent div if it exists
                if (parentDiv) {
                    parentDiv.remove();
                }
            }
        });
    }

    // Function to remove elements by ID
    function removeElementsById() {
        idsToRemove.forEach(function(id) {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
        });
    }

    function removeElementsByClass() {
        classToRemove.forEach(function(className) {
            const elements = document.getElementsByClassName(className);
            while (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
        });
    }

    // Function to remove elements by specific attributes
    function removeElementsByAttribute() {
        attributesToRemove.forEach(function(attr) {
            const elements = document.querySelectorAll(`[${attr.attribute}="${attr.value}"]`);
            elements.forEach(function(element) {
                element.remove();
            });
        });
    }


    removeElementsByTextContent();
    removeElementsById();
    removeElementsByClass();
    removeElementsByAttribute();

})();