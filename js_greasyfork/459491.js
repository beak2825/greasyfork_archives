// ==UserScript==
// @name         User Blocker - MAL
// @namespace    Blocker
// @version      3
// @description  Block any user on any forum topic with a single click!
// @author       hacker09
// @match        https://myanimelist.net/forum/?topicid=*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459491/User%20Blocker%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/459491/User%20Blocker%20-%20MAL.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  document.querySelectorAll(".mal-post-toolbar > div").forEach(function(el, i) { //ForEach topic
    if (document.querySelectorAll(".username")[i].innerText !== document.querySelector("a.header-profile-link").innerText) { //If it is not the script user topic
      el.insertAdjacentHTML('afterbegin', `<button title="Block ${document.querySelectorAll(".username")[i].innerText}" class="mal-btn secondary small outline noborder js-topic-message-report"><i class="fa-solid fa-circle-exclamation fa-fw mr4"></i>Block</button>`); //Add the block button on the page

      el.querySelector(`button`).onclick = async function(e) //When the block btn is clicked
      { //Starts the function
        fetch("https://myanimelist.net/forum/settings/ignored_users", { //Fetch
          "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          "body": `name=${document.querySelectorAll(".username")[i].innerText}&csrf_token=${document.head.querySelector("[name='csrf_token']").content}`,
          "method": "POST"
        });
        location.reload(); //Reloads the page
      }; //Finishes the function
    } //Finishes the if condition
  }); //Finishes the forEach loop
})();