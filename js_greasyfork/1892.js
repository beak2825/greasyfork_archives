// ==UserScript==
// @id                heise.de-8280af0b-4f9b-487e-95b3-45fff377348e
// @name              heise.de Easy Reading
// @name:de           heise.de Easy Reading
// @version           1.6.4
// @author            SpineEyE
// @description       Makes reading heise news a little more comfortable
// @description:de    Macht heise lesen etwas angenehmer
// @include           /https?:\/\/www\.heise\.de/
// @run-at            document-idle
// @grant             GM_addStyle
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/1892/heisede%20Easy%20Reading.user.js
// @updateURL https://update.greasyfork.org/scripts/1892/heisede%20Easy%20Reading.meta.js
// ==/UserScript==
// heise.de Easy Reading user script
// Copyright 2011-2017, SpineEyE
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
//
// -----------------------------------------------------------------------------
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// changelog
// v1.6.4 - 30.04.2018 Fix: Anti-pagination, Serif Font.
// v1.6.2 - 07.11.2017 Fix: Verlinkung von Bildern bei mehrseitigen Artikeln
// v1.6.1 - 18.09.2017 Fix: Oberer Abstand mit Adblocker
// v1.6   - 23.08.2017 Add: Grossbilder (Popover) werden richtig verlinkt, so dass der Mittelclick nicht
//                          zu dem selben Artikel führt sondern zum Bild.
// v1.5.4 - 03.08.2017 Fix: Anti-pagination Font
// v1.5.3 - 28.07.2017 Added: Anti-pagination funktioniert auch für Artikel (im Gegensatz zu Meldungen),
//                     Fix: Anti-pagination laden verbessert,
//                     Remove: <pre>-fix aus früheren Zeiten.
// v1.5.2 - 13.07.2017 Fix, für den Fall, dass Werbung mit eigenem footer eingebunden ist
// v1.5.1 - 04.07.2017 Fix: Anti-pagination. Lädt jetzt nur Seiten nach der jetzigen.
// v1.5   - 03.07.2017 Added: Anti-pagination, hängt Inhalt der nächsten Seiten an den Artikel an.
// v1.4.1 - 10.03.2017: Fixed: Serifen-Einstellung wird gespeichert
// v1.4 - 10.03.2017: Added: Checkbox um zwischen Serifenschrift und Standard umzuschalten.
//                               Added: Autmoatisch Thread-Anzeige einblenden.
//                               Added: Startet mit https-URL.
//                               Der Einfachheit Kompatibilität für Jahre alte Browser aufgegeben.
//                               Changelog jetzt auf deutsch. Bitte trotzdem nicht Afd wählen.
// v1.3.1 - 14.05.2015: Fix: Text in unordered list has the same size as the rest,
//                      small code simplification
// v1.3 - 02.03.2015: Added: Back Button for the end of a gallery
// v1.2.5 - 12.02.2015: Fix: lead image anti popup
// v1.2.4 - 18.12.2014: Clicking the article's lead image ("aufmacherbild") will redirect to full size image instead of heise's container page for it (only some pictures are actually inserted downsized).
// v1.2.3 - 18.12.2014: Fix: Links at the top werent clickable
// v1.2.2 - 14.10.2014: Compatibility fix for Greasemonkey
// v1.2.1 - 22.03.2014: Fixed meldung_wrapper text content to have the new style as well
// v1.2 - 01.03.2014: Now uses GM_addStyle to change article style.
//						Text in <pre> tags is readable in whole width
// v1.1.1 - 16.11.2013: fixed h2-link-construction
//

