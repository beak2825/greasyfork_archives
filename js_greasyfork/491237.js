// ==UserScript==
// @name         斗鱼月度活动批处理脚本
// @namespace    http://tampermonkey.net/
// @version      2024.11.28.001
// @description  斗鱼月度活动批处理脚本，通过点击按钮自动化抽卡和回收
// @author       You
// @match			*://*.douyu.com/0*
// @match			*://*.douyu.com/1*
// @match			*://*.douyu.com/2*
// @match			*://*.douyu.com/3*
// @match			*://*.douyu.com/4*
// @match			*://*.douyu.com/5*
// @match			*://*.douyu.com/6*
// @match			*://*.douyu.com/7*
// @match			*://*.douyu.com/8*
// @match			*://*.douyu.com/9*
// @match			*://*.douyu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyu.com
// @grant        none
// @license        MIT License
// @downloadURL https://update.greasyfork.org/scripts/491237/%E6%96%97%E9%B1%BC%E6%9C%88%E5%BA%A6%E6%B4%BB%E5%8A%A8%E6%89%B9%E5%A4%84%E7%90%86%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/491237/%E6%96%97%E9%B1%BC%E6%9C%88%E5%BA%A6%E6%B4%BB%E5%8A%A8%E6%89%B9%E5%A4%84%E7%90%86%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let totalWaitTime = 0;
    const waitInterval = 1000; // 每次检查之间等待时间（毫秒）
    const maxWaitTime = 45000; // 最大等待时间（毫秒）
    let isDrawAvaiale = true;
    let isCardRecycleAvaiale = true;
    let shouldStop = false;
    // 活动入口classname
    const actInteractiveButton = '.actAnnual202311Interactive-container';
    // 活动子窗口ifram
    // const actIframe = 'iframe[src*="festival202404"]';


    const actIframe = 'iframe[class="Live-Act-Annual-Panel-iframe"]';

    const drawTabClassName = '.layout-tab-item.mine';

    const pkTabClassName = '.layout-tab-item.anchor';

    const recycleFailClassName = ".PageMineBackpackRecycleEntry.isRecycling"

    const cardDrawSteps = ['.MineLottery-lotteryBtn.batch10', '.LotteryResult-btn'];
    const cardRecycleSteps = ['.PageMineBackpackRecycleEntry', '.PageMineBackpack-autoRecycleBtn', '.PageMineBackpackModal-btn'];
    //const priority = ["白银双倍卡", "钻石双倍卡", "黄金双倍卡", "白银双倍卡碎片", "钻石双倍卡碎片", "黄金双倍卡碎片"];
    const priority = ["白银双倍卡x1", "黄金双倍卡x1", "钻石双倍卡x1", "白银双倍卡碎片", "黄金双倍卡碎片","钻石双倍卡碎片"];
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function waitForElement(className, interval, maxTime, onSuccess, onFail, elementMatcher) {
        let elapsedTime = 0;


        let targetElement = null;
        const checkInterval = setInterval(() => {
            const iframe = document.querySelector(actIframe);
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            const elements = Array.from(iframeDocument.querySelectorAll(className));
            if(elements.length > 1){
                targetElement = elements.find(el => !elementMatcher || elementMatcher(el));
            } else {
                targetElement = elements[0];
            }
            if(shouldStop){
                return;
            }
            if (targetElement) {
                clearInterval(checkInterval);
                console.log(`Element with class '${className}' found.`);
                if (onSuccess) onSuccess(targetElement);
            } else if (elapsedTime >= maxTime) {
                clearInterval(checkInterval);
                console.log(`Timeout: Element with class '${className}' not found within ${maxTime} ms.`);
                if (onFail) onFail();
            }

            elapsedTime += interval;
        }, interval);
    }

    // 定义了一些公用动作
    // 1. 找到活动入口并打开
    // 2. 转到合适的tab标签


    function processSteps(steps, onFinish) {
        let currentStepIndex = 0; // 当前步骤索引

        const executeStep = () => {
            if (currentStepIndex >= steps.length) {
                // 完成一轮步骤后重置索引并重新开始
                currentStepIndex = 0;
                console.log('一轮流程完成，重新开始');
            }

            const step = steps[currentStepIndex];

            waitForElement(
                step.className, // 要检查的div classname
                step.interval, // 等待间隔
                step.maxTime, // 最大等待时间
                (element) => {
                    // 成功找到元素后执行的操作
                    step.onSuccess(element);
                    currentStepIndex++; // 移动到下一个步骤
                    executeStep(); // 递归调用执行下一步
                },
                () => {
                    // 超时或失败后执行的操作
                    if (step.onFail) step.onFail();
                    if (step.continueOnFail) {
                        // 如果当前步骤失败了但是设置了继续执行，移动到下一个步骤
                        currentStepIndex++;
                        executeStep();
                    } else {
                        // 如果不继续执行，调用onFinish回调并结束递归循环
                        if (onFinish) onFinish();
                    }
                },
                step.elementMatcher
            );
        };

        executeStep(); // 开始执行步骤
    }

    function commonStartActions(tabClassName) {
        document.querySelector(actInteractiveButton).click();
        return new Promise((resolve, reject) => {
            // 假设这里有一些异步操作，比如等待某个元素出现
            // 一旦完成，调用resolve()；如果出现错误，调用reject()

            // 示例：
            waitForElement(tabClassName, 1000, 10000, (element) => {
                element.click();
                console.log('Element found or some start action completed.');
                resolve(); // 操作成功完成
            }, () => {
                console.log('Failed to complete start actions.');
                reject(); // 操作失败
            });
        });
    }

    function autoDraw(callback) {
        shouldStop = false;
        const loop = () => {
            if (shouldStop) {
                console.log('autoDraw stopped');
                return;
            }
            let stepExecuted = false;
            const steps = [
                {
                    className: cardDrawSteps[0],
                    interval: 1000,
                    maxTime: 10000,
                    onSuccess: (element) => {
                        element.click();
                    },
                    onFail: () => {},
                    continueOnFail: true
                },
                {
                    className: cardDrawSteps[1],
                    interval: 1000,
                    maxTime: 10000,
                    onSuccess: (element) => {
                        element.click();
                    },
                    onFail: () => {},
                    continueOnFail: true
                }

            ];

            processSteps(steps, () => {
                if (stepExecuted) {
                    console.log('抽卡流程至少部分成功');
                    callback(true); // 操作成功
                } else {
                    console.log('抽卡流程完全失败');
                    callback(false); // 操作失败
                }
            });
        };
        loop();
    }

    function autoCardRecycle(callback) {
        shouldStop = false;
        const loop = () => {
            if (shouldStop) {
                console.log('autoDraw stopped');
                return;
            }
            let stepExecuted = false;
            function recycleFail(){
                const iframe = document.querySelector(actIframe);
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                iframeDocument.querySelector(recycleFailClassName).click();

            }
            const steps = [
                {
                    className: cardRecycleSteps[0],
                    interval: 1000,
                    maxTime: 10000,
                    onSuccess: (element) => element.click(),
                    onFail: () => recycleFail(),
                    continueOnFail: true
                },
                {
                    className: cardRecycleSteps[1],
                    interval: 1000,
                    maxTime: 10000,
                    onSuccess: (element) => element.click(),
                    onFail: () => recycleFail(),
                    continueOnFail: true
                },
                {
                    className: cardRecycleSteps[2],
                    interval: 1000,
                    maxTime: 10000,
                    onSuccess: (element) => {
                        element.click();
                        stepExecuted = true; // 标记为成功执行
                    },
                    onFail: () => recycleFail(),
                    continueOnFail: true
                }
            ];


            processSteps(steps, () => {
                if (stepExecuted) {
                    console.log('抽卡流程至少部分成功');
                    callback(true); // 操作成功
                } else {
                    console.log('抽卡流程完全失败');
                    callback(false); // 操作失败
                }
            });
        };
        loop();
    }


    function autoPetsRecycle(callback) {
        shouldStop = false;
        const loop = () => {
            if (shouldStop) {
                console.log('autoDraw stopped');
                return;
            }
            let stepExecuted = false;
            function petsRecycleFail(){
                const iframe = document.querySelector(actIframe);
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                iframeDocument.querySelector('.CommonModal-close.MyCollectModal-close').click();

            }

            const steps = [
                {
                    className: '.MineCollectMedal',
                    interval: 1000,
                    maxTime: 10000,
                    onSuccess: (element) => {
                        element.click();
                        console.log('成功点击宠物卡回收按钮');
                    },
                    onFail: () => petsRecycleFail(),
                    continueOnFail: true
                },
                {
                    className: '.MyCollectModal-navItem',
                    interval: 1000,
                    maxTime: 10000,
                    onSuccess: (element) => {
                        element.click();
                        console.log('成功点击宠物卡tab');
                    },
                    onFail: () => petsRecycleFail(),
                    continueOnFail: true,
                    elementMatcher: (el) => el.textContent.includes('宠物卡')

                },
                {
                    className: '.CollectPetCard-recycle',
                    interval: 1000,
                    maxTime: 10000,
                    onSuccess: (element) => {
                        element.click();
                        console.log('成功点击宠物卡回收按钮');
                    },
                    onFail: () => console.log('点击宠物卡回收按钮失败'),
                    continueOnFail: true
                },
                {
                    className: '.PetCardRecycle-controlBtn.auto',
                    interval: 1000,
                    maxTime: 10000,
                    onSuccess: (element) => {
                        element.click();
                        console.log('成功点击自动回收按钮');
                    },
                    onFail: () => console.log('点击自动回收按钮失败'),
                    continueOnFail: true
                },
                {
                    className: '.AutoRecycleSurePop-btn',
                    interval: 1000,
                    maxTime: 5000,
                    onSuccess: (element) => {
                        element.click();

                        stepExecuted = true;
                        console.log('成功确认回收');
                        petsRecycleFail();
                        // 如果需要在回收成功后执行额外的操作，可以在这里添加
                    },
                    onFail: () => petsRecycleFail(),
                    continueOnFail: true
                }
            ];

            // 调用通用的 processSteps 函数来处理宠物卡回收的步骤
            // 可以根据需要传入完成整个流程后的回调函数
            processSteps(steps, () => {
                if (stepExecuted) {
                    console.log('抽卡流程至少部分成功');
                    callback(true); // 操作成功
                } else {
                    console.log('抽卡流程完全失败');
                    callback(false); // 操作失败
                }
            });
        };
        loop();
    }

    function allAuto() {
        shouldStop = false;
        commonStartActions(drawTabClassName).then(() => {
            console.log('Common start actions completed, now running auto functions in parallel.');
            // 由于不需要等待这些函数的结果，可以直接并行调用
            autoDraw();
            autoCardRecycle();
            autoPetsRecycle();
        }).catch(() => {
            console.log('Failed to execute common start actions.');
            // 如果commonStartActions失败了，这里可以处理错误或决定是否继续执行其它操作
        });
    }

    function sortArrayByPriorityAndGetIndicesAndSortedArray(arr, priority) {
        // 将优先级数组转换为一个映射，用于快速查找优先级
        const priorityMap = new Map(priority.map((item, index) => [item, index]));

        // 创建一个包含原始索引的新数组
        const arrWithIndices = arr.map((item, index) => ({item, index}));

        // 对这个新数组进行排序
        arrWithIndices.sort((a, b) => {
            // 获取第二列元素的优先级，如果找不到则设为最大值
            const priorityAIndex = Array.from(priorityMap.keys()).findIndex(key => a.item[1].includes(key));
            const priorityBIndex = Array.from(priorityMap.keys()).findIndex(key => b.item[1].includes(key));

            // 如果未找到，则设为最大值
            const priorityA = priorityAIndex !== -1 ? priorityAIndex : Number.MAX_SAFE_INTEGER;
            const priorityB = priorityBIndex !== -1 ? priorityBIndex : Number.MAX_SAFE_INTEGER;

            // 如果第二列的优先级相同，则根据第一列的值排序
            if (priorityA === priorityB) {
                // 注意：如果第一列也是字符串，保持使用 localeCompare
                // 如果第一列是数字或其他类型，需要相应地调整比较逻辑
                // 为第一列元素找到优先级
                const firstColPriorityAIndex = Array.from(priorityMap.keys()).findIndex(key => a.item[0].includes(key));
                const firstColPriorityBIndex = Array.from(priorityMap.keys()).findIndex(key => b.item[0].includes(key));

                const firstColPriorityA = firstColPriorityAIndex !== -1 ? firstColPriorityAIndex : Number.MAX_SAFE_INTEGER;
                const firstColPriorityB = firstColPriorityBIndex !== -1 ? firstColPriorityBIndex : Number.MAX_SAFE_INTEGER;

                // 根据第一列的优先级排序
                return firstColPriorityA - firstColPriorityB;
            }
            // 根据第二列的优先级排序
            return priorityA - priorityB;
        });

        // 从排序后的数组中提取原始索引和排序后的数组元素
        const indices = arrWithIndices.map(el => el.index);
        const sortedArray = arrWithIndices.map(el => el.item);

        // 返回一个包含索引和排序后的数组的对象
        return {
            indices: indices,
            sortedArray: sortedArray
        };
    }
    async function checkPKAwards(){
        const iframe = document.querySelector(actIframe);
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const items = iframeDocument.querySelectorAll('.AnchorAwardSelect-item');
        const awardsArray = Array.from(items).map(item => {
            const awards = item.querySelectorAll('.AnchorAwardSelect-itemAward');
            return Array.from(awards).map(award => award.textContent);
        });

        const result = sortArrayByPriorityAndGetIndicesAndSortedArray(awardsArray, priority);
        for(let i = 0; i < result.indices.length;i++){

            let selectedReward = items[result.indices[i]];
            selectedReward.click();

            const modalButton = iframeDocument.querySelector('.modalBtn.modalBtn1');
            if (modalButton) {
                modalButton.click();
            } else {
                if(iframeDocument.querySelectorAll('.modal-close')){
                    iframeDocument.querySelectorAll('.modal-close')[0].click();
                }

            }

            await sleep(1000);
            // 检查是否没有剩余的items，如果是则退出函数
            if(iframeDocument.querySelectorAll('.modalBtn.modalBtn1').length < 1){
                console.log("No more items, exiting...");
                break;
            }
        }
        const closeBtn = iframeDocument.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.click();
        }

    }

    function PKProcess(){
        shouldStop = false;
        const steps = [
            {
                className: '.modal-close.is-mini',
                interval: 1000,
                maxTime: 10000,
                onSuccess: (element) => {
                    element.click();
                    console.log('成功点击选择奖励按钮');
                },
                onFail: () => console.log('点击选择奖励按钮失败'),
                continueOnFail: true
            },
            {
                className: '.awardBtn',
                interval: 1000,
                maxTime: 10000,
                onSuccess: (element) => {
                    element.click();
                    console.log('成功点击选择奖励按钮');
                },
                onFail: () => console.log('点击选择奖励按钮失败'),
                continueOnFail: true
            },
            {
                className: '.AnchorAwardSelect-item',
                interval: 1000,
                maxTime: 5000,
                onSuccess: (element) => {
                    checkPKAwards()
                },
                onFail: () => console.log(''),
                continueOnFail: true
            },
            {
                className: '.modalBtn.modalBtn1',
                interval: 1000,
                maxTime: 5000,
                onSuccess: (element) => {
                    element.click();
                },
                onFail: () => console.log('点击自动回收按钮失败'),
                continueOnFail: true
            },
            {
                className: '.userInfo-pic',
                interval: 1000,
                maxTime: 5000,
                onSuccess: (element) => {
                    // element.click();
                    if(element && element.alt === "虚位以待") {
                        element.click();
                    } else {
                       console.log("img的alt属性不是'虚位以待'");
                    }


                },
                onFail: () => console.log('点击自动回收按钮失败'),
                continueOnFail: true
            },
            {
                className: '.modalBtn.modalBtn1',
                interval: 1000,
                maxTime: 5000,
                onSuccess: (element) => {
                    element.click();
                },
                onFail: () => console.log('点击自动回收按钮失败'),
                continueOnFail: true
            }
        ];



        let executeRound = () => {

            let currentStepIndex = 0;
            const executeStep = () => {
                if(shouldStop || currentStepIndex >= steps.length) {
                    console.log('本轮流程结束，或者停止标志被设置。');
                    onFinish(); // 完成本轮后的回调
                    return;
                }

                const step = steps[currentStepIndex];
                waitForElement(
                    step.className,
                    step.interval,
                    step.maxTime,
                    (element) => {
                        step.onSuccess(element);
                        currentStepIndex++;
                        executeStep(); // 继续下一步
                    },
                    () => {
                        if (step.onFail) step.onFail();
                        if (step.continueOnFail) {
                            currentStepIndex++;
                            executeStep(); // 即便失败也继续
                        } else {
                            onFinish(); // 如果不允许失败则结束
                        }
                    },
                    step.elementMatcher
                );
            };

            executeStep(); // 开始执行步骤
        };

        // 定义完成后的行为
        let onFinish = () => {
            console.log('一轮流程完成。');
            // 可以在这里设置一个条件判断是否要开始下一轮
            if(!shouldStop) {
                console.log('开始新的一轮流程。');
                executeRound(); // 开始新的一轮
            } else {
                console.log('流程被停止。');
            }
        };

        executeRound(); // 开始第一轮
    }

    function autoPK(){
        shouldStop = false;
        commonStartActions(pkTabClassName).then(() => {
            PKProcess();
        }).catch()
    }
    // 添加按钮到页面
    function addButton(text, className, idx, onclick) {
        const elements = Array.from(document.querySelectorAll(className));
        const container = elements[idx];
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'DiamondFansMatchEntrance';
        const label = document.createElement('label');
        label.textContent = text;
        label.style.cursor = 'pointer';
        label.onclick = onclick;
        buttonDiv.appendChild(label);
        container.appendChild(buttonDiv);
    }

    function checkAndAddButtons() {
        // 检查页面中是否存在指定的div
        const giftNamingEntranceExists = document.querySelector('.DiamondFansMatchEntrance');
        const cardBodyExists = document.querySelector(actInteractiveButton);

        // 如果两个div都存在，则添加按钮
        if (giftNamingEntranceExists && cardBodyExists) {
            console.log("找到了指定的div，添加按钮。");
            addButton('自动抽卡','.Title-col.is-left', 0, autoDraw);
            addButton('自动回收', '.Title-col.is-left', 0,autoCardRecycle);
            //addButton('自动回收宠物卡', '.Title-col.is-left', 0,autoPetsRecycle);
            //addButton('全自动', '.Title-col.is-left', 0,allAuto);
            addButton('终止全部操作', '.Title-col.is-left', 0, ()=>{shouldStop = true;});
            addButton('自动pk', '.Title-col.is-normal', 1,autoPK);
            clearInterval(checkInterval); // 停止定时器
        }
    }

    const checkInterval = setInterval(checkAndAddButtons, waitInterval);

})();