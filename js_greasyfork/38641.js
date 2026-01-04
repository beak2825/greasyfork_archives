// ==UserScript==
// @name         PlexExternalReview
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This tampermonkey.net script will add external links to review websites like [commonsensemedia.org]
// @author       info@alientech.software
// @match        http*://*/web/index.html*
// @include      /^https?://.*:32400/web/index.html*
// @include      http://*:32400/web/index.html*
// @grant        GM_*
// @grant        unsafeWindow
// @run-at       document-end
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @locale       'en-US'

// @downloadURL https://update.greasyfork.org/scripts/38641/PlexExternalReview.user.js
// @updateURL https://update.greasyfork.org/scripts/38641/PlexExternalReview.meta.js
// ==/UserScript==
var AlreadyInjected = false;
var LastURL = "";

var Reset = function() {
    // I don't know of a better way to detect URL changes
    if (LastURL !== window.location.href) {
        LastURL = window.location.href;
        AlreadyInjected = false;
        console.log("CommonSenseMedia Reset");
        return true;
    }
    return false;
};

var GetTitle = function() {
    var title = jQuery("[class*='PrePlayPrimaryTitle-primaryTitle']")[0].textContent;
    return title;
};

var CSM_SEARCH="https://www.commonsensemedia.org/search/";
var PP_SEARCH="http://parentpreviews.com/search?keywords=";
var IMDB_SEARCH="http://www.imdb.com/find?ref_=nv_sr_fn&s=all&q=";

/** Escape RegExp special chars
 * @function escapeRegExp
 * @param string s
 * @return string escaped
 * @brief taken from Greasespot code snippets
 */
function escapeRegExp(s) {
	return s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

var replaceURL = function() {
    Reset();

    if (!AlreadyInjected) {
        var titles = jQuery("[class*='PrePlayTertiaryTitle-tertiaryTitle']")[0];
        var a_elems = titles.getElementsByTagName("a");
        console.log("a_elems = " + a_elems.length);

        for (var i = 0; i < a_elems.length; i++) {
            this_href = a_elems[i].href;
            // console.log("CommonSenseMedia = " + this_href);
            if (this_href.indexOf("contentRating") !== -1) {
                console.log("CommonSenseMedia = Found!");
                // a_elems[i].href = CSM_SEARCH + encodeURIComponent(title);

                title = GetTitle();
                title_encoded = encodeURIComponent(title);
                title_plus = replaceAll(title, " ", "+");

                var cln = a_elems[i].cloneNode(true);
                cln.href = CSM_SEARCH + title_encoded;
                cln.textContent = "CSM";
                a_elems[i].parentNode.appendChild(cln);

                var cln2 = a_elems[i].cloneNode(true);
                cln2.href = PP_SEARCH + title_plus;
                cln2.textContent = "PP";
                a_elems[i].parentNode.appendChild(cln2);

                var cln3 = a_elems[i].cloneNode(true);
                cln3.href = IMDB_SEARCH + title_plus;
                cln3.textContent = "IMDB";
                a_elems[i].parentNode.appendChild(cln3);

                //console.log("new parent = " + a_elems[i].parentNode.innerHTML);
                AlreadyInjected = true;
                break;
            }
        }
    }
};


(function() {
    'use strict';

    // Your code here...
    if (Reset()) {

        // Bind buttons and check for new ones every 100ms
        setInterval(replaceURL, 500);
    }

})();