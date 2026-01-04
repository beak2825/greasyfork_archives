// ==UserScript==
// @name        看雪论坛自动签到
// @namespace   Violentmonkey Scripts
// @match       http*://bbs.pediy.com/
// @version     1.0
// @grant				GM_notification
// @icon        https://bbs.pediy.com/view/img/favicon.ico
// @require			https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.0/jquery.min.js
// @run-at 			document-end
// @author      -
// @description 看雪论坛的签到+一言
// @downloadURL https://update.greasyfork.org/scripts/394979/%E7%9C%8B%E9%9B%AA%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/394979/%E7%9C%8B%E9%9B%AA%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
(function(){
  var Yiyan=" "//初始化一言
  if($("a[class='login_btn']").text()=='登录'){
    console.log("未登录");                                                                                                                                                                                                
  GM_notification({text:"点击这里去登录",title:"你还未登录哦",image:"https://bbs.pediy.com/view/img/favicon.ico",onclick:function(){
      $(location).prop('href', 'https://passport.kanxue.com/user-login.htm');
  }});
  }
  else{
    var userP=$("img[class='avatar-2']")[0].src,
        userN=$("*[class='col'] span").text();
    $.get("https://api.guoch.xyz/",function(Txt){
    qd(Txt);
    //alert(typeof(Yiyan)+Yiyan);
  })
      }
  function qd(Yiyan){
    if ($("*[class='col-md-2 text-center col-xs-12 signin py-0 mb-3 px-1'] span").text()=="  签到奖励") {
      $("*[class='col-md-2 text-center col-xs-12 signin py-0 mb-3 px-1']").click();
      GM_notification({text:Yiyan,title:"签到成功",image:userP,timeout:20000});
      console.log("执行签到");
    }
  else{
    console.log("今日已签到");
    GM_notification({text:Yiyan,title:userN+"，快去浏览帖子吧",image:userP,timeout:200});
  }
    
  } 
})();