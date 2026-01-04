// ==UserScript==
// @name        点击签到按钮
// @namespace   leizingyiu.net
// @match       *://*.*/*
// @grant       none
// @version     2023/3/27 21:06
// @author      leizingyiu
// @description click一下
// @license     GPL
//
// @grant    GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/462692/%E7%82%B9%E5%87%BB%E7%AD%BE%E5%88%B0%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/462692/%E7%82%B9%E5%87%BB%E7%AD%BE%E5%88%B0%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

function ClickIfExists(selector){
  let target=document.querySelector(selector);
  if(target){
    target.click();return true
  }else{
    throw(`cant find ${selector} `);
  }
}

const _dict={
  'copyai.cn':{
    url:'https://copyai.cn/creationequity',
    fn:()=>{
      ClickIfExists('.equity-show-li-btn.line-button') ;
    }
  },'smzdm.com':{
    url:'https://www.smzdm.com/',
    fn:()=>{
      ClickIfExists('#index-head > div.J_entry.entry > div.old-entry > a');
    }
  }
};
window.onload=()=>{
Object.keys(_dict).map(h=>{
  let id=GM_registerMenuCommand (h, function(){
   window.locaiton.href=_dict[h]['url'];
   // GM_unregisterMenuCommand(id);//删除菜单
  });

return h;}).filter(h=>window.location.host==h).map(h=>_dict[h]['fn']());
};
