// ==UserScript==
// @name         u2u
// @namespace    http://tampermonkey.net/
// @version      21.7
// @description  try to take over the world!
// @author       Youhttps://dashboard.union.build/achievements
// @match        *://*.blockx.fun/*
// @match        *://*.sidequest.rcade.game/*
// @match        https://pentagon.games/sign-in
// @match        *://*.forge.gg/*
// @match        *://*.cryptopond.xyz/*
// @match        https://swap.hemi.xyz/
// @match        *://*.points.reddio.com/*
// @match        https://park.skatechain.org/en/nft
// @match        *://*.space3.gg/*
// @match        https://plume-testnet.realtyx.co/
// @match        *://*.adamdefi.io/*
// @match        https://www.360.cn/
// @match        *://*.testnet.kappalending.com/*
// @match        https://dashboard.union.build/achievements
// @match        *://*.testnet.zulunetwork.io/*
// @match        https://testnet.zulunetwork.io/lwazi?code=6S4TVJ
// @match        *://*.testnet.grofidex.io/*
// @match        *://*.u2quest.io/*
// @match        *://*.app.infinityai.network/*
// @match        https://www.communitygaming.io/
// @match        https://testnet-bridge.reddio.com/
// @match        https://testnet.musicprotocol.finance/
// @match        https://miles.plumenetwork.xyz/
// @match        https://backpack.app/
// @match        https://app.pluralfinance.com/plume-testnet/
// @match        https://app.elyfi.world/pools/plumetestnet/10
// @match        https://app.mysticfinance.xyz/en/lend
// @match        https://dev-plume.landx.co/
// @match        *://*.faucet.uniultra.xyz/*
// @match        *://*.testnet.blockfun.io/*
// @match        *://*.miles.plumenetwork.xyz/*
// @match        *://*.plume.ambient.finance/*
// @match        *://*.faucet.plumenetwork.xyz/*
// @match        *://*.miles.plumenetwork.xyz/*
// @match        *://*.theiachat.chainbase.com/*
// @match        *://*.genesis.chainbase.com/*
// @match        *://*.landshare-plume-sandbox.web.app/*
// @match        *://*.plume.kuma.bond/*
// @match        *://*.app.solidviolet.com/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grofidex.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499292/u2u.user.js
// @updateURL https://update.greasyfork.org/scripts/499292/u2u.meta.js
// ==/UserScript==

function checkTextContent(selector, expectedText) {
    try {
        var element = document.querySelector(selector);
        if (element.textContent.trim() === expectedText) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
    }
}
const originalStringify = JSON.stringify;

const Delay = Math.random() * 10000;
(function() {
    'use strict';
    // 获取按钮元素
    if (window.location.href == 'https://park.skatechain.org/en/nft') {
        setInterval(() => {
            const mintButton = document.querySelector("body > main > div > div > div.MuiContainer-root.MuiContainer-maxWidthXl.css-1ekb41w > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-6.css-1rp7odp > div > div.MuiBox-root.css-1yjvs5a > button");
            if (mintButton.classList.contains('Mui-disabled')) {
                console.log('按钮已禁用（点击状态）');
            } else {
                setTimeout(() => {
                    mintButton.dispatchEvent(clickEvent);
                    JSON.stringify({ clicked: true, mintButton: mintButton.outerHTML })
                }, Delay);
            }
            var btnhide = document.querySelector("body > div.MuiDialog-root.MuiModal-root.css-fps1dg > div.MuiDialog-container.MuiDialog-scrollPaper.css-ekeie0 > div > div > div > div.MuiBox-root.css-1l4w6pd > button");
            if (btnhide){
                btnhide.dispatchEvent(clickEvent);
                JSON.stringify({ clicked: true, btnhide: btnhide.outerHTML })
            }
        }, 3000);
    }
    // Your code here...
})();
(function() {
    var falg1 = true;var falg2 = true;var falg3 = true;
    var falg4 = true;var falg5 = true;var falg6 = true;
    var falg7 = true;var falg8 = true; var falg9 = true;
    var falg10= true;var falg11= true;var falg12= true;
    var falg13= true; var falg15= true;var falg16= true;
    var falg17= true;var falg18= true;var falg19= true;
    var falg20= true;var falg21= true;var falg22= true;
    var falg23= true;var falg24= true;var falg25= true;
    var falg26= true;var falg27= true;var falg14= false;
    var falg28= true;var falg29= true;var falg30= true;
    var falg31= true;var falg32= true;var falg33= true;
    var falg34= true;
    'use strict';
    const Delaya = Math.floor(Math.random() * 30 + 1) * 1000;
    setInterval(() => {
        if (document.readyState === "complete") {
            if (window.location.href == 'https://points.reddio.com/task' || window.location.href == 'https://points.reddio.com/task?invite_code=2IFX9'){
                var metamask = document.querySelector("body > div:nth-child(16) > div > div > div._9pm4ki5.ju367va.ju367v15.ju367v8r > div > div > div > div > div.iekbcc0.ju367va.ju367v15.ju367v4y._1vwt0cg3 > div.iekbcc0.ju367v6p._1vwt0cg2.ju367v7a.ju367v7v > div:nth-child(2) > div:nth-child(1) > button")
                if(metamask && falg1){
                    falg1=false;
                    metamask.click();
                }
            }
        }
    },1000)

})();

