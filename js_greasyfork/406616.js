// ==UserScript==
// @name         ao3 no rekudos
// @version      0.1
// @description  hide kudos button if you've already left kudos
// @include      /https?://archiveofourown\.org/.*works/\d+/
// @grant        none
// @namespace    https://greasyfork.org/users/36620
// @downloadURL https://update.greasyfork.org/scripts/406616/ao3%20no%20rekudos.user.js
// @updateURL https://update.greasyfork.org/scripts/406616/ao3%20no%20rekudos.meta.js
// ==/UserScript==

var greeting, username, kudos, btn;

greeting = document.getElementById('greeting');

username = greeting.querySelector('a').href;
username = username.slice(username.lastIndexOf('/')+1);

kudos = document.getElementById('feedback');
kudos = kudos.querySelectorAll('.kudos a');

btn = document.getElementById('new_kudo');

for (var i = 0; i < kudos.length; i++) {
  if (kudos[i].innerText == username) {
    btn.style.display = "none";
    break;
  }
}