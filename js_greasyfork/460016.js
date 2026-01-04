// ==UserScript==
// @name         奥鹏自动答题+答案显示
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  实现在问题上显示答案!
// @author       SQ
// @match        https://learn.open.com.cn/StudentCenter/OnLineJob/TestPaper*
// @grant        GM_getResourceURL
// @run-at document-idle 
// @downloadURL https://update.greasyfork.org/scripts/460016/%E5%A5%A5%E9%B9%8F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%2B%E7%AD%94%E6%A1%88%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/460016/%E5%A5%A5%E9%B9%8F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%2B%E7%AD%94%E6%A1%88%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
//全局问题
var question;
//请求的问题封装（方便根据id查找对应的对象）
var map = {};
//根据问题的id来获取答案封装
var answer = {};
// 设置自动模式
var automode = 0;
function addXMLRequestCallback(callback) {
    var oldSend, i;
    if (XMLHttpRequest.callbacks) {
        // we've already overridden send() so just add the callback
        XMLHttpRequest.callbacks.push(callback);
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                XMLHttpRequest.callbacks[i](this);
            }
            // call the native send()
            oldSend.apply(this, arguments);
        }
    }
}

//根据问题找出具体的id
function initquestion(question) {
    //找出的问题数组
    let list = question.data.paperInfo.Items;
    list.forEach((item, index, array) => {
        map[item.I1] = item
        //封装请求
        let basturl = 'https://learn.open.com.cn/StudentCenter/OnlineJob/GetQuestionDetail?bust=${bust}&itemBankId=${itemBankId}&questionId=${questionId}&_=1596253257714'
        let bust = (new Date()).getTime();
        let itemBankId = item.I4;
        let questionId = item.I1;
        let rquurl = basturl.replace('${bust}', bust).replace('${itemBankId}', itemBankId).replace('${questionId}', questionId);
        map[item.I1] = rquurl
        fetch(rquurl, {
            method: 'GET',
            headers: {
                'cookie': document.cookie
            }
        }).then(response => response.json()).then(data => {
            console.log('=======data==================')
            // console.log(data.T2);
            let choiceslist = data.data.Choices
            let questionlist = new Array();
            let use = [];
            var answer_num = 0;
            choiceslist.forEach((iteam, index, array) => {
                if (iteam.IsCorrect) {
                    // console.log(iteam.I1);
                    questionlist.push(iteam.I1 + " " + iteam.I2);
                    // console.log(iteam.I1 + " " + iteam.I2);
                    use[++answer_num] = iteam;
                }
            })
            // const ulList = document.querySelectorAll('ul.Subject-Options');
            //   // 选中所有class="Subject-Options"的ul


            // // 定义需要匹配的字符串
            // // 遍历所有ul
            // for (let i = 0; i < ulList.length; i++) {
            //     const ul = ulList[i];
            //     const liList = ul.querySelectorAll('li');

            //     // 遍历当前ul下的所有li
            //     for (let j = 0; j < liList.length; j++) {
            //         const li = liList[j];
            //         const liContent = li.textContent.trim();
            //         // console.log(liContent+" "+use.I1+use.I2);
            //         // 如果li内容和目标字符串一样，点击该li并跳出循环
            //         for(let r=1;r<=answer_num;r++)
            //         {
            //             console.log(liContent);
            //             if (liContent === use[r].I1+use[r].I2) {
            //                 li.click();
            //                 break;
            //             }
            //             if((use[r].I1=="T") || (use[r].I1=="F"))
            //             {
            //                 if ((liContent == 'A'+use[r].I2) || (liContent == 'B'+use[r].I2)) {
            //                     console(liContent,'A'+use[r].I2,'B'+use[r].I2);
            //                     li.click();
            //                     break;
            //                 }
            //             }

            //         }

            //     }
            // }
            //根据名称直接赋值
            // console.log(item.I1);
            let dom = document.querySelector("div[itemid='" + item.I1 + "']")
            let li;
            item.I3=dom.id;
            for (let r = 1; r <= answer_num; r++) {
                if (use[r].I1 == "A") {
                    li = $("#" + item.I3 + " >" + " div.Subject-Area > ul > li:nth-child(1)");
                }
                else if (use[r].I1 == "B") {
                    li = $("#" + item.I3 + " >" + " div.Subject-Area > ul > li:nth-child(2)");
                }
                else if (use[r].I1 == "C") {
                    li = $("#" + item.I3 + " >" + " div.Subject-Area > ul > li:nth-child(3)");
                }
                else if (use[r].I1 == "D") {
                    li = $("#" + item.I3 + " >" + " div.Subject-Area > ul > li:nth-child(4)");
                }
                else if (use[r].I1 == "E") {
                    li = $("#" + item.I3 + " >" + " div.Subject-Area > ul > li:nth-child(5)");
                }
                else if (use[r].I1 == "T") {
                    let li1 = $("#" + item.I3 + " >" + " div.Subject-Area > ul > li:nth-child(1)");
                    if (li1.text() == 'A对' || li1.text() == 'A正确') li = li1;
                    let li2 = $("#" + item.I3 + " >" + " div.Subject-Area > ul > li:nth-child(2)");
                    if (li2.text() == 'B对' || li2.text() == 'B正确') li = li2;
                    

                }
                else if (use[r].I1 == "F") {
                    li = $("#" + item.I3 + " >" + " div.Subject-Area > ul > li:nth-child(6)");
                    let li1 = $("#" + item.I3 + " >" + " div.Subject-Area > ul > li:nth-child(1)");
                    if (li1.text() == 'A错' || li1.text() == 'A错误') li = li1;
                    let li2 = $("#" + item.I3 + " >" + " div.Subject-Area > ul > li:nth-child(2)");
                    if (li2.text() == 'B错' || li2.text() == 'B错误') li = li2;
                    console.log(li1.text());
                    console.log(li2.text());

                }
                else{
                    console.log(use[r].I1);
                }
                // console.log(li);
                if (!li.hasClass('Item-Option Choosed')) {
                    // 如果元素没有被点击过，则模拟点击事件
                    li.click();
                  }
            }
            //创建元素开始赋值
            //获取标题
            let title = dom.getElementsByClassName('Subject-Title')


            let div = document.createElement("div");
            let div_p = document.createElement("p");
            div_p.innerText += "答案：";
            div.appendChild(div_p)
            questionlist.forEach((iteam, index, array) => {
                let div_p_p = document.createElement("p");
                div_p_p.innerHTML += iteam;
                div.appendChild(div_p_p)
                div.className = 'Student-Answer';
            })
            title[0].appendChild(div)
            // console.log(title[0]);
            answer[item.I1] = questionlist;


            return data;


        })
    })
}

(function () {
    'use strict';

    // Your code here...
    addXMLRequestCallback(function (xhr) {
        xhr.addEventListener("load", function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseURL);

                if (xhr.responseURL.includes("homeworkapi.open.com.cn/getHomework")) {
                    console.log(xhr.responseURL);
                    question = JSON.parse(xhr.responseText);
                    console.log("------------------------");
                    console.log(question);
                    console.log("------------------------");

                    initquestion(question);
                }
            }
        });
    });

})();