// ==UserScript==
// @name         DMS雨课堂刷课助手
// @namespace    http://tampermonkey.net/ //是Tampermonkey脚本头部的元数据之一，用于为脚本定义一个独特的命名空间，以帮助管理和隔离用户脚本，防止冲突。
// @version      3.1.1
// @description  针对雨课堂视频进行自动播放
// @author       Kevin
// @license      GPL3
// @match        *://*.yuketang.cn/*
// @run-at       document-start
// @icon         http://yuketang.cn/favicon.ico
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/495618/DMS%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/495618/DMS%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
// 雨课堂刷课脚本

const basicConf = {
    version: '3.0',
    rate: 2, //用户可改 视频播放速率,可选值[1,1.25,1.5,2,3,16],默认为2倍速，实测4倍速往上有可能出现 bug，3倍速暂时未出现bug，推荐二倍/一倍。
    // pptTime: 3000, // 用户可改 ppt播放时间，单位毫秒
}

const $ = { // 开发脚本的工具对象
    panel: "",      // panel节点，后期赋值
    observer: "",   // 保存observer观察对象
    userInfo: {     // 实时同步刷课记录，避免每次都从头开始检测
        allInfo: {},              // 刷课记录，运行时赋值
        getProgress(classUrl) {   // 参数：classUrl:课程地址
            if (!localStorage.getItem("[雨课堂脚本]刷课进度信息"))   // 第一次初始化这个localStorage
                this.setProgress(classUrl, 0, 0);
            this.allInfo = JSON.parse(localStorage.getItem("[雨课堂脚本]刷课进度信息"));  // 将信息保存到本地
            if (!this.allInfo[classUrl])         // 第一次初始化这个课程
                this.setProgress(classUrl, 0, 0);
            console.log(this.allInfo);
            return this.allInfo[classUrl];   // 返回课程记录对象{outside:外边第几集，inside:里面第几集}
        },
        setProgress(classUrl, outside, inside = 0) {   // 参数:classUrl:课程地址,outside为最外层集数，inside为最内层集数
            this.allInfo[classUrl] = {
                outside,
                inside
            }
            localStorage.setItem("[雨课堂脚本]刷课进度信息", JSON.stringify(this.allInfo));   // localstorage只能保存字符串，需要先格式化为字符串
        },
        removeProgress(classUrl) {   // 移除课程刷课信息，用在课程刷完的情况
            delete this.allInfo[classUrl];
            localStorage.setItem("[雨课堂脚本]刷课进度信息", JSON.stringify(this.allInfo));
        }
    },
    alertMessage(message) { // 向页面中添加信息
        const li = document.createElement("li");
        li.innerText = message;
        $.panel.querySelector('.n_infoAlert').appendChild(li);
    },
    ykt_speed() {    // 视频加速
        const rate = basicConf && basicConf.rate ? basicConf.rate : 2; // 使用逻辑运算符确保rate有备选值
        $.alertMessage('已开启' + rate + '倍速');

        // 使用querySelector替代getElementsByTagName来提升选择器的准确性
        let speedwrap = document.querySelector("xt-speedbutton");
        let speedlist = document.querySelector("xt-speedlist");

        // 检查speedlist是否存在并且有一个firstElementChild存在
        if (speedlist && speedlist.firstElementChild) {
            let speedlistBtn = speedlist.firstElementChild.firstElementChild; // 获取按钮

            // 检查speedlistBtn是否存在
            if (speedlistBtn) {
                // 如果存在，则设置相应的属性和文本
                speedlistBtn.setAttribute('data-speed', rate);
                speedlistBtn.setAttribute('keyt', rate + '.00');
                speedlistBtn.innerText = rate + '.00X';

                // 模拟点击
                let mousemove = new MouseEvent("mousemove", {
                    bubbles: true,
                    cancelable: true,
                    clientX: 10,
                    clientY: 10
                });

                if (speedwrap) {
                    speedwrap.dispatchEvent(mousemove); // 触发mousemove事件
                }

                speedlistBtn.click(); // 触发click事件
            } else {
                console.error('speedlistBtn元素未找到'); // 如果找不到按钮，输出错误消息
            }
        } else {
            // 如果找不到speedlist或firstElementChild不存在，输出错误消息
            console.error('speedlist元素未找到或第一个子元素不存在');
        }
    },
    claim() {
        const volumeIcon = document.querySelector(".xt_video_player_volume .xt_video_player_common_icon");
        if (volumeIcon) {
            volumeIcon.click();
            console.log('已尝试开启静音');
        } else {
            console.error('未找到静音按钮');
        }
    },
    observePause() { // 视频意外暂停，自动播放
        const targetClass = '.xt_video_player_big_play_layer.pause_show';
        const targetElements = document.querySelector(targetClass);
        const muteElement = document.querySelector('.xt_video_player_common_icon.xt_video_player_common_icon_muted');
        // 未静音
        if (!muteElement) {
            // setTimeout(observePause, 100);
            $.claim();
        }
        // 已播放
        if (!targetElements) {
            //   setTimeout(observePause, 100);
            document.querySelector("video").play();
            return;
        }
        document.querySelector("video").play();
    },

    preventScreenCheck() {  // 阻止pro/lms雨课堂切屏检测
        const window = unsafeWindow;
        const blackList = new Set(["visibilitychange", "blur", "pagehide"]); // 限制调用事件名单：1.选项卡的内容变得可见或被隐藏时2.元素失去焦点3.页面隐藏事件
        const isDebug = false;
        const log = console.log.bind(console, "[阻止pro/lms切屏检测]");
        const debug = isDebug ? log : () => { };
        window._addEventListener = window.addEventListener;
        window.addEventListener = (...args) => {                  // args为剩余参数数组
            if (!blackList.has(args[0])) {                          // args[0]为想要定义的事件，如果不在限制名单，调用原生函数
                debug("allow window.addEventListener", ...args);
                return window._addEventListener(...args);
            } else {                                                // 否则不执行，打印参数信息
                log("block window.addEventListener", ...args);
                return undefined;
            }
        };
        document._addEventListener = document.addEventListener;
        document.addEventListener = (...args) => {
            if (!blackList.has(args[0])) {
                debug("allow document.addEventListener", ...args);
                return window._addEventListener(...args);
            } else {
                log("block document.addEventListener", ...args);
                return undefined;
            }
        };
        log("addEventListener hooked!");
        if (isDebug) { // DEBUG ONLY: find out all timers
            window._setInterval = window.setInterval;
            window.setInterval = (...args) => {
                const id = window._setInterval(...args);
                debug("calling window.setInterval", id, ...args);
                return id;
            };
            debug("setInterval hooked!");
            window._setTimeout = window.setTimeout;
            window.setTimeout = (...args) => {
                const id = window._setTimeout(...args);
                debug("calling window.setTimeout", id, ...args);
                return id;
            };
            debug("setTimeout hooked!");
        }
        Object.defineProperties(document, {
            hidden: {                 // 表示页面是（true）否（false）隐藏。
                value: false
            },
            visibilityState: {        // 当前可见元素的上下文环境。由此可以知道当前文档 (即为页面) 是在背后，或是不可见的隐藏的标签页
                value: "visible"        // 此时页面内容至少是部分可见
            },
            hasFocus: {               // 表明当前文档或者当前文档内的节点是否获得了焦点
                value: () => true
            },
            onvisibilitychange: {     // 当其选项卡的内容变得可见或被隐藏时，会在 document 上触发 visibilitychange 事件  ==  visibilitychange
                get: () => undefined,
                set: () => { }
            },
            onblur: {                 // 当元素失去焦点的时候
                get: () => undefined,
                set: () => { }
            }
        });
        log("document properties set!");
        Object.defineProperties(window, {
            onblur: {
                get: () => undefined,
                set: () => { }
            },
            onpagehide: {
                get: () => undefined,
                set: () => { }
            },
        });
        log("window properties set!");
    }
}

