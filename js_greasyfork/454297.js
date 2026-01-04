// ==UserScript==
// @name         萬聖節Halloween Theme | Shell Shockers | egg god
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Halloween Theme by egg god
// @author       egg god
// @match        https://shellshock.io/*
// @match        https://mathactivity.xyz/*
// @match        https://mathdrills.life/*
// @match        https://www.gamepix.com/play/shell-shockers/*
// @match        https://kevin.games/shellshock-io/*
// @match        https://eggcombat.com/*
// @match        https://eggfacts.fun/*
// @match        https://biologyclass.club/*
// @match        https://egghead.institute/*
// @match        https://egg.dance/*
// @match        https://eggisthenewblack.com/*
// @match        https://mathfun.rocks/*
// @match        https://hardboiled.life/*
// @match        https://overeasy.club/*
// @match        https://zygote.cafe/*
// @match        https://eggsarecool.com/*
// @match        https://deadlyegg.com/*
// @match        https://mathgames.world/*
// @match        https://hardshell.life/*
// @match        https://violentegg.club/*
// @match        https://yolk.life/*
// @match        https://softboiled.club/*
// @match        https://scrambled.world/*
// @match        https://algebra.best/*
// @match        https://scrambled.today/*
// @match        https://deathegg.world/*
// @match        https://violentegg.fun/*
// @icon         https://i.pinimg.com/736x/1d/d5/dd/1dd5dd7250af3afbd571ded1e41ea75a--funny-halloween-ideas-for-halloween.jpg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454297/%E8%90%AC%E8%81%96%E7%AF%80Halloween%20Theme%20%7C%20Shell%20Shockers%20%7C%20egg%20god.user.js
// @updateURL https://update.greasyfork.org/scripts/454297/%E8%90%AC%E8%81%96%E7%AF%80Halloween%20Theme%20%7C%20Shell%20Shockers%20%7C%20egg%20god.meta.js
// ==/UserScript==

(function () {
  let style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "https://berrybroscrypto.com/css/halloween.css";
  document.head.appendChild(style);

  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src =
    "https://berrywidgets.com/shellshockers/mods/health-bar/health-bar.js";
  document.head.appendChild(script);

  var script2 = document.createElement("script");
  script2.type = "text/javascript";
  script2.src = "https://berrybroscrypto.com/js/soundeffect.js";
  document.head.appendChild(script2);
})();
