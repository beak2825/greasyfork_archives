// ==UserScript==
// @name         文章助手
// @namespace    xiaobaibubai/articleHelper
// @version      1.0.0
// @description  文章翻页（主要适配edge浏览器）
// @author       XiaobaiBuBai
// @match        *://*/*
// @license     BSD
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482733/%E6%96%87%E7%AB%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/482733/%E6%96%87%E7%AB%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


var switchStatus = 0;//自动翻页开关：需要本地存储（0-true;1-false）
var switchFocusStatus = true;
var gearIndex = 0;//初始档位：需要本地存储
var gears = [1, 2, 3, 4, 6,8,10,12,14]; // 创建一个数组来表示档位
var links = document.getElementsByTagName('a');//存储a标签
var nextUrlLink = document.querySelector('#next_url'); // 根据实际情况修改id选择器
var prevUrlLink = document.querySelector('#prev_url'); // 根据实际情况修改id选择器
var startInterval = null;

function messageShow(m){
    const message = new Message();
    message.show(m, 'tick'); // 显示绿色勾图标的消息提示
}

function messageShowError(m){
    const message = new Message();
    message.show(m, '');
}



window.onload = function() {
    // 网页初始化触发的代码
    //console.log("网页已加载完毕");
    //获取上次自动翻页信息
    if(localStorage.getItem('switchStatus') != null && localStorage.getItem('gearIndex')!=null){
        //console.log(JSON.parse(localStorage.getItem('switchStatus')));
        switchStatus = JSON.parse(localStorage.getItem('switchStatus'));
        gearIndex = JSON.parse(localStorage.getItem('gearIndex'));
        switchFocusStatus = JSON.parse(localStorage.getItem('switchFocusStatus'));
    }

    if(nextUrlLink == null || prevUrlLink == null){
        nextUrlLink = document.querySelector('.pt-nextchapter'); //class选择器
        prevUrlLink = document.querySelector('.pt-prechapter');//class选择器
    }

    if(nextUrlLink == null || prevUrlLink == null){
        // 定义匹配的元素索引
        var nextIndex = -1;
        var pervIndex = -1;

        // 遍历所有 a 标签元素，找到匹配的元素
        for (var i = 0; i < links.length; i++) {
            if (links[i].textContent === '上一章') {
                prevUrlLink = links[i];
            }
            if (links[i].textContent === '上一页') {
                prevUrlLink = links[i];
            }
            if(links[i].textContent === '下一章'){
                nextUrlLink = links[i];
            }
            if(links[i].textContent === '下一页'){
                nextUrlLink = links[i];
            }
            if(prevUrlLink!= null && nextUrlLink != null ){
                break;
            }
        }
    }

    startInterval = startDownInterval();
};

// 添加键盘事件监听器
document.addEventListener('keydown', function(event) {
    var key = event.key || event.keyCode;
    //clearDownInterval();
    if (event.altKey && key === 'j') {
        // ALT+j键按下，触发上一页<a>标签的点击事件
        saveState(switchStatus,gearIndex);
        switchStatus = 1;
        prevUrlLink.click();
    }
    if (event.altKey && key === 'l') {
        // ALT+l键按下，触发下一页<a>标签的点击事件
        saveState(switchStatus,gearIndex);
        switchStatus = 1;
        nextUrlLink.click();
    }
    if (event.altKey && event.key === 'i') {
        // Alt + i 快捷键：向上滚动
        switchStatus = 1;
        messageShow("自动翻页已关闭");
        window.scrollBy(0, -80); // 向上滚动100像素，可以根据需要调整数值
    }
    if (event.altKey && event.key === 'k') {
        // Alt + k 快捷键：向下滚动
        switchStatus = 1;
        messageShow("自动翻页已关闭");
        window.scrollBy(0, 80); // 向下滚动100像素，可以根据需要调整数值
    }

    if (key === 'ArrowLeft' || key === '37') {
        // 向左键按下，触发上一页<a>标签的点击事件
        saveState(switchStatus,gearIndex);
        switchStatus = 1;
        prevUrlLink.click();
    }
    if (key === 'ArrowRight' || key === '39') {
        // 向右键按下，触发下一页<a>标签的点击事件
        saveState(switchStatus,gearIndex);
        switchStatus = 1;
        nextUrlLink.click();
    }

    //自动翻页开关
    if (event.altKey && (key === 'o' )) {
        // 自动翻页开关 : Alt+o;
        if(switchStatus == 0){
            messageShow("自动翻页已关闭");
            switchStatus = 1;
            saveState(switchStatus,gearIndex);
        }else{
            messageShow("自动翻页已开启");
            switchStatus = 0;
            saveState(switchStatus,gearIndex);
        }
    }

    //网页失焦本地存储自动翻页信息
    if (event.altKey && (key === 'p' )) {
        switchFocusStatus = !switchFocusStatus;
        if(switchFocusStatus){
            messageShow("网页失焦，存储翻页");
        }else{
            messageShow("网页失焦，无保存");
        }

        localStorage.setItem('switchFocusStatus', switchFocusStatus);
    }


    //档位控制
    if(event.altKey){
        // 检测是否按下了 Alt 键和一个数字键
        if (event.altKey && event.key.match(/\d/)) {
            // 获取按下的数字值
            const keyValue = parseInt(event.key);

            // 如果找到了匹配的档位，执行相应的操作
            if (keyValue > 0 && keyValue <= gears.length) {
                switchStatus = 0;
                messageShow( `自动翻页已开启：当前速度为 ${keyValue} 级`);
                gearIndex = keyValue-1;
                saveState(switchStatus,gearIndex);
            } else {
                messageShowError( `未找到匹配的档位：${keyValue}`);
            }

        }
    }

    //自定义特殊按键
    /**if (event.altKey && event.ctrlKey && event.key === 'k') {
      var win = window.open('', 'New Window', 'width=400,height=400');
      var boxes = ['box1', 'box2', 'box3', 'box4'].map(function(id) {
        var box = win.document.createElement('input');
        box.type = 'text';
        box.id = id;
        return box;
      });
      var confirmBtn = win.document.createElement('button');
      confirmBtn.innerHTML = 'Confirm';
      confirmBtn.addEventListener('click', function() {
        var values = boxes.map(function(box) {
          return box.value;
        });
        localStorage.setItem('box1', values[0]);
        localStorage.setItem('box2', values[1]);
        localStorage.setItem('box3', values[2]);
        localStorage.setItem('box4', values[3]);
        win.close();
      });
      win.document.body.appendChild(boxes);
      win.document.body.appendChild(confirmBtn);
    }*/
});

