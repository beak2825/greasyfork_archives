// ==UserScript==
// @name Viu.com Subtitle Caption Stylish
// @namespace http://userstyles.org
// @version 0.7
// @description This is to replace the subtitle / caption style using in Viu.com
// @author CY Fung
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://www.viu.com/ott/hk/zh-hk/vod/*
// @downloadURL https://update.greasyfork.org/scripts/429066/Viucom%20Subtitle%20Caption%20Stylish.user.js
// @updateURL https://update.greasyfork.org/scripts/429066/Viucom%20Subtitle%20Caption%20Stylish.meta.js
// ==/UserScript==

(function() {
let css = `







@font-face {
    font-family: 'cwTeXYen';
    src: url(https://fonts.gstatic.com/ea/cwtexyen/v3/cwTeXYen-zhonly.eot);
    src: url(https://fonts.gstatic.com/ea/cwtexyen/v3/cwTeXYen-zhonly.eot?#iefix) format('embedded-opentype'),
         url(https://fonts.gstatic.com/ea/cwtexyen/v3/cwTeXYen-zhonly.woff2) format('woff2'),
         url(https://fonts.gstatic.com/ea/cwtexyen/v3/cwTeXYen-zhonly.woff) format('woff'),
         url(https://fonts.gstatic.com/ea/cwtexyen/v3/cwTeXYen-zhonly.ttf) format('truetype');
  }
  @font-face {
    font-family: 'cwTeXHei';
    src: url(https://fonts.gstatic.com/ea/cwtexhei/v3/cwTeXHei-zhonly.eot);
    src: url(https://fonts.gstatic.com/ea/cwtexhei/v3/cwTeXHei-zhonly.eot?#iefix) format('embedded-opentype'),
         url(https://fonts.gstatic.com/ea/cwtexhei/v3/cwTeXHei-zhonly.woff2) format('woff2'),
         url(https://fonts.gstatic.com/ea/cwtexhei/v3/cwTeXHei-zhonly.woff) format('woff'),
         url(https://fonts.gstatic.com/ea/cwtexhei/v3/cwTeXHei-zhonly.ttf) format('truetype');
  }
  
  
  
  /**

    Extracted from

    @import url('https://fonts.googleapis.com/css?family=Noto+Sans');
    @import url(//fonts.googleapis.com/earlyaccess/notosanstc.css);
    @import url(//fonts.googleapis.com/earlyaccess/notosanssc.css);
    @import url(//fonts.googleapis.com/earlyaccess/notosansjp.css);
    @import url(//fonts.googleapis.com/earlyaccess/notosanskr.css);

  **/

  /* cyrillic-ext */
   
  
  
   
.viu-player .vjs-text-track-display.subtitles-bottom .vjs-text-track-cue[style*="text-align: center;"]>div{
  
      
      --scale: 2.15;
      --base-font-size:13.6233px;  
      
      --text-color:rgba(221, 221, 221, 0.863);
      --text-color:rgba(244, 244, 244, 1);
      
      
      --text-shadow-h-shadow: 0px;
      --text-shadow-v-shadow: 0px;
      --text-shadow-blur-radius: 1.7px;
      --text-shadow-color:rgb(0, 120, 255);
      --text-outline-color:rgb(0, 120, 255);
      
      --text-shadow: var(--text-shadow-color) var(--text-shadow-h-shadow) var(--text-shadow-v-shadow) var(--text-shadow-blur-radius);
      
      --text-font: 'Noto Sans TC','Noto Sans SC','Noto Sans JP','Noto Sans KR','Noto Sans',sans-serif;
      --font-weight:400;
      --letter-spacing: 0px;
      
      
      --text-shadow-black-outline: rgb(0, 120, 255);
      transform:none !important;
      
      text-shadow:
                                              var( --text-outline-color) -1px -1px 0,
                                              var( --text-outline-color) -1px 1px 0,
                                              var( --text-outline-color) 1px -1px 0,
                                              var( --text-outline-color) 1px 1px 0,
                                              var(  --text-shadow-color) 0 0 1.5px,
                                              var(  --text-shadow-color) 0 0 2px,
                                              var(  --text-shadow-color) 0 0 2.5px,
                                              var(  --text-shadow-color) 0 0 3px,
                                              var(  --text-shadow-color) 0 0 3.5px,
                                              var(  --text-shadow-color) 0 0 4px,
                                              var( --text-shadow-black-outline) -2px -2px 2px,
                                              var( --text-shadow-black-outline) 2px 2px 2px,
                                              var( --text-shadow-black-outline) 2px -2px 2px,
                                              var( --text-shadow-black-outline) -2px 2px 2px
                                              !important; 
      
      
      color: var(--text-color) !important;
      fill: var(--text-color)  !important;
      font-family: var(--text-font) !important;
      font-weight: var(--font-weight) !important;
      letter-spacing: var(--letter-spacing) !important; 
  } 
 body .viu-player .vjs-caption-display [id="2nd_subtitle"][style*="text-align: center;"]>div{
              
              
	background:transparent !important;
              
     --text-font: 'Noto Sans TC','Noto Sans SC','Noto Sans JP','Noto Sans KR','Noto Sans',sans-serif;
     font-family: var(--text-font) !important; 
              
              
      --text-shadow-color:rgba(50, 50, 50);
      --text-color:rgba(250,250,250,1);
      --text-shadow-black-outline: rgba(180, 180, 180);
      --text-outline-color:rgb(120, 120, 120);
              
      text-shadow: var( --text-outline-color) 0 0 3px,
                                              var(  --text-shadow-color) 0 0 10px,
                                              var(  --text-shadow-color) 0 0 10px 
                                              !important; 
              
      color: var(--text-color) !important;
      fill: var(--text-color)  !important;
     font-family: var(--text-font) !important; 
              transform:scale(1.25);
      --letter-spacing: 2px;
      letter-spacing: var(--letter-spacing) !important; 
}

.fp-play-now-watermark{
    display:none;
}










`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
