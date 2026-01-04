// ==UserScript==
// @name         Anilist VA filter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Filters the list of characters voiced by a VA to show only the characters from anime in your completed and current watchlists.
// @author       Arunato
// @match        https://anilist.co/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/381623/Anilist%20VA%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/381623/Anilist%20VA%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;

    // Retrieves user name
    function getUser(){
        const profileLink = document.querySelector(".links").childNodes[2].href;
        const re = new RegExp("https://anilist.co/user/(.*)/");
        const user = profileLink.match(re)[1];
        return user;
    }

    function getWatchlist(user, status){
        // Query for completed anime watchlist of the user
var query = `
query ($userName: String, $listStatus: MediaListStatus) { # Define which variables will be used in the query (id)
  MediaListCollection(userName: $userName, type: ANIME, status: $listStatus) {
    user {
      id
    }
    lists {
      name
      entries {
        media {
          id
        }
      }
    }
  }
}
`;

        // Define our query variables and values that will be used in the query request
        var variables = {
            userName: user,
            listStatus: status
        };

        // Define the config we'll need for our Api request
        var url = 'https://graphql.anilist.co',
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    variables: variables
                })
            };

        // Make the HTTP Api request
        fetch(url, options).then(handleResponse)
            .then(handleData)
            .catch(handleError);
    }

    function handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    }

    // Extracts anime id's from the data retrieved with the API request
    var animeIdList = [];
    function handleData(data) {
        var animeList = data.data.MediaListCollection.lists[0].entries;
        for (let i = 0; i<animeList.length; i++) {
            animeIdList.push(animeList[i].media.id);
        }
    }

    function handleError(error) {
        alert('Error, check console');
        console.error(error);
    }

    // Autoscrolls the page to the bottom until all data is loaded, then scrolls to the top
    var count = 0;
    var lastScrollHeight = 0;
    function loadPage(){
        var sh = document.documentElement.scrollHeight;
        if (sh != lastScrollHeight) {
            lastScrollHeight = sh;
            document.documentElement.scrollTop = sh;
            count = 0;
        } else {
            count++;
        }
        if (count === 5){
            clearInterval(loadingInterval);
            document.documentElement.scrollTop = 0;
            filterCharacters(animeIdList);
        }

    }

    // Filters the characters of a VA to only show characters in media present on the watchlist
    function filterCharacters(watchlist) {
        var characterList = document.querySelector(".character-roles .grid-wrap").childNodes;
        var characterArray = Array.from(characterList);
        var characterIdList = [];
        // For each character entry, checks if its media is in the watchlist. If it is not, the entry is removed.
        characterArray.forEach(function(item){
            var animeRe = /^https:\/\/anilist\.co\/anime\/(.*)\/.+/;
            var charRe = /^https:\/\/anilist\.co\/character\/(.*)\/.+/;
            var animeId = Number(item.querySelector(".media .content").href.match(animeRe)[1]);
            var charMatch = item.querySelector(".character .content").href.match(charRe);
            if (charMatch) {
                var charId = Number(charMatch[1]);
                if (animeIdList.indexOf(animeId) >= 0 && characterIdList.indexOf(charId) < 0){
                    characterIdList.push(charId);
                } else {
                    item.parentNode.removeChild(item);
                }
            } else {
                item.parentNode.removeChild(item);
            }
        });
    }

    // Creates buttons and displays it on the staff page
    var loadingInterval
    function addButtons(){
        // Create filter button
        /*
        var filterButton = document.createElement("BUTTON");
        filterButton.textContent = 'Filter';
        filterButton.setAttribute("style", "float:right");
        filterButton.addEventListener("click", function() {
            filterCharacters(animeIdList);
        }, false);
        */

        // Create loading button
        var loadingButton = document.createElement("BUTTON");
        loadingButton.textContent = 'Load page & filter';
        loadingButton.setAttribute("style", "float:right");
        loadingButton.addEventListener("click", function() {
            loadingInterval = window.setInterval(loadPage, 100);
            loadingButton.disabled = true;
        }, false);

        // Select character-roles header of staff page and add the buttons
        var charHeader = document.querySelector(".staff .character-roles h2");
        charHeader.appendChild(loadingButton);
        // charHeader.appendChild(filterButton);
    }

    // Script which filters the characters of a VA
    function filterScript(){
        addButtons();
        // TODO add sorting buttons
    }

    // Handles which script runs on which page
    function handleScripts(url){
        if (url.match(/^https:\/\/anilist\.co\/staff\/.+/)) {
            filterScript();
        };
    }

    $( window ).on( "load", function() {
        const user = getUser();
        getWatchlist(user, 'COMPLETED');
        getWatchlist(user, 'CURRENT');

        // Checks if the page url has changed and runs scripts accordingly
        // TODO change to event trigger if possible
        var current = "";
        var handle = 0;
        setInterval(function(){
            if(document.URL != current){
                clearTimeout(handle);
                current = document.URL;
                handle = setTimeout(function(){
                    handleScripts(current)
                }, 1000);
            };
        },200);
    });
})();