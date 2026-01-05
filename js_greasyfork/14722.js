// ==UserScript==
// @name         Seriesfeed++
// @namespace    https://greasyfork.org/en/users/22592
// @description  A fork of Bierdopje AddOn Plus for Seriesfeed
// @include      https://www.seriesfeed.com/*
// @version      2.01
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      https://code.jquery.com/jquery-3.2.1.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @author       Mr. Invisible (mrinvisible@cryptolab.net)
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/14722/Seriesfeed%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/14722/Seriesfeed%2B%2B.meta.js
// ==/UserScript==

/*global GM.getValue,GM.info,GM.setValue,$ */

/**
 Changelog:
 2.01:
  - Add pointer cursor to flags and menu entry
  - Fix displaying on the episodes overview page
  - Fix displaying on the episodes details page
  - Fixed issue with aync loading of preferences causing wrong settings
  - Leaves debug on to debug other possible issues
 2.00: New GM API for the new FF version.
 1.17: 
	- Fix urls for real
	- Update JQuery version
	- Remove unneeded includes
 1.16: Fix urls
 1.15: Make compatible with https
 1.14: Fix bug with provider introduced in 1.13
 1.13: Added another search engine
 1.12:
    - Fix problem with watchlist that have no items left
    - Replaced two dead search engines
 1.11: Quick-fix for dialog
 1.10:
    - Replaced all providers, now you can define your own
    - Replaced quality, now you can define your own
 1.09: Added an exception
 1.08: Multi-domain
 1.07: Forgot to turn of debug once again
 1.06:
    - Updated for Seriesfeed 2.0
    - Added new provider
    - Dialog also closes when middle-clicking
    - Re-added functionality to the episode and season pages.
    - Added exception for legends of tomorrow
    - Added email address for easier communication
 1.05: Updated for Seriesfeed 1.3
 1.04: Fixed problem with the visual watchlist & dialog for download now closes after clicking a link.
 1.03: Updated for Seriesfeed 1.2
 1.02: Fixed small bug with Chrome-derived browsers
 1.01: Rewrote script in order to accommodate the Seriesfeed pages
 1.00: Cloned from the Bierdopje AddOn Plus version 1.101
 **/

