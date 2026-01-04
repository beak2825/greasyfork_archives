// ==UserScript==
// @name         Evento Castelo TW Idle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Evento castelo
// @author       TW IDLE
// @include      https://*screen=event_dungeon_crawler*
// @icon         https://image.prntscr.com/image/lY99mtenQ8CjdQ5b2aJvSg.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426437/Evento%20Castelo%20TW%20Idle.user.js
// @updateURL https://update.greasyfork.org/scripts/426437/Evento%20Castelo%20TW%20Idle.meta.js
// ==/UserScript==

setInterval(() => {
  try {
    $(
      ".dungeon-crawler-clickable[data-state='available'], .dungeon-crawler-item-booster_damage, .dungeon-crawler-item-booster_health"
    )
      .parent()
      .find("a")[0]
      .click();
  } catch (error) {
    try {
      $("[style*='map/exit_']").find("a")[0].click();
    } catch (error) {
        try{
      $(".dungeon-crawler-item-enemy").parent().find("a")[0].click();}
        catch(error) {
    $(".btn-need-energy").click()
        }
    }
  }
}, 500);