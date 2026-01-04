// ==UserScript==
// @name         AWH price comparison
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Provides lowest bazaar price
// @author       You
// @include      /^https?:\/\/(www\.)?arsonwarehouse\.com\/prices\/.*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arsonwarehouse.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461972/AWH%20price%20comparison.user.js
// @updateURL https://update.greasyfork.org/scripts/461972/AWH%20price%20comparison.meta.js
// ==/UserScript==

(async function() {
    'use strict';


       console.log('Loaded')
        var key = localStorage.getItem('AWHAPIkey');

        async function checkApiKey(apiKey) {
          const apiUrl = `https://api.torn.com/user/?selections=&key=${apiKey}`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          if (data.error && data.error.code === 2) {
            return false; // incorrect key
          } else {
            return true; // correct key
          }
        }

        async function getApiKey() {
          while (!await checkApiKey(key)) {
            key = prompt('API key (any access level):');
            localStorage.setItem('AWHAPIkey', key);
          }
          console.log('API key is valid:', key);
        }

        getApiKey();

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
                    return await (value(id));
                }
            } catch (err) {
                console.error(err);
            }
        }

        const items = document.querySelectorAll('.flex.items-center.odd\\:bg-gray-100.py-1.pl-2.pr-4');

        items.forEach(async item => {
            var name = item.children[1].textContent;
            var cost = item.children[2].textContent.replace(/,/g, '').replace('$', '');
            item.children[2].style.float = 'left';
            item.children[2].classList.remove('text-right');
            let space = document.createElement("div");
            space.style.width = "20px";
            space.style.flexShrink = "0";
            space.style.flexGrow = "0";
            item.appendChild(space);
            cost = Number(cost);
            var id = window.itemsById[name];
            var valueResult = await value(id);
            if (id) {
                const div1 = document.createElement('div');
                div1.classList.add('flex', 'flex-col', 'items-end', 'flex-nowrap', 'text-right');

                const div2 = document.createElement('div');
                div2.classList.add('flex', 'items-center');

                const span = document.createElement('span');
                span.innerHTML = '<a target="_blank" href="https://www.torn.com/imarket.php#/p=shop&step=shop&type=&searchname='+encodeURIComponent(name)+'"><span style="color: black;">$'+valueResult.toLocaleString()+'</span></a>'
                span.style.color = 'black';
                if (valueResult < cost) {
                    span.style.backgroundColor = 'lightgreen';
                }
                div2.appendChild(span);

                div1.appendChild(div2);

                item.appendChild(div1);
            }
        });


})();
