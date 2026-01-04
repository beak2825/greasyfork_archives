// ==UserScript==
// @name         DEATH's Mod
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Creater: [✧] ✘ℕinjaツ!!!
// @author       Death
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373761/DEATH%27s%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/373761/DEATH%27s%20Mod.meta.js
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

// NEW DIV IN PARTY TAB
function partydiv() {
  var newNode = document.createElement('div');
  newNode.className = 'tagzspam';
  newNode.style = 'text-align:center';
  document.getElementsByClassName('hud-party-actions')[0].appendChild(newNode);
}

partydiv();

// DIV STYLE
var Style1 = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-name, .hud-intro-server, .hud-party-tag, .hud-party-share, .hud-chat-input');
for (var i = 0; i < Style1.length; i++) {
  Style1[i].style.borderRadius = '1em'; // standard
  Style1[i].style.MozBorderRadius = '1em'; // Mozilla
  Style1[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style1[i].style.color = "#D35400";
  Style1[i].style.border = "2px solid #000000";
}

// INPUT AND SELECT STYLE
var Style2 = document.querySelectorAll('select, input');
for (var i = 0; i < Style2.length; i++) {
  Style2[i].style.borderRadius = '1em'; // standard
  Style2[i].style.MozBorderRadius = '1em'; // Mozilla
  Style2[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style2[i].style.color = "#D35400";
  Style2[i].style.border = "2px solid #000000";
  Style2[i].style.backgroundColor = "#000000";
}

// NEW DIV IN PARTYS INNERHTML
var div1 = document.getElementsByClassName("tagzspam")[0];

div1.innerHTML += "<br><small>zombs.io party name tag spam</small><br>";
div1.innerHTML += "<small>Speed: </small><input type=\"number\" id=\"speeds1\" class=\"btn\" style=\"width: 20%;\" value=\"1000\">";
div1.innerHTML += "&nbsp;";
div1.innerHTML += "<input type=\"text\" id=\"names\" class=\"btn\" maxlength=\"35\" style=\"width: 30%;\" value=\"assssssssssssssssssssssssssssssssss\">";
div1.innerHTML += "&nbsp;";
div1.innerHTML += "<button id=\"pts\" class=\"btn btn-green\" style=\"width: 20%;\">ON & OFF</button>";
div1.innerHTML += "<br><br>";
div1.innerHTML += "<div class=\"newpartydiv\" style=\"text-align:center\"></div>";

var IntroGuide = '';
IntroGuide += "<center><h3>Zombs.io script border color</h3>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" id=\"button1\">CHANGE BORDER COLOR</button>";
IntroGuide += "<center><h3>Do you like Ninja's Mod</h3>";
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
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'deathrain';\">deathrain</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'ᵈᵉᵃᵗʰʳᵃᴵⁿ';\">ᵈᵉᵃᵗʰʳᵃᴵⁿ</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'ᵗᴵⁿʸ ᵗᴵᵐ';\">ᵗᴵⁿʸ ᵗᴵᵐ</button>";
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
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'Deathrain,Deathrain,Deathrain,Deathrain';\">Long Name 1</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'WOULDYOULIKETOEATTOAST';\">Long Name 2</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'Deathrain_IS_SAVAGE_YOU_CANT_LIE';\">Long Name 3</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>No Name</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '​';\">No Name</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Hope you like my mod!</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<span>Deathrain!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>Deathrain!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>Deathrain!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>Deathrain!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>Deathrain!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>Deathrain!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>Deathrain!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>Deathrain!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>Deathrain!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>Deathrain!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>Deathrain!</span>";

document.getElementsByClassName('hud-intro-guide')[0].innerHTML = IntroGuide;

//Footer Things!
var IntroFooter = '';
IntroFooter += "<center><h3>This is Deathrain's Mod I hope you have a Awesome Experience on this Mod Adventure Enjoy the Mods xD</h3>";

document.getElementsByClassName('hud-intro-footer')[0].innerHTML = IntroFooter;

//By: SAN
var IntroCornertopleft = '';
IntroCornertopleft += "<h3>By: Deathrain!</h3>";

document.getElementsByClassName('hud-intro-corner-top-left')[0].innerHTML = IntroCornertopleft;

//Notes and Things!
var IntroLeft = '';
IntroLeft += "<center><h3>Deathrain!!</h3>";
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
settingsHtml += "<button  id=\"opt\" class=\"btn btn-green\" style=\"width: 45%;\">OPEN A PARTY TAB</button>";
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
settingsHtml += "<button id=\"lbb\" class=\"btn btn-green\" style=\"width: 90%;\" onclick=\"leaderboard();leaderboard2();\">ALWAYS MAKE PARTY NAME WHATEVER LOL</button>";
settingsHtml += "<br><br>";
settingsHtml += "<button id=\"pub\" class=\"btn btn-green\" style=\"width: 90%;\" onclick=\"popoverlay();popoverlay2();\">ALWAYS MAKE PARTY NAME WHATEVER LOL</button>";
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

// HIDE & SHOW HUD POPUP OVERLAY
var button3 = document.getElementById("pub");
button3.addEventListener("click", popoverlay);

function popoverlay() {
  var change1 = document.getElementById("pub");
  var poplay = document.getElementById("hud-popup-overlay");
  if (poplay.style.display === "none" && change1.innerHTML == "SHOW POPUP OVERLAY") {
    poplay.style.display = "block";
    change1.innerHTML = "HIDE POPUP OVERLAY";
  } else {
    poplay.style.display = "none";
    change1.innerHTML = "SHOW POPUP OVERLAY";
  }
}

// HIDE & SHOW LEADERBOARD
var button4 = document.getElementById("lbb");
button4.addEventListener("click", leaderboard);

function leaderboard() {
  var change2 = document.getElementById("lbb");
  var x = document.getElementById("hud-leaderboard");
  if (x.style.display === "none" && change2.innerHTML == "SHOW LEADERBORED") {
    x.style.display = "block";
    change2.innerHTML = "HIDE LEADERBORED";
  } else {
    x.style.display = "none";
   change2.innerHTML = "SHOW LEADERBORED";
  }
}

// HIDE & SHOW LEFT BOTTOM HUD
var button5 = document.getElementById("lbh");
button5.addEventListener("click", leftbhud);

function leftbhud() {
  var change3 = document.getElementById("lbh");
  var mb = document.getElementsByClassName("hud-bottom-left")[0];
  if (mb.style.display === "none") {
    mb.style.display = "block";
    change3.innerHTML = "HIDE LEFT BOTTOM";
  } else {
    mb.style.display = "none";
   change3.innerHTML = "SHOW LEFT BOTTOM";
  }
}

// HIDE & SHOW RIGHT BOTTOM HUD
var button6 = document.getElementById("rbh");
button6.addEventListener("click", rightbhud);

function rightbhud() {
  var change4 = document.getElementById("rbh");
  var mb = document.getElementsByClassName("hud-bottom-right")[0];
  if (mb.style.display === "none") {
    mb.style.display = "block";
    change4.innerHTML = "HIDE RIGHT BOTTOM";
  } else {
    mb.style.display = "none";
   change4.innerHTML = "SHOW RIGHT BOTTOM";
  }
}

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

// OPEN A PARTY TAB
var button7 = document.getElementById("opt");
button7.addEventListener("click", partytab);

function partytab() {
  var url = document.getElementsByClassName('hud-party-share')[0].value;
  window.open(url);
}

// PARTY NAME TAG SPAM
var nametags = null;
var nametag = document.getElementById('names');
var speed1 = document.querySelector('input[id="speeds1"]');
var hpt = document.getElementsByClassName('hud-party-tag')[0];
var space = new Event("keyup");

var partyTags = function() {
  clearInterval(nametags);
  if (nametags !== null) {
    nametags = null;
  } else {
  var delay = speed1.value;
    nametags = setInterval(function() {
      hpt.value = '&#' +
        Math.random().toString(9).substring(9, 5) + ' ' + [nametag.value] + ' ' + '&#' +
        Math.random().toString(9).substring(9, 5);
      space.keyCode = 32;
      hpt.dispatchEvent(space);
    }, delay);
  }
}

speed1.addEventListener("input", partyTags);
var button8 = document.getElementById("pts");
button8.addEventListener("click", partyTags);

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