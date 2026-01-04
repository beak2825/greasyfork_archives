// ==UserScript==
// @name         [AO3] Actually Relevant Characters
// @namespace    https://greasyfork.org/en/users/1138163-dreambones
// @version      1.2.2
// @description  Sorts and highlights works based on how relevant the tagged character seems in the work's tags and summary.
// @author       DREAMBONES
// @match        http*://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// @license      Can modify w/credit.
// @downloadURL https://update.greasyfork.org/scripts/476299/%5BAO3%5D%20Actually%20Relevant%20Characters.user.js
// @updateURL https://update.greasyfork.org/scripts/476299/%5BAO3%5D%20Actually%20Relevant%20Characters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var disqualifiers = /(mention|implied)/i
    var boostedRelevance = /(centric|POV)/i
    var bumpedListPos = {
        "High": 0,
        "Medium": 0,
        "Low": 0
    }

    var isCharacter = false;
    var charInfo = {
        "Name": null,
        "Alias": null,
    }

    var domainRe = /https?:\/\/archiveofourown\.org\/(works|tags)(?!\/\d+)/i;
    if (domainRe.test(document.URL)) {
        var character = document.querySelector("h2.heading > a");
        var mainRe = character.innerHTML.match(/(?<name>[^()]+[^ (]) ?(?<media>\(.+\))?/);
        var names = mainRe.groups.name.split(" | ");
        charInfo.Name = names[0];
        if (names.length > 1) { charInfo.Alias = names[1]; }

        var worksList = document.querySelectorAll("ol.work.index.group, ul.index.group, #user-series > ol.index.group");
        for (let section of worksList) {
            for (let work of section.children) {
                var bumped = false;
                var bumps = 0;

                var charTags = work.querySelectorAll("ul.tags.commas > li.characters > a");
                for (let tag of charTags) { if (tag.innerHTML == character.innerHTML) { isCharacter = true; } }
                if (isCharacter) {
                    var tagCt = 0;
                    var charTagCt = 0;
                    var ttlTagCt = 0;

                    var tags = work.querySelectorAll("ul.tags.commas > li > a");
                    for (let tag of tags) {
                        ttlTagCt++;
                        if (tag.parentNode.className == "characters") { charTagCt++; }
                        CheckTag(tag, work, section);
                    }

                    try {
                        var summary = work.querySelector("blockquote.userstuff.summary > p");
                        CheckSummary();
                    }
                    catch (TypeError) { null; }
                }
                // console.log(`Character Tags: ${tagCt} of ${ttlTagCt} (${tagCt / ttlTagCt})`);
                if (charTagCt < 4) { bumps += 2; }
                else if ((tagCt / ttlTagCt) >= 0.15) { bumps += 1; }
                if (bumps > 0) { sendToTop(work, section); }
            }
        }
    }

    function escapeRegExp(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }

    function replaceAt(text, index, original, replacement) {
        return text.substring(0, index) + replacement + text.substring(index + original.length); // index + replacement.length
    }

    function CheckTag(tag, work, section) {
        let type = tag.parentNode.className;
        let text = tag.innerHTML;

        let alreadyMatched = false;
        for (let name in charInfo) {
            if (charInfo[name]) {
                let re = new RegExp(`${escapeRegExp(charInfo[name])}(?:'s)?(?!<\/span>)`, "gi");
                if (re.test(text) && !alreadyMatched) {
                    alreadyMatched = true;
                    if (disqualifiers.test(text) && type == "characters") { sendToBottom(work, section); }
                    else {
                        if (charTagCt == 1 && type == "characters") { bumps += 3; }
                        if (type == "characters" && text == [charTags.length-1].innerHTML) { sendToBottom(work, section); }
                        if (boostedRelevance.test(text)) { bumps += 3; }
                        if (type == "relationships") { bumps += 1; }
                        if (type == "freeforms") { bumps += 0.5; }
                        tagCt++;
                    }
                    tag.style["text-transform"] = "uppercase";
                    tag.style.border = `1px solid ${tag.style.color}`;
                }
                else if (disqualifiers.test(text) && !alreadyMatched) {
                    if (type == "characters" || type == "relationships") { tag.style.opacity = 0.5; }
                    alreadyMatched = true;
                }
            }
        }
    }

    function CheckSummary() {
        let anyMatches = false;
        for (let name in charInfo) {
            if (charInfo[name]) {
                let re = new RegExp(`${escapeRegExp(charInfo[name])}(?:'s)?(?!<\/span>)`, "gi");
                let matches = summary.innerHTML.match(re);
                if (matches) {
                    anyMatches = true;
                    for (let match of matches) {
                        let index = summary.innerHTML.search(re);
                        summary.innerHTML = replaceAt(summary.innerHTML, index, match, `<span style="text-transform: uppercase; text-decoration: underline">${match}</span>`);
                    }
                }
            }
        }
        if (anyMatches) { bumps += 2; }
    }

    function sendToTop(work, section) {
        if (!bumped && work.style.opacity != 0.5) {
            bumped = true;
            var color;
            try { color = summary.style.color; }
            catch (TypeError) { color = work.querySelector("dl.stats").style.color; }
            if (bumps == 1) {
                work.style.border = `3px dashed ${color}`;
                section.insertBefore(work, section.children[bumpedListPos.Low]);
                bumpedListPos.Low++;
            }
            else if (bumps >= 2 && bumps < 3) {
                work.style.border = `3px solid ${color}`;
                section.insertBefore(work, section.children[bumpedListPos.Medium]);
                bumpedListPos.Medium++;
                bumpedListPos.Low++;
            }
            else if (bumps >= 3) {
                work.style.border = `5px double ${color}`;
                section.insertBefore(work, section.children[bumpedListPos.High]);
                bumpedListPos.High++;
                bumpedListPos.Medium++;
                bumpedListPos.Low++;
            }
        }
    }

    function sendToBottom(work, section) {
        work.style.opacity = "0.5";
        section.append(work);
    }
})();