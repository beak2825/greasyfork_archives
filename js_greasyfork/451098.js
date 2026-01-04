// ==UserScript==
// @name         Get Booru Tags
// @namespace    https://github.com/onusai/
// @version      0.4.8
// @description  Press the [~] tilde key under ESC to open a prompt with all tags
// @author       Onusai#6441
// @match        https://gelbooru.com/index.php?page=post&s=view*
// @match        https://safebooru.donmai.us/posts/*
// @match        https://danbooru.donmai.us/posts/*
// @match        https://aibooru.online/posts/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451098/Get%20Booru%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/451098/Get%20Booru%20Tags.meta.js
// ==/UserScript==

// todo: add support for safebooru.org/index.php?page=post&s=view* and realbooru.com

(function() {
    'use strict';

    // edit to change default behavior
    let include_commas = true;          // seperate each tag with a comma
    let remove_underscores = true;      // replace underscores with spaces
    let remove_parentheses = false;     // remove parentheses from tags
    let randomize_tag_order = false;    // randomizes tags within each group, group order stays the same
    let escape_colons = false;          // escapes colons, usually has no impact

    // edit to change tag group order or remove certain groups completely
    let tag_group_order = ["character", "general", "artist", "copyright"]; // "metadata"

    // edit to change hotkeys
    let hotkey_default = '`';
    let hotkey_1 = '1'; // randomize tags


    function randomize_tags(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let keysPressed = {};

    $(document).on('keyup', (event) => {
        if (event.key == hotkey_default) show_prompt(randomize_tag_order);
    });

    $(document).on('keydown', (event) => {
        keysPressed[event.key] = true;
        if (!keysPressed[hotkey_default]) return;
        if (event.key == hotkey_1) show_prompt(true);
    })


    function show_prompt(randomize=false) {
        for (var member in keysPressed) delete keysPressed[member];

        let tags = null;
        let url = window.location.href;
        if (url.includes("/gelbooru.com"))tags = get_gel_tags(randomize);
        else if (url.includes("/danbooru.donmai.us") || url.includes("/safebooru.donmai.us") || url.includes("/aibooru.online")) tags = get_dan_tags(randomize);
        if (!tags) return;

        let tag_count = tags.length;

        for (var i = 0; i < tag_count; i++) {
            if (remove_underscores) tags[i] = tags[i].replaceAll("_", " ");
            else tags[i] = tags[i].replaceAll(" ", "_");
        }

        tags = tags.join(", ");
        if (!include_commas) tags = tags.replaceAll(",", "");
        if (escape_colons) tags = tags.replaceAll(":", ":\\");
        if (remove_parentheses) tags = tags.replaceAll("(", "").replaceAll(")", "");
        else tags = tags.replaceAll("(", "\\(").replaceAll(")", "\\)");

        prompt("Prompt: " + tag_count + " tags", tags);
    }


    function get_gel_tags(randomize=false) {
        let tags = [];
        for (let group of tag_group_order) {
            let group_tags = [];
            for (let e of document.getElementsByClassName("tag-type-"+group)) group_tags.push(e.children[1].textContent);
            if (randomize) randomize_tags(group_tags);
            tags = tags.concat(group_tags);
        }
        return tags;
    }


    function get_dan_tags(randomize=false) {
        let tags = [];
        for (let group of tag_group_order) {
            group = ((group == "metadata") ? "meta" : group);
            let group_tags = [];
            for (let e of document.getElementsByClassName(group+"-tag-list")) {
                if (e.tagName != "UL") continue;
                for (let te of e.getElementsByClassName("search-tag")) group_tags.push(te.textContent);
            }
            if (randomize) randomize_tags(group_tags);
            tags = tags.concat(group_tags);
        }
        return tags;
    }

})();