// ==UserScript==
// @name         显示所有twitter_媒体标签页内的敏感内容
// @name:zh-CN   显示所有twitter_媒体标签页内的敏感内容
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2024-04-13
// @description  在twitter媒体标签页内刷新，4秒后将“发帖”按钮替换成“显示敏感内容”按钮，点击显示屏幕内所有的敏感图片
// @author       hydra
// @match        https://twitter.com/*/media
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492450/%E6%98%BE%E7%A4%BA%E6%89%80%E6%9C%89twitter_%E5%AA%92%E4%BD%93%E6%A0%87%E7%AD%BE%E9%A1%B5%E5%86%85%E7%9A%84%E6%95%8F%E6%84%9F%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/492450/%E6%98%BE%E7%A4%BA%E6%89%80%E6%9C%89twitter_%E5%AA%92%E4%BD%93%E6%A0%87%E7%AD%BE%E9%A1%B5%E5%86%85%E7%9A%84%E6%95%8F%E6%84%9F%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {

setTimeout(function() {
    var divs = document.querySelectorAll('div.css-175oi2r.r-1p6iasa.r-e7q0ms');
    console.log(divs)
    divs.forEach(function(div) {
        var button = document.createElement('button');
        button.innerHTML = '显示敏感内容';
        button.style.backgroundColor = 'black';
        button.style.color = 'white';
        button.style.borderRadius = '12px';
        button.style.padding = '10px';
        button.style.border = 'none';
        button.onclick = function() {
            var divsToRemoveClass = document.querySelectorAll('div.r-yfv4eo');
            divsToRemoveClass.forEach(function(divToRemoveClass) {
                divToRemoveClass.classList.remove('r-yfv4eo');
                var nextSibling = divToRemoveClass.nextElementSibling;
                if (nextSibling && nextSibling.tagName === 'DIV') {
                    nextSibling.parentNode.removeChild(nextSibling);
                }
            });
        };

        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }

        div.appendChild(button);
    });
}, 4000);


})();