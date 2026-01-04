// ==UserScript==
// @name         IC Flarum Post Fixer
// @namespace    http://tampermonkey.net/
// @version      2025-04-17
// @license MIT
// @description  Find and replace legacy errors from the Flarum migration to Discourse when editing a post
// @author       Kez
// @match        https://forums.insertcredit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=insertcredit.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/523651/IC%20Flarum%20Post%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/523651/IC%20Flarum%20Post%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addImgurLinkRemoveButton = () => {
        const replyDetails = document.getElementsByClassName("reply-details");

        if(replyDetails[0]) {
            if(!document.getElementById("remove-imgur-button")) {
                const newButton = document.createElement('button');
                newButton.id = "remove-imgur-button";
                newButton.textContent = "Remove Imgur Links";
                newButton.onclick = () => {
                    removeImgurImages();
                };
                replyDetails[0].appendChild (newButton);
            }
        }
    }

    const addFixForumLinksButton = () => {
        const replyDetails = document.getElementsByClassName("reply-details");

        if(replyDetails[0]) {
            if(!document.getElementById("fix-links-button")) {
                const newButton = document.createElement('button');
                newButton.id = "fix-links-button";
                newButton.textContent = "Fix Forum Links";
                newButton.onclick = () => {
                    fixForumLinks();
                };
                replyDetails[0].appendChild (newButton);
            }
        }
    }

    const fixMentions = (text) => {
        return text
            .replaceAll(/@\"(.*?)\"#p[0-9]*(<\/POSTMENTION>)/gm, "@$1$2")
            .replaceAll(/@\"(.*?)\"#p[0-9]*(<\/USERMENTION>)/gm, "@$1$2")
            .replaceAll(/@\"(.*?)\"#[0-9]*(<\/USERMENTION>)/gm, "@$1$2")
            .replaceAll(/@\"(.*?)\"#[0-9]*(<\/POSTMENTION>)/gm, "@$1$2")
            .replaceAll(/@\"(.*?)\"#p[0-9]*/gm, "@$1")
            .replaceAll(/(@.*?)(#[0-9]*)/gm, "$1");
    }

    const removePTags = (text) => {
        return text
            .replaceAll("<p>", "")
            .replaceAll("</p>", "")
    }

    const removeETags = (text) => {
        return text
            .replaceAll("<e>", "")
            .replaceAll("</e>", "")
    }


    const removeHrTags = (text) => {
        return text
            .replaceAll("<HR>", "")
            .replaceAll("</HR>", "")
    }

    const removeBrTags = (text) => {
        return text
            .replaceAll("<br/>", "");
    }


    const removeSTags = (text) => {
        return text
            .replaceAll("<s>", "")
            .replaceAll("</s>", "")
    }

    const removeHTags = (text) => {
        return text
            .replaceAll(/<H[1-9]>/gm, "")
            .replaceAll(/<\/H[1-9]>/gm, "")
    }

    const removeStrongTags = (text) => {
        return text
            .replaceAll("<STRONG>**", "**")
            .replaceAll("**</STRONG>", "**");
    }

    const fixQuotes = (text) => {
        return text
            .replaceAll("<r>", "")
            .replaceAll("</r>", "")
            .replaceAll(/<QUOTE><i>&gt; <\/i>(.*)@\"(.*)\"#p[0-9]*(.*)/gm, "[QUOTE=\"$2\"]\r\n$1$3")
            .replaceAll(/<QUOTE><i>&gt; <\/i>(.*)/gm, "[QUOTE]\r\n$1")
            .replaceAll(/<QUOTE><i>&gt;<\/i>(.*)@\"(.*)\"#p[0-9]*(.*)/gm, "[QUOTE=\"$2\"]\r\n$1$3")
            .replaceAll(/<QUOTE><i>&gt;<\/i>(.*)/gm, "[QUOTE]\r\n$1")
            .replaceAll("<i>&gt;<\/i>", "")
            .replaceAll("<i>&gt; </i>", "")
            .replaceAll("</QUOTE>", "\r\n[/QUOTE]");
    }


    const fixLists = (text) => {
        return text
            .replaceAll("<s>-     </s>", "- ")
            .replaceAll(/<s>([0-9]*)\.     <\/s>/gm, "$1. ")
            .replaceAll("<LIST>", "")
            .replaceAll("<LIST type=\"decimal\">", "")
            .replaceAll("</LIST>", "")
            .replaceAll("<LI>", "")
            .replaceAll("</LI>", "")
    }

    const fixAudioEmbed = (text) => {
        return text
            .replaceAll(/<AUDIO.*(http.*\.mp3).*<\/AUDIO>/gm, "\r\n$1\r\n");
    }


    const fixYoutubeEmbed = (text) => {
        return text
            .replaceAll(/<YOUTUBE id=\"(.{11})\">.*<\/YOUTUBE>/gm, "\r\nhttps://www.youtube.com/watch?v=$1\r\n")
            .replaceAll(/<YOUTUBE id=\"(.{11})\" t=\"([0-9]*)\">.*<\/YOUTUBE>/gm, "\r\nhttps://www.youtube.com/watch?v=$1&t=$2\r\n");
    }

    const fixSteamEmbed = (text) => {
        return text
            .replaceAll(/<STEAMSTORE .*url=\"(http.*)\".*<\/STEAMSTORE>/gm, "\r\n$1\r\n");
    }

    const fixSpotifyEmbed = (text) => {
        return text
            .replaceAll(/<SPOTIFY .*url=\"(http.*)\".*<\/SPOTIFY>/gm, "\r\n$1\r\n");
    }

    const fixSpeechMarks = (text) => {
        return text
            .replaceAll("<FP char=\"“\">\"</FP>", "\"")
            .replaceAll("<FP char=\"”\">\"</FP>", "\"")
            .replaceAll("<FP char=\"‘\">'</FP>", "'")
            .replaceAll("<FP char=\"’\">'</FP>", "'")
            .replaceAll("<FP char=\"'\">'</FP>", "'");
    }

    const fixSpoilers = (text) => {
        return text
            .replaceAll("<ISPOILER>&gt;!","[spoiler]")
            .replaceAll("!&lt;</ISPOILER>", "[/spoiler]")
            .replaceAll("<ISPOILER>||","[spoiler]")
            .replaceAll("||</ISPOILER>", "[/spoiler]");
    }

    const fixSpoilerDetails = (text) => {
        return text
           .replaceAll(/<SPOILER><i>&gt;! <\/i>(.*)/mg, "<details><summary>Details</summary>\r\n$1")
           .replaceAll(/<SPOILER><i>&gt;!<\/i>(.*)/mg, "<details><summary>Details</summary>\r\n$1")
           .replaceAll("</SPOILER>", "\r\n</details>")
           .replaceAll("<i>&gt;!</i>", "")
           .replaceAll("<i>&gt;! </i>", "");
    }

    const fixColors = (text) => {
        return text
            .replaceAll(/<COLOR color=\"[A-z]*\">/gm, "")
            .replaceAll("</COLOR>", "");
    }

    const fixImages = (text) => {
        text = text
            .replaceAll(/\<URL.*?(https:\/\/i.imgur.com\/.*(?:jpeg|jpg|png)).*\<\/URL\>/gm, "[img]$1[/img]")
            .replaceAll(/\[upl\-image-preview url=\/\/i\.imgur\.com\/(.*)\.(jpeg|jpg|png)\]/gm, '[img]https://i.imgur.com/$1.$2[/img]');
        if (text.match(/https:\/\/i.imgur.com\/.*(?:jpeg|jpg|png)/gm)) {
            addImgurLinkRemoveButton();
        }
        return text;
    }

    const checkForLinks = (text) => {
        if (text.match(/\"https:\/\/forums.insertcredit.com\/d\/(.*?)(?:\/([0-9]*))?\"/gm)) {
            addFixForumLinksButton();
        }
    }

    const replaceChangedSns = (text) => {
        const nameReplacements = [
            ["Tom of the Fog", "Tom"],
            ["Tomofthefog", "Tom"],
            ["TomoftheFog", "Tom"],
            ["edward", "radicaledward"],
            ["Video Game King", "Video_Game_King"],
            ["DavidNoo", "DaveedNoo"],
            ["TaliesinMerlin", "Taliesin_Merlin"],
            ["Osu 16 Bit", "osu16bit"],
            ["Jonks", "JonKScott"],
            ["Zack", "overusedmuse"],
            ["Uli", "ulisesftw"],
            ["soapbox", "soapboxcritic"],
            ["GigaSlime", "MegaSigil"],
            ["CidNight", "fridgeboy"],
            ["Lunar", "Kthpwrth"],
            ["Andy B", "stardusty"],
            //["◉◉maru", "chazumaru"],
            ["Syzygy", "[deleted]"],
            ["marlfuchs2", "hellojed"],
            ["safetypads", "missingdata"],
            ["JXUA", "BoldOblique"],
            ["cass", "prophet_goddess"],
            ["leah", "humblepopstar"],
            ["Game Beginner Girl", "GameBeginnerGirl"],
            ["the rocky connrrr picture show", "connrrr"],
            ["Tradeghouls 'n ghosts", "Tradegood"],
            ["kamillebiden", "tennmel"],
            ["frog", "joyousfrog"],
            ["Spark", "Sparkowitz"],
            ["Viralata", "Bonsai"],
            ["marlfuchs2", "hellojed"],
            ["Emily", "bunp"],
            ["skelly", "Skellingtor"],
            ["allie", "sapphicvalkyrja"],
            ["dry cleaner for dogs", "yeso"],
            ["\"I thought lethal weapon was safe..............................................................................................................yeah.\"", "yeso"],
            ["Polaco Yunque", "yeso"],
            ["Ankh-ef-en-yeso", "yeso"],
            ["Ellis Bell", "yeso"],
            ["a pagan sketch of Jesus", "yeso"],
            ["After that rat, another and another.", "yeso"],
            ["Alistair Cookie", "yeso"],
            ["espercontrol", "esper"],
            ["Avelin", "Cornlord"],
            ["Viralata", "Bonsai"],
            ["Guilherme", "gvfo"],
            ["GrimGlamfire", "kowloonwalledcity"],
            ["MichaelDMcGrath", "TracyDMcGrath"],
            ["the-concrete-captain", "captain"],
            ["andy b", "stardusty"],
            ["deadbeat", "hi-im-jt"],
            ["newgenderplus", "onnuhhhh"],
            ["rarya", "quby"],
            ["FaulteredBeast", "mack41"],
            ["Paul", "StimpyJoy"],
            ["Venus Emperor", "nagatheserpent"],
            ["IncompatibleKaiser", "Hyper-Guts-Shooter"],
            ["Reverse Kaiser", "Hyper-Guts-Shooter"],
            ["Nate", "Nalbert"],
            ["BippityJones", "russian1039"],
            ["persephone", "rabbitcomputer"],
            ["safety_man", "safety_lite"],
            ["Miiversification", "Antho"],
            ["gwen", "idontwearsandals"],
            ["Brett", "brettch"],
            ["Donkald Kongregate", "captain"],
        ];

        text = text
            .replaceAll(/@\u25C9\u25C9maru/gm, "@chazumaru")
            .replaceAll(/QUOTE="\u25C9\u25C9maru"/gm, "QUOTE=\"chazumaru\"");

        nameReplacements.forEach((names) => {
            text = text
                .replaceAll(`@${names[0]}<`, `@${names[1]}<`)
                .replaceAll(`@${names[0]} `, `@${names[1]} `)
                .replaceAll(`QUOTE="${names[0]}"`, `QUOTE="${names[1]}"`);
        });
        return text;
    }


    const removeImgurImages = () => {
        const editBox = document.getElementsByClassName("ember-text-area ember-view d-editor-input")[0];
        const oldText = editBox.value;
        let newText = oldText
            .replaceAll(/\[img\]https:\/\/i\.imgur\.com\/.*(?:jpeg|jpg|png)\[\/img\]/gm, "");

        editBox.value = newText;

        var event = new Event('change');

        editBox.dispatchEvent(event);
    }

    const fixFlarumJank = async () => {
        const editBox = document.getElementsByClassName("ember-text-area ember-view d-editor-input")[0];
        const oldText = editBox.value;
        let newText = fixQuotes(oldText);
        newText = fixLists(newText);
        newText = fixSpoilerDetails(newText);
        newText = removePTags(newText);
        newText = removeBrTags(newText);
        newText = removeHrTags(newText);
        newText = removeSTags(newText);
        newText = removeETags(newText);
        newText = removeHTags(newText);
        newText = removeStrongTags(newText);
        newText = fixSpoilers(newText);
        newText = fixSpeechMarks(newText);
        newText = fixColors(newText);
        newText = fixMentions(newText);
        newText = fixAudioEmbed(newText);
        newText = fixYoutubeEmbed(newText);
        newText = fixSteamEmbed(newText);
        newText = fixSpotifyEmbed(newText);
        newText = fixImages(newText);
        newText = replaceChangedSns(newText);
        checkForLinks(newText);

        editBox.value = newText;

        var event = new Event('change');

        editBox.dispatchEvent(event);
    }

    function makeGetRequest(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: response => resolve(response),
                onerror: error => reject(error)
            });
        });
    }


    const fixForumLinks = async () => {
        const editBox = document.getElementsByClassName("ember-text-area ember-view d-editor-input")[0];
        const oldText = editBox.value;
        let newText = oldText;

        const threadUrls = [...newText.matchAll(/\"https:\/\/forums.insertcredit.com\/d\/(.*?)(?:\/([0-9]*))?\"/gm)];

        for (const match of threadUrls) {
            const newSlug = match[1].substring(match[1].indexOf('-')+1);
            const newUrl = `https://forums.insertcredit.com/t/${newSlug}`;
            const response = await makeGetRequest(newUrl);
            if (response.status !== 404) {
                const urlWithId = response.finalUrl;
                const finalUrl = urlWithId + (match[2] ? `/${match[2]}` : "");
                newText = newText.replaceAll(match[0].replaceAll("\"", ""), finalUrl);
            }
        }

        editBox.value = newText;

        var event = new Event('change');

        editBox.dispatchEvent(event);
    }

    const checkTimer = setInterval(MyTimer, 1000);
    checkTimer();

    function MyTimer() {
        const replyDetails = document.getElementsByClassName("reply-details");

        if(replyDetails[0]) {
            if(!document.getElementById("fix-flarum-button")) {
                const newButton = document.createElement('button');
                newButton.id = "fix-flarum-button";
                newButton.textContent = "Fix Flarum artifacts";
                newButton.onclick = () => {
                    fixFlarumJank();
                };
                replyDetails[0].appendChild (newButton);
            }
        }
    }
})();