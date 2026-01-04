// ==UserScript==
// @name         Tiny Titan's Mod
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  lol
// @author       You
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382344/Tiny%20Titan%27s%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/382344/Tiny%20Titan%27s%20Mod.meta.js
// ==/UserScript==

// input style
var el = document.getElementsByTagName('input');

for (var i = 0; i < el.length; i++) {
  var currentEl = el[i];
  currentEl.style.borderRadius = '1em'; // standard
  currentEl.style.MozBorderRadius = '1em'; // Mozilla
  currentEl.style.WebkitBorderRadius = '1em'; // WebKitww
  currentEl.style.color = "#000000";
  currentEl.style.border = "2px solid #000000";
  currentEl.style.backgroundColor = "#A9A9A9";
}

// select style
var el = document.getElementsByTagName('select');

for (var i = 0; i < el.length; i++) {
  var currentEl = el[i];
  currentEl.style.borderRadius = '1em'; // standard
  currentEl.style.MozBorderRadius = '1em'; // Mozilla
  currentEl.style.WebkitBorderRadius = '1em'; // WebKitww
  currentEl.style.color = "#000000";
  currentEl.style.border = "2px solid #000000";
  currentEl.style.backgroundColor = "#A9A9A9";
}

var Style1 = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-menu-icon, .hud-spell-icon, .hud-chat-messages, .hud-health-bar-inner, .hud-toolbar-building, .hud-ticker-bar, .hud-toolbar-item, .hud-shield-bar-inner, .custom_input');
for (var i = 0; i < Style1.length; i++) {
  Style1[i].style.borderRadius = '1em'; // standard
  Style1[i].style.MozBorderRadius = '1em'; // Mozilla
  Style1[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style1[i].style.color = "#A9A9A9";
  Style1[i].style.border = "2px solid #000000";
}

//Top Left Edit
var Style1 = document.querySelectorAll('.hud-intro-corner-top-left');
for (var i = 0; i < Style1.length; i++) {
  Style1[i].style.borderRadius = '1em'; // standard
  Style1[i].style.MozBorderRadius = '1em'; // Mozilla
  Style1[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style1[i].style.color = "#A9A9A9";
}

var css = '.hud-menu-settings { background: url(\'https://cdn-images-1.medium.com/max/1600/1*wGSPM4B4-2SvVeRU-3nlvg.gif\') }';
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);

var css = '.hud-menu-shop { background: url(\'https://cdn-images-1.medium.com/max/1600/1*wGSPM4B4-2SvVeRU-3nlvg.gif\') }';
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);

var css = '.hud-menu-party { background: url(\'https://cdn-images-1.medium.com/max/1600/1*wGSPM4B4-2SvVeRU-3nlvg.gif\') }';
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);

var IntroGuide = '';
IntroGuide += "<center><span>Give a big Thanks to Demo and I_HAVE_A_REALLY_LONG_NICKNAME and all of my Fams for making this Mod Possible!</span>";
IntroGuide += "<center><h3>Do you Like the Mod?</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"Yes!();\">Yes!</button>";
IntroGuide += "&nbsp;";
IntroGuide += "<button class=\"btn btn-red\" style=\"width: 45%;\" onclick=\"No!();\">No!</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Zombs.io Server Short Cuts!</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592411';\">Europe 1 My Dude ;D</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592406';\">Australia 1 My Dude ;D</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564836';\">Go Through Barrier Server ;D</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Name Short Cut!</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '๖ۣۜTɪᴎყ❥ƬiτΔᴎ';\">๖ۣۜTɪᴎყ❥ƬiτΔᴎ</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Symbols or Whatevers xD</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '[✧]';\">[✧]</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '✘';\">✘</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '⍻';\">⍻</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '๖ۣۜ';\">๖ۣۜ</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '␥';\">␥</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '✔';\">✔</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Long Names!</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'Titan is Savage xD';\">Long Name 1</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'Very Tiny Titan ;D';\">Long Name 2</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'Some Random Name';\">Long Name 3</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>No Name ;D</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '​';\">No Name</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Mod Lists that it can do!</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<span>It can Remove Ads!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>It Changes the Border and Color!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>Add Buttons and Short Cuts!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>It can Remove other Elements and do other things!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>It was Auto Revive and Evolver (For Pets)</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>It has Speed or how people call it Public Speed!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>It can Spam all Parties!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>IT EVEN HAS SERVER TELEPORTATION THAT HAS OVER 600 LINES!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>It has Auto Respawn!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>It also has Symbols too!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>It has Autoheal! (Even for Pet ;D)</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>It has Auto Filler too!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>It has Auto Fueler and Collector! (aka AHRC)</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>There is a Auto Pet Heal (and its actually real!)</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>To add to the script there is even Pet Information UID's and more!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>Background Changers and More!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>Also it Adds another hud-menu and its called Scripts! (note I can't add border sadly :/)</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>And Finally It has Public and Private Clicker!</span>";

document.getElementsByClassName('hud-intro-guide')[0].innerHTML = IntroGuide;

//Footer Things!
var IntroFooter = '';
IntroFooter += "<center><h3>This is Tiny Titan's Mod I hope you have a Awesome Experience on this Mod Adventure Enjoy the Mods! :D</h3>";

document.getElementsByClassName('hud-intro-footer')[0].innerHTML = IntroFooter;

//By: Tiny Titan
var IntroCornertopleft = '';
IntroCornertopleft += "<legend>By: ๖ۣۜƬɪᴎყ❥ƬɪτΔᴎ</legend>";

document.getElementsByClassName('hud-intro-corner-top-left')[0].innerHTML = IntroCornertopleft;

