// ==UserScript==
// @name            FbTube mp3 converter
// @description     FbTube YouTube mp3 converter a website tool for mp3 converter and allows you to convert the YouTube Video to a mp3 with just one click.
// @icon            https://fbtube.biz/
//
// @author          Theveloper
// @namespace       https://fbtube.biz/
//
// @include         http://www.youtube.com/*
// @include         https://www.youtube.com/*
//
// @version         2.1
//
// @run-at          document-end
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/377912/FbTube%20mp3%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/377912/FbTube%20mp3%20converter.meta.js
// ==/UserScript==

easy_btn_onclick = function (){
  var path ='https://fbtube.biz/en.php?v='+encodeURIComponent(window.location);
  window.open(path,'_blank');
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
    this.insertGlobalCSS()
  },
  addGlobalStyle: function(doc, css) {
    if(document.querySelector('.fbtube-css'))return;
    var head = doc.getElementsByTagName('head')[0];
    if (!head) {return; }
    var style = doc.createElement('style');
    style.id = 'fbtube-css';
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
      #fbtube.ytd-watch{padding-top:10px;overflow: auto;border-bottom: 1px solid #eee;padding-bottom: 10px;}
      #fbtube .easy_btn{background-color: #FF0000;border: #FF0000;border-radius: 2px;color: #FFF;padding: 10px 16px; font-size: 1.4em;cursor:pointer;display:inline-block}
      #fbtube .easy_btn:hover{background-color: #a22a2a}
      @media (min-width: 657px){ytd-watch[theater] #fbtube.ytd-watch{margin-right:24px}}
      end*/
    }.toString().replace("/*start",'').replace("end*/",'').slice(14,-1);
    this.addGlobalStyle(document, css);
  },
}

createButton = function() {
    var obj = document.querySelector('#primary-inner>#info');
    if(obj != null){
        // check if the button has already been created
        var btnRow = document.getElementById('fbtubemp3converter');
        if(btnRow == null){
            myAppInterface.init()
            var fbtubemp3converter = document.createElement("div");
           fbtubemp3converter.id = "fbtubemp3converter";
            fbtubemp3converter.className = "style-scope ytd-watch";

            var easy_btn = document.createElement("div");
            easy_btn.className = "style-scope easy_btn";

            easy_btn.appendChild(getSpan("fbtube mp3 converter- DOWNLOAD"))

            easy_btn.onclick = easy_btn_onclick;

            obj.parentNode.insertBefore(fbtubemp3converter, obj);
            fbtubemp3converter.appendChild(easy_btn);
        }
    }
};

// yt does make use of some bogus AJAX functionality which breaks pagemod
// we have to check in intervals if the document has been replaced by yt to
// recreate the button if needed.
var intervalCheck = setInterval(function(){ createButton() }, 250);
