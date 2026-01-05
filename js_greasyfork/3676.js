// ==UserScript==
// @name        Coppersmina
// @namespace   github.com/ariacorrente/coppersmina
// @description Enhances Coppermine galleries with direct links, color coded border and other tricks. See source code for more info.
// @version     0.8
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @match       http://*/*
// @require     https://greasyfork.org/scripts/2855-gm-config/code/GM_config.js?version=8032
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/3676/Coppersmina.user.js
// @updateURL https://update.greasyfork.org/scripts/3676/Coppersmina.meta.js
// ==/UserScript==

/*
Copyright (C) 2014  ariacorrente

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

Contact: https://github.com/ariacorrente/coppersmina
*/

/*
# Coppersmina

User script that enhances Coppermine galleries with direct links, color coded
border and other tiny features.

Allows the use of mass downloaders like DownThemAll! and FlashGot.

Project repository:

https://github.com/ariacorrente/coppersmina

## Features

- Configuration dialog accessible through menu command
- Replace links in thumbnails to point directly to the high defintion image
- Add a colored border indicating the size of the image
- Append image information into the thumbnail's caption
- Add a link to open the thumbnail's parent album into a new tab
- Remove the tooltip from the thumbnails
- The "always run" feature allows the execution of the script even if the site
    is not automatically detected as a Coppermine gallery

## Performance and security

AKA: Why is this script running on every page?

This script will run on every page because the domain name is not usefull to
identify an installed Coppermine gallery in the website.

Before doing the heavy work the script will try to detect if the page is a
Coppermine gallery. The script scans the page for anchors containing the string
"coppermine".

## "Always run" feature

The "always run" feature allows the execution of the heavy work even if the
script failed to detect the site as Coppermine gallery. This is usefull when
the webmaster changed the web pages resulting in a failed detection.

This option is domain specific because it's saved in local storage. When set for
a domain it will be remembered only for the current domain.

Running the script in a non-coppermine site may cause problems and make some
sites misbehave.
*/

