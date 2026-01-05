// ==UserScript==
// @name         iDziennik extended
// @namespace    https://www.facebook.com/groups/210419385785259/
// @version      0.0.3
// @description  Adds additional content like more specific marks statistics etc.
// @author       glen/jakub molinski
// @match        https://iuczniowie.progman.pl/*
// @match        http://www.wykop.pl/
// @grant        none
// @copyright    Glen 2015+
// @downloadURL https://update.greasyfork.org/scripts/13954/iDziennik%20extended.user.js
// @updateURL https://update.greasyfork.org/scripts/13954/iDziennik%20extended.meta.js
// ==/UserScript==

// TODO is the latest jQuery needed? adding statement that fetches the latest jQuery raises an exception :/ it collides with page's jQuery version

// Create the XHR object.
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}

// Make the actual CORS request.
function makeCorsRequest(ocenyjson) {
    // All HTML5 Rocks properties support CORS.
    var url = 'https://glen.pythonanywhere.com/parseschedule';

    var xhr = createCORSRequest('POST', url);
    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    // Response handlers.
    xhr.onload = function() {
        document.getElementsByTagName('html')[0].innerHTML = xhr.responseText;
        setup_js(); // funkcja zwracana z serwera pythonowego razem z HTMLem
    };

    xhr.onerror = function() {
        alert('Woops, there was an error making the CORS request. Spróbuj ponownie, jeżeli błąd się powtarza możesz mnie o tym powiadomić na facebooku /Jakub Moliński.');
    };
    
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(ocenyjson));
}

function pobierzOcenyDlaRequesta() {
    $.ajax({
        type: "POST",
        url: "oceny/WS_ocenyUcznia.asmx/pobierzOcenyUcznia",
        contentType: "application/json; charset=utf-8",
        data: "{idPozDziennika: " + dxComboUczniowie.GetValue() + "}",
        dataType: "json",
        success: makeCorsRequest,
        error: bladPobrano
    });
}

$(document).ready(function() {
    if (window.location.href === 'https://iuczniowie.progman.pl/idziennik/mod_panelRodzica/Oceny.aspx') {

        setTimeout(pobierzOcenyDlaRequesta, 10);
    }

});

//    if (window.location.href.match(/https:\/\/www.facebook.com\/messages\/.*/)) {
//        if (localStorage.getItem('spam_active')) {
//            set_message();
//            send_message();
//            increase_id_num();
//            if (localStorage.getItem('ID_num') >= id_db.size) {            
//                localStorage.setItem('spam_active', false);
//            } else {
//                setTimeout(load_URL(fb_domain + id_db[localStorage.getItem('ID_num')]), 1000);
//            }
//        }
//    }
//
