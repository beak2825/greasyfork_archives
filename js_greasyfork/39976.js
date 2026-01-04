// ==UserScript==
// @name         Get MTurk Frame
// @author       Eisenpower
// @namespace    Uchiha Clan
// @version      1.0
// @description  Unleashes Your Sharingan
// @icon         https://i.imgur.com/M0jWVYS.png
// @include      *worker.mturk.com/projects/*/tasks*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/39976/Get%20MTurk%20Frame.user.js
// @updateURL https://update.greasyfork.org/scripts/39976/Get%20MTurk%20Frame.meta.js
// ==/UserScript==

var icon = `<img id="frameButt" style="max-width: 27px; margin-right: 10px;" data-toggle="tooltip" title="Click to open frame in new tab" src="https://i.imgur.com/YKT83H9.png"</style>`;

$(document).ready(function() {
    document.querySelector('.col-xs-12.navbar-content').insertAdjacentHTML(`afterbegin`, icon);

    document.getElementById('frameButt').addEventListener("click", function () {
        window.open(document.querySelector('iframe').src, '_blank');
    });
});
