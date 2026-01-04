// ==UserScript==
// @name         FV - Quick discharge
// @description  Discharge patients with just one click by skipping the modal pop-up!
// @version      0.2
// @author       msjanny (#7302)
// @match        https://www.furvilla.com/career/clinic/*/healed*
// @namespace https://greasyfork.org/users/319295
// @downloadURL https://update.greasyfork.org/scripts/427025/FV%20-%20Quick%20discharge.user.js
// @updateURL https://update.greasyfork.org/scripts/427025/FV%20-%20Quick%20discharge.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals $:false */

    $(document).ready(function() {
        let token = $('meta[name=csrf-token]').prop('content');
        let counter = $('h3 .label-success');
        let count = parseInt(counter.text());

        $('.patient-healthy-box .btn-danger').off();
        $('.patient-healthy-box .btn-danger').each(function() {
            $(this).attr('href', '#discharged');
        });
        $('.patient-healthy-box .btn-danger').click(function() {
            $.post($(this).data('url'), {'_token': token});
            $(this).text('Discharged!');
            $(this).off();
            $(this).parent().parent().parent().remove();
            counter.text(--count);
        });
    });
})();