function addWindow() {  // 1.添加交互窗口
    const css = `
    ul,
li,
p {
  margin: 0;
  padding: 0;
}

.mini-basic {
  position: fixed;
  top: 10px;
  left: 10px;
  background: #f5f5f5;
  border: 1px solid #000;
  border-radius: 0; /* 默认为方形 */
  transition: border-radius 0.3s ease-in-out;
  height: 50px;
  width: 50px;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
.miniwin {
  display: none; /* 或你需要的显示方式 */
  width: 40px; /* 圆形的宽度 */
  height: 40px; /* 圆形的高度 */
  border-radius: 50%; /* 圆形边框 */
  background-color: #ADD8E6; /* 浅蓝色背景 */
  color: #000000; /* 深黑色文本 */
  transition: width 0.3s, height 0.3s, border-radius 0.3s, transform 0.3s; /* 添加过渡动画 */
}
.n_panel {
  margin: 0;
  padding: 0;
  position: fixed;
  top: 80px;
  left: 20%;
  width: 300px;
  height: 200px;
  background-color: #fff;
  z-index: 99999;
  box-shadow: 6px 4px 17px 2px #000000;
  border-radius: 10px;
  border: 1px solid #a3a3a3;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #636363;
}
.hide {
  display: none;
}
.n_header {
  text-align: center;
  height: 40px;
  background-color: #f7f7f7;
  color: #000;
  font-size: 18px;
  line-height: 40px;
  cursor: move;
  border-radius: 10px 10px 0 0;
  border-bottom: 2px solid #eee;
}
.n_header .tools {
  position: absolute;
  right: 10px;
  top: 5px;
}
.n_header .tools ul li {
  position: relative;
  display: inline-block;
  padding: 2px 6px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
}

.n_body {
  font-weight: bold;
  font-size: 13px;
  line-height: 26px;
  height: 123px;
  padding: 5px;
  overflow-y: scroll;
  overflow-x: hidden;
}

/* 在这里添加两条重要的CSS规则 */
.n_body::-webkit-scrollbar {
  width: 4px;
}
.n_body::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}

.n_footer {
  position: absolute;
  bottom: 0;
  left: 0;
  text-align: right;
  height: 25px;
  width: 100%;
  background-color: #f7f7f7;
  color: #c5c5c5;
  font-size: 13px;
  line-height: 25px;
  border-radius: 0 0 10px 10px;
  border-bottom: 2px solid #eee;
  display: flex;  /* 采用flex布局 */
  justify-content: space-between; /* 元素间距均匀分布 */
  align-items: center; /* 垂直居中对齐 */
  padding: 0 10px; /* 调整内边距 */
  box-sizing: border-box; /* 边框和内填充计入宽度 */
}
.n_footer p {
    margin: 0; /* 移除p标签默认外边距 */
    flex: 1; /* 允许p元素占据多余的空间，从而保证按钮在最右侧 */
    text-align: left; /* 文本左对齐 */
    color: #636363; /* 调整文字颜色以增加可读性 */
    font-size: 13px; /* 保持与.n_body中的文字尺寸一致 */
    flex-grow: 1; /* p标签占据剩余空间 */
}

.n_footer .author {
  color: #636363;
  font-size: 14px;
  font-weight: normal;
}

.n_footer #n_button {
  margin: 0; /* 移除button默认外边距 */
  font-size: 13px; /* 按钮字体尺寸与其他文本保持一致 */
  padding: 6px 12px; /* 调整按钮内边距为适当大小 */
  border-radius: 6px;
  border: 0;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

.n_footer #n_button:hover {
  background-color: #0056b3;
}

/* 这段是新增加的，用于显示作者信息 */
.author-info {
  font-size: 12px;
  color: #555;
  margin-top: 5px;
}
    `;
    const html = `
    <div>
    <style>${css}</style>
    <div class="mini-basic miniwin">
        点击放大
    </div>
    <div class="n_panel">
    <div class="n_header">
      DMS刷课助手
      <div class='tools'>
        <ul>
          <li class='minimality'>➖</li>
          <li class='question'>❓</li>
        </ul>
      </div>
    </div>
    <div class="n_body">
      <ul class="n_infoAlert">
        <li>⭐特性：适用于所有雨课堂版本，支持倍速播放，自动播放功能</li>
        <li>📢使用：在课程目录页点击“开始刷课”即开始自动播放</li>
        <li>⚠️注意：启动脚本后请勿操作刷课窗口，可新开窗口或最小化浏览器</li>
        <li>💡提示：拖动标题栏可移动窗口</li>
        <hr>
      </ul>
    </div>
    <div class="n_footer">
      <p>Kevin</p>
      <button id="n_button">开始刷课</button>
    </div>
    </div>
    </div>
    `;
    // 插入div隐藏dom元素
    const div = document.createElement('div');
    document.body.append(div);
    const shadowroot = div.attachShadow({ mode: 'closed' });
    shadowroot.innerHTML = html;
    $.panel = shadowroot.lastElementChild.lastElementChild; // 保存panel节点
    return $.panel;  // 返回panel根容器
}

