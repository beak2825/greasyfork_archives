// ==UserScript==
// @name         Putlocker Styler
// @icon         http://putlocker.is/favicon.ico
// @namespace    http://benjamingrant.cf/
// @version      0.1
// @description  Hides and removes those annoying ads on putlocker
// @author       GRA0007
// @match        http://putlocker.is/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10939/Putlocker%20Styler.user.js
// @updateURL https://update.greasyfork.org/scripts/10939/Putlocker%20Styler.meta.js
// ==/UserScript==

$('body').append('<div id="loadCover" style="z-index:9999999; height:100vh; width:100vw; position:fixed; background-color:#333; top:0; left:0; line-height:100vh; color:#DDD; font-size:100px; text-align:center; font-family:Arial; text-shadow:0px 2px 4px rgba(0, 0, 0, 0.14), 0px 4px 5px rgba(0, 0, 0, 0.098), 0px 1px 10px rgba(0, 0, 0, 0.082);">Please wait<span onclick="window.stop();" style="position:fixed; height:100vh; width:100vw; display:block; top:0; left:0; line-height:120vh; cursor:pointer; color:#DDD; font-size:20px; text-align:center; font-family:Arial; text-shadow:0px 2px 4px rgba(0, 0, 0, 0.14), 0px 4px 5px rgba(0, 0, 0, 0.098), 0px 1px 10px rgba(0, 0, 0, 0.082);">Or click here if it is taking too long</span></div>');

$(document).ready(function() {
    $('#loadCover').fadeOut(300, function() { $(this).remove(); });
    
    //Styling
    $('body').css({'background-image' : 'none', 'background-color' : '#DDD'});
    $('body > table:nth-child(5) > tbody > tr > td > div.content-box').css('width', '80vw');
    $('body > table:nth-child(4)').css('width', '80vw');
    $('#nav').css('width', '80vw');
    $('#nav').css('padding', '0');
    $('#nav').css('background', '#0099FF');
    $('#search > form > table > tbody > tr > td:nth-child(1) > input[type="text"]').css('color', '#000');
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > h1 > strong > font').attr('color', 'black');
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > h2:nth-child(3)').css('color', 'black');
    $('body > table:nth-child(4) > tbody > tr:nth-child(1) > td > a').html('Putlocker');
    $('body > table:nth-child(4) > tbody > tr:nth-child(1) > td > a').css({'font-size' : '70px', 'font-family' : 'Arial', 'font-weight' : 'bold', 'color' : '#0099FF', 'padding' : '10px'});
    $('#search > form > table > tbody > tr > td:nth-child(1) > input[type="text"]').css({'border' : '2px solid #0099FF', 'height' : 'initial', 'width' : '300px', 'font-size' : '15px', 'padding' : '5px', 'background-color' : '#FFF'});
    $('#search > form > table > tbody > tr > td:nth-child(2) > input[type="submit"]').css({'border' : '2px solid #0099FF', 'height' : 'initial', 'width' : 'initial', 'font-size' : '15px', 'padding' : '5px', 'background-color' : '#FFF', 'cursor' : 'pointer'});
    $('#search > form > table > tbody > tr > td:nth-child(2) > input[type="submit"]').html('Search');
    $('#search').css({'margin-top' : '30px', 'margin-left' : '300px'});
    $('#nav .dropdown2, #nav .dropdown').css({'background-color' : '#FFF', 'border' : '2px solid #0099FF', 'border-top' : 'none'});
    $('#nav .dropdown .col1 ul li, #nav .dropdown2 .col1 ul li').css('background', 'none');
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > h1').css({'text-transform' : 'initial', 'border-bottom' : 'none', 'background-color' : '#0099FF', 'color' : '#FFF'});
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > h1 > strong > font').removeAttr('color');
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > table.table2 > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td > img').css('border', '2px solid #0099FF');
    $('A:active, A:link, A:visited').css('color', '#0099FF');
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > table:nth-child(4)').css('border-top', '2px dashed #0099FF');
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > table:nth-child(4)').css('margin-top', '20px');
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box').css('border', 'none');
    $('body > table:nth-child(4) > tbody > tr:nth-child(1) > td').css('border', 'none');
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > table:nth-child(4) > tbody > tr:nth-child(2) > td > div > iframe').css({'position' : 'relative', 'left' : '50%', 'margin-left' : '-364px'});
    
    //Hiding
    $('body > table:nth-child(4) > tbody > tr:nth-child(2)').hide();
    $('body > table:nth-child(4) > tbody > tr:nth-child(1) > td > a > img').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > h2:nth-child(3)').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > table.table2 > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(2)').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(2)').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > div.message').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > br').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > div.addthis_toolbox.addthis_default_style').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > h2:nth-child(8)').hide();
    $('div[id^=MarketGidScriptRoot]').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > h2:nth-child(10)').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > table:nth-child(11)').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > table:nth-child(12)').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > h2:nth-child(13)').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > h2:nth-child(15)').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > table:nth-child(16)').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > h2:nth-child(17)').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > table:nth-child(18)').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > h2:nth-child(19)').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > table:nth-child(20)').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.footer-box').hide();
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > table').hide();
});
$('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > div.fb-comments.fb_iframe_widget').ready(function() {
    $('body > table:nth-child(5) > tbody > tr > td:nth-child(1) > div.content-box > div.fb-comments.fb_iframe_widget').hide();
});