// ==UserScript==
// @name         Resource Bar Helper
// @namespace    https://politicsandwar.com/nation/id=98616
// @description  Display targets and offsets for warchests
// @version      1.0
// @author       Talus
// @license      GPL-3.0-or-later
// @match        https://politicsandwar.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/401046/Resource%20Bar%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/401046/Resource%20Bar%20Helper.meta.js
// ==/UserScript==

(function() {
  var $ = window.jQuery;

  $("#rssBar").hide();
  $("#rssBar").after($("<div/>", {id: "newRssBar"}))

  const fields = ["cities", "credits", "days of raws", "coal/day", "oil/day", "lead/day", "iron/day", "bauxite/day", "uranium/city", "food/city", "gas/city", "munitions/city", "steel/city", "aluminum/city", "money/city"];

  const configFields = fields.reduce((obj, field) => {
    obj[field] = { label: field, type: 'number', cols: 5 };
    return obj;
  }, {});

  const config = new GM_config({
    id: 'resourceBarHelper',
    title: 'Resource Bar Helper Configuration',
    fields: configFields,
    events: {
      save: function() {
        fields.forEach(field => GM_setValue(field, config.get(field)));
        updateResourceBar();
      }
    }
  });

  function updateResourceBar() {
    const variables = fields.reduce((obj, field) => {
      var varName = field.replace(/[^a-zA-Z0-9]/g, '_');
      obj[varName] = GM_getValue(field, 0);
      return obj;
    }, {});

    var MARKET_URL = 'https://politicsandwar.com/index.php?id=90&display=world&resource1=RESOURCE1&buysell=&ob=price&od=DEF&maximum=100&minimum=0&search=Go'
    var wc = [
      {
          "target": MARKET_URL.replace('RESOURCE1','credits'),
          "icon": '<img src="https://politicsandwar.com/img/icons/16/point_gold.png" alt="credits">',
          "required": Number(variables.credits)
      },
      {
          "target": MARKET_URL.replace('RESOURCE1','coal'),
          "icon": '<img src="https://politicsandwar.com/img/resources/coal.png" alt="coal">',
          "required": Number(variables.days_of_raws * variables.coal_day)
      },
      {
          "target": MARKET_URL.replace('RESOURCE1','oil'),
          "icon": '<img src="https://politicsandwar.com/img/resources/oil.png" alt="oil">',
          "required": Number(variables.days_of_raws * variables.oil_day)
      },
      {
          "target": MARKET_URL.replace('RESOURCE1','uranium'),
          "icon": '<img src="https://politicsandwar.com/img/resources/uranium.png" alt="uranium">',
          "required": Number(variables.cities * variables.uranium_city)
      },
      {
          "target": MARKET_URL.replace('RESOURCE1','lead'),
          "icon": '<img src="https://politicsandwar.com/img/resources/lead.png" alt="lead">',
          "required": Number(variables.days_of_raws * variables.lead_day)
      },
      {
          "target": MARKET_URL.replace('RESOURCE1','iron'),
          "icon": '<img src="https://politicsandwar.com/img/resources/iron.png" alt="iron">',
          "required": Number(variables.days_of_raws * variables.iron_day)
      },
      {
          "target": MARKET_URL.replace('RESOURCE1','bauxite'),
          "icon": '<img src="https://politicsandwar.com/img/resources/bauxite.png" alt="bauxite">',
          "required": Number(variables.days_of_raws * variables.bauxite_day)
      },
      {
          "target": MARKET_URL.replace('RESOURCE1','gasoline'),
          "icon": '<img src="https://politicsandwar.com/img/resources/gasoline.png" alt="gasoline">',
          "required": Number(variables.cities * variables.gas_city)
      },
      {
          "target": MARKET_URL.replace('RESOURCE1','munitions'),
          "icon": '<img src="https://politicsandwar.com/img/resources/munitions.png" alt="munitions">',
          "required": Number(variables.cities * variables.munitions_city)
      },
      {
          "target": MARKET_URL.replace('RESOURCE1','steel'),
          "icon": '<img src="https://politicsandwar.com/img/resources/steel.png" alt="steel">',
          "required": Number(variables.cities * variables.steel_city)
      },
      {
          "target": MARKET_URL.replace('RESOURCE1','aluminum'),
          "icon": '<img src="https://politicsandwar.com/img/resources/aluminum.png" alt="aluminum">',
          "required": Number(variables.cities * variables.aluminum_city)
      },
      {
          "target": MARKET_URL.replace('RESOURCE1','food'),
          "icon": '<img src="https://politicsandwar.com/img/icons/16/steak_meat.png" alt="food">',
          "required": Number(variables.cities * variables.food_city)
      },
      {
          "target": 'https://politicsandwar.com/nation/revenue/',
          "icon": '<b style="color: #28d020;" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Money">$</b>',
          "required": Number(variables.cities * variables.money_city)
      }
    ]

    var rssCount = document.querySelector("#rssBar > div > div > span")
      .textContent
      .trim()
      .split(/\s+/)
      .filter(function(val){return val != '$'})
      .map(function(x){return Number(x.replace(/,/g,''))});

    var html = `
      <div class="container infobarcontainer notranslate hidden-xs hidden-sm" id="rssBarNew">
        <div class="row" style="z-index: 2;">
          <div class="informationbar col-xs-12" style="max-width:100vw;">
            <table class="col-xs-12">
              <tr>
                <td>
                  <table>
                    <tr>
                      <td>Actual:</td>
                    </tr>
                    <tr>
                      <td>Target:</td>
                    </tr>
                    <tr>
                      <td>Difference:</td>
                    </tr>
                  </table>
                </td>
    `;
    for (var i=0; i<wc.length; i++) {
        var difference = rssCount[i] - wc[i].required;
        var color = difference >= 0 ? '#FFF' : '#000';
        html += `
          <td>
            <table>
              <tr>
                <td rowspan="3" style="vertical-align:text-top">
                  <a href="${wc[i].target}">${wc[i].icon}</a>
                </td>
                <td style="text-align:right">
                  ${rssCount[i].toLocaleString()}
                </td>
              </tr>
              <tr>
                <td style="text-align:right">
                  ${wc[i].required.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td style="text-align:right;color:${color}">
                  ${difference.toLocaleString()}
                </td>
              </tr>
            </table>
          </td>
        `;
    }
    html += '</tr></table>'

    $("#newRssBar").replaceWith(html);
  }

  // Register a menu command to open the configuration interface
  GM_registerMenuCommand('Requirements', config.open.bind(config));

  updateResourceBar();
})();