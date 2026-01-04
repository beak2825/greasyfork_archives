// ==UserScript==
// @name        RealzCode Anonymity
// @namespace   RealzCode/Anonymity
// @description Thank you Javascript 🙃
// @include     *
// @version     1.2
// @grant       none
// @noframes    false
// @license     Fair
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/474926/RealzCode%20Anonymity.user.js
// @updateURL https://update.greasyfork.org/scripts/474926/RealzCode%20Anonymity.meta.js
// ==/UserScript==

// Object.setPrototypeOf(navigator, null);

let realzmeta = document.createElement('meta');
realzmeta.name = "RealzCode";
realzmeta.content = GenZ();
document.getElementsByTagName('head')[0].appendChild(realzmeta);
function GenZ(){
  let byt = [8,16,32,64,128,256,512];
  let run = byt.length * Math.random();
  var cry = window.crypto || window.msCrypto;
  return Array.from(cry.getRandomValues(new Uint8Array(byt[Math.floor(run)]))).map(z => z.toString(17)).join([]);
};

let realzcode = document.createElement("script");
realzcode.textContent = "var checkpoint = true; (" + (function() {
	"use strict";
  let setValue = function (object, propertyName, value, writable) {
    if (!writable) {
      writable = false;
    }
    Object.defineProperty(object, propertyName, {
      value: value,
      writable: writable,
      enumerable: true
    });
  };
  // fetch('https://ipapi.co/json')
  //   .then(response => response.json())
  //   .then(data => {
  //     let lang = data.languages.split(',')[0];
  //     let langs = data.languages.split(',');
  //     if (lang.length == 2) {
  //       lang = lang.toLowerCase() + '-' + lang.toUpperCase();
  //     }
  //     setValue(navigator, "language", lang);
  //     setValue(navigator, "languages", langs);
  // });
  let random = {
    "change": function (n, m) {
      if (!m) {
        m = 0.1;
      }
      return Math.round(n + ((Math.random() - 0.5) * 2 * n * 0.3));
    },
    "item": function (e) {
      let rand = e.length * Math.random();
      return e[Math.floor(rand)];
    },
    "key": function (power) {
      let rand = Object.keys(power).length * Math.random();
      return Object.keys(power)[Math.floor(rand)];
    }
  };
  let screens = {
    0 : [640, 360],
    1 : [640, 480],
    2 : [800, 600],
    3 : [1024, 768],
    4 : [1280, 720],
    5 : [1280, 800],
    6 : [1280, 1024],
    7 : [1360, 768],
    8 : [1366, 768],
    9 : [1440, 900],
    10 : [1536, 864],
    11 : [1600, 900],
    12 : [1600, 1200],
    13 : [1680, 1050],
    14 : [1920, 1080],
    15 : [1920, 1200],
    16 : [2048, 1152],
    17 : [2048, 1536],
    18 : [2560, 1080],
    19 : [2560, 1440],
    20 : [2560, 1600],
    21 : [3440, 1440],
    22 : [3840, 2160]
  };
  let srand = random.key(screens);
  let swidth = (screens)[srand][0];
  let sheight = (screens)[srand][1];

  setValue(screen, "width", swidth);
  setValue(screen, "availWidth", swidth);
  setValue(screen, "innerWidth", swidth);
  setValue(screen, "outerWidth", swidth);
  setValue(screen, "height", sheight);
  setValue(screen, "availHeight", sheight);
  setValue(screen, "innerHeight", sheight);
  setValue(screen, "outerHeight", sheight);

  // setValue(screen, "left", undefined, true);
  // setValue(screen, "top", undefined, true);
  // setValue(screen, "enabled", undefined);
  // setValue(screen, "mozEnabled", undefined);
  // setValue(screen, "availLeft", undefined, true);
  // setValue(screen, "availTop", undefined, true);
  // setValue(screen, "Brightness", random.change(screen.Brightness));
  // setValue(screen, "mozBrightness", random.change(screen.mozBrightness));
  // setValue(screen, "devicePixelRatio", random.item([24, 32]));

  setValue(screen, "pixelDepth", random.item([24, 32]));
  setValue(screen, "colorDepth", random.item([24, 32]));

  setValue(navigator, "appName", "Hacked by RealzCode");
  // setValue(navigator, "appVersion", "Hacked by RealzCode");
  setValue(navigator, "appCodeName", "Hacked by RealzCode");
  // setValue(navigator, "vendor", "Hacked by RealzCode");
  setValue(navigator, "vendorSub", "Hacked by RealzCode");
  setValue(navigator, "product", "Hacked by RealzCode");
  setValue(navigator, "productSub", "Hacked by RealzCode");

  setValue(navigator, "language", "en-US");
  setValue(navigator, "languages", ["en-US"]);

  // setValue(navigator, "onLine", false, true);
  setValue(navigator, "webdriver", false, true);
  setValue(navigator, "doNotTrack", true, true);
  // setValue(navigator, "cookieEnabled", false, true);
  setValue(navigator, "globalPrivacyControl", false, true);
  setValue(navigator, "deviceMemory", random.item([1,2,3,4]), true);
  setValue(navigator, "maxTouchPoints", random.item([1,2,3,4]), true);
  setValue(navigator, "hardwareConcurrency", random.item([1,2,3,4]), true);

}) + ")()";
document.documentElement.prepend(realzcode);