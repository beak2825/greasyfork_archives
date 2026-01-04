// ==UserScript==
// @name         heavy-r
// @namespace    https://www.heavy-r.com/
// @version      0.3
// @description  enter something useful
// @author       You
// @match        https://www.heavy-r.com/*
// @grant       none
/*

add to hosts file:

127.0.0.1 rt.bongacams.com
127.0.0.1 bongacams.com
127.0.0.1 syndication.globaltraffico.com
127.0.0.1 sovetnik.market.yandex.ru
127.0.0.1 qrlsx.com
127.0.0.1 bongacams.com
127.0.0.1 ab.advertiserurl.com
127.0.0.1 rpc-php.trafficfactory.biz
127.0.0.1 www.camdolls.com
127.0.0.1 camdolls.com
127.0.0.1 www.iwanttodeliver.com
127.0.0.1 iwanttodeliver.com
127.0.0.1 servingmillions.com
127.0.0.1 cradver.livejasmin.com
127.0.0.1 livejasmin.com
#127.0.0.1 cdn.fluidplayer.com
#127.0.0.1 fluidplayer.com
127.0.0.1 cdn01.flashmediaportal.com
127.0.0.1 flashmediaportal.com
127.0.0.1 camonster.com
127.0.0.1 m.sancdn.net
127.0.0.1 hrahdmon.com
127.0.0.1 pornedup.com
127.0.0.1 humoron.com
127.0.0.1 porneone.com
127.0.0.1 escoporn.com
127.0.0.1 alcaporne.com
127.0.0.1 repornio.com
127.0.0.1 superzooi.com
127.0.0.1 pornoman.pl
127.0.0.1 porno-gwalty.pl
127.0.0.1 inzest.yolasite.com
127.0.0.1 sukatoro.org
127.0.0.1 an.yandex.ru
127.0.0.1 om.grepolis.com
127.0.0.1 om.grepolis.com
127.0.0.1 trc.taboola.com
127.0.0.1 cdn.taboola.com
127.0.0.1 secure-us.imrworldwide.com
127.0.0.1 dt.adsafeprotected.com
127.0.0.1 sb.scorecardresearch.com
127.0.0.1 l.aaxads.com
127.0.0.1 l3.aaxads.com
127.0.0.1 aaxads.com
127.0.0.1 pixel.adsafeprotected.com
127.0.0.1 adsafeprotected.com
127.0.0.1 securepubads.g.doubleclick.net
127.0.0.1 delivery.adrecover.com
127.0.0.1 tags.bkrtx.com
127.0.0.1 cdn.static.zdbb.net
127.0.0.1 walker.zdbb.net
127.0.0.1 zdbb.net
127.0.0.1 stags.bluekai.com
127.0.0.1 cp.cbbp1.com.
127.0.0.1 cbbp1.com.
127.0.0.1 ads.trafficjunky.net
127.0.0.1 trafficjunky.net
127.0.0.1 stats.g.doubleclick.net
127.0.0.1 g.doubleclick.net
127.0.0.1 doubleclick.net
127.0.0.1 pro.revitalizing.club
127.0.0.1 revitalizing.club
127.0.0.1 tour.camsoda.com
127.0.0.1 camsoda.com
127.0.0.1 cp.dbbp1.net
127.0.0.1 dbbp1.net
127.0.0.1 sexsimulator.com
127.0.0.1 securejoinsite.com
127.0.0.1 cp.ebbp1.net
127.0.0.1 ebbp1.net
127.0.0.1 imgdrive.net.dbbp1.com
127.0.0.1 net.dbbp1.com
127.0.0.1 dbbp1.com
127.0.0.1 mydailytips.net
#127.0.0.1 cdn.dopc.cz
#127.0.0.1 it.recoco.it
127.0.0.1 m.sancdn.net
127.0.0.1 jsc.adskeeper.co.uk
127.0.0.1 adskeeper.co.uk


*/


var $ = window.jQuery;

function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