function addUserOperate() { // 2.添加交互操作
    const panel = addWindow();
    const header = panel.querySelector(".n_header");
    const button = panel.querySelector("#n_button");
    const clear = panel.querySelector("#n_clear");
    const minimality = panel.querySelector(".minimality");
    const question = panel.querySelector(".question");
    const infoAlert = panel.querySelector(".n_infoAlert");
    const miniWindow = panel.previousElementSibling;
    let mouseMoveHander;
    const mouseDownHandler = function (e) {   // 鼠标在header按下处理逻辑
        e.preventDefault();
        // console.log("鼠标按下/////header");
        let innerLeft = e.offsetX,
            innerTop = e.offsetY;
        mouseMoveHander = function (e) {
            // console.log("鼠标移动////body");
            let left = e.clientX - innerLeft,
                top = e.clientY - innerTop;
            //获取body的页面可视宽高
            var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
            var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
            // 通过判断是否溢出屏幕
            if (left <= 0) {
                left = 0;
            } else if (left >= clientWidth - panel.offsetWidth) {
                left = clientWidth - panel.offsetWidth
            }
            if (top <= 0) {
                top = 0
            } else if (top >= clientHeight - panel.offsetHeight) {
                top = clientHeight - panel.offsetHeight
            }
            panel.setAttribute("style", `left:${left}px;top:${top}px`);
        }
        document.body.addEventListener("mousemove", mouseMoveHander);
    }
    header.addEventListener('mousedown', mouseDownHandler);
    header.addEventListener('mouseup', function () {
        // console.log("鼠标松起/////header");
        document.body.removeEventListener("mousemove", mouseMoveHander);
    })
    document.body.addEventListener("mouseleave", function () {
        // console.log("鼠标移出了body页面");
        document.body.removeEventListener("mousemove", mouseMoveHander);
    })
    // 刷课按钮
    button.onclick = function () {
        start();
        button.innerText = '刷课中~';
    }
    // 初始化隐藏最小化按钮
    miniWindow.classList.add("hidden");
    // 最小化按钮
    function minimalityHander(e) {
        if (miniWindow.style.display === 'none') {
            // Show mini window
            miniWindow.style.display = 'inline-block';
            panel.style.opacity = '0';
            panel.style.transform = 'scale(0.5)';
        } else {
            // Hide mini window
            miniWindow.style.display = 'none';
            panel.style.opacity = '1';
            panel.style.transform = 'scale(1)';
        }
    }

    minimality.addEventListener("click", minimalityHander);
    miniWindow.addEventListener("click", minimalityHander);
    // 有问题按钮
    question.onclick = function () {
        alert('作者邮箱：2389765824@qq.com');
    };
    // 鼠标移入窗口，暂停自动滚动
    (function () {
        let scrollTimer;
        scrollTimer = setInterval(function () {
            infoAlert.lastElementChild.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }, 500)
        infoAlert.addEventListener('mouseenter', () => {
            clearInterval(scrollTimer);
            // console.log('鼠标进入了打印区');
        })
        infoAlert.addEventListener('mouseleave', () => {
            scrollTimer = setInterval(function () {
                infoAlert.lastElementChild.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }, 500)
            // console.log('鼠标离开了打印区');
        })
    })();
}

