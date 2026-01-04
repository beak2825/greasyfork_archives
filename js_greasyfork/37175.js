// ==UserScript==
// @name         Inventory Organizer
// @namespace    inventoryOrganizer
// @version      1.1.1
// @description  Organizes inventory based on equipment stats
// @include      *.torn.com/item.php*
// @include      *.torn.com/bazaar.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37175/Inventory%20Organizer.user.js
// @updateURL https://update.greasyfork.org/scripts/37175/Inventory%20Organizer.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // Adds an error notification at the top of a page.
    var AddErrorNotification = function(errorString) {
        $('div.content-wrapper')
            .prepend($('<div class="m-top10" id="display-request-state">')
                     .append($('<div class="info-msg-cont red border-round">')
                             .append($('<div class="info-msg border-round">')
                                     .append($('<i class="info-icon"></i>'))
                                     .append($('<div class="delimiter">')
                                             .append($('<div class="msg right-round">')
                                                     .append($('<div class="change-logger">')
                                                             .append($('<p>' + errorString + '</p>')))))))
                     .append($('<hr class="delimiter-999 m-top10 m-bottom10">')));
    };

    try {
        var armorUlSelector;
        var armorLiAttribute;
        if (window.location.href.indexOf('bazaar.php') !== -1) {
            armorUlSelector = 'ul.armour-items';
            armorLiAttribute = 'data-reactid';
        } else {
            armorUlSelector = '#armour-items';
            armorLiAttribute = 'data-category';
        }

        class ArmorItem {
            constructor(armorLi, name, rating) {
                this.li = armorLi;
                this.name = name;
                this.rating = rating;
            }

            IsBefore(otherArmorItem) {
                if (this.name < otherArmorItem.name) {
                    return true;
                }
                if (this.name != otherArmorItem.name) {
                    return false;
                }

                return this.rating < otherArmorItem.rating;
            }

            ToString() {
                return this.name + ' (' + this.rating + ')';
            }
        }


        var GetArmorItemFromLi = function(armorLi) {
            var name;
            var rating;
            if (window.location.href.indexOf('bazaar.php') !== -1) {
                name = armorLi.find('div.name-wrap').text();
            } else {
                name = armorLi.attr('data-sort').slice(2);
            }
            rating = parseFloat(armorLi.find('ul.bonuses-wrap > li > span').eq(0).text());
            return new ArmorItem(armorLi, name, rating);
        };


        var lastNumberOfArmorItems = 0;
        var ObserveAllItems = function() {
            var armorUl = $(armorUlSelector);
            if (armorUl.length === 0) {
                // This might not be a page we want to organize, or this hasn't loaded yet. Just try again.
                setTimeout(ObserveAllItems, 200);
                return;
            }

            var CheckForArmorList = function() {
                var armorList = $(armorUlSelector + ' > li');

                // For some reason we could have excess items briefly included here...
                // Happens when this category has been loaded, then another category selected, then this category selected again.
                var newItemListLength = 0;
                $.each(armorList, function(index, armorLi) {
                    var armorLiAttributeValue = $(armorLi).attr(armorLiAttribute);
                    if (armorLiAttributeValue && armorLiAttributeValue.indexOf('Defensive') !== -1) {
                        ++newItemListLength;
                    }
                });

                if (newItemListLength > lastNumberOfArmorItems) {
                    console.debug('Got new armor list of size: ' + newItemListLength);
                    lastNumberOfArmorItems = newItemListLength;
                    SortArmorList(armorList);
                }
            };

            // Try immediately in case this data is already loaded.
            CheckForArmorList();
            // Set an observer afterwards in case it loads or changes.
            var armorObserver = new MutationObserver(function(mutations) {
                try {
                    mutations.forEach(function(mutation) {
                        if (mutation.addedNodes.length > 0) {
                            CheckForArmorList();
                        }
                    });
                } catch (error) {
                    console.error('Inventory Organizer: armor observer:', error);
                    AddErrorNotification('Inventory Organizer error: ' + error);
                }
            });
            armorObserver.observe(armorUl[0], { attributes: true, childList: true, characterData: true });
        };


        var SortArmorList = function(armorList) {
            var sortedArmorList = Array();
            $.each(armorList, function(index, armorLi) {
                var armorItem = GetArmorItemFromLi($(armorLi));
                for (var i = 0; i < sortedArmorList.length; ++i) {
                    if (armorItem.IsBefore(sortedArmorList[i])) {
                        sortedArmorList.splice(i, 0, armorItem);
                        return;
                    }
                }
                sortedArmorList.push(armorItem);
            });

            var armorUl = $(armorUlSelector);
            armorUl.empty();
            $.each(sortedArmorList, function(index, armorItem) {
                console.debug(armorItem.ToString());
                armorUl.append(armorItem.li);
            });

        };


        ObserveAllItems();

    } catch (error) {
        console.error(error);
        AddErrorNotification('Inventory Organizer error: ' + error);
    }
})();