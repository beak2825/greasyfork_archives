// ==UserScript==
// @name         GGn clan override
// @namespace    https://greasyfork.org/
// @version      0.4.0
// @description  Overrides the clan trophy
// @author       lucianjp
// @match        https://gazellegames.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/392996/GGn%20clan%20override.user.js
// @updateURL https://update.greasyfork.org/scripts/392996/GGn%20clan%20override.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const option = GM_getValue('clanwaroverride') || 'auto';
  const option_lc = option.toLowerCase();

  document.querySelectorAll('.clan_trophy img, .username_badges img').forEach(override);
  addObserver(override).observe(document, {childList: true, subtree: true});

  if (window.location.pathname == '/user.php' && /action=edit/.test(window.location.search)) {
    parameter(document.querySelector('#site_style_tr'));
    addObserver(parameter).observe(document, {childList: true, subtree: true});
  }

  function parameter($node){
    if($node && $node.tagName === "TR" && $node.id === 'site_style_tr'){
      const $tr = document.createElement('tr');
      $tr.innerHTML = '<td class="label"><strong>Clan War Override</strong></td>';
      let $el = $tr.appendChild(document.createElement('td'));
      $el = $el.appendChild(document.createElement('select'));
      $el.id = 'clanwar';

      ['Auto', 'Earth', 'Wind', 'Fire', 'Water', 'None', 'Remove'].forEach(function(item) {
        var $option = $el.appendChild(document.createElement('option'));
        $option.value = $option.textContent = item;
        if(item === option) {
          $option.selected = true;
        }});
      $node.parentNode.insertBefore($tr, $node.nextSibling);

      ready(function(){
        document.querySelector('#save').addEventListener('click', function(event){
          const $option = $tr.querySelector('#clanwar');
          GM_setValue('clanwaroverride', $option.options[$option.selectedIndex].text);
        });
      });
    }
  }

  function override($node){
    if($node && $node.tagName === "IMG"){
      if($node.matches('.clan_trophy img')){
        switch(option) {
          case 'Fire':
          case 'Earth':
          case 'Water':
            $node.title = `Clan ${option} is #1!`;
            $node.src = `static/common/clans/${option_lc}_trophy.png`;
            break;
          case 'Wind':
            $node.title = 'Clan War Sucks!';
            $node.src = 'static/common/clans/wind_trophy.png';
            break;
          case 'None':
          case 'Remove':
            $node.remove();
            break;
        }
      } else if($node.matches('.username_badges img') && $node.src.includes('static/common/clans/') && option !== 'Auto') {
        if(option === 'Remove'){
          $node.remove();
        }
        else if($node.src.includes(option_lc)) {
          $node.src = `static/common/clans/${option_lc}_trophy_icon.png`;
        } else {
          $node.src = $node.src.replace('_trophy', '');
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
            callback($node);
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