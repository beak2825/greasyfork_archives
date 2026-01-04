// ==UserScript==
// @name        Ugly Threadpic Remover 9000
// @match       https://lolcow.farm/*
// @grant       GM_getValue
// @description BlatherBlatherBalther
// @locale      en
// @version     9000
// @namespace https://greasyfork.org/users/1506767
// @downloadURL https://update.greasyfork.org/scripts/546429/Ugly%20Threadpic%20Remover%209000.user.js
// @updateURL https://update.greasyfork.org/scripts/546429/Ugly%20Threadpic%20Remover%209000.meta.js
// ==/UserScript==

(function(){
  document.querySelectorAll('img').forEach(img => {
    if (img.src === GM_getValue("ugly",     "https://lolcow.farm/ot/thumb/1755615408234.png"))
    {   img.src =   GM_getValue("not_ugly", "https://lolcow.farm/ot/thumb/1705589087500.jpg");
    }});})();
