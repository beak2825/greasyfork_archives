// ==UserScript==
// @name          csdn自动踩
// @namespace     https://blog.csdn.net/mukes
// @version       1.3
// @description  打开博文，点击自动踩+评论前提是已经登录 csdn 账户
// @author       mukes
// @include      *://blog.csdn.net/*/article/details/*
// @include      *.blog.csdn.net/article/details/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444613/csdn%E8%87%AA%E5%8A%A8%E8%B8%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/444613/csdn%E8%87%AA%E5%8A%A8%E8%B8%A9.meta.js
// ==/UserScript==
(function() {
var comment=["不怎么样","没用","一点用没用","看跟没看一样","后悔打开了这个文章","根本不行","😠全是废话"];
        var STARTNUMBER = -1;
        var ENDNUMBER = 5;
        var temp_count = Math.floor(Math.random()*(STARTNUMBER-ENDNUMBER+1))+ENDNUMBER ;//取STARTNUMBER-ENDNUMBER之间的随机数 [STARTNUMBER,ENDNUMBER]
 
        document.getElementsByClassName("tool-item-comment")[0].click(); //打开评论区
        document.getElementById("comment_content").value = comment[temp_count]; //随机把一条预先写好的评论赋值到评论框里面
        document.getElementsByClassName("btn-comment")[0].click(); //发表评论
        document.getElementsByClassName("tool-item-comment")[0].click(); //打开评论区
        document.getElementById("comment_content").value = comment[temp_count]; //随机把一条预先写好的评论赋值到评论框里面
        document.getElementsByClassName("btn-comment")[0].click(); //发表评论
        document.getElementsByClassName("tool-item-comment")[0].click(); //打开评论区
        document.getElementById("comment_content").value = comment[temp_count]; //随机把一条预先写好的评论赋值到评论框里面
        document.getElementsByClassName("btn-comment")[0].click(); //发表评论
        document.getElementById("is-unlike").click() //踩。把该代码注释后只会一键评论
})(); //(function(){})() 表示该函数立即执行