// ==UserScript==
// @name         Giveaway Task Auto Complete
// @namespace    http://tampermonkey.net/
// @version      4.31
// @description  Auto Complete Giveaway Tasks.
// @author       fllp
// @include      *//marvelousga.com/giveaway/*
// @include      *//simplo.gg/index.php?giveaway=*
// @include      *//giveawayhopper.com/giveaway*
// @include      *//whosgamingnow.net/giveaway/*
// @include      *//www.chubbykeys.com/*
// @include      *//giftybundle.com/*
// @include      *//tmp.ghame.ru/*
// @include      *//keychampions.net/*
// @include      *//embloo.net/task/*
// @include      *//prys.ga/giveaway/*
// @include      *//gleam.io/*
// @include      *//treasuregiveaways.com/*
// @include      *//*getkeys.net/giveaway.php?id=*
// @include      *//*.dogebundle.com/*
// @include      *//gamehag.com/*
// @include      *//steamcn.com/*
// @include      *//dupedornot.com/giveaway.php?id=*
// @include      *//giveaway.su/giveaway/view/*
// @include      *//gamearn.me/*
// @include      *//www.bananagiveaway.com/giveaway/*
// @include      *//*.spoune.com/*
// @include      *//gamecode.win/giveaway/*
// @include      *//gamezito.com/giveaway/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      twitter.com
// @connect      facebook.com
// @connect      twitch.tv
// @connect      instagram.com
// @connect      youtube.com
// @connect      steamcommunity.com
// @connect      discordapp.com
// @connect      bananatic.com
// @connect      dlh.net
// @connect      lucariomods.club
// @connect      google.com
// @connect      wowfeenix.com
// @connect      steampowered.com
// @connect      grabthegames.com
// @connect      grabfreegame.com
// @connect      gamingimpact.com
// @connect      vk.com
// @connect      oy-vey-keys.com
// @connect      clc.la
// @connect      bit.ly
// @connect      discord.gg
// @connect      dupedornot.com
// @connect      goo.gl
// @connect      t.me

