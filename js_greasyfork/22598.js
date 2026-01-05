// ==UserScript==
// @name         贴吧屏蔽帖子列表页第五位热门推送
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽百度贴吧帖子列表页除置顶外第五个帖子，一般是热门推送
// @author       iamGates
// @include      /http://tieba\.baidu\.com/.*/
// @exclude      /http://tieba\.baidu\.com/./.*/
// @exclude      http://tieba.baidu.com/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/22598/%E8%B4%B4%E5%90%A7%E5%B1%8F%E8%94%BD%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8%E9%A1%B5%E7%AC%AC%E4%BA%94%E4%BD%8D%E7%83%AD%E9%97%A8%E6%8E%A8%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/22598/%E8%B4%B4%E5%90%A7%E5%B1%8F%E8%94%BD%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8%E9%A1%B5%E7%AC%AC%E4%BA%94%E4%BD%8D%E7%83%AD%E9%97%A8%E6%8E%A8%E9%80%81.meta.js
// ==/UserScript==

var c = 0;
function r(){
    if(c === 0){
    var obj = document.getElementsByClassName("j_thread_list clearfix").item(document.getElementsByClassName("j_thread_list thread_top clearfix").length + 4);
    obj.parentNode.removeChild(obj);
    c = 1;
    }
    else{
     document.removeEventListener("mousemove",r);
    }
}

document.addEventListener("mousemove", r);



