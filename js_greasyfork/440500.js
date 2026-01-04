// ==UserScript==
// @name         传智倍速播放、自动答题
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  辣鸡传智
// @license      MIT
// @author       Boos4721
// @match        http://stu.ityxb.com/lookPaper/*
// @match        http://stu.ityxb.com/preview/*
// @grant        unsafeWindow
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stu.ityxb.com
// @downloadURL https://update.greasyfork.org/scripts/440500/%E4%BC%A0%E6%99%BA%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E3%80%81%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/440500/%E4%BC%A0%E6%99%BA%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E3%80%81%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

var tibody;//题目数组
var total = 0;//题目总数量
var index = 0;//搜题索引自动增加
window.onload = function(){

tibody=document.getElementsByClassName("questionItem question-item-box");
total = tibody.length;
kaishi(tibody[index]);//传入每道题

                  // 创建一个新的 div 元素
                 let newDiv = document.createElement("div");
                 // 给它一些内容
                 let newContent = document.createTextNode("自动答题功能并不完善");
                 // 添加文本节点 到这个新的 div 元素
                 newDiv.appendChild(newContent);
                 newDiv.style.position='fixed';
                 newDiv.style.backgroundColor='red'
                //  newDiv.style.width='20px';
                //  newDiv.style.length='20px';
                newDiv.style.fontSize='20px';
                document.querySelector("#beginHeaderNav").appendChild(newDiv);
                newDiv.style.top='60px';

                }

function kaishi(ti){
        GM_xmlhttpRequest({//油猴脚本提供的异步函数
            method: 'POST',
            url: 'http://cx.icodef.com/wyn-nb?v=2',//网课接口
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data: 'question='+ encodeURIComponent(ti.getElementsByClassName("question-title-box")[0].innerText),
            timeout: 2000,
            onload:function(xhr)
            {



//自动选择答案
                let json=JSON.parse(xhr.responseText);
                let daan=json.data;
if(json.code==-1)daan="答案未找到";
// console.log(xhr.responseText.code);
let answerarray=daan.split('#');//答案数组

let daanlength=ti.getElementsByClassName("radio_item question-option-item-box").length;//多少个选项
for(let i=0;i<daanlength;i++){
    for(let i2=0;i2<answerarray.length;i2++)
    {
        //  console.log(ti.getElementsByClassName("radio_item question-option-item-box")[i].innerText.split('、')[1]);

        if(ti.getElementsByClassName("radio_item question-option-item-box")[i].innerText.split('、')[1]==answerarray[i2])ti.getElementsByClassName("radio_item question-option-item-box")[i].firstElementChild.click();
    }
}

//显示答案
 let newdaan=' ';
for(let i=0;i<answerarray.length;i++)
 {
     newdaan=newdaan+'<br>'+answerarray[i];

 }
 ti.getElementsByClassName("question-title-box")[0].innerHTML += "<br>答案:"+newdaan;
                if(index < total - 1)//继续搜索接下来的题
                {
                  setTimeout(function (){
                      index = index + 1;
                      kaishi(tibody[index]);
}, 1000);

                }


            }
        })
    }
(
    function() {
        'use strict';
        var but = document.createElement('button')
        but.innerHTML = "5倍速"
        but.addEventListener("click", myFunction)
        function myFunction(){
            document.querySelector('video').playbackRate = 5.0
        }
        var but1 = document.createElement('button')
        but1.innerHTML = "10倍速"
        but1.addEventListener("click", myFunction1)
        function myFunction1(){
            document.querySelector('video').playbackRate = 10
        }
        var but2 = document.createElement('button')
        but2.innerHTML = "16倍速"
        but2.addEventListener("click", myFunction2)
        function myFunction2(){
            document.querySelector('video').playbackRate = 16
        }
        var but3 = document.createElement('button')
        but3.innerHTML = "秒过视频"
        but3.addEventListener("click", myFunction3)
        function myFunction3(){
            document.querySelector('video').currentTime = 600000
        }
        var parent = document.querySelector("body > div:nth-child(3) > div > div.center-content.preview_play-container > div.preview_play-header > span.playing-name")
        parent.appendChild(but)
        parent.appendChild(but1)
        parent.appendChild(but2)
        parent.appendChild(but3)
    })();