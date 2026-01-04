// ==UserScript==
// @name         yunxuexi-x2
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  yunxuexi-x2,2倍播放视频
// @author       You
// @match        *://hkxy.eavic.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427842/yunxuexi-x2.user.js
// @updateURL https://update.greasyfork.org/scripts/427842/yunxuexi-x2.meta.js
// ==/UserScript==

(
function() {
    'use strict';
   
setInterval(function () { 
  try {
document.getElementsByClassName("register-img")[0].click() 
  } catch (e) {

  }  
try {
document.getElementsByTagName('video')[0].playbackRate=1.2;  
  } catch (e) {

  }  
try {
$("video").get(0).play();
  } catch (e) {

  }  
try {
$("video").prop('muted', true);
  } catch (e) {

  }
   
       		
   


 }, 1000); 

})();
