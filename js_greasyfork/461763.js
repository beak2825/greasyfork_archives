// ==UserScript==
// @name         AI对话保存
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  AI对话保存，兼容ChatGPT和DeepSeek，安装后右下角出现一个悬浮窗按钮，点击即可保存当前对话，自动询问文件名，自动添加时间戳，保存为html格式
// @author       thunder-sword
// @match        https://chat.openai.com/*
// @match        https://chat.deepseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461763/AI%E5%AF%B9%E8%AF%9D%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/461763/AI%E5%AF%B9%E8%AF%9D%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

/* 作用：根据指定的html字符串下载html文件，可指定文件名，自动获取当前页面中的css，自动添加时间戳 */
function downloadHtml(html, fileName='page.html', getCSS=true, addTimeSuffix=true){
    var result=`<head></head>`;
    if(getCSS){
        /* 获取当前页面 css */
        const css = Array.from(document.styleSheets)
        .filter(styleSheet => {
            try {
                return styleSheet.cssRules; // 尝试访问 cssRules，如果不抛出错误则说明不是跨域的
            } catch (e) {
                return false; // 跨域样式表，跳过
            }
        })
        .map(styleSheet => Array.from(styleSheet.cssRules).map(rule => rule.cssText))
        .flat()
        .join("\n");
        result=`<head><style>\n${css}\n</style></head>`;
    }
    result+='<body>'+html+'</body>';
    const file = new File([result], "page.html", { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    fileName = fileName.endsWith(".html") ? fileName : fileName + ".html";
    if(addTimeSuffix){
        var currentTime = new Date();
        fileName=fileName.slice(0,-5)+`-${currentTime.getFullYear()}${(currentTime.getMonth()+1).toString().padStart(2, "0")}${currentTime.getDate().toString().padStart(2, "0")}.html`;
    }
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
}
var copyScript =`var cs = document.querySelectorAll('.bg-black > div > button');
for (let i = 0; i < cs.length; i++) {
    /* 为按钮元素添加点击事件监听器 */
    cs[i].addEventListener('click', function() {
        /* 获取需要复制的文本内容 */
        let text = cs[i].parentNode.parentNode.querySelector('div.p-4 > code').innerText;

        /* 将文本内容复制到剪贴板 */
        navigator.clipboard.writeText(text).then(function() {
            /* 复制成功 */
            /* alert('文本已复制到剪贴板！'); */

            /* 更新按钮文字，提示复制成功 */
            cs[i].innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg>Copied!';

            /* 设置定时器，延迟两秒钟恢复按钮的原状 */
            setTimeout(function() {
                cs[i].innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>Copy code';
            }, 2000);
        }, function() {
            /* 复制失败 */
            /* alert('文本复制失败！'); */
        });
    });
}`;
/* 作用：保存ai对话记录，可弹窗询问要保存的文件名，默认为false */
function savaAiRecording(fileName='page.html', askFileName=false){
    /* askFileName为true时弹窗询问文件名 */
    fileName=askFileName?prompt('输入要保存的文件名：'):fileName;
    var body=document.createElement('body');
    body.innerHTML=document.body.innerHTML;
    /* 删除所有script标签 */
    var ps = body.querySelectorAll('script');
    for (var i = 0; i < ps.length; i++) {
        ps[i].parentNode.removeChild(ps[i]);
    }
    /* 删除所有style标签，因为downloadHtml会自动再获取一次 */
    ps = body.querySelectorAll('style');
    for (var i = 0; i < ps.length; i++) {
        ps[i].parentNode.removeChild(ps[i]);
    }
    /* 删除下边框 */
    var element=body.querySelector('#__next > div > div > main > div.absolute');
    element && element.remove();
    /* 删除DeepSeek侧边框 */
    element=body.querySelector('div#root > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)');
    element && element.remove();
    /* 删除侧边框 */
    element=body.querySelector('#__next > div > div.hidden');
    element && element.remove();
    /* 删除侧边框间隔 */
    element=body.querySelector('#__next > div > div');
    if(element){element.className='';}
    /* 添加script标签，用于修复一键复制 */
    var script=document.createElement('script');
    script.innerHTML=copyScript;
    body.appendChild(script);
    downloadHtml(body.innerHTML, fileName);
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


createFloatButton("AI对话保存", ()=>{
    savaAiRecording('',true);
});