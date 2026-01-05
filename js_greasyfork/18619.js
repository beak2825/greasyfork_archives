// ==UserScript==
// @name        rym rated albums highlighter
// @namespace   de.mathesnet
// @description highlights the albums you have rated in the lists on rateyourmusic.com
// @include     https://rateyourmusic.com/charts/top/album/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18619/rym%20rated%20albums%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/18619/rym%20rated%20albums%20highlighter.meta.js
// ==/UserScript==
(function () {
    var init = function () {
        document.addEventListener('DOMContentLoaded', function () {
            console.log('rym in-list marker initialized');
            iterateAndQuery();
        });
    };
    var iterateAndQuery = function () {
        var elements = document.querySelectorAll('.album');
        for (i = 1; i < elements.length; i++) {
            queryAndUpdate(elements[i]);
        }
    };
    var queryAndUpdate = function (elem) {
        queryAlbum(elem.href, function () {
            console.log(elem.text + ' is in list. updating.');
            elem.parentNode.parentNode.parentNode.parentNode.classList.add('inList');
        });
    };
    var queryAlbum = function (elementUrl, updateCallback) {
        console.log('querying for :' + elementUrl);
        var xhrRequest = new XMLHttpRequest();
        xhrRequest.addEventListener('load', function () {
            xhrSucessListener(this, updateCallback);
        });
        xhrRequest.addEventListener('error', xhrErrorListener);
        xhrRequest.addEventListener('abort', xhrErrorListener);
        xhrRequest.open('GET', elementUrl);
        xhrRequest.responseType = 'document';
        xhrRequest.send();
    };
    var xhrSucessListener = function (that, updateCallback) {
        //console.log('response success');
        var responseDocument = that.responseXML;
        // var ratingElement = responseDocument.querySelector('.rating_num'); // oh yeah, this would have been far too easy..
        var rymRating = makeTheUniverseExplode(responseDocument);
        if (hasRating(rymRating)) {
            updateCallback();
        }
    };
    var makeTheUniverseExplode = function (responseDocument) {
        return responseDocument.querySelector('.release_my_catalog>script').innerHTML.trim().match(/, (\d) \);/) [1];
    };
    var hasRating = function (ratingString) {
        return parseInt(ratingString, 10) > 0;
    };
    var xhrErrorListener = function (response) {
        console.log('rym_in_list_Marker error');
    };
    init();
}) ();
/**
add some styling via Stylish like:

   .inList img {
      opacity: .5;
   }

   .inList .album {
      color: gray;
   }
   .inList .album::after {
      content: ' ✓';
   }

*/
