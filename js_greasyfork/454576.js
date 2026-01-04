// ==UserScript==
// @name         WechatHook
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hook wechat web XHR message
// @author       Leo
// @match        https://003.siyuguanli.com/admin/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=siyuguanli.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454576/WechatHook.user.js
// @updateURL https://update.greasyfork.org/scripts/454576/WechatHook.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function copyToClipboard(text) {
        //console.log(text);
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        }else {
            var dummy = document.createElement("textarea");
            // to avoid breaking orgain page when copying more words
            // cant copy when adding below this code
            // dummy.style.display = 'none'
            document.body.appendChild(dummy);
            //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
            dummy.value = text;
            dummy.select();
            document.execCommand("copy", true);
            //document.body.removeChild(dummy);
        }
    }

    (function() {
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        // console.log('request started!');
        this._url = url;
        this.addEventListener('load', function() {
            //console.log('request completed!');
            //console.log(this.readyState); //will always be 4 (ajax is completed successfully)
            if(this._url.includes("WechatChatroom/pagelist?")){
                console.log("get xhr result");
                copyToClipboard(this.responseText); //whatever the response was
            }
        });
        origOpen.apply(this, arguments);
    };
    })();


})();