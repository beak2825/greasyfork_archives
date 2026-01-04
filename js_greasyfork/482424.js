// ==UserScript==
// @name         GGn Mass Downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Allows you to mass-download files from GGn using search parameters
// @author       Anonymous
// @match        https://gazellegames.net/*
// @icon         https://gazellegames.net/favicon.ico
// @grant        GM_log
// @grant        GM_addStyle
// @run-at       document-idle
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/482424/GGn%20Mass%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/482424/GGn%20Mass%20Downloader.meta.js
// ==/UserScript==

///////////////////////////////////////////////////////
//                      Globals                      //
///////////////////////////////////////////////////////
let _GLOBAL_ = {
    search_dialog: null
}

///////////////////////////////////////////////////////
//                      Styles                       //
///////////////////////////////////////////////////////

GM_addStyle(`
        .searchbar_massdownload button {
            cursor: pointer;
            background: #1C3145;
            border: 1px outset buttonface;
            width: 120px;
        }

        .mass_download_search_form_outer {
            position: absolute;
            top: 25%;
            left: 25%;
            padding: 1em;
            background: #151C30;
            border: 3px double black;
            border-radius: 1ex;
            z-index: 2147483648;
            max-width: 600px;
            max-height: 600px;
        }

        .mass_download_search_form_inner {
            max-height: 400px;
            overflow-y: auto;
            padding: 0.5em;
        }

        .md_search_previewButton {
            cursor: pointer;
            margin: 1em 0.5em;
            border: 1px outset buttonface;
        }

        .md_search_downloadButton {
            cursor: pointer;
            margin: 1em 0.5em;
            border: 1px outset buttonface;
        }

        .md_search_cancelButton {
            cursor: pointer;
            margin: 1em 0.5em;
            border: 1px outset buttonface;
        }

        .md_search_clearButton {
            cursor: pointer;
            margin: 1em 0.5em;
            border: 1px outset buttonface;
        }

        .md_search_text_input {
            margin: 0.5em 0em 1em 0em;
            width: 80%;
        }
        .md_search_dropdown_input {
            margin: 1em 2em 1em 0.5em;
        }

        .md_search_number_input {
            margin: 0.5em 0em 1em 0em;
            width: 10em;
        }

        .md_search_year_input {
            margin: 0.5em 0em 1em 0em;
            width: 10em;
        }

        .md_search_checkbox {
            vertical-align: middle;
            position: relative;
            bottom: 1px;
        }
`);

