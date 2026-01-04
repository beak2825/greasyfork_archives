// ==UserScript==
// @name         Zombs.io ( Auto Heal + Speed Run + Party Spam + More )
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Zombs.io auto heal + speed run + party spam + More
// @author       I_HAVE_A_REALLY_LONG_NICKNAME
// @match        *://zombs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372969/Zombsio%20%28%20Auto%20Heal%20%2B%20Speed%20Run%20%2B%20Party%20Spam%20%2B%20More%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/372969/Zombsio%20%28%20Auto%20Heal%20%2B%20Speed%20Run%20%2B%20Party%20Spam%20%2B%20More%20%29.meta.js
// ==/UserScript==

window.addEventListener("onkeydown", keyDown, true);
window.addEventListener("keydown", keyDown);

function keyDown(e) {
  switch (e.keyCode) {
    case 188:
      speedrun();
      speedrun2();
      break;
    case 189:
      spampartys();
      spampartys2();
      break;
    case 187:
      partyTags();
      break;
  }
}

// REMOVE ADS
document.querySelectorAll('.ad-unit').forEach(function(a) {
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

// INTRO STYLE CODES INNERHTML
var IntroGuide = '';

IntroGuide += "<center><h3>Zombs.io long nicknames</h3>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"name1();\">NAME [1]</button>";
IntroGuide += "&nbsp;";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"name2();\">NAME [2]</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"name3();\">NAME [3]</button>";
IntroGuide += "&nbsp;";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"name4();\">NAME [4]</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"name5();\">NAME [5]</button>";
IntroGuide += "&nbsp;";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"name6();\">NAME [6]</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 90%;\" onclick=\"name0();\">HIDDEN NICKNAME</button>";
IntroGuide += "<br>";
IntroGuide += "<center><h3>Zombs.io border color</h3>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 90%;\" id=\"cbc1\">BORDER COLOR</button>";

document.getElementsByClassName('hud-intro-guide')[0].innerHTML = IntroGuide;

// LONG NINKNAMES
window.name1 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = 'I_HAVE_A_REALLY_LONG_NICKNAME';
};
window.name2 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = 'assssssssssssssssssssssssssss';
};
window.name3 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = '\u0BF5\u0BF5\u0BF5\u0BF5\u0BF5\u0BF5\u0BF5\u0BF5\u0BF5';
};
window.name4 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = '\u0BCC\u0BCC\u0BCC\u0BCC\u0BCC\u0BCC\u0BCC\u0BCC\u0BCC';
};
window.name5 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = 'I&#10L&#10O&#10V&#10E&#10U';
};
window.name6 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = 'COMING SOON!';
};
window.name0 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = 'This has been removed';
};

// SETTINGS BUTTON & CONTROLS INNERHTML
var settingsHtml = '';

settingsHtml += "<div style=\"text-align:center\">";
settingsHtml += "<label><span>zombs.io script buttons & settings</span></label>";
settingsHtml += "<button id=\"rwp\" class=\"btn btn-green\" style=\"width: 45%;\">SPEED RUN OFF</button>";
settingsHtml += "&nbsp;";
settingsHtml += "<button id=\"sap\" class=\"btn btn-green\" style=\"width: 45%;\">SPAM PARTYS OFF</button>";
settingsHtml += "<br><br>";
settingsHtml += "<button id=\"cbc2\" class=\"btn btn-green\" style=\"width: 45%;\">BORDER COLOR</button>";
settingsHtml += "&nbsp;";
settingsHtml += "<button  id=\"opt\" class=\"btn btn-green\" style=\"width: 45%;\">OPEN A PARTY TAB</button>";
settingsHtml += "<br><br>";
settingsHtml += "<label><span>zombs.io script hide and show</span></label>";
settingsHtml += "<button id=\"lbb\" class=\"btn btn-green\" style=\"width: 45%;\">HIDE LEADERBORED</button>";
settingsHtml += "&nbsp;";
settingsHtml += "<button id=\"pub\" class=\"btn btn-green\" style=\"width: 45%;\">HIDE POPUP OVERLAY</button>";
settingsHtml += "<br><br>";
settingsHtml += "<button id=\"lbh\" class=\"btn btn-green\" style=\"width: 45%;\">HIDE LEFT BOTTOM</button>";
settingsHtml += "&nbsp;";
settingsHtml += "<button id=\"rbh\" class=\"btn btn-green\" style=\"width: 45%;\">HIDE RIGHT BOTTOM</button>";
settingsHtml += "<hr style=\"color: rgba(255, 255, 255);\">";

