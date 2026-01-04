// ==UserScript==
// @name         Shell Shocker Theme + crosshair
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Become a KING!!
// @author       austin_is_cool_23
// @match        https://shellshock.io/
// @match        https://algebra.best/
// @match        https://eggcombat.com/*
// @match        https://shellshock.io/*
// @match        https://eggfacts.fun/*
// @match        https://biologyclass.club/*
// @match        https://egghead.institute/*
// @match        https://egg.dance/*
// @match        https://eggisthenewblack.com/*
// @match        https://mathfun.rocks/*
// @match        https://hardboiled.life/*
// @match        https://overeasy.club/*
// @match        https://zygote.cafe/*
// @match        https://mathdrills.info
// @match        https://eggsarecool.com/*
// @match        https://deadlyegg.com/*
// @match        https://mathgames.world/*
// @match        https://hardshell.life/*
// @match        https://violentegg.club/*
// @match        https://yolk.life/*
// @match        https://softboiled.club/*
// @match        https://scrambled.world/*
// @match        https://deathegg.world/*
// @match        https://violentegg.fun/*
// @license MIT
// @icon         https://st4.depositphotos.com/1000451/30856/i/1600/depositphotos_308568652-stock-photo-golden-egg-with-gold-crown.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441618/Shell%20Shocker%20Theme%20%2B%20crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/441618/Shell%20Shocker%20Theme%20%2B%20crosshair.meta.js
// ==/UserScript==

