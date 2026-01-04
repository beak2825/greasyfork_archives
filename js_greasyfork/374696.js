// ==UserScript==
// @name         微信防撤回
// @namespace    http://tampermonkey.net/
// @version      1.0.0.1008
// @description  将撤回的消息保留并提示"[拦截到一条撤回的消息]"
// @author       nkxyz
// @match        *://wx.qq.com/*
// @match        *://wx2.qq.com/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/374696/%E5%BE%AE%E4%BF%A1%E9%98%B2%E6%92%A4%E5%9B%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/374696/%E5%BE%AE%E4%BF%A1%E9%98%B2%E6%92%A4%E5%9B%9E.meta.js
// ==/UserScript==

function modifyResponse(response) {

    var original_response, modified_response;
    if (this.readyState === 4) {
        if (this.requestURL && this.requestURL.indexOf("mmwebwx-bin/webwxsync") > 0 && this.requestMethod === "POST") {
            original_response = response.target.responseText;
            // try{
                modified_response = JSON.parse(original_response);
                //console.log(modified_response)
                if(modified_response.AddMsgList && modified_response.AddMsgList.length > 0){
                    for (var i = 0; i < modified_response.AddMsgCount; i++) {
                        var msgType = modified_response.AddMsgList[i].MsgType;
                        var info = modified_response.AddMsgList[i];
                        var modified = false;
                        if ( msgType === 10002){
                            modified_response.AddMsgList[i].MsgType = 1;
                            var cdataBegin = modified_response.AddMsgList[i].Content.indexOf("![CDATA[");
                            var cdataEnd = -1;
                            if (cdataBegin != -1) {
                                cdataEnd = modified_response.AddMsgList[i].Content.indexOf("]", cdataBegin);
                            }
                            if (cdataEnd != -1) {
                                modified_response.AddMsgList[i].Content = "<p><span>"+ modified_response.AddMsgList[i].Content.substr(cdataBegin+7, cdataEnd + 1 - cdataBegin - 7) +"</span></p>";
                            } else {
                                modified_response.AddMsgList[i].Content = "<p><span>[拦截到一条撤回的消息]</span></p>";
                            }
                            modified = true;
                        }
                    }
                    if (modified) {
                        Object.defineProperty(this, "response", {writable: true});
                        modified_response = JSON.stringify(modified_response);
                        this.response = modified_response;
                    }
                }
            // }catch(e){
            //     this.responseText = original_response
            // }
        }

    }
}

function openBypass(original_function) {

    return function(method, url, async) {
        // 保存请求相关参数
        this.requestMethod = method;
        this.requestURL = url;

        this.addEventListener("readystatechange", modifyResponse);
        return original_function.apply(this, arguments);
    };

}

function sendBypass(original_function) {
    return function(data) {
        // 保存请求相关参数
        this.requestData = data;
        return original_function.apply(this, arguments);
    };
}

XMLHttpRequest.prototype.open = openBypass(XMLHttpRequest.prototype.open);
//XMLHttpRequest.prototype.send = sendBypass(XMLHttpRequest.prototype.send);

