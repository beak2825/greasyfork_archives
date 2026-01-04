// ==UserScript==
// @name         快手-自动讲解
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  V(houka8)
// @author       K
// @match        https://zs.kwaixiaodian.com/page/helper*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinritemai.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540483/%E5%BF%AB%E6%89%8B-%E8%87%AA%E5%8A%A8%E8%AE%B2%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/540483/%E5%BF%AB%E6%89%8B-%E8%87%AA%E5%8A%A8%E8%AE%B2%E8%A7%A3.meta.js
// ==/UserScript==

var zkjl_interval_time = 8000;
var run_start = false;

(function () {

    setTimeout(() => {
        var newDiv = document.createElement('div');
        newDiv.id = 'auto_speak';
        newDiv.className = 'ant-space-item';

        var spanElement = document.createElement('span');
        spanElement.setAttribute('class', 'function-item--LpbwN');

        var spanElement_text = document.createElement('span');
        spanElement_text.setAttribute('class', 'name--urwBR');


        var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute('width', '16');
        svgElement.setAttribute('height', '16');
        svgElement.setAttribute('fill', 'none');


        var pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', 'M3.60869 7.99844C3.60869 5.56838 5.57864 3.59844 8.00869 3.59844C9.37736 3.59844 10.6 4.22277 11.4079 5.20437L10.2321 6.02767L13.5911 7.33797L13.5087 3.73336L12.3932 4.51444C11.3682 3.22607 9.785 2.39844 8.00869 2.39844C4.9159 2.39844 2.40869 4.90564 2.40869 7.99844C2.40869 11.0912 4.9159 13.5984 8.00869 13.5984C9.84119 13.5984 11.4681 12.7176 12.4888 11.3588L12.8491 10.879L11.8897 10.1584L11.5293 10.6381C10.7256 11.7082 9.44782 12.3984 8.00869 12.3984C5.57864 12.3984 3.60869 10.4285 3.60869 7.99844Z');
        pathElement.setAttribute('fill-rule', 'evenodd');
        pathElement.setAttribute('clip-rule', 'evenodd');
        pathElement.setAttribute('fill', '#2C2E30');
        pathElement.setAttribute('class', 'function-item-icon-fill');

        svgElement.appendChild(pathElement);

        spanElement.appendChild(svgElement);

        spanElement_text.textContent = "自动讲解";

        spanElement.appendChild(spanElement_text)

        newDiv.appendChild(spanElement)

        var targetElement = document.querySelector('div.bar--jWmj4 > div.right--S8Qrm > div');
        targetElement.appendChild(newDiv);

        var autoSpeakElement = document.getElementById('auto_speak');
        var autoSpeakElement_span = autoSpeakElement.querySelector('span');
        var autoSpeakElement_path = autoSpeakElement.querySelector('span').querySelector('path');

        var isOpen = false;
        var intervalId = null;

        autoSpeakElement.addEventListener('click', function () {
            if (isOpen) {
                autoSpeakElement_span.classList.remove("highlight--Iv83q");
                autoSpeakElement_path.setAttribute('fill', '#2C2E30');
                isOpen = false;
                clearInterval(intervalId);
                console.log('已关闭自动讲解');
            } else {
                isOpen = true;
                autoSpeakElement_span.classList.add("highlight--Iv83q");
                autoSpeakElement_path.setAttribute('fill', '#326BFB');
                intervalId = setInterval(function () {
                    var targetElement = document.querySelector('div[data-test-id="virtuoso-item-list"] > div:nth-child(1) > div > div.item-container--nxYHP > div > div > div >div > div > div > div >div.btn--SbR1N > div >button:nth-child(4)');
                    if (targetElement.textContent == "开始讲解") {
                        console.log('开始讲解');
                        targetElement.click();
                    }
                }, 8000);
                console.log('已开启自动讲解');
            }
        });
    }, 3000);
})();