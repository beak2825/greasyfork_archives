// ==UserScript==
// @name         Hamster Clicker
// @namespace    http://tampermonkey.net/
// @version      1.2.7
// @description  TJMC Hamster Combat Clicker
// @author       MakAndJo
// @match        https://web.telegram.org/a*
// @match        https://hamsterkombat.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hamsterkombat.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498138/Hamster%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/498138/Hamster%20Clicker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getRandomNumber(min, max) {
        if (min > max) {
            let temp = min;
            min = max;
            max = temp;
        }
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // Telegram Hook
    if (window.location.href.startsWith('https://web.telegram.org/a')) {
        function onModalOpen() {
            const frame = document.querySelector('.Modal iframe[src]');
            if (!frame) return;
            const url = new URL(frame.getAttribute('src'));
            if (url.host != "app.hamsterkombat.io") return;
            const params = new URLSearchParams(url.hash.substring(1));
            params.set('tgWebAppPlatform', 'ios');
            url.hash = '#' + params.toString();
            const button = document.createElement('button');
            button.textContent = "Follow";
            button.addEventListener('click', () => window.open(url.toString(), '_blank'));
            frame.parentNode.appendChild(button);
            console.debug("Follow Link:", url.toString());
        }
        const callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== 1) return;
                        if (node.nodeName == 'DIV' && node.firstChild?.matches('.Modal')) {
                            onModalOpen();
                        }
                    });
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document.querySelector('#portals'), { childList: true, subtree: true });
    }

    // Clicker Hook
    if (window.location.href.startsWith('https://hamsterkombat.io/')) {

        const fetchConfig = async () => {
            if (!window.localStorage.getItem('authToken')) return;
            const clickerConfig = await fetch("https://api.hamsterkombat.io/clicker/config", {
                "headers": {
                    "accept": "*/*",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "authorization": "Bearer " + window.localStorage.getItem('authToken'),
                },
                "referrer": "https://hamsterkombat.io/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "POST",
                "mode": "cors",
            }).then(e => e.json());
            console.debug("[tc.fetch]", "fetched config", clickerConfig);
            return clickerConfig;
        };

        const fetchDailyCombos = async () => {
            const clickerConfig = await fetch("https://api.tjmc.ru/v2/hamstercombat/dailyCombo", {
                "headers": {
                    "accept": "*/*",
                    "authorization": "Bearer " + window.localStorage.getItem('authToken'),
                },
                "method": "GET",
            }).then(e => e.json()).catch(() => void 0);
            console.debug("[tc.fetch]", "fetched dailyCombo", clickerConfig);
            return clickerConfig || [];
        };

        const runClicker = (clickerConfig) => {

            // draw ui
            const cipherNode = document.createElement('p');
            cipherNode.style.fontSize = "2rem";
            const statusNode = document.createElement('p');
            const draw = ({ status, cipher }) => {
                if (!document.contains(statusNode)) document.querySelector('div.user-tap')?.appendChild(statusNode);
                if (status) statusNode.textContent = status;
                // console.debug("[tc.status]", status);
                if (!document.contains(cipherNode)) document.querySelector('div.user-tap')?.appendChild(cipherNode);
                if (cipher) cipherNode.textContent = cipher;
                cipherNode.style.opacity = 0;
                if (document.querySelector('button.user-tap-button')?.matches(".is-morse-mode")) cipherNode.style.opacity = 1;
            };

            // Morse code mapping
            const morseCodeMap = {
                'A': '.-',     'B': '-...',   'C': '-.-.',   'D': '-..',    'E': '.',
                'F': '..-.',   'G': '--.',    'H': '....',   'I': '..',     'J': '.---',
                'K': '-.-',    'L': '.-..',   'M': '--',     'N': '-.',     'O': '---',
                'P': '.--.',   'Q': '--.-',   'R': '.-.',    'S': '...',    'T': '-',
                'U': '..-',    'V': '...-',   'W': '.--',    'X': '-..-',   'Y': '-.--',
                'Z': '--..',   '0': '-----',  '1': '.----',  '2': '..---',  '3': '...--',
                '4': '....-',  '5': '.....',  '6': '-....',  '7': '--...',  '8': '---..',
                '9': '----.'
                };
            function wordToMorse(word) {
                return word.toUpperCase().split('').map(char => morseCodeMap[char] || '').join(' ');
            }

            var cipher = null;

            (async () => { // cipher parser
                function cipherDecode(e) {
                    const t = `${e.slice(0, 3)}${e.slice(4)}`;
                    return window.atob(t)
                }

                const setCipher = (e) => draw({ cipher: e });
                const onUpdateScreen = () => {
                    let dailyCipher = clickerConfig?.dailyCipher;
                    cipher = dailyCipher?.cipher ? cipherDecode(dailyCipher.cipher) : "";
                    // if (dailyCipher?.isClaimed) return;
                    setCipher(`Cipher: ${wordToMorse(cipher).replace(/\./g, "•")} (${cipher}) ` + (dailyCipher?.isClaimed ? "✅" : ""));
                };

                const observer = new MutationObserver(function (mutationsList, observer) {
                    for (let mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            if ((mutation.target.matches('div.page') && mutation.target.querySelector('.user-level'))) return onUpdateScreen();
                        }
                    }
                });
                observer.observe(document.querySelector('#__nuxt'), { childList: true, subtree: true });
                setTimeout(onUpdateScreen);
            })();

            (() => { // clicker function
                const DELAY_RG = 60;
                var tapButton = document.querySelector("main > div button.user-tap-button");
                var tapButtonInner = tapButton.querySelector("div.user-tap-button-inner").getBoundingClientRect();

                const setStatus = (e) => draw({ status: e });

                const updateTapButton = () => {
                    if (!document.querySelector('button.user-tap-button')) return tapButton;
                    if (document.querySelector('button.user-tap-button') && !document.contains(tapButton)) {
                        tapButton = document.querySelector("button.user-tap-button");
                        if (!tapButton) return;
                        tapButtonInner = tapButton.querySelector("div.user-tap-button-inner").getBoundingClientRect();
                    }
                };
                const getEnergy = () => document.querySelector('div.user-tap-energy > p')?.textContent.split('/').map(part => part.trim()) || [0, 0];

                function simulateClick(element) {
                    const event = new MouseEvent('click', {
                      view: window,
                      bubbles: true,
                      cancelable: true
                    });
                    element.dispatchEvent(event);
                }

                const triggerMorseMode = (callback = () => {}) => {
                    const btn = document.querySelector("ul.user-stats > li > .user-stats-item:first-child");
                    for (let i = 0; i < 3; i++) {
                        setTimeout(() => {
                            simulateClick(btn);
                        }, i * 1e2);
                    }
                    setTimeout(callback, (3 * 1e2) + 1e2);
                };

                function simulatePointerEvents(delay, duration, symbol) {
                    setTimeout(() => {
                        setStatus("running morse ⏩️");
                        updateTapButton();
                        const opt = Object.seal({
                            bubbles: true,
                            cancelable: true,
                            pointerId: 1,
                            pointerType: 'mouse',
                            clientX: tapButtonInner.x + (tapButtonInner.width / 2),
                            clientY: tapButtonInner.y + (tapButtonInner.height / 2),
                        });
                        const pointerDownEvent = new PointerEvent('pointerdown', opt);
                        tapButton.dispatchEvent(pointerDownEvent);
                        setTimeout(() => {
                            const pointerUpEvent = new PointerEvent('pointerup', opt);
                            tapButton.dispatchEvent(pointerUpEvent);
                        }, duration)
                    }, delay);
                }

                var runningMorse = false;
                const startMorse = (callback = () => {}) => {
                    if (!cipher || cipher == "") return;
                    const morseString = wordToMorse(cipher);
                    const dotDuration = 200;  // Duration of a dot
                    const dashDuration = 600; // Duration of a dash
                    const symbolGap = 300;    // Gap between symbols (dots and dashes)
                    const letterGap = 1000;    // Gap between letters

                    let currentDelay = 500;

                    morseString.split('').forEach((symbol) => {
                        if (symbol === '.') {
                        simulatePointerEvents(currentDelay, dotDuration, symbol);
                        currentDelay += dotDuration + symbolGap;
                        } else if (symbol === '-') {
                        simulatePointerEvents(currentDelay, dashDuration, symbol);
                        currentDelay += dashDuration + symbolGap;
                        } else if (symbol === ' ') {
                        currentDelay += letterGap; // Adding extra delay for letter gaps
                        }
                    });
                    setTimeout(() => {
                        runningMorse = false;
                        document.documentElement.style["pointerEvents"] = null;
                        document.querySelector(".app-bar-nav").style["pointerEvents"] = "all";
                        callback();
                    }, currentDelay);
                    document.documentElement.style["pointerEvents"] = "none";
                    document.querySelector(".app-bar-nav").style["pointerEvents"] = "inherit";
                    runningMorse = true;
                    return true;
                }

                var regenTime = 0;
                const waitRegen = () => {
                    setStatus("waiting 🔄️ " + regenTime);
                    regenTime -= 1;
                    setTimeout(tap, 1e3);
                };
                const waitTab = () => {
                    regenTime = 0;
                    setStatus("waiting tab 🅰️");
                    setTimeout(tap, 3e2);
                };
                const waitMorse = () => {
                    if (runningMorse) return;
                    regenTime = 0;
                    setStatus("waiting morse 🆘");
                    cipherNode.onclick = () => {
                        const callback = () => {
                            cipherNode.onclick = null;
                            triggerMorseMode(() => {
                                setTimeout(tap, 1e2);
                            });
                        }
                        if (startMorse(callback)) return;
                    };
                    setTimeout(tap, 3e2);
                };
                const tap = () => {
                    if (!document.querySelector(".app-bar > nav > a:first-child")?.matches(".router-link-active")) return setTimeout(waitTab);
                    if (document.querySelector('button.user-tap-button')?.matches(".is-morse-mode")) return setTimeout(waitMorse);
                    cipherNode.onclick = null;
                    if (regenTime > 0) return setTimeout(waitRegen);
                    if (getEnergy()[0] < 100) {
                        regenTime = DELAY_RG;
                        return setTimeout(waitRegen);
                    }
                    setStatus("working ✳️");
                    updateTapButton();
                    const opt = Object.seal({
                        bubbles: true,
                        cancelable: true,
                        pointerId: 1,
                        pointerType: 'mouse',
                        // clientX: tapButtonInner.x + (tapButtonInner.width / 2),
                        // clientY: tapButtonInner.y + (tapButtonInner.height / 2),
                        clientX: getRandomNumber(tapButtonInner.x, tapButtonInner.x + tapButtonInner.width),
                        clientY: getRandomNumber(tapButtonInner.y, tapButtonInner.y + tapButtonInner.height),
                    });
                    const pointerDownEvent = new PointerEvent('pointerdown', opt);
                    const pointerUpEvent = new PointerEvent('pointerup', opt);
                    tapButton.dispatchEvent(pointerDownEvent);
                    tapButton.dispatchEvent(pointerUpEvent);
                    setTimeout(tap, 5e1);
                };
                setTimeout(tap);
            })();
        };

        const runMarketSuggestion = async ({ clickerConfig }) => {
            // const upgradeIds = [
            //     "it_team",
            //     "meme_coins",
            //     "web3_academy_launch"
            // ];
            // const upgradeNames = clickerConfig.upgrades?.filter(e => upgradeIds.includes(e.id)).map(e => e.name) || [];
            var dailyCombos = await fetchDailyCombos();

            function isExpiredDate(date) {
                return new Date(date) < new Date();
            }

            function convertToNumber(input) {
                let sanitizedInput = input.toString().replace(',', '.').replace(/,/g, '');
                if (sanitizedInput.endsWith('K')) {
                    let numberPart = parseFloat(sanitizedInput.slice(0, -1));
                    return numberPart * 1000;
                } else if (sanitizedInput.endsWith('M')) {
                    let numberPart = parseFloat(sanitizedInput.slice(0, -1));
                    return numberPart * 1000000;
                }
                return parseFloat(sanitizedInput);
            }

            const onUpgradeChange = () => {
                var upgradeNames = [];
                let upgrades = dailyCombos.filter(e => !isExpiredDate(e.date));
                if (!upgrades.length) {
                    fetchDailyCombos().then(e => dailyCombos = e);
                    upgradeNames = [];
                } else {
                    upgradeNames = upgrades[0]['upgradeNames'];
                }
                const upgradeItems = [];
                document.querySelectorAll('.upgrade-list > .upgrade-item').forEach((item) => {
                    const title = item.querySelector('.upgrade-item-title')?.textContent || "";
                    const itemProfit = convertToNumber(item.querySelector('.upgrade-item-profit .price-value')?.textContent || 0);
                    const itemPrice = convertToNumber(item.querySelector('.upgrade-item-detail .price-value')?.textContent || 0);
                    upgradeItems.push({ title, profit: itemProfit, price: itemPrice, node: item, prod: itemPrice / itemProfit, special: false });
                });
                document.querySelectorAll('.upgrade-list > .upgrade-special').forEach((item) => {
                    const title = item.querySelector('.upgrade-special-title')?.textContent || "";
                    const itemProfit = convertToNumber(item.querySelector('.upgrade-special-profit .price-value')?.textContent || 0);
                    const itemPrice = convertToNumber(item.querySelector('.upgrade-special-detail .price-value')?.textContent || 0);
                    upgradeItems.push({ title, profit: itemProfit, price: itemPrice, node: item, prod: itemPrice / itemProfit, special: true });
                });
                const averageProd = upgradeItems.reduce((sum, item) => sum + item.prod, 0) / upgradeItems.length;
                upgradeItems.forEach(item => {
                    if (upgradeNames.includes(item.title)) item.node.style.border = "2px solid green";
                    if (!item.prod) return;
                    const prodChild = document.createElement('div');
                    prodChild.style.position = "absolute";
                    prodChild.style.bottom = "0.8rem";
                    prodChild.style.right = "0.8rem";
                    prodChild.style.background = "black";
                    prodChild.style.padding = "0px 6px";
                    prodChild.style.width = "auto";
                    prodChild.style.height = "18px";
                    prodChild.style.lineHeight = "18px";
                    prodChild.style.fontWeight = 700;
                    prodChild.style.textAlign = "center";
                    prodChild.style.borderRadius = "5px";
                    prodChild.style.zIndex = 3;
                    prodChild.style.overflow = "hidden";
                    prodChild.textContent = Math.round(item.prod);
                    if (item.prod < averageProd) prodChild.style.background = "#522";
                    if (item.prod < (averageProd / 2)) prodChild.style.background = "#822";
                    if (item.prod < (averageProd / 4)) prodChild.style.background = "#a22";
                    item.node.appendChild(prodChild);

                    if (item.prod < averageProd) item.node.style.background = "#322";
                    if (item.prod < (averageProd / 2)) item.node.style.background = "#522";
                    if (item.prod < (averageProd / 4)) item.node.style.background = "#822";

                });
            }

            const observer = new MutationObserver(function (mutationsList, observer) {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        if (mutation.target.matches('.upgrade-list')
                            || mutation.target.querySelector('.upgrade-list')
                        ) return onUpgradeChange();
                    }
                }
            });
            observer.observe(document.querySelector('#__nuxt'), { childList: true, subtree: true });
        };

        var appReady = false;
        const onAppReady = () => {
            if (appReady) return;
            (appReady = true, observer.disconnect());
            fetchConfig().then(config => {
                runClicker(config);
                runMarketSuggestion(config);
            });
        };

        const observer = new MutationObserver(function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== 1) return;
                        if (node.nodeName == 'MAIN') onAppReady();
                    });
                }
            }
        });

        observer.observe(document.querySelector('#__nuxt'), { childList: true, subtree: true });
    }

})();