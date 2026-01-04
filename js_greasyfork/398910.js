// ==UserScript==
// @name         GGn Steam Language BBCode quick copy
// @namespace    https://greasyfork.org/
// @version      0.4
// @description  Allows you to copy the steam languages in a BBCode fashion
// @author       lucianjp
// @match        https://gazellegames.net/torrents.php?action=editgroup*
// @match        https://store.steampowered.com/app/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/398910/GGn%20Steam%20Language%20BBCode%20quick%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/398910/GGn%20Steam%20Language%20BBCode%20quick%20copy.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if(window.location.hostname == 'store.steampowered.com'){
    steamButton();
  }
  else if(window.location.hostname == 'gazellegames.net'){
    if (window.location.pathname == '/torrents.php') {
      if(/action=editgroup/.test(window.location.search)){
        ggnButton();
      }
    }
  }

  function steamButton(){
    const $btn = document.createElement('a');
    const text = 'Copy BBCode';
    $btn.classList.add('btnv6_blue_hoverfade', 'btn_small');
    const $text = $btn.appendChild(document.createElement('span'));
    $text.innerHTML = `${text}<img src="https://ptpimg.me/sx226x.png">`;
    $btn.addEventListener('click', function(){
      GM_setClipboard(parseSteamLanguage(document), 'text');
      $text.childNodes[0].nodeValue = 'copied';
      setTimeout(function(){$text.childNodes[0].nodeValue = text; }, 3000);
    });

    const $container = document.querySelector('table.game_language_options').closest('.block').querySelector('.block_title') || document.querySelector('#LanguagesHeader');
    $container.style = 'display: flex;justify-content: space-between;align-items: center;';
    $container.appendChild($btn);
  }

  function ggnButton(){
    const $steamuri = document.querySelector('#steamuri');
    const $quickcopy = document.createElement('button');
    $quickcopy.innerHTML = 'BBCode Languages';
    $quickcopy.addEventListener('click', async function (event){
      event.preventDefault();
      event.stopImmediatePropagation();

      if(!$steamuri.value) return;

      const bbcode = await getSteamLanguages($steamuri.value);
      if(bbcode) {
        GM_setClipboard(await getSteamLanguages($steamuri.value), 'text');
        noty({
          text: 'Steam languages copied to clipboard',
          timeout: 3500
        });
      }
    });

    $steamuri.parentNode.insertBefore($quickcopy, $steamuri.nextSibling);
  }

  function getSteamLanguages(url){
    return new Promise((resolve, reject) => {
      if(url){
        GM_xmlhttpRequest({
          url: url,
          method: 'GET',
          onload: function(response){
            if (response.readyState == 4 && response.status == 200) {
              const $document = new DOMParser().parseFromString(response.responseText, "text/html");
              resolve(parseSteamLanguage($document));
            }
          }
        });
      } else {
        reject();
      }
    });
  }

  function parseSteamLanguage($document){
    let table = $document.querySelector('table.game_language_options');

    if(!table) return;

    let languages = {};

    for (var r = 0; r < table.rows.length; r++) {
      for (var c = 0; c < table.rows[r].cells.length; c++) {
        if(table.rows[r].cells[c].textContent.trim() === '✔'){
          let header = table.rows[0].cells[c].textContent.trim();
          if(!languages[header]) {
            languages[header] = [];
          }
          languages[header].push(table.rows[r].cells[0].textContent.trim());
        }
      }
    }
    let output = ''
    let keys = Object.keys(languages);

    for(var i = 0; i < keys.length; i++){
      let key = keys[i];
      let keygroup = [key];

      if(i < keys.length - 1){
        for(var iNext = i+1; iNext < keys.length; iNext){
          if(areSame(languages[keys[i]], languages[keys[iNext]])) {
            keygroup.push(keys[iNext]);
            keys.splice(iNext,1);
          } else {
            iNext++;
          }
        }
      }

      const multi = languages[key].length > 1;

      if(keys.length === 1){
        output += `[b]Language${multi ? "s": ""}[/b]: `;
      } else {
        output += `[b]${keygroup.join(' and ')} Language${multi ? "s": ""}[/b]: `;
      }

      if(multi){
        let lastItem = languages[key].pop();
        output += languages[key].join(', ');
        output += ` and ${lastItem}`;
      } else {
        output += languages[key];
      }
      output += '\n';
    }
    return output;
  }

  function areSame(array1, array2){
    return array1.length === array2.length && array1.sort().every((value, index) => value === array2.sort()[index])
  }
})();