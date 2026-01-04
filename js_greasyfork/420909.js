// ==UserScript==
// @name         DH3 SellFix
// @namespace    com.anwinity.dh3
// @version      1.0.0
// @description  Allows you to sell items if you are experiencing the bug that doesn't let you.
// @author       Anwinity
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420909/DH3%20SellFix.user.js
// @updateURL https://update.greasyfork.org/scripts/420909/DH3%20SellFix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const scope = {
        items: null,
        defaultKeySort: [
            "stone",
            "copper",
            "iron",
            "silver",
            "gold",
            "promethium",
            "titanium",
            "ancient",
            "moonstone",
            "marsRock",
            "bronzeBars",
            "ironBars",
            "silverBars",
            "goldBars",
            "promethiumBars",
            "sapphire",
            "emerald",
            "ruby",
            "diamond",
            "bloodDiamond",
            "dottedGreenLeaf",
            "greenLeaf",
            "limeLeaf",
            "goldLeaf",
            "crystalLeaf",
            "stripedGoldLeaf",
            "stripedCrystalLeaf",
            "logs",
            "oakLogs",
            "willowLogs",
            "mapleLogs",
            "bambooLogs",
            "lavaLogs",
            "pineLogs",
            "stardustLogs",
            "oyster",
            "specialOyster",
            "pearl",
            "rarePearl",
            "limeQuartzMineral",
            "jadeMineral",
            "amethystMineral",
            "blueMarbleMineral",
            "limoniteMineral",
            "tashmarineMineral",
            "denseMarbleMineral",
            "fluoriteMineral",
            "purpleQuartzMineral",
            "crystalPrismeMineral",
            "amberMineral",
            "tanzaniteMineral",
            "royalMineral",
            "rainbowCrystalMineral",
            "bloodCrystalMineral"
        ]
    };

    function initUI() {
       const styles = document.createElement("style");
        styles.textContent = `
        table#sellFixTable {
          border-collapse: collapse;
          width: 100%;
        }
        table#sellFixTable tr, table#sellFixTable th, table#sellFixTable td {
          border: 1px solid rgb(50, 50, 50);
          background-color: rgba(26, 26, 26, 0.4);
          text-align: left;
        }
        table#sellFixTable th, table#sellFixTable td {
          padding: 0.25em;
          padding-left: 0.5em;
          padding-right: 0.5em;
        }
        `;
        $("head").append(styles);

        $("#navigation-right-shopOptions > center").append(`
        <br />
        <div onclick="navigate('sellFix')" class="large-shopOptions-buttons">
          LET ME SELL THINGS
        </div>
        `);

        $("#right-panel").append(`
        <div id="navigation-sellFix" style="display: none; padding: 1em;">
          <table id="sellFixTable">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price Each</th>
                <th>You Have</th>
                <th>Sell It</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
          </table>
        </div>
        `);

        const sellFixTable = $("#sellFixTable");
        const itemKeys = Object.keys(scope.items);
        itemKeys.sort();
        itemKeys.forEach(key => {
            if(!scope.defaultKeySort.includes(key)) {
                scope.defaultKeySort.push(key);
            }
        });
        scope.defaultKeySort.forEach(name => {
            sellFixTable.append(`
              <tr id="sellFixRow-${name}">
                 <td><img src="images/${name}.png" class="img-30" />&nbsp;${name}</td>
                 <td style="text-align: right">${scope.items[name].toLocaleString()}</td>
                 <td id="sellFixQuantity-${name}" style="text-align: right"></td>
                 <td>
                   <input type="number" min="0" id="sellFixSellAmount-${name}" />
                   <button type="button" onclick="$('#sellFixSellAmount-${name}').val(parseInt(window.var_${name}||'0'))">Max</button>
                   <button type="button" onclick="
                     let amount = parseInt($('#sellFixSellAmount-${name}').val());
                     if(typeof amount === 'number' && !isNaN(amount)) {
                         sendBytes('DO_SELL=${name}~'+amount);
                     }
                   ">Sell</button>&nbsp;<img src="images/${name}.png" class="img-30" />
                 </td>
              </tr>
            `);
        });
    }

    function overrideFunctions() {
        const originalNavigate = window.navigate;
        window.navigate = function(a) {
            originalNavigate.apply(this, arguments);
            if(a=="sellFix") {
                //
            }
            else {
                $("#navigation-sellFix").hide();
            }
        };

        const originalSetItems = window.setItems;
        window.setItems = function(data) {
            originalSetItems.apply(this, arguments);
            updateQuantities();
        }

    }

    function updateQuantities() {
        Object.keys(scope.items).forEach(key => {
            $(`#sellFixQuantity-${key}`).text(parseInt(window[`var_${key}`]||"0").toLocaleString());
        });
    }

    function init() {
        if(!window.var_username || !window.global_itemPriceMap || window.global_itemPriceMap.length==0) {
            setTimeout(init, 1000);
            return;
        }

        scope.items = global_itemPriceMap.reduce((map, item) => {
            map[item.name] = parseInt(item.price);
            return map;
        }, {});
        initUI();
        overrideFunctions();
        updateQuantities();
    }

    $(init);

})();