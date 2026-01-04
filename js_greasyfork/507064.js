// ==UserScript==
// @name         切换andes对话框显示状态
// @namespace    https://github.com/dadaewqq/fun
// @version      1.9
// @description  在对话页面添加两个浮动按钮，点击按钮以切换对话框、对话记录等元素的可见性
// @author       dadaewqq
// @match        https://andesgpt.oppoer.me/space/detail/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507064/%E5%88%87%E6%8D%A2andes%E5%AF%B9%E8%AF%9D%E6%A1%86%E6%98%BE%E7%A4%BA%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/507064/%E5%88%87%E6%8D%A2andes%E5%AF%B9%E8%AF%9D%E6%A1%86%E6%98%BE%E7%A4%BA%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const toggleElementsButton = document.createElement('button');
    toggleElementsButton.textContent = '对话框切换';
    toggleElementsButton.style.fontFamily = 'OPPO Sans3, Microsoft YaHei UI';
    toggleElementsButton.style.position = 'fixed';
    toggleElementsButton.style.bottom = '60px';
    toggleElementsButton.style.right = '20px';
    toggleElementsButton.style.zIndex = '1000';
    toggleElementsButton.style.padding = '6px 10px';
    toggleElementsButton.style.backgroundColor = '#007BFF';
    toggleElementsButton.style.color = '#FFF';
    toggleElementsButton.style.border = 'none';
    toggleElementsButton.style.borderRadius = '2px';
    toggleElementsButton.style.cursor = 'pointer';
    toggleElementsButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    document.body.appendChild(toggleElementsButton);

    toggleElementsButton.addEventListener('click', function() {
        const elements = [
            { selector: 'div.fix-bottom', transformHide: 'translateY(100%)', transformShow: 'translateY(0)' },
            { selector: 'div.detail-header.ali-center', transformHide: 'translateY(-100%)', transformShow: 'translateY(0)' },
            { selector: 'div.fixed-btns', transformHide: 'translateX(200%)', transformShow: 'translateX(0)' }
        ];

        elements.forEach(item => {
            const element = document.querySelector(item.selector);
            if (element) {
                if (element.style.transform === item.transformHide) {
                    element.style.transform = item.transformShow;
                } else {
                    element.style.transform = item.transformHide;
                }
            } else {
                alert(`Element ${item.selector} not found!`);
            }
        });
        
		function yincang1() {
			const selectors = [
					'div.fix-bottom',
					'div.detail-header.ali-center',
					'div.fixed-btns'
				];
		 
				selectors.forEach(selector => {
					const element = document.querySelector(selector);
					if (element) {
						element.style.display = (element.style.display === 'none') ? '' : 'none';
					} else {
						alert(`Element ${selector} not found!`);
					}
				});
		}
		
		setTimeout(yincang1, 200);
    });

    const toggleAsideButton = document.createElement('button');
    toggleAsideButton.textContent = '对话记录切换';
    toggleAsideButton.style.fontFamily = 'OPPO Sans3, Microsoft YaHei UI';
    toggleAsideButton.style.position = 'fixed';
	toggleAsideButton.style.top = '40px';
	toggleAsideButton.style.left = '20px';
	toggleAsideButton.style.zIndex = '1000';
	toggleAsideButton.style.padding = '6px 10px';
	toggleAsideButton.style.backgroundColor = '#28a745';
	toggleAsideButton.style.color = '#FFF';
	toggleAsideButton.style.border = 'none';
	toggleAsideButton.style.borderRadius = '2px';
	toggleAsideButton.style.cursor = 'pointer';
	toggleAsideButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    document.body.appendChild(toggleAsideButton);

    toggleAsideButton.addEventListener('click', function() {
        const asideElement = document.querySelector('aside.el-aside');
        if (asideElement) {
            if (asideElement.style.transform === 'translateX(-100%)') {
                asideElement.style.transform = 'translateX(0)';
            } else {
                asideElement.style.transform = 'translateX(-100%)';
            }
        } else {
            alert('Element aside.el-aside not found!');
        };

		function yincang2() {
			const selectors = [
					'aside.el-aside'
				];
		 
				selectors.forEach(selector => {
					const element = document.querySelector(selector);
					if (element) {
						element.style.display = (element.style.display === 'none') ? '' : 'none';
					} else {
						alert(`Element ${selector} not found!`);
					}
				});
		}


		setTimeout(yincang2, 200);
        
        
    });

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        aside.el-aside,
        div.fix-bottom,
        div.detail-header.ali-center,
        div.fixed-btns {
            transition: transform 0.3s ease-in-out;
            transform: translate(0);
        }
    `;
    document.head.appendChild(style);
})();