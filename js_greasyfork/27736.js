// ==UserScript==
// @name         Youtube Sidebar Filter
// @homepageURL  https://github.com/ZHAL9K/Youtube-Sidebar-Filter
// @version      1.1
// @description  Adds filter bars to YouTube's sidebar for Subscriptions and Playlists
// @author       ZHAL9K
// @match        http://*.youtube.com/*
// @match        https://*.youtube.com/*
// @exclude      *://www.youtube.com/tv*
// @exclude      *://www.youtube.com/embed/*
// @exclude      *://www.youtube.com/live_chat*
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/106074
// @downloadURL https://update.greasyfork.org/scripts/27736/Youtube%20Sidebar%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/27736/Youtube%20Sidebar%20Filter.meta.js
// ==/UserScript==

(function() {
    "use strict";

    var subsSelectorId = "guide-channels";
    var subsFilterBarId = "zhal-subs-filter";
    var playlistsSelector = "#guide-container > div > ul > li:nth-child(2) > div > ul";
    var playlistsFilterBarId = "zhal-playlists-filter";
    var guideButtonId = "appbar-guide-button";

    var subsFilterBar = null;
    var subsElements = [];
    var subsUL = document.getElementById(subsSelectorId);

    var playlistsFilterBar = null;
    var playlistElements = [];
    var playlistsUL = document.querySelector(playlistsSelector);


    initSubsFilterBar();
    initPlaylistsFilterBar();

    function initSubsFilterBar()
    {
        if (subsUL !== null)
        {
            subsFilterBar = createFilterBar(subsUL, subsFilterBarId, filterSubs);
            populateElements(subsElements, subsUL);
        }
        else
        {
            var guideButton = document.getElementById(guideButtonId);
            if (guideButton !== null)
            {
                guideButton.addEventListener("click", addSubsFilterBarOnGuideClick, false);
            }
        }
    }

    function initPlaylistsFilterBar()
    {
        if (playlistsUL !== null)
        {
            playlistsFilterBar = createFilterBar(playlistsUL, playlistsFilterBarId, filterPlaylists);
            populateElements(playlistElements, playlistsUL);
        }
        else
        {
            var guideButton = document.getElementById(guideButtonId);
            if (guideButton !== null)
            {
                guideButton.addEventListener("click", addPlaylistsFilterBarOnGuideClick, false);
            }
        }
    }

    function addSubsFilterBarOnGuideClick()
    {
        var timerFunc;
        if (subsFilterBar === null)
        {
            timerFunc = setInterval(myTimer, 1000);
        }

        var count = 0;

        function myTimer()
        {
            count++;
            subsUL = document.getElementById(subsSelectorId);
            if (subsFilterBar === null && subsUL !== null)
            {
                subsFilterBar = createFilterBar(subsUL, subsFilterBarId, filterSubs);
                populateElements(subsElements, subsUL);
            }
            if (count > 5 || subsFilterBar !== null)
            {
                clearInterval(timerFunc);
            }
        }
    }

    function addPlaylistsFilterBarOnGuideClick()
    {
        var timerFunc;
        if (playlistsFilterBar === null)
        {
            timerFunc = setInterval(myTimer, 1000);
        }

        var count = 0;

        function myTimer()
        {
            count++;
            playlistsUL = document.querySelector(playlistsSelector);
            if (playlistsFilterBar === null && playlistsUL !== null)
            {
                playlistsFilterBar = createFilterBar(playlistsUL, playlistsFilterBarId, filterPlaylists);
                populateElements(playlistElements, playlistsUL);
            }
            if (count > 5 || playlistsFilterBar !== null)
            {
                clearInterval(timerFunc);
            }
        }
    }

    function createFilterBar(listUL, id, listener)
    {
        var t = document.getElementById(id);
        if (t === null)
        {
            var parent = listUL.parentElement;
            var filterBar = document.createElement("input");
            filterBar.setAttribute("id", id);
            filterBar.setAttribute("class", "search-term");
            filterBar.setAttribute("style", "height: 20px");
            filterBar.setAttribute("placeholder", "Filter...");
            filterBar.addEventListener("keyup", listener, false);
            parent.insertBefore(filterBar, listUL);
            return filterBar;
        }
        else
        {
            console.log(id + " already created");
            return t;
        }
    }

    function populateElements(elements, listUL)
    {
        var items = listUL.getElementsByClassName("guide-item");
        for (var ii = 0; ii < items.length; ii++)
        {
            var el = getAncestorLI(items[ii]);
            if (el !== null)
            {
                var name = items[ii].getAttribute("title").toUpperCase();
                var subtitle = "";
                var subtitles = items[ii].getElementsByClassName("guide-item-subtitle");
                if (subtitles.length > 0)
                {
                    subtitle = subtitles[0].innerText.toUpperCase();
                }
                elements.push({ name: name, subtitle: subtitle, element: el });
            }
        }
    }

    function filterSubs()
    {
        var filterBy = subsFilterBar.value.toUpperCase();
        filterElements(filterBy, subsElements);
    }

    function filterPlaylists()
    {
        var filterBy = playlistsFilterBar.value.toUpperCase();
        filterElements(filterBy, playlistElements);
    }

    function filterElements(filterBy, elements)
    {
        var temp, ii;
        for (ii = 0; ii < elements.length; ii++)
        {
            temp = elements[ii];
            if (temp.name.indexOf(filterBy) > -1 || (temp.subtitle.length > 0 && temp.subtitle.indexOf(filterBy) > -1))
            {
                if (temp.element.style.display !== "list-item")
                {
                    temp.element.style.display = "list-item";
                }
            }
            else
            {
                if (temp.element.style.display !== "none")
                {
                    temp.element.style.display = "none";
                }
            }
        }
    }

    function getAncestorLI(el)
    {
        var retval = null;
        while (el)
        {
            if (el.tagName.indexOf("LI") > -1)
            {
                retval = el;
                break;
            }
            else if (el.tagName.indexOf("UL") > -1)
            {
                break;
            }
            el = el.parentElement;
        }
        return retval;
    }
})();
