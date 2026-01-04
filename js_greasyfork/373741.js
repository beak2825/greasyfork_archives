// ==UserScript==
// @name        imageview1
// @namespace   imageview1
// @description 图片查看
// @include     http://www.xstuk.com/*.html
// @include     http://www.xgtutu.com/*.html
// @version     1
// @grant       GM_getValue
// @grant       GM_setValue
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/373741/imageview1.user.js
// @updateURL https://update.greasyfork.org/scripts/373741/imageview1.meta.js
// ==/UserScript==

// 显示图片
var $image = $("#picg > p:nth-child(1) > a:nth-child(1) > img");
// 下一个图片连接
var $next_image_href = $(".pagelist > p:nth-child(1) > b:nth-child(1) > a:last").attr("href");
// 上一个图片连接
var $prev_image_href = $(".pagelist > p:nth-child(1) > b:nth-child(1) > a:first").attr("href");

// 下一组图片连接
var $next_group_href = $("#d5a").next().find("a").attr("href");
// 上一组图片连接
var $prev_group_href = $("#d5a").next().next().find("a").attr("href");


// 状态功能提示信息
var tip_help_msg = "开始【s】|暂停【p】<br>上一页【,】【k】【left】<br>下一页【.】【j】【right】<br>上一组【h】|下一组【l】";

var KEY_AUTO_PLAY = "autoPlay";
var KEY_INTERVAL = "interval";
var KEY_SHOW_OTHER_PIC = "showOtherPic";
var KEY_SHOW_MM = "showMM";

var maxWidth = window.innerWidth-20;
var maxHeight = window.innerHeight-10;


// get,set auto play value
function getAutoPlayValue(){
  return GM_getValue(KEY_AUTO_PLAY,false);
}
function setAutoPlayValue(val_boolean){
  GM_setValue(KEY_AUTO_PLAY,val_boolean)
  showTipsInfo();
}

// get,set interval
function getIntervalValue(){
  var interval = GM_getValue(KEY_INTERVAL,5);
  if(interval <1 || interval >9){
    interval = 5;
  }
  return interval;
}
function setIntervalValue(val_int){
  var interval = 5;
  if(val_int >= 1 && val_int <= 9){
    interval = val_int;
  }
  GM_setValue(KEY_INTERVAL,interval);
  showTipsInfo();
}

// get,set show other pic
function getShowOtherPicValue(){
  return GM_getValue(KEY_SHOW_OTHER_PIC,false);
}
function setShowOtherPicValue(val_boolean){
  return GM_setValue(KEY_SHOW_OTHER_PIC,val_boolean);
}

// get,set show mm
function getShowMMValue(){
  return GM_getValue(KEY_SHOW_MM,false);
}
function setShowMMValue(val_boolean){
  return GM_setValue(KEY_SHOW_MM,val_boolean);
}


// show next pic
function nextPic(){
  location.href = $next_image_href;
}
// show prev pic
function prevPic(){
  location.href = $prev_image_href;
}
// show next group
function nextGroup(){
  location.href = $next_group_href;
}
// show prev group
function prevGroup(){
  location.href = $prev_group_href;
}

var $otherPic = $(".otherpic");
function showOtherPic(){
  $otherPic.appendTo("body")
      .css({"position":"fixed","bottom":"30px","width":maxWidth+"px","opacity":"0.5"}).show()
      .find(".arr_left,.arr_right").hide().end()
      .find(".otherlist").css({"width":maxWidth+"px"}).end()
      .find(".otherlist li").css({"border":"none","width":"120px","margin":"3px"});
  var height = maxHeight - 240;
  $(".content-pic img").css({"height":height+"px"});
}
function hideOtherPic(){
  $otherPic.hide();
  $(".content-pic img").css({"height":maxHeight+"px"});
}

// show auto play tip
var $tip_auto_play = $("<span></span>").attr("id","tip_auto_play");
function showAutoPlayTip(){
  if(getAutoPlayValue()){
    $tip_auto_play.text("自动播放:【运行中】").css("color","blue");
  }else{
    $tip_auto_play.text("自动播放:【未启动】").css("color","grey");
  }
}

