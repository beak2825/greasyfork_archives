// ==UserScript==
// @name         DARK THEME TYLER
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  A dark neon theme! Red team is now neon pink. Fps-Counter.  Enjoy!
// @author       pinthc
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      DV | Do not plagiarize.
// @downloadURL https://update.greasyfork.org/scripts/502942/DARK%20THEME%20TYLER.user.js
// @updateURL https://update.greasyfork.org/scripts/502942/DARK%20THEME%20TYLER.meta.js
// ==/UserScript==

(function() {
    function applySettings() {
      input.execute('ren_grid_base_alpha 0');
      input.execute('ren_stroke_soft_color_intensity 1');
      input.execute('ren_stroke_solid_color 0');
      input.execute('ren_background_color 0');
      input.execute('ren_fps true');//FPS
      input.execute('net_predict_movement false');//NetMovement
      input.execute('net_replace_color 3 0x00FFFF');
      input.execute('net_replace_color 4 0xFF3131');
      input.execute('net_replace_color 8 0xCFFF04');
      input.execute('net_replace_color 9 0xff073a');
      input.execute('net_replace_color 10 0xFF00FF');
  }

    function waitForGame() {
        if (window.input && input.execute) {
            applySettings();
        } else {
            setTimeout(waitForGame, 100);
        }
    }
    waitForGame();
})();