// ==UserScript==
// @name         Quotes - MAL
// @namespace    Quote
// @version      4
// @description  Brings back the original MAL quotes button! Now you can copy in a single click original BBCodes and image URLs!
// @author       hacker09
// @match        https://myanimelist.net/forum/?topicid=*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474938/Quotes%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/474938/Quotes%20-%20MAL.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function Function() { //Starts the Function
    setTimeout(() => { //Starts the setTimeout function
      document.querySelectorAll(".mal-post-toolbar > div, .toolbar.left").forEach(function(el, i) { //ForEach topic
        var counter = i; //Create a new variable
        document.querySelector(".mal-post-toolbar > div") === null ? counter = i + 1 : counter = i; //If the page is on the conversation view
        if ((document.querySelectorAll(".username, .item.name")[counter].innerText !== window.dataLayer[0].user_name) && document.querySelectorAll(".mal-post-toolbar > div, .toolbar.left")[i].innerHTML.match("Quote") === null) { //If it is not the script user message and the current message does not have the quote button
          el.insertAdjacentHTML('afterbegin', `<button title="Quote ${document.querySelectorAll(".username, .item.name")[counter].innerText}" class="mal-btn secondary small outline noborder js-topic-message-report"><i class="fa-solid fa-reply fa-fw mr4"></i>Quote</button>`); //Add the quote button on the page

          el.querySelector(`button`).onclick = async function() //When the quote btn is clicked
          { //Starts the onclick function
            document.querySelector(".topic-reply-container.hide") !== null ? document.querySelector(".topic-reply-container.hide").remove() : ''; //Remove needless hidden new reply btn
            document.querySelectorAll(".js-reply-start:not(.pressed)").forEach(el => el.click());; //If the reply btn closed, open it
            document.querySelectorAll(".postnum > a, .item.name")[document.querySelectorAll(".postnum > a, .item.name").length - 1].scrollIntoView(); //Scroll the page to the bottom

            const response = await (await fetch('https://myanimelist.net/includes/quotetext.php', {
              "headers": {
                "content-type": "application/x-www-form-urlencoded"
              },
              "body": `msgid=${document.querySelector(".postnum") !== null ? document.querySelectorAll(".postnum > a")[i].href.match(/\d+/g)[1] : document.querySelectorAll("[class='message']")[i].dataset.id}&csrf token=${document.head.querySelector("[name='csrf_token']").content}`,
              "method": "POST"
            })).text(); //Finishes the fetch

            setTimeout(() => { //Paste the quoted content on the bottom new reply btn
              document.querySelectorAll(".sourceMode > textarea, .forum-post-reply-comment, .bbcode-message-editor").forEach(el => el.value += `[quote=${document.querySelectorAll(".username, .item.name")[counter].innerText} message=${document.querySelector(".postnum") !== null ? document.querySelectorAll(".postnum > a")[i].href.match(/\d+/g)[1] : document.querySelectorAll("[class='message']")[i].dataset.id}]` + new DOMParser().parseFromString(response, "text/html").documentElement.textContent + '[/quote]'); //Paste the text and BBCode content from the topic reply the user wants to quote
            }, 500); //Finishes the click event listener and setTimeout function
          }; //Finishes the onclick function
        } //Finishes the if condition
      }) //Finishes the forEach loop
    }, 500); //Finishes the setTimeout function
  } //FInishes the Function

  Function(); //Run the script when the page is loaded

  document.querySelectorAll(".js-thread-childs").forEach(function(el) { //ForEach reply child
    el.onclick = function() { //When the reply child btn is clicked
      Function(); //Run the script again
    }; //Finishes the onclick function
  }) //Finishes the forEach loop
})();