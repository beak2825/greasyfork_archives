// ==UserScript==
// @name         Open all to tabs for Reddit
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Opens all Reddit links on the page to tabs.
// @copyright    2018, Santeri Hetekivi (https://github.com/SanteriHetekivi)
// @license      Apache-2.0
// @author       Santeri Hetekivi
// @match        https://*.reddit.com/*
// @exclude      https://www.reddit.com/*/comments/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/is-in-viewport/2.4.2/isInViewport.min.js
// @downloadURL https://update.greasyfork.org/scripts/37955/Open%20all%20to%20tabs%20for%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/37955/Open%20all%20to%20tabs%20for%20Reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Adding Font Awesome CSS file for icons.
    $("head").append (
        '<link href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" type="text/css">'
    );
    // ID for the new link and query for that ID.
    const LINK_ID = "openAllReddit";
    const LINK_QUERY = "#"+LINK_ID;

     // Objects for different reddit site styles.
    const SITE_OBJECTS = [
        // Old (current) site
        {
            // Query for menu or any other place link will be appended.
            menuQuery: "ul.tabmenu",
            // Querys for links that will be opened.
            linkQuerys: [
                ".thing:not(.promoted) a[data-event-action='title']"
            ],
            // HTML code for the added link.
            linkHTML: '<li id="'+LINK_ID+'"><a href="#" class="choice">Open All</a></li>',
            // If this is true, link press only opens links that are in user's viewport.
            onlyInViewport: false
        },
        // New site
        {
             // Query for menu or any other place link will be appended.
            menuQuery: "header > div:first",
            // Querys for links that will be opened.
            linkQuerys: [
                "span > a[target='_blank']:not([href*='alb.reddit.com'])",
                "a[href*='/r/'][href*='/comments/'][data-click-id='body']"
            ],
            // HTML code for the added link.
            linkHTML: '<a href="#" id="'+LINK_ID+'"><i class="fa fa-external-link" style="font-size:22px;color:#929BA0;"></i></a>',
            // If this is true, link press only opens links that are in user's viewport.
            onlyInViewport: true
        },
    ];

    /**
     * Opens all links on the page to new tabs that match given siteObject's query.
     * @param siteObject Site object for links.
     */
    function openAllLinks(siteObject)
    {
        openAllLinks.openedElements = [];
        // Loop all querys.
        siteObject.linkQuerys.forEach(
            function(linkQuery, index)
            {
               // If onlyInViewport is true for site, then loop trough only element's that are in viewport.
               if(siteObject.onlyInViewport)
                   linkQuery += ":in-viewport";
               // Loop all elements that query finds.
               $(linkQuery).each(
                   function( index, element )
                   {
                       // Get parent's HTML.
                       var parent = $(element).parent().html();
                       // Check if parent is not openned.
                       if($.inArray(parent, openAllLinks.openedElements) < 0)
                       {
                           // Add parent to oppened elements.
                           openAllLinks.openedElements.push(parent);
                           // Open element's link to new tab.
                           var opened = window.open(element.href, '_blank');
                           // If opening failed give alert to user for allowing popups.
                           if (!opened) {
                               alert('Please allow popups for this website');
                               return false;
                           }
                       }
                   }
               );
            }
        );

    }

    /**
     * Adds link to given siteObject.
     * @param siteObject Object for site version that link will be added.
     * @param index Index of that object.
     */
    function addLink(siteObject, index)
    {
        // Mark addLink running.
        addLink.running = true;
        // Query to find the menu.
        var menuQuery = siteObject.menuQuery;

        // Check if site has a menu that site object has query for.
        var hasMenu = ($(menuQuery).length > 0);
        if(!hasMenu)
            return false; // If no menu is found return false and try other site object.

        // Removes any added links.
        removeLink();

        // Getting siteObject's link HTML code.
        var linkHMTL = siteObject.linkHTML;
        // Appending link's HTML code to menu.
        $(menuQuery).append(linkHMTL);

        // Adding click event to added link to open all links that match site object's link query.
        $(LINK_QUERY).click(
            function() {
                openAllLinks(siteObject);
                return false;
            }
        );

        // Update child count.
        addLink.menuChildrenCount = $(menuQuery).children().length;
        // When menu element changes add again, but only if it has changed dramatically.
        $(menuQuery).on("DOMSubtreeModified",
            function()
            {
                // Only run if addLink is not running already.
                if(!addLink.running)
                {
                    // Only run if menu's child count has changed.
                    var newMenuChildrenCount = $(menuQuery).children().length;
                    if(addLink.menuChildrenCount != newMenuChildrenCount)
                    {
                        // Update child count.
                        addLink.menuChildrenCount = newMenuChildrenCount;
                        // Add link again.
                        addLink(siteObject, index);
                    }
                }
            }
        );

        // Mark addLink no longer running.
        addLink.running = false;
        return true;
    }

    /**
     * Removes added link if any.
     */
    function removeLink()
    {
        // Removes link if it is found.
        if($(LINK_QUERY).length > 0)
            $(LINK_QUERY).remove();
    }

    // Adding links to site object until succeeded.
    SITE_OBJECTS.some(addLink);
})();