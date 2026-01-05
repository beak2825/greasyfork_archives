// ==UserScript==
// @name        Sadpanda Save/Export All Favorites
// @namespace   SaddestPanda
// @description Load all favorites to the page and save it, export as JSON data or just copy the textbox contents. Works on exhentai and e-hentai.
// @match       *://exhentai.org/favorites.php*
// @match       *://e-hentai.org/favorites.php*
// @homepage    https://sleazyfork.org/en/scripts/23406-sadpanda-save-export-all-favorites
// @supportURL  https://sleazyfork.org/en/scripts/23406-sadpanda-save-export-all-favorites/feedback
// @version     2.6.8
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @grant       GM_addValueChangeListener
// @grant       GM.registerMenuCommand
// @require     https://cdn.jsdelivr.net/npm/gm-webext-pref@0.4.2/dist/GM_webextPref.user.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/he/1.2.0/he.min.js
// @downloadURL https://update.greasyfork.org/scripts/23406/Sadpanda%20SaveExport%20All%20Favorites.user.js
// @updateURL https://update.greasyfork.org/scripts/23406/Sadpanda%20SaveExport%20All%20Favorites.meta.js
// ==/UserScript==

//LATER TODO maybe improve the json export functionality using API data like x/favorites-scrape. For now the Extended layout is adequate. Magnet links can be generated using the API data as well.

//Top text box inspiration and its code from http://userscripts-mirror.org/scripts/show/173553. But this one won't have an import feature like that one.
//Using he.js for he.js purposes.
//Using GM_webextPref for the preferences menu. Many thanks to the author "eight" for the library.

//2022.11.05 v2.5.0: Thanks Caca Ductile for your large contributions. Thanks dnsev-h for getTimestamp().

//Use the options menu to change these values.
let inserttoTable = true; //Disables inserting new pages to the table. Set this to false if your browser gets real slow. You can still use the textbox to save your favorites.
let pageTimer = 3000; //Waiting timer for each page in milliseconds. Default is 2500. Making it too short might prevent pages from loading.
let playsilentAudio = false; //Play silent audio while loading the pages. Enable this if you will be using your computer while waiting. It might prevent the tab from going into background mode and stop loading the pages.
let autoHideFavorites = true; //Automatically hide the favorites table while loading to improve performance. Automatically shows it when the loading is finished or stopped.

//Play a silent audio file to prevent throttling (different files for firefox/chromium)
//Might require autoplay to be turned on for the website
//do not initialize on page load (before user gesture)
class SilentAudio {
    constructor() {
        this.ctx = new AudioContext();
        this.source = this.ctx.createConstantSource();
        this.gainNode = this.ctx.createGain();

        this.gainNode.gain.value = 0.001; // required to prevent popping on start
        this.source.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);
        //suspend context and start the source
        this.ctx.suspend();
        this.source.start();
    }
    play() {
        this.ctx.resume();
    }
    pause() {
        this.ctx.suspend();
    }
}
let silentAudio = null;

const pref = GM_webextPref({
    default: {
        inserttoTable: true,
        playsilentAudio: true,
        autoHideFavorites: true,
        pageTimer: 3000,
    },
    body: [
        {
            key: "inserttoTable",
            type: "checkbox",
            label: "Insert new pages into the current page. Disable this if your browser freezes.",
        },
        {
            key: "playsilentAudio",
            type: "checkbox",
            label: "Play silent audio while loading the pages. This might prevent the tab from going into background mode and stop loading the pages.",
        },
        {
            key: "pageTimer",
            type: "number",
            label: "Time (ms) to load each page. Keep this higher than 3000 especially if you set the thumbnails to load with the page.",
        },
        {
            key: "autoHideFavorites",
            type: "checkbox",
            label: "Automatically hide the favorites table while loading to improve performance. Automatically show it when the loading is finished or stopped.",
        },
    ],
});

let pageCounter = 1,
    showExport = false,
    totalFavoritesCount = 0,
    displayMode = "",
    nextURL = "",
    titlesBackup = "",
    jsonData = [],
    skipInsertion = false,
    statusNode = null,
    isExhentai = true;

