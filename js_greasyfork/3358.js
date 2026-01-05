// ==UserScript==
// @name          youtubepItvl
// @description   personal stylesheets css configurations for youtube
// @include       https://*youtube.com/*
// @include       http://*youtube.com/*
// @namespace     https://greasyfork.org/en/users/3561-lucianolll
// @namespace     https://openuserjs.org/users/lucianolll
// @namespace     http://userscripts-mirror.org/users/46776
// @grant     none
// @version     12
// @downloadURL https://update.greasyfork.org/scripts/3358/youtubepItvl.user.js
// @updateURL https://update.greasyfork.org/scripts/3358/youtubepItvl.meta.js
// ==/UserScript==
var confget={
adcod:function(){
	var doc=document,adc=doc.getElementById('watch-headline-title'); if(adc){
	var adcom=adc.getElementsByTagName('span')[0],cld=adcom.cloneNode(true);
	cld.textContent=cld.textContent.replace(/\//g,'-').replace(/\:/g,' -').replace(/\&/g,'y').replace(/[\\\|\(\)\[\]\{\}]/g,' ').replace(/Parte?\s/,'part ').replace(/\s{2,}/g,' ').replace(/^\s|\s$/g,'').replace(/\s\./g,'.');
	cld.style.cssText="border:none;font-family:Arial;font-size:17px;font-weight:700;color:#000000;text-shadow:.2px .3px 0 #306060;padding-left:5x;";
	adcom.parentNode.replaceChild(cld,adcom);cld=null;
	adc.ondblclick=function(){this.setAttribute('contentEditable','true');};
  }
}
};

var adstyle=function(){
	var doc=document,adstyle=doc.createElement('style');adstyle.setAttribute('name','itvl');adstyle.textContent=[
"body{background-image:none!important;background-color:rgb(236, 242, 234);}#content{background-color:rgb(236, 242, 234);}a:visited{border-bottom:1px dotted #007736;}#masthead a{font-size:12px;}#videosPofileVideos{max-width:800px;}a:visited img{outline:solid 2px #aaa0a0;}",
"#watch-related li,#watch-sidebar li,#video-sidebar li{margin:4px!important;padding:0px!important;}#video-sidebar .ux-thumb-wrap{height:99px;}#playlist-pane-container .video-thumb,#watch-sidebar .video-thumb,#video-sidebar .video-thumb,#pl-video-list .video-thumb{height:92px;width:130px;}#pl-video-list img{width:auto!important;}#playlist-pane-container a,#watch-sidebar a,#video-sidebar a{padding:0px!important;}.playnav-video-thumb .video-thumb,.thumb-wrapper,.yt-uix-simple-thumb-related{height:98px!important;}.video-list-item{height:76px;}#watch7-sidebar .video-thumb{height:75px;}.ux-thumb{height:70px;}",
"#watch-related .video-list-item{height:92px;margin-bottom:1px!important;}#watch-related .yt-uix-simple-thumb-wrap{height:92px;}span img{top:0!important;}#watch-header button{-webkit-filter:hue-rotate(180deg);-moz-filter:hue-rotate(180deg);filter:hue-rotate(180deg);background-image:linear-gradient(to top,#606060,red 100%)!important;}"
 ].join('');
	doc.getElementsByTagName('head')[0].appendChild(adstyle);
};

  addEventListener('load',confget.adcod(),adstyle(),false);