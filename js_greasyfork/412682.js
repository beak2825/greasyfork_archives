// ==UserScript==
// @name         屏蔽知乎视频
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  屏蔽网页版知乎时间线上的视频。Remove video in Zhihu timeline.
// @author       Max
// @match        https://www.zhihu.com/
// @grant        Max
// @downloadURL https://update.greasyfork.org/scripts/412682/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/412682/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

function removeVideo(){
    var p = document.getElementsByClassName("ContentItem ZVideoItem");
    Array.prototype.slice.call(p).forEach(function(item){
        item.remove();
    })
}
removeVideo();
var timeline = document.getElementById("TopstoryContent");
var config = { attributes: true, childList: true, subtree: true };
var callback = function(mutationsList) {
    mutationsList.forEach(function(item,index){
        if (item.type == 'childList') {
            if(item.target.innerHTML.indexOf("zvideo")!=-1){
                removeVideo();
            }
        }
    });
}
var observer = new MutationObserver(callback);
observer.observe(timeline, config);