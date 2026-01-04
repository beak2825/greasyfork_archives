// ==UserScript==
// @name         Get True link
// @namespace    https://github.com/MeGaNeKoS/skip-short-link
// @version      1.5.3
// @description  Script to baypass most short link!! this script to auto decode short link when you got redirect link. save your time, save your money. any request / error put it in feedback you can try on this web https://www.juragan-anime.net/series/boruto-naruto-next-generations-sub-indo/ https://anoboy.video/2019/11/boruto-episode-133/
// @author       MeGaNeKo(めがねこ)
// @match        *://*/*
// @exclude      *//*uploaded.net/*
// @exclude      *//*okedrive.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/392758/Get%20True%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/392758/Get%20True%20link.meta.js
// ==/UserScript==

document.onreadystatechange = function () {
    decode();
};
function decode(){
    $('a').each(function(){
        var aaa = this.href;
        var aab = decodeURIComponent(aaa.toString());
        var cp1 = aab.includes('aHR0');
        var cp2 = aab.includes('http');
        if (cp1 == true){
            try {
                var bba = aab.split("aHR0")[0];
                var bbb = aab.split(bba)[1];
                var bbc = bbb.split(/[^A-Za-z0-9_.:/\\-]/g)[0];
                var bbd = atob(bbc);
                var bbe = bbd.replace(/([_=:;&\-\/\.\?\d\w]+(\d|\w))/g,'');
                var bbf = bbd.replace(bbe,'');
                $(this).attr("href", bbf);
            }catch(err) {
                $(this).attr("href", aaa);
            }
        }
    });
}
