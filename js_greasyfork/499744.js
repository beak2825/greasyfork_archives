// ==UserScript==
// @name         物理新版学习通考试平台批改试卷助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  物理新版学习通考试平台批改试卷助手-放大答案
// @author       YouYou
// @match        http://xueya.chaoxing.com/*
// @match        https://xueya.chaoxing.com/*
// @grant        GM_addStyle
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/499744/%E7%89%A9%E7%90%86%E6%96%B0%E7%89%88%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%80%83%E8%AF%95%E5%B9%B3%E5%8F%B0%E6%89%B9%E6%94%B9%E8%AF%95%E5%8D%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/499744/%E7%89%A9%E7%90%86%E6%96%B0%E7%89%88%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%80%83%E8%AF%95%E5%B9%B3%E5%8F%B0%E6%89%B9%E6%94%B9%E8%AF%95%E5%8D%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // console.log('我的脚本加载了');



    let inputLabel = document.getElementsByClassName('el-input__inner');  //找到评分框

    var button0 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button0.setAttribute("type", "button");
    button0.setAttribute("value", "0");
    button0.setAttribute("style", "right: 370px;top: 650px;background: #004f98;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 60px;height: 60px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;");

    $("body").append(button0);

    button0.onclick = function (){
        inputLabel[0].value =0;
        var event = document.createEvent('HTMLEvents');
        event.initEvent("change", true, true);
        inputLabel[0].dispatchEvent(event);
    };

    var button1 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button1.setAttribute("type", "button");
    button1.setAttribute("value", "1");
    button1.setAttribute("style", "right: 300px;top: 650px;background: #004f98;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 60px;height: 60px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;");

    $("body").append(button1);

    button1.onclick = function (){
        inputLabel[0].value =1;
        var event = document.createEvent('HTMLEvents');
        event.initEvent("change", true, true);
        inputLabel[0].dispatchEvent(event);
    };

    var button2 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button2.setAttribute("type", "button");
    button2.setAttribute("value", "2");
    button2.setAttribute("style", "right: 230px;top: 650px;background: #004f98;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 60px;height: 60px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;");

    $("body").append(button2);

    button2.onclick = function (){
        inputLabel[0].value =2;
        var event = document.createEvent('HTMLEvents');
        event.initEvent("change", true, true);
        inputLabel[0].dispatchEvent(event);
    };

    var button3 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button3.setAttribute("type", "button");
    button3.setAttribute("value", "3");
    button3.setAttribute("style", "right: 160px;top: 650px;background: #004f98;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 60px;height: 60px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;");

    $("body").append(button3);

    button3.onclick = function (){
        inputLabel[0].value =3;
        var event = document.createEvent('HTMLEvents');
        event.initEvent("change", true, true);
        inputLabel[0].dispatchEvent(event);
    };

    var button4 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button4.setAttribute("type", "button");
    button4.setAttribute("value", "4");
    button4.setAttribute("style", "right: 90px;top: 650px;background: #004f98;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 60px;height: 60px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;");

    $("body").append(button4);

    button4.onclick = function (){
        inputLabel[0].value =4;
        var event = document.createEvent('HTMLEvents');
        event.initEvent("change", true, true);
        inputLabel[0].dispatchEvent(event);
    };



    var button5 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button5.setAttribute("type", "button");
    button5.setAttribute("value", "5");
    button5.setAttribute("style", "right: 370px;top: 720px;background: #004f98;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 60px;height: 60px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;");

    $("body").append(button5);

    button5.onclick = function (){
        inputLabel[0].value =5;
        var event = document.createEvent('HTMLEvents');
        event.initEvent("change", true, true);
        inputLabel[0].dispatchEvent(event);
    };

    var button6 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button6.setAttribute("type", "button");
    button6.setAttribute("value", "6");
    button6.setAttribute("style", "right: 300px;top: 720px;background: #004f98;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 60px;height: 60px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;");

    $("body").append(button6);

    button6.onclick = function (){
        inputLabel[0].value =6;
        var event = document.createEvent('HTMLEvents');
        event.initEvent("change", true, true);
        inputLabel[0].dispatchEvent(event);
    };

    var button7 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button7.setAttribute("type", "button");
    button7.setAttribute("value", "7");
    button7.setAttribute("style", "right: 230px;top: 720px;background: #004f98;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 60px;height: 60px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;");

    $("body").append(button7);

    button7.onclick = function (){
        inputLabel[0].value =7;
        var event = document.createEvent('HTMLEvents');
        event.initEvent("change", true, true);
        inputLabel[0].dispatchEvent(event);
    };

    var button8 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button8.setAttribute("type", "button");
    button8.setAttribute("value", "8");
    button8.setAttribute("style", "right: 160px;top: 720px;background: #004f98;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 60px;height: 60px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;");

    $("body").append(button8);

    button8.onclick = function (){
        inputLabel[0].value =8;
        var event = document.createEvent('HTMLEvents');
        event.initEvent("change", true, true);
        inputLabel[0].dispatchEvent(event);
    };

    var button9 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button9.setAttribute("type", "button");
    button9.setAttribute("value", "9");
    button9.setAttribute("style", "right: 90px;top: 720px;background: #004f98;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 60px;height: 60px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;");

    $("body").append(button9);

    button9.onclick = function (){
        inputLabel[0].value =9;
        var event = document.createEvent('HTMLEvents');
        event.initEvent("change", true, true);
        inputLabel[0].dispatchEvent(event);
    };

    var button10 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button10.setAttribute("type", "button");
    button10.setAttribute("value", "提交 ( Enter )");
    button10.setAttribute("style", "right: 90px;top: 790px;background: #004f98;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 340px;height: 60px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;");

    $("body").append(button10);

    button10.onclick = function (){
        var NowScore = inputLabel[0].value;
        if (NowScore =='0.0')
        {
            alert("该题没有打分！");
        }
        else {
            document.getElementById('completeClass').click();
        }
    };
    //------------------------------------------

    var button11 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button11.setAttribute("type", "button");
    button11.setAttribute("value", "旋转 ( - )");
    button11.setAttribute("style", "right: 330px;top: 580px;background: #004f98;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 100px;height: 60px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;");

    $("body").append(button11);

    button11.onclick = function (){
        document.getElementsByClassName('rotateLabel rotateLeft')[0].focus();
        document.getElementsByClassName('rotateLabel rotateLeft')[0].click();
        document.getElementsByClassName('rotateLabel rotateLeft')[0].blur();
    };

    var button12 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button12.setAttribute("type", "button");
    button12.setAttribute("value", "画笔 ( + )");
    button12.setAttribute("style", "right: 210px;top: 580px;background: #004f98;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 100px;height: 60px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;");

    $("body").append(button12);

    button12.onclick = function (){
        document.getElementsByClassName('bb')[0].click();
    };

    var button13 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button13.setAttribute("type", "button");
    button13.setAttribute("value", "撤销 ( . )");
    button13.setAttribute("style", "right: 90px;top: 580px;background: #004f98;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 100px;height: 60px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;");

    $("body").append(button13);

    button13.onclick = function (){
        document.getElementsByClassName('withdraw active1')[0].focus();
        document.getElementsByClassName('withdraw active1')[0].click();
        document.getElementsByClassName('withdraw active1')[0].blur();

    };




    //------------------------------------------
    //快捷键
    function button()
    {
        var q = window.event.keyCode;
        var event = document.createEvent('HTMLEvents');

        //----利用小键盘输入分数---------------------------------------
        if(q == 96)//NumPad0键
        {
            inputLabel[0].value =0;
            //var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }
        if(q == 97)//NumPad1键
        {
            inputLabel[0].value =1;
            //var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }

        if(q == 98)//NumPad2键
        {
            inputLabel[0].value =2;
            //var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }

        if(q == 99)//NumPad3键
        {
            inputLabel[0].value =3;
            // var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }

        if(q == 100)//NumPad4键
        {
            inputLabel[0].value =4;
            //var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }
        if(q == 101)//NumPad5键
        {
            inputLabel[0].value =5;
            //var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }

        if(q == 102)//NumPad6键
        {
            inputLabel[0].value =6;
            // var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }

        if(q == 103)//NumPad7键
        {
            inputLabel[0].value =7;
            //var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }

        if(q == 104)//NumPad8键
        {
            inputLabel[0].value =8;
            //var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }

        if(q == 105)//NumPad9键
        {
            inputLabel[0].value =9;
            //var event = document.createEvent('HTMLEvents');
            event.initEvent("change", true, true);
            inputLabel[0].dispatchEvent(event);
        }
        //-------------------------------------------


        if(q == 109)//NumPad-键，逆时针旋转图片
        {
            document.getElementsByClassName('rotateLabel rotateLeft')[0].focus();

            document.getElementsByClassName('rotateLabel rotateLeft')[0].click();

            document.getElementsByClassName('rotateLabel rotateLeft')[0].blur();
        }

        if(q == 110)//NumPad.键，撤销
        {
            document.getElementsByClassName('withdraw active1')[0].focus();

            document.getElementsByClassName('withdraw active1')[0].click();

            document.getElementsByClassName('withdraw active1')[0].blur();
        }
        if(q == 107)//NumPad-键，画笔
        {
            document.getElementsByClassName('bb')[0].click();
        }
        if(q == 13)//NumPad Enter键，完成
        {
            var NowScore = inputLabel[0].value;
            if (NowScore =='0.0')
            {
                alert("该题没有打分！");
            }
            else
            {
                document.getElementById('completeClass').click();
            }
        }
        /*
    if(event.ctrlKey)
	{
		alert("按下了Ctrl键");
	}

	if(q == 75 && event.ctrlKey)//按下 k键+Ctrl键
    {
        //你的代码
    }
    */
    }
    document.onkeydown = button; //当按下按键时，onkeydown调用button函数


//--------------------------------------------------------
    //下面是直接在页面上显示答案

    window.onload = function() {
        // 确保 DOM 已经完全加载
        var elements = document.getElementsByClassName('answersCard');

        // 检查是否找到了至少一个元素
        if (elements.length > 0) {
            // 如果有多个元素，你可能需要遍历它们
            // 这里我们假设只需要修改第一个元素
            var element = elements[0];

            // 修改元素的属性
            element.style="overflow: visible; outline: none;width:600px;"
            //element.width=element.width*2;
            //element.height=element.height*2;

        } else {
            // 如果没有找到元素，你可能想要设置一个定时器来稍后重试
            // 但请注意，这可能会导致无限循环，除非你有明确的退出条件
            // 例如，你可以设置一个最大重试次数
            console.log('没有找到具有指定 class 的元素');
        }
    };


})();