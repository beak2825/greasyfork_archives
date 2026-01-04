// ==UserScript==
// @name         奥鹏答案获取
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  实现在问题上显示答案!
// @author       SQ
// @match        https://learn.open.com.cn/StudentCenter/OnLineJob/TestPaper*
// @grant        GM_getResourceURL
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/408018/%E5%A5%A5%E9%B9%8F%E7%AD%94%E6%A1%88%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/408018/%E5%A5%A5%E9%B9%8F%E7%AD%94%E6%A1%88%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

//全局问题
var question;
//请求的问题封装（方便根据id查找对应的对象）
var map={};
//根据问题的id来获取答案封装
var answer={};
function addXMLRequestCallback(callback){
    var oldSend, i;
    if( XMLHttpRequest.callbacks ) {
        // we've already overridden send() so just add the callback
        XMLHttpRequest.callbacks.push( callback );
    } else {
        // create a callback queue
        XMLHttpRequest.callbacks = [callback];
        // store the native send()
        oldSend = XMLHttpRequest.prototype.send;
        // override the native send()
        XMLHttpRequest.prototype.send = function(){
            // process the callback queue
            // the xhr instance is passed into each callback but seems pretty useless
            // you can't tell what its destination is or call abort() without an error
            // so only really good for logging that a request has happened
            // I could be wrong, I hope so...
            // EDIT: I suppose you could override the onreadystatechange handler though
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i]( this );
            }
            // call the native send()
            oldSend.apply(this, arguments);
        }
    }
}

//根据问题找出具体的id
function initquestion(question){
    //找出的问题数组
   let list= question.data.paperInfo.Items;
    list.forEach((item,index,array)=>{
    map[item.I1]=item
        //封装请求
       let basturl = 'https://learn.open.com.cn/StudentCenter/OnlineJob/GetQuestionDetail?bust=${bust}&itemBankId=${itemBankId}&questionId=${questionId}&_=1596253257714'
     let bust=(new Date()).getTime() ;
     let itemBankId=item.I4;
     let questionId =item.I1;
   let rquurl = basturl.replace('${bust}',bust).replace('${itemBankId}',itemBankId).replace('${questionId}',questionId);
    map[item.I1]=rquurl
    fetch(rquurl,{
    method: 'GET',
        headers:{
        'cookie':document.cookie
        }
    }).then(response =>response.json()).then(data =>{
   console.log('=======data==================')
        console.log(data);
       let choiceslist= data.data.Choices

       let questionlist = new Array();
       choiceslist.forEach((iteam,index,array)=>{
       if(iteam.IsCorrect){
           questionlist.push(iteam.I1 +" "+iteam.I2);
       }



       })
                   //根据名称直接赋值
          let dom= document.querySelector("div[itemid='"+item.I1+"']")
          //创建元素开始赋值

          //获取标题

          let title=dom.getElementsByClassName('Subject-Title')


         let div=  document.createElement("div");
       let div_p= document.createElement("p");
        div_p.innerText+="答案：";
        div.appendChild(div_p)
           questionlist.forEach((iteam,index,array)=>{
          let div_p_p= document.createElement("p");
            div_p_p.innerHTML+=iteam;
             div.appendChild(div_p_p)

               div.className ='Student-Answer';
           })
           title[0].appendChild(div)
            console.log('=======questionlist==================')
           console.log(questionlist)

        questionlist

       answer[item.I1]=questionlist;

    return data;


    } )








})
}


(function() {
    'use strict';

    // Your code here...
    addXMLRequestCallback( function( xhr ) {
            xhr.addEventListener("load", function(){
                if ( xhr.readyState == 4 && xhr.status == 200 ) {
                     console.log(xhr.responseURL);
                    if ( xhr.responseURL.includes("homeworkapi.open.com.cn/getHomework") ) {
                        console.log(xhr.responseURL);
                        question=JSON.parse(xhr.responseText);
                        console.log(question);
                        initquestion(question);
                    }
                }
            });
        });

    //延迟执行
   // setTimeout(function(){
   // console.log('=======延迟执行==================')
   // console.log('=======接受的值==================')
  // console.log(question);
        //初始化
//initquestion(question);
  // console.log('========正确答案==================')
//           console.log(answer)



  //  }, 10000);



  
})();