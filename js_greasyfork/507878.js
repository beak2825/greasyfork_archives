// ==UserScript==
// @name         克隆并显示游民星空的Mid2L_tit和Mid2L_con元素
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  克隆Mid2L_tit和Mid2L_con元素，隐藏其他内容，设置背景为白色，移除背景图片，删除动态生成的ADback元素，并设置Mid2L_con宽度为100%，同时删除克隆内容中的referencecontent元素。
// @author       Your Name
// @match        https://www.gamersky.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507878/%E5%85%8B%E9%9A%86%E5%B9%B6%E6%98%BE%E7%A4%BA%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E7%9A%84Mid2L_tit%E5%92%8CMid2L_con%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/507878/%E5%85%8B%E9%9A%86%E5%B9%B6%E6%98%BE%E7%A4%BA%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E7%9A%84Mid2L_tit%E5%92%8CMid2L_con%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏整个页面内容
    document.documentElement.style.display = 'none';

    // 删除ADback元素的函数
    function deleteADbackElement() {
        var adbackElement = document.getElementById('ADback');
        if (adbackElement) {
            adbackElement.remove();
            console.log('ADback元素已删除。');
        } else {
            console.log('未找到ADback元素。');
        }
    }

    // 监听DOM变化以捕捉动态添加的ADback元素
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                deleteADbackElement();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 从给定元素中删除referencecontent元素的函数
    function removeReferenceContent(element) {
        var referenceContentElements = element.getElementsByClassName('referencecontent');
        while(referenceContentElements.length > 0) {
            referenceContentElements[0].remove();
        }
    }

    // 等待页面完全加载
    window.addEventListener('load', function() {
        // 选择类名为 'Mid2L_tit' 和 'Mid2L_con' 的元素
        var mid2L_tit_elements = document.getElementsByClassName('Mid2L_tit');
        var mid2L_con_elements = document.getElementsByClassName('Mid2L_con');

        // 如果找到这些元素
        if (mid2L_tit_elements.length > 0 || mid2L_con_elements.length > 0) {
            // 创建一个新的容器
            var container = document.createElement('div');

            // 克隆 'Mid2L_tit' 元素
            for (var i = 0; i < mid2L_tit_elements.length; i++) {
                var clonedMid2L_tit = mid2L_tit_elements[i].cloneNode(true);
                removeReferenceContent(clonedMid2L_tit); // 删除referencecontent元素
                container.appendChild(clonedMid2L_tit);
            }

            // 克隆 'Mid2L_con' 元素并将其宽度设置为100%
            for (var j = 0; j < mid2L_con_elements.length; j++) {
                var clonedMid2L_con = mid2L_con_elements[j].cloneNode(true);
                clonedMid2L_con.style.width = '100%'; // 设置宽度为100%
                removeReferenceContent(clonedMid2L_con); // 删除referencecontent元素
                container.appendChild(clonedMid2L_con);
            }

            // 清空正文内容
            document.body.innerHTML = '';

            // 设置背景颜色为白色，移除背景图片
            document.body.style.backgroundColor = 'white';
            document.body.style.backgroundImage = 'none';
            document.body.style.background = 'none';

            // 将包含克隆元素的容器添加到正文
            document.body.appendChild(container);

            // 在主内容加载后删除ADback元素
            deleteADbackElement();

            // 显示整个页面内容
            document.documentElement.style.display = '';
        } else {
            console.log('未找到类名 "Mid2L_tit" 或 "Mid2L_con" 的元素。');
        }
    }, false);
})();
