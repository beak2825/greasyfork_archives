// ==UserScript==
// @name        81局长的抽奖秘籍手动模拟版
// @namespace   https://greasyfork.org/zh-CN/scripts/24455-81%E5%B1%80%E9%95%BF%E7%9A%84%E6%8A%BD%E5%A5%96%E7%A7%98%E7%B1%8D%E6%89%8B%E5%8A%A8%E6%A8%A1%E6%8B%9F%E7%89%88
// @version     0.1.6
// @include     http://live.bilibili.com/*
// @grant       none
// @Author      xylern;iiicccoooddd
// @copyright   xylern
// @description 81局长的抽奖秘籍你懂的

// @downloadURL https://update.greasyfork.org/scripts/24455/81%E5%B1%80%E9%95%BF%E7%9A%84%E6%8A%BD%E5%A5%96%E7%A7%98%E7%B1%8D%E6%89%8B%E5%8A%A8%E6%A8%A1%E6%8B%9F%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/24455/81%E5%B1%80%E9%95%BF%E7%9A%84%E6%8A%BD%E5%A5%96%E7%A7%98%E7%B1%8D%E6%89%8B%E5%8A%A8%E6%A8%A1%E6%8B%9F%E7%89%88.meta.js
// ==/UserScript==

///////////////new xds////////////
var _u=window.location.pathname.replace("/","");

if(_u!="60617" && _u!="5269"){
	return;
}
console.warn("开始初始化");

/*var Moer_=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;
var msg_mors=new Moer_(function(records){CJ_xds(records);});
msg_mors.observe($('#chat-msg-list').get(0),{childList:true});
var CJ_xds_cache={1:{rmid:0,t:0}};
function CJ_xds(a){
  for(i=0;a[i];i++){
    if(a[i].addedNodes.length&&a[i].addedNodes[0].childNodes[0].className=='announcement-container small-tv-msg'&&a[i].addedNodes[0].childNodes[0].innerText.split('，请前往').length==2){
      RMid=a[i].addedNodes[0].childNodes[0].innerText.split('在直播间【')[1].split('】')[0];
      console.warn('1)['+new Date().toString().split(' ')[4]+'] 发现对应公告 - '+RMid+' - 预处理');
      var tmp_a=1,tmp_b=true;
      for(;CJ_xds_cache[tmp_a].rmid!=0;tmp_a++){
        if(CJ_xds_cache[tmp_a].rmid==RMid){
          CJ_xds_cache[tmp_a].t++;
          tmp_b=false;
        };
      };
      if(tmp_b){
        CJ_xds_cache[tmp_a+1]={rmid:0,t:0};
        CJ_xds_cache[tmp_a]={rmid:0,t:1};
        CJ_xds_cache[tmp_a].rmid=RMid;
      };
      CJ_xds_pA();
    };
  };
};
$('body').append('<iframe id="If_CJ_xds" src="" style="width:9px;height:9px;top:0px;left:0px;display:none;position:fixed;z-index:99999"></iframe>');
var CJ_xds_readly=true,CJ_xds_load=false;
function CJ_xds_pA(){
  if(CJ_xds_readly&&CJ_xds_cache[1].rmid!=0){
    console.warn('2)['+new Date().toString().split(' ')[4]+'] 发起载入 '+CJ_xds_cache[1].rmid+'直播间');
    $('#If_CJ_xds').attr('src','/'+CJ_xds_cache[1].rmid);
    CJ_xds_readly=false;
    CJ_xds_load=true;
    $('#If_CJ_xds').css({'width':'100%','height':'100%','display':'block'});
    $('#If_CJ_xds').load(function(){CJ_xds_load=false;CJ_xds_pA2();});
    setTimeout(function(){if(CJ_xds_load&&!(CJ_xds_readly)){CJ_xds_pA2();};},10000);
  };
};
var si_CJ_xds=0;
function CJ_xds_pA2(){
  $('#If_CJ_xds').contents().find('.draw-img').click();
  $('#If_CJ_xds').unbind('load');
  clearInterval(si_CJ_xds);
  si_CJ_xds=setInterval(function(){CJ_xds_pB();},783);
  if(CJ_xds_load){
    CJ_xds_load=false;
    console.warn('2)['+new Date().toString().split(' ')[4]+'] 载入时间过长');
  };
  console.warn('3)['+new Date().toString().split(' ')[4]+'] 直播间'+CJ_xds_cache[1].rmid+' 等待查询 - '+si_CJ_xds);
};
var CJ_xds_gt=0;
function CJ_xds_pB(){
  if($('#If_CJ_xds').contents().find('.draw-text').children('p').eq(1).css('display')=='block'){
    clearInterval(si_CJ_xds);
    $('#If_CJ_xds').attr('src','');
    $('#If_CJ_xds').css({'width':'9px','height':'9px','display':'none'});
    console.warn('4)['+new Date().toString().split(' ')[4]+'] 直播间'+CJ_xds_cache[1].rmid+' 获取结束，还原等待状态');
    for(i=2;CJ_xds_cache[i];i++){
      CJ_xds_cache[i-1].rmid=CJ_xds_cache[i].rmid;
      CJ_xds_cache[i-1].t=CJ_xds_cache[i].t;
    };
    CJ_xds_gt=0;
    //If_CJ_xds.location.reload();
    CJ_xds_readly=true;
    if(CJ_xds_cache[1].rmid!=0){
      CJ_xds_pA();
    };
  }else{
    CJ_xds_gt++;
    $('#If_CJ_xds').contents().find('.draw-img').click();
  };
};
*/


