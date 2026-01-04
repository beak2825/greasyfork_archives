// ==UserScript==
// @name         收藏夹真实随机播放
// @namespace    https://github.com/atoposyz/BiliListRealRandomPlay
// @version      1.5
// @description  让b站收藏夹的随机播放真的在随机播放
// @author       atoposyz
// @match        https://www.bilibili.com/list/ml*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512477/%E6%94%B6%E8%97%8F%E5%A4%B9%E7%9C%9F%E5%AE%9E%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/512477/%E6%94%B6%E8%97%8F%E5%A4%B9%E7%9C%9F%E5%AE%9E%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
	"use strict";

	var url = "https://api.bilibili.com/x/v3/fav/resource/ids?media_id=";
	var xhr = new XMLHttpRequest();
	var musiclist;
	var shuffledResult;
	var media_id = (function () {
		var query = window.location.pathname;
		console.log(query);
		var vars = query.split("/")[2].split("l")[1];
		return vars;
	})();

	// 定义 Fisher-Yates 洗牌算法
	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1)); // 从 0 到 i 随机选择一个元素
			[array[i], array[j]] = [array[j], array[i]]; // 交换位置
		}
		return array;
	}

	// 检查 sessionStorage 是否已经有保存的 shuffle 结果
	function getShuffledArray() {
		const storedArray = sessionStorage.getItem("shuffledArray");
		if (storedArray) {
			// 如果有保存的结果，直接返回
			return JSON.parse(storedArray);
		} else {
			// 没有保存的结果时，创建一个新的数组并进行洗牌
			const arrayToShuffle = musiclist; // 替换为你想要打乱的数组
			const shuffledArray = shuffleArray(arrayToShuffle);

			// 将洗牌结果保存到 sessionStorage
			sessionStorage.setItem("shuffledArray", JSON.stringify(shuffledArray));
			sessionStorage.setItem("allItem", shuffledArray.length);
			sessionStorage.setItem("arrayP", 0);

			return shuffledArray;
		}
	}

	function updatePos(pos) {
		pos = parseInt(pos) + 1
		if (parseInt(pos) < parseInt(sessionStorage.getItem("allItem"))) {
			sessionStorage.setItem("arrayP", parseInt(pos));
		} else {
			sessionStorage.removeItem("shuffledArray");
			shuffledResult = getShuffledArray();
			sessionStorage.setItem("arrayP", 0);
		}
	}

	function getPos() {
		const storedPos = sessionStorage.getItem("arrayP");
		if (storedPos) {
			return sessionStorage.getItem("arrayP");
		} else {
			sessionStorage.setItem("arrayP", 0);
			return 0;
		}
	}

	// 定义视频播放结束时要执行的操作
	function performActionOnEnd() {
		const pos = getPos();
		updatePos(pos);
		var listurlpart = window.location.pathname;
		var aidpart = "oid=" + shuffledResult[pos].id;
		var bvid = "bvid=" + shuffledResult[pos].bvid;
		const targetUrl =
			"https://www.bilibili.com" + listurlpart + "?" + aidpart + "&" + bvid; // 替换成你想跳转的网址
		window.location.href = targetUrl;
	}

	function randomPlay() {
		console.log(media_id);
		url = url + media_id;
		xhr.open("GET", url, true);
		xhr.onload = function (e) {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					console.log("收藏夹获取成功！！！！！！");
					musiclist = JSON.parse(xhr.responseText).data;
					console.log("洗牌之前的数组：", musiclist);
					// 使用 getShuffledArray 获取洗牌后的数组
					shuffledResult = getShuffledArray();
					console.log("洗牌后的数组:", shuffledResult);
				} else {
					console.error("收藏夹获取失败！！！！！！");
				}
			}
		};

		xhr.send(null);

		
		let checkCount = 0; // 初始化检查次数
		const maxChecks = 15; // 最大检查次数
		const interval = 500; // 检查间隔时间（毫秒）
		const pos = getPos();
		console.log("the pos is " + pos);
		// 使用 setInterval 每 0.5 秒检查一次
		const checkInterval = setInterval(() => {
			checkCount++; // 增加检查次数

			const playButton = document.querySelector(".bpx-player-ctrl-play");

			if (playButton) {
				playButton.click(); // 模拟点击播放按钮
				console.log("已自动播放视频");
				clearInterval(checkInterval); // 找到按钮后，停止检查
			} else if (checkCount >= maxChecks) {
				console.error("未找到播放按钮，操作超时"); // 检查次数达到最大值后，报错
				clearInterval(checkInterval); // 达到最大检查次数后，停止检查
			} else {
				console.log(`第 ${checkCount} 次检查：未找到播放按钮`);
			}
		}, interval);
		// 首先获取视频元素
		const videoElement = document.querySelector("video");
		console.log('已获得视频元素');
		// 监听视频播放结束事件
		videoElement.addEventListener("ended", performActionOnEnd);
		console.log("正在监听视频播放进度");
	}


	
    // 持久化存储键名
    const STORAGE_KEY = 'custom_random_switch';
    // 初始化状态（默认关闭）
    let isActive = GM_getValue(STORAGE_KEY, false);

    // 创建自定义按钮
    function createCustomButton() {
        const btn = document.createElement('div');
        btn.id = 'custom-random-btn';
        btn.textContent = isActive ? '▶' : '⏸';
        btn.style.cssText = `
            width: 24px;
			height: 24px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #2196F3;
			color: white;
			border: none;
			border-radius: 4px;
			cursor: pointer;
			font-size: 12px;
			padding: 0;
			margin-left: 8px;
			position: relative;
        `;

        // 点击事件：切换状态
        btn.addEventListener('click', function() {
			event.stopPropagation();
            isActive = !isActive;
            GM_setValue(STORAGE_KEY, isActive);
            updateButtonStyle(btn, isActive);
            toggleScriptLogic(isActive);
        });

        return btn;
    }

    // 更新按钮样式和文字
    function updateButtonStyle(btn, isActive) {
        btn.textContent = isActive ? '▶' : '⏸';
    }

    // 核心逻辑开关
    function toggleScriptLogic(isActive) {
        if (isActive) {
            console.log('随机播放已开启');
			randomPlay();
        } else {
            console.log('随机播放已关闭');
        }
    }
	// --- 初始化 ---
    function init() {
        // 插入按钮
		const headerLeft = document.querySelector('.header-left');
		if (!headerLeft) {
			console.error('未找到 .header-left 容器');
			return;
		}
		const existingBtn = document.getElementById('custom-random-btn');
        if (!existingBtn) {
            const btn = createCustomButton();
            headerLeft.appendChild(btn);
        }
        
		// 初始化逻辑
        toggleScriptLogic(isActive);
    }

    // 确保在DOM就绪后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听页面动态跳转（如SPA）
    let lastURL = location.href;
    setInterval(() => {
        if (location.href !== lastURL) {
            lastURL = location.href;
            init(); // 页面跳转后重新挂载按钮
        }
    }, 500);
	

})();
