// ==UserScript==
// @name         Kanka Search Upgrades
// @namespace    http://tampermonkey.net/
// @version      9
// @license      MIT
// @description  Adds the ability to look for user and campaign settings in Kanka’s search field for faster access.
// @author       Salvatos
// @match        https://*.kanka.io/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/437274/Kanka%20Search%20Upgrades.user.js
// @updateURL https://update.greasyfork.org/scripts/437274/Kanka%20Search%20Upgrades.meta.js
// ==/UserScript==

// PREFERENCES
const requireSettingsSwitch = true; // Set to false to always show matching settings, or true to require the character below to trigger settings search
const settingsSwitch = "#"; // If the above is true, settings search only happens when your query starts with this character (must be a single character)

GM_addStyle(`
#content-search-prompt {
}
#content-search-prompt:hover {
}
#content-search-prompt a {
	color: var(--search-cursor-text) !important;
}
#matched-settings a {
	display: inline;
	color: var(--link-text) !important;
	padding: 0;
    font-size: 13px;
    text-decoration: underline;
}
`);

// Prepare base URLs for this campaign/user
const campaignPath = location.pathname.split("/", 3);
const campaignId = campaignPath[2];
let campaign = location.origin + "/w/" + campaignId;
let settings = location.origin + "/settings";

// Define settings pages (no need to add words from the title to the keywords)
const settingsPages = [
    // User settings
    {
        title: "User settings",
        keywords: "personal preferences",
        url: `${settings}/appearance`
    },
    {
        title: "User-preferred theme",
        keywords: "dark light midnight",
        url: `${settings}/appearance`
    },
    {
        title: "Pagination",
        keywords: "page results per",
        url: `${settings}/appearance`
    },
    {
        title: "Date format",
        keywords: "",
        url: `${settings}/appearance`
    },
    {
        title: "Campaign switcher sorting order",
        keywords: "list",
        url: `${settings}/appearance`
    },
    {
        title: "New entity workflow",
        keywords: "create creation",
        url: `${settings}/appearance`
    },
    {
        title: "Text editor",
        keywords: "summernote tinymce",
        url: `${settings}/appearance`
    },
    {
        title: "Entity list layout",
        keywords: "default grid table entities",
        url: `${settings}/appearance`
    },
    {
        title: "Entity list nesting (user)",
        keywords: "default flat nested entities tree view",
        url: `${settings}/appearance`
    },
    {
        title: "Advanced mentions",
        keywords: "",
        url: `${settings}/appearance`
    },
    {
        title: "Notifications",
        keywords: "updates news subscriptions",
        url: `${settings}/newsletter`
    },
    {
        title: "Profile",
        keywords: "privacy name username avatar picture",
        url: `${settings}/profile`
    },
    {
        title: "Subscription",
        keywords: "tier level subscribe upgrade downgrade kobold owlbear elemental wyvern patreon",
        url: `${settings}/subscription`
    },
    {
        title: "Boosters",
        keywords: "boosted campaigns boost superboost superboosted premium",
        url: `${settings}/boosters`
    },
    {
        title: "Premium campaigns",
        keywords: "boost campaigns premium",
        url: `${settings}/premium`
    },
    {
        title: "Payment method",
        keywords: "credit card paypal currency",
        url: `${settings}/billing/payment-method`
    },
    {
        title: "Billing",
        keywords: "invoices history",
        url: `${settings}/billing/history`
    },
    {
        title: "App integration",
        keywords: "sync discord",
        url: `${settings}/apps`
    },
    {
        title: "API",
        keywords: "key token",
        url: `${settings}/api`
    },
    // Campaign
    {
        title: "Campaign overview and settings",
        keywords: "edit delete settings",
        url: `${campaign}/overview`
    },
    // Main settings form
    {
        title: "Basic campaign configuration",
        keywords: "name description image picture settings",
        url: `${campaign}/edit#tab_form-entry`
    },
    {
        title: "Vanity URL",
        keywords: "custom personalized address domain",
        url: `${campaign}/edit#tab_form-entry`
    },
    {
        title: "Campaign visibility",
        keywords: "public private",
        url: `${campaign}/edit#tab_form-public`
    },
    {
        title: "Campaign language",
        keywords: "language locale",
        url: `${campaign}/edit#tab_form-public`
    },
    {
        title: "Game system",
        keywords: "rpg",
        url: `${campaign}/edit#tab_form-public`
    },
    {
        title: "Campaign-enforced theme",
        keywords: "light dark midnight",
        url: `${campaign}/edit#tab_form-ui`
    },
    {
        title: "Member list visibility",
        keywords: "users members privacy",
        url: `${campaign}/edit#tab_form-ui`
    },
    {
        title: "Entity history log visibility",
        keywords: "",
        url: `${campaign}/edit#tab_form-ui`
    },
    {
        title: "Entity image in tooltips",
        keywords: "",
        url: `${campaign}/edit#tab_form-ui`
    },
    {
        title: "Default entity connections display",
        keywords: "explorer list relations",
        url: `${campaign}/edit#tab_form-ui`
    },
    {
        title: "Default filtering of entity descendants",
        keywords: "sublist direct indirect hierarchy children child",
        url: `${campaign}/edit#tab_form-ui`
    },
    {
        title: "Entity list layout (campaign)",
        keywords: "default flat nested entities tree view",
        url: `${campaign}/edit#tab_form-ui`
    },
    {
        title: "New posts collapsed by default",
        keywords: "",
        url: `${campaign}/edit#tab_form-ui`
    },
    {
        title: "Default permissions for new entities and elements",
        keywords: "visibility entity",
        url: `${campaign}/edit#tab_form-permission`
    },
    {
        title: "Dashboard header text and image",
        keywords: "",
        url: `${campaign}/edit#tab_form-dashboard`
    },
    // Other campaign options
    {
        title: "Export campaign",
        keywords: "JSON",
        url: `${campaign}/campaign-export`
    },
    {
        title: "Recover deleted entities",
        keywords: "recovery restore archive",
        url: `${campaign}/recovery`
    },
    {
        title: "Achievements",
        keywords: "campaign stats",
        url: `${campaign}/achievements`
    },
    {
        title: "Member list",
        keywords: "members users invite",
        url: `${campaign}/campaign_users`
    },
    {
        title: "Campaign membership applications",
        keywords: "public open request join",
        url: `${campaign}/campaign_submissions`
    },
    {
        title: "User roles",
        keywords: "groups permissions players",
        url: `${campaign}/campaign_roles`
    },
    {
        title: "Modules (entity types)",
        keywords: "features enable disable rename icons categories",
        url: `${campaign}/modules`
    },
    {
        title: "Marketplace plugins",
        keywords: "enable disable themes character sheets content packs",
        url: `${campaign}/plugins`
    },
    {
        title: "Default entity thumbnails",
        keywords: "images icons fallback",
        url: `${campaign}/default-images`
    },
    {
        title: "Theming (campaign styles)",
        keywords: "theme css style sheet customize appearance skin look",
        url: `${campaign}/campaign_styles`
    },
    {
        title: "Theme builder (color palette)",
        keywords: "theme builder css colors colours palette customize skin",
        url: `${campaign}/theme-builder`
    },
    {
        title: "Sidebar setup",
        keywords: "custom names links menu navigation order icons",
        url: `${campaign}/sidebar-setup`
    },
    {
        title: "Bookmarks",
        keywords: "custom quick links menu shortcuts",
        url: `${campaign}/bookmarks`
    },
    {
        title: "Campaign stats",
        keywords: "facts info count number",
        url: `${campaign}/stats`
    }
];

