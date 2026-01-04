// ==UserScript==
// @name         百度坐标转谷歌+复制
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  将百度坐标转换后跳转谷歌地图，并支持复制坐标
// @author       Dost51552
// @license      MIT
// @match        https://lbs.baidu.com/maptool/getpoint*
// @grant        none
// @icon         https://maps.google.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/547588/%E7%99%BE%E5%BA%A6%E5%9D%90%E6%A0%87%E8%BD%AC%E8%B0%B7%E6%AD%8C%2B%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/547588/%E7%99%BE%E5%BA%A6%E5%9D%90%E6%A0%87%E8%BD%AC%E8%B0%B7%E6%AD%8C%2B%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // BD09 → GCJ02 转换
    function bd09togcj02(bd_lng, bd_lat) {
        const x = bd_lng - 0.0065;
        const y = bd_lat - 0.006;
        const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * Math.PI);
        const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * Math.PI);
        const gg_lng = z * Math.cos(theta);
        const gg_lat = z * Math.sin(theta);
        return [gg_lng, gg_lat];
    }

    function addButtons() {
        const coordDiv = document.querySelector('.src-pages-maptool-getpoint-styles-index__CoordintesText');
        if (!coordDiv || document.getElementById('jumpGoogleBtn')) return;

        // 包裹按钮的容器
        const btnBox = document.createElement('span');
        btnBox.style.marginLeft = '8px';

        // 谷歌按钮
        const googleBtn = document.createElement('button');
        googleBtn.id = 'jumpGoogleBtn';
        googleBtn.textContent = '谷歌';
        googleBtn.style.display = 'inline-block';
        googleBtn.style.marginRight = '6px';
        googleBtn.style.cursor = 'pointer';
        googleBtn.style.padding = '2px 8px';
        googleBtn.style.borderRadius = '4px';
        googleBtn.style.background = '#4285F4';
        googleBtn.style.color = '#fff';
        googleBtn.style.border = 'none';
        googleBtn.style.fontSize = '12px';

        googleBtn.onclick = () => {
            const coords = coordDiv.textContent.trim().split(',');
            if (coords.length === 2) {
                const bd_lng = parseFloat(coords[0]);
                const bd_lat = parseFloat(coords[1]);
                const [lng, lat] = bd09togcj02(bd_lng, bd_lat);
                const url = `https://www.google.com/maps?q=${lat},${lng}`;
                window.open(url, '_blank');
            }
        };

        // 复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.id = 'copyCoordBtn';
        copyBtn.textContent = '复制';
        copyBtn.style.display = 'inline-block';
        copyBtn.style.cursor = 'pointer';
        copyBtn.style.padding = '2px 8px';
        copyBtn.style.borderRadius = '4px';
        copyBtn.style.background = '#34A853';
        copyBtn.style.color = '#fff';
        copyBtn.style.border = 'none';
        copyBtn.style.fontSize = '12px';

        copyBtn.onclick = async () => {
            try {
                await navigator.clipboard.writeText(coordDiv.textContent.trim());
                copyBtn.textContent = '已复制';
                setTimeout(() => copyBtn.textContent = '复制', 1500);
            } catch (e) {
                alert('复制失败');
            }
        };

        // 组装
        btnBox.appendChild(googleBtn);
        btnBox.appendChild(copyBtn);
        coordDiv.parentNode.appendChild(btnBox);
    }

    setInterval(addButtons, 500);
})();
