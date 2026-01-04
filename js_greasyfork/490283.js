// ==UserScript==
// @name         斗鱼弹幕过滤
// @namespace    http://tampermonkey.net/
// @version      2024-03-24
// @description  过滤掉字数长的弹幕
// @author       A9
// @match        https://www.douyu.com/*
// @run-at       document-end
// @noframes
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490283/%E6%96%97%E9%B1%BC%E5%BC%B9%E5%B9%95%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/490283/%E6%96%97%E9%B1%BC%E5%BC%B9%E5%B9%95%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const DYWebSocket_esModule = window?.playerSDK56c64ff029f3e4d0b3e1("dcfdb");
    let originalMyObject = DYWebSocket_esModule.default;
    let RedefineMyObject = function(...args) {
        originalMyObject.apply(this, args);
    }
    RedefineMyObject.prototype = Object.create(originalMyObject.prototype);
    RedefineMyObject.prototype.onMessageHandler = function(e,t) {
        //过滤掉用户进入提醒的提示\用户升级提示\用户分享直播间提示
        if(e?.type==="uenter"||e?.type==="blab"||e?.type==="srres"){return;}
        if(e?.type==="chatmsg"){            
            //过滤掉大于18个字的弹幕
            if(e.txt.length>18)return;
        }
        var r = this;
        this.worker ? t ? (this.log("onmessage", e),
                           this.onmessage && this.onmessage.call(this, e)) : this.worker.postMessage({
            cmd: "message",
            data: e.data,
            showLog: this.showLog
        }) : this.bufferCoder.decode(e.data, function(e) {
            r.log("onmessage", e),
                r.onmessage && r.onmessage.call(r, o.default(e))
        })
    }
    DYWebSocket_esModule.default = RedefineMyObject;
})();