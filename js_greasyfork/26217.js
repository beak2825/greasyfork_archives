// ==UserScript==
// @name         Krawężnik
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  dodaje funkcje krawężnika do mirko
// @author       @ZasilaczKomputerowy, @shar
// @match        https://www.wykop.pl/mikroblog/*
// @match        https://www.wykop.pl/link/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/26217/Kraw%C4%99%C5%BCnik.user.js
// @updateURL https://update.greasyfork.org/scripts/26217/Kraw%C4%99%C5%BCnik.meta.js
// ==/UserScript==

(function() {
    // constants
    var STORAGE_KEY_COLLAPSED_LIST = 'listaZwinietych';

    // routines
    var collapse = collapse;
    var expand = expand;
    var collapseOrExpand = collapseOrExpand;
    var toggleCollapseExpand = toggleCollapseExpand;
    var init = init;
    var addStyle = addStyle;

    // variables
    var collapsedList;

    // initialization
    init();

    // implementation
    function init() {
        addStyle();

        try {
            collapsedList = JSON.parse(localStorage.getItem(STORAGE_KEY_COLLAPSED_LIST));

            if (!collapsedList) {
                collapsedList = [];
                localStorage.setItem(STORAGE_KEY_COLLAPSED_LIST, JSON.stringify(collapsedList));
            }
        } catch (ex) {
            collapsedList = [];
            localStorage.setItem(STORAGE_KEY_COLLAPSED_LIST, JSON.stringify(collapsedList));
        }

        $('#itemsStream')
            .children()
            .each(function(index, element) {
                var vC = $(element).find('p.vC').first();
                var id = $(element).find('div.wblock').attr('data-id');
                var collapsedElement = collapsedList.indexOf(id) !== -1;

                var expandCollapseButton = $("<span>",
                {
                    id: id + '_handle',
                    class: 'kerbstone-button',
                    text: '[ ' + (collapsedElement ? '+' : '-') + ' ]',
                    click: function() {
                        toggleCollapseExpand(id);
                    }
                });

                //vC.prepend(expandCollapseButton);
                expandCollapseButton.insertBefore(vC);

                if (collapsedElement) {
                    collapse(id);
                }
            });
    }

    function addStyle() {
        // TODO: need to find better way to position button
        GM_addStyle(
            '.kerbstone-button { ' +
            'position: absolute; ' +
            'right: 100px; ' +
            '}');
    }

    function collapse(id) {
        collapseOrExpand(id, true);
    }

    function expand(id) {
        collapseOrExpand(id, false);
    }

    function collapseOrExpand(id, collapse) {
        var displayValue = collapse ? 'none' : 'block';
        var textValue = collapse ? '[ + ]' : '[ - ]';

        var parent = $('div[data-id=' + id + ' ]').parent();
        parent.find('div.text').first().css('display', displayValue);
        parent.find('div.elements').first().css('display', displayValue);
        parent.find('img.avatar').first().css('display', displayValue);
        parent.children('ul.sub').css('display', displayValue);
        parent.find('#' + id + '_handle').text(textValue);
        $("img.lazy").lazyload(); // refresh lazyload positnions of all elements
    }

    function toggleCollapseExpand(id) {
        var idx = collapsedList.indexOf(id);

        if (idx > -1) {
            collapsedList.splice(idx, 1);
            expand(id);
        } else {
            collapsedList.push(id);
            collapse(id);
        }

        localStorage.setItem(STORAGE_KEY_COLLAPSED_LIST, JSON.stringify(collapsedList));

        var parent = $('div[data-id=' + id + ' ]').parent();

        if(!isScrolledIntoView(parent))
        {
            $('html, body').animate({
                scrollTop: $(parent).offset().top
            }, 400);
        }
    }

    function isScrolledIntoView(elem)
    {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }
})();