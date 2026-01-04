// ==UserScript==
// @name        Hacker News Dark Mode + QoL
// @namespace   https://git.arun.cloud/
// @description Dark mode for Hacker News
// @include     https://news.ycombinator.com/*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/439101/Hacker%20News%20Dark%20Mode%20%2B%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/439101/Hacker%20News%20Dark%20Mode%20%2B%20QoL.meta.js
// ==/UserScript==


(function () {
  var link = document.createElement( "style" );
  link.type = "text/css";
  link.innerText = `
  html {
    background-color: #1f2121 !important;
  }
  
  .pagetop, .pagetop *, .yclinks, .yclinks * {
    color: #ffffff !important;
  }
  
  tbody tr:nth-of-type(3) a, .storylink, .comment p, .comment span {
      color: #eeeeee !important;
  }

  #pagespace {
      display: block;
  }
  
  #hnmain > tbody > tr:nth-child(3) > td, #pagespace {
     background-color: #292929 !important;
  }
  
  #hnmain .itemlist tr.athing td.title:nth-of-type(1) {
     padding-left: 10px; !important;
  }
  
  #hnmain .itemlist tr.athing td.title:nth-of-type(3), 
  #hnmain .itemlist td.subtext {
     padding-left: 7.5px; !important;
  }

  #hnmain > tbody > tr:nth-child(1) > td {
      background-color: #ff5517 !important;
  }

  #hnmain > tbody > tr:nth-child(1), #hnmain > tbody, #hnmain {
      background-color: transparent !important;
  }

  .sitebit, .reply * {
      color: #828282 !important;
  }
  
  #hnmain > tbody > tr > td > table > tbody > tr > td.subtext > a:nth-child(7) {
      color: #E6C149 !important;
      font-weight: bold;
  }
  
  a.morelink {
    padding-left: 10px !important;
    padding-bottom: 10px; 
  }

  `

  document.getElementsByTagName('head')[0].appendChild(link);  
})();