(function () {
  "use strict";

  window.mod = {
    loadGui: () => {},
    modMenu: {
      instruction: {},
      credit: {},
      crosshairSettings: {
        /* Change the type here to have the type be always set as a default */
        type: "None", // None, White Cross, Black Cross, White Circle, Black Circle, White Square, Black Square
        container: {
          label: {},
        },
      },
    },
  };

  window._utils = {};
  window._utils.requirelib = async function (url, global) {
    return new Promise(async function (resolve) {
      async function getCode() {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, false);
        xmlHttp.send(null);
        return xmlHttp.responseText;
      }
      let code = await getCode();

      if (global) {
        code += 'window["' + global + '"] = ' + global + ";";
      }
      let evaluateCode = new Function(code);
      evaluateCode();
      resolve("done");
    });
  };

  window._utils
    .requirelib("https://unpkg.com/guify@0.12.0/lib/guify.min.js")
    .then(() => {
      window.mod.loadGui();
    });

  const y = document.createElement("div");
  y.id = "crossY";
  const z = document.createElement("div");
  z.id = "crossZ";
  const w = document.createElement("div");
  w.id = "crossW";
  const x = document.createElement("div");
  x.id = "crossX";

  document.body.appendChild(y);
  document.body.appendChild(z);
  document.body.appendChild(w);
  document.body.appendChild(x);

  function updateCrosshair(type) {
    if (type == "None") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#FFFFFF;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#FFFFFF;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "White Cross") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:5px;height:17px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:17px;height:5px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:4px;height:16px;background-color:White;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:16px;height:4px;background-color:White;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Black Cross") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:5px;height:17px;background-color:White;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:17px;height:5px;background-color:White;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:4px;height:16px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:16px;height:4px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Red Cross") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:5px;height:17px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:17px;height:5px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:4px;height:16px;background-color:#ff0000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:16px;height:4px;background-color:#ff0000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Orange Cross") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:5px;height:17px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:17px;height:5px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:4px;height:16px;background-color:#ff9900;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:16px;height:4px;background-color:#ff9900;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Yellow Cross") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:5px;height:17px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:17px;height:5px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:4px;height:16px;background-color:#ffff00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:16px;height:4px;background-color:#ffff00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Green Cross") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:5px;height:17px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:17px;height:5px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:4px;height:16px;background-color:#00ff00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:16px;height:4px;background-color:#00ff00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Blue Cross") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:5px;height:17px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:17px;height:5px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:4px;height:16px;background-color:#0000ff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:16px;height:4px;background-color:#0000ff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Purple Cross") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:5px;height:17px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:17px;height:5px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:4px;height:16px;background-color:#ff00ff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:16px;height:4px;background-color:#ff00ff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "White Circle") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:9px;height:9px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:100px`;
      z.style.cssText = `width:8px;height:8px;background-color:#FFFFFF;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:100px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#FFFFFF;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#FFFFFF;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Red Circle") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:9px;height:9px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:100px`;
      z.style.cssText = `width:8px;height:8px;background-color:#ff0000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:100px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#ff0000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#ff0000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Orange Circle") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:9px;height:9px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:100px`;
      z.style.cssText = `width:8px;height:8px;background-color:#ff9900;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:100px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#ff9900;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#ff9900;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Yellow Circle") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:9px;height:9px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:100px`;
      z.style.cssText = `width:8px;height:8px;background-color:#ffff00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:100px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#ffff00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#ffff00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Green Circle") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:9px;height:9px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:100px`;
      z.style.cssText = `width:8px;height:8px;background-color:#00ff00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:100px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#00ff00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#00ff00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Blue Circle") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:9px;height:9px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:100px`;
      z.style.cssText = `width:8px;height:8px;background-color:#0000ff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:100px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#0000ff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#0000ff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Purple Circle") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:9px;height:9px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:100px`;
      z.style.cssText = `width:8px;height:8px;background-color:#ff00ff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:100px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#ff00ff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#ff00ff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Black Circle") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:9px;height:9px;background-color:#FFFFFF;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:100px`;
      z.style.cssText = `width:8px;height:8px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:100px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "White Square") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:9px;height:9px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:8px;height:8px;background-color:#ffffff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#ffffff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#ffffff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Red Square") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:9px;height:9px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:8px;height:8px;background-color:#ff0000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#ff0000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#ff0000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Orange Square") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:9px;height:9px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:8px;height:8px;background-color:#ff9900;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#ff9900;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#ff9900;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Yellow Square") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:9px;height:9px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:8px;height:8px;background-color:#ffff00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#ffff00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#ffff00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Green Square") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:9px;height:9px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:8px;height:8px;background-color:#00ff00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#00ff00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#00ff00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Blue Square") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:9px;height:9px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:8px;height:8px;background-color:#0000ff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#0000ff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#0000ff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Purple Square") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:9px;height:9px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:8px;height:8px;background-color:#ff00ff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#ff00ff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#ff00ff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Black Square") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:9px;height:9px;background-color:#FFFFFF;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:8px;height:8px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "White Long Width") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:17px;height:5px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:16px;height:4px;background-color:#FFFFFF;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Red Long Width") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:17px;height:5px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:16px;height:4px;background-color:#ff0000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Orange Long Width") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:17px;height:5px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:16px;height:4px;background-color:#ff9900;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Yellow Long Width") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:17px;height:5px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:16px;height:4px;background-color:#ffff00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "White Long Width") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:17px;height:5px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:16px;height:4px;background-color:#FFFFFF;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Green Long Width") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:17px;height:5px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:16px;height:4px;background-color:#00ff00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Blue Long Width") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:17px;height:5px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:16px;height:4px;background-color:#0000ff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Purple Long Width") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:17px;height:5px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:16px;height:4px;background-color:#ff00ff;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Black Long Width") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      y.style.cssText = `width:17px;height:5px;background-color:#FFFFFF;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      z.style.cssText = `width:16px;height:4px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      w.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:0.0000000001px;height:1px;background-color:#000000;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "--- RED ---") {
      alert(
        `You can not set this as your crosshair. \nPlease choose a crosshair that does not start with a "---".`
      );
    }
    if (type == "--- ORANGE ---") {
      alert(
        `You can not set this as your crosshair. \nPlease choose a crosshair that does not start with a "---".`
      );
    }
    if (type == "--- YELLOW ---") {
      alert(
        `You can not set this as your crosshair. \nPlease choose a crosshair that does not start with a "---".`
      );
    }
    if (type == "--- GREEN ---") {
      alert(
        `You can not set this as your crosshair. \nPlease choose a crosshair that does not start with a "---".`
      );
    }
    if (type == "--- BLUE ---") {
      alert(
        `You can not set this as your crosshair. \nPlease choose a crosshair that does not start with a "---".`
      );
    }
    if (type == "--- PURPLE ---") {
      alert(
        `You can not set this as your crosshair. \nPlease choose a crosshair that does not start with a "---".`
      );
    }
    if (type == "--- WHITE ---") {
      alert(
        `You can not set this as your crosshair. \nPlease choose a crosshair that does not start with a "---".`
      );
    }
    if (type == "--- BLACK ---") {
      alert(
        `You can not set this as your crosshair. \nPlease choose a crosshair that does not start with a "---".`
      );
    }
  }

  window.mod.loadGui = function () {
    const crosshairGui = new window.guify({
      title: "Crosshair Menu (Version 2)",
      theme: "dark",
      align: "left",
      width: 300,
      barMode: "none",
      opacity: 0.95,
      root: document.body,
      open: true,
    });

    crosshairGui.Register({
      type: "folder",
      label: "Instructions",
      open: false,
    });

    window.mod.modMenu.instruction = crosshairGui.Register({
      type: "text",
      label: "Credits",
      folder: "Instructions",
    });

    window.mod.modMenu.instruction.container.innerHTML = `<p style="color:yellow;font-size: small;margin-bottom: 0px;padding-left: 2.5px;">Thank you for installing and using Crosshair Mods for Shell Shockers!</p><p style="color:white;font-size: small;margin-top: 0px;padding-left: 2.5px;">1. Below are the settings for the mod as you can see.</p><p style="color:white;font-size: small;margin-top: 0px;padding-left: 2.5px;">2. Select the settings you would want to use, they will appear in the center of the screen.</p><p style="color:white;font-size: small;margin-top: 0px;padding-left: 2.5px;">3. You can not set to anything that start or end with a "---" as they are markers.</p><p style="color:white;font-size: small;margin-top: 0px;padding-left: 2.5px;">4. Take this mod into a game and try it out!</p><p style="color:orange;font-size: small;margin-top: 0px;padding-left: 2.5px;">[WARNING] : This has not been publicly allowed or disallowed in Shell League!</p><p style="color:red;font-size: small;margin-top: 0px;padding-left: 2.5px;">[NOTE] : Do not reproduce, reupload, or take this mod as your own as the mods worked hard on this. If you do please credit us as we worked on this, any modifications will be yours, but the framework will still be ours, due to reason of the creators.</p>`;

    crosshairGui.Register({
      type: "folder",
      label: "Crosshair Settings",
      open: false,
    });

    crosshairGui.Register({
      type: "select",
      label: "Types",
      object: window.mod.modMenu.crosshairSettings,
      property: "type",
      folder: "Crosshair Settings",
      options: [
        "None",
        "--- RED ---",
        "Red Cross",
        "Red Circle",
        "Red Square",
        "Red Long Width",
        "--- ORANGE ---",
        "Orange Cross",
        "Orange Circle",
        "Orange Square",
        "Orange Long Width",
        "--- YELLOW ---",
        "Yellow Cross",
        "Yellow Circle",
        "Yellow Square",
        "Yellow Long Width",
        "--- GREEN ---",
        "Green Cross",
        "Green Circle",
        "Green Square",
        "Green Long Width",
        "--- BLUE ---",
        "Blue Cross",
        "Blue Circle",
        "Blue Square",
        "Blue Long Width",
        "--- PURPLE ---",
        "Purple Cross",
        "Purple Circle",
        "Purple Square",
        "Purple Long Width",
        "--- WHITE ---",
        "White Cross",
        "White Circle",
        "White Square",
        "White Long Width",
        "--- BLACK ---",
        "Black Cross",
        "Black Circle",
        "Black Square",
        "Black Long Width",
      ],
      onChange: updateCrosshair,
    });

    window.mod.modMenu.credit = crosshairGui.Register({
      type: "text",
      label: "Credits",
    });

    window.mod.modMenu.credit.container.innerHTML = `<p style="color:gray;font-size: medium;margin-bottom: 0px;padding-left: 15px;">Made by Sharkb. & DeathB.</p><p style="color:gray;font-size: medium;margin-top: 0px;padding-left: 15px;">With the help of TDStuart!</p>`;

    let titleTextElm = crosshairGui.panel.panel.childNodes[0];
    titleTextElm.style.color = "rgb(255, 196, 0)";
    titleTextElm.style.fontWeight = "bold";
  };
})();


