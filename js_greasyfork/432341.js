// ==UserScript==
// @name         No Surf Constant Splash Reminder + Timer
// @author       bajspuss@reddit + sudface
// @version      0.2
// @description  Every time you navigate to websites such as Reddit, Youtube, TikTok, Facebook you will get a full-face splash saying "Are you sure you want to waste your time here?".
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @include      https://www.reddit.com/*
// @include      https://www.youtube.com/*
// @include      https://www.tiktok.com/*
// @include      https://www.facebook.com/*
// @include      https://twitter.com/*
// @noframes
// @namespace https://greasyfork.org/users/809510
// @downloadURL https://update.greasyfork.org/scripts/432341/No%20Surf%20Constant%20Splash%20Reminder%20%2B%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/432341/No%20Surf%20Constant%20Splash%20Reminder%20%2B%20Timer.meta.js
// ==/UserScript==

(function ()
{

// !!!!!!!!!!!! N O T I C E   M E !!!!!!!!!!!!!!

// !!!!!!!!!!!! N O T I C E   M E !!!!!!!!!!!!!!

// !!!!!!!!!!!! N O T I C E   M E !!!!!!!!!!!!!!

// This is a tampermonkey script.
  
// Change the below values to your liking.
// count is the countdown before the proceed button enables, in seconds.
    // Default Value = 5
// redirectsite is the site that the do something better button takes you to.
    // Note: The full link, including the http:// at the start must be present. Remember to enclose the whole link in quotation marks.
    // Default Value = "https://phys.libretexts.org/Bookshelves/Quantum_Mechanics/Book%3A_Introductory_Quantum_Mechanics_(Fitzpatrick)/"

// !!!!!!!!!!!! N O T I C E   M E !!!!!!!!!!!!!!

// !!!!!!!!!!!! N O T I C E   M E !!!!!!!!!!!!!!

// !!!!!!!!!!!! N O T I C E   M E !!!!!!!!!!!!!!

let $ = window.$;
  
var count = 5;
var redirectsite = "https://phys.libretexts.org/Bookshelves/Quantum_Mechanics/Book%3A_Introductory_Quantum_Mechanics_(Fitzpatrick)/"

$("head").append(`<style>
#fullscreen-overlay {
    display: visible;
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 1);
    z-index: 999999999;
}
.centertext
{
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-family: sans-serif;
  font-size: 50px;
  color: #fff;
}
button.btn {
    height: 42px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border: none;
    border-radius: 8px;
}
button.no {
    width: 50%;
    margin-left: 5%;
    background-color: #4CAF50; /* Green */
    color: white;
}
button.no:hover {
    color: #4CAF50;
    background-color: white;
}
button.yes {
    width: 10%;
    margin-right: 5%;
    background-color: rgba(0, 0, 0, 1);
    color: #f44336;
}
button.yes:hover {
    color: rgba(0, 0, 0, 1);
    background-color: #f44336;
}
button.yes:disabled:hover {
    background-color: rgba(0, 0, 0, 1);
    color: #f44336;
}
</style>`);

let [w, h] = [, window.innerHeight];
$("body").append(`<div id="fullscreen-overlay">
<div class="centertext">
Are you sure you want to waste your time here?
<br>
<button id="keeponsite" class="yes btn" disabled>yes (<span id="countdowntimer"></span>)</button>
<button id="quit" class="no btn">No I'll do something better.</button>
</div>
</div>`);

var spn = document.getElementById("countdowntimer");
var btn = document.getElementById("keeponsite");

var timer = null;  // For referencing the timer

(function countDown(){
  // Display counter and start counting down
  spn.textContent = count;

  // Run the function again every second if the count is not zero
  if(count !== 0){
    timer = setTimeout(countDown, 1000);
    count--; // decrease the timer
  } else {
    // Enable the button
    btn.removeAttribute("disabled");
  }
}());

$("#keeponsite").click((e) => {
    $("#fullscreen-overlay").css("display", "none");
    console.log('ignoring');
});

$("#quit").click((e) => {
    window.location.href = redirectsite;
    console.log('bye');
});

window.addEventListener('popstate', () => {
    $("#fullscreen-overlay").css("display", "visible");
});

window.addEventListener('hashchange', () => {
    $("#fullscreen-overlay").css("display", "visible");
});
})()