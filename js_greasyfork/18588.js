// ==UserScript==
// @name         Favourite bar
// @namespace    Remix
// @version      0.2
// @description  hackforums favourite subforums bar (like the reddit one)
// @author       Remix
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @include      http://hackforums.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/18588/Favourite%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/18588/Favourite%20bar.meta.js
// ==/UserScript==

$(document).ready(function() {
    
    links = GM_getValue('links', []);
    titles = GM_getValue('titles', []);
    
    var bar = $('<div id=\'favBar\'/>');
    $('#header').append(bar);
    
    var favBarCss = {
        'height':'auto',
        'max-width':'100%',
        'background-color':GM_getValue('background-color', '#6699FF'),
        'margin-top':'5px',
        'word-wrap':'break-word',
        'vertical-align':'inherit',
        '-webkit-box-shadow':'0px 0px 20px 1px rgba(0,0,0,0.75)',
        '-moz-box-shadow':'0px 0px 20px 1px rgba(0,0,0,0.75)',
        'box-shadow':'0px 0px 20px 1px rgba(0,0,0,0.75)',
        'display':'none'
    };
    
    var favBarTextCss = {
        'color':GM_getValue('font-color', 'black'),
        'margin-right':'5px',
        'font-size':GM_getValue('font-size', '11')
    };
    
    for(key in favBarCss)
        $('#favBar').css(key, favBarCss[key]);
    
    for(var i = 0; i < links.length; i++) {
        $('#favBar').append('<a href="' + links[i] + '">' + titles[i] + '</a>');
        
        if (links.length > i+1) {
            $('#favBar').append('<a>|</a>');
        }
    }
    
    for(key in favBarTextCss)
        if (key === 'font-size')
            $('#favBar a').css(key, favBarTextCss[key] + 'px');
        else
            $('#favBar a').css(key, favBarTextCss[key]);
    
    $('#favBar').fadeIn('slow', function() {});
    
    var subscribeElement = ' -<a class="subscribeLink"> <i>Subscribe</i></a>';
    
    var addToElements = ['td[class="trow2"] strong a', 'td[class="trow1"] strong a'];
    
    for(var i = 0; i < addToElements.length; i++) {
        $(addToElements[i]).after(subscribeElement);
    }
    
    console.log(links);
    
    $('.subscribeLink').each(function() {
        if (links.indexOf("http://hackforums.net/" + $(this).parent().find('a[href*="forumdisplay"]').attr("href")) != -1) {
            $(this).text(" Unsubscribe");
        }
    });
    
    $('.subscribeLink').css('font-size', '9px');
    
    $('.subscribeLink').on('click', function() {
        var element = $(this).parent().find('a')[0];
        
        var position = links.indexOf(element.href);
        
        if (position != -1) {
            links.splice(position,1);
            titles.splice(position,1);
        } else {
            links.push(element.href);
            titles.push(element.text);
        }
        
        GM_setValue('links', links);
        GM_setValue('titles', titles);
    });
    
    if (location.href.match(/usercp.php/i)) {
        $('td:nth-child(1) fieldset:nth-child(3)').after('<fieldset style="margin-top:10px" class="trow2"><legend><strong>Favourite bar</strong></legend><table cellspacing="0" cellpadding="2"><tbody><tr><td><span class="smalltext">Background color:</span></td></tr><tr><td><input type="text" name="favBarBackgroundColor" value="'+ favBarCss['background-color'] +'"></td></tr><tr><td><span class="smalltext">Font size:</span></td></tr><tr><td><input type="number" name="favBarFontSize" value="' + favBarTextCss['font-size'] + '"><span class="smalltext">px</span></td></tr><tr><td><span class="smalltext">Font color:</span></td></tr><tr><td><input type="text" name="favBarFontColor" value="' + favBarTextCss['color'] + '"></td></tr></tbody></table></fieldset>');
        
        $('input[name="regsubmit"]').on('click', function() {
            GM_setValue('background-color', $('input[name="favBarBackgroundColor"]').val());
            GM_setValue('font-size', $('input[name="favBarFontSize"]').val());
            GM_setValue('font-color', $('input[name="favBarFontColor"]').val());
        });
    }
});