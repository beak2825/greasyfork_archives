
// ==UserScript== 
// @name      eh 
// @namespace  http://exhentai.org/ 
// @version    0.1 
// @description  akiba thumb 
// @match      https://exhentai.org/* 
// @grant      none 
// @copyright  2012+, You 
// @downloadURL https://update.greasyfork.org/scripts/22060/eh.user.js
// @updateURL https://update.greasyfork.org/scripts/22060/eh.meta.js
// ==/UserScript==   

$(function() { 
    var getThumb = $(".discussionListItems .posterAvatar");    
    getThumb.css("width",235); 
    getThumb.find(".Thumbnail").css("width","auto"); 
    getThumb.find("span").css({ width:"auto", height:"auto" }); 
    getThumb.find("img").css({ width:220, height:"auto", display:"block" }); 
}); 
 