// Some Codes that Remove or do other Things
document.getElementsByClassName("hud-day-night-overlay")[0].remove();
document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 99);
document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 99);
document.getElementsByClassName("hud-intro-corner-bottom-left")[0].remove();
document.getElementsByClassName("hud-party-joining")[0].remove();
document.getElementsByClassName("hud-intro-corner-bottom-right")[0].remove();
document.getElementsByClassName("hud-respawn-corner-bottom-left")[0].remove();
document.getElementById('hud-menu-settings').style.width = "610px";
document.getElementById('hud-menu-settings').style.height = "525px";
document.getElementById('hud-menu-party').style.width = "620px";
document.getElementById('hud-menu-party').style.height = "530px";
document.getElementsByClassName('hud-intro-corner-top-right')[0].style.top = "-0.01px";
document.getElementsByClassName("hud-intro-play")[0].className = "bttn-dark";
document.getElementsByClassName('bttn-dark')[0].style.top = "10px";
document.getElementsByClassName('bttn-dark')[0].style.left = "-4.5px";

// Auto Revive and Evolver and Auto Respawn
setTimeout(() => {
 let elements = document.getElementsByClassName("hud-shop-actions-evolve");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 1);
}, 1);
setTimeout(() => {
 let elements = document.getElementsByClassName("hud-shop-actions-revive");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 1);
}, 1);

//Auto Respawn
setTimeout(() => {
 let elements = document.getElementsByClassName("hud-respawn-btn");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 1);
}, 1);

//Public Speed
var refreshIntervalId;

function start() {
  stop();
  refreshIntervalId = setInterval(function() {
    el = document.getElementsByClassName('hud-shop-actions-equip');

    for (var i = 0; i < el.length; i++) {
      var currentEl = el[i];
      currentEl.click();
    }
  }, 1); // Public Speed
}

function stop() {
  if (refreshIntervalId !== null) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
  }
}

// Spam Parties!
var refreshIntervalId2;

function start2() {
  stop2();
  refreshIntervalId2 = setInterval(function() {
    el = document.getElementsByClassName('hud-party-link');
    for (var i = 0; i < el.length; i++) {
      var currentEl = el[i];
      currentEl.click();
    }
    el = document.getElementsByClassName('btn btn-green hud-confirmation-accept');
    for (var i2 = 0; i2 < el.length; i2++) {
      var currentE0l = el[i];
      currentE0l.click();
    }
  }, 1); // Spam Speed
}

function stop2() {
  if (refreshIntervalId2 !== null) {
    clearInterval(refreshIntervalId2);
    refreshIntervalId2 = null;
  }
}
//Public Thing
var refreshIntervalId2;

function start3() {
  stop3();
  refreshIntervalId2 = setInterval(function() {
    el = document.getElementsByClassName('hud-party-visibility is-private');
    for (var i = 0; i < el.length; i++) {
      var currentEl = el[i];
      currentEl.click();
    }

    el = document.getElementsByClassName('hud-party-visibility');
    for (var i2 = 0; i2 < el.length; i2++) {
      var currentE0l = el[i];
      currentE0l.click();
    }
  }, 1); // Spam Speed
}

function stop3() {
  if (refreshIntervalId2 !== null) {
    clearInterval(refreshIntervalId2);
    refreshIntervalId2 = null;
  }
}

window.addEventListener("onkeydown", keyDown, true);
window.addEventListener("keydown", keyDown);

//KeyCodes!
function keyDown() {
  var e = window.event;
  switch (e.keyCode) {
    case 90:
      start();
      break;
    case 88:
      stop();
      break;
    case 187:
      start2();
      break;
    case 189:
      stop2();
      break;
    case 219:
      start3();
      break;
    case 221:
      stop3();
      break;
  }
}

