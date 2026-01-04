// ==UserScript==
// @name         Backstabbr Colored Territories
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Color codes the SC teritorries on the map
// @author       Patrick McCaffrey
// @match        https://www.backstabbr.com/game/*
// @match        https://www.backstabbr.com/sandbox/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/376138/Backstabbr%20Colored%20Territories.user.js
// @updateURL https://update.greasyfork.org/scripts/376138/Backstabbr%20Colored%20Territories.meta.js
// ==/UserScript==

var $ = window.jQuery;

$(document).ready(function() {
    var color;

    color = $( "rect[x='424']" ).attr("fill");
    $( "#ter_Con" ).attr("fill", color);
    $( "#ter_Con" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='278']" ).attr("fill");
    $( "#ter_Nap" ).attr("fill", color);
    $( "#ter_Nap" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='290']" ).attr("fill");
    $( "#ter_Tri" ).attr("fill", color);
    $( "#ter_Tri" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "circle[cx='186']" ).attr("fill");
    $( "#ter_Bel" ).attr("fill", color);
    $( "#ter_Bel" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[y='412']" ).attr("fill");
    $( "#ter_Mar" ).attr("fill", color);
    $( "#ter_Mar" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='254']" ).attr("fill");
    $( "#ter_Kie" ).attr("fill", color);
    $( "#ter_Kie" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "circle[cx='378']" ).attr("fill");
    $( "#ter_Gre" ).attr("fill", color);
    $( "#ter_Gre" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "circle[cx='205']" ).attr("fill");
    $( "#ter_Hol" ).attr("fill", color);
    $( "#ter_Hol" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "circle[cx='323']" ).attr("fill");
    $( "#ter_Swe" ).attr("fill", color);
    $( "#ter_Swe" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='482']" ).attr("fill");
    $( "#ter_Ank" ).attr("fill", color);
    $( "#ter_Ank" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='326']" ).attr("fill");
    $( "#ter_Bud" ).attr("fill", color);
    $( "#ter_Bud" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='263']" ).attr("fill");
    $( "#ter_Ven" ).attr("fill", color);
    $( "#ter_Ven" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='418']" ).attr("fill");
    $( "#ter_Stp" ).attr("fill", color);
    $( "#ter_Stp" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "circle[cx='272']" ).attr("fill");
    $( "#ter_Den" ).attr("fill", color);
    $( "#ter_Den" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='177']" ).attr("fill");
    $( "#ter_Par" ).attr("fill", color);
    $( "#ter_Par" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='258']" ).attr("fill");
    $( "#ter_Mun" ).attr("fill", color);
    $( "#ter_Mun" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "circle[cx='343']" ).attr("fill");
    $( "#ter_Ser" ).attr("fill", color);
    $( "#ter_Ser" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='281']" ).attr("fill");
    $( "#ter_Ber" ).attr("fill", color);
    $( "#ter_Ber" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='424']" ).attr("fill");
    $( "#ter_Smy" ).attr("fill", color);
    $( "#ter_Smy" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='156']" ).attr("fill");
    $( "#ter_Lon" ).attr("fill", color);
    $( "#ter_Lon" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "circle[cx='402']" ).attr("fill");
    $( "#ter_Rum" ).attr("fill", color);
    $( "#ter_Rum" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='479']" ).attr("fill");
    $( "#ter_Sev" ).attr("fill", color);
    $( "#ter_Sev" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='154']" ).attr("fill");
    $( "#ter_Edi" ).attr("fill", color);
    $( "#ter_Edi" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "circle[cx='80']" ).attr("fill");
    $( "#ter_Spa" ).attr("fill", color);
    $( "#ter_Spa" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "circle[cx='377']" ).attr("fill");
    $( "#ter_Bul" ).attr("fill", color);
    $( "#ter_Bul" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='343']" ).attr("fill");
    $( "#ter_War" ).attr("fill", color);
    $( "#ter_War" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='298']" ).attr("fill");
    $( "#ter_Vie" ).attr("fill", color);
    $( "#ter_Vie" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='268']" ).attr("fill");
    $( "#ter_Rom" ).attr("fill", color);
    $( "#ter_Rom" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "circle[cx='220']" ).attr("fill");
    $( "#ter_Tun" ).attr("fill", color);
    $( "#ter_Tun" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='481']" ).attr("fill");
    $( "#ter_Mos" ).attr("fill", color);
    $( "#ter_Mos" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='106']" ).attr("fill");
    $( "#ter_Bre" ).attr("fill", color);
    $( "#ter_Bre" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "rect[x='142']" ).attr("fill");
    $( "#ter_Lvp" ).attr("fill", color);
    $( "#ter_Lvp" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "circle[cx='15']" ).attr("fill");
    $( "#ter_Por" ).attr("fill", color);
    $( "#ter_Por" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");

    color = $( "circle[cx='270']" ).attr("fill");
    $( "#ter_Nwy" ).attr("fill", color);
    $( "#ter_Nwy" ).attr("style", "-webkit-tap-highlight-color: rgba(0, 0, 0, 0); fill-opacity: 0.3;");
});
