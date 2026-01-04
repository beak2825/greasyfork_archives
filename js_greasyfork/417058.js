// ==UserScript==
// @name         Webcamdarts statistics in english
// @name:fr      Webcamdarts statistiques en anglais
// @version      0.3
// @description  Webcamdarts redesign statistics english version
// @description:fr Webcamdarts statistiques version anglaise
// @author       Antoine Maingeot
// @match        https://www.webcamdarts.com/GameOn/Game/MatchResult/*
// @match        https://www.webcamdarts.com/GameOn/Game/MemberStats/*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_getValue
// @namespace    https://greasyfork.org/fr/users/505971-antoine-maingeot
// @require       https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js


// @downloadURL https://update.greasyfork.org/scripts/417058/Webcamdarts%20statistics%20in%20english.user.js
// @updateURL https://update.greasyfork.org/scripts/417058/Webcamdarts%20statistics%20in%20english.meta.js
// ==/UserScript==

//Creer un bouton pour enregistrer le résultat
// Create a new element

var logo = document.createElement("div");
logo.innerHTML = '<div id="container"><br><button id="goButton">Save match as image</button><br><br><div id="image"></div></div>';

// Get the reference node
var referenceNode = document.querySelector('.pbcontainer');

// Insert the new node before the reference node
referenceNode.after(logo);

  /*  function report() {
  let region = document.querySelector("body"); // whole screen
  html2canvas(region, {
    onrendered: function(canvas) {
      let pngUrl = canvas.toDataURL(); // png in dataURL format
      let img = document.querySelector(".full-game-result");
      img.src = pngUrl;

      // here you can allow user to set bug-region
      // and send it with 'pngUrl' to server
    },
  });
}

*/

 $("#goButton").click(function() {
        html2canvas($(".item"), {
          onrendered: function(canvas) {
            saveAs(canvas.toDataURL(), 'resultwda.png');
          }
        });
      });

      function saveAs(uri, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
          link.href = uri;
          link.download = filename;

          //Firefox requires the link to be in the body
          document.body.appendChild(link);

          //simulate click
          link.click();

          //remove the link when done
          document.body.removeChild(link);
        } else {
          window.open(uri);
        }
      }
//END fonction save as image

(function() {
    'use strict';
function addGlobalStyle(css) {
   var head, style;
   head = document.getElementsByTagName('head')[0];
   if (!head) { return; }
   style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML = css;
   head.appendChild(style);
}

//addGlobalStyle('#container {text-align:center;height:fit content;background: transparent;position: absolute;left:25%;right:25%;bottom:10%;}');
addGlobalStyle('.gr table{text-align:center;}');
addGlobalStyle('.gr table tbody td{color: #7D7D7D;border-left: 1px solid #7D7D7D;font-size: 0.9em;}');
addGlobalStyle('.gr table td{padding: 3px 3px;}');
addGlobalStyle('.full-game-result tr:nth-child(even){background: #525252;  border-bottom: 1px solid white; })');
addGlobalStyle('.full-game-result tr:nth-child(odd){background: #302E2E;  border-bottom: 1px solid white; })');
addGlobalStyle('.full-game-result td {text-transform: uppercase;min-width:150px;text-align: center;})');
addGlobalStyle('.full-game-result tr td {color: unset;text-align: right; font-weight:unset;})');
addGlobalStyle('.full-game-result tr td + td { color: white;font-weight:unset; width:150px;})');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > thead > tr{ color: white;font-weight:bolder; text-align:center;})');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table{ margin-left:20%;margin-right:20%;margin-top:2%;})');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > div > h2:nth-child(1){ color: white;font-weight:bolder; text-align:center;})');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(2)   { color: yellow;font-weight:bolder; text-align:center;})');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(2){ color: black;font-weight:bolder; text-align:center;})');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(3){ color: black;font-weight:bolder; text-align:center;})');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(1) > td:nth-child(2){ color: black;font-weight:bolder; text-align:center;})');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table {font-size:1.2em;border: 2px solid;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(6) > td:nth-child(3) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(6) > td:nth-child(3){   font-size:0.9em; font-variant-caps: all-petite-caps;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > thead > tr > th:nth-child(1){background: white;color: black;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > thead > tr > th:nth-child(2){background: white;color: black;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > thead > tr > th:nth-child(3){background: white;color: black;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody{border: solid 2px;border-color: white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > thead{border: solid 2px;border-color: white;}');

