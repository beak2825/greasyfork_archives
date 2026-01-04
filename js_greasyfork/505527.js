// ==UserScript==
// @name        加班考勤餐费计算
// @namespace   Violentmonkey Scripts
// @match       *://tam.isstech.com/*
// @grant       GM_xmlhttpRequest
// @connect     tcggy2.com
// @version     1.3
// @author      -
// @description 软通智慧加班考勤餐费计算
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505527/%E5%8A%A0%E7%8F%AD%E8%80%83%E5%8B%A4%E9%A4%90%E8%B4%B9%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/505527/%E5%8A%A0%E7%8F%AD%E8%80%83%E5%8B%A4%E9%A4%90%E8%B4%B9%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let kaoqinData
    function addXMLRequestCallback(callback){
        // 是一个劫持的函数
        let oldSend, i;
        if( XMLHttpRequest.callbacks ) {
            //   判断XMLHttpRequest对象下是否存在回调列表，存在就push一个回调的函数
            // we've already overridden send() so just add the callback
            XMLHttpRequest.callbacks.push( callback );
        } else {
            // create a callback queue
            XMLHttpRequest.callbacks = [callback];
            // 如果不存在则在xmlhttprequest函数下创建一个回调列表
            // store the native send()
            oldSend = XMLHttpRequest.prototype.send;
            // 获取旧xml的send函数，并对其进行劫持
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
                // 循环回调xml内的回调函数
                // call the native send()
                oldSend.apply(this, arguments);
            //    由于我们获取了send函数的引用，并且复写了send函数，这样我们在调用原send的函数的时候，需要对其传入引用，而arguments是传入的参数
            }
        }
    }

    // e.g.
    addXMLRequestCallback( function( xhr ) {
      // 调用劫持函数，填入一个function的回调函数
      // 回调函数监听了对xhr调用了监听load状态，并且在触发的时候再次调用一个function，进行一些数据的劫持以及修改
      xhr.addEventListener("load", function(){
        if ( xhr.readyState == 4 && xhr.status == 200 && xhr.responseURL.indexOf("FindAttendanceCalendarList")>0) {
          kaoqinData = JSON.parse(xhr.response).Data
        }
      });
    });

    function waitForVue(callback) {
        const checkIfVueIsLoaded = setInterval(() => {
            if (document.getElementsByClassName("calendar_top").length>0 && document.getElementsByClassName("aaaaa").length==0) {
                callback();
            }
        }, 2000); // 每100毫秒检查一次
    }

    // 使用上述函数
    waitForVue(() => {
      const alink = document.createElement("a");
      alink.className="aaaaa"
      alink.innerHTML = "下载当月加班统计";
      alink.onclick = function(){
        console.log(kaoqinData)
        GM_xmlhttpRequest({
            method: "post",
            url: 'http://qnap.tcggy2.com:8081/ggy/kaoqin',
            data: JSON.stringify(kaoqinData),
            headers: {
              'Content-Type':'application/json'
            },
            onload: function(res){
                if(res.status === 200){
                    console.log('成功')
                    console.log(res.responseText)
                    window.location.href="http://qnap.tcggy2.com:8081/ggy/kaoqin/download/"+res.responseText
                }else{
                    console.log('失败')
                }
            },
            onerror : function(err){
                console.log('error')
                console.log(err)
            }
        });
      }
      document.getElementsByClassName("calendar_top")[0].appendChild(alink);
    });
})();