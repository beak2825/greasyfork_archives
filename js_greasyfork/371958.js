// ==UserScript==
// @name         Zombs.io auto heal + More.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Zombs.io auto heal updated!
// @author       I HAVE A REALLY LONG NICKNAME
// @match        *://zombs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371958/Zombsio%20auto%20heal%20%2B%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/371958/Zombsio%20auto%20heal%20%2B%20More.meta.js
// ==/UserScript==

window.addEventListener("onkeydown", keyDown, true);
window.addEventListener("keydown", keyDown);

function keyDown(e) {
  switch (e.keyCode) {
    case 188:
      runOn();
      break;
    case 190:
      runOff();
      break;
    case 187:
      spamOn();
      break;
    case 189:
      spamOff();
      break;
    case 192:
      leaderboard();
      leaderboard2();
      break;
  }
}

// ads element remove
document.querySelectorAll('.ad-unit').forEach(function(a){
a.remove();
});

// div style
var Style1 = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide');
for (var i = 0; i < Style1.length; i++) {
  Style1[i].style.borderRadius = '1em'; // standard
  Style1[i].style.MozBorderRadius = '1em'; // Mozilla
  Style1[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style1[i].style.color = "#D35400";
  Style1[i].style.border = "2px solid #D35400";
}

// input and select style
var Style2 = document.querySelectorAll('select, input');
for (var i = 0; i < Style2.length; i++) {
  Style2[i].style.borderRadius = '1em'; // standard
  Style2[i].style.MozBorderRadius = '1em'; // Mozilla
  Style2[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style2[i].style.color = "#D35400";
  Style2[i].style.border = "2px solid #D35400";
  Style2[i].style.backgroundColor = "#000000";
}

// intro guide innerHtml
var IntroGuide = '';
IntroGuide += "<center><h3>Zombs.io long nicknames</h3>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"name1();\">NAME [1]</button>";
IntroGuide += "&nbsp;";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"name2();\">NAME [2]</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"name3();\">NAME [3]</button>";
IntroGuide += "&nbsp;";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"name4();\">NAME [3]</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 90%;\" onclick=\"name5();\">HIDDEN NICKNAME</button>";
IntroGuide += "<br>";
IntroGuide += "<center><h3>Zombs.io border color</h3>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 90%;\" id=\"button1\">BORDER COLOR</button>";

document.getElementsByClassName('hud-intro-guide')[0].innerHTML = IntroGuide;

// nick names
window.name1 = function(){
document.getElementsByClassName('hud-intro-name')[0].value = 'I_HAVE_A_REALLY_LONG_NICKNAME';
};
window.name2 = function(){
document.getElementsByClassName('hud-intro-name')[0].value = '\u0BCC\u0BCC\u0BCC\u0BCC\u0BCC\u0BCC\u0BCC\u0BCC\u0BCC';
};
window.name3 = function(){
document.getElementsByClassName('hud-intro-name')[0].value = '\u0BF5\u0BF5\u0BF5\u0BF5\u0BF5\u0BF5\u0BF5\u0BF5\u0BF5';
};
window.name4 = function(){
document.getElementsByClassName('hud-intro-name')[0].value = 'assssssssssssssssssssssssssss';
};
window.name5 = function(){
document.getElementsByClassName('hud-intro-name')[0].value = 'This has been removed';
};

// setting buttons & controls innerHtml
var settingsHtml = '';
settingsHtml += "<div style=\"text-align:center\">";
settingsHtml += "<label><span>zombs.io script settings</span></label>";
settingsHtml += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"spamOn()\">SPAM PARTYS ON</button>";
settingsHtml += "&nbsp;";
settingsHtml += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"spamOff()\">SPAM PARTYS OFF</button>";
settingsHtml += "<br><br>";
settingsHtml += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"runOn()\">SPEED RUN ON</button>";
settingsHtml += "&nbsp;";
settingsHtml += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"runOff()\">SPEED RUN OFF</button>";
settingsHtml += "<br><br>";
settingsHtml += "<button class=\"btn btn-green\" style=\"width: 45%;\" id=\"button2\">BORDER COLOR</button>";
settingsHtml += "&nbsp;";
settingsHtml += "<button class=\"btn btn-green\" style=\"width: 45%;\">COMING SOON</button>";
settingsHtml += "<br><br>";
settingsHtml += "<label><span>zombs.io script hide and show</span></label>";
settingsHtml += "<button id=\"lbb\" class=\"btn btn-green\" style=\"width: 90%;\" onclick=\"leaderboard();leaderboard2();\">HIDE LEADERBORED</button>";
settingsHtml += "<br><br>";
settingsHtml += "<button id=\"pub\" class=\"btn btn-green\" style=\"width: 90%;\" onclick=\"popoverlay();popoverlay2();\">HIDE POPUP OVERLAY</button>";
settingsHtml += "<hr style=\"color: rgba(255, 255, 255);\">";
// settings shortcuts & controls
settingsHtml += "<label>";
settingsHtml += "<span>zombs.io script shortcuts & controls</span>";
settingsHtml += "<ul class=\"hud-settings-controls\">";
settingsHtml += "<li>Press '<strong><</strong>' to start speed run.</strong></li>";
settingsHtml += "<li>Press '<strong>></strong>' to stop speed run.</strong></li>";
settingsHtml += "<li>Press '<strong>R</strong>' to buy health potions.</strong></li>";
settingsHtml += "<li>Press '<strong>F</strong>' to use health potions.</strong></li>";
settingsHtml += "<li>Press '<strong>+</strong>' to start spam all open partys.</strong></li>";
settingsHtml += "<li>Press '<strong>-</strong>' to stop spam all open partys.</strong></li>";
settingsHtml += "<li>Press '<strong>~</strong>' to hide or show leaderboard.</strong></li>";
settingsHtml += "<li>More coming soon.</strong></li>";
settingsHtml += "</ul>";
settingsHtml += "</label>";
settingsHtml += "<hr style=\"color: rgba(255, 255, 255);\">";
// settings features
settingsHtml += "<label>";
settingsHtml += "<span>zombs.io script features</span>";
settingsHtml += "<ul class=\"hud-settings-controls\">";
settingsHtml += "<li>Auto heal player & pet at 70% health</li>";
settingsHtml += "<li>Speed run with pet</li>";
settingsHtml += "<li>Spam all open partys</li>";
settingsHtml += "<li>Max player nickname</li>";
settingsHtml += "<li>Max party tag name</li>";
settingsHtml += "<li>New style</li>";
settingsHtml += "<li>Hide or show leaderboard</li>";
settingsHtml += "<li>Hide or show pop up overlay</li>";
settingsHtml += "<li>Change border color</li>";
settingsHtml += "<li>More coming soon.</li>";
settingsHtml += "</ul>";
settingsHtml += "</label>";
settingsHtml += "</div>";

document.getElementsByClassName("hud-settings-grid")[0].innerHTML = settingsHtml;

// random style codes
function stylecodes() {
 document.getElementById('hud-menu-party').style.width = "610px";
 document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
 document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);
 document.getElementsByClassName("hud-day-night-overlay")[0].remove();
 document.getElementsByClassName("hud-party-joining")[0].remove();
 document.getElementsByClassName("hud-intro-corner-bottom-right")[0].remove();
 document.getElementsByClassName("hud-intro-corner-bottom-left")[0].remove();
 document.getElementsByClassName("hud-intro-footer")[0].remove();
 document.getElementsByClassName("hud-respawn-share")[0].remove();
}

stylecodes();

// change div borderColor
var button1 = document.getElementById("button1");
var button2 = document.getElementById("button2");

var allchar = "0123456789ABCDEF";

button1.addEventListener("click", changeBorderColor);
button2.addEventListener("click", changeBorderColor);

function changeBorderColor() {
  var randcol = "";
  for (var i = 0; i < 6; i++) {
    randcol += allchar[Math.floor(Math.random() * 16)];
  }

  var divs = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-name, .hud-intro-server, .hud-party-tag, .hud-party-share, .hud-chat-input');
  for (var i2 = 0; i2 < divs.length; i2++) {
    divs[i2].style.borderColor = "#" + randcol;
  }
}

// hide or show hud popup overlay
function popoverlay() {
  var poplay = document.getElementById("hud-popup-overlay");
  if (poplay.style.display === "none") {
    poplay.style.display = "block";
  } else {
    poplay.style.display = "none";
  }
}

function popoverlay2() {
  var change = document.getElementById("pub");
  if (change.innerHTML == "HIDE POPUP OVERLAY") {
    change.innerHTML = "SHOW POPUP OVERLAY";
  } else {
    change.innerHTML = "HIDE POPUP OVERLAY";
  }
}

// hide or show leaderboard
function leaderboard() {
  var x = document.getElementById("hud-leaderboard");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function leaderboard2() {
  var change = document.getElementById("lbb");
  if (change.innerHTML == "HIDE LEADERBORED") {
    change.innerHTML = "SHOW LEADERBORED";
  } else {
    change.innerHTML = "HIDE LEADERBORED";
  }
}

// spam all open partys
var spamparty;
function spamOn() {
  spamOff();
  spamparty = setInterval(function() {
    el = document.getElementsByClassName('hud-party-link');
    for (var i = 0; i < el.length; i++) {
      var currentEl = el[i];
      currentEl.click();
    }

    el = document.getElementsByClassName('btn btn-green hud-confirmation-accept');
    for (var i2 = 0; i2 < el.length; i2++) {
      var currentE2 = el[i2];
      currentE2.click();
    }
  }, 0); // Spam Speed
}

function spamOff() {
  if (spamparty !== null) {
    clearInterval(spamparty);
    spamparty = null;
  }
}

// Speed run with pet
var speedrun;
function runOn() {
  runOff();
  speedrun = setInterval(function() {
    el = document.getElementsByClassName('hud-shop-actions-equip');
    for (var i = 0; i < el.length; i++) {
      var currentE3 = el[i];
      currentE3.click();
    }
  }, 0); // Speed Run Speed
}

function runOff() {
  if (speedrun !== null) {
    clearInterval(speedrun);
    speedrun = null;
  }
}

// auto heal
(function() {
  heal = document.getElementsByClassName('hud-shop-item')[10];
  petHeal = document.getElementsByClassName('hud-shop-item')[11];
  useHeal = document.getElementsByClassName('hud-toolbar-item')[4];
  usePetHeal = document.getElementsByClassName('hud-toolbar-item')[5];
  healthBar = document.getElementsByClassName('hud-health-bar-inner')[0];
  up = new Event('mouseup');
  healLevel = 70;

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