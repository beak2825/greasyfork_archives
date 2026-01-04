// ==UserScript==
// @name         GGn Item count on permalinks
// @namespace    ItemCount
// @version      0.1
// @description  Gets the count of an item in public inventories and displays it on the item permalink page.
// @author       YOA
// @match        https://gazellegames.net/shop.php?*ItemID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464044/GGn%20Item%20count%20on%20permalinks.user.js
// @updateURL https://update.greasyfork.org/scripts/464044/GGn%20Item%20count%20on%20permalinks.meta.js
// ==/UserScript==

async function fetch_count() {
    const API_KEY = "YOUR_API_KEY_HERE";
    const href = window.location.href;
    let itemID = undefined
    // https://gazellegames.net/shop.php?ItemID=3441
    if (href.includes('ItemID')) {
        const urlParams = new URLSearchParams(window.location.search);
        itemID = urlParams.get('ItemID');
    }
    const url = `https://gazellegames.net/api.php?request=item_stats&itemid=${itemID}&include_info=true&key=${API_KEY}`;
    return fetch(url)
        .then((response) => response.json())
        .then((data) => {
        return data.response.count;
        });
}

async function add_count(evt)
{
    if (document.querySelector("[title='Count of the item']")){
        return
    }
    let GGn_item_count = await fetch_count();
    var count_element = document.createElement('p');
    count_element.innerHTML = 'Count: ' + GGn_item_count;
    count_element.setAttribute('title', 'Count of the item')
    document.getElementsByClassName("info_cost")[0].appendChild(count_element)
}

var clickable_element = document.querySelector("#clickable");
clickable_element.addEventListener("click", add_count);
