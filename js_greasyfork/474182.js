// ==UserScript==
// @name         吐司机-Toaster
// @version      2.9
// @description  Tusi功能增强脚本
// @author       coffeexiong
// @match        https://tusi.art/*
// @match        https://tusiart.com/*
// @match        https://tensor.art/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAOVBMVEVHcEwAAADrowD/1nkAAAAAAAAAAAAAAAAAAAAAAADUjADwrhj3w05SOQDBhQDgmwOcawB+VwAaEgBA+4wIAAAACnRSTlMA////Wr+K9+A6Gw319QAAAUFJREFUWMPtl2sSgyAMhAUFgxS0vf9hK2o70pAItj+cDnuAbzYbHknTVFX9v4xW0IsM9aC0ITEdiCJBl3ajRLFUwpXpxQn1huC4aZBZGia3okyK4zIpG8slPC353KW0t/ZDN0uj7ktOUb82DsIsqAPSvneh747gsKRQHewSCmBPcTiSj/PWiyHbkrKsJR1FPdGGOEtTFHeIaJAtI/oMhBPwBoVDNJ4DyRBSAWggFTkCvmlzRiTHR/0/DpsExWEftp+uLG7/4YFkK9s/ANsVOWcIPi8tDeKbHz2434CaCqqgCqqgK4OsvRroOhm9fv9QGi6P5IwI9Pr9kyB+YAM01ZKfNj+vqQaNtT4xHbPzsUf/41rbw8si+QeqbLMknB9zKaNfdwi0IWlxShqvR/pHnPK9j9z8ZtS8iGYLVFd396r/1xOsiyRtXj5SIAAAAABJRU5ErkJggg==
// @grant        none
// @require      https://greasyfork.org/scripts/373256-qrcode-js/code/QRCode-Js.js?version=636795
// @license      GNU AGPLv3
// @namespace https://greasyfork.org/users/1161171
// @downloadURL https://update.greasyfork.org/scripts/474182/%E5%90%90%E5%8F%B8%E6%9C%BA-Toaster.user.js
// @updateURL https://update.greasyfork.org/scripts/474182/%E5%90%90%E5%8F%B8%E6%9C%BA-Toaster.meta.js
// ==/UserScript==

