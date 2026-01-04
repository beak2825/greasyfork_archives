// ==UserScript==
// @name         xvideos
// @namespace    https://www.xvideos.com/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        https://www.xvideos.com/*
// @grant        none


/*

add to hosts file:

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

$("div").remove(".mobile-hide");
$("div").remove(".large-screen-show");


}
// load jQuery and execute the main function
addJQuery(main);
// @downloadURL https://update.greasyfork.org/scripts/391396/xvideos.user.js
// @updateURL https://update.greasyfork.org/scripts/391396/xvideos.meta.js
// ==/UserScript==
