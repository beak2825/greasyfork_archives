// ==UserScript==
// @name         Signature Hide on Profiles
// @namespace    pxgamer
// @version      0.2
// @description  Hide signature on profiles
// @author       pxgamer
// @include      *kat.cr/user/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19547/Signature%20Hide%20on%20Profiles.user.js
// @updateURL https://update.greasyfork.org/scripts/19547/Signature%20Hide%20on%20Profiles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('tr td strong:contains("Signature:")').html('<span><span class="ka ka16 ka-eye" style="display: inline-block;" title="Toggle Signature" id="toggleSig"></span><span style="color: black; display: inline-block;">Signature</span></span>');
})();

$('#toggleSig').on('click', function() {
    $('#toggleSig').parent().parent().parent().next().toggle();
});