// ==UserScript==
// @name         San's Mod
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  san i made this mod for you cause your my fam!!!
// @author       [✧] ✘ℕinjaツ
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372871/San%27s%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/372871/San%27s%20Mod.meta.js
// ==/UserScript==
// Ad Remover

window.addEventListener("onkeydown", keyDown, true);
window.addEventListener("keydown", keyDown);

function keyDown() {
  var e = window.event;
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
      leaderboard();leaderboard2();
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

var IntroGuide = '';
IntroGuide += "<center><h3>Zombs.io script border color</h3>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" id=\"button1\">CHANGE BORDER COLOR</button>";
IntroGuide += "<center><h3>Do you like San's Mod</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"Yes!();\">Yes!</button>";
IntroGuide += "&nbsp;";
IntroGuide += "<button class=\"btn btn-red\" style=\"width: 45%;\" onclick=\"No!();\">No!</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Zombs.io Server</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592411';\">Europe 1</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592406';\">Australia 1</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618006';\">East 1 (sometimes work)</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8617896';\">West 1 (sometimes work)</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564836';\">Barrier Server</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Name Short Cut</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'NØR×SanHNT';\">NØR×SanHNT</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '℣ | San';\">℣ | San</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'ℑᛕ | Sanᕼ';\">ℑᛕ | Sanᕼ</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Symbols</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '[✧]';\">[✧]</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '✘';\">✘</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'ツ';\">ツ</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '(▀̿Ĺ̯▀̿ ̿)';\">(▀̿Ĺ̯▀̿ ̿)</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '( ͡° ͜ʖ ͡°)';\">( ͡° ͜ʖ ͡°)</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'ʕ•ᴥ•ʔ';\">ʕ•ᴥ•ʔ</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Long Names!</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'San,San,San,San';\">Long Name 1</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'would_you_like_to_eat_toast';\">Long Name 2</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'SAN_IS_SAVAGE_YOU_CANT_LIE';\">Long Name 3</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>No Name</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '​';\">No Name</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Hope you like my mod!</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<span>San!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";

document.getElementsByClassName('hud-intro-guide')[0].innerHTML = IntroGuide;

//Footer Things!
var IntroFooter = '';
IntroFooter += "<center><h3>This is San's Mod I hope you have a Awesome Experience on this Mod Adventure Enjoy the Mods xD</h3>";

document.getElementsByClassName('hud-intro-footer')[0].innerHTML = IntroFooter;

//By: SAN
var IntroCornertopleft = '';
IntroCornertopleft += "<h3>By: NØR×SanHNT</h3>";

document.getElementsByClassName('hud-intro-corner-top-left')[0].innerHTML = IntroCornertopleft;

//Notes and Things!
var IntroLeft = '';
IntroLeft += "<center><h3>NØR×SanHNT!</h3>";
IntroLeft += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroLeft += "<span>Hope you like the mods xD</span>";

document.getElementsByClassName('hud-intro-left')[0].innerHTML = IntroLeft;

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
settingsHtml += "<button id=\"lbb\" class=\"btn btn-green\" style=\"width: 90%;\" onclick=\"leaderboard();leaderboard2();\">ALWAYS MAKE PARTY NAME SAN</button>";
settingsHtml += "<br><br>";
settingsHtml += "<button id=\"pub\" class=\"btn btn-green\" style=\"width: 90%;\" onclick=\"popoverlay();popoverlay2();\">ALWAYS MAKE PARTY NAME SAN</button>";
settingsHtml += "<hr style=\"color: rgba(255, 255, 255);\">";
// settings shortcuts & controls
settingsHtml += "<label>";
settingsHtml += "<span>zombs.io script shortcuts & controls</span>";
settingsHtml += "<ul class=\"hud-settings-controls\">";
settingsHtml += "<li>Press '<strong>z</strong>' to start speed run.</strong></li>";
settingsHtml += "<li>Press '<strong>x</strong>' to stop speed run.</strong></li>";
settingsHtml += "<li>Press '<strong>R</strong>' to buy health potions.</strong></li>";
settingsHtml += "<li>Press '<strong>F</strong>' to use health potions.</strong></li>";
settingsHtml += "<li>Press '<strong>+</strong>' to start spam all open partys.</strong></li>";
settingsHtml += "<li>Press '<strong>-</strong>' to stop spam all open partys.</strong></li>";
settingsHtml += "<li>Press '<strong>~</strong>' to hide or show leaderboard.</strong></li>";
settingsHtml += "<li>by [✧] ✘ℕinjaツ.</strong></li>";
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
settingsHtml += "<li>ALWAYS MAKE PARTYNAME NIN</li>";
settingsHtml += "<li>ALWAYS MAKE PARTYNAME NIN</li>";
settingsHtml += "<li>Change border color</li>";
settingsHtml += "<li>by [✧] ✘ℕinjaツ.</li>";
settingsHtml += "</ul>";
settingsHtml += "</label>";
settingsHtml += "</div>";

document.getElementsByClassName("hud-settings-grid")[0].innerHTML = settingsHtml;

// Some Codes that Remove or do other Things
document.getElementsByClassName("hud-day-night-overlay")[0].remove();
document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 99);
document.getElementsByClassName("hud-intro-corner-bottom-left")[0].remove();
document.getElementsByClassName("hud-party-joining")[0].remove();
document.getElementsByClassName("hud-intro-corner-bottom-right")[0].remove();

// change div borderColor
var button1 = document.getElementById("button1");

var allchar = "0123456789ABCDEF";

button1.addEventListener("click", changeBorderColor);
button2.addEventListener("click", changeBorderColor);

function changeBorderColor() {
  var randcol = "";
  for (var i = 0; i < 6; i++) {
    randcol += allchar[Math.floor(Math.random() * 16)];
  }

  var divs = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-name, .hud-intro-server, .hud-party-tag, .hud-party-share, .hud-chat-input');
  for (var i = 0; i < divs.length; i++) {
    divs[i].style.borderColor = "#" + randcol;
  }
}

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

// auto collector for harvestors
setTimeout(() => {
 let elements = document.getElementsByClassName("hud-respawn-btn");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 1);
}, 1);
setTimeout(() => {
 let elements = document.getElementsByClassName("btn btn-purple hud-building-deposit");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 1);
}, 1);
setTimeout(() => {
 let elements = document.getElementsByClassName("btn btn-gold hud-building-collect");
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

// auto heal
(function() {
  heal = document.getElementsByClassName('hud-shop-item')[10];
  petHeal = document.getElementsByClassName('hud-shop-item')[11];
  useHeal = document.getElementsByClassName('hud-toolbar-item')[4];
  usePetHeal = document.getElementsByClassName('hud-toolbar-item')[5];
  healthBar = document.getElementsByClassName('hud-health-bar-inner')[0];
  up = new Event('mouseup');
  healLevel = 98;

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

//KeyCodes
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