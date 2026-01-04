// ==UserScript==
// @name         Attack links on enemy list
// @namespace    https://gitgud.com/stephenlynx
// @version      1.2.2
// @description  Adds attack links on enemy list
// @author       Stephen Lynx
// @license      MIT
// @match        https://www.torn.com/page.php?sid=list&type=enemies
// @match        https://www.torn.com/page.php?sid=UserList*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514550/Attack%20links%20on%20enemy%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/514550/Attack%20links%20on%20enemy%20list.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var toBlock = [ '72', '77', '71', '15', '16', '70', '82' ];

  function checkIcons(base) {

    var iconArray = Array.from(base.getElementsByClassName('iconShow'));

    for (var i = 0; i < iconArray.length; i++) {

      var icon = iconArray[i];

      if (toBlock.indexOf(icon.id.substr(4, 2)) > -1) {
        return false;
      }

    }

    return true;

  }

  function processPlayerElement(link){

    var destination = link.href;

    console.log(destination);
    var id = destination
    .match(/\/profiles\.php\?XID=(\d*)/)[1];

    var attackLink = document.createElement('a');
    var oldOnClick = attackLink.onclick;
    attackLink.onclick = function(event) {
      event.stopPropagation();
      oldOnClick();
    }
    attackLink.innerHTML = 'Attack';
    attackLink.style['font-size'] = '12px';
    attackLink.target = '_blank';
    attackLink.href = '/loader.php?sid=attack&user2ID='
      + id;
    link.after(attackLink);

  }

  var observer = new MutationObserver(
    function(mutationList, observer) {
      mutationList
        .forEach(function(event) {


        for (var added of event.addedNodes) {

          if (!added.querySelectorAll) {
            continue;
          }

          //enemy list
          for (var element of added.querySelectorAll('[class^=\'honorName___\']')) {
            processPlayerElement(element.parentElement);
          }

          //player search
          for (element of added.getElementsByClassName('user name')) {

            var parent = element.parentElement.parentElement;

            if(!checkIcons(parent)){
              parent.remove();
            }else {
              processPlayerElement(element);
            }


          }


        }

      });

    });

  observer.observe(document.getElementsByTagName('body')[0], {
    childList : true,
    subtree : true
  });

})();
