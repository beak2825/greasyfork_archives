
// ==UserScript==
// @name         北大青鸟刷题无需数据库
// @namespace     http://tampermonkey.net/
// @version      0.5
// @description  使用方法：点击图片
// @license MIT
// @author       HellSherry
// @match        https://tiku.kgc.cn/testing/*
// @match        https://exam.bdqn.cn/testing/*
// @match        https://exam-resources.bdqn.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kgc.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477017/%E5%8C%97%E5%A4%A7%E9%9D%92%E9%B8%9F%E5%88%B7%E9%A2%98%E6%97%A0%E9%9C%80%E6%95%B0%E6%8D%AE%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/477017/%E5%8C%97%E5%A4%A7%E9%9D%92%E9%B8%9F%E5%88%B7%E9%A2%98%E6%97%A0%E9%9C%80%E6%95%B0%E6%8D%AE%E5%BA%93.meta.js
// ==/UserScript==

(function() {

    var TAnswer="none";


    if(window.location.href.indexOf("/testing/paper/solutions")!=-1&&localStorage.getItem("IsControl")=='1'){
          window.onload = function () {
              const answers = new Map();
             Array.from(document.getElementsByClassName("green")).forEach(function(item){
                 if(answers.has(item.children[0].children[1].src.substring(54,75))){
                                 answers.set(item.children[0].children[1].src.substring(54,75),answers.get(item.children[0].children[1].src.substring(54,75))+item.children[0].children[0].innerText.substring(0,1))
                 }else{

                                  answers.set(item.children[0].children[1].src.substring(54,75),item.children[0].children[0].innerText.substring(0,1))

                 }



              });
localStorage.setItem("Answer", JSON.stringify(Object.fromEntries(answers)))
console.log(JSON.stringify(Object.fromEntries(answers)))
               window.close()
          }}
    else if(window.location.href.indexOf("/testing/exam/againPaper/134738685")!=-1&&localStorage.getItem("IsControl")=='1'){
document.getElementById("putIn").click()
            document.getElementById("putInBtn").click()
          window.close()

      }
    else if(window.location.href.indexOf("/testing/exam/againPaper")!=-1&&localStorage.getItem("IsControl")=='1'){

         $.ajax({
        type: "GET",
        url: '/testing/exam/againPaper/134738685',
        contentType: "application/json;charset=utf-8",
        success: function (message){

document.getElementById("putIn").click()
            document.getElementById("putInBtn").click()
            setInterval(() => {
                if (document.getElementById("testDialog").style.display == "block"||document.querySelector("#returnDialog").style.display=="block") {

  document.getElementById("closeReturnDialog").click()
       
                }
            }, 1000);

        }})
    }
    else if(window.location.href.indexOf("/testing/paper/report")!=-1&&localStorage.getItem("IsControl")=='1'){
 window.location.href=window.location.href.replace("report", "solutions");

    }
    else{
 var imgObjs=document.getElementsByTagName('img');
imgObjs=Array.from(imgObjs)
document.querySelector("#countDown").ondblclick=function(){
   if(TAnswer=='none'){

       imgObjs[0].click()
              }else{
              imgObjs.forEach(function(element) {
 element.click()
});

              }



}

        for (var i = 0;i < imgObjs.length; i ++) {
            imgObjs[i].onclick =async function () {
 console.log(localStorage.getItem("IsControl")
)
                if(localStorage.getItem("IsControl")=='1'){return;}

              if(TAnswer=='none'){
                  localStorage.setItem("IsControl",'1')
                  var ss1 =window.open('/testing/exam/againPaper/134738685', "ssssss", "height=1, width=1, top=10000,left=9100, scrollbars=yes, resizable=no");


                //window.open(this.src,name,'height='+1+',innerHeight='+1+',width='+1+',innerWidth='+1+',top='+9999+',left='+9999+',toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');

                var ss2 = setInterval(function() {
        if(ss1.closed) {
            clearInterval(ss2);
           var openWin =window.open('/testing/exam/againPaper/'+document.querySelector("body > div.sub > div > div > div.yui3-u-4-5.top15 > div:nth-child(2) > dl.sec3.font-yahei.f16 > dd:nth-child(1)").getAttribute("data").split(',')[1], "Newwindow", "height=1, width=1, top=10000,left=9100, scrollbars=yes, resizable=no");

// var openWin =window.open(document.querySelector("#putIn").getAttribute("data").replace("answer", "exam/againPaper"))
               var winLoop = setInterval(function() {
        if(openWin.closed) {
            clearInterval(winLoop);
            TAnswer=JSON.parse(localStorage.getItem("Answer"))
            console.log(TAnswer)
              localStorage.setItem("IsControl",'0')
        }
}, 3000);


        }
            }, 1000);
              }
                else{


 var answerD= TAnswer[this.src.substring(54,62)+(parseInt(this.src.substring(62,75))-parseInt(document.querySelector("#basic-header > div > ul > li:nth-child(2) > a").href.substring(34,40)))]



 var da= answerD.split('');

    for(var s=0;s<this.parentNode.parentNode.parentNode.children[2].children.length;s++){
      if(this.parentNode.parentNode.parentNode.children[2].children[s].children[0].children[0].checked){
                      this.parentNode.parentNode.parentNode.children[2].children[s].click()
               }
    }

        for (var q = 0;q < da.length; q ++) {
var numm=-1;
        switch(da[q]){
            case "A":
numm=0

                break;
            case "B":

              numm=1
                break;
            case "C":
        numm=2
                break;
            case "D":
           numm=3
break;
            case "E":
          numm=4
                break;
            case "F":
          numm=5
                break;
            case "G":
         numm=6
                break;
            default:
                  alert(da[q])
                break;


        }

               if(!this.parentNode.parentNode.parentNode.children[2].children[numm].children[0].children[0].checked){
                      this.parentNode.parentNode.parentNode.children[2].children[numm].click()
               }


        }


            }
        }
}


document.querySelector("#basic-header > div > div.text-1").ondblclick=
 function(){
    try{
    ss1.close()
winLoop.close()
    }catch(e){

    }
        console.log(document.querySelector("#putIn").getAttribute("data"))

    localStorage.setItem("IsControl",'1')

                  var ss1 =window.open('/testing/exam/againPaper/134738685', "ssssss", "height=1, width=1, top=10000,left=9100, scrollbars=yes, resizable=no");


                //window.open(this.src,name,'height='+1+',innerHeight='+1+',width='+1+',innerWidth='+1+',top='+9999+',left='+9999+',toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');

                var ss2 = setInterval(function() {
        if(ss1.closed) {
            clearInterval(ss2);
            var openWin =window.open(document.querySelector("#putIn").getAttribute("data").replace("answer", "exam/againPaper"), "Newwindow", "height=1, width=1, top=10000,left=9100, scrollbars=yes, resizable=no");


               var winLoop = setInterval(function() {
        if(openWin.closed) {
            clearInterval(winLoop);
            TAnswer=JSON.parse(localStorage.getItem("Answer"))
            console.log(TAnswer)
            localStorage.setItem("IsControl",'0')
        }
}, 3000);


        }
            }, 1000);

}

    }


    'use strict';
    // Your code here...
})();