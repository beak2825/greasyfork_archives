// ==UserScript==
// @name         KG2CL - Update films pays
// @namespace    https://www.cinelounge.org/Direct/
// @version      1.1
// @description  Met à jour le nombre de torrents par pays de KG dans la BDD CL
// @author       tadanobu
// @match        https://karagarga.in/browse.php?*country=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=karagarga.in
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481313/KG2CL%20-%20Update%20films%20pays.user.js
// @updateURL https://update.greasyfork.org/scripts/481313/KG2CL%20-%20Update%20films%20pays.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var lasNumber = 0;
    var text = $("p a").eq(-2).text();
    if (text.length > 0) {
        var numberText = text.match(/\d+$/);
        var lastNumberText = numberText.pop();
        lastNumber = parseInt(lastNumberText);
        console.log(lastNumber);
    }
    else {
        var lastElement = $("p b").eq(-3);
        var text2 = lastElement.text();
        if (text2.length > 0) {
            var numberText2 = text2.match(/\d+$/);
            var lastNumberText2 = numberText2.pop();
            var lastNumber = parseInt(lastNumberText2);
            console.log(lastNumber); //
        }
        else {
            lastNumber = 0;
            console.log('Rien trouvé');
        }
    }

    var queryString = window.location.search;
    var params = queryString.split('?')[1].split('&');
    var country;
    params.forEach(function(param) {
        var keyValue = param.split('=');
        if (keyValue[0] === 'country') {
            country = keyValue[1];
        }
    });
    console.log(country);

    var fixedDiv = $("<div>");
    fixedDiv.html("<center><b>Update CLNG Pays</b></center><br><b>Code pays</b> : " + country + "<br><b>Nb torrents</b> : " + lastNumber + "<br><br><center><a id='CLNG' href='http://localhost/CLNG/page.php?page=kgupdpays&pays=" + country + "&nb=" + lastNumber + "' style='border : 1px solid red; padding: 2px; color:red'>MàJ</a><center><div id='divnotes'></div>");
    fixedDiv.css({
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 9999,
        padding: "10px",
        background: "#fff",
        border: "1px solid #bbb"
    });
    $("body").append(fixedDiv);
    window.location = "https://www.cinelounge.org/page.php?page=kgupdpays&pays=" + country + "&nb=" + lastNumber;
})();