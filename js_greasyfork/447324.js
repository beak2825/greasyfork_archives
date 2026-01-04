// ==UserScript==
// @name         Alo - csgoclicker.net (OP AUTO FARM, AUTO MISSIONS, AUTO CASES HACK)
// @namespace    http://tampermonkey.net/
// @version      v0.0.1
// @description  OP AUTO FARM, AUTO SELL, AUTO MISSIONS, AUTO CASE, ETC...
// @author       You
// @license      MIT
// @match        https://csgoclicker.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csgoclicker.net
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// @downloadURL https://update.greasyfork.org/scripts/447324/Alo%20-%20csgoclickernet%20%28OP%20AUTO%20FARM%2C%20AUTO%20MISSIONS%2C%20AUTO%20CASES%20HACK%29.user.js
// @updateURL https://update.greasyfork.org/scripts/447324/Alo%20-%20csgoclickernet%20%28OP%20AUTO%20FARM%2C%20AUTO%20MISSIONS%2C%20AUTO%20CASES%20HACK%29.meta.js
// ==/UserScript==

(function () {
  window.pane = new Tweakpane.Pane();
  pane.element.parentElement.style.zIndex = "100000";
  var style = document.createElement('style');
  style.innerHTML = `:root {
  --tp-base-background-color: hsla(0, 1%, 13%, 1.00);
  --tp-base-shadow-color: hsla(9, 62%, 60%, 1.00);
  --tp-button-background-color: hsla(0, 0%, 80%, 1);
  --tp-button-background-color-active: hsla(0, 0%, 100%, 1);
  --tp-button-background-color-focus: hsla(0, 0%, 95%, 1);
  --tp-button-background-color-hover: hsla(0, 0%, 85%, 1);
  --tp-button-foreground-color: hsla(0, 0%, 0%, 0.8);
  --tp-container-background-color: hsla(0, 0%, 0%, 0.3);
  --tp-container-background-color-active: hsla(0, 0%, 0%, 0.6);
  --tp-container-background-color-focus: hsla(0, 0%, 0%, 0.5);
  --tp-container-background-color-hover: hsla(0, 0%, 0%, 0.4);
  --tp-container-foreground-color: hsla(0, 0%, 100%, 0.5);
  --tp-groove-foreground-color: hsla(0, 0%, 0%, 0.2);
  --tp-input-background-color: hsla(0, 0%, 0%, 0.3);
  --tp-input-background-color-active: hsla(0, 0%, 0%, 0.6);
  --tp-input-background-color-focus: hsla(0, 0%, 0%, 0.5);
  --tp-input-background-color-hover: hsla(0, 0%, 0%, 0.4);
  --tp-input-foreground-color: hsla(0, 0%, 100%, 0.5);
  --tp-label-foreground-color: hsla(0, 0%, 100%, 0.5);
  --tp-monitor-background-color: hsla(0, 0%, 0%, 0.3);
  --tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.3);
}`;
  document.body.append(style);
    window.important = {"76561199015314454": {color: "red", desc: "One of my good friends."}, "76561199203527908": {color: "blue", desc: "Another one of my good friends."}, "76561199078627812": {color: "lightgreen", desc: "<b>The developer.</b>", desccolor: "lightgreen"}}
  pane.title = "|| ALO ||";
  window.chea = pane.addFolder({
    title: "Alo",
    expanded: !0
  });
  var autocase_ = chea.addFolder({
    title: "Auto Case",
    expanded: !1
  });
  var sellall_ = chea.addFolder({
    title: "Selling",
    expanded: !1
  });
  var autosel = sellall_.addInput({
    autosell: !1
  }, 'autosell', {
    label: "Auto Sell"
  });
  var sellall = sellall_.addButton({
    title: "Sell All"
  });
  sellall.on('click', function () {
    Links[0].click();
    if (document.getElementsByClassName('invItems vb-content')[0].children) {
      for (var i = 0; i < document.getElementsByClassName('invItems vb-content')[0].children.length; ++i) {
        document.getElementsByClassName('invItems vb-content')[0].children[i].click();
        setTimeout(() => {
          document.getElementsByClassName('inspectSellItem btn')[0].click()
        }, 100)
      }
    }
  });
  setInterval(() => {
    if (document.getElementsByClassName('invItems vb-content')[0] && pane.exportPreset().autosell) {
      for (var i = 0; i < document.getElementsByClassName('invItems vb-content')[0].children.length; ++i) {
        document.getElementsByClassName('invItems vb-content')[0].children[i].click();
        setTimeout(() => {
          document.getElementsByClassName('inspectSellItem btn')[0].click()
        }, 100)
      }
    }
  }, 0);
  var autocase = autocase_.addInput({
    case: !1
  }, "case", {
    label: "Auto Case",
  });
  var Links = document.getElementsByClassName('navLink');
  autocase.on("change", function () {
    if (pane.exportPreset().case) {
      Links[0].click();
      alert("Pick a case")
    }
  });
  window.userDat = null;
  window.fetchUserData = function (Id) {
    fetch("https://api.csgoclicker.net/v1/profile/" + (Id), {
      credentials: "include"
    }).then(function (t) {
      return t.json()
    }).then(function (t) {
      userDat = t
    });
    return userDat
  }
  var automission_ = chea.addFolder({
    title: "Auto Mission",
    expanded: !1
  });
  var currentNam = '';
  var j = !0;
  var isadmin = 'UNKNOWN';
  var ismod = 'UNKNOWN';
  var isalpha = 'UNKNOWN';
  var isvip = 'UNKNOWN';
  var isdev = 'UNKNOWN';
  var elem = document.createElement('div');
  var automission = automission_.addInput({
    mission: !1
  }, "mission", {
    label: "Auto Mission",
  });
  var am2 = automission_.addInput({
    sss: !1
  }, "sss", {
    label: "AFK Mission"
  });
  automission_.on('change', function () {
    Links[1].click();
    setTimeout(() => {
      if (pane.exportPreset().sss) {
        if (document.getElementsByClassName('missions')[0].children.length != 3) {
          for (var i = 0; i < document.getElementsByClassName('missions')[0].children.length - (document.getElementsByClassName('missions')[0].children.length - 5); ++i) {
            if (document.getElementsByClassName('missions')[0].children[i]) document.getElementsByClassName('missions')[0].children[i].remove()
          }
        }
      }
    }, 1000)
  });
  var confi = automission_.addFolder({
    title: "Config",
    expanded: !1
  });
  var redeem = confi.addInput({
    redeem: !0
  }, "redeem", {
    label: "Redeem",
  });
  var start = confi.addInput({
    start: !0
  }, "start", {
    label: "Auto Start",
  });
  var confi2 = autocase_.addFolder({
    title: "Config",
    expanded: !1
  });
  var sell = confi2.addInput({
    sell: !1
  }, "sell", {
    label: "Sell",
  });
  var stopwhenmoneyreach1 = confi.addInput({
    money1: "100000.00"
  }, "money1", {
    label: "Stop When"
  });
  var stopwhenmoneyreach = confi2.addInput({
    money: "0.00"
  }, "money", {
    label: "Stop When",
  });
  automission.on("change", function () {
    if (pane.exportPreset().mission) {
      document.querySelector("#interface > div > div.navbarComponent.noselect > div.mainLinks > div:nth-child(2)").click();
      if (document.getElementsByClassName("sidePanel")[0].children[0].children[1].className == 'noMission') {
        window.Done = 0
      } else if (document.getElementsByClassName("sidePanel")[0].children[0].children[1].className == 'activeMissions') {
        window.Done = document.getElementsByClassName("sidePanel")[0].children[0].children[1].children.length
      }
    }
  });
  var stopwhencashreaches = pane.exportPreset().money;
  window.cash = "";

  function Do(el) {
    if (pane.exportPreset().start) {
      setTimeout(function () {
        if (Done < 3) {
          document.getElementsByClassName("startOverlay")[el].click();
          Done += 1
        }
      }, 500)
    }
  }
  window.Done = 0;
  setInterval(() => {
    if (pane.exportPreset().mission && parseFloat(pane.exportPreset().money1) > parseFloat(cash)) {
      ActiveMissions = document.getElementsByClassName("sidePanel")[0].children[0].children[1].children.length;
      if (document.getElementsByClassName("sidePanel")[0].children[0].children[1].className == "activeMissions" || document.getElementsByClassName("sidePanel")[0].children[0].children[1].className == "noMissions") {
        if (document.getElementsByClassName("sidePanel")[0].children[0].children[1].children.length > 0) {
          for (var c = 0; c < document.getElementsByClassName("btn").length; ++c) {
            if (!document.getElementsByClassName("btn")[c].className.includes("locked")) {
              if (Done < 4 && pane.exportPreset().redeem) {
                document.getElementsByClassName("btn")[c].click();
                window.Done -= 1
              }
            }
          }
          for (var i = 0; i < document.getElementsByClassName("startOverlay").length; ++i) {
            Do(i)
          }
        } else {}
      }
    }
    if (pane.exportPreset().case) {
      if (parseFloat(cash.replaceAll(",", "")) > parseFloat(pane.exportPreset().money.replaceAll(",", "")) - 0.1) {
        if (document.getElementsByClassName("openCase btn")[0]) {
          if (document.getElementsByClassName("openCase btn")[0].className.includes("locked")) {
            document.getElementsByClassName("buyCase btn navy center")[0].click()
          } else {
            if (!document.getElementsByClassName("openCase btn")[0].className.includes("pressed")) {
              document.getElementsByClassName("openCase btn")[0].click()
            } else {
              if (pane.exportPreset().sell) document.getElementsByClassName("inspectSellItem btn")[0].click()
            }
          }
        }
      }
    }
    if (pane.exportPreset().sss) {
      if (document.getElementsByClassName('btn') && document.getElementsByClassName('missions')[0]) {
        for (var gg = 0; gg < document.getElementsByClassName('btn').length; ++gg) {
          if (pane.exportPreset().redeem) document.getElementsByClassName('btn')[gg].click()
        }
        for (var ff = 0; ff < document.getElementsByClassName('missions')[0].children.length; ++ff) {
          if (pane.exportPreset().start) {
            if (document.getElementsByClassName('activeMissions')[0]) {
              if (document.getElementsByClassName('activeMissions')[0].children.length < 3) {
                document.getElementsByClassName('missions')[0].children[ff].children[0].click()
              }
            } else if (document.getElementsByClassName('noMissions')[0]) {
              document.getElementsByClassName('missions')[0].children[ff].children[0].click()
            }
          }
        }
      }
    }
    elem.innerHTML = `<hr><p class="subText">Admin: ${isadmin}</p><p class="subText">Moderator: ${ismod}</p><p class="subText">Alpha: ${isalpha}</p><p class="subText">VIP: ${isvip}</p><p class="subText">Developer: ${isdev}</p>`;
    if (document.getElementsByClassName('profileContainer')[0] && document.getElementsByClassName('steamID subText')[0]) {
      if (j) {
        j = !1;
        currentNam = document.getElementsByClassName('steamID subText')[0] ? document.getElementsByClassName('steamID subText')[0].innerText : '';
          if (Object.keys(important).includes(currentNam)) {
             document.getElementsByClassName('profileContainer')[0].getElementsByClassName('name')[0].style.color = important[currentNam].color;
document.getElementsByClassName('profileContainer')[0].getElementsByClassName('name')[0].style.filter = 'drop-shadow(0px 0px 7px '+important[currentNam].color+')';
              if (important[currentNam].desc) document.getElementsByClassName('profileContainer')[0].getElementsByClassName('showcase')[0].style.marginTop='1%'; var b = document.createElement('div'); b.innerHTML = '<div class="__descr" style="padding: 5px;margin-top: 5px;border: 1px solid white;"><p style="font-size: 11px;">'+important[currentNam].desc+'</p></div>'; document.getElementsByClassName('profileContainer')[0].insertBefore(b, document.getElementsByClassName('profileContainer')[0].getElementsByClassName('showcase')[0]);
              setTimeout(()=>{
              if (important[currentNam].desccolor) document.getElementsByClassName('profileContainer')[0].getElementsByClassName('__descr')[0].style.color = important[currentNam].desccolor; document.getElementsByClassName('profileContainer')[0].getElementsByClassName('__descr')[0].style.borderColor = important[currentNam].desccolor; document.getElementsByClassName('profileContainer')[0].getElementsByClassName('__descr')[0].style.borderColor = important[currentNam].desccolor; document.getElementsByClassName('profileContainer')[0].getElementsByClassName('__descr')[0].style.filter = "drop-shadow(0px 0px 6px "+important[currentNam].desccolor+")";
              },1900);
              }
        document.getElementsByClassName('steamID subText')[0] ? fetchUserData(document.getElementsByClassName('steamID subText')[0].innerText) : null
        document.getElementsByClassName('steamID subText')[0] ? fetchUserData(document.getElementsByClassName('steamID subText')[0].innerText) : null;
        setTimeout(() => {
            if (document.getElementsByClassName('steamID subText')[0]) {
          isadmin = userDat.permissions.admin;
          ismod = userDat.permissions.moderator;
          isalpha = userDat.permissions.alpha;
          isvip = userDat.permissions.vip;
          isdev = userDat.permissions.developer
            }
        }, 500);
        document.getElementsByClassName('profileContainer')[0].append(elem)
      }
      if (document.getElementsByClassName('steamID subText')[0] && document.getElementsByClassName('steamID subText')[0].innerText != currentNam) {
        currentNam = document.getElementsByClassName('steamID subText')[0].innerText;
        j = !0
      }
    } else {
      j = !0
    }
    if (document.getElementsByClassName("wallet")[0]) cash = document.getElementsByClassName("wallet")[0].children[1].innerText;
  }, 1000);
    var ALLOW_DRAG = false;
var isdrag = false;
dragElement(document.querySelector("body > div.tp-dfwv > div > button"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
      if (ALLOW_DRAG) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
      isdrag = false;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
      }
  }

  function elementDrag(e) {
      if (ALLOW_DRAG) {
      isdrag = true;
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
      document.querySelector("body > div.tp-dfwv").style.top = (document.querySelector("body > div.tp-dfwv").offsetTop - pos2) + "px";
    document.querySelector("body > div.tp-dfwv").style.left = (document.querySelector("body > div.tp-dfwv").offsetLeft - pos1) + "px";
  }
  }

  function closeDragElement() {
      if (isdrag) {
    document.querySelector("body > div.tp-dfwv > div > button").click();
      }
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
document.addEventListener('keydown', function(e) {
    if (e.key.toLowerCase() == 'y') {
        document.querySelector("body > div.tp-dfwv").style.filter = 'hue-rotate(329deg)';
        ALLOW_DRAG = true;
    }
});
document.addEventListener('keyup', function(e) {
    if (e.key.toLowerCase() == 'y') {
        document.querySelector("body > div.tp-dfwv").style.filter = '';
        ALLOW_DRAG = false;
    }
});
document.addEventListener('keypress', function(e) {

});
})()
