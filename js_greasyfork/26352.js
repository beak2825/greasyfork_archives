// ==UserScript==
// @name         MACD 哈楼 评分 v2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to take over the world!
// @author       蓝烟火蓝烟
// @include      http://bbs.macd.cn/*
// @match
// @grant
// @downloadURL https://update.greasyfork.org/scripts/26352/MACD%20%E5%93%88%E6%A5%BC%20%E8%AF%84%E5%88%86%20v20.user.js
// @updateURL https://update.greasyfork.org/scripts/26352/MACD%20%E5%93%88%E6%A5%BC%20%E8%AF%84%E5%88%86%20v20.meta.js
// ==/UserScript==

//感谢哈师（目标哈佛）感谢各位师兄师姐师弟师妹，是你们的精神支撑着我，让一位机械工程师又更新了这段代码，最后感谢google


//             蓝烟火蓝烟  2017.1.7
//使用方法：在MACD论坛点击“评分”弹出评分框后，在非评分框的空白处点击左键，可完成 奖励 热心 评分理由（可自定义） （金币我还没有权限不能读到代码）的自动填写

(function() {
    var a1="MACD有楼主更精彩！^_^";
    var a2="我很赞同^_^";
    var a3="助人为乐^_^";
    var a4="感谢分享^_^";
    var a5="股市精华^_^";
    var a6="分析的有道理，学习了，请收下我的小红花！";
    var a7="不愧为股市达人，顶！";
    var a8="看完楼主的帖子，我的心情竟是久久不能平复！太棒了！";
    var a9="观点独特，佩服佩服！";
    var a10="楼主，你写得实在是太好了。我唯一能做的，就只有送上我的谢意！";
    var a11="就算是路过，也要给你加分！";
    var a12="楼主就是我○像！！！";
    var a13="果然是高手！！！";


      //自定义部分开始-----------------------------------------------------------------------------------------------------------------------
    var fen2 = 3;                                        //单击评分   奖励要加的分数，注意，不要超过自己的评分限制
    var fen3 = 1;                                       //单击评分   热心要加的分数，注意，不要超过自己的评分限制
    var liyou ="每天多一点开心快乐！^_^";               //单击评分内容，修改引号中的内容"XXXX"（可以自已写内容） 或 a1 或 a13，注意，有最少字数限制

    var Dfen2 = 8;                                        //双击评分   奖励要加的分数，注意，不要超过自己的评分限制
    var Dfen3 = 3;                                       //双击评分   热心要加的分数，注意，不要超过自己的评分限制
    var Dliyou ="每天多一点开心快乐！^_^";               //双击评分内容，修改引号中的内容"XXXX"（可以自已写内容） 或 a1 或 a13，注意，有最少字数限制
    var zihao="medium";                   //字体大小 手机中看字太小  后面字号从小到大排列  xx-small//x-small//small//medium//large//x-large//xx-large
    //自定义部分结束---------------------------------------------------------------------------------------------------------------------------


    var class1 = document.getElementsByClassName("t_f");
    //console.log(class1.length);

    for (var i=0;i<class1.length;i++)
    {
        class1[i] .style.fontSize=zihao; 
    }



    document.onclick = aaa;
    function aaa(){
        var jiangli = document.getElementById("score2");
        if(!jiangli)
        {
            console.log("评分窗口未打开！");
        }
        else
        {
            console.log(jiangli);
            jiangli.value=fen2;
            var rexin = document.getElementById("score3").value=fen3;
            $('reason').value = liyou+"..";
            $('reason').readOnly=false;
        }
    }


    document.ondblclick = bbb;
    function bbb(){
        var jiangli = document.getElementById("score2");
        if(!jiangli)
        {
            console.log("评分窗口未打开！");
        }
        else
        {
            console.log(jiangli);
            jiangli.value=Dfen2;
            var rexin = document.getElementById("score3").value=Dfen3;
            $('reason').value = Dliyou+"..";
            $('reason').readOnly=false;
        }
    } 


})();
