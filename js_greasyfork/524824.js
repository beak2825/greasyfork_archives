// ==UserScript==
// @name         智能刷课助手
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  使用须知：目前版本只适用于超星学习通，支持自动播放视频、倍数播放和自动跳章；脚本暂不支持章节测试，不支持窗口页面最小化运行；⚠️⚠️在运行脚本时务必将笔记本电脑的睡眠模式关闭，防止电脑息屏。
// @author       天天
// @match        https://mooc1.chaoxing.com/mycourse/studentstudy*
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/524824/%E6%99%BA%E8%83%BD%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/524824/%E6%99%BA%E8%83%BD%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否已存在控制窗口
    if (document.querySelector('.course-helper')) {
        return;
    }

    // 创建样式
   const style = document.createElement('style');
style.textContent = `
    .course-helper {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        min-height: 220px;
        background: #1e1e1e; /* 深灰色背景 */
        border: 1px solid #444;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 9999;
        resize: both;
        overflow: auto;
        font-family: 'Roboto', sans-serif; /* 现代字体 */
        color: #f0f0f0; /* 浅色文字 */
    }

    .helper-header {
        padding: 15px;
        background: #2b2b2b; /* 深色头部 */
        border-bottom: 1px solid #444;
        cursor: move;
        border-radius: 10px 10px 0 0;
        user-select: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .helper-content {
        padding: 20px; /* 增加内边距 */
    }

    .control-group {
        margin-bottom: 20px; /* 增加底部间距 */
    }

    .control-label {
        display: block;
        margin-bottom: 10px;
        font-weight: bold;
        color: #e0e0e0;
    }

    .control-input {
        width: 100%;
        padding: 10px; /* 增加内边距 */
        margin-bottom: 12px;
        border: 1px solid #555;
        border-radius: 5px;
        background: #2b2b2b; /* 深色输入框 */
        color: #f0f0f0;
    }

    .btn {
        padding: 10px 20px; /* 增加按钮内边距 */
        background-color: #4CAF50; /* 绿色按钮 */
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 10px; /* 增加右边距 */
        transition: background-color 0.3s ease;
    }

    .btn:hover {
        background-color: #45a049; /* 深绿色 */
    }

    .btn-danger {
        background-color: #dc3545; /* 红色按钮 */
    }

    .btn-danger:hover {
        background-color: #c82333; /* 深红色 */
    }

    .log-area {
        width: 100%;
        height: 120px;
        border: 1px solid #555;
        border-radius: 5px;
        padding: 10px;
        font-size: 12px;
        font-family: 'Consolas', monospace;
        resize: vertical;
        background: #1a1a1a; /* 深色日志区域 */
        color: #ffffff;
        overflow-y: auto;
    }

    .progress-bar {
        width: 100%;
        height: 20px;
        background-color: #2b2b2b; /* 深灰色进度条 */
        border-radius: 5px;
        margin-bottom: 10px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background-color: #4CAF50; /* 绿色进度 */
        width: 0%;
        transition: width 0.3s ease;
    }

    .status-text {
        font-size: 12px;
        color: #e0e0e0;
        margin-bottom: 10px;
    }

    del {
            position: relative;
            color: #666;
            font-style: italic;
            font-weight: bold;
        }

    del::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: 50%;
            border-bottom: 2px solid #ff4444;
        }

    .support-text {
        color: #fff;
        font-weight: normal;
        font-style: normal;
    }

    .content {
            padding: 20px;
            background-color: #1e1e1e;;
        }

    .content img:hover {
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);

    // 创建助手窗口
    const helperWindow = document.createElement('div');
    helperWindow.className = 'course-helper';
    helperWindow.innerHTML = `
        <div class="helper-header">
            <span>✨刷课助手</span>
        </div>
        <div class="helper-content">
            <div class="control-group">
                <label class="control-label">播放控制</label>
                <button class="btn" id="autoPlayBtn">开始播放</button>

            </div>
            <div class="collapse-container">
               <details>
            <summary><span class="support-text">您的支持是我</span><del>躺平</del><span class="support-text">前进的动力!!🥳</span></summary>
                   <div class="content">
                     <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBYRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAACPaADAAQAAAABAAACNwAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgCNwI9AwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAgICAgICAwICAwUDAwMFBgUFBQUGCAYGBgYGCAoICAgICAgKCgoKCgoKCgwMDAwMDA4ODg4ODw8PDw8PDw8PD//bAEMBAgICBAQEBwQEBxALCQsQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEP/dAAQAJP/aAAwDAQACEQMRAD8A/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/0P38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9H9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiql7eW2n2k9/fSrBbWyNJJIxwqIgyWJ9ABzX5y+G/+CqP7LHif4nQ/DWzvtQgF3dCyt9UltttjLMz7FwwYuEY8KxUA9aAP0lopAc/SloAKKKKACivzj+JP/BUT9mH4ZfFC6+GGr3eoXlxptx9kvr21tvMtLaZTh1LFgz7DwxVTgg4zX6DaNrWm+ItHsdf0S4S70/UYY7i3mQ5WSKVQyMD6EEGgDWooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9L9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoopufWgB1FFFABWVrWsWPh/R77XdVk8my02CS4nfrtjiUu5/ADNatcr418PR+LfB2u+FpCVTWLG5tCRwR58bR5/WgD8dfC3/AAWf8Aa38Urfwxq3gu40zwneXYtk1VrpXljV32rNJDtACdCQGJAr9ropkniSeFg8cgDKw6EHkEfUGv4LPFWgX/hLxRq3hjUVaK80a7ntJQRgiS3kMZ/Va/sy/Yq+Jb/Fn9l74e+Mbmbz7x9Nitbps5P2i0zBJk+uUz+NAH1PRRRQBzPi/wAO23jDwnrPhS7kaGDWbK4sndfvItxGYyR7gHNfzneCv+CPPx4034u6d/butaXH4Q0/UEmbUIp2a4ltopNwCwbcrIwGME4BPXFf0rYFGB+dACIiooVeigAfQU6iigArN1W7Nlpd5eqRm3hkkGenyKW59uK0qxvEGj2/iDQdR0G5YrFqNtNbOQSCFlQoSCOeAaAP4PfFOoTav4n1fVLk5lvLy4mfnPzSSMxOfqa/tP8A2RrC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viVF8UNK8LS/2jb3X2yC2kunexhnDb1ZIDxhW5VSSo444GPvOjFFABRRRQByXjrWNU0DwTr+u6Jb/a9R07T7q4t4cZ8yaKJmRcd8sAMd6/kh+Hf7b37WbfHPSPEjeN9V1C81DVoI5tMkkZrSVZpgrW4tj8irg7VAAI6jnmv7CiAeteH6X+zP8ANF8ct8StK8A6Ra+J2kab7elqgmErnLOOwYk8kAGgD21GZkVmG1iASPSpKKKACiiigD+RL9ov8AbR/api/aL8VXkXjTVfDzaDq9zb2mn28rQ29vFbylI0MP3WDKoLbgd2eeMV/U58FvFGv+NPhF4M8XeK4Ps2sazpNnd3cYXZtnmhVn+XtkkkDt0rA8T/s1fALxp4xj+IHivwFpGq+IomRxez2yvKWjxtZj0YjAwWBr21I440WNFCqoAAHAAHQAUAPooooAMV8K/EP/AIJy/sqfE/4j3HxQ8U+GZjq1/OLm7jt7qSG1uZs5LyRDjLH720jPevuqkwPSgCnp2m2GkafbaVpkCW1nZxrDDFGNqJGgCqqjsABgVdoooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/9D9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//R/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/0v38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9k=" width=120px high=120px>
                   </div>
                </details>
            </div>
            <div class="control-group">
                <label class="control-label">播放速度</label>
                <select class="control-input" id="playbackRate">
                    <option value="1">1.0x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2.0x</option>
                </select>
            </div>
            <div class="control-group">
                <label class="control-label">播放进度</label>
                <div class="status-text" id="statusText">等待开始...</div>
                <div class="progress-bar">
                    <div class="progress-fill" id="progressBar"></div>
                </div>
            </div>
            <div class="control-group">
                <label class="control-label">💻执行日志</label>
                <div class="log-area" id="logArea"></div>
            </div>
        </div>
    `;

    document.body.appendChild(helperWindow);

    // 状态变量
    let isPlaying = false;
    let currentVideoIndex = 0;
    let totalVideos = 0;

    // 窗口拖拽功能
    let isDragging = false;
    let offsetX, offsetY;

    helperWindow.querySelector('.helper-header').addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - helperWindow.offsetLeft;
        offsetY = e.clientY - helperWindow.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const helperWidth = helperWindow.offsetWidth;
        const helperHeight = helperWindow.offsetHeight;

        newX = Math.max(0, Math.min(newX, windowWidth - helperWidth));
        newY = Math.max(0, Math.min(newY, windowHeight - helperHeight));

        helperWindow.style.left = `${newX}px`;
        helperWindow.style.top = `${newY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // 日志功能
    function log(message) {
        const logArea = document.getElementById('logArea');
        if (!logArea) return;

        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.textContent = `[${timestamp}] ${message}`;
        logArea.appendChild(logEntry);
        logArea.scrollTop = logArea.scrollHeight;
    }

    // 更新状态显示
    function updateStatus(message) {
        const statusText = document.getElementById('statusText');
        if (statusText) {
            statusText.textContent = message;
        }
    }

    // 更新进度条
    function updateProgress(current, total) {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const percentage = (current / total) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }

    // 获取iframe元素
    function getIframes() {
        try {
            const mainFrame = document.getElementById("iframe");
            if (!mainFrame) {
                log("未找到主iframe");
                return [];
            }

            const iframeDoc = mainFrame.contentWindow.document;
            return Array.from(iframeDoc.getElementsByTagName('iframe'));
        } catch (error) {
            log("获取iframe失败: " + error.message);
            return [];
        }
    }

    // 控制单个视频
    function controlVideo(video, playbackRate) {
        return new Promise((resolve) => {
            const handleVideoEnd = () => {
                video.removeEventListener('ended', handleVideoEnd);
                log("视频播放完成");
                resolve();
            };

            video.addEventListener('ended', handleVideoEnd);

            video.muted = true;
            video.playbackRate = playbackRate;
            video.play().catch(error => {
                log("播放失败: " + error.message);
                resolve(); // 即使失败也继续下一个
            });
        });
    }

   // 视频控制主函数
async function controlAllVideos(action, params = {}) {
    const iframes = getIframes();
    const videos = [];

    for (let iframe of iframes) {
        try {
            const iframeVideos = Array.from(iframe.contentWindow.document.getElementsByTagName('video'));
            videos.push(...iframeVideos);
        } catch (error) {
            log(`获取视频失败: ${error.message}`);
        }
    }

    totalVideos = videos.length;
    if (totalVideos === 0) {
        log("未找到可播放的视频");
        // 如果没有视频，直接跳转下一章
        skipChapter();
        return;
    }
    for (let i = 0; i < videos.length && isPlaying; i++) {
        currentVideoIndex = i;
        updateStatus(`正在播放第 ${i + 1}/${totalVideos} 个视频`);
        updateProgress(i + 1, totalVideos);

        try {
            const video = videos[i];
            switch(action) {
                case 'play':
                    await controlVideo(video, params.playbackRate);
                    break;
                case 'setPlaybackRate':
                    video.playbackRate = params.playbackRate;
                    log(`设置播放速度: ${params.playbackRate}x`);
                    break;
            }
        } catch (error) {
            log(`控制视频失败: ${error.message}`);
        }
    }

     if (currentVideoIndex >= totalVideos - 1) {
        log("所有视频播放完成");
        isPlaying = false;
        updateStatus("播放完成");
        document.getElementById('autoPlayBtn').textContent = "开始播放";

        // 增加延时确保视频完全结束
        setTimeout(() => {
            log("准备跳转到下一章节");
            skipChapter();
        }, 3000); // 等待3秒后跳转
    }
}

function skipChapter() {
    try {
        log("尝试跳转到下一章节");

        const nextButton = window.top.document.querySelector("#prevNextFocusNext");
        if (nextButton) {
            nextButton.click();
            log("已点击下一章节按钮");

            // 第一次延时：等待完成提示出现
            setTimeout(() => {
                try {
                    const tip = window.top.document.querySelector(".maskDiv.jobFinishTip.maskFadeOut");
                    if (tip) {
                        const nextChapterBtn = window.top.document.querySelector(".jb_btn.jb_btn_92.fr.fs14.nextChapter");
                        if (nextChapterBtn) {
                            nextChapterBtn.click();
                            log("已确认进入下一章节");

                            // 第二次延时：等待新页面加载
                            setTimeout(() => {
                                log("等待新页面加载完成...");
                                // 第三次延时：确保新页面完全加载
                                setTimeout(() => {
                                    try {
                                        // 重新初始化视频播放
                                        isPlaying = false; // 重置播放状态
                                        currentVideoIndex = 0; // 重置视频索引

                                        const autoPlayBtn = document.getElementById('autoPlayBtn');
                                        if (autoPlayBtn) {
                                            log("触发自动播放");
                                            autoPlayBtn.click();
                                        } else {
                                            log("未找到播放按钮，可能需要刷新页面");
                                        }
                                    } catch (error) {
                                        log(`自动播放失败: ${error.message}`);
                                    }
                                }, 2000);
                            }, 2000);
                        } else {
                            log("未找到确认下一章节按钮");
                        }
                    } else {
                        log("未找到任务点完成提示，直接尝试开始播放");
                        setTimeout(() => {
                            const autoPlayBtn = document.getElementById('autoPlayBtn');
                            if (autoPlayBtn) {
                                isPlaying = false;
                                currentVideoIndex = 0;
                                autoPlayBtn.click();
                                log("直接开始播放新章节");
                            }
                        }, 3000);
                    }
                } catch (error) {
                    log(`处理完成提示时出错: ${error.message}`);
                }
            }, 1500);
        } else {
            log("未找到下一章节按钮");
        }
    } catch (error) {
        log(`跳转章节失败: ${error.message}`);
    }
}



//暂停函数
function pauseVideo(){
        const iframes = getIframes();
        for (let iframe of iframes) {
            try {
                const videos = iframe.contentWindow.document.getElementsByTagName('video');
                for (let video of videos) {
                    video.pause();
                }
            } catch (error) {
                log(`暂停视频失败: ${error.message}`);
            }
        }
        log('已暂停所有视频');
    }

    //更新播放速度的函数
function updatePlaybackRate(rate) {
    try {
        const iframes = getIframes();
        for (let iframe of iframes) {
            try {
                const videos = Array.from(iframe.contentWindow.document.getElementsByTagName('video'));
                videos.forEach(video => {
                    video.playbackRate = rate;
                });
            } catch (error) {
                log(`设置视频速度失败: ${error.message}`);
            }
        }
    } catch (error) {
        log(`更新播放速度失败: ${error.message}`);
    }
}

    // 事件监听
    document.getElementById('autoPlayBtn').addEventListener('click', () => {
        const button = document.getElementById('autoPlayBtn');
        if (!isPlaying) {
            isPlaying = true;
            button.textContent = "停止播放";
            const rate = parseFloat(document.getElementById('playbackRate').value);
            controlAllVideos('play', { playbackRate: rate });
            log('开始自动播放');
        } else {
            isPlaying = false;
            button.textContent = "开始播放";
            log('停止播放');
            pauseVideo();
        }
    });


    document.getElementById('playbackRate').addEventListener('change', () => {
    const rate = parseFloat(document.getElementById('playbackRate').value);
    updatePlaybackRate(rate);
    log(`播放速度已调整为 ${rate}x`);
    });



   // 初始化
    setTimeout(() => {
      try {
          log('刷课助手已加载');
          const iframes = getIframes();
          log(`当前页面任务点数量：${iframes.length}`);
      } catch (error) {
        log(`初始化失败: ${error.message}`);
      }
  }, 1000); // 延迟1秒执行
})();