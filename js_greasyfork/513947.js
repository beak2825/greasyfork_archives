// ==UserScript==
// @name         xnsy gzyx
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  加速播放
// @author       ZouYS2024
// @match        https://elearning.tcsasac.com/*
// @icon         https://elearning.tcsasac.com/znWeb/znPortal/favicon.png
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513947/xnsy%20gzyx.user.js
// @updateURL https://update.greasyfork.org/scripts/513947/xnsy%20gzyx.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* https://elearning.tcsasac.com/learn/app/clientapi/course/play/queryStatus.do */
    /* https://elearning.tcsasac.com/learn/app/clientapi/course/queryCourseDetail.do*/
    let requestObject={
        courseInfo:'/learn/app/clientapi/course/queryCourseDetail.do',
        courseStatus:'/learn/app/clientapi/course/play/queryStatus.do',
        courseLearnTime:'/learn/app/clientapi/course/bigdata/courseLearnTime.do',
        queryStatus:'/learn/app/clientapi/course/play/queryStatus.do',
        reportLearnProgress:'/learn/app/clientapi/course/progress/reportLearnProgress.do',
        uploadLearnFlag:'/learn/app/clientapi/course/uploadLearnFlag.do',
        /* courseId: 1711332482253 sid: 94058091E3C14D0E9ACEDDA3242C263F*/
        submitCourseEvaluate:'/learn/app/clientapi/trainingclass/evaluate/submitCourseEvaluate.do'
        /*contentScore:9 courseId:"N001680" effectScore:9 sid:"94058091E3C14D0E9ACEDDA3242C263F" suggest:"" trainingClassId:"2023102500122"*/
    }




    function addXMLRequestCallback() {

        // oldSend 旧函数 i 循环
        var oldSend = XMLHttpRequest.prototype.send;
        var oldOpen = XMLHttpRequest.prototype.open;


        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this._url = url; // 将 URL 存储在 XMLHttpRequest 实例的 _url 属性中
            oldOpen.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function (data) {
            var self = this;

            // 拦截发送请求
            if (self._url.includes(requestObject.courseLearnTime) && false) {
                let dur=parseInt(document.querySelector('video').duration.toFixed(0))
                console.log("courseLearnTime:")
                data = string2Object(data);
                console.log('Payload:', data);
                let nowTime = Date.now();
                data.endTime = nowTime;
                data.startTime = nowTime - dur * 1000;
                data.duration = dur * 1000;
                console.log('Changed Payload:', data);
                data = object2String(data);
            } else if (self._url.includes(requestObject.reportLearnProgress) && false) {
                let dur=parseInt(document.querySelector('video').duration.toFixed(0))
                console.log("reportLearnProgress:")
                data = JSON.parse(data);
                console.log('Payload:', data);
                data.latestTime=dur;
                data.isPlayEnd=1;
                console.log('Changed Payload:', data);
                data = JSON.stringify(data);
            }

            //拦截返回请求
            this.addEventListener('load', function() {
                if (self.responseURL.includes(requestObject.courseInfo)) {
                    let responseObject = JSON.parse(self.responseText);
                    responseObject.body.totalComments=99999999;
                    responseObject.body.isCompleted='Y';
                    responseObject.body.isRated='Y';
                    console.log("捕获请求courseInfo：", responseObject);
                    // 修改响应数据
                    let modifiedResponse = JSON.stringify(responseObject);

                    // 将修改后的响应发送给浏览器
                    Object.defineProperty(self, 'response', { writable: true });
                    Object.defineProperty(self, 'responseText', { writable: true });
                    self.response = modifiedResponse;
                    self.responseText = modifiedResponse;
                }else if (self.responseURL.includes(requestObject.queryStatus)){
                    //let dur=parseInt(document.querySelector('video').duration.toFixed(0))
                    let responseObject = JSON.parse(self.responseText);

                    responseObject.body.learnProgressLatestTime=GM_getValue("timing")||300;
                    responseObject.body.maxPlayTime=GM_getValue("timing")||300;

                    console.log("捕获请求queryStatus：", responseObject);
                    // 修改响应数据
                    let modifiedResponse = JSON.stringify(responseObject);
                    // 将修改后的响应发送给浏览器
                    Object.defineProperty(self, 'response', { writable: true });
                    Object.defineProperty(self, 'responseText', { writable: true });
                    self.response = modifiedResponse;
                    self.responseText = modifiedResponse;
                }
            });

            oldSend.call(this, data);
        };

    }
    addXMLRequestCallback()

    let string2Object=(string)=>{
        let object={};
        string.split('&').forEach(function(item) {
            let parts = item.split('=');
            object[parts[0]] = parts[1];
        });
        return object;
    }
    let object2String=(object)=>{
        return Object.keys(object).map(function (key) {
            return key + '=' + object[key];
        }).join('&');
    }


    //样式
    let style=`.button-3 {
              appearance: none;
              background-color: #2ea44f;
              border: 1px solid rgba(27, 31, 35, .15);
              border-radius: 6px;
              box-shadow: rgba(27, 31, 35, .1) 0 1px 0;
              box-sizing: border-box;
              color: #fff;
              cursor: pointer;
              display: inline-block;
              font-family: -apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
              font-size: 14px;
              font-weight: 600;
              line-height: 20px;
              padding: 6px 16px;
              position: absolute;
              left: 20px;
              top: 300px;
              text-align: center;
              text-decoration: none;
              user-select: none;
              -webkit-user-select: none;
              touch-action: manipulation;
              vertical-align: middle;
              white-space: nowrap;
            }
  
            .button-3:focus:not(:focus-visible):not(.focus-visible) {
              box-shadow: none;
              outline: none;
            }
  
            .button-3:hover {
              background-color: #2c974b;
            }
  
            .button-3:focus {
              box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px;
              outline: none;
            }
  
            .button-3:disabled {
              background-color: #94d3a2;
              border-color: rgba(27, 31, 35, .1);
              color: rgba(255, 255, 255, .8);
              cursor: default;
            }
  
            .button-3:active {
              background-color: #298e46;
              box-shadow: rgba(20, 70, 32, .2) 0 1px 0 inset;
            }`
    window.onload=()=>{
        setTimeout(()=>{
            //自动点击播放
            if(document.querySelector('video') && document.querySelector('.vjs-poster')){
                document.querySelector('.vjs-poster').click();
                console.log("自动播放")
            }
        },3000)
        /**
         * 简单视频处理，16倍速，可失焦
         * */
        var timeout;
        let simplePlay=()=>{
            if(document.querySelector('video')){
                if(GM_getValue('timing')&&GM_getValue('timing')!==document.getElementById('timing').value){
                    GM_setValue('timing',document.querySelector('video').duration.toFixed(0));
                    location.reload();
                }
                GM_setValue('timing',document.querySelector('video').duration.toFixed(0));

            }
            document.querySelector('video').playbackRate=16
            timeout=setInterval(()=>{
                document.querySelector('video').play().then(r => {});
            },1000)
        }
        let myStyle=document.createElement('style')
        myStyle.innerHTML=style;
        document.head.appendChild(myStyle);
        /*let intercept=GM_GetValue*/
        let div=document.createElement('div');
        div.innerHTML=`<div style="left: 0;top: 300px;" id="my1" class="button-3" >加速播放</div>
                        <div style="position:absolute;left: 0;top: 350px;color: aqua;">视频时长(s):</div><input id="timing" type="number" min="1"  step="60" value="0" style="position:absolute;left:90px;top:350px;width: 50px;">
                        <div style="left: 0;top: 400px;" id="my2"   class="button-3" >预留</div>`
        document.body.appendChild(div);
        let isClick=false;
        document.getElementById('timing').addEventListener('change',()=>{
            GM_setValue('timing',document.getElementById('timing').value)
        })
        document.getElementById('timing').value=GM_getValue("timing") || 0;
        if(GM_getValue("timing")){
            GM_setValue('timing',document.getElementById('timing').value)
        }

        let my1=document.getElementById('my1')
        my1.addEventListener("click", ()=>{
            isClick=!isClick;
            if(isClick){
                my1.innerText="暂停"
                simplePlay();
            }else {
                my1.innerText="解除失焦"
                clearInterval(timeout);
                document.querySelector('video').pause();
            }
        })
        //my1.click();

       /* document.querySelector('video').addEventListener('ended', function() {
            clearInterval(timeout);
            document.querySelector('video').pause();
            console.log('视频播放完成');
        });*/

    }
})();