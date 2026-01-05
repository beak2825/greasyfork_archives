// ==UserScript==
// @id             hiszilla_internes_app_ticket
// @name           HIS Hiszilla Internes APP Ticket
// @version        1.6
// @namespace      hiszilla.his.de
// @author         koczewski@his.de
// @description    HIS Hiszilla Internes APP Ticket aus anderem Ticket erstellen
// @include        https://hiszilla.his.de/hiszilla/show_bug.cgi?*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/4533/HIS%20Hiszilla%20Internes%20APP%20Ticket.user.js
// @updateURL https://update.greasyfork.org/scripts/4533/HIS%20Hiszilla%20Internes%20APP%20Ticket.meta.js
// ==/UserScript==

var title = document.getElementById('short_desc_nonedit_display').innerHTML;
var anfrageNr = document.getElementById('changeform').elements['id'].value;
var comment = 'Zu externer Anfrage ' + anfrageNr + '.%0A%0ASchritte zum Nachstellen:%0A* Anmelden als %22%22%0A* Menüpunkt %22%22%0A* %0A%0AErwartetes Verhalten:%0A';

var versionSelect = document.getElementById('version');
var version = versionSelect.options[versionSelect.selectedIndex].value;


var bugSeveritySelect = document.getElementById('bug_severity');
var bugSeverity = bugSeveritySelect.options[bugSeveritySelect.selectedIndex].value;

var componentSelect = document.getElementById('component');
var component = componentSelect.options[componentSelect.selectedIndex].value;

var url = 'https://hiszilla.his.de/hiszilla/enter_bug.cgi';
url += '?assigned_to=TS-APP%40his.de&bit-46=1&blocked=53406&bug_file_loc=http%3A%2F%2F';
url += '&bug_severity=Leichter%20Fehler'; //bugSeverity;
url += '&bug_status=NEW&cf_achievo=&cf_bearbeiter=&cf_supportlevel=---';
url += '&comment=' + comment;
url += '&commentprivacy=0&contenttypemethod=autodetect&data=&deadline=';
url += '&dependson=' + anfrageNr;
url += '&description=&estimated_time=0.0&form_name=enter_bug&keywords=Task&maketemplate=Formulareintr%C3%A4ge%20als%20lesezeichenf%C3%A4hige%20Vorlage%20speichern&op_sys=All&priority=mittel&product=Bewerbung%20und%20Studienplatzvergabe%20%28APP%29&rep_platform=All';
url += '&short_desc=Bugfix: ' + title;
url += '&target_milestone=---&';
url += '&component=' + component;
url += 'version=' + version;

var buttonCode = '<a href="'+ url +'" target="_blank">Interne APP-Fehleranfrage erstellen</a>';


var infotable = document.getElementById('boxofimportantstuff');
var container = infotable.parentNode;
container.innerHTML += buttonCode;