(function () { // function wrapper for Opera

GM_addStyle(
    '.easy-reading-serif {'+
        'font-family: Georgia,"Times New Roman",serif;' +
        'line-height: 155%;' +
        //'padding: 0.5em 0;' +
        //'font-size: 1em !important;' +
        //'letter-spacing: 0.2px;' +
    '}' +
    '#mitte_news ul {' +
        'font-size: 1em !important;' +
    '}'+
    /* remove top margin */
    '#bannerzone {' +
        'display:none'+
    '}'+
    '.ad-container {' +
        'height: 0px;' +
    '}'
);

function fixImageLinks() {
    /* prevent image popups, rather insert normal hyperlink
        bild_links, bild_rechts
     **/
    var inlineImages = document.evaluate('//span[starts-with(@class,"bild_")]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null),
        i, span, img, a, bigImageURL;
    for(i = 0; i < inlineImages.snapshotLength; i++) {
        //console.log("Snapshot item " + i);
        span = inlineImages.snapshotItem(i);
        img = span.children[0];

        a = document.createElement('a');
        bigImageURL = img.getAttribute('data-zoom-src');
        if (!bigImageURL) continue;
        a.href = bigImageURL;

        // cloning a node removes all event listeners, so the popup as well
        a.appendChild(img.cloneNode(false));

        span.insertBefore(a, img);
        span.removeChild(img);
    }

    var grossbilder = document.querySelectorAll('a[data-grossbildsrc]');
    for (i = 0; i < grossbilder.length; i++) {
        img = grossbilder[i];
        var src = img.getAttribute('data-grossbildsrc');
        console.log("found image " + img);
        if (!src) continue;
        console.log("Fixing source");
        img.href = src;
    }
}

fixImageLinks();

/* link to full size picture for aufmacherbild */
var imgAufmacher, aAufmacher;
if (document.getElementsByClassName("aufmacherbild")[0]) {
	aAufmacher = document.getElementsByClassName("aufmacherbild")[0].children[0];
	imgAufmacher = aAufmacher.children[0];
}

var a;

if (imgAufmacher) {

	a = document.createElement('a');

	// class for the zoom overlay image in the bottom right corner
	a.setAttribute('class', 'image_zoom');
	// console.log(imgAufmacher.src.replace(/\/scale.*?\/imgs\//i, "/imgs/"));
	a.href = imgAufmacher.src.replace(/\/scale.*?\/imgs\//i, "/imgs/");

	// cloning a node removes all event listeners, so the popup as well
	a.appendChild(imgAufmacher.cloneNode(false));

	document.getElementsByClassName("aufmacherbild")[0].insertBefore(a, aAufmacher);
	document.getElementsByClassName("aufmacherbild")[0].removeChild(aAufmacher);
}

/* gallery fix: enable back button on advertisement slide */

if (document.querySelector(".gallery")) {
	a = document.createElement("a");
	a.setAttribute("data-slide", "prev");
	a.setAttribute("class", "gallery-control slide slide-prev greasy-added");
	a.innerHTML = '<span class="fa fa-angle-left fa-4x fa-inverse"></span>';
	// we need two of this, make deep copy
	var b = a.cloneNode(true);

	/* Several reasons why this runs as an interval:
	 * 1) I have found no way to hook into the event emitter
	 * 2) Every time changing tabs and returning to the page removes the button
	 * 3) Every time this back button is pressed, it's removed
	 * We could probably use the MutationObserver ... Maybe I'll look into it
	 * to see if it's lower on resources
	 */
	var galleryGuard = window.setInterval(function(){
		if (document.querySelector('.image-num').innerHTML.indexOf("Zurück zum Start") !== -1
            && document.querySelectorAll('.greasy-added').length != 2) {

			// modal window / fullscreen mode?
			// probably better to add the button to both views
			//if (document.querySelector(".gallery .heise-modal").style.display != "none") {
				document.querySelector(".image-stage").appendChild(a);
			//}
			//else {
				document.querySelector(".gallery-inner").appendChild(b);
			//}
		}
	}, 200);
}

/* Thread-Anzeige einblenden im Forum */
if (document.querySelector('.thread_view_switch a')
		&& document.querySelector('.thread_view_switch a').textContent == "Thread-Anzeige einblenden") {
	document.querySelector('.thread_view_switch a').click();
}

/* Serif checkbox */

function makeSerif(serifIfTrue) {
	var articleTextElements = document.querySelectorAll('.meldung_wrapper, .meldung_wrapper p, .meldung_wrapper h5, .artikel_content article p, .article-wrapper, .article-wrapper p, .article-wrapper h5, .article-content, .article-content p');
	var i = 0;
	for (i = 0; i < articleTextElements.length; i++) {
		if (serifIfTrue) {
			articleTextElements[i].classList.add("easy-reading-serif");
		}
		else {
			articleTextElements[i].classList.remove("easy-reading-serif");
		}
	}
}

function serifCheckboxHandler(){
	var checkbox = document.getElementById('useSerifFont');
	// this is already the new value
	var newValue = checkbox.checked;

	makeSerif(newValue);

	//console.log("setting to " + newValue);
	GM_setValue( "serifFont", newValue);

	//console.log("After checkbox: " + GM_getValue( "serifFont", false ));
}

var articleNode = document.querySelector("article");
if (articleNode) {
	var label = document.createElement('label');
	var serifToggleLabel = document.createTextNode("Serifen-Schrift");
	var checkbox = document.createElement('input');
	checkbox.setAttribute('type', 'checkbox');
	checkbox.setAttribute('id', 'useSerifFont');
	label.appendChild(checkbox);
	label.appendChild(serifToggleLabel);

	var userSetting = GM_getValue( "serifFont", "init" );
	if (userSetting == "init") {
		GM_setValue( "serifFont", false );
		userSetting = false;
	}

	checkbox.checked = userSetting;
	makeSerif(userSetting);

	checkbox.addEventListener('click', serifCheckboxHandler);
	articleNode.appendChild(label);
}

var pagination = document.querySelector('.seitenweise_navigation.paginiert');
var wrapperSelector = '.meldung_wrapper', lastPageAppended, url, nextPageTeaser;

if (pagination) {
    if (!document.querySelector(wrapperSelector)) {
        if (document.querySelector('.article-content')) {
            wrapperSelector = '.article-content';
        }
        else {
            throw "Error: article element not found";
        }
    }
    var promises = [];
    var thisPage = document.querySelector('.pagination b');
    lastPageAppended = parseInt(thisPage.innerHTML);
    while (thisPage.nextElementSibling &&
           thisPage.nextElementSibling.tagName.toLowerCase() == 'a') {
        thisPage = thisPage.nextElementSibling;
        // append load notify synchronously to ensure order
        var loadNotify = document.createElement('div');
        loadNotify.innerHTML = "Lade Seite " + thisPage.innerHTML + "...";
        document.querySelector(wrapperSelector).appendChild(loadNotify);
        // avoid cross origin request because heise links to http instead of https
        url = thisPage.getAttribute('href').replace(/^https?/,
                   location.href.match(/^https?/)[0]);
        promises.push(fetchPage(url, thisPage.innerHTML, loadNotify));
    }
    Promise.all(promises)
        .then(function() {
            fixImageLinks();
            pagination.remove();
            nextPageTeaser = document.querySelector('.kapitel');
            if (nextPageTeaser) {
                nextPageTeaser.remove();
            }
    });
}

function fetchPage(url, pageNum, loadNotify) {
    return new Promise(function(resolve, reject) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                var responseDoc = document.createElement('html');
                responseDoc.innerHTML = response.responseText;
                var meldung_new = responseDoc.querySelector(wrapperSelector);
                var fragment = document.createDocumentFragment();

                // find chapter title
                var chapter_title = responseDoc.querySelector('.article__chapter');
                if (chapter_title) {
                    chapter_title.className = "subheading";
                    fragment.appendChild(chapter_title);
                }
                // remove ToC

                var toc = meldung_new.querySelector('.pre-akwa-toc') || meldung_new.querySelector('.article-toc__collapse');
                meldung_new.removeChild(toc);
                // append to article
                while(meldung_new.children.length > 0) {
                    fragment.appendChild(meldung_new.children[0]);
                }
                loadNotify.parentNode.replaceChild(fragment, loadNotify);
                resolve();
            },
            onerror: function(response) {
                loadNotify.innerHTML = "Laden von Seite " + pageNum + " fehlgeschlagen(" + response.statusText + "): " + response.responseText;
                reject("Seite " + pageNum + " nicht geladen");
            }
        });
    });
}

})(); // function wrapper for Opera