// show interval tip
var $tip_interval = $("<span></span>").attr("id","tip_interval");
function showIntervalTip(){
  $tip_interval.text("播放间隔:【"+getIntervalValue()+"秒】");
}

var $tip_help = $("<span></span>").attr("id","tip_help");
function showHelpTip(){
  $tip_help.html(tip_help_msg).show();
}
function hideHelpTip(){
  //todo hide help tip
}

// show tip
var $tips_info = $("<div></div>").attr("id","tips_info").css({"opacity":"0.8","color":"#999","position":"fixed","top":"0","right":"0"});
function showTipsInfo(){
  $tips_info.appendTo("body");
  $tips_info.append($tip_auto_play);
  $tips_info.append($tip_interval);
  $tips_info.append($tip_help);

  showAutoPlayTip();
  showIntervalTip();
  showHelpTip();
}

// auto play timer
var timer;
// start Timer
function startTimer(){
  if(getAutoPlayValue()){
    timer = setTimeout(nextPic,getIntervalValue()*1000);
  }
}
// stop Timer
function stopTimer(){
  clearTimeout(timer);
}

// init ui
function initUI(){
  //$(".nav,.place,.toper,.header,.footer,.content-msg,.tui648,.baidu960,.content>h5").hide();
  $("body").css({"background-image":"none","background-color":"black"});
  $("body>*").hide();

  var $image_box = $("<div></div>").css({"width":"100%","text-align":"center"}).appendTo("body");
  $image.appendTo($image_box).css({"height":maxHeight+"px","margin":"5px","border-radius":"5px"}).show();

  $(".content-page").css({"position":"fixed","bottom":"0","opacity":"0.2"});
  $(".updown").hide();
  $(".updown_l").text("上一组:"+$(".updown_l").text()).appendTo(".content").css({"position":"fixed","bottom":"0","left":"0","background":"none","padding":"0"});
  $(".updown_r").text("下一组:"+$(".updown_r").text()).appendTo(".content").css({"position":"fixed","bottom":"0","right":"0","background":"none","padding":"0"});

  var title = $(".h > h1:nth-child(1)").text();
  var page_total = $(".page-ch:first").text();
  $("<div></div>").text(title+page_total).css({"opacity":"0.5","color":"#999","position":"fixed","top":"0","left":"0"}).appendTo("body");

  if(getShowOtherPicValue()){
    showOtherPic();
  }else{
    hideOtherPic();
  }
}

function toggleMM(){
    var showMM = getShowMMValue();
    if(showMM){
        setShowMMValue(false);
    }else{
        setShowMMValue(true);
    }
    window.location.reload();
}

function togglePlay(){
       if(getAutoPlayValue()){
            setAutoPlayValue(false);
            stopTimer();
       }else{
            setAutoPlayValue(true);
            startTimer();
       }
}

function checkUse(){
    if($("body").has("#bzs3")){
        return true;
    }
    return false;
}

function registEvent(){
  $(document).bind("keydown",function(event){
    //alert(event.which);
    if(event.which>=49 && event.which<=58){
      setIntervalValue(event.which-48);
    }

    switch(event.which){
      case 73://i
        if(getShowOtherPicValue()){
          hideOtherPic();
          setShowOtherPicValue(false);
        }else{
          showOtherPic();
          setShowOtherPicValue(true);
        }
        break;
      case 190://.
      case 72://h
        //alert("上一组");
        prevGroup();
        break;
      case 188://,
      case 76://l
        //alert("下一组");
        nextGroup();
        break;
      case 74://j
      case 39://right
        nextPic();
        break;
      case 75://k
      case 37://left
        prevPic();
        break;
      case 77://m
        toggleMM();
        break;
      case 80://p
        //alert("停止播放");
        setAutoPlayValue(false);
        stopTimer();
        break;
      case 83://s
        //alert("开始播放");
        togglePlay();
        break;
      default:
        break;
    }
  });
}

$(function(){
    if(checkUse()){
        registEvent();
        if(getShowMMValue()){
            initUI();
            startTimer();
            showTipsInfo();
        }
   }
});
