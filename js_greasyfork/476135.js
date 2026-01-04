// ==UserScript==
// @name         IdlePixel Auto Market Buyer
// @namespace    http://tampermonkey.net/
// @version      0.1.27
// @description  description
// @author       kasanoppa
// @match        https://idle-pixel.com/login/play/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      The Unlicense
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/476135/IdlePixel%20Auto%20Market%20Buyer.user.js
// @updateURL https://update.greasyfork.org/scripts/476135/IdlePixel%20Auto%20Market%20Buyer.meta.js
// ==/UserScript==

const qty = {
    //    lizard_skin: 100,
    bones: 1000,
    ice_bones: 5,
    red_mushroom_seeds: 15,
    dotted_green_leaf_seeds: 20,
    emerald: 3,
    green_leaf_seeds: 10,
    lime_leaf: 6,
    gold_leaf: 10,
    raw_trout: 10,
    raw_swordfish: 1,
    raw_manta_ray: 1,
    raw_shark: 1,
    raw_whale: 1,
    ruby: 3,
    diamond: 2,
//        saphire: 20,
//    tree_seeds: 30,
//          blue_pickaxe_orb: 1,
//    blue_hammer_orb: 1,
//    blue_oil_well_orb: 1,
//        club: 1,
//    spiked_club: 1,
//        unbound_donor_coins: 1,
};


const CSS = `
<style id="styles-my-market">

.modal-body {
  max-height: 90vh;
}

#modal-gathering-uniques-table td {
  padding: 0;
}

.farming-patches-area > span:nth-child(4) {
  display: none;
}

.farming-patches-area > span:nth-child(5) {
  display: none;
}

#crafting-calculator-form > label:has(+input) {
  color: #555;
}

#crafting-calculator-form > label:has(+input:checked) {
  color: #000;
  text-decoration: underline;
}

#crafting-xp-options > span:has(+input) {
  color: #555;
}

#crafting-xp-options > span:has(+input:checked) {
  color: #000;
  text-decoration: underline;
}

#mining-calculator-form > label:has(+input) {
  color: #555;
}

#mining-calculator-form > label:has(+input:checked) {
  color: #000;
  text-decoration: underline;
}

#mining-xp-options > span:has(+input) {
  color: #555;
}

#mining-xp-options > span:has(+input:checked) {
  color: #000;
  text-decoration: underline;
}

#farming-xp-options > span:has(+input) {
  color: #555;
}

#farming-xp-options > span:has(+input:checked) {
  color: #000;
  text-decoration: underline;
}

#brewing-xp-options > span:has(+input) {
  color: #555;
}

#brewing-xp-options > span:has(+input:checked) {
  color: #000;
  text-decoration: underline;
}

.achievement-button:has(span.color-green) {
  opacity: 0.2;
}

#market-table tr.no-margin {
  color: orange;
}

#market-table tr.cheap {
  color: green;
}

#market-table tr.hover:not(.filtered) {
  display: none;
}

#market-table:has(input[name=single]:checked) tr.hover:not(.single) {
  display: none;
}

#menu-bar-hero {
  position: sticky;
  top: 0;
  left: 0;
}

</style>
`;