function main(){
$("a").remove(".hd-ban");
$("a").remove(".hd-bar");
$('.sponsor-popup').remove();
$('.big-buttons').remove();

var els = document.getElementsByTagName("a"), els_length = els.length;

for (var i = 0, l = els_length; i < l; i++) {
    var el = els[i];
    if (el.href.substring(0, 22) === 'http://www.pornmd.com/') {
        el.innerHTML = "ads removed";
        el.href = "#";
    }
}
for (i = 0, l = els_length; i < l; i++) {
    el = els[i];
    if (el.href.substring(0, 22) === 'http://api.pornmd.com/') {
        el.innerHTML = "ads removed";
        el.href = "#";
    }
}

for (i = 0, l = els_length; i < l; i++) {
    el = els[i];
    if (el.href.toUpperCase().indexOf('SCAT') != -1){
        el.innerHTML = "scat removed";
        el.href = "#";
    }
}

for (i = 0, l = els_length; i < l; i++) {
    el = els[i];
    if (el.href.toUpperCase().indexOf('RIMJOB') != -1){
        el.innerHTML = "rimjob removed";
        el.href = "#";
    }
}

for (i = 0, l = els_length; i < l; i++) {
    el = els[i];
    if (el.href.toUpperCase().indexOf('TOILET') != -1){
        el.innerHTML = "toilet removed";
        el.href = "#";
    }
}



for (i = 0, l = els_length; i < l; i++) {
    el = els[i];
    if (el.href.toUpperCase().indexOf('POOP') != -1){
        el.innerHTML = "poop removed";
        el.href = "#";
    }
}

for (i = 0, l = els_length; i < l; i++) {
    el = els[i];
    if (el.href.toUpperCase().indexOf('TURD') != -1){
        el.innerHTML = "turd removed";
        el.href = "#";
    }
}



for (i = 0, l = els_length; i < l; i++) {
    el = els[i];
    if (el.href.toUpperCase().indexOf('SHIT') != -1){
        el.innerHTML = "shit removed";
        el.href = "#";
    }
}

for (i = 0, l = els_length; i < l; i++) {
    el = els[i];
    if (el.href.toUpperCase().indexOf('POOPING') != -1){
        el.innerHTML = "pooping removed";
        el.href = "#";
    }
}

for (i = 0, l = els_length; i < l; i++) {
    el = els[i];
    if (el.href.toUpperCase().indexOf('PUKING') != -1){
        el.innerHTML = "puking removed";
        el.href = "#";
    }
}

for (i = 0, l = els_length; i < l; i++) {
    el = els[i];
    if (el.href.toUpperCase().indexOf('PISS') != -1){
        el.innerHTML = "piss removed";
        el.href = "#";
    }
}

for (i = 0, l = els_length; i < l; i++) {
    el = els[i];
    if (el.href.toUpperCase().indexOf('VOMIT') != -1){
        el.innerHTML = "vomit removed";
        el.href = "#";
    }
}

window.setTimeout(function(){document.getElementsByClassName('adskeeper-holder')[0].remove()},5000);
window.setTimeout(function(){document.getElementsByClassName('adskeeper-item')[0].remove()},4500);
window.setTimeout(function(){document.getElementsByClassName('adskeeper-holder')[0].remove()},6000);
window.setTimeout(function(){document.getElementsByClassName('adskeeper-item')[0].remove()},5500);
}

// load jQuery and execute the main function
addJQuery(main);


//unsafeWindow.setTimeout(function(){$(".adskeeper-holder").remove()},5000);
//unsafeWindow.setTimeout(function(){document.getElementsByClassName("adskeeper-holder")[0].remove()},5000);

//var script = document.createElement('script');
//script.appendChild(document.createTextNode(openPopup));
//script.innerHTML = "window.setTimeout(function(){document.getElementsByClassName('adskeeper-holder')[0].remove()},5000)";
//(document.body || document.head || document.documentElement).appendChild(script);

//var script = document.createElement("script");
//script.textContent = "window.setTimeout(function(){document.getElementsByClassName('adskeeper-holder')[0].remove()},5000);";
//document.body.appendChild(script);


// @downloadURL https://update.greasyfork.org/scripts/391395/heavy-r.user.js
// @updateURL https://update.greasyfork.org/scripts/391395/heavy-r.meta.js
// ==/UserScript==
