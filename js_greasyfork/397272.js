// ==UserScript==
// @name         Gitscrum Auto Filter
// @namespace    https://github.com/rodortega
// @version      0.1.1
// @description  Add Filter to new Gitscrum - Click the navbar once to create Members Tab
// @author       Rod Ortega
// @match        https://gitscrum.com/*/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/397272/Gitscrum%20Auto%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/397272/Gitscrum%20Auto%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = jQuery.noConflict();
    // create members container
    var member_container = '<div id="dropdown-members" class="ml-10-px"><a href="#" class="dropdown-toggle dropdown-members header-project-title txt-68748F">Members</a><div class="dropdown-menu dropdown-menu-members dropdown-menu-right navbar-dropdown"></div></div>';
    // append members container when a dropdown is clicked
    $(document).on('click', '.navbar', function(){
        if (!$('#dropdown-members').length){
            $('.header-project').find('.justify-content-end').last().append(member_container);
            $('.header-project').find('.dropdown-members').attr({
                'data-toggle': 'dropdown',
                'aria-expanded': 'false'
            });
        }
        loadMembers();
    });
    // loadMembers
    function loadMembers(){
        var cards = $('.task-card');
        var clickables = [];
        clickables.push('All');
        cards.each(function(i){
            var tags = $(this).data('username').split(',');
            $.each(tags, function(index){
                if(clickables.indexOf(tags[index]) === -1 && tags[index] != ''){
                    clickables.push(tags[index]);
                }
            });
        });
        var html = '';
        $.each(clickables, function(index, value){
            html = html + '<a href="#" class="header-dropdown-item dropdown-member-item"><span class="ml-2">'+ value +'</span></a>';
        });
        $('body').find('.dropdown-menu-members').html(html);
    };
    // show/hide cards based on member selection
    $(document).on('click', '.dropdown-member-item', function(){
        var cards = $('.task-card');
        if ($(this).text() == 'All') {
            cards.css('display', 'block');
        }
        else {
            var username = $(this).text();

            cards.each(function(index){
                var tags = $(this).data('username').split(',');
                if($.inArray(username, tags) !== -1){
                    $(this).css('display', 'block');
                }
                else {
                    $(this).css('display', 'none');
                }
            });
        }
    });
})();