// ==UserScript==
// @name         Tuxun 图寻 自定义按键
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  图寻按键更换（自定义颜色的半透明或高斯模糊）
// @author       H_M
// @match        https://tuxun.fun/
// @icon         https://s2.loli.net/2024/03/25/IT4D2jZnfeCsW3H.jpg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490797/Tuxun%20%E5%9B%BE%E5%AF%BB%20%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8C%89%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/490797/Tuxun%20%E5%9B%BE%E5%AF%BB%20%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8C%89%E9%94%AE.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function saveEffectSetting(effectType) {
        localStorage.setItem('effectType', effectType);
    }

    function applySavedEffect() {
        const effectType = localStorage.getItem('effectType');
        if (effectType === 'blur') {
            applyBlurEffect();
        } else if (effectType === 'transparency') {
            applyTransparencyEffect();
        }
    }

    function addButton() {
        var button = document.createElement('div');
        button.style = 'position: fixed; bottom: 20px; right: 110px; opacity: 0.5; z-index: 1000;';

        var buttonImageContainer = document.createElement('div');
        buttonImageContainer.style = 'width: 60px; height: 60px; border-radius: 50%; overflow: hidden; transition: transform 0.3s, filter 0.3s;';

        var buttonImage = document.createElement('img');
        buttonImage.src = 'https://s2.loli.net/2024/03/25/IT4D2jZnfeCsW3H.jpg';
        buttonImage.style = 'width: 100%; height: 100%; border-radius: 50%;';

        buttonImageContainer.appendChild(buttonImage);
        button.appendChild(buttonImageContainer);

        button.onmouseover = function() {
            buttonImageContainer.style.transform = 'scale(1.25)';
            buttonImageContainer.style.filter = 'blur(3px)';
        };

        button.onmouseout = function() {
            buttonImageContainer.style.transform = 'scale(1)';
            buttonImageContainer.style.filter = 'none';
        };

        button.onclick = function() {
            createPopup();
        };

        document.body.appendChild(button);
    }

    function createPopup() {
        var existingPopup = document.getElementById('myUniquePopup');
        if (existingPopup) {
            existingPopup.parentNode.removeChild(existingPopup);
        }

        var popup = document.createElement('div');
        popup.id = 'myUniquePopup';
        popup.style = 'position: fixed; top: 10px; left: 10px; width: 120px; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(10px); border-radius: 20px; padding: 10px; box-sizing: border-box; z-index: 1001; display: flex; flex-direction: column; align-items: center;';

        var button1 = createButton('高斯模糊', false);
        button1.onclick = function() {
            applyBlurEffect();
            saveEffectSetting('blur');
            setTimeout(function() { location.reload(); }, 100);
        };

        var button2 = createButton('半透明', false);
        button2.onclick = function() {
            applyTransparencyEffect();
            saveEffectSetting('transparency');
            setTimeout(function() { location.reload(); }, 100);
        };

        var inputWrapper = createInputField();
        var inputFieldElement = inputWrapper.firstChild;

        var submitButton = createButton('提交', true);
        submitButton.onclick = function() {
            var inputValue = inputFieldElement.value;
            if (isValidHex(inputValue)) {
                localStorage.setItem('userHex', inputValue);
                alert('颜色已保存');
            } else {
                alert('格式不正确');
            }
        };

        popup.appendChild(submitButton);
        var closeButton = createButton('关闭', false);
        popup.appendChild(button1);
        popup.appendChild(button2);
        popup.appendChild(inputWrapper);
        popup.appendChild(submitButton);

        closeButton.onclick = function() {
            popup.style.display = 'none';
        };
        popup.appendChild(closeButton);
        document.body.appendChild(popup);
    }

    function isValidHex(str) {
        return /^#[0-9A-Fa-f]{6}$/.test(str);
    }

    function createButton(text, isSubmit) {
        var button = document.createElement('button');
        button.textContent = text;
        button.style = 'background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(10px); border: none; border-radius: 15px; padding: 5px 10px; margin: 5px 0; width: 100%; box-sizing: border-box; font-weight: bold; color: black;';
        if (!isSubmit) {
            button.style.color = 'black';
        }
        return button;
    }

    function createInputField() {
        var inputWrapper = document.createElement('div');
        inputWrapper.style = 'width: 100%; margin: 5px 0;';

        var input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Paste #123456';
        input.style = 'width: 100%; border: none; border-bottom: 1px solid rgba(255, 255, 255, 0.5); background: transparent; padding: 5px 0;';

        inputWrapper.appendChild(input);
        return inputWrapper;
    }

    function applyBlurEffect() {
        var userHexColor = localStorage.getItem('userHex') || '#ffffff';
        const waitForElements = () => {
            var elements = document.querySelectorAll('.container .grid_main .card');

            if (elements.length > 0) {
                var userHexColor = localStorage.getItem('userHex') || '#ffffff';
                elements.forEach(function(element) {
                    element.style.backgroundColor = userHexColor + '80';
                    element.style.backdropFilter = 'blur(10px)';
                });

                var cardTopRightElements = document.querySelectorAll('#tuxun .card-top-right');
                cardTopRightElements.forEach(function(element) {
                    element.style.backgroundColor = 'transparent';
                });

                var cardtoprightbeta = document.querySelectorAll('#tuxun .card-top-right-beta');
                cardtoprightbeta.forEach(function(element) {
                    element.style.backgroundColor = 'transparent';
                });

                var describe = document.querySelectorAll('#tuxun .describe');
                describe.forEach(function(element) {
                    element.style.color = '#f9c62b';
                });
            }
        };

        setInterval(waitForElements, 10);
    }

    function applyTransparencyEffect() {
        var userHexColor = localStorage.getItem('userHex') || '#ffffff';
        const waitForElements = () => {
            var elements = document.querySelectorAll('.container .grid_main .card');
            if (elements.length > 0) {
                var userHexColor = localStorage.getItem('userHex') || '#ffffff';
                elements.forEach(function(element) {
                    element.style.backgroundColor = userHexColor + '80';
                    element.style.backdropFilter = 'none';
                });
                var cardTopRightElements = document.querySelectorAll('#tuxun .card-top-right');
                cardTopRightElements.forEach(function(element) {
                    element.style.backgroundColor = 'transparent';
                });

                var cardtoprightbeta = document.querySelectorAll('#tuxun .card-top-right-beta');
                cardtoprightbeta.forEach(function(element) {
                    element.style.backgroundColor = 'transparent';
                });

                var describe = document.querySelectorAll('#tuxun .describe');
                describe.forEach(function(element) {
                    element.style.color = '#f9c62b';
                });
            }
        };

        setInterval(waitForElements, 10);
    }

    function saveBlurEffectSetting() {
        localStorage.setItem('blurEffectApplied', 'true');
    }

    const checkAndApplySavedEffect = () => {
        applySavedEffect();
    };

    setInterval(checkAndApplySavedEffect, 10);
    window.onload = checkAndApplySavedEffect;

    if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
        addButton();
    } else {
        document.addEventListener('DOMContentLoaded', addButton);
    }
})();
