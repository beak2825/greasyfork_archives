// ==UserScript==
// @name           Clothcache Filter
// @name:de        Clothcache Filter
// @name:en        Clothcache Filter
// @author         sawyaz
// @namespace      sawyaz
// @description    Plugin for Clothcache to filter imports for jobs on the minimap
// @description:de Plugin fuer Clothcache um imports in der minimap zu filtern
// @include https://*.the-west.*/game.php*
// @include https://*.tw.innogames.*/game.php*
// @grant GM.xmlHttpRequest
// @connect support.innogames.com
// @license MIT-2.0
// @version     v0.0.2
// @downloadURL https://update.greasyfork.org/scripts/514385/Clothcache%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/514385/Clothcache%20Filter.meta.js
// ==/UserScript==

TWDS.minimap.filter = function () {
    TWDS.minimap.loadconfig();
    const config = TWDS.minimap.config || {};
  
    const container = $('<div />').css({
      width: '400px',
      minHeight: '100px',
      maxHeight: '400px',
      overflowY: 'auto'
    });
    JobList.getSortedJobs("level", null, "desc").forEach(job => {
      const checkboxId = `job-checkbox-${job.name.replace(/\s+/g, '-')}`;
      const checkbox = $('<input />', {
        type: 'checkbox',
        id: checkboxId,
        checked: config[job.name] || false
      });
      const label = $('<label />', {
        for: checkboxId,
        text: job.name
      });
      container.append(checkbox).append(label).append('<br>');
    });
  
    const saveConfig = function () {
      JobList.getSortedJobs("level", null, "desc").forEach(job => {
        const checkboxId = `job-checkbox-${job.name.replace(/\s+/g, '-')}`;
        config[job.name] = $(`#${checkboxId}`).is(':checked');
      });
      TWDS.minimap.config = config;
      TWDS.minimap.saveconfig();
    };
  
    (new west.gui.Dialog('Job Filter', container)).addButton('ok', saveConfig).addButton('cancel').show();
  };
