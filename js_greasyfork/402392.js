// ==UserScript==
// @name         Remove Users From Torn Jobs List
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add buttons to remove people to torn users list
// @author       Archimedes
// @match        https://www.torn.com/page.php?sid=UserList*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402392/Remove%20Users%20From%20Torn%20Jobs%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/402392/Remove%20Users%20From%20Torn%20Jobs%20List.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var removedUsers = JSON.parse(localStorage.getItem("removedUsers") || "[]");

  document.addEventListener('DOMNodeInserted', function() {
    document.querySelectorAll('.user-info-list-wrap > li').forEach(element => {
      var userNameBlock = element.querySelector('a.user.name');
      if (userNameBlock !== null) {
        var userNameWithID = userNameBlock.getAttribute('data-placeholder');
        var userName = userNameWithID.split(" ")[0];
        if (removedUsers.includes(userName)) {
          element.style.display = 'none';
        }
        else {
          if (element.querySelector('[id^="removeUserButton"]') === null) {
            var buttonNode = document.createElement ('span');
            buttonNode.innerHTML = '<button id="removeUserButton" type="button">Remove</button>';
            var iconTray = element.querySelector('span.user-icons').querySelector('ul');
            iconTray.appendChild(buttonNode);
            element.querySelector('[id^="removeUserButton"]').addEventListener ("click", function() {RemoveUser(userName, element)}, false);
          }
        }
      }
    })
  }, false);
})();

function RemoveUser(userName, element) {
    element.style.display = 'none';
    var removedUsers = JSON.parse(localStorage.getItem("removedUsers") || "[]");
    removedUsers.push(userName);
    localStorage.setItem("removedUsers", JSON.stringify(removedUsers));
}
