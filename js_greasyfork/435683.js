// ==UserScript==
// @name         知乎去视频
// @namespace    知乎去视频
// @version      0.2
// @description  删除烦人的知乎视频
// @author       张明亮
// @match        https://www.zhihu.com/
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435683/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/435683/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {

    'use strict';
    setInterval(removeVoid,1000);//一秒执行一次

    function removeVoid(){

        let chArr = document.body.getElementsByClassName("ContentItem ZVideoItem");
        for(var i=0;i<chArr.length;i++){
            //删除元素 元素.parentNode.removeChild(元素);
            if (chArr[i] != null) {
                chArr[i].parentNode.parentNode.remove();
            }

        }

        let VideoAnswerPlayerArr = document.body.getElementsByClassName("VideoAnswerPlayer");
        for(var j=0;j<VideoAnswerPlayerArr.length;j++){
            //删除元素 元素.parentNode.removeChild(元素);
            if (VideoAnswerPlayerArr[j] != null) {
                VideoAnswerPlayerArr[j].parentNode.parentNode.parentNode.remove();
            }
        }
    }

    // Your code here...
})();