//网页失焦
window.addEventListener('blur', function() {
    switchStatus = 1;
    if(switchFocusStatus){
        saveState(switchStatus,gearIndex);
    }
    clearDownInterval();
    messageShow( "已暂停",'tick');
});


function startDownInterval(){
    // 每隔1秒执行一次自动下滑翻页操作
    var downInterval = setInterval(function() {
        // 检查开关的状态
        if (switchStatus == 0 && nextUrlLink != null) {
            // 获取当前滚动位置
            var scrollPos = window.scrollY || document.documentElement.scrollTop;

            // 滚动到底部时触发翻页操作
            if (scrollPos >= document.body.scrollHeight - window.innerHeight -50) {
                // 执行翻页操作
                saveState(switchStatus,gearIndex);
                switchStatus = 1;
                nextUrlLink.click();
            } else {
                // 向下滚动一定距离
                window.scrollBy(0, gears[gearIndex]); // 这里的100可以替换为您想要滚动的距离
            }
        }
    }, 10); // 表示每隔0.01秒执行一次
}

//清除定时器，实际上没有做到
function clearDownInterval(){
    //console.log("123");
    clearInterval(startInterval);
}

function saveState(switchStatus, gearIndex) {
    localStorage.setItem('switchStatus', switchStatus);
    localStorage.setItem('gearIndex', gearIndex);
}


// My Message 实现类似this.$message的效果
class Message {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'messageContainer';
        this.container.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; justify-content: center; z-index: 9999;';
        document.body.appendChild(this.container);
    }
    show(message, iconType) {
        const p = document.createElement('p');
        p.style.cssText = 'margin: 10px; padding: 10px; background-color: #f5f5f5; border-radius: 4px; display: flex; align-items: center;';
        let icon;
        if (iconType === 'tick') {
            icon = document.createElement('span');
            icon.style.cssText = 'width: 16px; height: 16px; background-color: green; border-radius: 50%; margin-right: 10px;';
            const checkmark = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            checkmark.setAttribute("viewBox", "0 0 24 24");
            checkmark.setAttribute("width", "16");
            checkmark.setAttribute("height", "16");
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M9 16.2l-3.6-3.6c-.8-.8-.8-2 0-2.8s2-.8 2.8 0L9 11.6l6.2-6.2c.8-.8 2-.8 2.8 0s.8 2 0 2.8L11.8 16.2c-.4.4-.8.6-1.3.6-.5 0-.9-.2-1.3-.6z");
            path.setAttribute("fill", "white");
            checkmark.appendChild(path);
            icon.appendChild(checkmark);
        } else {

            icon = document.createElement('span');
            icon.style.cssText = 'width: 16px; height: 16px; background-color: red; border-radius: 50%; margin-right: 10px;';
        }
        p.appendChild(icon);
        const text = document.createTextNode(message);
        p.appendChild(text);
        this.container.appendChild(p);
        setTimeout(() => {
            this.container.removeChild(p);
        }, 1000);
    }
}
