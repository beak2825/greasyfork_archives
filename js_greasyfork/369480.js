// ==UserScript==
// @name         VisualCrumbs (Stack Visuals)
// @namespace    https://github.com/GrumpyCrouton/Userscripts
// @version      3.0
// @description  Customizes StackExchange to your liking.
// @author       GrumpyCrouton
// @match          *://*.stackoverflow.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369480/VisualCrumbs%20%28Stack%20Visuals%29.user.js
// @updateURL https://update.greasyfork.org/scripts/369480/VisualCrumbs%20%28Stack%20Visuals%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;

    /***** GLOBAL SITE CHANGES *****/
    var header_search = $('header.top-bar form#search');
    var main_container = $('body div.container');
    var main_content = main_container.find('div#content');

    header_search.css({
        'max-width': 'none'
    });
    $('header ol.-secondary').css('padding-left', '0px');

    main_container.append('<div id="visualcrumbs-sidebar" class="left-sidebar"></div>').css({
        'max-width': 'none',
        'background-color': '#f4fff3'
    });

    main_content.css({
        'max-width': 'none',
        'border-right': '1px solid #d6d9dc'
    });

    /***** LOGOUT BUTTON IN MENU *****/
    var logout_button = '\
         <li class="-item">\
	         <a href="https://stackoverflow.com/users/logout" class="-link" title="Logout">\
		         <svg aria-hidden="true" class="svg-icon iconStackExchange" width="18" height="18" viewBox="0 0 21 21"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></svg>\
	         </a>\
         </li>\
    ';
    $('li.js-topbar-dialog-corral').before(logout_button);
    //https://meta.stackoverflow.com/questions/372291/can-we-make-the-log-out-link-more-discoverable

    /***** QUESTIONS PAGE CHANGES *****/
    var questions_content = main_container.find('div#questions');
    questions_content.find('br.cbt').remove();
    questions_content.css({
        'border-right': '1px solid #d6d9dc',
        'margin-bottom': '0px'
    });

    /***** HIDE JOBS STUFF *****/
    main_content.find('div#hireme').remove();
    main_container.find('li.p6').remove();

    /***** HIDE ADS *****/
    main_content.find('div#dfp-tsb').remove();

    /***** MAINBAR *****/
    var filterbuttons = $('div.grid.tabs-filter.s-btn-group.tt-capitalize');
    var headline = $('h1.grid--cell.fl1.fs-headline1,h1.grid--cell.fl1.fs-headline1.mb24');
    $('div.pl8.aside-cta.grid--cell').before(filterbuttons);
    headline.removeClass('mb24').css("margin-bottom", "0px");

    var questions = $('div.grid--cell.fl1.fs-body3');
    var questionCount = questions.length == 1 ? questions.html().trim().split(" ")[0] : "";
    headline.html(headline.html() + " <span style='font-size:14px'>" + questionCount + "</span>");
    questions.remove();
    $('div#mainbar div[class="mb24"]').remove();

    filterbuttons.children('a').css("line-height", "20px");
    $('#question-mini-list').css({
        'border-right': '1px solid #d6d9dc',
        'border-bottom': '1px solid #d6d9dc'
    });


    /***** RIGHT SIDEBAR *****/
    $(function() {

        var widget_array = {
            'RELATED_TAGS' : {
                'old_find' : 'div#related-tags, .module.js-gps-related-tags',
                'icon_path' : 'M9 1a8 8 0 1 0 0 16A8 8 0 0 0 9 1zm.81 12.13c-.02.71-.55 1.15-1.24 1.13-.66-.02-1.17-.49-1.15-1.2.02-.72.56-1.18 1.22-1.16.7.03 1.2.51 1.17 1.23zM11.77 8a5.8 5.8 0 0 1-1.02.91l-.53.37c-.26.2-.42.43-.5.69a4 4 0 0 0-.09.75c0 .05-.03.16-.18.16H7.88c-.16 0-.18-.1-.18-.15.03-.66.12-1.21.4-1.66a5.29 5.29 0 0 1 1.43-1.22c.16-.12.28-.25.38-.39a1.34 1.34 0 0 0 .02-1.71c-.24-.31-.51-.46-1.03-.46-.51 0-.8.26-1.02.6-.21.33-.18.73-.18 1.1H5.75c0-1.38.35-2.25 1.1-2.76.52-.35 1.17-.5 1.93-.5 1 0 1.79.18 2.49.71.64.5.98 1.18.98 2.12 0 .57-.2 1.05-.48 1.44z',
                'inner_id' : 'related-tags'
            },
            'HOT_NETWORK_QUESTIONS' : {
                'old_find' : 'div#hot-network-questions',
                'icon_path' : 'M7.48.01c.87 2.4.44 3.74-.57 4.77-1.06 1.16-2.76 2.02-3.93 3.7C1.4 10.76 1.13 15.72 6.8 17c-2.38-1.28-2.9-5-.32-7.3-.66 2.24.57 3.67 2.1 3.16 1.5-.52 2.5.58 2.46 1.84-.02.86-.33 1.6-1.22 2A6.17 6.17 0 0 0 15 10.56c0-3.14-2.74-3.56-1.36-6.2-1.64.14-2.2 1.24-2.04 3.03.1 1.2-1.11 2-2.02 1.47-.73-.45-.72-1.31-.07-1.96 1.36-1.36 1.9-4.52-2.03-6.88L7.45 0l.03.01z',
                'inner_id' : 'hot-network-questions'
            },
            'RELATED_QUESTIONS' : {
                'old_find' : 'div.sidebar-related',
                'icon_path' : 'M9 1a8 8 0 1 0 0 16A8 8 0 0 0 9 1zm.81 12.13c-.02.71-.55 1.15-1.24 1.13-.66-.02-1.17-.49-1.15-1.2.02-.72.56-1.18 1.22-1.16.7.03 1.2.51 1.17 1.23zM11.77 8a5.8 5.8 0 0 1-1.02.91l-.53.37c-.26.2-.42.43-.5.69a4 4 0 0 0-.09.75c0 .05-.03.16-.18.16H7.88c-.16 0-.18-.1-.18-.15.03-.66.12-1.21.4-1.66a5.29 5.29 0 0 1 1.43-1.22c.16-.12.28-.25.38-.39a1.34 1.34 0 0 0 .02-1.71c-.24-.31-.51-.46-1.03-.46-.51 0-.8.26-1.02.6-.21.33-.18.73-.18 1.1H5.75c0-1.38.35-2.25 1.1-2.76.52-.35 1.17-.5 1.93-.5 1 0 1.79.18 2.49.71.64.5.98 1.18.98 2.12 0 .57-.2 1.05-.48 1.44z',
                'inner_id' : 'related-questions'
            },
            'FREQUENTLY_ASKED_QUESTIONS' : {
                'old_find' : 'div.module h4:contains(Frequently Asked)',
                'icon_path' : 'M11 4l2.29 2.29L10.5 9l-3-3L1 12.5 2.5 14l5-5 3 3 4.21-4.29L17 10V4z',
                'inner_id' : 'frequently-asked-questions'
            },
            'LINKED_QUESTIONS' : {
                'old_find' : 'div.sidebar-linked',
                'icon_path' : 'M2.9 9c0-1.16.94-2.1 2.1-2.1h3V5H5a4 4 0 1 0 0 8h3v-1.9H5A2.1 2.1 0 0 1 2.9 9zM13 5h-3v1.9h3a2.1 2.1 0 1 1 0 4.2h-3V13h3a4 4 0 1 0 0-8zm-7 5h6V8H6v2z',
                'inner_id' : 'linked-questions'
            },
            'QUESTION_STATS' : {
                'old_find' : 'div.question-stats',
                'icon_path' : 'M3 1h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3c0-1.1.9-2 2-2zm1 8v5h2V9H4zm4-5v10h2V4H8zm4 3v7h2V7h-2z',
                'inner_id' : 'question-stats'
            },
            'PEOPLE_CHATTING' : {
                'old_find' : 'div#chat-feature',
                'icon_path' : 'M4 14l-3 3V3c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4zm0-8v1h10V6H4zm0-2v1h10V4H4zm0 4v1h10V8H4zm0 2v1h7v-1H4z',
                'inner_id' : 'people-chatting'
            }
        };

        for (var key in widget_array) {
            var row = widget_array[key];

            var oldelem = main_content.find(row.old_find);
            if(row.inner_id == "frequently-asked-questions" || row.inner_id == "community-bulletin") {
                oldelem = oldelem.parent();
            }

            var title = row.inner_id == "people-chatting" ? $('a#h-chat-link').parent().html() : row.inner_id.replace(/-/g, ' ').replace(/\b\S/g, function(t) { return t.toUpperCase() });

            var newelem = '\
                <div class="s-sidebarwidget" style="margin-bottom:19.500px;">\
	                <div class="s-sidebarwidget--header grid">\
		                <span class="grid--cell mr4"><svg style="fill:#6a737c;" width="18" height="18" viewBox="0 0 18 18"><path d="'+ row.icon_path +'"/></svg></span>\
		                <span id="visualcrumbs-widget-title" class="grid--cell fl1">' + title + '</span>\
	                </div>\
	                <div id="visualcrumbs-'+ row.inner_id +'" class="s-sidebarwidget--content fd-column"></div>\
                </div>\
            ';

            oldelem.before(newelem).children('h4, a').remove().parent();
            newelem = main_content.find('div#visualcrumbs-' + row.inner_id);

            if(row.inner_id == "related-tags") {
                newelem.prepend(oldelem.children()).children().wrapAll('<div class="js-watched-tag-list grid gs4 py4 fw-wrap">').each(function() {
                    $(this).toggleClass('dno js-hidden js-tag grid--cell').children().slice(1).remove();
                });
            } else {
                newelem.prepend(oldelem.css('margin-bottom', '0px'));
            }
            newelem.find('p.label-key').css('margin-bottom', '0px');

            console.log('VisualCrumbs: Converted ' + key);

        }

     });

})();