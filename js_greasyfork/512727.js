// ==UserScript==
// @name         jkToolFuncs
// @namespace       moe.canfire.flf
// @version         1.0.0
// @description    jkToolFuncsxx
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  try to take over the world!
// @author       You
// @license MIT
// @match           *://*/*
// @grant unsafeWindow
// ==/UserScript==

 //访问 不到window对象,需用unsafewindow
(function() {
    'use strict';
//==========================================================
class jkToolFuncs{
 waitFor(fn,interval_10 ,timeout_5000 ) {
     //返回promise,//判断变量是否改变，默认间隔10毫秒，超时5000
     if(!interval_10)interval_10=3;      if(!timeout_5000)timeout_5000=5000;
  return new Promise((resolve, reject) => {
      let timeoutid=-1;
    const checkVariable = setInterval(() => {
      if (  fn()==true ) {  clearInterval(checkVariable); clearTimeout(timeoutid); resolve(); }
    }, interval_10); // 每100毫秒检查一次变量是否达到指定的值
    timeoutid=setTimeout(() => {
          clearInterval(checkVariable);
          reject(new Error('Timeout waiting variable to change'));
       }, timeout_5000 );     
  });  
}//===================
  sleep( miniseconds ){
   //一个简单的promise,延时1毫秒函数,在此基础上，实现同步的wait
  return new Promise(function(resolve){
    setTimeout(() => resolve("ok"), miniseconds );
  })
 }//func=========

 find(selector){
     return document.querySelector(selector);
   }
 finds(selector){
     return document.querySelectorAll(selector);
   }
 isValid(el){
       if((el==undefined)||el==null) return true; else  return false;
   }
 addSheet(cssText,id){
    var el=this.sel('#'+id);
    if(!this.isvalid(el))return;
    var style = document.createElement('style');    style.id=id;
    style.innerHTML =cssText;
    document.head.appendChild(style);
   }
  loadScript(url){　//loadscript(url).then
  var tmp=url.substring(url.lastIndexOf('/')+1);
  return new Promise((resolve,reject)=>{
　　var script = document.createElement("script");
　　script.type = "text/javascript";
　　if(script.readyState){　　//只有ie才有
　　　　script.onreadystatechange = function(){
　　　　　　if(script.readyState == "complete" || script.readyState == "loaded"){　　
       　  console.log(tmp+" load Ok ie")
           resolve()　
           }
　　　　}
　　}else{
　　　　script.onload = function(){　　
         console.log(tmp+" load Ok browser")
         resolve()　
         }
　　}
　　script.src = url;
　　document.head.appendChild(script);
  })
}//loadScript("01.js","test")

async loadjQuery(){
    if(!window.jQuery){  return this.loadScript('https://code.jquery.com/jquery-3.6.0.min.js' ); } return false;
}//function

}//class========================
 



unsafeWindow.jk=new jkToolFuncs();
//==========================================================
})();