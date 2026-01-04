// ==UserScript==
// @name         Clean Today News
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Make Tophub.today Experience Even Better
// @author       Cactus
// @match        https://tophub.today
// @icon         https://www.google.com/s2/favicons?domain=tophub.today
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435479/Clean%20Today%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/435479/Clean%20Today%20News.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) {
    return;
  }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}

(function () {
  'use strict';
  var css = `
  div.bc-cc {
    background-color: #nav.css-1dbjc4n.r-18u37iz.r-1w6e6rj.r-ymttw5 {   display: none;    };
    background-color: #ffffff
  }
  
  div.kb-lb-ib-c {
    display: none;
  }
  
  div.kb-lb-ib-hb {
    display: none;
  }
  
  div.O-c.b.b-xc {
    display: none;
  }
  
  div.eb-fb {
    display: none;
  }
  
  div.c-d.c-d-e {
    background-color: #ffffff;
    text-transform: capitalize;
    margin-top: -70px;
  }
  
  div.cq {
    background-color: #444444;
    display: none;
  }
  
  /* Hide browser scrollbar */
  ::-webkit-scrollbar {
      display:none;
  }
  div.bc-tc {
    margin-top: -40px;
    display: none;
  }
  span.e {
    display: none;
  }
  div.alert.alert-warning {
    display: none;
  }
  div.scroller-status {
    display: none;
  }
  div.abcdefg {
    display: none;
  }
  
  div.Xc-ec-Zc.b.b-xc {
    background-color: transparent;
    padding-top: 120px
    
  }
  
  div.Zd-p-ae {
    display: none;
  }
  
  div.cc-dc-c {
    margin-right: -320px;
  }
  
  div.f.b-A.f-i {
    border-style: none;
  }
  
  div.Xc-ec-Yc {
    display: none;
  }
  
  h2.cc-dc-Cb {
    margin-right: -200px;
    font-size: 16px;
    font-weight: 700;
    font-style: normal
    
  }
  
  div.Xc-ec-L.b-L {
    font-weight: 700;
    font-style: normal;
  }
  
  tbody tr td {
    color: #ff0000;
  }
  
  div.Ib-T-L.b-L {
    display: none;
  }
  
  i.m-n {
    display: none;
  }
  
  td{
    border-style: none;
  }
  
`;
  addGlobalStyle(css);
})();