const globalCSS = `
    #exportFav {
        width: 900px;
    }

    #exportStatus {
        width: 900px;
        height: 168px;
        margin: auto;
        border: 2px solid gray;
        padding: 3px;
        resize: both;
        overflow: auto;
        white-space: pre-wrap;
        font-family: monospace;
        font-size: 13px;
        text-align: left;
    }

    #exportFavsdiv {
        padding: 0 6px 0 7px;
        border-bottom: 1px solid #00ffff36;
        line-height: 18px;
        margin-right: 6px;
    }
`;
const exhCSS = `
    .greenText {
        color: rgb(0, 185, 0);
    }
    .blueText {
        color: rgb(0, 202, 212);
    }
    .redText {
        color: rgb(255, 101, 115);
    }
`;
const ehCSS = `
    .greenText {
        color: rgb(0, 126, 0);
    }
    .blueText {
        color: rgb(0, 88, 202);
    }
    .redText {
        color: rgb(245, 0, 0);
    }
`;
const hideFavCSS = `
    #hiddenfavsNotice {
        font-size: 20pt;
        border: 2px solid #e84c4cb2;
        box-shadow: 0px 0px 4px #e84c4cb2;
        border-radius: 15px;
        padding: 4px 8px;
        margin: 10px auto;
        width: fit-content;
        max-width: 50%;
    }

    #favform > .itg {
        display: none;
    }
`;

function ready() {
    if (document.querySelector("form[name=favform]").innerText == "No hits found") {
        return;
    }
    //Add global styles
    addMyStyle("SSEAF_style_global", globalCSS);
    addMyStyle("SSEAF_style_hidefavs", hideFavCSS, true);
    //Add theme specific style
    if (document.location.host.includes("exhentai")) { //exhentai and onion
        isExhentai = true;
        addMyStyle("SSEAF_style", exhCSS);
    } else {
        isExhentai = false;
        addMyStyle("SSEAF_style", ehCSS);
    }
    //Get current display mode
    displayMode = document.querySelector("[onchange*='inline_set=dm_'").value; // m:minimal, p:minimal+, l:compact, e:extended, t:thumbnail

    let topmenu = document.querySelector("#nb");
    topmenu.style.justifyContent = "center";
    topmenu.style.width = "auto";
    topmenu.style.maxWidth = "99vw";
    document.querySelector("#nb").insertAdjacentHTML("beforeend", '<div id="exportFavsdiv"><a href="javascript:void(0)" id="exportFavorites">Load All Favorites</a></div>');
    document.querySelector("#exportFavorites").addEventListener("click", insertNodes);
}

//Count favorites and also generate the category dict
function countAllFavs() {
    totalFavoritesCount = 0;
    let cats = document.querySelectorAll(".ido > .nosel > div[onclick*='favcat=']");
    cats.forEach((cat, index) => {
        totalFavoritesCount += parseInt(cat.firstElementChild.textContent);
        favoriteCategoryDict[cat.lastElementChild.textContent] = index;
    });
}

function appendStatusHTML(htmlString) {
    statusNode.insertAdjacentHTML("beforeend", htmlString);
    statusNode.scrollTo(0, statusNode.scrollHeight);
}

function addRemoveButton(newbutton) {
    if (newbutton) {
        let containerDiv = document.createElement("div");
        document.getElementById("exportFav").insertAdjacentElement("afterend", containerDiv);
        containerDiv.insertAdjacentHTML("beforeend", "<input type='button' value='Remove Titles' id='removeTitles' style='margin-top:5px;min-height:18px;'>");
        //Add download txt button
        containerDiv.insertAdjacentHTML("beforeend", "<input type='button' value='Download TXT' id='buttonDownloadTXT' style='margin-top:5px;margin-left:5px;min-height:18px;'>");
        document.querySelector("#buttonDownloadTXT").addEventListener("click", downloadTXT, false);
        if (displayMode == "e") {
            containerDiv.insertAdjacentHTML("beforeend", "<input type='button' value='Download JSON Data' id='buttonDownloadJSON' style='margin-top:5px;margin-left:5px;min-height:18px;box-shadow: 0px 0px 4px #007bb7;'>");
            document.querySelector("#buttonDownloadJSON").addEventListener("click", downloadJSON, false);
        }
    } else {
        document.querySelector("#removeTitles").removeEventListener("click", restoreTitles, false);
        document.querySelector("#removeTitles").value = "Remove Titles";
    }
    document.querySelector("#removeTitles").addEventListener("click", removeTitles, false);
}

