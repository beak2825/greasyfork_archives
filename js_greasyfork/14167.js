// ==UserScript==
// @name         8chan Beta Infinity
// @version      0.0.0.3
// @description  Filling up missing functions from 8chan beta
// @include        https://beta.8ch.net/*
// @namespace https://greasyfork.org/users/2657
// @downloadURL https://update.greasyfork.org/scripts/14167/8chan%20Beta%20Infinity.user.js
// @updateURL https://update.greasyfork.org/scripts/14167/8chan%20Beta%20Infinity.meta.js
// ==/UserScript==

setInterval(function () { 
if (! $('#author').val()) {wholething()};
}, 3000);

function wholething(){
//backlink generator
/*function backlink(){
    $('.cite').not('.done').each(function() {
        $(this).addClass('done');
        var from = $(this).parent().parent().parent().parent().find('.post-reply').attr('data-board_id');
        var to = $(this).attr('data-board_id');
        $('#reply-'+to+'').after('<span style="color:red;text-decoration:underline;cursor:pointer;cursor:hand;" class="" data-board_id="'+from+'">  >>'+from+'</span>');
    });
};
backlink();*/

//hover generator
/*$(document).on('mouseenter', ".cite-post", function() {
    var htop = $(this).offset().top;
    var hleft = $(this).offset().left;
    var to = $(this).attr('data-board_id');
    var d = $("<div></div>").addClass('floater').attr({
        style : "z-index:9999;background:#484848;position:absolute;width:800px;"
    });
    d.html($('#reply-'+to+'').parent().parent().html());
    $('.floater').css("top", htop+50).css("left",(hleft-200));
    $(this).append(d);
    $('.post-actions').hide();
});

$(document).on('mouseleave', '.cite-post', function() {
    $('.floater').remove();
});
*/


//new post detector
var count = $('.reply-container')
    $( document ).ajaxComplete(function() {
        var recount = $('.reply-container')
        if (recount.length > count.length) {
            count = recount;
            //backlink();
            autoplay();
        }
    });


/*$(window).on('au-updated.ib-post', function (e, posts) {
    autoplay();
});*/

//tripcode saver

    if (localStorage.getItem("trip")){$('#author').val(localStorage.getItem("trip"))};
    $('#author').change(function () {
        localStorage.setItem("trip", $('#author').val()) 
    });


//arrows

//NewArrows
darkarrow = 'data:image/png;base64,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';
lightarrow = 'data:image/png;base64,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';

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


//autoplay webm gif
function autoplay(){
    $('.attachment-link[href*="webm"], .attachment-link[href*="gif"]').not('.done').each(function() {
        $(this).addClass('done');    
        var url= $(this).attr('href');

        var size = $(this).parent().find('.detail-filesize').html();
        if (size.indexOf('MiB') >= 0) {
            size = $(this).parent().find('.detail-filesize').html().slice(1,5);
            size = parseInt(size);
            if (size <= 2){
                if (url.indexOf('webm') >= 0) {$(this).html('<video src="'+url+'" autoplay loop muted style="width:200px;height:auto;z-index:1500;">');} else {$(this).html('<img src="'+url+'" style="width:200px;height:auto;">');}
            }
        } else {        
            if (url.indexOf('webm') >= 0) {$(this).html('<video src="'+url+'" autoplay loop muted style="width:200px;height:auto;z-index:1500;">');} else {$(this).html('<img src="'+url+'" style="width:200px;height:auto;">');}
        }
    });

};

autoplay();
};
wholething();