(function() {
  'use strict';

  function lookup({ market_item_name }) {
    return Market.tradables.find(_ => _.item === market_item_name);
  }

  function minP(item) {
    return lookup(item)?.lower_limit;
  }

  function maxP(item) {
    return lookup(item)?.upper_limit;
  }

  function p(item) {
    return item.market_item_price_each;
  }

  let singles = [];
  window.ModifyMarketDataHeader = function(headerHtml) {
    singles = [];
    return headerHtml
      .replace('<th>ITEM</th>', `<th>ITEM&nbsp;&nbsp;<label><input name="single" type="checkbox" ${document.querySelector('#market-table input[name=single]')?.checked === false ? '' : 'checked="checked"'}" /> Single</label></th>`)
      .replace('<th>PRICE EACH</th>', `<th>PRICE EACH</th><th>History</th><th>Expectation</th>`);
  };

  window.ModifyMarketDataRow = function(datum, rowHtml) {
    const single = !singles.includes(datum.market_item_name);
    if(single)
      singles.push(datum.market_item_name);
    const rate = (p(datum) - minP(datum)) / (maxP(datum) - minP(datum));
    const h = MarketAutoPlugin.history[datum.market_item_name] ?? {};
    const chunks = rowHtml.split('<td');
    chunks[0] = chunks[0].replace('class="hover', `class="${['hover', datum.market_item_category, single && 'single', rate === 0 ? 'no-margin' : rate <= 0.1 && 'cheap'].filter(Boolean).join(' ')}`);
    chunks[4] = chunks[4]
      .replace(/^>/, `><span style="font-size: 50%;">${minP(datum)} ${p(datum)} (${(rate * 100).toFixed(0)}%) ${maxP(datum)}</span> `)
      + `<td>${h.min} ${h.a?.toFixed(0)} ${h.max} ${h.c} ${h.q}
  <br/>
  <a
    href="https://data.idle-pixel.com/market/?item=${datum.market_item_name}&range=7d"
    target="_blank"
    title="${h.h?.join('&#10;')}"
  >${((new Date() - h.d) / 1000 / 60 / 60).toFixed(1)} hours ago</a>
</td>
<td>${IdlePixelPlus.getVar(datum.market_item_name)}, ${(p(datum) - minP(datum)) * IdlePixelPlus.getVar(datum.market_item_name)}, ${p(datum) * IdlePixelPlus.getVar(datum.market_item_name)}</td>`;
    return chunks.join('<td');
  };

  async function getHistory() {
    const response = await fetch('https://data.idle-pixel.com/market/api/getMarketHistory.php?item=all&range=2d');
    if(!response.ok)
      return console.info('getHistory failed', new Date(), setTimeout(getHistory, (1 + Math.random()) * 60 * 60 * 1000));
    const all = await response.json();
    MarketAutoPlugin.history = all.history.reduce((
      r, { item, amount, price, datetime }, i, arr,
      it = r[item] ?? {},
      q = (it.q ?? 0) + amount,
      t = (it.t ?? 0) + amount * price,
      min = Math.min(it.min ?? Infinity, price),
      max = Math.max(it.max ?? 0, price),
      a = t / q,
      c = (it.c ?? 0) + 1,
      _d = new Date(datetime),
      d = it.d > _d ? it.d : _d,
    ) => (r[item] = { min, max, t, q, a, c, d, h: [...(it.h ?? []), `${_d.toLocaleString('sv').substr(5, 11)}: ${price} x ${amount}`].slice(-5) }, r), {});

    return console.info('getHistory reload', new Date(), setTimeout(getHistory, (1 + Math.random()) * 60 * 60 * 1000));
  }

  class MarketAutoPlugin extends IdlePixelPlusPlugin {
    constructor() {
      super('market_auto_buyer', {
        about: {
          name: GM_info.script.name + ' (ver: ' + GM_info.script.version + ')',
          version: GM_info.script.version,
          author: GM_info.script.author,
          description: GM_info.script.description,
        },
        config: [
        ],
      });
    }

    static history = {};

    onLogin() {
      Market.clicks_browse_player_market_button();

      $('head').append(CSS);

        IdlePixelPlus.plugins.market.filterTable = function(category) {
            if(category) {
                this.lastCategoryFilter = category;
            } else {
                category = this.lastCategoryFilter || 'all';
            }

            $('#market-category-filters button.active').removeClass('active');
            $(`#market-category-filters button[data-category="${category}"]`).addClass('active');

            if(category === 'all') {
                $('#market-table tbody tr.hover').addClass('filtered');
            } else {
                $('#market-table tbody tr.hover').removeClass('filtered');
                $(`#market-table tbody tr.hover.${category}`).addClass('filtered');
            }
        };

      setInterval(() => $('#auto-smelt').val() && IdlePixelPlus.plugins.slapchop.quickSmelt($('#auto-smelt').val()), 13348);

      document.getElementById("chat-area").style.height = '0px';
      $('#notification-furnace').before(`<select id="auto-smelt">${['', 'copper', 'iron', 'silver', 'gold'].map(_ => `<option${var_furnace_ore_type === _ ? ' selected="selected"' : ''}>${_}</option>`).join('')}</select>`);
      $("#notification-furnace-label").before(`<img id="notification-furnace-ore-image" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/${var_furnace_ore_type === 'copper' ? 'bronze' : var_furnace_ore_type}_bar.png" class="w20" title="${var_furnace_ore_type}_bar">`);
      //$("notification-furnace-ore-image").hide();

      $('#notification-combat').before('<input id="auto-fight" type="checkbox" />');
      function autofight() {
        if($('#auto-fight').is(':checked')) {
          if(var_fighting_area === 'none') {
            if(var_weapon == 'wooden_bow')
              setTimeout(() => IdlePixelPlus.plugins.slapchop.quickFight('field'), 1000 + Math.random() * 1000);
            else
              setTimeout(() => websocket.send('PRESET_LOAD=1~1'), 2000 + Math.random() * 1000);
          }

          if(var_fighting_area === 'field') {
            if(var_reflect_cooldown == 0 && var_mana > 0)
              Magic.cast_spell(null, 'reflect');
            if((var_mana == 0 || var_hp <= 5) && var_weapon == 'wooden_bow')
              setTimeout(() => websocket.send('PRESET_LOAD=2~1'), 1000 + Math.random() * 1000);
          }
        }
        setTimeout(autofight, 1000 + Math.random() * 1000);
      }
      autofight();
    }

    load() {
      Modals.toggle('modal-market-select-item');

      const rate = 1.15;

      function qtyToBuy(item) {
        const name = item.market_item_name;
        return Math.min(item.market_item_amount, (qty[name] ?? 0) - (window[`var_${name}`] ?? 0));
      }

      async function tryBuy() {
        if(websocket.connected_socket.OPEN !== websocket.connected_socket.readyState)
          return document.location.reload();

        const response = await fetch('/market/browse/all/');
        if(!response.ok)
          return console.info('nok', new Date(), setTimeout(tryBuy, (3 + Math.random() * 2) * 60 * 1000));
        const all = await response.json();
        const [buyable] = all.filter(_ => qtyToBuy(_) > 0 && qtyToBuy(_) * p(_) <= window.var_coins && minP(_) >= p(_) / rate).sort((l, r) => p(l) - p(r));
        if(!buyable)
          return console.info('no buyable', new Date(), setTimeout(tryBuy, (3 + Math.random() * 2) * 60 * 1000));
        websocket.send(`MARKET_PURCHASE=${buyable.market_id}~${qtyToBuy(buyable)}`);
        console.log(buyable, new Date(), setTimeout(tryBuy, (1 + Math.random() * 1) * 60 * 1000));
        window.localStorage.setItem('roadster-buying', JSON.stringify([...JSON.parse(window.localStorage.getItem('roadster-buying') ?? '[]'), { ...buyable, qty: qtyToBuy(buyable) }]));
      }

      tryBuy();
      getHistory();
    }

    onMessageReceived(message) {
      switch(message.split('=')[0]) {
        case 'MARKET_BROWSE_ITEM_TRADABLES_MODAL':
          this.load();
          this.load = function() {};
          break;
        case 'REFRESH_MARKET_SLOT_DATA':
          break;
        case 'SET_ITEMS':
          break;
        case 'OPEN_DIALOGUE':
          break;
        default:
          break;
      }
    }

    onVariableSet(key, valueBefore, valueAfter) {
      switch(key) {
        case 'furnace_ore_type':
          $("notification-furnace-ore-image").src = `https://idlepixel.s3.us-east-2.amazonaws.com/images/${valueAfter}_bar.png`;
          $("notification-furnace-ore-image").title = `${valueAfter}_bar`;
          break;
      }
    }
  }

  IdlePixelPlus.registerPlugin(new MarketAutoPlugin());
})();