// On input, update link
$("#entity-lookup").on("input", updSugg);

function updSugg() {
    let searchtext = $("#entity-lookup").val();

    // Create a container for the dropdown
    if ($("#content-search-prompt").length == 0) {
        $(".search-recent .grow")[0].insertAdjacentHTML("afterbegin", "<div id='content-search-prompt' class='italic m-2 rounded p-1 hover:lookup-entity'></div>");
    }

    // Look for matching settings pages if desired, as indicated by the first character or preferences
    if (requireSettingsSwitch === false || searchtext.substr(0,1) === settingsSwitch) {
        searchtext = searchtext.substr(1);
        // match anything in title:
        let titleMatches = settingsPages.filter(element => element.title.toLowerCase().match(searchtext.toLowerCase()));
        // match anything in keywords:
        let keywordMatches = settingsPages.filter(element => element.keywords.toLowerCase().match(searchtext.toLowerCase()));
        // match whole words only in keywords:
        //let keywordMatches = settingsPages.filter(element => element.keywords.toLowerCase().split(" ").includes(searchtext.toLowerCase()));
        // combine and remove duplicates:
        let allMatches = Array.from(new Set(titleMatches.concat(keywordMatches)));

        // Make links for matches
        if (allMatches.length > 0) {
            let listOfPages = `<div id='matched-settings' class=''>Your search matches the following settings:<ul>`;
            allMatches.forEach(function (item) {
                listOfPages += `<li><a href='${item.url}'>${item.title}</a></li>`;
            });
            // Remove last separator and close div
            listOfPages = listOfPages.substring(0, listOfPages.length -3) + `</ul></div>`;

            // Insert or refresh suggestions
            $("#content-search-prompt").html(listOfPages);
        }
        else {
            // If we showed results previously but no longer match anyhing, remove the previous suggestions
            try {
                $("#matched-settings").remove();
            }
            catch (e) {
            }
        }
    }
    else {
        // If we showed results previously but no longer match anyhing, remove the previous suggestions
        try {
            $("#matched-settings").remove();
        }
        catch (e) {
        }
    }
}