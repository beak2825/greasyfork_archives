// ==UserScript==
// @name         乐课自动脚本
// @namespace    https://greasyfork.org/zh-CN/users/185310
// @version      3.1.0
// @description  乐课网全自动进入
// @author       Flow_Cloud
// @match        *://lesson.leke.cn/auth/*
// @grant        GM_addStyle
// @supportURL   https://greasyfork.org/zh-CN/scripts/396568
// @downloadURL https://update.greasyfork.org/scripts/396568/%E4%B9%90%E8%AF%BE%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/396568/%E4%B9%90%E8%AF%BE%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a;
    var b = 0;
    var c;
    var d = 0;
    var e;
    var f;//以上皆为for循环用变量
    var g = 0; //无功能性作用，装饰用
    var _class_time_int = new Array();
    var _class_day_int = new Array();
    var _aim_time_array = new Array();
    var _class_button_array = new Array();
    var _class_state_array = new Array();
    var _class_num = 1;

    var _head = document.getElementsByClassName("c-airclass__courabout-title")[0];
    var _button = '<button id = start>点击开始</button>';
    _head.innerHTML += _button;
    var _start_button = document.getElementById("start");
    _start_button.addEventListener("click",__main);

    function __get_class_time(){
        for (a=0;a<18;a+=3){
            var _class_time_string = document.getElementsByClassName("c-airclass__courrec-coursmwidth")[a].innerHTML.slice(0,5).split(":");
            _class_time_int[1+b*2] = parseInt(_class_time_string[0]);
            _class_time_int[2+b*2] = parseInt(_class_time_string[1]);
            b++;
        }
        for(c=0;c<12;c+=2){
            var _class_day_string = document.getElementsByClassName("c-airclass__courrec-courname")[c].innerHTML.slice(2,12).split("-");
            _class_day_int[1+d*3] = parseInt(_class_day_string[0]);
            _class_day_int[2+d*3] = parseInt(_class_day_string[1]);
            _class_day_int[3+d*3] = parseInt(_class_day_string[2]);
            d++;
        }
    }

    function __turn_time(){
        for(e=0;e<6;e++){
            var _aim_time = new Date();
            _aim_time.setFullYear(_class_day_int[1+e*3],_class_day_int[2+e*3]-1,_class_day_int[3+e*3]);
            _aim_time.setHours(_class_time_int[1+e*2]);
            _aim_time.setMinutes(_class_time_int[2+e*2]-10);
            _aim_time.setSeconds(0);
            _aim_time_array[e+1] = _aim_time;
        }
    }

    function __get_class_button(){
        for(f=0;f<6;f++){
            var _class_button = document.getElementsByClassName("init-btn")[f].children;
            _class_button_array[f+1] = _class_button[0];
            _class_state_array[f+1] = _class_button[0].innerHTML;
        }
    }

    function __clock(){
        var _now_time = new Date();
        _class_button_array[_class_num].innerHTML="正在计时"+g;
        _class_button_array[_class_num].style.background="#FF0000";
        if(_now_time>_aim_time_array[_class_num]){
            _class_button_array[_class_num].click();
            _class_button_array[_class_num].style.background="#0000FF";
            _class_button_array[_class_num].innerHTML="已进入";
            _class_num++;
            if(_class_state_array[_class_num]!="进入课堂"){
                return;
            }
            _class_button_array[_class_num].innerHTML="正在计时"+g;
            _class_button_array[_class_num].style.background="#FF0000";
        }
        g++;
        console.log(_now_time);
        console.log(_class_num);
        setTimeout(__clock,300000);
    }

    function __main(){
        __get_class_time();
        __turn_time();
        __get_class_button();
        __clock();
        _start_button.parentNode.removeChild(_start_button);
        console.log(_class_time_int);
        console.log(_class_day_int);
        console.log(_aim_time_array);
        console.log(_class_button_array);
        console.log(_class_state_array);
    }
})();