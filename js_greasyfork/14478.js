// ==UserScript==
// @name         thewatchseries.to Random Episodes Button
// @namespace    RandomEpisodesButton
// @version      0.2
// @description  Generate new random episode every time you press random episode without refresh the page!
// @author       jscriptjunkie
// @match        http://thewatchseries.to/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14478/thewatchseriesto%20Random%20Episodes%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/14478/thewatchseriesto%20Random%20Episodes%20Button.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

$('body > div.centeres > div.home-page > div.home-page-left > div:nth-child(1) > div:nth-child(2)').remove();
$('body > div.centeres > div.home-page > div.home-page-left > div:nth-child(6) > div:nth-child(2)').remove();
$('.random_inside a').attr('href','#');
$('.random_inside').click(function () {
    var website = 'http://thewatchseries.to';
    var obj = $(this).parent().next();
    var numberOfEpisonds = obj.children().length;
    var rnd = 1 + Math.floor(Math.random() * numberOfEpisonds);
    var episodeLink = website + obj.find('li:nth-child('+rnd+') a').attr('href');
    window.open(episodeLink, '_blank');
});

var episodes = [];
$('ul.listings li > a').each(function( index ) {
    episodes.push('http://thewatchseries.to' + $( this ).attr('href'));
});

var r= $('<center><input type="button" id="randFromAll" value="Random Episode" style="font-size: 15px; line-height: 26px; border-bottom: 1px solid #59789E; background-color: #59789E; color: #ffffff"/></center>');
$(".latest-episode").append(r);

$('#randFromAll').click(function () {
    var rnd = 1 + Math.floor(Math.random() * episodes.length);
    window.open(episodes[rnd], '_blank');
});