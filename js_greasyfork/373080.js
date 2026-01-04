// ==UserScript==
// @name         [✧] N I N J A's Mod
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This Mod has over 1,000 script lines!!!
// @author       You
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373080/%5B%E2%9C%A7%5D%20N%20I%20N%20J%20A%27s%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/373080/%5B%E2%9C%A7%5D%20N%20I%20N%20J%20A%27s%20Mod.meta.js
// ==/UserScript==
// Ad Remover
document.querySelectorAll('.ad-unit').forEach(function(a){
a.remove();
});

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

var Style1 = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-footer');
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

//Intro Left
var Style1 = document.querySelectorAll('.hud-intro-left');
for (var i = 0; i < Style1.length; i++) {
  Style1[i].style.borderRadius = '1em'; // standard
  Style1[i].style.MozBorderRadius = '1em'; // Mozilla
  Style1[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style1[i].style.color = "#A9A9A9";
  Style1[i].style.border = "2px solid #000000";
}

var IntroGuide = '';
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
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '[✧] N I N J A';\">[✧] N I N J A</button>";
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
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '[✧] N I N J A is Savage xD';\">Long Name 1</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'Very Tiny [✧] N I N J A ;D';\">Long Name 2</button>";
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
IntroGuide += "<span>And Finally It has Public and Private Clicker!</span>";

document.getElementsByClassName('hud-intro-guide')[0].innerHTML = IntroGuide;

//Footer Things!
var IntroFooter = '';
IntroFooter += "<center><h3>This is [✧] N I N J A's Mod I hope you have a Awesome Experience on this Mod Adventure Enjoy the Mods! :D</h3>";

document.getElementsByClassName('hud-intro-footer')[0].innerHTML = IntroFooter;

//By: [✧] N I N J A
var IntroCornertopleft = '';
IntroCornertopleft += "<h3>By:[✧] N I N J A</h3>";

document.getElementsByClassName('hud-intro-corner-top-left')[0].innerHTML = IntroCornertopleft;

// Some Codes that Remove or do other Things
document.getElementsByClassName("hud-day-night-overlay")[0].remove();
document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 99);
document.getElementsByClassName("hud-intro-corner-bottom-left")[0].remove();
document.getElementsByClassName("hud-party-joining")[0].remove();
document.getElementsByClassName("hud-intro-corner-bottom-right")[0].remove();

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
window.addEventListener("onkeydown", keyDown, true);
window.addEventListener("keydown", keyDown);

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
window.addEventListener("onkeydown", keyDown, true);
window.addEventListener("keydown", keyDown);

function start2() {
  stop2();
  refreshIntervalId2 = setInterval(function() {
    el = document.getElementsByClassName('hud-party-link');

    for (var i = 0; i < el.length; i++) {
      var currentEl = el[i];
      currentEl.click();
    }

    el = document.getElementsByClassName('btn btn-green hud-confirmation-accept');

    for (var i = 0; i < el.length; i++) {
      var currentEl = el[i];
      currentEl.click();
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
window.addEventListener("onkeydown", keyDown, true);
window.addEventListener("keydown", keyDown);

function start3() {
  stop3();
  refreshIntervalId2 = setInterval(function() {
    el = document.getElementsByClassName('hud-party-visibility is-private');

    for (var i = 0; i < el.length; i++) {
      var currentEl = el[i];
      currentEl.click();
    }

    el = document.getElementsByClassName('hud-party-visibility');

    for (var i = 0; i < el.length; i++) {
      var currentEl = el[i];
      currentEl.click();
    }
  }, 1); // Spam Speed
}

function stop3() {
  if (refreshIntervalId2 !== null) {
    clearInterval(refreshIntervalId2);
    refreshIntervalId2 = null;
  }
}

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
Settings += "<hr style=\"color: rgba(255, 255, 255);\">";
Settings += "<center><h3>NOTE:</h3>";
Settings += "<span>THE SERVERS MAY CHANGE SO THE NUMBERS WILL NOT BE ACCURATE</span>";
Settings += "<span>AND MAY BE WRONG BUT IF THE NUMBERS ON EVERY SERVER OR ON A SERVER COMPLETELY CHANGES </span>";
Settings += "<span>THEN I WILL TRY TO UPDATE AS MUCH AS POSSIBLE!</span>";
Settings += "<hr style=\"color: rgba(255, 255, 255);\">";

document.getElementsByClassName('hud-settings-grid')[0].innerHTML = Settings;

//stuff
(function() {
    up = new Event('mouseup');
    healLevel = 99;
   
    PlayClick = function() {
        Play = document.getElementsByClassName('btn btn-green hud-intro-play')[0];

        Play.attributes.class.value = 'btn btn-green hud-intro-play';

        Play.click();


};
  
    timer = null;
    script = function(e) {
        switch (e.code) {


   
            case "KeyY":
               PlayClick(); 

            default:
                return;
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
   healthBar = document.getElementsByClassName('hud-health-bar-inner')[0];
    observer.observe(healthBar, { attributes: true, attributeFilter: ['style'] });
})();