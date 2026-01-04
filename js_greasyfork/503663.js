// ==UserScript==
// @name         e621 renamer
// @namespace    http://tampermonkey.net/
// @version      2024-08-09
// @description  file downloader with tags as name
// @author       You
// @match        https://static1.e621.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e621.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503663/e621%20renamer.user.js
// @updateURL https://update.greasyfork.org/scripts/503663/e621%20renamer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function() {
    // Function that contains the original script logic
    function downloadFile() {
        var currentURL = window.location.href;
        var filename = currentURL.substring(currentURL.lastIndexOf('/') + 1, currentURL.lastIndexOf('.'));
        var jsonURL = 'https://' + atob("ZTYyMS5uZXQ=") + '/posts.json?md5=' + filename;

        fetch(jsonURL)
            .then(res => res.json())
            .then(data => {
                const dataString = JSON.stringify(data);
                const data_parsed = JSON.parse(dataString);
                const general = data_parsed.post.tags.general;
                const species = data_parsed.post.tags.species;
                const character = data_parsed.post.tags.character;
                const artist = data_parsed.post.tags.artist;

                let joined = "";
                for (var key in general) {
                    joined = joined + general[key].replace(/[_\W]/g, '');
                }
                joined = joined + "_";
                for (var key in species) {
                    joined = joined + species[key].replace(/[_\W]/g, '');
                }

                joined = joined + "_";
                for (var key in character) {
                    joined = joined + character[key].replace(/[_\W]/g, '');
                }
                joined = joined + "";
                for (var key in artist) {
                    if (artist[key] != "conditional_dnp") {
                        joined = joined + artist[key].replace(/[_\W]/g, '');
                    }
                }
                const cleanedData = joined;
                console.log(cleanedData);
                const extension = currentURL.split('.').pop();
                const maxLength = 240;
                const truncatedCleanedData = cleanedData.length > maxLength ? cleanedData.substring(cleanedData.length - maxLength) : cleanedData;
                console.log(truncatedCleanedData);

                // Now fetch the actual file content from the current URL
                fetch(currentURL)
                    .then(response => response.blob())
                    .then(blob => {
                        const url = URL.createObjectURL(blob);

                        const link = document.createElement('a');
                        link.href = url;
                        link.download = truncatedCleanedData + '.' + extension;

                        document.body.appendChild(link);
                        link.click();

                        // Cleanup
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                    });
            });
    }

    // Create a button and add it to the page
    var button = document.createElement('button');
    button.innerText = 'Download File';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.style.padding = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // Add event listener to the button
    button.addEventListener('click', downloadFile);

    // Append the button to the body
    document.body.appendChild(button);
})();

})();