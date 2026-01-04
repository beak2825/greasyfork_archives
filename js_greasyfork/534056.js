// ==UserScript==
// @name         英华学堂自动刷课
// @version      1.35
// @description  自动下一集，自动输入验证码，仅个人使用，误乱传播需要联系QQ358637454微信smallbolt2多开刷课请以隐私窗口打开
// @author       se
// @match        *://zxshixun*/user/node*
// @match        *://gyxy*/user/node*
// @match        *://mooc*/user/node*
// @match        *://*/user/node*
// @match        *://*/user/login*
// @iconURL    https://img0.baidu.com/it/u=3572742997,2599683231&fm=253&fmt=auto&app=138&f=JPEG?w=501&h=500
// @grant        GM_xmlhttpRequest
// @license     MIT
// @namespace    ss
// @connect      10djlj3701922.vicp.fun
// @connect      10djlj3701922.vicp.fun:27036
// @downloadURL https://update.greasyfork.org/scripts/534056/%E8%8B%B1%E5%8D%8E%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/534056/%E8%8B%B1%E5%8D%8E%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

let current = 0;
let Timer = null;
let yzm = null;
let xuanxian = null;
let video = null;
let version = "专业版"
let Text2 = null;
let savedCellphone = localStorage.getItem("savedCellphone");  // 确保获取到正确的值

function getCurrent() {
    xuanxian = $('a[target="_self"]');
    xuanxian.each((index, item) => {
        if ($(item).hasClass("on")) {
            return current = index;
        }
    });
}

async function playNext() {
    clearInterval(Timer);  // 停止现有的定时器
    Timer = setInterval(playVideo, 1000);  // 启动新的定时器

    if (current === xuanxian.length - 1) {
        addText("已看完！");
    } else {
        addText("播放下个视频");
        await pause(3);
        xuanxian[current + 1].click();
    }
}

async function inputCaptcha() {
    try {
        if (yzm.length && yzm.is(':visible')) {
            addText("验证码出现，准备填写验证码...");
            await pause(2, 5);

            // 调用字典爆破的方式处理验证码
            let captcha = await getCode();

            let inputs = yzm.find("input");
            let input = inputs[0].style.display === 'none' ? inputs[1] : inputs[0];
            $(input).mousedown();
            input.value = captcha;
            await pause(2, 5);

            const playButton = $('.layui-layer-btn0');
            if (playButton.length) {
                playButton.click();
                Timer = setInterval(playVideo, 1000);  // 这里重复了
                addText("自动播放！");
            } else {
                location.reload();
            }
        }
    } finally {
        Timer = setInterval(playVideo, 1000); // 无论成功与否都重启定时器
        addText("验证码处理完成，恢复播放检测");
    }
}

// 定义验证码字典，可以根据实际情况增加字符集
const captchaDictionary = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; // 数字和字母

// 替换原OCR识别方法，改为字典爆破
async function getCode() {
    return new Promise((resolve, reject) => {
        const maxLength = 4;  // 假设验证码长度为4，可以根据实际情况调整
        let captcha = '';  // 初始化为空字符串
        
        // 尝试所有字符组合
        async function tryCaptcha(index) {
            if (index === maxLength) {  // 如果达到验证码的最大长度，停止
                return resolve(captcha);
            }

            // 遍历字典中的所有字符并尝试组合
            for (let char of captchaDictionary) {
                captcha = captcha.slice(0, index) + char + captcha.slice(index + 1);  // 拼接字符
                let input = $('input[name="captcha"]');  // 获取验证码输入框
                if (input.length > 0) {
                    input.val(captcha);  // 填充验证码框
                    
                    // 这里模拟点击提交按钮进行验证
                    const submitButton = $('.layui-layer-btn0');
                    if (submitButton.length) {
                        submitButton.click();
                    }

                    // 暂停并等待处理结果
                    await pause(2, 5);
                    if (document.body.textContent.includes("验证成功")) {
                        resolve(captcha);  // 返回成功的验证码
                        return;
                    }
                }
            }

            // 如果当前组合没有成功，递归调用继续尝试下一个字符
            await tryCaptcha(index + 1);
        }

        tryCaptcha(0);
    });
}

async function playVideo() {
    if (!video) {
        if (xuanxian[current].title && xuanxian[current].title === "考试") {
            addText("课已看完！");
            clearInterval(Timer);
        } else {
            getVideoElement();
            await pause(1);
        }
        return;
    }
    yzm = $('.layui-layer-content');
    if (yzm.length > 0) {
        clearInterval(Timer);
        await inputCaptcha();
        return;
    }
    if (video.paused) {
        video.play();
        if (video.readyState === 4) {
            const message = Text2.text().includes("加载完成") ? "请置于前台运行" : "加载完成，开始播放";
            addText(message);
        }
    } else {
        return;
    }
}

