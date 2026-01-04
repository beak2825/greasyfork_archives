// ==UserScript==
// @name        Verfallsmelder
// @namespace   leeSalami.lss
// @version     1.0.1
// @description Markiert verfallende Missionen
// @license     MIT
// @author      leeSalami
// @match       https://*.leitstellenspiel.de
// @match       https://*.meldkamerspel.com
// @downloadURL https://update.greasyfork.org/scripts/515917/Verfallsmelder.user.js
// @updateURL https://update.greasyfork.org/scripts/515917/Verfallsmelder.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let missionMarkerAddOrig = missionMarkerAdd;
  missionMarkerAdd = (t) => {
    missionMarkerAddOrig(t);

    if (t.created_at * 1000 < getLastUtc2Am() && !document.getElementById(`old_mission_marker_${t.id}`)) {
      const missionPanelHeading = document.getElementById(`mission_panel_heading_${t.id}`);

      if (missionPanelHeading) {
        const alertText = document.createElement('span');
        alertText.id = 'old_mission_marker_' + t.id;
        alertText.textContent = '‼️';
        alertText.style.float = 'right';
        missionPanelHeading.appendChild(alertText);
      }
    }
  }

  function getLastUtc2Am() {
    const lastUTC2am = new Date();
    lastUTC2am.setUTCHours(2, 0, 0, 0);

    if (lastUTC2am.getTime() > Date.now()) {
      lastUTC2am.setDate(lastUTC2am.getDate() - 1);
    }

    return lastUTC2am.getTime();
  }
})();