//Teleporting OMFG!
var Settings = '';
Settings += "<center><h3>East</h3>";
Settings += "<hr style=\"color: rgba(255, 255, 255);\">";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618006';\">1</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618008';\">2</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618007';\">3</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618009';\">4</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618005';\">5</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618004';\">6</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618013';\">7</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618011';\">8</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618010';\">9</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618973';\">10</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618974';\">11</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618977';\">12</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618975';\">13</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618976';\">14</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618978';\">15</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618971';\">16</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618980';\">17</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618979';\">18</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618972';\">19</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618998';\">20</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619001';\">21</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618999';\">22</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619000';\">23</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618993';\">24</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619002';\">25</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618994';\">26</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618995';\">27</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618996';\">28</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618997';\">29</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619018';\">30</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619019';\">31</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619021';\">32</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619013';\">33</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619017';\">34</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619016';\">35</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619014';\">36</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619015';\">37</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619023';\">38</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619022';\">39</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619032';\">40</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619036';\">41</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619037';\">42</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619033';\">43</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619041';\">44</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619038';\">45</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619040';\">46</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619039';\">47</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619072';\">48</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619074';\">49</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619091';\">50</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619088';\">51</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619097';\">52</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619112';\">53</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619115';\">54</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619118';\">55</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619131';\">56</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619154';\">57</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619152';\">58</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619150';\">59</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619224';\">60</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619218';\">61</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619242';\">62</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619269';\">63</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619268';\">64</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619267';\">65</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619263';\">66</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619266';\">67</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564880';\">68</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564879';\">69</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564872';\">70</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564878';\">71</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564875';\">72</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564873';\">73</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564874';\">74</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564876';\">75</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564877';\">76</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564980';\">77</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564987';\">78</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564988';\">79</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564989';\">80</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564981';\">81</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564986';\">82</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564985';\">83</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564982';\">84</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564984';\">85</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564983';\">86</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9565002';\">87</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9565004';\">88</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9565001';\">89</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9565000';\">90</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9565006';\">91</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9565007';\">92</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564999';\">93</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9565003';\">94</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9565008';\">95</button>";
Settings += "<br><br>";
Settings += "<center><h3>West</h3>";
Settings += "<hr style=\"color: rgba(255, 255, 255);\">";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8617896';\">1</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8617899';\">2</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8617901';\">3</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8617902';\">4</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8617900';\">5</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8617898';\">6</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8617903';\">7</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8617897';\">8</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8617894';\">9</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8617895';\">10</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619645';\">11</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619658';\">12</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619675';\">13</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619702';\">14</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619723';\">15</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619721';\">16</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619719';\">17</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619717';\">18</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8619722';\">19</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564836';\">20</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564833';\">21</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564831';\">22</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564834';\">23</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564838';\">24</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564837';\">25</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564832';\">26</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564835';\">27</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564956';\">28</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564955';\">29</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564953';\">30</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564952';\">31</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564954';\">32</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564947';\">33</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564948';\">34</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564949';\">35</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564950';\">36</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564951';\">37</button>";
Settings += "<br><br>";
Settings += "<center><h3>Europe</h3>";
Settings += "<hr style=\"color: rgba(255, 255, 255);\">";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592411';\">1</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8593280';\">2</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8593285';\">3</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8593278';\">4</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8593284';\">5</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8593283';\">6</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594260';\">7</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594264';\">8</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594263';\">9</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594257';\">10</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594262';\">11</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594266';\">12</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594277';\">13</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594279';\">14</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594286';\">15</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594281';\">16</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594282';\">17</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594303';\">18</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594326';\">19</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594322';\">20</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594319';\">21</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594317';\">22</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594321';\">23</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594320';\">24</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8594318';\">25</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595153';\">26</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595157';\">27</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595161';\">28</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595162';\">29</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595160';\">30</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595158';\">31</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595155';\">32</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595156';\">33</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595154';\">34</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595159';\">35</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595174';\">36</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595173';\">37</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595172';\">38</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595175';\">39</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595178';\">40</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595177';\">41</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595180';\">42</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595171';\">43</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595176';\">44</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595188';\">45</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595186';\">46</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595193';\">47</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595738';\">48</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595757';\">49</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595751';\">50</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595763';\">51</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595765';\">52</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595772';\">53</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595766';\">54</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595784';\">55</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595785';\">56</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595780';\">57</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595794';\">58</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595790';\">59</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595793';\">60</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595795';\">61</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595839';\">62</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595842';\">63</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595843';\">64</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595845';\">65</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595844';\">66</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595873';\">67</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595866';\">68</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595867';\">69</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595869';\">70</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595875';\">71</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595872';\">72</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595870';\">73</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595915';\">74</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595911';\">75</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595919';\">76</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595920';\">77</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595918';\">78</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595916';\">79</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595912';\">80</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595914';\">81</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595913';\">82</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595925';\">83</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595926';\">84</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595932';\">85</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595931';\">86</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595928';\">87</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595930';\">88</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595933';\">89</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595944';\">90</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595946';\">91</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595952';\">92</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595943';\">93</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595948';\">94</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595945';\">95</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595947';\">96</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595951';\">97</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8595949';\">98</button>";
Settings += "<br><br>";
Settings += "<center><h3>Asia</h3>";
Settings += "<hr style=\"color: rgba(255, 255, 255);\">";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591882';\">1</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591919';\">2</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591921';\">3</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591918';\">4</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591920';\">5</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591922';\">6</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591914';\">7</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591917';\">8</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591916';\">9</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591936';\">10</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591934';\">11</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591930';\">12</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591931';\">13</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591933';\">14</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591937';\">15</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591938';\">16</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591948';\">17</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591945';\">18</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591947';\">19</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8591946';\">20</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592108';\">21</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592110';\">22</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592123';\">23</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592129';\">24</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592128';\">25</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592127';\">26</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592125';\">27</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592138';\">28</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592141';\">29</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592140';\">30</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592137';\">31</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592151';\">32</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592154';\">33</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592150';\">34</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592147';\">35</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592152';\">36</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592148';\">37</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592149';\">38</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592146';\">39</button>";
Settings += "<br><br>";
Settings += "<center><h3>Australia</h3>";
Settings += "<hr style=\"color: rgba(255, 255, 255);\">";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592406';\">1</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8593912';\">2</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8593913';\">3</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8593911';\">4</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8593910';\">5</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8593916';\">6</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8593915';\">7</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8609266';\">8</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8609268';\">9</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8609270';\">10</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8609263';\">11</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8609271';\">12</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8609267';\">13</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8609269';\">14</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v12397326';\">15</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v12397327';\">16</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v12397328';\">17</button>";
Settings += "<br><br>";
Settings += "<center><h3>South America</h3>";
Settings += "<hr style=\"color: rgba(255, 255, 255);\">";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8570835';\">1</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8570842';\">2</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8570834';\">3</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8570840';\">4</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8571969';\">5</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8571973';\">6</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8572478';\">7</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573052';\">8</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573057';\">9</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573054';\">10</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573091';\">11</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573096';\">12</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573090';\">13</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573094';\">14</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573092';\">15</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573104';\">16</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573102';\">17</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573101';\">18</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573103';\">19</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573109';\">20</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573100';\">21</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573108';\">22</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573106';\">23</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573105';\">24</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573107';\">25</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573133';\">26</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573134';\">27</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573132';\">28</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573139';\">29</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573135';\">30</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573138';\">31</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573140';\">32</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573136';\">33</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8573137';\">34</button>";
Settings += "<br><br>";
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8584685';\">35</button>";
Settings += "<br><br>";
Settings += "<hr style=\"color: rgba(166, 166, 166);\">";
Settings += "<center><h3>Note:</h3>";
Settings += "<br>";
Settings += "<span>THE SERVERS MAY CHANGE SO THE NUMBERS WILL NOT BE ACCURATE</span>";
Settings += "<span> AND MAY BE WRONG BUT IF THE NUMBERS ON EVERY SERVER OR ON A SERVER COMPLETELY CHANGES </span>";
Settings += "<span>THEN I WILL TRY TO UPDATE AS MUCH AS POSSIBLE!</span>";
Settings += "<hr style=\"color: rgba(179, 179, 179);\">";
Settings += "<center><h3>Info:</h3>";
Settings += "<br>";
Settings += "<span>ALSO DON'T EQUIP A PET BEFORE YOU TRY TO TELEPORT THIS TELEPORT</span>";
Settings += "<span> THING WILL BE GONE!</span>";
Settings += "<span> ALSO THE SCRIPT MAYBE BE BUGGY</span>";
Settings += "<hr style=\"color: rgba(191, 191, 191);\">";
Settings += "<center><h3>Bug List:</h3>";
Settings += "<br>";
Settings += "<span>May make your Evolve go on forever intil Max Level!</span>";
Settings += "<br>";
Settings += "<span>May make your Evolving go back about 7 levels so like on wave 47 the pet will be on Level 40!</span>";
Settings += "<br>";
Settings += "<span>Also with this it will may make your CARL or Woody be like (Level 1 pet) when its really like Level 45!</span>";
Settings += "<br>";
Settings += "<span>With Some of these bugs the Auto Pet Heal maybe not work but its ok it got Auto Revive and Evolver! :D</span>";
Settings += "<hr style=\"color: rgba(204, 204, 204);\">";
Settings += "<center><h3>Info:</h3>";
Settings += "<br>";
Settings += "<span>This maybe upgraded soon I don't know yet!</span>";
Settings += "<hr style=\"color: rgba(217, 217, 217);\">";

