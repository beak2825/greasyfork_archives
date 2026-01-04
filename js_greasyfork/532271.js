// ==UserScript==
// @name          清除时间
// @namespace     http://bonawise.yyhq365.cn/loginController.do?login#
// @version       0.0.1
// @description  客服一键派单
// @author       pushOrder
// @include      *onawise.yyhq365.cn/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532271/%E6%B8%85%E9%99%A4%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/532271/%E6%B8%85%E9%99%A4%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

( function() {
    'use strict';
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

     function clearTimeReset(){
        console.log("clearTimeReset")
        $view().removeTask("getTimeSend");
        var pData=pView.$('FormSendQuery').getFieldOrControl('ButtonQuery').getContainer().getData();
        console.log(pData['recCreateTime@GE']);
        pData['recCreateTime@GE']='';
        console.log(pData['recCreateTime@LE']);
        pData['recCreateTime@LE']='';
    }

    addXMLRequestCallback( function( xhr ) {
        xhr.addEventListener("load", function(){
            if ( xhr.readyState == 4 && xhr.status == 200 ) {
                // console.log( xhr.responseURL );
                if ( xhr.responseURL.includes("maintainListSend.view") ) {
                    setTimeout(clearTimeReset, 1000 * 3);
                    // clearTimeReset();
                    console.log(xhr);
                    //do something!
                    let response = xhr.responseText;

                    // console.log(response);
                }
            }
        });
    });
})(); //(function(){})() 表示该函数立即执行
