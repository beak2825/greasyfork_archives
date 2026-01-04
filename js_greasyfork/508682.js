// ==UserScript==
// @name         江西职培在线网课助手
// @namespace    jiangxizhipeizaixian
// @version      1.1
// @description  江西职培在线自动化助手
// @author       Nanako660
// @match        https://jiangxi.zhipeizaixian.com/study/video*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhipeizaixian.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      furina.one
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508682/%E6%B1%9F%E8%A5%BF%E8%81%8C%E5%9F%B9%E5%9C%A8%E7%BA%BF%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/508682/%E6%B1%9F%E8%A5%BF%E8%81%8C%E5%9F%B9%E5%9C%A8%E7%BA%BF%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // #region 全局配置
    // 自动播放视频
    var isAutoPlay = GM_getValue('isAutoPlay', true);
    // 自动下一节
    var isAutoNext = GM_getValue('isAutoNext', true);
    // 自动跳转最新课程
    var isAutoJump = GM_getValue('isAutoJump', true);
    // 自动过人机验证
    var isAutoVerify = GM_getValue('isAutoVerify', false);
    // 自动发送邮件通知
    var isEmailNotice = GM_getValue('isEmailNotice', true);
    // 主循环间隔
    var mainLoopInterval = GM_getValue('mainLoopInterval', 1000);
    // 调试模式
    var isDebug = GM_getValue('isDebug', false);
    // 邮件地址
    var localEmail = GM_getValue('localEmail', null);
    // #endregion

    // #region 常量
    // 人机验证弹窗class
    const POP_WINDOWS_CLASS = '.zhipei-modal-content';
    // 验证码弹窗特征class
    const CODE_CLASS = '.code_box___32BrH';
    // 人脸弹窗特征class
    const FACE_CLASS = '.video_box___2zomT';
    // 标题class
    const TITLE_CLASS = '.header_box_title___1INxv';
    // 视频控件class
    const VIDEO_ID = 'J_prismPlayer';
    // 目录class
    const CONTENTS_CLASS = '.content_box___1fOQp';
    // 目录子项class
    const CONTENTS_ITEM_CLASS = '.content_box_wrap___ZdoU3';
    // 目录子项标题class
    const CONTENTS_ITEM_TITLE_CLASS = '.units_title___1Js-7';
    // 目录子项时长class
    const CONTENTS_ITEM_DURATION_CLASS = '.time_box___1PlPI';
    // 目录子项链接class
    const CONTENTS_ITEM_LINK_CLASS = 'a.units_wrap_box___1ncip';
    // 目录子项完成状态class
    const CONTENTS_ITEM_STATUS_CLASS = '.anticon-check-circle';
    // 课程下一节按钮class
    const NEXT_BUTTON_CLASS = '.next_button___YGZWZ';
    // 邮箱发送API
    const EMAIL_API_URL = 'https://furina.one/api/email.php';
    // #endregion

    // #region 标志位
    var isPopWindows = false;

    const FinishType = {
        NOT_FINISH: 0,
        FINISHED: 1,
        UPPER_LIMIT: 2
    };
    var finishType = FinishType.NOT_FINISH;

    // 验证类型
    const VerifyType = {
        NONE: 0,
        CODE: 1,
        FACE: 2
    };
    var verifyType = VerifyType.NONE;
    // #endregion

    // #region 全局变量
    // 主循环
    var MainLoop;

    // 获取视频控件
    var checkVideoInterval;

    // 全局悬浮窗
    var shadowWindows;

    var updateDebugInfoInterval;
    // #endregion

    /**
    * 打印调试信息
    * @param {string} message - 要打印的消息
    */
    function print(message) {
        if (isDebug) {
            console.log(message);
        }
    }

    // 等待视频加载完成
    checkVideoInterval = setInterval(function () {
        if (getVideo()) {
            Main();
            clearInterval(checkVideoInterval);
        }
    }, 1000);

    function Main() {
        print("职培在线网课助手脚本开始运行...");

        if (isAutoJump) {
            autoJumpToLatestCourse();
        }

        // 创建信息悬浮窗
        createFloatingWindow();

        // 主循环
        mainLoop();
    }

    function mainLoop() {
        MainLoop = setInterval(function () {

            if (finishType === FinishType.FINISHED || finishType === FinishType.UPPER_LIMIT) {
                alert("当前课程已完成或者每日学习时长已达8小时上限，脚本停止执行...");
                clearInterval(MainLoop);
                return;
            }

            // 更新调试信息
            if (isDebug) {
                updateDebugInfo();
            }

            // 检测弹窗
            let popWindows = getPopWindows();
            if (isPopWindows) {
                print("等待人机验证...");
                if (!popWindows) {
                    isPopWindows = false;
                    print("人机验证完成，继续播放视频...");
                    window.location.reload();
                }
                return;
            }
            if (popWindows) {
                isPopWindows = true;
                checkPopWindowsType(popWindows);

                // 截取弹窗并发送邮件
                if (isEmailNotice) {
                    setTimeout(() => {
                        sendNoticeEmail(POP_WINDOWS_CLASS);
                    }, 3000);
                }
            }

            // 视频播放完毕，自动播放下一节
            if (isAutoNext) {
                let video = getVideo();
                if (video.currentTime >= video.duration) {
                    getNextButtonAndClick();
                    return;
                }
            }

            // 自动播放视频
            if (isAutoPlay && !isPopWindows) {
                let video = getVideo();
                if (video.paused) {
                    print("视频暂停，尝试继续播放...");
                    video.volume = 0;
                    video.play();
                }
            }
        }, mainLoopInterval);
    }

    function getPopWindows() {
        var popWindows = document.querySelector(POP_WINDOWS_CLASS)
        if (popWindows) {
            return popWindows;
        }
        return null;
    }

    function checkPopWindowsType(popWindows) {
        let code = popWindows.querySelector(CODE_CLASS);
        let face = popWindows.querySelector(FACE_CLASS);
        if (code) {
            verifyType = VerifyType.CODE;
            print("获取到人机验证弹窗，类型为验证码验证...");
            print(code.querySelector('img').src);
        } else if (face) {
            verifyType = VerifyType.FACE;
            print("获取到人机验证弹窗，类型为人脸验证...");
        } else {
            finishType = FinishType.UPPER_LIMIT;
            print("今日学习时长已达8小时上限...");
        }
    }

    function sendNoticeEmail(item = null) {
        let title;
        if (verifyType === VerifyType.CODE) {
            title = "验证码验证";
        } else if (verifyType === VerifyType.FACE) {
            title = "人脸验证";
        } else {
            print("无弹窗，不发送邮件通知。");
            return;
        }
        captureScreenshot(item).then(dataURL => {
            let subject = `江西职培在线网课助手${title}弹窗通知`;
            let lvideo = getVideo();

            let message = `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <h2 style="color: #4CAF50; border-bottom: 2px solid #4CAF50; padding-bottom: 5px;">
                    江西职培在线网课助手 - ${title}弹窗通知
                </h2>

                <p>课程信息：</p>

                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; width: 30%;">
                            <strong>课程标题：</strong>
                        </td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${getTitle()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;">
                            <strong>视频时长：</strong>
                        </td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${lvideo.duration.toFixed(0)} 秒</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;">
                            <strong>已看时长：</strong>
                        </td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${lvideo.currentTime.toFixed(0)} 秒</td>
                    </tr>
                </table>

                <p style="margin-top: 20px;">${title}弹窗截图：</p>
                <div style="text-align: center; margin: 20px 0;">
                    <img src="${dataURL}" alt="人${title}弹窗截图" style="max-width: 100%; border: 1px solid #ddd; padding: 5px; background-color: #f9f9f9;" />
                </div>

                <p>请尽快处理${title}弹窗，以免影响课程进度！</p>
                <p style="color: #777; font-size: 12px;">
                    此邮件由江西职培在线网课助手自动发送，如有反馈可直接回复邮件，请勿泄露个人信息。
                </p>
            </div>
            `;
            //print(dataURL);
            sendEmail(localEmail, subject, message);
        });
    }

    function getNextButtonAndClick() {
        var nextButton = document.querySelector(NEXT_BUTTON_CLASS);
        if (nextButton) {
            print("当前视频播放完毕，尝试自动播放下一节...");
            nextButton.click();
        }
    }

    function autoJumpToLatestCourse() {
        var checkCourse = setInterval(() => {
            print("检测当前课程是否完成...");
            var contents = getContents();
            if (contents) {
                checkCurrentCourceIsCompleted(getContentsData(contents), true);
                clearInterval(checkCourse);
            }
        }, 1000);
    }

    function getTitle() {
        var title = document.querySelector(TITLE_CLASS);
        if (title) {
            return title.innerText;
        }
        return null;
    }

    /**
    * 获取页面中的视频元素
    * @returns {HTMLVideoElement|null} 返回视频元素，如果未找到视频元素，则返回 null。
    */
    function getVideo() {
        const videoContainer = document.getElementById(VIDEO_ID);
        if (!videoContainer) return null;

        const video = videoContainer.querySelector('video');
        return video || null;
    }

    function createFloatingWindow() {
        var floatingWindow = document.createElement('div');
        shadowWindows = floatingWindow.attachShadow({ mode: 'open' });

        // 添加样式
        var style = document.createElement('style');
        style.textContent = `
        #contentContainer {
            max-height: 50vh;
            overflow-y: auto;
            #padding: 10px;
            #border: 1px solid #ccc;
        }
        #debugWindow {
            position: fixed;
            top: 80px;
            right: 10px;
            background-color: #f0f0f0;
            color: #333;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            #cursor: move;
            width: 320px;
            font-family: Arial, sans-serif;
            user-select: none;
        }
        h4 {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: bold;
            color: #444;
        }
        h3 {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: bold;
            color: #444;
        }
        p {
            margin: 8px 0;
            font-size: 14px;
            line-height: 1.5;
        }
        .func {
            margin: 8px 0;
            font-size: 15px;
            font-weight: bold;
            line-height: 1.2;
            color: #66ccff;
        }
        .highlight {
            margin: 8px 0;
            font-size: 16px;
            font-weight: bold;
            line-height: 1.5;
            color: red;
        }
        input[type="email"] {
            width: calc(100% - 100px);
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        button {
            margin-top: 10px;
            margin-bottom: 10px;
            padding: 5px 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        }
        button:hover {
            background-color: #0056b3;
        }
        label {
            display: flex;
            align-items: center;
            #margin-bottom: 10px;
            font-size: 14px;
        }
        label input[type="checkbox"] {
            margin-right: 10px;
        }
        #debugContent {
            display: none;  /* 默认隐藏调试信息内容 */
        }
        `;
        shadowWindows.appendChild(style);

        // 添加内容
        var content = document.createElement('div');
        content.id = 'debugWindow';
        content.innerHTML = `
        <div id="contentContainer">
            <h3 id='title'>职培在线网课助手</h4>
            <h4>功能列表：</h3>
            <label>
                <p class="func">🔇 静音后台自动播放</p>
                <input type="checkbox" id="autoPlay" /> 
            </label>
            <label>
                <p class="func">⏭️ 自动播放下一节</p>
                <input type="checkbox" id="autoNext" /> 
            </label>
            <label>
                <p class="func">🛫 自动跳转最新节</p>
                <input type="checkbox" id="autoJump" /> 
            </label>
            <label">
                <p class="func">
                    <del>🤖 自动过人机验证</del>
                    <input type="checkbox" id="autoVerify" disabled /> 
                </p>
            </label>
            <label>
                <p class="func">📧 邮件提醒人机验证</p>
                <input type="checkbox" id="emailNotice" /> 
            </label>
            <h4>使用说明：</h4>
            <p class="highlight">填写邮箱用于接收人机验证通知邮件</p1>
            <p class="highlight">推荐使用QQ邮箱，手机下载QQ邮箱App设置通知优先级为高，以免错过通知</p>
            <p class="highlight"></p>
            <h4>配置信息：</h4>
            <p>邮箱地址：</p>
            <div></div>
            <input type="email" id="emailInput" placeholder="输入邮箱地址" />
            <div></div>
            <button id="saveEmail">保存邮箱</button>
            <div></div>
            <label>
                DebugMode <input type="checkbox" id="debugMode" /> 
            </label>
            <div id="debugContent">
                <h4>调试信息</h4>
                <div id="debugInfo">初始化调试信息...</div>
                <h4>调试按钮</h4>
                <p class="highlight">调试用，没事别乱点</p>
                <button id="backMyClass">返回我的班级</button>
                <div></div>
                <button id="testButton1">测试按钮1</button>
            </div>
        </div>
        `;
        shadowWindows.appendChild(content);

        // 将浮动窗口添加到文档中
        document.body.appendChild(floatingWindow);

        // 获取页面元素
        let autoPlay = shadowWindows.querySelector('#autoPlay');
        let autoNext = shadowWindows.querySelector('#autoNext');
        let autoJump = shadowWindows.querySelector('#autoJump');
        let autoVerify = shadowWindows.querySelector('#autoVerify');
        let emailNotice = shadowWindows.querySelector('#emailNotice');
        let emailInput = shadowWindows.querySelector('#emailInput');
        let saveEmailButton = shadowWindows.querySelector('#saveEmail');
        let debugMode = shadowWindows.querySelector('#debugMode');
        let debugContent = shadowWindows.querySelector('#debugContent');
        let backMyClassButton = shadowWindows.querySelector('#backMyClass');
        let testButton1 = shadowWindows.querySelector('#testButton1');

        // 初始化状态
        autoPlay.checked = isAutoPlay;
        autoNext.checked = isAutoNext;
        autoJump.checked = isAutoJump;
        autoVerify.checked = isAutoVerify;  // 自动过人机验证功能暂时关闭
        emailNotice.checked = isEmailNotice;

        shadowWindows.querySelector('#debugMode').checked = isDebug;
        let savedEmail = localEmail;
        emailInput.value = savedEmail;
        debugContent.style.display = isDebug ? 'block' : 'none';

        // 监听复选框状态变化
        autoPlay.addEventListener('change', function () {
            isAutoPlay = this.checked;
            GM_setValue('isAutoPlay', isAutoPlay);
        });

        autoNext.addEventListener('change', function () {
            isAutoNext = this.checked;
            GM_setValue('isAutoNext', isAutoNext);
        });

        autoJump.addEventListener('change', function () {
            isAutoJump = this.checked;
            GM_setValue('isAutoJump', isAutoJump);
            if (this.checked) {
                autoJumpToLatestCourse();
            }
        });

        autoVerify.addEventListener('change', function () {
            isAutoVerify = this.checked;
            GM_setValue('isAutoVerify', isAutoVerify);
        });

        emailNotice.addEventListener('change', function () {
            isEmailNotice = this.checked;
            GM_setValue('isEmailNotice', isEmailNotice);
        });

        debugMode.addEventListener('change', function () {
            isDebug = this.checked;
            GM_setValue('isDebug', isDebug);
            shadowWindows.querySelector('#debugContent').style.display = isDebug ? 'block' : 'none';
        });

        saveEmailButton.addEventListener('click', function () {
            var email = emailInput.value.trim();
            if (email) {
                GM_setValue('localEmail', email);
                alert('邮箱地址已保存!');
            } else {
                alert('请输入有效的邮箱地址!');
            }
        });

        backMyClassButton.addEventListener('click', function () {
            window.location.href = 'https://admin-jiangxi.zhipeizaixian.com/train-center/mine/student/subPages/student/class';
        });

        testButton1.addEventListener('click', function () {
            //checkCurrentCourceIsCompleted(true);
            sendNoticeEmail();
        });
    }

    function makeDraggable(element) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // 计算新的位置
            var newTop = element.offsetTop - pos2;
            var newLeft = element.offsetLeft - pos1;

            // 限制拖动范围，避免拖出屏幕
            var minLeft = 0;
            var minTop = 0;
            var maxLeft = window.innerWidth - element.offsetWidth;
            var maxTop = window.innerHeight - element.offsetHeight;

            // 限制 left 和 top 的最小最大值
            newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
            newTop = Math.max(minTop, Math.min(newTop, maxTop));

            // 设置窗口的新位置，并保持固定宽度
            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
            element.style.width = '300px';  // 强制宽度固定，避免拖动时缩小
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function updateDebugInfo() {
        var video = getVideo();
        if (video) {
            var debugInfo = shadowWindows.getElementById('debugInfo');
            var info = `
                <strong>视频标题:</strong> ${getTitle()} <br>
                <strong>视频时长:</strong> ${video.duration.toFixed(0)} 秒 <br>
                <strong>播放时间:</strong> ${video.currentTime.toFixed(0)} 秒 <br>
                <strong>播放倍速:</strong> ${video.playbackRate}x <br>
                <strong>播放状态:</strong> ${video.paused ? '暂停' : '播放中'} <br>
                <strong>音量:</strong> ${Math.round(video.volume * 100)} % <br>
            `;
            debugInfo.innerHTML = info;
        }
    }

    function getContents() {
        var contents = document.querySelector(CONTENTS_CLASS);
        return contents;
    }

    function getContentsData(contents) {
        var result = {};

        if (contents) {
            print("成功获取目录父级元素");

            // 获取所有子元素
            var childElements = contents.querySelectorAll(CONTENTS_ITEM_CLASS);
            if (childElements.length > 0) {
                print('开始解析目录子集元素...');
                var parsedData = []; // 存储解析后的数据

                childElements.forEach(function (childElement, index) {
                    // 解析每个子元素的信息
                    var title = childElement.querySelector(CONTENTS_ITEM_TITLE_CLASS)?.textContent || '未找到标题';
                    var time = childElement.querySelector(CONTENTS_ITEM_DURATION_CLASS)?.textContent || '未找到时长';
                    var link = childElement.querySelector(CONTENTS_ITEM_LINK_CLASS)?.href || '未找到链接';
                    var completed = childElement.querySelector(CONTENTS_ITEM_STATUS_CLASS) ? '已完成' : '未完成';

                    // 将解析的信息存储在对象中
                    var item = {
                        index: index + 1,
                        title: title,
                        time: time,
                        link: link,
                        completed: completed
                    };

                    // 将对象添加到数组中
                    parsedData.push(item);
                });

                // 将解析后的数据存储在结果对象中
                result.data = parsedData;
            } else {
                print("未找到目录子元素");
                result.data = [];
            }
        } else {
            print("未找到目录父级元素");
            result.data = [];
        }

        return result.data;
    }

    // 查找第一个未完成的课程
    function findFirstIncompleteCourse(contents) {
        for (let element of contents) {
            if (element.completed === '未完成') {
                return element;  // 返回第一个未完成的课程对象
            }
        }
        return null;  // 如果没有未完成的课程，返回 null
    }

    /**
    * 检查当前课程是否已完成
    * @param {Array} contents - 课程目录数组
    * @param {boolean} autoNext - 如果为 true，且课程已完成，则自动跳转到下一个未完成的课程
    * @returns {boolean} - 返回当前课程是否已完成
    */
    function checkCurrentCourceIsCompleted(contents, autoNext = false) {
        // 获取当前页面的标题
        let currentTitle = getTitle();

        // 查找与当前标题匹配的课程
        let currentCourse = contents.find(element => element.title === currentTitle);

        if (currentCourse) {
            print(`检查当前课程是否已完成：${currentCourse.title}：${currentCourse.completed}`);
            if (currentCourse.completed === '已完成' && autoNext) {
                let nextCourse = findFirstIncompleteCourse(contents);
                if (nextCourse) {
                    print(`跳转到未完成的课程：${nextCourse.title}`);
                    window.location.href = nextCourse.link;  // 跳转到第一个未完成课程的链接
                }
                else {
                    print("所有课程已完成！");
                    finishType = FinishType.FINISHED;
                }
            }
            return currentCourse.completed === '已完成';
        }

        return false;  // 如果未找到当前课程，返回 false
    }

    /**
     * 发送邮件
     * @param {string} recipient - 收件人邮箱地址
     * @param {string} subject - 邮件主题
     * @param {string} message - 邮件内容
     * @param {string} image - 图片路径、URL或base64编码，可选
     */
    function sendEmail(recipient, subject, message, image = null) {
        // 检查收件人邮箱地址是否为空
        if (!recipient) {
            print("邮件通知发送失败，邮箱地址不正确！");
            alert("邮件通知发送失败，邮箱地址不正确！");
            return;
        }

        // 如果图片存在
        if (image) {
            // 检查是否是base64编码
            if (image.startsWith('data:image/')) {
                // 图片是base64编码
                message += `<br><img src="${image}" alt="邮件图片" />`;
            } else if (image.startsWith('http://') || image.startsWith('https://')) {
                // 图片是URL
                message += `<br><img src="${image}" alt="邮件图片" />`;
            } else {
                print("图片路径无效！");
                return;
            }
        }

        // 邮件发送数据
        const emailData = {
            recipient: recipient,
            subject: subject || "默认主题", // 如果没有提供主题，使用默认主题
            message: message || "默认内容" // 如果没有提供内容，使用默认内容
        };

        // 将emailData转换为JSON字符串
        const jsonData = JSON.stringify(emailData);

        // 调用PHP接口的URL
        const apiUrl = EMAIL_API_URL;

        // 使用GM_xmlhttpRequest发送POST请求
        GM_xmlhttpRequest({
            method: "POST",
            url: apiUrl,
            data: jsonData,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                if (response.status === 200) {
                    // 处理成功响应
                    print("邮件发送成功: " + response.responseText);
                } else {
                    // 处理失败响应
                    print("邮件通知发送失败: " + response.status + " - " + response.responseText);
                    alert("邮件通知发送失败: " + response.status + " - " + response.responseText);
                }
            },
            onerror: function (error) {
                // 处理错误
                print("邮件通知发送失败，请求错误: " + error);
                alert("邮件通知发送失败，请求错误: " + error);
            }
        });
    }

    /**
     * 截取网页内容并返回base64编码的图片
     * @param {string} [selector] - 要截取的元素选择器，若为空则截取整个网页
     * @returns {Promise<string>} - 返回base64编码的图片数据URL
     */
    function captureScreenshot(selector = null) {
        return new Promise((resolve, reject) => {
            let element = document.body; // 默认截取整个网页

            // 如果提供了选择器，尝试查找元素
            if (selector) {
                element = document.querySelector(selector);
                if (!element) {
                    print("指定的元素未找到！");
                    reject("指定的元素未找到！");
                    return;
                }
            }

            // 使用 html2canvas 捕获截图
            html2canvas(element).then(canvas => {
                // 将 canvas 转换为 base64 编码的图像
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            }).catch(error => {
                print("截图失败: " + error);
                reject(error);
            });
        });
    }

})();