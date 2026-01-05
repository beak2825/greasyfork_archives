// ==UserScript==
// @name        52pojie.code
// @namespace   http://tampermonkey.net/
// @description 吾爱破解回复时自动添加代码，辅助回复
// @author      siwuxie095
// @match       http://www.52pojie.cn/forum*
// @match       http://www.52pojie.cn/thread*
// @version     7.0
// @grant       none
//@icon         http://down.52pojie.cn/Logo/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3.ico  
// @downloadURL https://update.greasyfork.org/scripts/27931/52pojiecode.user.js
// @updateURL https://update.greasyfork.org/scripts/27931/52pojiecode.meta.js
// ==/UserScript==
// 

//unsafeWindow
//     *forum.php?mod=viewthread&tid=*
//     *viewthread.php?tid=*
//     *thread*.html



var str="[size=5][font=隶书][color=teal]  [/color][/font][/size]";
var strs="[color=teal][b]  [/b][/color]";

$("fastpostmessage").onfocus = function (){
  $("fastpostmessage").style.background = 'none';
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



var side_re = document.getElementsByClassName("replyfast")[0];

//mouseenter
side_re.addEventListener("click", function( event ) {
  document.getElementsByClassName("replyfast")[0].click();
  setTimeout(function(){$("postmessage").value = str;}, 500);
}, false);


var middle_re = document.getElementsByClassName("fastre");
for (var i = 0; i < middle_re.length; i++) {
  middle_re[i].addEventListener("click", function(){setTimeout(function(){$("postmessage").value = str;}, 500);});
}


var cmt_re = document.getElementsByClassName("cmmnt");
for (var i = 0; i < cmt_re.length; i++) {
  cmt_re[i].addEventListener("click", function(){setTimeout(function(){$("commentmessage").value = strs;}, 500);});
}