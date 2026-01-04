// ==UserScript==
// @name         问卷星填写
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  问卷星自动填写部分题型
// @author       YYdny
// @match        https://www.wjx.cn/vm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461081/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/461081/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //默认存储22个题
    var arr = ["div1", "div2", "div3", "div4", "div5", "div6", "div7", "div8", "div9", "div10", "div11"
        , "div12", "div13", "div14", "div15", "div16", "div17", "div18", "div19", "div20", "div21", "div22"];

    //二维数组存储填空题答案
    var date = [[ "宽容","耐心","爱心","会欣赏","会赞美","会理解","平等","学会尊重"],
    ["代晓清", "谢帮伟", "许飞", "游君臣","李婧晖"],
    ["课程安排不合理", "上课内容不充实", "上课单调", "课程衔接太差", "专业性不强也不专一"],
    ["合理安排和专业相关的专业", "课程衔接希望能优化", "加强培养方向和专业相关性"]];

    // 存储填空题中的题干的  唯一  关键字 ！！！一定要和二维数组date里的答案相对应
    // 例如：
    // 品牌———————["华为", "vivo", "OPPO", "苹果", "三星", "荣耀", "iQOO", "小米", "一加", "努比亚", "红米", "Moto", "诺基亚"]
    // 因素——————["外观", "功能", "配置", "厂商"]
    var mathStr = ["品质", "优秀", "不满意", "建议"];
    var mathFail = [];
    var answNumTem;
    var exQues;
    var quesNum;
    var ansNum;

    window.onload = function () {
        quesNum = document.querySelector('fieldset').children.length;
        while (quesNum > 22) {
            for (var x = 22; x <= quesNum; x++) {
                exQues = "div" + x;
                arr.push(exQues);
            }
            break;
        }
        try {
            FillQues();
            Submit();
        } catch (err) {
            console.log(err)
        }
        finally {
            Submit();
        }
        while (mathFail.length != 0) {
            ReadFailText();
            break;
        }
    }
    function FillQues() {
        for (var i = 0; i < arr.length; i++) {
            var multpText = document.getElementById(arr[i]).children[0].innerText.indexOf("多选题")
            if (multpText >= 0) {
                lostOther(i);
                for (var j = 0; j < 3; j++) {
                    SelectOp(i);
                }
            }
            else {
                var InpuText = document.getElementById(arr[i]).children[1].children[0].tagName;
                if (InpuText == 'INPUT') {
                    var textNull = true;
                    for (var n = 0; n <= mathStr.length; n++) {
                        var indexInput = document.getElementById(arr[i]).children[0].innerText.indexOf(mathStr[n]);
                        if (indexInput >= 0) {
                            var x = Math.floor((Math.random() * date[n].length));
                            document.getElementById(arr[i]).children[1].children[0].value = date[n][x];
                            textNull = false;
                            break;
                        }
                        else {
                            document.getElementById(arr[i]).children[1].children[0].value = "无";
                        }

                    }
                    while (textNull) {
                        var quesLen = document.getElementById(arr[i]).children[0].innerText;
                        mathFail.push(quesLen.slice(0, quesLen.length - 2) + "___未匹配到关键字");
                        break;
                    }
                }
                else {
                    lostOther(i);
                    SelectOp(i);
                }
            }
        }
    }

    function Submit() {

        var isClickVerfy = true;
        var interval = setInterval(function () {
            while (document.getElementsByClassName('layui-layer-content')[0] ? true : false) {
                document.getElementsByClassName("layui-layer-btn1")[0].click();
                break;
            }
            while (document.getElementById("SM_TXT_1") ? true : false && isClickVerfy) {
                document.getElementById("SM_TXT_1").click();
                isClickVerfy = false;
                break;
            }
            while (document.getElementsByClassName('nc-lang-cnt') ? true : false) {
                setTimeout(function () {
                    clearInterval(interval);
                    VerifyCheck();
                }, 2000)
                break;
            }
        }, 500)
        document.getElementById('ctlNext').click();
    }
    function ReadFailText() {
        var totalText = mathFail[0];
        for (var i = 1; i < mathFail.length; i++) {
            totalText += mathFail[i] + "\n";
        }
        alert(totalText);
        console.log(totalText);
    }
    function lostOther(i) {
        answNumTem = document.getElementById(arr[i]).children[1].children.length;
        ansNum = answNumTem;
        for (var m = 0; m < answNumTem; m++) {
            while (document.getElementById(arr[i]).children[1].children[m].innerText.indexOf("其他") >= 0) {
                --ansNum;
                break;
            }
        }
    }

    function SelectOp(n) {
        var index = Math.floor((Math.random() * ansNum));
        document.getElementById(arr[n]).children[1].children[index].click();
    }

    function VerifyCheck() {
        var btn = document.querySelector(".nc_iconfont.btn_slide");
        var mousedown = document.createEvent('MouseEvents');
        var rect = btn.getBoundingClientRect();
        var x = rect.x;
        var y = rect.y;
        mousedown.initMouseEvent('mousedown', true, true, window, 0,
            x, y, x, y, false, false, false, false, 0, null);
        btn.dispatchEvent(mousedown);

        var offsetX = 0;
        var interval = setInterval(function () {
            var mousemove = document.createEvent('MouseEvents');
            var currentX = x + offsetX;
            mousemove.initMouseEvent('mousemove', true, true, window, 0,
                currentX, y, currentX, y, false, false, false, false, 0, null);
            btn.dispatchEvent(mousemove);
            if (currentX - x >= 260) {
                clearInterval(interval);
                var mouseup = document.createEvent('MouseEvents');
                mouseup.initMouseEvent('mouseup', true, true, window, 0,
                    currentX, y, currentX, y, false, false, false, false, 0, null);
                btn.dispatchEvent(mouseup);
            }
            else {
                offsetX += Math.ceil(Math.random() * 50);

            }
        }, 60);
    }
})();