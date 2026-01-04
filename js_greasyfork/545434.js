// ==UserScript==
// @name         EasyPrice
// @namespace    gaskarth.torn
// @version      0.0.7
// @description  Hides items that are more expensive than a predecessor in the market when sorting by Quality, Accuracy, Damage or Armor in Desc order only
// @author       Gaskarth
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545434/EasyPrice.user.js
// @updateURL https://update.greasyfork.org/scripts/545434/EasyPrice.meta.js
// ==/UserScript==

/**
INSTRUCTIONS

When buying fungible items in Torn we all sort by price ascending and buy the cheapest because they are all the same.
But Weapons and Armor are not all the same and we want the best cheap ones :)

* Install this script then
* go to the Item Market page for weapons or armor and
* change Sort by from price to one of the other attributes in DESCENDING order - overpriced items will hide with embarrisment.

Sorting in Descending attribute order shows the best ones first and the script will then dim any item that is more expensive than a previous better example.

If you save a load of money and time please send me a xanax and words of encouragment every so often.

**/

'use strict';

const hiddenOpacity = 0.3,
      interval = 500;

function updateList() {
    let best = null, order = null, direction = null, failReason = '';

    //
    const dropdowns = [...document.querySelectorAll('input[type="hidden"][value*=":"]:not([value*="{"])')]
        .reduce((acc, el) => {
        const [order, direction] = el.value.split(':');
        if (["accuracy", "quality", "damage","armor"].includes(order)) {
            acc.push({ order, direction });
        }
        return acc;
    }, []);
    if (dropdowns && dropdowns.length) {
        order = dropdowns[0].order;
        direction = dropdowns[0].direction
    }
    if (order) {
        Array.from(document.querySelectorAll('.priceAndTotal___eEVS7'))
            .map(el => (
            {
                el: el,
                value: (+el.innerText.replace(/[^0-9]/g, ''))
            }))
            .forEach(m => {
            if (!best) { best = m.value; }
            if (direction === 'DESC') {
                m.el.closest('li').style.opacity = (m.value > best) ? hiddenOpacity : 1;
                if (m.value < best) best = m.value;
            } else { failReason = 'EasyPrice: choose descending' }
        });
    } else {
        failReason = 'EasyPrice: Choose QUAL, ACC or DMG'
    }
    document.querySelector('.title___rhtB4').innerText = (failReason)? failReason:'Item Market : EasyPrice ON';
    document.querySelector('.dropdowns___QIaHL').lastChild.style.backgroundColor=failReason? 'red':'green';

}

let inter = setInterval(updateList, interval);