function showHideFavorites(showhide = false) {
    const hideStyle = document.querySelector("#SSEAF_style_hidefavs");
    let show = true;
    if (hideStyle.disabled) {
        show = false;
    } else {
        show = true;
    }
    //Override
    if (showhide == "show") {
        show = true;
    } else if (showhide == "hide") {
        show = false;
    }
    if (show) {
        document.querySelector("#hiddenfavsNotice")?.remove();
        hideStyle.disabled = true;
        document.querySelector("#showhideFavsBut").value = "Hide Favorites";
    } else {
        hideStyle.disabled = false;
        document.querySelector("#showhideFavsBut").value = "Show Favorites";
        document.querySelector("#favform").insertAdjacentHTML("beforebegin", '<div id="hiddenfavsNotice">Favorites are hidden!<br>Please wait until the loading is over...<br>&nbsp;<br>Or use the "Show Favorites" button above.<br>You can disable auto hiding in options.<br></div>');
    }
}

function addRestoreButton() {
    const remTitles = document.querySelector("#removeTitles");
    remTitles.removeEventListener("click", removeTitles, false);
    remTitles.value = "Restore Titles";
    remTitles.addEventListener("click", restoreTitles, false);
}

function removeTitles() {
    const exportFav = document.querySelector("#exportFav");
    titlesBackup = exportFav.textContent;
    exportFav.textContent = exportFav.textContent.replace(/( - .*)/g, "");
    addRestoreButton();
}

function restoreTitles() {
    document.querySelector("#exportFav").textContent = titlesBackup;
    addRemoveButton(0);
}

function getText(thisa) {
    let thetext = "";
    //all display modes
    thetext = /* he.encode( */ thisa.href + " - " + thisa.querySelector(".glink").textContent; /* ); */
    document.querySelector("#exportFav").append(thetext + "\n");
}

function insertNodes() {
    const topMenu = document.querySelector("#nb");
    if (showExport == false) {
        //Count favorites and generate favoriteCategoryDict
        countAllFavs();
        showExport = true;
        topMenu.insertAdjacentHTML("afterend", `<br class="uselessbr" /><br class="uselessbr" />
        <h2 class="uselessbr">Text List of Favorites</h2>
        <textarea readonly id="exportFav" name="Text1" cols="120" rows="7"></textarea>
        <h2 class="uselessbr">Status</h2>
        <div readonly id="exportStatus" name="Text2" cols="120" rows="8"></div>
        <br class="uselessbr" />
        <input type="button" value="Hide Favorites" id="showhideFavsBut" style="margin-top: 5px; min-height: 18px" />
        <input type="button" value="Options" id="optionsBut" style="margin-top: 5px; min-height: 18px" />
        <input type="button" value="START" id="startStopBut" style="margin-left: 5px; margin-top: 5px; min-height: 18px" />
        <br class="uselessbr" />
        `);
        document.querySelector("#showhideFavsBut").addEventListener("click", showHideFavorites, false);
        document.querySelector("#startStopBut").addEventListener("click", getThePagesNew, false);
        document.querySelector("#optionsBut").addEventListener("click", pref.openDialog, false);
        statusNode = document.querySelector("#exportStatus");
        appendStatusHTML("Keep the delay between pages higher than 3000 or your pages & thumbnails might not load.\n\n");
        appendStatusHTML("❗ If you want to have the best backup: <br><span class='greenText'>1. Use <b>Extended layout</b> so you can export JSON data as well. This works without the insert option.</span><br>2. Set thumbnails to load with the page (in e-h settings). You only need this if you are going to save the page afterwards.\n");
        appendStatusHTML("- Leave this tab active while the pages are loading if you want your pages and thumbnails to load correctly. (reason: all browsers throttle background tabs)\n");
        appendStatusHTML("- Don't change the page layout in another tab while loading.\n");
        appendStatusHTML("- If your browser crashes or completely freezes; disable the insert feature in the options.\n\n");
        appendStatusHTML("Press START below to start loading the pages.\n");
        //Below warning is no longer necessary with the new getThisPage logic. But it does prevent 1 extra page request (the current page)
        // //Warn EhSyringe users (only extended layout)
        // if (document.documentElement?.attributes?.class?.value?.includes("ehs-") && displayMode == "e") {
        //     //Warning: EhSyringe is not fully compatible. JSON output might have errors when EhSyringe is used. Turning off the option "translate timestamp" might help fix it. Feel free to contribute code to fix the issue.
        //     appendStatusHTML("<span class='redText'>(警告：EhSyringe 不完全兼容。 使用 EhSyringe 时，JSON 输出可能会出现错误。 关闭''翻译时间戳''选项可能有助于修复它。 请随意贡献代码来解决该问题。)</span>\n");
        // }
        //Experimental: this is just so we can have some redundancy.
        if (!document.querySelector("#SSEAFjsonData") && displayMode == "e") {
            let hiddenDiv = document.createElement("pre");
            hiddenDiv.id = "SSEAFjsonData";
            hiddenDiv.style.display = "none";
            document.body.appendChild(hiddenDiv);
        }
    } else {
        //destroyBox();
        //showExport = 0;
        return;
    }

    if (window.location.search.includes("page=") || window.location.search.includes("prev=") || window.location.search.includes("next=") || window.location.search.includes("jump=")) {
        appendStatusHTML("<span class='redText'>(Info: The script does not read previous pages.)\n</span>\n");
        return;
    }
}