document.getElementsByClassName('hud-settings-grid')[0].innerHTML = Settings;

window.onload = function() { /* Wait for page to be loaded */
  let play = document.getElementsByClassName('btn btn-green hud-intro-play')[0]; /* Defining play button. */
  play.onclick = setTimeout(function() { /* When play button is clicked, start script. */
    var se = document.getElementsByClassName('hud-menu-settings')[0]; /* Defining some */
    var ep = document.getElementsByClassName('hud-shop-actions-equip')[0]; /* Variables. */
    ep.onclick = setInterval(function() {
      let health = Game.currentGame.ui.playerPetTick.health; /* Pet's health. */
      let tier = Game.currentGame.ui.playerPetTick.tier; /* Pet's tier */
      let level = Game.currentGame.ui.playerPetTick.experience; /* Pet's experience. (level) */
      let uid = Game.currentGame.ui.playerPetTick.uid; /* Pet's uid */
      let health2 = Game.currentGame.ui.playerTick.health; /* Player's health */
      let x = Game.currentGame.ui.playerTick.position.x; /* Player's x */
      let y = Game.currentGame.ui.playerTick.position.y; /* Player's y */
      let uid2 = Game.currentGame.ui.playerTick.uid; /* Player's UID */
      let lvl = Game.currentGame.ui.playerTick.level; /* Player's Level */
      let yaw = Game.currentGame.ui.playerTick.interpolatedYaw; /* Player's InterpolatedYaw */
      let wood = Game.currentGame.ui.playerTick.wood; /* Player's Wood */
      let stone = Game.currentGame.ui.playerTick.stone; /* Player's Stone */
      let time = Game.currentGame.world.network.pingCompletion; /* Time */
      let FPS = Game.currentGame.world.renderer.ticker.FPS; /* FPS */
      var ta = Game.currentGame.ui.playerPetTick.lastPetDamageTarget;
      var lastKill = Game.currentGame.world.entities[Game.currentGame.ui.playerPetTick.lastPetDamageTarget]; /* Entity of the last killed guy by CARL. */
      /* If CARL killed nobody */
      if (ta === 0) {
        se.innerHTML = "<center><h3>Pet Info:</h3>" + "</strong></br><code> Your pet's health: </code><strong>" + health + "</strong><strong> HP</strong></br><code> Your pet's tier: </code><strong> " + tier + " </strong></br><code> Your pet's level: </code><strong> " + Number(level / 100 + 1).toFixed(2) + "</strong></br><code> Last CARL's kill: </code><strong> " + "Nobody killed yet! (or the player killed left)" + "</strong></br><code> Your pet's uid: </code><strong> " + uid + "</strong><strong>" + "<center><h3>Player Info:</h3>" + "</strong></br><code> Player's Health: </code><strong> " + health2 + "</strong><strong>" + "</strong></br><code> Player's X Position: </code><strong> " + x + "</strong><strong>" + "</strong></br><code> Player's Y Position: </code><strong> " + y + "</strong><strong>" + "</strong></br><code> Player's UID: </code><strong> " + uid2 + "</strong><strong>" + "</strong></br><code> Player's Level: </code><strong> " + lvl + "</strong><strong>" + "</strong></br><code> Player's InterpolatedYaw: </code><strong> " + yaw + "</strong><strong>" + "</strong></br><code> Player's Wood: </code><strong> " + wood + "</strong><strong>" + "</strong></br><code> Player's Stone: </code><strong> " + stone + "</strong><strong>" + "<center><h3>Other Info:</h3>" + "</strong></br><code> Time: </code><strong> " + time + "</strong><strong>" + "</strong></br><code> FPS: </code><strong> " + FPS + "</strong><strong>"; /* Changing shop grid's innerHTML */
      }
      /* If CARL killed someone */
      if (ta !== 0) {
        se.innerHTML = "<center><h3>Pet Info:</h3>" + "</strong></br><code> Your pet's health: </code><strong>" + health + "</strong><strong> HP</strong></br><code> Your pet's tier: </code><strong> " + tier + " </strong></br><code> Your pet's level: </code><strong> " + Number(level / 100 + 1).toFixed(2) + "</strong></br><code> Last CARL's kill: </code><strong> " + lastKill.fromTick.name + "</strong></br><code> Your pet's uid: </code><strong> " + uid + "</strong><strong>" + "<center><h3>Player Info:</h3>" + "</strong></br><code> Player's Health: </code><strong> " + health2 + "</strong><strong>" + "</strong></br><code> Player's X Position: </code><strong> " + x + "</strong><strong>" + "</strong></br><code> Player's Y Position: </code><strong> " + y + "</strong><strong>" + "</strong></br><code> Player's UID: </code><strong> " + uid2 + "</strong><strong>" + "</strong></br><code> Player's Level: </code><strong> " + lvl + "</strong><strong>" + "</strong></br><code> Player's InterpolatedYaw: </code><strong> " + yaw + "</strong><strong>" + "</strong></br><code> Player's Wood: </code><strong> " + wood + "</strong><strong>" + "</strong></br><code> Player's Stone: </code><strong> " + stone + "</strong><strong>" + "<center><h3>Other Info:</h3>" + "</strong></br><code> Time: </code><strong> " + time + "</strong><strong>" + "</strong></br><code> FPS: </code><strong> " + FPS + "</strong><strong>";
      }
      if (health === 0) {
        se.innerHTML = "<code> Your pet died </code><strong> :( </strong>";
      }
    }, 1); /* Update health every 250ms. */
ep.onclick = function() {
      var se = document.getElementsByClassName('hud-menu-settings')[0];
      var max = Game.currentGame.ui.playerPetTick.maxHealth;
      var petPotion = document.getElementsByClassName('hud-shop-item')[11];
      var usePetPotion = document.getElementsByClassName('hud-toolbar-item')[5];
      var up = new Event("mouseup");
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
          if (he.childNodes[1].textContent < max / 2) {
            petPotion.click();
            setTimeout(function() {
              usePetPotion.dispatchEvent(up);
            }, 0);
          }
        });
      });
      observer.observe(he, {
        attributes: true,
        childList: true
      });
    };
  }, 1500); /* Wait that everything be loaded to start. */
};

