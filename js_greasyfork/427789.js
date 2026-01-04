// ==UserScript==
// @name        咪咕音乐全部歌曲含付费专辑、网易云低音质歌曲下载
// @namespace   MQloki
// @match       https://music.migu.cn/v3/music/song/*
// @match       https://music.migu.cn/v3/music/order/download/*
// @match       https://music.163.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@10.16.6/dist/sweetalert2.all.min.js
// @grant       可下载咪咕音乐网所有音乐，包含付费专辑
// @version     1.4.2
// @author      MQloki
// @description 可下载咪咕音乐网所有音乐，包含付费专辑,网易云音乐仅为测试功能，暂时只能下载最低音质，且无法下载付费专辑。
// @license      AGPL License
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @home-url     https://greasyfork.org/zh-CN/scripts/427789
// @grant        GM_cookie
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/427789/%E5%92%AA%E5%92%95%E9%9F%B3%E4%B9%90%E5%85%A8%E9%83%A8%E6%AD%8C%E6%9B%B2%E5%90%AB%E4%BB%98%E8%B4%B9%E4%B8%93%E8%BE%91%E3%80%81%E7%BD%91%E6%98%93%E4%BA%91%E4%BD%8E%E9%9F%B3%E8%B4%A8%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/427789/%E5%92%AA%E5%92%95%E9%9F%B3%E4%B9%90%E5%85%A8%E9%83%A8%E6%AD%8C%E6%9B%B2%E5%90%AB%E4%BB%98%E8%B4%B9%E4%B8%93%E8%BE%91%E3%80%81%E7%BD%91%E6%98%93%E4%BA%91%E4%BD%8E%E9%9F%B3%E8%B4%A8%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

// 1.4.2 修正了网易云音乐无法正常生成解析按钮的问题。
// 1.4 新增网易云解析下载
// 1.3 更新了图标，下载文件名格式更新。
// 1.1 直接下载文件；下载图标修改。
// 1.0 基础功能实现。


(function() {


  //去下载界面
var currentURL = window.location.href;
var url = String(currentURL);
var music_html = " style='cursor:pointer;z-index:98;display:block;width:30px;height:30px;line-height:30px;position:fixed;left:0;top:450px;text-align:center;'><img src='https://greasyfork.org/packs/media/images/blacklogo96-b2384000fca45aa17e45eb417cbcbb59.png' title='点击下载歌曲' style='width:50px' ></div>";

if(currentURL.search(/music.migu.cn\/v3\/music\/song/)>=0){
  let btn=document.createElement("button");
  btn.textContent = "歌曲解析";
	btn.style.width = "113px";
btn.style.height = "40px";
btn.style.color = "#000";
btn.style.background = "#f2f2f2";
btn.style.borderRadius = "22px";
btn.style.border = "none";
btn.style.fontSize = "16px";
btn.style.cursor = "pointer";
btn.style.color = "inherit";
btn.onclick=function(){
    //code
  var ext = url.indexOf("song/"); 
     var acz = url.substring(ext+5);//取歌曲ID
   var nrwurl = "https://music.migu.cn/v3/music/order/download/" + acz;//拼接url
 window.location.href = nrwurl;//打开音质选择界面
}
  let share=document.querySelector('.operate_btn');
share.parentElement.insertBefore(btn,share);//按钮生成
}
  //选择音质并下载
  if(currentURL.search(/music.migu.cn\/v3\/music\/order\/download/)>=0){ 	
    var music_id = Math.ceil(Math.random()*100000000);//下载按钮随机ID  
  music_html = "<div href='javascript:void(0)' id="+music_id+music_html
			$("body").append(music_html);
	$("#"+music_id).click(function(){
    var div=document.getElementById('J_song_type'); 
var ul=div.childNodes; 
var lis,nul,cba,ccc; 
for(var i=0;i<ul.length;i++){ 
  nul=div.childNodes.item(i)
  lis=nul.childNodes; 
  if (lis.length > 0)
  {
    cba = lis.item(0).innerHTML; 
  }
  ccc = String(cba);
if (ccc.match("cf-xuanzhong")!=null) break;
}
            var sj = ul[i].getAttribute("data-info");
    //下载url处理
  var durl = sj.match(/((ftp:\/\/218.200.160.122:21\/).*?")/);
    durl = "https://freetyst.nf.migu.cn/" + durl[0];
    durl = durl.replace("ftp://218.200.160.122:21/","");
    durl = durl.replace("\"","");
    //下载文件名处理
    //演唱者
       var zuoz = sj.match(/(("singerName":").*?")/);
    zuoz = zuoz[0]
    zuoz = zuoz.replace("\"singerName\":\"",".");
    zuoz = zuoz.replace("\"","");
    //歌曲名
    var musicName = sj.match(/(("productName":").*?")/);
    musicName = musicName[0]
    musicName = musicName.replace("\"productName\":\"","");
    musicName = musicName.replace("\"","");
    //音质
     var musicPz = ccc.match(/((<\/i>).*?：)/);
    musicPz = musicPz[0]
    musicPz = musicPz.replace("<\/i>","");
   musicPz = musicPz.replace("：","");
    //文件后缀
    var fileName = durl.substring(durl.lastIndexOf(".") + 1);
    
    var saveName = zuoz+"_" + musicName +"_"+musicPz+ "."+ fileName
GM_download(durl, saveName)
    
 
  }) 		
  }
  
 if(currentURL.search(/music.163.com\/#\/song/)>=0) eucd();

  
    window.onhashchange = function () {
   currentURL = window.location.href;
url = String(currentURL);
       if(currentURL.search(/music.163.com\/#\/song/)>=0) eucd();
};

  function eucd(){
     //网易云低音质解析
  //原文：www.cnblogs.com/melodyjerry/p/13579654.html
    var music_id = Math.ceil(Math.random()*100000000);//下载按钮随机ID
  music_html = "<div href='javascript:void(0)' id="+music_id+music_html
				$("body").append(music_html);
    $("#"+music_id).click(function(){
  var songID = currentURL.substring(url.lastIndexOf("=") + 1);
  var durl = "http://music.163.com/song/media/outer/url?id="+songID;
  window.location.href = durl;
})
    }
  
})()