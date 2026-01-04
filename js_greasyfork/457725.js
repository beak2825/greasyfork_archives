// ==UserScript==
// @name         百度首页编辑
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description 隐藏热搜，删除广告和垃圾元素
// @author       捈荼
// @license Apache License 2.0
// @match        https://www.baidu.com
// @run-at document-idie
// @grant GM_getValue
// @grant GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/457725/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%BC%96%E8%BE%91.user.js
// @updateURL https://update.greasyfork.org/scripts/457725/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%BC%96%E8%BE%91.meta.js
// ==/UserScript==

// Commented by ChatGPT.

// Declare an array containing the elements to be toggled
var hotSearchElemrnt = [
    document.getElementsByClassName("c-font-normal c-color-gray2 hot-refresh")[0],
    document.getElementsByClassName("s-news-rank-content")[0]
];

// Function to toggle the display style of the elements in the hotSearchElemrnt array
function _changeState() {
    hotSearchElemrnt.forEach((e) => { e.style.display = e.style.display == 'none' ? '' : 'none'; });
}

(function () {
    'use strict';

    // Check if the user has previously decided whether to remove trash elements
    if (GM_getValue('settingsDoRemoveTrushElements', -1) == -1) {
        // If not, prompt the user to confirm whether they want to remove trash elements
        const settingsRemoveTrushElements = confirm('是否需要删除广告等元素？');
        // Store the user's decision in local storage
        GM_setValue('settingsDoRemoveTrushElements', settingsRemoveTrushElements);
    }
    // If the user has previously confirmed they want to remove trash elements, or if they just confirmed it
    if (GM_getValue('settingsDoRemoveTrushElements', -1) == true) {
        // Declare an object containing the class and id names of trash elements
        const trushElement = {
            class: ['s-news-list-wrapper c-container c-feed-box', 's-menu-item current', 'water-container', 's-loading s-opacity-border4-top'],
            id: ['s_menu_mine', 's-top-left', 'u1', 'bottom_layer', 's_side_wrapper']
        };
        // Remove all elements with the specified class names
        trushElement.class.forEach((ele) => { document.getElementsByClassName(ele)[0].remove(); });
        // Remove all elements with the specified id names
        trushElement.id.forEach((id) => { document.getElementById(id).remove(); });
    }

    // Check if the user has previously decided whether to hide hot search
    if (GM_getValue('settingsDoHideHotSearch', -1) == -1) {
        // If not, prompt the user to confirm whether they want to hide hot search
        const settingsRemoveTrushElements = confirm('是否需要隐藏热搜？');
        // Store the user's decision in local storage
        GM_setValue('settingsDoHideHotSearch', settingsRemoveTrushElements);
    }
    // If the user has previously confirmed they want to hide hot search, or if they just confirmed it
    if (GM_getValue('settingsDoHideHotSearch', -1) == true) {
        // Toggle the display style of the hot search elements
        _changeState();
        // Create a new image element
        const newIMG = document.createElement('img');
        // Set the source of the image to a data URI
        newIMG.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAUBAMAAAD1iJl/AAAAKlBMVEVHcEyRlaORlaORlaKQlaSRlaORlaOSlKSRlaOQlqOQlaKRlaORlaORlaMHlKbCAAAADXRSTlMAM/IhHV1lGVxhHO1ry8GEFgAAAHRJREFUGNNdzbENgCAQheFn7KwIG9DYmdjYG1dwHEvncBdnoL9dRE7wHVSX+79wGE7w63fgiI5XPq64JNCmm+TGJsy8JJX2gVHQ4Ai5v4DHn9WpNvIl0q9fNbc182ntBikwKLPRopeJRZk1qDlXWIuAZS7TA0pEMyTsvCrkAAAAAElFTkSuQmCC';
        // Set the alt attribute of the image
        newIMG.alt = 's-resize';
        // Set the width and height of the image
        newIMG.width = '17';
        newIMG.height = '10';
        // Set the id of the image
        newIMG.id = 's-resize-usr-modified';
        // Set the inline style of the image
        newIMG.style = 'margin: 0px 0px 0px 10px';
        // Get the parent element of the image
        const parent = document.getElementsByClassName('c-font-medium c-color-t title-text')[0];
        // Remove the child element (arrow icon) from the parent element
        parent.removeChild(document.getElementsByClassName('c-icon arrow')[0]);
        // Append the new image to the parent element
        document.getElementsByClassName('c-font-medium c-color-t title-text')[0].appendChild(newIMG);
        // Get the hot search toggle link element
        const keyLink = document.getElementsByClassName('s-opacity-border1-bottom')[0].firstElementChild;
        keyLink.setAttribute("href", "javascript:;");
        keyLink.onclick = () => {
            // Toggle the display style of the hot search elements
            _changeState();
            // Modify the image
            const img = document.getElementById('s-resize-usr-modified');
            if (img.getAttribute('alt') == 's-resize-1') {
                img.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAjBAMAAABm2DcrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAqUExURUdwTJGVo5GVo5GVopCVpJGVo5GVo5KUpJGVo5CWo5CVopGVo5GVo5GVoweUpsIAAAANdFJOUwAz8iEdXWUZXGEc7WvLwYQWAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAP0lEQVQoz2NgOcIAA0aXBGDM2LuKcNG7cGFGXYSw0EALK8OEc+9exRRFqEUygW6CSGHWi3D/akT4sk+B0AwMADIvMyQyQzjIAAAAAElFTkSuQmCC');
                img.setAttribute('alt', 's-resize-2');
                img.setAttribute('width', '10');
                img.setAttribute('height', '17');
            } else {
                img.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAUBAMAAAD1iJl/AAAAKlBMVEVHcEyRlaORlaORlaKQlaSRlaORlaOSlKSRlaOQlqOQlaKRlaORlaORlaMHlKbCAAAADXRSTlMAM/IhHV1lGVxhHO1ry8GEFgAAAHRJREFUGNNdzbENgCAQheFn7KwIG9DYmdjYG1dwHEvncBdnoL9dRE7wHVSX+79wGE7w63fgiI5XPq64JNCmm+TGJsy8JJX2gVHQ4Ai5v4DHn9WpNvIl0q9fNbc182ntBikwKLPRopeJRZk1qDlXWIuAZS7TA0pEMyTsvCrkAAAAAElFTkSuQmCC');
                img.setAttribute('alt', 's-resize-1');
                img.setAttribute('width', '17');
                img.setAttribute('height', '10');
            }
            return false;
        }
    }
})();