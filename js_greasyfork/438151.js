// ==UserScript==
// @name         MangaDex open links
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Open MangaUpdates and MAL links to new tabs on MangaDex with one button.
// @author       Santeri Hetekivi
// @match        https://mangadex.org/title/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/438151/MangaDex%20open%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/438151/MangaDex%20open%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Get url from given element query.
     * @param _query Query to get urls for.
     * @throws If did not get only one unique url.
     * @returns Url.
     */
    function getUrl(_query)
    {
        var urls = new Set();
        $(_query).each(
            function()
            {
                urls.add(this.href);
            }
        );
        const URL_COUNT = urls.size;
        if(URL_COUNT !== 1)
            throw "Query "+_query+" had "+URL_COUNT+" unique urls!";
        return urls.values().next().value;
    }

    /**
     * Open link that element has that is found with given query.
     * @param _query Query to get url for.
     * @throws If did not get only one unique url or opening window failed.
     */
    function openQueryLink(_query)
    {
        const URL = getUrl(
            _query
        );
        if(
            window.open(
                URL,
                "_blank"
            ) === null
        ) throw "Opening window failed for url: "+URL;
    }

    // Main function to run.
    async function main()
    {
        // Query for getting upload button.
        const QUERY_BUTTON = "a[href^='/title/upload/']";

        // Waiting to button to appear
        while($(QUERY_BUTTON).length === 0)
        {
            console.debug("Button not found waiting...");
            await new Promise(r => setTimeout(r, 1000));
        }

        // Add to open all links button.
        console.debug("Button found! Adding 'Open Links'-button...");
        $(QUERY_BUTTON).parent().append(
            $("<button/>",
              {
                text: "Open Links",
                click: function()
                {
                    // Open MangaUpdates link.
                    try
                    {
                        openQueryLink("a[href^='https://www.mangaupdates.com/series.html?id=']");
                    }
                    catch(err)
                    {
                        console.error("Opening MangaUpdated url failed: ", err);
                    }

                    // Open MAL
                    try
                    {
                        openQueryLink("a[href^='https://myanimelist.net/manga/']");
                    }
                    catch(err)
                    {
                        console.error("Opening MAL url failed: ", err);
                    }

                },
                type: "button"
            }
          )
        );

        console.debug("Done!");
    }

    // Call main function.
    main();
})();