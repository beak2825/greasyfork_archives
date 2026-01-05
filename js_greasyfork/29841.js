// ==UserScript==
// @name         FA Infinite Scroll
// @version      1.0
// @description  Scroller à l'infini sur FA
// @author       Shiro
// @match        https://fullanimes.io/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require      https://greasyfork.org/scripts/19670-jscroll/code/jScroll.js?version=125710
// @resource     scrollCSS https://cdn.rawgit.com/n3tman/what_infinite/master/style.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @namespace https://greasyfork.org/users/125059
// @downloadURL https://update.greasyfork.org/scripts/29841/FA%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/29841/FA%20Infinite%20Scroll.meta.js
// ==/UserScript==

var scrollCSS = GM_getResourceText('scrollCSS');
GM_addStyle(scrollCSS);

this.$ = this.jQuery = jQuery.noConflict(true);

var triggerScroll = false;
var triggerStop = false;

$('body').append('<i id="scrollUp" class="icon-up-circled"></i>');

$(window).scroll(function() {
    if ($(window).scrollTop() > 300) {
        if (!triggerScroll) {
            $('#scrollUp').fadeIn();
            triggerScroll = true;
        }
    } else {
        if (triggerScroll) {
            $('#scrollUp').fadeOut();
            triggerScroll = false;
        }
    }
});

$('#scrollUp').click(function(){
    $('html, body').animate({
        scrollTop: 0
    });
});

//$(‘a[href^="artist.php?id\="], a[href^="torrents.php?id\="], a[href^="requests.php?action\=view"]').attr('href', function(i, href) {
//  return href.replace(/\.php\?/, '.php?page=1&');
//});

if ($('.pager_next').length) {
    var pages = $('.linkbox > strong:first').text();
    $('body').append('<i id="scrollStop" class="icon-pause-circled"></i>');
    $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
            if (!triggerStop) {
                $('#scrollStop').fadeIn();
                triggerStop = true;
            }
        } else {
            if (triggerStop) {
                $('#scrollStop').fadeOut();
                triggerStop = false;
            }
        }
    });
    
    query = $(location).attr('search');
    
    if (/[&?]id=/i.test(query)) {
        $('.main_column > div:last').jscroll({
            loadingHtml: '<div class="loading"><div class="three-quarters-loader">Loading…</div></div>',
            padding: 700,
            nextSelector: 'a.pager_next:last',
            contentSelector: '.main_column > div:last > table, .main_column > div:last > .linkbox:has(strong):last',
            callback: function(){
                var pages = $('.jscroll-added .linkbox > strong:first').text();
                $('.jscroll-added table:first').before('<table><tr class="colhead_dark"><td class="page-info" colspan="8">' + pages + '</td></tr></table>');
                $('.jscroll-added table').hide().insertAfter('.jscroll-inner > table:last').fadeIn();
                $('.jscroll-added .linkbox:first').hide().insertAfter('.jscroll-inner > table:last').fadeIn();
                $('.jscroll-added').remove();                
                $('#quickpost').focus(function(){ $('.main_column > div:last').jscroll.destroy(); });
            }
        });
        $('#quickpost').focus(function(){ 
            $('.main_column > div:last').jscroll.destroy(); 
            $('#scrollStop').fadeOut('normal', function(){$(this).remove();}); 
        });        
        $('#scrollStop').click(function(){ 
            $('.main_column > div:last').jscroll.destroy(); 
            $('#scrollStop').fadeOut('normal', function(){$(this).remove();}); 
        });
    } else if (/viewthread/i.test(query)) {
        $('#content > div').jscroll({
            loadingHtml: '<div class="loading"><div class="three-quarters-loader">Loading…</div></div>',
            padding: 700,
            nextSelector: 'a.pager_next:last',
            contentSelector: '.linkbox:has(strong):last, #content > div > table',
            callback: function(){
                var pages = $('.jscroll-added .linkbox > strong:first').text();
                $('.jscroll-added table:first').before('<table><tr class="colhead_dark"><td class="page-info" colspan="8">' + pages + '</td></tr></table>');
                $('.jscroll-added table').hide().insertAfter('.jscroll-inner > table:last').fadeIn();
                $('.jscroll-added .linkbox').hide().appendTo('.jscroll-inner').fadeIn();
                $('.jscroll-added').remove();                
                $('#quickpost').focus(function(){ $('#content > div').jscroll.destroy(); });
            }
        });
        $('#quickpost').focus(function(){ 
            $('#content > div').jscroll.destroy(); 
            $('#scrollStop').fadeOut('normal', function(){$(this).remove();});
        });
        $('#scrollStop').click(function(){ 
            $('.main_column > div:last').jscroll.destroy(); 
            $('#scrollStop').fadeOut('normal', function(){$(this).remove();}); 
        });
    } else {
        $('#content > div').jscroll({
            loadingHtml: '<div class="loading"><div class="three-quarters-loader">Loading…</div></div>',
            padding: 700,
            nextSelector: 'a.pager_next:last',
            contentSelector: '#content > div > table, .linkbox:has(strong):last',
            callback: function(){
                var pages = $('.jscroll-added .linkbox > strong:first').text();
                $('.jscroll-added tr:first').after('<tr><td class="page-info" colspan="8">' + pages + '</td></tr>');
                $('.jscroll-added tr:gt(0)').hide().appendTo('.jscroll-inner > table').fadeIn();
                $('.jscroll-added .linkbox').hide().insertAfter('.jscroll-inner > table').fadeIn(); 
                $('.jscroll-added').remove();
            }
        });
        $('#scrollStop').click(function(){ 
            $('.main_column > div:last').jscroll.destroy(); 
            $('#scrollStop').fadeOut('normal', function(){$(this).remove();}); 
        });
    }
}