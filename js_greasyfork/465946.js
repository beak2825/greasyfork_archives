// ==UserScript==
// @name        Add Suggestions to OAPEN Library
// @namespace   Violentmonkey Scripts
// @match       *://library.oapen.org/handle/*
// @grant       none
// @version     1.1
// @author      OAPEN Suggestion Service
// @grant        GM_xmlhttpRequest
// @description Adds suggestions to the sidebar on https://library.oapen.org when viewing a publication.
// @downloadURL https://update.greasyfork.org/scripts/465946/Add%20Suggestions%20to%20OAPEN%20Library.user.js
// @updateURL https://update.greasyfork.org/scripts/465946/Add%20Suggestions%20to%20OAPEN%20Library.meta.js
// ==/UserScript==
const FETCH_URL_HOST = "https://oss.ebookfoundation.org";

async function mountSuggestions() {
  let sidebar = document.querySelector("#aspect_artifactbrowser_ItemViewer_div_item-view > div > div.row > div.col-sm-4");
  let suggestionsElement = document.createElement("div");
  suggestionsElement.className = "item-page-field-wrapper list-group";
  suggestionsElement.style.width = "75%";
  let heading = document.createElement("h5");
  heading.innerText = "Suggestions"


  let handle = window.location.pathname.split('/').slice(-2).join("/");
  GM_xmlhttpRequest({
    url: FETCH_URL_HOST + "/api/" + handle,
    method: "GET",
    responseType: "json",
    onload: (response) => {
      try {
        let resp = JSON.parse(response.responseText);

        if (!resp || resp.error) throw "No response!";
        if (!resp.items || !resp?.items?.suggestions) throw "No items in response!";

        const { suggestions } = resp.items;

        // create suggestions list element
        const suggestionsListElement = document.createElement("ul");
        suggestionsListElement.className = "suggestions-list";

        // create suggestions list items
        const suggestionsListItems = suggestions.slice(0, 4).map((suggestion) => {
          const listItem = document.createElement("li");
          listItem.className = "list-group-item ds-option";
          listItem.style.textAlign = "center";
          // make it a link
          const link = document.createElement("a");
          link.className = "suggestions-list-item-link";
          link.href = "https://library.oapen.org/handle/" + suggestion.suggestion;
          link.target = "_blank";
          link.innerText = suggestion.suggestion_name;
          // add the thumbail
          const thumbnail = document.createElement("img");
          const thumbnailDiv = document.createElement("div");
          thumbnailDiv.className = "thumbnail";
          thumbnail.className = "img-thumbnail";
          thumbnail.style.margin = "0 auto";
          thumbnail.src = suggestion.suggestion_thumbnail;
          // append it all together
          thumbnailDiv.appendChild(thumbnail);
          listItem.appendChild(thumbnailDiv);
          listItem.appendChild(link);
          return listItem;
        });

        // append suggestions list items to list
        suggestionsListItems.forEach((item) =>
          suggestionsListElement.appendChild(item)
        );

        // append list to suggestions element
        suggestionsElement.appendChild(suggestionsListElement);
      } catch (e) {
        let noSuggestions = document.createElement("p");
        noSuggestions.innerText = "Not available for this text";
        suggestionsElement.innerHTML = "";
        suggestionsElement.append(noSuggestions);
        suggestionsElement.prepend(heading);
        console.error(e);
      }
    },
    onerror: (e) => {
      let noSuggestions = document.createElement("p");
      noSuggestions.innerText = "Not available for this text";
      suggestionsElement.innerHTML = "";
      suggestionsElement.append(noSuggestions);
      suggestionsElement.prepend(heading);
      sidebar.appendChild(suggestionsElement);
      console.error(e);
    }
  });
  sidebar.appendChild(suggestionsElement);
}

window.onload = function () {
  mountSuggestions();
};