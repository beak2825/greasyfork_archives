// ==UserScript==
// @name         网课防挂机鼠标自动活跃（带设置面板）
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  自动在指定网站模拟鼠标活跃，支持设置面板与快捷键自定义
// @author       heyuanwai
// @match        https://zxpx.mr.mct.gov.cn/*
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540091/%E7%BD%91%E8%AF%BE%E9%98%B2%E6%8C%82%E6%9C%BA%E9%BC%A0%E6%A0%87%E8%87%AA%E5%8A%A8%E6%B4%BB%E8%B7%83%EF%BC%88%E5%B8%A6%E8%AE%BE%E7%BD%AE%E9%9D%A2%E6%9D%BF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/540091/%E7%BD%91%E8%AF%BE%E9%98%B2%E6%8C%82%E6%9C%BA%E9%BC%A0%E6%A0%87%E8%87%AA%E5%8A%A8%E6%B4%BB%E8%B7%83%EF%BC%88%E5%B8%A6%E8%AE%BE%E7%BD%AE%E9%9D%A2%E6%9D%BF%EF%BC%89.meta.js
// ==/UserScript==


(function() {
    // 属性伪装
    try {
        Object.defineProperty(document, 'hidden', { get: () => false });
        Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
    } catch (e) {}
    // 代理addEventListener阻断
    const blockEvents = ['blur', 'visibilitychange', 'pagehide'];
    window.addEventListener = new Proxy(window.addEventListener, {
        apply(target, thisArg, args) {
            if(blockEvents.includes(args[0])) return;
            return Reflect.apply(target, thisArg, args);
        }
    });
    document.addEventListener = new Proxy(document.addEventListener, {
        apply(target, thisArg, args) {
            if(blockEvents.includes(args[0])) return;
            return Reflect.apply(target, thisArg, args);
        }
    });
    // 定时清理“属性式”监听
    setInterval(function(){
        try {
            window.onblur = null;
            window.onfocus = null;
            window.onpagehide = null;
            window.onvisibilitychange = null;
            document.onvisibilitychange = null;
            document.onwebkitvisibilitychange = null;
        } catch (e) {}
    }, 2000);
})();





