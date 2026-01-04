// ==UserScript==
// @name         NGA帖子内容过宽调整
// @namespace    https://live.bilibili.com/7115892
// @version      0.1
// @author       Windy
// @match        https://bbs.nga.cn/read.php?tid=*
// @grant        none
// @description:zh-cn "NGA帖子内容过宽调整"
// @description "NGA帖子内容过宽调整"
// @downloadURL https://update.greasyfork.org/scripts/395102/NGA%E5%B8%96%E5%AD%90%E5%86%85%E5%AE%B9%E8%BF%87%E5%AE%BD%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/395102/NGA%E5%B8%96%E5%AD%90%E5%86%85%E5%AE%B9%E8%BF%87%E5%AE%BD%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==
var Windysheet=document.createElement('style');
Windysheet.type="text/css";
Windysheet.innerHTML=".forumbox .postrow .postcontent {display: block!important;}";
document.body.appendChild(Windysheet);
var Windyheight=document.createElement('style');
window.scrollTo({
    top: 32400,
    behavior: "smooth"
        });
    setTimeout(
   function (){
window.scrollTo({
    top: 0,
    behavior: "smooth"
        });
   }
, 500);