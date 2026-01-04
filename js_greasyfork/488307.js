// ==UserScript==
// @name        *arr default sort & filter
// @namespace   https://github.com/Millio345/arr-default-sort-and-filter
/* Since *arr's installation url is different for every user we need to match all links; Script checks for a 'Radarr' metadata tag before actually doing anything */
// @include http://*
// @include https://*
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @version     1.2
// @author      Millio
// @description Sets default sort and filter options for Radarr/Sonarr/...'s interactive search
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488307/%2Aarr%20default%20sort%20%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/488307/%2Aarr%20default%20sort%20%20filter.meta.js
// ==/UserScript==

/* This script allows you to define default sorting and filter for your interactive searches for the arr websites.
As of version 1.1 you no longer need to make any changes to this file.
USAGE:
After installing the extension, visit your Radarr/Sonarr/... installation and click the 'Configure *arr default sort & filter' button which should show up in your Userscript extension's menu on your browser

Problems? Suggestions? Improvements? GitHub at https://github.com/Millio345/arr-default-sort-and-filter

CHANGELOG:
1.2 - Add support for Lidarr, Sonarr, Readarr & Whisparr
1.1 - Move all configuration to UI to prevent users having to override this file with every update. Allow sorting by icon columns by entering the label text you see when moving your mouse over the element (span title)
1.0 - Initial release, basic sort & filter functionality
*/
(function() {
    'use strict';

    /* FUNCTIONS */
    // Sort the table by sortColumn and click "Filter" button if filterName is set
    function clickColumnAndFilter(tableDiv) {
        if(!(sortColumn === null || sortColumn === ""))
        {
            // Find all table headers
            let thElements = tableDiv.getElementsByTagName('th');
            let correctHeaderFound = false
            let headerList = [];
            // Loop through all table headers
            for (let i = 0; i < thElements.length; i++) {
                // Check if this is the table header we want to sort by
                if (thElements[i].textContent.trim().toLowerCase() === sortColumn.toLowerCase()) {
                    correctHeaderFound = true;
                }
                // Not it, let's check if it has a span with the correct title for icon columns
                else if(thElements[i].querySelector('span') && thElements[i].querySelector('span').getAttribute('title').toLowerCase() === sortColumn.toLowerCase()) {
                    correctHeaderFound = true;
                }
                else {
                    if(thElements[i].textContent!==""){
                        headerList.push(thElements[i].textContent);
                    }
                    else if(thElements[i].querySelector('span')){
                        headerList.push(thElements[i].querySelector('span').getAttribute('title'));
                    }
                }

                if(correctHeaderFound){
                    // Click the <th> element
                    thElements[i].click();

                    // If we don't want ascending order, click again
                    if(!sortAscending)
                        thElements[i].click();

                    break; // Stop the loop since we found the target column
                }
            }
            if(!correctHeaderFound){
                console.warn("Sort column '"+sortColumn+"' not found in table headers.")
                console.log("Valid columns: "+headerList.join(','))
            }
        }
        //If no filterName's set, or we've already clicked the filter button for this page load for this movie, this function is done. Otherwise, continue to clicking the filter button
        if(filterName === null || filterName === "" || filterButtonClicked)
            return

        // "Filter" button is first child of tableDiv parent
        let divs = tableDiv.parentElement.getElementsByTagName('div')
        for(let i =0; i < divs.length;i++){
            if(divs[i].className.startsWith('FilterMenu-filterMenu-'))
            {
                let filter = divs[i]
                let button = filter.querySelector('button')
                button.click()
                return;
            }
        }
        console.warn("Filter button not found. Unable to apply filter.");
    }

    // Click the filterName as soon as the filter menu is opened
    function clickChosenFilter(filterListNode) {

        // First make sure filterName is set
        if(filterName === null || filterName === ""){
            return
        }

        // Only click filter button once after opening a modal; Otherwise the user would not be able to override the filter since the script would always take over
        if(filterButtonClicked){
            return
        }

        // Get all filters
        let filters = filterListNode.getElementsByTagName('button')

        // Create a filterList for debug logging in case filter is not found
        let filterList = [];

        for(let i = 0; i < filters.length; i++) {
            let div = filters[i].querySelector('div');
            if(div !== null){
                if(div.textContent.trim()===filterName){
                    // Got the right filter, click it
                    filters[i].click();

                    // Set filterButtonClicked to true
                    filterButtonClicked = true
                    return;
                }
                else
                    filterList.push(div.textContent.trim());
            }
        }
        console.warn("Filter '"+filterName+"' not found in filter list.")
        console.log("Valid filters:"+filterList.join(','));
    }

    // Observe the body element so we know when modal is opened / closed
    function bodyClassChanged(mutationsList, _observer){
        mutationsList.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                // Modal was closed; Set filterButtonClicked to false so we can reclick it next time the modal is opened
                if(!mutation.target.className.includes("Modal-modalOpen")) {
                    filterButtonClicked = false;
                }
            }
        });
    }
    // This function is called by the mutationObserver when additional page content is added. Check if it contains the search table or the filter 'scroller'
    function handleMutations(mutationsList, _observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Check if the added nodes include the target element
                if (mutation.addedNodes) {
                    for (let node of mutation.addedNodes) {
                        // Check if the added node is an element (type 1) which has classes
                        if (node.nodeType === 1 && typeof node.className === 'string')
                        {
                            // Was a tableContainer in a modal added?
                            if(node.className.includes('Table-tableContainer-')&&node.closest("[class^='ModalBody']")) {
                                clickColumnAndFilter(node);
                                return;
                            }
                            // Was a menu scroller added (This is the opened filter list)? Click the chosen filter
                            else if(node.className.includes('MenuContent-scroller-')) {
                                clickChosenFilter(node)
                            }
                        }
                    }
                }
            }
        }
    }

    // Check current page url to see if we're on page with interactive search button or not
    function onPageWithInteractiveSearchButton(arr_type) {
        let pattern;

        // Depending on which arr site we're on we check the url
        if(arr_type==="Lidarr") {
            // artist/albums links end in /(artist|album)/artist-or-album-name
            pattern = /\/(artist|album)\/[\w-]+$/;
        }
        else if(arr_type==="Radarr") {
            // movie links end in /movie/NUMBER
            pattern = /\/movie\/\d+$/;
        }
        else if(arr_type==="Readarr") {

            // author links end in /author/NUMBER
            // Known limitation: The book page does not offer an interactive search modal and is currently not supported; Go to the author page and search from there.
            pattern = /\/author\/\d+$/;
        }
        else if(arr_type==="Sonarr") {

            // series links end in /series/series-name
            pattern = /\/series\/[\w-]+$/;
        }
        else if(arr_type==="Whisparr") {
            // site links end in /site/sitename
            pattern = /\/site\/[\w-]+$/;
        }

        // Return true / false depending on whether we're on a media page
        return pattern.test(window.location.href);
    }


    // When a movie page is loaded, start mutation observers and set filter clicked to false
    function interactiveSearchPageLoaded(){
        filterButtonClicked = false
        observer.observe(document.documentElement, { childList: true, subtree: true });
        body_observer.observe(document.querySelector('body'), { attributes: true, attributeFilter: ['class'], attributeOldValue: true });
    }

    // To prevent unintended consequences on other tables/buttons, stop observer when another page is loaded
    function nonInteractiveSearchPageLoaded(){
        observer.disconnect()
        body_observer.disconnect()
    }
    function loadScript(arr_type)
    {
        // Set Variable prefix to the arr type (f.e. SonarrInteractiveSearchFilterName
        let prefix = arr_type;

        // To prevent breaking changes to previous installations when this script only supported Radarr, Radarr variables don't have a prefix.
        if(prefix==="Radarr"){
            prefix="";
        }
        // Setup GM Config, which provides a nice UI to set the options
        gmc = new GM_config(
            {
                // We need unique id for each site, otherwise all non-specified values will be cleared when saving.
                'id': prefix+'ArrDefaultSortAndFilter',
                "css": `#`+prefix+`ArrDefaultSortAndFilter {background: #2a2a2a;}
                #`+prefix+`ArrDefaultSortAndFilter .field_label {color: #fff;}
                #`+prefix+`ArrDefaultSortAndFilter .config_header {color: #fff; padding-bottom: 10px;}
                #`+prefix+`ArrDefaultSortAndFilter .reset {color: #f00; text-align: center;}
                #`+prefix+`ArrDefaultSortAndFilter .section_header {color: #fff; text-align: left; margin-top: 15px;margin-bottom: 5px; padding:5px;}
                #`+prefix+`ArrDefaultSortAndFilter .section_desc {background: #2a2a2a; color: #fff; text-align: left; border:none;}
                #`+prefix+`ArrDefaultSortAndFilter .config_var {text-align: left;}
                #`+prefix+`ArrDefaultSortAndFilter input { display: block; margin-top:5px; margin-bottom: 20px}
                #`+prefix+`ArrDefaultSortAndFilter .reset_holder {display: none;}`,
                'title': arr_type+' Default Sort and Filter', // Panel Title
                'fields': // Fields object
                    {
                        [prefix+'InteractiveSearchFilterName']: // This is the id of the field
                            {
                                'label': 'Name of default filter to apply (leave empty to disable)', // Appears next to field
                                'section': [GM_config.create('Automatic Filter'), 'Automatically applies a filter when loading interactive search table'],
                                'type': 'text', // Makes this setting a text field
                                'title': 'Enter the name of the filter exactly as you see it in '+arr_type,
                                'default': '' // Default value if user doesn't change it
                            },
                        [prefix+'InteractiveSearchSortColumn']: // This is the id of the field
                            {
                                'label': 'Default interactive search column to sort by (leave empty to disable)', // Appears next to field
                                'section': [GM_config.create('Automatic Sort'), 'If you want the script to automatically apply a filter when loading interactive search, enter the exact name of the filter here'],
                                'title':  'Column title exactly as you see it. For icons enter the value that appears when you move your mouse over the icon.',
                                'type': 'text', // Makes this setting a text field
                                'default': '' // Default value if user doesn't change it
                            },
                        [prefix+'InteractiveSearchSortAscending']: // This is the id of the field
                            {
                                'label': 'Sort Ascending? (Check to sort A-Z / 0 - 9)', // Appears next to field
                                'type': 'checkbox', // Makes this setting a text field
                                'default': false // Default value if user doesn't change it
                            },
                    },
                'events': {
                    'init': () => {
                        // initialization complete, load values
                        filterName = gmc.get([prefix+'InteractiveSearchFilterName']);
                        sortColumn = gmc.get([prefix+'InteractiveSearchSortColumn']);
                        sortAscending = gmc.get([prefix+'InteractiveSearchSortAscending']);
                    },
                    'save': function () { // runs after values are saved
                        // settings may have been changed, reload values
                        filterName = gmc.get([prefix+'InteractiveSearchFilterName']);
                        sortColumn = gmc.get([prefix+'InteractiveSearchSortColumn']);
                        sortAscending = gmc.get([prefix+'InteractiveSearchSortAscending']);
                    }
                }
            });

        // Add configuration menu item to extension
        GM_registerMenuCommand("Configure "+arr_type+" default sort & filter", show_config, "c");

        // Initial page load - Are we on a movie page?
        if(onPageWithInteractiveSearchButton(arr_type))
            interactiveSearchPageLoaded()

        // Code below to detect page change without reload *arr uses - https://stackoverflow.com/questions/6390341/how-to-detect-if-url-has-changed-after-hash-in-javascript
        let oldPushState = history.pushState;
        history.pushState = function pushState() {
            let ret = oldPushState.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        };

        let oldReplaceState = history.replaceState;
        history.replaceState = function replaceState() {
            let ret = oldReplaceState.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        };

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });

        // locationchange event is fired when url is changed thanks to code above
        window.addEventListener('locationchange', function () {
            //Are we on a movie page? Call appropriate function
            if(onPageWithInteractiveSearchButton(arr_type))
                interactiveSearchPageLoaded()
            // When on another page, disable the mutation observer
            else
                nonInteractiveSearchPageLoaded()
        });

    }

    function show_config()
    {
        gmc.open();
    }

    /* END FUNCTIONS */
    // Following code is ran on every single tab so should be kept as light as possible
    // Support all sites listed under Media Automation on https://wiki.servarr.com/
    let supportedSites = ["Lidarr","Radarr","Readarr","Sonarr","Whisparr"];

    // Check if we're on a supported site (site with metadata description 'Radarr'/'Sonarr'/...)
    let description = document.querySelector('meta[name="description"]');

    if(description && supportedSites.includes(description.content)){
        let arr_type=description.content
        console.log(arr_type+" installation found. Watching for interactive search table.")
        // Define some variables for global use through the script
        // Create a new MutationObserver since *arr sites dynamically add elements after pageload
        var observer = new MutationObserver(handleMutations);

        // Observe the body element for changes to the class (= modal opened / closed)
        var body_observer = new MutationObserver(bodyClassChanged);

        // *arr sites uses ajax to change pages; We only want to click the filter button once per movie (otherwise the filter button is completely blocked from user interaction)
        var filterButtonClicked = false;

        // Variable to store gm config
        var gmc;

        // filter and sort options. Variables automatically get populated by the GMC config menu on init
        var filterName;
        var sortColumn;
        var sortAscending;

        // Load the script functionality
        loadScript(arr_type);
    }
})();
