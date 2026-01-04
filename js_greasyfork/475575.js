// ==UserScript==
// @name         H3C大讲堂鼠标移除暂停
// @namespace    移除鼠标定位检测，并添加15倍速
// @version      0.51.12
// @license    GPL-3.0-only
// @description  移除鼠标定位检测，并添加16倍速，增加倍速选择，扩大范围
// @author       Hiro88
// @note    2025.01.12-V0.51.12 更改匹配逻辑，强制可选快进、静音，增加自动2倍速、静音
// @note    2025.01.02-V0.30.02 参考@Zxy3953大佬代码，更改倍速选择框，提示人性化
// @note    2023.11.28-V0.20.13 增加类PPT视频鼠标移出暂停的hook，优化提示信息
// @note    2023.09.28-V0.20.9 增加课程多开功能
// @note    2023.09.20-V0.20.8 增加倍速选择功能，返回默认1倍速
// @match        https://learning.h3c.com/volbeacon/*
// @icon         https://resource.h3c.com/cn/tres/NewWebUI/images/favicon.ico
// @grant        Hiro
// @downloadURL https://update.greasyfork.org/scripts/475575/H3C%E5%A4%A7%E8%AE%B2%E5%A0%82%E9%BC%A0%E6%A0%87%E7%A7%BB%E9%99%A4%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/475575/H3C%E5%A4%A7%E8%AE%B2%E5%A0%82%E9%BC%A0%E6%A0%87%E7%A7%BB%E9%99%A4%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function donefanhui() {
        layer.open({
            type: 1,
            title: '请注意',
            area: ['350px', '240px'],
            resize: false,
            scrollbar: false,
            closeBtn: 1,
            content: '<div style="font-size: 14px;padding: 10px 20px;">要小心，不要太张扬，点击确定将秒过，如果不想秒过就关闭</div><div style="font-size: 14px;padding: 10px 20px;">确定之后可能会提示未看完，点击稍后再来即可</div><div style="font-size: 14px;padding: 10px 20px;">如果没有秒过，重新进入也将剩下很少一点时间</div>',
            btn: ['确定'],
            yes: function (index, layero) {
                $('#videoLength').val(needTime + videoWatchInitLength);
                layer.close(index);
                console.log($('#videoLength').val())
                setTimeout(function () {
                    backMarketSpecialtopicHome();
                }, 2000);
            }
        });
    };

    function stopPlayerre(func) {
        stopPlayer = func;
    }
    function setupVideo() {
        const video = document.querySelector('video');
        if (video) {
            video.muted = true;
            video.playbackRate = 2; // 默认设置为2倍速
            video.play().catch(e => console.error("自动播放失败: ", e));
            setupSpeedControls(video);
        } else {
            setTimeout(setupVideo, 1500);
        }
    }

    function setupSpeedControls(video) {
        const speeds = [1, 2, 4, 8, 16]; // 定义要切换的速率
        const mainButton = document.createElement('button');
        mainButton.textContent = '速度控制';
        mainButton.style.cssText = `
      position: fixed;
      right: 50px;
      top: 24px;
      width: 120px;
      height: 34px;
      border: none;
      border-radius: 4px;
      background: #ff4b4b;
      color: #fafafa;
      z-index: 9999;
    `;
        mainButton.addEventListener('click', () => {
            speedButtonsContainer.style.display = speedButtonsContainer.style.display === 'none' ? 'block' : 'none';
        });

        const speedButtonsContainer = document.createElement('div');
        speedButtonsContainer.style.cssText = `
      position: fixed;
      right: 50px;
      top: 66px;
      z-index: 9999;
      display: none;
      background: #fff;
      border-radius: 4px;
      padding: 16px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    `;

        speedButtonsContainer.addEventListener('mouseleave', () => {
            speedButtonsContainer.style.display = 'none';
        });

        speeds.forEach(speed => {
            const button = document.createElement('button');
            button.textContent = `${speed}x`;
            button.style.cssText = `
        width: 66px;
        height: 30px;
        border: none;
        margin: 6px;
        border-radius: 2px;
        background: #ff4b4b;
        color: #fafafa;
      `;
            button.addEventListener('mouseenter', (event) => {
                event.stopPropagation();
            });
            button.addEventListener('click', () => {
                video.playbackRate = speed;
                showNotification(`已切换到${speed}倍速`);
            });
            speedButtonsContainer.appendChild(button);
        });

        document.body.appendChild(mainButton);
        document.body.appendChild(speedButtonsContainer);
    }

    function showNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 24px;
      font-weight: bold;
      padding: 20px;
      background-color: rgba(0, 0, 0, 0.8);
      color: #fff;
      border-radius: 10px;
      z-index: 9999;
    `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, duration);
    }
    function studyre(func) {
        study = func;
    }
    function stopIntervalre(func) {
        stopInterval = func;
    }
    setTimeout(function () {
        if (typeof stopInterval == 'function') {
            layer.msg("禁止暂停生效", {
                icon: 1
            });
            stopIntervalre(function () {
            });
        }
        if (typeof stopPlayer == 'function') {
            layer.msg("禁止暂停生效", {
                icon: 1
            });
            stopPlayerre(function () {
                if (vPlayer && !vPlayer.ended() && !vPlayer.paused()) {
                    if (!isClearInterval) { }
                }
            });
            var oBtn = document.createElement("input");
            oBtn.id = "mgbtn";
            oBtn.type = "button";
            oBtn.value = "秒过按钮，谨慎谨慎"
            oBtn.style.position = "absolute";
            document.body.appendChild(oBtn);
            $("#mgbtn").click(function () {
                donefanhui()
            })
            setupVideo();
        }
        if (typeof study == 'function') {
            layer.msg("现在可以打开多个窗口了", {
                icon: 1
            });
            studyre(function (vProjectId, vTrainId, vTrainTaskId) {
                var sourceFlag = $('#sourceFlag').val();
                ajaxSubmit({
                    url: _basePath + "study/course/checkCourseLockFlag.do",
                    params: {
                        trainTaskId: vTrainTaskId
                    },
                    onSuccess: function (data, textStatus) {
                        window.open("/volbeacon/study/course/studyCourse.do?projectId=" + vProjectId + "&trainId=" + vTrainId + "&trainTaskId=" + vTrainTaskId + "&sourceFlag=" + sourceFlag);
                    },
                    onError: function (req) {
                        layer.msg("课程正在编辑中，无法学习！", {
                            icon: 2
                        });
                    }
                });
            })

        }
    }, 1000);

})();