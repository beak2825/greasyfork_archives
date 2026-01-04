// ==UserScript==
// @name         天津理工大学评教系统快速通关按钮
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  实现天津理工大学的教室评价系统快速通关方法，拒绝手动点击。
// @author       rtmacha
// @match       http://ssfw.tjut.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393968/%E5%A4%A9%E6%B4%A5%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99%E7%B3%BB%E7%BB%9F%E5%BF%AB%E9%80%9F%E9%80%9A%E5%85%B3%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/393968/%E5%A4%A9%E6%B4%A5%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99%E7%B3%BB%E7%BB%9F%E5%BF%AB%E9%80%9F%E9%80%9A%E5%85%B3%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==


//   说明：如果您看到这里，说明您拥有一定的代码基础
//   声明：本脚本仅供学习参考，如移作他用出现任何问题概不负责。
//   本次更新将按钮显示移动到只有打开问卷才会显示

// TODO LIST 增加自动提交选项
//var autoSubmit = false; // 是否自动提交

var score = "0001"; // 标签值为0001，即评价为好（0001~0005对应	  很好      好      一般      尚可      差   ）
var text = "无"; // 这里填写对老师的评价和意见建议

(function() {
    'use strict';

    //或者换成其他自执行函数的写也行，目的就是在dom渲染完毕之后去更新你要更新的属性值
    !(function(){

        AddButton().onclick=function(){
            alert("正在尝试填写评价内容");

            GoodClick(); // 点击好评

            CommentFill(); // 填写文字

            NeedFixed(); // 待解决部分

            alert("请手动点击下一页");
        }
    })();
    function GoodClick(){ // 点击好评
        var muButton = document.getElementsByTagName('input'); // 获取到所有的input标签
        var count = muButton.length; // 记录所有获取的标签的数量
        for(var i = 0; i < count; i++){
            if(muButton[i].value == score){
                muButton[i].click();
            }
        }
    }
    function CommentFill(){ // 填写文字
        var Textareas = document.getElementsByTagName('textarea'); // 获取所有文本框
        var countTexts = Textareas.length; // 获取文本框个数
        for(var iNexts = 0; iNexts < countTexts; iNexts++){
            Textareas[iNexts].value = text;
        }
    }
    function ClickNext() { // 点击下一个
        var nextLink = document.getElementById('nextlink');
        nextLink.click();
    }
    function NeedFixed(){

        for(var nextLinkLoop = 0; nextLinkLoop < 16; nextLinkLoop ++){
            ClickNext();
        }
// 这里由于js不释放控制权，导致浏览器最终加载一次点击，待修复。
        var SubmitButtion = document.getElementsByClassName("saveButton")[0]; // 获取提交按钮
        SubmitButtion.click(); // 点击提交按钮
    }
    function AddButton(){
        var button = document.createElement('input');
        button.type = 'button';
        button.value = "点击这里自动评教";
        button.style.color = "#f9cdad";
        button.style.backgroundColor = "#83af9b";
        button.style.width = "120px";
        button.style.height = "50px";
        button.style.position = "fixed";
        button.style.right = "1%";
        button.id = "ButtonForTpm";
        if(document.getElementById("topic"))
        {
            var ButtonAdded = document.body.appendChild(button);
        }
        return ButtonAdded;
    }
    //alert('end');
})();