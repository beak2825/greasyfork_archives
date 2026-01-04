// ==UserScript==
// @name         超星批量打分去除人数限制
// @description  增加200人和1000人，超星批量打分去除人数限制 
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://mooc1.chaoxing.com/work/batchMarkingScore?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448217/%E8%B6%85%E6%98%9F%E6%89%B9%E9%87%8F%E6%89%93%E5%88%86%E5%8E%BB%E9%99%A4%E4%BA%BA%E6%95%B0%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/448217/%E8%B6%85%E6%98%9F%E6%89%B9%E9%87%8F%E6%89%93%E5%88%86%E5%8E%BB%E9%99%A4%E4%BA%BA%E6%95%B0%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    function addHtml(parent, type = "div", attrs = {}, click = undefined) {
        const element = document.createElement(type);
        for (const attr in attrs) {
            element[attr] = attrs[attr];
            element.setAttribute(attr, attrs[attr]);
        }
        click && element.addEventListener("click", click);
        parent.appendChild(element);
        return element;
    }
    addHtml(document.querySelector("#pageCount"),"Option",{Value:"200",innerText:"200"})
    addHtml(document.querySelector("#pageCount"),"Option",{Value:"1000",innerText:"1000"})
    // Your code here...
})();