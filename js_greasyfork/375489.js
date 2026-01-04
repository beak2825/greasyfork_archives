// ==UserScript==
// @name         kuaidi100.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Jacko
// @match        https://b.kuaidi100.com/history.shtml
// @require      https://cdn.bootcss.com/clipboard.js/2.0.4/clipboard.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375489/kuaidi100com.user.js
// @updateURL https://update.greasyfork.org/scripts/375489/kuaidi100com.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $("#detailAction").append("<a class=\"a-action\" id=\"copySomeBtn\">复制单号</a>");
    var clip = new ClipboardJS('#copySomeBtn', {
        text: function(trigger) {
            var text = $("#detailTable tr.selected").map(function(i,e){
                return $(e).find("td:nth-child(3)>span:nth-child(1)>span:nth-child(1)").text()+' '+$(e).find("td:nth-child(4)>span:nth-child(2)>a").text();
            }).toArray().join('\r');
            return text;
        }
    });
    clip.on('success',function(e){
        e.clearSelection();
        console.info('Action:',e.action);
        console.info('Text:',e.text);
        console.info('Trigger:',e.trigger);
    });
    clip.on('error',function(e){
        console.error('Action:',e.action);
        console.error('Trigger:',e.trigger);
    });
})();