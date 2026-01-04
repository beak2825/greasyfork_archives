// ==UserScript==
// @name         选课脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  来不及解释了
// @author       wu-ji-ge
// @match         *://jwgl.cuit.edu.cn/*
// @grant        none
// @license MIT


// @downloadURL https://update.greasyfork.org/scripts/460409/%E9%80%89%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/460409/%E9%80%89%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.output = document.createElement('div');
    window.css1=document.createElement('link');
    window.infom = document.createElement('div');
    window.m1 = output.querySelector('#m1');
    window.m2 = output.querySelector('#m2');

    css1.innerHTML=("<link rel='stylesheet' href='https://unpkg.com/layui@2.6.8/dist/css/layui.css'>")
    output.innerHTML ='<div  id="mycode918"  style="height: 200px;width: 200px;right: 0px;top:30px;position: fixed;z-index: 9999;background-color: #FFB800">' +
        '<div class="layui-text" >课程代码1</div>' +
        '<input class="layui-input" id="m1" placeholder="输入选课代码">' +
        '<div class="layui-text">课程代码2</div>' +
        '<input class="layui-input" id="m2" placeholder="输入选课代码">' +
        '<input type="time" style="display:block;" value="13:00" id="time-input"/>'+
        '<button  type="button" class="layui-btn layui-btn-sm" id="but999" onclick="say()">确定</button>'+
         '<button  type="button" class="layui-btn layui-btn-sm"  onclick="set1()">重置课1</button>'+
         '<button  type="button" class="layui-btn layui-btn-sm"  onclick="set2()">重置课2</button>'+
        '<div id="result" style="display:none;">选择完毕</div>'
        '</div>';



        window.say=function(){
        window.val1 = document.getElementById("m1").value;
        window.val2 = document.getElementById("m2").value;
        document.getElementById("result").style.display = "block";
            window.time=setInterval(newtime,100)
    }
         window.set1=function(){
       document.getElementById("m1").value='';
        document.getElementById("result").style.display = "none";
    }
         window.set2=function(){
   document.getElementById("m2").value='';
        document.getElementById("result").style.display = "none";
    }

    document.body.appendChild(css1)
    document.body.appendChild(output)
    window.button = document.createElement("button");
button.textContent = "隐藏与显示";
//    button.classList.add("layui-btn");
//button.classList.add("layui-btn-sm");
// Position the button at the bottom right corner of the div
//const div = document.getElementById("myDiv");
document.body.appendChild(button)
button.style.position = "fixed";
button.style.writingMode = "vertical-rl";
button.style.textOrientation = "sideways";
button.style.top =output.style.top+'230px';
    button.style.left = '100%';
    button.style.transform = 'translateX(-100%)';
button.addEventListener("click", function() {
  if (output.style.display === "none") {
    output.style.display = "block";
  } else {
    output.style.display = "none";
  }
});
    window.confirm=function(){return 1}
window.newtime=function(){
    window.a=new Date()
    window.b=new Array()
    b[0]=a.getHours()
    b[1]=a.getMinutes()
    if(b[0]>=document.getElementById("time-input").value.split(':')[0]&&b[1]>=document.getElementById("time-input").value.split(':')[1]){   //b[0]多少点，b[1]为多少分，学校选课基本为13:00
       $("#electableLessonList_data tr td:contains('" + val1 + "') ~ td:contains('选课')").children().click();
        if ($("#cboxClose").is(":visible")) {
  $("#cboxClose").click();
}

       $("#electableLessonList_data tr td:contains('" + val2 + "') ~ td:contains('选课')").children().click();
        if ($("#cboxClose").is(":visible")) {
  $("#cboxClose").click();
}

        clearInterval(time)                //td:contains('CS546A2020.221001') 引号换成你要选择的课的代码
       // alert('1')
    }
}
window.time=setInterval(newtime,100)
})();