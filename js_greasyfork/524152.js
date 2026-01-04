// ==UserScript==
// @name         ylMzBetterChat2
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  creates clickable links for urls and players IDs
// @author       You
// @match        https://www.managerzone.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524152/ylMzBetterChat2.user.js
// @updateURL https://update.greasyfork.org/scripts/524152/ylMzBetterChat2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".messenger-content-wrapper.flex-nowrap").click(function(){
       $(".messenger-row.buddy,.messenger-row.you").off("click").click(function(){
alert();
        var newHtml =  findPlayerId($(this).text());
    $(this).html( newHtml  );
    });
       });

// Save the original open method
const originalXHROpen = XMLHttpRequest.prototype.open;

// Override the open method
XMLHttpRequest.prototype.open = function (method, url) {
    // Check if the URL contains the desired part
    if (url.includes("ajax.php?p=messenger&sub=poll&sport=soccer&conversations")) {
        this.addEventListener("load", function () {
            // This will execute after the request is completed
alert();
            $(".messenger-row.buddy,.messenger-row.you").off("click").click(function(){
                var newHtml =  findPlayerId($(this).text());
            $(this).html( newHtml  );
            });
        });
    }

    // Call the original open method
    return originalXHROpen.apply(this, arguments);
};

function findPlayerId(msg) {
  const words = msg.split(/\s+/);
    let newMsg = " ";
  for (let i = 0; i < words.length; i++) {
    let word = words[i].trim();
    if (/^\d{9}$/.test(word)) {
        console.log("hehe");
       word = "<a href='https://www.managerzone.com/?p=players&pid=" + word +"'>" + word + "</a>";
    }
      else if (word.indexOf("www") != -1 || word.indexOf("http") != -1){
      word = "<a href='" + word + "'>" + word +"</a>";
      }
      newMsg = newMsg + " "+ word;
  }
  return newMsg;
}

function processLeagueLinks() {
    // Define all language variants
    const titleVariants = [
        "Liga Światowa U18",
        "U18 World League",
        "Liga Mundial U18",
        "Liga Mundial Sub18",
        "Liga Mundial Sub-18",
        "U18 Dünya Ligi"
    ];

    // Step 1: Check for h1 with any of the language variants
    const h1Elements = Array.from(document.getElementsByTagName('h1'));
    const targetH1 = h1Elements.find(h1 =>
        titleVariants.some(variant => h1.textContent.trim() === variant)
    );

    if (!targetH1) {
        console.log("Target H1 not found in any language variant");
        return;
    }

    // Check if link already exists next to h1
    const nextElement = targetH1.nextElementSibling;
    if (nextElement && nextElement.tagName === 'A') {
        console.log("Link already exists next to H1");
        return;
    }

    // Step 2: Find link containing specific href pattern
    const links = document.getElementsByTagName('a');
    const teamLink = Array.from(links).find(link => link.href.includes('?p=team&tid='));

    if (!teamLink) {
        console.log("Team link not found");
        return;
    }

    // Step 3: Perform AJAX call
    fetch(teamLink.href)
        .then(response => response.text())
        .then(html => {
            // Create a temporary DOM parser
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Step 4: Look for league link specifically in infoAboutTeam div
            const infoDiv = doc.getElementById('infoAboutTeam');
            if (!infoDiv) {
                console.log("Info div not found in AJAX response");
                return;
            }

            const leagueLinks = Array.from(infoDiv.getElementsByTagName('a'));
            const leagueLink = leagueLinks.find(link =>
                link.href.includes('/?p=league&type=u18_world') ||
                link.href.includes('/?p=league&amp;type=u18_world')
            );

            if (!leagueLink) {
                console.log("League link not found in info div");
                return;
            }

            // Step 5: Add new link next to h1
            const newLink = document.createElement('a');
            newLink.href = leagueLink.href;
            newLink.textContent = leagueLink.textContent;
            newLink.style.marginLeft = '10px';

            targetH1.parentNode.insertBefore(newLink, targetH1.nextSibling);
        })
        .catch(error => {
            console.error("Error during AJAX request:", error);
        });
}
    // Your code here...

  // Control variable to ensure we only process once per tab
let hasProcessed = false;

// Function to handle visibility change
function handleVisibilityChange() {
    if (document.visibilityState === 'visible' && !hasProcessed) {
        hasProcessed = true;
        setTimeout(processLeagueLinks, 6000);
    }
}

// Add visibility change listener
document.addEventListener('visibilitychange', handleVisibilityChange);

// Also check initial state in case tab is already active
if (document.visibilityState === 'visible') {
    hasProcessed = true;
    setTimeout(processLeagueLinks, 500);
}
    // Your code here...
})();