(function () {
    var colorCode = [{size: 0,    color: 'lightgray'},
                     {size: 250,  color: 'lightgreen'},
                     {size: 500,  color: 'yellow'},
                     {size: 1000, color: 'red'},
                     {size: 2000, color: 'magenta'}];

    var debugMode = false;

    function clog(msg) {
        if (debugMode) {
            console.log(msg);
        }
    }

    //Detect if this site is a Coppermine gallery
    var coppermineDetected = document.querySelector('a[href*=coppermine]') !== null;

    //runAlways is handled by localstorage so it's domain specific
    var runAlways = localStorage.getItem("runAlways") === "true";

    //Settings dialog will be inserted in configFrame
    var configFrame;
    GM_config.init({
        "id": "GM_config",
        "title": "Coppersmina - Settings",
        "fields": {
            "colorBorder": {
                "section": ["Border of thumbnails", "Add a color coded border based on the size of the image. From smaller to bigger the colors are sorted in the order \
                <span class='colorLevel0'>small</span> < \
                <span class='colorLevel1'>interesting</span> < \
                <span class='colorLevel2'>nice</span> < \
                <span class='colorLevel3'>big</span> < \
                <span class='colorLevel4'>huge"],
                "label": "Enable colored borders",
                "labelPos": "right",
                "type": "checkbox",
                "default": true
            },
            "colorByWhat": {
                "label": "Color based on the image feature:",
                "type": "select",
                "title": "Dimensions will use the image width and height\nFilesize will use the size of the file.",
                "options": ["Dimensions", "Filesize"],
                "default": "Dimensions"
            },
            "borderSize": {
                "label": "Border size:",
                "title": "Width in pixels of the border drawn around the thumbnails",
                "type": "int",
                "min": 0,
                "size": 5,
                "default": 3
            },
            "clearOldCaption": {
                "section": ['Captions', 'Remove or add information to the captions below the thumbnails.'],
                "label": "Clear original captions",
                "labelPos": "right",
                "type": "checkbox",
                "default": true
            },
            "ciShowFilesize": {
                "label": "Show file size",
                "labelPos": "right",
                "type": "checkbox",
                "default": true
            },
            "ciShowDimensions": {
                "label": "Show image dimensions",
                "labelPos": "right",
                "type": "checkbox",
                "default": false
            },
            "ciShowDateAdded": {
                "label": "Show date added",
                "labelPos": "right",
                "type": "checkbox",
                "default": false
            },
            "ciShowAlbumLink": {
                "label": "Show link to open the album",
                "labelPos": "right",
                "title": "Show a link that will open the page of the the parent album. The opening will be slower than usual because the script must do two HTTP requests to the server.",
                "type": "checkbox",
                "default": true
            },
            "ciShowOriginalLink": {
                "label": "Sow original link",
                "labelPos": "right",
                "title": "The original link points to the medium resolution image",
                "type": "checkbox",
                "default": true
            },
            "removeTooltips": {
                "section": ['Misc'],
                "label": "Remove tooltips from thumbnails",
                "title": "If interesting data is moved inside the caption, the tooltip is no more required",
                "labelPos": "right",
                "type": "checkbox",
                "default": true
            },
            "runAlways": {
                "label": 'Run always on "' + window.location.hostname + '"',
                "labelPos": "right",
                "title": "This is the only domain specific option.\nEnabling this option will force Coppermina to process the page even if it has not been detected as Coppermine gallery.",
                "type": "checkbox",
                "default": false,
                "save": false   //this is handled by localstorage
            }
        },
        "events": {
            "save": function () {
                var savedRunAlways = GM_config.fields.runAlways.toValue();
                if (savedRunAlways === true) {
                    localStorage.runAlways = "true";
                } else {
                    localStorage.removeItem("runAlways");
                }
                clog("Saved field runAlways: " + savedRunAlways);
                //Reload to apply changes to page
                window.location.reload(false);
            },
            "init": function () {
                //Manually load runAlways config from local storage
                GM_config.fields.runAlways.value = localStorage.getItem("runAlways") === "true";
            },
            "open": function () {
                //On opening add an extra heading to display what will be done
                var configHeader = document.getElementById("GM_config_header");
                if (configHeader === null) {
                    clog("Config header not found");
                    return;
                }
                var configInfo = document.createElement("div");
                configInfo.innerHTML = "What will Coppermina do on this site:";
                var spanResult = document.createElement("span");
                var pComment = document.createElement("p");
                if (coppermineDetected) {
                    spanResult.innerHTML = "Execute automatically";
                    spanResult.className = "positive";
                    pComment.innerHTML = "Coppermina will execute on this site because it has been detected as a Coppermine gallery after scanning the page content.<br /> If some features are not working it may be caused by a non standard Coppermine configuration.";
                } else if (runAlways) {
                    spanResult.innerHTML = "Execute forced";
                    spanResult.className = "forced";
                    pComment.innerHTML = "Coppermina will execute on this site even if it's not detected as a Coppermine gallery. This is caused by the option 'Run Always...'.";
                } else {
                    spanResult.innerHTML = "Nothing";
                    spanResult.className = "negative";
                    pComment.innerHTML = "Coppermina will do nothing on this site. If you want to force the execution you must toggle the option 'Run always on...' and then save to reload the page.";
                }
                configInfo.appendChild(spanResult);
                configInfo.appendChild(document.createElement("br"));
                configInfo.appendChild(pComment);
                configHeader.appendChild(configInfo);
            }
        },
        "css": 'div#GM_config_header div { font-size: 13pt; margin: 10px auto 10px; padding: 5px } \
                div#GM_config_header div span { padding: 5px } \
                span.positive { color: green } \
                span.forced { color: orange } \
                span.negative { color: black } \
                div#GM_config_header div p { font-size: 12px; text-align: left} \
                #GM_config_section_desc_0 span { display: inline-block } \
                div.dropShadow { box-shadow: 3px 3px 5px 5px #444 } \
                #GM_config div { padding: 0 5px 0 5px } \
                span.colorLevel0 { border: 2px solid ' + colorCode[0].color + '} \
                span.colorLevel1 { border: 2px solid ' + colorCode[1].color + '} \
                span.colorLevel2 { border: 2px solid ' + colorCode[2].color + '} \
                span.colorLevel3 { border: 2px solid ' + colorCode[3].color + '} \
                span.colorLevel4 { border: 2px solid ' + colorCode[4].color + '}'
    });

    var captionInfo = [];
    var clearOldCaption = GM_config.get("clearOldCaption");
    if (GM_config.get("ciShowFilesize")) {
        captionInfo.push("Filesize");
    }
    if (GM_config.get("ciShowDimensions")) {
        captionInfo.push("Dimensions");
    }
    if (GM_config.get("ciShowDateAdded")) {
        captionInfo.push("Date added");
    }
    if (GM_config.get("ciShowOriginalLink")) {
        captionInfo.push("Original link");
    }
    if (GM_config.get("ciShowAlbumLink")) {
        captionInfo.push("Album link");
    }
    var colorBorder = GM_config.get("colorBorder");
    var colorByWhat = GM_config.get("colorByWhat");
    var borderSize = GM_config.get("borderSize");
    var removeTooltips = GM_config.get("removeTooltips");

    function openConfig() {
        if (!configFrame) {
            configFrame = document.createElement('div');
            configFrame.className = "dropShadow";
            document.body.appendChild(configFrame);
        }
        GM_config.init({"id": "GM_config", "frame": configFrame});
        GM_config.open();
    }
    GM_registerMenuCommand("Coppersmina - Settings", openConfig, "C");

    /*
     * Load in a new tab the parent album
     * 1- query the server with the old link page
     * 2- extract the parent album link
     * 3- open a new tab with the album link
     */
    function loadAlbum(event) {
        var anchors,//anchors to be searched
            xhr,    //XML http request
            regex,  //regex tool
            found,  //regex result
            i,      //iterator over regex results
            anchor; //a element being analyzed
        if (event.button === 2) {
            //Do nothing for right mouse click
            return true;
        }
        xhr = new XMLHttpRequest();
        xhr.open("GET", this.dataset.href, true);
        xhr.onload = function () {

            anchors = xhr.responseXML.querySelectorAll('a[href*=thumbnails]');
            clog("Album anchors found:" + anchors.length);
            found = false;
            for (i = 0; i < anchors.length && found === false; i++) {
                //Search for an url like:
                //http://coppermine-gallery.net/demo/cpg15x/thumbnails.php?album=2
                anchor = anchors[i];
                clog("Regexing " + anchor.href);
                regex = new RegExp(/thumbnails\.php\?album=[0-9]+$/);
                found = regex.test(anchor.href);
                clog("Regex result: " + found);
            }

            if (found) {
                if (event.button === 0) {
                    //Left mouse click
                    location.href = anchor.href;
                } else if (event.button === 1) {
                    /* Middle mouse click
                     * This will open a new tab in background only if
                     * "When I open a link in a new tab, switch to it immediately"
                     * in firefox settings or "browser.tabs.loadInBackground" in
                     * about:config is set to false. False is the default value.
                     */
                    GM_openInTab(anchor.href);
                }
            } else {
                clog("Album link not found");
            }
        };
        xhr.responseType = 'document';
        xhr.send();
        //Avoid default behaviour
        return false;
    }

    function runCoppersmina() {
        var i, //index to iterate anchors
            j, //index to iterate captionInfo
            tableCell, //td element containing the anchor
            cellElements, //all the elements in tableCell
            anchors, //all the anchors containing thumbnails
            anchor, //a element being analyzed
            thumbnail, //img element inside anchor
            caption, //span element below the thumbnail
            regex, //regular expression searching thumbnail's title
            found, //regex result
            extraInfo, //element to append into caption
            imageWeight, //quantity to use to choose thumbnail's border color
            mustAddNewline,  //requred to handle newlines in captions
            newColor; //color to use for thumbnail's border

        //find all the anchors around the the thumbnails and iterate
        anchors = document.querySelectorAll('a[href*=displayimage]');
        clog("Found " + anchors.length + " anchors");
        for (i = 0; i < anchors.length; i++) {
            anchor = anchors[i];
            clog("Working on anchor: " + anchor.href);
            thumbnail = anchor.querySelector('img');
            if (thumbnail === null) {
                clog("Thumbnail not found");
                continue;
            }

            tableCell = anchor.parentNode;
            //find the text field under the thumbnail
            //using the class thumb_title instead of thumb_caption usually
            //gives a better integration with the sites styles
            caption = tableCell.querySelector("span.thumb_title");
            if (caption ===  null) {
                clog("Caption not found, adding a new one");
                caption = document.createElement('span');
                caption.className = "thumb_title";
                tableCell.appendChild(caption);
            }

            //maybe clear the caption
            if (clearOldCaption) {
                //Clear content of caption
                while (caption.firstChild) {
                    caption.removeChild(caption.firstChild);
                }
                //Clear other captions sibilings of our caption
                cellElements = tableCell.childNodes;
                for (j = 0; j < cellElements.length; j++) {
                    if (cellElements[j] !== caption && cellElements[j] !== anchor) {
                        tableCell.removeChild(cellElements[j]);
                        j--;
                    }
                }
            }

            //Add info to the caption
            mustAddNewline = clearOldCaption === false;
            for (j = 0; j < captionInfo.length; j++) {

                if (mustAddNewline) {
                    caption.appendChild(document.createElement('br'));
                }

                if (captionInfo[j] === 'Original link') {
                    //add the old link to the caption
                    extraInfo = document.createElement('a');
                    extraInfo.innerHTML = "Original link";
                    extraInfo.href = anchor.href;
                    caption.appendChild(extraInfo);
                    mustAddNewline = true;
                    continue;
                }
                if (captionInfo[j] === "Album link") {
                    /*
                     * Add a link to open the album
                     * Can't use a normal anchor because is impossible to avoid
                     * opening a new tab with the anchor href if the user middle
                     * clicks.
                     * To handle correctly left and middle clicks with js the
                     * href attribute is empty and the url is passed using
                     * HTML5's data-*. To catch also middle clicks listen
                     * to mouseup instead of click event.
                     */
                    extraInfo = document.createElement('a');
                    extraInfo.innerHTML = "Open album";
                    extraInfo.style = "cursor: pointer";
                    extraInfo.dataset.href = anchor.href;
                    extraInfo.addEventListener("mouseup", loadAlbum, false);
                    extraInfo.title = "Open the thumbnail's album.";
                    caption.appendChild(extraInfo);
                    mustAddNewline = true;
                    continue;
                }
                regex = new RegExp(captionInfo[j] + '=(.*)');
                found = regex.exec(thumbnail.title);
                if (found !== null) {
                    extraInfo = document.createElement('span');
                    extraInfo.innerHTML = found[1];
                    caption.appendChild(extraInfo);
                    mustAddNewline = true;
                } else {
                    clog('Image info "' + captionInfo[j] + '" not found');
                    mustAddNewline = false;
                }
            }

            //replace the thumbnail link with a direct link to the HD image
            anchor.href = thumbnail.src.replace(/thumb_/, "");

            if (colorBorder) {
                //Calculate image weight to chose a border color
                regex = new RegExp(colorByWhat + '=(.*)');
                found = regex.exec(thumbnail.title);
                if (found) {
                    if (colorByWhat === "Dimensions") {
                        var sizes = found[1].split('x');
                        var area = sizes[0] * sizes[1];
                        //Divide to have comparable sizes with "FileSize" wich is expressed in KB
                        imageWeight = area / 8192;
                    } else {
                        //Remove last 3 characters occupied by "KiB"
                        imageWeight = found[1].slice(0, -3);
                    }
                } else {
                    clog('Image info "' + colorByWhat + '" not found, unable to color the border');
                }

                //Add the colored border to the thumbnail
                for (j = 0; j < colorCode.length; j++) {
                    if (imageWeight > colorCode[j].size) {
                        newColor = colorCode[j].color;
                    }
                }
                thumbnail.style.border = borderSize + 'px solid ' + newColor;
            }

            if (thumbnail.title === "") {
                thumbnail.title = "Coppersmina:\nNo colored border or extra information in caption because in this gallery the required data is not available.";
            } else if (removeTooltips) {
                //Remove the tooltip if required
                thumbnail.title = "";
            }
        }
    }

    //Starts here
    if (runAlways || coppermineDetected) {
        clog("Coppersmining");
        runCoppersmina();
    }

}());