function getThisPage() {
    //TODO IF using a translation script-> skip this and set current url to nextpage
    //LATER call this function from the fetch loop
    //Parse the page
    let trlen = document.querySelectorAll(".itg .glname").length;
    let rows = document.querySelectorAll(".itg > tbody > tr");
    let links = document.querySelectorAll(".itg .glname a");
    let firstRow = true;
    for (var j = 0; j < trlen; j++) {
        let thislink;
        //Extended mode
        if (displayMode == "e") {
            let row = rows[j];
            thislink = row.querySelector(".glink").closest("a");
            //get json data from row
            const rowData = getJSONfromExtendedRow(row);
            //Confirm json structure, otherwise load current page using nextURL (translation script workaround)
            if (firstRow &&
                (!rowData?.gallery_info_full?.date_uploaded || !rowData?.gallery_info_full?.category || !rowData?.gallery_info_full?.title)
            ) {
                //Set this page as nexturl (nothing happend yet)
                nextURL = document.location.href;
                skipInsertion = true;
                pageCounter--; //For the status panel
                console.warn("SSEAF ~ parsed JSON is incomplete or incorrect. Current page will be requested again. This is likely caused by translation or by another script altering the page.");
                // appendStatusHTML("info: Requesting current page for a correct JSON output (likely caused by translation or another script)");
                return;
            }
            if (rowData) {
                firstRow = false;
                jsonData.push(rowData);
            }
        } else {
            thislink = links[j];
        }
        firstRow = false;
        getText(thislink);
    }
    //Get nextURL
    nextURL = document.querySelector(".searchnav a[href*='next=']")?.href;
}

