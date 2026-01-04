// ==UserScript==
// @name         Zabbix submit acknowledgement with Ctrl-Enter
// @namespace    http://wosc.de/
// @version      1.0
// @description  Adds the standard "save and go" keyboard shortcut
// @author       Wolfgang Schnerring
// @match        http://*/zabbix/zabbix.php?*action=acknowledge*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36213/Zabbix%20submit%20acknowledgement%20with%20Ctrl-Enter.user.js
// @updateURL https://update.greasyfork.org/scripts/36213/Zabbix%20submit%20acknowledgement%20with%20Ctrl-Enter.meta.js
// ==/UserScript==

(function() {
'use strict';

var $ = window.jQuery;

$('textarea').on('keydown', function(event) {
  if (! (event.which == 13 && event.ctrlKey)) return;

  event.preventDefault();
  $(event.target).closest('form').find('button[value="acknowledge.create"]').click();
});

})();