// ==UserScript==
// @name        CH Yahoo Color-Coded Results
// @author      clickhappier
// @namespace   clickhappier
// @description Change background color of Yahoo search ad areas and other special types of results.
// @version     1.3.1c
// @include     http*://search.yahoo.*/search*
// @include     http*://*.search.yahoo.*/search*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4901/CH%20Yahoo%20Color-Coded%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/4901/CH%20Yahoo%20Color-Coded%20Results.meta.js
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


// ads
addGlobalStyle('.ads { background-color: darkgray ! important; }');
addGlobalStyle('.east_ad_bg { background-color: darkgray ! important; }');
addGlobalStyle('.spns { background-color: darkgray ! important; }');
addGlobalStyle('.more-sponsors { background-color: darkgray ! important; }');
addGlobalStyle('.ge5xr { background-color: darkgray ! important; }');
addGlobalStyle('.n62yo { background-color: darkgray ! important; }');
addGlobalStyle('.east_ad_block { background-color: darkgray ! important; }');
addGlobalStyle('.hjthq { background-color: darkgray ! important; }');
addGlobalStyle('.i6hh0 { background-color: darkgray ! important; }');
addGlobalStyle('.r905 { background-color: darkgray ! important; }');
addGlobalStyle('.q3t56 { background-color: darkgray ! important; }');

// shopping results
addGlobalStyle('.shpmm { background-color: lightgreen ! important; }');
addGlobalStyle('.sc-east { background-color: lightgreen ! important; }');

// local business results
addGlobalStyle('.sc-lc-fm { background-color: #DAFFC8 ! important; }');   // light lime green
addGlobalStyle('#sc-content { background-color: #DAFFC8 ! important; }');   // light lime green
addGlobalStyle('.LocalPc-listings { background-color: #DAFFC8 ! important; }');   // light lime green
addGlobalStyle('.MvShwTm { background-color: #DAFFC8 ! important; }');   // light lime green

// news results
addGlobalStyle('.sys_news_auto { background-color: powderblue ! important; }');
addGlobalStyle('.DigiMagAll { background-color: powderblue ! important; }');
addGlobalStyle('.sys_topnews { background-color: powderblue ! important; }');
addGlobalStyle('.FinNewsSrch { background-color: powderblue ! important; }');

// image and video results
addGlobalStyle('.imgdd { background-color: thistle ! important; }');   // light purple
addGlobalStyle('.dd.Img { background-color: thistle ! important; }');   // light purple
addGlobalStyle('.compImageList { background-color: thistle ! important; }');   // light purple
addGlobalStyle('.viddd { background-color: thistle ! important; }');   // light purple
addGlobalStyle('.dd.Video { background-color: thistle ! important; }');   // light purple
addGlobalStyle('.dd.TumblrV2 { background-color: thistle ! important; }');   // light purple

// knowledge sidebar results
addGlobalStyle('#yplocal_default_rr { background-color: #FF9966 ! important; }');   // light orange
addGlobalStyle('.kgdd { background-color: #FF9966 ! important; }');   // light orange
addGlobalStyle('.KgPeopleAnswerBox { background-color: #FF9966 ! important; }');   // light orange
addGlobalStyle('.sys_spark { background-color: #FF9966 ! important; }');   // light orange
addGlobalStyle('.sys_movie_series { background-color: #FF9966 ! important; }');   // light orange
addGlobalStyle('.KgMovies { background-color: #FF9966 ! important; }');   // light orange
addGlobalStyle('.compImagePoster { background-color: #FF9966 ! important; }');   // light orange
addGlobalStyle('.FinTrendng { background-color: #FF9966 ! important; }  .FinTrendng img { background-color: white ! important; }');   // light orange
addGlobalStyle('.trendingnowgfts-srp-lite { background-color: #FF9966 ! important; }');   // light orange

// related search results
addGlobalStyle('#satat { background-color: moccasin ! important; }');   // light tan
addGlobalStyle('.AlsoTry { background-color: moccasin ! important; }');   // light tan
addGlobalStyle('.compList.ac-1st { background-color: moccasin ! important; }');   // light tan
addGlobalStyle('.compDlink .ac-1st { background-color: moccasin ! important; }');   // light tan
addGlobalStyle('.more-sponsors { background-color: moccasin ! important; }');   // light tan

// un-'stick' sidebar
addGlobalStyle('.stckr { position: static ! important; }');
addGlobalStyle('#right div { position: static ! important; }');
