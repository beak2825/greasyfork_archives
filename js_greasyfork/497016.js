// ==UserScript==
// @name         Force Google to UK with AI Searched Removed
// @icon         https://upload.wikimedia.org/wikipedia/commons/2/2d/Google-favicon-2015.png
// @version      1.0
// @license      MIT
// @namespace    https://github.com/darthvader666uk
// @homepageURL  https://github.com/darthvader666uk/force-google-to-uk-with-removed-ai-search
// @supportURL   https://github.com/darthvader666uk/force-google-to-uk-with-removed-ai-search/issues
// @description  Automatically appends QSP &gl=gb (  , '&cr=countryUK|countryGB': '', '&tbs=ctr:countryUK|countryGB,qdr:y': '') to Force to google but kill AI with &udm=14
// @author       darthvader666uk
// @match        https://www.google.co.uk/*
// @match        https://www.google.com/*
// @match        https://www.google.*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/497016/Force%20Google%20to%20UK%20with%20AI%20Searched%20Removed.user.js
// @updateURL https://update.greasyfork.org/scripts/497016/Force%20Google%20to%20UK%20with%20AI%20Searched%20Removed.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const originalWindowLocation = window.location.href;
    const queryString = window.location.search;
    const SearchUrls = ['https://www.google.co.uk/s', 'https://www.google.com/s']
    const sortQsp = '&gl=gb&udm=14';
    if (SearchUrls.some(substr => window.location.href.startsWith(substr)) && !window.location.href.includes(sortQsp)) {
        //Now Covert the URL
        const newWindowLocation = "https://www.google.co.uk/search";
        const newQsp = replaceAll(queryString, {'&gl=gb': '', '&udm=14': ''});
        window.location.replace(`${newWindowLocation}${newQsp}${sortQsp}`);
    }
})();

function replaceAll(str,mapObj){
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
    return str.replace(re, function(matched){
        return mapObj[matched.toLowerCase()];
    });
}
