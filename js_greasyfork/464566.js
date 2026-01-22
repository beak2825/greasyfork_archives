// ==UserScript==
// @name Geocaching Puzzle Helper
// @description Show hidden user-added elements on Geocaching Mystery Cache Page
// @match http://www.geocaching.com/geocache/*
// @match https://www.geocaching.com/geocache/*
// @match http://geocaching.com/geocache/*
// @match https://geocaching.com/geocache/*
// @version 1.81
// @namespace https://greasyfork.org/en/scripts/464566-geocaching-puzzle-helper
// @homepage https://greasyfork.org/en/scripts/464566-geocaching-puzzle-helper
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464566/Geocaching%20Puzzle%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/464566/Geocaching%20Puzzle%20Helper.meta.js
// ==/UserScript==
/* Features
-- Add several links to the map links
-- Checks if cache is at posted coordinates and adds a function to the top to quick replace
-- Show coordinate in decimal format
-- Present button to highlight comments, white text, link and hidden link information
*/

(function () {
    'use strict';

    // Entry point
    const descriptions = [
        "ctl00_ContentBody_ShortDescription",
        "ctl00_ContentBody_LongDescription",
    ];
    descriptions.forEach(id => scanElemForStuff(document.getElementById(id)));

    showFinalLocation();
    addCustomLink("Ingress", buildIngressURL());
    addCustomLink("HMDB", buildHMDBURL());
    addCustomLink("NowListenToMe", buildNowListenToMeURL());
    addCustomLink("Benchmarks", buildBenchmarkURL());
    appendDecimalMinutes();
    hasThreeConsecutiveSixDigitNumbers();
    AddQuickCopy();

    /**
     * Appends decimal minutes to the location panel.
     */
    function appendDecimalMinutes() {
        const elem = document.getElementById("ctl00_ContentBody_LocationSubPanel");
        if (elem) {
            elem.innerText += `DEC: ${mapLatLng.lat}, ${mapLatLng.lng}\n`;
        }
    }

    /**
     * Adds a custom link to the map links section.
     * @param {string} name - The name of the link.
     * @param {string} url - The URL for the link.
     */
    function addCustomLink(name, url) {
        const mapLinks = document.getElementById("ctl00_ContentBody_MapLinks_MapLinks");
        if (mapLinks) {
            const list = mapLinks.querySelector('ul');
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.setAttribute("target", "_blank");
            link.href = url;
            link.innerText = name;
            listItem.appendChild(link);
            list.appendChild(listItem);
        }
    }


    /**
     * Builds the Ingress link URL.
     */
    function buildIngressURL() {
        return `https://intel.ingress.com/intel?ll=${mapLatLng.lat},${mapLatLng.lng}&z=16`;
    }

       /**
     * Builds the HMDB link URL.
     */
    function buildBenchmarkURL() {
        return `https://www.arcgis.com/apps/webappviewer/index.html?id=190385f9aadb4cf1b0dd8759893032db&find=${mapLatLng.lat}%2C%20${mapLatLng.lng}`;
    }

    /**
     * Builds the HMDB link URL.
     */
    function buildHMDBURL() {
        return `https://www.hmdb.org/results.asp?Search=Proximity&SearchFor=${mapLatLng.lat},${mapLatLng.lng}&Miles=1&MilesType=1&HistMark=Y&WarMem=Y`;
    }

    /**
     * Builds the NowListenToMe link URL.
     */
    function buildNowListenToMeURL() {
        return `http://nowlistento.me/geocalc?StartCoord=${mapLatLng.lat},${mapLatLng.lng}&z=16`;
    }

    /**
     * Scans an element for hosted links, extra text, links, white text, and comments.
     * @param {HTMLElement} elem - The element to scan.
     */
   function scanElemForStuff(elem) {
       if (!elem) return;

       const hostedLinks = getHostedLinks(elem, []);
       const extraTextLinks = getExtraText(elem, hostedLinks);
       const allLinks = getAllLinks(elem, hostedLinks, extraTextLinks);
       const imageMapLinks = getImageMapLinks(elem);

       const dataGroups = [
           { label: "Hosted", data: hostedLinks },
           { label: "Extra", data: extraTextLinks },
           { label: "Links", data: allLinks },
           { label: "Map", data: imageMapLinks },
           { label: "White Text", data: getWhiteText(elem) },
           { label: "Comments", data: getAllComments(elem) },
       ];

       dataGroups.forEach(({ label, data }) => {
           if (data.length > 0) {
               addToggle(elem, label, data.join('\r\n'), onClickHandler);
           }
       });
    }




    function addButton(parent, text, title, onclick, append = false) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.title = title;
        button.onclick = onclick;
        button.addEventListener('contextmenu', e => e.preventDefault());
        append ? parent.appendChild(button) : parent.insertBefore(button, parent.firstChild);
    }


    /**
     * Adds a button to a parent element.
     */
    function addToggle(parent, text, title, onclick, append = false) {
        var descriptionheader = document.body.querySelector(".h3.CacheDescriptionHeader");
        const textcode = text.replace(" ","");


        var contentspan = parent.querySelector("#togglecontentspan");
        if (contentspan===null) {
            var brelem = document.createElement('br');
            contentspan = document.createElement('span');
            contentspan.id ="togglecontentspan";
            parent.insertBefore(brelem,parent.firstChild);
            parent.insertBefore(contentspan,parent.firstChild);
        }


        const buttondiv = document.createElement('div');
        buttondiv.style.cursor = "pointer";
        buttondiv.style.display = "inline-block";
        buttondiv.style.float = "right";
        buttondiv.style.fontSize ="12px";
        buttondiv.style.fontWeight = "normal";

        buttondiv.onclick = onToggleHandler;

        const arrowspan = document.createElement('span');
        arrowspan.id="clickarrow"+textcode;
        arrowspan.innerHTML="&#9650";
        buttondiv.appendChild(arrowspan);

        const labelspan = document.createElement('span');
        labelspan.innerHTML=text;
        buttondiv.appendChild(labelspan);


        const textspan = document.createElement('span');
        textspan.id = "togglecontent"+textcode;
        textspan.innerHTML=title.replace(/\n/g, '<br>');
        textspan.style.display = "block";
        textspan.style.fontStyle = "italic";
        contentspan.appendChild(textspan);


        descriptionheader.appendChild(buttondiv);
    }

        // Utility functions for data extraction
    function getAllComments(rootElem) {
        const iterator = document.createNodeIterator(rootElem, NodeFilter.SHOW_COMMENT, null, false);
        const comments = [];
        let curNode;
        while ((curNode = iterator.nextNode())) {
            comments.push(curNode.nodeValue);
        }
        return comments;
    }

    function getAllLinks(rootElem, hostedLinks, extraTextLinks) {
        const allLinks = Array.from(rootElem.querySelectorAll('a'));
        const uniqueLinks = allLinks
        .map(link => link.href)
        .filter(link => {
            const lowerLink = link.toLowerCase();
            return !hostedLinks.map(l => l.toLowerCase()).includes(lowerLink) &&
                !extraTextLinks.map(l => l.toLowerCase()).includes(lowerLink);
        });
        return [...new Set(uniqueLinks)]; // Ensure no duplicates with original case preserved
    }

    function getHostedLinks(rootElem, otherArray) {
        const imgs = Array.from(rootElem.getElementsByTagName('img'));
        return imgs
            .map(img => img.src) // Preserve original case
            .filter(src => {
            const lowerSrc = src.toLowerCase();
            return (
                (!lowerSrc.includes("s3.amazonaws.com/gs-geo-images") &&
                 !lowerSrc.includes(".geocaching.com") &&
                 !lowerSrc.includes(".groundspeak.com")) ||
                lowerSrc.includes("?")
            );
        })
            .filter(src => !otherArray.includes(src));
    }

    function getImageMapLinks(rootElem) {
    return Array.from(rootElem.querySelectorAll('map area[href]'))
        .map(area => area.href);
    }

    function getWhiteText(rootElem) {
        const whiteColors = ["#ffffff", "white", "rgb(255, 255, 255)"].map(c => c.toLowerCase());
        return Array.from(rootElem.getElementsByTagName("*"))
            .filter(el => {
            const styleColor = el.style.color?.toLowerCase();
            const attrColor = el.getAttribute("color")?.toLowerCase();
            return whiteColors.includes(styleColor) || whiteColors.includes(attrColor);
        })
            .map(el => el.innerHTML);
    }

    function getExtraText(rootElem, hostedLinks) {
    const attributes = ["alt", "name", "id", "title"];
    return Array.from(rootElem.getElementsByTagName("*"))
        .flatMap(el => attributes.map(attr => el.getAttribute(attr)).filter(Boolean))
        .filter(text => !hostedLinks.includes(text.toLowerCase())); // Exclude links in hostedLinks
    }

    /**
     * Handles click events for buttons.
     */
    function onClickHandler(e) {
        alert(this.title);
        return false;
    }

    function onToggleHandler(e) {
         const textcode = e.currentTarget.children[1].innerText.replace(" ","");
         const content = document.body.querySelector("#togglecontent"+textcode);
         const arrow = document.body.querySelector("#clickarrow"+textcode);

         if (content.style.display === 'none' || content.style.display === '') {
            content.style.display = 'block';
            arrow.innerHTML = '&#9650;'; // Up arrow
         } else {
            content.style.display = 'none';
            arrow.innerHTML = '&#9660;'; // Down arrow
         }
    }

    /**
     * Displays the final location if available.
     */
    function showFinalLocation() {
        const elem = document.getElementById("awpt_FN");
        if (!elem) return;

        const coordElem = elem.parentNode?.nextElementSibling?.nextElementSibling?.nextElementSibling;
        if (coordElem && coordElem.innerText.length > 4) {
            const locElem = document.getElementById("uxLatLonLink");
            if (locElem) {
                addButton(locElem, "FN", coordElem.innerText, onClickHandler, true);
            }
        }
    }

    function AddQuickCopy() {
        const noteDiv = document.querySelector("div.Note.PersonalCacheNote");

        if (noteDiv) {
            noteDiv.addEventListener("dblclick", function () {
                const gccode = document.getElementById("ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode").innerText;
                const gccoord = document.getElementById("uxLatLon").innerText;
                const srOnlyCacheNote = document.getElementById("srOnlyCacheNote").innerText.replace(/\n/g, ' ');;
                const message = "!solve " + gccode+ " "+ gccoord + "|" + srOnlyCacheNote;
                navigator.clipboard.writeText(message)
                    .then(() => {
                    console.log("Message copied to clipboard");
                })
                    .catch(err => {
                    console.error("Failed to copy message: ", err);
                });
            });
        } else {
            console.warn("No element with class 'Note PersonalCacheNote' found.");
        }
    }


    function code2LatLon(varA, varB, varC) {
        let latSign, lonSign, lonValue, latValue;

        console.debug("Converting [" + varA + ", " + varB + ", " + varC + "] to LatLon" )

        // 123456 => digit 1 (d1) = 6; digit 2 (d2) = 5; ...
        // syntax for varA => digit 1 var A = A1; digit 2 varA = A2; ...
        // A3
        if ((varA % 1000 - varA % 100) / 100 == 1) {
            latSign = 1;
            lonSign = 1;
        }
        // A3
        else if ((varA % 1000 - varA % 100) / 100 == 2) {
            latSign = -1;
            lonSign = 1;
        }
        // A3
        else if ((varA % 1000 - varA % 100) / 100 == 3) {
            latSign = 1;
            lonSign = -1;
        }
        // A3
        else if ((varA % 1000 - varA % 100) / 100 == 4) {
            latSign = -1;
            lonSign = -1;
        }
        //T41140 / Q1TQ01 / 14S4RS
        // A6 B3 B4 B6 C1 C2 C4
        // TODO: how to iterate only these, not full range ??
        // C (d5 + d2) eli C5 + C2 = parillinen
        if ( ((varC % 100000 - varC % 10000) / 10000 + (varC % 100 - varC % 10) / 10) % 2 === 0) {
            // A4 B2  B5 C3 A6 C2 A1
            latValue = Number(((varA % 10000 - varA % 1000) / 1000 * 10 + (varB % 100 - varB % 10) / 10 + (varB % 100000 - varB % 10000) / 10000 * 0.1 + (varC % 1000 - varC % 100) / 100 * 0.01 + (varA % 1000000 - varA % 100000) / 100000 * 0.001 + (varC % 100 - varC % 10) / 10 * 1.0E-4 + varA % 10 * 1.0E-5));
            // A5 C6 C1  B3 B6 A2 C5 B1
            lonValue = Number(((varA % 100000 - varA % 10000) / 10000 * 100 + (varC % 1000000 - varC % 100000) / 100000 * 10 + varC % 10 + (varB % 1000 - varB % 100) / 100 * 0.1 + (varB % 1000000 - varB % 100000) / 100000 * 0.01 + (varA % 100 - varA % 10) / 10 * 0.001 + (varC % 100000 - varC % 10000) / 10000 * 1.0E-4 + varB % 10 * 1.0E-5));
        }
        // C (d5 + d2) eli C5+C2= pariton
        else if ( ((varC % 100000 - varC % 10000) / 10000 + (varC % 100 - varC % 10) / 10) % 2 !== 0) {
            // B6 A1  A4 C6 C3 C2 A6
            latValue = Number(((varB % 1000000 - varB % 100000) / 100000 * 10 + varA % 10 + (varA % 10000 - varA % 1000) / 1000 * 0.1 + (varC % 1000000 - varC % 100000) / 100000 * 0.01 + (varC % 1000 - varC % 100) / 100 * 0.001 + (varC % 100 - varC % 10) / 10 * 1.0E-4 + (varA % 1000000 - varA % 100000) / 100000 * 1.0E-5))
            // B2 C1 A2  A5 B3 B1 C5 B5
            lonValue = Number(((varB % 100 - varB % 10) / 10 * 100 + varC % 10 * 10 + (varA % 100 - varA % 10) / 10 + (varA % 100000 - varA % 10000) / 10000 * 0.1 + (varB % 1000 - varB % 100) / 100 * 0.01 + varB % 10 * 0.001 + (varC % 100000 - varC % 10000) / 10000 * 1.0E-4 + (varB % 100000 - varB % 10000) / 10000 * 1.0E-5));
        }
        // B4 C4 = ALWAYS ignore

        latValue = latSign * latValue;
        lonValue = lonSign * lonValue;

        return { lat: latValue, lon: lonValue }
    }

    function hasThreeConsecutiveSixDigitNumbers() {
    // Find the <longdescription> tag
    const longDescriptionTag = document.getElementById('ctl00_ContentBody_LongDescription');
    const noteTag = document.getElementById('srOnlyCacheNote');

    if (!longDescriptionTag) {
        console.error('No <longdescription> tag found');
        return false;
    } else {
        // Get the text content of the tag
        const textContent = longDescriptionTag.textContent;

        // Regular expression to match three consecutive six-digit numbers,
        // allowing separators like commas, spaces, and newlines
        const regex = /\b(\d{6})(?:[ ,\n]+)(\d{6})(?:[ ,\n]+)(\d{6})\b/;

        // Test if the pattern exists in the text content
        const match = textContent.match(regex);
        if (match) {
            let s= code2LatLon(match[1],match[2],match[3]);
            addToggle(longDescriptionTag,"Reverse wherigo", s.lat.toString() + ", " + s.lon.toString(), onClickHandler, false);
        }
    }
    if (!noteTag) {
        console.error('No <srOnlyCacheNote> tag found');
        return false;
    } else {
        // Get the text content of the tag
        const textContent = noteTag.innerText;

        // Regular expression to match three consecutive six-digit numbers,
        // allowing separators like commas, spaces, and newlines
        const regex = /\b(\d{6})(?:[ ,\n]+)(\d{6})(?:[ ,\n]+)(\d{6})\b/;

        // Test if the pattern exists in the text content
        const match = textContent.match(regex);
        if (match) {
            let s= code2LatLon(match[1],match[2],match[3]);
            addToggle(longDescriptionTag,"Reverse wherigo2", s.lat.toString() + ", " + s.lon.toString(), onClickHandler, false);
        }
    }

}



})();
