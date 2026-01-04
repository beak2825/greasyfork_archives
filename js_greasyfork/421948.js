// ==UserScript==
// @name         UPLT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.uplt.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421948/UPLT.user.js
// @updateURL https://update.greasyfork.org/scripts/421948/UPLT.meta.js
// ==/UserScript==

var Message = new Array();
Message[0] = new Array();
Message[1] = new Array();
Message[2] = new Array();

var MessagePoint=0; //指定默认发送消息组
var LastMessageTimeout=120; //对话终止自动断开时间

Message[0][0]="嗨~";
Message[0][1]="Hi~";
Message[0][2]="哈罗";

Message[1][0]="平时更多是语音交流，可以么？";
Message[1][1]="喜欢用语音交流，可？";
Message[1][2]="喜用语音的，好？";

Message[2][0]="再";
Message[2][1]="hello21";
Message[2][2]="hello22";

//声音
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//audioCtx.resume();
var frequency=4200;
var volume=0.1;
var type="square";//Sounds Type:'sine'/'square'/'sawtooth'/'triangle'
var duration=800;

var MessageFlag=0; //自动发送消息滚动指针
var StartStatus=0; //正式开始状态寄存器
var BeepFlag=0; //提示音状态寄存器
var LastMessage=""; //最后一次消息内容
var LastMessageTimeCounter=LastMessageTimeout; //最后一次消息时间
var STnow=0, STlast=0, MTnow=0, MTlast=0;
var LastTimerFlag=0;

(function () {
    'use strict';
    setInterval(function () {
        //自动按下连接键
       if (document.querySelector(".connectButton").outerHTML.indexOf("连接")!=-1) {
           document.querySelector(".connectButton").click();
       }
        //开始后的断开倒计时
       if (document.querySelector(".connectButton").outerHTML.indexOf("断开(")!=-1) {
           StartStatus=1;
            LastTimerFlag=0;
           if ((document.querySelector(".connectSuccessMessage").outerHTML.indexOf("女性")!=-1) && (BeepFlag==0)) {
               if (document.getElementsByClassName("stranger text").length!=0) {
                   BeepFlag=1;
                   Beep();
                   document.getElementsByTagName("title")[0].innerText = '！！！！！！！！！！！！！';
               }
               //主动发送消息
               if ((document.getElementsByClassName("me text").length==0) && (document.getElementsByClassName("stranger text").length==0)) {
                   document.getElementById("TextBox_send").value=Message[MessagePoint][MessageFlag];
                   MessageFlag++;
                   if (MessageFlag>=3) {
                       MessageFlag=0;
                   }
                   $("#TextBox_send").trigger("input");//解决事件触发问题
                   document.querySelector(".sendButton").click();//发送消息按键
               }
           }
       }

       //开始倒计时结束
       if ((document.querySelector(".connectButton").outerHTML.indexOf("断开(")==-1) && (document.querySelector(".connectButton").outerHTML.indexOf("断开")!=-1) && (StartStatus==1)) {
           StartStatus=0;
           BeepFlag=0;
           if (document.querySelector(".connectSuccessMessage").outerHTML.indexOf("女性")==-1) {
               //主动断开
               document.querySelector(".connectButton").click();
               document.getElementsByTagName("title")[0].innerText = '';
               LastTimerFlag=0;
           }
           else{
               LastTimerFlag=1;//启动倒计时
           }
       }
        //断开确认
       if (document.querySelector(".layui-m-layerbtn")!=null) {
           //console.log(document.querySelector(".layui-m-layerbtn"));
           document.querySelector(".layui-m-layerbtn").lastElementChild.click();
           document.scripts[0].src = "js/time.js";
       }
        //更改显示内容
       if (document.getElementById("chat_loading")!=null) {
           document.getElementById("chat_loading").innerHTML="Connecting";
       }
       if (document.querySelector(".systemMessage")!=null) {
           document.querySelector(".systemMessage").innerHTML="AAA";
       }
       if (document.querySelector(".connectSuccessMessage").outerHTML.indexOf("女性")!=-1) {
          // document.getElementsByTagName("title")[0].innerText = '！！！！！！！！！！！！！';
       }
        else {
            document.getElementsByTagName("title")[0].innerText = '！';
        }
        STnow=document.getElementsByClassName("stranger text").length
        MTnow=document.getElementsByClassName("me text").length
        if (LastTimerFlag==1) {
        if ((STnow!=STlast) || (MTnow!=MTlast)) {
            STlast=STnow;
            MTlast=MTnow;
            LastMessageTimeCounter=LastMessageTimeout;
        }
        else {
            LastMessageTimeCounter--;
            document.getElementsByTagName("title")[0].innerText=LastMessageTimeCounter;
            if (LastMessageTimeCounter>=LastMessageTimeout) {
                document.querySelector(".connectButton").click();
                LastMessageTimeCounter=LastMessageTimeout;
                LastTimerFlag=0;
            }
        }
        }

    }, 1000);//每秒轮询一次


    function Beep() {
        var oscillator = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        gainNode.gain.value = volume;
        oscillator.frequency.value = frequency;
        oscillator.type = type;

        oscillator.start();

        setTimeout(
            function(){
                oscillator.stop();
            },
            duration
        );
    };

})();