///////////////////////////////////////////////////////
//                     Utilities                     //
///////////////////////////////////////////////////////
// Thanks w3schools, https://www.w3schools.com/howto/howto_js_draggable.asp
function makeDraggable(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        // e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

///////////////////////////////////////////////////////
//                      Widgets                      //
///////////////////////////////////////////////////////
function getQueryValues(){
    const platform = document.querySelector(".md_search_text_input#mdPlatform").value ?? "";
    const title = document.querySelector(".md_search_text_input#mdTitle").value ?? ""
    const year = document.querySelector(".md_search_year_input#mdGameYear").value ?? ""
    const releaseTitle = document.querySelector(".md_search_text_input#mdReleaseTitle").value ?? ""
    const bitRate = document.querySelector(".md_search_text_input#mdOSTBitrate").value ?? ""
    const format = document.querySelector(".md_search_text_input#mdOSTFormat").value ?? ""
    const region = document.querySelector(".md_search_text_input#mdGameRegion").value ?? ""
    const language = document.querySelector(".md_search_text_input#mdLanguage").value ?? ""
    const releaseType = document.querySelector(".md_search_text_input#mdReleaseType").value ?? ""
    const scene = document.querySelector(".md_search_dropdown_input#mdSceneOnly").value;
    const gamedox = document.querySelector(".md_search_text_input#mdGameDOXType").value ?? ""
    const gamedoxVersion = document.querySelector(".md_search_text_input#mdGameDOXVersion").value ?? ""
    const specialEdition = document.querySelector(".md_search_text_input#mdSpecialEdition").value ?? ""
    const specialEditionYear = document.querySelector(".md_search_year_input#mdSpecialEditionYear").value ?? ""
    const category = document.querySelector(".md_search_dropdown_input#mdCategory").value;

    return {
        "platform": platform,
        "title": title,
        "year": year,
        "releaseTitle": releaseTitle,
        "bitRate": bitRate,
        "format": format,
        "region": region,
        "language": language,
        "releaseType": releaseType,
        "scene": scene,
        "gamedox": gamedox,
        "gamedoxVersion": gamedoxVersion,
        "specialEdition": specialEdition,
        "specialEditionYear": specialEditionYear,
        "category": category
    };
}

function onMassDownloadPreviewClick(){
    let v = getQueryValues();
    let queryString = `action=advanced`;
    queryString = queryString.concat(`&artistname=${v.platform}&groupname=${v.title}&year=${v.year}&releasetitle=${v.releaseTitle}`);
    queryString = queryString.concat(`&encoding=${v.bitRate}&format=${v.format}&region=${v.region}&language=${v.language}&miscellaneous=${v.releaseType}&scene=${v.scene}`);
    queryString = queryString.concat(`&gamedox=${v.gamedox}&gamedoxvers=${v.gamedoxVersion}&remastertitle=${v.specialEdition}&remasteryear=${v.specialEditionYear}`);

    queryString = queryString.concat(`&order_by=relevance&order_way=desc&empty_groups=both`);
    queryString = queryString.concat(`&releasegroup=&filelist=&sizesmall=&sizelarge=&userrating=&metarating=&ignrating=&gsrating=&dupable=&freetorrent=&checked=&taglist=&rating=`);

    const category = document.querySelector(".md_search_dropdown_input#mdCategory").value;
    if (category > 0 && category < 5){
        queryString = queryString.concat(`&filter_cat%5B${category}%5D=1`);
    }
    window.open(`/torrents.php?${queryString}`, "_blank");
}

function onMassDownloadDownloadClick(){
    let v = getQueryValues();
    let queryString = `action=mass_download`;
    queryString = queryString.concat(`&platform=${v.platform}&game_title=${v.title}&year=${v.year}&release_title=${v.releaseTitle}`);
    queryString = queryString.concat(`&bitrate=${v.bitRate}&format=${v.format}&region=${v.region}&language=${v.language}&release_type=${v.releaseType}&scene=${v.scene}`);
    queryString = queryString.concat(`&gamedox_type=${v.gamedox}&gamedox_version=${v.gamedoxVersion}&special_edition=${v.specialEdition}&special_edition_year=${v.specialEditionYear}`);

    queryString = queryString.concat(`&order_by=relevance&order_way=desc&empty_groups=both`);
    queryString = queryString.concat(`&releasegroup=&filelist=&sizesmall=&sizelarge=&userrating=&metarating=&ignrating=&gsrating=&dupable=&freetorrent=&checked=&taglist=&rating=`);

    const category = document.querySelector(".md_search_dropdown_input#mdCategory").value;
    // Do we need this check? Check API reference when GGn is back up
    //if (category > 0 && category < 5) {
        queryString = queryString.concat(`&category=${category}`);
    //}

    const handle = window.open(`/torrents.php?${queryString}`, "_self");
    if (handle) handle.addEventListener("load", () => { GM.log(`Downloaded file`); }, true);
}

function searchCategoryOnChange(){
    let category = document.querySelector(".md_search_dropdown_input#mdCategory").value;
    let ostGroup = document.querySelectorAll(".md_search_ost_grp") ?? [];
    const isOST = (category == 4);
    for (let i = 0; i < ostGroup.length; i++){
        let inp = ostGroup[i];
        if (isOST) inp.style.display = "block";
            else inp.style.display = "none";
    }
}

function onMassDownloadClearClick(){
    document.querySelector(".md_search_text_input#mdPlatform").value = "";
    document.querySelector(".md_search_text_input#mdTitle").value = "";
    document.querySelector(".md_search_year_input#mdGameYear").value = "";
    document.querySelector(".md_search_text_input#mdReleaseTitle").value = "";
    document.querySelector(".md_search_text_input#mdOSTBitrate").value = "";
    document.querySelector(".md_search_text_input#mdOSTFormat").value = "";
    document.querySelector(".md_search_text_input#mdGameRegion").value = "";
    document.querySelector(".md_search_text_input#mdLanguage").value = "";
    document.querySelector(".md_search_text_input#mdReleaseType").value = "";
    document.querySelector(".md_search_dropdown_input#mdSceneOnly").value = ""
    document.querySelector(".md_search_text_input#mdGameDOXType").value = "";
    document.querySelector(".md_search_text_input#mdGameDOXVersion").value = "";
    document.querySelector(".md_search_text_input#mdSpecialEdition").value = "";
    document.querySelector(".md_search_year_input#mdSpecialEditionYear").value = "";
    document.querySelector(".md_search_dropdown_input#mdCategory").value = 0;
    document.querySelector(".md_search_number_input#mdLowSeeds").value = "";
}

function w_searchDialog(){
    if (_GLOBAL_.search_dialog == null){
        let dialog = document.createElement("div");
        dialog.setAttribute("class", "mass_download_search_form_outer");
        dialog.setAttribute("id", "mass_download_search_form_outer");
        dialog.setAttribute("style", "display: none");
        dialog.innerHTML = `
                        <div><h1 align="center">Mass Download</h1></div>
                        <div>Please note: "Preview Search" may not exactly match the delivered torrents. This is due to mismatches between the search and download APIs.</div>
                        <hr>
                        <div><h2>Search Parameters</h2></div>
                        <form>
                        <div class="mass_download_search_form_inner">
                        <section>
                            <b>Category</b>
                            <select class="md_search_dropdown_input" name="mdCategory" id="mdCategory">
                                <option value=0>All</option>
                                <option value=1>Games</option>
                                <option value=2>Applications</option>
                                <option value=3>eBooks</option>
                                <option value=4>OSTs</option>
                            </select>
                            <b>Scene</b>
                            <select class="md_search_dropdown_input" name="mdSceneOnly" id="mdSceneOnly">
                                <option value="">All</option>
                                <option value=1>Scene Only</option>
                                <option value=0>No Scene</option>
                            </select>
                        </section>
                        <section>
                            <b>Game Title / Group Title</b>
                            <div>This is a fuzzy search and will search within group names.</div>
                            <input type='text' class="md_search_text_input" name='mdTitle' id='mdTitle' placeholder='Game Title' spellcheck>
                        </section>
                        <section>
                            <b>Platform</b>
                            <div>The platform name, ie. Windows. This is a fuzzy search so you can put in partial values.</div>
                            <input type='text' class="md_search_text_input" name='mdPlatform' id='mdPlatform' placeholder='Game Platform' spellcheck>
                        </section>
                        <section>
                            <b>Game Year</b>
                            <br>
                            <input type="number" class="md_search_year_input" name="mdGameYear" id="mdGameYear" min="1900" max="3000" step="1" value="">
                        </section>
                        <section>
                            <b>Release (Torrent) Title</b>
                            <div>This is the torrent's name. This is a fuzzy search and will search within torrent names.</div>
                            <input type='text' class="md_search_text_input" name='mdReleaseTitle' id='mdReleaseTitle' placeholder='Release Title' spellcheck>
                        </section>
                        <section>
                            <b>Release Type</b>
                            <div>The torrent release type. E.g., Full ISO, GameDOX, GGn Internal, P2P, Rip, Scrubbed, Home Rip, DRM Free, ROM, Other. This is a fuzzy search so you can put in partial values.</div>
                            <input type='text' class="md_search_text_input" name='mdReleaseType' id='mdReleaseType' placeholder='Release Type' spellcheck>
                        </section>
                        <section class="md_search_ost_grp" style="display: none;">
                            <b>Format</b>
                            <div>OST format. MP3 or FLAC.</div>
                            <input type='text' class="md_search_text_input" name='mdOSTFormat' id='mdOSTFormat' placeholder='OST Format' spellcheck>
                        </section>
                        <section class="md_search_ost_grp" style="display: none;">
                            <b>Bitrate</b>
                            <div>OST bitrate. E.g., 192, V2, V1, 256, V0, 320, Lossless, 24bit Lossless, or some other bitrate. This is a fuzzy search so you can put in partial values.</div>
                            <input type='text' class="md_search_text_input" name='mdOSTBitrate' id='mdOSTBitrate' placeholder='OST Bitrate' spellcheck>
                        </section>
                        <section>
                            <b>Region</b>
                            <div>This is a game torrents region. Not all platforms have regions. E.g., Region-Free, Muli-Region, NTSC, NTSC-J, NTSC-C, PAL, PAL-E. This is a fuzzy search so you can put in partial values.</div>
                            <input type='text' class="md_search_text_input" name='mdGameRegion' id='mdGameRegion' placeholder='Game Region' spellcheck>
                        </section>
                        <section>
                            <b>Language</b>
                            <div>Game torrent language. E.g., Multi-Language, English, Spanish, or any other language we allow. This is a fuzzy search so you can put in partial values.</div>
                            <input type='text' class="md_search_text_input" name='mdLanguage' id='mdLanguage' placeholder='Game Language' spellcheck>
                        </section>
                        <section>
                            <b>Special Edition</b>
                            <div>The special edition name. Ie. Legendary Edition. This is a fuzzy search so you can put in partial values.</div>
                            <input type='text' class="md_search_text_input" name='mdSpecialEdition' id='mdSpecialEdition' placeholder='Game Special Edition' spellcheck>
                        </section>
                        <section>
                            <b>Special Edition Year</b>
                            <br>
                            <input type="number" class="md_search_year_input" name="mdSpecialEditionYear" id="mdSpecialEditionYear" min="1900" max="3000" step="1" value="">
                        </section>
                        <section class="md_search_gamedox_grp">
                            <b>GameDOX Type</b>
                            <div>A torrent's GameDOX type. E.g., Fix, Keygen, Update, DLC, Trainer, Tool, Guide, Artwork, Audio. This is a fuzzy search so you can put in partial values.</div>
                            <input type='text' class="md_search_text_input" name='mdGameDOXType' id='mdGameDOXType' placeholder='GameDOX Type' spellcheck>
                        </section>
                        <section class="md_search_gamedox_grp">
                            <b>GameDOX Version</b>
                            <div>A torrents gamedox version number.</div>
                            <input type='text' class="md_search_text_input" name='mdGameDOXVersion' id='mdGameDOXVersion' placeholder='GameDOX Version Number' spellcheck>
                        </section>
                        <section>
                            <b>Low Seeds</b>
                            <div>A maximum seeder count. NOTE: This will NOT be used in the preview search.</div>
                            <input type='number' class="md_search_number_input" name='mdLowSeeds' id='mdLowSeeds'>
                        </section>

                        </div>
                        <section align="center">
                            <button class="md_search_previewButton"  id="md_search_previewButton"  type="button">Preview Search</button>
                            <button class="md_search_downloadButton" id="md_search_downloadButton" type="button">Download All</button>
                            <button class="md_search_cancelButton"   id="md_search_cancelButton"   type="button">Cancel</button>
                            <button class="md_search_clearButton"    id="md_search_clearButton"    type="button">Clear</button>
                        </section>
                        </form>
                        `;

        dialog.querySelector(".md_search_dropdown_input#mdCategory").addEventListener("click", searchCategoryOnChange);
        dialog.querySelector("#md_search_previewButton").onclick = () => onMassDownloadPreviewClick();
        dialog.querySelector("#md_search_downloadButton").onclick = () => onMassDownloadDownloadClick();
        dialog.querySelector("#md_search_clearButton").onclick = () => onMassDownloadClearClick();
        dialog.querySelector("#md_search_cancelButton").onclick = () =>w_searchDialog().setAttribute("style", "display: none");

        makeDraggable(dialog);

        _GLOBAL_.search_dialog = dialog;
        document.body.append(_GLOBAL_.search_dialog);
        GM.log("searchDialog initialized");
    }
    return _GLOBAL_.search_dialog;
}

function w_massDownloadButton(){
    let li = document.createElement('li');
    if (!li) GM.error("Failed to create mass download button!");
    li.setAttribute("class", "searchbar_massdownload");
    li.setAttribute("id", "searchbar_massdownload");
    li.innerHTML = `<span class="hidden">Mass Download: </span>
                    <button type="button" class="mass_download_button" id="mass_download_button">Mass Download</button>`;
    li.querySelector("button#mass_download_button").onclick = () =>
    {
        if (w_searchDialog().getAttribute("style").match(/.*display: block.*/)){
            w_searchDialog().setAttribute("style", "display: none");
        } else {
            w_searchDialog().setAttribute("style", "display: block");
        }
    }
    return li;
}

///////////////////////////////////////////////////////
//                       MAIN                        //
///////////////////////////////////////////////////////
(function() {
    'use strict';

        GM.log("Initializing...");

    // Create GG menu button
    const observerCb = async function(_mutations, observer){
        // debugger;
        // Select the menu
        let menu = document.querySelector("div#searchbars")?.querySelector("ul");
        // If it exists, append the mass download button
        if (menu && document.contains(menu)){
            observer.disconnect();
            menu.append(w_massDownloadButton());
            GM.log("Toolbar button loaded");
        }
    };

    const observer = new MutationObserver(observerCb);
    observer.observe(document, {attributes: false, childList: true, subtree: true});
})();