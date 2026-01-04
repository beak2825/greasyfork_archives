// ==UserScript==
// @name         MAL Signature Updater
// @namespace    SignatureUpdater
// @version      1
// @description  Automatically update your signature!
// @author       hacker09
// @match        https://myanimelist.net/forum/?topicid=*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469318/MAL%20Signature%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/469318/MAL%20Signature%20Updater.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.querySelectorAll(".mal-post-toolbar > div").forEach(function(el, i) { //ForEach topic
    if (document.querySelectorAll(".username")[i].innerText === document.querySelector("a.header-profile-link").innerText) { //If it is the script user topic
      el.insertAdjacentHTML('afterbegin', `<button class="mal-btn secondary small outline noborder js-topic-message-report">Update Signature<i class="fa-solid fa-circle-exclamation fa-fw mr4" style=" display: none;"></i></button>`); //Add the update button on the page

      el.querySelector(`button`).onclick = async function(e) //When the update btn is clicked
      { //Starts the function
        fetch("https://myanimelist.net/editprofile.php?go=forumoptions") //Get current signature
          .then(async response => { //After getting current signature
            const html = await response.text(); // Gets the fetch response
            const newDocument = new DOMParser().parseFromString(html, 'text/html'); // Parses the fetch response
            if (newDocument.querySelector("#sigbox").value.match('malsignature.com') !== null) //If the malsignature.com link exists on the signature
            { //Starts the if condition
              fetch("https://myanimelist.net/editprofile.php?go=forumoptions", {
                "headers": {
                  "content-type": "application/x-www-form-urlencoded",
                },
                "body": `signature=${encodeURIComponent(newDocument.querySelector("#sigbox").value.match(/.*style=(\d+)/) !== null ? newDocument.querySelector("#sigbox").value.replace(newDocument.querySelector("#sigbox").value.match(/.*style=(\d+)/)[1], parseInt(newDocument.querySelector("#sigbox").value.match(/.*style=(\d+)/)[1])+1) : newDocument.querySelector("#sigbox").value.match(/username=[^&\[]*/) !== null ? newDocument.querySelector("#sigbox").value.replace(newDocument.querySelector("#sigbox").value.match(/username=[^&\[]*/)[0], newDocument.querySelector("#sigbox").value.match(/username=[^&\[]*/)[0] + '&style=1') : '')}&subsig=Submit&csrf_token=${document.querySelector("[name='csrf_token']").content}`,
                "method": "POST"
              }); //Finishes the if fetch
            } //Finishes the if condition
          }); //Finishes the then function
      }; //Finishes the function
    } //Finishes the if condition
  }); //Finishes the forEach loop
})();