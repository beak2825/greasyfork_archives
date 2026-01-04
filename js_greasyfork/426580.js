// ==UserScript==
// @name         Jira bug to Trello card
// @version      1.1
// @description  Create a Trello card title from Jira bug ticket
// @author       runningdemo.com
// @match        https://workstreamhq.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?domain=atlassian.net
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_notification
// @namespace https://greasyfork.org/users/772796
// @downloadURL https://update.greasyfork.org/scripts/426580/Jira%20bug%20to%20Trello%20card.user.js
// @updateURL https://update.greasyfork.org/scripts/426580/Jira%20bug%20to%20Trello%20card.meta.js
// ==/UserScript==

function main() {
    'use strict';

     const printTrelloTitle = () => {
         const priorityArray = ['P0 - Critical', 'P1 - High', 'P2 - Medium', 'P3 - Low'];
         let priority;
         const ticketNumber = location.href.match(/WS-\d*/)[0];
         const title = $('h1').eq(1).text();
         const priorityEles = $("[class^=ReadViewContentWrapper]").filter(function () {
             const content = $(this).text();
             return ['P1 - High', 'P2 - Medium', 'P3 - Low'].indexOf(content) !== -1;
         })
         if (priorityEles && priorityEles.length > 0) priority = priorityEles.eq(0).text().split(' - ')[0];
         const output = `[${priority}][${ticketNumber}] ${title}`;
         console.log(output);
         GM_setClipboard(output, { type: 'text'});
         GM_notification( { title: 'Card name copied!', text: output });
     }



     GM_registerMenuCommand('Create Trello card', printTrelloTitle);
}

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}


// load jQuery and execute the main function
addJQuery(main);