var Moer_=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;
var msg_mors=new Moer_(function(records){CJ_xds(records);});
msg_mors.observe($('#chat-msg-list').get(0),{childList:true});
var CJ_xds_cache={1:{rmid:0,t:0}};
function CJ_xds(a){
  for(i=0;a[i];i++){
    if(a[i].addedNodes.length&&a[i].addedNodes[0].childNodes[0].className=='announcement-container small-tv-msg'&&a[i].addedNodes[0].childNodes[0].innerText.split('，请前往').length==2){
      RMid=a[i].addedNodes[0].childNodes[0].innerText.split('在直播间【')[1].split('】')[0];
      console.warn('1)['+new Date().toString().split(' ')[4]+'] 发现对应公告 - '+RMid+' - 预处理');
      var tmp_a=2,tmp_b=true;
      if(CJ_xds_readly){
        tmp_a=1;
      };
      for(;CJ_xds_cache[tmp_a].rmid!=0;tmp_a++){
        if(CJ_xds_cache[tmp_a].rmid==RMid){
          CJ_xds_cache[tmp_a].t++;
          tmp_b=false;
        };
      };
      if(tmp_b){
        CJ_xds_cache[tmp_a+1]={rmid:0,t:0};
        CJ_xds_cache[tmp_a]={rmid:0,t:1};
        CJ_xds_cache[tmp_a].rmid=RMid;
      };
      CJ_xds_pA();
    };
  };
};
$('body').append('<iframe id="If_CJ_xds" src="" style="width:9px;height:9px;top:0px;left:0px;display:none;position:fixed;z-index:99999"></iframe>');
var CJ_xds_readly=true,CJ_xds_load=false;
function CJ_xds_pA(){
  if(CJ_xds_readly&&CJ_xds_cache[1].rmid!=0){
    console.warn('2)['+new Date().toString().split(' ')[4]+'] 发起载入 '+CJ_xds_cache[1].rmid+'直播间');
    $('#If_CJ_xds').attr('src','/'+CJ_xds_cache[1].rmid);
    CJ_xds_readly=false;
    CJ_xds_load=true;
    $('#If_CJ_xds').css({'width':'100%','height':'100%','display':'block'});
    $('#If_CJ_xds').load(function(){CJ_xds_load=false;CJ_xds_pA2();});
    setTimeout(function(){if(CJ_xds_load&&!(CJ_xds_readly)){CJ_xds_pA2();};},10000);
  };
};
var si_CJ_xds=0;
function CJ_xds_pA2(){
  $('#If_CJ_xds').unbind('load');
  $('#If_CJ_xds').contents().find('.draw-img').click();
  clearInterval(si_CJ_xds);
  si_CJ_xds=setInterval(function(){CJ_xds_pB();},783);
  if(CJ_xds_load){
    CJ_xds_load=false;
    console.warn('2)['+new Date().toString().split(' ')[4]+'] 载入时间过长');
  };
  console.warn('3)['+new Date().toString().split(' ')[4]+'] 直播间'+CJ_xds_cache[1].rmid+' 等待查询 - '+si_CJ_xds);
};
var CJ_xds_gt=0;
function CJ_xds_pB(){
  if(!!($('#If_CJ_xds').contents().find('.msg-item-ctnr'))&&!!($('#If_CJ_xds').contents().find('.msg-item-ctnr').length)){
    if($('#If_CJ_xds').contents().find('.draw-text').children('p').eq(1).css('display')=='block'){
      console.warn('4)['+new Date().toString().split(' ')[4]+'] 直播间'+CJ_xds_cache[1].rmid+' 获取结束，还原等待状态');
      CJ_xds_gt=91;
    }else{
      CJ_xds_gt++;
      $('#If_CJ_xds').contents().find('.draw-img').click();
    };
  }else{
    CJ_xds_gt++;
  };
  if(CJ_xds_gt>51){
    if(CJ_xds_gt<90){
      console.warn('5)['+new Date().toString().split(' ')[4]+'] 直播间'+CJ_xds_cache[1].rmid+' 获取超时，还原等待状态');
    };
    clearInterval(si_CJ_xds);
    $('#If_CJ_xds').attr('src','');
    $('#If_CJ_xds').css({'width':'9px','height':'9px','display':'none'});
    for(i=2;CJ_xds_cache[i];i++){
      CJ_xds_cache[i-1].rmid=CJ_xds_cache[i].rmid;
      CJ_xds_cache[i-1].t=CJ_xds_cache[i].t;
    };
    CJ_xds_gt=0;
    for(i=1,iii=1;iii&&CJ_xds_cache[i];i++){
      if(CJ_xds_cache[i].rmid==0){
        for(ii=i+1;CJ_xds_cache[ii];ii++){
          if(CJ_xds_cache[ii].rmid!=0){
            CJ_xds_cache[i].rmid=CJ_xds_cache[ii].rmid;
            CJ_xds_cache[i].t=CJ_xds_cache[ii].t;
            CJ_xds_cache[ii]={rmid:0,t:0};
            i++;
          };
        };
      };
    };
    CJ_xds_readly=true;
    if(CJ_xds_cache[1].rmid!=0){
      CJ_xds_pA();
    };
  };
};

