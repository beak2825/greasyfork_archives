// ==UserScript==
// @name         泛雅平台语音讨论定时刷新
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  tryfanya
// @author      aaa
// @require     https://greasyfork.org/scripts/441600-jk/code/jk.user.js
// @require         https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js
// @match        http://mooc1.chaoxing.com/bbscircle/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443741/%E6%B3%9B%E9%9B%85%E5%B9%B3%E5%8F%B0%E8%AF%AD%E9%9F%B3%E8%AE%A8%E8%AE%BA%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/443741/%E6%B3%9B%E9%9B%85%E5%B9%B3%E5%8F%B0%E8%AF%AD%E9%9F%B3%E8%AE%A8%E8%AE%BA%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==
/*
用油猴浏览器，复制到本地管理器中， chrome://flags/#autoplay-policy  设置 无需手势 自动播放声音
简单记录发言名单，也可不用：源代码在注释里 http:127.0.0.1/rec.php?stuname
自动播放声音需要权限：
1.新版 chrome 点击网址前的小图标，网站设置，允许声音自动播放
2.旧版 网址 chrome://flags/#autoplay-policy  设置 无需手势


*/
(function() {
    'use strict';
var audio;
var audioruning=false;


setInterval(function(){
    console.log("reload");
    if( audioruning==false){ window.location.reload();}
    else{ console.log("播放中，暂停刷新网页！");}
},5*1000);
/* */
//-----------------------------------------------------

    function getAfter(sourcestr,str){
  var p=sourcestr.indexOf(str);
  if(p<0) return sourcestr;
  return sourcestr.substr(p+str.length);
};
function  creatElement(uid,tag){
    var el=document.querySelector("#"+uid) ;
    if( (el!=undefined)&&(el!=null)  ){el.parentNode.removeChild(el);};
     el=document.createElement(tag);el.id=uid;
     return el;
};
//得到所有声音的文件名列表及objectId列表
var soundlist2=[];
var soundlist=[];
var key=[];
var playedsound=window.localStorage.getItem("playedsound");
var amrlist=$("a:contains(.amr)");
$(amrlist).each(function(e){
    var amr=$(this).attr("title");
    var url=$(this).attr("href");
    var objectid=getAfter(url,"objectId=");
    var voiceurl="http://mooc1.chaoxing.com//module/audioplay.html?objectid="+ objectid;
    soundlist2[amr]=voiceurl;
    key.push(amr);
});
for( var i=key.length-1;i>=0;i--) soundlist[key[i]]=soundlist2[key[i]];
  // soundlist.reverse();//按时间先后
//console.log( soundlist );

function checkplay(){
   //console.log("定时检查，有无要播放的声音");
   var cachedplayedsound=window.localStorage.getItem("playedsound");
   for(var amr in soundlist){
      var exists=(cachedplayedsound+"").indexOf(amr);
        console.log( exists );
     if( exists==-1 ){
       //console.log(  amr +"未播放");
       playvoice_in_soundlist( amr );
     }else{
      //console.log(  amr +"已播放");
     }
   }
}//func



function playvoice_in_soundlist( amr ){
    if(audioruning==true)return;
    audioruning=true;
    console.log("播放 准备中"+soundlist[amr] );
  //播放soubdlist中的某个声音
  //创建一个frame，并嵌入这个声音文件
var iframe=creatElement("uid",'iframe');
var html = 'Foo';
document.body.appendChild(iframe);
iframe.contentWindow.document.open();
iframe.contentWindow.document.write(html);
iframe.contentWindow.document.close();
iframe.name="iframe1";
iframe.src=soundlist[amr];
var alink=$("a:contains("+amr+")");
 $(alink)[0].scrollIntoView(false);
var speakername= $(alink).closest(".fr").find(".name").text();
//console.log( $(dst).length );
//console.log( $(dst).html() );

//iframe.allow="autoplay";
   //延时播放这个文件,等待文件加载完成，并记入已播放的文件列表
  //权限：chrome 点击网址前的小图标，网站设置，允许声音自动播放
  setTimeout(function doplay(){
 audio=$(iframe.contentWindow.document).find("audio")[0];
if( (audio!=undefined)&&(audio!=null)  ){

     audio.onended=function(){
            var cachedplayedsound=window.localStorage.getItem("playedsound");
            cachedplayedsound=(cachedplayedsound+"").replace(","+amr+",","");
            window.localStorage.setItem("playedsound",cachedplayedsound+","+amr+",");
           audioruning=false;
 //成绩记录
 $.get("http://127.0.0.1/rec.php?stuname="+speakername);
 //http://127.0.0.1/rec.php?stuname=%E5%AD%A3%E8%8A%82
/*
         <?php
date_default_timezone_set("PRC");//设置时区
$today = date("Y-m-dA ");
file_put_contents("score.txt", $_GET['stuname'].",$today\r\n",FILE_APPEND);
echo "ok"
?>
*/
           jtoast(speakername+"+5分",1000);
           console.log("播放 已结束*************"  );
       };
        audio.play();
       console.log("播放 xxx准备已结束"  );
  }else{
        console.log("播放组件未找到" );
  }
},2000);

}//////////
console.log( "已播放列表 "+window.localStorage.getItem("playedsound") );
//window.localStorage.setItem("playedsound","");

//定时检查，有无要播放的声音
var timer=setInterval(
   function(){
      checkplay()
   }
,3000);

//-------------------------------------------------------------------------------


})();