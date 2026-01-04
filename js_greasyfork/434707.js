// ==UserScript==
// @name         Ban All GreasyFork Users on List
// @namespace    GreasyForkBanner
// @version      0.2
// @description  Open an user page and use this script to auto ban all users listed on the page.
// @author       hacker09
// @include      https://greasyfork.org/en/users?q=*
// @include      https://greasyfork.org/en/users/*/ban
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://greasyfork.org/&size=64
// @run-at       document-end
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/434707/Ban%20All%20GreasyFork%20Users%20on%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/434707/Ban%20All%20GreasyFork%20Users%20on%20List.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (location.href.match('/ban') !== null) //If the ban page is opened
  { //Starts the if condition

    fetch(location.href, { //Fetch the user oage
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "content-type": "application/x-www-form-urlencoded",
      },
      "body": "authenticity_token=" + document.querySelector("form > input[type=hidden]:nth-child(1)").value + "&reason=Their+user+names+themselves+are+advertisements.+Numbers+are+phone+numbers.",
      "method": "POST"
    });

    window.onload = function() { //After the window loaded
      setTimeout(function() { //Starts the setTimeout function
        window.top.close(); //Closes the tab
      }, 1000); //Finishes the setTimeout function
    } //Finishes the window onload function

  } //Finishes the if condition
  else //If an user list is opened
  { //Starts the else condition

    document.querySelector("h2").insertAdjacentHTML('beforeend', '<br><span id="BanALL" style="cursor: pointer; margin-top: 15px">Ban All Users</span>'); //Append the Ban All Users btn after the Users h2 element

    document.querySelector("#BanALL").onclick = function() { //After the Ban All button is clicked
      document.querySelectorAll("span.badge.badge-banned").forEach(el => el.parentElement.remove()); //Remove all users already banned from the list

      document.querySelectorAll("a.user-link").forEach(function(el) { //For each user that wasnt yet banned on the list
        window.open(el.href + '/ban', '_blank'); //Open the user ban page

        //       async function GetBanUserPage() //Creates a function to get the Ban User Page
        //       { //Starts the function
        //         const response1 = await fetch(el.href); //Fetch the user page
        //         const html1 = await response1.text(); //Gets the fetch response
        //         const UserPage = new DOMParser().parseFromString(html1, 'text/html'); //Parses the fetch response
        //         const response2 = await fetch(el.href + '/ban'); //Fetch the user ban page
        //         const html2 = await response2.text(); //Gets the fetch response
        //         const BanUserPage = new DOMParser().parseFromString(html2, 'text/html'); //Parses the fetch response

        //         fetch(el.href, { //UserPage.querySelector('link[rel="canonical"]').href Fetch the user page
        //           "headers": {
        //             "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        //             "content-type": "application/x-www-form-urlencoded",
        //           },
        //           "body": "authenticity_token=" + BanUserPage.querySelector("form > input[type=hidden]:nth-child(1)").value + "&reason=Their+user+names+themselves+are+advertisements.+Numbers+are+phone+numbers.",
        //           "method": "POST"
        //         });

        //       }; //Finishes the async function
        //       GetBanUserPage(); //Calls the async function to ban the user
      }) //Finishes the For Each loop
    } //Finishes the onclick even listener
  } //Finishes the else condition
})();