// ==UserScript==
// @name        UOOC 自动看视频
// @namespace   Violentmonkey Scripts
// @match       https://www.uooc.net.cn/home/learn/index*
// @grant       none
// @version     1.0
// @author      relic-yuexi
// @description 自动播放视频和处理视频里的测验
// @license Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/514609/UOOC%20%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/514609/UOOC%20%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置对象
    var config = {
        autoPlay: true,    // 自动播放开关
        autoSwitch: true,  // 自动切换开关
        autoQuiz: true     // 自动处理测验开关
    };

    // 添加启动按钮到页面
    function addStartButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '启动自动播放';
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.left = '10px';
        btn.style.zIndex = '9999';
        btn.onclick = initAutoPlaySystem;
        document.body.appendChild(btn);
    }

    // 获取当前视频元素
    function getCurrentVideo() {
        return document.getElementsByTagName('video')[0];
    }

    // 处理视频播放
    function handleVideoPlay() {
        var currentvideo = getCurrentVideo();
        if(currentvideo && config.autoPlay && currentvideo.paused &&
           currentvideo.duration != currentvideo.currentTime &&
           (currentvideo.currentTime != 0 || config.autoPlay)) {

            // 尝试播放，并处理可能的错误
            currentvideo.play().catch(function(error) {
                console.log('播放失败:', error);
                // 如果是因为用户未交互导致的错误，不用特别处理
                // 用户点击启动按钮后就可以正常播放了
            });
        }
    }

    // 自动处理测验
    function handleQuiz() {
        var quizLayer = document.querySelector('.layui-layer.layui-layer-page');
        if(quizLayer) {
            console.log('检测到测验弹窗，自动处理中...');

            // 检查是否已经显示了正确答案
            var wrongTip = quizLayer.querySelector('.fl_left[style*="color:red"]');
            if(wrongTip) {
                // 如果显示了正确答案，解析并选择正确选项
                console.log('发现正确答案提示');
                var answerText = wrongTip.textContent;
                try {
                    // 从文本中提取正确答案数组，例如 '正确答案: ["C","D"]'
                    var answers = JSON.parse(answerText.split(': ')[1]);
                    console.log('正确答案:', answers);

                    // 清除所有已选项
                    var allOptions = quizLayer.querySelectorAll('input[type="checkbox"], input[type="radio"]');
                    allOptions.forEach(option => {
                        option.checked = false;
                    });

                    // 选择正确答案
                    answers.forEach(answer => {
                        var option = quizLayer.querySelector(`input[value="${answer}"]`);
                        if(option) {
                            option.click();
                            console.log('选择答案:', answer);
                        }
                    });
                } catch(e) {
                    console.log('解析答案出错:', e);
                }
            } else {
                // 如果还没显示正确答案，随机选择一个选项
                var options = quizLayer.querySelectorAll('input[type="checkbox"], input[type="radio"]');
                if(options.length > 0) {
                    // 判断是单选还是多选
                    var isMultiple = options[0].type === 'checkbox';
                    console.log('题目类型:', isMultiple ? '多选' : '单选');

                    if(isMultiple) {
                        // 如果是多选，随机选择1-2个选项
                        var numToSelect = Math.floor(Math.random() * 2) + 1;
                        var indexes = new Set();
                        while(indexes.size < numToSelect) {
                            indexes.add(Math.floor(Math.random() * options.length));
                        }
                        indexes.forEach(index => {
                            options[index].click();
                            console.log('选择选项:', options[index].value);
                        });
                    } else {
                        // 如果是单选，随机选择一个选项
                        var randomIndex = Math.floor(Math.random() * options.length);
                        options[randomIndex].click();
                        console.log('选择选项:', options[randomIndex].value);
                    }
                }
            }

            // 点击确定按钮
            setTimeout(function() {
                var confirmBtn = quizLayer.querySelector('.btn.btn-success');
                if(confirmBtn) {
                    console.log('点击确定按钮');
                    confirmBtn.click();
                }
            }, 500);
        }
    }


    // 处理视频播放完成后的切换逻辑
    function handleVideoEnd() {
        // 首先检查当前小节是否还有未播放的视频
        var currentSection = document.querySelector('.resourcelist');
        var videos = currentSection.querySelectorAll('.icon-video');
        var activeVideoParent = document.querySelector('.basic.ng-scope.active');

        // 获取当前视频的索引
        var currentIndex = -1;
        videos.forEach((v, i) => {
            if(v.closest('.basic').classList.contains('active')) {
                currentIndex = i;
            }
        });

        // 如果当前小节还有未播放的视频
        if(currentIndex < videos.length - 1) {
            console.log('当前小节还有未播放的视频，切换到下一个视频');
            videos[currentIndex + 1].closest('.basic').click();

            // 等待新视频加载
            setTimeout(function() {
                setupVideoEvents();  // 重新设置视频事件
            }, 1000);
            return;
        }

        // 如果是小节的最后一个视频，准备切换到下一小节
        console.log('当前小节视频已全部播放完，准备切换到下一小节');
        var currentSectionLi = document.querySelector('.oneline.ng-binding.active').closest('li');
        var nextLi = currentSectionLi.nextElementSibling;

        if(nextLi) {
            // 切换到下一小节
            var nextSectionDiv = nextLi.querySelector('.basic');
            if(nextSectionDiv) {
                console.log('正在切换到下一节:', nextLi.querySelector('.oneline').textContent.trim());
                nextSectionDiv.click();

                // 等待新页面加载完成后点击第一个视频
                setTimeout(function() {
                    var newVideoBtn = document.querySelector('.icon-video');
                    if(newVideoBtn) {
                        console.log('正在点击新小节的第一个视频');
                        newVideoBtn.closest('.basic').click();

                        // 等待新视频加载
                        setTimeout(function() {
                            setupVideoEvents();  // 重新设置视频事件
                        }, 1000);
                    }
                }, 2000);
            }
        } else {
            // 如果是章节的最后一个小节，切换到下一章
            var activeSection = document.querySelector('.oneline.ng-binding.active');
            if(activeSection) {
                var currentChapterItem = activeSection.closest('.catalogItem');
                var nextChapterItem = currentChapterItem.nextElementSibling;

                if(nextChapterItem) {
                    console.log('正在切换到下一章节:', nextChapterItem.querySelector('.oneline').textContent.trim());
                    var nextChapterDiv = nextChapterItem.querySelector('.chapter');
                    if(nextChapterDiv) {
                        nextChapterDiv.click();

                        // 等待新章节加载完成后点击第一个小节
                        setTimeout(function() {
                            var firstSection = document.querySelector('.rank-2 li .basic');
                            if(firstSection) {
                                firstSection.click();
                                // 等待小节加载完成后点击第一个视频
                                setTimeout(function() {
                                    var firstVideo = document.querySelector('.icon-video');
                                    if(firstVideo) {
                                        console.log('正在点击新章节第一个视频');
                                        firstVideo.closest('.basic').click();

                                        // 等待新视频加载
                                        setTimeout(function() {
                                            setupVideoEvents();  // 重新设置视频事件
                                        }, 1000);
                                    }
                                }, 2000);
                            }
                        }, 2000);
                    }
                } else {
                    console.log('恭喜！课程已全部播放完成！');
                }
            }
        }
    }


    // 设置视频事件监听
    function setupVideoEvents() {
        var currentvideo = getCurrentVideo();
        if(currentvideo) {
            console.log('设置新视频事件监听');
            // 移除可能存在的旧事件监听
            currentvideo.removeEventListener('ended', handleVideoEnd);
            // 添加新的事件监听
            currentvideo.addEventListener('ended', function() {
                if(config.autoSwitch) {
                    console.log('视频播放完成，准备切换下一个视频');
                    handleVideoEnd();
                }
            });
        }
    }

    // 初始化系统
    function initAutoPlaySystem() {
        console.log('自动播放系统已启动');
        console.log('autoPlay:', config.autoPlay);
        console.log('autoSwitch:', config.autoSwitch);
        console.log('autoQuiz:', config.autoQuiz);

        // 设置定时检查
        setInterval(function() {
            if(config.autoQuiz) {
                handleQuiz();
            }
            handleVideoPlay();
        }, 2000);

        // 初始设置视频事件
        setupVideoEvents();
    }

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 添加启动按钮
        addStartButton();
    });

})();