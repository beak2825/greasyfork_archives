// ==UserScript==
// @name         Move to trash
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Move thread to trash
// @author       Marentdev
// @match        https://realitygaming.fr/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369452/Move%20to%20trash.user.js
// @updateURL https://update.greasyfork.org/scripts/369452/Move%20to%20trash.meta.js
// ==/UserScript==

    $('head').append('<script>function chrislenoob() {   var id = document.URL.toString().split("/")[4];         var title = document.getElementsByClassName("p-title-value")[0].textContent;var xftoken = document.getElementsByName("_xfToken")[0].value;   $.post( "https://realitygaming.fr/threads/" + id + "/move", { prefix_id: "0", title: title, target_node_id: 281, redirect_type: "none", notify_watchers: 1, starter_alert: 1, _xfToken: xftoken, _xfResponseType: "json" }, function( data ) {               console.log(data);});}</script>');
    $('div.buttonGroup-buttonWrapper').after('<a class="button--link button" data-xf-click="scroll-to" data-silent="true"><span onclick="chrislenoob();"class="button-text">Move to trash</span></a>');

