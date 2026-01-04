// ==UserScript==
// @name         Bazaar filter
// @namespace   https://greasyfork.org/en/users/5563-bloodymind
// @version      0.2
// @description  Add filtring items in bazaar
// @author       BloodyMind
// @match        *://www.torn.com/bazaar.php
// @require     http://code.jquery.com/jquery-2.1.3.min.js
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/399019/Bazaar%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/399019/Bazaar%20filter.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var itemsListStruct = '<a id="itemsSort" class ="dd-important t-clear h c-pointer line-h24 right"><label for="sort">Sort:</label><select id="sort"><option value="desc">High to Low</option><option value="asc">Low to High</option></select></a><a id="itemsFilter" class ="dd-important t-clear h c-pointer line-h24 last right"><label for="items">filter:</label><select id="items" name="items"><option value="Show all">Show all</option>';
    var $allItems;

    function fixList() {
        $('ul.items-list li.empty').remove();
        $('ul.items-list li').removeClass('first').removeClass('second').removeClass('third').removeClass('first-row').removeClass('last-row').removeClass('last');
        var $shownItems = $('ul.items-list li.show');
        var numberOfItems = $shownItems.length;
        if (numberOfItems % 3 == 2) {
            $('ul.items-list li.show:last').after('<li class="empty show"></li>');
        } else if (numberOfItems % 3 == 1) {
            $('ul.items-list li.show:last').after('<li class="empty show"></li><li class="empty show"></li>');
        }
        $shownItems = $('ul.items-list li.show');
        numberOfItems = $shownItems.length;
        if (numberOfItems <= 2) {
            $shownItems.addClass('first-row').addClass('last-row');
        } else {
            $shownItems.slice(numberOfItems - 3, numberOfItems).addClass('last-row');
            $shownItems.slice(0, 3).addClass('first-row');
        }
        $('ul.items-list li.show:not(.empty):last').addClass('last');
        $shownItems.each(function (item) {
            switch ((item + 1) % 3) {
                case 1:
                    $(this).addClass('first');
                    break;
                case 2:
                    $(this).addClass('second');
                    break;
                case 0:
                    $(this).addClass('third');
                    break;
            }
        });
    }

    function sortList(dir) {
        console.log(dir);
        var $items = $('ul.items-list li.show:not(.empty)');
        $items.sort(function (a, b) {
            var an = parseInt(Number($(a).find('span.info span.desc span.wrap div.price').text().replace(/[^0-9-\.]+/g, "")));
            var bn = parseInt(Number($(b).find('span.info span.desc span.wrap div.price').text().replace(/[^0-9-\.]+/g, "")));
            if (dir == "asc") {
                if (an > bn)
                    return 1;
                if (an < bn)
                    return -1;
            } else if (dir == "desc") {
                if (an < bn)
                    return 1;
                if (an > bn)
                    return -1;
            }

            return 0;

        });
        $items.detach().appendTo($('ul.items-list'));
        $items.each(function (index) {
            console.log(index.toString() + "-" + $(this).find('span.info span.desc span.wrap div.price').text());
        });
    }
    (new MutationObserver(checkBazaarLoaded)).observe(document, {
        childList: true,
        subtree: true
    });

    function checkBazaarLoaded(changes, observer) {
        if (document.querySelector('div.bazaar-page-wrap.bazaar-main-wrap')) {
            observer.disconnect();
            if (document.querySelector('ul.items-list')) {
                $('ul.items-list li').addClass('show');
                $allItems = $('ul.items-list li');
                var $items = $('ul.items-list li:not(.empty) span.info span.desc span.wrap p.t-overflow');
                var itemsNames = new Array();
                $items.each(function (item) {
                    if (!itemsNames.includes($(this).text())) {
                        itemsNames.push($(this).text());
                    }
                });
                itemsNames.sort();
                itemsNames.forEach(function (item) {
                    itemsListStruct = itemsListStruct.concat('<option value="' + item + '">' + item + '</option>');
                });
                itemsListStruct = itemsListStruct.concat('</select></a>');
                $('div.content-title-links a.last').removeClass('last').after(itemsListStruct);

                $('select#sort').change(function () {

                    sortList($('select#sort option:selected').val());
                    fixList();
                });
                $('select#items').change(function () {
                    $("select#items option:selected").each(function () {
                        if ($(this).text() === 'Show all') {
                            $('ul.items-list li').removeClass('hide').addClass('show');
                        } else {
                            var selectedItem = $(this).text();
                            $('ul.items-list li').each(function (item) {
                                if ($(this).find('span.info span.desc span.wrap p.t-overflow').text() === selectedItem) {
                                    $(this).removeClass('hide').addClass('show');
                                } else {
                                    $(this).removeClass('show').addClass('hide');
                                }
                            });
                        }
                    });

                    sortList($('select#sort option:selected').val());
                    fixList();
                });
            } else {
                console.log('No items in bazaar');
            }
        }
    }
})();