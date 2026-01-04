// ==UserScript==
// @name         南宁理工学院自动刷课
// @version      5.94
// @description  仅个人使用，误乱传播需要联系QQ358637454微信smallbolt2
// @author       li
// @match        *://zxshixun.bwgl.cn/user/node*
// @match        *://gyxy.bwgl.cn/user/node*
// @match        *://mooc.bwgl.cn/user/node*
// @match        *://*/user/node*
// @match        *://*/user/login*
// @iconURL    https://img0.baidu.com/it/u=3572742997,2599683231&fm=253&fmt=auto&app=138&f=JPEG?w=501&h=500
// @grant        GM_xmlhttpRequest
// @license    	 MIT
// @namespace  	 yei
// @connect      10djlj3701922.vicp.fun
// @connect      10djlj3701922.vicp.fun:27036
// @downloadURL https://update.greasyfork.org/scripts/518964/%E5%8D%97%E5%AE%81%E7%90%86%E5%B7%A5%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/518964/%E5%8D%97%E5%AE%81%E7%90%86%E5%B7%A5%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

let current = 0;
let Timer = null;
let yzm = null;
let xuanxian = null;
let video = null;
let version = "专业版"
let Text2 = null;
function getCurrent() {
    xuanxian = $('a[target="_self"]');
    xuanxian.each((index, item) => {
        if ($(item).hasClass("on")) {
            return current = index
        }
    });
}
async function playNext() {
    clearInterval(Timer);
    if (current === xuanxian.length - 1) {
        addText("已看完！")
    } else {
        addText("播放下个视频")
        await pause(3)
        xuanxian[current + 1].click();
    }
}
async function inputCaptcha() {
    try {
    if (yzm.length && yzm.is(':visible')) {
        addText("验证码出现，准备填写验证码...出现undefined是未被授权的意思，需要联系QQ358637454微信smallbolt2");
        await pause(2, 5)
        let imgs = yzm.find("img")
        let img = imgs[0].style.opacity === '0' ? imgs[1] : imgs[0]
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        let code = canvas.toDataURL("image/png").split("base64,")[1];
        let ans = await getCode(code)
        let inputs = yzm.find("input")
        let input = inputs[0].style.display === 'none' ? inputs[1] : inputs[0]
        $(input).mousedown()
        input.value = ans
        await pause(2, 5)
        const playButton = $('.layui-layer-btn0');
        if (playButton.length) {
            playButton.click();
            Timer = setInterval(playVideo, 1000);
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


function getCode(code) {
let name2 = document.querySelector('.user .name').textContent.trim();
localStorage.setItem('name2', name2);
    return new Promise((resolve, reject) => {
        const datas = {
	   savedCellphone: savedCellphone,
            "img_base64": String(code),
        }
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://10djlj3701922.vicp.fun:27036/api/ocr/image",
            data: JSON.stringify(datas),
            headers: {
                "Content-Type": "application/json",
            },
            responseType: "json",
            onload: function (response) {
                if (response.status == 200) {
                    if (response.responseText.indexOf("未授权!!!!!!!!") != -1)
                        addText(response.response["msg"]);
                    try {
                        var result = response.response["result"];
                        addText("识别结果：" + result);
                        return resolve(result);
                    } catch (e) {
                        if (response.responseText.indexOf("!!!") != -1)
                            addText(response.responseText);
                    }
                } else {
                    addText("未授权!");
                }
            }
        });
    });
}
async function playVideo() {
 
    if (!video) {
        if (xuanxian[current].title && xuanxian[current].title === "考试") {
            addText("课已看完！")
            clearInterval(Timer)
        } else {
            getVideoElement();
        }
        return
    }
    yzm = $('.layui-layer-content');
    if (yzm.length > 0) {
        clearInterval(Timer);
        await inputCaptcha()
        return;
    }
    if (video.paused) {
        video.play();
        if (video.readyState === 4) {
            const message = Text2.text().includes("加载完成")  ? "请置于前台运行" : "加载完成，开始播放";
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
    const container = $('<container></container>')
    container.addClass('yans');
    const header = $("<div></div>")
    header.addClass('container-header')
     //header.html("<a href='http://10djlj3701922.vicp.fun:27036/static/%E8%8B%B1%E5%8D%8E%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js'>点击更新</a>")
    // header.text("自动下一集看网课免费 ,高级功能自动输入验证码需要 5r 可以联系微信smallbolt2")
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
    container.append(header)
    header.on("mousedown", function (event) {
        let shiftX = event.clientX - header.offset().left;
        let shiftY = event.clientY - header.offset().top;
        function onMouseMove(event) {
            container.css({
                left: event.pageX - shiftX + 'px',
                top: event.pageY - shiftY + 'px'
            })
        }

        function onMouseUp() {
            $(document).off('mousemove', onMouseMove);
            $(document).off('mouseup', onMouseUp);
        }
        $(document).on('mousemove', onMouseMove);
        $(document).on('mouseup', onMouseUp);
    })
    const hr = $("<hr>")
    container.append(hr)
    Text2 = $("<div></div>")
    Text2.addClass('container-text')
    container.append(Text2)
    addText("<h4>提示1：</h4>可以就打个赏微信smallbolt2")
    //addText("<h4>提示2</h4>：服务器维护需要钱</b>。")
    //addText("<h4>提示3</h4>：可以就打个赏微信smallbolt2<br>")
    //addText("<a href='http://10djlj3701922.vicp.fun:27036/static/%E8%8B%B1%E5%8D%8E%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js'>点击更新</a>")
    addText("请置于前台运行")
    addText("开启成功")
    $("body").append(container)
}


const addStyle = () => {
    const style = $("<style></style>")
    style.prop('type', 'text/css')
    style.html(
        `
.yans {
    position: fixed;
    top: 111px;
    left: 222px;
    width: 333px;
    z-index: 666666;
    background-color: #CCFFFF;
}
        `
    )
    $('body').append(style);
}
const addText = text => {
    Text2.append(text + "<br>")
    Text2.scrollTop(Text2[0].scrollHeight)
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

let refreshTimer = null;  // 新增刷新定时器变量

// ... (保持原有函数不变)

const init = async () => {
    addContainer()
    addStyle()
    getCurrent()
    
    // 新增：30分钟强制刷新逻辑
    if (window.location.pathname.includes('/user/node')) {
        const refreshMinutes = 30;
        addText(`已启用${refreshMinutes}分钟强制刷新功能`);
        refreshTimer = setInterval(() => {
            addText("即将强制刷新页面...");
            location.reload();
        }, refreshMinutes * 60 * 1000);
    }
}


(function () {
    'use strict';
    $(document).ready(async function () {
        await init()
        Timer = setInterval(playVideo, 1000);
    });
})();






(function() {
    //'use strict';    // 严格模式


async function handleCaptcha() {
    // 1. 获取验证码图片（合并选择逻辑）

     const img= document.getElementById('codeImg');

    if (!img) return;

    // 2. 直接使用图片原生尺寸处理
    const canvas = document.createElement('canvas');
    [canvas.width, canvas.height] = [img.naturalWidth, img.naturalHeight];
    canvas.getContext('2d').drawImage(img, 0, 0);

    // 3. 获取base64
    const base64= canvas.toDataURL().split(',')[1]
    const code = await recognizeCaptcha(base64);

    // 4. 填写结果
    document.getElementById('code').value = code;
}



    let savedCellphone = localStorage;
    // OCR识别函数
    async function recognizeCaptcha(base64) {
        return new Promise((resolve) => {
                    const datas = {
	   savedCellphone: savedCellphone,
            "img_base64": String(base64),
        }
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://10djlj3701922.vicp.fun:27036/api/ocr/image",
                data: JSON.stringify(datas),
                headers: {"Content-Type": "application/json"},
                responseType: "json",
                onload:function (res)  {
                    try {

                        if (res.status !== 200) {
                            console.error('状态码：', res.status);
                            return resolve('');
                        }

                         var result = res.response["result"];
                        console.log('识别结果：', result); // 查看原始数据

                        resolve(result);

                    } catch {
                        console.log('原始响应:', res.responseText); // 查看原始数据
                        console.log('解析后的对象:', responseData); // 确认数据结构
                        resolve(''); // 识别失败时返回空

                    }
                }
            });
        });
    }

    // 初始化执行2秒后执行
    setTimeout(() => {
        if (document.getElementById('codeImg')) {
           // handleCaptcha();
        }
    }, 3000);

    // 验证码刷新监控
    let lastSrc = '';
    setInterval(() => {
        const img = document.getElementById('codeImg');
        if (img && img.src !== lastSrc) {      // 检查图片是否更新
            lastSrc = img.src;// 更新图片地址
            handleCaptcha().catch(console.error);    // 重新识别
        }
    }, 500);
})();




//加速提交学时=======================================================================================================================


(function() {
    'use strict';

    // ====== 1. 劫持原提交逻辑 ======
    const originalSetInterval = unsafeWindow.setInterval;
    unsafeWindow.setInterval = function(callback, interval) {
        if (interval === 10000 || interval === 30000) {  // 识别原提交间隔
            return originalSetInterval(callback, 5000);  // 强制改为5秒
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
    // const observer = new MutationObserver(mutations => {
    //     if ($('#video-captcha:visible').length > 0) {
    //         // 这里可集成第三方OCR API自动识别验证码
    //         console.log('检测到验证码，需手动处理或调用OCR服务');
    //     }
    // });
    //observer.observe(document.body, { childList: true, subtree: true });

    // ====== 5. 伪装播放器心跳 ======
    Object.defineProperty(unsafeWindow, 'totalTime', {
        get: () => Math.floor(Date.now() / 1000),  // 伪造持续增长的学习时间
        set: () => {}
    });

})();
//登录验证码识别=======================================================================================================================

// ======== 在这里添加登录页面检测 ========

(function() {
    //'use strict';    // 严格模式


async function handleCaptcha() {
    // 1. 获取验证码图片（合并选择逻辑）

     const img= document.getElementById('codeImg');

    if (!img) return;

    // 2. 直接使用图片原生尺寸处理
    const canvas = document.createElement('canvas');
    [canvas.width, canvas.height] = [img.naturalWidth, img.naturalHeight];
    canvas.getContext('2d').drawImage(img, 0, 0);

    // 3. 获取base64
    const base64= canvas.toDataURL().split(',')[1]
    const code = await recognizeCaptcha(base64);

    // 4. 填写结果
    document.getElementById('code').value = code;
}



    let savedCellphone = localStorage;
    // OCR识别函数
    async function recognizeCaptcha(base64) {
        return new Promise((resolve) => {
                    const datas = {
	   savedCellphone: savedCellphone,
            "img_base64": String(base64),
        }
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://10djlj3701922.vicp.fun:27036/api/ocr/image",
                data: JSON.stringify(datas),
                headers: {"Content-Type": "application/json"},
                responseType: "json",
                onload:function (res)  {
                    try {

                        if (res.status !== 200) {
                            console.error('状态码：', res.status);
                            return resolve('');
                        }

                         var result = res.response["result"];
                        console.log('识别结果：', result); // 查看原始数据

                        resolve(result);

                    } catch {
                        console.log('原始响应:', res.responseText); // 查看原始数据
                        console.log('解析后的对象:', responseData); // 确认数据结构
                        resolve(''); // 识别失败时返回空

                    }
                }
            });
        });
    }

    // 初始化执行2秒后执行
    setTimeout(() => {
        if (document.getElementById('codeImg')) {
           // handleCaptcha();
        }
    }, 3000);

    // 验证码刷新监控
    let lastSrc = '';
    setInterval(() => {
        const img = document.getElementById('codeImg');
        if (img && img.src !== lastSrc) {      // 检查图片是否更新
            lastSrc = img.src;// 更新图片地址
            handleCaptcha().catch(console.error);    // 重新识别
        }
    }, 500);
})();
