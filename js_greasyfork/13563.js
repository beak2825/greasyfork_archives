// ==UserScript==
// @name         platinumgod tooltip
// @namespace    http://porath.org/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        http://platinumgod.co.uk/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13563/platinumgod%20tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/13563/platinumgod%20tooltip.meta.js
// ==/UserScript==

$('body').append('<div id="mousebox"><li class="textbox" id="putHtmlHere"></li></div>');

// because of the way he did his css selecting, i have to do this nonsense

$('#mousebox').css('position', 'fixed');
$('#mousebox').css('width', '300px');
$('#mousebox').css('background-color', '#222');
$('#mousebox').css('font-size', '12px');
$('#mousebox').css('color', '#eee');
$('#mousebox').css('padding', '0 10px 0 10px');

$('.item-title').css('font-size', '16px');
$('.item-title').css('text-decoration', 'underline');
$('.item-title').css('letter-spacing', '.1em');
$('.item-title').css('text-transform', 'uppercase');
$('.item-title').css('text-align', 'center');
$('.item-title').css('margin-bottom', '0');

$('.textbox').css('list-style', 'none');

$('.r-itemid').css('margin', '0');
$('.r-itemid').css('position', 'absolute');
$('.r-itemid').css('top', '0');
$('.r-itemid').css('right', '5px');
$('.r-itemid').css('font-size', '11px');

$('.pickup').css('margin', '0');
$('.pickup').css('text-align', 'center');
$('.pickup').css('color', '#9BCD35');

$('.textbox ul').css('border-top', '1px solid #fff');
$('.textbox ul').css('margin-top', '15px');
$('.textbox ul').css('padding', '15px 0 0');
$('.textbox ul').css('font-weight', '200');
$('.textbox ul').css('text-transform', 'uppercase');
$('.textbox ul').css('font-size', '12px');

$('.tags').css('display', 'none');

$('.rebirth, .afterbirthtrinkets-container').on('mouseover', '.textbox', function() {
    var newHtml = $(this).html();
    
    $('#putHtmlHere').html(newHtml);
});

$(document).on('mousemove', function () {
    var mouseboxX = event.pageX + 15;
    var mouseboxY = event.pageY + 15 - $(window).scrollTop();
    
    if (mouseboxX > $(window).width() - 315) {
        mouseboxX = mouseboxX - 340;
    }

    $('#mousebox').css('left', mouseboxX);
    $('#mousebox').css('top', mouseboxY);
});