(function() {
    'use strict';

    // --- 设置存储 ---
    const STORAGE_KEY = 'autoMouseActiveSites';
    const TIMEOUT_KEY = 'autoMouseActiveTimeout';

    // 预置生效站点
    const PRESET_SITES = [
        'zxpx.mr.mct.gov.cn'
    ];

    // 默认参数
    let idleTimeout = Number(localStorage.getItem(TIMEOUT_KEY)) || 60000; // 默认1分钟
    let minMoveInterval = 1000;
    let maxMoveInterval = 3000;

    // 读取已设置的网站
    function getSites() {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (stored && stored.length) {
                // 合并预置
                return Array.from(new Set([...PRESET_SITES, ...stored]));
            } else {
                return PRESET_SITES.slice();
            }
        } catch (e) {
            return PRESET_SITES.slice();
        }
    }
    function setSites(arr) {
        // 只存储用户自定义，预置在代码中
        const userArr = arr.filter(site => !PRESET_SITES.includes(site));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userArr));
    }

    // 判断当前站点是否需要激活
    function isSiteActive() {
        const sites = getSites();
        return sites.some(site => window.location.hostname.includes(site));
    }

    // ========== 设置面板 ==========
    function createPanel() {
        if (document.getElementById('amap-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'amap-panel';
        panel.style = `
            position: fixed; z-index: 99999; top: 80px; right: 30px; background: #fff;
            border: 1px solid #ccc; box-shadow: 0 2px 12px rgba(0,0,0,0.13); border-radius: 10px;
            padding: 18px 20px 16px 20px; min-width: 350px; font-size: 15px; font-family: sans-serif;
            color: #333; transition: opacity 0.2s;`;

        panel.innerHTML = `
            <div style="font-size:18px;font-weight:bold;margin-bottom:10px;">自动鼠标活跃 - 网站管理</div>
            <div style="margin-bottom:6px;">当前名单：</div>
            <ul id="amap-site-list" style="max-height:120px;overflow-y:auto;padding:0 0 0 15px;margin-bottom:12px;"></ul>
            <div>
                <input id="amap-site-input" style="width:200px;" placeholder="输入域名，如 example.com">
                <button id="amap-add-btn">添加</button>
                <button id="amap-add-cur-btn">添加当前网站</button>
            </div>
            <div style="margin-top:10px;">
                <label>无操作多少秒后恢复自动模拟：</label>
                <input id="amap-timeout" type="number" min="5" max="600" value="${Math.round(idleTimeout/1000)}" style="width:60px;"> 秒
            </div>
            <div style="margin-top:10px;text-align:right;">
                <button id="amap-close-btn">关闭</button>
            </div>
        `;
        document.body.appendChild(panel);

        function renderSiteList() {
            const ul = document.getElementById('amap-site-list');
            ul.innerHTML = '';
            getSites().forEach(site => {
                const li = document.createElement('li');
                li.style = "margin-bottom:2px;";
                li.textContent = site + ' ';
                // 预置站点不能删
                if (!PRESET_SITES.includes(site)) {
                    const delBtn = document.createElement('button');
                    delBtn.textContent = '删除';
                    delBtn.style = 'font-size:13px;color:#fff;background:#c44;border:none;padding:1px 5px;border-radius:4px;cursor:pointer;';
                    delBtn.onclick = function() {
                        const arr = getSites().filter(function(s){ return s !== site; });
                        setSites(arr);
                        renderSiteList();
                    };
                    li.appendChild(delBtn);
                } else {
                    const tag = document.createElement('span');
                    tag.textContent = '（预置）';
                    tag.style = 'color:#888;font-size:12px;';
                    li.appendChild(tag);
                }
                ul.appendChild(li);
            });
        }
        renderSiteList();

        document.getElementById('amap-add-btn').onclick = function() {
            const val = document.getElementById('amap-site-input').value.trim();
            if (!val) return;
            const arr = getSites();
            if (!arr.includes(val)) arr.push(val);
            setSites(arr);
            document.getElementById('amap-site-input').value = '';
            renderSiteList();
        };
        document.getElementById('amap-add-cur-btn').onclick = function() {
            const host = window.location.hostname;
            if (!host) return;
            const arr = getSites();
            if (!arr.includes(host)) arr.push(host);
            setSites(arr);
            renderSiteList();
        };
        document.getElementById('amap-timeout').onchange = function(e) {
            let sec = Number(e.target.value);
            if (!sec || sec < 5) sec = 5;
            if (sec > 600) sec = 600;
            idleTimeout = sec * 1000;
            localStorage.setItem(TIMEOUT_KEY, idleTimeout);
        };
        document.getElementById('amap-close-btn').onclick = function() {
            panel.remove();
        };
    }

    // 面板快捷键：Ctrl+Alt+H
    window.addEventListener('keydown', function(e){
        if(e.ctrlKey && e.altKey && e.code === 'KeyH'){
            if (!document.getElementById('amap-panel')) createPanel();
        }
    });

    // ========== 模拟鼠标活跃 ==========
    if (!isSiteActive()) return; // 不在名单内则不运行

    let userActive = false;
    let idleTimer = null;
    let autoMoveTimer = null;

    function getArea() {
        return {width: window.innerWidth, height: window.innerHeight};
    }

    function getRandomPosition() {
        const area = getArea();
        return {
            x: Math.floor(Math.random() * area.width),
            y: Math.floor(Math.random() * area.height)
        };
    }

    function triggerMousemove() {
        const pos = getRandomPosition();
        const evt = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: pos.x,
            clientY: pos.y,
            screenX: pos.x,
            screenY: pos.y
        });
        document.dispatchEvent(evt);
        scheduleAutoMove();
    }

    function scheduleAutoMove() {
        clearTimeout(autoMoveTimer);
        autoMoveTimer = setTimeout(triggerMousemove, randomInt(minMoveInterval, maxMoveInterval));
    }

    function onUserActive() {
        userActive = true;
        clearTimeout(autoMoveTimer);
        clearTimeout(idleTimer);
        idleTimer = setTimeout(function() {
            userActive = false;
            triggerMousemove();
        }, idleTimeout);
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    ['mousemove', 'mousedown', 'keydown', 'touchstart'].forEach(function(evtType){
        window.addEventListener(evtType, onUserActive, true);
    });

    // 启动
    scheduleAutoMove();

    // 提示热键
    if (window === window.top) {
        setTimeout(function(){
            if (!localStorage.getItem('_amap_tip')) {
                alert('【自动鼠标活跃】设置面板：\n按下 Ctrl+Alt+H 打开/关闭设置。');
                localStorage.setItem('_amap_tip', '1');
            }
        }, 600);
    }
})();
