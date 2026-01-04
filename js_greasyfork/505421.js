// ==UserScript==
// @name         GreasyFork Sites Show for Users (GFSSU)
// @namespace    https://your-namespace-here
// @version      1.0
// @description  Show @match and @include URLs for scripts on user pages on GreasyFork with a toggle feature 
// @author       Emree.el on instagram
// @match        https://greasyfork.org/en/users/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505421/GreasyFork%20Sites%20Show%20for%20Users%20%28GFSSU%29.user.js
// @updateURL https://update.greasyfork.org/scripts/505421/GreasyFork%20Sites%20Show%20for%20Users%20%28GFSSU%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Process each script list item
    $('li[data-script-id]').each(function() {
        let scriptElement = $(this);
        let codeUrl = scriptElement.attr('data-code-url');

        if (codeUrl) {
            // Fetch the script content
            GM_xmlhttpRequest({
                method: "GET",
                url: codeUrl,
                onload: function(response) {
                    if (response.status === 200) {
                        // Extract @match and @include lines
                        let matchUrls = response.responseText.match(/\/\/\s*@match\s+(\S+)/g) || [];
                        let includeUrls = response.responseText.match(/\/\/\s*@include\s+(\S+)/g) || [];
                        let allUrls = matchUrls.concat(includeUrls);

                        if (allUrls.length > 0) {
                            let matchList = $('<ul class="url-list" style="list-style-type: disc; margin-left: 20px;"></ul>');
                            allUrls.forEach(function(line, index) {
                                let url = line.replace(/\/\/\s*@(match|include)\s+/, '').trim();
                                let listItem = $(`<li style="display: ${index >= 3 ? 'none' : 'list-item'};">${url}</li>`);
                                matchList.append(listItem);
                            });

                            let toggleButton = null;
                            if (allUrls.length > 3) {
                                toggleButton = $('<button style="margin-left: 10px; cursor: pointer; background: #ddd; border: none; padding: 2px 5px;">+</button>');

                                toggleButton.click(function() {
                                    let isExpanded = $(this).text() === '-';
                                    $(this).text(isExpanded ? '+' : '-');
                                    matchList.children('li').slice(3).toggle(!isExpanded);
                                });
                            }

                            // Append the @match and @include URLs under the script description
                            scriptElement.find('h2').after(matchList);

                            // Add the toggle button next to the script title link
                            if (toggleButton) {
                                scriptElement.find('a.script-link').after(toggleButton);
                            }
                        }
                    }
                }
            });
        }
    });
})();
