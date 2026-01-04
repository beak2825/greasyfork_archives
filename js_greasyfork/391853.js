// ==UserScript==
// @name         GGn item load optimization
// @namespace    https://greasyfork.org/
// @version      0.8.0
// @description  Helps speed up loading of window with items GGn
// @author       lucianjp
// @run-at       document-start
// @match        https://gazellegames.net/user.php?action=trade*
// @match        https://gazellegames.net/user.php?action=crafting
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391853/GGn%20item%20load%20optimization.user.js
// @updateURL https://update.greasyfork.org/scripts/391853/GGn%20item%20load%20optimization.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var optimizedCount = 0;

  const containerObserver = addObserver(function($node){
    if($node.nodeType === 1 && $node.tagName === "UL" && ($node.id === "items-wrapper" || $node.className.indexOf('items-wrapper') !== -1)){
      group($node);
    }
  }).observe(document, {childList: true, subtree: true});

  document.querySelectorAll('ul#items-wrapper, ul.items-wrapper').forEach($container => group($container));

  ready(() =>{
    console.log(`[GGn item load optimization] ${optimizedCount} item optimized`);
  });

  function group($container){
    const seen = {};

    $container.style.display = "none";
    ready(function(){
      $container.style.display = "";
    });

    addObserver(function($node){
      process($node);
    }).observe($container, {childList: true});

    $container.querySelectorAll('li').forEach($li => process($li));

    function getCount(item) {
      const $count = item.querySelector('.item_count');
      return $count ? Number($count.textContent) : 1;
    }

    function process($el) {
      if(!!$el.dataset && !!$el.dataset.item && ($el.dataset.id === undefined || $el.dataset.id === "0")){
        const id = $el.dataset.item;
        const $base = seen[id];

        if ($base && $base !== $el) {
          setItemCount($($base), getCount($base) + 1);
          $el.remove();
          optimizedCount++;
        }
        else seen[id] = $el;
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
      })
    };
  }
})();