// Create one accessible object. The remainder is hidden for external use.
var seriesFeedPlusPlus = (function () {
    'use strict';

    var seriesFeedPlusPlus, configDialog, // Objects
        debug, pageRegexes, currentPage, flags, subProviders, languageMap, // Variables
        main, checkPage, injectMenuItem, modifyPage, handleStartPage, injectDefaultTable, createFunctionality,
        createLanguageFlag, parseEpisode, showSubSelectionDialog, handleBroadcastPage, handleWatchlistPage,
        injectTableHeader, showDlSelectionDialog, createMediaLink, formatToConvention, handleSeasonPage,
        handleEpisodePage; // Methods

    // Initialize objects
    seriesFeedPlusPlus = {};
    configDialog = (function () {
        var instance, configElementName, preferences, mapping, show, close, closeOtherSubConfigs, closeSubConfig,
            openSubConfig, changeConfiguration, saveConfiguration, loadPreferences, getEnabledSubtitleLanguages,
            getConfigValue, getEnabledSubtitleSources, getEnabledDownloadProviders, getEnabledMediaQualities,
            checkConfiguration, isValidQualityConfig, isValidProviderConfig, isValidProvidersConfig;

        // Init vars
        configElementName = "configFrame";
        // Preferences with their default values
        preferences = {
            sub_lang_nl: true,
            sub_lang_en: true,
            sub_source_addic7ed: true,
            sub_source_podnapisi: true,
            sub_source_opensubtitles: false,
            sub_source_subtitleseeker: false,
            dl_quality: [
                'WEB-DL', 'HDTV 1080', 'HDTV 720', 'x265'
            ],
            dl_providers: [
                {
                    "name": "1337x",
                    "url": "https://1337x.to/search/{show}+{season_episode}+{quality}/1/",
                    "quality": {
                        "WEB-DL": "WEB-DL",
                        "HDTV 1080": "1080p x264",
                        "HDTV 720": "720p x264",
                        "x265": "x265"
                    },
                    "invalid_characters": {
                        "old": ["(", ")", " "],
                        "new": ["", "", "+"]
                    },
                },
                {
                    "name": "RARBG",
                    "url": "https://rarbg.to/torrents.php?search={show} {season_episode} {quality}",
                    "quality": {
                        "WEB-DL": "WEB-DL",
                        "HDTV 1080": "1080p x264",
                        "HDTV 720": "720p x264",
                        "x265": "x265"
                    }
                },
                {
                    "name": "TPB",
                    "url": "https://thepiratebay.org/search/{show} {season_episode} {quality}",
                    "quality": {
                        "WEB-DL": "WEB-DL",
                        "HDTV 1080": "1080p x264",
                        "HDTV 720": "720p x264",
                        "x265": "x265"
                    }
                },
                {
                    "name": "NZBIndex",
                    "url": "https://www.nzbindex.com/search/?q={show} {season_episode} {quality}&max=25&sort=agedesc&hidespam=1&more=0",
                    "quality": {
                        "WEB-DL": "720p|1080p WEB-DL",
                        "HDTV 1080": "1080p x264",
                        "HDTV 720": "720p x264",
                        "x265": "x265"
                    }
                },
                {
                    "name": "NZBClub",
                    "url": "https://www.nzbclub.com/search.aspx?q={show} {season_episode} {quality}&szs=20&sze=24&st=1&sp=1&sn=1",
                    "quality": {
                        "WEB-DL": "WEB-DL",
                        "HDTV 1080": "1080p x264",
                        "HDTV 720": "720p x264",
                        "x265": "x265"
                    }
                },
                {
                    "name": "BinSearch",
                    "url": "https://binsearch.info/index.php?q={show} {season_episode} {quality}&max=25&adv_age=999&adv_sort=date&adv_col=on&font=small",
                    "quality": {
                        "WEB-DL": "720p|1080p WEB-DL",
                        "HDTV 1080": "1080p x264",
                        "HDTV 720": "720p x264",
                        "x265": "x265"
                    }
                }
            ]
        };
        mapping = {
            sub_lang_nl: "Ext.SF.SubLanguage_NL",
            sub_lang_en: "Ext.SF.SubLanguage_US",
            sub_source_addic7ed: "Ext.SF.SubProvider_Addic7ed",
            sub_source_podnapisi: "Ext.SF.SubProvider_PodNapisi",
            sub_source_opensubtitles: "Ext.SF.SubProvider_OpenSubTitles",
            sub_source_subtitleseeker: "Ext.SF.SubProvider_SubtitleSeeker",
            dl_providers: "Ext.SF.MediaProviders",
            dl_quality: "Ext.SF.MediaQuality"
        };
        // Initialize functions
        show = function () {
            var css, html, div, subFrames, idx, inputs, head, style;
            if (document.getElementById(configElementName)) {
                close();
                return;
            }
            head = document.getElementsByTagName('head')[0];
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = ' ' +
                '.h3subframe { margin: 1px 0 0px; padding: 1px 10px; border-bottom: 1px solid #bbb; font-size: 1.5em; font-weight: normal; cursor:pointer; background:#DDDDDD none repeat scroll 0 0; } ' +
                '.h3subframe:hover { background:#C0BEBE none repeat scroll 0 0; } ' +
                '#h3subframetitle { margin: 2px 0 0px; padding: 7px 10px; border-bottom: 1px solid #bbb; font-size: 2.0em; font-weight: normal; } ' +
                '.popup a { color: darkblue; text-decoration: none; } ' +
                '.popup p { padding: 1px 10px; margin: 0px 0; font-family:arial,helvetica,sans-serif; font-size:10pt; font-size-adjust:none; font-stretch:normal; font-style:normal; font-variant:normal; font-weight:normal; line-height:normal; } ' +
                '.sidebyside { padding: 1px 10px; margin: 0px 0;display:inline-block;width:17em; } ' +
                '.h3subframecontent { overflow:auto; display: none; padding: 10px 10px; } ' +
                '.showinfo { font-size:14px; } ' +
                'textarea.valid, textarea.valid:focus { border: 2px solid green; } ' +
                'textarea.invalid, textarea.invalid:focus { border: 2px solid red; }';
            head.appendChild(style);

            html =
                '<div id="fade" style="background: #000;height: 100%;opacity: .80;"></div>' +
                '<div style="font-family: verdana; color: black; background: #ddd; padding: 10px 20px; border: 10px solid #fff; float: left; width: 731px; position: absolute; top: 2%; left: 40%; margin: 0 0 0 -292px; border-radius: 10px; z-index: 100;">' +
                '    <div class="popup" style="float: left; width: 100%; background: #fff; margin: 10px 0; padding: 0px 0 0px; border-left: 1px solid #bbb; border-top: 1px solid #bbb; border-right: 1px solid #bbb;">' +
                '        <a href="#" onclick="javascript:return false;">' +
                '            <img id="' + configElementName + '_close" style="border:none; position: absolute; right: -20px; top: -20px;" src="data:image/png;base64,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%3D%3D"/>' +
                '        </a>' +
                '        <div id="h3subframetitle"><b>Seriesfeed++ - Preferences</b></div>' +
                '        <div id="h3subframe1" class="h3subframe">Languages</div>' +
                '        <div class="h3subframecontent">' +
                '            <p class="showinfo">Choose the <b>subtitle languages</b> you want to find</p><br>' +
                '            <p><input type="checkbox" id="sub_lang_nl" /> Nederlands <img src="' + flags.nl + '"/></p>' +
                '            <p><input type="checkbox" id="sub_lang_en" /> English <img src="' + flags.en + '"/></p>' +
                '        </div>' +
                '        <div id="h3subframe2" class="h3subframe">Subtitles</div>' +
                '        <div class="h3subframecontent">' +
                '            <p class="showinfo">Choose the <b>subtitle sites</b> you want as option</p><br>' +
                '            <p><input type="checkbox" id="sub_source_addic7ed" /> Addic7eD <font color="gray">(preferred)</font></p>' +
                '            <p><input type="checkbox" id="sub_source_podnapisi" /> PodNapisi</p>' +
                '            <p><input type="checkbox" id="sub_source_opensubtitles" /> OpenSubtitles</p>' +
                '            <p><input type="checkbox" id="sub_source_subtitleseeker" /> SubTitleSeeker <font color="gray">(can be unsafe)</font></p>' +
                '        </div>' +
                '        <div id="h3subframe3" class="h3subframe">Media</div>' +
                '        <div class="h3subframecontent">' +
                '            <p class="showinfo">For examples of the configuration, see the <a target="_blank" href="https://greasyfork.org/en/scripts/14722-seriesfeed">Greasyfork</a> website</p>' +
                '            <p class="showinfo">Enter the <b>media formats</b> you want to have links for</p><br>' +
                '            <textarea cols="100" rows="2" class="valid" id="config_dl_quality">' + JSON.stringify(preferences.dl_quality, null, 1) + '</textarea><br>Config will not be stored unless the border is green.<br><br>' +
                '            <p class="showinfo">Enter the configuration for the <b>media providers</b> you want to use</p><br>' +
                '            <textarea cols="100" rows="20" class="valid" id="config_dl_providers">' + JSON.stringify(preferences.dl_providers, null, '\t') + '</textarea><br>Config will not be stored unless the border is green.<br><br>' +
                '        </div>' +
                '        <div id="h3subframe4" class="h3subframe">About &amp; Help</div>' +
                '        <div class="h3subframecontent">' +
                '            <p><b>' + GM.info.script.name + '</b> - version: ' + GM.info.script.version + '</p>' +
                '            <br />' +
                '            <p>' + GM.info.script.description + '</p><br>' +
                '            <p>Author: Mr. Invisible (mrinvisible@cryptolab.net) - original plugin by: XppX</p>' +
                '            <p>License: GPL</p><br><br>' +
                '            <p><b>In need of help</b>? Visit the script page on <a target="_blank" href="https://greasyfork.org/en/scripts/14722-seriesfeed">Greasyfork</a>.</p>' +
                '        </div>' +
                '    </div>' +
                '</div>';
            div = document.createElement("div");
            div.id = configElementName;
            div.setAttribute('style',
                'visibility: visible;position: fixed;width: 100%;height: 100%;top: 0;left: 0;font-size:12px;' +
                'z-index:1001;text-align:left;');
            div.innerHTML = html;
            document.body.appendChild(div);
            document.getElementById(configElementName + "_close").addEventListener("click", close, false);

            // Loop through checkboxes to populate them
            inputs = div.getElementsByTagName("input");
            for (idx = 0; idx < inputs.length; idx++) {
                if (inputs[idx].type === "checkbox") {
                    if (debug) {
                        window.console.log("Preference for " + inputs[idx].id);
                        window.console.log(preferences[inputs[idx].id]);
                    }
                    if (preferences.hasOwnProperty(inputs[idx].id) && preferences[inputs[idx].id]) {
                        inputs[idx].setAttribute("checked", "checked");
                    }
                    // Add a listener to each checkbox
                    inputs[idx].addEventListener("click", changeConfiguration, false);
                }
            }
            inputs = div.getElementsByTagName('textarea');
            for (idx = 0; idx < inputs.length; idx++) {
                // Add a listener to each text area
                inputs[idx].addEventListener("change", checkConfiguration, false);
                inputs[idx].addEventListener("keyup", checkConfiguration, false);
            }

            // Add event listeners for opening when a click on the head is performed
            subFrames = document.getElementsByClassName("h3subframe");
            for (idx = 0; idx < subFrames.length; idx++) {
                subFrames[idx].addEventListener("click", openSubConfig, false);
            }
            // Unfold the first one
            openSubConfig({
                target: document.getElementById('h3subframe1')
            });
        };
        close = function () {
            var box = document.getElementById(configElementName);
            box.parentNode.removeChild(box);
            window.location.reload(false);
        };
        closeOtherSubConfigs = function (evt) {
            var ignore, subFrames, idx;
            ignore = evt.target || evt.srcElement;
            subFrames = document.getElementsByClassName("h3subframe");
            for (idx = 0; idx < subFrames.length; idx++) {
                if (ignore !== subFrames[idx]) {
                    subFrames[idx].nextElementSibling.style.display = "none";
                    subFrames[idx].addEventListener("click", openSubConfig, false);
                }
            }
        };
        closeSubConfig = function (e) {
            var evt, target;

            evt = e || window.event;
            target = evt.target || evt.srcElement;
            target.removeEventListener("click", closeSubConfig, false);
            target.nextElementSibling.style.display = "none";
            target.addEventListener("click", openSubConfig, false);
        };
        openSubConfig = function (e) {
            var evt, target;

            evt = e || window.event;
            target = evt.target || evt.srcElement;
            target.removeEventListener("click", openSubConfig, false);
            target.nextElementSibling.style.display = "block";
            closeOtherSubConfigs(evt);
            target.addEventListener("click", closeSubConfig, false);
        };
        changeConfiguration = function (e) {
            if (e.target.tagName.toLowerCase() === 'input') {
                saveConfiguration(e.target.id, e.target.checked);
            }
        };
        checkConfiguration = function (e) {
            var json, idx;

            if (debug) {
                window.console.log('Entering checkConfiguration');
            }

            if (e.target.tagName.toLowerCase() === 'textarea' && e.target.id.indexOf("config_dl_") === 0) {
                e.target.classList.remove('valid');
                e.target.classList.add('invalid');
                try {
                    json = JSON.parse(e.target.value);
                    if ((e.target.id === "config_dl_quality" && !isValidQualityConfig(json)) ||
                        (e.target.id === "config_dl_providers" && !isValidProvidersConfig(json))) {
                        return;
                    }
                    e.target.classList.add('valid');
                    e.target.classList.remove('invalid');
                    saveConfiguration(e.target.id.replace("config_", ""), json);
                } catch (e) {
                    if (debug) {
                        window.console.log('Invalid JSON: '+ e);
                    }
                }
            }
        };
        isValidQualityConfig = function (json) {
            if (! Array.isArray(json)) {
                if (debug) {
                    window.console.log('Quality config is no array');
                }
                return false;
            }
            return true;
        };
        isValidProvidersConfig = function (json) {
            var idx;
            if (! Array.isArray(json)) {
                if (debug) {
                    window.console.log('Quality providers is no array');
                }
                return false;
            }
            for (idx = 0; idx < json.length; idx++) {
                if (!isValidProviderConfig(json[idx])) {
                    return false;
                }
            }
            return true;
        };
        isValidProviderConfig = function (json) {
            var idx;

            if (!json.hasOwnProperty('name') || !json.hasOwnProperty('url') || !json.hasOwnProperty('quality')) {
                if (debug) {
                    window.console.log('Provider config missing name, url or quality property.');
                }
                return false;
            }

            for (idx = 0; idx < preferences.dl_quality.length; idx++) {
                if(!json.quality.hasOwnProperty(preferences.dl_quality[idx])) {
                    if (debug) {
                        window.console.log('Provider config missing quality entry.');
                    }
                    return false;
                }
            }

            if (json.url.indexOf('{show}') === -1 || json.url.indexOf('{season_episode}') === -1 || json.url.indexOf('{quality}') === -1) {
                if (debug) {
                    window.console.log('Provider config url missing {show}, {season_episode} or {quality} section.');
                }
                return false;
            }

            if (json.hasOwnProperty('invalid_characters')) {
                if (! json.invalid_characters.hasOwnProperty('old') || ! json.invalid_characters.hasOwnProperty('new') ||
                    ! Array.isArray(json.invalid_characters.new) || ! Array.isArray(json.invalid_characters.old) ||
                    json.invalid_characters.new.length !== json.invalid_characters.old.length
                ) {
                    if (debug) {
                        window.console.log('Provider config invalid_characters not provided, no array or length not equal between old & new.');
                    }
                    return false;
                }
            }

            return true;
        };
        saveConfiguration = function (id, value) {
            if (preferences.hasOwnProperty(id)) {
                preferences[id] = value;
                (async () => { 
                   await GM.setValue(mapping[id], value);
                })();
                if (debug) {
                    window.console.log("Stored " + value + " for " + mapping[id]);
                }
            }
        };
        loadPreferences = function (callback) {          
            (async () => {
                var key;
                if (debug) {
                    window.console.log("Entering load preferences function");
                    window.console.log("Preferences (default):");
                    window.console.log(preferences);
                }
                for (key in mapping) {
                    if (mapping.hasOwnProperty(key) && preferences.hasOwnProperty(key)) {
                        if (debug) {
                            window.console.log("Retrieving " + key + "...");
                        }
                        preferences[key] = await GM.getValue(mapping[key], preferences[key]);
                        if (debug) {
                            window.console.log("retrieved " + preferences[key] + " for " + key);
                        }
                    }

                }

                if (debug) {
                    window.console.log("Preferences (loaded):");
                    window.console.log(preferences);
                }
                callback();
            })();
        };
        getConfigValue = function (name) {
            if (preferences.hasOwnProperty(name)) {
                return preferences[name];
            }
            return null;
        };
        getEnabledSubtitleLanguages = function () {
            var result = [];

            if (preferences.sub_lang_en) {
                result.push("en");
            }
            if (preferences.sub_lang_nl) {
                result.push("nl");
            }

            return result;
        };
        getEnabledSubtitleSources = function () {
            var result = [];

            if (preferences.sub_source_addic7ed) {
                result.push(subProviders.sub_source_addic7ed);
            }
            if (preferences.sub_source_podnapisi) {
                result.push(subProviders.sub_source_podnapisi);
            }
            if (preferences.sub_source_opensubtitles) {
                result.push(subProviders.sub_source_opensubtitles);
            }
            if (preferences.sub_source_subtitleseeker) {
                result.push(subProviders.sub_source_subtitleseeker);
            }

            return result;
        };
        getEnabledDownloadProviders = function () {
            return preferences.dl_providers;
        };
        getEnabledMediaQualities = function () {
            return preferences.dl_quality;
        };
        // Initialize object to return and expose appropriate methods
        instance = {};
        instance.show = show;
        instance.loadPreferences = loadPreferences;
        instance.getConfigValue = getConfigValue;
        instance.getEnabledSubtitleLanguages = getEnabledSubtitleLanguages;
        instance.getEnabledSubtitleSources = getEnabledSubtitleSources;
        instance.getEnabledDownloadProviders = getEnabledDownloadProviders;
        instance.getEnabledMediaQualities = getEnabledMediaQualities;

        return instance;
    }());
    // Initialize variables
    debug = true;
    // Maps short language keywords to the full English language
    languageMap = {
        "en": "English",
        "nl": "Dutch"
    };
    // Providers, keys of this MUST be equal to the ones in the configDialog.preferences variable
    subProviders = {
        sub_source_addic7ed: {
            title: "Addic7eD",
            createLink: function (showName, showEpisode, language) {
                var showNameConverted, showEpisodeConverted, languageConverted;
                // Convert show name & show episode to appropriate formats
                showNameConverted = this.showConversion(showName);
                showEpisodeConverted = this.episodeConversion(showEpisode);
                languageConverted = this.languageConversion(language);

                return "http://www.addic7ed.com/serie/" + showNameConverted + "/" + showEpisodeConverted.season + "/" +
                    showEpisodeConverted.episode + "/" + languageConverted;
            },
            showConversion: function (show) {
                var exceptions;

                show = show.replace(/ /g, "_");
                // Exception map for shows
                exceptions = {
                    "The_Flash": "The_Flash_(2014)",
                    "Legends_of_Tomorrow": "DC's_Legends_of_Tomorrow",
                    "Marvel's_Daredevil": "Daredevil"
                };
                if (exceptions.hasOwnProperty(show)) {
                    show = exceptions[show];
                }
                return show;
            },
            episodeConversion: function (episode) { return parseEpisode(episode); },
            languageConversion: function (language) {
                switch (language) {
                case "nl":
                    return "17";
                case "en":
                    return "1";
                }
                return language;
            }
        },
        sub_source_podnapisi: {
            title: "PodNapisi",
            createLink: function (showName, showEpisode, language) {
                var showNameConverted, showEpisodeConverted, languageConverted;
                // Convert show name & show episode to appropriate formats
                showNameConverted = this.showConversion(showName);
                showEpisodeConverted = this.episodeConversion(showEpisode);
                languageConverted = this.languageConversion(language);

                return "http://www.podnapisi.net/subtitles/search/advanced?keywords=" + showNameConverted + "&seasons="
                    + showEpisodeConverted.season + "&episodes=" + showEpisodeConverted.episode + "&language=" +
                    languageConverted;
            },
            showConversion: function (show) {
                var exceptions;

                show = show.replace(/ /g, "+");
                // Exception map for shows
                exceptions = {};
                if (exceptions.hasOwnProperty(show)) {
                    show = exceptions[show];
                }
                return show;
            },
            episodeConversion: function (episode) { return parseEpisode(episode); },
            languageConversion: function (language) { return language; }
        },
        sub_source_opensubtitles: {
            title: "OpenSubtitles",
            createLink: function (showName, showEpisode, language) {
                var showNameConverted, showEpisodeConverted, languageConverted;
                // Convert show name & show episode to appropriate formats
                showNameConverted = this.showConversion(showName);
                showEpisodeConverted = this.episodeConversion(showEpisode);
                languageConverted = this.languageConversion(language);

                return "http://www.openSubtitles.org/nl/search/searchonlytvseries-on/subformat-srt/sublanguageid-" +
                    languageConverted + "/season-" + showEpisodeConverted.season + "/episode-" +
                    showEpisodeConverted.episode + "/moviename-" + showNameConverted;
            },
            showConversion: function (show) {
                var exceptions;

                show = show.replace(/ /g, "+");
                // Exception map for shows
                exceptions = {};
                if (exceptions.hasOwnProperty(show)) {
                    show = exceptions[show];
                }
                return show;
            },
            episodeConversion: function (episode) { return parseEpisode(episode); },
            languageConversion: function (language) {
                switch (language) {
                case "nl":
                    return "dut";
                case "en":
                    return "eng";
                }
            }
        },
        sub_source_subtitleseeker: {
            title: "SubTitleSeeker",
            createLink: function (showName, showEpisode, language) {
                var showNameConverted, showEpisodeConverted, convertedLanguage;
                // Convert show name & show episode to appropriate formats
                showNameConverted = this.showConversion(showName);
                showEpisodeConverted = this.episodeConversion(showEpisode);
                convertedLanguage = this.languageConversion(language);
                if (debug) {
                    window.console.log("Language is not used for subTitleSeeker: " + convertedLanguage);
                }

                return "http://www.subtitleseeker.com/search/TV_EPISODES/" + showNameConverted + "+S" +
                    showEpisodeConverted.season + "E" + showEpisodeConverted.episode;
            },
            showConversion: function (show) {
                var exceptions;

                show = show.replace(/ /g, "+");
                // Exception map for shows
                exceptions = {};
                if (exceptions.hasOwnProperty(show)) {
                    show = exceptions[show];
                }
                return show;
            },
            episodeConversion: function (episode) { return parseEpisode(episode); },
            languageConversion: function (language) { return language; }
        }
    };
    // Flags
    flags = {
        "nl": "data:image/gif;base64,R0lGODlhEAALANUAAAABdP7+/jRusgAhj/picxZYp/UAAPLy8vr6+vj4+Pb29v56iVqKw/1da0V7ujpytSpmrusAAGSSx/pCUftUZP11gwAAR/96hgAAWe7v7yFgq0J3tw1Rokt/vAAAPFCCv1SFwS9qrtHR0fk8Tf6CkdXV1ftqevcxQvg3Rz52uPxMWvVWavZabv8VMflXaP5ZZ3eezv6XpC5qsvYsPPv7+/pQX/5/j/htfvlIV/T19fxwgPX19fz8/P0AAPT09P8AACH5BAAAAAAALAAAAAAQAAsAAAaFwJ/w1ysWDUhkJPJbLC6Vis5kIhAaLkqNeWk0XloVbjJCnWa4SCtGsjmltyqBtbpFDoE8j0dDIBIJCjs+OyUZenx+gII+Bzkih3t9f4GDBwc+IgMwDCAfHQ4bDwIhEBAaGxYAEg4pozKnGgUFHBwhHqsMnZ+hrgKkELgAwxjFxRbIHsoeQQA7",
        "en": "data:image/gif;base64,R0lGODlhEAALANUAAGNjtvr6+vb29fHx8fxGRvkQEP15eatjSuNjSjx6+TV0+f2Kd+np6dvb2PxUVPx4YttjSvsrK5q7/PxlZrpjSvw6Oubm5e7u7sljSgR09Z1jSvT080iB+gBMtkF9+vofHwBpu/f39uLi3/syMtVjSqG+/C9y+Ozs7KLA/GNlwPyBbO3t6gNx5QArs/2XhpGRgKysn+z+/rS0qPR0XuXl/P7KwcnJwf39Wzh3+f7+/fv/+vHx7wNv4df+/f3h3GNnxCH5BAAAAAAALAAAAAAQAAsAAAaMwJ/wl0oBjqoHYgmB/HIoXSkgoQYCoawA9kNxOJ5EAmcyTByEiouUmnoEiYspMxhcTreNrR1OKOYgaBUjEQsYAAEJAwonLCIddwwMFj0yABI4fzwgHS2DER8fCwciAQIbG3aRkxYNPi8qNWZoaRGgBbgqGg0BMVqoqTsrNBYiM0sITU0kGBQUBwca0kEAOw=="
    };
    // Page regexes
    pageRegexes = {
        // Seriesfeed homepage
        start: new RegExp("^/$"),
        // Broadcast schedule (format: series/schedule[/{month}]* )
        broadcast: new RegExp("^.*/series/schedule(/[a-z]+)*$"),
        // Watchlist (format: series/schedule/history[/topshows|/favorieten]*
        watch: new RegExp("^.*/series/schedule/history(/[topshows|favorieten]+)*$"),
        // Episodes/Seasons (format: series/{name}/episodes[/season/{nr}]* )
        season: new RegExp("^.*/series/(.+)/episodes(/season/[0-9]+)*$"),
        // Episode (format: series/episode/{nr}/ )
        episode: new RegExp("^.*/series/episode/[0-9]+$")
    };
    // Current page
    currentPage = null;

    // Initialize functions
    main = function () {
        var head, style;
        if (debug) {
            window.console.log("Entering main function");
        }
        // Load preferences
        configDialog.loadPreferences(function () {
            // Inject config menu item
            injectMenuItem();
            // Check page we're on
            checkPage();
            // If the page is still null at this point, we didn't identify the page.
            if (currentPage === null) {
                window.console.warn("Did not identify a page to run on. Not executing any more page alterations.");
                return;
            }
            // Inject some css
            head = document.getElementsByTagName('head')[0];
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = '.ui-front { z-index: 1000 !important; }';
            head.appendChild(style);
            // Modify the page
            modifyPage();
        });
    };
    checkPage = function () {
        var key, found;
        if (debug) {
            window.console.log("Entering checkPage function");
        }

        found = null;
        for (key in pageRegexes) {
            if (pageRegexes.hasOwnProperty(key)) {
                if (debug) {
                    window.console.log("Trying to match " + pageRegexes[key] + " to " + window.location.pathname);
                }
                if (pageRegexes[key].exec(window.location.pathname)) {
                    if (debug) {
                        window.console.log("Match found for " + key);
                    }
                    found = key;
                    break;
                }
            }
        }
        currentPage = found;
    };
    injectMenuItem = function () {
        var idx, links, li, menu, inject, injectLink;
        if (debug) {
            window.console.log("Entering injectMenuItem function");
        }
        // There are no id's used, so we'll hook on to some text contents in the page
        links = document.getElementsByTagName("a");
        for (idx = 0; idx < links.length; idx++) {
            if (links[idx].innerHTML === "Serie voorstellen") {
                // Might have a match, verify "menu" element above
                li = links[idx].parentNode;
                menu = li.parentNode;
                if (menu.classList.contains("main-menu-dropdown")) {
                    // We can assume safely that we're in a menu. Inject menu item
                    inject = document.createElement("li");
                    injectLink = document.createElement("a");
                    injectLink.style = "cursor: pointer;";
                    injectLink.innerHTML = "Seriesfeed++ configureren";
                    injectLink.addEventListener("click", configDialog.show, false);
                    inject.appendChild(injectLink);
                    menu.appendChild(inject);
                }
            }
        }
    };
    modifyPage = function () {
        if (debug) {
            window.console.log("Entering modifyPage function");
        }
        // Depending on the type of the page, we need to render differently
        switch (currentPage) {
        case "start":
            handleStartPage();
            break;
        case "broadcast":
            handleBroadcastPage();
            break;
        case "watch":
            handleWatchlistPage();
            break;
        case "season":
            handleSeasonPage();
            break;
        case "episode":
            handleEpisodePage();
            break;
        default:
            window.console.warn("Did not identify a page to run on. Not executing any more page alterations.");
        }
        // Append css for jquery UI
        $("head").append('<link href="//code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css"' +
            ' rel="stylesheet" type="text/css">');
    };
    // Page specific modifications
    handleStartPage = function () {
        if (debug) {
            window.console.log("Entering handleStartPage function");
        }
        // There is one table of interest: latest favourites. As of 1.3 it can be missing if there's no episodes
        injectDefaultTable("favourite_episodes");
    };
    handleBroadcastPage = function () {
        if (debug) {
            window.console.log("Entering handleBroadcastPage function");
        }
        // Single table: broadcasted episodes
        injectDefaultTable("afleveringen");
    };
    handleWatchlistPage = function () {
        if (debug) {
            window.console.log("Entering handleWatchlistPage function");
        }
        // Single table: favourites/popular episodes
        injectDefaultTable("afleveringen");
    };
    handleSeasonPage = function () {
        var table, showName;
        if (debug) {
            window.console.log("Entering handleSeasonPage function");
        }
        // Get show name
        showName = document.getElementById('seriesName').value;

        // Single table: show episodes
        table = $("#afleveringen");
        // Inject element for header
        injectTableHeader("afleveringen");
        // Inject icons in rows
        table.find("tbody tr[data-aired]").each(function (idx, elm) {
            var td, cells, showEpisode;
            if (debug) {
                window.console.log("Processing row " + idx);
            }
            td = document.createElement("td");
            cells = elm.getElementsByTagName("td");
            showEpisode = cells[0].firstElementChild.innerHTML;
            td.appendChild(createFunctionality(showName, showEpisode));
            elm.appendChild(td);
        });
    };
    handleEpisodePage = function () {
        var table, row, cell, data, showName, showEpisode, banner, episodeTitle;

        if (debug) {
            window.console.log("Entering handleEpisodePage function");
        }
        // Need to inject new row instead of cell
        banner = $('.showBanner').find('img');
        table = $("#episodeInfo");
        episodeTitle = table.siblings('h3').html();
        data = episodeTitle.match(/(.*) - (.*)/);
        showName = banner.attr('title').replace('Banner voor ','');
        showEpisode = data[0];
        // Inject
        row = document.createElement('tr');
        cell = document.createElement('td');
        cell.innerHTML = 'Seriesfeed++';
        row.appendChild(cell);
        cell = document.createElement('td');
        cell.appendChild(createFunctionality(showName, showEpisode));
        row.appendChild(cell);
        table.find("tbody").append(row);
    };
    // General modification methods
    injectTableHeader = function (tableId) {
        var table, th;
        if (debug) {
            window.console.log("Entering injectTableHeader function");
        }

        table = $("#" + tableId);
        // Inject element for header
        th = document.createElement("th");
        th.innerHTML = "Seriesfeed++";
        table.find("thead tr")[0].appendChild(th);
    };
    injectDefaultTable = function (tableId) {
        var table, colspan, readMore;
        if (debug) {
            window.console.log("Entering injectDefaultTable function");
        }

        table = $("#" + tableId);
        // Check if element actually exists
        if (table.length === 0) {
            if (debug) {
                window.console.log("Did not find a table with the id: " + tableId);
            }
            return;
        }
        // Inject element for header
        injectTableHeader(tableId);
        // Inject icons in rows
        table.find("tbody tr").not('.readMore').each(function (idx, elm) {
            var td, cells, showName, showEpisode;
            if (debug) {
                window.console.log("Processing row" + idx);
            }
            if ($(elm).attr('data-aired') === undefined) {
                if (debug) {
                    window.console.log("Skipping row because it has no data-aired attribute");
                }
                return;
            }
            td = document.createElement("td");
            cells = elm.getElementsByTagName("td");
            showName = cells[0].firstElementChild.innerHTML;
            showEpisode = cells[1].firstElementChild.innerHTML;
            td.appendChild(createFunctionality(showName, showEpisode));
            elm.appendChild(td);
        });
        readMore = table.find("tbody tr.readMore td");
        colspan = parseInt(readMore.attr("colspan"), 10);
        readMore.attr('colspan', colspan + 1);
    };
    createFunctionality = function (showName, showEpisode) {
        var span, languages, idx, downloadProviders, downloadTypes, downloadIcon;
        if(debug){
            window.console.log(
                "Entering createFunctionality with parameters: showName: "+showName+", showEpisode: "+showEpisode);
        }

        span = document.createElement("span");
        // Add language flags
        languages = configDialog.getEnabledSubtitleLanguages();
        for (idx = 0; idx < languages.length; idx++) {
            span.appendChild(createLanguageFlag(languages[idx], showName, showEpisode));
            span.appendChild(document.createTextNode(" "));
        }
        downloadProviders = configDialog.getEnabledDownloadProviders();
        downloadTypes = configDialog.getEnabledMediaQualities();
        if (downloadProviders.length > 0 && downloadTypes.length > 0) {
            downloadIcon = document.createElement("i");
            downloadIcon.setAttribute('class','fa fa-download');
            downloadIcon.setAttribute('style', 'display:inline-block; font-size: 19px; cursor: pointer;');
            downloadIcon.title = "download episode";
            downloadIcon.addEventListener("click", showDlSelectionDialog);

            span.appendChild(downloadIcon);
        }
        return span;
    };
    createLanguageFlag = function (lang, showName, showEpisode) {
        var result, img, subSources;
        if(debug){
            window.console.log(
                "Entering createLanguageFlag with parameters: lang: " + lang + ", showName: " + showName +
                ", showEpisode: " + showEpisode);
        }

        if (!flags.hasOwnProperty(lang)) {
            throw new Error(lang + "is not a recognized language flag!");
        }

        img = document.createElement("img");
        img.src = flags[lang];
        img.alt = lang + " flag";
        img.title = languageMap[lang] + " subtitles";
        img.setAttribute("data-language", lang);
        img.setAttribute('style', 'height: 16px; vertical-align:top; cursor: pointer;');
        // If there's just one subtitle source, make it a link, otherwise make it a pop-up menu
        subSources = configDialog.getEnabledSubtitleSources();
        if (subSources.length > 1) {
            img.addEventListener("click", showSubSelectionDialog, false);
            result = img;
        } else {
            result = document.createElement("a");
            result.href = subSources[0].createLink(showName, showEpisode, lang);
            result.target = "_blank";
            result.appendChild(img);
        }

        return result;
    };
    showSubSelectionDialog = function (e) {
        var evt, target, dialog, subSources, row, showName, showEpisode, lang, cells, idx, link, p, thead, data;

        if (debug) {
            window.console.log("Entering showSubSelectionDialog - currentPage: " + currentPage);
        }

        evt = e || window.event;
        target = evt.target || evt.srcElement;

        // Get language
        lang = target.getAttribute("data-language");
        // Get row, so we can extract show name & episode
        row = target.parentNode.parentNode.parentNode;
        cells = row.getElementsByTagName("td");
        if(currentPage === "season"){
            showName = document.getElementById('seriesName').value;
            showEpisode = cells[0].firstElementChild.innerHTML;
        } else if(currentPage === "episode") {
            showName = document.getElementById('seriesName').value;
            showEpisode = $("#episodeInfo").prev("h3").html().trim();
        } else {
            showName = cells[0].firstElementChild.innerHTML;
            showEpisode = cells[1].firstElementChild.innerHTML;
        }
      
        if (debug) {
            window.console.log("Retrieved next name & episode: " + showName + " - " + showEpisode);
        }

        // Build dialog
        dialog = document.createElement("div");
        p = document.createElement("p");
        p.innerHTML = "Show: " + showName + "<br/>Episode: " + showEpisode;
        dialog.appendChild(p);
        p = document.createElement("p");
        // Get sub source sites
        subSources = configDialog.getEnabledSubtitleSources();
        for (idx = 0; idx < subSources.length; idx++) {
            link = document.createElement("a");
            link.target = "_blank";
            link.href = subSources[idx].createLink(showName, showEpisode, lang);
            link.innerHTML = subSources[idx].title;
            link.setAttribute("style","text-decoration: underline;");
            link.addEventListener("click", function () {
                $(dialog).dialog("close");
            }, false);
            p.appendChild(link);
            p.appendChild(document.createTextNode(" "));
        }
        dialog.appendChild(p);
        $(dialog).dialog({
            title: "Download " + languageMap[lang] + " subtitles",
            position: { my: "right bottom", at: "top left", of: target }
        });
    };
    showDlSelectionDialog = function (e) {
        var evt, target, dialog, row, cells, showName, showEpisode, p, mediaQuality, mediaProviders, idx, jdx,
            table_head, data, providers, banner, episodeTitle, table;

        evt = e || window.event;
        target = evt.target || evt.srcElement;

        // Get row, so we can extract show name & episode
        row = target.parentNode.parentNode.parentNode;
        cells = row.getElementsByTagName("td");
        if(currentPage === "season") {
            showName = document.getElementById('seriesName').value;
            showEpisode = cells[0].firstElementChild.innerHTML;
        } else if(currentPage === "episode") {
			banner = $('.showBanner').find('img');
			table = $("#episodeInfo");
			episodeTitle = table.siblings('h3').html();
			data = episodeTitle.match(/(.*) - (.*)/);
			showName = banner.attr('title').replace('Banner voor ','');
			showEpisode = data[0];
        } else {
            showName = cells[0].firstElementChild.innerHTML;
            showEpisode = cells[1].firstElementChild.innerHTML;
        }

        dialog = document.createElement("div");
        p = document.createElement("p");
        p.innerHTML = "Show: " + showName + "<br/>Episode: " + showEpisode;
        dialog.appendChild(p);
        p = document.createElement("p");
        // Get types & sites
        mediaProviders = configDialog.getEnabledDownloadProviders();
        mediaQuality = configDialog.getEnabledMediaQualities();
        providers = mediaProviders.length;
        for (idx = 0; idx < mediaQuality.length; idx++) {
            p = document.createElement("p");
            p.appendChild(document.createTextNode(mediaQuality[idx]));
            dialog.appendChild(p);
            p = document.createElement("p");
            for (jdx = 0; jdx < providers; jdx++) {
                if(mediaProviders[jdx].quality.hasOwnProperty(mediaQuality[idx])) {
                    p.appendChild(createMediaLink(mediaProviders[jdx], showName, showEpisode, mediaQuality[idx], dialog));
                    if(jdx < providers - 1) {
                        p.appendChild(document.createTextNode(", "));
                    }
                }
            }
            dialog.appendChild(p);
        }

        $(dialog).dialog({
            title: "Download episode",
            position: { my: "right bottom", at: "top left", of: target }
        });
    };
    // Helper functions
    parseEpisode = function (showEpisode) {
        var result, regex, match;
        if (debug) {
            window.console.log("Entering parseEpisode function");
        }

        result = {
            season: 0,
            episode: 0,
            title: ""
        };
        regex = new RegExp("S([0-9]+)E([0-9]+) - (.+)");
        // Epected format: SxEy - episode title
        match = regex.exec(showEpisode);
        if (match !== null) {
            result.season = parseInt(match[1], 10);
            result.episode = parseInt(match[2], 10);
            result.title = match[3];
        } else {
            window.console.warn("Could not parse " + showEpisode + " correctly!");
        }
        return result;
    };
    createMediaLink = function (mediaProviderConfig, showName, showEpisode, mediaType, dialog) {
        var a, idx, episodeData, closeDialog, quality;

        quality = mediaProviderConfig.quality[mediaType];
        if (mediaProviderConfig.hasOwnProperty('invalid_characters')) {
            for (idx = 0; idx < mediaProviderConfig.invalid_characters.old.length; idx++) {
                showName = showName.replace(
                    mediaProviderConfig.invalid_characters.old[idx],
                    mediaProviderConfig.invalid_characters.new[idx]
                );
                quality = quality.replace(
                    mediaProviderConfig.invalid_characters.old[idx],
                    mediaProviderConfig.invalid_characters.new[idx]
                );
            }
        }
        episodeData = parseEpisode(showEpisode);
        if (mediaProviderConfig.hasOwnProperty('episodeCharacter')){
            showEpisode = formatToConvention(episodeData, mediaProviderConfig.episodeCharacter);
        } else {
            showEpisode = formatToConvention(episodeData);
        }


        closeDialog = function () {
            $(dialog).dialog("close");
        };
        a = document.createElement("a");
        a.href = mediaProviderConfig.url.replace('{show}', encodeURIComponent(showName)).replace('{season_episode}', encodeURIComponent(showEpisode)).replace('{quality}', encodeURIComponent(quality));
        a.target = "_blank";
        a.innerHTML = mediaProviderConfig.name;
        a.setAttribute("style","text-decoration: underline;");
        a.addEventListener("mouseup", closeDialog, false);

        return a;
    };
    formatToConvention = function (episodeData, episodeCharacter) {
        episodeCharacter = episodeCharacter || "E";
        return "S" + ((episodeData.season < 10) ? "0" : "") + episodeData.season + episodeCharacter +
            ((episodeData.episode < 10) ? "0" : "") + episodeData.episode;
    };

    // Expose methods to the outside world
    seriesFeedPlusPlus.main = main;

    return seriesFeedPlusPlus;
}());

// Execute main
try {
    seriesFeedPlusPlus.main();
} catch (e) {
    console.log(e);
    console.log(e.stack);
    // Display error
    var txt = "An error occurred while executing this script.\n\n";
    txt += "Issue: <<<" + e.message + ">>>\n\n";
    txt += "\nPlease report this back to the author (on the greasyfork website, or by sending me an email at mrinvisible@cryptolab.net) so it can be corrected.\n\n";
    txt += "Click 'OK' to continue.\n\n";
    window.alert(txt);
}