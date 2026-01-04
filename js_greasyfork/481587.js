// ==UserScript==
// @name         B站视屏截图
// @namespace    http://tampermonkey.net/
// @version      final2.0
// @description  B站视屏截图，脚本运行后会添加一个蓝色的截屏按钮
// @author       Slime
// @match        http*://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=capturecast.net
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481587/B%E7%AB%99%E8%A7%86%E5%B1%8F%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/481587/B%E7%AB%99%E8%A7%86%E5%B1%8F%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
   'use strict';

    function FindvideoEle(){
       function f (){
           let videos=document.getElementsByTagName('video');
           if(videos.length>0){
               //videos.each(function(index){addScreenShotEle($(this))});
               //[].forEach.call(videos,function(video){addScreenShotEle($(video));});
               for(let i=0;i<videos.length;i++){
                  addScreenShotEle(videos[i]);
               }
           }
       }
       setInterval(f,3000);
    }
    function addScreenShotEle(vi){
        //let SsIDname=vi.attr("src")+"_Sshot";
        let SsIDname=vi.id+"_Sshot";
        //if ($("#"+SsIDname).length<=0){
        if(document.getElementById(SsIDname)===null){
            //
            //let SsHtml=$("<div></div>");
            //let SsHtml=document.createElement("div");
            let SsHtml=document.createElement("button");
            //SsHtml.text("截屏");
            //SsHtml.css({
            //    'background-color': 'rgba(0,174,236, 1)',
            //    "color": "#fff",
            //    'font-size': '20px',
            //    'cursor': 'pointer',
            //    "border-radius": "10px",
            //    "padding-left": "10px",
            //    "padding-right": "10px",
            //    "margin-bottom": "2px"
           // });
           // SsHtml.attr("id",SsIDname);
           SsHtml.textContent = "截屏";
           SsHtml.style.backgroundColor = 'rgba(0,174,236, 0.5)';
           SsHtml.style.transition = 'background-color 0.3s';// 添加过渡效果
            // 鼠标悬浮时改变样式
            SsHtml.addEventListener("mouseover", function(event) {
                SsHtml.style.backgroundColor = 'rgba(0,174,236, 1)';// 悬浮时完全不透明
            });
            SsHtml.addEventListener("mouseout", function(event) {
                SsHtml.style.backgroundColor = 'rgba(0,174,236, 0.5)';// 移出悬浮时恢复半透明状态
            });
           SsHtml.style.color = '#ffffff';
           SsHtml.style.fontSize = '15px';
           SsHtml.style.cursor = 'pointer';
           SsHtml.style.borderRadius= "10px";
            SsHtml.style.border ="0px solid #ffffff";
           SsHtml.style.paddingLeft= "10px";
           SsHtml.style.paddingRight= "10px";
           SsHtml.style.marginBottom= "2px";
            // 计算父节点偏移
         /*let offsetTop = 0;
         let offsetLeft = 0;
         let parentElement = vi.parentElement;
         while (parentElement) {
             offsetTop += parentElement.offsetTop;
             offsetLeft += parentElement.offsetLeft;
             parentElement = parentElement.offsetParent;
         }*/
            /*// 使用绝对定位将按钮移到视频区域外紧挨着左上方
         const rect = vi.getBoundingClientRect();
         //const parentRect = vi.parentElement.getBoundingClientRect();
         const topOffset = rect.top + offsetTop+'px';
         const leftOffset = offsetLeft+rect.left+'px';
            // 设置按钮样式和位置
            SsHtml.setAttribute("style", `position: absolute; top: ${topOffset}px; left: ${leftOffset}px;z-index:9999`);*/
            // 找到与视频相同大小的父节点
            let targetNode = check(vi,"playerWrap");
            SsHtml.setAttribute("id",SsIDname);
            //vi.parent().before(SsHtml);
            //vi.parentElement.insertBefore(SsHtml,vi);
            //达不到预期document.body.appendChild(SsHtml); // 将按钮添加到 body 元素中
            //SsHtml.on("click",function(event){
            targetNode.insertBefore(SsHtml ,targetNode.firstChild); // 将按钮插入目标节点前面
            SsHtml.addEventListener("click",function(event){
                //引用Vant1032's github code
                //用document.querySelector(".bpx-player-video-wrap video")来选择视频元素。
                //这种方式只会选择页面上第一个匹配的元素，而不是所有的视频元素。因此，当脚本运行时可能无法正确地为每个视频添加截图按钮。
                //为了解决这个问题，可以修改 addScreenShotEle 函数中的 querySelector 语句以便获取当前正在处理的视频元素：
                //通过将 vi（即当前处理的视频元素）传递给截图按钮点击事件处理程序，可以确保每个按钮都能够对应正确的视频元素，并在点击时执行相应操作。
                // var v = document.querySelector(".bpx-player-video-wrap video");
                // 阻止事件传递到视频元素
                event.stopPropagation();
                 var v=vi;
                 var myCanvas = new OffscreenCanvas(v.videoWidth,v.videoHeight);
                 var ctx = myCanvas.getContext('2d');
                 ctx.drawImage(v, 0, 0, v.videoWidth, v.videoHeight)
                 myCanvas.convertToBlob().then(blob => {
                   const fileName = 'screenshot.png';
                   const d = document.createElement('a')
                   d.href = window.URL.createObjectURL(blob)
                   d.download = fileName
                   d.style.display = 'none'
                   document.body.appendChild(d)
                   d.click()
                   document.body.removeChild(d)
                   window.URL.revokeObjectURL(d.href)
                 })
                /*var myCanvas = document.createElement('canvas');
                myCanvas.width = vi.videoWidth;
                myCanvas.height = vi.videoHeight;
                var ctx = myCanvas.getContext('2d');
                ctx.drawImage(vi, 0, 0, vi.videoWidth, vi.videoHeight);
                alert("截图成功！");*/
            });
        }else{;}
    }
    /*function findParentWithSmallerHeight(element) {
        let parent=check(element);
        while(parent!==null && (parent.offsetHeight>=element.offsetHeight || parent.offsetWidth!==element.offsetWidth)) {
            parent=parent.parentElement;
        }
        return (parent !== null) ? parent : document.body; // 如果没有找到符合条件的父节点，则返回 body 元素
    }*/
    /*function check(videoElement) {
        let siblings = Array.from(videoElement.parentElement.children).filter(el => el !== videoElement);
        debugger;
        if (siblings.length > 0) {
            for (let sibling of siblings) {
                if (sibling.offsetWidth === videoElement.offsetWidth && sibling.offsetHeight < videoElement.offsetHeight) {
                    return videoElement;
                }
            }
        } else if (videoElement.parentElement !== document.body) { // 如果没有兄弟节点，则继续向上查找
            check(videoElement.parentElement);
        }
    }*/
    function check(element,idName) {
        while (element && element.id !== idName) {
         element=element.parentElement;
     }
        return element;
    }
    //$(document).ready(function(){ findVideoEle(); });
    (function() {FindvideoEle();})();

    // Your code here...
})();