function start() {  // 脚本入口函数
    const url = location.host;
    const pathName = location.pathname.split('/');
    const matchURL = url + pathName[0] + '/' + pathName[1] + '/' + pathName[2];
    $.alertMessage(`正在为您匹配${matchURL}的处理逻辑...`);
    if (matchURL.includes('yuketang.cn/v2/web')) {
        yuketang_v2();
    } else if (matchURL.includes('yuketang.cn/pro/lms')) {
        yukerang_pro_lms();
    } else {
        $.panel.querySelector("button").innerText = "开始刷课";
        $.alertMessage(`这不是刷课的页面哦，刷课页面的网址应该匹配 */v2/web/* 或 */pro/lms/*`)
        return false;
    }
}

function scrollToBottomIfSectionNotHidden() { // 刷新检查
    // 选择<section>元素
    const section = document.querySelector('section[data-v-721ac683][data-v-3ad17776]');

    // 检查section元素的display属性
    if (section && window.getComputedStyle(section).display !== 'none') {
        // 如果section不是隐藏的（不为'none'），退出函数
        $.alertMessage('刷新完毕！！！')
        return;
    }

    // 如果为'none'，执行滚动操作
    const viewContainer = document.querySelector('.viewContainer');
    const elTabPane = document.querySelector('.el-tab-pane');
    if (viewContainer && elTabPane) {
        viewContainer.scrollTop = elTabPane.scrollHeight;
    }
}

