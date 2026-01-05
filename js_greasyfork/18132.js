// ==UserScript==
// @name        DownloadBaiduMusic
// @author      Weiran Shen
// @description 解析百度音乐下载地址
// @namespace   DownloadBaiduMusic
// @include     http://music.baidu.com/song/*
// @icon        http://img.lenovomm.com/crawler@cluster-1/ams/fileman/img/icon/2013-08-07013655-_1375853815850_0843.png
// @encoding    utf-8
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/18132/DownloadBaiduMusic.user.js
// @updateURL https://update.greasyfork.org/scripts/18132/DownloadBaiduMusic.meta.js
// ==/UserScript==


var temp=$("a");
var songid;
for(i=0;i<temp.length;i++){
  if(temp[i].hasAttribute("data-btndata")){
    songid=temp[i].getAttribute("data-btndata").match(/\d+/)[0];
    break;
  }   
}

var targetTypes=["MP3", "FLAC"];
var targetRates=["320", ""];

var frameDiv=document.getElementsByClassName("song-info")[0];
var nextDiv=document.getElementsByClassName("info-holder clearfix")[0];
var newDiv=document.createElement("div");
newDiv.style.border="2px solid #3399FF";
newDiv.style.width="480px";
newDiv.style.paddingLeft="30px";
newDiv.style.margin="5px 0px 10px 0px";
newDiv.style.lineHeight="25px";
frameDiv.insertBefore(newDiv, nextDiv);

var span320=document.createElement("span");
span320.style.display="inline-block";
span320.style.minWidth="200px";
newDiv.appendChild(span320);
var linkSpan320=document.createElement("span");
linkSpan320.innerHTML="MP3/-";
span320.appendChild(linkSpan320);
var sizeSpan320=document.createElement("span");
sizeSpan320.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;-";
span320.appendChild(sizeSpan320);

var spanFLAC=document.createElement("span");
spanFLAC.style.display="inline-block";
spanFLAC.style.minWidth="200px";
newDiv.appendChild(spanFLAC);
var linkSpanFLAC=document.createElement("span");
linkSpanFLAC.innerHTML="FLAC/-";
spanFLAC.appendChild(linkSpanFLAC);
var sizeSpanFLAC=document.createElement("span");
sizeSpanFLAC.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;-";
spanFLAC.appendChild(sizeSpanFLAC);

for(i=0;i<targetTypes.length;i++){
  GM_xmlhttpRequest({
  "method": 'GET',
  "url": "http://music.baidu.com/data/music/fmlink?songIds="+songid+"&type="+targetTypes[i]+"&rate="+targetRates[i],
  "data": "",
  "headers": {"Content-Type": "application/x-www-form-urlencoded"},
  "onload": function(response) {
    var result=JSON.parse(response.responseText);
    var format=result.data.songList[0].format;
    var rate=result.data.songList[0].rate;
    var size=result.data.songList[0].size;
    var link=result.data.songList[0].songLink;
    if(rate==320){
      linkSpan320.innerHTML="<a href=\""+link+"\">MP3 / "+rate+"kbps"+"</a>";
      sizeSpan320.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;"+(size/1024/1024).toFixed(2)+"M";
    }
    else if(format=="flac"){
      linkSpanFLAC.innerHTML="<a href=\""+link+"\">FLAC / "+rate+"kbps"+"</a>";
      sizeSpanFLAC.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;"+(size/1024/1024).toFixed(2)+"M";
    }
  }
});
}

