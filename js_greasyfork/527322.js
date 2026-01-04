// ==UserScript==
// @name         Union
// @namespace    http://tampermonkey.net/
// @version      2281
// @description  hello 国哥
// @author       You
// @match        https://klokapp.ai/*
// @match        *://*.app.union.build/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=union.build
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527322/Union.user.js
// @updateURL https://update.greasyfork.org/scripts/527322/Union.meta.js
// ==/UserScript==


////Union钱包连接
(function() {
    'use strict';
    if (window.location.hostname !== 'app.union.build') {
        return;
    }
    const buttonsToClick = ["MetaMask", "Keplr",];

    // 定义要查找的文本
    const requiredTexts = [
        "Amount is required",
        "Cosmos wallet not connected",
        "Receiver is required"
    ];


    function checkCosmosWalletNotConnected() {
        // 获取所有 <p> 标签
        const paragraphs = document.querySelectorAll('p');

        // 遍历所有 <p> 标签，检查内容是否包含目标文本
        for (let p of paragraphs) {
            if (p.textContent.includes("Cosmos wallet not connected") || p.textContent.includes("EVM wallet not connected")) {
                return true; // 找到匹配的内容，返回 true
            }
        }

        return false; // 如果没有找到匹配的内容，返回 false
    }




    // 定义检查和点击的函数
    function checkAndClick() {
        // 检查页面中是否存在所需的文本
        const textsFound = requiredTexts.every(text => {
            return document.body.innerText.includes(text);
        });


        buttonsToClick.forEach(buttonText => {
            const button = Array.from(document.querySelectorAll('button[data-button-root]')).find(btn => {
                const btnText = btn.innerText.trim();
                return btnText.includes(buttonText);
            });
            const svgExists = button && button.querySelector('svg');
            if(button){
                const con = Array.from(document.querySelectorAll('button[data-button-root], head button')).find(btn => {
                    const spanText = Array.from(btn.querySelectorAll('span')).map(span => span.textContent).join('');
                    return spanText.includes("Connected");
                });

                if (con && !con.disabled) {
                    con.click();
                } else {
                    console.log("未找到包含文本的按钮或按钮已禁用");
                }
            }

            // 如果找到了按钮且按钮可用，点击它
            if (button && !button.disabled && !svgExists) {
                button.click(); // 点击按钮
                console.log("按钮已点击，文本包含:", buttonText);
            } else {
            }
        });


        if (textsFound || checkCosmosWalletNotConnected()) {
            // 查找按钮，如果不在body也可以在document.head中尝试
            const button = Array.from(document.querySelectorAll('button[data-button-root], head button')).find(btn => {
                // 尝试获取button内部的文本
                const spanText = Array.from(btn.querySelectorAll('span')).map(span => span.textContent).join('');
                return spanText.includes("Connect Wallet") || spanText.includes("Connected 1/2");
            });

            // 如果找到了按钮且按钮可用，点击它
            if (button && !button.disabled) {
                button.click(); // 点击按钮
            } else {
                console.log("未找到包含文本的按钮或按钮已禁用");
            }

            buttonsToClick.forEach(buttonText => {
                const button = Array.from(document.querySelectorAll('button[data-button-root]')).find(btn => {
                    const btnText = btn.innerText.trim();
                    return btnText.includes(buttonText);
                });
                const svgExists = button && button.querySelector('svg');
                if (button && !button.disabled && !svgExists) {
                    button.click(); // 点击按钮
                    console.log("按钮已点击，文本包含:", buttonText);
                    setInterval(() => {
                        sessionStorage.setItem('successfulSwaps', '3');
                    }, 100000);
                } else {
                    console.log("未找到包含文本的按钮或按钮已禁用:", buttonText);
                }
            });
        } else {
            console.log("某些所需文本未找到");
        }
    }

    setInterval(() => {
        const button = Array.from(document.querySelectorAll('button[data-button-root], head button')).find(btn => {
            const spanText = Array.from(btn.querySelectorAll('span')).map(span => span.textContent).join('');
            console.log(spanText); // 输出文本，确保正确匹配
            return spanText.includes("Connected 1/2");
        });

        if (button) {
            console.log(button.disabled); // 检查 disabled 状态
            console.log(button.style.pointerEvents); // 检查 pointer-events 样式
            console.log(button.offsetWidth, button.offsetHeight); // 检查按钮的大小

            // 使用 MouseEvent 模拟点击
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                // view: window
            });

            setTimeout(() => {
                button.dispatchEvent(clickEvent); // 延迟点击
            }, 500); // 延迟 500ms
        } else {
            console.log("未找到包含文本的按钮或按钮已禁用");
        }
    }, 10000)
    setInterval(() => {
        const button = Array.from(document.querySelectorAll('button[data-button-root], head button')).find(btn => {
            const spanText = Array.from(btn.querySelectorAll('span')).map(span => span.textContent).join('');
            console.log(spanText); // 输出文本，确保正确匹配
            return spanText.includes("Connected 1/2");
        });
        if (button) {
            window.location.href = 'https://app.union.build/transfer?source=11155111&destination=union-testnet-9&asset=0x1c7d4b196cb0c7b01d743fbc6116a902379c7238&amount=0.0001';
        }
    }, 150000)
    if (location.href.includes('app.union.build')) {
        try {
            setInterval(checkAndClick, 5000);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
})();


