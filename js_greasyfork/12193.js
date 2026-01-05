// ==UserScript==
// @name         Ocultar actividad de dimekari
// @namespace    https://dimekari.cf/
// @version      0.1
// @description  Elimina la activdad de @dimekari en "En Vivo"
// @author       OverJT
// @match        http://www.taringa.net/mi
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12193/Ocultar%20actividad%20de%20dimekari.user.js
// @updateURL https://update.greasyfork.org/scripts/12193/Ocultar%20actividad%20de%20dimekari.meta.js
// ==/UserScript==

$(".section-mi #friends-live-activity li a[href=\"/DimeKari\"").parent().remove();
$('#friends-live-activity').bind("DOMSubtreeModified",function(){
    $(".section-mi #friends-live-activity li a[href=\"/DimeKari\"").parent().remove();
});
