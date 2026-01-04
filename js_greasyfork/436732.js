// ==UserScript==
// @name         no image
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hide image video at zhihu
// @license MIT
// @compatible   chrome Latest
// @author       You
// @run-at       document-start
// @include      *://www.zhihu.com*
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/436732/no%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/436732/no%20image.meta.js
// ==/UserScript==

setInterval(function(){
    //console.log(1);

    $('img').each(function(i,o){o.remove();})
    $('video').each(function(i,o){o.remove();})

    $('.ZVideoItem').each(function(index, obj){
        // obj.style.visibility = "hidden";
        obj.remove();
    });

    $('.VideoAnswerPlayer').each(function(index, obj){
        // obj.style.visibility = "hidden";
        obj.remove();
    });

    $('.QuestionHeader-title').each(function(index, obj){
        obj.remove();
    });

    $('.GifPlayer').each(function(index, obj){
        obj.remove();
    });

    $('.AppHeader').css("background-color", "white");

    //$('.RichText-ZVideoLinkCardContainer').each(function(index, obj){
      //  obj.remove();
    //});


}, 1000);
