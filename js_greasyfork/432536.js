// ==UserScript==
// @name         驼人云学堂自动刷视频-V1.0  czy
// @namespace    czy
// @version      1.0.9
// @description  云学堂视频自动播放
// @author       czy
// @icon         https://picobd.yxt.com/orgs/yxt_malladmin/mvcpic/image/201811/71672740d9524c53ac3d60b6a4123bca.png
// @match        http://*.yunxuetang.cn/plan/*.html
// @match        http://*.yunxuetang.cn/kng/plan/document/*
// @match        http://*.yunxuetang.cn/kng/view/document/*
// @match        http://*.yunxuetang.cn/kng/plan/video/*
// @match        http://*.yunxuetang.cn/kng/view/video/*
// @match        http://*.yunxuetang.cn/kng/view/package/*
// @match        http://*.yunxuetang.cn/kng/plan/package/*
// @match        http://*.yunxuetang.cn/kng/o2ostudy/video/*
// @match        http://*.yunxuetang.cn/mit/myhomeworkexprience*
// @match        http://*.yunxuetang.cn/kng/course/package/video/*
// @match        http://*.yunxuetang.cn/kng/course/package/document/*
// @match        http://*.yunxuetang.cn/sty/index.htm/*
// @match        http://*.yunxuetang.cn/kng/o2ostudy/document/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @connect      none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/432536/%E9%A9%BC%E4%BA%BA%E4%BA%91%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91-V10%20%20czy.user.js
// @updateURL https://update.greasyfork.org/scripts/432536/%E9%A9%BC%E4%BA%BA%E4%BA%91%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91-V10%20%20czy.meta.js
// ==/UserScript==

(function () {
    function Toast(msg, duration) {
    	duration = isNaN(duration) ? 3000 : duration;
    	var m = document.createElement('div');
    	m.innerHTML = msg;
    	m.style.cssText = "font-family:siyuan;max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 2%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
    	document.body.appendChild(m);
    	setTimeout(function() {
    		var d = 0.5;
    		m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
    		m.style.opacity = '0';
    		setTimeout(function() {
    			document.body.removeChild(m)
    		}, d * 1000);
    	}, duration);
    }
   setInterval(()=>{
       //触发看视频中的弹框
       Element.prototype.trigger = function(eventName){
           this.dispatchEvent(new Event(eventName));
       }
       let theTarget = document.querySelector('#reStartStudy');  // Element
       if(theTarget == null){
           //console.log(theTarget);
       }else{
           theTarget.trigger('click');
           theTarget.trigger('mousedown');
       }
       
       //章节栏
       let myDocumentSpanArray = $(".el-course-catalog-right span");
       let nextStudy = 0;
       for(let i = 0;i<myDocumentSpanArray.length;i++){
           if(myDocumentSpanArray[i].title == $("#lblTitle").text()){
               nextStudy = (i+1)>myDocumentSpanArray.length?myDocumentSpanArray.length:(i+1);
               if(nextStudy == myDocumentSpanArray.length){
                    console.log("没有下节课课程了")
                    Toast('当前课程：&nbsp;&nbsp;'+myDocumentSpanArray[i].title+'&nbsp;&nbsp;&nbsp;&nbsp;,下节课课程:无',2000);
               }else{
                    console.log("下节课课程"+myDocumentSpanArray[nextStudy].title)
                    Toast('当前课程：'+myDocumentSpanArray[i].title+',下节课课程：'+myDocumentSpanArray[nextStudy].title,2000);
               }
           }
       }
       if($("#divCompletedArea").css("display")!="none"){//已经完成
           if(nextStudy<myDocumentSpanArray.length && nextStudy!=0){
               myDocumentSpanArray[nextStudy].trigger("click");
           }
       }
       if($("#dvCantPlay2").css("display")!="none"){//不让看下一节课的弹框
           $("#dvCantPlay2 .btnok").trigger("click");
       }
      
   },5000)
})();