// ==UserScript==
// @name       My Fancy New Userscript
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      http://www.zillow.com/homedetails/*
// @copyright  2012+, You
// @require http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/4237/My%20Fancy%20New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/4237/My%20Fancy%20New%20Userscript.meta.js
// ==/UserScript==

$(window).load(function(){
    var $contact = $('#contact-tall');
    
    var h = $contact.outerHeight() + 20;
    
    $contact.next().css('margin-top', h + 'px');
    var wrap = $contact.find('div').eq(0);
    
    var position = wrap.position();
    var offsetY = 67;
    
    wrap.css({
        position: 'absolute',
        top: position.top,
        left: position.left,
        width: '300px',
        'z-index': 1000000
    });
    
    $('#contact-tall').siblings().remove();
    
    $('#contact-tall h2').css('font-weight', 'bold');
    
    $(window).scroll(function(){
        var top = wrap.position().top;
        var scrollTop = $(window).scrollTop();
        if (scrollTop + offsetY >= position.top)
        {
            wrap.css({
                'position': 'fixed',
                'top': offsetY,
                'border-bottom-width': 1
            });
        }
        else 
        {
            wrap.css({
                'position': 'absolute',
                'top': position.top,
                'border-bottom-width': 1
            });
        }
    });
    
});