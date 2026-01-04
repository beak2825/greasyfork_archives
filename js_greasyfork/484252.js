// ==UserScript==
// @name         Yandex一键翻译
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  右下角出现一个一键翻译的按钮，点击即可一键翻译当前页面
// @author       thunder-sword
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.com
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      translate.yandex.com
// @downloadURL https://update.greasyfork.org/scripts/484252/Yandex%E4%B8%80%E9%94%AE%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/484252/Yandex%E4%B8%80%E9%94%AE%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

//系统变量
var gcpCode='';

class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = "NetworkError";
  }
}

// 封装GM_xmlhttpRequest为Promise
function httpRequest(options) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      ...options,
      onload: response => resolve(response),
      onerror: error => reject(error)
    });
  });
}

//作用：生成toast，让其在toast_container中，显示在页面中上部，会永久性向页面添加一个id为ths_toast_container的div标签
function showStackToast(message, backcolor='rgb(76, 175, 80)', timeout=3000){
    //没有容器则生成容器
    let box=document.querySelector("body > div#ths_toast_container");
    if(!box){
        box=document.createElement('div');
        box.id="ths_toast_container";
        box.style.cssText = `
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    right: 10px;
    width: 300px;
    height: auto;
    display: flex;
    z-index: 9999;
    flex-direction: column-reverse;`;
        document.body.appendChild(box);
    }
    //创建toast
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.cssText = `
    padding: 10px;
    background-color: ${backcolor};
    color: rgb(255, 255, 255);
    border-radius: 10px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    box-shadow: rgb(0 0 0 / 30%) 0px 5px 10px;
    opacity: 1;
    transition: opacity 0.3s ease-in-out 0s;
    z-index: 9999;
    margin: 5px;
  `;
    box.appendChild(toast);
    toast.style.opacity = 1;
    if(timeout > 0){
        setTimeout(() => {
            toast.style.opacity = 0;
            setTimeout(() => {
                box.removeChild(toast);
            }, 300);
        }, timeout);
    }
    return toast;
}

//作用：获取gpc
async function getGCP(){
    console.log("尝试获取token……");
    showStackToast("尝试获取token……");
    const data = await httpRequest({
        url: 'https://translate.yandex.com/',
	}).then(function(response) {
        return response.responseText;
    }).catch(error => {
        if (error instanceof NetworkError) {
            console.error("Network error: ", error.message);
        } else {
            console.error("Other error: ", error);
            alert("获取数据失败，请联系开发者");
        }
    });
    let fIndex=data.indexOf('GC_STRING');
    if(-1===fIndex){
        console.log(data);
        console.log("没有找到GC_STRING");
        showStackToast("获取token失败，请联系开发者", "red");
    }
    let gStart=fIndex+13;
    gcpCode=data.substr(gStart, data.indexOf("'", gStart)-gStart);
    showStackToast("获取token成功");
    //设置到全局变量中
    GM_setValue("gcpCode", gcpCode);
}

//作用：翻译一个页面
async function translatePage(url){
    if(!gcpCode){
        if(!GM_getValue("gcpCode")){
            await getGCP();
        } else{
            gcpCode=GM_getValue("gcpCode");
        }
    }
    //尝试使用gcpCode打开翻译页面
    window.open(`https://translate.yandex.com/translate?view=compact&lang=en-zh&gcp=${gcpCode}&url=${url}`);
}

//版本号：v0.0.2
//作用：创建一个在右下角出现的悬浮窗按钮，多个按钮会自动排序，点击即可执行对应函数
function createFloatButton(name, func){

     //没有容器则生成容器
    let box=document.querySelector("body > div#ths_button_container");
    if(!box){
        box=document.createElement('div');
        box.id="ths_button_container";
        box.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    min-height: 30px; /* 设置一个最小高度，确保容器有一定高度 */
    display: flex;
    z-index: 9999;
    flex-direction: column;
    `;
        document.body.appendChild(box);
    }

    // 创建一个 div 元素
    var floatWindow = document.createElement('div');

    // 设置 div 的内容
    //floatWindow.innerHTML = '点我执行代码';
    floatWindow.innerHTML = name;

    // 设置 div 的样式
    floatWindow.style.cssText = `
    padding: 5px;
    background-color: #333;
    color: #fff;
    border-radius: 5px;
    font-size: 16px;
    text-align: center;
    opacity: 1;
    z-index: 9999;
    margin: 5px;
    cursor: pointer; /* 鼠标可以选中 */
    `;

    // 将悬浮窗的优先级提高
    floatWindow.style.zIndex = "99999";

    var isDragging = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;
    var cursorX;
    var cursorY;

    floatWindow.addEventListener("mousedown", function(e) {
        if (!isDragging) {
            cursorX = e.clientX;
            cursorY = e.clientY;
            initialX = cursorX - xOffset;
            initialY = cursorY - yOffset;
            isDragging = true;
        }
    });
    floatWindow.addEventListener("mousemove", function(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, floatWindow);
        }
    });
    floatWindow.addEventListener("mouseup", async function(e) {
        initialX = currentX;
        initialY = currentY;

        isDragging = false;
        // 如果点击时鼠标的位置没有改变，就认为是真正的点击
        if (cursorX === e.clientX && cursorY === e.clientY) {
            await func();
        }
    });

    // 为悬浮窗添加事件处理程序，用来监听触摸开始和触摸移动事件
    // 这些事件处理程序的实现方式与上面的鼠标事件处理程序类似
    floatWindow.addEventListener('touchstart', (event) => {
        if (!isDragging) {
            cursorX = event.touches[0].clientX;
            cursorY = event.touches[0].clientY;
            initialX = cursorX - xOffset;
            initialY = cursorY - yOffset;
            isDragging = true;
        }
    });
    floatWindow.addEventListener('touchmove', (event) => {
        if (isDragging) {
            currentX = event.touches[0].clientX - initialX;
            currentY = event.touches[0].clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, floatWindow);
        }
    });

    // 为悬浮窗添加事件处理程序，用来监听触摸结束事件
    // 这个事件处理程序的实现方式与上面的鼠标事件处理程序类似
    floatWindow.addEventListener('touchend', async () => {
        initialX = currentX;
        initialY = currentY;

        isDragging = false;
        // 如果点击时鼠标的位置没有改变，就认为是真正的点击
        if (cursorX === event.touches[0].clientX && cursorY === event.touches[0].clientY) {
            await func();
        }
    });

    function setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }

    //将悬浮窗添加到box元素中
    box.appendChild(floatWindow);
}

//作用：主函数，添加翻译当前页面的按钮
function mainFunction(){
    createFloatButton("一键翻译", ()=>{
        translatePage(window.location.href);
    });
}

(function() {
    'use strict';

    mainFunction();
})();