// ==UserScript==
// @name         Mira Comment Collector
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  直播互动抓取脚本
// @author       You
// @match        https://channels.weixin.qq.com/platform/live/liveBuild
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license      MIT License 
// @downloadURL https://update.greasyfork.org/scripts/452898/Mira%20Comment%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/452898/Mira%20Comment%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let seqsList = [];

    async function postMessage(live_id, danmu_list) {
    	if (!danmu_list || !danmu_list.length) return
    	let data = {live_id,danmu_list}
    	let response = await fetch('https://peng.mirav.cn:5000/danmu', {
    		method: 'POST',
    		mode: 'no-cors',
    		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    		headers: {
    			'Accept': 'application/json',
    			'Content-Type': 'application/json'
    	    },
    	    body: JSON.stringify(data)
    	});
    	let responseJson = await response.json();
    	console.log({responseJson});
    }

    function didReceiveMsgs(msgResponseJson) {
    	let live_id = msgResponseJson.liveInfo.liveId;
        udpate_live_id(live_id);
    	let danmu_list = []
    	msgResponseJson.msgList.forEach(msg => {
    		if (seqsList.includes(msg.seq)) {return;}
            if (msg.content === msg.nickname+'进入直播间') {return;}
    		danmu_list.push({
    			"content": msg.content,
    			"sender": msg.nickname
    		});
    		seqsList.push(msg.seq);
            if (seqsList.length > 1000) seqsList.shift();
    	});
    	postMessage(live_id, danmu_list);
    }

    function addXMLRequestCallback(callback){
        //是一个劫持的函数
        var oldSend, i;
        if( XMLHttpRequest.callbacks ) {
          	//判断XMLHttpRequest对象下是否存在回调列表，存在就push一个回调的函数
            // we've already overridden send() so just add the callback
            XMLHttpRequest.callbacks.push( callback );
        } else {
            // create a callback queue
            XMLHttpRequest.callbacks = [callback];
            //如果不存在则在xmlhttprequest函数下创建一个回调列表
            // store the native send()
            oldSend = XMLHttpRequest.prototype.send;
            //获取旧xml的send函数，并对其进行劫持
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
                //循环回调xml内的回调函数
                // call the native send()
                oldSend.apply(this, arguments);
               //由于我们获取了send函数的引用，并且复写了send函数，这样我们在调用原send的函数的时候，需要对其传入引用，而arguments是传入的参数
            }
        }
    }

    addXMLRequestCallback( function( xhr ) {
            //调用劫持函数，填入一个function的回调函数
            //回调函数监听了对xhr调用了监听load状态，并且在触发的时候再次调用一个function，进行一些数据的劫持以及修改
            xhr.addEventListener("load", function(){
            if ( xhr.readyState == 4 && xhr.status == 200 && xhr.responseURL.endsWith('/msg') ) {
            	let res = JSON.parse(xhr.responseText)
                didReceiveMsgs(res.data);
            }
        });
    });

    function udpate_live_id(live_id) {
        if (!live_id) {return;}
        let live_id_el = document.querySelector('.live_id')
        if (live_id_el) {
            if (live_id_el.getAttribute('live_id') === live_id) {
                return
            }
            live_id_el.remove();
        }
        live_id_el = document.createElement('a');
        live_id_el.setAttribute('target', '_blank');
        live_id_el.setAttribute('class', 'live_id');
        live_id_el.setAttribute('href', 'https://peng.mirav.cn:5000/danmu_index?live_id='+live_id);
        live_id_el.innerHTML = 'live_id: ' + live_id
        document.querySelector('#footer').appendChild(live_id_el)
    }

})();