// ==UserScript==
// @name         SubsceneSubtitlesListYearFilter
// @name:ar      Subscene-فلتر
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  Subscene Show only specified production year in the Latest subtitles list, e.g. 2023!
// @description:ar  عرض Subscene  أفضل الأعمال حسب سنة الإنتاج ، على سبيل المثال 2023!
// @author       SalimF
// @match        https://subscene.com/browse/latest/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=subscene.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458482/SubsceneSubtitlesListYearFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/458482/SubsceneSubtitlesListYearFilter.meta.js
// ==/UserScript==

(function() {
    'use strict';
var year='2023'; //you only need to change this year number
var Neo;
year="("+year+")";
var tble=document.querySelectorAll( 'div.box > div > table > tbody > tr' ); 
var ln =tble.length;var i = 0;
for ( i= ln - 1 ; i >= 0 ; i-- )
{
 Neo =tble[i].querySelector( 'span.new > div' );
 if( Neo.innerText != year )
 tble[i].style.display="none" ;
}

})();