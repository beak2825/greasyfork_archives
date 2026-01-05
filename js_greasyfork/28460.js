// ==UserScript==
// @name        animeflv.net - AdsFix
// @namespace   yaelmania script
// @description remove ads social, etc, just pure player style.
// @run-at      document-end
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @include     http://animeflv.net/*
// @version     1.2
// @grant       unsafeWindow
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/28460/animeflvnet%20-%20AdsFix.user.js
// @updateURL https://update.greasyfork.org/scripts/28460/animeflvnet%20-%20AdsFix.meta.js
// ==/UserScript==

function GoNext(){var a=top.window.location.href,b=window.location.href,c=a.replace(/.+ver/gi,"ver"),d=c.replace(/ver.+/gi,"ver"),e=b.replace(/.+ver/gi,"ver"),f=e.replace(/ver.+/gi,"ver");d==f&&($av('[id*="ScriptRoot"]').each(function(){$av(this).parent().parent().remove()}),$av('[class^="Dvr"]').each(function(){$av(this).remove()})),$av('#footer, .ads-always-down, .publi_head, .ads_der, #b-close-ads, #ads-dw, [style*="2147483647"],#videoLoading, .jw-overlays.jw-reset, .jw-captions.jw-captions-enabled.jw-reset,.ultimos_epis .not [rel="nofollow"]').each(function(){$av(this).remove()}),$av("body").each(function(){$av(this).append(unescape("%3Cstyle id%3D%22especialme%22 type%3D%22text%2Fcss%22%3E .anime_episodios%7Bheight%3A 376px%21important%3Bwidth%3A 760px%21important%3Boverflow-x%3A hidden%21important%3B%7D a%3Avisited %7Bborder%3A 4px solid %23A21768%21important%3B%7D .not a%7Bborder%3A 3px solid %23fff%21important%3Bheight%3A 106px%21important%3Bposition%3A absolute%21important%3Bwidth%3A 212px%21important%3Bborder-radius%3A 4px%21important%3B%7D .not a%3Avisited%7Bborder%3A 3px solid %23A21768%21important%3Bheight%3A 106px%21important%3Bposition%3A absolute%21important%3Bwidth%3A 212px%21important%3B%7D .adbl%2C%23adbl%7Bvisibility%3A hidden%21important%3Bdisplay%3A none%21important%3B%7D %23contenedor%7Bdisplay%3A block%21important%3B%7D .ListEpisodes %3E li %3E a%3Avisited %7Bcolor%3A red%21important%3B%7D .ListEpisodios a%3Avisited%7Bcolor%3A red%21important%3B%7D %3C%2Fstyle%3E"))})}var $av=jQuery.noConflict();setTimeout(GoNext,1500);
