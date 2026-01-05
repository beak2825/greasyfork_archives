// ==UserScript==
// @name Виза
// @namespace Виза
// @description Виза.
// @include https://by.e-konsulat.gov.pl/Uslugi/RejestracjaTerminu.aspx?IDUSLUGI=8&IDPlacowki=*
// @include https://by.e-konsulat.gov.pl/Uslugi/RejestracjaTerminu.aspx?IDUSLUGI=7&IDPlacowki=*
// @include https://by.e-konsulat.gov.pl/Uslugi/RejestracjaTerminu.aspx?IDUSLUGI=1&IDPlacowki=*
// @version 1
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/16312/%D0%92%D0%B8%D0%B7%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/16312/%D0%92%D0%B8%D0%B7%D0%B0.meta.js
// ==/UserScript==
document.addEventListener('click', function (e) {
document.getElementById('cp_tabFormularz') .style.visibility = '';
});