const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
});
function clickElementByXPath(xPath) {var element = document.evaluate(xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;if (element) {element.click();}}
function simulateButtonClick(selector, expectedText = null) {
    return new Promise((resolve) => {
        const randomDelay = Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
        const button = document.querySelector(selector);
        if (!button) {
            resolve(false);
            return;
        }
        if (expectedText !== null) {
            const buttonText = button.innerHTML.trim();
            if (buttonText === expectedText) {
                console.log("Button text matches expected text.");
            } else {
                console.log(`Button text does not match. Expected: "${expectedText}", Found: "${buttonText}"`);
                resolve(false);
                return;
            }
        }
        setTimeout(() => {
            button.dispatchEvent(clickEvent);
            JSON.stringify({ clicked: true, button: button.outerHTML });
            resolve(true);
        }, randomDelay);
    });
}
function waitAndClickElement(xpaths) {
document.querySelector("body > div:nth-child(1) > div > div.chakra-stack.css-4enqzv > div.chakra-stack.css-1igwmid > div > button")
    try {
        var modal = document.querySelector(xpaths);
        if (modal) {
            var target = modal.shadowRoot.querySelector("wui-flex > wui-card > w3m-router").shadowRoot.querySelector("div > w3m-connect-view").shadowRoot.querySelector("wui-flex > w3m-wallet-login-list").shadowRoot.querySelector("wui-flex > w3m-connect-injected-widget").shadowRoot.querySelector("wui-flex > wui-list-wallet").shadowRoot.querySelector("button");
            if (target) {
                target.dispatchEvent(clickEvent);
            } else {
                setTimeout(() => waitAndClickElement(xpaths), 3000);
            }
        } else {
            setTimeout(() => waitAndClickElement(xpaths), 3000);
        }
    } catch (error) {
        setTimeout(() => waitAndClickElement(xpaths), 3000);
    }
}

(function() {
    'use strict';
    var falg1 = true;
    var falg2 = true;
    var falg3 = true;
    var falg4 = true;
    var falg5 = true;
    var falg6 = true;
    var falg7 = true;
    var falg8 = true;
    var falg9 = true;
    var falg10 = true;
    var falg11 = true;
    var falg12 = true;
    var falg13 = true;
    var falg14 = true;
    var falg15 = true;
    var falg16 = true;
    var falg17 = true;
    var falg18 = true;
    var falg19 = true;
    var falg20 = true;
    var falg21 = true;
    var falg22 = true;
    var falg23 = true;
    var falg24 = true;
    var falg25 = true;
    var falg26 = true;
    var falg27 = true;
    var falg28 = true;
    var falg29 = true;
    var falg30 = true;
    var falg31 = true;
    var falg32 = true;
    var falg33 = true;
    var falg34 = true;
     var falg35 = true;
    setInterval(() => {
        if (window.location.href == 'https://app.infinityai.network/'){
            const elements = document.querySelectorAll('div');
            for (let i =0; i < elements.length; i++) {
                const pElement = elements[i].querySelector('p');
                if (pElement && pElement.innerHTML=="UniSat" && falg35) {
                    falg35=false;
                    pElement.click();
                    return;
                }
            }
        }
     },3000)
})();

JSON.stringify = function(...args) {
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    return originalStringify.apply(this, args);
};

Object.defineProperty(JSON.stringify, 'name', { value: 'stringify' });
JSON.stringify.toString = originalStringify.toString.bind(originalStringify);


(function() {
    'use strict';
    if(window.location.href == 'https://swap.hemi.xyz/' || window.location.href == 'https://swap.hemi.xyz/?chain=Hemi+Sepolia'){
        setTimeout(function() {
            let flag = true;
            setInterval(() => {
                let successCount = parseInt(sessionStorage.getItem('successfulSwaps') || '0');
                if (!sessionStorage.getItem('successfulSwaps') || sessionStorage.getItem('successfulSwaps')==null) {
                    sessionStorage.setItem('successfulSwaps', '0');
                }
                var swapSubmitted = document.querySelector("[data-testid='pending-modal-content-title']");
                if (swapSubmitted && swapSubmitted.textContent.includes('Swap submitted') && flag) {
                    successCount++;
                    flag = false;
                    sessionStorage.setItem('successfulSwaps', successCount.toString());
                    setTimeout(() => {
                        if(successCount>0){
                            location.reload();
                        }
                    }, 60000);
                    setTimeout(() => {
                         if(successCount<1){
                            window.open('https://earn.taker.xyz/', '_self');
                        }
                    }, 160000);
                }else {
                    console.log("Swap not submitted or already counted");
                }
            },200)
            setInterval(() => {
                let successCount = parseInt(sessionStorage.getItem('successfulSwaps') || '0');

                if (successCount >= 3) {
                    setTimeout(() => {
                        sessionStorage.removeItem('successfulSwaps');
                        window.open('https://earn.taker.xyz/', '_self');
                        return;
                    }, 6000);
                }

                var warningElement = document.querySelector("[data-testid='pending-modal-content-title']");
                if (warningElement && warningElement.textContent.includes('Warning')) {
                    console.log("Warning detected, refreshing page");
                    location.reload();
                }

            },1000)
        }, 30000);
    }
})();

(function() {
    'use strict';
    let userf = true;
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;
    const originalQuerySelector = document.querySelector;

    window.setTimeout = function(callback, delay) {
        const randomDelay = delay + (Math.random() - 0.5) * 200;
        return originalSetTimeout(callback, randomDelay);
    };

    window.setInterval = function(callback, delay) {
        const randomDelay = delay + (Math.random() - 0.5) * 200;
        return originalSetInterval(callback, randomDelay);
    };

    function randomy(min, max) {
        return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1) + min)));
    }

    async function waitForElement(selector, timeout = 30000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const element = document.querySelector(selector);
            if (element) {
                return element;
            }
            await randomy(50, 150);
        }
        throw new Error(`Element ${selector} not found within ${timeout}ms`);
    }

    async function simulateHumanClick(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 10;
        const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 10;

        element.dispatchEvent(new MouseEvent('mousemove', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        }));

        await randomy(50, 150);

        element.dispatchEvent(new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        }));
    }

    async function simulatePaste(element, text) {
        const pasteEvent = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true,
            clipboardData: new DataTransfer()
        });
        pasteEvent.clipboardData.setData('text/plain', text);
        element.dispatchEvent(pasteEvent);
        document.execCommand('insertText', false, text);
    }

    async function clickElement(selector, expectedText = null) {
        try {
            const element = await waitForElement(selector);
            if (expectedText) {
                const elementText = element.innerText.trim().toUpperCase();
                const expectedUpperText = expectedText.trim().toUpperCase();
                if (elementText !== expectedUpperText) {
                    console.log(`Text mismatch: Expected "${expectedUpperText}", found "${elementText}"`);
                    return false;
                }
            }
            await simulateHumanClick(element);
            console.log(`Clicked element: ${selector}`);
            return true;
        } catch (error) {
            console.error(`Error clicking element ${selector}:`, error);
            return false;
        }
    }

    async function inputText(selector, eventType, inputValue, isPaste = false) {
        try {
            const inputElement = await waitForElement(selector);

            if (inputElement.value !== '') {
                console.log(`Input field ${selector} is not empty. Skipping input.`);
                return false;
            }

            inputElement.focus();
            await randomy(100, 300);

            if (isPaste) {
                await simulatePaste(inputElement, inputValue);
            } else {
                for (let char of inputValue.toString()) {
                    document.execCommand('insertText', false, char);
                    await randomy(50, 150);
                }
            }

            inputElement.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
            await randomy(100, 300);
            inputElement.blur();

            if (inputElement.value === inputValue.toString()) {
                console.log(`Input completed for ${selector}`);
                return true;
            } else {
                console.log(`Input verification failed for ${selector}`);
                return false;
            }
        } catch (error) {
            console.error(`Error inputting text for ${selector}:`, error);
            return false;
        }
    }

    async function performSwap() {
        try {
            console.log(JSON.stringify({ action: 'start_swap', timestamp: new Date().toISOString() }));

            const amount = (Math.random() * (0.001 - 0.0001) + 0.0001).toFixed(6);
            const inputSuccess = await inputText("#swap-currency-input input", "input", amount, true);
            if (!inputSuccess) {
                console.log(JSON.stringify({ action: 'input_failed', timestamp: new Date().toISOString() }));
                return false;
            }
            await randomy(1000, 2000);

            const selectTokenSuccess = await clickElement("#swap-currency-output button");
            if (!selectTokenSuccess) {
                console.log(JSON.stringify({ action: 'select_token_failed', timestamp: new Date().toISOString() }));
                return false;
            }
            await randomy(1000, 2000);

            const usdtSelector = "div[class*='token-item-'] div[title='Tether']";
            const selectUSDTSuccess = await clickElement(usdtSelector);
            if (!selectUSDTSuccess) {
                console.log(JSON.stringify({ action: 'select_usdt_failed', timestamp: new Date().toISOString() }));
                const allTokens = document.querySelectorAll("div[class*='token-item-']");
                for (let token of allTokens) {
                    if (token.textContent.includes("Tether") || token.textContent.includes("USDT")) {
                        await simulateHumanClick(token);
                        console.log(JSON.stringify({ action: 'selected_usdt_alternative', timestamp: new Date().toISOString() }));
                        selectUSDTSuccess = true;
                        break;
                    }
                }
                if (!selectUSDTSuccess) {
                    console.log(JSON.stringify({ action: 'failed_to_select_usdt', timestamp: new Date().toISOString() }));
                    return false;
                }
            }
            await randomy(1000, 2000);

            let swapButton;
            let attempts = 0;
            let trynum = 0;
            let successCount = parseInt(sessionStorage.getItem('successfulSwaps') || '0');

            if (successCount < 3) {
                while (attempts < 30) {
                    swapButton = await waitForElement("#swap-button");
                    if (swapButton && !swapButton.disabled &&
                        swapButton.textContent.trim().toLowerCase() === 'swap' || swapButton.textContent.trim().toLowerCase() === 'Swap anyway') {
                        break;
                    }
                    await randomy(1000, 2000);
                    attempts++;
                }

                if (!swapButton || swapButton.disabled ||
                    swapButton.textContent.trim().toLowerCase() !== 'swap') {
                    console.log(JSON.stringify({ action: 'swap_button_not_clickable', timestamp: new Date().toISOString() }));
                    return false;
                }

                const swapSuccess = await clickElement("#swap-button");
                if (!swapSuccess) {
                    console.log(JSON.stringify({ action: 'swap_click_failed', timestamp: new Date().toISOString() }));
                    return false;
                }
                await randomy(2000, 3000);

                let tryAgainInterval = setInterval(async () => {
                    try {
                        const tryAgainButton = document.evaluate(
                            '/html/body/reach-portal[9]/div[2]/div/div/div/div/div/div/div[2]/div[2]/button',
                            document,
                            null,
                            XPathResult.FIRST_ORDERED_NODE_TYPE,
                            null
                        ).singleNodeValue;

                        if (tryAgainButton && tryAgainButton.textContent.trim().toLowerCase() === 'try again') {
                            trynum++;
                            if(trynum>=3){
                                window.open('https://earn.taker.xyz/', '_self');
                            }
                            console.log(JSON.stringify({ action: 'try_again_button_found', timestamp: new Date().toISOString() }));
                            await simulateHumanClick(tryAgainButton);
                        }
                    } catch (error) {
                        console.log(JSON.stringify({ action: 'try_again_check_error', error: error.message, timestamp: new Date().toISOString() }));
                    }
                }, 3000);

                const confirmButton = await waitForElement("#confirm-swap-or-send");
                if (confirmButton) {
                    await simulateHumanClick(confirmButton);
                    console.log(JSON.stringify({ action: 'confirm_clicked', timestamp: new Date().toISOString() }));
                    await randomy(5000, 8000);
                } else {
                    console.log(JSON.stringify({ action: 'confirm_button_not_found', timestamp: new Date().toISOString() }));
                    return false;
                }


                console.log(JSON.stringify({ action: 'swap_completed', timestamp: new Date().toISOString() }));
                return true;
            }
        } catch (error) {
            console.error(JSON.stringify({ action: 'swap_error', error: error.message, timestamp: new Date().toISOString() }));
            return false;
        }

    }

    function simulateRandomMouseMovement() {
        document.dispatchEvent(new MouseEvent('mousemove', {
            clientX: Math.random() * window.innerWidth,
            clientY: Math.random() * window.innerHeight
        }));
    }

    setInterval(simulateRandomMouseMovement, Math.random() * 5000 + 2000);

    if(window.location.href == 'https://swap.hemi.xyz/' || window.location.href == 'https://swap.hemi.xyz/?chain=Hemi+Sepolia'){
         setTimeout(() => {
            performSwap();
        }, Math.random() * 15000 + 2000);
    }
})();

