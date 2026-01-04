// ==UserScript==
// @name         宇润-CSDN免登录展开
// @namespace    http://www.yurunsoft.com/
// @version      1.3
// @description  CSDN免登录展开，无视登录倒计时，基于gorgias的代码开发
// @author       Yurun
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://bbs.csdn.net/topics/*
// @grant        none
// @icon         https://csdnimg.cn/public/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/375209/%E5%AE%87%E6%B6%A6-CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/375209/%E5%AE%87%E6%B6%A6-CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==



(function() {
    'use strict';
    //重写id下的style属性
    var article = document.getElementById("article_content");
    if(article)
    {
        article.style = "height: max; overflow: hidden;";
    }

    //删除上层div视觉样式
    var readmore=document.getElementById("btn-readmore");
    if(readmore && readmore.parentNode && readmore.parentNode.parentNode)
    {
        readmore.parentNode.parentNode.removeChild(readmore.parentNode);
    }

    // 去除强制登录倒计时弹框
    var tmpIntervalIndex = setInterval(function(){
        var bg = document.getElementsByClassName('check-adblock-bg')[0];
        if(bg)
        {
            var tIndex = setInterval(function(){}, 1000);
            // 清除跳转倒计时
            for(var i = 0; i <= tIndex; ++i)
            {
                clearInterval(i);
            }
            // 隐藏倒计时框
            bg.style.display = 'none';
            var adb = document.getElementsByClassName('adblock')[0];
            // 隐藏顶部adblock提示
            adb.style.display = 'none';
            clearInterval(tmpIntervalIndex);
        }
    }, 100);
})();