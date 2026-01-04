// ==UserScript==
// @name        E-Hentai Display and Highlight Tag with Thumbnail
// @namespace   E-Hentai_Display_Tag_with_thumb
// @supportURL  https://github.com/zhuzemin
// @description E-Hentai 显示并高亮Tag在缩略图模式
// @include     https://exhentai.org/
// @include     https://e-hentai.org/
// @include     https://exhentai.org/?*
// @include     https://e-hentai.org/?*
// @include     https://exhentai.org/tag/*
// @include     https://e-hentai.org/tag/*
// @include     https://exhentai.org/#E-Hentai_Display_Tag_with_thumb
// @include     https://e-hentai.org/#E-Hentai_Display_Tag_with_thumb
// @version     1.6
// @grant       GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @run-at      document-start
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @connect-src e-hentai.org
// @connect-src exhentai.org
// @downloadURL https://update.greasyfork.org/scripts/394241/E-Hentai%20Display%20and%20Highlight%20Tag%20with%20Thumbnail.user.js
// @updateURL https://update.greasyfork.org/scripts/394241/E-Hentai%20Display%20and%20Highlight%20Tag%20with%20Thumbnail.meta.js
// ==/UserScript==
var config = {
  'debug': false
}
var debug = config.debug ? console.log.bind(console)  : function () {
};

  // setting User Preferences
  function setUserPref(varName, defaultVal, menuText, promtText, sep){
    GM_registerMenuCommand(menuText, function() {
      var val = prompt(promtText, GM_getValue(varName, defaultVal));
      if (val === null)  { return; }  // end execution if clicked CANCEL
      // prepare string of variables separated by the separator
      if (sep && val){
        var pat1 = new RegExp('\\s*' + sep + '+\\s*', 'g'); // trim space/s around separator & trim repeated separator
        var pat2 = new RegExp('(?:^' + sep + '+|' + sep + '+$)', 'g'); // trim starting & trailing separator
        //val = val.replace(pat1, sep).replace(pat2, '');
      }
      //val = val.replace(/\s{2,}/g, ' ').trim();    // remove multiple spaces and trim
      GM_setValue(varName, val);
      // Apply changes (immediately if there are no existing highlights, or upon reload to clear the old ones)
      //if(!document.body.querySelector(".THmo")) THmo_doHighlight(document.body);
      //else location.reload();
    });
  }
  
  // prepare UserPrefs
  setUserPref(
  'tags',
  'chinese;',
  'Set tags',
  `Set tags, split with ";". Example: "mmf threesome; chinese"`,	  
  ','
  );


CreateStyle=function(){
  debug("Start: CreateStyle");
  var style=document.createElement("style");
  style.setAttribute("type","text/css");
  style.innerHTML=`
.glowbox {
     background: #4c4c4c; 
    //width: 400px;
    margin: 40px 0 0 40px;
    padding: 10px;
    -moz-box-shadow: 0 0 5px 5px #FFFF00;
    -webkit-box-shadow: 0 0 5px 5px #FFFF00;
    box-shadow: 0 0 5px 5px #FFFF00;
}
`;
  debug("Processing: CreateStyle");
  var head=document.querySelector("head");
  head.insertBefore(style,null);
  debug("End: CreateStyle");
}
class Gallery{
  constructor(href) {
    this.method = 'GET';
    this.url = href;
    this.headers = {
      'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
      'Accept': 'application/atom+xml,application/xml,text/xml',
      'Referer': window.location.href,
    };
    this.charset = 'text/plain;charset=utf8';
  }
}
var init = function () {
  var LastDivNum=0;
  var tags=[];
  var FirstRun=true;
  try{
    tags=GM_getValue("tags").split(";");
  }catch(e){
    debug("Not set tags.");
  }
  CreateStyle();
  setInterval(function(){
  var divs = document.querySelectorAll('div.gl1t');
  if(window.location.href.includes("#E-Hentai_Display_Tag_with_thumb")&&FirstRun){
      LastDivNum=0;
      FirstRun=false;
  }
  if(LastDivNum<divs.length){
  for (var i = LastDivNum; i < divs.length; ++i) {
    (function (div) {
      var taglist=document.createElement("div");
      taglist.setAttribute("id","taglist");
      taglist.style.height=299;
      taglist.style.weight=266.85;
      div.insertBefore(taglist, null);
      var href = div.querySelector('a').href;
      debug(href);
      var gallery = new Gallery(href);
      GM_xmlhttpRequest({
        method: gallery.method,
        url: gallery.url,
        headers: gallery.headers,
        overrideMimeType: gallery.charset,
        //synchronous: true
        onload: function (responseDetails) {
          debug(responseDetails);
          var galleryHtml = new DOMParser().parseFromString(responseDetails.responseText, "text/html");
          debug(galleryHtml);
          taglist = galleryHtml.querySelector('#taglist');
          var links=taglist.querySelectorAll("a");
            for(var link of links){
          for(var tag of tags){
            debug("Highlight: "+tag);
            if(tag.length>1){
              if(link.innerText==tag.trim()){
                link.parentNode.className +=" glowbox";
              }
            }
            }
          }
          div.replaceChild(taglist,div.querySelector("#taglist"));
        }
      });
    }) (divs[i]);
  }
    LastDivNum=divs.length;
    
  }
  }, 2000);

}
window.addEventListener('DOMContentLoaded', init);
