// ==UserScript==
// @name         Anime-Planet Show New Release
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      0.6.0
// @description  Shows an icon for number of new releases for manga and anime
// @author       Quin15
// @match        https://www.anime-planet.com/*
// @icon         https://www.google.com/s2/favicons?domain=anime-planet.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/418561/Anime-Planet%20Show%20New%20Release.user.js
// @updateURL https://update.greasyfork.org/scripts/418561/Anime-Planet%20Show%20New%20Release.meta.js
// ==/UserScript==

NewReleasePopulate = {
    populateNewRelease: function(entries, entryDataType) {
        if (entryDataType == null) {
            if (document.querySelector('li[data-type="manga"] a')) {
                if (document.querySelector('li[data-type="anime"] a')) {
                    setTimeout(function(){NewReleasePopulate.populateNewRelease(null, "anime");}, 200);
                };
                entryDataType = "manga";
            } else {
                entryDataType = "anime";
            };
        };

        if (entries == null) {
            entries = document.querySelectorAll('li[data-type="' + entryDataType + '"]');
        };

        for (var i = 0; i < entries.length; i++) {
            if (!(entries[i].querySelector('label.NewReleaseLabel'))){
                var releasedNo = parseInt(entries[i].dataset.totalEpisodes);
                var readNo = parseInt(entries[i].dataset.episodes) || 0;
                var tooltipType = (entryDataType == "manga") ? "iconVol" : "type";

                if (entries[i].querySelector('a').title) {
                    var ongoingColour = (($(entries[i].querySelector('a').title).find("li." + tooltipType))[0].innerText.includes("+")) ? "#8DEA43" : "#6F99E4";
                } else {
                    var ongoingColour = (document.querySelector('div[role="tooltip"] li.' + tooltipType).innerText.includes("+")) ? "#8DEA43" : "#6F99E4";
                };

                if (isNaN(releasedNo)) {
                    var releaseCount = $(entries[i].firstElementChild.title).find("li.iconVol")[0].innerText
                    if (releaseCount.includes(';')) {
                        releaseCount = releaseCount.substring(releaseCount.lastIndexOf(";") + 1);
                    };
                    if (releaseCount.includes("Ch")){
                        var releasedNo = releaseCount.replace("Ch: ", "").replace("+", "");
                    } else {
                        var releasedNo = releaseCount.replace("Vol: ", "").replace("+", "");
                    };
                }

                if (releasedNo > 0 && releasedNo != readNo && readNo != 0 && entries[i].dataset.status == "2") {
                    entries[i].querySelector('.crop').style.boxShadow = '0 0 3px 3px ' + ongoingColour;
                    entries[i].style = "overflow: visible;";
                };

                //if (releasedNo != readNo && readNo != -1 && entries[i].dataset.status == "2") {
                if (releasedNo != readNo && releasedNo > 0) {
                    var tag = document.createElement("label");
                    tag.setAttribute("style", "width: 30px; height: 30px; position: absolute; background: " + ongoingColour + "; z-index: 12; border-radius: 15px; margin-left: calc(50% - 20px); top: -10px; line-height: 28px; color: #fff; text-shadow: 0px 0px 3px #000, 0px 0px 3px #000, 0px 0px 3px #000, 0px 0px 3px #000, 0px 0px 3px #000, 0px 0px 3px #000;")
                    tag.setAttribute("class", "NewReleaseLabel");
                    tag.innerText = releasedNo - readNo;
                    entries[i].querySelector('a').appendChild(tag);
                    tag.parentElement.style = "overflow: visible";
                    tag.parentElement.parentElement.style = "overflow: visible";
                };
            };
        };
    }
};

$(document).ready(function() {
    if (document.querySelector('li[data-type="manga"] a') || document.querySelector('li[data-type="anime"] a')) {
        NewReleasePopulate.populateNewRelease(null, null);
    };
});