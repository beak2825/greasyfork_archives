// ==UserScript==
// @name        Nhentai Search on Exhentai
// @include     /.*nhentai\.net\/g\//
// @run-at      document-end
// @author      Adam Jensen
// @description Adds a button on NHentai that allows to search for the same manga on Exhentai.
// @grant       none
// @license MIT
// @namespace https://greasyfork.org/en/scripts/518474-nhentai-search-on-exhentai
// @version     1.0.1
// @downloadURL https://update.greasyfork.org/scripts/518474/Nhentai%20Search%20on%20Exhentai.user.js
// @updateURL https://update.greasyfork.org/scripts/518474/Nhentai%20Search%20on%20Exhentai.meta.js
// ==/UserScript==

(function() {
    function addExhentaiButton() {
        // Get the title from the NHentai page
        var html = document.getElementById("info");
        var title = html.querySelector("h1");
        var titleText = title.innerHTML;

        // Clean the title of any HTML tags
        const regex = /<.*?>/gm;
        const cleanTitle = titleText.replace(regex, '');

        // Create the search URL for Exhentai
        var searchUrl = 'https://exhentai.org/?f_search=' + encodeURIComponent(cleanTitle);

        // Create the button
        var button = document.createElement("button");
        button.textContent = "Search on Exhentai";
        button.style.backgroundColor = "#ff6347"; // background color
        button.style.color = "#fff"; // text color
        button.style.padding = "10px 20px"; // padding
        button.style.fontSize = "16px"; // font size
        button.style.border = "none"; // no border
        button.style.borderRadius = "5px"; // rounded corners
        button.style.cursor = "pointer"; // cursor as a hand
        button.style.marginTop = "10px"; // top margin
        button.style.display = "block"; // displayed as a block

        // Add the event to redirect to Exhentai when clicked
        button.addEventListener("click", function() {
            window.location.href = searchUrl;
        });

        // Add the button to the DOM (for example, below the title)
        title.parentElement.appendChild(button);
    }

    // Add the button when the page has finished loading
    window.addEventListener('load', addExhentaiButton);
})();
