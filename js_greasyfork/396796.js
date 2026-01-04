// ==UserScript==
// @name         GGn inventory batch deleting
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  Allows you to set amount you wish to delete in inventory.
// @author       lucianjp
// @match        https://gazellegames.net/user.php?*action=inventory*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396796/GGn%20inventory%20batch%20deleting.user.js
// @updateURL https://update.greasyfork.org/scripts/396796/GGn%20inventory%20batch%20deleting.meta.js
// ==/UserScript==

(function() {
  'use strict';

  Trash = function Trash (item, itemid, itemType, userid = 0) {
    item = item.parent("li");
    var name = item.find('input[name=itemName]').val();

    return $.alertable.prompt('Are you sure you want to remove that item? (' + name + ')', {
      prompt: $('<span>Amout: </span><input class="alertable-input" type="text" name="amount" placeholder="1" />')
    }).then(function (data) {
      if (!isNaN(itemid) && !isNaN(itemType)) {
        let count = Number(data.amount) || 1;
        const originalSrc = item.context.src;
        const originalClick = item.context.onclick;

        const $container = document.createElement('div');
        const $progress = $container.appendChild(document.createElement('progress'));
        $progress.value = data.amount;
        $progress.max = data.amount;
        item.context.parentNode.insertBefore($container, item.context.nextSibling);

        const stopHandler = function(ev){
          ev.preventDefault();
          ev.stopPropagation();
          cleanup();
        };

        function cleanup(){
          count = 0;
          $container.remove();
          item.context.src = originalSrc;
          item.context.removeEventListener('click', stopHandler);
          item.context.onclick = originalClick;
        };

        item.context.src = '/static/styles/game_room/images/crossn.png';
        item.context.onclick = undefined;
        item.context.addEventListener('click', stopHandler);

        const recurse = () => {
          if(count > 0){
            ajax.get('user.php?action=ajax_trash_item&itemid=' + itemid + '&itemtype=' + itemType + '&userid=' + userid, function () {
              count--;
              removeItem(item, itemid, itemType);

              if(count > 0) {
                setTimeout(recurse, 500);
                $progress.value = count;
              } else{
                cleanup();
              }
            });
          }
        }
        recurse();
      }
    });
  }
})();