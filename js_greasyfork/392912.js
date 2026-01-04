// ==UserScript==
// @name         GGn shop batch buying
// @namespace    https://greasyfork.org/
// @version      0.2.2
// @description  Allows you to set amount you wish to buy in shop.
// @author       lucianjp
// @match        https://gazellegames.net/shop.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392912/GGn%20shop%20batch%20buying.user.js
// @updateURL https://update.greasyfork.org/scripts/392912/GGn%20shop%20batch%20buying.meta.js
// ==/UserScript==

(function() {
  'use strict';

  Purchase = function (item, use = false) {
    let itemid = item.data('itemid');
    let name = item.data('itemname');

    return $.alertable.prompt('Are you sure you want to buy that item? (' + name + ')', {
      prompt: $('<span>Amount: </span><input class="alertable-input" type="text" name="amount" placeholder="1" />')
    }).then(function (data) {
      let count = Number(data.amount) || 1;
      const originalText = item.context.value;

      const $container = document.createElement('div');
      const $progress = $container.appendChild(document.createElement('progress'));
      $progress.value = 0;
      $progress.max = data.amount;
      item.context.parentNode.insertBefore($container, item.context.nextSibling);

      const stopHandler = function(event){
        event.preventDefault();
        event.stopPropagation();
        cleanup();
      };

      function cleanup(){
        count = 0;
        $container.remove();
        item.context.value = originalText;
        item.context.removeEventListener('click', stopHandler);
      };

      item.context.value = 'STOP!';
      item.context.addEventListener('click', stopHandler);

      const recurse = () => {
        if(count > 0){
          buy().always(function() {
            count--;
            if(count > 0) {
              setTimeout(recurse, 500);
              $progress.value = data.amount - count;
            } else{
              cleanup();
            }
          });
        }
      }
      recurse();
    });

    function buy(){
      return $.get(
        'shop.php',
        {action: 'ajax_purchase', auth: authkey, itemid: itemid, use: use},
        function (response) {
          if (response == 'Item Purchased!' || response.indexOf("item was purchased") !== -1) {
            if (response == 'Item Purchased!') {
              response = "Item purchased! Use it in your <a href=\"https://gazellegames.net/user.php?action=inventory\">Inventory</a>.";
            }
            $('body').append('<div class="new_purchase_icon">+1</div>');
            var buyicon = $('.new_purchase_icon');
            var position = item.offset();
            buyicon.hide();
            buyicon.css({
              left: position.left + 25,
              top: position.top + 40
            });

            buyicon.show('puff', {percent: 200}, 200, function () {
              buyicon.delay(650).fadeOut(1200, function () {
                buyicon.remove();
              });
            });

            noty({
              text: response,
              timeout: 3500
            });
          } else {
            noty({
              text: response,
              type: 'error',
              timeout: 2500
            });
          }
        }
      );
    }
  }
})();