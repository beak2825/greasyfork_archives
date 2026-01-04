// ==UserScript==
// @name        Jira time entry helper
// @namespace   Mathema
// @description Allows entering the time as h:mm, hmn or hhmm. Also changes the background, depending on the entered time validating or not.
// @version     1
// @grant       none
// @include     https://jira.*/*
// @run-at      document-idle
// @license     BSD-2-Clause
// @downloadURL https://update.greasyfork.org/scripts/463732/Jira%20time%20entry%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/463732/Jira%20time%20entry%20helper.meta.js
// ==/UserScript==


/* Copyright (c) 2023 Moritz Strübe / MATHEMA GmbH.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the 
       documentation and/or other materials provided with the distribution.

		THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
    LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
    HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
    LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
    OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


function validateDatetime(inputField) {
    var v = inputField.value;
    var canFormat = /^\d\d\d\d?$/.test(v);
  	

    if (canFormat) {
      if(v.length === 3) {
        v = 0 + v;
      }
      v = v.substring(0,2) + ":" + v.substring(2);
      inputField.value = v;
    }   
  
  	if(/^\d\:d\d$/.test(v)) {
      v = "0" + v;
    }
  
    var isValid = /^\d\d\:\d\d$/.test(v);
  	
    if(isValid) {
      inputField.style.backgroundColor = '#bfa';
    } else {
      inputField.style.backgroundColor = '#fba';
    }
  }

function registerTimes() {
  const inp = document.getElementsByTagName('input');
  for(var key in inp){
    if(typeof inp[key].name === "undefined") continue;
    if(! inp[key].name.includes("Time"))continue;
    if(inp[key].classList.contains('jira-time-listener-23434')) continue;
      
    inp[key].addEventListener('blur', function(event) {
      var targ = event.target || event.srcElement;
      validateDatetime(targ);
    });
    inp[key].classList.add('jira-time-listener-23434');
    
    
  };
}

var myTimer = setInterval(registerTimes, 1000);


