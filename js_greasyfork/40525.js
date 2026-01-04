// ==UserScript==
// @name         NHentai Improved
// @namespace    Hentiedup
// @version      2.2.0
// @description  Partially fade/remove non-english, HQ thumbnails, mark as read, subs, version grouping etc.
// @author       Hentiedup
// @license      unlicense
// @match        https://nhentai.net/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @icon         https://i.imgur.com/1lihxY2.png
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/40525/NHentai%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/40525/NHentai%20Improved.meta.js
// ==/UserScript==

//TODO: alt version flags are sometimes wrong

(() => {
    //#region - Assets
    const readImg = '<svg style="vertical-align: middle;" width="15" height="15" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="book" class="svg-inline--fa fa-book fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z"></path></svg>';
    const unreadImg = '<svg style="vertical-align: middle;" width="15" height="15" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="book-open" class="svg-inline--fa fa-book-open fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M542.22 32.05c-54.8 3.11-163.72 14.43-230.96 55.59-4.64 2.84-7.27 7.89-7.27 13.17v363.87c0 11.55 12.63 18.85 23.28 13.49 69.18-34.82 169.23-44.32 218.7-46.92 16.89-.89 30.02-14.43 30.02-30.66V62.75c.01-17.71-15.35-31.74-33.77-30.7zM264.73 87.64C197.5 46.48 88.58 35.17 33.78 32.05 15.36 31.01 0 45.04 0 62.75V400.6c0 16.24 13.13 29.78 30.02 30.66 49.49 2.6 149.59 12.11 218.77 46.95 10.62 5.35 23.21-1.94 23.21-13.46V100.63c0-5.29-2.62-10.14-7.27-12.99z"></path></svg>';
    const flagEn = "https://i.imgur.com/vSnHmmi.gif";
    const flagJp = "https://i.imgur.com/GlArpuS.gif";
    const flagCh = "https://i.imgur.com/7B55DYm.gif";
    //#endregion

    //#region - Initialize settings
    //Non-english settings
    const remove_non_english = GM_getValue("remove_non_english", false);
    const partially_fade_all_non_english = GM_getValue("partially_fade_all_non_english", true);
    const non_english_fade_opacity = GM_getValue("non_english_fade_opacity", 0.3);
    //Comic reader system
    const comic_reader_improved_zoom = GM_getValue("comic_reader_improved_zoom", true);
    const remember_zoom_level = GM_getValue("remember_zoom_level", true);
    const zoom_level = Number(GM_getValue("zoom_level", 1.0));
    //Browse sections
    const browse_thumbnail_width = GM_getValue("browse_thumbnail_width", 0);
    const browse_thumnail_container_width = GM_getValue("browse_thumnail_container_width", 0);
    const load_high_quality_browse_thumbnails = GM_getValue("load_high_quality_browse_thumbnails", true);
    const infinite_load = GM_getValue("infinite_load", true);
    //Comic pages view
    const pages_thumbnail_width = GM_getValue("pages_thumbnail_width", 0);
    const pages_thumnail_container_width = GM_getValue("pages_thumnail_container_width", 0);
    const load_high_quality_pages_thumbnails = GM_getValue("load_high_quality_pages_thumbnails", true);
    const max_image_reload_attempts = 20; //for load_high_quality_browse_thumbnails and load_high_quality_pages_thumbnails
    //Mark as read system
    const mark_as_read_system_enabled = GM_getValue("mark_as_read_system_enabled", true);
    const marked_as_read_fade_opacity = GM_getValue("marked_as_read_fade_opacity", 0.3);
    const read_tag_font_size = GM_getValue("read_tag_font_size", 15);
    //Subscription system
    const subscription_system_enabled = GM_getValue("subscription_system_enabled", true);
    //Alt version grouping
    const version_grouping_enabled = GM_getValue("version_grouping_enabled", true);
    const version_grouping_filter_brackets = GM_getValue("version_grouping_filter_brackets", false);
    const auto_group_on_page_comics = GM_getValue("auto_group_on_page_comics", true);
    //Other
    const block_extra_ads = GM_getValue("block_extra_ads", true);
    //#endregion
    //#region - native blacklist settings
    const remove_native_blacklisted = GM_getValue("remove_native_blacklisted", true);
    //#endregion

    //#region - Initialize Sets (stored as strigified arrays)
    //Mark as read system
    let MARSet = new Set(TryParseJSON(GM_getValue("MARArrayString", "[]"), []));
    //Subsription system
    let SubsSet = new Set(TryParseJSON(GM_getValue("SubArrayString", "[]"), []));
    //#endregion

    //#region - Other script global scope variables
    let infinite_load_isLoadingNextPage = false;
    const nativeBlacklist = [];
    //#endregion

    //#region - Apply some initial stylesheets
    AddExtraAdBlockingStylesheets();
    AddNonEnglishStylesheets();
    AddImprovedReaderZoomStylesheets();
    AddBrowseThumbnailStylesheets();
    AddPagesThumbnailStylesheets();
    AddMARStylesheets();
    AddSubscriptionStylesheets();
    AddAltVersionStylesheets();
    AddInfiniteLoadStylesheets();
    AddSettingsStylesheets();
    //#endregion

    //#region - code for all pages
    //add tampermonkey menu item to access NHI settings
    GM_registerMenuCommand("Settings", () => {
        GM_openInTab("https://nhentai.net/nhi-settings/", { active: true });
    });

    if (subscription_system_enabled) {
        //Add Subscriptions button in the header to take user to custom Subscriptions page
        $(".menu.right").prepend('<li title="Subscriptions"><a id="header-subs-button" href="/subscriptions/"><i class="fa fa-heartbeat"></i><span> Subscriptions</span></a></li>');
    }

    const currentPagePath = window.location.pathname;
    //#endregion

    //#region - code for all pages with list of comics
    if ($(".container.index-container, #favcontainer.container, #recent-favorites-container, #related-container").length !== 0) {
        //Blacklisted removal
        HandleBlacklistedRemoval();
        //Non-english handling
        HandleAllNonEnglishOnPage();
        //Mark as read system
        if (mark_as_read_system_enabled) {
            //Mark all comics on page that have been read with READ visual tag
            //possible problems with too long selectors? - splitting it up to chunks of 50
            const parts = [];
            for (let i = 0, count = MARSet.size; i < count; i += 50)
                parts.push([...MARSet].slice(i, i + 50));
            for (let i = 0, count = parts.length; i < count; i++) {
                const readPartSelector = parts[i].join("'], .cover[href='");
                $(`.cover[href='${readPartSelector}']`).addClass("marked-as-read").append("<div class='readTag'>READ</div>");
            }
        }
        //Load HQ thumbnails for all comics on page
        if (load_high_quality_browse_thumbnails) {
            $(".container.index-container > .gallery > .cover > img, #favcontainer.container > .gallery-favorite > .gallery > .cover > img, #related-container.container > .gallery > .cover > img").on("load", OnLoadCoverReplaceHQ);
        }
        //Add alt version buttons and auto group on-page comics
        if (version_grouping_enabled) {
            AddVersionGroupingButtonsToJQuerySelector($(".gallery"));

            if (auto_group_on_page_comics)
                GroupAltVersionsOnPage();
        }

        InfiniteLoadHandling();
    }
    //#endregion

    //#region - url path specific code
    //Comic info page
    if (/^\/g\/\d+?\/$/.test(currentPagePath)) {
        //Mark as read system
        if (mark_as_read_system_enabled) {
            if (MARSet.has(currentPagePath)) //if item is marked as read (path == item. e.g. "/g/1234/")
                $(".buttons").append(`<a href="#" id="nhi-mar-button" class="btn btn-secondary btn-nhi-mark-as-unread">${unreadImg} <span style="vertical-align: middle;">Mark as unread</span></a>`); //..add unmark button
            else
                $(".buttons").append(`<a href="#" id="nhi-mar-button" class="btn btn-secondary btn-nhi-mark-as-read">${readImg} <span style="vertical-align: middle;">Mark as read</span></a>`); //...add mark button

            AddMARClickListeners();
        }
        //Subscriptions system
        if (subscription_system_enabled) {
            $(".tag").each((i, el) => {
                if (SubsSet.has($(el).attr("href")))
                    $(el).addClass("subbedTag");
            });
        }
        //HQ thumbnails
        if (load_high_quality_pages_thumbnails) {
            $("#thumbnail-container .thumb-container > .gallerythumb > img")?.on("load", OnLoadCoverReplaceHQ);
        }
    }
    //Comic reader page
    else if (comic_reader_improved_zoom && /^\/g\/\d+?\/\d+?\/$/.test(currentPagePath)) {
        HandleReaderImprovedZoom();
    }
    //User pages
    else if (subscription_system_enabled && currentPagePath.startsWith("/users/")) {
        //Make it more clear the timestamps in comments here are links to the gallery where the comment was made
        $(".comment time[datetime]")
            .css("margin-left", ".1em")
            .css("text-decoration", "underline")
            .each((i, el) => {
                $(el).parent().attr("title", "Click to view gallery where this comment was made");
                $(el).before("<span style='margin-left: .5em;' title='Click to view gallery where this comment was made'>🔗</span>");
            });

        //Below is only relevant if subscription system is enabled
        if (subscription_system_enabled) {
            //User page
            const pageUserName = $(".user-info > h1")?.text()?.trim();
            //current page user == current logged in user
            if (pageUserName && pageUserName === $("nav ul.menu.right a[href^='/users/']")?.text()?.replace(/<.+?>/g, "")?.trim()) {
                $(".user-info > div").before(`<p><b>Comics marked as read: </b>${MARSet.size}</p>`); //add number of comics read to page
                $("#user-container > .user-info a[href$='/edit']").before(`<a href="/nhi-settings/" id="nhi-nh-settings-button" type="button" class="btn btn-primary"><img src="https://i.imgur.com/TI45bnl.png" /><span>NHI Settings<span/></a>`);
            }
        }
    }
    //Subscriptions page
    else if (currentPagePath === "/subscriptions/") {
        RenderSubscriptionsPage();
    }
    //NHI Settings page
    else if (currentPagePath === "/nhi-settings/") {
        RenderNHISettingsPage();
    }
    //artist/group/tag/language/category pages
    else if (currentPagePath.startsWith("/artist/") || currentPagePath.startsWith("/group/") || currentPagePath.startsWith("/tag/") || currentPagePath.startsWith("/language/") || currentPagePath.startsWith("/category/")) {
        //if subscribed
        if (SubsSet.has(currentPagePath.split("popular")[0])) //on these pages, the path before anything starting with "popular" should always match the saved value
            $("h1:first").append('<a href="#" id="nhi-subscribe-button" class="btn btn-secondary btn-nhi-unsub"><span style="vertical-align: middle;">Unsubscribe</span></a>'); //...add unsub button
        else
            $("h1:first").append('<a href="#" id="nhi-subscribe-button" class="btn btn-secondary btn-nhi-sub"><span style="vertical-align: middle;">Subscribe</span></a>'); //...add sub button

        AddSubsClickListeners();
    }
    //#endregion




    //#region - FUNCTIONS

    //#region - Misc functions
    function TryParseJSON(jsonString, defaultValue = null) {
        try {
            return JSON.parse(jsonString);
        } catch {
            return defaultValue;
        }
    }
    //#endregion

    //#region - Extra ad blocking
    function AddExtraAdBlockingStylesheets() {
        if (block_extra_ads) {
            GM_addStyle(`
                nav ul.menu.left > li:has(a[href^="//tsyndicate.com"]) {
                    display: none;
                }
            `);
        }
    }
    //#endregion

    //#region - Blacklist related functions
    function HandleBlacklistedRemoval() {
        if (remove_native_blacklisted) {
            //remove all on-page comics marked as blacklisted
            $(".gallery.blacklisted").remove();

            //Record list of blacklisted tags. Needed for infinite load.
            if (infinite_load) {
                //The native blacklisted tags can be found on one of the on page inline scripts...
                const scripts = $("script:not([src])");
                let tags = [];
                for (script in scripts) {
                    tags = $(script)?.html()?.split("blacklisted_tags: [")?.[1]?.split("]")?.[0];
                    if (tags)
                        break;
                }
                if (tags) {
                    try {
                        nativeBlacklist.push(...JSON.parse(`[${tags}]`));
                        console.log(nativeBlacklist);
                    } catch {
                        console.log("NHI: failed to parse blacklisted tags");
                    }
                }
                else {
                    console.log("NHI: failed find blacklisted tags");
                }
            }
        }
    }
    //#endregion

    //#region - Settings related functions
    function AddSettingsStylesheets() {
        GM_addStyle(`
            #nhi-nh-settings-button {
                background-color: #1b2a37;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 8px 16px;
                cursor: pointer;
                transition: color 0.3s ease, filter 0.3s ease;
            }
            #nhi-nh-settings-button:hover,
            #nhi-nh-settings-button:active {
                color: #ed2553;
                filter: brightness(1.4);
            }
            #nhi-nh-settings-button > img {
                height: 25px;
            }

            .nhi-settings-main {
                margin-bottom: 50px;
            }

            .nhi-settings-page {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 10px;
                max-width: 100%;
            }
            .nhi-settings-page .nhi-settings-section {
                text-align: left;
                display: block;
                padding: 5px;
            }
            .nhi-settings-page .nhi-settings-section.nhi-settings-save-section {
                padding-top: 15px;
                display: flex;
                align-items: center;
            }
            .nhi-settings-page #saveButt {
                background-color: green;
                margin-right: 10px;
            }
            .nhi-settings-page .nhi-settings-export-container .nhi-settings-section {
                padding: 0;
            }
            .nhi-settings-page .nhi-settings-section h2 {
                margin: 5px 0;
            }
            .nhi-settings-page .nhi-settings-section label {
                margin: 5px;
            }
            .nhi-settings-page .nhi-settings-section label input {
                margin-right: 5px;
            }
            .nhi-settings-page .nhi-settings-section input[type="number"],
            .nhi-settings-page .nhi-settings-section input[type="text"] {
                width: 80px;
                height: 25px;
                border-radius: 3px;
                text-align: center;
                padding: 0;
            }
            .nhi-settings-page .nhi-settings-section sub {
                display: block;
                line-height: 1em;
            }
            .nhi-settings-page a {
                color: lightblue !important;
                text-decoration: underline;
                cursor: pointer;
            }
            .nhi-settings-export-container p {
                margin: 0;
            }
            #NHIImportFile {
                display: block;
                margin-top: 5px;
            }
        `);
    }
    function RenderNHISettingsPage() {
        //create page skeleton
        $("head title").html('NHI Settings').prop("style", "font-size: 3.5em;");
        $("#content").html(`
            <div class="nhi-settings-main">
                <form id="nhi-settings-form">
                    <div class="nhi-settings-section">
                        <h2>General Settings</h2>
                        <label><input name="block_extra_ads" type="checkbox" ${block_extra_ads ? "checked" : ""}><span>Block Extra Ads</span></label>
                    </div>
                    <div class="nhi-settings-section">
                        <h2>Non-English Settings</h2>
                        <label><input name="remove_non_english" type="checkbox" ${remove_non_english ? "checked" : ""}><span>Remove Non-English</span></label>
                        <label><input name="partially_fade_all_non_english" type="checkbox" ${partially_fade_all_non_english ? "checked" : ""}><span>Partially Fade Non-English</span></label>
                        <label><input name="non_english_fade_opacity" type="number" min="0" max="1" step="0.1" placeholder="0.3 - 1.0" value="${non_english_fade_opacity}"><span>Fade Opacity</span></label>
                    </div>
                    <div class="nhi-settings-section">
                        <h2>Browse Section Settings</h2>
                        <label><input name="infinite_load" type="checkbox" ${infinite_load ? "checked" : ""}><span>Dynamically load more comics as you scroll</span></label>
                        <label><input name="browse_thumbnail_width" type="number" min="0" placeholder="0" value="${browse_thumbnail_width}"><span>Thumbnail Width</span></label>
                        <label><input name="browse_thumnail_container_width" type="number" min="0" placeholder="0" value="${browse_thumnail_container_width}"><span>Thumbnail Container Width</span></label>
                        <label><input name="load_high_quality_browse_thumbnails" type="checkbox" ${load_high_quality_browse_thumbnails ? "checked" : ""}><span>HQ Thumbnails</span></label>
                    </div>
                    <div class="nhi-settings-section">
                        <h2>Comic Pages Section Settings</h2>
                        <label><input name="pages_thumbnail_width" type="number" min="0" placeholder="0" value="${pages_thumbnail_width}"><span>Thumbnail Width</span></label>
                        <label><input name="pages_thumnail_container_width" type="number" min="0" placeholder="0" value="${pages_thumnail_container_width}"><span>Thumbnail Container Width</span></label>
                        <label><input name="load_high_quality_pages_thumbnails" type="checkbox" ${load_high_quality_pages_thumbnails ? "checked" : ""}><span>HQ Thumbnails</span></label>
                    </div>
                    <div class="nhi-settings-section">
                        <h2>Comic Reader Settings</h2>
                        <label><input name="comic_reader_improved_zoom" type="checkbox" ${comic_reader_improved_zoom ? "checked" : ""}><span>Improved Zoom</span></label>
                        <label><input name="remember_zoom_level" type="checkbox" ${remember_zoom_level ? "checked" : ""}><span>Remember Zoom Level</span></label>
                    </div>
                    <div class="nhi-settings-section">
                        <h2>Mark As Read Settings</h2>
                        <label><input name="mark_as_read_system_enabled" type="checkbox" ${mark_as_read_system_enabled ? "checked" : ""}><span>Enabled</span></label>
                        <label><input name="marked_as_read_fade_opacity" type="number" min="0" max="1" step="0.1" placeholder="0.3 - 1.0" value="${marked_as_read_fade_opacity}"><span>Fade Opacity</span></label>
                        <label><input name="read_tag_font_size" type="number" min="0" placeholder="15" value="${read_tag_font_size}"><span>Read Tag Font Size</span></label>
                    </div>
                    <div class="nhi-settings-section">
                        <h2>Subscription Settings</h2>
                        <label><input name="subscription_system_enabled" type="checkbox" ${subscription_system_enabled ? "checked" : ""}><span>Enabled</span></label>
                    </div>
                    <div class="nhi-settings-section">
                        <h2>Version Grouping Settings</h2>
                        <label><input name="version_grouping_enabled" type="checkbox" ${version_grouping_enabled ? "checked" : ""}><span>Enabled</span></label>
                        <label style="margin-bottom: 0;"><input name="version_grouping_filter_brackets" type="checkbox" ${version_grouping_filter_brackets ? "checked" : ""}><span>Filter out normal brackets for version searches</span></label>
                        <sub>(square brackets are always filtered out regardless of this setting)</sub>
                        <label style="margin-bottom: 0;"><input name="auto_group_on_page_comics" type="checkbox" ${auto_group_on_page_comics ? "checked" : ""}><span>Automatically group on-page comics</span></label>
                        <sub>(Doesn't search the site, just current page)</sub>
                    </div>
                    <div class="nhi-settings-section">
                        <h2>Native Blacklist Settings</h2>
                        <a id="adjust-blacklist-link" href="#" target="_blank">Adjust Blacklist</a>
                        <label><input name="remove_native_blacklisted" type="checkbox" ${remove_native_blacklisted ? "checked" : ""}><span>Remove blacklisted comics</span></label>
                    </div>
                    <div class="nhi-settings-section nhi-settings-save-section">
                        <input id="saveButt" style="line-height: 30px; height: 30px;" type="submit" class="btn btn-primary" value="Save" />
                        <span id="savedIndicator" style="display: none; color: green; font-weight: 600;">Saved!</span>
                    </div>
                </form>
                <hr />
                <div class="nhi-settings-export-container">
                    <div class="nhi-settings-section">
                        <h2 style="margin-bottom: 0;">Import/Export Settings</h2>
                        <p>Also Imports/Exports data</p>
                        <p>(comics marked as read and subscriptions)</p>
                        </br>
                        <button id="exportButt" style="line-height: 30px; height: 30px;" type="button" class="btn btn-primary">Export</button>
                        <button id="importButt" style="line-height: 30px; height: 30px;" type="button" class="btn btn-primary">Import</button>
                        <input id="NHIImportFile" type="file" style="display: none;">
                    </div>
                </div>
            </div>
        `).addClass("nhi-settings-page").before("<h1>NHentai Improved Settings</h1>");

        //set adjust-blacklist-link href
        $("#adjust-blacklist-link").attr("href", `${$("nav .menu.right [href^='/users/']").attr("href")}/blacklist`);

        //Handle disables/fadeouts
        //set onChange event handlers
        $(".nhi-settings-section input[name='remove_non_english']").on("change", (e) => {
            $(".nhi-settings-section input[name='partially_fade_all_non_english']").prop("disabled", e.target.checked).closest("label").fadeTo(200, e.target.checked ? 0.5 : 1);
            $(".nhi-settings-section input[name='non_english_fade_opacity']").prop("disabled", e.target.checked).closest("label").fadeTo(200, e.target.checked ? 0.5 : 1);
        });
        $(".nhi-settings-section input[name='comic_reader_improved_zoom']").on("change", (e) => {
            $(".nhi-settings-section input[name='remember_zoom_level']").prop("disabled", !e.target.checked).closest("label").fadeTo(200, !e.target.checked ? 0.5 : 1);
        });
        $(".nhi-settings-section input[name='mark_as_read_system_enabled']").on("change", (e) => {
            $(".nhi-settings-section input[name='marked_as_read_fade_opacity']").prop("disabled", !e.target.checked).closest("label").fadeTo(200, !e.target.checked ? 0.5 : 1);
            $(".nhi-settings-section input[name='read_tag_font_size']").prop("disabled", !e.target.checked).closest("label").fadeTo(200, !e.target.checked ? 0.5 : 1);
        });
        $(".nhi-settings-section input[name='version_grouping_enabled']").on("change", (e) => {
            $(".nhi-settings-section input[name='version_grouping_filter_brackets']").prop("disabled", !e.target.checked).closest("label").fadeTo(200, !e.target.checked ? 0.5 : 1).parent().find("sub").fadeTo(200, !e.target.checked ? 0.5 : 1);
            $(".nhi-settings-section input[name='auto_group_on_page_comics']").prop("disabled", !e.target.checked).closest("label").fadeTo(200, !e.target.checked ? 0.5 : 1).parent().find("sub").fadeTo(200, !e.target.checked ? 0.5 : 1);
        });
        //trigger all the onChange event handlers to setup initial states
        $(`
            .nhi-settings-section input[name='remove_non_english'],
            .nhi-settings-section input[name='comic_reader_improved_zoom'],
            .nhi-settings-section input[name='mark_as_read_system_enabled'],
            .nhi-settings-section input[name='version_grouping_enabled']
        `).trigger("change");

        //Handle save
        $("#nhi-settings-form").on("submit", (e) => {
            e.preventDefault();
            const data = e.target;
            GM_setValue("block_extra_ads", data.block_extra_ads.checked);
            GM_setValue("remove_non_english", data.remove_non_english.checked);
            GM_setValue("partially_fade_all_non_english", data.partially_fade_all_non_english.checked);
            GM_setValue("non_english_fade_opacity", data.non_english_fade_opacity.value);
            GM_setValue("infinite_load", data.infinite_load.checked);
            GM_setValue("browse_thumbnail_width", data.browse_thumbnail_width.value);
            GM_setValue("browse_thumnail_container_width", data.browse_thumnail_container_width.value);
            GM_setValue("load_high_quality_browse_thumbnails", data.load_high_quality_browse_thumbnails.checked);
            GM_setValue("pages_thumbnail_width", data.pages_thumbnail_width.value);
            GM_setValue("pages_thumnail_container_width", data.pages_thumnail_container_width.value);
            GM_setValue("load_high_quality_pages_thumbnails", data.load_high_quality_pages_thumbnails.checked);
            GM_setValue("comic_reader_improved_zoom", data.comic_reader_improved_zoom.checked);
            GM_setValue("remember_zoom_level", data.remember_zoom_level.checked);
            GM_setValue("mark_as_read_system_enabled", data.mark_as_read_system_enabled.checked);
            GM_setValue("marked_as_read_fade_opacity", data.marked_as_read_fade_opacity.value);
            GM_setValue("read_tag_font_size", data.read_tag_font_size.value);
            GM_setValue("subscription_system_enabled", data.subscription_system_enabled.checked);
            GM_setValue("version_grouping_enabled", data.version_grouping_enabled.checked);
            GM_setValue("version_grouping_filter_brackets", data.version_grouping_filter_brackets.checked);
            GM_setValue("auto_group_on_page_comics", data.auto_group_on_page_comics.checked);
            GM_setValue("remove_native_blacklisted", data.remove_native_blacklisted.checked);

            $("#savedIndicator").hide().fadeIn(200, function () {
                setTimeout(() => {
                    $(this).fadeOut(200);
                }, 5000);
            });
        });

        //Handle Export
        $("#exportButt").click((e) => {
            e.preventDefault();
            const jsonObj = {
                "block_extra_ads": GM_getValue("block_extra_ads", true),
                "remove_non_english": GM_getValue("remove_non_english", false),
                "partially_fade_all_non_english": GM_getValue("partially_fade_all_non_english", true),
                "non_english_fade_opacity": GM_getValue("non_english_fade_opacity", 0.3),
                "infinite_load": GM_getValue("infinite_load", true),
                "browse_thumbnail_width": GM_getValue("browse_thumbnail_width", 0),
                "browse_thumnail_container_width": GM_getValue("browse_thumnail_container_width", 0),
                "load_high_quality_browse_thumbnails": GM_getValue("load_high_quality_browse_thumbnails", true),
                "pages_thumbnail_width": GM_getValue("pages_thumbnail_width", 0),
                "pages_thumnail_container_width": GM_getValue("pages_thumnail_container_width", 0),
                "load_high_quality_pages_thumbnails": GM_getValue("load_high_quality_pages_thumbnails", true),
                "comic_reader_improved_zoom": GM_getValue("comic_reader_improved_zoom", true),
                "remember_zoom_level": GM_getValue("remember_zoom_level", true),
                "mark_as_read_system_enabled": GM_getValue("mark_as_read_system_enabled", true),
                "marked_as_read_fade_opacity": GM_getValue("marked_as_read_fade_opacity", 0.3),
                "read_tag_font_size": GM_getValue("read_tag_font_size", 15),
                "subscription_system_enabled": GM_getValue("subscription_system_enabled", true),
                "version_grouping_enabled": GM_getValue("version_grouping_enabled", true),
                "version_grouping_filter_brackets": GM_getValue("version_grouping_filter_brackets", false),
                "auto_group_on_page_comics": GM_getValue("auto_group_on_page_comics", true),
                "remove_native_blacklisted": GM_getValue("remove_native_blacklisted", true),
                "MARArrayString": GM_getValue("MARArrayString", "[]"),
                "SubArrayString": GM_getValue("SubArrayString", "[]")
            };
            SaveToFile(`NHI-Backup_${new Date().toISOString().replace(/:/g, "-")}.nhi2`, JSON.stringify(jsonObj, null, 2));
        });

        //Handle Import
        $("#importButt").click((e) => {
            e.preventDefault();
            $("#NHIImportFile").animate({ height: 'toggle' }, 200);
        });
        $("#NHIImportFile").change((event) => {
            if (typeof window.FileReader !== 'function')
                throw ("The file API isn't supported on this browser.");
            const input = event.target;
            if (!input)
                throw ("The browser does not properly implement the event object");
            if (!input.files)
                throw ("This browser does not support the `files` property of the file input.");

            const file = input.files[0];
            if (!file.name.endsWith(".nhi") && !file.name.endsWith(".nhi2")) {
                $("#NHIImportFile").val('');
                throw ("Invalid file extension");
            }

            const fr = new FileReader();
            fr.onload = (ev) => {
                const importedData = ev.target.result;
                if (importedData != null && confirm("File received. Import this file?")) {
                    if (file.name.endsWith(".nhi2"))
                        ImportNewNHIFile(importedData);
                    else
                        ImportOldNHIFile(importedData);
                }
                else
                    $("#NHIImportFile").val('');
            };
            fr.readAsText(file);
        });
    }
    function ImportNewNHIFile(dataAsString) {
        const jsonObj = JSON.parse(dataAsString);
        GM_setValue("block_extra_ads", jsonObj.block_extra_ads);
        GM_setValue("remove_non_english", jsonObj.remove_non_english);
        GM_setValue("partially_fade_all_non_english", jsonObj.partially_fade_all_non_english);
        GM_setValue("non_english_fade_opacity", jsonObj.non_english_fade_opacity);
        GM_setValue("infinite_load", jsonObj.infinite_load);
        GM_setValue("browse_thumbnail_width", jsonObj.browse_thumbnail_width);
        GM_setValue("browse_thumnail_container_width", jsonObj.browse_thumnail_container_width);
        GM_setValue("load_high_quality_browse_thumbnails", jsonObj.load_high_quality_browse_thumbnails);
        GM_setValue("pages_thumbnail_width", jsonObj.pages_thumbnail_width);
        GM_setValue("pages_thumnail_container_width", jsonObj.pages_thumnail_container_width);
        GM_setValue("load_high_quality_pages_thumbnails", jsonObj.load_high_quality_pages_thumbnails);
        GM_setValue("comic_reader_improved_zoom", jsonObj.comic_reader_improved_zoom);
        GM_setValue("remember_zoom_level", jsonObj.remember_zoom_level);
        GM_setValue("mark_as_read_system_enabled", jsonObj.mark_as_read_system_enabled);
        GM_setValue("marked_as_read_fade_opacity", jsonObj.marked_as_read_fade_opacity);
        GM_setValue("read_tag_font_size", jsonObj.read_tag_font_size);
        GM_setValue("subscription_system_enabled", jsonObj.subscription_system_enabled);
        GM_setValue("version_grouping_enabled", jsonObj.version_grouping_enabled);
        GM_setValue("version_grouping_filter_brackets", jsonObj.version_grouping_filter_brackets);
        GM_setValue("auto_group_on_page_comics", jsonObj.auto_group_on_page_comics);
        GM_setValue("remove_native_blacklisted", jsonObj.remove_native_blacklisted);
        GM_setValue("MARArrayString", jsonObj.MARArrayString);
        GM_setValue("SubArrayString", jsonObj.SubArrayString);

        location.reload();
    }
    function ImportOldNHIFile(dataAsString) {
        const dataString = dataAsString.replace(/(\r?\n|\r)/g, "").trim(); //remove newlines and trim

        if (dataString.indexOf("|||||") < 0) {
            alert("invalid data");
            return;
        }

        const dataArr = dataString.split("|||||");

        if (dataArr.length > 0) {
            GM_setValue("SubArrayString", dataArr[0]);
            console.log("NHI - SubArrayString imported");
        }
        if (dataArr.length > 1) {
            GM_setValue("MARArrayString", dataArr[1]);
            console.log("NHI - MARArrayString imported");
        }
        if (dataArr.length > 2) {
            GM_setValue("BlockTagArrayString", dataArr[2]);
            console.log("NHI - BlockTagArrayString imported");
        }

        if (dataArr.length > 3) {
            GM_setValue("remove_non_english", (String(dataArr[3]) == "true"));
            console.log("NHI - remove_non_english imported");
        }
        if (dataArr.length > 4) {
            GM_setValue("partially_fade_all_non_english", (String(dataArr[4]) == "true"));
            console.log("NHI - partially_fade_all_non_english imported");
        }
        if (dataArr.length > 5) {
            GM_setValue("non_english_fade_opacity", dataArr[5]);
            console.log("NHI - non_english_fade_opacity imported");
        }

        if (dataArr.length > 6) {
            GM_setValue("load_high_quality_browse_thumbnails", (String(dataArr[6]) == "true"));
            console.log("NHI - load_high_quality_browse_thumbnails imported");
        }
        if (dataArr.length > 7) {
            GM_setValue("browse_thumbnail_width", dataArr[7]);
            console.log("NHI - browse_thumbnail_width imported");
        }
        if (dataArr.length > 8) {
            GM_setValue("browse_thumnail_container_width", dataArr[8]);
            console.log("NHI - browse_thumnail_container_width imported");
        }

        if (dataArr.length > 9) {
            GM_setValue("load_high_quality_pages_thumbnails", (String(dataArr[9]) == "true"));
            console.log("NHI - load_high_quality_pages_thumbnails imported");
        }
        if (dataArr.length > 10) {
            GM_setValue("pages_thumbnail_width", dataArr[10]);
            console.log("NHI - pages_thumbnail_width imported");
        }
        if (dataArr.length > 11) {
            GM_setValue("pages_thumnail_container_width", dataArr[11]);
            console.log("NHI - pages_thumnail_container_width imported");
        }

        if (dataArr.length > 12) {
            GM_setValue("max_image_reload_attempts", dataArr[12]);
            console.log("NHI - max_image_reload_attempts imported");
        }

        if (dataArr.length > 13) {
            GM_setValue("mark_as_read_system_enabled", (String(dataArr[13]) == "true"));
            console.log("NHI - mark_as_read_system_enabled imported");
        }
        if (dataArr.length > 14) {
            GM_setValue("marked_as_read_fade_opacity", dataArr[14]);
            console.log("NHI - marked_as_read_fade_opacity imported");
        }
        if (dataArr.length > 15) {
            GM_setValue("read_tag_font_size", dataArr[15]);
            console.log("NHI - read_tag_font_size imported");
        }

        if (dataArr.length > 16) {
            GM_setValue("subscription_system_enabled", (String(dataArr[16]) == "true"));
            console.log("NHI - subscription_system_enabled imported");
        }

        if (dataArr.length > 17) {
            GM_setValue("version_grouping_enabled", (String(dataArr[17]) == "true"));
            console.log("NHI - version_grouping_enabled imported");
        }
        if (dataArr.length > 18) {
            GM_setValue("version_grouping_filter_brackets", (String(dataArr[18]) == "true"));
            console.log("NHI - version_grouping_filter_brackets imported");
        }
        if (dataArr.length > 19) {
            GM_setValue("auto_group_on_page_comics", (String(dataArr[19]) == "true"));
            console.log("NHI - auto_group_on_page_comics imported");
        }

        if (dataArr.length > 20) {
            GM_setValue("comic_reader_improved_zoom", (String(dataArr[20]) == "true"));
            console.log("NHI - comic_reader_improved_zoom imported");
        }
        if (dataArr.length > 21) {
            GM_setValue("remember_zoom_level", (String(dataArr[21]) == "true"));
            console.log("NHI - remember_zoom_level imported");
        }
        if (dataArr.length > 22) {
            GM_setValue("zoom_level", Number(dataArr[22]));
            console.log("NHI - zoom_level imported");
        }
        if (dataArr.length > 23) {
            GM_setValue("tag_blocking_enabled", (String(dataArr[23]) == "true"));
            console.log("NHI - tag_blocking_enabled imported");
        }
        if (dataArr.length > 24) {
            GM_setValue("tag_blocking_fade_only", (String(dataArr[24]) == "true"));
            console.log("NHI - tag_blocking_fade_only imported");
        }
        if (dataArr.length > 25) {
            GM_setValue("infinite_load", (String(dataArr[25]) == "true"));
            console.log("NHI - infinite_load imported");
        }
        location.reload();
    }
    function SaveToFile(filename, dataString) {
        const blob = new Blob([dataString], { type: 'application/json' });
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else {
            const elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    }
    //#endregion

    //#region - Mark as read system related functions
    function AddMARStylesheets() {
        if (mark_as_read_system_enabled) {
            GM_addStyle(`
                .marked-as-read > img, .marked-as-read > .caption {
                    opacity: ${marked_as_read_fade_opacity};
                }

                .readTag {
					border-radius: 10px;
					padding: 5px 10px;
					position: absolute;
					background-color: rgba(0,0,0,.7);
					color: rgba(255,255,255,.8);
					bottom: 7.5px;
					right: 7.5px;
					font-size: ${read_tag_font_size}px;
					font-weight: 900;
					opacity: 1;
				}

				#info >.buttons > .btn-nhi-mark-as-read, #info >.buttons > .btn-nhi-mark-as-read:visited {
					background-color: #3d9e48;
				}
				#info >.buttons > .btn-nhi-mark-as-read:active, #info >.buttons > .btn-nhi-mark-as-read:hover {
					background-color: #52bc5e;
				}

				#info >.buttons > .btn-nhi-mark-as-unread, #info >.buttons > .btn-nhi-mark-as-unread:visited {
					background-color: rgb(218, 53, 53);
				}
				#info >.buttons > .btn-nhi-mark-as-unread:active, #info >.buttons > .btn-nhi-mark-as-unread:hover {
					background-color: #e26060;
				}

				.gallery {
					position: relative;
				}
            `);
        }
    }
    function AddMARClickListeners() {
        $("#nhi-mar-button").click(function () {
            //check if we are adding or deleting
            const markingAsRead = $(this).hasClass("btn-nhi-mark-as-read");

            //get the array again to make sure we have an up to date array (since other tabs could have modified it since loading this page)
            MARSet = new Set(TryParseJSON(GM_getValue("MARArrayString", "[]"), []));

            //add or delete
            if (markingAsRead)
                MARSet.add(currentPagePath);
            else
                MARSet.delete(currentPagePath);

            //save changes
            const MARArrayString = JSON.stringify([...MARSet]); //covert set to array string
            GM_setValue("MARArrayString", MARArrayString); //save string

            //update button
            if (markingAsRead)
                $(this).html(`${unreadImg} <span style="vertical-align: middle;">Mark as unread</span>`).removeClass('btn-nhi-mark-as-read').addClass('btn-nhi-mark-as-unread');
            else
                $(this).html(`${readImg} <span style="vertical-align: middle;">Mark as read</span>`).removeClass('btn-nhi-mark-as-unread').addClass('btn-nhi-mark-as-read');
        });
    }
    //#endregion

    //#region - Infinite load related functions
    function AddInfiniteLoadStylesheets() {
        if (infinite_load) {
            GM_addStyle(`
                #NHI_loader_icon {
                    height: 355px;
                    line-height: 355px;
                }
                #NHI_loader_icon > div {
                    display: inline-flex;
                }
                .loader {
                    color: #ed2553;
                    font-size: 10px;
                    width: 1em;
                    height: 1em;
                    border-radius: 50%;
                    position: relative;
                    text-indent: -9999em;
                    animation: mulShdSpin 1.3s infinite linear;
                    transform: translateZ(0);
                }

                @keyframes mulShdSpin {
                    0%,
                    100% {
                        box-shadow: 0 -3em 0 0.2em,
                        2em -2em 0 0em, 3em 0 0 -1em,
                        2em 2em 0 -1em, 0 3em 0 -1em,
                        -2em 2em 0 -1em, -3em 0 0 -1em,
                        -2em -2em 0 0;
                    }
                    12.5% {
                        box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
                        3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
                        -2em 2em 0 -1em, -3em 0 0 -1em,
                        -2em -2em 0 -1em;
                    }
                    25% {
                        box-shadow: 0 -3em 0 -0.5em,
                        2em -2em 0 0, 3em 0 0 0.2em,
                        2em 2em 0 0, 0 3em 0 -1em,
                        -2em 2em 0 -1em, -3em 0 0 -1em,
                        -2em -2em 0 -1em;
                    }
                    37.5% {
                        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
                        3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
                        -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
                    }
                    50% {
                        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
                        3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
                        -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
                    }
                    62.5% {
                        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
                        3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
                        -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
                    }
                    75% {
                        box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
                        3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
                        -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
                    }
                    87.5% {
                        box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
                        3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
                        -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
                    }
                }
            `);
        }
    }
    function InfiniteLoadHandling() {
        /*TODO:
        - Handle auto version grouping...
        Sometimes there are comics that are named something overly simple that causes tons of others to get grouped with it erroneously.
        Infinite load would make this issue way worse... How to handle this...
        Could group comcis only on a page by page basis.
        - Handle Favorites page -> infinite load disabled there for now
        */
        if (infinite_load) {
            //if found paginator on page (also, specifically not enabled on favorites page for now)
            const paginator = $(".pagination");
            if (paginator?.length && currentPagePath !== "/favorites/") {
                const lastPageNum = Number.parseInt(paginator.find(".last").attr("href").split("page=")[1]);
                //build the fetch url without the page number
                const queryWithNoPage = window.location.search.replace(/[\?\&]page=\d+/, "").replace(/^\&/, "?");
                const finalUrlWithoutPageNum = `${window.location.pathname + queryWithNoPage + (queryWithNoPage.length ? "&" : "?")}page=`;

                //on scroll event,
                $(window).scroll(() => {
                    //if we are near page bottom,
                    if ($(window).scrollTop() + (window.visualViewport?.height || $(window).height()) >= $(document).height() - 15) {
                        const loadingPageNum = Number.parseInt($(".pagination > .page.current:last").attr("href").split("page=")[1]) + 1;
                        TryLoadInNextPageComics(loadingPageNum, lastPageNum, finalUrlWithoutPageNum);
                    }
                });

                //While page is smaller than viewport, i.e. can't be scrolled, keep loading in pages
                const autoLoadWhileScrollNotAvailableInterval = setInterval(() => {
                    //clear this interval if all pages are loaded
                    const loadingPageNum = Number.parseInt($(".pagination > .page.current:last").attr("href").split("page=")[1]) + 1;
                    if (loadingPageNum > lastPageNum) {
                        clearInterval(autoLoadWhileScrollNotAvailableInterval);
                    }
                    else {
                        const doc = document.documentElement;
                        if (doc.scrollHeight <= doc.clientHeight) {
                            TryLoadInNextPageComics(loadingPageNum, lastPageNum, finalUrlWithoutPageNum);
                        }
                    }
                }, 200);
            }
        }
    }
    function TryLoadInNextPageComics(pageNumToLoad, lastPageNum, fetchUrlWithoutPageNum, retryNum = 0, maxFetchAttempts = 5) {
        //Do not start another load if one is already running (retry attempts are let through)
        if (retryNum === 0 && infinite_load_isLoadingNextPage)
            return;
        //don't try to load from a page > lastpage
        if (pageNumToLoad > lastPageNum)
            return;

        //console.log(`NHI infinite load - starting page ${pageNumToLoad} load`);
        infinite_load_isLoadingNextPage = true;

        //add loader icon visual
        $(".index-container:not(.advertisement, .index-popular)").first().append('<div id="NHI_loader_icon" class="gallery"><div><span class="loader"></span></div></div>');

        $.get({
            url: fetchUrlWithoutPageNum + pageNumToLoad,
            dataType: "html"
        }, (data) => {
            //for each comic fetched
            $(data).find("div.gallery").each((i, el) => {
                //blacklist handling
                if (remove_native_blacklisted) {
                    //probably won't work, but if the comic has blacklisted class, don't add it
                    if ($(el).hasClass("blacklisted"))
                        return;
                    //check if this comic has any blacklisted tags and if so, don't add it
                    const tags = $(el).attr("data-tags").trim().split(" ");
                    if (nativeBlacklist.some(nblTag => tags.includes(String(nblTag)))) {
                        return;
                    }
                }

                //if already on page (excluding the page 1 popular section), don't add again
                if ($(`.container:not(.index-popular) .cover[href='${$(el).find(".cover").attr("href")}']`).length)
                    return;

                //If removing or fading non-english
                if (remove_non_english || partially_fade_all_non_english) {
                    //Mark with english class/tag + if removing non-english...
                    if (!MarkIfEnglish($(el)) && remove_non_english) {
                        return; //...don't insert this comic
                    }
                }

                //set thumbnail src = data-src
                $(el).find("img").attr("src", $(el).find("img").attr("data-src"));

                //HQ thumbnail onLoad
                if (load_high_quality_browse_thumbnails)
                    $(el).find(".cover > img").on("load", OnLoadCoverReplaceHQ);

                //check if read, and mark as such
                if (mark_as_read_system_enabled) {
                    const cover = $(el).find("a.cover");
                    const item = cover.attr("href");
                    if (MARSet.has(item))
                        cover.addClass("marked-as-read").append("<div class='readTag'>READ</div>");
                }

                //add version grouping buttons
                if (version_grouping_enabled)
                    AddVersionGroupingButtonsToJQuerySelector($(el));

                //finally add the modified comic on to page
                $(".index-container:not(.advertisement, .index-popular)").first().append(el);
            });

            //after adding all comics from fetched page, mark that page as "current" in the paginator to clearly show the user all the pages currently loaded
            const paginatorItem = $(`.pagination > .page[href$='page=${pageNumToLoad}']`);
            if (paginatorItem?.length)
                paginatorItem.addClass("current");
            else
                $(".pagination > .next").before(`<a href="${fetchUrlWithoutPageNum}${pageNumToLoad}" class="page current">${pageNumToLoad}</a>`);

            $("#NHI_loader_icon").remove();
            //console.log(`NHI infinite load - page ${pageNumToLoad} load successful`);
            infinite_load_isLoadingNextPage = false;

        }).fail((jqXHR, textStatus, errorThrown) => {
            if (retryNum < maxFetchAttempts) {
                console.log(`NHI: Infinite load - Failed loading page ${pageNumToLoad} - ${textStatus} | ${errorThrown} - retrying... (retry ${retryNum + 1})`);
                TryLoadInNextPageComics(pageNumToLoad, lastPageNum, fetchUrlWithoutPageNum, retryNum + 1, 5);
            }
            else {
                $("#NHI_loader_icon").remove();
                console.log(`NHI: Infinite load - Failed loading page ${pageNumToLoad} - ${textStatus} | ${errorThrown} - Giving up after ${retryNum} retries.`);
                infinite_load_isLoadingNextPage = false;
            }
        });

    }
    //#endregion

    //#region - Alt version related functions
    function AddAltVersionStylesheets() {
        if (version_grouping_enabled) {
            GM_addStyle(`
				.overlayFlag
				{
					position: absolute;
					display: inline-block;
					top: 3px;
					left: 3px;
					z-index: 3;
					width: 18px;
					height: 12px;
				}
				.numOfVersions {
					border-radius: 10px;
					padding: 5px 10px;
					position: absolute;
					background-color: rgba(0,0,0,.7);
					color: rgba(255,255,255,.8);
					top: 7.5px;
					left: 105px;
					font-size: 12px;
					font-weight: 900;
					opacity: 1;
					width: 40px;
					z-index: 2;
					display: none;
				}
				.findVersionButton {
					border-radius: 10px;
					padding: 5px 10px;
					position: absolute;
					background-color: rgba(0,0,0,.4);
					color: rgba(255,255,255,.8);
					bottom: 7.5px;
					left: 7.5px;
					font-size: 12px;
					font-weight: 900;
					opacity: 1;
					width: 125px;
					z-index: 2;
					cursor: pointer;
				}
				.versionNextButton {
					border-radius: 10px;
					padding: 5px 10px;
					position: absolute;
					background-color: rgba(0,0,0,.7);
					color: rgba(255,255,255,.8);
					top: 7.5px;
					right: 7.5px;
					font-size: 12px;
					font-weight: 900;
					opacity: 1;
					display: none;
					z-index: 2;
					cursor: pointer;
				}
				.versionPrevButton {
					border-radius: 10px;
					padding: 5px 10px;
					position: absolute;
					background-color: rgba(0,0,0,.7);
					color: rgba(255,255,255,.8);
					top: 7.5px;
					left: 7.5px;
					font-size: 12px;
					font-weight: 900;
					opacity: 1;
					z-index: 2;
					display: none;
					cursor: pointer;
				}

				.findVersionButton:focus, .findVersionButton:hover, .findVersionButton:active,
				.versionNextButton:focus, .versionNextButton:hover, .versionNextButton:active,
				.versionPrevButton:focus, .versionPrevButton:hover, .versionPrevButton:active
				{
					background-color: rgba(50,50,50,1);
				}
			`);
        }
    }
    function AddVersionGroupingButtonsToJQuerySelector(JQSelector) {
        JQSelector.append([
            "<div class='findVersionButton'>Find Alt Versions</div>",
            "<div class='numOfVersions'>1/1</div>",
            "<div class='versionNextButton'>►</div>",
            "<div class='versionPrevButton'>◄</div>"
        ]);
        $(JQSelector).find(".findVersionButton").click(AddAltVersionsToThis);
        $(JQSelector).find(".versionPrevButton").click(PrevAltVersion);
        $(JQSelector).find(".versionNextButton").click(NextAltVersion);
    }
    function AddAltVersionsToThis(e) {
        e.preventDefault();
        const altVBtn = $(this);
        const originalComic = $(this).parent(); //.gallery
        const originalTitle = originalComic.find(".cover:visible > .caption").text();
        $.get(BuildUrl(originalTitle), (data) => {
            const found = $(data).find(".container > .gallery");
            if (!found || found.length <= 0) {
                alert("error reading data");
                return;
            }
            originalComic.find(".cover").remove();
            try {
                //iterate over each alt comic found
                for (let i = 0; i < found.length; i++) {
                    //fade or remove non-english
                    if (partially_fade_all_non_english || remove_non_english) {
                        const isEnglish = MarkIfEnglish($(found[i]));
                        if (!isEnglish && remove_non_english)
                            continue;
                    }
                    //add some missing flags
                    if ($(found[i]).attr("data-tags").split(" ").includes("12227")) //en
                        $(found[i]).find(".caption").append(`<img class="overlayFlag" src="${flagEn}">`);
                    else if ($(found[i]).attr("data-tags").split(" ").includes("6346")) //jp
                        $(found[i]).find(".caption").append(`<img class="overlayFlag" src="${flagJp}">`);
                    else if ($(found[i]).attr("data-tags").split(" ").includes("29963")) //ch
                        $(found[i]).find(".caption").append(`<img class="overlayFlag" src="${flagCh}">`);

                    //MAR
                    if (mark_as_read_system_enabled) {
                        //re-load MARSet to have up to date data
                        MARSet = new Set(TryParseJSON(GM_getValue("MARArrayString", "[]"), []));
                        const cover = $(found[i]).find(".cover");
                        //if MARSet has this comic, mark it as read
                        if (MARSet.has(cover.attr("href"))) {
                            cover.append("<div class='readTag'>READ</div>");
                            cover.addClass("marked-as-read");
                        }
                    }

                    //HQ thumbnail == Always using HQ thumbnails with Alt covers, because using normal covers would still require work to handle.
                    //TODO: Could add handling for non HQ covers later if I can be bothered
                    const coverImg = $(found[i]).find(".cover > img");
                    //if gallery item is missing data-src, add src to to data-src so that the generic method "ReplaceCoverImage" that relies on data-src can handle it
                    if (!$(coverImg).attr("data-src"))
                        $(coverImg).attr("data-src", $(coverImg).attr("src"));

                    ReplaceCoverImage($(coverImg));
                    originalComic.append($(found[i]).find(".cover"));
                }
            }
            catch (er) {
                alert(`error modifying data: ${er}`);
                return;
            }
            originalComic.find(".cover:not(:first)").css("display", "none");
            originalComic.find(".versionPrevButton, .versionNextButton, .numOfVersions").show(200);
            originalComic.find(".numOfVersions").text(`1/${found.length}`);
            altVBtn.hide(200);
        }).fail((e) => {
            alert(`error getting data: ${e}`);
        });
    }
    function GroupAltVersionsOnPage() {
        let i = 0;
        let found = $(".container > .gallery");
        while (!!found && i < found.length) {
            AddAltVersionsToThisFromPage(found[i]);
            i++;
            found = $(".container > .gallery");
        }
    }
    function AddAltVersionsToThisFromPage(target) {
        const targetComic = $(target); //.gallery
        targetComic.addClass("nhi-on-page-alt-ignoreThis");
        const targetTitle = targetComic.find(".cover > .caption").text();
        if (!targetTitle || targetTitle.length <= 0)
            return;
        const otherGalleries = $(".container > .gallery:not(.nhi-on-page-alt-ignoreThis)");
        let numOfValid = 0;
        for (let i = 0; i < otherGalleries.length; i++) //loop through galleries
        {
            const comicsInGallery = $(otherGalleries[i]).find(".cover");
            let addAll = false;
            for (let j = 0; j < comicsInGallery.length; j++) //loop through comics in the gallery
            {
                if (StringIncludesAllSearchTermsAfterCleanup($(comicsInGallery[j]).find(".caption").text(), targetTitle)) {
                    addAll = true; //if any of them match
                    break;
                }
            }
            if (addAll) //if any matched
            {
                for (let j = 0; j < comicsInGallery.length; j++)
                    targetComic.append($(comicsInGallery[j])); //add all
                $(otherGalleries[i]).addClass("nhi-on-page-alt-deleteThis");
                numOfValid += comicsInGallery.length;
            }
        }
        numOfValid++; //+1 because of the original target comic
        targetComic.removeClass("nhi-on-page-alt-deleteThis"); //ensure the original target comic gallery doesn't get removed
        targetComic.removeClass("nhi-on-page-alt-ignoreThis");
        $(".nhi-on-page-alt-deleteThis").remove(); //remove all the galleries whose comics got inserted to target comic's gallery
        //setup alt switching buttons if there is more than 1 comic in gallery
        if (numOfValid > 1) {
            targetComic.find(".cover:not(:first)").css("display", "none");
            targetComic.find(".versionPrevButton, .versionNextButton, .numOfVersions").show(200);
            targetComic.find(".numOfVersions").text(`1/${numOfValid}`);
        }
    }
    function NextAltVersion(e) { SwitchAltVersion(e, this, true) }
    function PrevAltVersion(e) { SwitchAltVersion(e, this, false) }
    function SwitchAltVersion(ev, htmlEl, next) {
        ev.preventDefault();
        const toHide = $(htmlEl).parent().find(".cover").filter(":visible");
        let toShow = next ? toHide.next() : toHide.prev();
        if (!toShow || toShow.length <= 0)
            return;
        if (!toShow.is(".cover"))
            toShow = next ? toHide.nextUntil(".cover", ":last").next() : toHide.prevUntil(".cover", ":last").prev();
        if (!toShow || toShow.length <= 0)
            return;
        toHide.hide(100);
        toShow.show(100);
        const n = $(htmlEl).parent().find(".numOfVersions");
        n.text(`${Number(n.text().split("/")[0]) + (next ? 1 : -1)}/${n.text().split("/")[1]}`);
    }
    function StringIncludesAllSearchTermsAfterCleanup(string, search) {
        const cleanString = CleanupSearchString(string);
        const cleanSearch = CleanupSearchString(search);
        if (cleanString.length === 0 || cleanSearch.length === 0)
            return false;

        const searches = cleanSearch.split(" ");
        //console.log(cleanString + " ::: includes all::: " + searches);
        for (let i = 0; i < searches.length; i++)
            if (!!searches[i] && searches[i].length > 0 && !cleanString.includes(searches[i]))
                return false
        return true;
    }
    function CleanupSearchString(title) {
        let cleanTitle = title.replace(/\[.*?\]/g, "");
        cleanTitle = cleanTitle.replace(/\【.*?\】/g, "");
        if (version_grouping_filter_brackets)
            cleanTitle = cleanTitle.replace(/\(.*?\)/g, "");
        return cleanTitle.trim();
    }
    function BuildUrl(title) {
        let url = CleanupSearchString(title);

        url = url.trim();
        //replace all instances of one or more consecutive symbol charactes padded by either whitespace or string start/end with a single space (except kanji)
        url = url.replace(/(^|\s){1}([^\w\s\d\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF\u2605-\u2606\u2190-\u2195\u203B]|\_)+?(\s|$){1}/g, " ");
        url = url.replace(/\s+/g, '" "'); //wrap all terms with ""
        url = `"${url}"`;
        url = encodeURIComponent(url);
        url = `https://nhentai.net/search/?q=${url}`;
        return url;
    }
    //#endregion

    //#region - Subscription system related functions
    function AddSubscriptionStylesheets() {
        if (subscription_system_enabled) {
            GM_addStyle(`
                #tags .subbedTag * {
                    background: unset;
                }
				#tags .subbedTag, #tags .subbedTag:visited {
					background-color: #2c5030;
				}
				#tags .subbedTag:active, #tags .subbedTag:hover {
					background-color: #416144;
				}

				#nhi-subscribe-button.btn-nhi-sub, #nhi-subscribe-button.btn-nhi-sub:visited {
					background-color: #3d9e48;
				}
				#nhi-subscribe-button.btn-nhi-sub:active, #nhi-subscribe-button.btn-nhi-sub:hover {
					background-color: #52bc5e;
				}

				#nhi-subscribe-button.btn-nhi-unsub, #nhi-subscribe-button.btn-nhi-unsub:visited {
					background-color: rgb(218, 53, 53);
				}
				#nhi-subscribe-button.btn-nhi-unsub:active, #nhi-subscribe-button.btn-nhi-unsub:hover {
					background-color: #e26060;
				}

				#sub-content ul {
					text-align: left;
				}
				#sub-content li {
					box-sizing: border-box;
					display: inline-block;
					width: 25%;
					text-align: center;
					padding: 5px 20px;
				}

				#nhi-subscribe-button {
					height: auto;
					line-height: initial;
					cursor: pointer;
					font-size: 0.5em;
					padding: 6px 12px;
				}
                @media only screen and (max-width: 1345px) {
                    .menu.right a[href^='/logout/'] span { display: none; }
                }
                    @media only screen and (max-width: 1270px) {
                    .menu.right a[href^='/users/'] span { display: none; }
                }
                @media only screen and (max-width: 670px) {
                    .menu.right a[href='/favorites/'] span { display: none; }
                }
                @media only screen and (max-width: 600px) {
                    .menu.right a[href^='/logout/'] span { display: inline; }
                    .menu.right a[href^='/users/'] span { display: inline; }
                    .menu.right a[href='/favorites/'] span { display: inline; }
                }

                .nhi-subscriptions-page > .tag-container {
                    margin-bottom: 40px;
                }
			`);
        }
    }
    function AddSubsClickListeners() {
        $("#nhi-subscribe-button").click(function () {
            //get proper sub item value
            const subItem = currentPagePath.split("popular")[0];

            //check if we are subbing or unsubbing
            const isSubbing = $(this).hasClass("btn-nhi-sub");

            //get the array again to make sure we have an up to date array (since other tabs could have modified it since loading this page)
            SubsSet = new Set(TryParseJSON(GM_getValue("SubArrayString", "[]"), []));

            //sub or unsub
            if (isSubbing)
                SubsSet.add(subItem);
            else
                SubsSet.delete(subItem);

            //save changes
            const SubArrayString = JSON.stringify([...SubsSet]); //covert set to array string
            GM_setValue("SubArrayString", SubArrayString); //save string

            //update button
            if (isSubbing)
                $(this).html('<span style="vertical-align: middle;">Unsubscribe</span>').removeClass('btn-nhi-sub').addClass('btn-nhi-unsub');
            else
                $(this).html('<span style="vertical-align: middle;">Subscribe</span>').removeClass('btn-nhi-unsub').addClass('btn-nhi-sub');
        });
    }
    function RenderSubscriptionsPage() {
        //create page skeleton
        $("head title").html('Subscriptions').prop("style", "font-size: 3.5em;");
        $("#content").html(
            `<h1>Subscriptions</h1>
            <h2>Artists</h2>
            <div class="container tag-container artist-section"></div>
            <h2>Groups</h2>
            <div class="container tag-container group-section"></div>
            <h2>Tags</h2>
            <div class="container tag-container tag-section"></div>
            <h2>Languages</h2>
            <div class="container tag-container language-section"></div>
            <h2>Categories</h2>
            <div class="container tag-container category-section"></div>`
        ).addClass("nhi-subscriptions-page");

        //add subs to page
        for (const subItem of SubsSet) {
            $(`.container.${subItem.split("/")[1]}-section`).append(`<a class="tag" href="${subItem}"><span class="name">${subItem.split("/")[2]}</span><span class="count">...</span></a>`);
        }

        //hide empty sections
        $(".nhi-subscriptions-page > .tag-container").each((i, el) => {
            if ($(el).is(":empty")) {
                $(el).hide();
                $(el).prev("h2").hide();
            }
        });

        //load counts
        $(".tag > .count").each((i, el) => {
            SubsPageLoadTagCountWithDelay($(el), i * 200);
        });
        $(".tag > .count").hover(function () {
            SubsPageLoadTagCountWithDelay($(this), 0);
        });
    }
    function SubsPageLoadTagCountWithDelay(elem, delay) {
        setTimeout(() => {
            if (!elem.hasClass("count-fetch-in-progress") && !elem.hasClass("count-fetched")) {
                elem.addClass("count-fetch-in-progress");
                $.ajax({
                    url: elem.parent().prop("href"),
                    method: "GET"
                }).done((data) => {
                    const found = $(data).find("h1 .tag > .count").text();
                    if (found != null && found.length > 0)
                        elem.text(found);
                    else
                        console.log(`failed finding tag from: ${elem.parent().prop("href")}`);

                    elem.addClass("count-fetched");
                }).fail(() => {
                    console.log(`failed getting page: ${elem.parent().prop("href")}`);
                }).always(() => { elem.removeClass("count-fetch-in-progress"); });
            }
        }, delay);
    }
    //#endregion

    //#region - Non-english related functions
    function AddNonEnglishStylesheets() {
        if (!remove_non_english && partially_fade_all_non_english) {
            GM_addStyle(`
                .gallery > .cover:not(.is-english) > img,
                .gallery > .cover:not(.is-english) > .caption
                {
                    opacity: ${non_english_fade_opacity};
                }
            `);
        }
    }
    function HandleAllNonEnglishOnPage() {
        if (remove_non_english || partially_fade_all_non_english) {
            $(".gallery").each((i, el) => {
                if (!MarkIfEnglish($(el)) && remove_non_english)
                    $(el).remove();
            });
        }
    }
    function MarkIfEnglish(JQGalleryElement) {
        if (JQGalleryElement?.length) {
            //check for english tag
            let isEnglish = JQGalleryElement.attr("data-tags").split(" ").includes("12227");
            //if tag not found, check the title, since NH has started leaving out tags randomly...
            if (!isEnglish) {
                const title = JQGalleryElement.find(".cover > .caption").text();
                if (/[\(\[]english[\)\]]/ig.test(title)) {
                    console.log(`NHI: Found comic that was not tagged as english (${title}), but includes '(English)' or '[English]' in the title. Adding missing tag and is-english class...`);
                    JQGalleryElement.attr("data-tags", `${JQGalleryElement.attr("data-tags")} 12227`);
                    isEnglish = true;
                }
            }
            if (isEnglish) {
                JQGalleryElement.find(".cover").addClass("is-english");
                return true;
            }
            return false;
        }
    }
    //#endregion

    //#region - Reader related functions
    function HandleReaderImprovedZoom() {
        let prevVal = 1.0;
        if (remember_zoom_level)
            prevVal = zoom_level;
        let curVal = prevVal;

        SetReaderImageScale(curVal);

        //make sure the current zoom-level stays between pages
        new MutationObserver((mutations) => {
            for (let i = 0; i < mutations.length; i++)
                if (mutations[i].type === 'attributes')
                    SetReaderImageScale(curVal);
        }).observe($("#image-container > a")[0], { attributes: true, childList: false, characterData: false });

        const zoomOut = () => {
            curVal = prevVal - 0.1;
            if (curVal < 0.1)
                curVal = 0.1;

            SetReaderImageScale(curVal);
            prevVal = curVal;
        };
        const zoomIn = () => {
            curVal = prevVal + 0.1;
            if (curVal > 3)
                curVal = 3;

            SetReaderImageScale(curVal);
            prevVal = curVal;
        }
        $('body').on('keydown', (e) => {
            if (e.key === '+') { zoomIn(); }
            else if (e.key === '-') { zoomOut() }
        });
        $("section.reader-bar button.reader-zoom-out").click((e) => {
            e.preventDefault();
            e.stopPropagation();
            zoomOut();
        });
        $("section.reader-bar button.reader-zoom-in").click((e) => {
            e.preventDefault();
            e.stopPropagation();
            zoomIn();
        });
    }
    function SetReaderImageScale(scale) {
        $("section.reader-bar .zoom-level > .value").html(scale.toFixed(1));
        $("#image-container img").css("width", 1280 * scale);
        GM_setValue("zoom_level", scale);
    }
    //#endregion

    //#region - HQ cover related functions
    function AddImprovedReaderZoomStylesheets() {
        if (comic_reader_improved_zoom) {
            GM_addStyle("html.reader #image-container img { max-width: 100% !important; }");
        }
    }
    function AddBrowseThumbnailStylesheets() {
        //#region - Apparently fixes issues with too long cover images +more?
        //TODO: This is old code. Not sure if this is actually needed and not entirely sure what it does. Should test.

        if (browse_thumbnail_width > 0) {
            GM_addStyle(`
				.gallery, .gallery > .cover {
					max-height: ${browse_thumbnail_width * 1.42}px;
				}
			`);
        }
        GM_addStyle(`
            .gallery > .cover {
                overflow: hidden;
                padding: 0 !important;
            }
            .gallery > .cover > img {
                position: relative;
                min-height: 100%;
            }

            .container.index-container, #favcontainer {
                text-align: center;
            }
            .gallery > .cover > img {
                width: 100%;
            }
        `);
        //#endregion

        if (browse_thumnail_container_width > 0) {
            GM_addStyle(`
                /*browsing comics*/
                .container.index-container, #favcontainer {
                    width: ${browse_thumnail_container_width}px;
                }
            `);
        }
        if (browse_thumbnail_width > 0) {
            GM_addStyle(`
                /*browsing comics*/
                .container.index-container > div.gallery, #favcontainer > .gallery-favorite {
                    width: ${browse_thumbnail_width}px;
                }
            `);
        }
        if (browse_thumnail_container_width > 0) {
            GM_addStyle(`
                /*browsing comics*/
                .container.index-container, #favcontainer {
                    max-width: 100%;
                }
            `);
        }
    }
    function AddPagesThumbnailStylesheets() {
        if (pages_thumnail_container_width > 0) {
            GM_addStyle(`
                /*view comic pages*/
                #thumbnail-container {
                    max-width: 100%;
                    width: ${pages_thumnail_container_width}px;
                }
            `);
        }
        if (pages_thumbnail_width > 0) {
            GM_addStyle(`
                /*view comic pages*/
                div.thumb-container img {
                    width: ${pages_thumbnail_width}px;
                }
            `);
        }
        //#region
        //TODO: This is old code. Not sure if this is actually needed and not entirely sure what it does. Should test.
        GM_addStyle(`
            /*view comic pages*/
            div.thumb-container {
                width: auto;
            }
            #thumbnail-container {
                text-align: center;
            }
        `);
        //#endregion
    }
    function OnLoadCoverReplaceHQ() {
        //TODO: Throws errors all over the place... Seems to works for most images though. if it fails the original lower res image remains so failing is okay-ish
        $(this).off("load");
        ReplaceCoverImage($(this));
    }
    function ReplaceCoverImage(coverImg, addMultiTry = true) {
        //TODO: Throws errors all over the place... Seems to works for most images though. if it fails the original lower res image remains so failing is okay-ish
        if (addMultiTry)
            AddMultiTryErrorHandlingForCoverImageLoad(coverImg);

        //set src and try to load
        const iNum = (Number.parseInt($(coverImg).attr("img-reloads") || 0) % 4) + 1;
        const newsrc = ConvertThumbnailURL($(coverImg).attr("data-src"), iNum);
        $(coverImg).attr("src", newsrc);
    }
    function AddMultiTryErrorHandlingForCoverImageLoad(coverImg) {
        $(coverImg).off("error");
        $(coverImg).on("error", function () {
            //count reload attempts
            let attempts = Number.parseInt($(this).attr("img-reloads") || 1);
            if (attempts >= max_image_reload_attempts) //after x attempts, give up
            {
                $(this).off("error");
                console.log(`gave up on: ${$(this).attr("src")}`);
                return;
            }

            const iNum = (Number.parseInt($(this).attr("img-reloads") || 0) % 4) + 1;
            const newsrc = ConvertThumbnailURL($(this).attr("data-src"), iNum);
            $(this).attr("src", newsrc); //reload
            attempts++;
            $(this).attr("img-reloads", attempts);
            console.log(`image reload attempt ${attempts} for: ${$(this).attr("src")}`);
        });
    }
    function ConvertThumbnailURL(url, iNum = 1) {
        return url?.replace(/\/\/t\d*?\./g, `//i${iNum}.`).replace("thumb.jpg", "1.jpg").replace("thumb.png", "1.png").replace("t.jpg", ".jpg").replace("t.png", ".png").replace("thumb.webp", "1.webp").replace("t.webp", ".webp");
    }
    //#endregion

    //#endregion
})();