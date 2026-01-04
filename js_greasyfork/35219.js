// ==UserScript==
// @name         HF 1.8 Client-side Tabs
// @namespace    http://how-to-avoid-name.collisions
// @version      0.3
// @description  IT WORKS!?
// @author       Pan
// @match        *://hackforums.net/
// @match        *://hackforums.net/index.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35219/HF%2018%20Client-side%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/35219/HF%2018%20Client-side%20Tabs.meta.js
// ==/UserScript==

/*
Changelog:
v0.1a:
- Initial
- Cache for tab pages already loaded has been added (avoid/minimize network connections)
- Tabs are only loaded when needed (reduce requests)
- Settings added.
v0.2a:
- Cache properly done with local storage for persistence across reloads
- Cache timeout setting added
- Update url provided now.
v0.3:
- Code cleanup
- No more cookies, just local storage ;)
*/
/*
Change these settings as need be.
* Load Initial Tab - whether to load the selected tab on page load.
* Loading Text on Initial - whether to display loading text on the initial tab load.
* Loading Text on Tab Change - whether to display loading text on all tab loads.
* Use Custom Font Size - whether to use a custom font size for table elements. N.B. This is only applied to the index.
* Custom Font Size - the custom font size to use, defaults to 15px.
* Cache Timeout - Timeout on the cache (in seconds), set to 0 to force a refresh, please do not leave it at 0.
*
*/
var settings = {
    loadInitialTab: true,
    loadingTextOnInit: true,
    loadingTextOnTabChange: false,
    useCustomFontSize: false,
    customFontSize: "14px",
    cacheTimeout: 240,
    tabIndexStorageName: "hf_tabs_index"
};


/*
MODIFY BELOW AT OWN RISK!
----------------------------
*/

var tabData = [];

var tabNames = {
    1: "Common",
    2: "Hack", // Skip 3 since moved to first tab!
    4: "Tech",
    5: "Code",
    6: "Game",
    7: "Groups",
    8: "Web",
    9: "GFX",
    10: "Market",
    11: "Money",

};
var tabOrder = [
    2, // 1
    1, // 2
    3, // 3
    4, // 4
    6, // 5
    5, // 6
    9, // 7
    8, // 8
    7, // 9
    0, // 10
    3 // 11
];

var currentIndex = parseInt(GM_getValue(settings.tabIndexStorageName, "-1"));
if (currentIndex === -1) {
    // Store first tab.
    GM_setValue(settings.tabIndexStorageName, 2);
    currentIndex = 2;
}
(function() {
    'use strict';
    if (settings.useCustomFontSize) {
        addStyle('table { font-size:' + settings.customFontSize + ' !important }');
    }
    insertTabPages();
})();

function insertTabPages() {

    // Insert before second table.
    $('<ul class="tabs"></ul><br/>').insertBefore('.wrapper > table:nth-of-type(2)');

    var tabs = $('.wrapper > .tabs');

    $(".wrapper > table:nth-of-type(2) > tbody > tr").find("strong > a").each(function() {
        var tabText = $(this).text();
        var tabLink = "https://hackforums.net/" + $(this).attr("href");
        tabData.push({
            originalText: tabText,
            forumLink: tabLink
        });
    });

    for (var x = 0; x < tabOrder.length; x++) {
        var tabText = tabNames[x + 1];
        if (tabText === undefined) {
            continue;
        }

        if (tabOrder[x] === currentIndex) {
            $('.tabs').append('<li class="button current" data-tab="tab-' + tabOrder[x] + '">' + tabText + '</li>');
        } else {
            $('.tabs').append('<li class="button" data-tab="tab-' + tabOrder[x] + '">' + tabText + '</li>');
        }
    }

    $('ul.tabs li').click(function() {
        var tab_id = $(this).attr('data-tab');
        var tabNum = parseInt(tab_id.split('-')[1]);
        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');

        $(this).addClass('current');

        loadTab(tabNum, settings.loadingTextOnTabChange);

        GM_setValue(settings.tabIndexStorageName, tabNum);
    });

    if (settings.loadInitialTab) {
        // First click from loaded tab.
        loadTab(currentIndex, settings.loadingTextOnInit);
    }
}

