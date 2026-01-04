// ==UserScript==
// @name         2024研三奖学金成果公示
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  2024研三奖学金成果公示辅助展示插件
// @author       白白小草
// @match        https://sb7ir84f2o.jiandaoyun.com/dash/67348d00614ca908c6021f97
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jiandaoyun.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517264/2024%E7%A0%94%E4%B8%89%E5%A5%96%E5%AD%A6%E9%87%91%E6%88%90%E6%9E%9C%E5%85%AC%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/517264/2024%E7%A0%94%E4%B8%89%E5%A5%96%E5%AD%A6%E9%87%91%E6%88%90%E6%9E%9C%E5%85%AC%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    window.onload = function() {
        setTimeout(function() {
            // 获取所有具有类名 'dash-gap' 的元素
            var elements = document.querySelectorAll('.dash-gap');
            elements.forEach(function(element) {
                element.parentNode.removeChild(element);
            });
            elements = document.querySelectorAll('.dash-gap');
            elements.forEach(function(element) {
                element.parentNode.removeChild(element);
            });
            elements = document.querySelectorAll('.react-grid-item.container-content-wrapper.cssTransforms.react-resizable-hide.react-resizable');
            elements.forEach(function(element, index) {
                if (index === 3 ){
                    element.style.height = '800px';
                    element.style.width = '98%';
                    element.style.transform = 'translate(10px, 100px)';
                }else if (index === 6) {
                    element.style.height = '800px';
                    element.style.width = '98%';
                    element.style.transform = 'translate(10px, 1740px)';
                } else if (index === 5) {
                    element.style.height = '800px';
                    element.style.width = '918px';
                    element.style.transform = 'translate(925px, 920px)';
                } else if (index === 4) {
                    element.style.height = '800px';
                    element.style.width = '910px';
                    element.style.transform = 'translate(10px, 920px)';
                }
            });
        }, 1000);

    };
})();