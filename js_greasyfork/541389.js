// ==UserScript==
// @name         模拟地理位置
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  模拟指定位置，支持地图选点、手动输入经纬度和快捷键隐藏/显示（Ctrl+；）
// @author       mcbaoge
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541389/%E6%A8%A1%E6%8B%9F%E5%9C%B0%E7%90%86%E4%BD%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/541389/%E6%A8%A1%E6%8B%9F%E5%9C%B0%E7%90%86%E4%BD%8D%E7%BD%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const KEY = 'geo_ui_visible'; // localStorage key

    // 初始化经纬度
    let fakeLat = 39.9042;
    let fakeLon = 116.4074;

    // 重写 geolocation API
    function overrideGeolocation(lat, lon) {
        navigator.geolocation.getCurrentPosition = function (successCallback) {
            const position = {
                coords: {
                    latitude: lat,
                    longitude: lon,
                    accuracy: 50,
                },
                timestamp: Date.now()
            };
            successCallback(position);
        };
        navigator.geolocation.watchPosition = function (successCallback) {
            const position = {
                coords: {
                    latitude: lat,
                    longitude: lon,
                    accuracy: 50,
                },
                timestamp: Date.now()
            };
            successCallback(position);
            return 1;
        };
        console.log(`[🌍模拟定位] 已更新至: ${lat}, ${lon}`);
    }

    overrideGeolocation(fakeLat, fakeLon);

    // 插入 UI 样式
    const style = document.createElement("style");
    style.innerHTML = `
    #geo-panel {
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 99999;
        width: 320px;
        background: #fff;
        border: 1px solid #ccc;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        border-radius: 8px;
        font-family: sans-serif;
        font-size: 14px;
        overflow: hidden;
    }
    #geo-header {
        background: #f0f0f0;
        padding: 5px 10px;
        font-weight: bold;
        border-bottom: 1px solid #ddd;
    }
    #geo-map {
        height: 300px;
    }
    #geo-form {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        gap: 4px;
        background: #fafbfc;
        border-top: 1px solid #eee;
    }
    #geo-form input {
        width: 80px;
        padding: 2px 4px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    #geo-set-btn {
        padding: 2px 8px;
        background: #2d8cf0;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }
    #geo-set-btn:hover {
        background: #1c6fc7;
    }
    `;
    document.head.appendChild(style);

    // 创建面板 UI，增加表单部分
    const panel = document.createElement("div");
    panel.id = "geo-panel";
    panel.innerHTML = `
        <div id="geo-header">🌍 模拟定位（地图选点/手动输入/快捷键隐藏/显示（Ctrl+；））</div>
        <div id="geo-map"></div>
        <form id="geo-form" autocomplete="off">
            <label>纬度:<input type="number" id="geo-lat" name="lat" step="0.000001" required></label>
            <label>经度:<input type="number" id="geo-lon" name="lon" step="0.000001" required></label>
            <button type="submit" id="geo-set-btn">设置</button>
        </form>
    `;
    document.body.appendChild(panel);

    // 插入 Leaflet 脚本和样式
    const leafletCSS = document.createElement("link");
    leafletCSS.rel = "stylesheet";
    leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(leafletCSS);

    const leafletScript = document.createElement("script");
    leafletScript.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    leafletScript.onload = () => {
        const map = L.map("geo-map").setView([fakeLat, fakeLon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);
        const marker = L.marker([fakeLat, fakeLon], { draggable: true }).addTo(map);

        function updatePosition(lat, lon, moveMarker = true) {
            fakeLat = lat;
            fakeLon = lon;
            overrideGeolocation(lat, lon);
            // 更新输入框
            latInput.value = lat.toFixed(6);
            lonInput.value = lon.toFixed(6);
            // 移动marker和地图
            if (moveMarker) marker.setLatLng([lat, lon]);
            map.setView([lat, lon]);
        }

        map.on('click', function (e) {
            updatePosition(e.latlng.lat, e.latlng.lng);
        });

        marker.on('dragend', function (e) {
            const latlng = e.target.getLatLng();
            updatePosition(latlng.lat, latlng.lng, false);
        });

        // 初始化输入框
        latInput.value = fakeLat.toFixed(6);
        lonInput.value = fakeLon.toFixed(6);
    };
    document.body.appendChild(leafletScript);

    // 表单逻辑
    const latInput = panel.querySelector("#geo-lat");
    const lonInput = panel.querySelector("#geo-lon");
    const form = panel.querySelector("#geo-form");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let lat = parseFloat(latInput.value);
        let lon = parseFloat(lonInput.value);
        if (!isNaN(lat) && !isNaN(lon)) {
            fakeLat = lat;
            fakeLon = lon;
            overrideGeolocation(lat, lon);
            // 地图和marker同步
            if (window.L && window.L.map) {
                // Leaflet 脚本已加载
                const map = window.L.DomUtil.get('geo-map')? window.L.map('geo-map') : null;
                if (map) map.setView([lat, lon]);
            }
        }
    });

    // 处理隐藏/显示快捷键
    document.addEventListener("keydown", function (e) {
        if (e.ctrlKey && e.code === "Semicolon") {
            const current = localStorage.getItem(KEY) === 'true';
            const newState = (!current).toString();
            localStorage.setItem(KEY, newState);
            updatePanelVisibility();
        }
    });

    // 统一隐藏/显示状态
    function updatePanelVisibility() {
        const isVisible = localStorage.getItem(KEY) === 'true';
        panel.style.display = isVisible ? 'block' : 'none';
    }

    // 初始化显示状态
    if (localStorage.getItem(KEY) === null) {
        localStorage.setItem(KEY, 'true');
    }
    updatePanelVisibility();
})();