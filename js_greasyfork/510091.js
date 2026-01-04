// ==UserScript==
// @name         Disable Auto Translation for Specific Elements
// @namespace    http://1998x-stack.github.io
// @version      1.0
// @description  防止自动翻译数学公式、表格、图表等复杂内容
// @author       XM
// @match        *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510091/Disable%20Auto%20Translation%20for%20Specific%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/510091/Disable%20Auto%20Translation%20for%20Specific%20Elements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 给指定的元素及其子元素添加translate属性
     * @param {NodeListOf<Element>} elements - 需要处理的元素列表
     */
    function addTranslateNoToElements(elements) {
        elements.forEach(element => {
            element.setAttribute('translate', 'no');
            
            // 获取该元素的所有子元素并添加translate属性
            const childTags = element.getElementsByTagName('*');
            Array.from(childTags).forEach(tag => {
                tag.setAttribute('translate', 'no');
            });
        });
    }

    // 获取所有需要添加translate属性的元素
    const mathElems = document.querySelectorAll('.ltx_Math, .ltx_equationgroup, .ltx_equation, .ltx_figure, .ltx_table');
    const captionElems = document.querySelectorAll('.ltx_caption.ltx_centering');

    // 给这些元素及其子元素添加translate="no"属性
    addTranslateNoToElements(mathElems);
    addTranslateNoToElements(captionElems);

})();
