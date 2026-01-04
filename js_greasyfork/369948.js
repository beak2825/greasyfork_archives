// ==UserScript==
// @name         GiveAway精灵
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  GiveAway精灵，2步领Key
// @author       Chuck
// @include      *giveaway.su/giveaway/view/*
// @include      *store.steampowered.com/curator/*
// @include      *store.steampowered.com/app/*
// @include      *store.steampowered.com/account/registerkey*
// @include     *discordapp.com/invite*
// @include       *www.youtube.com/channel/*
// @include     *steamcommunity.com/groups/*
//  @include     *twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369948/GiveAway%E7%B2%BE%E7%81%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/369948/GiveAway%E7%B2%BE%E7%81%B5.meta.js
// ==/UserScript==

(function() {
    var autoClose = 1;//1为自动关闭，0为不自动关闭，会生效在鉴赏家，愿望单，还有discord页面
    //var autoTask = 1;// 待开发；1为开启自动任务，0为不开启，开启时，会自动点击所有任务的链接
    var url = window.location.href;
    function checkUrl(str){
       return(url.indexOf(str)!=-1)
    }
    function closeThisWeb(){
        if(autoClose)
        setTimeout(function(){
                 window.opener=null;
                 window.open('','_self');
                 window.close()
        },5000);
    }
    function c(str){
     console.log(str);
    }
    function loadCssCode(code){
        var style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        try{
            //for Chrome Firefox Opera Safari
            style .appendChild(document.createTextNode(code));
        }catch(ex){
            //for IE
            style.styleSheet.cssText = code;
        }
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }

    if(checkUrl("registerkey")){
       //steam礼包自动兑换确认
        c("steam礼包自动兑换确认");
      document.querySelector("#purchase_confirm_ssa input").checked=true;
      RegisterProductKey();
    }
    else if(checkUrl("curator")){
       //Steam鉴赏家自动关注
        c(" Steam鉴赏家自动关注");
       document.querySelector(".follow_controls>div>span~span").click();
         closeThisWeb()
    }
    else if(checkUrl("groups")){
        //Steam 自动进组
        c(" Steam 自动进组");
            try{
                  document.forms['join_group_form'].submit();
             }catch(err){ }

        closeThisWeb()
    }
    else if(checkUrl("giveaway/view")){
      //Giveaway 自动检查状态，强制按钮可用
        c(" Giveaway 自动检查状态，强制按钮可用");
      setInterval(function(){$("td>button").map(function(i,v){v.click()});  $("#getKey a").removeClass("disabled");},5000)
     //让discord的标签更明显
         loadCssCode('.mdi-discord{ border: 3px solid #00e8de; color: #00e8de;}');
     //隐藏不需要点击的打开网页任务
       setTimeout(function(){
               $(".glyphicon-share-alt").parent().parent().parent().hide();
               try{
                   $(".giveaway-key div").show()
               }catch(err){ }  
        },3000)
     //待开发，存在问题：自动做任务
       //if(autoTask){
            //$("#actions a").map(function(i,v){window.open(v.href)});
       //}
    }
     else if(checkUrl("store.steampowered.com/app")){
      //steam 自动关注与添加愿望单
             //自动绕过年龄限制
      c(" Giveaway 自动关注与添加愿望单");
             try{
             $(ageYear).value=1991;
             DoAgeGateSubmit();
             }catch(err){ }
             try{
             document.querySelector("#add_to_wishlist_area a").click();
              document.querySelector(".queue_btn_follow div").click()
             }catch(err){ }
        closeThisWeb()
    }
    else if(checkUrl("discordapp")){
        //discordapp自动接受邀请
        c(" discordapp自动接受邀请");
        setTimeout(function(){
          document.querySelector("button").click();
        },3000)
        
        closeThisWeb();
    }
   else if(checkUrl("twitter.com")){
       //twitter自动关注
        c(" twitter自动关注");
        setTimeout(function(){
          $(".follow-text")[0].click()
        },3000)

        closeThisWeb();
    }
    else if(checkUrl("www.youtube.com/channel")){
        //youtube自动关注
         c(" youtube自动关注");
        document.querySelector("#confirm-button").click()
        closeThisWeb();
    }
//    else if(checkUrl("")){
//
//    }
})();