// ==UserScript==
// @license MIT
// @name         花瓣图片导入PS v2
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为花瓣图片添加导入PS按钮，标记付费素材，并防止误跳转链接；自动触发指定元素
// @author       You
// @match        https://huaban.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542380/%E8%8A%B1%E7%93%A3%E5%9B%BE%E7%89%87%E5%AF%BC%E5%85%A5PS%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/542380/%E8%8A%B1%E7%93%A3%E5%9B%BE%E7%89%87%E5%AF%BC%E5%85%A5PS%20v2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (location.href.includes('/pins/')) return;

    const OPACITY = 0.2;
    const imgHTMLMap = new WeakMap();

    const style = document.createElement('style');
    style.textContent = `
        .huaban-img-btn-icon {
            position: absolute; bottom: 10px; left: 10px; z-index: 1000;
            width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
            cursor: pointer; border-radius: 8px; opacity: 0;
            transition: opacity 0.3s ease;
        }
        .huaban-img-btn-icon img { width: 36px; height: 36px; }
        .huaban-img-btn-icon.clicked {
            border: 10px solid rgba(20,134,226,0.5);
            border-radius: 20px;
            animation: borderFade 0.8s ease;
        }
        @keyframes borderFade {
            0% { border-width: 0; opacity: 0; }
            50% { border-width: 10px; opacity: 1; }
            100% { border-width: 0; opacity: 0; }
        }
        .huaban-img-btn-icon:hover { transform: scale(1.1); transition: transform 0.2s ease; }
        .img-hover-container:hover .huaban-img-btn-icon { opacity: 1; }
    `;
    document.head.appendChild(style);

    const isValidImage = (img) => {
        const srcs = [img.src || '', ...(img.srcset || '').split(',').map(s => s.trim().split(' ')[0])];
        return srcs.some(url => url.startsWith('https://gd-hbimg.huaban.com') && !/_fw86($|\?)/.test(url));
    };

    const isExcluded = (img) => {
        const selectors = [
            '#__next > main > div.wrapper > div > div.vB0yuKZj',
            '#__next > main > div.mmxqWRkC > div',
            '#pin_detail > div.xSGn1h2H',
            '[id^="rc-tabs-"][id$="-panel-board"]'
        ];
        return selectors.some(sel => {
            const el = document.querySelector(sel);
            return el && el.contains(img);
        });
    };

    const addButton = (img) => {
        const parent = img.parentElement;
        if (!parent || parent.querySelector('.huaban-img-btn-icon')) return;
        if (!isValidImage(img) || isExcluded(img)) return;

        parent.classList.add('img-hover-container');
        parent.style.position = 'relative';

        const button = document.createElement('div');
        button.className = 'huaban-img-btn-icon';
        button.innerHTML = `<img src="https://files.getquicker.net/_icons/42122268BF4547AB8E6955A2C3D552BC70E197DA.png">`;

        let marker = document.querySelector('.tampermonkey-huaban-marker');
        if (!marker) {
            marker = document.createElement('div');
            marker.className = 'tampermonkey-huaban-marker';
            marker.style.display = 'none';
            document.body.appendChild(marker);
        }

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            button.classList.add('clicked');
            setTimeout(() => button.classList.remove('clicked'), 800);
            window.location.href = 'quicker:runaction:2db1eb7e-6a80-4e5f-2859-08ddc0fbdd92?woda';
            marker.innerHTML = imgHTMLMap.get(img) || '';
        });

        parent.appendChild(button);
        imgHTMLMap.set(img, img.outerHTML);
    };

    const markPremium = () => {
        const nodes = document.evaluate(
            '//div[@data-content-type="素材采集"]',
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < nodes.snapshotLength; i++) {
            const el = nodes.snapshotItem(i);
            if (el.querySelector('.premium-overlay')) continue;

            el.style.position = 'relative';
            el.style.overflow = 'hidden';

            const overlay = document.createElement('div');
            overlay.className = 'premium-overlay';
            overlay.innerHTML = '<span>💰 付费素材</span>';
            overlay.style.cssText = `
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,${OPACITY}); display: flex; align-items: center;
                justify-content: center; z-index: 1000; pointer-events: none;
            `;
            overlay.querySelector('span').style.cssText = `
                color: white; font-size: 16px; font-weight: bold;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
                background: rgba(255,255,255,0.1); padding: 8px 16px;
                border-radius: 20px; border: 2px solid rgba(255,255,255,0.3);
            `;

            el.onmouseenter = () => overlay.style.opacity = '0.3';
            el.onmouseleave = () => overlay.style.opacity = '1';

            el.appendChild(overlay);
        }
    };

    const process = () => {
        document.querySelectorAll('img').forEach(addButton);
        markPremium();
    };

    new MutationObserver(process).observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        setTimeout(() => {
            process();

            // 自动点击 .p7zlqpbo 元素
            const target = document.querySelector('.p7zlqpbo');
            if (target) {
                target.click();
                console.log('✅ 已自动点击 .p7zlqpbo 元素');
            } else {
                console.log('⚠️ 未找到 .p7zlqpbo 元素');
            }
        }, 1000);
    });
})();
