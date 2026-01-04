// ==UserScript==
// @name         Get Booru Tags
// @namespace    https://github.com/onusai/
// @version      0.1
// @description  Press the [`] tilde key under ESC to open a prompt with all tags
// @author       Onusai#6441
// @match        https://gelbooru.com/index.php?page=post&s=view&id=*
// @match        https://danbooru.donmai.us/posts/*
// @match        http://dev.kanotype.net:8003/deepdanbooru/*
// @match        https://chan.sankakucomplex.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452823/Get%20Booru%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/452823/Get%20Booru%20Tags.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hot_key = "`"; // edit to change hotkey
    let remove_commas = false; // set to false to include commas
    let remove_underscores = true; // set to false to include underscore
    let remove_parentheses = true; // set to false to include parentheses

    document.addEventListener('keydown', function(event) {
        if (event.key == hot_key) {
            let tags = null;
            if (window.location.href.includes("/gelbooru.com")) tags = get_gel_tags();
            else if (window.location.href.includes("/danbooru.donmai.us")) tags = get_dan_tags();
            else if (window.location.href.includes("deepdanbooru")) tags = get_deepdan_tags();
            else if (window.location.href.includes("sankakucomplex")) tags = get_sankakucomplex_tags();
            if (tags != null) {
                for (var i = 0; i < tags.length; i++) {
                    if (remove_underscores) tags[i] = tags[i].replace("_", " ");
                    else tags[i] = tags[i].replace(" ", "_");
                }
                let fprompt = tags.join(", ");
                if (remove_commas) fprompt = fprompt.replaceAll(",", "");
                if (remove_parentheses) fprompt = fprompt.replaceAll("(", "").replaceAll(")", "")
                prompt("Prompt: " + tags.length + " tags\nTo check token length go to: https://beta.openai.com/tokenizer", fprompt);
            }
        }
    });

    function get_gel_tags() {
        let elms = ["tag-type-general", "tag-type-character", "tag-type-metadata", "tag-type-artist", "tag-type-copyright"];
        let iprompt = [];
        elms.forEach(tag => {
            Array.from(document.getElementsByClassName(tag)).forEach(e => {
                iprompt.push(e.children[1].textContent);
            })
        });
        return iprompt;
    }

    function get_dan_tags() {
        let elms = ["general-tag-list", "character-tag-list", "meta-tag-list", "artist-tag-list", "copyright-tag-list"];
        let iprompt = [];
        elms.forEach(tag => {
            Array.from(document.getElementsByClassName(tag)).forEach(e => {
                if (e.tagName == "UL") {
                    Array.from(e.getElementsByClassName("search-tag")).forEach(s => {
                        iprompt.push(s.textContent);
                    })
                }
            })
        });
        return iprompt;
    }
    function get_deepdan_tags() {
        var threshold = 0.7;
        let iprompt = [];
        $('table').find('tbody:not(:last)').find('tr').each(function(_){
            if($(this).find('td').eq(1).text() > threshold){
                iprompt.push($(this).find('td').first().text());
            }
        })
        return iprompt;
    }
     function get_sankakucomplex_tags() {
        let elms = ["image-link"];
        let iprompt = [];
        var img = document.getElementById("image-link").children[0];
        iprompt.push(img.alt);
        return iprompt;
    }
})();