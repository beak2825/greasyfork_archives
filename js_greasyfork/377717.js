// ==UserScript==
// @name         wxnaiveemojinaivedownloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  nope
// @author       (anonymous)
// @match        https://wx2.qq.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377717/wxnaiveemojinaivedownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/377717/wxnaiveemojinaivedownloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var attach_click_container_for_emoji_if_there_is_none=function(){
        var all_emoji=document.getElementsByClassName('custom_emoji msg-img');
        var newly_attached=0;
        // go fuck your self you fucking jslint. where the hell on the earth does not support 'let'?
        for(let i=0;i<all_emoji.length;++i){
            let emoji=all_emoji[i];
            if(emoji.parentNode.name!="naivecontainer"){
                let parent=emoji.parentNode;
                let container=document.createElement('a');
                container.href=emoji.src;
                container.target='_blank';
	            container.download="MicroMsgEmoji"+emoji.src.match("MsgID=(.+?)&")[1];
                container.name="naivecontainer";
                parent.appendChild(container);
                container.appendChild(emoji);
                newly_attached+=1;
            }
        }
        console.log(newly_attached+" emoji peocessed");
    };

    window.setInterval(attach_click_container_for_emoji_if_there_is_none,2000);



})();