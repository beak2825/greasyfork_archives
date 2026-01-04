// ==UserScript==
// @name        Queso Cannonstorm Base Reminder
// @description Requires MouseHunt Improved. Reminds the user to switch to the Queso Cannonstorm Base when traveling to somewhere in the Queso Region.
// @version     1.0.0
// @license     MIT
// @author      bradp
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://brrad.com/mouse.png
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/538007/Queso%20Cannonstorm%20Base%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/538007/Queso%20Cannonstorm%20Base%20Reminder.meta.js
// ==/UserScript==
(function() {
  'use strict';

  // Ensure that the script only runs after MouseHunt Improved has loaded.
  document.addEventListener('mh-improved-loaded', () => {
    // Log a load message to the console for debugging purposes.
    app.mhutils.debuglog('Queso Cannonstorm Base Reminder', 'Loaded user script.');

    // We pass null as the first argument as we want to run this on every travel
    // and do our own location check. If we passed a location, it would only run
    // when traveling to that specific location.
    app.mhutils.onTravel(null, { callback: () => {
      const locations = [ 'queso_river', 'queso_plains', 'queso_quarry', 'queso_geyser'];
      if (! locations.includes(app.mhutils.getCurrentLocation())) {
        return;
      }

      // If the user has the base equipped, don't do anything.
      if (3526 === user.base_item_id) {
        return;
      }

      app.mhutils.showHornMessage({
        title: 'Base Reminder',
        text: 'Switch your base to the Queso Cannonstorm Base.',
        color: 'orange',
        button: 'Switch',
        dismiss: 5000, // Automatically closes the reminder after 5 seconds.
        action: () => {
          // Open up the base selector so the user can switch bases.
          document.querySelector('.campPage-base-armedItem.base')?.click();
        }
      });
    }});

    // If you only need to check when traveling to a single location, you can simplify the code by replacing the entire app.mhutils.onTravel call with this one:
    /*
    app.mhutils.onTravel('queso_river', { callback: () => {
      if (3526 !== user.base_item_id) {
        app.mhutils.showHornMessage({
          title: 'Base Reminder',
          text: 'Switch your base to the Queso Cannonstorm Base.',
          color: 'orange',
          button: 'Switch',
          dismiss: 5000, // Automatically closes the reminder after 5 seconds.
          action: () => {
            document.querySelector('.campPage-base-armedItem.base')?.click();
          }
        });
      }
    }});
    */
  });
})();