(function() {
    'use strict';

    let isConnecting = false;
    let lastClickTime = 0;
    let firstButtonClicked = false;

    // 模拟真实的人工点击
    function simulateHumanClick(element) {
        // 随机延迟 100-300ms
        const delay = Math.floor(Math.random() * 200) + 100;

        setTimeout(() => {
            // 创建鼠标移动事件
            const moveEvent = new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: element.getBoundingClientRect().left + 10,
                clientY: element.getBoundingClientRect().top + 10
            });
            element.dispatchEvent(moveEvent);

            // 创建鼠标悬停事件
            const overEvent = new MouseEvent('mouseover', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(overEvent);

            // 创建鼠标按下事件
            const mousedownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0
            });
            element.dispatchEvent(mousedownEvent);

            // 短暂延迟后触发鼠标抬起和点击事件
            setTimeout(() => {
                const mouseupEvent = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0
                });
                element.dispatchEvent(mouseupEvent);

                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    detail: 1
                });
                element.dispatchEvent(clickEvent);
            }, 50);
        }, delay);
    }

    // 检查并点击 METAMASK 按钮
    function checkAndClickMetamaskButton() {
        const buttons = document.querySelectorAll('button.btn-outline');
        for (const button of buttons) {
            if (button.textContent.includes('METAMASK')) {
                simulateHumanClick(button);
                console.log('Metamask button clicked');
                lastClickTime = Date.now();
                firstButtonClicked = true;

                // 15秒后检查第二个按钮
                setTimeout(() => {
                    if (checkAndClickMetaMaskIDButton()) {
                        console.log('Second button found and clicked');
                    } else {
                        console.log('Second button not found after 15s, redirecting...');
                        window.location.href = 'https://pentagon.games/airdrop/ascended';
                    }
                }, 25000);
                return true;
            }
        }
        return false;
    }

    // 检查并点击 MetaMask ID 按钮
    function checkAndClickMetaMaskIDButton() {
        // 尝试通过 XPath 查找按钮
        const xpath = "/html/body/main/div[2]/div/div/div/form/div[6]/button";
        const xpathResult = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const buttonFromXPath = xpathResult.singleNodeValue;

        if (buttonFromXPath) {
            simulateHumanClick(buttonFromXPath);
            console.log('MetaMask ID login button clicked (XPath)');
            setTimeout(() => {
                window.location.href = 'https://pentagon.games/airdrop/ascended';
            }, 25000);
            return true;
        }

        // 备用方案：使用类名查找
        const button = document.querySelector('button.cursor-pointer.flex.flex-row.justify-center.items-center.gap-\\[5px\\]');
        if (button) {
            const label = button.querySelector('label');
            if (label && label.textContent.includes('Login with MetaMask ID')) {
                simulateHumanClick(button);
                console.log('MetaMask ID login button clicked (Class)');
                setTimeout(() => {
                    window.location.href = 'https://pentagon.games/airdrop/ascended';
                }, 25000);
                return true;
            }
        }

        return false;
    }

    // 检查是否仍在登录页面
    function isStillOnLoginPage() {
        return window.location.pathname === '/sign-in';
    }

    // 定期检查和点击按钮
    function periodicCheck() {
        if (!isStillOnLoginPage()) {
            console.log('No longer on login page, stopping checks');
            return;
        }

        console.log('Checking buttons...');

        if (!firstButtonClicked) {
            // 尝试点击第一个按钮，如果失败则直接检查第二个按钮
            if (!checkAndClickMetamaskButton()) {
                console.log('First button not found, checking second button...');
                if (checkAndClickMetaMaskIDButton()) {
                    console.log('Second button found and clicked directly');
                }
            }
        }
    }

    // 检查页面是否基本加载完成
    function isPageBasicallyLoaded() {
        return document.readyState === 'complete' &&
               document.querySelector('form') !== null;
    }

    // 等待页面加载并开始定期检查
    function waitForPageLoad() {
        if (!isPageBasicallyLoaded()) {
            setTimeout(waitForPageLoad, 500);
            return;
        }

        console.log('Page fully loaded, starting periodic checks...');

        // 初始执行一次
        periodicCheck();

        // 每20秒执行一次
        //setInterval(periodicCheck, 25000);
    }

    // 开始等待页面加载
    waitForPageLoad();
})();
function generateRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

