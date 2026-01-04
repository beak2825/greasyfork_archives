// ==UserScript==
// @name         仓鼠快打（Hamster Kombat）辅助 - 摩尔斯电码转换器、自动点击器和从网页桌面中登录
// @namespace    https://hamsterkombatgame.io/*
// @version      1.0.2
// @description  仓鼠快打辅助 - 摩尔斯电码转换器、自动点击器解放双手和从网页桌面中登录、挂机赚金币。根据能量水平点击一个按钮，当由自定义按钮触发时，并将iframe的src复制到剪贴板。替换hamsterkombatgame.io上的某些脚本URL
// @description:en Autoclicker, Secret Word Input, Site Login from PC. Clicks a button based on energy level when triggered by a custom button and copies iframe src to clipboard. Replaces certain script URLs on hamsterkombatgame.io
// @description:ru Автокликер, Ввод секретного слова, Вход на сайт с ПК. Нажимает кнопку на основе уровня энергии при срабатывании пользовательской кнопки и копирует src iframe в буфер обмена. Заменяет определенные URL-адреса скриптов на hamsterkombatgame.io
// @description:es Autoclicker, Entrada de Palabra Secreta, Inicio de sesión en el sitio desde PC. Hace clic en un botón según el nivel de energía cuando se activa con un botón personalizado y copia el src del iframe al portapapeles. Reemplaza ciertas URL de scripts en hamsterkombatgame.io
// @description:de Autoclicker, Eingabe des Geheimworts, Site-Anmeldung vom PC aus. Klickt auf eine Schaltfläche basierend auf dem Energieniveau, wenn sie durch eine benutzerdefinierte Schaltfläche ausgelöst wird, und kopiert die iframe-src in die Zwischenablage. Ersetzt bestimmte Skript-URLs auf hamsterkombatgame.io
// @description:fr Autoclicker, Saisie de Mot Secret, Connexion au site depuis un PC. Clique sur un bouton en fonction du niveau d'énergie lorsqu'il est déclenché par un bouton personnalisé et copie le src de l'iframe dans le presse-papiers. Remplace certaines URL de script sur hamsterkombatgame.io
// @author       comainly,Devitp001
// @match        https://*.hamsterkombatgame.io/*
// @match        https://web.telegram.org/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegram.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500691/%E4%BB%93%E9%BC%A0%E5%BF%AB%E6%89%93%EF%BC%88Hamster%20Kombat%EF%BC%89%E8%BE%85%E5%8A%A9%20-%20%E6%91%A9%E5%B0%94%E6%96%AF%E7%94%B5%E7%A0%81%E8%BD%AC%E6%8D%A2%E5%99%A8%E3%80%81%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%99%A8%E5%92%8C%E4%BB%8E%E7%BD%91%E9%A1%B5%E6%A1%8C%E9%9D%A2%E4%B8%AD%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/500691/%E4%BB%93%E9%BC%A0%E5%BF%AB%E6%89%93%EF%BC%88Hamster%20Kombat%EF%BC%89%E8%BE%85%E5%8A%A9%20-%20%E6%91%A9%E5%B0%94%E6%96%AF%E7%94%B5%E7%A0%81%E8%BD%AC%E6%8D%A2%E5%99%A8%E3%80%81%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%99%A8%E5%92%8C%E4%BB%8E%E7%BD%91%E9%A1%B5%E6%A1%8C%E9%9D%A2%E4%B8%AD%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const currentUrl = window.location.href;

    const pauseDelay = 2000; // 字母之间的延迟 (ms)
    const dotDelay = 1; // 点的持续时间 (ms)
    const dashDelay = 750; // 划线的持续时间 (ms)
    const extraDelay = 200; // 按键之间的额外暂停 (ms)
    const multiplyTap = 16; // 每次点击消耗多少能量

    // 替换脚本URL
    function replaceScriptUrl() {
        const urlsToReplace = [
            'https://hamsterkombatgame.io/js/telegram-web-app.js?v=7.6',
            'https://app.hamsterkombatgame.io/js/telegram-web-app.js?v=7.6',
            'https://hamsterkombatgame.io/js/telegram-web-app.js',
            'https://app.hamsterkombatgame.io/js/telegram-web-app.js'
        ];
        const newUrl = 'https://ktnff.tech/hamsterkombat/telegram-web-app.js';

        document.querySelectorAll('script').forEach(script => {
            if (urlsToReplace.includes(script.src)) {
                const newScript = document.createElement('script');
                newScript.src = newUrl;
                newScript.type = 'text/javascript';
                script.parentNode.replaceChild(newScript, script);
                console.log('替换脚本 URL:', newScript.src);
            }
        });
    }


    // 用于替换脚本的观察者
    const scriptObserver = new MutationObserver(() => {
        replaceScriptUrl();
    });

    scriptObserver.observe(document.body, { childList: true, subtree: true });
    replaceScriptUrl();


    // 查找按钮的函数
    function findTapButton() {
        return document.querySelector('.user-tap-button');
    }


    // 检查能量水平的函数
    function energyLevel() {
        const energyElement = document.querySelector(".user-tap-energy p");
        if (energyElement) {
            return parseInt(energyElement.textContent.split(" / ")[0], 10);
        }
        return 0;
    }


    // 使用按钮中心坐标模拟点击的函数
    async function simulateTap(button, delay) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + (rect.width / 2);
        const centerY = rect.top + (rect.height / 2);

        const downEvent = new PointerEvent('pointerdown', {
            bubbles: true,
            clientX: centerX,
            clientY: centerY
        });

        const upEvent = new PointerEvent('pointerup', {
            bubbles: true,
            clientX: centerX,
            clientY: centerY
        });

        button.dispatchEvent(downEvent);
        await new Promise(resolve => setTimeout(resolve, delay));
        button.dispatchEvent(upEvent);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    async function dotTap(button) {
        if (energyLevel() > 100) {
            await simulateTap(button, dotDelay);
        }
    }

    async function dashTap(button) {
        if (energyLevel() > 100) {
            await simulateTap(button, dashDelay);
        }
    }

    function pauseBetweenLetters() {
        return new Promise(resolve => setTimeout(resolve, pauseDelay));
    }


    // 将文本转换为摩尔斯电码的函数
    function textToMorse(text) {
        const morseCodeMap = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
            'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
            'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..', ' ': ' '
        };

        return text.toUpperCase().split('').map(char => {
            if (char in morseCodeMap) {
                return morseCodeMap[char];
            } else if (char === ' ') {
                return ' ';
            }
            return '';
        }).join(' ');
    }


    // 将摩尔斯电码转换为点击的函数
    async function textToTap(morseString) {
        const button = findTapButton();
        if (!button) {
            console.log('未找到按钮');
            return;
        }

        let clickWord = 0;
        let clickTime = 0;

        for (const char of morseString) {
            switch (char) {
                case '.':
                    await dotTap(button);
                    clickWord++;
                    clickTime += dotDelay;
                    break;
                case '-':
                    await dashTap(button);
                    clickWord++;
                    clickTime += dashDelay;
                    break;
                case ' ':
                    await pauseBetweenLetters();
                    break;
            }


            // 每次点击前检查能量水平
            const energyNow = energyLevel();
            const waitTime = actionCanProceed(energyNow, clickWord, clickTime, multiplyTap);
            if (waitTime > 0) {
                                console.log(`能量不足，等待 ${waitTime}ms`);
                await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
            }
        }

        await pauseBetweenLetters();
    }

    // 用于检查是否可以继续执行操作的功能
    function actionCanProceed(energyNow, clickWord, clickTime, multiplyTap) {
        let energyCost = Math.ceil((clickWord * multiplyTap) - ((clickTime / 1000) * 3));
        let waitUntilEnergy = 0;

        if (energyCost > energyNow) {
            waitUntilEnergy = Math.ceil((energyCost - energyNow) / 3 + 3);
        }

        return waitUntilEnergy;
    }

    // 自动点击功能
    function checkEnergyAndClick() {
        if (!isClicking) return;

        const button = findTapButton();
        if (!button) {
            console.log('未找到按钮');
            return;
        }

        const energy = energyLevel();
        if (energy > 100) {
            simulateTap(button, dotDelay);
        }

        requestAnimationFrame(checkEnergyAndClick);
    }

    let isClicking = false;

    function toggleClicking() {
        isClicking = !isClicking;
        updateClickButtonState(document.getElementById('clickButton'));
        if (isClicking) {
            requestAnimationFrame(checkEnergyAndClick);
        }
    }

    function updateClickButtonState(button) {
    if (isClicking) {
        button.style.backgroundColor = '#4CAF50'; // green
        button.textContent = '停止点击';
    } else {
        button.style.backgroundColor = '#FF0000'; // red
        button.textContent = '开始点击';
    }
    // 添加一些CSS属性以美化按钮
    button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    button.style.transition = 'background-color 0.3s, transform 0.2s';
    button.style.fontSize = '16px';
    button.style.fontWeight = 'bold';
}

	function createClickButton() {
		let clickButton = document.getElementById('clickButton');
		if (!clickButton) {
			clickButton = document.createElement('button');
			clickButton.id = 'clickButton';
			clickButton.style.position = 'fixed';
			clickButton.style.top = '10px';
			clickButton.style.left = '10px';
			clickButton.style.zIndex = '1000';
			clickButton.style.padding = '10px 20px';
			clickButton.style.color = 'white';
			clickButton.style.border = 'none';
			clickButton.style.borderRadius = '5px';
			clickButton.style.cursor = 'pointer';
			clickButton.style.margin = '5px';
			clickButton.style.backgroundColor = '#FF0000'; // 默认红色背景
			clickButton.addEventListener('mouseenter', () => {
				clickButton.style.transform = 'scale(1.1)';
			});
			clickButton.addEventListener('mouseleave', () => {
				clickButton.style.transform = 'scale(1)';
			});
			updateClickButtonState(clickButton);

			clickButton.addEventListener('click', toggleClicking);

			document.body.appendChild(clickButton);
		}
	}

	function addInputField() {
		const inputField = document.createElement('input');
		inputField.type = 'text';
		inputField.id = 'morseInputField';
		inputField.placeholder = '输入今日密码文本后回车';
		inputField.style.position = 'fixed';
		inputField.style.top = '10px';
		inputField.style.right = '10px';
		inputField.style.zIndex = '1000';
		inputField.style.padding = '10px';
		inputField.style.backgroundColor = 'whirgb(239, 238, 183)';
		inputField.style.border = '2px solid rgb(183 221 72)';
		inputField.style.fontSize = '16px';
		inputField.style.borderRadius = '5px';
		inputField.style.boxShadow = 'rgb(204, 217, 29) 0px 4px 8px';
		inputField.style.transition = 'border-color 0.3s';
		inputField.addEventListener('focus', () => {
			inputField.style.borderColor = '#4CAF50';
		});
		inputField.addEventListener('blur', () => {
			inputField.style.borderColor = '#000';
		});
		document.body.appendChild(inputField);

		inputField.addEventListener('keydown', async function(event) {
			if (event.key === 'Enter') {
				event.preventDefault();
				const text = inputField.value;
				const morseString = textToMorse(text);
				console.log('Converted Morse Code:', morseString);

				// 使用摩尔斯电码模拟按钮点击
				await textToTap(morseString);

				// 清除输入框
				inputField.value = '';
			}
		});
	}

    // hamsterkombatgame.io 的基本逻辑
    function hamsterkombatFunctionality() {
        window.addEventListener('load', () => {
            createClickButton();

            const observer = new MutationObserver(() => {
                if (!document.getElementById('clickButton')) {
                    createClickButton();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            // 添加摩尔斯电码转换输入框
            addInputField();
        });
    }

    // web.telegram.org 的基本逻辑
    function telegramFunctionality() {
        function waitForIframe(selector, callback) {
            const iframe = document.querySelector(selector);
            if (iframe) {
                callback(iframe);
            } else {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length) {
                            const iframe = document.querySelector(selector);
                            if (iframe) {
                                observer.disconnect();
                                callback(iframe);
                            }
                        }
                    });
                });

                observer.observe(document.body, { childList: true, subtree: true });
            }
        }

        function getIframeSrc(callback) {
            const selector = "body > div.popup.popup-payment.popup-payment-verification.popup-web-app.active > div > div.popup-body > iframe";
            waitForIframe(selector, (iframe) => {
                const src = iframe.getAttribute('src');
                if (callback) callback(src);
            });
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('将链接复制到剪贴板!');
            }).catch(err => {
                console.error('复制到剪贴板时出错: ', err);
            });
        }

        function createCopyButton() {
            const copyButtonStyles = {
                position: 'fixed',
                top: '10px',
                right: '10px',
                zIndex: '1000',
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                margin: '5px'
            };

            let copyButton = document.getElementById('copyButton');
            if (!copyButton) {
                copyButton = document.createElement('button');
                copyButton.id = 'copyButton';
                copyButton.textContent = 'Копировать ссылку';
                Object.assign(copyButton.style, copyButtonStyles);

                copyButton.addEventListener('click', () => {
                    getIframeSrc((src) => {
                        if (src) {
                            copyToClipboard(src);
                        } else {
                            console.error('未找到链接.');
                        }
                    });
                });

                document.body.appendChild(copyButton);
            }
        }

        window.addEventListener('load', () => {
            createCopyButton();

            const observer = new MutationObserver(() => {
                if (!document.getElementById('copyButton')) {
                    createCopyButton();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // 根据 URL 启动相关功能
    if (currentUrl.includes('web.telegram.org')) {
        telegramFunctionality();
    } else if (currentUrl.includes('hamsterkombatgame.io')) {
        hamsterkombatFunctionality();
    }
})();
