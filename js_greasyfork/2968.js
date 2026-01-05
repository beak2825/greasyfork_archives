// ==UserScript==
// @name        CH Google Color-Coded Results
// @author      clickhappier
// @namespace   clickhappier
// @description Change background color of Google search ad areas and other special types of results. Google Instant should be disabled.
// @version     1.2c
// @include     http*://www.google.*/search?*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2968/CH%20Google%20Color-Coded%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/2968/CH%20Google%20Color-Coded%20Results.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// top ads
addGlobalStyle('#tads { background-color: darkgray ! important; }');

// right-side ads
addGlobalStyle('#mbEnd { background-color: darkgray ! important; }');

// bottom ads
addGlobalStyle('#tadsb { background-color: darkgray ! important; }');


// top shopping results
addGlobalStyle('.commercial-unit-desktop-top { background-color: lightgreen ! important; }');

// right-side shopping results
addGlobalStyle('.commercial-unit-desktop-rhs { background-color: lightgreen ! important; }');


// local business results
addGlobalStyle('#lclbox { background-color: #DAFFC8 ! important; }');   // light lime green


// news results
addGlobalStyle('#newsbox { background-color: powderblue ! important; }');
addGlobalStyle('div.mnr-c._yE { background-color: powderblue ! important; }');

// in-depth articles results
addGlobalStyle('.r-search1, .r-search2, .r-search3 { background-color: powderblue ! important; }');
addGlobalStyle('.r-search4, .r-search5, .r-search6 { background-color: powderblue ! important; }');
addGlobalStyle('.r-search7, .r-search8, .r-search9 { background-color: powderblue ! important; }');
addGlobalStyle('.r-search-1, .r-search-2, .r-search-3 { background-color: powderblue ! important; }');
addGlobalStyle('.r-search-4, .r-search-5, .r-search-6 { background-color: powderblue ! important; }');
addGlobalStyle('.r-search-7, .r-search-8, .r-search-9 { background-color: powderblue ! important; }');


// image results
addGlobalStyle('#imagebox_bigimages { background-color: thistle ! important; }');   // light purple


// knowledge sidebar results
addGlobalStyle('.kp-blk { background-color: #FF9966 ! important; }');   // light orange


// related search results
addGlobalStyle('#brs { background-color: moccasin ! important; }');   // light tan