(function() {
    'use strict';
    var falg = false;
    var v1 = false;
    var v2 = false;
    var s = true;
    var s1 = true;
    var m = true;
    var t = true;
    const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
    });
    var randomNumber = generateRandomFloat(0.1,0.5).toFixed(2);
    setInterval(() => {
        var meta1 = document.querySelector("body > div:nth-child(4) > div > div > div._9pm4ki5.ju367va.ju367v10.ju367v8m > div > div > div > div > div.iekbcc0.ju367va.ju367v10.ju367v4t._1vwt0cg3 > div.iekbcc0.ju367v6k._1vwt0cg2.ju367v75.ju367v7q > div.iekbcc0.ju367va.ju367v10.ju367v1i > div:nth-child(3) > button")
        var meta2 = document.querySelector("body > div:nth-child(4) > div > div > div._9pm4ki5.ju367va.ju367v10.ju367v8m > div > div > div > div > div.iekbcc0.ju367va.ju367v10.ju367v4t._1vwt0cg3 > div.iekbcc0.ju367v6k._1vwt0cg2.ju367v75.ju367v7q > div.iekbcc0.ju367va.ju367v10.ju367v1i > div:nth-child(2) > button")
        var meta3 = document.querySelector("body > div:nth-child(4) > div > div > div._9pm4ki5.ju367va.ju367v10.ju367v8m > div > div > div > div > div.iekbcc0.ju367va.ju367v10.ju367v4t._1vwt0cg3 > div.iekbcc0.ju367v6k._1vwt0cg2.ju367v75.ju367v7q > div.iekbcc0.ju367va.ju367v10.ju367v1i > div:nth-child(1) > button")
        if(meta1 && meta1.innerText.includes("MetaMask") && m){
            m=false;
            meta1.click();
        }
        if(meta2 && meta2.innerText.includes("MetaMask") && m){
            m=false;
            meta2.click();
        }
        if(meta3 && meta3.innerText.includes("MetaMask") && m){
            m=false;
            meta3.click();
        }
        var Withdraw =document.querySelector("#__next > div > main > div > div.box-border.flex.h-\\[36px\\].items-center.gap-\\[2px\\].rounded-\\[10px\\].bg-\\[\\#f4f4f4\\].p-\\[2px\\].text-\\[14px\\].text-normal > p:nth-child(2)")
        var red = document.querySelector("#__next > div > main > div > div.mt-\\[20px\\].rounded-\\[10px\\].bg-\\[\\#F4F4FA\\].p-\\[20px\\] > div.flex.justify-between > div > p")
        if(Withdraw && !red){
            Withdraw.click();
        }


        var redethContainer = document.querySelector("#__next > div > main > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(2)");
        if (redethContainer) {
            var spanElement = redethContainer.querySelector("span.font-bold.text-bold");
            if (spanElement && spanElement.textContent.includes("redETH")) {
                redethContainer.click(); // 点击元素
            }
        } else {
            console.log("目标元素不存在");
        }


        var inputField = document.querySelector("#__next > div > main > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > input");
        if (inputField && (inputField.value === "" || parseFloat(inputField.value) < 0.001)) {

            inputField.focus();
            document.execCommand('insertText', false, randomNumber);
        } else {
            const withdrawButton = document.querySelector("#__next > div > main > div > button");
            if (withdrawButton && !falg) {
                const isDisabled = withdrawButton.disabled || withdrawButton.classList.contains('disabled');
                if (!isDisabled) {
                    withdrawButton.dispatchEvent(event);
                    console.log("按钮已点击，事件已分发");
                } else {
                    console.log("按钮处于禁用状态，未点击");
                }
            } else {
                if(!v1){
                    let successCount = parseInt(sessionStorage.getItem('successfulSwaps') || '0');
                    if(successCount>0){
                        const withdrawButton = document.querySelector("#__next > div > main > div > div.mb-2.mt-4 > div > div.relative.flex-1.pb-2.text-center.before\\:absolute.before\\:bottom-0.before\\:left-0.before\\:h-\\[2px\\].before\\:bg-blue.before\\:transition-all.before\\:duration-300.before\\:content-\\[\\'\\'\\].after\\:absolute.after\\:bottom-0.after\\:left-0.after\\:h-\\[2px\\].after\\:w-full.after\\:transition-colors.after\\:duration-300.after\\:bg-gray-200.after\\:content-\\[\\'\\'\\].before\\:w-0.cursor-pointer")
                        // 点击 Withdraw 按钮
                        if (withdrawButton && falg) {
                            const isDisabled = withdrawButton.disabled || withdrawButton.classList.contains('disabled');
                            if (!isDisabled) {
                                withdrawButton.dispatchEvent(event);
                                sessionStorage.removeItem('successfulSwaps');
                                v1=true;
                                console.log("Withdraw 按钮已点击，事件已分发");
                            } else {
                                console.log("Withdraw 按钮处于禁用状态，未点击");
                            }
                        } else {
                            console.error("Withdraw 按钮未找到或已经点击");
                        }
                    }
                }
            }
            if(v1){
                var claim = document.querySelector("#__next > div > main > div > div.mt-6.flex.max-h-\\[400px\\].flex-col.gap-4.overflow-y-auto > div:nth-child(1) > button")
                if(claim && s){
                    const isDisabled = claim.disabled || claim.classList.contains('disabled');
                    if(!isDisabled){
                        claim.dispatchEvent(event);
                        s = false;
                        setTimeout(() => {
                            s = true;
                        }, 20000);

                    }
                    setInterval(() => {
                        const alertMessage = document.querySelector('.MuiAlert-message.css-1xsto0d');
                        if (alertMessage && alertMessage.textContent=='Claim failed') {
                            setTimeout(() => {
                                 window.open('https://cryptopond.xyz/modelfactory/detail/306250?tab=4', '_self');
                            }, 2000);
                        }
                    }, 1000);

                }

            }
        }
    },3000)

    setInterval(() => {
        var redioselet = document.querySelector("body > div.MuiPopper-root > div > div:nth-child(2)")
        if(redioselet ){
            redioselet.click();
        }

    },1000)
    var w = true;
    setInterval(() => {
        var sussmsg = document.querySelector("div > div > div.MuiAlert-message.css-1xsto0d")
        if(sussmsg && sussmsg.innerHTML==="Deposit done, please wait for a few minutes for the deposit to arrive" && t){
            t=false;
            window.open('https://cryptopond.xyz/modelfactory/detail/306250?tab=4', '_self');
        }
        if(sussmsg && sussmsg.innerHTML==="Withdrawal completed, please wait a few minutes before claiming" && w){
            falg = true;
            sessionStorage.setItem('successfulSwaps', '1');
        }
    },500)
})();


