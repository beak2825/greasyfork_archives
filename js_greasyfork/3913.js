// ==UserScript==
// @name       Temiz Unutulmazfilmler.com
// @namespace  http://unutulmazfilmler.com
// @version    0.2
// @description  Unutulmazfilmlerin gereksiz reklamlarini siktir edin.
// @match      http://unutulmazfilmler.com/*
// @copyright  2012+
// @downloadURL https://update.greasyfork.org/scripts/3913/Temiz%20Unutulmazfilmlercom.user.js
// @updateURL https://update.greasyfork.org/scripts/3913/Temiz%20Unutulmazfilmlercom.meta.js
// ==/UserScript==

// Hide layout ads.
document.body.style.background = '#000';
$('body>div:first-child').hide();
$('#cookieAd').hide();
$('.sagrekbg').hide();

// Hide unused right widgets
$('.righttop4').hide().next().hide().next().hide();
$('.righttop3').hide().next().hide().next().hide();

// Improve movie listing description readability.
$('.leftflmbg_right_contentd').css({
    'height': 'auto',
    'font-size': '13px',
    'line-height': '17px'
});

// Give a color to points
$('.leftflmbg_right_rating_imdb, .leftflmbg_right_rating_siteici').each(function() {
    var point = parseFloat($(this).text().trim().split('/')[0]);
    $(this).html($(this).find('span').css('font-size', '17px'));
}).css({
    'zoom': '1.3',
    'float': 'right'
});

// Skip ads, directyl show video.
document.getElementById('reklami2').style.display = 'none';
document.getElementById('video').style.display = '';
$('.solrekbg').hide();
