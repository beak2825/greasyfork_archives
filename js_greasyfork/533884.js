// ==UserScript==
// @name         大橘の学习公社
// @namespace    HugeOrange
// @version      1.1.0
// @description  学习公社自动看视频、自动刷新、自动跳过防疲劳、自动禁音和倍速播放
// @author       HugeOrange
// @match        https://study.enaea.edu.cn/viewerforccvideo.do*
// @match        https://study.enaea.edu.cn/circleIndexRedirect.do*
// @grant        none
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/533884/%E5%A4%A7%E6%A9%98%E3%81%AE%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/533884/%E5%A4%A7%E6%A9%98%E3%81%AE%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE.meta.js
// ==/UserScript==

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

(function () {
    var url = window.location.pathname
    // 从localStorage读取保存的播放速度，如果没有则使用默认值4.0
    var playbackSpeed = parseFloat(localStorage.getItem('videoPlaybackSpeed') || '4.0');

    // 向页面中添加倍速输入框
    function addSpeedInput() {
        // 等待页面加载完成
        setTimeout(function() {
            // 找到"赞"按钮所在的位置
            var likeButton = document.getElementById('like');
            if (!likeButton) return;
            
            // 创建一个新的元素用于放置倍速控制
            var speedControlLi = document.createElement('li');
            // 使用自定义样式，不使用现有的类名
            speedControlLi.id = 'speed-control';
            
            // 自定义样式
            speedControlLi.style.marginRight = '10px';
            speedControlLi.style.display = 'flex';
            speedControlLi.style.alignItems = 'center';
            speedControlLi.style.height = '30px';
            speedControlLi.style.background = 'none'; // 移除背景
            speedControlLi.style.padding = '0 5px';
            speedControlLi.style.position = 'relative';
            
            // 创建自定义的倍速控制容器
            var speedControlContainer = document.createElement('div');
            speedControlContainer.style.display = 'flex';
            speedControlContainer.style.alignItems = 'center';
            speedControlContainer.style.height = '100%';
            speedControlContainer.style.padding = '0 5px';
            speedControlContainer.style.backgroundColor = '#f5f5f5';
            speedControlContainer.style.borderRadius = '4px';
            speedControlContainer.style.border = '1px solid #e0e0e0';
            
            // 创建标签
            var speedLabel = document.createElement('span');
            speedLabel.textContent = '倍速: ';
            speedLabel.style.color = '#666';
            speedLabel.style.fontSize = '12px';
            speedLabel.style.marginRight = '3px';
            
            // 创建输入框
            var speedInput = document.createElement('input');
            speedInput.type = 'number';
            speedInput.min = '0.5';
            speedInput.max = '16';  // 增加最大倍速至16
            speedInput.step = '0.25';
            speedInput.value = playbackSpeed;
            speedInput.style.width = '40px';
            speedInput.style.height = '22px';
            speedInput.style.textAlign = 'center';
            speedInput.style.border = '1px solid #ccc';
            speedInput.style.borderRadius = '3px';
            speedInput.style.padding = '0 5px';
            speedInput.style.backgroundColor = '#fff';
            speedInput.style.verticalAlign = 'middle';
            speedInput.style.fontSize = '12px';
            speedInput.style.outline = 'none';
            
            // 监听输入变化
            speedInput.addEventListener('change', function() {
                var speed = parseFloat(this.value);
                // 限制范围在0.5到16之间
                if (speed < 0.5) speed = 0.5;
                if (speed > 16) speed = 16;
                this.value = speed;
                playbackSpeed = speed;
                setVideoSpeed(speed);
            });
            
            // 组装元素
            speedControlContainer.appendChild(speedLabel);
            speedControlContainer.appendChild(speedInput);
            speedControlLi.appendChild(speedControlContainer);
            
            // 插入到"赞"按钮之前
            likeButton.parentNode.insertBefore(speedControlLi, likeButton);
        }, 2000); // 等待2秒确保页面元素加载完成
    }

    // 设置视频速度并保存到localStorage
    function setVideoSpeed(speed) {
        var video = document.getElementsByTagName('video')[0];
        if (video) {
            video.playbackRate = speed;
            console.log('设置播放速度为: ' + speed);
            // 保存到localStorage
            localStorage.setItem('videoPlaybackSpeed', speed);
        }
    }
    
    // 静音视频
    function muteVideo() {
        var video = document.getElementsByTagName('video')[0];
        if (video) {
            video.muted = true;
            console.log('视频已静音');
        }
    }

    //视频播放页
    if (url == '/viewerforccvideo.do') {
        //清理localStorage，以防不给加进度。
        localStorage.clear();
        localStorage.setItem('videoIsDone', false)

        // 添加倍速控制
        addSpeedInput();

        // 防疲劳
        setTimeout(() => {
            let video = document.getElementsByTagName('video')[0];
            console.log(video)
            
            // 设置播放速度
            if (video) {
                setVideoSpeed(playbackSpeed);
                // 自动静音
                muteVideo();
                
                // 等待视频加载元数据，确保获取的duration有效
                if (video.readyState === 0) { // HAVE_NOTHING
                    video.addEventListener('loadedmetadata', jumpToSavedProgress);
                } else {
                    jumpToSavedProgress();
                }
            }
            
            //pause：暂停监听
            video.addEventListener('pause', function (e) {
                console.log('暂停播放')
                //继续播放
                videoPlay()
                //删除弹窗
                let dialog = document.getElementById('rest_tip');
                if (dialog) {
                    dialog.remove()
                }
            })

            // 监听播放事件，确保每次播放都设置正确的速度和静音状态
            video.addEventListener('play', function() {
                setVideoSpeed(playbackSpeed);
                muteVideo(); // 确保始终保持静音
            });
        }, 5000)
        
        // 根据学习进度跳转到相应位置
        function jumpToSavedProgress() {
            try {
                // 获取视频元素
                let video = document.getElementsByTagName('video')[0];
                if (!video || !video.duration) {
                    console.log('视频尚未完全加载，无法获取时长');
                    return;
                }
                
                // 获取当前视频的学习进度
                let progressElements = document.getElementsByClassName('current');
                if (progressElements.length < 2 || !progressElements[1].children[0].childNodes[1]) {
                    console.log('无法获取当前视频学习进度元素');
                    return;
                }
                
                let progressText = progressElements[1].children[0].childNodes[1].innerText;
                let progressPercent = parseFloat(progressText.replace('%', '')) / 100;
                
                // 如果进度为0%或100%，不进行跳转
                if (progressPercent === 0 || progressPercent >= 1) {
                    console.log('视频进度为' + (progressPercent === 0 ? '0%，从头开始播放' : '100%，从头开始播放'));
                    return;
                }
                
                // 计算应该跳转到的时间点（向下取整到分钟）
                let totalSeconds = video.duration;
                let targetSeconds = Math.floor(totalSeconds * progressPercent);
                let targetMinutes = Math.floor(targetSeconds / 60);
                let jumpToSeconds = targetMinutes * 60;
                
                // 如果跳转位置太接近视频末尾，稍微往前调整
                if (jumpToSeconds > totalSeconds - 30) {
                    jumpToSeconds = Math.max(0, totalSeconds - 60); // 留出至少60秒
                }
                
                // 执行跳转
                video.currentTime = jumpToSeconds;
                
                console.log('视频总时长: ' + formatTime(totalSeconds));
                console.log('当前学习进度: ' + progressText);
                console.log('跳转到时间点: ' + formatTime(jumpToSeconds));
                
                // 显示跳转提示
                showJumpNotification(progressText, formatTime(jumpToSeconds));
            } catch (e) {
                console.error('跳转到学习进度时出错:', e);
            }
        }
        
        // 格式化时间为 MM:SS 格式
        function formatTime(seconds) {
            let minutes = Math.floor(seconds / 60);
            let remainingSeconds = Math.floor(seconds % 60);
            return minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
        }
        
        // 显示跳转提示
        function showJumpNotification(progress, timePoint) {
            // 创建通知元素
            let notification = document.createElement('div');
            notification.style.position = 'fixed';
            notification.style.top = '80px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            notification.style.color = 'white';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = '9999';
            notification.style.fontFamily = 'Arial, sans-serif';
            notification.style.fontSize = '14px';
            notification.textContent = `已跳转到上次学习位置 (${progress} → ${timePoint})`;
            
            // 添加到页面
            document.body.appendChild(notification);
            
            // 3秒后移除
            setTimeout(() => {
                if (notification && notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        }

        //五秒后关闭声音
        function Music_No() {
            setTimeout(function () {
                document.getElementsByClassName("xgplayer-icon-muted")[0].click()
            }, 5000)
        }

        //点击未完成的视频进行播放
        function rePlay() {
            setTimeout(function () {
                if (document.getElementsByClassName("cvtb-MCK-CsCt-studyProgress")[0].innerHTML == '100%') {
                    for (var i = 1; i < document.getElementsByClassName("cvtb-MCK-CsCt-studyProgress")
                        .length; i++) {
                        if (document.getElementsByClassName("cvtb-MCK-CsCt-studyProgress")[i].innerHTML !=
                            '100%') {
                            document.getElementsByClassName("cvtb-MCK-CsCt-studyProgress")[i].click()
                            break
                        }
                    }
                }
            }, 2000)
        }

        //隔五秒循环执行
        setInterval(function () {

            //最后一个视频的index
            index = document.getElementsByClassName("cvtb-MCK-CsCt-studyProgress").length - 1

            //查看当前课前是否完成
            if (document.getElementsByClassName('current')[1].children[0].childNodes[1].innerText ==
                '100%') {

                //如果最后一个视频完成了就代表全部视频都完成了
                if (document.getElementsByClassName("cvtb-MCK-CsCt-studyProgress")[index].innerHTML ==
                    '100%') {
                    //关闭网站
                    localStorage.setItem('videoIsDone', true)
                    window.close()
                } else {
                    //否则播放下一个未完成的视频
                    rePlay()
                }

            } else {
                console.log("正在观看：" + document.getElementsByClassName('current')[1].children[0]
                    .getElementsByClassName("cvtb-text-ellipsis")[0].innerHTML)
            }


            //如果出现异常就刷新网页
            if (document.getElementsByClassName("dialog-content")[0] != undefined) {
                if (document.getElementsByClassName("dialog-content")[0].innerText == '学时记录出现异常请检查网络') {
                    location.reload()
                }
            }

        }, 5000)


        setInterval(function () {
            //播放视频
            videoPlay()
            
            // 每隔一段时间检查并确保设置正确的播放速度和静音状态
            let video = document.getElementsByTagName('video')[0];
            if (video) {
                if (video.playbackRate !== playbackSpeed) {
                    setVideoSpeed(playbackSpeed);
                }
                if (!video.muted) {
                    muteVideo(); // 确保始终保持静音
                }
            }
        }, 1000)

        rePlay()
        Music_No()
    }

    //课程学习页
    if (url == '/circleIndexRedirect.do') {

        function playVideo_2() {
            //切换到未完成的课程tab
            document.getElementsByClassName('customcur-tab-text')[1].click()

            //检测是否完成视频
            if (localStorage.getItem('videoIsDone') == 'true') {
                location.reload()
            } else {
                console.log("观看视频：", document.getElementsByClassName('course-title')[0].innerText)
            }

        }

        //首次进入，只执行一次
        function playVideo_1() {
            //切换到未完成的课程tab
            document.getElementsByClassName('customcur-tab-text')[1].click()

            //检测是否完成视频
            if (localStorage.getItem('videoIsDone') == null) {
                alert('切换到课程学习页自动刷视频，请确保视频可以正常播放后在挂机，点击确定开始运行')
            }

            //循环
            setTimeout(function () {
                //点击第一个开始学习
                document.getElementsByClassName('golearn')[0].click()
            }, 1000)
        }

        //判断是否为试卷页面
        if (getQueryVariable('type') == 'exam') {
            var formDdata = {
                "circleId": cid,
                "syllabusId": sid,
            };
            $.ajax({
                type: "GET",
                url: 'circleIndex.do?action=getMyClass',
                data: formDdata,
                async: true,
                beforeSend: function () {
                    console.log('请等待...');
                },
                complete: function (XMLHttpRequest, status, errorThrown) {
                    console.log('获取完成...');
                },
                success: function (data) {
                    console.log('获取成功...');
                    console.log(data)
                    var dataJson = eval('(' + data + ')');
                    console.log(dataJson.result['list'][0].id)
                    setTimeout(function () {
                        var styleMap = {
                            "width": "100px",
                            display: "inline-block",
                            "background-color": "red",
                            cursor: "pointer",
                            "user-select": "none",
                            "border-radius": "4px",
                            color: "#fff",
                            "font-size": "10px",
                            "line-height": "30px",
                            "margin": "0px 30px",
                        };
                        var btn = document.createElement("a");
                        btn.innerHTML = "提前查看试卷";
                        for (let i in styleMap) {
                            btn.style[i] = styleMap[i];
                        }
                        btn.href =
                            '/myExamAndTestRedirect.do?action=toSeeExamResult&ct=&examId=' +
                            dataJson.result['list'][0].id
                        var toolbox = document.getElementsByClassName("item-title")[0]
                        toolbox.appendChild(btn);
                        alert('请点击试卷标题旁的按钮查看试卷')
                    }, 100)
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('获取失败...');
                }
            });
        } else {
            setTimeout(function () {
                playVideo_1()
            }, 2000)

            setInterval(function () {
                playVideo_2()
            }, 5000)

            setTimeout(function () {
                localStorage.setItem('videoIsDone', false)
                location.reload()
            }, 1000 * 60 * 10)
        }
    }
})();