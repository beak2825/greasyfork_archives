// ==UserScript==
// @name         TE price comparison
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Provides lowest bazaar price
// @author       You
// @include        /^https?:\/\/(www\.)?tornexchange\.com\/prices\/.*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tornexchange.com
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/461711/TE%20price%20comparison.user.js
// @updateURL https://update.greasyfork.org/scripts/461711/TE%20price%20comparison.meta.js
// ==/UserScript==

(async function() {
    'use strict';
     window.ratelimited = false
    $('document').ready(async function(){

        var key = localStorage.getItem('TEAPIkey')
    while (!key) {
       key = prompt('API key (any access level):')
    }
      localStorage.setItem('TEAPIkey', key)
const apiUrl = `https://api.torn.com/torn/?selections=items&key=${key}`;

await fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const items = data.items;
    window.itemsById = {};
    for (const itemId in items) {
      const item = items[itemId];
      const itemName = item.name;
      window.itemsById[itemName] = itemId;
    }
    console.log(window.itemsById);
  })
  .catch(error => console.error(error));


async function value(id) {
  try {
    const response = await fetch(`https://api.torn.com/market/${id}?selections=&key=${key}`);
    const data = await response.json();
    if (data['bazaar']) {
      return data['bazaar'][0]['cost'];
    } else {
        if (data['error']['code'] == 5) {
            if (!window.ratelimited) {
                console.log('Hit maximum of 100 requests per minute. Please wait a minute for more results to load.');
                window.ratelimited = true
            }
            console.log('Ratelimited, sleeping for a minute')
            await new Promise(r => setTimeout(r, 61000)); // sleep 61s, ratelimited
        }
        return await(value(id));
    }
  } catch (err) {
    console.error(err);
  }
}
const items = document.querySelectorAll('.row-striped ');

$('thead').each(function() {
  $(this).children('tr:first').append('<th style="width: 30%;" scope="col" class="p-0 m-0">Lowest Market Cost</th>');
});

items.forEach(async item => {
    console.log(item)
  var name = item.children[1].textContent;
  var cost = item.children[2].textContent.replace(/,/g, '').replace('$', '');
  cost = Number(cost);
  var id = window.itemsById[name];
  if (id) {
    const valueResult = await value(id);
      var el = $("<td></td>").addClass('p-0 m-0');
if (valueResult < cost) {
  el.css('background-color', 'lightgreen');
}
el.css('width', '30%');
el.html('<a target="_blank" href="https://www.torn.com/imarket.php#/p=shop&step=shop&type=&searchname='+encodeURIComponent(name)+'">$'+valueResult.toLocaleString()+'</a>');
console.log(el);
item.append(el[0]);

  }
});

$('thead').each(function() {
  $(this).children('tr:first').children('th:first').hide()
})

$('img').each(function() {
  $(this).hide()
})



    });

})();