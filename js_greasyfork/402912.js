// ==UserScript==
// @name            Power IMDB：Trakt.tv & YouTube Trailers (Powered by PowerSheet.ai - Free No-Code Creation Platform)
// @author          PowerSheet.ai – Empower the Future of Work | The free 1st intelligent universal #1 no-code/low-code platform | Collaborative creation, modeling, planning, analytics & web extensions | Sign up now free @ https://PowerSheet.ai !
// @copyright       © 2021 PowerSheet.ai – Empower the Future of Work | The free 1st intelligent universal #1 no-code/low-code platform | Collaborative creation, modeling, planning, analytics & web extensions | Sign up now free @ https://PowerSheet.ai !
// @description     "YouTube Trailer" & "View on Trakt.tv" on IMDB navbar for TV & movie rating, watchlist & progress. — Powered by👉🆓 PowerSheet.ai |  The free 1st intelligent universal no-code/low-code platform | Collaborative creation, modeling, planning, analytics & web extensions | Sign up now free @ https://PowerSheet.ai
// @version         2.1.0
// @include         /^https?://(\w+\.)imdb\.com/title//
// @namespace       https://PowerSheet.ai
// @homepageURL     https://PowerSheet.ai/Free-NoCode-App-BI-Excel-Blockchain
// @supportURL      https://PowerSheet.ai/Free-NoCode-App-BI-Excel-Blockchain
// @contributionURL https://PowerSheet.ai/Free-NoCode-App-BI-Excel-Blockchain
// @updateUrl       https://greasyfork.org/scripts/402912-power-imdb-trakt-tv-links-powered-by-powersheet-ai-no-code-app-bi-bot-webext-blockchain-platform
// @license         CC-BY-NC-SA-4.0
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (https://creativecommons.org/licenses/by-nc-sa/4.0/)
// @grant           GM_getValue
// @grant           GM_setValue
// @inject-into     content
// @run-at          document-end
// @priority        1
// @icon            https://static.wixstatic.com/media/4d2eb7_adf8916f24a74cc3934c22130df50a0f%7Emv2.png/v1/fill/w_32%2Ch_32%2Clg_1%2Cusm_0.66_1.00_0.01/4d2eb7_adf8916f24a74cc3934c22130df50a0f%7Emv2.png
// @screenshot      https://greasyfork.org/system/screenshots/screenshots/000/021/114/original/Power-IMDB-Screenshot.jpg?1590285123
// @downloadURL https://update.greasyfork.org/scripts/402912/Power%20IMDB%EF%BC%9ATrakttv%20%20YouTube%20Trailers%20%28Powered%20by%20PowerSheetai%20-%20Free%20No-Code%20Creation%20Platform%29.user.js
// @updateURL https://update.greasyfork.org/scripts/402912/Power%20IMDB%EF%BC%9ATrakttv%20%20YouTube%20Trailers%20%28Powered%20by%20PowerSheetai%20-%20Free%20No-Code%20Creation%20Platform%29.meta.js
// ==/UserScript==
// User Script metadata docs: https://greasyfork.org/en/help/meta-keys (Name limited to 100 char, Description to 500)

// NOTE: Adds "View on Trakt.tv" button with direct link for each movie, TV show and video on IMDB.com so you can browse ratings & reviews, add to watchlists and track what you've watched on Trakt.

// ● Powered by the FREE PowerSheet.ai – the free all-in-one no-code remote collaboration platform for automatic mobile apps, analytics, planning, bots, automation, blockchain databases – in Excel, Microsoft teams, Web Extensions, decentralized PWA, embedded anywhere
// ● Auto-create, collaborate on, sync, automate, publish and embed your own no-code Web 4.0 & mobile smart apps, browser extensions, bots, BI dashboards, spreadsheets, plans, RPA, data connectors and embedded realtime blockchain databases.
// ● Remotely collaborative with easy AI powered analytics, planning, DApp creation, remote work management, assignments, web scraping, RPA, data prep, intelligent automation and realtime remote collaboration with Power Sheet.
// ● Instantly auto publish everywhere as mobile, Web 4.0, Excel, decentralized PWA, desktop, offline and embedded apps.
// ● Collaboratively create and embed in Excel, Microsoft Teams, PowerPoint, SharePoint, web browsers, websites, existing apps and anywhere.
// ● Simultaneously sell and share everywhere with our universal marketplace for smart apps, templates, connectors and content.
// ● Free for unlimited users.  No coding, install, server or IT setup required.
// ● Sign up 🆓 @ 👉 https://PowerSheet.ai.

(async function () {

    //constants:

    const useSettings = true;
    const awaitSavingDefaults = false;
    const debugRegex = false;
    const scriptLogPrefix = '[Power IMDB (User Script)] ';

    //MAYBE: Add setting to include year in YouTube search (but outside of quotes)?

    const traktSearchLink = 'https://trakt.tv/search/imdb?q=';
    const youTubeTrailerSearchLinkBase = 'https://www.youtube.com/results?search_query=';
    const youTubeTrailerSearchLinkSuffix = '+trailer';

    const buttonPadding = '.3rem'; //reduced padding vs. original 1rem for Watchlist etc buttons
    const labelIconPadding = '4px'; //reduced padding vs. original 1rem for Watchlist etc buttons

    let buttonOrderPos = 5; //ensure it's the last button. auto-incremented //8 = after User drop-down, 7 or 6 = after Watchlist, 5 = before Watchlist
    let hideLabels = false;

    try {

        //load user settings and state:

        hideLabels = await loadBoolSetting('hide-labels', false);

        //image constants:

        const traktIconSvg = `<svg id="open-trakt-icon" width="24" height="24" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="-334.1 223.1 347 347" xml:space="preserve">
    <style>.st1{fill:#ed2224}</style><circle cx="-160.6" cy="396.6" r="162.5" fill="#fff"></circle><path class="st1" d="M-256.9 485c23.8 26 58.1 42.2 96.3 42.2 19.5 0 37.9-4.3 54.5-11.9l-90.7-90.5-60.1 60.2z"></path><path class="st1" d="M-197.2 370.1l-68.7 68.5-9.2-9.2 72.3-72.3 84.4-84.4c-13.2-4.5-27.4-7-42.2-7-72.3 0-130.9 58.6-130.9 130.9 0 29.4 9.7 56.6 26.3 78.6l68.5-68.5 4.7 4.5 98.1 98.1c2-1.1 3.8-2.2 5.6-3.6l-108.4-108.4-65.8 65.8-9.2-9.2 75-75 4.7 4.5 114.5 114.2c1.8-1.3 3.4-2.9 4.9-4.3L-196 369.9l-1.2.2z"></path><path d="M-63.4 484.1c20.9-23.1 33.7-53.9 33.7-87.5 0-52.5-31-97.6-75.4-118.5l-82.4 82.1 124.1 123.9zM-155.9 384l-9.2-9.2 64.9-64.9 9.2 9.2-64.9 64.9zm61.5-89.1l-74.7 74.7-9.2-9.2 74.7-74.7 9.2 9.2z" fill="#ed1c24"></path><path class="st1" d="M-160.6 559.1c-89.6 0-162.5-72.9-162.5-162.5s72.9-162.5 162.5-162.5S1.9 307 1.9 396.6-71 559.1-160.6 559.1zm0-308.6c-80.6 0-146.1 65.5-146.1 146.1s65.5 146.1 146.1 146.1 146.1-65.5 146.1-146.1S-80 250.5-160.6 250.5z"></path>
  </svg>`;

        //From: https://developers.google.com/site-assets/logo-youtube.svg
        const youTubeIconSvg = `<svg id="open-youtube-trailer-icon" width="24" height="24" version= xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 158 110" enable-background="new 0 0 158 110" xml:space="preserve">
    <path fill="#f00" d="M154.4,17.5c-1.8-6.7-7.1-12-13.9-13.8C128.2,0.5,79,0.5,79,0.5s-48.3-0.2-60.6,3 c-6.8,1.8-13.3,7.3-15.1,14C0,29.7,0.3,55,0.3,55S0,80.3,3.3,92.5c1.8,6.7,8.4,12.2,15.1,14c12.3,3.3,60.6,3,60.6,3s48.3,0.2,60.6-3 c6.8-1.8,13.1-7.3,14.9-14c3.3-12.1,3.3-37.5,3.3-37.5S157.7,29.7,154.4,17.5z"/>
    <polygon fill="#fff" points="63.9,79.2 103.2,55 63.9,30.8 "/>
  </svg>`;


        //generate HTML for buttons
        const trailerButton = buttonHtml('Trailer', //label
            getYouTubeTrailerSearchLink(), //url
            'Open YouTube trailer video search in new tab', //tooltip
            'open-youtube-trailer',
            youTubeIconSvg
        );
        const traktButton = buttonHtml('Trakt', //label
            getTraktTitleUrl(), //url
            'Open Trakt.tv page for Title', //tooltip
            'open-trakt',
            traktIconSvg
        );
        const linkHtml = trailerButton + traktButton;

        //NOTE: Delay required for IMDB 2021 redesign preview
        await sleep(1000);

        //add button HTML to navbar
        addButtonsToNavBar(linkHtml);

    } catch(e) {
        console.error(scriptLogPrefix + `Error creating or adding buttons or loading settings: `, e);
    }

    //Functions:

    //returns html defining button for the navbar
    function buttonHtml(label, linkUrl, tooltip, idBase, iconSvg) {
        //return empty if no URL defined, to skip this button
        if (!linkUrl) return '';

        return `
    <div id+"${idBase}-div" style="
          order: ${buttonOrderPos};
      ">
        <a id="${idBase}-link" title="${tooltip}" target="_blank" href="${linkUrl}" tabindex="0" class="ipc-button ipc-button--single-padding ipc-button--default-height ipc-button--core-baseAlt ipc-button--theme-baseAlt ipc-button--on-textPrimary ipc-text-button" style="
          padding: 0 ${buttonPadding};
      ">
        ${iconSvg}
    ${hideLabels ? '' : `
        <div class="${idBase}-text ipc-button__text" style="
          padding-left: ${labelIconPadding};
      ">${label}</div>`
    }
        </a>
      </div>
      `;
    }

    // sleep time expects milliseconds
    async function sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    function addButtonsToNavBar(buttonsHtml) {
        if (!buttonsHtml) return;

        //NOTE: Where inserted doesn't matter for button order, only changing buttonOrderPos does.
        //insert as last child of navbar
        let topNav = document.getElementsByClassName('ipc-page-content-container')[0]; //OR: 'navbar__user' or 'imdb-header__watchlist-button'
        if (!topNav) {
            console.error('Could not find navbar to add "View on Trakt.tv" and related buttons to, so adding to bottom of the page instead. May need to update CSS selector due to breaking IMDB changes.');
            topNav = document.body || document.documentElement;
            //Fallback to adding to top or bottom of page?
        }
        topNav.insertAdjacentHTML('beforeEnd', buttonsHtml); //OR: beforebegin or afterend if insert before/after existing nav button (though order doesn't matter)\

    }

    function getTraktTitleUrl() {
        const imdbID = getImdbId();
        return imdbID && (traktSearchLink + imdbID) || '';
    }

    function getYouTubeTrailerSearchLink() {
        let title = getTitle();

        if (!title) return '';
        title = title.replace('"','');
        if (!title) return '';
        title = '"' + title + '"';
        const titleEncoded = escapeForUrl(title);

        //MAYBE: Setting to enable adding year (if parsed) outside of quotes?

        return youTubeTrailerSearchLinkBase + titleEncoded + youTubeTrailerSearchLinkSuffix;
    }

    //parse title of TV series or movie (even from episode, etc. page) from tab title
    function getTitle() {
        const titleMeta = document.querySelector("meta[property='og:title']");
        const tabTitle = titleMeta && titleMeta.getAttribute('content');
        //handles
        //'The Great (TV Series 2020– ) - IMDb',  '"Homecoming" People (TV Episode 2020) - IMDb', "Saw (2013) - IMDb", 'Homecoming - Season 2 - IMDb', etc.
        //All within "Title" if at the start, or up to the last "(", or up to - IMDb suffix, or all of it. Handle possible () and "" inside the title itself too.
        return regexGroup(tabTitle, /^(?:"(.*)"|(.*) \(|(.*) - |(.*))/, true);
    }

    function getImdbId() {
        //get just the number after 'tt' from page URL
        const url = document.location;

        //OR: If viewing an episode, and if episode search fails for most episodes, can hide button
        //But, search by episode works too (for some). Viewing episode changes to episode-only IMDB ID, no way to identify TV show ID.
        //if (/[?&]ref_=tt_ep/.test(url)) return '';

        return regexGroup(url, /\/title\/(tt\d{3,})\//); //OR: 7+ digits
    }


    //Utility functions:

    function escapeForUrl(str) {
        return str && encodeURIComponent(str).replace('%20','+') || '';
    }

    function regexGroup(text, regex, groupNumNameOrNeg1ForFirstMatch, undefInsteadOfEmptyStringForNoMatch) {
        let group;
        if (text && regex) {
            //MAYBE: try, catch & log?

            //get match groups for regex
            const matches = regex.exec(text);

            //regex match debugging:
            if (debugRegex) console.error(scriptLogPrefix + ` Regex debug "${regex} match groups:`, matches);

            if (matches) {
                let groupNum = groupNumNameOrNeg1ForFirstMatch;
                if (groupNum === true) {
                    //return first non-empty group
                    for (let i = 1; i < matches.length; i++) { //start with first match group (not 0, which is entire matching string)
                        group = matches[i];
                        if (group !== undefined) { //or exclude empty string too optionally, eg with param: skipEmptyTextWhenFindingFirst
                            return group;
                        }
                    }
                } else if(typeof(groupNum) === 'string' && groupNum !== '') { //find named group
                    //return a named group:
                    group = matches.group ? matches.groups[groupNum] : undefined;
                } else {
                    //return numbered group, or default to first captured group
                    if (typeof(groupNum) !== 'number' || groupNum < 0) {
                        groupNum = 1; //OR: should we default to 0 for entire matching string? OR: just 0 if negative?
                    }
                    group = matches[groupNum];
                }
            }
        }
        return !undefInsteadOfEmptyStringForNoMatch && group === undefined ? '' : group;
    }

    async function loadNumSetting(name, defaultValOrNeg1, skipSavingDefaultIfNotFound) {
        //OR: Can leave off requiredType param, and auto convert number, etc. to string?
        return loadSetting(name, (defaultValOrNeg1 === undefined ? -1 : defaultValOrNeg1), "number", skipSavingDefaultIfNotFound);
    }
    async function loadStringSetting(name, defaultValOrEmpty, skipSavingDefaultIfNotFound) {
        //OR: Can leave off requiredType param, and auto convert number, etc. to string?
        return loadSetting(name, (defaultValOrEmpty === undefined ? '' : defaultValOrEmpty), "string", skipSavingDefaultIfNotFound);
    }
    async function loadBoolSetting(name, defaultVal, skipSavingDefaultIfNotFound) {
        return loadSetting(name, defaultVal, "boolean", skipSavingDefaultIfNotFound);
    }
    async function loadSetting(name, defaultVal, requiredType, skipSavingDefaultIfNotFound) {

        let value = defaultVal;

        if (useSettings && name) {
            try {
                //load the setting from user script storage which user can see and edit
                value = await GM_getValue(name);
                //NOTE: always converts to/from JSON, so strings appear with quotes around them in Values editor. Editing to empty results in Value entry being deleted.
                //saving undefined is converted to null.

                //check if not the required type, if known
                const notRequiredType = (requiredType && typeof(value) !== requiredType);

                //save default, if none was found already (or was invalid or incorrect type), so user can see it to edit it, and know what is being used
                if ((value === undefined || notRequiredType)) {
                    //use default instead
                    value = defaultVal;
                    if (!skipSavingDefaultIfNotFound) {
                        //save it
                        const saveWaiter = saveSetting(name, value);
                        //optionally wait for saving to finish, if doing sequential testing
                        if (awaitSavingDefaults) await saveWaiter;
                    }
                }

            } catch (er) {
                console.error(scriptLogPrefix + `Failed to load user script setting "${name}" (editable under User Script > "Values" tab) due to error:`, er);
            }
        }
        return value;
    }

    async function saveSetting(name, value) {
        //debug:
        console.warn(scriptLogPrefix + `Saving user setting "${name}" with value "${value}"`);

        if (!useSettings || !name) return;

        try {
            //save the setting, so can users can find and edit under User Script > Values
            //undefined is converted to null. auto converted to/from JSON, so string has quotes around it. empty (ie. invalid) JSON  is auto deleted after user edit
            await GM_setValue(name, value);
        } catch (er) {
            console.error(scriptLogPrefix + `Failed to save user script setting "${name}" with value "${value}" due to error: `, er);
        }
    }


})();
