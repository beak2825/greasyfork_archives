// ==UserScript==
// @name        ZeTorrents_link
// @namespace   ZeTorrents_link
// @description Add direct download link in search results
// @include     http://www.zetorrents.com/*
// @include     https://www.zetorrents.com/*
// @include     http://zetorrents.com/*
// @include     https://zetorrents.com/*
// @version     0.2
// @grant       none
// @require     http://code.jquery.com/jquery-latest.js
// @license     GPL
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/17438/ZeTorrents_link.user.js
// @updateURL https://update.greasyfork.org/scripts/17438/ZeTorrents_link.meta.js
// ==/UserScript==


(function () {
    var lignes = $('td a.size13pt');
    var basedir = window.location.protocol + "//" + window.location.host;
    var d_id=0;
    var link;

    function changeTxt() {
        console.log('************** ChangeTxt *****************');
        console.log($("td a.bouton").text("TT"));
    }

    // ajout d'une colonne dans le headers du tableau
    $("table thead tr:first-child").prepend("<th style=\"width:24px;text-align:left;\">Down LINK</th>");
    $("table thead tr:nth-child(2) th:first-child").parent().prepend("<th style=\"width:24px;text-align:left;\"><b>PUB</b></th>");

    lignes.each(function () {
        link = basedir;
        link += $(this).attr('href');
        // console.log("link : "+link);
        $(this).parent().parent().prepend('<td id="download'+d_id+'"style="width:24px;"></td>'); 
        $("#download"+d_id).load(link + ' .bouton').text();
        d_id++;
    }
    );
    document.addEventListener("mouseover", changeTxt, false);
    $(document).ready(function() { console.log("Document Ready"); $('td a.bouton').text("TT"); });
    // DOMContentLoaded
}) ();
