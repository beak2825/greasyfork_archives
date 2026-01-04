// ==UserScript==
// @name         Scroll Up
// @version      1.20
// @description  Tool to let you scroll to the top/bottom of the page
// @author       A Meaty Alt
// @exclude      https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=21
// @include      /fairview.deadfrontier.com/
// @exclude      https://fairview.deadfrontier.com/onlinezombiemmo/ExternalLoginReg.php
// @exclude      http://chat.deadfrontier.com
// @exclude      https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=21&webplayer=1
// @grant        none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/32652/Scroll%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/32652/Scroll%20Up.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var scrollerUp = document.createElement("img");
    scrollerUp.src = "https://puu.sh/xluRH/c8dd354a59.png";
    scrollerUp.id = "scrollerUp";
    scrollerUp.style.opacity = 0.3;
    scrollerUp.style.position = "fixed";
    scrollerUp.style.zIndex = 99;
    scrollerUp.style.cursor = "pointer";
    scrollerUp.style.bottom = "30px";
    scrollerUp.style.right = "10px";
    scrollerUp.height = 80;
    scrollerUp.width = 80;
	
    var scrollerDown = document.createElement("img");
    scrollerDown.src = "https://puu.sh/xsiqh/ed54ae27ab.png";
    scrollerDown.id = "scrollerDown";
    scrollerDown.style.opacity = 0.3;
    scrollerDown.style.position = "fixed";
    scrollerDown.style.zIndex = 99;
    scrollerDown.style.cursor = "pointer";
    scrollerDown.style.bottom = "30px";
    scrollerDown.style.right = "90px";
    scrollerDown.height = 80;
    scrollerDown.width = 80;
    
    function defineOnClickEvent(){
        $(scrollerUp).click(function() {
            $("html, body").animate({ scrollTop: 0 }, "slow");
            return false;
        });
        $(scrollerDown).click(function() {
            var bottom = $(document).height() - $(window).height();
            $("html, body").animate({ scrollTop: bottom }, "slow");
            return false;
        });
    }
    
    function defineOnScrollEvent(){
        $(document).scroll(function() {
            if($(window).scrollTop() === 0) {
                $(scrollerUp).css("opacity", 0.3);
            }
            else
                $(scrollerUp).css("opacity", 1);
            
            var bottom = $(document).height() - $(window).height();
            if($(window).scrollTop() === bottom){
                $(scrollerDown).css("opacity", 0.3);
            }
            else
                $(scrollerDown).css("opacity", 1);
        });
    }
    defineOnScrollEvent();
    defineOnClickEvent();
    
    $("body").append(scrollerUp);
	$("body").append(scrollerDown);
})();