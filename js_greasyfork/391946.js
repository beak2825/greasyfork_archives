// ==UserScript==
// @name         GGn add to collection shortcut [+]
// @namespace    https://greasyfork.org/
// @version      0.9.0
// @description  Adds a [+]/[-] to the quick list when searching a bundle to add/remove it to collection right away
// @author       lucianjp
// @icon         https://gazellegames.net/favicon.ico
// @match        https://gazellegames.net/torrents.php?id=*
// @inject-into  page
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/391946/GGn%20add%20to%20collection%20shortcut%20%5B%2B%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/391946/GGn%20add%20to%20collection%20shortcut%20%5B%2B%5D.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const groupCollections = [...document.querySelectorAll('#collages a[href^="collections.php?id"], #sidebar_group_info a[href^="collections.php?id"], .box_series .series_title a[href^="collections.php?id"], .box_theme_collections .theme_collections a[href^="collections.php?id"]')].map(el => el.href.match(/\d*$/)[0]);
  const $bundle = document.querySelector('li#searchbar_collections ul#collectionscomplete');

  new MutationObserver(mutations => {
    const result = autocomp.cache[`collections${autocomp.value}`];
    for(var i = mutations.length-1; i>=0; i--){
      const mutation = mutations[i];
      if(mutation.addedNodes.length > 0){
        for(let j = mutation.addedNodes.length-1; j>=0; j--){
          const $node = mutation.addedNodes[j];
          const collId = $node.href.match(/\d*$/)[0];
          const remove = groupCollections.includes(collId);

          const $span = document.createElement("a");
          $span.style.float = 'right';
          $span.innerHTML = remove ? '[-]' : '[+]';
          $span.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var http = new XMLHttpRequest();
            var url = 'collections.php';
            let params = remove
                ? `action=manage_handle&auth=${authkey}&collageid=${collId}&remove[]=${window.location.href.match(/[^\w]id=(\d+)/)[1]}&submit=Remove`
                : `action=add_torrent&auth=${authkey}&collageid=${collId}&url=${window.location.href}`;
            http.open('POST', url, true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.onreadystatechange = function() {
              if (http.readyState == 4 && http.status == 200) {
                $span.innerHTML = '[✓]';
                if(remove) {
                  groupCollections = groupCollections.filter(el => el !== collId);
                } else {
                  groupCollections.push(collId);
                }
                return true;
              }
            };
            http.send(params);
          }, true);
          $node.style.display = "inline-block";
          $node.appendChild($span);
        }
      }
    }
  }).observe($bundle, {
    childList: true
  });
})();
