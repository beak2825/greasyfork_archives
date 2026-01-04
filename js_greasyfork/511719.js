// ==UserScript==
// @name Safari Cleaner Gmail
// @namespace https://greasyfork.org/users/1377671
// @version 0.0.1.20241007042150
// @description A simplified and minimalist look to Gmail desktop
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/511719/Safari%20Cleaner%20Gmail.user.js
// @updateURL https://update.greasyfork.org/scripts/511719/Safari%20Cleaner%20Gmail.meta.js
// ==/UserScript==

(function() {
let css = `.zA {
    box-shadow: none !important;
    border-bottom-left-radius: 12px !important;
    border-bottom-right-radius: 12px !important;
    border-top-left-radius: 12px !important;
    border-top-right-radius: 12px !important;
    background: white !important;
    border: 1px solid #ffffff; !important;
}

.zA:hover {
    box-shadow: none !important;
    border: 1px solid #e8eaed; !important;
   
}

.aps {
    color: black;
    background: rgb(210, 227, 252) !important;
}

.btb {
    box-shadow: none !important;
}

.gb_Cc {
    display: none !important;
}

.zA>.PE.PF::before {
    background-color: clear !important;
    width: 0px !important;
}


.Nm .Nt {
    border-left: 0px solid #ffffff !important;
}

.WR.aeN {
    display: none !important;
}

.w-asV.aiw {
    background-color: white !important;
}

.bkL {
    background-color: white !important;
}

.bAw.bcf .brC-aT5-aOt-Jw:not(.brC-aMv-bta):not(.brC-aMv-auO) {
    background: #ffffff !important;
}


.Tm::-webkit-scrollbar, .aZ6::-webkit-scrollbar, .aiL::-webkit-scrollbar, .dOsDob::-webkit-scrollbar, .J-M::-webkit-scrollbar {
width: 10px !important;
height: 10px !important;
}


form.aJf {
    background-color: #F2F2F2 !important;
}


.Yb.bax {
    background-color: #F2F2F2 !important;
}

.z0>.L3 {

    background-color: #F2F2F2 !important;
    border-radius: 12px;
    height: 38px !important;
}

.iY {
    min-height: 64ex !important;
    min-width: 402px !important;
    position: static !important;
}

.nH.ao8 {
    height: 100% !important;
    width: 70% !important;
    margin: auto !important;
    padding-top: 10px !important;
}


.apf, .apb {
    display: none !important;
}


.apO {
    display: none !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
