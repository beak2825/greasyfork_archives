// ==UserScript==
// @name            Crystal Check
// @match           http://*.legacy-game.net/hunting3.php
// @match           http://*.legacy-game.net/inventory.php*
// @version         1.11
// @namespace       https://greasyfork.org/users/4585
// @description     Combine dropped crystals after hunting
// @grant           none
/*global $ */
// @downloadURL https://update.greasyfork.org/scripts/4375/Crystal%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/4375/Crystal%20Check.meta.js
// ==/UserScript==


/*****************************************************
                    General Methods                    
/****************************************************/
//Method to create elements on the fly without injecting html
function create(type, attr, text, parent) {
    var ele = document.createElement(type);
    for (var x in attr) {
        if (x.hasOwnProperty) {
            ele.setAttribute(x, attr[x]);
        }
    }
    if (text) {
        ele.innerHTML = text;
    }
    if (parent) {
        parent.appendChild(ele);
    }
    return ele;
}
//Return user cookies as object
function getCookies() {
    return document.cookie
        .split(/[;\s]+/g)
        .reduce(function(a, b) {
            a[b.split('=')[0]] = b.split('=')[1];
            return a;
        }, {});
}
/*****************************************************
                    Inventory                    
/****************************************************/

//Inventory API to manipulate inventory items
function Inventory(html) {
    this.items = getItems();
    this.key = $(html).find('form').attr('action').match(/[a-zA-Z]+$/g).pop();
    var key = this.key;
    //Inventory items encapsulated to organise data
    function Item(name, slot, trades, id) {
        this.name = name;
        this.slot = slot;
        this.trades = trades;
        this.id = id;

        //Crystal merging method
        this.merge = function(that, callback) {
            var slot1 = this.slot;
            var slot2 = that.slot;
            $.ajax({
                type: "POST",
                url: "inventory10.php?i=" + slot1 + "&key=" + key,
                async: false,
                data: {
                    item: slot2
                },
                success: function(data) {
                    //If method available, use on response data to check for further crystal merging
                    //Response from merging should be the redirected inventory page, which can be used to
                    //refresh inventory data
                    if (callback)
                        callback.call(this, data);
                }
            });
        };
    }
    //captures all item data for the inventory & encapsulates as an object
    function getItems() {
        //Match javascript lines on inventory.php for item id & trades
        //Each resulting index corresponds to the slot in inventory
        var itemPreviews = html.match(/(itemPreviews\[)((.|\n)*?)(Default|table>');/g);
        var tempItems = [];
        $(html).find('img.item').each(function() {
            var slot = parseInt($(this).attr('name'));
            var dat = itemPreviews[slot].replace("Un-tradable", "0 Trade").match(/(\d+)(?=(&c=|\sTrade))/g);
            tempItems.push(new Item($(this).attr('title'), slot, dat[0], dat[1]));
        });
        return tempItems;
    }

    //Returns all crystals in the inventory, sorted by item id (newest first)
    this.getCrystals = function() {
        return this.items
            //check if item is a crystal (must be have some word before crystal Crystal to avoid Crstal Rings)
            .filter(function(a) {
                return a.name.match(/.+Crystal/) !== null;
            })
            //order from newest to oldest (item id descending)
            .sort(function(a, b) {
                return b.id - a.id;
            });
    };
    //Returns an array of matching size/colour crystals
    //Ordered by trades on given crystal ascending, then everything else descending
    this.matchCrystal = function(crystal) {
        return this.getCrystals().filter(function(a) {
            return a.id !== crystal.id && a.name == crystal.name && crystal.name.search('Perfect')==-1;
        }).sort(function(a, b) {
            return (a.trades >= crystal.trades && b.trades >= crystal.trades) ? a.trades - b.trades : b.trades - a.trades;
        });
    };
}

/*****************************************************
                    Hunting Page Methods                    
/****************************************************/

function huntMerge() {
    //Once a crystal drop has been detected
    function checkDrop() {
        //Display 'found match' message on single line row
        function singleRow(crystal) {
            var r = create('tr', {}, false, $('tbody:contains("Item Found")')[0]);
            create('td', {
                    width: "100%",
                    class: "standardrow",
                    align: "center",
                    colspan: "2"
                },
                'You have a matching ' + crystal.name + ' (' + crystal.trades + 't) in your inventory. <span class="merge" style="cursor:pointer;">[Merge]</span>',
                r);
        }

        //create 'item drop' row displaying merged crystal image + result message
        function doubleRow(crystal) {
            var r = create('tr', {}, false, $('tbody:contains("Item Found")')[0]);
            create('td', {
                width: "10%",
                class: "standardrow",
                align: "center"
            }, "<img src='img-bin/items/" + crystal.name.toLowerCase() + ".png'/>", r);
            create('td', {
                width: "90%",
                class: "standardrow",
                align: "center"
            }, crystal.name + " added to inventory.", r);
        }
        $.ajax({
            url: 'inventory.php',
            async: true,
            success: function(data) {
                var inv = new Inventory(data);
                var drop = inv.getCrystals()[0];
                option(drop, inv.matchCrystal(drop));
                //recursive method - if crystal match, display option to merge - if merged, display result
                //if crystal match with previous result, offer to match again, etc
                function option(crystal, matches) {
                    if (matches.length > 0) {
                        singleRow(matches[0]);
                        $('span.merge').click(function() {
                            $(this).remove();
                            //merge newest crystal [0] with best matching crystal [1]
                            crystal.merge(matches[0],
                                //anonymous function as input for merge callback to display merge option on previously merged crystal
                                function(data) {
                                    var nextInv = new Inventory(data);
                                    var newCrystal = nextInv.getCrystals()[0];
                                    doubleRow(newCrystal);
                                    option(newCrystal, nextInv.matchCrystal(newCrystal));
                                }
                            );
                        });
                    }
                }
            }
        });
    }

    //Build a clickable button which allows the user to attack 
    //the same hunt group again without visiting the hunt page again
    //If there are buttons present, the fight is ongoing
    //If there is a page title, user is on error or multiattack screen
    if (!($('.button').length || $('.pagetitle').length)) {
        //Create Start Another Hunt button & position next to Back to Hunting page url, change row to fit
        //Button defaulted to disabled while waiting for attack string
        var td = $('td:has("#back-to-hunting")');
        td.prop("width", "50%");
        var newCell = create("td", {
                class: "standardrow",
                width: "50%",
                align: "center"
            }, false, td.parent()[0]),
            newButt = create("input", {
                type: "button",
                class: "button",
                value: "Start Another Hunt",
                disabled: "disabled"
            }, false, newCell);
        td.before(newCell);

        //Gather attack string from hunting.php && cookie info for next hunt form
        var form = create("form", {
                action: "hunting3.php",
                method: 'post',
                style: "display:none;"
            }, false, document.body),
            attackString,
            cookies = getCookies();
        create("input", {
            type: "hidden",
            name: "group",
            value: cookies.hunting_group
        }, false, form);
        create("input", {
            type: "hidden",
            name: "level",
            value: cookies.hunting_level
        }, false, form);
        create("input", {
            type: "submit",
            value: "Attack Target",
            class: "button",
            id: "hunt-" + cookies.hunting_group + "-" + cookies.hunting_level
        }, false, form);

        $.ajax({
            url: 'hunting.php',
            async: true,
            success: function(data) {
                attackString = data.match(/([a-zA-Z]{20})(?=">')/g).pop();
                create("input", {
                    type: "hidden",
                    name: "attackstring",
                    value: attackString
                }, false, form);
                newButt.disabled = false;
            }
        });
        //Button method - disable to prevent multi-attack & submit to proceed
        $(newButt).click(function() {
            $(this).prop("disabled", true);
            form.submit();
        });
        //Hunt Group 18 - Crystal Entities and crystal drop
        if (cookies.hunting_group == "18" && $('tbody:contains("Item Found")').length) {
            checkDrop();
        }
    }
}
/*****************************************************
                    Inventory Page Methods                    
/****************************************************/

function invMerge() {
    //Call current inventory as instance of inventory object defined above for managing crystals
    var inv = new Inventory(document.body.innerHTML);

    $('img[title*=" Crystal"]').each(function() {
        //Build selectbox containing matching crystal options & merge button
        var slot = $(this).attr('name');
        var row = create('tr', {}, false, false);
        var col1 = create('td', {
            colspan: '2'
        }, false, row);
        var select = create('select', {
            name: 'item',
            id: 'crystalSelect',
            class: 'selectbox',
            style: 'width:100%;'
        }, false, col1);
        var col2 = create('td', {}, false, row);
        var merge = create('input', {
            id: 'merge',
            type: 'button',
            class: 'button',
            style: 'width:100%',
            value: 'Merge'
        }, false, col2);
        var crystal = inv.getCrystals().reduce(function(a, b) {
            return b.slot == slot ? b : a;
        }, null);
        var matches = inv.matchCrystal(crystal);
        if (matches.length > 0) {
            matches.forEach(function(a) {
                create('option', {
                    value: a.slot
                }, a.trades + ' Trades | ID:' + a.id, select);
            });
        } else {
            create('option', {}, 'No Matching Crystals', select);
            select.disabled = true;
            merge.disabled = true;
        }
        select.selectedIndex = 0;
        //Add selectbox & button after crystal is selected in inventory
        $(this).click(function() {
            $('#ItemPreview tbody tbody:contains("Use")').append(row);
        });
        //Merging!
        $(merge).click(function() {
            //Re-create 'crystal to be merged' input as child of form
            create("input", {
                type: "hidden",
                name: "item",
                value: select.selectedOptions[0].value
            }, false, document.getElementsByTagName('form')[0]);
            //remove unneeded Save Changes input
            $('[name=itemarray]').remove();
            //Override Save Changes form for with merging url
            $('form').attr('action', 'inventory10.php?i=' + crystal.slot + '&key=' + inv.key).submit();
        });
    });
}
/*****************************************************
                    Misc                    
/****************************************************/
//call methods where relevant
switch (location.pathname) {
    case '/inventory.php':
        invMerge();
        break;
    case '/hunting3.php':
        huntMerge();
        break;
}