function getAnswerArrayFromTitleString(titleString, answersDictionary) {
    // 提取标题中的数字
    const titleMatch = titleString.match(/第(.*?)讲/);
    if (titleMatch && titleMatch[1]) {
        const chineseNumber = titleMatch[1]; // 获取中文数字，例如 "六"

        // 根据中文数字获取答案数组
        const answerArray = answersDictionary[chineseNumber];
        return answerArray;
    } else {
        console.log('未能提取到标题字符串中的数字。');
        return null;
    }
}

function selectAnswerAndSubmit(answersDictionary) {
    const title = document.querySelector('.title').innerText;
    const answerArray = getAnswerArrayFromTitleString(title, answersDictionary);
    console.log(answerArray);
    // 获取.item-type元素中的数字，用来确定问题的序号
    const itemTypeElement = document.querySelector('.item-type');
    if (!itemTypeElement) {
        console.error('未找到.item-type元素。');
        return;
    }

    // 从.item-type元素的文本中提取数字
    const match = itemTypeElement.textContent.match(/\d+/);
    if (!match) {
        console.error('.item-type元素中未包含数字。');
        return;
    }
    const questionNumber = parseInt(match[0], 10) - 1; // 将序号转换为数组索引

    // 根据问题序号选择答案
    const selectedAnswer = answerArray[questionNumber];
    if (!selectedAnswer) {
        console.error('答案数组中不存在对应序号的答案。');
        return;
    }

    // 从页面中查找所有选项的span元素
    const options = document.querySelectorAll('.el-radio__input');
    let optionFound = false;

    // 在所有选项中查找与selectedAnswer匹配的那个，并触发点击事件
    options.forEach(option => {
        const inputElement = option.querySelector('input.el-radio__original');
        if (inputElement && inputElement.value === selectedAnswer && selectedAnswer) {
            optionFound = true;
            option.click(); // 触发点击事件以选中答案
        }
    });

    if (!optionFound) {
        console.error('在页面选项中未找到与选定答案匹配的选项。');
    }
    // 查找并点击提交按钮
    const submitButton = document.querySelector('button.el-button--primary');
    if (submitButton) {
        submitButton.click();
    } else {
        console.error('未找到提交按钮。');
    }
}


