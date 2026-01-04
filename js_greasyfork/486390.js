// ==UserScript==
// @name         Kemono.su IRS [Internal Redirect Service]
// @namespace    https://greasyfork.org/en/scripts/486390-kemono-su-irs-internal-redirect-service
// @version      0.0.4
// @description  Hate all the redirects to patreon pages when clicking on links listed on user post? Well, this script will allow you to stay on kemono.su without going to pateron and try to redirect to the same post if it was imported.
// @author       LUXCORP
// @copyright    Code provided as is. Do not edit, change or redistribute without my permission.
// @match        https://www.kemono.su/*
// @match        https://kemono.su/*
// @match        https://beta.kemono.su/*
// @icon         <$ICON$>
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486390/Kemonosu%20IRS%20%5BInternal%20Redirect%20Service%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/486390/Kemonosu%20IRS%20%5BInternal%20Redirect%20Service%5D.meta.js
// ==/UserScript==



// Select all the links on the page
var links = document.querySelectorAll('a');
var currentUrl = window.location.href;

// Loop through each link
links.forEach(function(link) {
  // Get the current href of the link
  var currentHref = link.getAttribute('href');
  var url = new URL(currentUrl);
  var pathnamePartsS = url.pathname.split('/');
  var usr = pathnamePartsS[3];
  console.log(usr);
  // Find the ending ID at the end of the link
  var endingId = currentHref.substring(currentHref.lastIndexOf('/')+1);
  var eID = endingId.match(/\d{5,12}/g);
  if (eID) {
    endingId = eID[0];
  }
  // Replace the domain and path of the link with the new domain and path
  let m = currentHref.match(/patreon.com\/posts/g);
    var newHref = currentHref;
   if (m) {
       newHref = currentHref.replace("patreon.com/posts", "kemono.su/patreon/user/" + usr + "/post");
       newHref = newHref.slice(0, newHref.lastIndexOf("/") + 1) + endingId;
   }
  // Update the href of the link with the new value
  link.setAttribute("href", newHref);
});