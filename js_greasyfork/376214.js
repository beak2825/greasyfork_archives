// ==UserScript==
// @name         Skocz do miejsca
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       henk
// @match        https://www.wykop.pl/link/*
// @grant        none
// @description     Dodaje linki do konkretnych miejsc w wideo w serwisie wykop.pl
// @downloadURL https://update.greasyfork.org/scripts/376214/Skocz%20do%20miejsca.user.js
// @updateURL https://update.greasyfork.org/scripts/376214/Skocz%20do%20miejsca.meta.js
// ==/UserScript==

function addIcon() {

    var tregex = /(\d(:|\.))*([0-5][0-9]|[0-9])(:|\.)[0-5][0-9]/gi;
    var lregex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)/gi;

    url = document.querySelector('[title="Otwórz źródło znaleziska"]').href;

    ytLink = url.match(lregex);

    for (i = 0; i < document.querySelectorAll(".text").length; i++) {

        comment = document.querySelectorAll(".text")[i].innerHTML;
        results = comment.match(tregex);


        if (results != null) {
            for (j = 0; j < results.length; j++) {
                timeelements = results[j].split(/:|\./).reverse();
                timestamp = 0;
                for (k = 0; k < timeelements.length; k++) {
                    timestamp = timestamp + Math.pow(60, k) * timeelements[k];
                }

                comment = comment.replace(results[j], results[j] + " " + '<a href="' + ytLink + '&t=' + timestamp + '&autoplay=1">\u25B6</a>');

            }
            document.getElementsByClassName("text")[i].innerHTML = comment;
        }

    }

}

document.onload = addIcon();