function homework(mainCallback) {
    const answersDictionary = {
        '一': ['A', 'A', 'C'],
        '二': ['C', 'C', 'C'],
        '三': ['A', 'A', 'C'],
        '四': ['B', 'A', 'C'],
        '五': ['A', 'B', 'B'],
        '六': ['B', 'A', 'C'],
        '七': ['B', 'C', 'C'],
        '八': ['A', 'A', 'A'],
        '九': ['A', 'C', 'B'],
        '十': ['A', 'B', 'C'],
        '十一': ['C', 'B', 'C'],
        '十二': ['C', 'C', 'C'],
        '十三': ['C', 'A', 'B'],
        '十四': ['A', 'A', 'B'],
        '十五': ['B', 'A', 'C']
    };
    $.alertMessage(`处理作业部分！！！`);
    let count_work = 0;

    // 一定要注意计时器的清楚他们是异步执行的
    let checkInterval; // 保存检查页面元素存在的定时器引用
    let interval;

    function work_main() {
        let filteredSpans = [];
        const searchInterval = setInterval(() => {
            let allSpans = document.querySelectorAll('span[data-v-1c75131d]');
            console.log('Checking spans:', allSpans.length);
            if (allSpans.length > 0) {
                clearInterval(searchInterval); // 清除定时器，退出循环
                allSpans.forEach(span => {
                    const textContent = span.textContent.trim();
                    if (textContent === '未开始' || textContent === '进行中') {
                        const section = span.closest('section');
                        if (section) { // 确保section存在
                            const use = section.querySelector('use'); // 在section中查找use
                            if (use) { // 确保use存在
                                const href = use.getAttribute('xlink:href'); // 获取xlink:href属性值
                                if (href && href.includes('zuoye')) {
                                    filteredSpans.push(section);
                                }
                            }
                        }
                    }
                });
                console.error('Filtered spans length:', filteredSpans.length);
                console.log('Count work:', count_work);
                if (count_work === filteredSpans.length) { // 结束
                    $.alertMessage('作业刷完了');
                    clearInterval(interval);
                    clearInterval(checkInterval);
                    if (mainCallback && typeof mainCallback === 'function') {
                        mainCallback(); // 调用 main 函数作为回调，确保在作业完全完成后执行
                    }
                    return;
                }
                console.log('Count work:', count_work);
                if (filteredSpans[count_work]) {
                    console.log('Clicking filtered span');
                    filteredSpans[count_work].click(); // 进入课程
                }
            }

        }, 100); // 每100毫秒执行一次

        setTimeout(() => {
            console.log('In setTimeout callback');

            let checkCount = 0; // 初始化计数器

            function checkExistence() {
                const titleElement = document.querySelector('.item-type');
                if (titleElement) {
                    clearInterval(checkInterval); // 如果元素存在，清除定时器
                    title = titleElement.innerText;  // 标题文本
                    console.log('Title:', title);

                    interval = setInterval(() => {
                        const submittedButton = document.querySelector('button.is-disabled span');
                        if (submittedButton && submittedButton.responseContent.trim() === '已提交') {
                            console.log('已经提交，停止执行。');
                            count_work++;
                            clearInterval(interval); // 清除定时器
                            history.back();
                            work_main();
                            clearInterval(interval);
                        } else {
                            selectAnswerAndSubmit(answersDictionary);
                        }
                    }, 3000); // 每隔3000毫秒执行一次
                } else {
                    checkCount++; // 计数器递增
                    console.error('No--------.item-type');
                    if (checkCount >= 50) { // 检查次数是否达到50次
                        clearInterval(checkInterval); // 清除定时器
                        console.error('Reached maximum number of checks. Stopping.');
                    }
                }
            }

            checkInterval = setInterval(checkExistence, 100);
        }, 3000);

    }

    work_main();

}

