// ==UserScript==
// @name         提取finder.susy.mdpi.com
// @namespace    https://greasyfork.org/zh-CN/scripts/495851-%E6%8F%90%E5%8F%96finder-susy-mdpi-com
// @version      v1.1.0
// @description  提取 https://finder.susy.mdpi.com/reviewer
// @author       Cheese-Yu
// @match        https://finder.susy.mdpi.com/reviewer*
// @icon         https://finder.susy.mdpi.com/dist/images/ico/favicon.ico?5
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495851/%E6%8F%90%E5%8F%96findersusymdpicom.user.js
// @updateURL https://update.greasyfork.org/scripts/495851/%E6%8F%90%E5%8F%96findersusymdpicom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    try {
        const formtVal = (text) => {
            return text.replace(/\n/g, '').trim()
        }
        // statements
        const list = document.querySelectorAll('.job-ad-item');
        const result = [];
        for (let i = 0; i < list.length; i++) {
            const el = list[i];
            const Title = el.querySelector('.title').textContent;
            const Email = el.querySelector('.clipboard').getAttribute('data-clipboard-text');
            const textList = el.querySelector('.highlight-text').children;
            const textObj = {};
            for (let j = 0; j < textList.length; j++) {
            	let text = textList[j].textContent;
            	let key = text.split(':')[0];
            	if (textList[j].querySelector('.show-more-section')) {
            		key = formtVal(textList[j].querySelector('b').textContent?.replace(':',''));
            		text = textList[j].querySelector('.show-more-section').textContent;
            	}
            	// console.log(text);
            	textObj[key] = formtVal(text.replace(`${key}:`, ''))
            }
            const infoList = el.querySelectorAll('li');
            const locationText = infoList[0]?.textContent || '';
            const Location = formtVal(locationText?.split('\n')[1]);
            const HIndex = formtVal(infoList[0].querySelector('a')?.textContent);
            const Link = infoList[1]?.querySelector('a').textContent || '';
            result.push({
                Title,
                Email,
                ...textObj,
                Location,
                HIndex,
                Link
            });

        }
        console.log(`%c提取结果：url-${location.href}`, 'color: red', result);
    } catch(e) {
        // statements
        console.log('提取失败', e);
    }
})();