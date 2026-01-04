// ==UserScript==
// @name         MyAnimeList - Stats Bars
// @namespace    http://myanimelist.net/profile/Annuvin
// @version      3.3.7
// @description  Makes the stats bars look and behave like they used to.
// @author       Annuvin
// @include      /^https?:\/\/myanimelist\.net\/profile/
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/33206/MyAnimeList%20-%20Stats%20Bars.user.js
// @updateURL https://update.greasyfork.org/scripts/33206/MyAnimeList%20-%20Stats%20Bars.meta.js
// ==/UserScript==

//Modify these variables to change the bar limits (how many entries fill the bar in full)
var watching = 50;
var completed = 500;
var onhold = 50;
var dropped = 50;
var planned = 250;

//And these three to change the bar height, max bar length and sharpness for bar corners (in pixels, margin is added automatically, 0 = sharp corners)
var barHeight = 10
var barCorners = 2;
var maxBarLength = 246;

//Custom class added to body in case you need to modify some css in your theme
$('body').addClass('statsBars');

var entries = [];
$('.di-ib.fl-r.lh10').each(function(index) {
    entries[index] = $(this).text().replace(',', '');
});

var barLength = 0;
var css = '';
$.each(entries, function(index, value) {
    switch (index) {
        case 0:
        case 5:
            barLength = Math.ceil(maxBarLength / watching * (value - watching) + maxBarLength);
            break;
        case 1:
        case 6:
            barLength = Math.ceil(maxBarLength / completed * (value - completed) + maxBarLength);
            break;
        case 2:
        case 7:
            barLength = Math.ceil(maxBarLength / onhold * (value - onhold) + maxBarLength);
            break;
        case 3:
        case 8:
            barLength = Math.ceil(maxBarLength / dropped * (value - dropped) + maxBarLength);
            break;
        case 4:
        case 9:
            barLength = Math.ceil(maxBarLength / planned * (value - planned) + maxBarLength);
            break;
    }

    if (barLength > maxBarLength)
        barLength = maxBarLength;

    if (index < 5)
        css += '.profile .user-statistics .anime li:nth-child(' + (index + 1) + ') .circle:after { width: ' + barLength + 'px !important }\n';
    else
        css += '.profile .user-statistics .manga li:nth-child(' + (index - 4) + ') .circle:after { width: ' + barLength + 'px !important }\n';
});

$('.stats-data li').each(function(index) {
    var div = '<div class="di-tc fs12 fw-b"><span class="fn-grey2 fw-n">' + $(this).children('span:first-of-type').text() + '</span>' + $(this).children('span:last-of-type').text() + '</div>';
    if (index < 3)
        $(div).appendTo('.anime .stat-score');
    else
        $(div).appendTo('.manga .stat-score');
});

$('.stats-data').remove();
$('.fn-grey2:contains(Mean)').html('Mean:&nbsp;');
$('.fn-grey2:contains(Entries)').html('Entries:&nbsp;');
$('.fn-grey2:contains(Episodes)').html('Eps:&nbsp;');
$('.fn-grey2:contains(Chapters)').html('Chps:&nbsp;');
$('.fn-grey2:contains(Volumes)').html('Vols:&nbsp;');
$('.fn-grey2:contains(Rewatched)').html('Rewatched:&nbsp;');
$('.fn-grey2:contains(Reread)').html('Reread:&nbsp;');

$('.anime .stat-score').hover(function() {
    $(this).stop(true, true).fadeOut(300, function() {
        $(this).children().eq(2).attr('style', 'display: none !important');
        $(this).children().eq(3).attr('style', 'display: inline-block !important');
    });
}, function() {
    $(this).stop(true, true).fadeOut(300, function() {
        $(this).children().eq(3).attr('style', 'display: none !important');
        $(this).children().eq(2).attr('style', 'display: inline-block !important');
    });
});

$('.manga .stat-score').hover(function() {
    $(this).stop(true, true).fadeOut(300, function() {
        $(this).children().eq(2).attr('style', 'display: none !important');
        $(this).children().eq(3).attr('style', 'display: inline-block !important');
        $(this).children().eq(4).attr('style', 'display: none !important');
        $(this).children().eq(5).attr('style', 'display: inline-block !important');
    });
}, function() {
    $(this).stop(true, true).fadeOut(300, function() {
        $(this).children().eq(2).attr('style', 'display: inline-block !important');
        $(this).children().eq(3).attr('style', 'display: none !important');
        $(this).children().eq(4).attr('style', 'display: inline-block !important');
        $(this).children().eq(5).attr('style', 'display: none !important');
    });
});

$('.di-tc.fs12.fw-b').each(function() {
    var element = $(this).contents().filter(function() {
        return this.nodeType === 3;
    });

    var text = $(element).text().replace(/,/g, '');
    if (text >= 1000000000)
        $(element)[0].nodeValue = (text / 1000000000).toFixed(1) + 'G';
    else if (text >= 1000000)
        $(element)[0].nodeValue = (text / 1000000).toFixed(1) + 'M';
    else if (text >= 100000)
        $(element)[0].nodeValue = (text / 1000).toFixed(1) + 'K';
});

$('head').append('<style type="text/css">\n' +
                 '.profile .user-statistics .stats-status { width: 120px }\n' +
                 '.profile .user-statistics .stats-status .circle { text-indent: 0 }\n' +
                 '.profile .user-statistics .stats-status .circle:after { border-radius: ' + barCorners + 'px; cursor: default; left: 130px; height: ' + barHeight + 'px; margin-top: ' + Math.floor(-barHeight / 2) + 'px }\n' +
                 '.profile .user-statistics .stats-graph { border-radius: ' + barCorners + 'px; height: ' + barHeight + 'px }\n' +
                 '.profile .user-statistics .stats .di-t { display: inline-flex !important; justify-content: space-around; margin: 0 !important; white-space: nowrap }\n' +
                 '.profile .user-statistics .stats .di-t div { display: inline-block !important; padding: 0 !important }\n' +
                 '.profile .user-statistics .stats .di-t div:nth-of-type(4), .profile .user-statistics .stats .di-t div:nth-of-type(6) { display: none !important }\n' +
                 css + '</style>');
