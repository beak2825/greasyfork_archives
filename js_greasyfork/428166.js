// ==UserScript==
// @name              Presto Fix
// @namespace         Violentmonkey Scripts
// @match             *://192.168.1.182/*
// @exclude           *://192.168.1.182/inventory/Aspx2/MainMenu.aspx
// @grant             none
// @run-at            document-end
// @description       *://192.168.1.182/*
// @version 0.0.1.20210619070826
// @downloadURL https://update.greasyfork.org/scripts/428166/Presto%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/428166/Presto%20Fix.meta.js
// ==/UserScript==

function heightfix() {
  var x = document.getElementsByTagName("iframe");
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].style.height = (document.documentElement.clientHeight - 2) + 'px';
  }
  document.getElementById('frmbottom').style.height = (document.documentElement.clientHeight - 10) * 0.89 + 'px';
}

heightfix();
window.addEventListener('resize', heightfix);


//   }


// var scriptNode = document.createElement ("script");
// scriptNode.appendChild(document.createTextNode('('+ body_onload +')();'));
// document.body.appendChild (scriptNode);




// var ResizeFramesFix =ResizeFrames;
// 
// document.addEventListener("DOMContentLoaded", function() {
//   function ResizeFramesFix() {
//       document.getElementById('tblMain').style.height = (document.body.clientHeight - 10) + 'px';
//   }
//
// });







//function ResizeFrames() {
//	document.getElementById('tblMain').style.height = (document.documentElement.clientHeight - 10) + 'px';
//}
//
//window.onresize = ResizeFrames;
//window.onload = ResizeFrames;

