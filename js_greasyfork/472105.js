// ==UserScript==
// @name 汕头招聘定时刷新-666
// @namespace Violentmonkey Scripts
// @match https://st.bczp.cn/Ent/manage.aspx*
// @grant none
// @description 汕头招聘定时刷新
// @version 0.0.1.20230731 
// @downloadURL https://update.greasyfork.org/scripts/472105/%E6%B1%95%E5%A4%B4%E6%8B%9B%E8%81%98%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0-666.user.js
// @updateURL https://update.greasyfork.org/scripts/472105/%E6%B1%95%E5%A4%B4%E6%8B%9B%E8%81%98%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0-666.meta.js
// ==/UserScript==


//间隔几分钟重新打开页面
function toReUrl(reTime){
  setTimeout(function() {
    var theUrl = window.location.href;
    window.open(theUrl);
    window.close();
  }, 1000*60*reTime);
}





var headerDom = document.querySelector("#header");
var newNode = document.createElement("div"); 
newNode.id = "testBut";
newNode.innerHTML = "测试弹出窗口";
newNode.style.cssText = "position: absolute; top: 3px; left: 300px; z-index:999999999;padding:5px 10px;background: rgb(255, 255, 255); border: 1px solid rgb(0, 0, 0);cursor: pointer;";
headerDom.appendChild(newNode); 
newNode.onclick = function () {
  toReUrl(0.03);
}








var date=new Date();
var h=date.getHours();  //获取当前小时
if(((h-9)<0) || ((22-h)<0)){  //9点-22点才刷新
  toReUrl(20);
  return false;
}else{
  toReUrl(4*60);
}



var headerDom = document.querySelector("#header");
var newNode = document.createElement("div"); 
newNode.id = "reTimeDom";
newNode.className = "reTimeDom";
//newNode.innerHTML="关闭图片"
newNode.style.cssText = "position: absolute; top: 3px; left: 400px; border: 1px solid rgb(0, 0, 0); height: 140px; width: 335px; background: rgb(255, 255, 255); overflow-y: scroll;z-index:999999999;";
headerDom.appendChild(newNode); 



setTimeout(function() {
  //document.querySelector('#idcRefreshOffer').click();
  //document.querySelector('#idcRefreshOffer > a').click(); 
  document.querySelector('.MyJobBtn').click();
  var reTimeDom = document.querySelector("#reTimeDom");
  var newNode = document.createElement("div"); 
  newNode.className = "reTime";
  var myDate = new Date(); 
  
  var reTime = Number(30)+Number(Math.round(Math.random()*10));
  reTime = 1000*60*reTime;
  toReBut(reTime);
  
  newNode.innerHTML="刷新时间：" + myDate.toLocaleString() + '&nbsp;&nbsp;&nbsp;' + (reTime/1000/60) + '分钟后刷新';
  newNode.style.cssText = "width: 100%; padding: 5px; border-bottom: 1px #000 solid;";
  reTimeDom.appendChild(newNode); 
  
  /*
  setTimeout(function() {
    clswin();
  }, 1000);
  */
  
  
}, 3000);


function toReBut(reTime){
  setTimeout(function() {
    //document.querySelector('#idcRefreshOffer').click();
    //document.querySelector('#idcRefreshOffer > a').click(); 
    document.querySelector('.MyJobBtn').click();
    var reTimeDom = document.querySelector("#reTimeDom");
    var newNode = document.createElement("div"); 
    newNode.className = "reTime";
    var myDate = new Date(); 
    
    var reTimeRR = Number(30)+Number(Math.round(Math.random()*10+10)); //加多10分钟
    reTimeRR = 1000*60*reTimeRR;
    toReBut(reTimeRR);
    
    newNode.innerHTML = "刷新时间：" + myDate.toLocaleString() + '&nbsp;&nbsp;&nbsp;' + (reTimeRR/1000/60) + '分钟后刷新';
    newNode.style.cssText = "width: 100%; padding: 5px; border-bottom: 1px #000 solid;";
    reTimeDom.insertBefore(newNode,reTimeDom.childNodes[0]);
    
    setTimeout(function() {
      clswin();
      //document.querySelector('#Ybtn').click();
    }, 1000);
    
  }, reTime);
}















