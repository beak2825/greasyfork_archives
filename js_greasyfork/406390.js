// ==UserScript==
// @name         Script untuk hilangin notif di exam.apps.binus.ac.id
// @namespace    http://tampermonkey.net/
// @version      6.9
// @description  buat orang-orang yang males ngilangin notif di exam binus
// @author       Vincent Tjianattan
// @match        https://exam.apps.binus.ac.id/Home/Exam
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406390/Script%20untuk%20hilangin%20notif%20di%20examappsbinusacid.user.js
// @updateURL https://update.greasyfork.org/scripts/406390/Script%20untuk%20hilangin%20notif%20di%20examappsbinusacid.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.swal2-cancel').click();
    var index = $("#ddlPeriod option").length-1;
    $("#ddlPeriod").prop("selectedIndex", index).val();
    $('#btnSearch').click();
})();