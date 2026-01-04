// ==UserScript==
// @name           Infinitechan+ 8chan enhancer (Minimal Ver)
// @include        https://8chan.co/*
// @include        http://h.8chan.co/*
// @include        http://8ch.net/*
// @include        https://8ch.net/*
// @description    Minimal Version
// @namespace      DrChloe
// @version        0.0.1
// @downloadURL https://update.greasyfork.org/scripts/34803/Infinitechan%2B%208chan%20enhancer%20%28Minimal%20Ver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/34803/Infinitechan%2B%208chan%20enhancer%20%28Minimal%20Ver%29.meta.js
// ==/UserScript==

document.getElementById("8ch-top-ads").style.display = 'none';
document.getElementById("new-bottom-ads").style.display = 'none';

darkarrow = 'https://i.imgur.com/V3gNmWg.png';
lightarrow = 'https://i.imgur.com/OQss0hl.png';
function newarrows(){
    $('body').append("<div class='circle' style='position:fixed;right:15%;bottom:10%;'><font size='30'><a class='upa' alt='Scroll Up' style='text-decoration: none;display:block;color:black;' href='javascript:window.scrollTo(0,0);'><img class='uparrow arr' src='"+darkarrow+"'></a><a class='downa' style='text-decoration: none;color:black !important;' href='javascript:window.scrollTo(0,900000000);'><img class='downarrow arr' style='-moz-transform: scaleY(-1);-o-transform: scaleY(-1);-webkit-transform: scaleY(-1);transform: scaleY(-1);filter: FlipV;-ms-filter: \"FlipV\";' src='"+darkarrow+"'></a></div>");
};
$(document).on('mouseenter', ".arr", function() {
    $(this).attr('src', lightarrow);
});

$(document).on('mouseleave', ".arr", function() {
    $(this).attr('src', darkarrow);
});

$(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
        $('.downa').hide();
    } else {$('.downa').show();};

    if ($(window).scrollTop() - 100 <= 0) {
        $('.upa').hide();
    } else {$('.upa').show();};
});
newarrows();
function loop(){
$('.reply').not('.processed').each(function(){  
              $(this).find('a[onclick*="highlightReply"]').not('.named').not('.post_no').each(function() {
                $(this).addClass('named');
                data = $(this).attr('onclick');
                data = data.split("'")[1]
                naje = $('#'+data+'').parent().find('.name:first').text();
                trip = $('#'+data+'').parent().find('.trip:first').text();
                nametrip = ' - '+ naje + trip +'';
                $(this).append(nametrip);
            });
  $(this).addClass('processed');
});
  };

loop();

$(document).on('ajax_after_post, new_post', function (e, post) {
    loop();
});