function getThePagesNew() {
    jsonData = [];
    let interruptSignal = false;

    const startStopButton = document.querySelector("#startStopBut");
    startStopButton.removeEventListener("click", getThePagesNew, false);
    startStopButton.setAttribute("value", "STOP");
    startStopButton.setAttribute("style", "box-shadow: 0px 0px 4px #B7002B;");
    startStopButton.blur();
    startStopButton.addEventListener("click", () => {
        if (confirm("Stop loading?")) {
            startStopButton.setAttribute("disabled", true);
            appendStatusHTML("<span class='redText'>Stopping after the current page...</span>\n");
            interruptSignal = true;
        }
    }, false);

    inserttoTable = pref.get("inserttoTable");
    playsilentAudio = pref.get("playsilentAudio");
    pageTimer = pref.get("pageTimer");
    autoHideFavorites = pref.get("autoHideFavorites");

    //Get the current page (and the nextURL)
    getThisPage();

    if (nextURL) {
        if (autoHideFavorites) {
            showHideFavorites("hide");
        }
        // console.log("🚀 ~ getThePagesNew ~ nextURL:", nextURL);
        if (playsilentAudio) {
            //initialize audio context
            if (!silentAudio) {
                silentAudio = new SilentAudio();
            }
            silentAudio.play();
        }
        appendStatusHTML("Loading will take at least " + (pageTimer / 1000).toFixed(1) + " seconds per page.\n");

        let tryCount = 0;
        let retryLimit = 20;

        function doFetch(url) {
            //Check if the interrupt signal is set or the url is empty
            if (interruptSignal || !url) {
                //Stop the recursion and finish crawling
                finishCrawling();
                return;
            }

            appendStatusHTML("Loading Page " + (pageCounter + 1) + "...\n");

            //Fetch the url and handle the response
            fetch(url, {
                method: "GET",
            })
                .then((response) => response.text())
                .then((sss) => {
                    // console.time("parse page");
                    let parser = new DOMParser();
                    let docSSS = parser.parseFromString(sss, "text/html");
                    //Parse the page
                    let trlen = docSSS.querySelectorAll(".itg .glname").length;
                    let rows = docSSS.querySelectorAll(".itg > tbody > tr");
                    let links = docSSS.querySelectorAll(".itg .glname a");
                    for (var j = 0; j < trlen; j++) {
                        let thislink;
                        //Extended mode
                        if (displayMode == "e") {
                            let row = rows[j];
                            thislink = row.querySelector(".glink").closest("a");
                            //get json data from row
                            jsonData.push(getJSONfromExtendedRow(row));
                        } else {
                            thislink = links[j];
                        }
                        getText(thislink);
                    }
                    //Bulk append the nodes
                    if (inserttoTable && !skipInsertion) {
                        if (displayMode != "t") {
                            //All except thumbnail mode
                            //Filter the table header
                            let tablerows = [...rows].filter((elem) => elem.querySelector(".glname"));
                            document.querySelector(".itg tbody").append(...tablerows);
                        } else {
                            document.querySelector(".itg").append(...docSSS.querySelectorAll(".itg > .gl1t"));
                        }
                    }

                    // debugger;
                    //Get nextURL
                    nextURL = docSSS.querySelector(".searchnav a[href*='next=']")?.href;
                    // console.log("🚀 ~ .then ~ nextURL:", nextURL);
                    //Increment the page counter
                    pageCounter++;
                    //Reset the try count
                    tryCount = 0;

                    // console.timeEnd("parse page");

                    //Call the doFetch function again with the next url after a delay
                    let nu = nextURL; //use a local variable for setTimeout
                    setTimeout(() => {
                        doFetch(nu);
                    }, 200 + pageTimer);
                })
                .catch((error) => {
                    console.log("🚀 SaveExportFavorites ~ doFetch ~ error:", error);
                    //Increment the try count
                    tryCount++;

                    //Check if the try count exceeds the retry limit
                    if (tryCount > retryLimit) {
                        //Stop the recursion and finish crawling
                        finishCrawling("ERROR! Page loading retry limit exceeded. Check your network connection or increase the delay (ms) in the settings.");
                        return;
                    }

                    //Call the doFetch function again with the same url after a delay
                    setTimeout(function () {
                        doFetch(url);
                    }, 200 + pageTimer);
                })
                .finally(() => {
                    if (skipInsertion) { skipInsertion = false };
                });
        }

        //Start the recursion with the first url
        doFetch(nextURL);
    } else {
        finishCrawling();
    }

    function finishCrawling(errorMessage = "") {
        if (playsilentAudio && silentAudio) {
            silentAudio.pause();
        }
        if (autoHideFavorites) {
            showHideFavorites("show");
        }
        startStopButton.setAttribute("disabled", true);
        startStopButton.setAttribute("style", "");
        if (interruptSignal) {
            appendStatusHTML("<span class='redText'>Loading Interrupted!</span>\n");
        } else if (errorMessage) {
            appendStatusHTML("<span class='redText'>" + errorMessage + "</span>\n");
        } else {
            appendStatusHTML("Loading complete.\n");
        }
        appendStatusHTML('Copy above list and/or press Ctrl+S to save the page (use the "complete" or the ".mhtml" option).\n');
        appendStatusHTML("Info: <span class='blueText'>" + totalFavoritesCount + "</span> favorites total in all categories.\nConfirmation: <span class='blueText'>" + (document.querySelector("#exportFav").value.split("\n").length - 1) + "</span> favorites in above text area, <span class='blueText'>" + (document.querySelectorAll(".itg .glname a").length + document.querySelectorAll(".gl4e .glink").length) + "</span> favorites in below page");
        if (displayMode == "e") {
            //continue previous sentence
            appendStatusHTML(", <span class='blueText'>" + jsonData.length + "</span> objects in parsed JSON data.\n");
            appendStatusHTML("<a target='_blank' href='https://sadpanda-graphs.surge.sh/'>Example JSON use case (favorite tag charts)</a>\n");
            document.querySelector("#SSEAFjsonData").textContent = JSON.stringify(jsonData);
        } else {
            //finish previous sentence
            appendStatusHTML(".\n");
        }
        appendStatusHTML("If your gallery count doesn't add up, try again. You can load the pages faster now that you cached all the thumbnails.\n");
        addRemoveButton(1);
    }
}


