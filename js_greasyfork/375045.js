// ==UserScript==
// @description 测试签到
// @namespace 小桀房间
// @name 小桀房间
// @icon https://apic.douyucdn.cn/upload/avatar/002/86/30/15_avatar_big.jpg
// @version 0.3831
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant GM_xmlhttpRequest
// @grant GM.xmlHttpRequest
// @match https://www.douyu.com/74751*
// @match https://www.douyu.com/cave*
// @match https://www.douyu.com/*=74751
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @connect api.xiaojie666.com
// @connect open.douyucdn.cn
// @downloadURL https://update.greasyfork.org/scripts/375045/%E5%B0%8F%E6%A1%80%E6%88%BF%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/375045/%E5%B0%8F%E6%A1%80%E6%88%BF%E9%97%B4.meta.js
// ==/UserScript==

jQuery._FN={};
var _VR={
  name:undefined,
  score:-1,
  reNum:0,
  time:new Date().getTime(),
  internal:62*60*1000,
  isSign:false,
  signCount:0,
  isST:false,
  isOnAir:false,
  qLock:false,
  qErr:false,
  ordNb:(Math.floor(Math.random()*1000+1)),
  qScore:-1
};
//全局变量  名字 分数 检查 时间搓 分数超时不更新间隔 是否签到 签到次数 签到时间 --//
//--------------- core  方法初始化   start ------//
(function(w,$,c){
$.extend(c,{
  GMxmlhttpRequest:function(obj){
   if (typeof GM_xmlhttpRequest === "function") {
     GM_xmlhttpRequest(obj);
   }else{
     GM.xmlhttpRequest(obj);
   }
  },
  init:function(){
    var $t=$('#t_rank');
    if($t.length>0){$t.remove();}
    $('body').append('<div id="t_rank" style="position:fixed;right:30px;top:300px;z-index:999;width:165px;height:auto;border:1px solid #000;background-color:#fff;">'+
    '<div style="margin:1px;">&nbsp;'+
    '<input type="checkbox" id="t_check" checked/>'+
    '<input type="button" id="t_sign" value="签 到"> '+
    '<input type="checkbox" id="t_thx_check" checked/>'+
    '<input type="button" id="t_thx" value="抢 分"> '+
    '<input type="button" id="t_qry" value="查 分">&nbsp;<span id="isOn"/></div>'+
    '<div style="margin:1px;">&nbsp;'+
    '<input type="checkbox" id="tm_check" >'+
    '<input type="button" id="t_qMap" value="地 图" > '+
    '&nbsp;&nbsp;&nbsp;&nbsp;'+
    '<input type="button" id="t_inTurn" value="入 团" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
    '</div>'+
    '<div style="margin:1px;">&nbsp;'+
    '<select id="t_selpart"><option value="#1 " selected>＃1</option><option value="#2 ">＃2</option></select> '+
    '<select id="t_selcredit"><option value="" selected></option><option value="老子压一半">一半</option><option value="老子全压了">全部</option><option value="3">1\/3</option><option value="4">1\/4</option><option value="5">1\/5</option></select> '+
    '<input type="button" id="t_sendcredit" value="压 分"> </div>'+
    '<div><input id="t_txt" style="width:120px;"> <input value="发送"type="button" id="t_send"></div>'+
    '<div id="t_mark" style="word-break:break-all;border-top:1px solid blue;"/>'+
    '<div id="t_sendOther" style="word-break:break-all;"/>'+
    '<div id="t_map" style="word-break:break-all;border-top:1px solid blue;"/>'+
    '</div>'
    );
    _VR.name=decodeURIComponent(w.document.cookie.match(new RegExp("(^| )acf_nickname=([^;]*)(;|$)"))[2]);
  },
  sMsg:function(m){$(".ChatSend textarea").val(m);$("div.ChatSend-button").hover().click();},
  sTm:function (d){if(!d){d=new Date();}
  return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
  },
  sTm2:function (d){if(!d){d=new Date();}
  return d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+'.'+d.getMilliseconds();
  },
  sTm3:function (d){if(!d){d=new Date();}
  return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+'.'+d.getMilliseconds();
  },
  qMk:function (s){
    if(_VR.name){
    c.GMxmlhttpRequest({url:"http://api.xiaojie666.com/xiaojie/credit/query.do?nickName="+_VR.name,
      method: "GET",onload:function(r){
        _VR.qErr=false;
        r=JSON.parse(r.responseText);
        var t=parseInt(r.credit),sign='';
        if(t!=_VR.score){
          if(!!s&&s>=1&&_VR.isST){// 1 签到查询
            if(1==s){sign='签'+_VR.signCount;}
            _VR.isSign=true;_VR.signCount=0;
          }
          $('#t_mark').html('账户:'+r.nickName
          +'<br>积分:'+t+'<span style="color:red;">['+(-1==_VR.score?0:(t-_VR.score))+']</span>'+sign
          +'<br>更新:<span style="color:red;">'+c.sTm()+'</span>'
          +'<br>会员:'+c.sTm(new Date(r.vipDate)) );
          _VR.score=t;_VR.time=new Date().getTime();
        }
      },onerror:function(){_VR.qErr=true;}
    });
    }
  },
  qRSt:function(){//直播状态
    c.GMxmlhttpRequest({url:"http://open.douyucdn.cn/api/RoomApi/room/74751",
      method: "GET",onload:function(r){r=JSON.parse(r.responseText);
        if(r.data.room_status ==="1"){_VR.isOnAir=true;$('#isOn').text('直播');$('#isOn').css('color','red');}
        else{_VR.isOnAir=false;$('#isOn').text('下播');$('#isOn').css('color','');}
      }
    });
  },
  qMp:function(){
    c.GMxmlhttpRequest({url:"http://api.xiaojie666.com/xiaojie/levelrecord/list.do?page=0&rows=1",
     method: "GET",onload:function(r){r=JSON.parse(r.responseText);r=r.levelRecords[0];
       var mpurl="https://supermariomakerbookmark.nintendo.net/courses/"+r.levelId;
       $('#t_map').html('关卡:<a href="'+mpurl+'" target="_blank">'+r.levelId+'</a><br>关名:'+r.name_zh+'['+r.creator_ntd_origin_zh+']'+'<br>尝试:'+r.attempts+';几率:'+(r.clearrate*100).toFixed(2));
     }
    });
  },
  thxB:function(){c.sMsg('#抢分 '+c.sTm2()+'ljdy'+(_VR.ordNb++));},
  inTurn:function(){c.sMsg('#入团 '+c.sTm2()+'ljdy'+(_VR.ordNb++));},
  sUp:function(){c.sMsg('#签到 '+c.sTm2()+'ljdy'+(_VR.ordNb++));},
  sIMs:function(){c.sMsg($('#t_txt').val());},
  isSignTime:function(tm){
    if(!tm){tm=new Date().getMinutes();}
    if(tm>=58||tm<=3||(28<=tm&&tm<=33)){_VR.isST=true;}
    else{_VR.isST=false;}
  },
  isSignBlock:function(tm){
    if(!tm){tm=new Date().getMinutes();}
    if(tm>=58||tm<4||(28<=tm&&tm<34)||0==tm%10){return true;}
    else{return false;}
  },
  inCredit:function(){//压分
    var part=$('#t_selpart').val(),credit=$('#t_selcredit').val(),tsg='';
    if(part&&credit){
      if("3,4,5".indexOf(credit)>=0){
        if(_VR.score>0){tsg=part+ Math.floor(_VR.score/credit);}
      }else{tsg=part+credit+' '+new Date().getMilliseconds();}
    }
    if(tsg&&''!=tsg){c.sMsg(tsg);$('#t_sendOther').html('压:'+tsg);}
    else{$('#t_sendOther').html('压:空');}
  },
  refresh:function(d){
  }
});

})(window,jQuery,jQuery._FN);// 扩展core
//--------------- core  方法初始化   end ------//
(function($){
$._FN.init();
//bingding
$('#t_sign').on('click',function(){
$._FN.sUp();
_VR.isSign=true;
_VR.time=new Date().getTime();
_VR.signCount=0;
});
$('#t_thx').on('click',function(){$._FN.thxB();});
$('#t_qry').on('click',function(){$._FN.qMk();});
$('#t_send').on('click',$._FN.sIMs);
$('#t_inTurn').on('click',$._FN.inTurn);
$('#t_qMap').on('click',$._FN.qMp);
$('#t_sendcredit').on('click',function(){$._FN.inCredit();});
//query
$._FN.qRSt();//直播状态
$._FN.qMk();
//分钟 签到标准 查分To 查直播状态 窗口滚动 窗口跳转倒计 飞机数量
var m,_sign,_to,roll=0,clNum=0,gNum=0;
setInterval(function(){
  $._FN.refresh();
  _sign=undefined;
  m=new Date().getMinutes();
  $._FN.isSignTime(m);
  if(0==m%5){
  //查询地图
  if($('#tm_check').is(':checked')){$._FN.qMp();}
  }
  var relogin=$('.js-danmu-reconnect');
  if(relogin.length>0){relogin.click();}
  if(_to){try{clearInterval(_to);}catch(e){}_to=undefined;}
 // if($('#t_check').is(':checked')&&((new Date().getTime()-_VR.time)>_VR.internal)){//当前时间-上次积分更新时间 大于 时间间隔
 //     location.reload();
 // }
  try{//窗口滚动
  if(roll<2){
    $('div.chat-cont-wrap').click();
     $('div.mainbody').hover();
    $("html,body").animate({scrollTop:$('.ChatSend').offset().top-$(window).height()+(60*roll)}, 500);
    $('.ChatSend').hover();roll++;
  }}catch(e){}
  if(!$._FN.isSignBlock(m)){_VR.qErr=false;return;}//签到时间 或 每5分
  $._FN.qRSt();//直播状态
  if(_VR.qErr){
    if(1==m||31==m){$('#t_sign').click();}return;
  }
  if($('#t_check').is(':checked')){//签到
    if(_VR.isST){//签到时间，未签到
      if(!_VR.isSign){$._FN.sUp(); _sign=1; _VR.signCount++;}
    }else{_VR.isSign=false;_VR.signCount=0;}
  }
  if(_VR.isST&&_VR.isSign){return;}//签到时间段 且 已经签到
   _to=setTimeout($._FN.qMk.bind(undefined,_sign),7000);
},59999);

setInterval(function(){
// 每x秒检查跳转直播窗口
  if(clNum>=1){
    clNum=0;try{$(".v-con ul li a").eq(0).attr("href", 'javascript:;');}catch(e){}
    var w=$('button.dy-Modal-close');
    if(w.length>0&&!w.is(":hidden")){w.click();}
    w=$('.dy-ModalRadius-close');
    if(w.length>0&&!w.is(":hidden")){w.click();}
    w=$('.dy-ModalRadius-close-x');
    if(w.length>0&&!w.is(":hidden")){w.click();}

  }else{clNum++;}
  //自动抢分(飞机火箭)
  if($('#t_thx_check').is(':checked')){
    if($(".TreasureDetail").length>0&&!$(".TreasureDetail").is(":hidden")){
      var t,$ts=$('.TreasureNum-val');
      if($ts.length<=0){t=1;}
      else{t=$ts.text();}
      t=parseInt(t);
      if(t>gNum){
        if('发送'==$('div.ChatSend-button').text()){
          $._FN.thxB();gNum=t;_VR.reNum=1;_VR.qLock=false;
        }
      }else{
        if(_VR.reNum<=4){// x次 抢分
          if('发送'==$('div.ChatSend-button').text()){_VR.reNum++;$._FN.thxB();}
        }gNum=t;
      }
    }else{gNum=0;_VR.qLock=false;_VR.qScore=_VR.score;}
  }else{gNum=0;_VR.qLock=false;_VR.qScore=_VR.score;}
},900);

//移动
$(function(){
var $div=$('#t_rank');
$div.bind("mousedown",function(event){
  var offset_x = $(this)[0].offsetLeft;//x坐标
  var offset_y = $(this)[0].offsetTop;//y坐标
  var mouse_x = event.pageX;
  var mouse_y = event.pageY;
  $(this).bind("mousemove",function(ev){
    var _x = ev.pageX - mouse_x;
    var _y = ev.pageY - mouse_y;
    var now_x = (offset_x + _x ) + "px";
    var now_y = (offset_y + _y ) + "px";
    $div.css({top:now_y,left:now_x});
  });
  $(this).bind("mouseup",function(){
      $(this).unbind("mousemove");
  });
});
});

})(jQuery);


