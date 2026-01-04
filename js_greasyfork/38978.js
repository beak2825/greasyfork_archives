// ==UserScript==
// @name         Sheetamajig
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Do sheety things
// @author       Gnomez
// @match        *://*.talibri.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38978/Sheetamajig.user.js
// @updateURL https://update.greasyfork.org/scripts/38978/Sheetamajig.meta.js
// ==/UserScript==

(function () {
  'use strict';
  
  const API_KEY = 'AIzaSyAPe1UDIOa6eLh_GDyB7YJhnQad31cKjp4';
  
  const TOKEN_SHEET_ID = '1pyfce1tNRRYhhmddW9oNae4FFTISmHSW9L26lHIeBx8';
  const TOKENS_PER_DAY = 30;
  const TOKEN_INTERVAL = 48 * 60;
  
  let authToken;
  let authTokenExpiry;
  let fetchingAuthToken = false;
  let pushPending = false;
  
  function fetchAuthToken() {
    if (fetchingAuthToken) {
      return;
    }
    
    fetchingAuthToken = true;
    
    $.get({
      url: `https://sheets.googleapis.com/v4/spreadsheets/${TOKEN_SHEET_ID}/values/Sheet1!A:A`,
      data: {
        majorDimension: 'ROWS',
        key: API_KEY
      },
      dataType: 'json'
    }).done(findTokenRow).fail(abort);
    
    function findTokenRow(data) {
      let times = data.values;
      
      let now = Math.floor(Date.now() / 1000);
      let targetRow = 0;
      while (parseInt(times[targetRow]) < now) {
        targetRow++;
      }
      
      let targetCell = Math.floor((now - parseInt(times[targetRow-1])) / TOKEN_INTERVAL) + 1;
      
      $.get({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${TOKEN_SHEET_ID}/values/Sheet1!${getColumnName(targetCell)}${targetRow}:${getColumnName(targetCell)}${targetRow}`,
        data: {
          majorDimension: 'ROWS',
          key: API_KEY
        },
        dataType: 'json'
      }).done(getAuthToken).fail(abort);
    }
    
    function getAuthToken(data) {
      $.post({
        url: 'https://www.googleapis.com/oauth2/v4/token',
        data: {
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: data.values[0][0]
        }
      }).done(function(data) { setAuthToken(data); }).fail(abort);
    }
    
    function abort(xhr) {
      fetchingAuthToken = false;
      logError(xhr);
    }
  }
  
  function setAuthToken(token) {
    authToken = token;
    authTokenExpiry = Date.now() + 1000 * authToken.expires_in;
    fetchingAuthToken = false;
    if (pushPending) {
      pushInventory();
      pushPending = false;
    }
  }
  
  
  
  const SPREADSHEET_ID = '163nfEMOULxALHB5ZJX3p7fYPW7mi6J1criyjh6ZrcLU';
  const SHEET_NAME = 'PasteTheOtherInventory';
  const LAST_UPDATE_KEY = 'sheety-update-time';
  const AUTO_UPDATE_INTERVAL = 10 * 60 * 1000;
  
  function pushInventory() {
    let sheetTopRow;
    let inventory;
    let baseColumn;
    
    $.get({
      url: `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!1:1`,
      data: {
        majorDimension: 'COLUMNS',
        key: API_KEY
      },
      dataType: 'json'
    }).done(fetchInventory).fail(logError);
    
    function fetchInventory(data) {
      sheetTopRow = data.values;
      
      $.get({
        url: '/inventory',
        data: {
        },
        dataType: 'text'
      }).done(writeInventory).fail(logError);
    }
    
    function writeInventory(data) {
      inventory = scrapeInventory(data);
      
      baseColumn = 0;
      if (sheetTopRow !== undefined) { // empty sheet gives undefined
        for (; baseColumn < sheetTopRow.length; baseColumn+=3) {
          if (sheetTopRow[baseColumn][0] === inventory[0][0]) {
            break;
          }
        }
      }
      
      $.ajax({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!${getColumnName(baseColumn)}:${getColumnName(baseColumn+2)}?valueInputOption=USER_ENTERED`,
        data: JSON.stringify({
          majorDimension: 'COLUMNS',
          values: inventory
        }),
        processData: false,
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json',
        headers: {
          Authorization: `Bearer ${authToken.access_token}`
        },
        method: 'PUT'
      }).done(clearExcess).fail(logError);
    }
    
    function clearExcess(data) {
      $.post({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!${getColumnName(baseColumn)}${inventory[0].length+1}:${getColumnName(baseColumn+2)}:clear`,
        data: {
        },
        dataType: 'json',
        headers: {
          Authorization: `Bearer ${authToken.access_token}`
        }
      }).done(updateStoredTime).fail(logError);
    }
    
    function updateStoredTime() {
      localStorage.setItem(LAST_UPDATE_KEY, Date.now());
    }
  }
  
  function logError(xhr) {
    console.error(xhr);
  }

  function init() {
    attachUi();
    document.addEventListener('turbolinks:load', attachUi);
    window.setInterval(tryAutoPush, AUTO_UPDATE_INTERVAL);
  }

  function tryPush() {
    if (!authToken || Date.now() > authTokenExpiry - 60 * 1000) {
      pushPending = true;
      fetchAuthToken();
    }
    else {
      pushInventory();
    }
  }
  
  function tryAutoPush() {
    let lastUpdateTime = parseInt(localStorage.getItem(LAST_UPDATE_KEY));
    if (isNaN(lastUpdateTime) || Date.now() > lastUpdateTime + AUTO_UPDATE_INTERVAL*0.9) {
      tryPush();
    }
  }

  let navItem = document.createElement('li');
  navItem.className = 'dropdown';
  navItem.id = 'sheety';
  navItem.innerHTML = `
    <a href='#' role='button' data-toggle='dropdown'>Sheety</a>
    <ul class='dropdown-menu'>
      <li class='text-center'>
        <button class='btn btn-default'>Push Inventory</button>
      </li>
    </ul>
  `;
  
  let statusBadge = navItem.children[0].children[0];
  let pushButton = navItem.children[1].children[0].children[0];
  
  pushButton.addEventListener('click', function() {
    tryPush();
  });
  
  function scrapeInventory(html) {
    let out = [[document.querySelector('.fa-user-circle').parentNode.textContent.trim()],[`${Math.floor(Date.now() / 1000)}`],['']];
    let lines = html.match(/<td class="(name|quantity|type)[^"]*"([^>"]*"[^"]*")*>[^<]*(?=<\/td>)/g);
    for (let i = 0; i < lines.length; i += 3) {
      out[0].push(lines[i].substring(lines[i].lastIndexOf('>') + 1));
      out[1].push(lines[i+1].substring(lines[i+1].lastIndexOf('>') + 1));
      out[2].push(lines[i+2].substring(lines[i+2].lastIndexOf('>') + 1));
    }
    return out;
  }
  
  function getColumnName(index) {
    let base = 'A'.charCodeAt(0);
    if (index < 26) {
      return String.fromCharCode(base + index);
    }
    else {
      let firstCharIndex = Math.floor(index / 26) - 1;
      let secondCharIndex = index % 26;
      return `${String.fromCharCode(base + firstCharIndex)}${String.fromCharCode(base + secondCharIndex)}`;
    }
  }
  
  let attachUi = function() {
    let navBar = document.querySelector('ul.nav.navbar-nav.navbar-right');
    if (!navBar) {
      window.setTimeout(attachUi, 1000);
      return;
    }
    
    let oldUi = navBar.querySelector('#sheety');
    if (oldUi !== navItem) {
      if (oldUi) {
        navBar.removeChild(oldUi);
      }
      navBar.insertBefore(navItem, navBar.firstChild);
    }
  };
  
  init();
})();