const getVideoElement = () => {
    video = document.querySelector("video");
    video.muted = true;
    video.playbackRate = 1.0;
    video.volume = 0;
    video.onended = async function () {
        await playNext();
    };
}

const addContainer = () => {
    const container = $('<div></div>')
    container.addClass('yans');

    const header = $("<div></div>");
    header.addClass('container-header');
    header.html(`
        <div style="line-height: 1.4;">
            <div>
                <a href='http://10djlj3701922.vicp.fun:27036/static/%E8%8B%B1%E5%8D%8E%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js'
                   target='_blank'
                   style="color: #2196F3; text-decoration: none; border-bottom: 1px dashed #2196F3;">
                    点击更新 ↗
                </a>
            </div>
            <div style="font-size: 0.9em; color: #666; margin-top: 3px;">
                自动下一集看网课免费，高级功能需要5r(微信smallbolt2)
            </div>
        </div>
    `);

    // === 新增：创建Text2日志输出区域 ===
    Text2 = $("<div></div>");
    Text2.css({
        "max-height": "200px",
        "overflow-y": "auto",
        "margin-top": "10px",
        "font-size": "12px",
        "color": "#333",
        "background": "#E0FFFF",
        "padding": "5px",
        "border-radius": "5px"
    });

    container.append(header);
    container.append(Text2);  // 把日志区也加进去
    $("body").append(container);
}

const addStyle = () => {
    const style = $("<style></style>");
    style.prop('type', 'text/css');
    style.html(`
.yans {
    position: fixed;
    top: 111px;
    left: 222px;
    width: 333px;
    z-index: 666666;
    background-color: #CCFFFF;
}
    `);
    $('body').append(style);
}

const addText = text => {
    Text2.append(text + "<br>");
    const lines = Text2.html().split("<br>");
    if (lines.length > 300) {
        Text2.html(lines.slice(-300).join("<br>"));
    }
    Text2.scrollTop(Text2[0].scrollHeight);
}

function pause(start, end = undefined) {
    let lay22 = start;
    if (end) {
        lay22 = Math.floor(Math.random() * (end - start)) + start;
        addText(` ${lay22} 秒后继续`);
    }
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, lay22 * 1000);
    });
}

let refreshTimer = null;

const init = async () => {
    addContainer();
    addStyle();
    getCurrent();

    if (window.location.pathname.includes('/user/node')) {
        const refreshMinutes = 30;
        let userActivityDetected = false;

        const resetRefreshTimer = () => {
            userActivityDetected = true;
            setTimeout(() => { userActivityDetected = false }, 60000); // 1分钟内没有操作则刷新
        };

        setInterval(() => {
            if (!userActivityDetected) {
                addText("即将强制刷新页面...");
                location.reload();
            }
        }, refreshMinutes * 60 * 1000);

    }
}

(function () {
    'use strict';
    $(document).ready(async function () {
        await init();
        Timer = setInterval(playVideo, 1000);
    });
})();



//加速提交学时=======================================================================================================================


(function () {
    'use strict';

    // ====== 1. 劫持原提交逻辑 ======
    const originalSetInterval = unsafeWindow.setInterval;
    unsafeWindow.setInterval = function (callback, interval) {
        if (interval === 10000 || interval === 30000) {  // 识别原提交间隔
            return originalSetInterval(callback, 5000);  // 强制改为1秒
        }
        return originalSetInterval(callback, interval);
    };

    // ====== 2. 模拟鼠标移动 ======
    setInterval(() => {
        const event = new MouseEvent('mousemove', {
            clientX: Math.random() * window.innerWidth,
            clientY: Math.random() * window.innerHeight
        });
        document.dispatchEvent(event);
    }, 500);

    // ====== 3. 动态生成签名参数 ======
    function generateSign() {
        const timestamp = Date.now();
        const nonce = Math.random().toString(36).substr(2, 8);
        // 此处需逆向原签名算法（需根据实际加密逻辑调整）
        const sign = md5(`appId=xxx&nonce=${nonce}&timestamp=${timestamp}`);
        $('#appId').val('your_app_id');  // 从页面源码或Cookie中提取真实值
        $('#nonce').val(nonce);
        $('#timestamp').val(timestamp);
        $('#sign').val(sign);
    }

    // ====== 4. 自动处理验证码弹窗 ======
    const observer = new MutationObserver(mutations => {
        if ($('#video-captcha:visible').length > 0) {
            // 这里可集成第三方OCR API自动识别验证码
            console.log('检测到验证码，需手动处理或调用OCR服务');
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // ====== 5. 伪装播放器心跳 ======
    Object.defineProperty(unsafeWindow, 'totalTime', {
        get: () => Math.floor(Date.now() / 1000),  // 伪造持续增长的学习时间
        set: () => { }
    });

})();