/* --- JSON template info ---
Trying to stay compatible with the dnsev-h' JSON format.
Using gallery_info_full but obviously a ton of data is missing. Just compare the output.
Tags might be missing their alternative spellings ("hanafuda sakurano | hanafuda sakura" will only have "hanafuda sakurano")

My additions:
- "date_favorited": 1579748580000
- "user_rating": 4.5
- "favorites": { "note": "favorite note text" }
*/

class baseJSON {
    constructor() {
        this.data = {
            "gallery_info_full": {
                "gallery": {
                    "gid": null,
                    "token": null
                },
                "title": "",
                // "title_original": "",
                "date_uploaded": 0,
                "date_favorited": 0,
                "category": "",
                "uploader": "",
                "rating": {
                    "average": 0,
                    "count": 0
                },
                "user_rating": 0,
                "favorites": {
                    "category": -1,
                    "category_title": "",
                    "note": "",
                    // "count": 0
                },
                // "parent": null,
                // "newer_versions": [],
                "thumbnail": "",
                // "thumbnail_size": "large",
                // "thumbnail_rows": 0,
                "image_count": 0,
                // "images_resized": false,
                // "total_file_size_approx": 0,
                // "visible": true,
                // "visible_reason": "",
                // "language": "Japanese",
                // "translated": false,
                "tags": {},
                "tags_have_namespace": true,
                // "torrent_count": 0,
                // "archiver_key": "",
                "source": "layout_extended",
                "source_site": "exhentai",
                "date_generated": 0
            },
            "source_script": "save-export-all-favorites",
        };
    }
}

//generated by countAllFavs()
let favoriteCategoryDict = {};

const categoryDict = {
    "Doujinshi": "doujinshi",
    "Manga": "manga",
    "Artist CG": "artistcg",
    "Game CG": "gamecg",
    "Western": "western",
    "Non-H": "non-h",
    "Image Set": "imageset",
    "Cosplay": "cosplay",
    "Asian Porn": "asianporn",
    "Misc": "misc",
    //Basic EhSyringe compatibility (!! not fully compatible !!)
    "同人志": "doujinshi",
    "漫画": "manga",
    "画师CG": "artistcg",
    "游戏CG": "gamecg",
    "西方": "western",
    "无H": "non-h",
    "图集": "imageset",
    "亚洲色情": "asianporn",
    "杂项": "misc",
};

