// ==UserScript==
// @name         fx helper
// @namespace    http://tampermonkey.net/
// @version      2024-04-28
// @description  fx helper jd helper
// @author       You
// @match        https://item.jd.com/*.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @grant        none
// @license Apache
// @downloadURL https://update.greasyfork.org/scripts/493654/fx%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/493654/fx%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
function copyText(text) { var element = createElement(text); element.select(); element.setSelectionRange(0, element.value.length); document.execCommand('copy'); element.remove(); alert('已复制到剪切板'); }; function createElement(text) { var isRTL = document.documentElement.getAttribute('dir') === 'rtl'; var element = document.createElement('textarea');element.style.fontSize = '12pt'; element.style.border = '0'; element.style.padding = '0'; element.style.margin = '0'; element.style.position = 'absolute'; element.style[isRTL ? 'right': 'left'] = '-9999px'; let yPosition = window.pageYOffset || document.documentElement.scrollTop; element.style.top = `${yPosition}px`; element.setAttribute('readonly',''); element.value = text; document.body.appendChild(element); return element; };
    var button = document.createElement('button');
button.innerText = '复制skuId';
button.onclick=function(){
    const regex = /\"skuId\":(\d+)/g; const skus = []; let match; while ((match = regex.exec($('html').html()))) { skus.push(match[1]); } copyText(skus.join(','));
    console.log('11')
};
$('#choose-attrs')[0].append(button);
})();