// ==UserScript==
// @name        Maintien session parcoureo
// @namespace   session@parcoureo
// @description Maintien la session de parcoureo en appelant la page d'accueil en ajax
// @include     https://www.parcoureo.fr/admin_jae/*
// @version     1
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35229/Maintien%20session%20parcoureo.user.js
// @updateURL https://update.greasyfork.org/scripts/35229/Maintien%20session%20parcoureo.meta.js
// ==/UserScript==

setInterval(maintien_session, 300000);

function maintien_session() {
    $.ajax({
        url: 'https://www.parcoureo.fr/',
        dataType: 'html',
        success: function (output) {
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status + " " + thrownError);
        }
    });
}