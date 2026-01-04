// ==UserScript==
// @name         twitter 自动取关（旧UI）
// @description  twitter 自动取消关注 适用于旧UI
// @version      1.4
// @namespace   https://space.bilibili.com/482343
// @author      超神越鬼
// @license     超神越鬼
// @include      https://twitter.com/*
//@exclude https://twitter.com/
//@exclude https://twitter.com/home
// @grant        window.close
// @grant GM_setValue
// @grant GM_getValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/403726/twitter%20%E8%87%AA%E5%8A%A8%E5%8F%96%E5%85%B3%EF%BC%88%E6%97%A7UI%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/403726/twitter%20%E8%87%AA%E5%8A%A8%E5%8F%96%E5%85%B3%EF%BC%88%E6%97%A7UI%EF%BC%89.meta.js
// ==/UserScript==
var mz,e,i,oa,j,z=1,gz = 0,sj,kk = 0,oi = 1,xh=10000,sss=0,yy,yyy=0;
var sy = 6; //推文数量小于sy个自动取关
var sjdy = 365; //最新推特发布时间大于sjdy天自动取关
var ziji = GM_getValue("ziji","在这里输入自己的推特名");
var fqlb = GM_getValue("buquguanliebiao",new Array(""));
var qglb = GM_getValue("quguanliebiao",new Array(""));
GM_setValue("ziji", ziji);
function sleep(d){
     for(var t = Date.now();Date.now() - t <= d;);
}
function gy(){
     sss =1;
     window.close();
}
var toObj = function( arr ){ var obj = {}; for(var temp in arr){ obj[arr[temp]] = true; } return obj;};
var toArr = function( obj ){ var arr = []; for(var temp in obj){ arr.push(temp); } return arr;};
var getUniq = function(arr){ return toArr( toObj(arr) );};
function gb(){
     if(sss)return;
     gz.click();
     qglb.push(mz);
     qglb=getUniq(qglb);
     GM_setValue("quguanliebiao",qglb);
     console.log(mz,"  取关","     ",gz);
     setInterval(function(){
          var topics = document.getElementsByTagName('span');
          gz=0;
          for (i = 0; i < topics.length; i++) {
               var a = topics[i];
               if (a.textContent.indexOf("关注")>-1){
                    if (a.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("class")=="ProfileNav-item ProfileNav-item--userActions u-floatRight u-textRight with-rightCaret "){
                         var oValue = getComputedStyle(a.parentElement,null).display;
                         if (oValue=="block"){
                              gz=topics[i];
                              break;
                         }
                    }
               }
          }
          if (gz!=0)gy();
     },2000);
}
function bqg(){
     if(sss)return;
     fqlb.push(mz);
     fqlb=getUniq(fqlb);
     GM_setValue("buquguanliebiao",fqlb);
     console.log(mz,"  不取关");
     gy();
}
function dk(){
     if (yyy>200){console.log("已处理完毕，结束脚本"); return;}
     var tem = new Array("");
     var topics = document.getElementsByClassName('fullname ProfileNameTruncated-link u-textInheritColor js-nav');
     yy=1;
     for (i = 0; i < topics.length; i++) {
          sj=topics[i].href;
          e = topics[i].href.split(".com/")[1];
          if (e==ziji)continue;
          topics[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
          kk++;
          yy=0;
          a = 0;
          for (j=0;j<qglb.length;j++){
               if (qglb[j] == e){a=1; break;}
          }
          if (a)continue;
          for (j=0;j<fqlb.length;j++){
               if (fqlb[j] == e){a=1; break;}
          }
          if (a)continue;
          console.log(e);
          tem.push(sj);
     }
     i=1;
     console.log("已处理 ",kk," 个        本次扫描新增 ",tem.length-1," 个。 ",tem);
     if (yy){yyy++}else{yyy=0}
     if (tem.length<2){xh = 100}else{xh =(tem.length-1)*5000};
     while (i<tem.length){
          if (tem[i].indexOf(".com/")>-1){
               let tab = GM_openInTab(tem[i],true);
               //window.open(tem[i]);
          }
          i++;
          sleep(5000);
     }

}
mz = location.href;
if (mz.indexOf(ziji+"/following")>-1 || mz.indexOf("twitter.com/following")>-1){
     console.log("已关注打开模式");
     dk();
     document.documentElement.scrollTop += 100000;
     window.setInterval(function(){
          if (yyy>200){console.log("已处理完毕，结束脚本"); return;}
          dk();
          document.documentElement.scrollTop += 100000;
          if (oi==5){ document.documentElement.scrollTop = 0;oi=0;}
          oi++;
     },xh);
     return;
};
mz = mz.split(".com/")[1];
e = mz;
if (e==ziji){gy();return}
a =0;
if (a){gy();return}
for (j=0;j<fqlb.length;j++){
     if (fqlb[j] == e){a=1; break;}
}
if (a){gy();return}
if(sss)return;
if (e.indexOf("/")>-1 || e.indexOf("?")>-1 || e.indexOf("=")>-1 || e.indexOf(ziji)>-1)return;
var topics = document.getElementsByTagName('span');
for (i = 0; i < topics.length; i++) {
     var a = topics[i];
     if (a.textContent.indexOf("正在关注")>-1){
          if (a.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("class")=="ProfileNav-item ProfileNav-item--userActions u-floatRight u-textRight with-rightCaret "){
               var oValue = getComputedStyle(a.parentElement,null).display;
               if (oValue=="block"){
                    if (a.textContent.indexOf("正在关注")>-1){
                         gz=topics[i];
                         break;
                    }
               }
          }
     }
}
if (gz==0)return;
if(sss)return;
gz = gz.parentElement.nextElementSibling;
/* 无推文自动取关 */
e = document.getElementsByTagName("h3");
for ( i=0;i<e.length;i++){
     oa = e[i].innerText;
     if (oa!=null){if (oa.indexOf("没有推文")>-1){
          console.log("无推文自动取关");
          gb();
     }}
}
if(sss)return;
//推文数量少于 sy 个自动取关
e = document.getElementsByClassName('ProfileNav-value');
for ( i=0;i<e.length;i++){
     if (e[i].previousSibling.previousSibling!=null){
          if(e[i].previousSibling.previousSibling.innerText.indexOf("推文")>-1){
               //console.log(e[i]);
               oa = e[i].innerText;
               if (oa!=null){
                    if (oa<sy){
                         console.log("推文少于 ",sy," 自动取关");
                         gb();
                    }
               }
          }
     }
}
if(sss)return;
//最新推特发布时间大于sjdy天自动取关
i = 0;
e = document.getElementsByClassName('tweet-timestamp js-permalink js-nav js-tooltip');
for (oa=0;oa<e.length;oa++){
     z = 0;
     i = Math.floor(e[oa].firstChild.getAttribute("data-time-ms")/86400000);
     j = Math.floor(new Date().getTime()/86400000);
     //console.log("最新推特相差天数：",j-i);
     if (j-i<sjdy){bqg();return}
     if (oa>15)break;
}
if (z){bqg();return}
if(sss)return;
console.log("最推发布时间大于 ",sjdy," 天  自动取关");
gb();