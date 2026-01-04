// ==UserScript==
// @name         Multireddit Followed Users
// @namespace    https://www.reddit.com/u/Fergobirck
// @version      1.0
// @description  Creates a multireddit with only the users you follow (excludes your subscribed subreddits)
// @author       Fergobirck
// @match        https://www.reddit.com/subreddits/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407916/Multireddit%20Followed%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/407916/Multireddit%20Followed%20Users.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var filtered = [];
    var linkPosition = document.querySelectorAll(".subscription-box")[0].getElementsByTagName('ul')[0].getElementsByTagName('a')[0];
    var subscribed = document.querySelectorAll(".subscription-box")[0].getElementsByTagName('ul')[0].querySelectorAll('li');

    subscribed.forEach((item, index) => {
      var subName = item.getElementsByClassName('title')[0].innerHTML;
      if (subName.substr(0, 2) == "u/") {
          filtered.push(subName.replace("u/", "u_"));
      }
    });

    var html = "<a href=\"https://www.reddit.com/r/" + filtered.join("+") + "\" class=\"title\">multireddit of your followed users</a><br\>"
    linkPosition.insertAdjacentHTML("beforebegin", html);
})();