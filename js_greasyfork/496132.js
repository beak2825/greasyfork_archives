// ==UserScript==
// @name         鼻涕直播专用
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       Mag
// @description  一：5到15分钟上一次链接（这个时间最好可以自定义），小黄车一共会挂20个以上的链接 ，不上连接的时候放在后面（20号以后）  二：每次上连接时，需要弹讲解改到1号链接 每8到10秒弹一次 共弹3 次（需要自定义）。第三次弹完取消讲解之后 放到1号链接20秒 后又放到20链接以后
// @license      Mag
// @match        https://buyin.jinritemai.com/dashboard/live/control*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinritemai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496132/%E9%BC%BB%E6%B6%95%E7%9B%B4%E6%92%AD%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/496132/%E9%BC%BB%E6%B6%95%E7%9B%B4%E6%92%AD%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';

    if (document.getElementById("custom-script")) {
        console.log("脚本已存在，无需重复添加。");
        return;
    }

    var scriptContainer = document.createElement("script");
    scriptContainer.id = "custom-script";
    scriptContainer.type = "text/javascript";

    function clickButton(button) {
        button.click();
    }

    var buttonContainer = document.createElement("div");
    buttonContainer.style.position = "fixed";
    buttonContainer.style.top = "50%";
    buttonContainer.style.left = "20px";
    buttonContainer.style.transform = "translateY(-50%)";
    buttonContainer.style.zIndex = "9999";

    // 商品序号
    var goodIndexInput = document.createElement("input");
    goodIndexInput.type = "text";
    goodIndexInput.value = "32";
    buttonContainer.appendChild(document.createTextNode("主商品序号："));
    buttonContainer.appendChild(goodIndexInput);
    buttonContainer.appendChild(document.createElement("br"));

    // 录播视频时长
    var videoTotalTimeInput = document.createElement("input");
    videoTotalTimeInput.type = "number";
    videoTotalTimeInput.value = "3600";
    buttonContainer.appendChild(document.createTextNode("录播视频时长："));
    buttonContainer.appendChild(videoTotalTimeInput);
    buttonContainer.appendChild(document.createElement("br"));

    // 录播视频内，即将上链接讲解的节点
    var videoSellTimeInput = document.createElement("input");
    videoSellTimeInput.type = "text";
    videoSellTimeInput.value = "5, 100, 200, 300, 400";
    buttonContainer.appendChild(document.createTextNode("上链接的时间节点, 单位是秒："));
    buttonContainer.appendChild(videoSellTimeInput);
    buttonContainer.appendChild(document.createElement("br"));

    // 每次上链接讲解的时长
    var sellDurationInput = document.createElement("input");
    sellDurationInput.type = "text";
    sellDurationInput.value = "30, 30, 20, 30, 40";
    buttonContainer.appendChild(document.createTextNode("上链接的讲解时长, 单位是秒："));
    buttonContainer.appendChild(sellDurationInput);
    buttonContainer.appendChild(document.createElement("br"));

    var startButton = document.createElement("button");
    startButton.textContent = "执行";
    buttonContainer.appendChild(startButton);

    var stopButton = document.createElement("button");
    stopButton.textContent = "终止";
    buttonContainer.appendChild(stopButton);

    document.body.appendChild(buttonContainer);

    var isDragging = false;
    var startPosX, startPosY;

    // 录播视频总时长
    var totalCycleTime = 1200;

    // 录播视频内，即将上链接讲解的节点
    var pointArrays = [5, 100, 200, 300, 400];

    // 一步一秒计时器
    var currentTime = 0;

    // 每次上链接讲解的时长
    var talkTimeArrays = [30, 30, 20, 30, 40];

    // 商品初始的位置
    var goodInitIndex = 32;

    // @Deprecated(暂时不加这个逻辑) 主商品不讲解的时候，副商品处于讲解的状态
    var backupGoodsId = "3510715978856188902";

    var loopTimeInterval = null;
    let findTargetInterval = null;
    let talkInterval = null;
    let findIdByIndexInterval = null;

    buttonContainer.addEventListener("mousedown", function(e) {
        isDragging = true;
        startPosX = e.clientX - buttonContainer.offsetLeft;
        startPosY = e.clientY - buttonContainer.offsetTop;
    });

    document.addEventListener("mousemove", function(e) {
        if (isDragging) {
            var offsetX = e.clientX - startPosX;
            var offsetY = e.clientY - startPosY;
            buttonContainer.style.left = offsetX + "px";
            buttonContainer.style.top = offsetY + "px";
        }
    });

    document.addEventListener("mouseup", function() {
        isDragging = false;
    });

    function initInput() {
    	try {
    		if (isInputEmpty(goodIndexInput) || isInputEmpty(videoTotalTimeInput) || isInputEmpty(videoSellTimeInput) || isInputEmpty(sellDurationInput)) {
    			console.log("输入为空")
    			return false;
    		}
    		pointArrays = strArrays2intArrays(videoSellTimeInput.value.split(","));
    		console.log("pointArrays " + pointArrays)
    		talkTimeArrays = strArrays2intArrays(sellDurationInput.value.split(","));
    		console.log("talkTimeArrays " + talkTimeArrays)
    		if (pointArrays.length != talkTimeArrays.length) {
    			console.log("videoTotalTimeInput与videoSellTimeInput的长度不匹配")
    			return false;
    		}
    		goodInitIndex = goodIndexInput.value;
    		totalCycleTime = videoTotalTimeInput.value;
    		console.log("initInput正常")
    		return true;
		} catch(err) {
			console.error(err)
		}
    	return false;
    }

    function startLoopClick() {
        console.log("开始程序")
        getProductionId(goodInitIndex, function(goodsId) {
            currentTime = 0;
            // 一秒的计时器循环
            loopTimeInterval = setInterval(function() {

                // todo 这里可能用时间戳来计算准确些
                currentTime += 1;
                console.log("计时器 " + currentTime + "秒");
                if (pointArrays.includes(currentTime)) { // 准备上链接
                    var index = pointArrays.indexOf(currentTime);
                    console.log("准备上链接");
                    startTalk(goodsId);
                    // 上链接结束
                    setTimeout(function() {
                        stopTalk(goodsId)
                    }, talkTimeArrays[index] * 1000);
                } else if (totalCycleTime == currentTime) { // 录播视频结束了, 重新开始
                    stopLoopClick();
                    startLoopClick();
                }
            }, 1000);
        });
    }

    function stopLoopClick() {
        console.log("结束程序");
        clearLoopTimeInterval();
        clearFindTargetInterval();
        clearTalkInterval();
        clearFindIdByIndexInterval();
        currentTime = 0;
    }

    /**
	 ** 讲解商品, 先找到列表中的商品, 修改商品顺序，修改完后，再开始讲解
	 **/
    function startTalk(goodsId) {
        console.log("startTalk 开始讲解 " + goodsId);
        findTargetGoods(goodsId, function(parentElement) {
            setGoodsRank(parentElement, 1, function() {
                findTargetGoods(goodsId, function(parentElement) {
                    realStartTalk(parentElement, goodsId);
                })
            })
        })
    }

    /**
	 ** 结束上链接
	 **/
    function stopTalk(goodsId) {
        console.log("结束上链接 " + goodsId);
        findTargetGoods(goodsId, function(parentElement) {
            setButtonState(parentElement, false);
            setGoodsRank(parentElement, goodInitIndex, function() {
                console.log("结束上链接, 商品顺序设置为" + goodInitIndex);
            })
        });
        clearTalkInterval();
    }

    /**
	** 从列表开头遍历寻找商品
	**/
    function findTargetGoods(goodsId, callback) {
        var scoll = document.querySelector('#live-control-goods-list-container > div');
        scoll.scrollTop = 0;
        var scollTimes = 1;
        findTargetInterval = setInterval(function() {
            var parentElement = document.querySelector('[data-rbd-draggable-id="' + goodsId + '"]');
            if (parentElement) { // 找到商品了, 开始讲解
                console.log("startTalk, 找到商品", "good id = ", goodsId);
                clearFindTargetInterval();
                callback(parentElement);
            } else {
                scoll.scrollTop = (scoll.scrollHeight * (6 / 34) * scollTimes) % scoll.scrollHeight;
                scollTimes = scollTimes + 1;
                console.log("startTalk, 找不到商品, 尝试滚动列表 scollTimes " + scollTimes + " scoll.scrollTop " + scoll.scrollTop);
            }
        }, 100);
    }

    /**
	 ** 开始讲解商品, 每隔8秒会取消讲解 + 讲解, 这样商品卡片能一直展现
	 **/
    function realStartTalk(parentElement, goodsId) {
        setButtonState(parentElement, true);
        talkInterval = setInterval(function() {
            setButtonState(parentElement, false);
            setTimeout(function() {
                setButtonState(parentElement, true);
            }, 800);
        }, 8000);
    }

    /**
	 ** 切换商品的讲解状态
	 **/
    function setButtonState(parentElement, isTalking) {
        console.log('切换讲解状态 ' + isTalking);
        var buttons = parentElement.querySelectorAll('button');
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].textContent === "讲解" && isTalking) {
                clickButton(buttons[i]);
            } else if (buttons[i].textContent === "取消讲解" && !isTalking) {
                clickButton(buttons[i]);
            }
        }
    }

    /**
    ** 设置商品顺序
    **/
    function setGoodsRank(parentElement, rank, callback) {
        console.log("设置商品顺序 " + rank);
        var inputElement = parentElement.querySelector('input');
        let lastValue = inputElement.value;
        inputElement.value = rank;

        let event = new Event('input', {
            bubbles: true
        });
        // react支持的事件 https://reactjs.org/docs/events.html#supported-events
        // hack React15
        event.simulated = true;

        // hack React16 内部定义了descriptor拦截value，此处重置状态
        let tracker = inputElement._valueTracker;

        if (tracker) {
            tracker.setValue(lastValue);
        }
        inputElement.dispatchEvent(event);
        // 触发input事件，通知浏览器输入框的值已改变
        var inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            data: rank
        });
        inputElement.dispatchEvent(inputEvent);

        // 触发change事件，通知浏览器输入框的值已经完成更改
        var changeEvent = new Event('change', {
            bubbles: true,
            cancelable: true
        });
        inputElement.dispatchEvent(changeEvent);

        // 模拟回车键按下
        // 注意：keydown事件的keyCode为13代表回车键
        var keydownEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            keyCode: 13,
            // 回车键的keyCode
            key: 'Enter',
            // 回车键的key
            ctrlKey: false // 确保Ctrl键没有被同时按下
        });
        inputElement.dispatchEvent(keydownEvent);
        setTimeout(function() {
            callback()
        }, 800);
    }

    /**
	** 根据序号寻找商品id
	**/
    function getProductionId(index, callback) {
    	console.log('getProductionId 寻找第' +  index + "的商品号");
        let goodListElement = document.querySelector('#live-control-goods-list-container > div > div');
        // console.error(goodListElement);
        let scollTimes = 1;
        let scoll = document.querySelector('#live-control-goods-list-container > div');
        // console.error(scoll);
        findIdByIndexInterval = setInterval(function() {
            var goodsList = goodListElement.childNodes;
            // console.error(goodsList);
            if (goodsList) {
                for (let i = 0; i < goodsList.length; i++) {
                	// console.error(goodsList[i]);
                    if (goodsList[i].querySelector('.index__goodsItem___38cLa .auxo-input').value == index) {
                    	console.log('getProductionId 找到第' + index + '商品的位置了');
                    	let productionElement = document.querySelector('#live-control-goods-list-container > div > div > div:nth-child(' + i + ')');
                    	let goodsId = productionElement.dataset.rbdDraggableId;
                    	// console.error(productionElement);
                    	// console.error(productionId);
                        clearFindIdByIndexInterval();
                        callback(goodsId);
                        return;
                    }
                }
                scoll.scrollTop = (scoll.scrollHeight * (5 / 34) * scollTimes) % scoll.scrollHeight;
                scollTimes = scollTimes + 1;
                console.log("getProductionId, 找不到商品, 尝试滚动列表 scollTimes " + scollTimes + " scoll.scrollTop " + scoll.scrollTop);
            }
        }, 100);
    }

    function clearLoopTimeInterval() {
        if (loopTimeInterval != null) {
            console.log("clearLoopTimeInterval");
            clearInterval(loopTimeInterval);
            loopTimeInterval = null;
        }
    }

    function clearFindTargetInterval() {
        if (findTargetInterval != null) {
            console.log("clearFindTargetInterval");
            clearInterval(findTargetInterval);
            findTargetInterval = null;
        }
    }

    function clearTalkInterval() {
        if (talkInterval != null) {
            console.log("clearTalkInterval");
            clearInterval(talkInterval);
            talkInterval = null;
        }
    }

    function clearFindIdByIndexInterval() {
        if (findIdByIndexInterval != null) {
            console.log("clearFindIdByIndexInterval");
            clearInterval(findIdByIndexInterval);
            findIdByIndexInterval = null;
        }
    }

    function isInputEmpty(inputElement) {
    	return !inputElement.value.trim();
	}

	function strArrays2intArrays(strArray) {
		const intArray = [];
		for (let i = 0; i < strArray.length; i++) {
  			intArray.push(parseInt(strArray[i]));
		}
		return intArray;
	}

    startButton.addEventListener("click", function() {
    	let result = initInput();
    	if (result) {
        	startLoopClick();
        	startButton.disabled = true;
        	stopButton.disabled = false;
    	}
    });
    stopButton.addEventListener("click", function() {
    	stopLoopClick()
    	startButton.disabled = false;
        stopButton.disabled = true;
    });

    document.body.appendChild(scriptContainer);

})();