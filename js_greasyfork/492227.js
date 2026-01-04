// ==UserScript==
// @name         驾考宝典，模拟考试自动做题
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  驾考宝典模拟考试自动做题，现已兼容科目一和科目四模拟考试
// @author       ZouYS
// @match        https://www.jiakaobaodian.com/mnks/exam/*.html
// @icon         https://www.jiakaobaodian.com/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492227/%E9%A9%BE%E8%80%83%E5%AE%9D%E5%85%B8%EF%BC%8C%E6%A8%A1%E6%8B%9F%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E5%81%9A%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/492227/%E9%A9%BE%E8%80%83%E5%AE%9D%E5%85%B8%EF%BC%8C%E6%A8%A1%E6%8B%9F%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E5%81%9A%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var quesList=[];
    //劫持函数
    function addXMLRequestCallback(callback) {
        // oldSend 旧函数 i 循环
        var oldSend, i;
        //判断是否有callbacks变量
        if (XMLHttpRequest.callbacks) {
            //判断XMLHttpRequest对象下是否存在回调列表，存在就push一个回调的函数
            XMLHttpRequest.callbacks.push(callback);
        } else {
            //如果不存在则在xmlhttprequest函数下创建一个回调列表/callback数组
            XMLHttpRequest.callbacks = [callback];
            // 保存 XMLHttpRequest 的send函数
            oldSend = XMLHttpRequest.prototype.send;
            //获取旧xml的send函数，并对其进行劫持（替换）  function()则为替换的函数
            //以下function函数是一个替换的例子
            XMLHttpRequest.prototype.send = function () {
                // 把callback列表上的所有函数取出来
                for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                    // 把this传入进去
                    XMLHttpRequest.callbacks[i](this);
                }
                //循环回调xml内的回调函数
                // 调用旧的send函数 并传入this 和 参数
                oldSend.apply(this, arguments);
                //由于我们获取了send函数的引用，并且复写了send函数，这样我们在调用原send的函数的时候，需要对其传入引用，而arguments是传入的参数
            };
        }
    }
    //传入回调 接收xhr变量
    addXMLRequestCallback(function (xhr) {
        //调用劫持函数，填入一个function的回调函数
        //回调函数监听了对xhr调用了监听load状态，并且在触发的时候再次调用一个function，进行一些数据的劫持以及修改
        xhr.addEventListener("load", function () {
            // 输入xhr所有相关信息
            //console.log(xhr);
            if (xhr.readyState == 4 && xhr.status == 200) {
                //  如果xhr请求成功 则返回请求路径
                //console.log("函数1", xhr.responseURL);
                //console.log(xhr.response)
                if(xhr.responseURL.includes('https://api2.jiakaobaodian.com/api/open/question/question-list.htm')){
                    //console.log(JSON.parse(xhr.response))
                    let list=JSON.parse(xhr.response);
                    quesList=[...quesList,...(list.data)]
                    console.log(quesList)
                }
            }
        });

    });

    async function domain(){
        let index=0;
        for(index;index<quesList.length;index++)
        {
            await sleep(200);
            //点击并查询正确答案
            let questionId=document.querySelector('[data-questionid]').getAttribute('data-questionid')
            let result=quesList.filter(item => item.questionId==questionId)
            result=result[0]
            let answer=result.answer.toString()
            //optionType 0   判断
            //optionType 1   单选
            //optionType 2   多选
            console.log(`第${index+1}题：`)

            let answers=new Map();
            answer=parseInt(answer);
            let bitPos=4;
            for(let i=0;i<4;i++){
                let mask=1 << (bitPos+i);
                if(answer & mask){
                    // answers+=result['option' +String.fromCharCode('A'.charCodeAt(0) + i)]
                    answers.set(result['option' +String.fromCharCode('A'.charCodeAt(0) + i)],true)
                }
            }
            /*else{
                switch(answer)
                {
                    case '16':
                        answer=result.optionA
                        break;
                    case '32':
                        answer=result.optionB
                        break;
                    case '64':
                        answer=result.optionC
                        break;
                    case '128':
                        answer=result.optionD
                        break;
                    default:
                        answer='error get answer'
                }
            }*/
            console.log(answers)
            let letter='A'
            var container = await document.querySelector('.answer-w');
            if (container) {
                var paragraphs =await container.querySelectorAll('p'); // 获取父元素内部的所有 <p> 元素
                await paragraphs.forEach( function(paragraph) {
                    if(answers.has(paragraph.textContent.slice(paragraph.textContent.indexOf('、')+1))){
                        letter=paragraph.textContent.split('、')[0]
                        let selector = '.select-w.right .select-lable[data-key="' + letter + '"]';
                        // 使用构建好的选择器字符串来获取相应的按钮元素
                        let button =  document.querySelector(selector);
                        button.click();
                        if(result.optionType.toString()!=='2'){
                            return true;
                        }
                    }
                });
                //多选确定
                let btnOk=document.querySelector('.btn-answer-ok')
                if(btnOk){
                    btnOk.click();
                }
            }

        }

    }
    function fuc_show() {
        // let is_show=document.querySelector('#myWindow')
        if (quesList.length===100 || quesList.length===50) {
            domain().then(r =>{} );

        }
        else {
            alert('wrong init!Please refresh again！')
        }
    }
    async function sleep(time) {
        console.log('睡眠' + time / 1000 + 's')
        //if(time < 1000)time=1000
        return await new Promise((resolve) => setTimeout(resolve, time));
    }
    window.onload=()=>{
        let css = `

        .mybtn2 {
            z-index: 9999999999;
            position: absolute;
            top: 300px;
            font-size: inherit;
            font-family: inherit;
            color: white;
            width: 100px;
            height: 50px;
            padding: 0.5em 1em;
            outline: none;
            border: none;
            background-color: hsl(236, 32%, 26%);
            overflow: hidden;
            transition: color 0.4s ease-in-out;
        }

        .mybtn2::before,.mybtn1::before {
            content: '';
            z-index: -1;
            position: absolute;
            top: 100%;
            right: 100%;
            width: 1em;
            height: 1em;
            border-radius: 50%;
            background-color: #3cefff;
            transform-origin: center;
            transform: translate3d(50%, -50%, 0) scale3d(0, 0, 0);
            transition: transform 0.45s ease-in-out;
        }

        .mybtn2:hover,.mybtn1:hover {
            cursor: pointer;
            color: #161616;
        }

        .mybtn2:hover::before,.mybtn1:hover::before {
            transform: translate3d(50%, -50%, 0) scale3d(15, 15, 15);
        }`;
        GM_addStyle(css);
        let showWindow = document.createElement('button')
        showWindow.classList.add('mybtn2')
        showWindow.innerText='点击自动开始答题';
        document.body.appendChild(showWindow)
        showWindow.addEventListener('click', fuc_show)


    }
})();