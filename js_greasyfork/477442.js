// ==UserScript==
// @name           屏蔽百度热搜不闪烁
// @namespace      sj
// @version        1.1
// @description    看你想看的，不受打扰地工作（浏览器屏蔽百度热搜，去百度热搜）
// @match          *://*.baidu.com/*
// @exclude        https://www.baidu.com/
// @run-at         document-start
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/477441/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C%E4%B8%8D%E9%97%AA%E7%83%81.user.js
// @updateURL https://update.greasyfork.org/scripts/477441/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C%E4%B8%8D%E9%97%AA%E7%83%81.meta.js
// ==/UserScript==

/*
页面刷新有两种情况。
1，首次进入页面。
2，异步加载，即点击【百度一下】按钮。
*/
const start = Date.now();

// 幕布计数
var countCurtain = 1;
// 幕布
const curtain = document.createElement('div');
curtain.style = "position: fixed;top: 10%;left: 55%;right: 0;bottom: 0; z-index:9999; background-color:white;";
// 在body里，加幕布
function addCutrain() {
    setTimeout(function () {
        console.log('addCutrain.计数: ' + countCurtain++);
        let body = document.body;
        if (body) {
            body.appendChild(curtain);
            console.log('addCutrain.添加成功');
        } else {
            console.log('addCutrain.body 不存在');
            addCutrain();
        }
    }, 20);
}
// 执行>加幕布
setTimeout(addCutrain, 60);

// 页面局部刷新のhide
function mutationHide() {
    let div = document.getElementById('content_right');
    //判断元素是否存在；判断元素是否可见。
    if (div) {
        if (div.style.visibility === 'hidden') {
            console.log('mutationHide.已隐藏');
        } else {
            console.log('mutationHide.执行hide ------ ------ ------');
            div.style.visibility = 'hidden';
        }
    } else {
        console.log('mutationHide.div 不存在');
    }
}

// 执行>onload
window.onload = function () {
    console.log('onload.总耗时: ' + (Date.now() - start));

    // 1，隐藏 content_right 。
    let div = document.getElementById('content_right');
    //判断元素是否存在；判断元素是否可见
    if (div) {
        if (div.style.visibility === 'hidden') {
            console.log('onload.已隐藏');
        } else {
            console.log('onload.执行hide ------ ------ ------');
            div.style.visibility = 'hidden';
        }
    }

    // 2，删除幕布
    curtain.remove();

    // 3，给 wrapper_wrapper 加观察器。异步加载，即点击【百度一下】按钮。
    let mutationObserver = new MutationObserver(function (mutationRecords, observer) {
        mutationHide();
    });
    mutationObserver.observe(document.getElementById('wrapper_wrapper'), {childList: true});
};