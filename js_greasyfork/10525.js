// ==UserScript==
// @name        去网易博客顶栏和尾栏
// @author      我喜欢的那女孩
// @description 去除网易博客未登录时讨厌的上下栏
// @include     http://*.blog.163.com/*
// @include     http://blog.163.com/*
// @version     0.1
// @grant       none
// allow pasting
// @namespace https://greasyfork.org/users/12554
// @downloadURL https://update.greasyfork.org/scripts/10525/%E5%8E%BB%E7%BD%91%E6%98%93%E5%8D%9A%E5%AE%A2%E9%A1%B6%E6%A0%8F%E5%92%8C%E5%B0%BE%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/10525/%E5%8E%BB%E7%BD%91%E6%98%93%E5%8D%9A%E5%AE%A2%E9%A1%B6%E6%A0%8F%E5%92%8C%E5%B0%BE%E6%A0%8F.meta.js
// ==/UserScript==

//remove top
document.getElementById('blog-163-com-topbar').style.display = 'none';

//remove fixbar
setTimeout(function(){
    var fixbar = document.querySelector("div.fixedbar");
    if(fixbar !== null){
        fixbar.parentNode.removeChild(fixbar);
        console.log("移除lofter成功");
    }
    else{
        console.log("获取fixbar失败");
    }
}, 3000);

var timer = setInterval(function() {
    var node = document.querySelector('div.m-regGuideLayer');
    if(node !== null){
        node.parentNode.removeChild(node);
        clearInterval(timer);
        console.log("移除底栏成功");
    }
    else{
        console.log("获取元素失败");
    }
    //document.querySelector('div.m-regGuideLayer').style.display = 'none';
}, 2000);
