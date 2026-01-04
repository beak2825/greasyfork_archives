// ==UserScript==
// @name         河北工程大学评教助手2
// @namespace    http://27.188.65.169:9112/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @version      1.0.1
// @description  自动评教
// @author       You
// @match        http://27.188.65.169:9112/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454983/%E6%B2%B3%E5%8C%97%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B2.user.js
// @updateURL https://update.greasyfork.org/scripts/454983/%E6%B2%B3%E5%8C%97%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
console.log("进来了");
    var  ar=document.getElementsByTagName("textarea");
    var a=9;
    for(var i=0;i<ar.length-1;i++){
    ar[i].value=a+Math.floor( Math.random()*10 )*0.1;
    }
    let aa = Math.random();
            //随机生成的数字 0-1之间
            //乘以6之后 0-7之间
            let bb = aa* 6
            // 向下取整
            let cc = Math.floor(bb)//向下取整
var ty=['老师讲的非常棒，没有意见','老师很好，没有意见','讲的好，没有意见','棒极了，没有意见','老师太好了，没有意见','老师很棒，没有意见']
        var len=ar.length-1;
    ar[len].value=ty[cc];
    var er=document.getElementById("RemainS");

     var wr=document.getElementById("RemainM");
    window.setTimeout(function(){
		    if(er.innerText==0&&wr.innerText==0){
        document.getElementById("buttonSubmit").click();
                  window.setTimeout(function(){
                      var tt=document.getElementsByClassName("layui-layer-btn0");
                      tt[0].click();

	},2000);

    }
	},125000);





})();