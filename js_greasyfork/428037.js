// ==UserScript==
// @namespace         https://greasyfork.org/vi/users/746430-popskids
 
// @name              âm nhạc
// @description       code mãu cho trang web
 
// @match             *://*/*

// @version 0.0.1.20210616105440
// @downloadURL https://update.greasyfork.org/scripts/428037/%C3%A2m%20nh%E1%BA%A1c.user.js
// @updateURL https://update.greasyfork.org/scripts/428037/%C3%A2m%20nh%E1%BA%A1c.meta.js
// ==/UserScript==
window.onload = function () {
  
  var seconds = 00; 
  var tens = 00; 
  var appendTens = document.getElementById("tens")
  var appendSeconds = document.getElementById("seconds")
  var buttonStart = document.getElementById('button-start');
  var buttonStop = document.getElementById('button-stop');
  var buttonReset = document.getElementById('button-reset');
  var Interval ;

  buttonStart.onclick = function() {
    
     clearInterval(Interval);
     Interval = setInterval(startTimer, 10);
  }
  
    buttonStop.onclick = function() {
       clearInterval(Interval);
  }
  

  buttonReset.onclick = function() {
     clearInterval(Interval);
    tens = "00";
    seconds = "00";
    appendTens.innerHTML = tens;
    appendSeconds.innerHTML = seconds;
  }
  
   
  
  function startTimer () {
    tens++; 
    
    if(tens <= 9){
      appendTens.innerHTML = "0" + tens;
    }
    
    if (tens > 9){
      appendTens.innerHTML = tens;
      
    } 
    
    if (tens > 99) {
      console.log("seconds");
      seconds++;
      appendSeconds.innerHTML = "0" + seconds;
      tens = 0;
      appendTens.innerHTML = "0" + 0;
    }
    
    if (seconds > 9){
      appendSeconds.innerHTML = seconds;
    }
  
  }
  

}