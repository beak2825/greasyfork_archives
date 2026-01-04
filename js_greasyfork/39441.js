// ==UserScript==
// @name         Charity Corner
// @version      0.1
// @description  Auto-fill charity corner options from your inventory.  1st dropdown = 1st option, 2nd dropdown = 2nd option, etc.
// @author       Rushpup
// @match        http://www.neopets.com/charitycorner/2018/np.phtml
// @namespace https://greasyfork.org/users/174630
// @downloadURL https://update.greasyfork.org/scripts/39441/Charity%20Corner.user.js
// @updateURL https://update.greasyfork.org/scripts/39441/Charity%20Corner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var dropdowns = jQuery('.gift').find('select');
    for (var i=0; i<dropdowns.length; i++) {
        jQuery(dropdowns[i]).val(i).change();
    }
})();