// ==UserScript==
// @name         抖音电商直播小工具
// @namespace    http://tampermonkey.net/
// @version      v0.2.2
// @description  可以在抖店中控台和订单界面删除部分元素以提高岗位的阅读效率
// @author       https://github.com/itsanstar
// @match        https://fxg.jinritemai.com/ffa/morder/order/list*
// @match        https://fxg.jinritemai.com/ffa/live_control/live*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinritemai.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484160/%E6%8A%96%E9%9F%B3%E7%94%B5%E5%95%86%E7%9B%B4%E6%92%AD%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/484160/%E6%8A%96%E9%9F%B3%E7%94%B5%E5%95%86%E7%9B%B4%E6%92%AD%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

        function removeElementsD() {
        var elementsToRemove = [
            'style_left-side-bar__2OzUz',
            'index_wrapper__3UiS6',
            'style_alertContainer__2f5Ib styles_globalAlert__fFjFj',
            'index_wrapper__3PrnQ index_c1__6OYRh',
            'styles_normalHeader',
            'styles_normalHeader__1s2WR styles_newNavBar__1JkGX styles_responsive__2hrXm',
            'index__expandPanel___OilIc', // Repeat? If this is an error, it should be fixed.
            'styles_normalHeader',
            'index_wrapper__3UiS6',
            'index_wrapper__3PrnQ index_c1__6OYRh',
            'styles_normalHeader__1s2WR styles_newNavBar__1JkGX styles_responsive__2hrXm',
            'styles_appNavBarPlace__3wszh',
            'index_bg__3rmRG',
            'styles_bannerWrapper__nGEA8'
        ];

        elementsToRemove.forEach(function(className) {
            var elements = document.getElementsByClassName(className);
            for (var i = 0; i < elements.length; i++) {
                elements[i].remove();
            }
        });
    }

    function addButton(label, clickHandler) {
        var button = document.createElement('button');
        button.textContent = label;
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.addEventListener('click', clickHandler);
        document.body.appendChild(button);
    }
    addButton('Clear', removeElementsD);
})();
