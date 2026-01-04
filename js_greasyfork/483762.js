// ==UserScript==

// @name 【tong】新版学习通成绩考试复查助手
// @version 0.5
// @namespace AceScript Scripts
// @description   新版学习通成绩考试复查助手

// @match https://mooc2-ans.chaoxing.com/mooc2-ans/exam/test/markpaper?*
// @match http://mooc2-ans.chaoxing.com/mooc2-ans/exam/test/markpaper?*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483762/%E3%80%90tong%E3%80%91%E6%96%B0%E7%89%88%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%88%90%E7%BB%A9%E8%80%83%E8%AF%95%E5%A4%8D%E6%9F%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/483762/%E3%80%90tong%E3%80%91%E6%96%B0%E7%89%88%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%88%90%E7%BB%A9%E8%80%83%E8%AF%95%E5%A4%8D%E6%9F%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==



(function () {

    'use strict';

    console.log('我的脚本加载了');

    function sub(){
        /*
            //设置提交答案编辑框的高度
            var x = document.getElementsByClassName('edui-editor-iframeholder edui-default');//提交答案的编辑框
            var i;
            for (i = 0; i < x.length; i++) {
                //var ttt;
                //ttt= x[i].children[0].contentDocument.body.children[0].children[0].naturalHeight;
                //x[i].style.height=ttt;
                x[i].style.height="1080px";  //编辑框的高度调整
            }
            */


        //设置右侧悬浮的元素
        var y= document.getElementsByClassName('personalInfor clearfix');//右端姓名悬浮框
        y[0].children[1].children[0].style.fontSize="30px";//姓名
        y[0].children[1].children[1].style.fontSize="30px";//学号

        $(".moreSettingDown").click();//右侧点击“更多设置”

        $(".subjectiveTitleCheck").click();//右侧点击“显示主观题题干”

        $(".subjectiveAnswerCheck").click();//右侧点击“显示主观题正确答案”



        //设置得分框的文本大小
        var DefenkuangElement = document.getElementsByClassName('inputBranch questionScore subScore');//得分框
        var DatikuangElement= document.getElementsByClassName('edui-editor-iframeholder edui-default');//答题框
        //var i;
        for (i = 0; i < DefenkuangElement.length; i++) {
            DefenkuangElement[i].style.height = "60px";
            DefenkuangElement[i].style.fontSize = "40px";
            DefenkuangElement[i].style.fontWeight = 'bold';
            DefenkuangElement[i].style.color = 'red';


            DatikuangElement[i].style.height = "1080px";
        }

    }


    //下面代码是隔一秒后重新刷新一次，保证编辑框加载出图片的原始高度
    var url = location.href; //把当前页面的地址赋给变量 url
    var times = url.split("?"); //分切变量 url 分隔符号为 "?"
    console.log(times);
    if(times[times.length-1] != 1){ //如果?后的值不等于1表示没有刷新
        url += "?1"; //把变量 url 的值加入 ?1
        setTimeout(function(){
            self.location.replace(url); //刷新页面
        },1000)
    }


    //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
    setTimeout(sub,1000);
    var _alert=window.alert;
    window.alert=function(){
        return true;
    }


})();