// yuketang.cn/v2/web页面的处理逻辑
function yuketang_v2() {
    let count = 0;
    // const baseUrl = location.href;    // 用于判断不同的课程
    // let count = $.userInfo.getProgress(baseUrl).outside;  // 记录当前课程播放的外层集数
    $.alertMessage(`检测到已经播放到${count}集...`);
    // $.alertMessage('已匹配到yuketang.cn/v2/web,正在处理...');
    // 展开
    let intervalId = setInterval(() => {
        let open = document.querySelector('.content-box')?.querySelector('.sub-info')?.querySelector('.gray')?.querySelector('span');
        if (open) {
            open.click();
            clearInterval(intervalId);
        }
    }, 100); // 每隔1000毫秒检查一次

    // 调用 homework 函数，并将 main 函数作为回调传入
    homework(main);

    // 主函数
    function main() {
        let play = true;        // 用于标记视频是否播放完毕
        let allSpans;
        let filteredSpans = [];
        const searchInterval = setInterval(() => {
            let allSpans = document.querySelectorAll('span[data-v-1c75131d]');
            // console.log(allSpans);
            if (allSpans.length > 0) {
                clearInterval(searchInterval); // 清除定时器，退出循环
                allSpans.forEach(span => {
                    const textContent = span.textContent.trim();
                    if (textContent === '未开始' || textContent === '进行中') {
                        const section = span.closest('section');
                        if (section) { // 确保section存在
                            const use = section.querySelector('use'); // 在section中查找use
                            if (use) { // 确保use存在
                                const href = use.getAttribute('xlink:href'); // 获取xlink:href属性值
                                if (href && href.includes('shipin')) {
                                    filteredSpans.push(section);
                                }
                            }
                        }
                    }
                });
                console.log(filteredSpans);
                if (count === filteredSpans.length && play === true) {            // 结束
                    $.alertMessage('视频刷完了');
                    $.panel.querySelector('#n_button').innerText = '刷完了~';
                    // $.userInfo.removeProgress(baseUrl);
                    return;
                }
                // 遍历这些<span>元素
                // console.log('开始');
                // 寻找每个<span>的最近父级<section>元素
                // const section = span.closest('section');
                play = false;
                console.log(count);
                // 若存在<section>且它包含可以触发点击的方法，则进行点击操作
                if (filteredSpans[count]) {
                    filteredSpans[count].click();// 进入课程
                }
            }
        }, 100); // 每100毫秒执行一次

        setTimeout(() => {
            // var progress;  // 全局变量声明
            let title;
            const checkExistence = () => {
                // const progressElement = document.querySelector('.el-tooltip.item');
                const titleElement = document.querySelector('.title');

                if (titleElement) {
                    clearInterval(checkInterval); // 如果两个元素都存在，清除定时器
                    title = titleElement.innerText;  // 标题文本
                }
                // 否则，循环将继续进行直到找到这些元素
            };

            const checkInterval = setInterval(checkExistence, 100);

            function waitForElementToDisplay(selector, time) {
                if (document.querySelector(selector) != null) {
                    // document.querySelector("video").play();
                    // 执行后续操作
                    // console.log("5555555555555555");
                    $.alertMessage(`正在播放：${title}`);
                    $.ykt_speed();
                    // $.claim(); // 静音
                    setTimeout(() => {
                        $.observePause(); // 观察暂停
                    }, 3000); // 延迟3秒
                } else {
                    setTimeout(function () {
                        waitForElementToDisplay(selector, time);
                    }, time);
                }
            }
            waitForElementToDisplay('.xt_video_player_big_play_layer.pause_show', 100); // 每隔500毫秒检查一次

            let timer1 = setInterval(() => {
                let progress = document.querySelector('.el-tooltip.item');
                $.observePause(); //观察暂停
                if (progress) {
                    $.alertMessage(progress.textContent.trim());
                    if (progress.textContent.trim().includes('100%') || progress.textContent.trim().includes('99%') || progress.textContent.trim().includes('98%') || progress.textContent.trim().includes('已完成')) {
                        play = true; // 确保play变量在适当的作用域内
                        if ($.observer) { // 如果observer存在，则断开连接
                            $.observer.disconnect();
                        }
                        count++;
                        history.back(); // 导航回上一个页面
                        console.error('back');
                        main();
                        clearInterval(timer1);
                    }
                } else {
                    // 如果没有找到进度元素，有可能是页面还没完全加载，可以考虑记录日志或重试逻辑
                    console.error('Progress element not found');
                }
            }, 2000);
        }, 3000);
    }
    // main();
}

// yuketang.cn/pro/lms旧页面的跳转逻辑
function yukerang_pro_lms() {
    localStorage.setItem('n_type', true);
    $.alertMessage('正准备打开新标签页...');
    localStorage.getItem('pro_lms_classCount') ? null : localStorage.setItem('pro_lms_classCount', 1);  // 初始化集数
    let classCount = localStorage.getItem('pro_lms_classCount') - 1;
    document.querySelectorAll('.leaf-detail')[classCount].click();  // 进入第一个课程，启动脚本
}

