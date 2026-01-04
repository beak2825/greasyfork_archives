// ==UserScript==
// @name         传智网课答题
// @namespace    http://stu.ityxb.com/writePaper/busywork/*
// @version      1.9
// @description  传智教育答题
// @author       土豆
// @connect      *
// @match        http://stu.ityxb.com/writePaper/busywork/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/432256/%E4%BC%A0%E6%99%BA%E7%BD%91%E8%AF%BE%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/432256/%E4%BC%A0%E6%99%BA%E7%BD%91%E8%AF%BE%E7%AD%94%E9%A2%98.meta.js
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
                 let newContent = document.createTextNode("自动答题功能并不完善，自己看着答案再选一遍，老师不布置题了我也不更新了凑合用吧");
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