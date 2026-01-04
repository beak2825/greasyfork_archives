// ==UserScript==
// @name         矿产权人经纬度获取
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  采集矿产权人信息经纬度!
// @license MIT
// @author       ruby
// @match        *://kyqgs.mnr.gov.cn/projects_views_caikuang.jspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mnr.gov.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533887/%E7%9F%BF%E4%BA%A7%E6%9D%83%E4%BA%BA%E7%BB%8F%E7%BA%AC%E5%BA%A6%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/533887/%E7%9F%BF%E4%BA%A7%E6%9D%83%E4%BA%BA%E7%BB%8F%E7%BA%AC%E5%BA%A6%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加水印
    function addWatermark() {
        const watermark = document.createElement('div');
        watermark.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;

        const text = 'rubysiu';
        for(let i = 0; i < 10; i++) {
            for(let j = 0; j < 10; j++) {
                const span = document.createElement('span');
                span.textContent = text;
                span.style.cssText = `
                    position: absolute;
                    left: ${i * 200}px;
                    top: ${j * 100}px;
                    color: rgba(0, 0, 0, 0.1);
                    transform: rotate(-30deg);
                    font-size: 20px;
                `;
                watermark.appendChild(span);
            }
        }
        document.body.appendChild(watermark);
    }

    // 添加浮动按钮
    function addFloatingButton() {
        const button = document.createElement('button');
        button.textContent = '获取坐标';
        button.style.cssText = `
            position: fixed;
            left: 20px;
            top: 50%;
            z-index: 10000;
            padding: 10px;
            background: #4F7AFD;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;

        button.onclick = function() {
            const scripts = document.getElementsByTagName('script');
            const script = scripts[scripts.length - 2]; // 获取最后一个script标签
            const content = script.textContent;
            const match = content.match(/strPoints = '(.+?)';/);

            if (match) {
                const points = match[1].split(';').filter(p => p);
                const coordinates = points.map(point => {
                    const [id1, id2, lng, lat] = point.split(',');
                    return [ Number(lng), Number(lat)];
                });

                const result = JSON.stringify(coordinates, null, 2);
                alert(result);
                navigator.clipboard.writeText(result).then(() => {
                    alert('坐标已复制到剪贴板！');
                });
            }
        };

        document.body.appendChild(button);
    }

    // 初始化
    addWatermark();
    addFloatingButton();
})();