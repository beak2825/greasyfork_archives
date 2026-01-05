// ==UserScript==
// @name           Tusfiles Auto Downloader Rev 2014
// @description    Automatically download From Tusfiles
// @namespace      http://cepot-gaul.blogspot.com/
// @author         Mohammed Dikdik Rahmadi
// @version        4.0.4
// @date           07-05-2015
// @include        *://*.tusfiles.net/*
// @downloadURL https://update.greasyfork.org/scripts/2291/Tusfiles%20Auto%20Downloader%20Rev%202014.user.js
// @updateURL https://update.greasyfork.org/scripts/2291/Tusfiles%20Auto%20Downloader%20Rev%202014.meta.js
// ==/UserScript==

var f= $('form'); 
if(f[0].quick != null) { 
//uncheck "use our download manager"
f[0].quick.checked = false;

var d= $( 'button' ); 
if(d != null) d.click(); 
}