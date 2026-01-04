// ==UserScript==
// @name         Discord custom nicknames
// @namespace    https://github.com/aspiers/Discord-custom-nicks-userscript
// @version      0.3.3
// @description  Assign custom nicknames to Discord usernames client-side
// @author       Adam Spiers
// @license      GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @match        https://discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?domain=discord.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @resource     jQueryUI-css https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/vader/jquery-ui.min.css
// @resource     jQueryUI-icon1 https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/vader/images/ui-icons_666666_256x240.png
// @resource     jQueryUI-icon2 https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/vader/images/ui-icons_bbbbbb_256x240.png
// @resource     jqueryUI-icon3 https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/vader/images/ui-icons_c98000_256x240.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_info
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/428588/Discord%20custom%20nicknames.user.js
// @updateURL https://update.greasyfork.org/scripts/428588/Discord%20custom%20nicknames.meta.js
// ==/UserScript==
//
// Browser userscript to assign custom names to Discord nicknames
// Copyright (C) 2021 Adam Spiers <userscripts@adamspiers.org>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// Stop JSHint in Tampermonkey's CodeMirror editor from complaining
// about globals imported via @require:
// https://jshint.com/docs/#inline-configuration
/* globals jQuery waitForKeyElements */

(function() {
    'use strict';
    let $ = jQuery;
    unsafeWindow.jQuery = jQuery;

    // Don't replace more often than this number of milliseconds.
    const DEBOUNCE_MS = 2000;

    const ELEMENT_PREFIX = "Discord-custom-nicknames-";
    const DIALOG_ID = ELEMENT_PREFIX + "dialog";
    const TEXTAREA_ID = ELEMENT_PREFIX + "textarea";
    const DIALOG_SELECTOR = "#" + DIALOG_ID;
    const TEXTAREA_SELECTOR = "#" + TEXTAREA_ID;

    const ORIG_ATTR = "data-Discord-orig-nickname";
    const STORAGE = "Discord_custom_nicknames_mapping";

    function get_nick_map_str() {
        let map_str = GM_getValue(STORAGE);
        return typeof(map_str) == "string" ? map_str : "";
    }
    unsafeWindow.get_nick_map_str = get_nick_map_str;

    function set_nick_map_str(new_value) {
        GM_setValue(STORAGE, new_value);
    }
    unsafeWindow.set_nick_map_str = set_nick_map_str;

    function get_nick_map() {
        return parse_map(get_nick_map_str());
    }
    unsafeWindow.get_nick_map = get_nick_map;

    // function serialise_map(map_obj) {
    //     return Object.entries(map_obj).map(e => e[0] + "=" + e[1]).join("\n");
    // }

    function parse_map(map_str) {
        let map_obj = {};
        for (const pair of map_str.split("\n")) {
            if (pair.indexOf("=") != -1) {
                let [k, v] = pair.split("=");
                map_obj[k] = v;
            }
        }
        return map_obj;
    }
    window.parse_map = parse_map;

    const PREFIX = "[Discord custom nicknames]";

    function debug(...args) {
        console.debug(PREFIX, ...args);
    }

    function log(...args) {
        console.log(PREFIX, ...args);
    }

    function replace_nick(nick_map, element) {
        // debug("replace", element);
        let orig_nick = element.getAttribute(ORIG_ATTR);
        let Discord_nick = orig_nick || element.innerText;
        let at = "";
        if (Discord_nick.startsWith("@")) {
            at = "@";
            Discord_nick = Discord_nick.slice(1);
        }
        let mapped_name = nick_map[Discord_nick];
        if (mapped_name) {
            mapped_name = at + mapped_name;
            debug(`${at}${Discord_nick} -> ${mapped_name}`);
            if (!orig_nick && element.tagName !== "TITLE") {
                // Back up the original to an attribute so that we can remap later
                // without reloading the page.
                //
                // FIXME: Figure out a way to make this work
                // flawlessly for <title>.  Currently it's slightly
                // broken because <title> can change values when
                // switching between DM pages, so we can't back up
                // the original username to an attribute on it.
                element.setAttribute(ORIG_ATTR, element.innerText)
            }
            element.innerText = mapped_name;
        }
        else {
            // debug(`no mapping found for ${element.innerText}`);
            // This is required in case a nick mapping is removed:
            if (orig_nick) {
                element.innerText = orig_nick;
            }
        }
    }

    function replace_css_elements(nick_map, query) {
        let matches = jQuery(query);
        // debug(`replacing ${query}`, matches);
        if (matches && matches.each) {
            matches.each((i, elt) => replace_nick(nick_map, elt));
        }
    }

    function replace_all() {
        debug("replace_all()");
        let nick_map = get_nick_map();
        debug("parsed:", nick_map);

        for (let selector of CSS_SELECTORS) {
            replace_css_elements(nick_map, selector);
        }
    }

    function dialog_html() {
        return `
            <div id="${DIALOG_ID}" title="Discord custom nicknames">
              <p>
                  Enter your mappings here, one on each line.
              </p>
              <textarea rows="10" cols="50" id="${TEXTAREA_ID}"
                        placeholder="nickname=Real Name"></textarea>
              <p>
                  Each mapping should look something like
              </p>
              <pre><code>nickname=Firstname Lastname</code></pre>
              <p>
                  where the left-hand side of the <code>=</code>
                  sign is the normal Discord nickname (excluding
                  the <code>#1234</code> suffix), and the
                  right-hand side is what you want to see instead.
              </p>
            </div>
        `;
    }

    function handle_dialog_save(dialog) {
        let map_str = $(TEXTAREA_SELECTOR).val();
        debug(`${TEXTAREA_SELECTOR} dialog save:`, map_str);
        GM_setValue(STORAGE, map_str || "");
        replace_all();
        $(dialog).dialog("close");
    }

    function handle_dialog_open(dialog) {
        let orig = get_nick_map_str();
        debug(`restoring ${TEXTAREA_SELECTOR} to`, orig);
        $(TEXTAREA_SELECTOR).val(orig);
    }

    unsafeWindow.GM_info = GM_info;

    function insert_CSS() {
        let CSS = GM_getResourceText("jQueryUI-css");
        for (let resource of GM_info.script.resources) {
            let image = resource.url.match(/images\/.+\.png/);
            if (!image) {
                continue;
            }
            let URL = GM_getResourceURL(resource.name);
            let rel_path = image[0];
            CSS = CSS.replaceAll(
                `url("${rel_path}")`,
                `url("${URL}")`,
            );
        }
        GM_addStyle(CSS);
    }

    function insert_dialog() {
        $("body").append(dialog_html());
        $(TEXTAREA_SELECTOR).val(get_nick_map_str());

        $(DIALOG_SELECTOR).dialog({
            minWidth: 300,
            width: 700,
            maxWidth: 300,
            buttons: [
                {
                    text: "Save",
                    click: function() {
                        handle_dialog_save(this);
                    }
                },
                {
                    text: "Cancel",
                    click: function() {
                        $(this).dialog("close");
                    }
                }
            ],
            open: handle_dialog_open,
        });
    }

    function display_dialog() {
        if ($(DIALOG_SELECTOR).length == 0) {
            insert_CSS();
            insert_dialog();
        }
        $(DIALOG_SELECTOR).dialog("open");
    }

    GM_registerMenuCommand("Nickname mapping", display_dialog);

    const CSS_SELECTORS = [
        "title",

        /////////////////////////////////////////////////////////
        // Channel pages

        // User list on right-hand side
        "div[class^=membersWrap] span[class^=roleColor]",

        // Attributions in main chat pane
        "span[class^=headerText] span[class^=username]",

        // Mentions within messages
        "div[class*=messageContent] span.mention",

        // When replying, name of user we're replying to
        "div[class^=replyBar] span[class^=name]",

        /////////////////////////////////////////////////////////
        // DM pages

        // DM list in left bar
        "div#private-channels div[class^=nameAndDecorators]",

        // Main friends list when "Friends" is clicked on
        "div[class^=peopleList] div[class^=userInfo] span[class^=username]",

        // Top of individual DM page
        "div[class^=chat] section[class^=title] h3[class*=title]",

        // h3 under individual DM large avatar
        "div[id^=chat-messages] h3[class^=header]"

        // N.B. deliberately not replacing
        //
        // "This is the beginning of your direct message history with"
        //
        // because that's a useful place to show the mapping with
        // the original username.
    ];

    function init() {
        let lastWaited = {};
        let nick_map = get_nick_map();
        for (let selector of CSS_SELECTORS) {
            waitForKeyElements(
                selector,
                () => {
                    debug("waitForKeyElements triggered for", selector);
                    let last = lastWaited[selector];
                    if (!last || (new Date() - last > DEBOUNCE_MS)) {
                        replace_css_elements(nick_map, selector);
                        lastWaited[selector] = new Date();
                    }
                }
            );
        }
        setInterval(replace_all, 5000);
    }

    init();
})();
