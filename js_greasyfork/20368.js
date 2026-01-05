// ==UserScript==
// @name         Talixo Manual Job Form Faster
// @namespace    http://talixo.local:8000/en/manager/jobs/add/
// @version      0.1
// @description  Make jobs faaaster
// @author       jakubste
// @match        http://talixo.local:8000/en/manager/jobs/add/
// @match        http://beta.talixo.com/en/manager/jobs/add/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20368/Talixo%20Manual%20Job%20Form%20Faster.user.js
// @updateURL https://update.greasyfork.org/scripts/20368/Talixo%20Manual%20Job%20Form%20Faster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#id_start_point').val('TXL');
    $('#id_end_point').val('SXF');
    $('#id_end_point').trigger('change');
    $('#id_booking_class').val("T");
    $('#id_booking_class').val("T").trigger('change');
    $('#id_booking_class').val("T").trigger('chosen:updated');
})();