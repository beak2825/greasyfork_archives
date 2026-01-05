// ==UserScript==
// @name         add H6 for screenreaders
// @namespace    http://your.homepage/
// @version      0.1
// @description  adds a H6 element before an answer to aid screenreaders in finding the start of an answer
// @author       rene
// @match        *://*.stackexchange.com/questions/*
// @match        *://*.stackoverflow.com/questions/*
// @match        *://*.superuser.com/questions/*
// @match        *://*.serverfault.com/questions/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12388/add%20H6%20for%20screenreaders.user.js
// @updateURL https://update.greasyfork.org/scripts/12388/add%20H6%20for%20screenreaders.meta.js
// ==/UserScript==

(function (){
    var hide = true; // for testing set to false
    
    $('.answer').before(function(index) {
        var score = $(this).find('.vote-count-post').text(), 
            accepted = $(this).find('span.vote-accepted-on'),
            h6 = $('<h6>').html('Answer ' + 
                              (index + 1) + 
                              '(score ' + score + 
                              (accepted.length > 0?', accepted answer':'') + 
                              ')');
        
        // form http://webaim.org/techniques/css/invisiblecontent/
        if (hide) {
            h6.css('position','absolute')
            .css('left', '-10000px')
            .css('top', 'autor')
            .css('width', '1px')
            .css('height', '1px')
            .css('overflow', 'hidden');
        } 
        
        return h6;
    }); 
}());