let css =
    `#ss_background, #gameDescription, .load_screen, #progress-container { background: url('https://st4.depositphotos.com/1000451/30856/i/1600/depositphotos_308568652-stock-photo-golden-egg-with-gold-crown.jpg') !important; position: absolute !important; background-size: cover !important; background-repeat: no-repeat !important; background-position: center !important; width: 100% !important; height: 100% !important; } div.media-tabs-content.front_panel.roundme_sm { background: url('https://media.istockphoto.com/photos/abstract-gold-background-picture-id524653165?k=20&m=524653165&s=170667a&w=0&h=DeYFDmISZFLn_SKf6AMayUE3iqI6dinWeETuH7ik7To=')!important; background-size: cover !important;} #equip_sidebox { border: var(--ss-space-sm) solid black} .front_panel, #equip_sidebox { background: url('https://media.istockphoto.com/photos/abstract-gold-background-picture-id524653165?k=20&m=524653165&s=170667a&w=0&h=DeYFDmISZFLn_SKf6AMayUE3iqI6dinWeETuH7ik7To='); background-size: cover !important;} .front_panel { border: var(--ss-space-sm) solid black; } .ss_field, .ss_select { background: white; border: 1px solid black; color: black;} .btn_blue, .btn_green, .ss_bigtab, .ss_bigtab.selected, .button_blue { background: gold !important; border: 0.2em solid black !important; color: black !important; } .btn_yolk, .btn_red, .btn_blue1 { background: black !important; border: 0.2em solid black !important; color: gold !important; } .morestuff { background-color: black !important; border: 0.2em solid black !important; } .ss_bigtab:hover { color: black !important; } #stat_item { background: url('https://media.istockphoto.com/photos/abstract-gold-background-picture-id524653165?k=20&m=524653165&s=170667a&w=0&h=DeYFDmISZFLn_SKf6AMayUE3iqI6dinWeETuH7ik7To='); } #stat_item h4, .stat_stat { color: black; } .news_item:nth-child(odd), .stream_item:nth-child(odd) { background: url('https://cdn.discordapp.com/attachments/811268272418062359/908381929164910642/2Q.png'); } .news_item:nth-child(even), .stream_item:nth-child(even) { background: url('https://cdn.discordapp.com/attachments/811268272418062359/908381929164910642/2Q.png'); } .stream_item:hover, .news_item.clickme:hover { background: gold !important; } #weapon_select:nth-child(1n+0) .weapon_img { background: url('https://media.istockphoto.com/photos/abstract-gold-background-picture-id524653165?k=20&m=524653165&s=170667a&w=0&h=DeYFDmISZFLn_SKf6AMayUE3iqI6dinWeETuH7ik7To=')!important; border: 3px solid black!important; } #popupTipDay #weapon_select:nth-child(1n+0) .weapon_img { background: url('https://media.istockphoto.com/photos/abstract-gold-background-picture-id524653165?k=20&m=524653165&s=170667a&w=0&h=DeYFDmISZFLn_SKf6AMayUE3iqI6dinWeETuH7ik7To=')!important; border: 3px solid black!important; } h3, h1, h2, h4, h5, h6, .front_panel h3, #equip.equipped_slots h3, #item_grid h3 { color: black !important; } label, .label { color: black !important; } .egg_count { color: black; } .account_eggs { background: url('https://media.istockphoto.com/photos/abstract-gold-background-picture-id524653165?k=20&m=524653165&s=170667a&w=0&h=DeYFDmISZFLn_SKf6AMayUE3iqI6dinWeETuH7ik7To='); } #equip_equippedslots .equip_item, #equip_itemtype .selected, #equip_equippedslots .equip_item:hover { background: url('https://media.istockphoto.com/photos/abstract-gold-background-picture-id524653165?k=20&m=524653165&s=170667a&w=0&h=DeYFDmISZFLn_SKf6AMayUE3iqI6dinWeETuH7ik7To='); background-color: url('https://media.istockphoto.com/photos/abstract-gold-background-picture-id524653165?k=20&m=524653165&s=170667a&w=0&h=DeYFDmISZFLn_SKf6AMayUE3iqI6dinWeETuH7ik7To='); border: 0.33em solid black; } #equip_grid .store_item, #equip_grid .highlight, #equip_grid .store_item:hover { background: url('https://media.istockphoto.com/photos/abstract-gold-background-picture-id524653165?k=20&m=524653165&s=170667a&w=0&h=DeYFDmISZFLn_SKf6AMayUE3iqI6dinWeETuH7ik7To='); border: 0.33em solid black; color: black; } .popup_lg, .popup_sm { background: url('https://wallpaperaccess.com/full/3375439.jpg'); border: 0.33em solid black; } .box_blue2 { background-color: transparent; } .pause-bg { background: rgba(0,0,0,0.3) !important; } #maskmiddle { background: url('../img/scope.png') center center no-repeat !important; background-size: contain !important; width: 100vh !important; height: 100vh !important; } .crosshair.normal { background: gold; } .crosshair { border: 0.05em solid black; } .crosshair.powerfull { background: gold; } #createPrivateGame .roundme_sm, #settingsPopup .roundme_sm, #pickServerPopup .roundme_sm, #adBlockerVideo .roundme_sm { background: transparent !important }`
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`)

    (function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
	--ss-transparent: #00000000;
	--ss-black: #000;
	--ss-white: #8cb8ff; /*White Text*/
	--ss-offwhite: #FFF3E4;
	--ss-yellow0:#000000;
	--ss-yellow: #171717;
	--ss-yolk0: #171717;
	--ss-yolk: #000000; /*Yellow Buttons*/
	--ss-yolk2: #0044b3;
	--ss-red0: #000000;
	--ss-red: #000000;
	--ss-red2: #000000;
	--ss-red-bright: #000000;
	--ss-pink: #000000;
	--ss-pink1: #000000;
	--ss-pink-light: #000000;
	--ss-brown: #000147;
	--ss-blue00: #003b75;
	--ss-blue0: #ffffff;
	--ss-blue1: #0407b8;
	--ss-blue2: #003b75;
	--ss-blue3: #000123; /*Lighter Box Borders*/
	--ss-blue4: #003b75; /*Blue Subtitles, Darker Box Borders*/
	--ss-blue5: #171717;
	--ss-green0: #000000;
	--ss-green1: #000000;
	--ss-green2: #000000;
	--ss-orange1: #595959;
	--ss-vip-gold: linear-gradient(to right, #0004ff, #0003c9, #0002a1, #000170, #000147);
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #4a4dff;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay: url("https://st4.depositphotos.com/1000451/30856/i/1600/depositphotos_308568652-stock-photo-golden-egg-with-gold-crown.jpg"); /*Main Background*/
	--ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2));
	--ss-blueblend1: linear-gradient(#349ec1, #5fbad8); /*Some Box fill colors*/
	--ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue2));
	--ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #389EC0);
	--ss-fieldbg: linear-gradient(#91CADB, #000000, #000000, #000000, #000000);
	--ss-white-60: rgba(255,255,255,.6);
	--ss-white-90: rgba(255,255,255,.9);

	--ss-me-player-bg: rgba(247,149,32,.8);
	--ss-them-blue-bg: rgba(0,66,87,.8);
	--ss-them-blue-color: #003b75;
	--ss-them-red-bg:  rgb(133,0,0,.8);
	--ss-them-red-color: #ff4145
	--ss-me-red-bg: rgba(255,65,69,.8);
	--ss-me-blue-bg: rgb(94,187,217,.8);
}
</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();

(function () {
    function hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        } : null;
    }

    window.data = {
        set scene(e) { this.gameScene = e },
        gameScene: null,
        skyColor: "#FFFFFF",
        mesh: null,
        updateSky: function () {
            if (!this.mesh && this.gameScene) {
                this.mesh = this.gameScene.getMeshByID("skyBox");
            }
            if (this.mesh) {

                const color = hexToRgb(this.skyColor);
                this.mesh.material.emissiveColor.r = color.r;
                this.mesh.material.emissiveColor.g = color.g;
                this.mesh.material.emissiveColor.b = color.b;

                this.mesh.material.reflectionTexture = null;

            }
        }
    }

    window.XMLHttpRequest = class extends window.XMLHttpRequest {
        constructor() {
            super(...arguments);
        }
        open() {
            if (arguments[1] && arguments[1].includes("src/shellshock.js")) {
                this.scriptMatch = true;
            }

            super.open(...arguments);
        }
        get response() {

            if (this.scriptMatch) {
                let responseText = super.response;

                let match = responseText.match(/([A-z][A-z])\.fogDensity=.01\);/);
                if (match) responseText = responseText.replace(match[0], match[0] + `data.scene=${match[1]};`);
                return responseText;
            }
            return super.response;
        }
    };


    let html = [`<div><p>Sky Color: <input type="color" value="#0000ff" id="colorPicker"></div>`].join();


    let interval = setInterval(function () {
        let pauseButtons = document.getElementById("pauseButtons");
        if (pauseButtons) {
            clearInterval(interval);
            let skyColorDiv = document.createElement("div");
            skyColorDiv.innerHTML = '<br>' + html;
            pauseButtons.appendChild(skyColorDiv);

            let colorPicker = document.getElementById("colorPicker");

            colorPicker.addEventListener("input", function () {
                data.skyColor = this.value;
                data.updateSky()
            });

        }

    }, 1000);
}())