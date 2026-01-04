// ==UserScript==
// @name         Filter na trollov
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Odpáľ svojho obľúbeného trolla z diskusie
// @author       You
// @match        https://diskusia.standard.sk/*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444724/Filter%20na%20trollov.user.js
// @updateURL https://update.greasyfork.org/scripts/444724/Filter%20na%20trollov.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* zmaž, alebo pridaj trolla podľa vlastnej potreby */
    const trollovia =
          [
              "alexander",
              "1",
              "sasa",
              "ConMick",
              "KebabNuke",
              "Janko Záhorák",
              "Smetak",
              "Noro",
              "Ľuboš D.D.",
              "Ján Trnavský",
              "JuPsen",
              "JulPsen",
              "klara",
              "DaRealGunko",
              "TetaV",
              "Petoo123",
              "juraj23",
              "rr09",
              "Margarétka",
              "Ignacius Reilly",
              "adalbert",
              "Obivan",
              "Jolana Čuláková",
              "Marek Dobránsky",
              "hominem",
              "Prikles",
              "JXV",
              "KRAX",
              "Aaron",
              "SRaLaDiN",
              "Leopold",
              "JuPse",
              "Tmmy_A",
              "Imrich Spisak",
              "zberateľ",
              "Zberac",
              "Elstrom",
              "doktor živago",
              "J.Ko"
          ];

    /* ponechat reakcie na trolla = true;
    /* zmazat cely koment aj s reakciami = false;
     */
    const ponechajReakcie = false;
    
    const hlavicky = Array.from(document.querySelectorAll(".comment__name"))
    trollovia.forEach(troll => odpalTrolla(troll));

    function odpalTrolla(troll)
    {
       hlavicky
          .filter(el => el.textContent === troll)
          .forEach(el =>
          {
               if (ponechajReakcie)
               {
                  el.closest("article").querySelector(".comment__details").innerText = "### filter ###";
                  return;
               }
               
               el.closest("li").style.display = "none";
          });
    }

})();