// ==UserScript==
// @name         B站失效视频删除自动化脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  自动化脚本思路，可以直接使用，也可以学习b站视频，理解思路
// @author       王子周棋洛
// @match        https://space.bilibili.com/*/video
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450794/B%E7%AB%99%E5%A4%B1%E6%95%88%E8%A7%86%E9%A2%91%E5%88%A0%E9%99%A4%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/450794/B%E7%AB%99%E5%A4%B1%E6%95%88%E8%A7%86%E9%A2%91%E5%88%A0%E9%99%A4%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    // 生成取消收藏按钮
    var btn = document.createElement('button');
    // 按钮文字
    btn.innerText = '取消失效视频收藏';
    // 添加按钮的样式类名class值为deleteBtn
    btn.setAttribute('class', 'deleteBtn');
    // 生成style标签
    var style = document.createElement('style');
    // 把样式写进去
    style.innerText = `.deleteBtn{position:fixed;top:150px;right:15px;width:75px;height:55px;padding:3px 5px;border:1px solid #0d6efd;cursor:pointer;color:#0d6efd;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.deleteBtn:hover{background-color:#0d6efd;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(style);
    // 在body中添加button按钮
    document.body.appendChild(btn);
    // 点击按钮去执行取消收藏函数 deleteV
    document.querySelector('.deleteBtn').addEventListener('click', function () {
        deleteV();
    })

    // 取消收藏函数
    function deleteV() {
        // 获取当前页面收藏的视频的li标签，一页有20个
        var videoLis = document.querySelectorAll(".small-item")
        // 遍历所有收藏
        videoLis.forEach((vli) => {
            // 获取当前视频的标题，已失效视频的标题就是已失效视频
            var titleInfo = vli.children[1].textContent
            // 判断当前视频是不是已失效视频，模拟点击，执行取消收藏
            if (titleInfo === '已失效视频') {
                vli.children[3].children[1].children[0].click()
            }
            // 下一个视频
        })
    }
})();