// ==UserScript==
// @name         althingi.is - umsagnir.gogn.in
// @namespace    gogn.in
// @version      0.1
// @author       pallih
// @match        http://www.althingi.is/thingstorf/thingmalin/erindi/*
// @grant        none
// @description  Birtir tengil á umsagnir.gogn.in frá umsagnasíðu á althingi.is
// @downloadURL https://update.greasyfork.org/scripts/21448/althingiis%20-%20umsagnirgognin.user.js
// @updateURL https://update.greasyfork.org/scripts/21448/althingiis%20-%20umsagnirgognin.meta.js
// ==/UserScript==


// do stuff
function main() {
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    var ltg = getParameterByName('ltg');
    var mnr = getParameterByName('mnr');
    $('<h3>Sjá allar umsagnir á <a href="http://umsagnir.gogn.in/thing/' + ltg + '/thingmal/' + mnr + '">umsagnir.gogn.in</a></h3></br>').insertAfter('h1:contains("Öll")');
}


main();