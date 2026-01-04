// ==UserScript==
// @name JandanTucaoFloat
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description A new userstyle
// @author Tareo
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://jandan.net/*
// @downloadURL https://update.greasyfork.org/scripts/444942/JandanTucaoFloat.user.js
// @updateURL https://update.greasyfork.org/scripts/444942/JandanTucaoFloat.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://jandan.net/")) {
  css += `
  .jandan-tucao{
      background-color:#2b2b2b !important;
      width:30%;max-height:85%;
      position:fixed; top:5%; left:59.8%;
      Z-index:500;
      padding:3px !important;
      padding-right:0px !important;
      overflow-y:scroll;
      overflow-x:hidden;
      border-radius:20px;
      border:2px #0000004a solid !important;
      box-shadow: 0px 0px 20px 20px #1a171169;
  /*     scrollbar-face-color: #333; */
  }

  ::-webkit-scrollbar {
      width:5px;
      height:1%;
  }

  ::-webkit-scrollbar-thumb{
      background:#997c32;
      border-radius:5px;
  /*     box-shadow: 1px 1px 10px rgb(159, 140, 77) !important; */    
  }


  .tucao-hot{
      border-radius:20px;
      background:#666 !important;
  }
  .tucao-hot-title{
      position:sticky;top:5px;
      border-radius:20px;
      background:#888 !important;
  }
  .tucao-list{
      border-radius:20px;
      background-color:#444;
      margin:1%
  }
  .jandan-tucao-close{
      position:sticky;
      bottom:2px;
      margin-right:5px;
  }
  .jandan-tucao-more{
      margin:1%;
      border-radius:10px;
  }
  .tucao-form{
      padding:3%;
      background:#1f1f1f;
      border-radius:20px;
      margin:1%;
  }
  .tucao-content{
      width:100% !important;
      border-radius:20px;
  }
  .tucao-form button{
      border-radius:20px;   
  }
  #tucao-gg{
      display:none !important;
  }
  #box{
      display:none;
  }





  `;
}
if (location.href.startsWith("https://jandan.net/")) {
  css += `
  [id^="comment"]{
      border-radius:20px;
      margin-top:10px !important;
  }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
