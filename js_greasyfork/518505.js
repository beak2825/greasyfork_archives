// ==UserScript==
// @name         Tichu Online cleanup
// @namespace    http://tampermonkey.net/
// @version      2024-11-22
// @description  Clean the interface for mobile phones
// @author       Marek Romanowski
// @match        https://*.onlinetichu.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/518505/Tichu%20Online%20cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/518505/Tichu%20Online%20cleanup.meta.js
// ==/UserScript==

// TODO:
// - smaller li elements for tables for phones, so two are displayed in row
// -

(function() {
    'use strict';

    function removeElementIfDonate(element) {
        if (element.innerText.indexOf('donate') >= 0) {
            console.log('removing element: ' + element);
            element.remove();
        }
    }

    // remove row with banners
    document.querySelectorAll('.container-fluid .row div .row div').forEach(removeElementIfDonate);
    document.querySelectorAll('.container-fluid .row div').forEach(removeElementIfDonate);
    // make other rows wider so they use whole screen
    var tablesWidget = document.querySelector('.container-fluid .row div:first-child');
    tablesWidget.classList.replace('col-lg-4', 'col-lg-6');
    tablesWidget.classList.replace('col-md-7', 'col-md-9');

    // add styles fixing table listing
    GM_addStyle('.avTableBox > ul > li > a { display: inline-block; }');
    GM_addStyle('.row .tbldiv { width: 160px; }');
    // styles for very small screens
    GM_addStyle("@media (max-width: 450px) { "
                // add style shortening single table element - so at least two items fit one row
                + '.row .tbldiv { width: 160px; }'
                // smaller padding for the whole page
                + ".row .col-xs-1, .row .col-xs-2, .row .col-xs-3, .row .col-xs-4, .row .col-xs-5, .row .col-xs-6, .row .col-xs-7, .row .col-xs-8, .row .col-xs-9, .row .col-xs-10, .row .col-xs-11, .row .col-xs-12 { "
                + "padding-right: 10px; "
                + "padding-left: 10px; "
                + "}"
                + "}"
                + ".stats {"
                + "  background: #ece16f;"
                + "  margin-top: 20px;"
                + "  margin-right: 20px;"
                + "  padding: 1em;"
                + "  border: 1px solid #eee;"
                + "  display: inline-block;"
                + "}"
               );
    // GM_addStyle('. {  }');

    // find user name
    var userName = '';
    document.querySelectorAll('.dropdown-toggle').forEach(
        elem => { if (elem.innerHTML.indexOf('gravatar') >= 0) { userName = elem.innerText.trim(); }});

    fetch("https://www.onlinetichu.com/Site/Profiles/User/" + userName)
    .then((response) => response.text())
    .then((text) => {
        var htmlString = text
            .replaceAll('<script', '<s_cript')
            .replaceAll('</script', '</s_cript');
        console.log('loaded resource for user "' + userName + '"');

        // Create a DOMParser to parse the HTML string
        const parser = new DOMParser();

        // Parse the HTML string into a Document object
        const doc = parser.parseFromString(htmlString, "text/html");

        // Now you can use querySelector to select elements
        const element = doc.querySelector('.col-xs-6');

        if (element) {
            const description = element.innerText.trim();
            const lines = description.split('\n');
            const firstLines = lines.slice(0, 3);
            console.log('Element found:', firstLines.join('\n'));
            const descriptionElement = document.createElement('div');
            descriptionElement.classList.add('stats');
            descriptionElement.innerText = firstLines.join('\n');
            document.querySelector('.avTableBox').prepend(descriptionElement);
        } else {
            console.log('Element not found');
        }
    });

    // fix zoom on mobile for games (not working yet)
    function zoomOutMobile() {
        var viewport = document.querySelector('meta[name="viewport"]');

        if ( viewport ) {
            console.log('base viewport: ' + viewport.content);
            //viewport.content = "initial-scale=0.1";
            //viewport.content = "width=1200";
        }
    }
    zoomOutMobile();

    console.log('done!');
})();
