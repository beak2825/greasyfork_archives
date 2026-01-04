// ==UserScript==
// @name         Various Crosshairs for FPS Websites
// @version      1.0
// @description  Crosshair for fps games (shellshock.io, Kirka.io, Krunker.io, etc
// @author       lernxyz (youtube.com/@lernxyz)
// @match    https://shellshock.io/*
// @match	 https://kirka.io/*
// @match 	 https://krunker.io/*
// @grant        none
// @namespace https://greasyfork.org/en/users/1402378-lernxyz
// @downloadURL https://update.greasyfork.org/scripts/518836/Various%20Crosshairs%20for%20FPS%20Websites.user.js
// @updateURL https://update.greasyfork.org/scripts/518836/Various%20Crosshairs%20for%20FPS%20Websites.meta.js
// ==/UserScript==

// Thanks for Using this script! If you enjoy using this, or have any questions, Message me on discord! "lernxyz". Also, subscribe to my YouTube channel!: youtube.com/@lernxyz
/*
  Created By : lernxyz (youtube.com/@lernxyz)
*/

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

      w.style.cssText = `width:2px;height:14px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:14px;height:2px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Black Cross") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");


      w.style.cssText = `width:2px;height:14px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:14px;height:2px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Red Cross") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      w.style.cssText = `width:2px;height:14px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:14px;height:2px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Orange Cross") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      w.style.cssText = `width:2px;height:14px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:14px;height:2px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Yellow Cross") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      w.style.cssText = `width:2px;height:14px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:14px;height:2px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Green Cross") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      w.style.cssText = `width:2px;height:14px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:14px;height:2px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Blue Cross") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      w.style.cssText = `width:2px;height:14px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:14px;height:2px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
    }

    if (type == "Purple Cross") {
      let y = document.getElementById("crossY");
      let z = document.getElementById("crossZ");
      let w = document.getElementById("crossW");
      let x = document.getElementById("crossX");

      w.style.cssText = `width:2px;height:14px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
      x.style.cssText = `width:14px;height:2px;background-color:Black;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:0px`;
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
      title: "Crosshair Menu",
      theme: "dark",
      align: "left",
      width: 270,
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

    window.mod.modMenu.instruction.container.innerHTML = `<p style="color:yellow;font-size: small;margin-bottom: 0px;padding-left: 2.5px;">Thank you for installing and using Crosshair Mods for Shell Shockers!</p><p style="color:white;font-size: small;margin-top: 0px;padding-left: 2.5px;">1. Below are the settings for the mod as you can see.</p><p style="color:white;font-size: small;margin-top: 0px;padding-left: 2.5px;">2. Select the settings you would want to use, they will appear in the center of the screen.</p><p style="color:white;font-size: small;margin-top: 0px;padding-left: 2.5px;">3. You can not set to anything that start or end with a "---" as they are markers.</p><p style="color:white;font-size: small;margin-top: 0px;padding-left: 2.5px;">4. Take this mod into a game and try it out!</p><p style="color:orange;font-size: small;margin-top: 0px;padding-left: 2.5px;">[WARNING] : This has not been publicly allowed or disallowed in Shell League!</p><p style="color:red;font-size: small;margin-top: 0px;padding-left: 2.5px;">[NOTE] : Thanks for using this!</p>`;

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
        "--- ORANGE ---",
        "Orange Cross",
        "Orange Circle",
        "Orange Square",
        "--- YELLOW ---",
        "Yellow Cross",
        "Yellow Circle",
        "Yellow Square",
        "--- GREEN ---",
        "Green Cross",
        "Green Circle",
        "Green Square",
        "--- BLUE ---",
        "Blue Cross",
        "Blue Circle",
        "Blue Square",
        "--- PURPLE ---",
        "Purple Cross",
        "Purple Circle",
        "Purple Square",
        "--- WHITE ---",
        "White Cross",
        "White Circle",
        "White Square",
        "--- BLACK ---",
        "Black Cross",
        "Black Circle",
        "Black Square",
      ],
      onChange: updateCrosshair,
    });

    window.mod.modMenu.credit = crosshairGui.Register({
      type: "text",
      label: "Credits",
    });

    window.mod.modMenu.credit.container.innerHTML = `<p style="color:gray;font-size: medium;margin-bottom: 0px;padding-left: 15px;">Made by lernxyz.</p><p style="color:gray;font-size: medium;margin-top: 0px;padding-left: 15px;">Thanks for using!</p>`;

    let titleTextElm = crosshairGui.panel.panel.childNodes[0];
    titleTextElm.style.color = "rgb(255, 196, 0)";
    titleTextElm.style.fontWeight = "bold";
  };
})();