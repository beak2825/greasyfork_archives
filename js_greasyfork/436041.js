// ==UserScript==
// @name         Dollars聊天室控制台输出
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Dollars聊天室 控制台输出聊天信息及控制台聊天
// @author       RaYa
// @match        https://drrr.com/room/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436041/Dollars%E8%81%8A%E5%A4%A9%E5%AE%A4%E6%8E%A7%E5%88%B6%E5%8F%B0%E8%BE%93%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/436041/Dollars%E8%81%8A%E5%A4%A9%E5%AE%A4%E6%8E%A7%E5%88%B6%E5%8F%B0%E8%BE%93%E5%87%BA.meta.js
// ==/UserScript==

(function() {
 'use strict';
console.clear()
const events = ['talk join system', 'talk leave system', 'talk me system select-text'];
let message=document.getElementsByName('message')[0];
let send=document.getElementsByName('post')[0];
$("#talks").bind('DOMNodeInserted', function(e) {
  //  console.log('element now contains: ' + $(e.target).html());
    if(events.includes(e.target.className)){
        console.log(e.target.innerText);
    }else{
       //常规对话输出
        try{
            var out="$ "+e.target.children[0].innerText+":"+e.target.children[1].innerText;
            console.log(out);
        }catch(err){

        }
    }
});
function echo(content){
    message.value=content;
    send.click();
}
setInterval(function () {
 echo('/me wwwww');
}, 1000*300);
setTimeout(function(){console.clear();},1000);
})();