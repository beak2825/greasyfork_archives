// ==UserScript==
// @name         GGn snatched filter
// @namespace    https://greasyfork.org/
// @version      0.2
// @description  Adds a filter for snatched torrent in torrent browse
// @author       lucianjp
// @match        https://gazellegames.net/torrents.php*
// @exclude      https://gazellegames.net/torrents.php*id=*
// @exclude      https://gazellegames.net/torrents.php*action=basic*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/393334/GGn%20snatched%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/393334/GGn%20snatched%20filter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const snatchedGroup = GM_getValue('group'); // no change or colorize or hide
  const snatchedTorrent = GM_getValue('torrent') || false; // no change or hide

  if(!parameter(document.querySelector('#torrentbrowse div.filter_torrents.advanced div+table'))){
    addObserver(parameter).observe(document, {childList: true, subtree: true});
  }

  document.querySelectorAll('tr[class*="groupid_"][class*="edition_"] a>#color_seeding').forEach($el => filter($el));
  addObserver(filter).observe(document, {childList: true, subtree: true});

  function parameter($node){
    if($node && $node.tagName === "TABLE" && $node.className === '' && $node.matches('#torrentbrowse div.filter_torrents.advanced>div>table')){
      const $tr = $node.appendChild(document.createElement('tr'));
      var $element = $tr.appendChild(document.createElement('td'));
      $element.className = 'label';
      $element.innerHTML = 'Snatched:';
      const $td = $tr.appendChild(document.createElement('td'));
      $td.colspan = 7;
      const $group = $td.appendChild(document.createElement('select'));
      $group.id = 'snatchedgroup';

      ['Group', 'Colorize', 'Hide'].forEach(function(item) {
        var $option = $group.appendChild(document.createElement('option'));
        $option.value = $option.textContent = item;
        if(item === snatchedGroup) {
          $option.selected = true;
        }});

      const $torrent = $td.appendChild(document.createElement('input'));
      $torrent.type = 'checkbox';
      $torrent.id = 'snatchedtorrent';
      $torrent.name = 'snatchedtorrent';
      $torrent.checked = snatchedTorrent;

      $element = $td.appendChild(document.createElement('label'));
      $element.htmlFor = 'snatchedtorrent';
      $element.innerHTML = 'Hide snatched torrent?';

      ready(function(){
        document.querySelectorAll('input[name="cleardefault"], input[value="Reset"]').forEach($el => {
          $el.addEventListener('click', function(event){
            GM_deleteValue('group');
            GM_deleteValue('torrent');
          });
        });

        document.querySelector('input[value="Filter Torrents"]').addEventListener('click', function(event){
          GM_setValue('group', $group.options[$group.selectedIndex].text);
          GM_setValue('torrent', $torrent.checked);
        });
      });

      return true;
    }
    return false;
  }

  function filter($node) {
    if($node && $node.tagName === "SPAN" && $node.id === 'color_seeding'){
      const $tr = $node.closest('tr');
      const groupid = $tr.className.match(/groupid_\d+/)[0];
      if(snatchedTorrent){
        $tr.classList.add('hidden');

        if(!document.querySelector(`#torrent_table tr.${$tr.className.match(/edition_\d+_\d+/)[0]}:not(.hidden)`)){
          const editions = document.querySelectorAll(`#torrent_table tr.${groupid}:not([class*="edition_"])`);
          editions[$tr.className.match(/edition_\d+_(\d+)/)[1]-1].classList.add('hidden');
        }
      }

      const $group = document.querySelector(`#torrent_table tr.group.${groupid.replace('id','')}`);
      const lines = document.querySelectorAll(`#torrent_table tr.group_torrent.${groupid}`);
      if(Array.from(lines).filter($el => $el.matches('[class*="edition_"]') && !$el.querySelector('#color_seeding')).length === 0){
        if(snatchedGroup === 'Colorize'){
          const name = $group.querySelector('#groupname>a');
          name.innerHTML = `<span id="color_seeding">${name.innerHTML}</span>`;
        } else if(snatchedGroup === 'Hide'){
          $group.classList.add('hidden'); //'remove();
          lines.forEach($el => $el.classList.add('hidden'));
        }
      }
    }
  }

  function addObserver(callback){
    const observer = new MutationObserver(function(mutations) {
      for(var i = mutations.length-1; i>=0; i--){
        const mutation = mutations[i];
        if(mutation.addedNodes.length > 0){
          for(var j = mutation.addedNodes.length-1; j>=0; j--){
            const $node = mutation.addedNodes[j];
            if(callback($node)){
              observer.disconnect();
            };
          }
        }
      }
    });

    ready(function(){
      observer.disconnect();
    });

    return observer;
  }

  function ready(callback){
    if (document.readyState!='loading') callback();
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    else {
      document.attachEvent('onreadystatechange', function(){
        if (document.readyState=='complete') callback();
      });
    }
  }
})();