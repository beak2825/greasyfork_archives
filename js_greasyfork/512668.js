// ==UserScript==
// @name         福建执业药师继续教育学习平台-学习助手
// @namespace    https://tampermonkey.net/
// @version      0.0.1.1
// @description  切换屏幕,视频不暂停
// @author       骑行天山
// @match        fjlpa.mtnet.com.cn/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/512668/%E7%A6%8F%E5%BB%BA%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/512668/%E7%A6%8F%E5%BB%BA%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    let currentChapter = null;  // 用于跟踪当前播放的章节
    let isPlaying = false;  // 用于跟踪是否正在播放视频
    let checkInterval = null;  // 用于存储定时器
    let visibilityChangeListenerAdded = false;  // 用于跟踪是否已添加可见性变化监听器
    let progressListenerAdded = false;  // 用于跟踪是否已添加播放进度监听器
 
	function checkPageType() {
        if (isPlaying) return;  // 如果正在播放，则不进行页面类型检查
 
        const courseList = document.querySelector('.indexCourseListS');
        const chapterList = document.querySelector('ul.chapterList');
 
        if (courseList) {
            console.log("检测到课程列表页");
            checkAndClickUnfinishedCourses();
        } else if (chapterList) {
            console.log("检测到最终播放页");
            checkFinalPage();
        } else {
            console.error("无法确定页面类型");
            setTimeout(checkPageType, 3000);  // 3秒后重新检查
        }
    }
 
    function checkAndClickUnfinishedCourses() {
        const courseList = document.querySelector('.indexCourseListS');
        if (courseList) {
            const courseItems = courseList.querySelectorAll('.indexCourseListSLi');
            let allCompleted = true;
 
            courseItems.forEach(item => {
                const progressElement = item.querySelector('.gkjd span[style*="color: rgb(255, 148, 102)"]');
                if (progressElement && progressElement.textContent !== '100%') {
                    allCompleted = false;
                    const enterLearningButton = item.querySelector('.indexTextBtn');
                    if (enterLearningButton) {
                        enterLearningButton.click();
                        setTimeout(checkPageType, 2000);  // 2秒后重新检查页面类型
                    }
                }
            });
 
            if (allCompleted) {
                console.log("所有课程已完成，退出脚本");
                return;  // 退出脚本
            }
        } else {
            console.error("无法找到课程列表容器 .indexCourseListS");
            setTimeout(checkPageType, 2000);  // 2秒后重新检查页面类型
        }
    }
 
	function checkFinalPage() {
		const chapterList = document.querySelector('ul.chapterList');
		if (chapterList) {
			const chapters = chapterList.querySelectorAll('li');
 
			// 找到第一个未完成的章节并播放
			for (let i = 0; i < chapters.length; i++) {
				const chapter = chapters[i];
				if (!chapter.classList.contains('avideoF')) {
					// 检查当前章节的播放进度
					const progressElement = chapter.querySelector('.chapterPro.floatR.currProgress');
					if (progressElement && progressElement.textContent === '0%' && window.location.href === "https://fjlpa.mtnet.com.cn/video") {
						// 自动点击播放按钮
						const playButton = chapter.querySelector('span.floatR.toPlay');
						if (playButton) {
							playButton.click();
							isPlaying = true;
							currentChapter = chapter;
							break;  // 开始播放后退出循环
						}
					}
 
					if (currentChapter !== chapter) {
						const playButton = chapter.querySelector('span.floatR.toPlay');
						if (playButton) {
							playButton.click();
							currentChapter = chapter;  // 更新当前播放的章节
							isPlaying = true;  // 设置为正在播放状态
						}
					}
					break;  // 找到并点击了第一个未完成的章节，跳出循环
				}
			}
 
			// 启动定时器定期检查总观看进度
			if (checkInterval === null) {
				checkInterval = setInterval(() => {
					checkTotalProgress(chapters);
				}, 2000);  // 每2秒检查一次
			}
 
			// 添加可见性变化监听器
			if (!visibilityChangeListenerAdded) {
				document.addEventListener('visibilitychange', handleVisibilityChange);
				visibilityChangeListenerAdded = true;
				console.log("已添加可见性变化监听器");
			}
			
		} else {
			console.error("无法找到最终播放页列表 ul.chapterList");
			setTimeout(checkPageType, 2000);  // 2秒后重新检查页面类型
		}
	}
 
	function checkTotalProgress(chapters) {
		// 检查总观看进度是否为100%
		const totalProgressElement = document.querySelector('.gkjd span[style*="color: rgb(255, 148, 102)"]');
		if (totalProgressElement && totalProgressElement.textContent === '100%') {
			// 如果总观看进度达到100%，清除定时器并导航到课程列表页
			clearInterval(checkInterval);
			checkInterval = null;
			window.location.href = "https://fjlpa.mtnet.com.cn/index";
			return;  // 确保不再执行后续代码
		}
 
		// 获取当前视频的播放进度
		const progressCursor = document.querySelector('.prism-progress-played');
		let currentProgress = 0;
		if (progressCursor && progressCursor.style.width) {
			currentProgress = parseFloat(progressCursor.style.width) / 100;  // 将百分比转换为小数
			console.log("当前视频播放进度：" + currentProgress );
			if (currentProgress >= 0.99) {
				// 刷新当前页面
				window.location.reload();
				console.log("视频播放进度达到99%，页面已刷新");
				// console.log("视频播放进度达到99%，查找下一个未播放视频");


				// 遍历所有章节
				const chapters = document.querySelectorAll('.chapters-container .chapter');
				for (let i = 0; i < chapters.length; i++) {
					const chapter = chapters[i];
					// 检查当前章节的播放进度
					const progressElement = chapter.querySelector('.chapterPro.floatR.currPlay');
					if (progressElement) {
						const progressText = progressElement.textContent;

						// 检查当前章节的播放进度是否为0%
						if (progressText === '0%' && window.location.href === "https://fjlpa.mtnet.com.cn/video") {
							// 自动点击播放按钮
							const playButton = chapter.querySelector('span.floatR.toPlay');
							if (playButton) {
								playButton.click();
								isPlaying = true;
								currentChapter = chapter;
								break;  // 开始播放后退出循环
							}
						} else if (progressText === '100%' || currentProgress >= 1) {
							// 如果当前章节播放进度为100%或当前视频播放进度达到100%，寻找下一个未完成的章节
							for (let j = i + 1; j < chapters.length; j++) {
								const nextChapter = chapters[j];
								const nextProgressElement = nextChapter.querySelector('.chapterPro.floatR.currPlay');
								if (nextProgressElement && nextProgressElement.textContent !== '100%') {
									// 找到了下一个未完成的章节
									const playButton = nextChapter.querySelector('span.floatR.toPlay');
									if (playButton) {
										// 点击播放按钮
										playButton.click();
										// 更新状态
										isPlaying = true;
										currentChapter = nextChapter;
									}
									break;  // 跳出循环，因为我们已经找到了下一个要播放的章节
								}
							}
							break;  // 当前章节处理完毕，跳出外层循环
						} else if (!isPlaying && !currentChapter) {
							// 如果没有章节正在播放，并且currentChapter为空，尝试播放当前章节
							const playButton = chapter.querySelector('span.floatR.toPlay');
							if (playButton) {
								playButton.click();
								isPlaying = true;
								currentChapter = chapter;
							}
							break;  // 开始播放后退出循环
						}
					}
				}
			}
		}
 
		// 如果所有章节都已经播放完毕，可以进行其他操作
		if (isPlaying && !currentChapter) {
			console.log("所有章节已完成播放");
			// 可以在这里添加额外的逻辑，比如提示用户所有章节已完成
		}
	}
 
    function handleVisibilityChange() {
        if (document.hidden) {
            // 页面不可见时的操作
            console.log("页面隐藏");
        } else {
            // 页面再次可见时的操作
            console.log("页面显示");
 
            // 确保页面恢复正常
            try {
                // 恢复视频播放
                const video = document.querySelector('video');
                if (video && video.paused) {
                    video.play();
                }
            } catch (error) {
                console.error("恢复页面时出错:", error);
            }
            // 隐藏弹窗继续看视频
            $('.el-dialog__footer').hide();
        }
    }
 
 
	// 确保DOM结构已经加载完毕
	document.addEventListener('DOMContentLoaded', function() {
	  console.log("DOM已加载完毕，将在3秒后开始检查页面类型");
	  
	  // 设置一个3秒的延迟
	  setTimeout(function() {
		checkPageType();
		
		// 直接滚动到顶部
		window.scrollTo(0, 0);
	  }, 3000); // 3000毫秒 = 3秒
	});
 
	// 创建一个观察者实例并传入回调函数
	const observer = new MutationObserver(checkPageType);
	const config = { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] };
 
	// 开始观察文档树的指定节点
	observer.observe(document.body, config);
 
	// 动态加载jQuery
	function loadJQuery(callback) {
		if (typeof $ !== 'undefined' && $.fn.jquery) {
			callback();
		} else {
			const script = document.createElement('script');
			script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
			script.onload = callback;
			document.head.appendChild(script);
		}
	}
 
	// 加载jQuery并执行主逻辑
	loadJQuery(() => {
		// 隐藏继续看视频弹窗
		$('.el-dialog__footer').hide();
 
		// 其他逻辑可以在这里添加
	});
 
	// 添加 onload 事件监听器
	window.onload = function() {
		// 检查是否回到了预期的课程列表页
		if (window.location.href === "https://fjlpa.mtnet.com.cn/index") {
			console.log("页面已回退到课程列表页，重新检查页面类型");
			checkPageType();
		}
 
		// 直接滚动到顶部
		window.scrollTo(0, 0);
 
		// 定期检查页面URL并执行相应的操作
		setInterval(() => {
			try {
				let hre = location.href;
 
				if (hre == "https://fjlpa.mtnet.com.cn/video") {
					if (document.querySelector(".prism-big-play-btn.pause")) {
						setTimeout(() => {
							// 重新设置定时器
							setInterval(() => {}, 2000);
						}, 2000);
					}
				}
 
				if (hre.includes("https://fjlpa.mtnet.com.cn/video")) {
					window.onblur = function () {};
					if (document.querySelector("video").paused) {
						document.querySelector("video").play();
					}
				}
			} catch (error) {}
		}, 5000);
 
			// 隐藏继续看视频弹窗
			$('.el-dialog__footer').hide();
		};
})();