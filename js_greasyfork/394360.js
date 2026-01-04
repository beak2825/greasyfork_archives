// ==UserScript==
// @name         LiveChart.me Enhancement's
// @namespace    https://github.com/as280093/LCE
// @version      0.2
// @description  Adds few featues to enchance LiveChart
// @author       as280093
// @match        https://www.livechart.me/*
// @supportURL   https://github.com/as280093/LCE/issues
// @icon         https://raw.githubusercontent.com/as280093/LCE/master/icon.png
// @downloadURL https://update.greasyfork.org/scripts/394360/LiveChartme%20Enhancement%27s.user.js
// @updateURL https://update.greasyfork.org/scripts/394360/LiveChartme%20Enhancement%27s.meta.js
// ==/UserScript==

(function () {
    'use strict';

//adds kissanime search
var text = '';
var aniname = '';
$('div.anime-card').each(function() {
    aniname = $('h3.main-title', this).text();
    text = '<ul class="anime-studios"><li><a href="https://kissanime.ru/Search/Anime?keyword=' + encodeURI(aniname).replace("&", "%26").replace("=", "%3D").replace("?", "%3F") + '" target="_blank" rel="noopener nofollow">Search on KissAnime</a></li></ul>';
    $('.anime-info', this).append(text);
});

//compact KA button
var text_compact = '';
var aniname_compact = '';
$('.schedule-card__overlay-container').each(function() {
    aniname_compact = $('.schedule-card__title', this).text();
    text_compact = '<a href="https://kissanime.ru/Search/Anime?keyword=' + encodeURI(aniname_compact).replace("&", "%26").replace("=", "%3D").replace("?", "%3F") + '" target="_blank" rel="noopener nofollow"><div class="" title="Kissanime"></div>KA</a>';
    $('.schedule-card__actionbar', this).prepend(text_compact);
});

})();

