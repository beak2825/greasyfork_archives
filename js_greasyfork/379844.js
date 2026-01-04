// ==UserScript==
// @name         Steam 好友动态自动点赞
// @namespace    https://steamcommunity.com/id/GarenMorbid/
// @version      1.6
// @description  让Steam成为动态朋友圈，为她/他点赞o(￣▽￣)ｄ
// @author       Garen
// @match        http*://steamcommunity.com/id/*/home
// @match        http*://steamcommunity.com/profiles/*/home
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379844/Steam%20%E5%A5%BD%E5%8F%8B%E5%8A%A8%E6%80%81%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/379844/Steam%20%E5%A5%BD%E5%8F%8B%E5%8A%A8%E6%80%81%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    // 获取添加按钮的父元素
    var parentNode = document.getElementsByClassName('blotter_page_title');
    // 创新点赞按钮
    var thumbsUpBtn = document.createElement("div");
    // 给点赞按钮添加各种样式与排版
    thumbsUpBtn.setAttribute("style","float:right;margin-right: 3%;margin-top: -2%;");
    thumbsUpBtn.innerHTML = '<div id="thumbsUpBtn" style="border-radius:2px;border:0;padding:1px;display:inline-block;cursor:pointer;text-decoration:none!important;color:#fff!important;background:#acb5bd;background:-webkit-linear-gradient(top,#acb5bd 5%,#414a52 95%);background-color: #21D4FD;background-image: linear-gradient(19deg, #21D4FD 0%, #B721FF 100%);"><span style="line-height: 22px;margin:0 10px 0 10px;font-size:13px;">为他们点赞！</span></div>';
    // 将点赞按钮添加到页面
    parentNode[0].appendChild(thumbsUpBtn);
    // 绑定点击事件
    document.getElementById('thumbsUpBtn').onclick = function thumbsUp(){
        // 批量点赞，支持好友动态以及评测动态
        var list = document.getElementsByClassName('thumb_up');
        // 需要点赞的动态数
        var count = 0;
        // 循环遍历点赞
        for(var i = 0;i < list.length; i++){
            if (list[i].parentNode.parentNode.getAttribute('class').indexOf('active') == -1) {
                list[i].click();
                count++;
            }
        }
        // 添加友好提示
        if (count != 0) {
            alert("已经为你点赞" + count + "动态~");
            console.log("%c已经为你点赞" + count + "动态~ By Garen","color:white;font-weight:bold;font-family:'微软雅黑';background:#000;padding:5px;");
        } else {
            alert("目前没有动态可以点赞，请稍后再来~");
            console.log("%c目前没有动态可以点赞，请稍后再来~ By Garen","color:white;font-weight:bold;font-family:'微软雅黑';background:#000;padding:5px;");
        }
    }
})();