//Background Changer
var Introleft = '';
Introleft += "<h3> Background Intro Changer!</h3>";
Introleft += "<input class='input' type='text'></input>";
Introleft += "&nbsp;";
Introleft += "<button class=\"btn btn-apply\" style=\"width: 24%;\">Apply</button>";

document.getElementsByClassName('hud-intro-left')[0].innerHTML = Introleft;

let element = document.getElementsByClassName('btn btn-apply')[0];
  element.addEventListener("click", function(e) {
           let value = document.getElementsByClassName('input')[0].value;
           let css = '<style type="text/css">.hud-intro::after { background: url('+ value +'); background-size: cover; }</style>';
   console.log("new background!")
           document.body.insertAdjacentHTML("beforeend", css);
});

var timer = null;

function speed(e) {
    switch (e.keyCode) {
        case 89:
            if (timer == null) {
                timer = setInterval(function () {
                    document.getElementsByClassName("btn btn-green hud-intro-play")[0].click();
                }, -999);
            } else {
                clearInterval(timer);
                timer = null;
            }
            break;
    }
}
setInterval(function () {
    if (document.querySelectorAll(".hud-chat .hud-chat-input:focus")[0]) {
        window.removeEventListener("keydown", speed);
    } else {
        window.addEventListener("keydown", speed);
    }
}, 0);

//Autoheal
(function() {
  heal = document.getElementsByClassName('hud-shop-item')[10];
  petHeal = document.getElementsByClassName('hud-shop-item')[11];
  useHeal = document.getElementsByClassName('hud-toolbar-item')[4];
  usePetHeal = document.getElementsByClassName('hud-toolbar-item')[5];
  healthBar = document.getElementsByClassName('hud-health-bar-inner')[0];
  up = new Event('mouseup');
  healLevel = 99;

  HEAL = function() {
    heal.attributes.class.value = 'hud-shop-item';
    petHeal.attributes.class.value = 'hud-shop-item';
    useHeal.dispatchEvent(up);
    usePetHeal.dispatchEvent(up);
    heal.click();
    petHeal.click();
  };

  script = function(e) {
    if (e.keyCode == 82) {
      HEAL();
    }
  };
  document.addEventListener('keydown', function(e) {
    script(e);
  });
  observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {
      if (parseInt(mutations[0].target.style.width) < healLevel) {
        HEAL();
      }
    });
  });
  observer.observe(healthBar, {
    attributes: true,
    attributeFilter: ['style']
  });
})();