// @downloadURL https://update.greasyfork.org/scripts/32128/Giveaway%20Task%20Auto%20Complete.user.js
// @updateURL https://update.greasyfork.org/scripts/32128/Giveaway%20Task%20Auto%20Complete.meta.js
// ==/UserScript==
//
var leavegroup=true;//（不想自动退组的人请把左边的true改成false然后点击左上角第二个图标保存)
//
//
//
this.$ = window.jQuery.noConflict(true);
var i=-1;
setTimeout(function(){
var timer=setInterval(function(){
    if($('span.keystring:contains("XXXX")').length>0 || $('.text-center:contains("XXXX")').length>0 && $('.text-center:contains("No more")').length<1 && $('button>span').html()!="×" && $("div>strong:contains('Error')").length==0) {
    $('button>span:contains("Join ")').each(function(){
  $(this).click();
});
    $('button>span:contains("Follow ")').each(function(){
  $(this).click();
});
if(($('button>span:contains("Leave ")').length+$('button>span:contains("Unfollow ")').length)==$('span[style*="display: none"]').length && $('button>span').html()!=null){
if(window.location.href.indexOf("simplo.gg") > -1) {
    dosimplo();
}else if(window.location.href.indexOf("marvelousga.com") > -1){
    domarvel(0);
}else if(window.location.href.indexOf("giveawayhopper.com") > -1){
    dohopper();
}else if(window.location.href.indexOf("giftybundle.com") > -1){
    dogifty();
}else if(window.location.href.indexOf("dupedornot.com") > -1){
    fkdon(0);
}else if(window.location.href.indexOf("chubbykeys.com") > -1){
    dochubby();
}
clearInterval(timer);
}
   }else if(window.location.href.indexOf("whosgamingnow.net") > -1 && $('button>span').html()!="×"){
       if($('.action').length>0){
       $('button>span:contains("Join ")').each(function(){
  $(this).click();
});
    $('button>span:contains("Follow ")').each(function(){
  $(this).click();
});
if(($('button>span:contains("Leave ")').length+$('button>span:contains("Unfollow ")').length)==$('span[style*="display: none"]').length && $('button>span').html()!=null){
       dowgn();
    clearInterval(timer);
}
       }else{
           clearInterval(timer);
           leavegroups();
       }
   }else if(window.location.href.indexOf("embloo.net") > -1 && $('button>span').html()!="×"){
       if($('.taskItem').length>0){
           $('button>span:contains("Join ")').each(function(){
  $(this).click();
});
    $('button>span:contains("Follow ")').each(function(){
  $(this).click();
});
if(($('button>span:contains("Leave ")').length+$('button>span:contains("Unfollow ")').length)==$('span[style*="display: none"]').length && $('button>span').html()!=null){
       doembloo();
    clearInterval(timer);
}
       }else{
           clearInterval(timer);
           leavegroups();
       }
   }else if(window.location.href.indexOf("ghame.ru") > -1 && $('button>span').html()!="×"){
       if($(".visible.active").length>0){
       //if($('.ui compact celled table>tbody>tr').length>0){
           $('button>span:contains("Join ")').each(function(){
  $(this).click();
});
    $('button>span:contains("Follow ")').each(function(){
  $(this).click();
});
if(($('button>span:contains("Leave ")').length+$('button>span:contains("Unfollow ")').length)==$('span[style*="display: none"]').length && $('button>span').html()!=null){
       doghame();
    clearInterval(timer);
}
       }else{
           //clearInterval(timer);
           //leavegroups();
       }
   }else if(window.location.href.indexOf("prys.ga") > -1 && $('button>span').html()!="×"){
       if($("#success-msg").html()=="" && $("a[id*='check']").length>0){
       $('button>span:contains("Join ")').each(function(){
  $(this).click();
});
    $('button>span:contains("Follow ")').each(function(){
  $(this).click();
});
if(($('button>span:contains("Leave ")').length+$('button>span:contains("Unfollow ")').length)==$('span[style*="display: none"]').length && $('button>span').html()!=null){
       doprys($("tr[id*='step']").length);
    clearInterval(timer);
}
       }else{
           clearInterval(timer);
           leavegroups();
       }
   }else if(window.location.href.indexOf("gleam.io") > -1 && $('button>span').html()!="×"){
       if($(".coupon-code.ng-binding").length<1 || $(".coupon-code.ng-binding").html().indexOf("-")<1){
           $('button>span:contains("Join ")').each(function(){
  $(this).click();
});
    $('button>span:contains("Follow ")').each(function(){
  $(this).click();
});
if(($('button>span:contains("Leave ")').length+$('button>span:contains("Unfollow ")').length)==$('span[style*="display: none"]').length && $('button>span').html()!=null){
       dogleam();
    clearInterval(timer);
}
       }else{
           clearInterval(timer);
           leavegroups();
       }
   }else if(window.location.href.indexOf("getkeys.net") > -1 && $('button>span').html()!="×"){
       if($('.keyspan').eq(0).html()==" "){
           $('button>span:contains("Join ")').each(function(){
  $(this).click();
});
    $('button>span:contains("Follow ")').each(function(){
  $(this).click();
});
if(($('button>span:contains("Leave ")').length+$('button>span:contains("Unfollow ")').length)==$('span[style*="display: none"]').length && $('button>span').html()!=null){
       dogetkeys();
    clearInterval(timer);
}
       }else{
           clearInterval(timer);
           leavegroups();
       }
   }else if(window.location.href.indexOf("dogebundle.com") > -1 && $('button>span').html()!="×"){
       if($("div.alert.alert-success:contains('Your key')").length<1){
           $('button>span:contains("Join ")').each(function(){
  $(this).click();
});
    $('button>span:contains("Follow ")').each(function(){
  $(this).click();
});
if(($('button>span:contains("Leave ")').length+$('button>span:contains("Unfollow ")').length)==$('span[style*="display: none"]').length-1 && $('button>span').html()!=null){
    if($(".giveaway-key>span:contains('code')").length==0){
       dodb();
    }
    clearInterval(timer);
}
       }else{
           clearInterval(timer);
           leavegroups();
       }
   }else if(window.location.href.indexOf("gamehag.com") > -1 ){
           $('button>span:contains("Join ")').each(function(){
  $(this).click();
});
    $('button>span:contains("Follow ")').each(function(){
  $(this).click();
});
if(($('button>span:contains("Leave ")').length+$('button>span:contains("Unfollow ")').length)==$('span[style*="display: none"]').length && $('button>span').html()!=null){
    if($(".giveaway-survey").length>0){
            //$(".giveaway-survey").each(function(){$(this).removeAttr("href").click();});
            //$("#pollfishSurveyFrame").remove();
            //$("#pollfishOverlay").remove();
            //giveawaySurvCompleted();
        eval('$(".giveaway-survey").each(function(){$(this).removeAttr("href")})');
        eval('$(".giveaway-survey").each(function(){$(this).click()})');
        eval('setTimeout(function(){$("#pollfishSurveyFrame").remove();$("#pollfishOverlay").remove()},700)');
        eval('giveawaySurvCompleted()');
      }
       dogh(0);
    clearInterval(timer);
}
   }else if(window.location.href.indexOf("treasuregiveaways.com") > -1){
    if($("p:contains('You have already')").length<1){
           $('button>span:contains("Join ")').each(function(){
  $(this).click();
});
    $('button>span:contains("Follow ")').each(function(){
  $(this).click();
});
if(($('button>span:contains("Leave ")').length+$('button>span:contains("Unfollow ")').length)==$('span[style*="display: none"]').length && $('button>span').html()!=null){
       dotreasure();
    clearInterval(timer);
}
       }else{
           clearInterval(timer);
           leavegroups();
       }
}else if(window.location.href.indexOf("steamcn.com") > -1){
    clearInterval(timer);
    if($(".t_f").eq(0).find("a[href*='dupedornot.com/giveaway']","a[href*='steamcommunity.com/groups']").length>0){
    if (confirm("检测到垃圾dupedkey站，是否自动加入steam组然后再进入领key页面？")) {
                    dodon();
                } else {
                    // Do nothing!
                }
    }
}else if(window.location.href.indexOf("dupedornot.com/giveaway.php?id=") > -1){
    clearInterval(timer);
    fkdon(1);
}else if(window.location.href.indexOf("giveaway.su/giveaway/view/") > -1){
               $('button>span:contains("Join ")').each(function(){
  $(this).click();
});
    $('button>span:contains("Follow ")').each(function(){
  $(this).click();
});
if(($('button>span:contains("Leave ")').length+$('button>span:contains("Unfollow ")').length)==$('span[style*="display: none"]').length && $('button>span').html()!=null){
    clearInterval(timer);
    dogs();
}
}else if(window.location.href.indexOf("gamearn.me") > -1){
    clearInterval(timer);
    var str=$("button:contains('Join Giveaway')").attr("onclick");
    var regex=/'(.*)'/;
    var galink=str.match(regex);
    window.location=galink[1];
}else if(window.location.href.indexOf("bananagiveaway.com") > -1){
    clearInterval(timer);
    if($(".jobs:contains('Your key')").length==0 && $(".bottom:contains('Please login')").length==0){
    dobg();
    }else{
        leavegroups();
    }
}else if(window.location.href.indexOf("spoune.com") > -1){
    clearInterval(timer);
    if($("#claimKey").length>0){
    dosp();
    }
}else if(window.location.href.indexOf("gamecode.win") > -1){
    $('button>span:contains("Join ")').each(function(){
  $(this).click();
});
    $('button>span:contains("Follow ")').each(function(){
  $(this).click();
});
if(($('button>span:contains("Leave ")').length+$('button>span:contains("Unfollow ")').length)==$('span[style*="display: none"]').length && $('button>span').html()!=null || $("button:contains('VERIFY')").length==0){
   clearInterval(timer);
    if($(".lightRed:contains('complete')").length==0){
     dogc();
    }else{
        leavegroups();
    }
}
}else if(window.location.href.indexOf("marvelousga.com") > -1){
    $('button>span:contains("Join ")').each(function(){
  $(this).click();
});
    $('button>span:contains("Follow ")').each(function(){
  $(this).click();
});
if(($('button>span:contains("Leave ")').length+$('button>span:contains("Unfollow ")').length)==$('span[style*="display: none"]').length && $('button>span').html()!=null){
   clearInterval(timer);
    if(!$(".card-body.text-center").eq(0).html().includes("YOUR KEYS")){
     domarvel(0);
    }else{
        leavegroups();
    }
}
    }else if(window.location.href.indexOf("gamezito.com") > -1){
    $('button>span:contains("Join ")').each(function(){
  $(this).click();
});
    $('button>span:contains("Follow ")').each(function(){
  $(this).click();
});
if(($('button>span:contains("Leave ")').length+$('button>span:contains("Unfollow ")').length)==$('span[style*="display: none"]').length && $('button>span').html()!=null){
   clearInterval(timer);
    if($("#insertkey").eq(0).html()==""){
     dogz(0);
    }else{
        leavegroups();
    }
}
}else if($('button>span').html()=="×" || $("div>strong:contains('Error')").length>0 && window.location.href.indexOf("steamcn.com") ==-1 && window.location.href.indexOf("gamearn.me") > -1){
       alert("前提脚本出现错误，请检查问题然后刷新页面重试。");
       clearInterval(timer);
   }else{
        clearInterval(timer);
        leavegroups();
    }
},3000);
},1000);



