// ==UserScript==
// @name            Download MP3
//
// @include         http://www.youtube.com/*
// @include         https://www.youtube.com/*
// @include         https://music.youtube.com/*
//
// @version         1.0.2
//
// @run-at          document-end
// @unwrap
// @namespace https://greasyfork.org/users/651022
// @description Private YouTube to MP3 download
// @downloadURL https://update.greasyfork.org/scripts/406152/Download%20MP3.user.js
// @updateURL https://update.greasyfork.org/scripts/406152/Download%20MP3.meta.js
// ==/UserScript==

var mp3_button_onclick = function (){
    let addr = window.location.href.replace("music.", "www.")
    const amp = addr.indexOf("&");
    if(amp != -1){
        addr = addr.substring(0, amp);
    }
  var path ='http://35.196.86.19/?url='+encodeURIComponent(addr);
  // window.open(path,'_blank');
    window.open(path,'Download');
};

var getSpan = function(text, className) {
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
    if(document.querySelector('.youtube320-css'))return;
    var head = doc.getElementsByTagName('head')[0];
    if (!head) {return; }
    var style = doc.createElement('style');
    style.id = 'youtube320-css';
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
      #youtube320.youtube-watch{padding-top:10px;overflow: auto;}
      #youtube320 .mp3_button{background-color: #cc0000;border: #cc0000;border-radius: 2px;color: #FFF;padding: 10px 16px; font-size: 1.4em;cursor:pointer;display:inline-block}
      @media (min-width: 657px){youtube-watch[theater] #youtube320.youtube-watch{margin-right:24px}}
      end*/
    }.toString().replace("/*start",'').replace("end*/",'').slice(14,-1);
    this.addGlobalStyle(document, css);
  },
}

var createButton = function() {
    var obj = document.querySelector('#primary-inner>#info');
    if(obj == null){
        obj = document.getElementsByTagName("ytmusic-nav-bar")[0].children[1].children[0];
    }
    if(obj != null){
        // check if the button has already been created
        var btnRow = document.getElementById('youtube320');
        if(btnRow == null){
            myAppInterface.init()
            var youtube320 = document.createElement("div");
            youtube320.id = "youtube320";
            youtube320.className = "style-scope youtube-watch";

            var mp3_button = document.createElement("div");
            mp3_button.className = "style-scope mp3_button";

            mp3_button.appendChild(getSpan("Download MP3"))

            mp3_button.onclick = mp3_button_onclick;

            obj.parentNode.insertBefore(youtube320, obj);
            youtube320.appendChild(mp3_button);
        }
    }
};

var intervalCheck = setInterval(function(){ createButton() }, 250);