function loadTab(tabNum, showLoadingText) {

    // Dynamically get content and replace current tab with it.
    var tab = tabData[tabNum];
    var currentTable =  $('.wrapper > table:nth-of-type(2)');

    if (showLoadingText) {
        currentTable.find('tbody').replaceWith("<p style=color:white>Loading...</p>");
    }

    var cacheResult = cacheGet(tab.forumLink);
    if (cacheResult === undefined) {

        // Get contents and add to tab cache, tab cache is stored as local storage.
        getTabContents(tab.forumLink, function(table) {
            // Replace heading with custom.
            table.find('tbody > tr:first-child > td:first-child').attr('align', '').html('<div><strong><a href="' + tab.forumLink + '">' + tab.originalText + '</a></strong></div>');
            cacheSet(tab.forumLink, table);
            currentTable.replaceWith(table);
        });

    } else {
        // Grab from cache.
        var table = $(cacheResult.content);
        currentTable.replaceWith($(table));
    }
}

function getTabContents(url, processTableFunc) {
    // Get the tab content from the url supplied.
    $.get(url)
        .done(function(data) {
        var d = $(data);
        var table = (d.find(".wrapper > table").length >= 2 ? d.find(".wrapper > table:nth-of-type(2)") : d.find(".wrapper > table"));
        processTableFunc(table);
    })
        .fail(function() {
        console.error('Error with request to: ' + url);
    });

}
function addStyle(style) {
    var link = window.document.createElement('style');
    link.innerHTML = style;
    document.getElementsByTagName("HEAD")[0].appendChild(link);
}

// Because fuck you, tampermonkey....
function GM_setValue(name, value) {
    console.debug('Setting value: ' + name + ' to: ' + value);
    localStorage.setItem(name, value);
}
function GM_getValue(name, defaultVal) {
    console.debug('Getting value: ' + name + ' with default value of: ' + defaultVal);
    var res = localStorage.getItem(name);
    return !res ? defaultVal : res;
}
function cacheGet(tabForumLink) {
    console.debug('Grabbing cache for: ' + tabForumLink);
    // Update cache if it is old, simply return undefined if it is in need of an update.
    var cacheRes = localStorage.getItem(tabForumLink);
    if (!cacheRes) {
        console.debug('Failed to find cache for: ' + tabForumLink);
        return undefined;
    }
    try {
        console.debug('Found cache for: '+ tabForumLink);
        var cacheObj = JSON.parse(cacheRes);

        if (getEpoch() > cacheObj.lastUpdate + settings.cacheTimeout) {
            console.debug('Cache expired for: ' + tabForumLink);
            return undefined;
        }
        console.debug('Successfully retrieved cache (expires in ' + ((cacheObj.lastUpdate + settings.cacheTimeout) - getEpoch()) + ' secs) for: ' + tabForumLink);
        return cacheObj;
    }
    catch(err) {
        console.debug('Error for: '+ tabForumLink + ' Err: ' + err);
        return undefined;
    }
}
function cacheSet(tabForumLink, content) {
    var contentHtml = content[0].outerHTML;
    console.debug('Setting cache for: ' + tabForumLink);
    localStorage.setItem(tabForumLink, JSON.stringify({lastUpdate: getEpoch(), content: contentHtml, link: tabForumLink}));
}

function getEpoch() {
    return Math.round((new Date()).getTime() / 1000);
}


addStyle(`ul.tabs{
margin: 0px;
padding: 0px;
list-style: none;
}
ul.tabs li{
display: inline-block;
margin-right:3px;
cursor: pointer;
}
ul.tabs li.current{
color:#ceb0c3;
}
.tab-content{
display: none;
}
.tab-content.current{
display: inherit;
}
/* Bringing back that old button... yay... */
.button {
color: #efefef;
background-color: #7b3c65;
border: 1px solid #000 !important;
box-shadow: 0 1px 0 0 #af5690 inset !important;
-moz-border-radius: 3px;
border-radius: 3px;
padding: 3px 6px;
text-shadow: 1px 1px 0px #000;
text-decoration: none;
font-family: arial;
font-size: 14px;
font-weight: bold;
}
.button:hover {
color: #ceb0c3;
text-decoration:none;
}
`);