// ==UserScript==
// @name           Redmine Ticket Link
// @description:en Add link to current ticket.
// @version        0.2
// @namespace      http://twitter.com/foldrr/
// @require        https://code.jquery.com/jquery-1.11.3.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.5.3/clipboard.min.js
// @match          http://*/redmine/issues/*
// @description Add link to current ticket.
// @downloadURL https://update.greasyfork.org/scripts/13650/Redmine%20Ticket%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/13650/Redmine%20Ticket%20Link.meta.js
// ==/UserScript==

(function(){
    var issue_id = (location.href.match(/issues\/(\d+)/) || [])[1];
    if(! issue_id) return;
    
    var issue_title = $('.subject h3').text();
    
    create_link = function(css_class, text, link){
        $('<button/>', {
            'text': text,
            'style': 'margin-left: 20px',
            'class': css_class,
            'data-clipboard-text': link
        }).appendTo("h2");
    };
    
    create_link('copy-button', 'URL', location.href);
    create_link('copy-button', 'Markdown', '[#' + issue_id + " " + issue_title + "](" + location.href + ")");
    new Clipboard('.copy-button');
})();
