// ==UserScript==
// @name            DAKboard Modifier
// @namespace       https://greasyfork.org/users/12491
// @icon            http://dakboard.com/img/apple-touch-icon.png
// @description     Script to alter personalized DAKboard.com pages
// @version         0.1.0
// @author          Gryphon
// @license         MIT License
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match           http://dakboard.com/app?p=92fe0ed8bff2abef926968f13758afef
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/29508/DAKboard%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/29508/DAKboard%20Modifier.meta.js
// ==/UserScript==

$(document).ready(function(){
    $("#events-loading").after('<style type="text/css">@font-face {font-family: "Shakespeare";src: url(https://www.fontyukle.net/en/DownLoad-William+Shakespeare+WF.ttf) format("truetype");}p.customfont {font-family: "My Custom Font", Verdana, Tahoma;}</style><div id="space" class="text-center rss-background" style="display: block;">Hark<br>Want of planning On thy part<br>Doest not An emergency<br>Maketh on mine</div>');
});