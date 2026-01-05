// ==UserScript==
// @name        oneplusbbs.code
// @namespace   http://tampermonkey.net/
// @description 一加手机论坛回复时自动添加代码，辅助回复
// @author      siwuxie095
// @match       http://www.oneplusbbs.com/forum*
// @match       http://www.oneplusbbs.com/thread*
// @match       http://www.oneplusbbs.com/*
// @version     5.0
// @icon        http://www.oneplusbbs.com/static/image/common/portal.ico
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27915/oneplusbbscode.user.js
// @updateURL https://update.greasyfork.org/scripts/27915/oneplusbbscode.meta.js
// ==/UserScript==

//unsafeWindow
//    *forum.php?mod=viewthread&tid=*
//   *viewthread.php?tid=*
//    *thread*.html


var str="[size=5][font=隶书][color=teal]  [/color][/font][/size]";

$("fastpostmessage").onfocus = function (){
  //$("fastpostmessage").style.background = 'none';
  if($("fastpostmessage").value === ''){      
  $("fastpostmessage").value=str;
  }    
};  



var up_re = document.getElementById("post_reply");
//mouseenter
up_re.addEventListener("click", function(event){
  setTimeout(function () {$("postmessage").value = str;}, 500);
});




var down_re = document.getElementById("post_replytmp");
//mouseenter
down_re.addEventListener("click", function(event){
  setTimeout(function () {$("postmessage").value = str;}, 500);
});


//不加event也可以
// down_re.addEventListener("click", function(){
//   setTimeout(function () {$("postmessage").value = "你好";}, 500);
// });



var side_re = document.getElementsByClassName("dfsj_replyfast")[0];

//mouseenter
side_re.addEventListener("click", function( event ) {
  document.getElementsByClassName("dfsj_replyfast")[0].click();
  setTimeout(function(){$("postmessage").value = str;}, 500);
}, false);


var middle_re = document.getElementsByClassName("fastre");
for (var i = 0; i < middle_re.length; i++) {
  middle_re[i].addEventListener("click", function(){setTimeout(function(){$("postmessage").value = str;}, 500);});
}


