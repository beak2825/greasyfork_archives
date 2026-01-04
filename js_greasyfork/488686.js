// ==UserScript==
// @name         车道线项目脚本
// @namespace    http://tampermonkey.net/
// @version      2024-03-05 yang01
// @description  标注员使用
// @author       You
// @match        https://annotation.bettersmart.net/marking-panel/panel/*
// @match        https://annotation.bettersmart.net/marking-panel/order/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488686/%E8%BD%A6%E9%81%93%E7%BA%BF%E9%A1%B9%E7%9B%AE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/488686/%E8%BD%A6%E9%81%93%E7%BA%BF%E9%A1%B9%E7%9B%AE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

let continueLoop = false;
// 监听键盘按键事件
document.addEventListener('keydown', function(event) {
    if (event.key === 's') {
        // 按下'q'时启动循环
        if (!continueLoop) {
            console.log('开始循环');
            startLoop();
        }
    } else if (event.key == 'x') {
        // 按下除'q'以外的任意键时停止循环
        stopLoop();
    } else if (event.key == 'r'){
        //inX();
        startLoop1();
    } else if (event.key == 'w'){
        dian();
    } else if (event.key == 'v'){
        gong();
        //alert("s == 自动下一帧")
    }else if (event.key == 'q'){
        //pu();
        c();
    }else if (event.key == 'c'){
        gong();
    }else if (event.key == 2){
        pu();
        console.log("选中")
    }else if(event.key == 3){
        gong1();
    }else if(event.key == 4){
        fei();
    }else if(event.key == 5){
        cun();
    }
});


function startLoop() {
    continueLoop = true;
    let count = 0;
    // 使用setInterval替代while循环以避免阻塞UI线程
    const intervalId = setInterval(function() {
        if (!continueLoop) {
            clearInterval(intervalId);
            return;
        }
        var a = document.querySelector("i.el-icon-arrow-right")
        //创建一个按键
        var button = document.createElement('button');
        button.click(a.appendChild(button));
        console.log('循环第' + (++count) + '次');

        // 在这里执行你的循环体代码
    },1300); // 每秒执行一次
}

function stopLoop() {
    console.log('停止循环');
    continueLoop = false;
}

function inX(){
    //找到下一帧按钮元素
    var a = document.querySelector("i.el-icon-arrow-right")
    //创建一个按键
    var button = document.createElement('button');
    //找到这个数据有多少帧
    var bbb = document.getElementsByClassName("info");
    var txtB = bbb[0].innerHTML;
    var TxtB = txtB.split("(");
    var datatxt = TxtB[1].split(")");
    var intTxtB = datatxt[0].split("/")
    var inttxt1 = parseInt(intTxtB[0])
    var inttxt2 = parseInt(intTxtB[1])
    // 添加按钮的点击事件监听器
    //button.addEventListener('click', function() {
    //    alert('按钮被点击了！');
    //});   button.click(a.appendChild(button));
    alert("此功能需要从第一帧开始");
    for (var b = inttxt1;b <= inttxt2; b++ ){
        task(b);

    };
    function task(b){
        setTimeout(function(){
            button.click(a.appendChild(button));
            console.log("循环第",b,"帧");
            if (b == inttxt2){
                var vvv = document.getElementsByClassName("el-button el-button--default el-button--small");
                vvv[1].click();
                if (vvv != null){
                    var a1 = document.querySelector("i.el-icon-arrow-left");
                    var button3 = document.createElement('button');
                    button3.click(a1.appendChild(button3));
                }else{

                }
            }
        },1500*b);
    };
};

function startLoop1() {
    continueLoop = true;
    let count = 0;
    // 使用setInterval替代while循环以避免阻塞UI线程
    const intervalId = setInterval(function() {
        if (!continueLoop) {
            clearInterval(intervalId);
            return;
        }
        //找到下一帧按钮元素
        var a = document.querySelector("i.el-icon-arrow-right")
        //创建一个按键
        var button = document.createElement('button');
        //找到这个数据有多少帧
        var bbb = document.getElementsByClassName("info");
        var txtB = bbb[0].innerHTML;
        var TxtB = txtB.split("(");
        var datatxt = TxtB[1].split(")");
        var intTxtB = datatxt[0].split("/")
        var inttxt1 = parseInt(intTxtB[0])
        var inttxt2 = parseInt(intTxtB[1])
        button.click(a.appendChild(button));
        //console.log("循环第",b,"帧");
        if (inttxt1 == inttxt2){
            var vvv = document.getElementsByClassName("el-button el-button--default el-button--small");
            vvv[1].click();
            if (vvv != null){
                var a1 = document.querySelector("i.el-icon-arrow-left");
                var button3 = document.createElement('button');
                button3.click(a1.appendChild(button3));
            }else{

            }
        }
        console.log('循环第' + (++count) + '次');

        // 在这里执行你的循环体代码
    },1300); // 每秒执行一次
}


