// ==UserScript==
// @name         NPC - Faerieland Item Quantity Checker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Checks inventory to see if you have enough items to complete the job.
// @author       Urgent
// @license      MIT
// @match        https://neopetsclassic.com/faerieland/employ/jobs/*
// @icon         https://www.google.com/s2/favicons?domain=neopetsclassic.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436261/NPC%20-%20Faerieland%20Item%20Quantity%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/436261/NPC%20-%20Faerieland%20Item%20Quantity%20Checker.meta.js
// ==/UserScript==

function get_information(link, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", link, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            callback(xhr.responseText);
        }
    };
    xhr.send(null);
}

get_information("/inventory/", function(text) {
    // Do something with the div here, like inserting it into the page
    console.log("should only happen once")
    inventory_inventory(text);

});

function inventory_inventory(text) {
    var match = RegExp('(?<=id="inventoryitempic" alt=").*(?=" )', 'g');
    //var match = /(?<=id="inventoryitempic" alt=").*(?=" )/;
    let array1;
    var dict = {}

    while ((array1 = match.exec(text)) !== null) {
        // console.log(`Found ${array1[0]}. Next starts at ${match.lastIndex}.`);
        var key = array1[0]
        if(key in dict){
            var value = dict[key]
            value = value + 1
            dict[key] = value
            //console.log("updated value", dict[key], key)
        }
        else{
             dict[key] = 1
        }
    }
    console.log(dict)
    insert_fea(dict)
    return dict
}

function insert_fea(inventory){
    var all_items = document.getElementsByTagName("tr")
    for(var i = 0; i < all_items.length; i++){
        var section = all_items[i];
        var sub = section.getElementsByTagName("td")
        var toString = sub[0].outerHTML
        var item_regex = RegExp('(?<=of:</b> ).*(?=\n)', 'g');
        var quantity_regex = RegExp('(?<=Find ).*(?= of)', 'g');
        var item_name = toString.match(item_regex)
        var quantity = toString.match(quantity_regex)

        // now check in dictionary
        if (item_name != null){
            if(item_name in inventory){
                sub[0].style.color = parseInt(inventory[item_name]) - parseInt(quantity) >= 0 ? 'green' : 'red';
                sub[0].insertAdjacentHTML('afterend', "You Have: "+inventory[item_name]);
            }
            else{
                sub[0].style.color = 'red';
                sub[0].insertAdjacentHTML('afterend', "None");
            }
            //parseInt(quantity)
            //sub[0].insertAdjacentHTML('afterend', "test")
        }
    }
}
