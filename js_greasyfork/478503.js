// ==UserScript==
// @name         防窥屏启动
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Always hide specific element on tuxun.fun
// @author       You
// @match        https://tuxun.fun/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478503/%E9%98%B2%E7%AA%A5%E5%B1%8F%E5%90%AF%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/478503/%E9%98%B2%E7%AA%A5%E5%B1%8F%E5%90%AF%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 选择器数组，用于匹配要隐藏或显示的元素
    const selectors = [
        'img.leaflet-marker-icon[alt="Marker"][role="button"]',
        '#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-shadow-pane > img',
        'div[id^="leaflet-tooltip-"]',
        '#tuxun > div > div > div.confirm'
    ];

    // 隐藏匹配的元素
    function hideElements() {
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.style.display = 'none';
                }
            });
        }
    }

    // 显示匹配的元素
    function showElements() {
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.style.display = 'block';
                }
            });
        }
    }

    // 根据特定的元素存在与否，决定是否显示或隐藏元素
    function checkForTargetSelectorAndToggleElements() {
        const targetElement = document.querySelector('#tuxun > div > div > div.im-view > div.round_result > div.round_result_round_info > div');

        if (targetElement) {
            showElements();
        } else {
            hideElements();
        }
    }

    // 如果有保存的状态，根据保存的状态决定显示或隐藏元素
    if (localStorage.getItem('elementsVisibility') === 'hidden') {
        hideElements();
    } else {
        showElements();
    }

    // 防窥屏动画效果

    // 防窥屏按钮的选择器
    const buttonSelector = '#viewer > div > div:nth-child(14) > div.gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom > div > div';

    const elts = {
        text1: document.createElement("div"),
        text2: document.createElement("div")
    };

    const texts = ["防窥屏启动！"];
    const morphTime = 1;
    const cooldownTime = 0.25;
    let animationDuration = texts.length * (morphTime + cooldownTime);

    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;

    // 防窥屏动画逻辑
    function startPrivacyScreenAnimation() {
        elts.text1.textContent = texts[textIndex % texts.length];
        elts.text2.textContent = texts[(textIndex + 1) % texts.length];

        function doMorph() {
            morph -= cooldown;
            cooldown = 0;

            let fraction = morph / morphTime;

            if (fraction > 1) {
                cooldown = cooldownTime;
                fraction = 1;
            }

            setMorph(fraction);
        }

        function setMorph(fraction) {
            elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
            elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

            fraction = 1 - fraction;
            elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
            elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

            elts.text1.textContent = texts[textIndex % texts.length];
            elts.text2.textContent = texts[(textIndex + 1) % texts.length];
        }

        function doCooldown() {
            morph = 0;

            elts.text2.style.filter = "";
            elts.text2.style.opacity = "100%";

            elts.text1.style.filter = "";
            elts.text1.style.opacity = "0%";
        }

function animate() {
    // 添加这个条件来检查opacity是否为0
    if (parseFloat(elts.text1.style.opacity) <= 0) {
        return;
    }

    requestAnimationFrame(animate);

    let newTime = new Date();
    let shouldIncrementIndex = cooldown > 0;
    let dt = (newTime - time) / 1000;
    time = newTime;

    cooldown -= dt;

    if (cooldown <= 0) {
        if (shouldIncrementIndex) {
            textIndex++;
        }

        doMorph();
    } else {
        doCooldown();
    }
}

        animate();
    }

    // 添加样式到动画元素
    Object.values(elts).forEach(elt => {
        elt.style.position = 'fixed';
        elt.style.top = '50%';
        elt.style.left = '50%';
        elt.style.transform = 'translate(-50%, -50%)';
        elt.style.fontSize = '8em';
        elt.style.fontWeight = 'bold';
        elt.style.color = 'white';
        elt.style.textAlign = 'center';
        elt.style.fontFamily = 'fantasy';
        elt.style.zIndex = '9999';
        elt.style.display = 'none'; // 初始状态为隐藏
    });
    elts.text1.style.opacity = '0%';

    document.body.appendChild(elts.text1);
    document.body.appendChild(elts.text2);

    // 设置按钮监听器
    function setupButtonListener() {
        const buttonElement = document.querySelector(buttonSelector);
        if (buttonElement) {
            buttonElement.addEventListener('click', () => {
                startPrivacyScreenAnimation();
                elts.text1.style.display = 'block';
                elts.text2.style.display = 'block';

                setTimeout(() => {
                    elts.text1.style.display = 'none';
                    elts.text2.style.display = 'none';
                }, animationDuration * 1000);
            });
        }
    }

    setupButtonListener();

    // 使用MutationObserver检查按钮是否后续被添加
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function() {
            setupButtonListener();
            checkForTargetSelectorAndToggleElements();
        });
    });

    // 开始观察整个文档
    observer.observe(document.body, { childList: true, subtree: true });
})();
