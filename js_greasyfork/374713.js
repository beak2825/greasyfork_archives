// ==UserScript==
// @name FIT-UI-FIX
// @description A script to fix Progtest UI
// @include https://progtest.fit.cvut.cz/*
// @version  1
// @grant    none
// @run-at document-idle
// @namespace https://greasyfork.org/users/227869
// @downloadURL https://update.greasyfork.org/scripts/374713/FIT-UI-FIX.user.js
// @updateURL https://update.greasyfork.org/scripts/374713/FIT-UI-FIX.meta.js
// ==/UserScript==

/*

Author: "Jack Payne" admin[at]d3add3d.net


LICENSE

You are free to download and use this script in any browser extension or plugin that is made to run UserScripts.
You are free to modify and use this script but do not bug me if you modified the script and something stopped working.
You are required to make modifications, include this multi-line comment(license notice), rename the script and document what modifications you have made if you want to redistribute this script.
You are not allowed to sell this script, nor to use this script commercially.
You are not allowed to change anything in this multi-line comment.
You are not allowed to hold the author liable for any damages, injuries or any other consequences resulting from the use of this script.

*/

if(document.readyState == 'complete') {
  const elem = document.createElement("style");
  const node = document.createTextNode(
    `
    body {
      background: rgb(20, 20, 20);
    }
    
    body > table > tbody > tr > td {
      background: rgb(255, 191, 0);
    }
    
    .outBox {
      background: rgb(60, 60, 60);
      color: rgb(255, 191, 0);
      border: none;
    }
    
    .Cell, .lCell, .tCell, .rCell, .lbCell, .bCell, .ltCell, .rtCell, .lbCell, .rbCell, .ltbCell, .rtbCell, .lrbCell, .lrtCell, .tbCell, .lrCell, .lrtbCell, .mBox, .lBox, .rBox, .mtBox, .mbBox {
      background: rgb(60, 60, 60);
      color: rgb(255, 191, 0);
      border: none;
    }
    
    input, button, select, tr {
      font-size: 1rem;
    }
    
    .menuList {
      color: rgb(255, 191, 0);
    }
    
    .menuListDis {
      color: rgba(255, 191, 0, 0.5);
    }
    
    .hdrDis {
      color: rgb(20, 20, 20);
      background: rgb(255, 191, 0);
      height: auto;
      border: none;
    }
    
    table.header {
      background: rgb(255, 191, 0);
      color: rgb(20, 20, 20);
      border: none;
    }
    
    .ltbSepCell, .tbSepCell, .rtbSepCell {
      background: rgba(255, 191, 0, 0.5);
      color: rgb(20, 20, 20);
      border: none;
    }
    
    .but2 {
      color: rgb(0, 0, 0);
      background: rgba(255, 191, 0, 0.5);
      border: none;
    }
    
    .but2:hover {
      color: rgb(0, 0, 0);
      background: rgba(255, 191, 0, 1);
    }
    
    .but1 {
      padding: 0;
      color: rgb(0, 0, 0);
    }
    
    hr {
      border: 1px solid rgb(255, 191, 0);
    }
    
    input.std {
      background: rgb(255, 191, 0);
      color: rgb(0, 0, 0);
    }
    
    .updButton {
      background: rgba(255, 191, 0, 0.5);
      color: rgb(0, 0, 0);
      border: none;
      height: auto;
      cursor: pointer;
    }
    
    .updButton:hover {
      background: rgba(255, 191, 0, 1);
    }
    
    .outButton {
      padding: 0;
    }
    
    .butLink {
      color: rgb(0, 0, 0) !important;
    }
    
    .butLink:hover {
      color: rgb(0, 0, 0) !important;
    }
    
    .lrtbCell a {
      color: rgba(255, 191, 0, 0.5);
    }
    
    .lrtbCell a:hover {
      color: rgba(255, 191, 0, 1);
    }
    .ltbHalfSepCell, .tbHalfSepCell, .rtbHalfSepCell, .ltbFailSepCell, .tbFailSepCell, .rtbFailSepCell, .ltbOkSepCell, .tbOkSepCell, .rtbOkSepCell {
      color: rgb(0,0,0);
    }
    `
  );
  elem.appendChild(node);
  document.head.appendChild(elem);
}
