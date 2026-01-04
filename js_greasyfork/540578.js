// ==UserScript==
// @name        网页随心滚
// @namespace   http://tampermonkey.net/
// @version     2.1
// @description 滚动到顶/底、记录页面滚动、屏幕常亮和自动滚动
// @author      ^o^
// @match       *://*/*
// @grant       GM_registerMenuCommand
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/540578/%E7%BD%91%E9%A1%B5%E9%9A%8F%E5%BF%83%E6%BB%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/540578/%E7%BD%91%E9%A1%B5%E9%9A%8F%E5%BF%83%E6%BB%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let w = window, d = document;
    let eScrollBtn = true, eWakeLock = true;
    let scrollBtnPosition = localStorage.getItem('scrollBtnPosition') || 'right'; // 'left' or 'right'

    // 注册菜单命令（已移除滚动条相关）
    GM_registerMenuCommand('滚动到顶/底按钮：开/关', toggleScrollBtn);
    GM_registerMenuCommand('滚动到顶/底按钮位置：左/右切换', toggleScrollBtnPosition);
    GM_registerMenuCommand('保持屏幕常亮：开/关', toggleWakeLock);
    GM_registerMenuCommand('自动滚动：开始/停止', toggleAutoScroll);
    GM_registerMenuCommand('自动滚动：配置参数', () => {
        let s = prompt('滚动间隔(ms):', speed);
        if (s !== null) speed = parseInt(s) || speed;
        let p = prompt('每次滚动像素(px):', pixels);
        if (p !== null) pixels = parseInt(p) || pixels;
    });

    function toggleScrollBtn() {
        eScrollBtn = !eScrollBtn;
        let b = d.getElementById('scroll-top-btn');
        if (b) b.remove();
        if (eScrollBtn) initScrollBtn();
    }

    function toggleWakeLock() {
        eWakeLock = !eWakeLock;
        if (eWakeLock) requestWL();
        else if (wakeLock) wakeLock.release();
    }

    function toggleScrollBtnPosition() {
        scrollBtnPosition = scrollBtnPosition === 'left' ? 'right' : 'left';
        localStorage.setItem('scrollBtnPosition', scrollBtnPosition);
        let b = d.getElementById('scroll-top-btn');
        if (b) {
            b.style.left = scrollBtnPosition === 'left' ? '15px' : '';
            b.style.right = scrollBtnPosition === 'right' ? '15px' : '';
        }
    }

    function initScrollBtn() {
        let b = d.createElement('button');
        b.textContent = '▲';
        b.id = 'scroll-top-btn';
        Object.assign(b.style, {
            position: 'fixed', bottom: '15%', zIndex: 999999,
            width: '35px', height: '35px', borderRadius: '50%', padding: 0,
            background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(5px)',
            display: 'none',
            fontSize: '16px', textAlign: 'center', lineHeight: '35px',
            fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease',
            border: 'none'
        });
        // 根据位置设置 left 或 right
        if (scrollBtnPosition === 'left') {
            b.style.left = '13px';
        } else {
            b.style.right = '13px';
        }
        d.body.appendChild(b);
        let lastY = w.pageYOffset, t;
        w.addEventListener('scroll', () => {
            b.textContent = w.scrollY > lastY ? '▼' : '▲';
            lastY = w.scrollY;
            b.style.display = w.pageYOffset > 100 ? 'block' : 'none';
            clearTimeout(t);
            t = setTimeout(() => b.style.display = 'none', 2000);
        });
        b.addEventListener('mouseenter', () => {
            b.style.background = 'rgba(255,255,255,0.6)';
            b.style.transform = 'scale(1.1)';
        });
        b.addEventListener('mouseleave', () => {
            b.style.background = 'rgba(255,255,255,0.3)';
            b.style.transform = 'scale(1)';
        });
        b.addEventListener('click', () => w.scrollTo({
            top: b.textContent === '▲' ? 0 : d.documentElement.scrollHeight,
            behavior: 'smooth'
        }));
    }

    let wakeLock = null;
    async function requestWL() {
        if (!('wakeLock' in navigator)) return;
        try {
            wakeLock = await navigator.wakeLock.request("screen");
        } catch (e) {}
    }
    eWakeLock && requestWL();

    let scrolling = false, interval, speed = 25, pixels = 1;
    function toggleAutoScroll() {
        if (scrolling) {
            scrolling = false;
            clearInterval(interval);
        } else {
            scrolling = true;
            interval = setInterval(() => {
                w.scrollBy(0, pixels);
                if (w.innerHeight + w.scrollY >= d.body.scrollHeight) {
                    w.scrollBy(0, 1);
                }
            }, speed);
        }
    }

    eScrollBtn && initScrollBtn();

    // 记录页面滚动位置
    w.addEventListener('scroll', () => {
        localStorage.setItem('pageScrollPosition', JSON.stringify({
            top: w.scrollY,
            left: w.scrollX
        }));
    });

    // 页面加载时恢复滚动位置
    w.addEventListener('load', () => {
        let position = localStorage.getItem('pageScrollPosition');
        if (position) {
            let scrollPosition = JSON.parse(position);
            w.scrollTo(scrollPosition.left, scrollPosition.top);
        }
    });

})();
