// ==UserScript==
// @name          csdn 手动一键点赞评论
// @namespace     https://blog.csdn.net/mukes
// @version       0.0.6
// @description  打开博文，点击一键点赞评论按钮后自动为该博文点赞以及评论，前提是已经登录 csdn 博客
// @author       mukes
// @include      *://blog.csdn.net/*/article/details/*
// @include      *.blog.csdn.net/article/details/*
// @license       AGPL License
// @downloadURL https://update.greasyfork.org/scripts/442611/csdn%20%E6%89%8B%E5%8A%A8%E4%B8%80%E9%94%AE%E7%82%B9%E8%B5%9E%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/442611/csdn%20%E6%89%8B%E5%8A%A8%E4%B8%80%E9%94%AE%E7%82%B9%E8%B5%9E%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var button = document.createElement("button"); //创建一个按钮
    button.textContent = "一键点赞评论"; //按钮内容
    button.style.width = "90px"; //按钮宽度
    button.style.height = "28px"; //按钮高度
    button.style.align = "center"; //文本居中
    button.style.color = "white"; //按钮文字颜色
    button.style.background = "#fc5531"; //按钮底色
    button.style.border = "1px solid #fc5531"; //边框属性
    button.style.borderRadius = "14px"; //按钮四个角弧度
    button.addEventListener("click", clickBotton) //监听按钮点击事件

    function clickBotton(){
        setTimeout(function(){

        var comment=["针不戳呀，写的针不戳！","学习了！b（￣▽￣）d","本文不错(￣ˇ￣)，值得学习！(=￣ω￣=)","感谢博主的分享！(^ ^)／▽▽＼(^ ^)","感谢博主，你的文章让我得到一些收获！(￣ˇ￣)"];
        var STARTNUMBER = -1;
        var ENDNUMBER = 5;
        var temp_count = Math.floor(Math.random()*(STARTNUMBER-ENDNUMBER+1))+ENDNUMBER ;//取STARTNUMBER-ENDNUMBER之间的随机数 [STARTNUMBER,ENDNUMBER]

        document.getElementsByClassName("tool-item-comment")[0].click(); //打开评论区
        document.getElementById("comment_content").value = comment[temp_count]; //随机把一条预先写好的评论赋值到评论框里面
        document.getElementsByClassName("btn-comment")[0].click(); //发表评论
        document.getElementById("is-like").click() //点赞。把该代码注释后只会一键评论

},100);// setTimeout 0.1秒后执行
    }


    var like_comment = document.getElementsByClassName('toolbox-list')[0]; //getElementsByClassName 返回的是数组，所以要用[] 下标
    like_comment.appendChild(button); //把按钮加入到 x 的子节点中

})(); //(function(){})() 表示该函数立即执行
