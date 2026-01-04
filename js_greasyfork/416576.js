// ==UserScript==
// @name          CSDN 手动一键点赞评论
// @namespace     https://blog.csdn.net/SoULikeMe?spm=1010.2135.3001.5343
// @version       0.0.5
// @description  打开博文，点击一键点赞评论按钮后自动为该博文点赞以及评论，(前提是已经登录 csdn 博客)
// @author       bolin-zhao
// @include      *://blog.csdn.net/*/article/details/*
// @include      *.blog.csdn.net/article/details/*
// @downloadURL https://update.greasyfork.org/scripts/416576/CSDN%20%E6%89%8B%E5%8A%A8%E4%B8%80%E9%94%AE%E7%82%B9%E8%B5%9E%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/416576/CSDN%20%E6%89%8B%E5%8A%A8%E4%B8%80%E9%94%AE%E7%82%B9%E8%B5%9E%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var button = document.createElement("button"); //创建一个按钮
    button.textContent = "一键点赞评论"; //按钮内容
    button.style.width = "100px"; //按钮宽度
    button.style.height = "28px"; //按钮高度
    button.style.align = "center"; //文本居中
    button.style.color = "white"; //按钮文字颜色
    button.style.background = "#e33e33"; //按钮底色
    button.style.border = "1px solid #e33e33"; //边框属性
    button.style.borderRadius = "4px"; //按钮四个角弧度
    button.addEventListener("click", clickButton) //监听按钮点击事件

    function clickButton(){
        setTimeout(function(){

        var comment=["您写的是真的好,比我强多了,能否指点一下?",
"博主，我们互粉吧，大家一起加油，一起努力进步呀？",
"博主是男生女生? 写的真的爆赞,有空来我博客指点一下好吧?",
"朋友,你写的真真好,能互相认识一下吗?",
"哇塞，学习到了！在CSDN居然能看到这么好的文章，博主的水平让我感觉遇到了知己！b（￣▽￣）d",
"本文灰常得不错(￣ˇ￣)，博主多大了? 这么厉害！(=￣ω￣=)",
"感谢博主的分享,你真是太帅了,想认识你呀！(^ ^)／▽▽＼(^ ^)",
"感谢博主，你的文章让我得到一些收获,希望能交个朋友好么?(￣ˇ￣)",
"听说，这个博主不仅长得很帅，而且写得一手好文章，认识一下好吗?",
"真的很烦有些女孩子问这个博主多大，你自己坐上来不就知道了?",
"博主，你不要以为自己有几分姿色就了不起，你这种男孩子，我见一个赞一个。",
"前女友结婚，请博主去喝酒，总觉得应该做些什么事，在敬酒的时候，博主对新郎说：“新娘很漂亮，我先干了。",
"这个博主一直很苦恼自己丁丁很短，于是他去学了拉丁舞。",
"自从我关注了这个博主，身体倍儿棒，吃嘛嘛香，最近还升职了技术总监，老板天天给我推车"];
        var STARTNUMBER = -1;
        var ENDNUMBER = 12;
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
