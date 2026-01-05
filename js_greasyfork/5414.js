// ==UserScript==
// @name         Scratch Userscript
// @namespace    http://scratch.mit.edu/discuss/topic/54714/
// @version      0.2
// @description  Changes the background to a cool pattern, has a parallax effect on the background, adds a border to the forum (so text is visible against the background), scrolling more than 600px will make page content rotate in 3d, and transitions out on page unloads.
// @author       MegaApuTurkUltra
// @match        http://*.scratch.mit.edu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/5414/Scratch%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/5414/Scratch%20Userscript.meta.js
// ==/UserScript==

$(document).ready(function(){
$("#pagewrapper").css({'background':'url(http://i.imgur.com/ra8F49A.jpg)',"background-size":"100% auto","background-repeat": "repeat-y"}).css('perspective', '800px');
$("#content").css({'transform-style': 'preserve-3d', 'transition': 'transform 0.5s', 'backface-visibility': 'hidden'});
$("#topnav").css("z-index", "9999999");
$("#djangobbindex").css({'background':'rgba(255, 255, 255, 0.8)', 'padding':'10px', 'border-radius':'10px'});

var t, l = (new Date()).getTime(), scrolling = false;
initialAmt = 0;
$(window).scroll(function(){
    $("#pagewrapper").css('background-position-y', ($(document).scrollTop()*10/11)+'px');
    $("#content").css('transform-origin', (($(document).width()/2))+"px "+($(document).scrollTop()+$(window).height()/2)+"px");
    diff = Math.abs($(document).scrollTop()-initialAmt);
    if(diff>600)$("#content").css('transform', 'rotateX(-5deg) translateZ(-50px) translateY(50px)');
    var now = (new Date()).getTime();
    if(now - l > 400 && !scrolling ){
        $(this).trigger('scrollStart');
        l = now;
    }
    clearTimeout(t);
    t = setTimeout(function(){
        if (scrolling)
            $(window).trigger('scrollEnd');
    }, 300);
});

$(window).bind('scrollStart', function(){
    scrolling = true;
    initialAmt = $(document).scrollTop();
});

$(window).bind('scrollEnd', function(){
    scrolling = false;
    initialAmt = $(document).scrollTop();
    $("#content").css('transform', 'none');
});
window.onbeforeunload=function(){
   $("#content").css('transform', 'translateZ(-50px)').animate({'opacity':'0'}, 700);
};
});