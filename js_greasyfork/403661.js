// ==UserScript==
// @name     Leetcode Timer
// @description:en Start a timer whenever a user loads a problem at Leetcode.com
// @version  1.2
// @grant    none
// @include	 *://*leetcode.com/problems/*
// @author   ketankr9
// @namespace https://greasyfork.org/users/564674
// @description Start a timer whenever a user loads a problem at Leetcode.com
// @downloadURL https://update.greasyfork.org/scripts/403661/Leetcode%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/403661/Leetcode%20Timer.meta.js
// ==/UserScript==

/*
 * Choose Either Option 1 or Option 2.
 * Option 1: The time starts from the moment you open a url and continues forever.
 * Option 2: The time starts from 0 every time you open a url and continues only till the window is open. Everytime you reload the window the timer will restart from 0.
 */
var option = 2; // Choose between 1 and 2

function countdownTimer() {
  var difference = +new Date() - startTime;
  var elapsed = "0";

  var parts = {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  };

  elapsed = Object.keys(parts)
    .map(part => {
    if (!parts[part]) return;
    return `${parts[part]} ${part}`;
  })
    .join(" ");
	
  document.getElementById("countdown").innerHTML = elapsed;
}

var f = function(div){
  
  if(option === 1){
    // Option 1: The time starts from the moment you open a url and continues forever.
    var q = document.URL.split("problems/");
    if(q.length != 2)	return null;
    q = q[1] + "time";
    console.log(q);
    if(localStorage.getItem(q) == null){
      localStorage.setItem(q, +new Date());
    }
    startTime = Date.parse(localStorage.getItem(q));
  }else{
  	// Option 2: The time starts every time you open a url and continues till the window is open.
  	startTime = new Date();
  }
  
  
  var el = document.createElement("div");
  el.className = "tool-item__2DCU";
  el.innerHTML = '<div id="countdown" style="font-size:20px;" ></div>';
  
  div.insertBefore(el, div.firstChild);
  

  setInterval(countdownTimer, 1000);
}

function waitForElementToDisplay(selector, time, f) {
  			var node = document.getElementsByClassName(selector);
        console.log(node);
        if(node.length > 0) {
          	console.log("Element Found");
            f(node[0])
            return;
        }
        setTimeout(function() {
            waitForElementToDisplay(selector, time, f);
        }, time);
    }

var startTime;
waitForElementToDisplay("btns__1OeZ", 1000, f);