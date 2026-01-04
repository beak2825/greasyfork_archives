// ==UserScript==
// @name         本科评估
// @namespace    https://github.com/Inx6/exam/blob/main/temp.js
// @version      0.3
// @description  长沙师范专属本科评估答疑
// @author       Hikonl
// @match        https://www.yooc.me/group/4550323/exam/349804/detail
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yooc.me
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460358/%E6%9C%AC%E7%A7%91%E8%AF%84%E4%BC%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/460358/%E6%9C%AC%E7%A7%91%E8%AF%84%E4%BC%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
     // console.log(ConsoleManager);
     ConsoleManager=null
     for(var i = 1; i < 1000; i++) {
      // console.log(ConsoleManager)
      clearInterval(i);
    }

    window.onload = function(){
        let exam = document.querySelector(".exam-detial-container");
        // console.log(exam.children);

        for(let i=0; i<= exam.children.length; i++){
            // 选择题
            if(i >0 && i < 44){
                // console.log(i);
                let xhr = new XMLHttpRequest();
                xhr.open("GET","https://ip.flog.ficc.cc/?qus="+exam.children[i].children[2].innerText, true);
                xhr.onreadystatechange=function(){
                    // 在监听xhr的请求状态 readyState为4代表请求成功，status为200代表响应成功
                    if (xhr.readyState===4) {
                        // 打印数据
                        let ans = JSON.parse(xhr.responseText);
                        let answer = ans.answer.split("、");
                        // console.log(i+":"+answer);
                        // 寻找答案
                        // console.log(exam.children[i].children[2].innerText);
                        for(let e=0; e<exam.children[i].children[5].children.length; e++){
                            // console.log(i+":"+answer.length);
                            let awaits = new Promise((res, rej)=>{
                                setTimeout(()=>{
                                    exam.children[i].children[5].children[e].children[0].checked = true;
                                }, 1000)

                                setTimeout(()=>{
                                    res(true);
                                },2500)

                            });

                            awaits.then((res)=>{
                                for(let r=0; r<answer.length; r++){
                                    let strs = exam.children[i].children[5].children[e].innerText;
                                    // console.log(i+":"+strs);
                                    // console.log(strs.indexOf(answer[r]));
                                    // console.log(i+":"+answer[r]);
                                    if(strs.indexOf(answer[r]) == -1){
                                        // console.log(i+":"+exam.children[i].children[5].children[e].innerText);
                                        // console.log(exam.children[i].children[5].children[e].children[0]);
                                        // 没有查询到结果，继续查询
                                        exam.children[i].children[5].children[e].children[0].checked = false;

                                    }else{
                                        // 如果查询到了结果，直接跳出查询
                                        exam.children[i].children[5].children[e].children[0].checked = false;
                                        exam.children[i].children[5].children[e].children[0].click();
                                        break;
                                    }

                                };

                            });
                            continue;
                            // console.log(exam.children[2].children[5].children.length);
                        };


                    }

                };
                xhr.send();

            }
            // 判断题
            else if(i > 44 && i < exam.children.length){
                let xhr = new XMLHttpRequest();
                // console.log(exam.children[i].children[2].innerText);
                xhr.open("GET","https://ip.flog.ficc.cc/?qus="+exam.children[i].children[2].innerText, true);
                xhr.onreadystatechange = function(){
                    // 在监听xhr的请求状态 readyState为4代表请求成功，status为200代表响应成功
                    if (xhr.readyState===4) {
                        // 打印数据
                        let ans = JSON.parse(xhr.responseText);
                        let answer = ans.answer.split("、");
                        // console.log(i+":"+answer);
                        // 寻找答案
                        // console.log(exam.children[i].children[2].innerText);
                        for(let e=0; e<answer.length; e++){
                            // console.log(i+":"+answer.length);
                            setTimeout(()=>{
                                exam.children[i].children[2].children[e].value = answer[e];
                                exam.children[i].children[2].children[e].dispatchEvent(new InputEvent("input"));

                            }, 1000)

                            continue;
                            // console.log(exam.children[2].children[5].children.length);
                        };


                    }

                };
                xhr.send();
            }
        }
    }

})();