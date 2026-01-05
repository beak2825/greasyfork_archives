// ==UserScript==
// @name         make /cel/ readable again script
// @version      0.2
// @description  Fixes eat.awiki /cel/ board issues
// @author      :^)
// @include        *eat.awiki.org/*
// @require 	 https://cdn.jsdelivr.net/jquery.timeago/1.4.1/jquery.timeago.js
// @namespace https://greasyfork.org/users/2657
// @downloadURL https://update.greasyfork.org/scripts/10371/make%20cel%20readable%20again%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/10371/make%20cel%20readable%20again%20script.meta.js
// ==/UserScript==


if (window.location.href.indexOf("res") > -1) { } else {


    var threads = [];

    $('a:contains("[Reply]")').each(function() {	
        threads.push($(this).attr('href'))
    });
    
    pages = $('.pages');
    $('body').html('');
    $('body').append(pages);
    
    
    $("<style class='fileinfocss'>").text(".pages{position:fixed;bottom:0px;left:10px;z-index:999;} .post-image{display:inline !important;float:none !important;}").appendTo("head");
    $(threads).each(function(i, e) {
        div = $('<div style="position:relative;border:solid 1px black;" class="thread '+i+'"></div>');
        $("body").append(div);        
        loadme = 'http://eat.awiki.org/' + e + '';
        $.get(''+loadme+'', function (data) {
            subject = $(data).find('.subject').html();
            time = $(data).find('time:last');
            time.attr('style', 'position:absolute;bottom: 0px;right: 110px;');
            data = $(data).find('.post-image').parent();            
            if (data.length > 10) {
                $('.'+i+'').append('<div id="'+i+'" data="'+ threads[i] +'" class="moar" style="position:absolute;bottom: 0;right: 0;cursor: pointer; cursor: hand;background:black;color:lightblue;">MOAR...(10/'+data.length+')</div>').append(time);
                data = data.slice(-10);                
            };
            
            $('.'+i+'').prepend(''+subject+'<br>');
            $('.'+i+'').append(data)
            $('.'+i+'').append('<br><br>');
            
        }).done(function() {
$('time').timeago();
        });

    });

};



$(document).on('click', ".moar", function() {
    $(this).parent().remove();
    var urrl = 'http://eat.awiki.org' + $(this).attr('data') + '';
    var idd = $(this).attr('id');
    var contents;
    $.get(''+urrl+'', function (data) {
        subject = $(data).find('.subject').html();
        data = $(data).find('.post-image').parent();
        div = $('<div class="thread" style="border:solid 1px black;"></div>');
        div.prepend(''+subject+'<br>');
        div.append(data)
        
        $("body").prepend(div);
    }).done(function() {

    });
}); 