// ==UserScript==
// @name         智能链接文字替换器
// @namespace    http://greasyfork.org/
// @version      1.3
// @description  替换敏感词链接文字为红色提示，悬停显示原始内容
// @author       jaiming888
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532539/%E6%99%BA%E8%83%BD%E9%93%BE%E6%8E%A5%E6%96%87%E5%AD%97%E6%9B%BF%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/532539/%E6%99%BA%E8%83%BD%E9%93%BE%E6%8E%A5%E6%96%87%E5%AD%97%E6%9B%BF%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const KEYWORDS = ["伪娘", "扶她","雌堕"];
    const REPLACE_TEXT = "已屏蔽";
    const STYLE_CONFIG = {
        textColor: "#ff2222",    // 警示红色
        hoverDelay: "300ms",     // 悬停响应延迟
        tooltip: true            // 启用浏览器原生提示
    };

    const keywordRegex = new RegExp(
        KEYWORDS.map(k =>
            k.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')
        ).join('|'),
        'i'
    );


    function processLink(link) {
        if(!keywordRegex.test(link.textContent)) return;


        const original = {
            text: link.textContent,
            href: link.href,
            title: link.title || link.textContent
        };


        const visualSpan = document.createElement('span');
        visualSpan.innerHTML = REPLACE_TEXT;
        visualSpan.style.cssText = `
            color: ${STYLE_CONFIG.textColor};
            cursor: pointer;
            position: relative;
        `;


        const wrapper = document.createElement('a');
        wrapper.href = original.href;
        wrapper.title = original.title;  
        wrapper.replaceChildren(visualSpan);


        link.replaceWith(wrapper);


        addHoverEffect(wrapper, original);
    }


    function addHoverEffect(element, original) {
        let hoverTimer;

        element.addEventListener('mouseenter', () => {
            hoverTimer = setTimeout(() => {
                if(!STYLE_CONFIG.tooltip) {
                    element.style.setProperty('color', 'inherit');
                    element.textContent = original.text;
                }
            }, parseInt(STYLE_CONFIG.hoverDelay));
        });

        element.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
            if(!STYLE_CONFIG.tooltip) {
                element.style.color = STYLE_CONFIG.textColor;
                element.textContent = REPLACE_TEXT;
            }
        });
    }


    document.querySelectorAll('a').forEach(processLink);


    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if(node.nodeType === Node.ELEMENT_NODE) {
                    node.querySelectorAll('a').forEach(processLink);
                }
            });
        });
    });

    observer.observe(document.body, {
        subtree: true,
        childList: true
    });
})();