//Party Name Switcher
(function() {
    var js = document.createElement('script');
    js.type = 'text/javascript';
    js.src = "https://cdn.jsdelivr.net/npm/sweetalert2@7.26.10/dist/sweetalert2.all.min.js";
    document.getElementsByTagName('head')[0].appendChild(js);
    var css = document.createElement('script');
    css.type = 'text/css';
    css.src = "https://cdn.jsdelivr.net/npm/sweetalert2@7.26.10/dist/sweetalert2.min.css";
    document.getElementsByTagName('head')[0].appendChild(css);
    var intervalId = setInterval(function() {
        if(Game.currentGame.world.inWorld === true) {
            clearInterval(intervalId);
            var my_elem = document.getElementsByClassName('hud-party-actions')[0];
            var div = document.createElement('div');
            var btncustom = "<style type=\"text/css\">.custom_input { width: 100px; height: 35px; font-size: 15px; padding: 5px 10px; color: #555; border-radius: 5px; border: 1px solid #bbb; outline: none;}a.button1{ display:inline-block; padding:0.35em 1.2em; border:0.1em solid #FFFFFF; margin:0 0.3em 0.3em 0; border-radius:0.12em; box-sizing: border-box; text-decoration:none; font-family:'Roboto',sans-serif; font-weight:300; color:#FFFFFF; text-align:center; transition: all 0.2s;}a.button1:hover{ color:#000000; background-color:#FFFFFF;}@media all and (max-width:30em){ a.button1{ display:block; margin:0.4em auto; }}</style>";
            document.body.insertAdjacentHTML("beforeend", btncustom);
            div.innerHTML = "<div style=\"display: inline-block; margin-left: 15px; margin-right: 10px;\"> Party Name Switcher!: </div><a class=\"button1\">Enable</a><a class=\"button1\" style=\"margin-left:10px\">Disable</a><small style=\"margin-left: 5px; margin-right: 5px;\"> Speed: </small><input class=\"custom_input\" type=\"number\" value=\"100\" min=\"0\" max=\"10000\" />";
            my_elem.parentNode.insertBefore(div, my_elem);
            document.getElementById('hud-menu-party').style.height = "480px";
            let maxlength = setInterval(function() {
                if(document.getElementsByClassName('swal2-input')[0]) {
                    clearInterval(maxlength);
                    var i;
                    for(i = 0; i < document.getElementsByClassName('swal2-input').length; i++) {
                        document.getElementsByClassName('swal2-input')[i].maxLength = 49;
                    }
                }
            }, 100);
            var start = document.getElementsByClassName('button1')[0];
            start.style.marginBottom = "20px";
            var id = null;
            let interval = setInterval(function() {
                if(start) {
                    clearInterval(interval);
                    var speed = document.querySelector('input[class="custom_input"]');
                    start.onclick = function() {
                        swal.mixin({
                            input: 'text',
                            confirmButtonText: 'Next ⋙',
                            showCancelButton: true,
                            progressSteps: ['1', '2', '3'],
                        }).queue([{
                            title: 'First Party Name!',
                            text: 'Party Name will Switch with this Name!'
                        }, {
                            title: 'Second Party Name',
                            text: 'Party Name will Switch with this One too!'
                        }, {
                            title: 'Third Party Name',
                            text: 'Party Name will Switch too with that One!'
                        }]).then((result) => {
                            if(result.value) {
                                swal({
                                    title: 'All Done!',
                                    html: 'Party Names: <pre><code>' + JSON.stringify(result.value) + '</code></pre>',
                                    confirmButtonText: 'Nice!',
                                    onClose: () => {
                                        function countInArray(array, what) {
                                            var count = 0;
                                            for(var i = 0; i < array.length; i++) {
                                                if(array[i] === what) {
                                                    count++;
                                                }
                                            }
                                            return count;
                                        }
                                        var i;
                                        for(i = 0; i < result.value.length; i++) {
                                            if(result.value[i] == "") {
                                                var parties = countInArray(result.value, "");
                                                if(parties == 0) {
                                                    result.value.length = 3;
                                                } else if(parties == 1) {
                                                    result.value.length = 2;
                                                } else if(parties == 2) {
                                                    result.value.length = 1;
                                                } else if(parties == 3) {
                                                    result.value.length = 0;
                                                    result.value == undefined;
                                                    swal("Error!", "Your Must Write at Last One Party Name!", "error")
                                                }
                                            }
                                        }
                                        document.getElementsByClassName('hud-menu-icon')[1].click();
                                        var partyTag = document.getElementsByClassName('hud-party-tag')[0];
                                        var space = new Event("keyup");
                                        var delay;
                                        id = setInterval(function() {
                                            partyTag.value = result.value[Math.floor(Math.random() * result.value.length)];
                                            space.keyCode = 32;
                                            partyTag.dispatchEvent(space);
                                        }, delay);
                                        speed.addEventListener("input", function() {
                                            clearInterval(id);
                                            delay = speed.value;
                                            id = setInterval(function() {
                                                partyTag.value = result.value[Math.floor(Math.random() * result.value.length)];
                                                space.keyCode = 32;
                                                partyTag.dispatchEvent(space);
                                            }, delay)
                                        });
                                        var stop = document.getElementsByClassName('button1')[1];
                                        stop.onclick = function() {
                                            result.value = null;
                                            clearInterval(id);
                                            id = null;
                                            var i;
                                            for(i = 0; i < 10000; i++) {
                                                clearInterval(i);
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }
             }
            }, 1000)
        }
    }, 250)
})();

//Send Global Message CORRECT
const $ = function(className) {
    var elem = document.getElementsByClassName(className);
    if (elem.length > 1) return elem;
    return elem[0];
};
window.addEventListener("load", function(e) {
    var chat = $("hud-chat");
    var html = `<div class='GLB'>
                   <button style='opacity: 0; transition: opacity 0.15s ease-in-out;' class='GLBbtn'>Send it as global message...</button>
                </div>`;
    chat.insertAdjacentHTML("afterend", html);
    var sendBtn = $("GLBbtn");
    sendBtn.addEventListener("click", function(e) {
        let msg = $("hud-chat-input").value;
        Game.currentGame.network.sendRpc({
            name: "SendChatMessage",
            channel: "Global",
            message: msg
        });
    });
    var input = document.querySelectorAll(".hud-chat")[0];
    var observer = new MutationObserver(styleChangedCallback);

    function styleChangedCallback(mutations) {
        var newIndex = mutations[0].target.className;

        if (newIndex == "hud-chat is-focused") {
            sendBtn.style.opacity = 1;
        } else {
            sendBtn.style.opacity = 0;
        }
    }
    observer.observe(input, {
        attributes: true,
        attributeFilter: ["class"]
    });
});

window.addEventListener("load", function(e) {
    var menu = document.getElementsByClassName("hud-menu-scripts")[0];
    var AHRC_html = `</br><div class='AHRC'>
                   <p class='AHRCtxt'>Enable AHRC!</p>
                   <button class='AHRCbtn'>Click me!</button>
                </div>`;
        var SELLALL_html = `</br><div class='SELLALL'>
                   <p class='SELLALLtxt'>Enable Sell All!</p>
                   <button class='SELLALLbtn'>Click Me!</button>
                </div>`;
        var UPGRADEALL_html = `</br><div class='UPGRADEALL'>
                           <p class='UPGRADEALLtxt'>Enable Upgrade All!</p>
                           <button class='UPGRADEALLbtn'>Click Me!</button>
                        </div>`;

    menu.innerHTML += AHRC_html;
    menu.innerHTML += SELLALL_html;
    menu.innerHTML += UPGRADEALL_html;

    var css = `
                <style type='text/css'>
                @import 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:700';
                *, *::before, *::after {
                  -webkit-box-sizing: border-box;
                  -moz-box-sizing: border-box;
                  box-sizing: border-box;
                }
                html, body {
                  height: 100%;
                  width: 100%;
                }
                body {
                  padding: 0px;
                  margin: 0;
                  font-family: 'Source Sans Pro', sans-serif;
                  background: #f5f0ff;
                  -webkit-font-smoothing: antialiased;
                }
                .dark {
                  background: #24252a;
                }
                .flex {
                  min-height: 50vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                a.bttn {
                  color: #ff0072;
                  text-decoration: none;
                  -webkit-transition: 0.3s all ease;
                  transition: 0.3s ease all;
                }
                a.bttn:hover {
                  color: #fff;
                }
                a.bttn:focus {
                  color: #fff;
                }
                a.bttn-dark {
                  color: #644cad;
                  text-decoration: none;
                  -webkit-transition: 0.3s all ease;
                  transition: 0.3s ease all;
                }
                a.bttn-dark:hover {
                  color: #fff;
                }
                a.bttn-dark:focus {
                  color: #fff;
                }
                .bttn {
                  font-size: 18px;
                  letter-spacing: 2px;
                  text-transform: uppercase;
                  display: inline-block;
                  text-align: center;
                  width: 270px;
                  font-weight: bold;
                  padding: 14px 0px;
                  border: 3px solid #ff0072;
                  border-radius: 2px;
                  position: relative;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.1);
                }
                .bttn:before {
                  -webkit-transition: 0.5s all ease;
                  transition: 0.5s all ease;
                  position: absolute;
                  top: 0;
                  left: 50%;
                  right: 50%;
                  bottom: 0;
                  opacity: 0;
                  content: '';
                  background-color: #ff0072;
                  z-index: -2;
                }
                .bttn:hover:before {
                  -webkit-transition: 0.5s all ease;
                  transition: 0.5s all ease;
                  left: 0;
                  right: 0;
                  opacity: 1;
                }
                .bttn:focus:before {
                  transition: 0.5s all ease;
                  left: 0;
                  right: 0;
                  opacity: 1;
                }
                .bttn-dark {
                  font-size: 18px;
                  letter-spacing: 2px;
                  text-transform: uppercase;
                  display: inline-block;
                  text-align: center;
                  width: 270px;
                  font-weight: bold;
                  padding: 14px 0px;
                  border: 3px solid #644cad;
                  border-radius: 2px;
                  position: relative;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.1);
                  z-index: 2;
                }
                .bttn-dark:before {
                  -webkit-transition: 0.5s all ease;
                  transition: 0.5s all ease;
                  position: absolute;
                  top: 0;
                  left: 50%;
                  right: 50%;
                  bottom: 0;
                  opacity: 0;
                  content: '';
                  background-color: #644cad;
                  z-index: -1;
                }
                .bttn-dark:hover:before {
                  -webkit-transition: 0.5s all ease;
                  transition: 0.5s all ease;
                  left: 0;
                  right: 0;
                  opacity: 1;
                }
                .bttn-dark:focus:before {
                  -webkit-transition: 0.5s all ease;
                  transition: 0.5s all ease;
                  left: 0;
                  right: 0;
                  opacity: 1;
                }
                </style>
                `;

    function REFUEL() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "Harvester") {
                let e = Game.currentGame.world.getEntityByUid(obj.fromTick.uid).getTargetTick();
                let i = Math.floor(e.depositMax);
                Game.currentGame.network.sendRpc({
                    name: "AddDepositToHarvester",
                    uid: obj.fromTick.uid,
                    deposit: i
                });
            }
        }
    }

    function COLLECT() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "Harvester") {
                Game.currentGame.network.sendRpc({
                    name: "CollectHarvester",
                    uid: obj.fromTick.uid
                });
            }
        }
    }

    function SELLALL() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model !== "GoldStash") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    }

    function UPGRADEALL() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model !== "GoldStash") {
                Game.currentGame.network.sendRpc({
                    name: "UpgradeBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    }

    function UPGRADESTASH() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "GoldStash") {
                Game.currentGame.network.sendRpc({
                    name: "UpgradeBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    }

        var enableAHRC = document.getElementsByClassName("AHRCbtn")[0];
        var enableAHRCTxt = document.getElementsByClassName("AHRCtxt")[0];
        var id = null;
        enableAHRC.addEventListener("click", function(e) {
                if(enableAHRCTxt.innerText == "Enable AHRC!") {
                        id = setInterval(function() {
                                COLLECT();
                                REFUEL();
                        }, 1000);
                        enableAHRCTxt.innerText = "Disable AHRC!";
                } else {
                        enableAHRCTxt.innerText = "Enable AHRC!";
                        clearInterval(id);
                        id = null;
                }
        });

        document.body.insertAdjacentHTML("beforeend", css);
        enableAHRC.classList.add("bttn-dark");

        var enableSELLALL = document.getElementsByClassName("SELLALLbtn")[0];
        var enableSELLALLTxt = document.getElementsByClassName("SELLALLtxt")[0];
        enableSELLALL.addEventListener("click", function(e) {
                if(enableSELLALLTxt.innerText == "Enable Sell All!") {
                        id = setInterval(function() {
                                SELLALL();
                        }, 1);
                        enableSELLALLTxt.innerText = "Disable Sell All!";
                } else {
                        enableSELLALLTxt.innerText = "Enable Sell All!";
                        clearInterval(id);
                        id = null;
                }
        });

        document.body.insertAdjacentHTML("beforeend", css);
        enableSELLALL.classList.add("bttn-dark");

        var enableUPGRADEALL = document.getElementsByClassName("UPGRADEALLbtn")[0];
        var enableUPGRADEALLTxt = document.getElementsByClassName("UPGRADEALLtxt")[0];
        enableUPGRADEALL.addEventListener("click", function(e) {
                if(enableUPGRADEALLTxt.innerText == "Enable Upgrade All!") {
                        id = setInterval(function() {
                                UPGRADEALL();
                                UPGRADESTASH();
                        }, 1);
                        enableUPGRADEALLTxt.innerText = "Disable Upgrade All!";
                } else {
                        enableUPGRADEALLTxt.innerText = "Enable Upgrade All!";
                        clearInterval(id);
                        id = null;
                }
        });
        document.body.insertAdjacentHTML("beforeend", css);
        enableUPGRADEALL.classList.add("bttn-dark");
});

(function() {
    let styles = document.createTextNode(`
  .hud-menu-scripts {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 920px;
  height: 580px;
  margin: -350px 0 0 -460px;
  padding: 20px 340px 20px 20px;
  background: rgba(0, 0, 0, 0.6);
  color: #eee;
  border-radius: 4px;
  z-index: 15;
  }
  .hud-menu-icons .hud-menu-icon[data-type=Scripts]::before {
  background-image: url('https://i.imgur.com/Igqp5Pc.png');
`);
    let css = document.createElement("style");
    css.type = "text/css";
    css.appendChild(styles);
    document.body.appendChild(css);
    let menu_html = "<div class='hud-menu-scripts'></div>";
    document.body.insertAdjacentHTML("afterbegin", menu_html);
    let menu_scripts = document.getElementsByClassName('hud-menu-scripts')[0];
    var allItems = document.getElementsByClassName("myCustomIcon");
        var menus = document.getElementsByClassName("hud-menu");

        var newMenuItem = document.createElement("div");
        newMenuItem.classList.add("hud-menu-icon");
        newMenuItem.classList.add("myCustomIcon");
        newMenuItem.setAttribute("data-type", "Scripts");
        newMenuItem.innerHTML = "Scripts";
        document.getElementById("hud-menu-icons").appendChild(newMenuItem);

        var allItems = document.getElementsByClassName("myCustomIcon");
        for(var item = 0; item < allItems.length; item++) {
            allItems[item].addEventListener("mouseenter", onMenuItemEnter, false);
            allItems[item].addEventListener("mouseleave", onMenuItemLeave, false);
        }

        function onMenuItemEnter() {
            var theTooltip = document.createElement("div");
            theTooltip.classList.add("hud-tooltip");
            theTooltip.classList.add("hud-tooltip-left");
            theTooltip.id = "hud-tooltip";
            theTooltip.innerHTML = `<div class="hud-tooltip-menu-icon">
                                       <h4>Scripts</h4>
                                    </div>`;

            this.appendChild(theTooltip)

            theTooltip.style.top = "-10px";
        theTooltip.style.bottom = 0
        theTooltip.style.left = "-96.4px";
        theTooltip.style.right = 0;
                theTooltip.style.width = "78.5px";
                theTooltip.style.fontSize = "16.7px";
                theTooltip.style.fontWeight = "bold";
        theTooltip.style.position = "relative";
                theTooltip.style.textIndent = 0;
        }

        function onMenuItemLeave() {
            this.removeChild(document.getElementById("hud-tooltip"));
        }

    document.getElementsByClassName('hud-menu-icon')[3].addEventListener("click", function(e) {
        if(menu_scripts.style.display == "none") {
            menu_scripts.style.display = "block";
            for(var i = 0; i < menus.length; i++) {
                menus[i].style.display = "none";
            }
        } else {
            menu_scripts.style.display = "none";
        }
    });
    let icons = document.getElementsByClassName("hud-menu-icon");
    let menu_icons = [
        icons[0],
        icons[1],
        icons[2]
    ]
    menu_icons.forEach(function(elem) {
        elem.addEventListener("click", function(e) {
            if(menu_scripts.style.display == "block") {
                menu_scripts.style.display = "none";
            }
        })
    })
    window.addEventListener('mouseup', function(event) {
        if(event.target !== menu_scripts && event.target.parentNode !== menu_scripts) {
            menu_scripts.style.display = 'none';
        }
    })
})();