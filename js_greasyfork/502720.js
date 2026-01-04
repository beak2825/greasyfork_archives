// ==UserScript==
// @run-at    document-start
// @name         和家亲分享永久直链
// @namespace    linux.do
// @version      0.2
// @description  linux.do
// @author       k452b
// @match        https://homecloud.komect.com/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502720/%E5%92%8C%E5%AE%B6%E4%BA%B2%E5%88%86%E4%BA%AB%E6%B0%B8%E4%B9%85%E7%9B%B4%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/502720/%E5%92%8C%E5%AE%B6%E4%BA%B2%E5%88%86%E4%BA%AB%E6%B0%B8%E4%B9%85%E7%9B%B4%E9%93%BE.meta.js
// ==/UserScript==


'use strict';

var importJs=document.createElement('script') //在页面新建一个script标签
importJs.setAttribute("type","text/javascript") //给script标签增加type属性
importJs.setAttribute("src", 'https://cdn.homecloud.komect.com/gateway/share/oss/15b557e0d25406b90ad79d6344b001291e92388a0d43fc075f354880dfcabd00cf98a539e322524241ef39abee31109d6b3d2b6be5fbc2f62bf932ec4ea0d48435ae7e0e3e206a187f29282e508a5925cfa0e25719a6748f7ac9ec182d5e5ec26345331be6801a0d5ff43afa57ece40e827d85bad35ebfa41826d8b94356d9adbcb447e3a96b858268b7efbc95669a3b') //给script标签增加src属性
document.getElementsByTagName("head")[0].appendChild(importJs) //把importJs标签添加在页面

$(() => {
    const RandomProducer = {
        getRandomStr: length => {
            const chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }
    };

    const getRequestHeader = (params) => {
        const url = "/share/getShare/v1"
        var timestamp = (new Date).valueOf();
        var requestId = RandomProducer.getRandomStr(12);
        var sha1Hash = 0 == Object.keys(params).length
        ? CryptoJS.SHA1("").toString().toUpperCase()
        : CryptoJS.SHA1(JSON.stringify(params)).toString().toUpperCase();
        var signature = CryptoJS.MD5(url + ";" + sha1Hash + ";" + requestId + ";homeCloudShare;" + timestamp).toString().toUpperCase();

        return {
            "Content-Type": "application/json",
            "Authorization": "homeCloudShare",
            "X-User-Agent": "H5",
            "Timestamp": timestamp,
            "Signature": signature,
            "Request-Id": requestId
        };
    }

    const getShareLink = (shareId) => {
        shareData = {"shareId": shareId }
        $.ajax({
            url:"https://homecloud.komect.com/front/share/getShare/v1",
            type:"POST",
            ContentType:"application/json",
            headers:getRequestHeader(shareData),
            data:JSON.stringify(shareData),
            success: (data)=>{
                if(data.ret == 200){
                    let baseurl = 'https://cdn.homecloud.komect.com/gateway'
                    let link = baseurl + data.data.resourceInfoList[0].fileInfo.extinfo.originFileUrl
                    $(".link-input")[0].value = link
                    console.log(link)
                }
            }
        })
    }

    function createBtn(){
        let linkBtn = $(`<button type="button" class="ant-btn ant-btn-primary link-btn"><span>复制直链</span></button>`)
        linkBtn.click(
            function(){
                $(".ant-modal-footer").children()[1].click()
                navigator.clipboard.writeText($(".link-input")[0].value)
                //al = $(`<span><div class="ant-message-notice"><div class="ant-message-notice-content"><div class="ant-message-custom-content ant-message-success"><i aria-label="icon: check-circle" class="anticon anticon-check-circle"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg></i><span>复制链接成功！</span></div></div></div></span>`)
                //$(".ant-message").append(al)
                //setTimeout(()=>{$(".ant-message-notice").remove()}, 3000)
            }
        )
        $(".ant-modal-footer").prepend(linkBtn)


        let linkInput = $(`<span  style="margin-top:20px" class="ant-input-wrapper ant-input-group"><span class="ant-input-group-addon">网盘直链:</span><input readonly="" type="text" class="ant-input link-input" value="http://linux.do"></span>`)
        $(".ant-input-group-wrapper").append(linkInput)


    }

    function addXMLRequestCallback(callback){
        // 是一个劫持的函数
        var oldSend, i;
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
            if ( xhr.readyState == 4 && xhr.status == 200 ) {
                if(xhr.responseURL.includes("addShare")){
                    let j = JSON.parse(xhr.response)
                    if(j.reason == 'OK'){
                        console.log(j.data.shareId)
                        createBtn()
                        getShareLink(String(j.data.shareId))
                    }
                }
            }
        });

    });
})
