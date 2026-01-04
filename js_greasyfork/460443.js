// ==UserScript==
// @name         GOG Language BBCode quick copy
// @namespace    https://greasyfork.org/
// @version      0.02
// @description  Allows you to copy the gog languages in a BBCode fashion
// @author       byJ
// @license      MIT
// @match        https://www.gog.com/en/game/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/460443/GOG%20Language%20BBCode%20quick%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/460443/GOG%20Language%20BBCode%20quick%20copy.meta.js
// ==/UserScript==



(function() {
  'use strict';

  if(window.location.hostname === 'www.gog.com'){
    gogButton();
  }

  function gogButton(){
    const $btn = document.createElement('a');
    const text = 'Copy BBCode';
    $btn.classList.add('btnv6_blue_hoverfade', 'btn_small');
    const $text = $btn.appendChild(document.createElement('span'));
    $text.innerHTML = `${text}<img src="https://ptpimg.me/sx226x.png">`;
    $btn.addEventListener('click', function(){
      GM_setClipboard(parseGOGLanguage(document), 'text');
      $text.childNodes[0].nodeValue = 'copied';
      setTimeout(function(){$text.childNodes[0].nodeValue = text; }, 3000);
    });

    const $container = document.querySelector('div.details.table.table--without-border.ng-scope')
    const $before = document.querySelectorAll('.details__separator')[1]
    $container.insertBefore($btn, $before);
  }

  function parseGOGLanguage($document){

    let languages_div_list = $document.querySelectorAll('div.details__content.table__row-content.details__languages-row');

    if(!languages_div_list) return;

    let languages = {
        'Audio': [],
        'Text': [],
    };
    languages_div_list.forEach(function (element) {
        let language = element.querySelector('div').textContent.trim();
        let audio = element.querySelectorAll('use')[0].getAttribute('xlink:href');
        let text = element.querySelectorAll('use')[1].getAttribute('xlink:href');
        if (audio === '#check_tick'){ languages['Audio'].push(language) }
        if (text === '#check_tick'){ languages['Text'].push(language) }
    })

    let output = ''
    let keys = Object.keys(languages);

    for(var i = 0; i < keys.length; i++){
      let key = keys[i];
      if (languages[key].length === 0){
          continue
      }

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
      }else {
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