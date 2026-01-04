// ==UserScript==
// @name         LynxChan Extended Minus Minus
// @namespace    https://rentry.org/8chanMinusMinus
// @version      2.4.13
// @description  LynxChan Extended with even more features
// @author       SaddestPanda & Dandelion & /gfg/
// @license      UNLICENSE
// @match        *://*.8chan.moe/*
// @match        https://dev.8ch.moe/*
// @match        *://*.8chan.se/*
// @match        *://*.8chan.st/*
// @match        *://*.8chan.cc/*
// @match        *://alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad.onion/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.registerMenuCommand
// @grant        GM.listValues
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533169/LynxChan%20Extended%20Minus%20Minus.user.js
// @updateURL https://update.greasyfork.org/scripts/533169/LynxChan%20Extended%20Minus%20Minus.meta.js
// ==/UserScript==

//TODO: MAYBE keep the reverse search button near the filename now?
//TODO: MAYBE keep the reverse search button near the filename now?

//TODO LATER MAYBE: combine all CSS into one <style> and use classes on html or body instead.
(async function () {
    "use strict";

    const REGEX_THREAD = /\/res|last\//;
    const SETTINGS_DEFINITIONS = {
        firstRun:{
            default:true,
            hidden:true,
            desc:"You shouldn't be able to see this setting! (firstRun)",
        },
        addKeyboardHandlers:{
            default:true,
            desc:"Add keyboard Ctrl+ hotkeys to the quick reply box (Disable this for 8chanSS compatibility)",
            newline:false
        },
        showScrollbarMarkers:{
            default:true,
            type:"checkbox_with_colors",
            desc:"Show your posts and replies on the scrollbar",
            color1Default:"#0092ff",
            color1Desc:"<b>Your marker:</b>",
            color2Default:"#a8d8f8",
            color2Desc:"<b>Reply marker:</b>",
            newline:true
        },
        spoilerImageType:{
            default:"off",
            desc:"Override how the spoiler thumbnail looks:",
            type:"radio",
            options:{
                off:"Don't change the thumbnail.",
                reveal:"Reveal spoilers <span class='altText lineBefore'>(Previously spoilered images will have a red border around them indicating that they're spoilers.)</span>",
                reveal_blur:"Change to a blurred thumbnail <span class='altText lineBefore'>(Unblurred when you hover your mouse over.)</span>",
                kachina:"Makes the spoiler image Kachina from Genshin Impact.",
                thread:`<b>Use <b style="color: var(--link-color);">"ThreadSpoiler.jpg"</b> from the current thread <span class="altText lineBefore">(first posted jpg, png or webp image with that filename)</span></b>`,
                threadAlt:`same as above with the filename <b style="color: var(--link-color);">"ThreadSpoilerAlt.jpg"</b> <span class="altText lineBefore">(jpg, png or webp; uses ThreadSpoiler.jpg until this is found)</span>`,
                //test:`[TEST OPTION] Set custom spoiler thumb per-thread (For /gacha/ only!)`
            },
            newline:true
        },
        overrideBoardSpoilerImage: {
            default:true,
            parent:"spoilerImageType",
            //Not implemented yet
            //depends: function() {return settings.spoilerImageType != "off"},
            desc:"Also override board's custom thumbnail image <span class='altText lineBefore'>(for example, /v/'s spoiler thumbnail is an image of a monitor with a ? inside it)</span>",
            newline:false
        },
        revealSpoilerText:{
            default:"off",
            desc:"Reveal the spoiler text. Or make it into madoka runes.",
            type:"radio",
            options:{
                off:"Don't reveal spoilers.",
                on:"Spoilers will be always be shown by turning the text white.",
                madoka:`Spoilers will turn into madoka runes. Please install <a href="https://www.dropbox.com/s/n6ys414nviitr9y/MadokaRunes-2.0.ttf"><u>MadokaRunes.ttf</u></a> for it to show up properly.`
            },
            newline:true
        },
        markPostEdge:{
            default:true,
            type:"checkbox_with_colors",
            desc:"<span class='boldText'>Style:</span> Mark your posts and replies <span class='altText'>(with a left border)</span>",
            color1Default:"#4BB2FF",
            color1Desc:"<b>Your border:</b>",
            color2Default:"#0066ff",
            color2Desc:"<b>Reply border:</b>",
            newline:true
        },
        markYouText:{
            default:true,
            type:"checkbox_with_colors",
            desc:"<span class='boldText'>Style:</span> Color your name and (You) links",
            color1Default:"#ff2222",
            color1Desc:"<b>Color:</b>",
        },
        compactPosts:{
            default:true,
            desc:"<span class='boldText'>Style:</span> Make thumbnails and posts more compact",
        },
        showStubs:{
            default:true,
            desc:"<span class='boldText'>Style:</span> Show post stubs when filtering",
        },
        //I swear this used to be a built in option on 8chan
        halfchanGreentexts:{
            default:false,
            desc:"<span class='boldText'>Style:</span> Make the greentext brighter like 4chan",
        },
        fixPostConfirmStyling:{
            default:true,
            desc:"<span class='boldText'>Style:</span> Show a loading icon in the post confirmation &amp; refresh buttons",
        },
        showDeletionCheckbox:{
            default:true,
            desc:"<span class='boldText'>Style:</span> Show the deletion checkbox on posts <span class='altText lineBefore'>You don't need this if you're not a janitor/moderator.</span>",
        },
        showVideoIcons: {
            default:true,
            desc:"<span class='boldText'>Style:</span> Distinguish videos, gifs and audio with an icon before the filename",
        },
        glowFirstPostByID:{
            default:true,
            type:"checkbox_with_colors",
            desc:"Mark new/unique posters by adding a glow effect to their ID",
            color1Default:"#26bf47",
            color1Desc:"<b>Glow color:</b>",
            newline:true
        },
        showPostIndex:{
            default:true,
            type:"checkbox_with_colors",
            desc:"Show the current index of a post on the thread. <span class='altText'>(OP: 1, first post: 2 etc.)</span>",
            color1Default:"#7b3bcc",
            color1Desc:"<b>Index color:</b>",
        },
        showWatcherOnLoad: {
            default:false,
            desc:'Show the "Watched Threads" popup on page load',
        },
        preserveQuickReply:{
            default:false,
            desc:"Preserve the quick reply text when closing the box or refreshing the page",
            newline:true
        },
        reverseSearchOptions:{
            default:{
                pixiv:true,
                booru:true,
                saucenao:true
            },
            desc:"Reverse image search buttons to show:",
            type:"checkbox_multiple_dict", //Maybe "multiple_array" or "bitfield" types allowed in the future
            options:{
                pixiv:"Pixiv <span class='altText lineBefore'>Shown if the filename matches an image downloaded from Pixiv</span>",
                booru:"Gelbooru / Danbooru / Safebooru <span class='altText lineBefore'>Shown if the filename contains an md5 hash</span>",
                saucenao:"Saucenao <span class='altText lineBefore'>Always shown, uses JS to download and reupload the image to saucenao</span>"
            },
            newline:true,
        },
        reverseSearchBooruSite:{
            desc:"Booru to link if the above option is enabled",
            type:"dropdown",
            default:"gelbooru",
            choices:{
                "gelbooru":"https://gelbooru.com/index.php?page=post&s=list&tags=md5%3a",
                "danbooru":"https://danbooru.donmai.us/posts?tags=md5%3a",
                "safebooru":"https://safebooru.org/index.php?page=post&s=list&tags=md5%3a"
            }
        },
        /*writeCookies:{
            desc:"(DEVELOPER SETTING) Writes a cookie that expires in 1 week every time you load the page.",
            type:"textinput",
            category:"debug",
            value1Desc:"Name",
            value1Default:"",
            value2Desc:"Value",
            value2Default:"1"
        }*/
        filterByImageHash:{
            desc:"Filter images by their 8chan assigned hash",
            type:"textinput",
            category:"filter",
            default:"#Example: Filter an image\n#/52d7d2f07c1ab479ab8294b4482533c4d6dde2638d60e6f5864ee5fb844bc399/\n#Example: Filter image and then filter the poster's ID\n#/9ffe2e437a229e0e5bd93368df7eacfd5dbb6bc4ac170378e852411c3f437851/;poster;"
        },
        filterByImageName:{
            desc:"Filter images by their filename",
            type:"textinput",
            category:"filter",
            default:"#Example: Filter all images containing the word 'doro'\n#/doro/i;\n#Example: Filter all images with a randomized filename\n#/[0-9a-f]{64}/"
        }
    }

    const settingsNames = Object.keys(SETTINGS_DEFINITIONS);

    //Collect all color fields for checkbox_with_colors settings
    //In the userscript storage they look like settingName_color1 etc.
    const colorSettingKeys = [];
    settingsNames.forEach(key => {
        const def = SETTINGS_DEFINITIONS[key];
        if (def.type === "checkbox_with_colors") {
            Object.keys(def).forEach(k => {
                const match = k.match(/^color(\d+)Default$/);
                if (match) {
                    colorSettingKeys.push(`${key}_color${match[1]}`);
                }
            });
        }
    });

    //Compose all keys to load: main settings + color fields
    const allSettingKeys = [...settingsNames, ...colorSettingKeys];

    //For each color field, get its default from the definition
    function getDefaultForKey(key) {
        const colorMatch = key.match(/^(.+)_color(\d+)$/);
        if (colorMatch) {
            const [_, base, idx] = colorMatch;
            const def = SETTINGS_DEFINITIONS[base];
            //Return color setting default like color1Default
            return def && def[`color${idx}Default`] ? def[`color${idx}Default`] : undefined;
        }
        //Return regular setting
        return SETTINGS_DEFINITIONS[key]?.default;
    }

    const allSettingDefaults = allSettingKeys.map(getDefaultForKey);
    const allSettingValues = await Promise.all(allSettingKeys.map((key, i) => GM.getValue(key, allSettingDefaults[i])));
    //To access a setting, do settings[name_of_setting]
    const settings = Object.fromEntries(allSettingKeys.map((key, i) => [key, allSettingValues[i]]));

    //This might be a case of overcomplicating. Okay, it definitely is.
    // TODO: Change this to a function that scans the keys in 'settings'
    // and if they start with 'filter' and use type 'textinput',
    // convert to an object
    // Because we only save the text value contained in 'settings' anyways
    // So if someone adds a new filter it would get pushed to 'settings'
    // the object here is effectively read only
    // class FilteringManager {
    //     constructor(keyValueObject)
    //     {
    //         this.filters = {}
    //         this.deserializeFilters(keyValueObject)
    //     }

    //     deserializeFilters(keyValueObject) {

    //         Object.keys(keyValueObject).forEach(k => {
    //             this.filters[k] = []
    //             let regexLines = keyValueObject[k].split("\n");
    //             for(let i = 0, line; line = regexLines[i]; i++) {
    //                 if (line.startsWith("#"))
    //                     continue;
    //                 const filterAndOptions = line.split(";")
    //                 const newFilterObject = {
    //                     filter: filterAndOptions[0]
    //                 }
    //                 for (let j = 1, option; option = filterAndOptions[j]; j++) {
    //                     const optionAndParams = option.split(":",2)
    //                     const optionName = optionAndParams[0]
    //                     if (optionAndParams.length > 1)
    //                         newFilterObject[optionName] = optionAndParams[1]
    //                     else
    //                         newFilterObject[optionName] = true;
    //                 }

    //                 this.filters[k].push(newFilterObject);
    //             }
    //         })
    //         console.log(this.filters)
    //     }

    //     serializeFilters() {

    //     }
    // }
    // const CustomFilters = new FilteringManager({
    //     'ImageHash':settings.filterByImageHash, 
    //     'ImageName':settings.filterByImageName
    // });
    function deserializeFilters() {

        let keyValueObject = {};
        for (let i = 0; i < settingsNames.length; i++) {
            const name = settingsNames[i]
            if (name.startsWith("filterBy") && SETTINGS_DEFINITIONS[name]['category']=="filter") {
                keyValueObject[name.slice(8)] = settings[name]
            }
        }
        console.log(keyValueObject);


        function parseRegexString(str) {
            const match = str.match(/^\/(.+)\/([a-z]*)$/i);
            if (!match) throw new Error("Invalid regex string format "+str);

            const [, pattern, flags] = match;
            return new RegExp(pattern, flags);
        }

        let filters = {}

        Object.keys(keyValueObject).forEach(k => {
            
            filters[k] = {}

            let regexLines = keyValueObject[k].split("\n");
            for(let i = 0, line; line = regexLines[i]; i++) {
                if (line.startsWith("#"))
                    continue;
                try {

                    const filterAndOptions = line.split(";")
                    const newFilterObject = {
                        regex: parseRegexString(filterAndOptions[0])
                    }
                    //console.log(filterAndOptions);
                    for (let j = 1, option; option = filterAndOptions[j]; j++) {
                        const optionAndParams = option.split(":",2)
                        const optionName = optionAndParams[0]
                        //console.log(optionAndParams)
                        if (optionAndParams.length > 1)
                            newFilterObject[optionName] = optionAndParams[1]
                        else
                            newFilterObject[optionName] = true;
                    }

                    filters[k][filterAndOptions[0]] = newFilterObject;
                } catch (e) {
                    console.error(e)
                }
            }
        })
        console.log(filters)
        return filters;
    }
    const CustomFilters = deserializeFilters();

    function addMyStyle(newID, newStyle) {
        let myStyle = document.createElement("style");
        //myStyle.type = 'text/css';
        myStyle.id = newID;
        myStyle.textContent = newStyle;
        document.head.appendChild(myStyle);
    }

    function waitForDom(callback) {
        if (document.readyState === "loading") {
            //Loading hasn't finished yet. Wait for the inital document to load and start.
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            //Document has already loaded. Start.
            callback();
        }
    }

    if (document?.head) {
        runASAP();
    } else {
        //On some environments document.head doesn't exist yet?
        waitForDom(runASAP);
    }

    async function runASAP() {
        // Migrations can be removed in a few weeks
        // Migrations are disabled now. Keeping the code for potential future migrations

        // // Migrate old useExtraStylingFixes setting if present
        // const oldStyling = await GM.getValue("useExtraStylingFixes", undefined);
        // if (typeof oldStyling !== "undefined") {
        //     // If oldStyling is false, set both new options to false
        //     if (oldStyling === false) {
        //         settings.markPostEdge = false;
        //         settings.compactPosts = false;
        //         await GM.setValue("markPostEdge", false);
        //         await GM.setValue("compactPosts", false);
        //     }
        //     // Remove the old setting
        //     await GM.deleteValue("useExtraStylingFixes");
        // }

        localStorage.setItem("qrClearOnClose",!settings.preserveQuickReply)

        //Secret tip for anyone manually editing colors:
        //if you edit the saved value in your userscript manager's settings database manually, you can use semi-transparent colors for the color pickers (until you click save on the settings menu).
        //or easier: just copy the relevant part of the css and paste it to the css box in the website settings. Add !important if you want to force it like: color: red !important;

        //Apply all the styles as soon as possible
        if (settings.compactPosts) {
            addMyStyle("lynx-compact-posts", `
                /* smaller thumbnails & image paddings */
                body .uploadCell img:not(.imgExpanded) {
                    max-width: 160px;
                    max-height: 125px;
                    object-fit: contain;
                    height: auto;
                    width: auto;
                    margin-right: 0em;
                    margin-bottom: 0em;
                }

                .uploadCell {
                    margin-bottom: 0.45em;
                }

                .uploadCell .imgLink {
                    margin-right: 1em;
                }

                /* smaller post spacing (not too much) */
                .divMessage {
                    margin: .8em .8em .5em 3em;
                }

                /* file details: reduce paddings and icon sizes */
                .uploadDetails {
                    & > * {
                        vertical-align: top;
                        font-size: 95%;
                    }
                    & > .dimensionLabel {
                        margin-right: 0.3ch;
                    }
                    .coloredIcon {
                        font-size: 90%;
                    }
                    & > a.nameLink {
                        margin-right: -2.5px;
                    }
                    & > span.hideFileButton {
                        margin-right: -4px;
                    }
                }

                /* This thing adds an unnecessary line break (only on chrome) */
                .uploadCell > details > summary + br {
                    display: none;
                }

                /* Contain expanded images to the page */
                .imgExpanded {
                    max-height: 100vh;
                    object-fit: contain;
                }

            `);
        }

        const markerColor1 = settings.showScrollbarMarkers_color1 || SETTINGS_DEFINITIONS.showScrollbarMarkers.color1Default;
        const markerColor2 = settings.showScrollbarMarkers_color2 || SETTINGS_DEFINITIONS.showScrollbarMarkers.color2Default;
        const indexColor = settings.showPostIndex_color1 || SETTINGS_DEFINITIONS.showPostIndex.color1Default;
        const glowColor = settings.glowFirstPostByID_color1 || SETTINGS_DEFINITIONS.glowFirstPostByID.color1Default;
        addMyStyle("lynx-extended-css", `
        :root {
            --showScrollbarMarkers_color1: ${markerColor1};
            --showScrollbarMarkers_color2: ${markerColor2};
            --showPostIndex_color1: ${indexColor};
            --glowFirstPostByID_color1: ${glowColor};
            /*--settings-header-height: 40px;*/
        }

        /* Booru links */
        /* For multiple uploads the button is below the image, for single upload it's next to the filename */
        /* single upload buttons can also be moved below the image by setting the innerPost as relative. */
        .lynxReverseMenu {
            font-size: 10pt;
            border: 1px solid var(--border-color);

            & li:last-of-type {
                border-bottom: none;
            }
        }

        .lynxReverseImageSearch > a {
            margin: 0 4px 0 1px;

            &.fetch-awaiting::after {
                content: "(please wait...)" !important;
                filter: drop-shadow(0px 1px 2px black);
            }

            &.fetch-failed::after {
                content: "(search failed!)" !important;
                color: #ff2121;
                filter: drop-shadow(0px 1px 2px black);
            }

            & > svg {
                margin-block: -2.5px;
                height: 1em;
                width: 1em;
            }
        }

        .lynxReverseImageSearch {
            margin-left: 2px;
        }

        .multipleUploads .uploadCell:has(.lynxReverseImageSearch) {
            position: relative;
        }

        .multipleUploads .lynxReverseImageSearch {
            position: absolute;
            bottom: 0;
            left: 0;
            margin-left: 0;
            z-index: 2; /* Fixes the button not being clickable if you have spoiler thumbs disabled */

            & a {
                font-size: 1em;
                filter: drop-shadow(0px 0px 1px black) drop-shadow(0px 0px 1px var(--contrast-color)) drop-shadow(0px 0px 1px var(--contrast-color));
                &:hover,
                &:active {
                    background: var(--contrast-color);
                    opacity: 0.9;
                    max-width: 999px;
                }
            }
        }

        /* video icons for filenames */
        span.originalNameLinkWrapper.lynx-video:not(:hover) {
            padding-left: 13px;
            &::before {
                content: "\\e0a9";
                font-family: "Icons"; /* open-iconic font from the page */
                font-size: 90%;
                position: absolute;
                left: 0px;
            }
        }

        /* Scrollbar you and reply markers */
        .marker-container {
            position: fixed;
            top: 8px;
            right: 0px;
            width: 10px;
            height: calc(100vh - 16px);
            z-index: 11000;
            pointer-events: none;
        }

        .marker {
            position: absolute;
            width: 100%;
            height: 7px;
            background: var(--showScrollbarMarkers_color1);
            cursor: pointer;
            pointer-events: auto;
            border-radius: 40% 0 0 40%;
            z-index: 5;
            filter: drop-shadow(0px 0px 1px #000000BA);
        }

        .marker.alt {
            background: var(--showScrollbarMarkers_color2);
            z-index: 2;
        }

        .postNum.index {
            color: var(--showPostIndex_color1);
            font-weight: bold;
        }

        .labelId.glows {
            box-shadow: 0 0 15px var(--glowFirstPostByID_color1);
        }

        /* TODO LATER: switched this container to flexbox. Cleanup commented lines later if everything is good */
        #lynxExtendedMenu {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 15px;
            left: 50%;
            transform: TranslateX(-50%);
            padding: 10px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
            background: var(--contrast-color);
            color: var(--text-color);
            border: 1px solid #737373;
            border-radius: 4px;
            height: 90vh;
            max-height: 90vh;
            width: 50vw; /* fixed width for > 1080px viewport width */

            & .altText {
                opacity: 0.8;
                font-size: 0.9em;

                &.lineBefore::before {
                    content: "—— ";
                }
            }

            & .boldText {
                color: var(--link-color);
                font-weight: bold;
            }

            & .colorLabel {
                padding: 3px 2px 3px 4px;
                border-radius: 8px;
                box-shadow: 0px 0px 1px currentColor;
                margin-left: 0.5em;
            }

            & input[type="color"] {
                width: 40px;
                height: 20px;
                padding: 1px;
                transform: translate(0, 2px);
            }

            & button {
                padding: 10px 20px;
                margin-right: 4px;
                margin-bottom: 0;
                filter: contrast(115%) brightness(110%);
                &:hover {
                    filter: brightness(130%);
                }
            }

            textarea {
                font-family: monospace;
                width: 98%;
                height: 100%;
                resize: vertical;
                color: var(--text-color);
                background-color: var(--background-color);
                overflow: auto;
                white-space: pre; /* prevent text wrapping. filters are parsed line-by-line */
            }

            .tab {
                font-weight: bold;
                padding: 2px 4px;
                border-radius: 5px;
                border: 1px solid transparent;

                &.active {
                    border-color: var(--link-color);
                }
            }
        }

        #lynxExtendedMenu > .settings-header {
            /*height: var(--settings-header-height);*/
            padding-bottom: 5px;
        }
        #lynxExtendedMenu > .settings-content {
            overflow-y: auto;
            /*height: calc(100% - var(--settings-header-height))*/
            /* height: 88%; */
        }
        #lynxExtendedMenu > .settings-footer {
            margin-top: auto;
            /* height: auto; */
            /*position: absolute;
            bottom: 1px;*/
        }

        @media screen and (max-width: 1080px) {
            #lynxExtendedMenu{
                right:0;
                width:90%;
                line-height: 1.1em;
            }
        }

        .lynxExtendedButton::before {
            content: "\\e0da";
        }

        /* useful for new installs */
        body:has(> #lynxExtendedMenu) nav .lynxExtendedButton {
            color: var(--text-color);
        }

        `);

        if (settings.markPostEdge) {
            const color1 = settings.markPostEdge_color1 || SETTINGS_DEFINITIONS.markPostEdge.color1Default;
            const color2 = settings.markPostEdge_color2 || SETTINGS_DEFINITIONS.markPostEdge.color2Default;
            addMyStyle("lynx-mark-posts", `
                /*
                README:
                Mark your posts and replies with a left border. Specificity order: (you) > (reply).
                Important: The :not(#SP1) selectors and the !important are used for extra specificity.
                These are made extra specific so we can override ones from other userscripts.
                (because Lynx-- has an option to disable only this and also has the ability to customize the color)
                */
                /* Match your posts. This is easy. */
                body:not(#SP1#SP1) .yourPost {
                    border-left: 3px dashed var(--markPostEdge_color1, ${color1}) !important;
                }

                /*
                * Match replies:
                * This can be a simple .divMessage > .quoteLink
                * or it can be a .divMessage > details > .spoiler > s > u > .quoteLink (or something like that)
                */
                body:not(#SP1) .quotesYou {
                    border-left: 2px solid var(--markPostEdge_color2, ${color2}) !important;
                }
            `);
        }

        if (settings.markYouText) {
            const color1 = settings.markYouText_color1 || SETTINGS_DEFINITIONS.markYouText.color1Default;
            addMyStyle("lynx-mark-you-text", `
                    .youName { color: var(--markYouText_color1, ${color1}); }
                    .you { --link-color: var(--markYouText_color1, ${color1}); }
            `);
        }

        if (settings.halfchanGreentexts) {
            addMyStyle("lynx-halfchanGreentexts",
                `.greenText {
                    filter: brightness(110%);
                }
            `);
        }
        if (settings.fixPostConfirmStyling) {
            addMyStyle("lynx-fix-confirm-dialog",`
                /* ↓ The button disabled effect happens here. Now has a loading icon to let you know the post is going through! */
                input[value="Reload"]:disabled,
                input[type="submit"]:disabled,
                input[type="button"]:disabled,
                button:disabled {
                    cursor: wait;

                    /* The animated loading icon that appears only for disabled buttons to give the illusion of loading. If your icon is .apng format, remove the .png extension from the hash. */
                    background-image: url("/.media/2fa1b1615e7854cce8cfba5369afb8064b6b292a98ab9edf59bcb9893b7c3cb9");

                    /* Don't change this if you want to re-use the animated loading icon for your CSS theme. */
                    padding-left: 20px;

                    /* Don't change this if you want to re-use the animated loading icon for your CSS theme. */
                    background-size: 16px 16px;

                    /* Don't change this if you want to re-use the animated loading icon for your CSS theme. */
                    background-repeat: no-repeat;

                    /* Don't change this if you want to re-use the animated loading icon for your CSS theme. */
                    background-position: 2px center;
                }
            `);
        }

        if (settings.showStubs === false) {
            addMyStyle("lynx-hide-stubs",`
            .postCell:has(> span.unhideButton.glowOnHover) {
                display: none;
            }
            `);
        }

        if (settings.showDeletionCheckbox === false) {
            addMyStyle("lynx-hide-post-checkbox",`
            .deletionCheckBox {
                display: none;
            }
            `)
        }

        if (settings.revealSpoilerText=="on") {
            addMyStyle("lynx-reveal-spoilertext1",`
                span.spoiler { color: white }
            `);
        } else if (settings.revealSpoilerText=="madoka") {
            addMyStyle("lynx-reveal-spoilertext2",`
                span.spoiler:not(:hover) {
                    color: white;
                    font-family: MadokaRunes !important;
                }
            `);
        }

    } //End of runASAP()

    //Everything in runAfterDom runs after document has loaded (like @run-at document-end)
    //Everything in runAfterDom runs after document has loaded (like @run-at document-end)
    //Everything in runAfterDom runs after document has loaded (like @run-at document-end)
    async function runAfterDom() {
        console.log("%cLynx Minus Minus Started with settings:", "color:rgb(0, 140, 255)", settings);

        //Detect if the current page is a thread
        const url = window.location.href;
        const isThread = REGEX_THREAD.test(url);

        //Keep these for now I guess.
        //Get the following window objects
        //unsafeWindow works on chrome and Tampermonkey FF, wrappedJSObject works on Firefox VM.
        //Chrome and firefox behavior is different here. In Chrome you can simply do 'api' to check if the variable is defined, in Firefox you need to do typeof api !== 'undefined'.
        //And a && will return the second element if the first is true.

        // let windowAccessible = false;
        // const window_ref = (typeof unsafeWindow !== "undefined" && unsafeWindow) || (typeof window !== 'undefined' && window) || wrappedJSObject
        // const window_api = (typeof api !== 'undefined' && api) || window?.api || unsafeWindow?.api || wrappedJSObject?.api || undefined;
        // const window_posting = (typeof posting !== 'undefined' && posting) || window?.posting || unsafeWindow?.posting || wrappedJSObject?.posting || undefined;
        // const window_qr = (typeof qr !== 'undefined' && qr) || window?.qr || unsafeWindow?.qr || wrappedJSObject?.qr || undefined;
        // if (window_api && window_posting && window_qr) {
        //     windowAccessible = true;
        //     console.log(window_api)
        // } else {
        //     //I think greasemonkey sandboxes the script. I use violentmonkey though
        //     console.error("Lynx Minus Minus: This JS script is sandboxed and can't access page JS... (If you can read this, let me know what browser/extension does this. Or maybe the site just failed to load?)")
        // }

        if (settings.preserveQuickReply === false) {
            const qrBody = document.getElementById("qrbody");
            if (qrBody) {
                qrBody.value = "";
            }
        }

        function pageHotkeys(ev) {
            const key = ev.key.toLowerCase();
            //Ctrl+Q or Alt+R to open quick reply
            if ((ev.ctrlKey && key == "q") || (ev.altKey && key == "r")) {
                ev.preventDefault();
                //8chan's HTML will keep the text after a reload so attempt to clear it again
                const qrBody = document.getElementById("qrbody");
                if (settings.preserveQuickReply === false) {
                    if (qrBody) {
                        qrBody.value = "";
                    }
                }
                const replyBtn = document.getElementById("replyButton");
                replyBtn?.click();
                qrBody?.focus();
            };
            //Alt+T to toggle thread watcher
            if (ev.altKey && (key == "t")) {
                ev.preventDefault();
                const watcherBtn = document.querySelector("body > nav a.watcherButton");
                if (watcherBtn) watcherBtn.click();
            }
        }
        document.addEventListener("keydown", pageHotkeys);

        function createSettingsButton() {
            //Desktop
            document.querySelector("#navLinkSpan > .jsOnly > .settingsButton").insertAdjacentHTML("afterend", `
            <span>/</span>
            <a id="navigation-lynxextended" class="coloredIcon lynxExtendedButton" title="LynxChan Extended-- Settings"></a>
            `);
            //Mobile
            document.querySelector('#navLinkSpan > [for="mobile-hamburger"] li.jsOnly:has(> .settingsButton)').insertAdjacentHTML("afterend", `
                <li class="jsOnly">
                    <a id="navigation-lynxextended-mobile" class="coloredIcon lynxExtendedButton" title="LynxChan Extended-- Settings">Lynx Ex-- Settings</a>
                </li>
            `);
            document.querySelector("#navigation-lynxextended").addEventListener("click", openMenu);
            document.querySelector("#navigation-lynxextended-mobile").addEventListener("click", openMenu);
        }

        //Register menu command for the settings button
        GM.registerMenuCommand("Show Options Menu", openMenu);
        try {
            createSettingsButton();
        } catch (error) {
            //Don't log errors on the disclaimer page (constantly seen by private browsing users)
            if (document.location.href.includes("disclaimer.html") === false) {
                console.log("Error while creating settings button:", error);
            }
            // return; //If the button creation fails, don't continue (not sure if this is needed)
        }

        //Open the settings menu on the first run
        if (settings.firstRun) {
            settings.firstRun = false;
            await GM.setValue("firstRun", settings.firstRun);
            openMenu();
        }

        //Show watched threads on page load
        if (settings.showWatcherOnLoad) {
            const watchedMenu = document.querySelector("body > #floatingMenusContainer > #watchedMenu");
            const watcherButton = document.querySelector("#navLinkSpan > .jsOnly > .watcherButton");
            if (watcherButton) {
                if (!watchedMenu || (watchedMenu?.style?.display === "none")) {
                    watcherButton.click();
                }
            }
        }

        function replyKeyboardShortcuts(ev) {
            if (ev.ctrlKey) {
                let combinations = {
                    "s":["[spoiler]","[/spoiler]"],
                    "b":["'''","'''"],
                    "u":["__","__"],
                    "i":["''","''"],
                    "d":["[doom]","[/doom]"],
                    "m":["[moe]","[/moe]"]
                }
                for (var key in combinations) {
                    //Accept regular key even if caps lock is enabled (prevent eating ctrl+shift+* combos for now?)
                    if (ev.key == key || (ev.key.toLowerCase() == key && ev.shiftKey == false)) {
                        ev.preventDefault();
                        console.log("ctrl+"+key+" pressed in textbox")
                        const textBox = ev.target;
                        const tags = combinations[key];
                        const selectionStart = textBox.selectionStart;
                        const selectionEnd = textBox.selectionEnd;

                        if (selectionStart == selectionEnd) { //If there is nothing selected, make empty tags and center the cursor between it
                            document.execCommand("insertText", false, tags[0] + tags[1]);
                            //Center the cursor between tags
                            textBox.selectionStart = textBox.selectionEnd = (textBox.selectionEnd - tags[1].length);
                        } else {
                            // Handle multiline text: wrap each line separately as the markers only work on single lines
                            const selectedText = textBox.value.slice(selectionStart, selectionEnd);
                            const lines = selectedText.split('\n');
                            const wrappedLines = lines.map(line => tags[0] + line + tags[1]);
                            const newText = wrappedLines.join('\n');
                            document.execCommand("insertText", false, newText);
                        }
                        return;
                    }
                }
                //Ctrl+Enter to send reply
                if (ev.key=="Enter") {
                    document.getElementById("qrbutton")?.click()
                }
            }
        }


        function openMenu() {
            const oldMenu = document.getElementById("lynxExtendedMenu");
            if (oldMenu) {
                oldMenu.remove();
                return;
            }
            // Create options menu
            const menu = document.createElement("div");
            menu.id = "lynxExtendedMenu";
            menu.innerHTML = `
            <div class='settings-header'>
                <h3 style="text-align: center; color: var(--subject-color); line-height: 1.2em;"><span class="coloredIcon lynxExtendedButton" style="font-size: 0.9em; color: var(--text-color);"></span>LynxChan Extended-- <a rel="noopener noreferrer" target="_blank" href="https://greasyfork.org/en/scripts/533169-lynxchan-extended-minus-minus/versions">Version ${GM.info.script.version}</a></h3>
                <!--<p style="text-align: center;"><a href="https://greasyfork.org/en/scripts/533169-lynxchan-extended-minus-minus/versions">Version ${GM.info.script.version}</a></p>-->
                <!-- <p style="text-align: center;">SCROLL DOWN to save your settings!</p><br> -->
                <div class='settings-tabs'></div> <!-- Filled in below at addPageTomenu()!! -->
            </div>
            `;
            const menuTabs = menu.getElementsByClassName("settings-tabs")[0]

            const menuPages = document.createElement("div");
            menuPages.classList.add("settings-content");

            //we use createElement() here instead of setting innerHTML so we can attach onclick to elements
            //...In the future, at least. There aren't any onclicks added yet.
            const settingsPage = document.createElement("div");
            Object.keys(SETTINGS_DEFINITIONS).forEach((name) => {
                const setting = SETTINGS_DEFINITIONS[name];
                if (setting.hidden) {
                    //pass
                } else if (setting.category && setting.category != "default") {
                    //pass
                }
                else if (setting.type == "radio") {
                    let html = `${setting.newline ? '<br>' : ''}<span>${setting.desc}</span><br><form id="${name}" action='#'>`;
                    for (const [value, description] of Object.entries(setting.options)) {
                        html += `
                        <label>
                            <input name="${name}" type="radio" value="${value}" ${settings[name]==value ? "checked" : ""}>
                            <span>${description}</span>
                        </label><br>
                        `;
                    }
                    html += `</form>`;
                    settingsPage.innerHTML += html;
                } else if (setting.type == "checkbox_multiple_dict") {
                    const dict = settings[name]
                    let html = `${setting.newline ? '<br>' : ''}<span>${setting.desc}</span><br><form id="${name}" action='#'>`;
                    for (const [key, description] of Object.entries(setting.options)) {
                        html += `
                        <label>
                            <input name="${name}" type="checkbox" value="${key}" ${dict[key] ? "checked" : ""}>
                            <span>${description}</span>
                        </label><br>
                        `;
                    }
                    html += `</form>`;
                    settingsPage.innerHTML += html;
                } else if (setting.type == "dropdown") {
                    let html = `${setting.newline ? '<br>' : ''}<label for="${name}">${setting.desc}:</label><select id="${name}">`
                    Object.keys(setting['choices']).forEach(value => {
                        html+=`<option value="${value}" ${settings[name]==value ? "selected" : ""}>${value}</option>`
                    })
                    html+=`</select><br>`;
                    settingsPage.innerHTML += html;

                } else if (setting.type == "checkbox_with_colors") {
                    let colorHtml = "";
                    let colorFields = Object.keys(setting).filter(k => /^color\d+Default$/.test(k));
                    colorFields.forEach((colorKey) => {
                        const idx = colorKey.match(/^color(\d+)Default$/)[1];
                        const colorValue = settings[`${name}_color${idx}`] || setting[`color${idx}Default`];
                        const colorDesc = setting[`color${idx}Desc`] || "";
                        colorHtml += `
                        <label class="colorLabel">
                            ${colorDesc}
                            <input type="color" id="${name}_color${idx}" value="${colorValue}" ${settings[name] ? '' : 'disabled'}>
                        </label>
                        `;
                    });
                    settingsPage.innerHTML += `
                    ${setting.newline ? '<br>' : ''}
                    <label>
                        <input type="checkbox" id="${name}" ${settings[name] ? "checked" : ""}>
                        ${setting.desc}
                    </label>
                    ${colorHtml}
                    <br>`;
                } else if (setting.type == "textinput") {

                    let stringInputHtml = `<label>${setting.desc}</label>`
                    let inputFields = Object.keys(setting).filter(k => /^value\d+Default$/.test(k));
                    inputFields.forEach((inputKey) => {
                        const idx = inputKey.match(/^value(\d+)Default$/)[1];
                        const colorValue = settings[`${name}_value${idx}`] || setting[`value${idx}Default`];
                        const colorDesc = setting[`value${idx}Desc`] || "";
                        stringInputHtml += `
                        <label for="${name}_field${idx}">
                            ${colorDesc}
                        </label>
                        <input type="text" id="${name}_field${idx}" value="${colorValue}">
                        `;
                    });

                    settingsPage.innerHTML += stringInputHtml+`<br>`
                } else {
                    settingsPage.innerHTML += `
                    ${setting.newline ? '<br>' : ''}
                    <label>
                        <input type="checkbox" id="${name}" ${settings[name] ? "checked" : ""}>
                        ${setting.desc}
                    </label><br>`;
                }
            })

            const keyboardControlsPage = document.createElement("div");
            let combinations = {
                "S":"<span class='spoiler'>the game</spoiler>",
                "B":"<strong>Bold text</strong>",
                "U":"<u>Underlined Text</u>",
                "I":"<i>Italics</i>",
                "D":'<span class="doomText">RIP AND TEAR</span>',
                "M":'<span class="moeText">UGUU SO MOE~</span>',
                "Enter":"(Submits your post)"
            }
            let html = `
                <table style='text-align:left; margin: 0 auto'>
                    <tbody>
                        <tr> <th style='padding-right:20px'>Keyboard Combination</th> <th>Result</th> </tr>`
            Object.keys(combinations).forEach(k => {
                html += '<tr><td><code>Ctrl + ' + k+ '</code></td><td>' + combinations[k] + '</td></tr>';
            });

            html +=`</tbody></table>
            <p>If multiple lines are selected, each line will have the modifier applied to it.</p>
            <p>Refer to the <a href='/.static/pages/posting.html'>Help page</a> for other text modifiers.</p>
            `
            keyboardControlsPage.innerHTML = html

            const filteringPage = document.createElement("div");
            filteringPage.innerHTML =  `
                lorem ipsum girlsfrontline kuso (WIP WIP WIP)
                <br>Syntax is identical to 4chanX. You can add image hashes using the hide button.
                <br>The way this works is by using the image's path, since 8chan hashes the image based on content and stores it with a hashed filename.
                <br>Can't remember what an image points to? You can do <span style="font-family:monospace">https://8chan.moe/.media/hash</span> (replacing 'hash' with the hash).
                <br>
                Filter by image hash
                <textarea id='filterByImageHash' name="ImageHash" class="field" spellcheck="false" style="height:200px">${settings.filterByImageHash}</textarea>
                Filter by image filename
                <textarea id='filterByImageName' name="ImageName" class="field" spellcheck="false" style="height:200px">${settings.filterByImageName}</textarea>
            `
            //const imageFilteringTextarea = filteringPage.getElementsByTagName("textarea")[0];

            const debuggingPage = document.createElement("div");
            debuggingPage.innerHTML = `
                This is debug information
                The below box is read only. You can't use it to import settings yet.
                <textarea name="SettingsValues" disabled="" class='field' spellcheck='false' style="height:200px">${JSON.stringify(settings)}</textarea>
            `

            function addPageToMenu(div, pageTitle) {
                menuPages.appendChild(div);
                const pageIndex = menuPages.childElementCount
                div.classList.add("tab-page", 'page-'+(pageIndex))
                if (menuPages.childElementCount > 1) {
                    div.setAttribute("hidden","true")
                    menuTabs.innerHTML += " | "
                }
                menuTabs.innerHTML += `<a class='tab'>${pageTitle}</a>`
                // <a class='tab'>Main Settings</a> | <a class='tab'>Filtering</a> | <a class='tab'>Debug Options</a>
            }

            addPageToMenu(settingsPage, "Main Settings");
            addPageToMenu(keyboardControlsPage, "Keyboard Help");
            addPageToMenu(filteringPage, "Filtering");
            addPageToMenu(debuggingPage, "Debug Options");

            menu.appendChild(menuPages);
            menu.innerHTML += `
                <div class='settings-footer'>
                    <button id="saveSettings">Save</button>
                    <button id="closeMenu">Close</button>
                    <button id="resetSettings" style="float: right;">Reset</button>
                </div>
            `;

            document.body.appendChild(menu);

            //Init tabs
            var tabs = menu.querySelectorAll(".tab");
            var tabContainers = menu.querySelectorAll(".tab-page");

            for (let i = 0; i < tabs.length; i++) {

                // Copy i to idx using function closure. Without this i will get treated as a reference instead of a value
                // (thanks JavaScript)
                (function(idx){
                    tabs[idx].onclick = function() {
                        for (let j = 0; j < tabs.length; j++) {
                            //console.log("Selected button "+idx)
                            let btn = tabs[j];
                            let tabContent = tabContainers[j];

                            if (idx==j) {
                                btn.classList.add("active");
                                tabContent?.classList.add('active');
                                //Set HTML 'hidden' attribute that works like CSS display:none
                                tabContent?.removeAttribute("hidden");
                            }
                            else {
                                btn.classList.remove("active")
                                tabContent?.classList.remove("active");
                                tabContent?.setAttribute("hidden", "true");
                            }

                            btn.setAttribute("aria-selected", idx==j);
                            
                        }
                    }
                })(i);

                if (i==0)
                    tabs[i].click();
            }

            // Save button functionality
            document.getElementById("saveSettings").addEventListener("click", async () => {
                Object.keys(SETTINGS_DEFINITIONS).forEach((name) => {
                    const setting = SETTINGS_DEFINITIONS[name];
                    if (!('hidden' in setting)) {
                        if (setting.type=="radio") {
                            settings[name] = menu.querySelector(`input[name="${name}"]:checked`).value;
                        } else if (setting.type == "checkbox_multiple_dict") {

                            const d = {}
                            menu.querySelectorAll(`input[name="${name}"]`).forEach(checkbox => {
                                d[checkbox.value] = checkbox.checked;
                            })
                            settings[name] = d;

                        } else if (setting.type=="dropdown" || setting.type=="textinput") {
                            settings[name] = document.getElementById(name).value;
                        } else if (setting.type=="checkbox_with_colors") {
                            settings[name] = document.getElementById(name).checked;
                            let colorFields = Object.keys(setting).filter(k => /^color\d+Default$/.test(k));
                            colorFields.forEach((colorKey) => {
                                const idx = colorKey.match(/^color(\d+)Default$/)[1];
                                const colorName = `${name}_color${idx}`;
                                const colorValue = document.getElementById(colorName).value;
                                settings[colorName] = colorValue;
                                // Set CSS variable on body (so it can be used without a refresh)
                                document.body.style.setProperty(`--${colorName}`, colorValue);
                            });
                        } else {
                            if (document.getElementById(name) != null)
                                settings[name] = document.getElementById(name).checked;
                            else
                                console.error("Failed to find an element named "+name+", so this setting cannot be saved");
                        }
                    }
                })
                console.log("Saving settings ",settings)
                Promise.all(
                    Object.entries(settings).map(([key, value]) => GM.setValue(key, value))
                ).then(_ => { //.then() executes a function when the promise is completed. In this case it's an anonymous arrow function
                    menu.remove();
                    alert("Settings saved!\nFor most settings you must refresh the page for the changes to take effect.\n\n(only color pickers don't need a refresh)");
                });
            });

            // Reset button functionality
            document.getElementById("resetSettings").addEventListener("click", async () => {
                if (!confirm("Are you sure you want to reset all settings? This will delete all saved data.")) return;

                const keys = await GM.listValues();
                await Promise.all(keys.map(key => GM.deleteValue(key)));
                alert("All settings have been reset.\nRefreshing automatically for the changes to take effect.");
                menu.remove();
                location.reload();
            });

            // Close button functionality
            document.getElementById("closeMenu").addEventListener("click", () => {
                menu.remove();
            });

        }

        function createMarker(element, container, isReply) {
            const pageHeight = document.body.scrollHeight;
            const offsetTop = element.offsetTop;
            const percent = offsetTop / pageHeight;
            const top = (percent * 100).toFixed(2);

            const marker = document.createElement("div");
            marker.classList.add("marker");
            if (isReply) {
                marker.classList.add("alt");
            }
            marker.style.top = `${top}%`;
            marker.dataset.postid = element.id;

            marker.addEventListener("click", () => {
                let elem = element?.previousElementSibling || element;
                if (elem) elem.scrollIntoView({ behavior: "instant", block: "start" });
            });

            container.appendChild(marker);
        }

        function recreateScrollMarkers() {
            let oldContainer = document.querySelector(".marker-container");
            if (oldContainer) {
                oldContainer.remove();
            }
            // Create marker container
            const markerContainer = document.createElement("div");
            markerContainer.classList.add("marker-container");
            document.body.appendChild(markerContainer);

            // Match and create markers for "my posts" (matches native)
            document.querySelectorAll(".postCell:has(> .yourPost)")
                .forEach((elem) => {
                    createMarker(elem, markerContainer, false);
                });

            // Match and create markers for "replies" (matches native)
            document.querySelectorAll(".postCell:has(> .quotesYou)")
                .forEach((elem) => {
                    createMarker(elem, markerContainer, true);
                });
        }

        let postCount = 1;
        const postIndexLookup = {};
        function addPostCount(post, newpost = true) {
            // const posts = Array.from(document.querySelectorAll(".innerOP, .divPosts > .postCell"));
            if (post.querySelector(".postNum")) {
                return;
            }

            const postInfoDiv = post.querySelector(".title");
            const posterNameDiv = postInfoDiv.querySelector(".linkName");
            const postNumber = postInfoDiv.querySelector(".linkQuote")?.textContent;
            if (!postNumber) return;

            let localCount = postCount;
            if (newpost) {
                postIndexLookup[postNumber] = localCount;
                postCount++;
            } else {
                //Show cached post count for inlines & hovers
                localCount = postIndexLookup[postNumber];
                if (!localCount) return;
            }

            let newNode = document.createElement("span");
            newNode.innerText = localCount;
            newNode.className = "postNum index";
            // if (localCount >= Infinity) { //knownBumpLimit
            //     newNode.style = "color: rgb(255, 4, 4); font-weight: bold;"
            // }
            postInfoDiv.insertBefore(newNode, posterNameDiv);
            let foo = document.createTextNode("\u00A0"); // Non-breaking space
            postInfoDiv.insertBefore(foo, posterNameDiv);
        }


        // 1. We can't access window.hiding because VM sandbox exposes before it gets attached(?)
        // 2. We can't get a reference to an onclick handler
        // 3. We can't replace with our own function because hiding.js keeps a list of hidden posts in memory
        // So what do we do? We have to attach our own onclick and inject into the menu created by hiding.js at time of clicking!
        const filteringHooks = function(post, newpost = false) {
            const btn = post.querySelector(".hideButton")
            const fileNames = Array.from(post.querySelectorAll(".originalNameLink[href]"));
            if (fileNames.length == 0) //No attachments
                return;
            
            const positions = ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th']
            //Part of the post but only on mobile
            const mobileSelect = post.querySelector(".mobileSelect")

            if (mobileSelect) {
                //The way the select works on mobile is by putting the hide button on top of the dropdown
                //So in order to add more options, we have to make our own and proxy the original!
                let proxiedMobileSelect = mobileSelect.cloneNode(true)
                mobileSelect.setAttribute("style","display:none");

                for (let i = 0, nameElem; nameElem = fileNames[i]; i++) {
                    const pos = positions[i];
                    const imageFileName = nameElem.download;
                    let r = nameElem.href.split("/")
                    //The filename 8chan assigns on upload (contains file extension)
                    const imageUploadedFileName = r[r.length-1]
                    //The actual hash of the file
                    const imageHash = imageUploadedFileName.slice(0,-4)

                    proxiedMobileSelect.innerHTML += `<option data-hash="${imageHash}">Filter ${pos} Attachment Hash</option>`
                    if (imageUploadedFileName != imageFileName) { //If name == hash then this file has no filename
                        proxiedMobileSelect.innerHTML += `<option data-filename="${imageFileName}">Filter ${pos} Attachment Filename</option>`

                    }
                }

                proxiedMobileSelect.addEventListener("change", function(ev) {
                    let index = ev.target.selectedIndex;
                    //console.log(ev.target.selectedIndex)
                    if (index < mobileSelect.childElementCount) { //This option is in the original select so trigger original select
                        mobileSelect.selectedIndex = index;
                        mobileSelect.dispatchEvent(new Event("change"));
                    } else {
                        const o = ev.target.getElementsByTagName("option")[index];
                        let imageHash;
                        if (imageHash = o.getAttribute('data-hash')) {
                            settings.filterByImageHash += `\n/${imageHash}/`
                            GM.setValue('filterByImageHash',settings.filterByImageHash)
                        } else {
                            let imageFileName = o.getAttribute("data-filename")
                            settings.filterByImageName += `\n/${imageFileName}/`
                            GM.setValue('filterByImageName',settings.filterByImageName)
                        }
                    }
                    //console.log(mobileSelect.)
                })

                btn.appendChild(proxiedMobileSelect)
            } else {
                //The menu is destroyed when the user clicks out, so there is no need to worry about adding more than once.
                btn.addEventListener("click", function(ev) {
                    const filteringMenu = post.querySelector(".floatingList.extraMenu");
                    if (filteringMenu == null) //Mobile device?
                        return;
                    //console.log(fileNames);

                    for (let i = 0, nameElem; nameElem = fileNames[i]; i++) {
                        const pos = positions[i];
                        const imageFileName = nameElem.download;
                        let r = nameElem.href.split("/")
                        //The filename 8chan assigns on upload (contains file extension)
                        const imageUploadedFileName = r[r.length-1]
                        //The actual hash of the file
                        const imageHash = imageUploadedFileName.slice(0,-4)


                        const newMenuOption = document.createElement("li");
                        newMenuOption.innerText = `Filter ${pos} Attachment Hash`
                        newMenuOption.setAttribute("title","Posts containing the hash of this attachment will automatically be hidden.")
                        filteringMenu.firstElementChild.insertAdjacentElement('beforeend',newMenuOption)
                        //For some bizarre reason, this works and closes the menu but the original onclick is adding the menu back again
                        newMenuOption.addEventListener("click", function(ev) {
                            settings.filterByImageHash += `\n/${imageHash}/`
                            GM.setValue('filterByImageHash',settings.filterByImageHash)
                            //The menu is already deleted by this point, so this does nothing
                            //post.querySelector(".floatingList.extraMenu")?.remove()
                        })
                        
                        if (imageUploadedFileName != imageFileName) { //If name == hash then this file has no filename
                            let menuOption = document.createElement("li");
                            menuOption.innerText = `Filter ${pos} Attachment Filename`
                            menuOption.setAttribute("title","Posts with an attachment with a file name identical to this one will automatically be hidden.")
                            filteringMenu.firstElementChild.insertAdjacentElement("beforeend", menuOption);
                            menuOption.addEventListener("click", function(ev) {
                                settings.filterByImageName += `\n/${imageFileName}/`
                                GM.setValue('filterByImageName',settings.filterByImageName)
                                //post.querySelector(".floatingList.extraMenu")?.remove()
                            })

                        }


                    }
                })
            }


            if (newpost) {
                //Now check hashes...
                if (post.querySelector(".unhideButton") != null) {
                    //This post is already hidden
                    return
                }
                //WELL WE CAN'T USE DETOURS... AND WE CAN'T GET A REFERENCE... SO I GUESS WE HAVE TO DO THIS THE HARD WAY
                const hidePost = function(o) {
                    //console.log("Found match!! Hiding post "+post.id+", params are ",o)
                    let mobileSelect;
                    if (mobileSelect = post.querySelector(".mobileSelect")) {
                        if (o.poster === true)
                            mobileSelect.value = "Filter ID"
                        else
                            mobileSelect.value = "Hide"
                        mobileSelect.dispatchEvent(new Event("change"));
                        return true;

                    } else {
                        //Kill me
                        btn.click();
                        post.querySelector(".floatingList.extraMenu")?.setAttribute("style","display:none");

                        const filteringMenuItems = post.querySelector(".floatingList.extraMenu")?.querySelectorAll("li") || [];
                        for (let j = 0, htmlElement; htmlElement = filteringMenuItems[j]; j++) {
                            if (o.poster === true) {
                                if (htmlElement.innerText=="Filter ID") {
                                    //console.log("Filter Post+ID because poster flag is true")
                                    //htmlElement.click();
                                    //Not sure what's going on here but I guess the event handler doesn't get attached fast enough?
                                    setTimeout(() => htmlElement.click(), 1);
                                    return true;
                                }
                            } else if (htmlElement.innerText=="Hide") {
                                //console.log("Click hide button!!")
                                setTimeout(() => htmlElement.click(), 1);
                                
                                return true;
                            } else {
                                console.log(htmlElement.innerText)
                            }
                        }
                    }

                    return false;
                }

                for (let i = 0, nameElem; nameElem = fileNames[i]; i++) {
                    const imageFileName = nameElem.download;
                    let r = nameElem.href.split("/")
                    //The actual hash of the file
                    const imageHash = "/" + r[r.length-1].slice(0,-4) +"/"

                    //Hashes aren't regex so we only need to check if obj exists
                    let o = CustomFilters.ImageHash[imageHash];
                    if (o != null) {
                        hidePost(o);
                        return true;
                    }

                    const filterObjects = Object.values(CustomFilters.ImageName);
                    //console.log(filterObjects)
                    for (let j = 0; j < filterObjects.length; j++) {
                        if (filterObjects[j].regex.test(imageFileName)) {
                            hidePost(filterObjects[j]);
                            return true;
                        }
                    }
                }
            }
        }

        //Open source svg from iconify.design
        const SVG_SEARCH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" d="m20 20l-6-6"></path><path d="M15 9.5a5.5 5.5 0 1 1-11 0a5.5 5.5 0 0 1 11 0Z"></path></g></svg>`;
        function filenameFeatures(post) {
            const fileNames = Array.from(post.querySelectorAll(".originalNameLink[href]"));

            //Feature: Distinguish videos, gifs and audio with an icon
            //Theres also a mime type on .imgLink
            if (settings.showVideoIcons) {
                const videoExts = /\.(webm|mp4|mkv|mov|avi|flv|wmv|m4v|gif|apng|mp3|flac|opus|ogg|wav|aac|m4a|wma)$/i;
                fileNames.forEach((nameElem) => {
                    if (videoExts.test(nameElem.download)) {
                        nameElem.parentElement.classList.add("lynx-video");
                    }
                });
            }

            //Last feature: Reverse image search buttons
            //TODO MAYBE: Make this button open a small menu (like the post menu) instead of multiple buttons. AI can do it in 20 seconds.
            // .some() will return true if any value in the dict is true
            // So inverting this means no values are true, so return without doing anything
            if (!Object.values(settings.reverseSearchOptions).some(Boolean)) {
                return;
            }

            const regex_md5sum = /[0-9a-f]{32}/g;
            const regex_pixiv = /(\d+)_p\d+/;
            const alt_regex_pixiv = /illust\_(\d+)\_\d+\_\d+/; //Match pixiv images saved using the mobile app (ex. illust_123456_20250530_123456)

            for (let i = fileNames.length-1; i>=0; i--)
            {
                const nameElem = fileNames[i];
                const parent = nameElem.parentElement
                if (parent.querySelector(".lynxReverseImageSearch")) {
                    return;
                }
                const attachmentFileName = nameElem.download;

                const span = document.createElement("span");
                span.classList.add("lynxReverseImageSearch");

                // Build a single menu button with options for available reverse search engines
                let options = [];

                let m;
                if (
                    settings.reverseSearchOptions.pixiv && (
                      (m = regex_pixiv.exec(attachmentFileName)) !== null || (m = alt_regex_pixiv.exec(attachmentFileName)) !== null
                    )
                ) {
                    const pixivId = m[1];
                    options.push({
                        key: 'pixiv',
                        label: 'Pixiv',
                        action: function(btn) { window.open(`https://pixiv.net/i/${pixivId}`, '_blank', 'noopener,noreferrer'); }
                    });
                } else if (settings.reverseSearchOptions.booru) {
                    // MD5 / booru
                    //This is 'else if' because these options are mutually exclusive - a filename will never match pixiv AND an md5 hash
                    //And we don't want to match >1 because that could be an 8chan hash (There should only be 1 md5 hash in a file name anyways)
                    const md5Matches = [...attachmentFileName.matchAll(regex_md5sum)];
                    if (md5Matches && md5Matches.length == 1) {
                        const md5 = md5Matches[0][0];
                        const booruSite = settings.reverseSearchBooruSite;
                        const booruUrlBase = SETTINGS_DEFINITIONS['reverseSearchBooruSite']['choices'][booruSite];
                        const label = booruSite.charAt(0).toUpperCase() + booruSite.slice(1);
                        options.push({
                            key: 'booru',
                            label: label,
                            action: function(btn) { window.open(booruUrlBase + md5, '_blank', 'noopener,noreferrer'); }
                        });
                    }
                }

                // Saucenao
                if (settings.reverseSearchOptions.saucenao) {
                    //Logic: for everything thats not supported i.e. not an image use the thumbnail if its available
                    //Supported image extensions for Saucenao direct search
                    const imageExts = /\.(png|jpe?g|webp|bmp|gif)$/i;
                    let validImage = true;
                    let useThumbInstead = false;
                    let thumbUrl = null;
                    if (!imageExts.test(attachmentFileName)) {
                        // Not a supported image, try to find a thumbnail
                        const uploadCell = parent.closest('.uploadCell');
                        if (uploadCell) {
                            const thumbImg = uploadCell.querySelector('.imgLink > img');
                            const thumbSrc = thumbImg?.getAttribute("src");
                            if (thumbImg && thumbSrc?.startsWith('/.media/t_')) {
                                useThumbInstead = true;
                                thumbUrl = thumbSrc;
                            }
                        }
                        // If no valid thumbnail, don't add saucenao
                        if (!useThumbInstead) {
                            // Don't add saucenao button for this file
                            validImage = false;
                        }
                    }

                    if (validImage) {
                        // add saucenao as a menu option; action will fetch and submit to Saucenao like before
                        options.push({
                            key: 'saucenao',
                            label: 'Saucenao',
                            action: function(btn) {
                                //btn is the parent menu button
                                if (btn?.classList?.contains("fetch-awaiting")) return;
                                btn.classList.add("fetch-awaiting");
                                const fetchUrl = useThumbInstead ? thumbUrl : nameElem.href;
                                const fetchName = useThumbInstead ? ("thumbnail_" + attachmentFileName) : attachmentFileName;
                                fetch(fetchUrl)
                                    .then(resp => {
                                        if (!resp.ok) throw new Error("Fetch failed");
                                        return resp.blob();
                                    })
                                    .then(blob => {
                                        let file = new File([blob], fetchName, {type: blob.type} );
                                        let dataTransfer = new DataTransfer();
                                        dataTransfer.items.add(file);
                                        document.getElementById("saucenao_file_input").files = dataTransfer.files;
                                        document.getElementById("saucenao_submit").click();
                                        btn.classList.remove("fetch-awaiting");
                                    })
                                    .catch(() => {
                                        btn.classList.remove("fetch-awaiting");
                                        btn.classList.add("fetch-failed");
                                    });
                            }
                        });
                    }
                }

                //Generate a small menu like the post menus
                if (options.length > 0) {
                    // Create the menu button
                    const btn = document.createElement("a");
                    btn.setAttribute("title","Reverse image search");
                    btn.classList.add("lynxReverseMenuButton");
                    btn.innerHTML = SVG_SEARCH;

                    const removeExistingMenus = function() {
                        document.querySelectorAll('.lynxReverseMenu').forEach(el => el.remove());
                    }

                    const showMenu = function(ev) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        removeExistingMenus();

                        const menu = document.createElement('div');
                        menu.className = 'floatingList extraMenu lynxReverseMenu';
                        const ul = document.createElement('ul');
                        menu.appendChild(ul);

                        options.forEach(opt => {
                            const li = document.createElement('li');
                            li.innerText = opt.label;
                            li.addEventListener('click', function(e) {
                                e.stopPropagation();
                                // If the action expects an arg, pass it
                                try {
                                    opt.action(btn);
                                } catch (err) {
                                    console.error("Lynx-- Reverse image search action failed: ", err);
                                }
                                removeExistingMenus();
                            });
                            ul.appendChild(li);
                        });

                        document.body.appendChild(menu);

                        // Position the menu under the cursor (align the first button right under for now)
                        const x = ev.pageX - 10;
                        const y = ev.pageY - 4;
                        menu.style.position = 'absolute';
                        menu.style.left = x + 'px';
                        menu.style.top = y + 'px';
                        menu.style.zIndex = 99999;

                        // Close on click outside
                        const onDocClick = function() { removeExistingMenus(); document.removeEventListener('click', onDocClick); };
                        setTimeout(() => document.addEventListener('click', onDocClick), 0);
                    };

                    btn.addEventListener('click', showMenu);

                    span.appendChild(btn);
                    parent.insertAdjacentElement("beforebegin", span);
                }
            }
        }

        var idMap = {};
        const glowpost = function(post, newpost = true) {
            const list = post.querySelectorAll(".labelId");
            const postNumber = post.querySelector(".linkQuote")?.textContent;
            list.forEach((poster) => {
                try {
                    //Matches "ff55cc" or "ff55cc (3)"
                    const bc = poster.textContent.match(/\w+/);
                    const bgColor = bc[0];
                    if (newpost && idMap[bgColor] === undefined) {
                        idMap[bgColor] = postNumber;
                        poster.classList.add("glows");
                        poster.title = "This is the first post from this ID.";
                    } else if (!newpost && idMap[bgColor] == postNumber) {
                        poster.classList.add("glows");
                        poster.title = "This is the first post from this ID.";
                    }
                } catch (e) {
                    console.error("Lynx-- error when glowpost detection: ", e);
                }
            });
        }


        const revealSpoilerImages = function(post) {
            const spoilers = post.querySelectorAll(".imgLink > img:is([src='/spoiler.png'],[src*='/custom.spoiler'])");

            spoilers.forEach(image => {
                image.classList.add('spoiler-thumb');

                const uploadCell = image.closest('.uploadCell');
                const parent = image.closest('a.imgLink');
                const fileName = parent.href.split("/")[4];
                const dimensionLabel = uploadCell.querySelector('.dimensionLabel');
                const dataFilemime = parent.getAttribute('data-filemime');

                // Set the full image as the thumbnail for images that are 220x220 pixels or smaller.
                // This is a fix for small images because thumbnails are not generated for them.
                // This crap does not apply to GIFs, GIFs always have generated thumbnails.
                // #spoiler at the end is so that the site's built in js will leave these changes alone
                if (dimensionLabel && /^image\/.+$/.test(dataFilemime) && !/^image\/gif$/.test(dataFilemime) ) {
                    //Split at x or X, split only 2 times, then for each value in the split array convert to integer and assign to const 'dimensions'
                    const dimensions = dimensionLabel.textContent.trim().split(/x|×/, 2).map(v => parseInt(v));
                    if (dimensions.length === 2 && dimensions[0] <= 220 && dimensions[1] <= 220) {
                        image.src = `/.media/${fileName}?#spoiler`;
                    } else {
                        image.src = `/.media/t_${fileName.split(".")[0]}#spoiler`;
                    }
                } else {
                    image.src = `/.media/t_${fileName.split(".")[0]}#spoiler`;
                }
            })
        }

        if (settings.spoilerImageType.startsWith("reveal")) {
            addMyStyle("lynx-reveal-spoilerimage",`
                img.spoiler-thumb {
                    transition: 0.2s;
                    outline: 2px dotted #ff0000ee;
                    ${settings.spoilerImageType=="reveal_blur" ? "filter: blur(10px);" : ""}
                }
                img.spoiler-thumb:hover {
                    filter: blur(0);
                }
            `)
        }

        // Add functionality to apply the custom spoiler image CSS
        let threadSpoilerFound = false;
        let tsFallbackUsed = false;
        function setThreadSpoiler(post) {
            if (threadSpoilerFound) return;

            let spoilerImageUrl = null;

            //When the option is "threadAlt", fallback to "thread" if "threadAlt" doesn't exist yet.
            if (settings.spoilerImageType == "threadAlt") {
                const altSpoilerLink = Array.from(post.querySelectorAll('a.originalNameLink[download^="ThreadSpoilerAlt"]')).find(link => /\.(jpg|jpeg|png|webp)$/i.test(link.download));
                spoilerImageUrl = altSpoilerLink ? altSpoilerLink.href : null;
                tsFallbackUsed = false; //stop looking for threadAlt
            }

            if (settings.spoilerImageType == "thread" || (!spoilerImageUrl && !tsFallbackUsed && settings.spoilerImageType == "threadAlt")) {
                const spoilerLink = Array.from(post.querySelectorAll('a.originalNameLink[download^="ThreadSpoiler"]')).find(link => /\.(jpg|jpeg|png|webp)$/i.test(link.download));
                spoilerImageUrl = spoilerLink ? spoilerLink.href : null;
                if (settings.spoilerImageType == "threadAlt") {
                    tsFallbackUsed = true; //Keep looking for threadAlt
                }
            } else if (settings.spoilerImageType == "test") {
                const myArray = [
                    'https://8chan.moe/.media/f76e9657d6b506115ccd0ade73d3d562777a441e4b6bb396610669396ff3032a.png',
                    'https://8chan.moe/.media/1074fdb6eea4ba609910581e7824106736a1bcad446ace1ae0792b231b52cf9a.png',
                    'https://8chan.moe/.media/c32b4de8490d7e77987f0e2a381d5935ffa6fec9b98c78ea7c05bd4381d6f64b.png',
                    'https://8chan.moe/.media/bb225302110d52494ec2bea68693d566acee09767212ce4ee8c0d83d49cfa05b.png'
                ];
                spoilerImageUrl = myArray[Math.floor(Math.random() * myArray.length)];
                addMyStyle("lynx-thread-spoiler-css1", `
                    body {
                        --spoiler-img: url("${spoilerImageUrl}")
                    }
                    .uploadCell:not(.expandedCell) a.imgLink:has(>img[src="/spoiler.png"]),
                    .uploadCell:not(.expandedCell) a.imgLink:has(>img[src*="/custom.spoiler"]) {
                        background-image: var(--spoiler-img);
                        background-size: cover;
                        background-position: center;
                        & > img {
                            opacity: 0;
                        }
                    }
                `);
                threadSpoilerFound = true;
                return;
            }

            if (spoilerImageUrl) {
                document.head?.querySelector("#lynx-thread-spoiler-css2")?.remove(); //Remove if the style already exists (from fallback)
                addMyStyle("lynx-thread-spoiler-css2", `
                    ${settings.overrideBoardSpoilerImage ? '.uploadCell:not(.expandedCell) a.imgLink:has(>img[src*="/custom.spoiler"]),' : "" }
                    .uploadCell:not(.expandedCell) a.imgLink:has(>img[src="/spoiler.png"]) {
                        background-image: url("${spoilerImageUrl}");
                        background-size: cover;
                        background-position: center;
                        outline: dashed 2px #ff000090;
                        & > img {
                            opacity: 0;
                        }
                    }
                `);
                if (!tsFallbackUsed) {
                    threadSpoilerFound = true;
                }
            }
        }

        if (settings.spoilerImageType=="kachina") {
            addMyStyle("lynx-kachinaSpoilers",`
                ${settings.overrideBoardSpoilerImage ? '.uploadCell:not(.expandedCell) a.imgLink:has(>img[src*="/custom.spoiler"]),' : "" }
                .uploadCell:not(.expandedCell) a.imgLink:has(>img[src="/spoiler.png"]) {
                    background-size: cover;
                    background-position: center;
                    margin-right:5px;
                    background-image: url("data:image/jpeg;base64,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");
                    & > img {
                        opacity: 0;
                    }
                }
            `)
        }

        function iterateAllPosts() {
            //Get ALL posts (this does NOT include inlined posts and hovered posts)
            const allPosts = document.querySelectorAll("#divThreads > .opCell > .innerOP, .divPosts > .postCell");
            allPosts.forEach((post) => {
                iterateSinglePost(post, true);
            });
        }

        /**
         * Processes a single post element.
         *
         * @param {HTMLElement} post - The post here can be an .innerPost or one of its containers
         * @param {boolean} newpost - True if this is a new post in the thread (i.e. not a tooltip or inline)
         */
        function iterateSinglePost(post, newpost = false) {
            // console.log("Lynx-- processing post", {post}, {newpost}, {batching});
            filenameFeatures(post);
            if (settings.glowFirstPostByID)
                glowpost(post, newpost);
            if (settings.spoilerImageType.startsWith("reveal"))
                revealSpoilerImages(post);
            if (settings.showPostIndex)
                addPostCount(post, newpost);

            //Run only if its a new post in the thread
            if (newpost) {
                if (settings.spoilerImageType=="thread" || settings.spoilerImageType=="threadAlt")
                    setThreadSpoiler(post);

                //Below functions still have to iterate all posts, do these last and only when necessary.
                //These are now manually ran outside this function for performance reasons.
                // if (settings.showScrollbarMarkers)
                //     recreateScrollMarkers();
            }
            filteringHooks(post, newpost);
        }

        //ANYTHING BELOW ONLY RUNS ON THREAD PAGES (if (isThread))
        //ANYTHING BELOW ONLY RUNS ON THREAD PAGES (if (isThread))
        //99% of above are functions. They can be ignored.
        if (isThread) {
            if (settings.addKeyboardHandlers) {
                document.getElementById("qrbody")?.addEventListener("keydown", replyKeyboardShortcuts);
                document.getElementById("quick-reply")?.addEventListener('keydown',function(ev) {
                    if (ev.key == "Escape") {
                        document.getElementById("quick-reply")?.querySelector(".close-btn").click();
                    }
                })
            }
            if (settings.reverseSearchOptions.saucenao) {
                //have to shove this at the bottom of the document since the entire thread is inside a form div and I can't nest it
                const formm =`
                <form target="_blank" action="https://saucenao.com/search.php" method="POST" enctype="multipart/form-data" style="display:none">
                <input type="file" name="file" size="50" id='saucenao_file_input'>
                <input type="submit" accesskey="s" value="get sauce" id='saucenao_submit'>
                </form>`
                document.body.insertAdjacentHTML('beforeend', formm);
            }
            //Start running and observing
            iterateAllPosts();
            //Delay slow actions to let the page finish loading first.
            if (settings.showScrollbarMarkers) {
                setTimeout(() => recreateScrollMarkers(), 1);
            }
            //Observe posts and all their children
            const observer = new MutationObserver((mt_callback) => {
                let foundNewPost = false;
                mt_callback.forEach(mut => {
                    if (mut.type == "childList" && mut.addedNodes?.length > 0) {
                        //console.log("MutationObserver!!!");
                        mut.addedNodes.forEach(node => {
                            //New posts, new inlined posts, new hovered posts all contain .innerPost and are always in a div container.
                            //New posts are div.postCell and new inlines are div.inlineQuote
                            if (node.tagName === "DIV") {
                                // console.log("lynx ~ observer:", {node}, {mut});
                                if (node.classList.contains("postCell")) {
                                    foundNewPost = true;
                                    iterateSinglePost(node, true);
                                } else if (node.classList.contains("inlineQuote")) {
                                    iterateSinglePost(node, false);
                                }
                            }
                        });
                    }
                });
                //Manually run all remaining slow actions here
                if (foundNewPost && settings.showScrollbarMarkers) {
                    recreateScrollMarkers();
                }
            });
            observer.observe(document.querySelector(".divPosts"), {childList: true, subtree: true});

            //Observe the hover tooltip (ignore everything else)
            const toolObserver = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.tagName === "DIV" && node.matches(".innerPost, .innerOP")) {
                                //New hover tooltip found
                                iterateSinglePost(node, false);
                            }
                        });
                    }
                }
            });
            const quoteTooltip = document.body?.querySelector(":scope > div.quoteTooltip");
            if (quoteTooltip) {
                toolObserver.observe(quoteTooltip, {childList: true});
            }
        }
    } //End of runAfterDom()

    //Starting runAfterDom when the document is ready
    waitForDom(runAfterDom);
})();