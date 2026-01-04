// ==UserScript==
// @name         TraceChatGPT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  定时获取chatGPT的输出结果，如果更新就打印到控制台，防止撤回后什么都得不到。
// @author       You
// @match        https://chat.openai.com/chat
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456572/TraceChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/456572/TraceChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function $(name){
        return document.querySelector(name);
    }
    var last = "";
    function log_reply(){
        try{
            let new_data = $("div[class*='request-:']").innerHTML
            if(new_data != last){
                console.log(new_data.replace(/<\/?.+?>/gi,''));
                last = new_data;
            }
        }catch(e){
            //console.log(e.toString());
        }
    }

    setInterval(log_reply, 3000);
})();