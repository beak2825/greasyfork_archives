// ==UserScript==
// @name         禁用开发者工具(完美)
// @namespace    none
// @version      23.8.20
// @description  none
// @author       You
// @match        *://*/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470787/%E7%A6%81%E7%94%A8%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7%28%E5%AE%8C%E7%BE%8E%29.user.js
// @updateURL https://update.greasyfork.org/scripts/470787/%E7%A6%81%E7%94%A8%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7%28%E5%AE%8C%E7%BE%8E%29.meta.js
// ==/UserScript==
 
/*(function() {
    // 定义一个变量，用于表示代码是否开启
    var enabled = true;

    // 创建一个提示元素
    var tip = document.createElement("div");
    tip.style.position = "fixed";
    tip.style.left = "10px";
    tip.style.bottom = "10px";
    tip.style.padding = "10px";
    tip.style.backgroundColor = "#eee";
    document.body.appendChild(tip);

    // 定义一个函数，用于更新提示信息
    function updateTip() {
        if (enabled) {
            tip.textContent = "NO";
        } else {
            tip.textContent = "YES";
        }
    }

    // 更新提示信息
    updateTip();

    // 定义一个函数，用于获取缓存中的窗口高度和宽度
    function getCacheSize() {
        // 如果代码没有开启，直接返回
        if (!enabled) return;
        // 从localStorage中获取缓存的高度和宽度
        var h = localStorage.getItem("windowHeight");
        var w = localStorage.getItem("windowWidth");
        // 从localStorage中获取缓存的日期
        var date = localStorage.getItem("windowDate");
        // 获取当前的日期
        var today = new Date().toDateString();
        // 如果缓存不存在，或者缓存的日期不是今天，说明是第一次获取
        if (!h || !w || !date || date != today) {
            // 获取当前窗口的高度和宽度
            h = window.innerHeight;
            w = window.innerWidth;
            // 将当前窗口的高度和宽度存入缓存
            localStorage.setItem("windowHeight", h);
            localStorage.setItem("windowWidth", w);
            // 将当前的日期存入缓存
            localStorage.setItem("windowDate", today);
        }
        // 返回缓存的高度和宽度
        return {h: h, w: w};
    }

    // 定义一个函数，用于延迟200毫秒后再次获取窗口的宽度和高度，并判断是否需要关闭窗口或者重新加载页面
    function checkWindowSize() {
        // 如果代码没有开启，直接返回
        if (!enabled) return;
        // 输出代码开始的信息
        console.log("方法二提示:开始运行checkWindowSize函数");
        // 延迟200毫秒后再次获取窗口的宽度和高度
        setTimeout(function(){
            var newH = window.innerHeight, newW = window.innerWidth;
            // 输出延迟3秒后获取到的新的宽度和高度
            console.log("方法二提示:延迟3秒后获取到的新的窗口高度是：" + newH + "px");
            console.log("方法二提示:延迟3秒后获取到的新的窗口宽度是：" + newW + "px");
            // 如果宽度或高度有变化，说明开发者工具被打开了
            if (newH != size.h || newW != size.w) {
                // 输出开发者工具被打开了的信息
                console.log("方法二提示:开发者工具被打开了");
                // 方法一：关闭当前窗口
                window.close();
            } else {
                // 输出开发者工具没有被打开了的信息
                console.log("方法二提示:开发者工具没有被打开");
            }
        }, 200);
        // 输出代码结束的信息
        console.log("方法二提示:结束运行checkWindowSize函数");
    }

    // 调用函数，获取缓存中的窗口高度和宽度
    var size = getCacheSize();
    // 在控制台输出高度和宽度
    console.log("方法二提示:窗口的高度是：" + size.h + "px");
    console.log("方法二提示:窗口的宽度是：" + size.w + "px");
    // 延迟3秒后调用checkWindowSize函数
    setTimeout(checkWindowSize,100);

    //--------------------------------------------

    //禁用打开开发者工具(方法二:简单版)
    // 获取当前窗口的宽度和高度
    var h = window.innerHeight, w = window.innerWidth;
    // 在控制台输出高度和宽度
    console.log("窗口的高度是：" + h + "px");
    console.log("窗口的宽度是：" + w + "px");
    // 监听窗口大小变化事件
    window.onresize = function () {
        // 如果代码没有开启，直接返回
        if (!enabled) return;
        // 再次获取窗口的宽度和高度
        var newH = window.innerHeight, newW = window.innerWidth;
        // 如果宽度或高度有变化，说明开发者工具被打开了
        if (h != newH || w != newW) {
            //此时立即关闭当前窗口
            window.close();
        }
    };

    //===========上面方法二两个版本配合使用可完美"禁用开发者工具"================


    // 定义一个函数，用于处理键盘事件
    function handleKeyDown(event) {
        // 判断是否按下了 Ctrl 键和数字 2 键
        if (event.ctrlKey && event.keyCode === 50) {
            // 如果按下了 Ctrl 键和数字 2 键，切换代码的开启状态
            enabled = !enabled;
            // 更新提示信息
            updateTip();
        }
    }

    // 监听键盘事件
    document.addEventListener("keydown", handleKeyDown);

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// 定义一个函数，用于清除窗口的宽度和高度缓存
function clearCacheSize() {
    // 输出开始清除缓存的信息
    console.log("开始清除缓存");
    // 从localStorage中删除缓存的高度和宽度
    localStorage.removeItem("windowHeight");
    localStorage.removeItem("windowWidth");
    // 输出已经删除缓存的高度和宽度的信息
    console.log("已经删除缓存的高度和宽度");
    // 从localStorage中删除缓存的日期
    localStorage.removeItem("windowDate");
    // 输出已经删除缓存的日期的信息
    console.log("已经删除缓存的日期");
    // 输出结束清除缓存的信息
    console.log("结束清除缓存");

    // 在页面的右下角显示提示信息
    var tip = document.createElement("div");
    tip.textContent = "已清除缓存";
    tip.style.position = "fixed";
    tip.style.right = "10px";
    tip.style.bottom = "10px";
    tip.style.padding = "10px";
    tip.style.backgroundColor = "#eee";
    document.body.appendChild(tip);
}

// 定义一个函数，用于处理键盘事件
function handleKeyDown2(event) {
    // 输出当前按下的键的信息
    console.log("按下了键：" + event.key);
    // 判断是否按下了 Ctrl 键和数字 3 键
    if (event.ctrlKey && event.keyCode === 51) {
        // 输出按下了 Ctrl 键和数字 3 键的信息
        console.log("按下了 Ctrl 键和数字 3 键");
        // 如果按下了 Ctrl 键和数字 3 键，调用 clearCacheSize 函数
        clearCacheSize();
    } else {
        // 输出没有按下 Ctrl 键和数字 3 键的信息
        console.log("没有按下 Ctrl 键和数字 3 键");
    }
}

// 监听键盘事件
document.addEventListener("keydown", handleKeyDown2);


})();*/