addGlobalStyle('.liteAccordion.dark .slide > div {background: #302e2e;}');

//addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(1) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(1) > td:nth-child(1) {color:#FFF;font-weight:bold;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(2) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(2) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(3) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(3) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(4) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(4) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(5) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(5) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(6) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(6) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(7) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(7) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(8) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(8) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(9) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(9) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(10) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(10) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(11) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(11) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(12) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(12) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(13) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(13) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(14) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(14) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(15) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(15) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(16) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(16) > td:nth-child(1) {color:#FFF;}');


addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2){border-right:1px solid;border-color:white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(2){border-right:1px solid;border-color:white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(3) > td:nth-child(2){border-right:1px solid;border-color:white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(4) > td:nth-child(2){border-right:1px solid;border-color:white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(5) > td:nth-child(2){border-right:1px solid;border-color:white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(6) > td:nth-child(2){border-right:1px solid;border-color:white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(7) > td:nth-child(2){border-right:1px solid;border-color:white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(8) > td:nth-child(2){border-right:1px solid;border-color:white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(9) > td:nth-child(2){border-right:1px solid;border-color:white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(10) > td:nth-child(2){border-right:1px solid;border-color:white;}');

addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(6) > td:nth-child(3) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(6) > td:nth-child(3) {padding-right: 10px;}');

addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(1) {background: white;color: black;font-weight:bolder;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(1) {background: white;color: black;font-weight:bolder;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(2) {background: white;color: black;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(1) > td:nth-child(2) {color: black;font-weight:bolder; text-align:center;}');

addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table{font-size:1.2em;border: 2px solid;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div{padding-top:10px;}');

addGlobalStyle('.leg-info {margin-top: 20px;margin-bottom: 20px;margin-left: 0%;border-color: black;font-weight: unset;text-align:center;white-space: nowrap;    display: table-row;  }');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2){background: #fff;  border: 1px solid white;white-space: nowrap })');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1){background: #fff;  border: 1px solid white;white-space: nowrap})');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(1),#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(1){padding-left:10px;padding-right:10px;min-width:fit-content;white-space: nowrap;background: #302E2E; color: white;font-weight:bolder; text-align:left;vertical-align: middle;}');
addGlobalStyle('#resultsGrid > div.k-grid-header > div > table > thead > tr {background: white;color:black;  border: 1px solid white;font-weight:bolder;})');

addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(2) > span {display:inline-flex;min-width:60px;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(3) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(4) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(5) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(6) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(7) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(8) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(9) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(10) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(11) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(12) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(13) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(14) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(15) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(16) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(17) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(18) > span {display:inline-flex;}');

addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(3) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(4) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(5) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(6) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(7) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(8) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(9) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(10) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(11) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(12) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(13) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(14) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(15) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(16) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(17) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(18) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody{line-height:250%;border-right: 1px solid;}');

addGlobalStyle('.dark.legstats table tbody td{border: 2px solid;border-color:#cac4c4;  empty-cells: hide;}');
addGlobalStyle('.leg-info {display: table;max-width: 97%;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > div > div > figcaption{zoom:0.99;}');
addGlobalStyle('#statsChart {zoom: 0.99;margin-top: 1%;}');
addGlobalStyle('.infobox.rounded.dark.title{ background: #302E2E;}');
addGlobalStyle('.infobox.dark{ background: #525252;}');
addGlobalStyle('body > div.content > div > div.sixteen.columns > div.rounded.dark.statsComments, body > div.band.footer{ display: none;}');
addGlobalStyle('.content {background: none;}');



})();
