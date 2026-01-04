// ==UserScript==
// @name         HIRES Screenshots for Steam!
// @description  Title says all. Better used with userstyle: https://userstyles.org/styles/166921/screenshot-slideshow-fixer-for-steam 
// @namespace    http://bohnke.com/
// @version      0.1
// @author       mrbohnke
// @match        https://store.steampowered.com/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375538/HIRES%20Screenshots%20for%20Steam%21.user.js
// @updateURL https://update.greasyfork.org/scripts/375538/HIRES%20Screenshots%20for%20Steam%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    jQuery('.screenshot_holder').each(function(){
        var hiresImg = jQuery(this).find('.highlight_screenshot_link').prop('href');
        jQuery(this).find('img').prop('src', hiresImg);
	})
    var target = document.getElementById("highlight_strip_scroll");
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            jQuery('.screenshot_holder').each(function(){
                var hiresImg = jQuery(this).find('.highlight_screenshot_link').prop('href');
                jQuery(this).find('img').prop('src', hiresImg);
            })
        });
    });
    var config = {
        subtree: true,
        attributes: true,
        childList: true,
        characterData: true
    };
    observer.observe(target, config);
})();