function dian() {
    var b3 = document.getElementsByClassName('iconBox');
    console.log(b3[7].click());
};

function pu(){
    var pu1 = document.getElementsByClassName('img');
    //var button5 = document.createElement('button');
    //pu1[1].appendChild(button5).click;
    if (pu1.length >= 2){
        console.log(pu1[1].click());
        if(pu1[1] != null){
            var puname = document.getElementsByClassName('el-checkbox__inner');
            console.log(puname[1].click());
        };
    }
}
function gong1(){
    var gong1 = document.getElementsByClassName('img');
    //console.log(gong1);
    if (gong1.length >= 2){
        console.log(gong1[2].click());
        if(gong1[2]!= null){
            var gongname = document.getElementsByClassName('el-checkbox__inner');
            //console.log(gongname[1].click());
            if (gongname[1].ClassName == "el-checkbox__input is-checked"){ //el-button el-button--primary el-button--small is-circle
                console.log(" ")
                var gongbutton = document.getElementsByClassName('el-button el-button--primary el-button--small is-circle');
                console.log(gongbutton.click());
            }else if(gongname[1].ClassName =="el-button el-button--primary el-button--small is-circle") {
                console.log(gongname[1].click());
            }else{
            console.log("Class验证不成功")
            }
        };
    }
}

function fei(){
    var fei1 = document.getElementsByClassName('img');
    //var button5 = document.createElement('button');
    //pu1[1].appendChild(button5).click;
    if (fei1.length >= 2){
        console.log(fei1[3].click());
    }
}

function cun(){
    var cun1 = document.getElementsByClassName('img');
    //var button5 = document.createElement('button');
    //pu1[1].appendChild(button5).click;
    if (cun1.length >= 2){
        console.log(cun1[9].click());
    }
}

function c(){ //el-input__inner   num el-input el-input--small   el-message__content  //el-button el-button--primary el-button--small is-plain
    //var c1 = document.getElementsByClassName('el-input__inner');
    //var c1 = document.getElementsByClassName('num el-input el-input--small');
    var b22 = document.getElementsByClassName("el-button el-button--primary el-button--small is-plain")[0];
    var c1 = document.querySelector("input.el-input__inner");
    var p1 = document.getElementsByClassName("el-message__content");
    var sumi = p1.length;
    var txtB1 = p1[sumi-1].innerHTML;
    if (txtB1.length >= 6 ){
        var TxtB1 = txtB1.split("[");
        var datatxtq = TxtB1[1].split("]");
        var inttxt21 = parseInt(datatxtq[0])
        c1.value = inttxt21;
        var event1 = document.createEvent('HTMLEvents');
        event1.initEvent("input",true, true);
        event1.eventType ='message';
        c1.dispatchEvent(event1);
        if (c1.value == inttxt21){
            console.log(b22.click());
        };
    }

}


window.onload = function () {
    var Elements = document.getElementsByClassName('uploadBox')[0];
    console.log("成功");
    var input = document.createElement("input");
    Elements.appendChild(input);
};

function gong() {  //el-time-spinner__item    active    item.classList.remove('active');   uploadBox
    var inputElements = document.getElementsByClassName('el-range-input');
    // 检查是否有至少两个输入元素（通常情况下时间范围选择器会有两个）
    var Elements = document.getElementsByClassName('uploadBox')[0];
    console.log(Elements);
    var input = document.createElement("input");

    if (inputElements.length >= 2) {

         //直接设置输入框的值
        inputElements[0].value = '07:00';
        inputElements[1].value = '09:00';

        if (inputElements.length >= 4){
            inputElements[2].value = '17:00';
            inputElements[3].value = '19:00';
        }

         //如果需要的话，可以手动触发input事件（例如用于更新相关的UI或验证）
        for (var i = 0; i < inputElements.length; i++) {
            var event2 = new Event('input', { bubbles: true, cancelable: true });
            event2.eventType = 'message'
            inputElements[i].dispatchEvent(event2);
        }
    } else {
        console.error("找不到足够的输入元素以设置时间范围");
    }
}



