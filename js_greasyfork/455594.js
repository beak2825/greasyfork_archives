// ==UserScript==
// @name         DMQD
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动点击"获取" 获取成功后标红提醒用户或弹窗提醒用户
// @author       zhenglj
// @match        https://bxsl.jryzt.com/icpdr/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455594/DMQD.user.js
// @updateURL https://update.greasyfork.org/scripts/455594/DMQD.meta.js
// ==/UserScript==

var d=( function() {
    'use strict';
     var $= unsafeWindow.jQuery;
     setTimeout(async ()=>{
     var CurrentUrl=location.href;
     var url='https://bxsl.jryzt.com/icpdr/saas/main.html#!/qcWorkbench';
     if (url==CurrentUrl){
     await document.querySelector("span.qcwbPageBtn:nth-child(7)").click();//点击尾页，大概率是可获取数据
     var getLength1=$("tbody>tr>td>div:contains('获取')").length;
     if(getLength1==0){
     await document.querySelector("span.qcwbPageBtn:nth-child(5)").click();
     //点击上一页
	 var getLength2=$("tbody>tr>td>div:contains('获取')").length;
         if(getLength2>0){
          RepeatClick(getLength2);
         }
 }
     if(getLength1>0){
	   RepeatClick(getLength1);
   }
    var a;
 function RepeatClick(a){
	   if(a>2)
	   {a=2;}
	   if(a>0)
	   {
		   SelectionClick();
		   setTimeout(RepeatClick(a-1),10);
           $("tbody>tr:contains('释放')").css('background','red');//背景标红提示用户

	   }
   }

   async function SelectionClick(){
    await $("tbody>tr>td>div>span:contains('获取'):last").click();
   setTimeout(function(){
       if($("#iDragPop_1>div>p:contains('请先处理完已获取任务单后，再获取更多任务单')").length==1)
    {
       setTimeout($("div.remain_close:nth-child(3)").click(),1000)
    }
       else if($("#iDragPop_1>div>p:contains('质检单已被获取')").length==1)
    {
        location.reload();
    }
       else{
       alert("已抢单，请查找！");

       }
   },200)
   }
     }
	 },1800);
     setInterval(()=>{
    setTimeout(()=>{
      var CurrentUrl=location.href;
      var url='https://bxsl.jryzt.com/icpdr/saas/main.html#!/qcWorkbench';
      if (url==CurrentUrl){
      location.reload();
      }
    },0)
},20000)
})();