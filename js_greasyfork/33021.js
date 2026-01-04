// ==UserScript==
// @name         W3Schools +
// @namespace    https://greasyfork.org/users/37096/
// @homepage     https://greasyfork.org/scripts/33021/
// @supportURL   https://greasyfork.org/scripts/33021/feedback
// @version      1.1.4
// @description  W3Schools with more freedom
// @author       Hồng Minh Tâm
// @match        https://www.w3schools.com/*/*.asp
// @match        https://www.w3schools.com/*/*.asp*
// @icon         https://www.w3schools.com/favicon.ico
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @require      https://greasyfork.org/scripts/30368-highlight-words-jquery-library/code/Highlight%20Words%20Jquery%20Library.js?version=199098
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @license      GNU GPLv3
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/33021/W3Schools%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/33021/W3Schools%20%2B.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    GM_addStyle([
        '@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";',
        '#list-title-children { background-color: #dbefdc; }',
        '#list-title-children a { padding-left: 30px; }',
        '#list-title-children a.active { color: #000000; background-color: #b7dfb8; }',
        '#leftmenuinner { display: -webkit-box; display: -moz-box; display: -webkit-flex; display: flex; -webkit-box-orient: vertical; -moz-box-orient: vertical; -webkit-flex-direction: column; flex-direction: column; }',
        '#input-filter { width: 100%; padding: 5px 1px 5px 14px; color: #000; background-color: #fff; border: 1px solid #ccc; }',
        '#leftmenuinnerinner { overflow-y: auto; }',
        'input#input-filter::-webkit-input-placeholder { font-family: Arial, Helvetica, sans-serif, FontAwesome; }',
        'input#input-filter::-moz-placeholder { font-family: Verdana, sans-serif, FontAwesome; }',
        'input#input-filter::-ms-input-placeholder { font-family:  Verdana, sans-serif, FontAwesome; }',
        'input#input-filter:not(:placeholder-shown) { background-color: #FFFF88; }',
        'input#input-filter[type="search"]::-webkit-search-cancel-button { -webkit-appearance: searchfield-cancel-button; }',
        '.highlight { background-color: #FFFF88; color: #000; }',
    ].join('\n'));
 
    var $main = $('#main');
    var $leftmenuinner = $('#leftmenuinner');
    var $leftmenuinnerinner = $('#leftmenuinnerinner');
    var $titleParent = $leftmenuinnerinner.find('a[target = "_top"].active:eq(0)');
 
    var $listTitleChild = $('<div/>', {
        id: 'list-title-children'
    }).insertAfter($titleParent);
 
    var $iconTitleParent = $('<i/>', {
        class: 'fa fa-caret-up'
    });
    $titleParent.append(' ').append($iconTitleParent);
    $titleParent.click(function(e) {
        $listTitleChild.slideToggle();
        $iconTitleParent.toggleClass('fa-caret-down fa-caret-up');
        return false;
    });
 
    var index = 0;
    $main.children('h2').each(function() {
        if($(this).prop('tagName') === "H1" || $(this).prop('tagName') === "H2") {
            var idTitleChildren = 'title-'+ (++index);
            $(this).attr({
                'data-id': idTitleChildren,
                class: 'title-children-section'
            });
            var $titleChildren = $('<a/>', {
                href: '#'+idTitleChildren,
                class: 'item-title-children'
            }).text($(this).text()).appendTo($listTitleChild);
        }
    });
 
    var $titleChildrens = $('.item-title-children');
    var $titleChildrenSections = $('.title-children-section');
 
    $titleChildrens.click(function(e) {
        e.preventDefault();
        $(document).off('scroll');
        $titleChildrens.removeClass('active');
        $(this).addClass('active');
 
        var target = this.hash.replace('#', ''),
            $target = $('h2[data-id="'+target+'"]');
 
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top - $('#topnav').height() - 5
        }, 300, 'swing', function() {
            window.location.hash = target;
            $(document).on('scroll', onScroll);
        });
    });
 
    $(document).on('scroll', onScroll);
    if(window.location.hash) {
        $titleChildrens.filter('[href^="'+window.location.hash+'"]').click();
    }
    function onScroll(e) {
        var scrollPosition = $(document).scrollTop() + $('#topnav').height() + 10;
        $titleChildrenSections.each(function(index, element) {
            var $next = $titleChildrenSections.eq(index + 1);
            var target = $(this).data('id');
            if($(this).position().top < scrollPosition && ($next.position()?$next.position().top:($main.position().top+$main.height())) - 10 > scrollPosition) {
                $titleChildrens.removeClass('active');
                $titleChildrens.filter('[href^="#'+target+'"]').addClass('active');
                window.location.hash = target;
            } else {
                $titleChildrens.filter('[href^="#'+target+'"]').removeClass('active');
            }
        });
    }
 
    var $inputFilter = $('<input/>', {
        type: 'search',
        id: 'input-filter',
        placeholder: $('<div/>').html('&#xf0b0; Filter').html()
    }).prependTo($leftmenuinner);
    $inputFilter.on('input', function(e) {
        var filterValue = $(this).val().toLowerCase();
        $leftmenuinnerinner.find('a[target = "_top"]').each(function(index, item) {
            $(item).unhighlight().highlight(filterValue);
            if($(item).text().toLowerCase().indexOf(filterValue) > -1) {
                $(item).show();
            } else {
                $(item).hide();
            }
        });
        $titleChildrens.each(function(index, item) {
            $(item).unhighlight().highlight(filterValue);
            if($(item).text().toLowerCase().indexOf(filterValue) > -1) {
                $(item).show();
                $titleParent.show();
            } else {
                $(item).hide();
            }
        });
        $leftmenuinnerinner.find('h2').each(function(index, item) {
            if($(item).nextUntil('br').filter(':visible:not(#list-title-children)').size()) {
                $(item).show();
                $(item).nextAll('br:eq(0)').show();
            } else {
                $(item).hide();
                $(item).nextAll('br:eq(0)').hide();
            }
        });
    });
})();