// ==UserScript==
// @name         DeviantArt Search Galleries and Favorites
// @namespace    http://tampermonkey.net/
// @version      0.3.4
// @description  Creates a search function that works on artist galleries and favorites collections. Search by deviation title and artist name. Numerous sorting options.
// @author       corepower
// @match        https://www.deviantart.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deviantart.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456613/DeviantArt%20Search%20Galleries%20and%20Favorites.user.js
// @updateURL https://update.greasyfork.org/scripts/456613/DeviantArt%20Search%20Galleries%20and%20Favorites.meta.js
// ==/UserScript==

(function() {
    'use strict';

/////////////////////////////////////////////////////////
////// Default User Preference Variables           //////

    // Maximum search return: Maximum number of results that will tile after a search. This can be set as large as you like, but the page may slow down.
    // Possibly even consider lowering it if things are laggy while searching.
    let maximumsearchreturn = 1000;

    // Sort by: based on setting, search results will be sorted based on description in the value. The "sortoptions" array holds the possible options for sorting.
    // The "Default" option is based on date added to the collection. Matches DeviantArt default.
    const sortoptions = ["Default", "Post Date(Desc)", "Post Date(Asc)", "Title(Desc)", "Title(Asc)", "Artist(Desc)", "Artist(Asc)", "Favorites(Desc)", "Favorites(Asc)", "Views(Desc)", "Views(Asc)"];
    let sortby = sortoptions[0];

    // Pagination rate limit: the amount of time, in seconds to delay downloading gallery/collection page results during search indexing.
    // Can be set to 0 but if lots of large galleries are indexed, DeviantArt may automatically temp ban your account/IP.
    // Note: Multiple searches on a single page will not rerun the index, therefore unlimited searches may be run on a single page without consequence as long as the page is not navigated or refreshed. 
    let paginationratelimit = 1.0;

    // Rate limit warning: If true, puts a warning message in the search output text while indexing about rate limits if the rate limit is under two seconds on a large search.
    // Set to false to disable warning.
    let ratelimitwarning = true;

    // Pivotal row height: height, in pixels, that the dynamic deviation tiles will be based around. Tiles will be this tall or larger.
    let pivotalrowheight = 280;

//// End Default User Preference Variables         //////
/////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////
////// Desired Features List - NOT YET IMPLEMENTED //////

// These features may come in future versions.

// * Navigate within DeviantArt and reset search capability based on new page (partially implemented)
// * Dynamic tile visibility so that any number of search results can be efficiently displayed without slowing down the page.
// * Dynamic re-tiling on viewport size change
// * React framework tie-ins for things like element creation, event listeners, and deviation favoriting. This may not be feasible. I don't know React.

////// End Desired Features List                   //////
/////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////
////// Other Constants                             //////

//Define constants for text style toggles
const regularblacktextcolor = "black";
const regularwhitetextcolor = "rgb(242, 242, 242)";
const warningtextcolor = "orange";
const errortextcolor = "red";

// Preferred size: this is a named identifier for a size of DeviantArt generated thumbnails. Larger numbers are generally higher quality.
// Set this variable based on your internet speed or personal preference.
// Choose a value from amongst the following list: ["92S", "150", "200H", "300W", "375W", "414W", "250T", "350T","400T", "preview", "social_preview"]
const preferredsize = "350T";

// Tile margin: margin between deviation tiles, in pixels. DeviantArt uses 4 pixels, don't know why you would change this but you can.
const tilemargin = 4;

// Debug: debug flag turns on various console outputs for debugging. Outputs may or may not make sense, they were added as needed.
const debug = false;

////// End Other Constants                         //////
/////////////////////////////////////////////////////////



//Special event listener for React-style internal navigation
//Credit to Raja Osama: https://rajaosama.me/blogs/detect-react-route-change-in-vanilla-js
//Re-run entire script after this type of navigation
let monitored_url = location.href;
document.body.addEventListener('click', ()=>{
    requestAnimationFrame(()=>{
        if(monitored_url!==location.href){
                let old_url = monitored_url;
                monitored_url = location.href

                //DEBUG
                if(debug && false) console.log('url changed to: ', monitored_url);

                //Check for specific case where navigation is between Galleries and Favorites on a single artist

                let old_url_parts = old_url.split("/");
                let monitored_url_parts = monitored_url.split("/");

                //Disregard these base path type of /artist
                if(old_url_parts.length < 5 || monitored_url_parts.length < 5)
                    return;

                //Check for if navigations from gallery -> favourite or favourite -> gallery
                let is_old_url_favourite = old_url_parts[4] == "favourites";
                let is_new_url_favourite = monitored_url_parts[4] == "favourites";
                if( is_old_url_favourite ? !is_new_url_favourite : is_new_url_favourite ) {

                    return;
                    //TODO modify main script execution for this type of internal navigation then enable observer by uncommenting code below
                    //set observer on this element to load
                    // waitForElm('._3h7d3').then((elm) => {
                    //     if(debug && true) console.log('Element ._3h7d3 is ready');
                    //     //executeScript();
                    // });
                }
                else { //not a problem navigation, run script regularly
                    executeScript();
                }
        }
    });
}, true);

//DEBUG
if(debug && false) console.log("Entrypoint ready state: ", document.readyState);
if(debug && false) document.addEventListener('readystatechange', () => console.log("Ready state change: ", document.readyState));


//Page needs to be fully loaded for script to work
if(document.readyState == "loading" || document.readyState == "interactive")
    window.addEventListener('load',executeScript);
else
    executeScript();


//Function wrapper for the entire script to enable document readiness check above, as well as for re-running after React-style navigation events
function executeScript() {
    
    //DEBUG
    if(debug && false) console.log("Entered script execution.");
    if(debug && false) console.log("Internal entrypoint ready state: ", document.readyState);


//Pull in existing user preference settings to globals, re-store to confirm all of them exist in localStorage. Use global variables for get() actions, update globals and localStorage with set() actions.
    getUserPreferencesFromLocalStorage();


//Only execute script on gallery pages, otherwise return immediately
    let pathparts = window.location.pathname.split("/");
    if(pathparts.length < 3) {
        return;
    }
    if(pathparts[2] != "gallery" && pathparts[2] != "favourites") {
        return;
    }


//Creating and adding this search element structure to the DOM
//<div class="_1hkGk DRK5r _1bp4v">
//    <span class="DLN_H">
//        <span class="z8jNZ _1yoxj _2F1i2">
//            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                <path d="M19 11a8 8 0 10-3.095 6.32l3.63 3.63.095.083a1 1 0 001.32-1.498l-3.63-3.63A7.965 7.965 0 0019 11zM5 11a6 6 0 1112 0 6 6 0 01-12 0z"></path>
//            </svg>
//        </span>
//    </span>
//    <input type="text" class="aFKMF _3kAA3 _2KZ9p" aria-invalid="false" id="search-gallery" autocomplete="off" placeholder="Search Gallery" value="">
//</div>

    let searchparentparent = document.getElementsByClassName("_3h7d3")[0];

    let searchparent = document.createElement("div");
    searchparent.className = "_1hkGk DRK5r _1bp4v";
    searchparent.style.width = "350px";

    let searchiconparentparent = document.createElement("span");
    searchiconparentparent.className = "DLN_H";

    let searchiconparent = document.createElement("span");
    searchiconparent.className = "z8jNZ _1yoxj _2F1i2";

    var searchicon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    searchicon.setAttribute("viewBox", "0 0 24 24");

    var searchiconpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    searchiconpath.setAttribute("d", "M19 11a8 8 0 10-3.095 6.32l3.63 3.63.095.083a1 1 0 001.32-1.498l-3.63-3.63A7.965 7.965 0 0019 11zM5 11a6 6 0 1112 0 6 6 0 01-12 0z");

    let searchelement = document.createElement('input');
    searchelement.type = 'text';
    searchelement.className = 'aFKMF _3kAA3 _2KZ9p';
    searchelement.setAttribute('aria-invalid', 'false');
    searchelement.id = 'search-gallery';
    searchelement.autocomplete = 'off';
    searchelement.placeholder = 'Search Gallery';
    searchelement.value = '';

    searchicon.appendChild(searchiconpath);
    searchiconparent.appendChild(searchicon);
    searchiconparentparent.appendChild(searchiconparent);

    searchparent.appendChild(searchiconparentparent);
    searchparent.appendChild(searchelement);

    //Create search results text output and put it next to the search box
    let searchoutputtext = document.createElement("span");
    searchoutputtext.style.margin = "8px";
    searchoutputtext.style.maxWidth = "1000px";

    searchparentparent.appendChild(searchoutputtext);
    searchparentparent.appendChild(searchparent);


    //Create Settings Cog. Minified because we don't need access to any of the inner elements.
    let settingscogdiv = document.createElement("div");
    settingscogdiv.style.position = "relative";
    settingscogdiv.id = "settingscog";
    settingscogdiv.innerHTML = '<span class="DLN_H"><span class="z8jNZ _1yoxj _2F1i2"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="width: 26px;height: 26px;padding-left: 8px;color: #d9d9d9;padding-right: 4px;" xml:space="preserve"><g><g><path d="M451.528,198.531c-4.088-13.938-9.657-27.369-16.645-40.14l42.774-42.773l-81.273-81.274l-42.774,42.773c-12.771-6.987-26.201-12.557-40.14-16.644V0H198.531v60.472c-13.939,4.088-27.369,9.657-40.14,16.644l-42.774-42.773l-81.273,81.274l42.774,42.773c-6.988,12.771-12.558,26.202-16.645,40.14H0v114.939h60.472c4.088,13.938,9.657,27.369,16.645,40.14l-42.774,42.773l81.273,81.274l42.774-42.773c12.771,6.987,26.201,12.557,40.14,16.644V512h114.939v-60.472c13.939-4.088,27.369-9.657,40.14-16.644l42.774,42.773l81.273-81.274l-42.774-42.773c6.988-12.771,12.558-26.202,16.645-40.14H512v0V198.531H451.528z M480.653,282.122h-53.755l-2.769,12.204c-4.301,18.952-11.756,36.932-22.158,53.441l-6.672,10.589l38.026,38.025l-36.942,36.942l-38.027-38.026l-10.589,6.672c-16.507,10.402-34.487,17.856-53.44,22.157l-12.204,2.771v53.755h-52.245v-53.755l-12.205-2.77c-18.953-4.301-36.933-11.755-53.44-22.157l-10.589-6.672l-38.027,38.026l-36.941-36.943l38.027-38.026l-6.672-10.589c-10.402-16.508-17.857-34.489-22.158-53.441l-2.77-12.203H31.347v-52.245h53.755l2.769-12.204c4.301-18.952,11.756-36.932,22.158-53.441l6.672-10.589l-38.026-38.025l36.942-36.942l38.027,38.026l10.589-6.672c16.507-10.402,34.487-17.856,53.44-22.157l12.204-2.771V31.347h52.245v53.755l12.205,2.77c18.953,4.301,36.933,11.755,53.44,22.157l10.589,6.672l38.027-38.026l36.942,36.942L395.3,153.643l6.672,10.589c10.402,16.508,17.857,34.489,22.158,53.441l2.769,12.204h53.755V282.122z"></path></g></g><g><g><path d="M256,135.837c-66.258,0-120.163,53.905-120.163,120.163c0,66.258,53.905,120.163,120.163,120.163c66.258,0,120.163-53.905,120.163-120.163S322.258,135.837,256,135.837z M256,344.816c-48.973,0-88.816-39.843-88.816-88.816s39.843-88.816,88.816-88.816s88.816,39.843,88.816,88.816S304.973,344.816,256,344.816z"></path></g></g></svg></span></span>'
    //Create toggleable settings menu
    let settingsmenudiv = createSettingsMenu();


    searchparentparent.appendChild(settingscogdiv);


//Add event listeners
    searchelement.addEventListener("focus", buildIndex, {once : true});
    searchelement.addEventListener("keyup", search);
    settingscogdiv.firstChild.addEventListener("click", toggleSettingsElement);
    document.addEventListener("click", hideSettingsElement);


//define persistent globals for search indexing
    const csrftoken = window.__CSRF_TOKEN__;
    const artist_friendly_id = pathparts[1];//from the early URL path deconstruction

    let deviations;//this will be objects to index search with
    let matchingdeviations;//this will be objects that match the search

    let initialstatescripttext;
    let initialstatematch;
    let i = 0;
    while(initialstatematch == null) {
        initialstatescripttext = document.getElementsByTagName("script")[i].innerHTML;
        initialstatematch = initialstatescripttext.match(/\.__INITIAL_STATE__\s*=\s*JSON\.parse\(("[^\n]+")/);
        i++;
    }
    if(initialstatematch.length < 2) {
        console.error("DeviantArt Gallery Search Userscript Error: Could not parse script tag for __INITIAL_STATE__")
        searchelement.placeholder = 'Script Error';
        return;
    }
    let initialstateJSON = JSON.parse(eval(initialstatematch[1]));
    //console.log(initialstateJSON);

    let isgallery = pathparts[2] == "gallery";

    let collectionorgalleryfoldername = isgallery ? "galleryFolder" : "collectionFolder";
    let foldersJSON = initialstateJSON["@@entities"][collectionorgalleryfoldername];
    //console.log(foldersJSON);

    let isallfolder = false;
    if(pathparts.length >= 4 && pathparts[3] == "all") {
        isallfolder = true;
    }
    
    let folderid = "-1";// folder id of "-1" corresponds to "All" gallery
    let gallerysize = 0;
    if(!isallfolder) {
        //Get folder id from current url as most up-to-date source, else default assigned folder id from initial state
        //TODO this is imperfect. Fails if internal React navigation between galleries and favorites is initiated.
        if(pathparts.length >= 4) {
            folderid = pathparts[3];
        }
        else {//Featured or imperfect navigation, for now just handle featured
            
            for(let folder in foldersJSON) {
                if(foldersJSON[folder].name == "Featured"){
                    folderid = folder;
                    break;
                }
            }
            //folderid = initialstateJSON["gallectionSection"]["currentlyViewedFolderId"];
        }
    }
    gallerysize = foldersJSON[folderid]["totalItemCount"];


    //construct reuseable gallery pagination api string pieces
    let paginationstring_base = "https://www.deviantart.com/_napi/da-user-profile/api/" 
        + (isgallery ? "gallery" : "collection") 
        + "/contents?username=" + artist_friendly_id 
        + "&csrf_token=" + csrftoken 
        + (isallfolder ? "&all_folder=true" : "&folderid=" + folderid) 
        + "&limit=60&offset=";


    //Get remaining UI elements needed for reference
    let itemscontainer = document.getElementsByClassName("RMUi2")[0];
    let searchitemscontainer = itemscontainer.cloneNode();
    
    itemscontainer.parentNode.appendChild(searchitemscontainer);

    let viewportwidth;
    searchelement.addEventListener("focus", setViewportWidth);

    //Create cloneable deviation elements, one for each type. Clone operations are faster?
    var cloneableimagedeviationelement = createCloneableImageDeviationElement();
    var cloneableliteraturedeviationelement = createCloneableLiteratureDeviationElement();
    var cloneablejournaldeviationelement = createCloneableJournalDeviationElement();


//This function indexes the gallery to be searched on textbox focus
    async function buildIndex() {
        searchelement.placeholder = 'Building Search Index...';
        searchelement.blur();
        searchelement.setAttribute('readonly', 'readonly');

        //DEBUG indexing performance
        let starttime; 
        if(debug && true) {
            starttime = performance.now();
        }

        let currentoffset = 0;
        let paginated_urls = [];
        while(currentoffset < gallerysize) {
            let currentpaginationurl = paginationstring_base + currentoffset;
            paginated_urls.push(currentpaginationurl);

            currentoffset += 60;//60 is maximum pagination
        }
        //DEBUG
        if(debug && false) console.log(paginated_urls);

        await concatenateJson(paginated_urls)
        .then(concatenatedJson => {
            //prepare indexable items by making them lowercase
            let lowercasejson = concatenatedJson;
            for(let i=0; i< lowercasejson.length; i++) {
                let deviation = lowercasejson[i].deviation;
                compileGSVariables(deviation, i);
                trimFat(deviation);
            }
            
            deviations = lowercasejson;
            sort();
        });

        searchelement.removeAttribute('readonly');
        searchelement.focus();
        searchelement.placeholder = 'Search Gallery';

        //DEBUG indexing performance
        let endtime; 
        if(debug && true) {
            endtime = performance.now();
            console.log("Indexing took " + (endtime - starttime) + " milliseconds for " + paginated_urls.length + " page" + (paginated_urls.length == 1 ? "." : "s."))
        }
    }

//Basic JSON fetch from URL function
    async function fetchJson(url) {
        // Use the fetch API to download the URL
        const response = await fetch(url);

        // Parse the JSON result from the response
        const json = await response.json();

        return json;
    }

//Fetch all jsons then concatenate
   async function concatenateJson(urls) {
        let results = [];

        //Convert user preference on rate limit to useable millisecond value
        let waitmilliseconds = Math.ceil(paginationratelimit * 1000);

        let pagedownloadestimate = paginationratelimit + 0.306;// 306 milliseconds based on average download test
        let friendlytimeremaing = pagedownloadestimate * urls.length;

        if(urls.length > 30 && paginationratelimit < 2.0 && ratelimitwarning) {
            searchoutputtext.style.color = warningtextcolor;
            searchoutputtext.innerText = "This is a large gallery to search. If you run searches like this frequently, " 
                + "consider raising the rate limit to 2 seconds or longer to avoid DeviantArt temp bans. "
                + "Rate limits can be changed and this warning can be turned off in the settings next to the search box.";
        }

        // Loop through the URLs
        for (let i=0; i<urls.length; i++) {
     
            //Show rough indexing time remaining to the user. The bulk of the indexing time comes from this rate limited function
            if(urls.length != 1) {
                searchelement.placeholder = 'Building Search Index... (' + Math.ceil(friendlytimeremaing) + " seconds remaining)";

                //DEBUG
                if(debug && false) console.log("Time remaining: " + friendlytimeremaing);

                friendlytimeremaing -= pagedownloadestimate;
            }

            //Set wait time between JSON fetches, only if there is a "between" to begin with. Also only do this if rate limit is not 0.
            if(i > 0 && waitmilliseconds != 0) {
                //DEBUG
                if(debug && false) console.log("Waiting " + waitmilliseconds + " milliseconds.");

                await new Promise(resolve => setTimeout(resolve, waitmilliseconds));
            }

            //DEBUG
            if(debug && false) console.log("Download round " + i);

            // Download the current URL and concatenate the JSON result
            let response = await fetchJson(urls[i]);
            let json = response.results;
            results = results.concat(json);
        }

        //Reset output text after possible rate limit warning.
        searchoutputtext.style.color = regularwhitetextcolor;
        searchoutputtext.innerText = "";

        return results;
    }

//Perform onetime calculations on deviation objects for indexing, searching, and rendering tasks
    function compileGSVariables(deviation, index)
    {
        deviation.gs_username = deviation.author.username.toLowerCase();
        deviation.gs_title = deviation.title.toLowerCase().trim();
        deviation.gs_default_order = index;
        deviation.gs_favorites = deviation.stats.favourites;
        deviation.gs_views = deviation.stats.views;

        //Convert datetime to unix milliseconds and store
        const pubDate = new Date(deviation.publishedTime )
        deviation.gs_published_time = pubDate.getTime();

        //Collect static thumbnail meta info. easier to do once
        for(let i=0; i<deviation.media.types.length; i++) {
            if(deviation.media.types[i].t == preferredsize) {
                deviation.gs_thumb_path_string = deviation.media.types[i].c;
                deviation.gs_thumb_width = deviation.media.types[i].w;
                deviation.gs_thumb_height = deviation.media.types[i].h;
                break;
            }
        }

        //Set text-based deviations to have square tiles
        if(deviation.type == "journal" || deviation.type == "literature" || deviation.type == "status") {
            deviation.gs_thumb_width = 300;
            deviation.gs_thumb_height = 300;
        }
    }

//Reduce deviation object memory usage, hopefully speeds up searches
    function trimFat(deviation)
    {
        delete deviation.author.isGroup;
        delete deviation.author.isNewDeviant;
        delete deviation.author.isSubscribed;
        delete deviation.author.isWatching;
        delete deviation.author.type;
        delete deviation.author.userId;
        delete deviation.author.useridUuid;

        delete deviation.blockReasons;
        delete deviation.deviationId;
        delete deviation.hasNft;
        delete deviation.hasPrivateComments;
        delete deviation.isAdoptable;
        delete deviation.isAiUseDisallowed;
        delete deviation.isAntisocial;
        delete deviation.isBackgroundEditable;
        delete deviation.isBlocked;
        delete deviation.isCommentable;
        delete deviation.isDailyDeviation;
        delete deviation.isDeleted;
        delete deviation.isDownloadable;
        delete deviation.isDreamsofart;
        delete deviation.isFavouritable;
        delete deviation.isFavourited;
        delete deviation.isJournal;
        delete deviation.isMature;//TODO add to filter option section?
        delete deviation.isNsfg;
        delete deviation.isPublished;
        delete deviation.isShareable;
        delete deviation.isTextEditable;
        delete deviation.isVideo;
        delete deviation.legacyTextEditUrl;
        delete deviation.matureLevel;

        //delete deviation.media.

        delete deviation.printId;
    }

//Searches through deviations array on keyup event
    function search() {
        //DEBUG indexing performance
        let starttime; 
        if(debug && true) {
            starttime = performance.now();
        }

        let currentsearchtext = searchelement.value.toLowerCase();
        //DEBUG
        if(debug && true) console.log("Searching: " + currentsearchtext);

        //Restore gallery visibility and abort if search goes inactive
        if(currentsearchtext == "") {
            itemscontainer.style.display = "";
            searchitemscontainer.style.display = "none";
            searchoutputtext.innerText = "";
            return;
        }   
        
        //hide original gallery, show custom search gallery
        itemscontainer.style.display = "none";
        searchitemscontainer.style.display = "";

        //search
        let resultsarray = [];
        for(let i=0; i< deviations.length; i++) {
            let deviation = deviations[i].deviation;

            if(deviation.gs_username.includes(currentsearchtext)) {
                resultsarray.push(deviation);
                continue;
            }
            if(deviation.gs_title.includes(currentsearchtext)) {
                resultsarray.push(deviation);
                continue;
            }
        }

        matchingdeviations = resultsarray;

        //Now display based on results
        if(resultsarray.length == 0) {
            searchoutputtext.innerText = "No results.";
            return;
        }

        //DEBUG
        if(debug && false) console.log("Results:", matchingdeviations);

        if(resultsarray.length > maximumsearchreturn) {
            searchoutputtext.innerText = resultsarray.length + " results. Too many for display. (Maximum is set to " + maximumsearchreturn + " results)";
            return;
        }

        searchoutputtext.innerText = resultsarray.length + " result" + (resultsarray.length == 1 ? "." : "s.");

        assignTileDimensions();
        tileElements();

        //DEBUG indexing performance
        let endtime; 
        if(debug && true) {
            endtime = performance.now();
            console.log("Searching and rendering took " + (endtime - starttime) + " milliseconds for " + deviations.length + " items.");
        }

        //DEBUG sort order
        if(debug && false) {
            console.log("-----------")
            for(let i=0; i<matchingdeviations.length; i++) {
                console.log(matchingdeviations[i].gs_default_order);
            }
        }
    }

//Sorts all deviations in the collection based on "sortby" option 
    var lastsort;
    function sort() {
        //avoid re-sorting when list is already sorted for a given sorting option
        if(sortby == lastsort)
            return;
        lastsort = sortby;

        if(sortby == "Default") {
            deviations = sortDeviationsByKey(deviations, "gs_default_order", true);
        }
        else if(sortby == "Post Date(Desc)") {
            deviations = sortDeviationsByKey(deviations, "gs_published_time", false);
        }
        else if(sortby == "Post Date(Asc)") {
            deviations = sortDeviationsByKey(deviations, "gs_published_time", true);
        }
        else if(sortby == "Title(Desc)") {
            deviations = sortDeviationsByKey(deviations, "gs_title", false);
        }
        else if(sortby == "Title(Asc)") {
            deviations = sortDeviationsByKey(deviations, "gs_title", true);
        }
        else if(sortby == "Artist(Desc)") {
            deviations = sortDeviationsByKey(deviations, "gs_username", false);
        }
        else if(sortby == "Artist(Asc)") {
            deviations = sortDeviationsByKey(deviations, "gs_username", true);
        }
        else if(sortby == "Favorites(Desc)") {
            deviations = sortDeviationsByKey(deviations, "gs_favorites", false);
        }
        else if(sortby == "Favorites(Asc)") {
            deviations = sortDeviationsByKey(deviations, "gs_favorites", true);
        }
        else if(sortby == "Views(Desc)") {
            deviations = sortDeviationsByKey(deviations, "gs_views", false);
        }
        else if(sortby == "Views(Asc)") {
            deviations = sortDeviationsByKey(deviations, "gs_views", true);
        }
        else {
            console.error("Unknown sort by option used.")
        }
    }

//This function matches row widths, row height preference, and image aspect ratios to tile items evenly in every row.
    function assignTileDimensions() {
        //let viewportwidth = parseFloat(window.getComputedStyle(itemscontainer).width);

        //DEBUG
        if(debug && false) console.log("Viewport width: ", viewportwidth);

        //begin tiling rows
        let useditemscount = 0;
        while(useditemscount < matchingdeviations.length)
        {
            let currentindex = useditemscount;

            //discover row item count based on pivotal row height	
            let rowitemcount = 0;
            let currenttotalaspectedwidth = 0;
            let isfinalrow = false;
            while(currentindex < matchingdeviations.length)
            {	
                let croppedwidth  = matchingdeviations[currentindex].gs_thumb_width;
                let croppedheight = matchingdeviations[currentindex].gs_thumb_height;

                let aspectedwidth = getAspectedWidth(croppedwidth, croppedheight, pivotalrowheight);

                currenttotalaspectedwidth += aspectedwidth + (tilemargin*2);

                if(currenttotalaspectedwidth >= viewportwidth)
                {
                    if(rowitemcount == 0)//Handles case where the first image in the row has a greater aspected width than the viewport, previously caused infinite loops
                    {
                        if(debug && true) console.log(currentindex);

                        rowitemcount++;
                        currentindex++;
                    }
                    break;
                }
                else
                {
                    rowitemcount++;
                    currentindex++;
                }

                //last row case detector
                if(currentindex == matchingdeviations.length)
                {
                    isfinalrow = true;
                }
            }


            //now we have row item count, size to fill usable viewport width and then aspect for final row height
            //console.log("Row item count: ", rowitemcount);

            var useableviewportwidth = viewportwidth - (rowitemcount*tilemargin*2);
            //console.log("Useable viewport width: ", useableviewportwidth);

            currentindex = useditemscount;//reset to beginning of row index

            if(!isfinalrow)//perform sizing calculations on every row but the last
            {
                //get width ratio denominator
                var sumwidthratios = 0;
                for(let i=0; i<rowitemcount; i++)
                {
                    let croppedwidth  = matchingdeviations[currentindex + i].gs_thumb_width;
                    let croppedheight = matchingdeviations[currentindex + i].gs_thumb_height;

                    sumwidthratios += croppedwidth/croppedheight;
                }

                //set final widths using width ratio percentage of total summed width ratios, set final height one time off of final width	
                let finalheight = 0;
                let remainder = 0;//pass on unused pixel space to the next element
                for(let i=0; i<rowitemcount; i++)
                {
                    let currenttiledeviation = matchingdeviations[currentindex + i];

                    let croppedwidth  = matchingdeviations[currentindex + i].gs_thumb_width;
                    let croppedheight = matchingdeviations[currentindex + i].gs_thumb_height;

                    let currentwidthratio = croppedwidth/croppedheight;

                    let exactfinalwidth = (currentwidthratio * useableviewportwidth / sumwidthratios) + remainder;
                    let finalwidth = Math.floor(exactfinalwidth);
                    remainder = exactfinalwidth - finalwidth;

                    if(i == 0)
                    {
                        finalheight = getAspectedHeight(croppedwidth, croppedheight, finalwidth);
                    }

                    //The current tile widths will change every time the viewport size changes or the search results change
                    currenttiledeviation.gs_tile_width = finalwidth + "px";
                    currenttiledeviation.gs_tile_height = finalheight + "px";
                }

                useditemscount += rowitemcount;
            }
            else//final row, size based off of simple pivotal row height
            {
                let remainder = 0;//pass on unused pixel space to the next element
                let finalheight = 0;
                for(let i=0; i<rowitemcount; i++)
                {
                    let currenttiledeviation = matchingdeviations[currentindex + i];

                    let croppedwidth  = matchingdeviations[currentindex + i].gs_thumb_width;
                    let croppedheight = matchingdeviations[currentindex + i].gs_thumb_height;


                    let exactfinalwidth = getAspectedWidth(croppedwidth, croppedheight, pivotalrowheight);
                    let finalwidth = Math.floor(exactfinalwidth);
                    remainder = exactfinalwidth - finalwidth;

                    if(i == 0)
                    {
                        finalheight = getAspectedHeight(croppedwidth, croppedheight, finalwidth);
                    }

                    //The current tile widths will change every time the viewport size changes or the search results change
                    currenttiledeviation.gs_tile_width= finalwidth + "px";
                    currenttiledeviation.gs_tile_height= finalheight + "px";
                }

                useditemscount += rowitemcount;
            }

            //DEBUG
            //break;
        }

    }

//This function orders the creation the tiles for each deviation based on search results 
    function tileElements() {
        //Reset search items container
        searchitemscontainer.innerText = "";

        for(let i=0; i<matchingdeviations.length; i++) {
            let currenttileelement = createDeviationElement(matchingdeviations[i])
            searchitemscontainer.appendChild(currenttileelement);
        }
    }

//This function differentiates the deviation tiles and calls the appropriate createElement() function
    function createDeviationElement(deviation) {

        if(deviation.type == "literature") {
            return createLiteratureDeviationElement(deviation);
        }
        else if(deviation.type == "journal" || deviation.type == "status") {
            return createJournalDeviationElement(deviation);
        }
        else {// image type and other types 

            //DEBUG
            if(debug && true) {
                if(deviation.type != "image" && deviation.type != "pdf" && deviation.type != "film")
                    console.log(deviation.type);
            }
            
            return createImageDeviationElement(deviation);
        }

        
    }

    function createImageDeviationElement(deviation)
    {
        let newtileelement = cloneableimagedeviationelement.cloneNode(true);

        newtileelement.style.width = deviation.gs_tile_width;
        newtileelement.style.height = deviation.gs_tile_height;

        //construct and set thumbnail url
        let thumbpathstring = deviation.gs_thumb_path_string;
        thumbpathstring = thumbpathstring.replace("<prettyName>", deviation.media.prettyName);
        let tokenstring = deviation.media.token == null ? "" : "?token=" + deviation.media.token[0];
        let thumburl = deviation.media.baseUri + thumbpathstring + tokenstring;

        //Dive the cloned DOM for these assignments
        let draggablecontainer = newtileelement.children[0];
        let artlinkelement = draggablecontainer.children[0];
        let outermousediv = draggablecontainer.children[1];//_2jPGh _3Cax3
        let imgelement = artlinkelement.children[0].children[0];
        let blackfadeouterdiv = outermousediv.children[1].children[0].children[0];//_1mmGw _31MCr
        let iconartistcontainer2 = blackfadeouterdiv.children[1].children[0];//_2o1Q1
        let arttitlelinkelement = blackfadeouterdiv.children[0];
        let artisticonlinkelement = iconartistcontainer2.children[0].children[0];
        let artisticonelement = artisticonlinkelement.children[0];
        let artistnamelinkelement = iconartistcontainer2.children[1].children[0];
        let artistnametextelement = artistnamelinkelement.children[0];
        let commentlinkelement = outermousediv.children[1].children[0].children[1].children[0];//_1-Wh7 x48yz
        let commentcountspan = commentlinkelement.children[1];

        imgelement.src = thumburl;
        imgelement.alt = deviation.title;
        
        artlinkelement.href = deviation.url;
        
        arttitlelinkelement.href = deviation.url;

        let arttitleelement = outermousediv.children[1].children[0].children[0].children[0].children[0];
        arttitleelement.innerText = deviation.title;
        
        //mouseover events attach to link parent
        draggablecontainer.addEventListener("mouseover", (event) => { outermousediv.style.visibility = ""; });
        draggablecontainer.addEventListener("mouseout", (event) => { outermousediv.style.visibility = "hidden"; });

        artisticonlinkelement.href = "https://www.deviantart.com/" + deviation.gs_username;

        artisticonelement.alt = deviation.author.username + "'s avatar";
        artisticonelement.src = deviation.author.usericon;

        artistnamelinkelement.href = "https://www.deviantart.com/" + deviation.gs_username;

        artistnametextelement.innerText = deviation.author.username;

        commentlinkelement.href = deviation.url + "#comments";
        commentcountspan.innerText = deviation.stats.comments;

        
        return newtileelement;
    }

    function createLiteratureDeviationElement(deviation)
    {
        let newtileelement = cloneableliteraturedeviationelement.cloneNode(true);

        newtileelement.style.width = deviation.gs_tile_width;
        newtileelement.style.height = deviation.gs_tile_height;

        //Dive the cloned DOM for these assignments
        let draggablecontainer = newtileelement.children[0];
        let sectionelement = draggablecontainer.children[0];
        let literaturepreviewtitle = sectionelement.children[2];//_2mwJN
        let literaturepreviewtext = sectionelement.children[3];//heXvc
        let deviationlink = draggablecontainer.children[1];//_1vRyy
        let outermousediv = draggablecontainer.children[2];//_2jPGh _3Cax3
        let iconartistcontainer2 = outermousediv.children[1].children[0].children[0].children[0].children[0];//_2o1Q1
        let artisticonlinkelement = iconartistcontainer2.children[0].children[0];//user-link _2f0dA _23x0l
        let artisticonelement = artisticonlinkelement.children[0];//_1IDJa
        let artistnamelinkelement = iconartistcontainer2.children[1].children[0];//user-link _2f0dA
        let artistnametextelement = artistnamelinkelement.children[0];//_2UI2c
        let commentlinkelement = outermousediv.children[1].children[0].children[1].children[0]//_1-Wh7 x48yz
        let commentcountspan = commentlinkelement.children[1];


        literaturepreviewtitle.innerText = deviation.title;
        literaturepreviewtext.innerText = deviation.textContent.excerpt;

        deviationlink.href = deviation.url;

        //mouseover events attach to link parent
        draggablecontainer.addEventListener("mouseover", (event) => { outermousediv.style.visibility = ""; });
        draggablecontainer.addEventListener("mouseout", (event) => { outermousediv.style.visibility = "hidden"; });

        artisticonlinkelement.href = "https://www.deviantart.com/" + deviation.gs_username;

        artisticonelement.alt = deviation.author.username + "'s avatar";
        artisticonelement.src = deviation.author.usericon;

        artistnamelinkelement.href = "https://www.deviantart.com/" + deviation.gs_username;

        artistnametextelement.innerText = deviation.author.username;

        commentlinkelement.href = deviation.url + "#comments";

        commentcountspan.innerText = deviation.stats.comments;

        
        return newtileelement;
    }

    function createJournalDeviationElement(deviation)
    {
        let newtileelement = cloneablejournaldeviationelement.cloneNode(true);

        newtileelement.style.width = deviation.gs_tile_width;
        newtileelement.style.height = deviation.gs_tile_height;

        //Dive the cloned DOM for these assignments
        let draggablecontainer = newtileelement.children[0];
        let sectionelement = draggablecontainer.children[0];//_1C7DQ _1L6MH
        let journaltitle = sectionelement.children[0].children[0];//mhmhR
        let journaldtcontainer = sectionelement.children[1];//_2Hfrr
        let journaldt = journaldtcontainer.children[0].children[0];
        let journalexcerptdiv = journaldtcontainer.children[1];//legacy-journal _2HUtS
        let deviationlink = draggablecontainer.children[1];//_1vRyy
        let outermousediv = draggablecontainer.children[2];//_2jPGh _3Cax3
        let iconartistcontainer2 = outermousediv.children[1].children[0].children[0].children[0].children[0];//_2o1Q1
        let artisticonlinkelement = iconartistcontainer2.children[0].children[0];//user-link _2f0dA _23x0l
        let artisticonelement = artisticonlinkelement.children[0];//_1IDJa
        let artistnamelinkelement = iconartistcontainer2.children[1].children[0];//user-link _2f0dA
        let artistnametextelement = artistnamelinkelement.children[0];//_2UI2c
        let commentlinkelement = outermousediv.children[1].children[0].children[1].children[0]//_1-Wh7 x48yz
        let commentcountspan = commentlinkelement.children[1];

        journaltitle.innerText = deviation.title;

        journaldt.dateTime = deviation.publishedTime;
        let date = new Date(deviation.publishedTime);
        let formattedDate = date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
        journaldt.innerText = formattedDate;

        journalexcerptdiv.innerText = deviation.textContent.excerpt;

        deviationlink.href = deviation.url;

        //mouseover events attach to link parent
        draggablecontainer.addEventListener("mouseover", (event) => { outermousediv.style.visibility = ""; });
        draggablecontainer.addEventListener("mouseout", (event) => { outermousediv.style.visibility = "hidden"; });

        artisticonlinkelement.href = "https://www.deviantart.com/" + deviation.gs_username;

        artisticonelement.alt = deviation.author.username + "'s avatar";
        artisticonelement.src = deviation.author.usericon;

        artistnamelinkelement.href = "https://www.deviantart.com/" + deviation.gs_username;

        artistnametextelement.innerText = deviation.author.username;

        commentlinkelement.href = deviation.url + "#comments";

        commentcountspan.innerText = deviation.stats.comments;

        
        return newtileelement;
    }

    function createCloneableImageDeviationElement() 
{
    let outermostdiv = document.createElement("div");
    outermostdiv.style.display = "inline-block";
    outermostdiv.style.float = "left";
    outermostdiv.style.position = "relative";
    outermostdiv.style.margin = tilemargin + "px";

    
    //Create Image DONE
    let imgelement = document.createElement("img");
    imgelement.style.width = "100%";
    imgelement.style.height = "100%";
    imgelement.style.objectFit = "cover";
    imgelement.style.objectPosition = "50% 100%";

    //Image container Done
    let imgcontainer = document.createElement("div")
    imgcontainer.className = "_24Wda";
    imgcontainer.style.width = "100%";
    imgcontainer.style.height = "100%";

    //Create link to deviation page Done
    let artlinkelement = document.createElement("a");

    //Draggable div container, also contains mouseover event assigned later
    let draggablecontainer = document.createElement("div")
    draggablecontainer.style.width = "100%";
    draggablecontainer.style.height = "100%";
    draggablecontainer.className = "_1xcj5 _1QdgI";
    draggablecontainer.draggable = "true";

    imgcontainer.appendChild(imgelement);
    artlinkelement.appendChild(imgcontainer);
    draggablecontainer.appendChild(artlinkelement);
    outermostdiv.appendChild(draggablecontainer);

    //////////////////////////////////
    //Mouseover elements section
    //////////////////////////////////

    //Outer mouseover element
    let outermousediv = document.createElement("div");
    outermousediv.style.visibility = "hidden";
    outermousediv.style.width = "100%";
    outermousediv.style.height = "100%";
    outermousediv.className = "_2jPGh _3Cax3";
    

    //Divs for slight black fade on hover
    let blackfadeouterdiv = document.createElement("div");
    blackfadeouterdiv.className = "_1mmGw";
    let blackfadeinnerdiv = document.createElement("div");
    blackfadeinnerdiv.className = "cjZ9o _2QZ8F _3b-i8";

    blackfadeouterdiv.appendChild(blackfadeinnerdiv);
    outermousediv.appendChild(blackfadeouterdiv);

    //Next inward div
    let innermousediv = document.createElement("div");
    innermousediv.style.width = "100%";
    innermousediv.style.height = "100%";
    innermousediv.className = "_2ehf4 YpNhf";

    //Div for all all meta elements container (title, artist, icon, comments)
    let metaelementscontainer = document.createElement("div");
    metaelementscontainer.className = "_5Xty_";

    //Div to contain title and artist elements (title, artist, icon)
    let titleartistcontainer = document.createElement("div");
    titleartistcontainer.className = "_1mmGw _31MCr";

    //Link with Title
    let arttitlelinkelement = document.createElement("a")
    arttitlelinkelement.className = "KoW6A";

    //Title
    let arttitleelement = document.createElement("h2")
    arttitleelement.className = "_1lmpZ";


    arttitlelinkelement.appendChild(arttitleelement);
    titleartistcontainer.appendChild(arttitlelinkelement);
    metaelementscontainer.appendChild(titleartistcontainer);
    innermousediv.appendChild(metaelementscontainer);
    outermousediv.appendChild(innermousediv);
    draggablecontainer.appendChild(outermousediv);


    //Subsection for artist icon and name

    //Divs to contain title and artist elements (title, artist, icon)
    let iconartistcontainer = document.createElement("div");
    iconartistcontainer.className = "_13y-9";
    let iconartistcontainer2 = document.createElement("div");
    iconartistcontainer2.className = "_2o1Q1";

    //Div to contain artist icon
    let iconcontainer = document.createElement("div");
    iconcontainer.className = "_3CR67 _1I9Ar";

    //Link for artist that surrounds icon
    let artisticonlinkelement = document.createElement("a")
    artisticonlinkelement.className = "user-link _2f0dA _23x0l";

    //Artist icon element
    let artisticonelement = document.createElement("img");
    artisticonelement.style.width = "24px";
    artisticonelement.style.height = "24px";
    artisticonelement.loading = "lazy";
    artisticonelement.className = "_1IDJa";

    artisticonlinkelement.appendChild(artisticonelement);
    iconcontainer.appendChild(artisticonlinkelement);

    //Div to contain artist name
    let artistnamecontainer = document.createElement("div");
    artistnamecontainer.className = "_3CR67 k4CiA";

    //Link for artist that surrounds icon
    let artistnamelinkelement = document.createElement("a")
    artistnamelinkelement.className = "user-link _2f0dA";

    //Artist name text span
    let artistnametextelement = document.createElement("span");
    artistnametextelement.className = "_2UI2c";
    

    //Artist cursor span
    let artistcursorelement = document.createElement("span");
    artistcursorelement.className = "_3LUMH _1NhtS G0rcN";
    artistcursorelement.style.cursor = "pointer";
    artistcursorelement.role = "img";

    artistnamelinkelement.appendChild(artistnametextelement);
    artistnamelinkelement.appendChild(artistcursorelement);
    artistnamecontainer.appendChild(artistnamelinkelement);

    iconartistcontainer2.appendChild(iconcontainer);
    iconartistcontainer2.appendChild(artistnamecontainer);
    iconartistcontainer.appendChild(iconartistcontainer2);
    titleartistcontainer.appendChild(iconartistcontainer);

    //Subsection for comments icon and link elements

    //Div to contain comment icon and link elements
    let commenticonlinkcontainer = document.createElement("div");
    commenticonlinkcontainer.className = "_1mmGw _2WpJA _6oiPd";

    //Link for comment section
    let commentlinkelement = document.createElement("a");
    commentlinkelement.className = "_1-Wh7 x48yz";

    //Comment icon span
    let commenticonspan = document.createElement("span");
    commenticonspan.className = "z8jNZ _1yoxj _38kc5";

    //Comment icon (SVG)
    let commenticonSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    commenticonSVG.setAttribute("viewBox", "0 0 24 24");
    commenticonSVG.setAttribute("version", "1.1");
    commenticonSVG.setAttribute("xlmns:xlink", "http://www.w3.org/1999/xlink");

    //Comment icon (SVG PATH)
    let commenticonpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    commenticonpath.setAttribute("fill-rule", "evenodd");
    commenticonpath.setAttribute("d", "M20 3a1 1 0 01.993.883L21 4v9.586a1 1 0 01-.206.608l-.087.099-2.414 2.414a1 1 0 01-.576.284l-.131.009H13l-2.7 3.6a1 1 0" 
        + " 01-.683.393L9.5 21H8a1 1 0 01-.993-.883L7 20v-3H4a1 1 0 01-.993-.883L3 16V6.414a1 1 0 01.206-.608l.087-.099 2.414-2.414a1 1 0 01.576-.284L6.414" 
        + " 3H20zm-1 2H6.828L5 6.828V15h4v4l3-4h5.17L19 13.17V5z");

    //Comment count span
    let commentcountspan = document.createElement("span");


    commenticonSVG.appendChild(commenticonpath);
    commenticonspan.appendChild(commenticonSVG);
    commentlinkelement.appendChild(commenticonspan);
    commentlinkelement.appendChild(commentcountspan);
    commenticonlinkcontainer.appendChild(commentlinkelement);
    metaelementscontainer.appendChild(commenticonlinkcontainer);

    return outermostdiv;
    }

    function createCloneableLiteratureDeviationElement() {
        let outermostdiv = document.createElement("div");
        outermostdiv.style.display = "inline-block";
        outermostdiv.style.float = "left";
        outermostdiv.style.position = "relative";
        outermostdiv.style.margin = tilemargin + "px";

        //Draggable div container, also contains mouseover event assigned later
        let draggablecontainer = document.createElement("div")
        draggablecontainer.style.width = "100%";
        draggablecontainer.style.height = "100%";
        draggablecontainer.className = "_1xcj5 _1QdgI";
        draggablecontainer.draggable = "true";

        //Section element that contains literature display elements
        let sectionelement = document.createElement("section");
        sectionelement.className = "_33VtO _3rqZq";
        sectionelement.style.width = "100%";
        sectionelement.style.height = "100%";
        
        //Fancy literature deviation background element container
        let literaturebgcontainer = document.createElement("div")
        literaturebgcontainer.className = "xPxyA LXVwg";

        //Fancy literature deviation background (SVG)
        let litbgSVG = document.createElement("svg");
        litbgSVG.setAttribute("viewBox", "0 0 15 12");
        litbgSVG.setAttribute("height", "100%");
        litbgSVG.setAttribute("preserveAspectRatio", "xMidYMin slice");
        litbgSVG.setAttribute("fill-rule", "evenodd");

        //Fancy literature deviation background (lineargradient)
        let litbglineargradient = document.createElement("linearGradient");
        litbglineargradient.setAttribute("x1", "87.8481761%");
        litbglineargradient.setAttribute("y1", "16.3690766%");
        litbglineargradient.setAttribute("x2", "45.4107524%");
        litbglineargradient.setAttribute("y2", "71.4898596%");

        //Fancy literature deviation background (stop color)s
        let litbgstop1 = document.createElement("stop");
        litbgstop1.setAttribute("stop-color", "#00FF62");
        litbgstop1.setAttribute("offset", "0%");
        let litbgstop2 = document.createElement("stop");
        litbgstop2.setAttribute("stop-color", "#3197EF");
        litbgstop2.setAttribute("offset", "100%");
        litbgstop2.setAttribute("stop-opacity", "0");

        litbglineargradient.appendChild(litbgstop1);
        litbglineargradient.appendChild(litbgstop2);
        litbgSVG.appendChild(litbglineargradient);
        literaturebgcontainer.appendChild(litbgSVG);
        sectionelement.appendChild(literaturebgcontainer);
        draggablecontainer.appendChild(sectionelement);
        outermostdiv.appendChild(draggablecontainer);

        //Literature Preview Subsection

        //Fancy literature deviation background element container
        let literaturecategorydiv = document.createElement("div")
        literaturecategorydiv.className = "_3hLq8";
        literaturecategorydiv.innerText = "Literature";
        //Literature Preview Title
        let literaturepreviewtitle = document.createElement("h2")
        literaturepreviewtitle.className = "_2mwJN";
        //Literature Preview Text
        let literaturepreviewtext = document.createElement("h2")
        literaturepreviewtext.className = "heXvc";

        sectionelement.appendChild(literaturecategorydiv);
        sectionelement.appendChild(literaturepreviewtitle);
        sectionelement.appendChild(literaturepreviewtext);

        //Deviation link section
        let deviationlink = document.createElement("a");
        deviationlink.className = "_1vRyy";

        draggablecontainer.appendChild(deviationlink);


        //////////////////////////////////
        //Mouseover elements section
        //////////////////////////////////

        //Outer mouseover element
        let outermousediv = document.createElement("div");
        outermousediv.style.visibility = "hidden";
        outermousediv.style.width = "100%";
        outermousediv.style.height = "100%";
        outermousediv.className = "_2jPGh _3Cax3";

        //Divs for slight black fade on hover
        let blackfadeouterdiv = document.createElement("div");
        blackfadeouterdiv.className = "_1mmGw";
        let blackfadeinnerdiv = document.createElement("div");
        blackfadeinnerdiv.className = "cjZ9o _2QZ8F _3b-i8";

        blackfadeouterdiv.appendChild(blackfadeinnerdiv);
        outermousediv.appendChild(blackfadeouterdiv);

        //Next inward div
        let innermousediv = document.createElement("div");
        innermousediv.style.width = "100%";
        innermousediv.style.height = "100%";
        innermousediv.className = "_2ehf4 YpNhf";

        //Div for all all meta elements container (title, artist, icon, comments)
        let metaelementscontainer = document.createElement("div");
        metaelementscontainer.className = "_5Xty_";

        //Div to contain title and artist elements (title, artist, icon)
        let titleartistcontainer = document.createElement("div");
        titleartistcontainer.className = "_1mmGw _31MCr";

        // //Link with Title
        // let arttitlelinkelement = document.createElement("a")
        // arttitlelinkelement.href = deviation.url;
        // arttitlelinkelement.className = "KoW6A";

        // //Title
        // let arttitleelement = document.createElement("h2")
        // arttitleelement.className = "_1lmpZ";
        // arttitleelement.innerText = deviation.title;


        // arttitlelinkelement.appendChild(arttitleelement);
        //titleartistcontainer.appendChild(arttitlelinkelement);
        metaelementscontainer.appendChild(titleartistcontainer);
        innermousediv.appendChild(metaelementscontainer);
        outermousediv.appendChild(innermousediv);
        draggablecontainer.appendChild(outermousediv);


        //Subsection for artist icon and name

        //Divs to contain title and artist elements (title, artist, icon)
        let iconartistcontainer = document.createElement("div");
        iconartistcontainer.className = "_13y-9";
        let iconartistcontainer2 = document.createElement("div");
        iconartistcontainer2.className = "_2o1Q1";

        //Div to contain artist icon
        let iconcontainer = document.createElement("div");
        iconcontainer.className = "_3CR67 _1I9Ar";

        //Link for artist that surrounds icon
        let artisticonlinkelement = document.createElement("a")
        artisticonlinkelement.className = "user-link _2f0dA _23x0l";

        //Artist icon element
        let artisticonelement = document.createElement("img");
        artisticonelement.style.width = "24px";
        artisticonelement.style.height = "24px";
        artisticonelement.loading = "lazy";
        artisticonelement.className = "_1IDJa";

        artisticonlinkelement.appendChild(artisticonelement);
        iconcontainer.appendChild(artisticonlinkelement);

        //Div to contain artist name
        let artistnamecontainer = document.createElement("div");
        artistnamecontainer.className = "_3CR67 k4CiA";

        //Link for artist that surrounds icon
        let artistnamelinkelement = document.createElement("a");
        artistnamelinkelement.className = "user-link _2f0dA";

        //Artist name text span
        let artistnametextelement = document.createElement("span")
        artistnametextelement.className = "_2UI2c";

        //Artist cursor span
        let artistcursorelement = document.createElement("span")
        artistcursorelement.className = "_3LUMH _1NhtS G0rcN";
        artistcursorelement.style.cursor = "pointer";
        artistcursorelement.role = "img";

        artistnamelinkelement.appendChild(artistnametextelement);
        artistnamelinkelement.appendChild(artistcursorelement);
        artistnamecontainer.appendChild(artistnamelinkelement);

        iconartistcontainer2.appendChild(iconcontainer);
        iconartistcontainer2.appendChild(artistnamecontainer);
        iconartistcontainer.appendChild(iconartistcontainer2);
        titleartistcontainer.appendChild(iconartistcontainer);

        //Subsection for comments icon and link elements

        //Div to contain comment icon and link elements
        let commenticonlinkcontainer = document.createElement("div");
        commenticonlinkcontainer.className = "_1mmGw _2WpJA _6oiPd";

        //Link for comment section
        let commentlinkelement = document.createElement("a")
        commentlinkelement.className = "_1-Wh7 x48yz";

        //Comment icon span
        let commenticonspan = document.createElement("span")
        commenticonspan.className = "z8jNZ _1yoxj _38kc5";

        //Comment icon (SVG)
        let commenticonSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        commenticonSVG.setAttribute("viewBox", "0 0 24 24");
        commenticonSVG.setAttribute("version", "1.1");
        commenticonSVG.setAttribute("xlmns:xlink", "http://www.w3.org/1999/xlink");

        //Comment icon (SVG PATH)
        let commenticonpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        commenticonpath.setAttribute("fill-rule", "evenodd");
        commenticonpath.setAttribute("d", "M20 3a1 1 0 01.993.883L21 4v9.586a1 1 0 01-.206.608l-.087.099-2.414 2.414a1 1 0 01-.576.284l-.131.009H13l-2.7 3.6a1 1 0" 
            + " 01-.683.393L9.5 21H8a1 1 0 01-.993-.883L7 20v-3H4a1 1 0 01-.993-.883L3 16V6.414a1 1 0 01.206-.608l.087-.099 2.414-2.414a1 1 0 01.576-.284L6.414" 
            + " 3H20zm-1 2H6.828L5 6.828V15h4v4l3-4h5.17L19 13.17V5z");

        //Comment count span
        let commentcountspan = document.createElement("span")
        

        commenticonSVG.appendChild(commenticonpath);
        commenticonspan.appendChild(commenticonSVG);
        commentlinkelement.appendChild(commenticonspan);
        commentlinkelement.appendChild(commentcountspan);
        commenticonlinkcontainer.appendChild(commentlinkelement);
        metaelementscontainer.appendChild(commenticonlinkcontainer);

        return outermostdiv;
    }

    function createCloneableJournalDeviationElement() {
        let outermostdiv = document.createElement("div");
        outermostdiv.style.display = "inline-block";
        outermostdiv.style.float = "left";
        outermostdiv.style.position = "relative";
        outermostdiv.style.margin = tilemargin + "px";

        //Draggable div container, also contains mouseover event assigned later
        let draggablecontainer = document.createElement("div")
        draggablecontainer.style.width = "100%";
        draggablecontainer.style.height = "100%";
        draggablecontainer.className = "_1xcj5 _1QdgI";
        draggablecontainer.draggable = "true";

        //Section element that contains journal display elements
        let sectionelement = document.createElement("section");
        sectionelement.className = "_1C7DQ _1L6MH";
        sectionelement.style.width = "100%";
        sectionelement.style.height = "100%";
        
        //Journal title container
        let journaltitlecontainer = document.createElement("div")
        journaltitlecontainer.className = "_1i4Yb";

        //Journal Title
        let journaltitle = document.createElement("h2")
        journaltitle.className = "mhmhR";

        journaltitlecontainer.appendChild(journaltitle);
        sectionelement.appendChild(journaltitlecontainer);
        draggablecontainer.appendChild(sectionelement);
        outermostdiv.appendChild(draggablecontainer);

        //Journal Excerpt subsection

        //Journal preview container
        let journalpreviewcontainer = document.createElement("div")
        journalpreviewcontainer.className = "_2Hfrr";

        //Journal datetime container
        let journaldtcontainer = document.createElement("div")
        journaldtcontainer.className = "uBAbQ";

        //Journal datetime, also get the correct date format. Example: Dec 14, 2015
        let journaldt = document.createElement("time")

        //Journal excerpt div
        let journalexcerptdiv = document.createElement("div")
        journalexcerptdiv.className = "legacy-journal _2HUtS";

        journaldtcontainer.appendChild(journaldt);
        journalpreviewcontainer.appendChild(journaldtcontainer);
        journalpreviewcontainer.appendChild(journalexcerptdiv);
        sectionelement.appendChild(journalpreviewcontainer);

        //Deviation link section
        let deviationlink = document.createElement("a");
        deviationlink.className = "_1vRyy";

        draggablecontainer.appendChild(deviationlink);


        //////////////////////////////////
        //Mouseover elements section
        //////////////////////////////////

        //Outer mouseover element
        let outermousediv = document.createElement("div");
        outermousediv.style.visibility = "hidden";
        outermousediv.style.width = "100%";
        outermousediv.style.height = "100%";
        outermousediv.className = "_2jPGh _3Cax3";

        //Divs for slight black fade on hover
        let blackfadeouterdiv = document.createElement("div");
        blackfadeouterdiv.className = "_1mmGw";
        let blackfadeinnerdiv = document.createElement("div");
        blackfadeinnerdiv.className = "cjZ9o _2QZ8F _3b-i8";

        blackfadeouterdiv.appendChild(blackfadeinnerdiv);
        outermousediv.appendChild(blackfadeouterdiv);

        //Next inward div
        let innermousediv = document.createElement("div");
        innermousediv.style.width = "100%";
        innermousediv.style.height = "100%";
        innermousediv.className = "_2ehf4 YpNhf";

        //Div for all all meta elements container (title, artist, icon, comments)
        let metaelementscontainer = document.createElement("div");
        metaelementscontainer.className = "_5Xty_";

        //Div to contain title and artist elements (title, artist, icon)
        let titleartistcontainer = document.createElement("div");
        titleartistcontainer.className = "_1mmGw _31MCr";

        // arttitlelinkelement.appendChild(arttitleelement);
        //titleartistcontainer.appendChild(arttitlelinkelement);
        metaelementscontainer.appendChild(titleartistcontainer);
        innermousediv.appendChild(metaelementscontainer);
        outermousediv.appendChild(innermousediv);
        draggablecontainer.appendChild(outermousediv);


        //Subsection for artist icon and name

        //Divs to contain title and artist elements (title, artist, icon)
        let iconartistcontainer = document.createElement("div");
        iconartistcontainer.className = "_13y-9";
        let iconartistcontainer2 = document.createElement("div");
        iconartistcontainer2.className = "_2o1Q1";

        //Div to contain artist icon
        let iconcontainer = document.createElement("div");
        iconcontainer.className = "_3CR67 _1I9Ar";

        //Link for artist that surrounds icon
        let artisticonlinkelement = document.createElement("a")
        artisticonlinkelement.className = "user-link _2f0dA _23x0l";

        //Artist icon element
        let artisticonelement = document.createElement("img");
        artisticonelement.style.width = "24px";
        artisticonelement.style.height = "24px";
        artisticonelement.loading = "lazy";
        artisticonelement.className = "_1IDJa";

        artisticonlinkelement.appendChild(artisticonelement);
        iconcontainer.appendChild(artisticonlinkelement);

        //Div to contain artist name
        let artistnamecontainer = document.createElement("div");
        artistnamecontainer.className = "_3CR67 k4CiA";

        //Link for artist that surrounds icon
        let artistnamelinkelement = document.createElement("a")
        artistnamelinkelement.className = "user-link _2f0dA";

        //Artist name text span
        let artistnametextelement = document.createElement("span")
        artistnametextelement.className = "_2UI2c";

        //Artist cursor span
        let artistcursorelement = document.createElement("span")
        artistcursorelement.className = "_3LUMH _1NhtS G0rcN";
        artistcursorelement.style.cursor = "pointer";
        artistcursorelement.role = "img";

        artistnamelinkelement.appendChild(artistnametextelement);
        artistnamelinkelement.appendChild(artistcursorelement);
        artistnamecontainer.appendChild(artistnamelinkelement);

        iconartistcontainer2.appendChild(iconcontainer);
        iconartistcontainer2.appendChild(artistnamecontainer);
        iconartistcontainer.appendChild(iconartistcontainer2);
        titleartistcontainer.appendChild(iconartistcontainer);

        //Subsection for comments icon and link elements

        //Div to contain comment icon and link elements
        let commenticonlinkcontainer = document.createElement("div");
        commenticonlinkcontainer.className = "_1mmGw _2WpJA _6oiPd";

        //Link for comment section
        let commentlinkelement = document.createElement("a")
        commentlinkelement.className = "_1-Wh7 x48yz";

        //Comment icon span
        let commenticonspan = document.createElement("span")
        commenticonspan.className = "z8jNZ _1yoxj _38kc5";

        //Comment icon (SVG)
        let commenticonSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        commenticonSVG.setAttribute("viewBox", "0 0 24 24");
        commenticonSVG.setAttribute("version", "1.1");
        commenticonSVG.setAttribute("xlmns:xlink", "http://www.w3.org/1999/xlink");

        //Comment icon (SVG PATH)
        let commenticonpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        commenticonpath.setAttribute("fill-rule", "evenodd");
        commenticonpath.setAttribute("d", "M20 3a1 1 0 01.993.883L21 4v9.586a1 1 0 01-.206.608l-.087.099-2.414 2.414a1 1 0 01-.576.284l-.131.009H13l-2.7 3.6a1 1 0" 
            + " 01-.683.393L9.5 21H8a1 1 0 01-.993-.883L7 20v-3H4a1 1 0 01-.993-.883L3 16V6.414a1 1 0 01.206-.608l.087-.099 2.414-2.414a1 1 0 01.576-.284L6.414" 
            + " 3H20zm-1 2H6.828L5 6.828V15h4v4l3-4h5.17L19 13.17V5z");

        //Comment count span
        let commentcountspan = document.createElement("span")

        commenticonSVG.appendChild(commenticonpath);
        commenticonspan.appendChild(commenticonSVG);
        commentlinkelement.appendChild(commenticonspan);
        commentlinkelement.appendChild(commentcountspan);
        commenticonlinkcontainer.appendChild(commentlinkelement);
        metaelementscontainer.appendChild(commenticonlinkcontainer);

        return outermostdiv;
    }

    function toggleSettingsElement() {
        if(settingsmenudiv.style.display == "none") {
            settingsmenudiv.style.display = "";
            settingsmenudiv.focus();
        }
        else {
            settingsmenudiv.style.display = "none";
        }    
    }

    function hideSettingsElement(event) {
        if(!settingscogdiv.contains(event.target)){
            settingsmenudiv.style.display = 'none';
        }
    }

    function createSettingsMenu() {
        let settingscontainer = document.createElement("div");
        settingscontainer.id = "settingsmenu";
        settingscontainer.style.background = "#06070d";
        settingscontainer.style.border = "1px solid #262830";
        settingscontainer.style.borderRadius = "5px solid #262830";
        settingscontainer.style.position = "absolute";
        settingscontainer.style.right = "-20px";
        settingscontainer.style.top = "40px";
        settingscontainer.style.zIndex = "1";
        settingscontainer.style.zIndex = "1";
        settingscontainer.style.display = "none";

        
        let settingstable = document.createElement("table");
        settingstable.style.width = "300px";
        settingstable.style.margin = "5px";

        let tr1 = document.createElement("tr");
        let tr2 = document.createElement("tr");
        let tr3 = document.createElement("tr");
        let tr4 = document.createElement("tr");
        let t2tr1 = document.createElement("tr");

        let maxsearchresultsleft = document.createElement("td");
        maxsearchresultsleft.style.textAlign = "left";
        maxsearchresultsleft.style.padding = "5px";
        maxsearchresultsleft.innerText = "Max Search Results:";

        let maxsearchresultsright = document.createElement("td");
        maxsearchresultsright.style.textAlign = "right";
        maxsearchresultsright.style.padding = "5px";

        let maxsearchresultsinput = document.createElement("input");
        maxsearchresultsinput.id = "maximumsearchreturn";
        maxsearchresultsinput.type = "text";
        maxsearchresultsinput.style.width = "40px";
        maxsearchresultsinput.value = maximumsearchreturn;

        maxsearchresultsright.appendChild(maxsearchresultsinput);

        tr1.appendChild(maxsearchresultsleft);
        tr1.appendChild(maxsearchresultsright);


        let paginationrateleft = document.createElement("td");
        paginationrateleft.style.textAlign = "left";
        paginationrateleft.style.padding = "5px";
        paginationrateleft.innerText = "Index Rate Limit (in seconds):";

        let paginationrateright = document.createElement("td");
        paginationrateright.style.textAlign = "right";
        paginationrateright.style.padding = "5px";

        let paginationrateinput = document.createElement("input");
        paginationrateinput.id = "paginationratelimit";
        paginationrateinput.type = "text";
        paginationrateinput.style.width = "40px";
        paginationrateinput.value = paginationratelimit.toPrecision(2);

        paginationrateright.appendChild(paginationrateinput);

        tr2.appendChild(paginationrateleft);
        tr2.appendChild(paginationrateright);


        let ratewarningleft = document.createElement("td");
        ratewarningleft.style.textAlign = "left";
        ratewarningleft.style.padding = "5px";
        ratewarningleft.innerText = "Rate Limit Warning:";

        let ratewarningright = document.createElement("td");
        ratewarningright.style.textAlign = "right";
        ratewarningright.style.padding = "5px";

        let ratewarningcheckbox = document.createElement("input");
        ratewarningcheckbox.id = "ratelimitwarning";
        ratewarningcheckbox.type = "checkbox";
        ratewarningcheckbox.style.accentColor = "green";
        ratewarningcheckbox.checked = ratelimitwarning;

        ratewarningright.appendChild(ratewarningcheckbox);

        tr3.appendChild(ratewarningleft);
        tr3.appendChild(ratewarningright);


        let tileheightleft = document.createElement("td");
        tileheightleft.style.textAlign = "left";
        tileheightleft.style.padding = "5px";
        tileheightleft.innerText = "Rough Tiling Height (in pixels):";

        let tileheightright = document.createElement("td");
        tileheightright.style.textAlign = "right";
        tileheightright.style.padding = "5px";

        let tileheightinput = document.createElement("input");
        tileheightinput.id = "pivotalrowheight";
        tileheightinput.type = "text";
        tileheightinput.style.width = "40px";
        tileheightinput.value = pivotalrowheight;

        tileheightright.appendChild(tileheightinput);

        tr4.appendChild(tileheightleft);
        tr4.appendChild(tileheightright);


        settingstable.appendChild(tr1);
        settingstable.appendChild(tr2);
        settingstable.appendChild(tr3);
        settingstable.appendChild(tr4);
        settingscontainer.appendChild(settingstable);

        let settingstable2 = document.createElement("table");
        settingstable2.style.width = "300px";
        settingstable2.style.margin = "5px";

        let sortbyleft = document.createElement("td");
        sortbyleft.style.textAlign = "left";
        sortbyleft.style.padding = "5px";
        sortbyleft.innerText = "Sort By:";

        let sortbyright = document.createElement("td");
        sortbyright.style.textAlign = "right";

        let sortbycontainer = document.createElement("div");
        sortbycontainer.style.width = "180px";
        sortbycontainer.style.color = regularwhitetextcolor;
        sortbycontainer.style.marginLeft = "auto";
        sortbycontainer.style.display = "flex";

        let leftsort = document.createElement("span");
        leftsort.id = "leftsort";
        leftsort.style.cursor = "pointer";
        leftsort.style.margin = "5px auto";
        leftsort.style.background = "green";
        leftsort.style.padding = "5px";
        leftsort.style.borderTopLeftRadius = "5px";
        leftsort.style.borderBottomLeftRadius = "5px";
        leftsort.innerText = "<";

        let sorttext = document.createElement("span");
        sorttext.id = "sortby";
        sorttext.style.margin = "5px auto";
        sorttext.style.background = "green";
        sorttext.style.padding = "5px";
        sorttext.style.width = "120px";
        sorttext.style.textAlign = "center";
        sorttext.innerText = sortby;

        let rightsort = document.createElement("span");
        rightsort.id = "rightsort";
        rightsort.style.cursor = "pointer";
        rightsort.style.margin = "5px auto";
        rightsort.style.background = "green";
        rightsort.style.padding = "5px";
        rightsort.style.borderTopRightRadius = "5px";
        rightsort.style.borderBottomRightRadius = "5px";
        rightsort.innerText = ">";

        sortbycontainer.appendChild(leftsort);
        sortbycontainer.appendChild(sorttext);
        sortbycontainer.appendChild(rightsort);

        sortbyright.appendChild(sortbycontainer);

        t2tr1.appendChild(sortbyleft);
        t2tr1.appendChild(sortbyright);


        settingstable2.appendChild(t2tr1);
        settingscontainer.appendChild(settingstable2);

        settingscogdiv.appendChild(settingscontainer);

        //Add button animations
        leftsort.addEventListener("mouseover", hoverFade);
        leftsort.addEventListener("mouseout", hoverFadeCancel);
        rightsort.addEventListener("mouseover", hoverFade);
        rightsort.addEventListener("mouseout", hoverFadeCancel);

        //Add user settings change listeners
        maxsearchresultsinput.addEventListener("keyup", updateUserNumberPreference);
        paginationrateinput.addEventListener("keyup", updateUserNumberPreference);
        ratewarningcheckbox.addEventListener("click", updateUserCheckboxPreference);
        tileheightinput.addEventListener("keyup", updateUserNumberPreference);
        leftsort.addEventListener("click", updateSortByPreference);
        rightsort.addEventListener("click", updateSortByPreference);

        return settingscontainer;
        

        function hoverFade(event) {
            event.target.style.opacity = "50%";
        }

        function hoverFadeCancel(event) {
            event.target.style.opacity = "100%";
        }

        function updateUserNumberPreference(event) {
            let key = event.target.id;
            let value = event.target.value;

            let updatedCorrectly = setUserPreference(key, value);

            if(updatedCorrectly) {
                event.target.style.color = regularblacktextcolor;
                searchoutputtext.style.color = regularwhitetextcolor;
                if(searchoutputtext.innerText.includes("Error"))
                    searchoutputtext.innerText = "";
            }
            else {
                event.target.style.color = errortextcolor;
                searchoutputtext.style.color = errortextcolor;
                let typeproblemstring = (key == "paginationratelimit" ? "decimal number. (Example: 2.5)" : "integer. (Example: 300)");
                searchoutputtext.innerText = "Error: '" + value + "' is not a " + typeproblemstring;
            }


            //Add an immediate tiling update if the desired row height is changed, handled within the search function
            if(key == "pivotalrowheight") {
                search();
            }
        }

        function updateUserCheckboxPreference(event) {
            let key = event.target.id;
            let value = event.target.checked;

            setUserPreference(key, value);
        }

        function updateSortByPreference(event) {
            let isleft = event.target.id == "leftsort";

            //Get and set new sort option based on click direction
            let sortoptionindex = 0;
            for(let i=0; i<sortoptions.length; i++) {
                if(sortoptions[i] == sortby){
                    sortoptionindex = i;
                    break;
                }
            }
            if(isleft)
                sortoptionindex -= 1;
            else
                sortoptionindex += 1;
            if(sortoptionindex == -1)//loop the options backwards
                sortoptionindex = sortoptions.length-1;
            if(sortoptionindex == sortoptions.length)//loop the options forwards
                sortoptionindex = 0;
            setUserPreference("sortby", sortoptions[sortoptionindex]);

            //Set the html element
            sorttext.innerText = sortby;

            //Now re-sort and re-display search results based on new order
            sort();
            search();
        }
    }

    function getUserPreferencesFromLocalStorage() {
        //For all user preference variables, get them from localStorage if they exist and re-store them so the script can start with a consistent state in global variables and localStorage.

        let newmaximumsearchreturn = localStorage.getItem("maximumsearchreturn");
        if(newmaximumsearchreturn != null) 
            setUserPreference("maximumsearchreturn", newmaximumsearchreturn) 

        let newpaginationratelimit = localStorage.getItem("paginationratelimit");
        if(newpaginationratelimit != null) 
            setUserPreference("paginationratelimit", newpaginationratelimit)

        let newratelimitwarning = localStorage.getItem("ratelimitwarning");
        if(newratelimitwarning != null) 
            setUserPreference("ratelimitwarning", newratelimitwarning)

        let newpivotalrowheight = localStorage.getItem("pivotalrowheight");
        if(newpivotalrowheight != null) 
            setUserPreference("pivotalrowheight", newpivotalrowheight)

        let newsortby = localStorage.getItem("sortby");
        if(newsortby != null) 
            setUserPreference("sortby", newsortby)
    }

    function setUserPreference(key, value) {
        //Sets the user preference value based on new input from user. Returns true if setting was a success, returns false if there was a parsing error.
        //Use this for all set() actions. Keeps the state consistent between the gloabl variables and localStorage.
        //This handles string inputs (ex: maximumsearchreturn -> "1000" ) and direct inputs (ex: maximumsearchreturn -> 1000 )

        if(key == "maximumsearchreturn") {
            let newmaximumsearchreturn = parseInt(value);
            if(isNaN(newmaximumsearchreturn)) 
                return false;
            maximumsearchreturn = newmaximumsearchreturn;
            localStorage.setItem("maximumsearchreturn", maximumsearchreturn);
        }
        else if(key == "paginationratelimit") {
            let newpaginationratelimit = parseFloat(value);
            if(isNaN(newpaginationratelimit)) 
                return false;
            paginationratelimit = newpaginationratelimit;
            localStorage.setItem("paginationratelimit", paginationratelimit);
        }
        else if(key == "ratelimitwarning") {
            let newratelimitwarning = (value == true || value == "true");
            ratelimitwarning = newratelimitwarning;
            localStorage.setItem("ratelimitwarning", ratelimitwarning);
        }
        else if(key == "pivotalrowheight") {
            let newpivotalrowheight = parseInt(value);
            if(isNaN(newpivotalrowheight)) 
                return false;
            pivotalrowheight = newpivotalrowheight;
            localStorage.setItem("pivotalrowheight", pivotalrowheight);
        }
        else if(key == "sortby") {
            sortby = value;
            localStorage.setItem("sortby", sortby);
        }
        else {
            return false;
        }

        return true; 
    }
    




/////////////////////////////////////////////////////////////////////////////////////
/////  Other Helper Functions                                                   /////
/////////////////////////////////////////////////////////////////////////////////////

    function getAspectedWidth(origwidth, origheight, sizedheight)
    {
        return (origwidth * sizedheight) / origheight;
    }

    function getAspectedHeight(origwidth, origheight, sizedwidth)
    {
        return (origheight * sizedwidth) / origwidth;
    }

    function setViewportWidth()
    {
        viewportwidth = parseFloat(window.getComputedStyle(itemscontainer).width);
    }

    
    //Function to sort deviationJSON based on attribute provided
    function sortDeviationsByKey(array, key, ascending) {
        //spot check for the variable type
        let spotcheck = typeof array[0].deviation[key];

        if(spotcheck == "string")
        {
            return array.sort(function(a, b) {
                let x = a.deviation[key]; let y = b.deviation[key];
                if(ascending) 
                    return x.localeCompare(y);
                else
                    return y.localeCompare(x);
            });
        }
        else if(spotcheck == "number") {
            return array.sort(function(a, b) {
                let x = a.deviation[key]; let y = b.deviation[key];
                if(x == y)
                    return 0;

                let returnval;
                if(x > y)
                    returnval = 1;
                else
                    returnval = -1;

                if(ascending) 
                    return returnval;
                else
                    return -returnval;
            });
        }
        else {
            console.error("Unhandled type for sort key: " + key);
        }

        
     }
    

}

//DOM Element Mutation Observer
//Credit to Yong Wang on StackOverflow: https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}



})();