(function() {
    if(window.location.href === 'https://dashboard.union.build/achievements'){
        'use strict';

        // 你想要跳转的目标页面URL
        const NEXT_PAGE_URL = 'https://2fa.run/'; // 请将这里改为实际的目标URL

        // Function to wait for a specified time
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Function to check if element exists with text content
        function elementExistsWithText(selector, text) {
            return new Promise(resolve => {
                const checkExist = setInterval(() => {
                    const elements = document.querySelectorAll(selector);
                    for (let element of elements) {
                        if (element.textContent.includes(text)) {
                            clearInterval(checkExist);
                            resolve(element);
                            return;
                        }
                    }
                }, 100);
            });
        }

        // Function to scroll and find the next uncompleted achievement
        async function findNextUncompletedAchievement(processedAchievements) {
            let lastScrollPosition = 0;
            const scrollStep = 500;
            const maxScrollAttempts = 20;

            for (let attempt = 0; attempt < maxScrollAttempts; attempt++) {
                const achievements = document.querySelectorAll('h3.text-lg.font-semibold');
                for (let achievement of achievements) {
                    const achievementText = achievement.textContent.trim();
                    if (processedAchievements.includes(achievementText)) {
                        continue;
                    }

                    const completedIndicator = achievement.closest('.flex')?.querySelector('p.text-union-400');
                    if (!completedIndicator || !completedIndicator.textContent.includes('COMPLETED')) {
                        const followLink = achievement.closest('.flex-col')?.querySelector('a[href*="x.com"]');
                        if (followLink) {
                            return { element: achievement, link: followLink, text: achievementText };
                        }
                    }
                }

                lastScrollPosition += scrollStep;
                window.scrollTo(0, lastScrollPosition);
                await delay(500);

                if (lastScrollPosition >= document.body.scrollHeight) {
                    break;
                }
            }
            return null;
        }

        async function processAchievements() {
            try {
                const processedAchievements = new Set();

                while (true) {
                    window.scrollTo(0, 0);
                    await delay(1000);

                    const achievementData = await findNextUncompletedAchievement([...processedAchievements]);
                    if (!achievementData) {
                        console.log('No more uncompleted achievements found, redirecting to next page');
                        window.location.href = NEXT_PAGE_URL; // 跳转到指定页面
                        await delay(2000); // 等待页面跳转
                        return; // 结束脚本
                    }

                    const { element: achievement, link: followLink, text: achievementText } = achievementData;
                    console.log(`Processing achievement: ${achievementText}`);

                    const completedIndicator = achievement.closest('.flex')?.querySelector('p.text-union-400');
                    if (completedIndicator && completedIndicator.textContent.includes('COMPLETED')) {
                        console.log(`Achievement "${achievementText}" already completed`);
                        processedAchievements.add(achievementText);
                        continue;
                    }

                    followLink.click();
                    console.log(`Clicked follow link for ${followLink.href}`);

                    await delay(60000);
                    await delay(10000);

                    const updatedAchievement = await elementExistsWithText('h3.text-lg.font-semibold', achievementText);
                    const newCompletedIndicator = updatedAchievement.closest('.flex')?.querySelector('p.text-union-400');

                    if (newCompletedIndicator && newCompletedIndicator.textContent.includes('COMPLETED')) {
                        console.log(`Successfully completed achievement: ${achievementText}`);
                    } else {
                        console.log(`Achievement "${achievementText}" not marked as completed - please check manually`);
                    }

                    processedAchievements.add(achievementText);
                }

            } catch (error) {
                console.error('Error in processAchievements:', error);
            }
        }

        window.addEventListener('load', () => {
            console.log('Union Build Follow Automator started');
            processAchievements();
        });
    }
})();
