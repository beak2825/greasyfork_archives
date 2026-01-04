// ==UserScript==
// @name         传智网课答题(只支持大部分选择题)
// @namespace    https://stu.ityxb.com/writePaper/busywork/*
// @namespace    https://stu.ityxb.com/writePaper/exam/*
// @version      2.1
// @description  传智教育答题
// @author       HCG_Sky(本人二开原作者：土豆)
// @connect      *
// @match        https://stu.ityxb.com/writePaper/busywork/*
// @match        https://stu.ityxb.com/writePaper/exam/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/456492/%E4%BC%A0%E6%99%BA%E7%BD%91%E8%AF%BE%E7%AD%94%E9%A2%98%28%E5%8F%AA%E6%94%AF%E6%8C%81%E5%A4%A7%E9%83%A8%E5%88%86%E9%80%89%E6%8B%A9%E9%A2%98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456492/%E4%BC%A0%E6%99%BA%E7%BD%91%E8%AF%BE%E7%AD%94%E9%A2%98%28%E5%8F%AA%E6%94%AF%E6%8C%81%E5%A4%A7%E9%83%A8%E5%88%86%E9%80%89%E6%8B%A9%E9%A2%98%29.meta.js
// ==/UserScript==



var tibody;//题目数组
var total = 0;//题目总数量
var index = 0;//搜题索引自动增加

window.onload = function(){
    tibody=document.getElementsByClassName("questionItem question-item-box");
    total = tibody.length;
    answer(tibody[index]);//传入每道题


    // 创建一个新的 div 元素
    let newDiv = document.createElement("div");
    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    // 给它一些内容
    let Content_1 = document.createTextNode("原作者：土豆 | 本人是二次开发|只能搜选择题|自动答题功能不完善|有些自己看着选一下");
    let Content_2 = document.createTextNode("修复问题：接口失效、判断题不能自动答题、目前已支持考试");
    // 添加文本节点 到这个新的 div 元素
    p1.appendChild(Content_1);
    p2.appendChild(Content_2);
    newDiv.appendChild(p1);
    newDiv.appendChild(p2);
    newDiv.style.position='fixed';
    newDiv.style.backgroundColor='#ffc900'
    newDiv.style.fontSize='20px';
    document.querySelector("#beginHeaderNav").appendChild(newDiv);
    newDiv.style.top='60px';
}

function answer(ti){
    GM_xmlhttpRequest({//油猴脚本提供的异步函数
        method: 'POST',
        url: 'https://cx.icodef.com/wyn-nb',//题库接口 https://cx.icodef.com/wyn-nb
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            'Authorization':' ',//这里需要自己去关注公众号 一之哥哥 获取 token 填入即可使用
        },
        data: 'question='+ encodeURIComponent(ti.getElementsByClassName("question-title-box")[0].innerText),
        timeout: 2000,
        onload:function(xhr){
            //自动选择答案
            let json=JSON.parse(xhr.responseText);
            let daan=json.data;
            if(json.code==-1){
                daan="答案未找到";
            }
            // console.log(xhr.responseText.code);
            let answerarray=daan.split('#');//答案数组

            let daanlength=ti.getElementsByClassName("radio_item question-option-item-box").length;//多少个选项

            for(let i=0;i<daanlength;i++){
                for(let i2=0;i2<answerarray.length;i2++){
                    if(answerarray[i2] == '正确'){
                        answerarray[i2] = '对';
                    }
                    if(answerarray[i2] == '错误'){
                        answerarray[i2] = '错';
                    }
                    if(ti.getElementsByClassName("radio_item question-option-item-box")[i].innerText.split('、')[1] == answerarray[i2]){
                        ti.getElementsByClassName("radio_item question-option-item-box")[i].firstElementChild.click();
                    }
                    if(ti.getElementsByClassName("radio_item question-option-item-box")[i].innerText == answerarray[i2]){
                        ti.getElementsByClassName("radio_item question-option-item-box")[i].firstElementChild.click();
                    }
                }
            }

            //显示答案
            let newdaan=' ';
            for(let i=0;i<answerarray.length;i++){
                newdaan=newdaan+'<br>'+answerarray[i];
            }
            ti.getElementsByClassName("question-title-box")[0].innerHTML += "<br>答案:"+newdaan;
            if(index < total - 1)//继续搜索接下来的题
            {
                setTimeout(function (){
                    index = index + 1;
                    answer(tibody[index]);
                }, 1000);

            }
        }
    })
}