// ==UserScript==
// @name         insert_anzahl_schiffe
// @namespace    http://tampermonkey.net/
// @version      0.1
// @datetime     27.12.2016 20:24
// @description  try to take over the world!
// @author       S.K.
// @match        https://uni3.xorbit.de/imperium.php*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    console.log(document.URL);
    if(document.URL.match('imperium.php')){
        fn_start();
    }
})();

function fn_start(){
    console.log('start..imperium');
console.log('frames: ');
alert(top.frames.length);
    jQuery = top.$;

    jQuery('center>table>tbody',frames[1].document)[2].insertRow(3).id = 'ben_gTr';
    jQuery('#ben_gTr',frames[1].document)[0].appendChild(document.createElement('th')).innerHTML = 'ben_gTr (vorh_gTr)';
    for(var i=1; i<=$('#pselector')[0].length;i++){
        iMet = (parseInt(jQuery('center>table>tbody',frames[1].document)[2].rows[7].cells[i].innerText.replace(/\./g,'')));
        iKris = (parseInt(jQuery('center>table>tbody',frames[1].document)[2].rows[8].cells[i].innerText.replace(/\./g,'')));
        iDeut = (parseInt(jQuery('center>table>tbody',frames[1].document)[2].rows[9].cells[i].innerText.replace(/\./g,'')));
        iTr_vorh = jQuery('center>table>tbody',frames[1].document)[2].rows[32].cells[i].innerText;
        sText = parseInt((iMet+iKris+iDeut)/25000) + ' (' + parseInt(iTr_vorh) + ')';
        jQuery('#ben_gTr',frames[1].document)[0].appendChild(document.createElement('th')).innerHTML = sText;
    }
}