// yuketang.cn/pro/lms新页面的刷课逻辑
function yukerang_pro_lms_new() {
    $.preventScreenCheck();
    function nextCount(classCount) {
        event1 = new Event('mousemove', { bubbles: true });
        event1.clientX = 9999;
        event1.clientY = 9999;
        if (document.querySelector('.btn-next')) {
            localStorage.setItem('pro_lms_classCount', classCount);
            document.querySelector('.btn-next').dispatchEvent(event1);
            document.querySelector('.btn-next').dispatchEvent(new Event('click'));
            localStorage.setItem('n_type', true);
            main();
        } else {
            localStorage.removeItem('pro_lms_classCount');
            $.alertMessage('课程播放完毕了');
        }
    }
    $.alertMessage('已就绪，开始刷课，请尽量保持页面不动。');
    let classCount = localStorage.getItem('pro_lms_classCount');
    async function main() {
        $.alertMessage(`准备播放第${classCount}集...`);
        await new Promise(function (resolve) {
            setTimeout(function () {
                let className = document.querySelector('.header-bar').firstElementChild.innerText;
                let classType = document.querySelector('.header-bar').firstElementChild.firstElementChild.getAttribute('class');
                let classStatus = document.querySelector('#app > div.app_index-wrapper > div.wrap > div.viewContainer.heightAbsolutely > div > div > div > div > section.title')?.lastElementChild?.innerText;
                if (classType.includes('tuwen') && classStatus != '已读') {
                    $.alertMessage(`正在废寝忘食地看:${className}中...`);
                    setTimeout(() => {
                        resolve();
                    }, 2000)
                } else if (classType.includes('taolun')) {
                    $.alertMessage(`只是看看，目前没有自动发表讨论功能，欢迎反馈...`);
                    setTimeout(() => {
                        resolve();
                    }, 2000)
                } else if (classType.includes('shipin') && !classStatus.includes('100%')) {
                    $.alertMessage(`正在播放：${className}`);
                    setTimeout(() => {
                        // 监测视频播放状态
                        let timer = setInterval(() => {
                            let classStatus = document.querySelector('#app > div.app_index-wrapper > div.wrap > div.viewContainer.heightAbsolutely > div > div > div > div > section.title')?.lastElementChild?.innerText;
                            if (classStatus.includes('100%') || classStatus.includes('99%') || classStatus.includes('98%') || classStatus.includes('已完成')) {
                                $.alertMessage(`${className}播放完毕...`);
                                clearInterval(timer);
                                if (!!$.observer) {  // 防止新的视频已经播放完了，还未来得及赋值observer的问题
                                    $.observer.disconnect();  // 停止监听
                                }
                                resolve();
                            }
                        }, 200)
                        // 根据video是否加载出来判断加速时机
                        let nowTime = Date.now();
                        let videoTimer = setInterval(() => {
                            let video = document.querySelector('video');
                            if (video) {
                                setTimeout(() => {  // 防止视频刚加载出来，就加速，出现无法获取到元素地bug
                                    $.ykt_speed();
                                    $.claim();
                                    $.observePause();
                                    clearInterval(videoTimer);
                                }, 2000)
                            } else if (!video && Date.now() - nowTime > 20000) {  // 如果20s内仍未加载出video
                                localStorage.setItem('n_type', true);
                                location.reload();
                            }
                        }, 5000)
                    }, 2000)
                } else if (classType.includes('zuoye')) {
                    $.alertMessage(`进入：${className}，目前没有自动作答功能，敬请期待...`);
                    setTimeout(() => {
                        resolve();
                    }, 2000)
                } else {
                    $.alertMessage(`您已经看过${className}...`);
                    setTimeout(() => {
                        resolve();
                    }, 2000)
                }
            }, 2000);
        })
        $.alertMessage(`第${classCount}集播放完了...`);
        classCount++;
        nextCount(classCount);
    }
    main();
};

// 油猴执行文件
// 自执行的匿名函数（也被称为立即执行函数表达式
(function () {
    // **'use strict';**：这行代码启用了严格模式。在严格模式下，
    // JavaScript 会对一些不安全的行为抛出错误，比如给未声明的变量赋值等。
    'use strict';
    // setInterval： 这是一个定时器函数，每隔100毫秒（0.1秒）执行一次里面的箭头函数。
    // 这个箭头函数的目的是检查document.body是否存在，如果存在，说明DOM已经加载完成，可以对DOM进行操作了。
    const listenDom = setInterval(() => {
        if (document.body) {
            addUserOperate();
            /*
                localStorage获取和设置：
                localStorage.getItem('n_type')用来获取名为'n_type'的本地存储项的值。
                如果其值为'true'，将执行进一步的操作。
            */
            if (localStorage.getItem('n_type') === 'true') {
                //修改了id为'n_button'的DOM元素的文本内容为'刷课中~'
                $.panel.querySelector('#n_button').innerText = '刷课中~';
                // 将'n_type'的值设置为'false'，可能是为了标记某个动作已经开始或结束。
                localStorage.setItem('n_type', false);
                yukerang_pro_lms_new();
            }
            // 页面都加载出来了就不连续监听了
            clearInterval(listenDom);
        }
    }, 100)
})();