//Parse extended layout rows for json data. This might break if another script adds something to the extended layout.
function getJSONfromExtendedRow(row) {
    try {
        let rowJson = new baseJSON().data;
        let info = rowJson["gallery_info_full"];
        let matchGID = row.querySelector("a").href.match(/\/g\/(\d+)\/(.*?)(\/)*$/);
        info.gallery = {
            "gid": matchGID[1],
            "token": matchGID[2]
        };
        info.title = row.querySelector(".glink").textContent.trim();
        info.date_uploaded = getTimestamp(row.querySelector("div[id*=posted_]").textContent);
        info.date_favorited = getTimestamp(row.querySelector(".gldown").nextElementSibling.querySelectorAll("p")[1].textContent);
        info.category = categoryDict[row.querySelector(".cn").textContent];
        let uploaderNode = row.querySelector("a[href*='/uploader/']");
        info.uploader = uploaderNode ? decodeURIComponent(uploaderNode.href.match(/uploader\/(.*)/)[1]) : null;

        //User rating or Public rating. Can't get public rating if user rating exists.
        let ratingNode = row.querySelector(".ir") || null;
        if (ratingNode) {
            let ratingMatch = ratingNode.attributes.style.value.match(/background-position:[- ]*(\d+?)px[- ]*(\d+?)px.*/);
            if (ratingMatch.length >= 3) {
                let ratingStars = 5 - (parseInt(ratingMatch[1]) / 16) - ((parseInt(ratingMatch[2]) == 21) ? 0.5 : 0);
                if (ratingNode.classList.contains("irb") || ratingNode.classList.contains("irg") || ratingNode.classList.contains("irr")) {
                    //User rating
                    info.user_rating = ratingStars;
                } else {
                    //Public rating
                    info.rating.average = ratingStars;
                }
            }
        }

        //Category (0 for the first category, 9 for the last category)
        let categoryTitle = row.querySelector("div[id*=posted_]").title;
        //Favorite note
        let favNote = "";
        let noteNode = row.querySelector(".glfnote");
        if (noteNode.textContent != "") {
            favNote = noteNode.textContent.match(/^(Note: |备注：)(.*)/)[2];
        }
        info.favorites = {
            "category": favoriteCategoryDict[categoryTitle],
            "category_title": categoryTitle,
            "note": favNote
        };
        info.thumbnail = row.querySelector("img").src;
        info.image_count = parseInt(row.querySelector(".gldown").previousElementSibling.textContent.split(" ")[0]);


        info.tags = generateTagListByNameSpace(row);

        info.source_site = document.location.host.split(".")[0];
        info.date_generated = Date.now();

        return rowJson;
    } catch (error) {
        console.trace("SaveExportFavorites: getJSONfromExtendedRow error!", { FULL_ERROR_LOG: { error: error, row: row, rowOuterHTML: row.outerHTML } });
    }
}

//generateTagListByNameSpace by Caca Ductile. Thank you.
function generateTagListByNameSpace(row) {
    let tags = {};
    row.querySelectorAll(".gt,.gtl,.gtw").forEach((tag) => {
        try {
            if (tag) {
                const content = tag.title.split(":");
                let namespace = content[0];
                const value = content[1];
                if (namespace == "" && value) {
                    //Handle: temp tags don't have a namespace in title ":temptag"
                    namespace = tag.closest(".glname tr").querySelector(".tc").textContent.match("(.*?)(:|：)")[1] || "temp";
                }
                if (!tags[namespace]) {
                    tags[namespace] = [];
                }
                tags[namespace].push(value);
            }
        } catch (error) {
            console.trace("SaveExportFavorites: generateTagListByNameSpace error!", { FULL_ERROR_LOG: { error: error, tag: tag, row: row, rowOuterHTML: row.outerHTML } });
        }
    });
    return tags;
}

//getTimestamp by dnsev-h (https://github.com/dnsev-h/x). Thank you.
function getTimestamp(text) {
    let match = /([0-9]+)-([0-9]+)-([0-9]+)\s+([0-9]+):([0-9]+)/.exec(text);

    if (match === null) {
        return null;
    }

    return Date.UTC(
        parseInt(match[1], 10), // year
        parseInt(match[2], 10) - 1, // month
        parseInt(match[3], 10), // day
        parseInt(match[4], 10), // hours
        parseInt(match[5], 10), // minutes
        0, // seconds
        0); // milliseconds
}

function downloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function addMyStyle(styleID, styleCSS, styleDisabled = false) {
    var myStyle = document.createElement("style");
    //myStyle.type = 'text/css';
    myStyle.id = styleID;
    myStyle.textContent = styleCSS;
    document.querySelector("head").appendChild(myStyle);
    //Disable after appending or it doesn't work
    myStyle.disabled = styleDisabled;
}

function downloadTXT() {
    //yyyy-mm-dd
    let today = new Date();
    today = new Date(today.getTime() - (today.getTimezoneOffset() * 60000));
    today = today.toISOString().split("T")[0];
    downloadFile(document.querySelector("#exportFav").textContent, `Sadpanda-Favorites-${today}.txt`, "text/plain");
}

function downloadJSON() {
    //yyyy-mm-dd
    let today = new Date();
    today = new Date(today.getTime() - (today.getTimezoneOffset() * 60000));
    today = today.toISOString().split("T")[0];
    downloadFile(JSON.stringify(jsonData, null, 2), `Sadpanda-Favorites-${today}.json`, "text/plain");
}

// console.log("SaveExportFavorites");
ready();
