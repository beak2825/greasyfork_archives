// ==UserScript==
// @name        Ignore List
// @namespace   IgnontingPeople
// @match       https://www.dreadcast.net/Forum/*
// @icon         https://www.dreadcast.net/images/fr/design/favicon.ico
// @version     1.1
// @grant       none
// @description Ignore les gens par pseudo.
// @downloadURL https://update.greasyfork.org/scripts/447183/Ignore%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/447183/Ignore%20List.meta.js
// ==/UserScript==
var toignore = [];
toignore=JSON.parse(localStorage.getItem("users"))
if ( typeof toignore === undefined || toignore === "" || toignore === null ) {
    toignore = ["Init"];
    localStorage.setItem("users", JSON.stringify(toignore))
    toignore=JSON.parse(localStorage.getItem("users"))
}

$(document).ready( function() {


        function addKicking() {
    $(".forum_description").append ( `
<div id="azerty" class="link">/ignore</div>

` );
        $("#azerty").click (remplissageStockage);}

    function remplissageStockage() {
        var saisie = prompt('Saisissez un titre a mettre pour ce message :');
        toignore.push(saisie);
        localStorage.setItem("users", JSON.stringify(toignore));


    }

    function IgnoreThem(alpha) {
        $('span:contains('+alpha+')').parent().each( function() {
            $(this).hide();
            $(this).next().hide();
        })
    }
    addKicking();
    toignore.forEach(IgnoreThem);


    $(document).ajaxComplete( function() {
         toignore.forEach(IgnoreThem);
      });
});