// SETTINGS SHORTCUTS & CONTROLS INNERHTML
settingsHtml += "<label>";
settingsHtml += "<span>zombs.io script shortcuts & controls</span>";
settingsHtml += "<ul class=\"hud-settings-controls\">";
settingsHtml += "<li>Press '<strong><</strong>' to start speed run.</strong></li>";
settingsHtml += "<li>Press '<strong><</strong>' to stop speed run.</strong></li>";
settingsHtml += "<li>Press '<strong>-</strong>' to start spam partys.</strong></li>";
settingsHtml += "<li>Press '<strong>-</strong>' to stop spam partys.</strong></li>";
settingsHtml += "<li>Press '<strong>R</strong>' to buy health potions.</strong></li>";
settingsHtml += "<li>Press '<strong>F</strong>' to use health potions.</strong></li>";
settingsHtml += "<li>Press '<strong>+</strong>' to start party tag change.</strong></li>";
settingsHtml += "<li>Press '<strong>+</strong>' to stop party tag change.</strong></li>";
settingsHtml += "<li>More coming soon.</strong></li>";
settingsHtml += "</ul>";
settingsHtml += "</label>";
settingsHtml += "<hr style=\"color: rgba(255, 255, 255);\">";

// SETTINGS FEATURES INNERHTML
settingsHtml += "<label>";
settingsHtml += "<span>zombs.io script features</span>";
settingsHtml += "<ul class=\"hud-settings-controls\">";
settingsHtml += "<li>Auto heal player & pet at 70% health</li>";
settingsHtml += "<li>Speed run with pet</li>";
settingsHtml += "<li>Spam all open partys</li>";
settingsHtml += "<li>Max player nickname</li>";
settingsHtml += "<li>Max party tag name</li>";
settingsHtml += "<li>New style</li>";
settingsHtml += "<li>Hide or show divs</li>";
settingsHtml += "<li>Change border color</li>";
settingsHtml += "<li>More coming soon.</li>";
settingsHtml += "</ul></label></div>";

document.getElementsByClassName("hud-settings-grid")[0].innerHTML = settingsHtml;

// STYLE CODES
function stylecodes() {
  var ael = document.querySelectorAll('input');
  for (var i2 = 0; i2 < ael.length; i2++) {
    ael[i2].addEventListener("keydown", keyDown, false);
  }
  document.getElementById('hud-menu-party').style.width = "610px";
  document.getElementById('hud-menu-party').style.height = "550px";
  document.getElementsByClassName('hud-intro-form')[0].style.width = "325px";
  document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
  document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);
  document.getElementsByClassName("hud-intro-corner-bottom-right")[0].remove();
  document.getElementsByClassName("hud-intro-corner-bottom-left")[0].remove();
  document.getElementsByClassName("hud-day-night-overlay")[0].remove();
  document.getElementsByClassName("hud-party-joining")[0].remove();
  document.getElementsByClassName("hud-respawn-share")[0].remove();
  document.getElementsByClassName("hud-intro-footer")[0].remove();
}

stylecodes();

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

// OPEN A PARTY TAB
var button7 = document.getElementById("opt");
button7.addEventListener("click", partytab);

function partytab() {
  var url = document.getElementsByClassName('hud-party-share')[0].value;
  window.open(url);
}

// CHANGE DIV BORDERCOLOR
var button1 = document.getElementById("cbc1");
var button2 = document.getElementById("cbc2");
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

// SPEED RUN WITH PET
var button9 = document.getElementById("rwp");
button9.addEventListener("click", speedrun);
button9.addEventListener("click", speedrun2);

var petrun = null;

function speedrun() {
  clearInterval(petrun);
  if (petrun !== null) {
    petrun = null;
  } else {
    petrun = setInterval(function() {
      equip = document.getElementsByClassName('hud-shop-actions-equip');
      for (var i = 0; i < equip.length; i++) {
        var pets = equip[i];
        pets.click();
      }
    }, 0); // SPEED FOR RUN
  }
}

function speedrun2() {
  var change5 = document.getElementById("rwp");
  if (change5.innerHTML == "SPEED RUN OFF") {
    change5.innerHTML = "SPEED RUN ON";
  } else {
    change5.innerHTML = "SPEED RUN OFF";
  }
}

// SPAM ALL OPEN PARTYS
var button10 = document.getElementById("sap");
button10.addEventListener("click", spampartys);
button10.addEventListener("click", spampartys2);

var partyspam = null;

function spampartys() {
  clearInterval(partyspam);
  if (partyspam !== null) {
    partyspam = null;
  } else {
    partyspam = setInterval(function() {
      partys = document.getElementsByClassName('hud-party-link');
      for (var i = 0; i < partys.length; i++) {
        var link = partys[i];
        link.click();
      }
      confirm = document.getElementsByClassName('btn btn-green hud-confirmation-accept');
      for (var i2 = 0; i2 < confirm.length; i2++) {
        var accept = confirm[i2];
        accept.click();
      }
    }, 0); // SPEED FOR PARTY SPAM
  }
}

function spampartys2() {
  var change6 = document.getElementById("sap");
  var change7 = document.getElementsByClassName("newpartydiv")[0];
  if (change6.innerHTML == "SPAM PARTYS OFF") {
    change6.innerHTML = "SPAM PARTYS ON";
    change7.innerHTML = "SPAM PARTYS ON";
  } else {
    change6.innerHTML = "SPAM PARTYS OFF";
    change7.innerHTML = "SPAM PARTYS OFF";
  }
}

// AUTO HEAL PLAYER & PET
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