setTimeout(function() {
    'use strict';

    // 创建一级菜单
    function createFirstLevelMenu() {
        const firstLevelMenu = document.createElement('div');
        firstLevelMenu.style.position = 'absolute';
        firstLevelMenu.style.left = '41px';
        firstLevelMenu.style.top = '72px';
        firstLevelMenu.style.zIndex = '9999';
        firstLevelMenu.style.padding = '10px';
        const bodyBackgroundColor = window.getComputedStyle(document.body).backgroundColor;
        firstLevelMenu.style.backgroundColor = bodyBackgroundColor;
        const viInputStyles = window.getComputedStyle(document.querySelector('.vi-input'));
        const viInputBorderColor = viInputStyles.borderColor;
        firstLevelMenu.style.border = '1px solid #CCCCCC';
        firstLevelMenu.style.borderColor = viInputBorderColor;
        firstLevelMenu.style.borderRadius = '10px';
        firstLevelMenu.innerText = '🍞';
		firstLevelMenu.title = 'Toaster';
        document.body.appendChild(firstLevelMenu);

        return firstLevelMenu;
    }

    // 创建二级菜单
    function createSecondLevelMenu() {
        const secondLevelMenu = document.createElement('div');
        secondLevelMenu.style.position = 'absolute';
        secondLevelMenu.style.left = '41px';
        secondLevelMenu.style.top = '72px'; // 二级菜单相对于一级菜单的位置
        secondLevelMenu.style.zIndex = '9999';
        secondLevelMenu.style.padding = '10px';
        const bodyBackgroundColor = window.getComputedStyle(document.body).backgroundColor;
        secondLevelMenu.style.backgroundColor = bodyBackgroundColor;
        const viInputStyles = window.getComputedStyle(document.querySelector('.vi-input'));
        const viInputBorderColor = viInputStyles.borderColor;
        secondLevelMenu.style.border = '1px solid #CCCCCC';
        secondLevelMenu.style.borderColor = viInputBorderColor;
        secondLevelMenu.style.borderRadius = '10px';
        secondLevelMenu.style.display = 'none'; // 初始隐藏二级菜单
        document.body.appendChild(secondLevelMenu);

        // 创建勾选框和标签
        const checkboxDelete = document.createElement('input');
        checkboxDelete.type = 'checkbox';
        checkboxDelete.checked = getButtonState();
        checkboxDelete.style.marginRight = '5px'; // 添加间距
        const labelDelete = document.createElement('label'); // 使用label元素替代span元素
        labelDelete.innerText = '自动确认删除';
        labelDelete.title = '当点击队列删除按钮后会自动点击确认删除提示框';

        const checkboxQueue = document.createElement('input');
        checkboxQueue.type = 'checkbox';
        checkboxQueue.checked = getQueueState();
        checkboxQueue.style.marginRight = '5px'; // 添加间距
        const labelQueue = document.createElement('label'); // 使用label元素替代span元素
        labelQueue.innerText = '自动提交队列';
        labelQueue.title = '当检测到队列已满被拒绝提交任务后会在5秒后提交当前编写任务';

        const checkboxInfinite = document.createElement('input');
        checkboxInfinite.type = 'checkbox';
        checkboxInfinite.checked = getInfiniteState();
        checkboxInfinite.style.marginRight = '5px'; // 添加间距
        const labelInfinite = document.createElement('label'); // 使用label元素替代span元素
        labelInfinite.innerText = '无限抽卡';
        labelInfinite.title = '启用后会在出图页面无限循环提交出图请求';


		let qrData = 'https://qr14.cn/DIpmPe';
		let qrDiv = document.createElement('div');
		new QRCode(qrDiv, {
			text: qrData,
			width: 128,
			height: 128
		});
        qrDiv.style.border = '5px solid #ffffff';

		let qrText = document.createElement('p');
		qrText.innerText = '扫码购买算力';
		qrText.style.display = 'flex';
		qrText.style.justifyContent = 'center';

        let TsVersion = document.createElement('p');
		TsVersion.innerText = 'V2.9.231012.1';
		TsVersion.style.display = 'flex';
        TsVersion.style.color = viInputStyles.borderColor;
        TsVersion.style.fontSize = '8px';
		TsVersion.style.justifyContent = 'flex-end';

        let Br = document.createElement('p');
		Br.innerText = '-';
		Br.style.display = 'flex';
        Br.style.color = bodyBackgroundColor;
        Br.style.fontSize = '0px';

        secondLevelMenu.appendChild(checkboxDelete);
        secondLevelMenu.appendChild(labelDelete);
        secondLevelMenu.appendChild(document.createElement('br'));
        secondLevelMenu.appendChild(checkboxQueue);
        secondLevelMenu.appendChild(labelQueue);
		secondLevelMenu.appendChild(document.createElement('br'));
        secondLevelMenu.appendChild(checkboxInfinite);
        secondLevelMenu.appendChild(labelInfinite);
		secondLevelMenu.appendChild(document.createElement('br'));
		secondLevelMenu.appendChild(document.createElement('br'));
		secondLevelMenu.appendChild(qrDiv);
		secondLevelMenu.appendChild(qrText);
		secondLevelMenu.appendChild(Br);
        secondLevelMenu.appendChild(TsVersion);


		return secondLevelMenu;
    }

    // 显示菜单
    function showMenu(menu) {
        menu.style.display = 'block';
    }

    // 隐藏菜单
    function hideMenu(menu) {
        menu.style.display = 'none';
    }

    // 从localStorage中获取按钮状态
    function getButtonState() {
        return localStorage.getItem('autoConfirmDelete') === 'true';
    }

    // 从localStorage中获取队列功能状态
    function getQueueState() {
        return localStorage.getItem('autoSubmitQueue') === 'true';
    }

    // 从localStorage中获取队列功能状态
    function getInfiniteState() {
        return localStorage.getItem('InfiniteGacha') === 'true';
    }

    // 设置按钮状态到localStorage
    function setButtonState(enabled) {
        localStorage.setItem('autoConfirmDelete', enabled);
    }

    // 设置队列功能状态到localStorage
    function setQueueState(enabled) {
        localStorage.setItem('autoSubmitQueue', enabled);
    }

    // 设置队列功能状态到localStorage
    function setQueueInfinite(enabled) {
        sessionStorage.setItem('InfiniteGacha', enabled);
    }

    // 模拟点击删除按钮
    let AotoDeleteButton = null;
	console.log('初始化AotoDeleteButton函数');

    async function startAotoDeleteButton() {
		AotoDeleteButton = setTimeout(async function() {
			const deleteButton = document.querySelector('button.__button-zm13ws-lsme.n-button.n-button--error-type.n-button--small-type');
			if (deleteButton) {
				deleteButton.click();
			}
			startAotoDeleteButton();
		}, 300);
    }

    // 自动提交队列功能
    let queueTimer = null;
	console.log('初始化queueTimer函数');

    function startQueueTimer() {
        queueTimer = setInterval(function() {
            const queueFullPopup = document.querySelector('div.n-dialog__content');
            if (queueFullPopup && queueFullPopup.innerText === 'WORKS_QUEUE_FULL') {
                clearInterval(queueTimer);
                setTimeout(function() {
                    const queueWarningButton = document.querySelector('button.__button-zm13ws-lsmw.n-button.n-button--warning-type.n-button--small-type');
                    if (queueWarningButton) {
                        queueWarningButton.click();
                        setTimeout(function() {
                            const queueSubmitButton = document.querySelector('button.vi-button.vi-button--size-medium.vi-button--type-primary.vi-button--full');
                            if (queueSubmitButton) {
                                queueSubmitButton.click();
								console.log('执行了一次提交队列');
								startQueueTimer();
                            }
                        }, 5500);
					}
                }, 20);
			}
		}, 20);
     }

	// 无限抽卡功能
    let InfiniteTimer = null;
    console.log('初始化InfiniteTimer函数');

    async function startInfiniteTimer() {
        console.log('startInfiniteTimer');
		InfiniteTimer = setInterval(async function() {
			const InfiniteDrawingpage = document.querySelector('button.vi-button.vi-button--size-medium.vi-button--type-primary.vi-button--full');
			if (InfiniteDrawingpage) {
                console.log('检测到生成按钮');
				InfiniteDrawingpage.click();
                console.log('click');
			}
			setTimeout(function() {
				const queueWarningButton = document.querySelector('button.__button-zm13ws-lsmw.n-button.n-button--warning-type.n-button--small-type');
					if (queueWarningButton) {
						console.log('检测到队列弹窗');
						queueWarningButton.click();
						console.log('click');
					}
			}, 50);
		}, 5000);
	}


    // 主逻辑
    function main() {
        const firstLevelMenu = createFirstLevelMenu();
        const secondLevelMenu = createSecondLevelMenu();

        // 鼠标移动至一级菜单显示范围时，显示二级菜单
        firstLevelMenu.addEventListener('mouseenter', function() {
            showMenu(secondLevelMenu);
        });

        // 鼠标移出二级菜单显示范围时，隐藏二级菜单
        secondLevelMenu.addEventListener('mouseleave', function() {
            hideMenu(secondLevelMenu);
        });

        // 添加勾选框改变事件监听：自动确认删除
        const checkboxDelete = secondLevelMenu.querySelector('input[type="checkbox"]');
        const checkboxQueue = secondLevelMenu.querySelectorAll('input[type="checkbox"]')[1];
        const checkboxInfinite = secondLevelMenu.querySelectorAll('input[type="checkbox"]')[2];

        checkboxDelete.addEventListener('change', function() {
            const enabled = checkboxDelete.checked;
            setButtonState(enabled);
            if (enabled) {
                startAotoDeleteButton();
                console.log('开启自动确认删除');
            } else {
                clearInterval(AotoDeleteButton);
                console.log('关闭自动确认删除');
            }
        });

        // 添加勾选框改变事件监听：自动提交队列

        checkboxQueue.addEventListener('change', function() {
            const enabled = checkboxQueue.checked;
            setQueueState(enabled);
            if (enabled) {
                checkboxInfinite.checked = false;
                clearInterval(InfiniteTimer);
                startQueueTimer();
                console.log('开启自动提交队列');
            } else {
                clearInterval(queueTimer);
                console.log('关闭自动提交队列');
            }
        });

		// 添加勾选框改变事件监听：无限抽卡

        checkboxInfinite.addEventListener('change', function() {
            const enabled = checkboxInfinite.checked;
            setQueueInfinite(enabled);
            if (enabled) {
                checkboxQueue.checked = false;
                clearInterval(queueTimer);
                startInfiniteTimer();
                console.log('开启无限抽卡');
            } else {
                clearInterval(InfiniteTimer);
                console.log('关闭无限抽卡');
            }
        });

        // 初始化自动确认删除功能状态
        if (getButtonState()) {
            checkboxDelete.checked = true;
            startAotoDeleteButton();
        }

        // 初始化自动提交队列功能状态
        if (getQueueState()) {
            checkboxQueue.checked = true;
            startQueueTimer();
        }

        // 初始化无限抽卡功能状态
        if (getInfiniteState()) {
            checkboxInfinite.checked = true;
            startInfiniteTimer();
        }
    }

    // 执行主逻辑
    main();
}, 3000)();