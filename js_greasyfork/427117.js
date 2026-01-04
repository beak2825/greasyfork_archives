// ==UserScript==
// @name         阿里云盘分页数自定义-aliyundrive.com
// @namespace    https://www.cnblogs.com/steinven/
// @version      0.4
// @description  目前阿里云盘不支持显示目录内所有文件数，只能不断下拉到底才能或取到文件数，根据需要设置分页数，越大越慢
// @author       秒年度
// @match        https://www.aliyundrive.com/*
// @icon         https://www.google.cn/s2/favicons?domain=www.aliyundrive.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427117/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%88%86%E9%A1%B5%E6%95%B0%E8%87%AA%E5%AE%9A%E4%B9%89-aliyundrivecom.user.js
// @updateURL https://update.greasyfork.org/scripts/427117/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%88%86%E9%A1%B5%E6%95%B0%E8%87%AA%E5%AE%9A%E4%B9%89-aliyundrivecom.meta.js
// ==/UserScript==


(function() {
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
                for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                    XMLHttpRequest.callbacks[i]( this );
                }
                if(arguments[0].indexOf!=undefined){
                    if(arguments[0].indexOf('limit')!==-1)
                    {
                        var json_obj = JSON.parse(arguments[0]);
                        json_obj.limit = 30;
                        arguments[0]= JSON.stringify(json_obj);
                    }
                }

                //FileList=[{name:item.next_marker,list:item.items}]
                oldSend.apply(this, arguments);
            }
        }
    }

    addXMLRequestCallback( function( xhr ) {
        console.dir(  xhr.responseText  );
    });
})();