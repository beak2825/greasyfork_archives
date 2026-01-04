// ==UserScript==
// @name            Youtube Downloader
// @description     This extension add a download tab button on any Youtube page and allows you to download MP3 & Video with just one click (4K Ultra High Definition Supported).
// @icon            https://www.vevioz.com/images/icon.png
//
// @author          Community.vevioz.com
// @namespace       https://community.vevioz.com
//
// @license         GPLv3 - https://www.gnu.org/licenses/gpl-3.0.txt
// @copyright       Copyright (C) 2020, by Community.vevioz.com
// @include         https://www.youtube.com/*
// @include         https://www.youtube.com/*
//
// @version         2.7
//
// @run-at          document-end
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/375226/Youtube%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/375226/Youtube%20Downloader.meta.js
// ==/UserScript==

dwld_btn_onclick = function (){
  var path ='https://addons.vevioz.com/?id='+encodeURIComponent(getYT(window.location));
  window.open(path,'_blank');
};

getYT = function(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = String(url).match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
};
getSpan = function(text, className) {
    var _tn = document.createTextNode(text);
    var span = document.createElement("span");
    span.className = className;
    span.appendChild(_tn);
    return span;
};
var myAppInterface = {
  init:function(){
    this.insertGlobalCSS();
  },
  addGlobalStyle: function(doc, css) {
    if(document.querySelector('.easy-youtube-mp3-css'))return;
    var head = doc.getElementsByTagName('head')[0];
    if (!head) {return; }
    var style = doc.createElement('style');
    style.id = 'easy-youtube-mp3-css';
    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  },
  insertGlobalCSS: function(){
    var css = function (){
      /*start
      #downloadyoutubemp3.ytd-watch{padding-top:10px;overflow: auto;padding-bottom: 10px;}
      #downloadyoutubemp3 .dwld_btn{background-color: #f16310;border: #f16310;border-radius: 2px;color: #FFF;padding: 10px 16px; font-size: 1.4em;cursor:pointer;display:inline-block}
      #downloadyoutubemp3 .dwld_btn:hover{background-color: #f16310}
      @media (min-width: 657px){ytd-watch[theater] #downloadyoutubemp3.ytd-watch{margin-right:24px}}
      end*/
    }.toString().replace("/*start",'').replace("end*/",'').slice(14,-1);
    this.addGlobalStyle(document, css);
  },
};

createButton = function() {
    var obj = document.querySelector('#sponsor-button');
    if(obj !== null){
        // check if the button has already been created
        var btnRow = document.getElementById('downloadyoutubemp3');
        if(btnRow === null){
            myAppInterface.init();
            var downloadyoutubemp3 = document.createElement("div");
            downloadyoutubemp3.id = "downloadyoutubemp3";
            downloadyoutubemp3.className = "style-scope ytd-watch";

            var dwld_btn = document.createElement("div");
            dwld_btn.className = "style-scope dwld_btn";

            dwld_btn.appendChild(getSpan("DOWNLOAD MP3"));

            dwld_btn.onclick = dwld_btn_onclick;

            obj.parentNode.insertBefore(downloadyoutubemp3, obj);
            downloadyoutubemp3.appendChild(dwld_btn);
        }
    }
};

// yt does make use of some bogus AJAX functionality which breaks pagemod
// we have to check in intervals if the document has been replaced by yt to
// recreate the button if needed.
var intervalCheck = setInterval(function(){ createButton();}, 250);