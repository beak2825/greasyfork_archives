// ==UserScript==
// @name         songsterr print enable
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ReEnable Print!
// @author       Peppie
// @match        *://www.songsterr.com/a/wsa/*
// @match        *://www.songsterr.com/a/wa/enabledFeatures*
// @grant        none
// 
// Ways to get Plus for free
//
// 1. Promo 2 weeks of Plus free via referlink
// -> http://www.songsterr.com/a/wa/plus
// -> on the right click the green 'GET PLUS free' button
// -> open the referlink in some other browser, private tab or browser profile
// Email->[Songsterr] You've got 2 weeks of Plus free / Congrats! Your friend has just clicked on your referral link and you both got 2 weeks of Plus free.
//
// 2. Via Proxy (Charles Proxy or Burp)
// -> Remap all //www.songsterr.com/a/wa/enabledFeatures* to
// //www.songsterr.com/a/wa/enabledFeatures?songId=269
// since that is the demosong(http://www.songsterr.com/a/wsa/nirvana-smells-like-teen-spirit-tab-s269t0) with all allowed
//
// To compare and better understand check for ex //www.songsterr.com/a/wa/enabledFeatures?songId=47630
// it is //www.songsterr.com/a/wsa/monty-python-always-look-on-the-bright-side-of-life-tab-s47630t1
// and it's limited
//<enabledFeatures>
//<playback/>
//<mute/>
//<countIn/>
//</enabledFeatures>

// @downloadURL https://update.greasyfork.org/scripts/19247/songsterr%20print%20enable.user.js
// @updateURL https://update.greasyfork.org/scripts/19247/songsterr%20print%20enable.meta.js
// ==/UserScript==
    
(function() {
    'use strict';
debugger
try {
    // Enable printing
    var NO  = 'deny-print'  ;
    var YES = 'allow-print' ;
    var NoPrint = document.getElementsByClassName( NO )[0] ;
    NoPrint.className = NoPrint.className
        .replace( NO , YES );
} catch (e) {}    
try {
   
    // Enable print button
    var PrintButton = document.getElementsByClassName( 'print-button' )[0] ;
    PrintButton.className = PrintButton.className
        .replace( 'forbidden', 'enabled' );
    
    PrintButton.removeAttribute(  'rel'                       );
    PrintButton   .setAttribute( 'href', 'javascript:print()' );
} catch (e) {}    
try {
    
    // No Ads
    var Ads = document.getElementsByClassName( 'Ads' )
    
    var forEach = Array.prototype.forEach;
    forEach.call(Ads, function(item) {
        debugger
        item.remove();
    });
} catch (e) {}    
try {
    
    // No © 2016, Songsterr.com
    document.getElementById( 'print-ft' ).remove();
} catch (e) {}    
    
    
})();