function dosimplo(){
i++;
var sb=$('.takeaction');
if(i<sb.length){
setTimeout(function () {
var sources=$(sb[i]).attr('data-source');
var tg=$(sb[i]).attr('data-giveaway');
var dt=$(sb[i]).attr('data-task');
$.post('take_action.php',{
task_id:dt,
task_giveaway:tg,
account_secret:account_secret,
steamid:steamid,
task_source:sources
}, function(response){
var json_response = jQuery.parseJSON(response);
console.log(json_response);
if(json_response.message.indexOf("wait a few seconds")>-1){
  i--;
  dosimplo();
  return;
}else if(json_response.message.indexOf("first")>-1){
  alert("此脚本出现了点问题，即将打开出现错误的任务页面，请手动完成！然后刷新页面再试。");
   window.open(sources,"_blank");
  return;
}else{
dosimplo();
}
});
},100);
}else{
alert("可以领取key了，不要刷新页面。");
leavegroups();
}

}

function domarvel(i){
    if(i<$("button:contains('VERIFY')").length){
    /*if($("a[href*='curator']").length>0){
        var sgs=[];
          $("a[href*='curator']").each(function(){
              var regex=/\d+/;
              var sgsl=$(this).attr("href").match(regex);
              sgs.push(sgsl);
          });
        console.log(sgs);
        joinsteamgroup(sgs);
    }
    var gamehag=$('input.form-control');
    if(gamehag.length>0){
        alert("此页面是个坑，关了吧。");
        leavegroups();
        return;
    }else{
        alert("可以领取key了，不用刷新页面。");
    }
    */
    eval('$("a[id*=\'task\']").each(function(){$(this).removeAttr("href").click();})');
    setTimeout(function(){
        if(i<$("button[id*='task']").length){
        $("button[id*='task']").eq(i).click();
        i++;
        domarvel(i);
        }
            },1200);
    }
   var lg=setInterval(function(){
                if($("#key_display_container").html()!=""){
                    //clearInterval(lg);
                    //console.log("lg");
                    leavegroups();
                    clearinterval(lg);
                }
            },1000);
}
function dogz(i){
    if(i<$("button:contains('VERIFY')").length){
    /*if($("a[href*='curator']").length>0){
        var sgs=[];
          $("a[href*='curator']").each(function(){
              var regex=/\d+/;
              var sgsl=$(this).attr("href").match(regex);
              sgs.push(sgsl);
          });
        console.log(sgs);
        joinsteamgroup(sgs);
    }
    var gamehag=$('input.form-control');
    if(gamehag.length>0){
        alert("此页面是个坑，关了吧。");
        leavegroups();
        return;
    }else{
        alert("可以领取key了，不用刷新页面。");
    }
    */
    eval('$("a[id*=\'task\']").each(function(){$(this).removeAttr("href").click();})');
    setTimeout(function(){
        if(i<$("button[id*='task']").length){
        $("button[id*='task']").eq(i).click();
        i++;
        dogz(i);
        }
            },1200);
    }
   var lg=setInterval(function(){
       if($("#insertkey").html()!=""){
                    //clearInterval(lg);
                    //console.log("lg");
                    leavegroups();
                    clearinterval(lg);
                }
            },1000);
}
function dohopper(){
        alert("可以领取key了，不用刷新页面。");
}
function leavegroups(){
    if(leavegroup){
    $('button>span:contains("Leave")').each(function(){
    $(this).click();
});
    $('button>span:contains("Unfollow")').each(function(){
    $(this).click();
});
    $('button>span:contains("Delete")').each(function(){
    $(this).click();
});
    var timer=setInterval(function(){
    if(($('button>span:contains("Join")').length+$('button>span:contains("Follow")').length+$('button>span:contains("Delete")').length)==$('span[style*="display: none"]').length && $('button>span').html()!=null){
        clearInterval(timer);
        return;
    }else{
        leavegroups();
    }
        },600);
    if($("a[href*='curator']").length>0){
        var sgs=[];
          $("a[href*='curator']").each(function(){
              var regex=/\d+/;
              var sgsl=$(this).attr("href").match(regex);
              sgs.push(sgsl);
          });
        leavesteamgroup(sgs);
    }
    if($(".lightRed:contains('complete')").length>0){

      }
    }
}
function doembloo(){
    var timer=setInterval(function(){
    if ($("#pendingGroupParent").length) {
            var p = $("#pendingGroupParent");
        }
var el = $(".taskItem");
for(var s=0;s<el.length;s++){
        $.ajax({
            url: '../php/functions.php',
            type: 'POST',
            data: {
                action: 'startTask',
                taskID: $(el[s]).attr("taskID"),
                taskURL: $(el[s]).attr("taskURL"),
                taskGroupID: $(el[s]).attr("taskGroupID")
            }
        }).done(function(e) {
        if ($("#pendingGroupParent").length) {
                p.fadeOut('fast', function() {
                    $(el[s]).remove();
                });
            }
            $(el[s]).remove();
            if(e.indexOf("completeParent")>-1){
                alert("任务已全部完成，去查看你的key吧。");
                leavegroups();
                clearInterval(timer);
                location.reload();
                return;
            }
        });
}
},5000);
}
function dowgn(){
    $(".action").children("i").addClass("fa-check-square-o");
	$(".action").children("i").removeClass("fa-share-square");
    var timer=setInterval(function(){
    if($('.fa-share-square').length==0){
        alert("可以领取key了，不用刷新页面。");
        clearInterval(timer);
        return;
    }else{
        $(".action").children("i").addClass("fa-check-square-o");
	    $(".action").children("i").removeClass("fa-share-square");
    }
        },2000);
}
function doghame(){
    $("button[onclick*='document.cookie']").each(function(){
        //$(this).click();
        var cmd=$(this).attr("onclick").split("\";");
        console.log(cmd[0]);
        var sb=eval(cmd[0]+"\"");
      $(this).parent().parent().children().children("button[onclick*='check_task(']").click();
    });
    var timer=setInterval(function(){
    $("button[onclick*='check_task(']").click();
        if($(".modal_get_key.visible.active").length>0){
            leavegroups();
            clearInterval(timer);
        }
        },3000);
}
function dogifty(){
    //var windows=[];
    //var twitch=$('a[href*="twitch.tv"]');
    var gamehag=$('input.form-control');
    if(gamehag.length>0){
        alert("此页面是个坑，关了吧。");
        leavegroups();
        return;
    }else{
        alert("可以领取key了，不用刷新页面。");
    }
}
function doprys(i){
    for(var a=0;a<i;a++){
       checkStep(a);
    }
    var timer=setInterval(function(){
    if($("#captcha").html()==null){
    for(var s=0;s<$("a[id*='check']").length;s++){
       $("a[id*='check']")[s].click();
    }
    }else{
            alert("可以领取key了，不用刷新页面。");
            leavegroups();
            clearInterval(timer);
    }
        },3000);
}
function dogleam(){
    console.log("entered gleam");
      //var waitcode=setInterval(function(){
          //$(".btn.btn-large.btn-info.btn-embossed").removeAttr("href").removeAttr("ng-href").each(function(){
        //$(".enter-link.default").eachclick();
        //$(this).click();
        //$("span:contains('Continue')").click();
              //});
        //if($(".coupon-code.ng-binding").length<1 || $(".enter-link.default").length>1){
        //$("span:contains('Continue')").click();
        //}else{
            //clearInterval(waitcode);
        //}
            //},5000)
    if($(".share-border").length>0){
        $(".share-border").parent().removeClass();
    }else if($("span.ng-binding:contains('Bonus for')").length>0){
        $("span.ng-binding:contains('Bonus for')").parent().parent().remove();
    }
    var waitkey=setInterval(function(){
   if($(".coupon-code.ng-binding").length<1 || $(".coupon-code.ng-binding").html().indexOf("-")<1){
       if($(".enter-link:not('.done')").length==$("span.ng-binding:contains('Bonus for')").length+$(".share-border").length){
           console.log("done");
           leavegroups();
           clearInterval(waitkey);
           return;
       }
    for(var s=0;s<$(".btn.btn-large.btn-info.btn-embossed").length;s++){
        $(".btn.btn-large.btn-info.btn-embossed").eq(s).removeAttr("href").removeAttr("ng-href").removeAttr("target");
        $(".btn.btn-large.btn-info.btn-embossed")[s].click();
    }
        $(".btn:contains('Continue')").click();
    for(var i=0;i<$(".enter-link.default:not('.done')").length;i++){
        //$(".entry-method").eq(i).click();
        //$("div[style='display: inline-block; position: relative; z-index: 1']").click();
        $(".enter-link:not('.done')")[i].click();
    }
    }else{
        leavegroups();
        clearInterval(waitkey);
    }
    },4000);
}
function dochubby(){
     var gamehag=$('input.form-control');
    if(gamehag.length>0){
        alert("此页面是个坑，关了吧。");
        leavegroups();
        return;
    }else{
        alert("可以领取key了，不用刷新页面。");
    }
}
function dotreasure(){
    console.log("entered treasure");
    //$("a").attr("href","");
    //$("input[onclick*='incr']").click();
    //$("input[type='submit']").click();
    document.getElementById("final").disabled = false;
    document.getElementById("final").style.visibility = "visible";
    $("p>b").html("<p style='color:orange'>直接点击Claim按钮，无视任务</p>");
}
function dogetkeys(){
    console.log("entered getkeys");
    var sb=setInterval(function(){
         if($('.keyspan').eq(0).html()==" "){
             $(".responsive-tablebody-item[style*='pointer-events: none;']").children('.giveawayshow').remove();
        }else{
             clearInterval(sb);
            leavegroups();
         }
        },2000);
    $(".giveawayshowthree").each(function(){
        var sb2=$(this);
    GM_xmlhttpRequest({
        method:'GET',
        url:$(this).attr("href"),
        onload: function(response) {
            sb2.parent().children("button").click();
        }
        });
        //$(this).parent().remove();
    });
    //},10000);
}
function dodb(){
    //var regex = /\index\.php\?page\=forward\&id\=(.+?)>/g;
    var regex = /\index\.php\?page\=forward\&id\=(\d+)/g;
    GM_xmlhttpRequest({
        url:window.location.href,
        method:'GET',
        onload: function(response){
            var webs=response.responseText.match(regex);
            console.log(webs);
            for(i=0;i<webs.length;i++){
                //if(webs[i].includes("+") && webs[i].includes("'")){
                   eval('$.get("'+webs[i]+ '\",function (data) {});');
                   //}else{
                      //$.ajax({
        //url:webs[i],
        //type:'GET',
        //success: function(data){
            //
        //}
        //});
                   //}
            }
            alert("任务应该做完了，刷新看看");
        }
        });
    //var regex2 = /gbAutoComplete\((.+?)\)/g;
    //$("button[onclick*='gbAutoComplete(']").each(function(){
        //var url=$(this).parent().attr("href");
        //console.log(url);
        //var functionstr=$(this).attr("onclick");
        //var num=functionstr.match(regex2);
        //eval(num[0]);
        //console.log(num[0]);
    //});
    //$("button[id*='steamgroup']").click();
    //$("button[id*='steamgroup']").each(function(){
    //var checkgroup=$(this).attr("id").match(/\d+/);
    //eval("gbAutoComplete("+checkgroup[0]+")");
    //});
    //$("button[id*='watchtrigger']").each(function(){
    //var checkyoutube=$(this).attr("id").match(/\d+/);
    //eval("gbAutoComplete("+checkyoutube[0]+")");
    //});
    //$("#follow-button").click();
    //$("button[id*='twcheck']").each(function(){
    //var checktwitter=$(this).attr("id").match(/\d+/);
    //eval("gbAutoComplete("+checktwitter[0]+")");
    //});
}
function dogh(i){
    //var arrive=setInterval(function(){
           var interval1=setInterval(function(){
       if(parseInt($("#visible-input").attr("size"))>0){
           leavegroups();
           clearInterval(interval1);
       }
       },3000);
       if($("a[href*='/giveaway/click/']").length>0 && window.location.href.match(/\d+/)>-1){
    console.log("entered gamehag");
    //var check=setInterval(function(){
    if($("#getkey").length!=0){
        var sb2=browseURL("https://gamehag.com/games/war-thunder/play");
        var db= $("a[href*='/giveaway/click/']");
    /*db.each(function(){
       var sb= $(this);
        var fk=browseURL(sb.attr("href"));
       sb.parent().children("button").click();
        db= $("a[href*='/giveaway/click/']");
        //GM_xmlhttpRequest({
        //url:sb.attr("href"),
       // method:'GET',
        //onload: function(response){
            //sb.parent().children("button").click();
        //}
        //});
        //setTimeout(function(){
        //$(this).parent().children("button").click();
        //},3000);
    });
    */if(i<db.length){
        setTimeout(function(){
        browseURL(db.eq(i).attr("href"));
            console.log("browsed");
        setTimeout(function(){
        db.eq(i).parent().children("button").click();
            console.log("clicked");
            i++;
            dogh(i);
        },1000);
        },300);
    }
        var f=setInterval(function(){
    if(sb2==1){
    $(".box-collapse-verify").click();
        clearInterval(f);
    }
},3000);
    }
    //},8000);
        }
    //},5000);
}
function dodon(){
     //$(".t_f").eq(0).find("a[href*='dupedornot.com/giveaway.php?id=']","a[href*='steamcommunity.com/groups']")
    var ljdon=$(".t_f").eq(0).find("a[href*='dupedornot.com/giveaway']");
    //var sg=$(".t_f").eq(0).find("a[href*='steamcommunity.com/groups']");
    var sg=$("a[href*='steamcommunity.com/groups']");
        GM_xmlhttpRequest({
        url:$(sg).eq(0).attr("href"),
        method:'GET',
        headers: {
              "Content-Type": "application/x-www-form-urlencoded"
         },
        onload: function(response){
           //console.log(response.responseText);
            var sb= response.responseText.match(/name="sessionid" value="(.+?)"/);
            //console.log(sb[1]);
            for(var i=0;i<sg.length;i++){
                                    //data: {
                       //action: "join",
                       //sessionID: sb[1]
                    //},
                GM_xmlhttpRequest({
                    url:$(sg).eq(i).attr("href"),
                    method:'POST',
                    data:'action=join&sessionID='+sb[1],
                    headers: {
                         "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function(response){
                        //console.log(response.status);
                    }
                });
            }
            window.open(ljdon[0],"_blank");
        }
    });
}
function fkdon(a){
    console.log("entered fkdon");
    if(a==0){
    //alert("如果此页面是脚本为你打开的，那么你可以直接完成验证码领取key了（领取失败则说明原帖的steam组并没有放完整）.");
      $("h5.text-center").eq(0).html("<strong style='color:red'>如果此页面是脚本为你打开的，那么你可以直接完成验证码领取key了（领取失败则说明原帖的steam组并没有放完整）.</strong>");
    }else{
    var nodup=$("a[href*='worked.php?id=']");
    $.get( $(nodup).eq(1).attr("href"), function( data ) {});
    }
}
function dogs(){
    var sg=$("a[href*='steamcommunity.com/groups']");
    var lgprep=[];
    var sb,name;
    //if($("button[data-type='steam.group']").length>0){
    //$("tbody>tr>td>a:contains('Steam group')").each(function(){
    //var regex= $(this).html().match(/"(.+)"/);
        //var case1=regex[1].replace(/[^a-zA-Z\d\s:]/g, '-');
        //var case2=case1.replace(/\s/g, '_');
        /*GM_xmlhttpRequest({
        url:$(sg).eq(0).attr("href"),
        method:'GET',
        headers: {
              "Content-Type": "application/x-www-form-urlencoded"
         },
        onload: function(response){
            sb= response.responseText.match(/name="sessionid" value="(.+?)"/);
            name=response.responseText.match(/steamcommunity\.com\/id\/(.+?)\/home_process/);
            $("button[data-type='steam.group']").each(function() {
                lgprep.push($(this).data("check"));
                GM_xmlhttpRequest({
                    url:"https://steamcommunity.com/gid/"+$(this).data("check"),
                    method:'POST',
                    data:'action=join&sessionID='+sb[1],
                    headers: {
                         "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function(response){
                        //if(response.responseText.indexOf("Error")>-1){
                            //GM_xmlhttpRequest({
                    //url:"https://steamcommunity.com/groups/"+case2,
                    //method:'POST',
                    //data:'action=join&sessionID='+sb[1],
                    //headers: {
                         //"Content-Type": "application/x-www-form-urlencoded"
                    //},
                    //onload: function(response){
                    //}
                //});
                        //}
                        $(this).click();
                        $(".actions-call").html("<p style='color:red'><strong>应该可以领取了，除非需要discord</strong></p>");
                        console.log(lgprep);
                }
                });
        });
        }
        });
        }
        */
    if($("p:contains('install')").length>0){
        if (confirm("检测到你没有安装giveaway.su免扩展脚本，是否前往该脚本发布页面？")) {
                    location.href="https://steamcn.com/t402150-1-1";
                } else {
                    // Do nothing!
                }
    }else{
    $("#getKey").children().eq(0).removeClass("disabled");
    $(".actions-call").html("<h1><p style='color:red'><strong>直接领取，除非需要discord的话就先绑定，不需要弄绿</strong></p></h1>");
    /*if($("a:contains('curator')").length>0){
          $("a:contains('curator')").each(function(){
              var sgs=$(this).attr("href");
              GM_xmlhttpRequest({
                    url:sgs,
                    method:'GET',
                    headers: {
                         "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function(response){
                        console.log(response.finalUrl.substring(response.finalUrl.indexOf("curator/")+8,response.finalUrl.lastIndexOf("/")));
                        var sb= response.responseText.match(/g_sessionID = "(.+?)";/);
                        console.log(sb[1]);
                                      GM_xmlhttpRequest({
                    url:'https://store.steampowered.com/curators/ajaxfollow',
                    method:'POST',
                    data:'clanid='+response.finalUrl.substring(response.finalUrl.indexOf("curator/")+8,response.finalUrl.lastIndexOf("/"))+'&sessionid='+sb[1]+'&follow=1',
                    headers: {
                         "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function(response){
                        //if(response.responseText.indexOf("Error")>-1){
                            //GM_xmlhttpRequest({
                    //url:"https://steamcommunity.com/groups/"+case2,
                    //method:'POST',
                    //data:'action=join&sessionID='+sb[1],
                    //headers: {
                         //"Content-Type": "application/x-www-form-urlencoded"
                    //},
                    //onload: function(response){
                    //}
                //});
                        //}
                        //console.log(response.responseText);

                }
                });
                }
                });
          })
    }
    */
    var lg=setInterval(function(){
                if($(".giveaway-key").length>0){
                    //clearInterval(lg);
                    //console.log("lg");

                    leavegroups();
                }
            },500);
    }
}
function dobg(){
       $("button").removeAttr("disabled");
       $("button:contains('To do')").each(function(){
           var sb1=$(this);
           var str=sb1.attr("onclick");
                      if(str){
           var bregex=/'(.+?)'/;
           var blink=str.match(bregex);
           GM_xmlhttpRequest({
        url:blink[1],
        method:'GET',
        headers: {
              "Content-Type": "application/x-www-form-urlencoded"
         },
        onload: function(response){
            //if(response.finalUrl.indexOf("steamcommu")>-1){
                GM_xmlhttpRequest({
        url:response.finalUrl,
        method:'GET',
        headers: {
              "Content-Type": "application/x-www-form-urlencoded"
         },
        onload: function(response){
           //console.log(response.responseText);
            if(response.finalUrl.indexOf("steamcommu")>-1){
            var sb= response.responseText.match(/name="sessionid" value="(.+?)"/);
            //console.log(sb[1]);
                                    //data: {
                       //action: "join",
                       //sessionID: sb[1]
                    //},
                GM_xmlhttpRequest({
                    url:response.finalUrl,
                    method:'POST',
                    data:'action=join&sessionID='+sb[1],
                    headers: {
                         "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function(response){
                        //console.log(response.status);
                    }
                });
            }
        }
    });
            //}
           var str2=sb1.parent().children("button:contains('Verify')").attr("onclick");
            var bregex2=/'(.+?)'/;
           var blink2=str2.match(bregex2);
            console.log(blink2[1]);
            GM_xmlhttpRequest({
        url:blink2[1],
        method:'GET',
        headers: {
              "Content-Type": "application/x-www-form-urlencoded"
         },
        onload: function(response){
        }
    });
        }
    });
           }
       });
    if($(".jobs:contains('Your key')").length==0){
    alert("如果你的steam账户已经登录并绑定，那么刷新页面就应该自动做完大部分任务了，有网站登录验证的任务自行完成。");
    }
}
function joinsteamgroup(groups){
    console.log(groups);
    var isnum = /^\d+$/.test(groups[0]);
    var url="";
    if(isnum){
        url="https://steamcommunity.com/gid/";
    }else{
        url="https://steamcommunity.com/groups/";
    }
    GM_xmlhttpRequest({
        url:url+groups[0],
        method:'GET',
        headers: {
              "Content-Type": "application/x-www-form-urlencoded"
         },
        onload: function(response){
            var sb= response.responseText.match(/name="sessionid" value="(.+?)"/);
            for(var i=0;i<groups.length;i++){
                GM_xmlhttpRequest({
                    url:url+groups[i],
                    method:'POST',
                    data:'action=join&sessionID='+sb[1],
                    headers: {
                         "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function(response){
                        //console.log(response.status);
                    }
                });
            }
        }
    });
    return 1;
}
function leavesteamgroup(groups){
    var isnum = /^\d+$/.test(groups[0]);
    var url="";
    if(isnum){
        url="https://steamcommunity.com/gid/";
    }else{
        url="https://steamcommunity.com/groups/";
    }
    for(var i=0;i<groups.length;i++){
    GM_xmlhttpRequest({
        url:url+groups[i],
        method:'GET',
        headers: {
              "Content-Type": "application/x-www-form-urlencoded"
         },
        onload: function(response){
            var name=response.responseText.match(/steamcommunity\.com\/id\/(.+?)\/home_process/);
            var sb= response.responseText.match(/name="sessionid" value="(.+?)"/);
            var groupid=response.responseText.match(/name="groupId" value="(.+?)"/);
                GM_xmlhttpRequest({
                    url:"http://steamcommunity.com/id/"+name[1]+"/home_process",
                    method:'POST',
                    data:'action=leaveGroup&sessionID='+sb[1]+'&groupId='+groupid[1],
                    headers: {
                         "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function(response){

                    }
                });
        }
    });
    }
    return 1;
}
function browseURL(link){
     GM_xmlhttpRequest({
        url:link,
        method:'GET',
        onload: function(response){
                return 1;
        }
        });
}
function dosp(){
    console.log("start");
    setInterval(function(){
        console.log(document.getElementById("link").getAttribute("onclick"));
    eval(document.getElementById("link").getAttribute("onclick"));
    },1000);
}
function dogc(){
    /*var groups=[];
  $(".doItBtn").removeAttr("disabled");
    $("a[href*='steamcommunity.com/groups/']").each(function(){
        var gN=$(this).attr("href").substring($(this).attr("href").lastIndexOf("/")+1);
        groups.push(gN);
    });
    */
    //var sb=joinsteamgroup(groups);
var f=setInterval(function(){
    $("button[id*='Task']").each(function(){
       $(this).attr('disabled', false).text('VERIFY').click();
    });
    alert("剩下的交给你了");
        clearInterval(f);
},3000);
    var s=setInterval(function(){
    if($("#button-container[style*='display']").length==0){
        if(leavegroup){
        //leavesteamgroup(groups);
            leavegroups();
        }
        clearInterval(s);
                console.log("fk2");
    }else{
        $(".clickLink").removeAttr("href").trigger("click");
        console.log("fk");
    }
},3000);
}