// ==UserScript==
// @name         GazelleGames GPH Item Set Info
// @version      0.2.3
// @description  Calculates which item set to use by the amount of GPH you currently have.
// @author       Piitchyy
// @namespace    https://github.com/No-Death/GGn-Scripts
// @match        https://gazellegames.net/user.php?action=equipment
// @license      MIT
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/459400/GazelleGames%20GPH%20Item%20Set%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/459400/GazelleGames%20GPH%20Item%20Set%20Info.meta.js
// ==/UserScript==

(async function () {
  'use strict';
  const lastFetch = await GM.getValue('lastFetch');
  const myUserID = new URLSearchParams(
    document.body.querySelector('#nav_userinfo a.username').search
  ).get('id');
  let apiKey = await GM.getValue('apiKey');

  // Check if the API key exists and if its been less than 2 seconds since last call
  if (apiKey && lastFetch && Date.now() - lastFetch < 2000) {
    console.log('Most likely Ratelimited');
    return;
  }

  // Get the API key from the user
  if (!apiKey) {
    apiKey = prompt('Enter your API key with the "USER" permission').trim();
    await GM.setValue('apiKey', apiKey);
  }

  // Start the API request
  const endpoint = `https://gazellegames.net/api.php?request=user&id=${myUserID}`;
  const options = {
    method: 'GET',
    mode: 'same-origin',
    credentials: 'omit',
    redirect: 'error',
    referrerPolicy: 'no-referrer',
    headers: {
      'X-API-Key': apiKey,
    },
  };
  const response = await fetch(endpoint, options);
  // If the API returns 401, delete API key
  if (response.status === 401) {
    await GM.deleteValue('apiKey');
    alert(
      `You entered the wrong API key for 'GazelleGames GPH Item Set Info' \nMake sure it uses the "USER" permissions.`
    );
    // API was correct, continue.
  } else if (response.status === 200) {
    const data = await response.json();
    const onIrc = data.response.stats.onIRC;
    const gph = onIrc
      ? data.response.community.hourlyGold - 13.5
      : data.response.community.hourlyGold;
    const buff = data.response.buffs.TorrentsGold;
    const baseGph = gph / buff;
    const sidebar = document.getElementById('items_navigation');
    let newhtml = '';
    sidebar.innerHTML += '<br><h3>GPH Information</h3>';
    newhtml += `<tr><td>Base GPH:</td> <td>${Math.trunc(baseGph)}</td></tr>`;
    newhtml += `<tr><td>Buff GPH:</td> <td>${Math.trunc(gph)}</td></tr>`;
    if (baseGph >= 980) {
      newhtml += `<tr><td>Set to use:</td> <td><a href="https://gazellegames.net/shop.php?search=empowered%20amethyst%20fortune&item_type=%5B%5D&cost_type=all&cost_amount=&order_by=dateadded&order_way=desc&category=All">Amethyst Set!</a></td></tr>`;
    } else if (baseGph >= 180) {
      newhtml += `<tr><td>Set to use:</td> <td><a href="https://gazellegames.net/shop.php?search=empowered%20jade%20fortune&item_type=%5B%5D&cost_type=all&cost_amount=&order_by=dateadded&order_way=desc&category=All">Jade Set!</a></td></tr>`;
    } else if (baseGph >= 20) {
      newhtml += `<tr><td>Set to use:</td> <td><a href="https://gazellegames.net/shop.php?search=empowered%20quartz%20fortune&item_type=%5B%5D&cost_type=all&cost_amount=&order_by=dateadded&order_way=desc&category=All">Quartz Set!</a></td></tr>`;
    } else {
      newhtml += `<tr><td>Set to use:</td> <td>No set needed!</td></tr>`;
    }
    newhtml += `<tr><td><a href="https://gazellegames.net/shop.php?ItemID=2582">Baguette?:</a></td> <td>${
      baseGph >= 300 ? 'Yes' : 'No'
    }</td></tr>`;
    sidebar.innerHTML +=
      `<table id="ggn_gph_information">` + newhtml + `</table>`;
    //Something went REALLY wrong
  } else {
    console.log('Something went wrong');
  }
  // Set the time when the request was made
  await GM.setValue('lastFetch', Date.now());
})();