(function() {
    'use strict';

    if (window.location.hostname !== 'app.union.build') {
        return;
    }

    const min = 0.0001;
    const max = 0.0005;
    let rond = 4
    var bt1 = ""
    var bt3 = ""
    var Holesky = "Holesky"
    var count= 0;
    var previousCount = 0
    let BY = 6

    setInterval(() => {
        const receiverInput = document.querySelector('input.border-red-500');
        const walletButtons = document.querySelectorAll('button.text-xs.text-muted-foreground');
        let targetButton = null;

        walletButtons.forEach(button => {
            if (button.textContent.trim() === "Use connected wallet") {
                targetButton = button;
            }
        });

        if (receiverInput && targetButton && receiverInput.value.trim() === "") {
            targetButton.click();
        }
    }, 5000);


    setInterval(() => {
        if (count === previousCount) {
            const explorerButton = document.querySelector('a[href="/explorer"]');
            if (explorerButton) {
                explorerButton.click();
                previousCount = count;
            }
        }else{
            previousCount = count;
        }
    }, 300000);

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 设置定时器每10秒执行一次
        const checkInterval = setInterval(function() {
            const inputField = document.getElementById('amount');

            if (inputField) {
                // 检查输入框是否为空 (trim to remove any whitespace)
                if (inputField.value.trim() === '') {
                    const randomValue = (Math.random() * (max - min) + min).toFixed(4);
                    inputField.value = randomValue; // 要输入的值

                    // 触发 input 事件
                    inputField.dispatchEvent(new Event('input', { bubbles: true }));

                    console.log('Input value set to 0.001');
                }
            } else {
                console.log('Input field not found.');
            }
        }, 5000); // 每10秒检查一次


        setInterval(() => {
            const receiverInput = document.getElementById('receiver');
            const button = document.querySelector('button.text-xs.text-muted-foreground');

            if (receiverInput && button) {
                if (receiverInput.value.trim() === "") {
                    button.click();
                    console.log("输入框为空，已点击按钮");
                } else {
                    console.log("输入框有内容");
                }
            } else {
                console.log("元素未找到，继续查找");
            }
        }, 10000); // 每10秒检查一次

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var targetText="Amount exceeds balance"
        function compareText() {
            const spans = document.getElementsByTagName("span");
            let results = [];

            for (let span of spans) {
                const spanText = span.textContent.trim();
                const hasMatchingClasses = span.classList.contains("text-red-500") && span.classList.contains("text-xs");

                if (hasMatchingClasses) {
                    if (spanText === targetText) {
                        return true;
                    }
                }
            }
        }


        setInterval(() => {
            let successCount = parseInt(sessionStorage.getItem('successfulSwaps') || '0');
            if (!sessionStorage.getItem('successfulSwaps') || sessionStorage.getItem('successfulSwaps')==null) {
                sessionStorage.setItem('successfulSwaps', '0');
            }

            const unionButton = document.evaluate('/html/body/div[1]/div[2]/div/div/div/div/div/div/div[2]/div[1]/div[1]/button[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const sepoliaButton = document.evaluate('/html/body/div[1]/div[2]/div/div/div/div/div/div/div[2]/div[1]/div[1]/button[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const unoButton = document.evaluate('/html/body/div[1]/div[2]/div/div/div/div/div/div/div[2]/div[1]/div[2]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            var unionText = '';
            var sepoliaText ='';
            var unoText ='';

            if(unionButton){
                unionText = unionButton.textContent.trim();
            }
            if(sepoliaButton){
                sepoliaText = sepoliaButton.textContent.trim();
            }
            if(unoButton){
                unoText = unoButton.textContent.trim();
            }
            if(unionButton && sepoliaButton && unoButton && successCount>1){
                if(rond==1){
                    bt1 ="Stargaze Testnet"
                    bt3 ="STARS"
                }else if(rond==3){
                    bt1 ="Babylon Testnet";
                    bt3 ="BBN";
                    BY++;

                }
                else if(rond==2){
                    bt1 ="Union Testnet 9"
                    bt3 ="UNO"
                }else if(rond==4){
                    bt1 ="Sepolia"
                    bt3 ="USDC"
                }

                if (unionText !== bt1) {
                    unionButton.click(); // 点击 Union Testnet 9 按钮
                    console.log("点击 Union Testnet 9 按钮");
                    // 获取所有按钮
                    const test9 = setInterval(() => {
                        const buttons = document.querySelectorAll('button.px-2.py-1.w-full');

                        // 遍历按钮并检查文本
                        buttons.forEach(button => {
                            const buttonText = button.querySelector('div.text-nowrap') ? button.querySelector('div.text-nowrap').textContent.trim() : '';
                            if (buttonText === bt1) {
                                button.click();
                                clearInterval(test9)

                            }
                        });
                    },5000);
                } else if (unoText !== bt3 && unionText == bt1 || compareText()) {
                    unoButton.click();
                    const UNO = setInterval(() => {
                        const buttons = document.querySelectorAll('button.px-2.py-1.w-full');
                        buttons.forEach(button => {
                            const buttonText = button.textContent || button.innerText;
                            if (buttonText.includes(bt3)) {
                                button.click();
                                clearInterval(UNO)
                            }
                        });
                    }, 5000);

                } else if (unoText == bt3 && unionText == bt1 && sepoliaText == Holesky || sepoliaText ==bt1) {
                    sepoliaButton.click();
                    const test9 = setInterval(() => {
                        const buttons = document.querySelectorAll('button.px-2.py-1.w-full');
                        buttons.forEach(button => {
                            const buttonText = button.querySelector('div.text-nowrap') ? button.querySelector('div.text-nowrap').textContent.trim() : '';
                            if(rond==1){
                                let randomInt = getRandomInt(3, 3);
                                if (buttonText === "Stride Testnet" && randomInt==1) {
                                    button.click();
                                    clearInterval(test9)

                                }else if (buttonText === "Union Testnet 9" && randomInt==2) {
                                    button.click();
                                    clearInterval(test9)

                                }else if (buttonText === "Babylon Testnet" && randomInt==3) {
                                    button.click();
                                    clearInterval(test9)

                                }
                            }else if(rond==2){
                                let randomInt = getRandomInt(4, 4);
                                if (buttonText === "Stride Testnet" && randomInt==1) {
                                    button.click();
                                    clearInterval(test9)

                                }else if (buttonText === "Union Testnet 9" && randomInt==2) {
                                    button.click();
                                    clearInterval(test9)

                                }else if (buttonText === "Stargaze Testnet" && randomInt==3) {
                                    button.click();
                                    clearInterval(test9)

                                }else if (buttonText === "Babylon Testnet" && randomInt==4) {
                                    button.click();
                                    clearInterval(test9)

                                }
                            }else if(rond==3){
                                let randomInt = getRandomInt(2, 3);
                                if (buttonText === "Stride Testnet" && randomInt==1) {
                                    button.click();
                                    clearInterval(test9)

                                }else if (buttonText === "Babylon Testnet" && randomInt==2) {
                                    button.click();
                                    clearInterval(test9)

                                }else if (buttonText === "Stargaze Testnet" && randomInt==3) {
                                    button.click();
                                    clearInterval(test9)

                                }
                            }else if(rond==4){
                                if (buttonText === "Union Testnet 9") {
                                    button.click();
                                    clearInterval(test9)

                                }
                            }
                        });
                    }, 5000);
                }else if(unionButton && sepoliaButton && unoButton && unoText == bt3 && unionText == bt1 && sepoliaText != Holesky){
                    const unoButton = document.evaluate('/html/body/div[1]/div[2]/div/div/div/div/div/div/div[2]/div[1]/div[2]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    const balanceSpan = document.querySelector('span.text-primary');
                    if (balanceSpan && unoButton && unoButton.textContent.trim()!='USDC') {
                        const balance = parseFloat(balanceSpan.textContent);
                        if (balance < 0.1) {
                            const explorerButton = document.querySelector('a[href="/faucet"]');
                            if (explorerButton) explorerButton.click();
                        }else{
                            const confirmTransferButton = document.querySelector('button.bg-primary.text-primary-foreground');
                            if (confirmTransferButton && !confirmTransferButton.disabled && confirmTransferButton.offsetWidth > 0 && confirmTransferButton.offsetHeight > 0) {
                                confirmTransferButton.click();
                            }
                        }
                    }else{
                        const confirmTransferButton = document.querySelector('button.bg-primary.text-primary-foreground');
                        if (confirmTransferButton && !confirmTransferButton.disabled && confirmTransferButton.offsetWidth > 0 && confirmTransferButton.offsetHeight > 0) {
                            confirmTransferButton.click();
                        }
                    }
                }
            }else{
                if(!unionButton && !sepoliaButton && !unoButton && successCount>1){
                    const confirmTransferButton = document.querySelector('button.bg-primary.text-primary-foreground');
                    if (confirmTransferButton && !confirmTransferButton.disabled && confirmTransferButton.offsetWidth > 0 && confirmTransferButton.offsetHeight > 0) {
                        confirmTransferButton.click();
                    }
                }
            }
        }, 10000);

        function checkUrlAndClick() {
            const transferButton = document.querySelector('a[href="/transfer"]');
            if (transferButton) {
                transferButton.click();
                
                if (BY>5) {
                    rond = getRandomInt(1, 2);
                }
                if (BY<=5) {
                    rond = getRandomInt(1, 3);
                }
                console.log(rond)
            }
        }
        
        function checkBackgroundColor() {
            const explorerButton = document.querySelector('a[href="/explorer"]');
            if (explorerButton) {
                const computedStyle = window.getComputedStyle(explorerButton);
                const backgroundColor = computedStyle.backgroundColor;
                const targetColor = 'rgb(0, 0, 0)';
                if (backgroundColor === targetColor) {
                    checkUrlAndClick();
                    count++;
                } 
            }
        }


        if (location.href.includes('app.union.build')) {
            try {
                setInterval(() => {
                    const targetDiv = document.querySelector('div[slot="transfer"]');
                    if (targetDiv && !targetDiv.innerHTML.trim() && targetDiv.children.length === 0) {
                        const explorerButton = document.querySelector('a[href="/faucet"]');
                        if (explorerButton) {
                            explorerButton.click();
                        }
                    }
                }, 78000); 
                
                setInterval(() => {
                    const explorerButton = document.querySelector('a[href="/faucet"]');
                    if (explorerButton) {
                        const computedStyle = window.getComputedStyle(explorerButton);
                        const backgroundColor = computedStyle.backgroundColor;
                        const targetColor = 'rgb(0, 0, 0)';
                        if (backgroundColor === targetColor) {
                            const explorerButton = document.querySelector('a[href="/explorer"]');
                            if (explorerButton) {
                                explorerButton.click();
                            }
                        } 
                    }
                }, 100000);
                
                setInterval(checkBackgroundColor, 5000);
            } catch (error) {
                console.error("An error occurred:", error);
            }
        }
    });
})();


(function() {
    if(window.location.href === 'https://dashboard.union.build/achievements'){
        'use strict';

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
            const scrollStep = 500; // Scroll step in pixels
            const maxScrollAttempts = 20; // Limit scroll attempts to prevent infinite loops

            for (let attempt = 0; attempt < maxScrollAttempts; attempt++) {
                // Look for any uncompleted achievement with a follow link
                const achievements = document.querySelectorAll('h3.text-lg.font-semibold');
                for (let achievement of achievements) {
                    const achievementText = achievement.textContent.trim();
                    if (processedAchievements.includes(achievementText)) {
                        continue; // Skip already processed achievements
                    }

                    const completedIndicator = achievement.closest('.flex')?.querySelector('p.text-union-400');
                    if (!completedIndicator || !completedIndicator.textContent.includes('COMPLETED')) {
                        const followLink = achievement.closest('.flex-col')?.querySelector('a[href*="x.com"]');
                        if (followLink) {
                            return { element: achievement, link: followLink, text: achievementText };
                        }
                    }
                }

                // Scroll down if no uncompleted achievement is found
                lastScrollPosition += scrollStep;
                window.scrollTo(0, lastScrollPosition);
                await delay(500); // Wait briefly after scrolling

                // Check if we've reached the bottom of the page
                if (lastScrollPosition >= document.body.scrollHeight) {
                    break;
                }
            }
            return null; // No uncompleted achievement found
        }

        async function processAchievements() {
            try {
                const processedAchievements = new Set(); // Track processed achievements to avoid duplicates

                while (true) {
                    // Scroll to the top before searching
                    window.scrollTo(0, 0);
                    await delay(1000);

                    const achievementData = await findNextUncompletedAchievement([...processedAchievements]);
                    if (!achievementData) {
                        console.log('No more uncompleted achievements found');
                        break;
                    }

                    const { element: achievement, link: followLink, text: achievementText } = achievementData;
                    console.log(`Processing achievement: ${achievementText}`);

                    // Ensure the achievement isn't already completed
                    const completedIndicator = achievement.closest('.flex')?.querySelector('p.text-union-400');
                    if (completedIndicator && completedIndicator.textContent.includes('COMPLETED')) {
                        console.log(`Achievement "${achievementText}" already completed`);
                        processedAchievements.add(achievementText);
                        continue;
                    }

                    // Click the follow link
                    followLink.click();
                    console.log(`Clicked follow link for ${followLink.href}`);

                    // Wait 60 seconds as required, plus additional delay for auto-completion and UI update
                    await delay(60000); // 60 seconds for the follow action
                    await delay(10000); // Additional 10 seconds to ensure auto-completion and UI updates

                    // Check if the achievement is now completed
                    const updatedAchievement = await elementExistsWithText('h3.text-lg.font-semibold', achievementText);
                    const newCompletedIndicator = updatedAchievement.closest('.flex')?.querySelector('p.text-union-400');

                    if (newCompletedIndicator && newCompletedIndicator.textContent.includes('COMPLETED')) {
                        console.log(`Successfully completed achievement: ${achievementText}`);
                    } else {
                        console.log(`Achievement "${achievementText}" not marked as completed - please check manually`);
                    }

                    processedAchievements.add(achievementText); // Mark as processed
                }

            } catch (error) {
                console.error('Error in processAchievements:', error);
            }
        }

        // Run the script when the page is fully loaded
        window.addEventListener('load', () => {
            console.log('Union Build Follow Automator started');
            processAchievements();
        });
    }
})();

(function() {
    'use strict';

    // 验证当前域名是否为 klokapp.ai
    if (window.location.hostname !== 'klokapp.ai') {
        console.log('此脚本仅适用于 klokapp.ai 域名，当前域名：' + window.location.hostname);
        return;
    }

    function checkAndRefresh() {
        const targetElement = document.querySelector('h2');
        if (targetElement && targetElement.textContent.includes('Application error: a client-side exception has occurred (see the browser console for more information).')) {
            location.reload();
        }
    }

    setInterval(checkAndRefresh, 5000);
    // 每5秒检查一次
    const login =setInterval(() => {
        const buttons = document.querySelectorAll('button.style_button__pYQlj.style_primary__w2PcZ');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('Continue with Google') && 
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(login)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 5000);

        
    

    // 带超时的等待元素出现的函数
    function waitForElement(selector, timeout = 10000) { // 默认10秒超时
        return Promise.race([
            new Promise((resolve) => {
                const interval = setInterval(() => {
                    const element = document.querySelector(selector);
                    if (element) {
                        clearInterval(interval);
                        resolve(element);
                    }
                }, 500);
            }),
            new Promise((_, reject) => {
                setTimeout(() => reject(new Error(`等待元素 ${selector} 超时`)), timeout);
            })
        ]);
    }

    // 使用 XPath 等待元素出现的函数
    function waitForXPath(xpath, timeout = 10000) {
        return Promise.race([
            new Promise((resolve) => {
                const interval = setInterval(() => {
                    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    const element = result.singleNodeValue;
                    if (element) {
                        clearInterval(interval);
                        resolve(element);
                    }
                }, 500);
            }),
            new Promise((_, reject) => {
                setTimeout(() => reject(new Error(`等待 XPath ${xpath} 超时`)), timeout);
            })
        ]);
    }

    // 带超时的等待四个按钮的容器出现的函数
    function waitForButtons(timeout = 10000) {
        return waitForElement('.flex.flex-col.lg\\:flex-row.justify-around.items-center.gap-1.w-full.xs\\:mb-40.md\\:mb-0', timeout);
    }

    // 带超时的等待加载指示器消失的函数
    function waitForLoadingToFinish(timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkLoading = () => {
                const loadingDots = document.querySelector('.style_loadingDots__6shQU');
                console.log('检查加载状态:', loadingDots ? '存在' : '不存在');
                if (!loadingDots || loadingDots.offsetParent === null) {
                    clearInterval(interval);
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    reject(new Error('等待加载指示器消失超时'));
                }
            };
            const interval = setInterval(checkLoading, 500);
            checkLoading(); // 立即检查一次
        });
    }

    // 模拟点击事件
    function simulateClick(element) {
        element.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        }));
    }

    // 单独的跳转检查函数
    function checkAndRedirect() {
        return new Promise(async (resolve) => {
            try {
                const counterElement = await waitForXPath('/html/body/div[1]/div[2]/div[2]/div[1]/div/div[1]/div[1]/div[2]/div[1]', 5000);
                const counterText = counterElement ? counterElement.textContent.trim() : '';
                const counter = parseInt(counterText) || 0;
                console.log('当前计数器值:', counterText, '解析为:', counter);

                if (counter === 10) {
                    const nextPageUrl = 'https://points.reddio.com/task?invite_code=2IFX9'; // 请替换为实际的下一页URL
                    window.location.href = nextPageUrl;
                    console.log('计数器为10，跳转到:', nextPageUrl);
                    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒确认跳转
                    resolve(); // 跳转后退出
                } else {
                    console.log('计数器不为10，无需跳转');
                    resolve();
                }
            } catch (error) {
                console.error('跳转检查出错:', error);
                resolve();
            }
        });
    }

    // 一次完整流程的执行
    async function runChatCycle() {
        try {
            console.log('开始新聊天周期');

            // 第一步：点击“New Chat”按钮
            const newChatButton = await waitForElement('a[href="/app"]', 5000);
            console.log('找到 New Chat 按钮，准备点击');
            simulateClick(newChatButton);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒让页面响应

            // 第二步：等待四个按钮出现并随机点击一个
            const buttonsContainer = await waitForButtons();
            console.log('找到按钮容器，准备随机点击');
            const buttons = buttonsContainer.querySelectorAll('button');
            if (buttons.length > 0) {
                const randomIndex = Math.floor(Math.random() * buttons.length);
                simulateClick(buttons[randomIndex]);
                console.log('随机点击第', randomIndex + 1, '个按钮');
                await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒让页面响应
            } else {
                console.log('未找到按钮');
                return false;
            }

            // 等待加载指示器消失
            console.log('等待加载完成...');
            await waitForLoadingToFinish();
            console.log('加载完成');

            // 检查跳转
            await checkAndRedirect();
            return true; // 表示周期成功完成
        } catch (error) {
            console.error('聊天周期出错:', error);
            return false; // 表示周期失败
        }
    }

    // 主逻辑 - 循环执行
    (async () => {
        let maxCycles = 10; // 最大循环次数，可调整
        let cycleCount = 0;

        while (cycleCount < maxCycles) {
            console.log(`开始第 ${cycleCount + 1} 次循环`);
            const success = await runChatCycle();
            if (!success) {
                console.log('本周期失败，暂停10秒后重试');
                await new Promise(resolve => setTimeout(resolve, 20000)); // 失败后暂停10秒
            } else {
                cycleCount++;
                console.log(`本周期成功，完成 ${cycleCount} 次循环`);
                await new Promise(resolve => setTimeout(resolve, 20000)); // 成功后暂停10秒（此处修改为10秒）
            }

            // 单独检查计数器并跳转
            try {
                const counterElement = await waitForXPath('/html/body/div[1]/div[2]/div[2]/div[1]/div/div[1]/div[1]/div[2]/div[1]', 5000);
                const counterText = counterElement ? counterElement.textContent.trim() : '';
                const counter = parseInt(counterText) || 0;
                if (counter === 10) {
                    console.log('检测到计数器为10，准备跳转');
                    await checkAndRedirect(); // 调用跳转函数
                    break; // 跳转后退出循环
                }
            } catch (error) {
                console.error('计数器检查超时:', error);
            }
        }

        console.log('脚本执行结束，总计完成', cycleCount, '次循环');
    })();

    // 提供手动触发跳转的接口
    window.checkAndRedirect = checkAndRedirect;
})();