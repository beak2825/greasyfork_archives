// ==UserScript==
// @name         HN Blocker
// @namespace    http://news.ycombinator.com/
// @version      0.1
// @description  Block users on the orange website
// @author       A. Person
// @match        https://news.ycombinator.com/item*
// @icon         https://www.google.com/s2/favicons?domain=ycombinator.com
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443532/HN%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/443532/HN%20Blocker.meta.js
// ==/UserScript==

GM.addStyle(`
.default .comment.blocked span.commtext, .reply {
    display:none !important;
}

.default .comment.blocked:not(:hover)::after {
    content: "[blocked]";
}

.default .comment.blocked:hover span.commtext {
    display:block !important;
}
`);

var users = [];
async function getBlockedUsers() {
  users = await GM.getValue("hn_banned", []);
  console.log(`[HN] Loaded ${users.length} users`);
}

let banUser = function (name) {
  users.push(name);
  GM.setValue("hn_banned", users);
};

let unbanUser = function (name) {
  var i = users.indexOf(name);
  if (i !== -1) users.splice(i, 1);
  GM.setValue("hn_banned", users);
};

function handleItem(item) {
  var username = item.querySelector("a").text;
  let commentEl = item.querySelector(".comment");

  var seperator = item.querySelector(".hn_bl_seperator");

  if (seperator !== null) {
    seperator.remove();
    seperator = null;
  }

  seperator = document.createElement("span");
  seperator.innerHTML = " | ";
  seperator.className = "hn_bl_seperator";

  var actor = document.createElement("a");
  actor.href = "#";

  item.querySelector(".comhead").appendChild(seperator);
  seperator.appendChild(actor);

  var blockedMessage = item.querySelector(".blocked");

  if (blockedMessage !== null) {
    blockedMessage.remove();
  }

  if (users.includes(username)) {
    commentEl.classList.add("blocked");

    actor.innerHTML = "unblock";
    actor.onclick = function () {
      unbanUser(username);
      commentEl.classList.remove("blocked");
      return false;
    };
  } else {
    commentEl.classList.remove("blocked");

    actor.innerHTML = "block";
    actor.onclick = function () {
      banUser(username);
      commentEl.classList.add("blocked");
      return false;
    };
  }
}

(async function () {
  "use strict";

  await getBlockedUsers();

  var comments = document.querySelectorAll(".default");
  console.log("got comments", comments.length);

  comments.forEach((comment) => {
    handleItem(comment);
  });
})();
