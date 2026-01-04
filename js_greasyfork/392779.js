// ==UserScript==
// @name         AO3: Blurb Chapter Index Links
// @namespace    ao3-flash
// @version      1.0
// @description  Adds a clickable link to the "Chapters:" text in the story blurb, its target the story's chapter index/navigation.
// @author       flash
// @match        https://archiveofourown.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392779/AO3%3A%20Blurb%20Chapter%20Index%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/392779/AO3%3A%20Blurb%20Chapter%20Index%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var AO3 = {
        "listTypes": [ "work", "bookmark" ],

        "findStoryLists": function() {
            var ret_val = [];
            AO3.listTypes.forEach(function(listType) {
                var el_list = document.querySelector("ol." + listType);
                if(el_list) ret_val.push(el_list);
            });

            return ret_val;
        },

        "iterateStoryList": function(story_list) {
            if(!(story_list && story_list.nodeType === 1)) return;

            story_list.querySelectorAll("li.blurb").forEach(function(story_blurb) {
                AO3.modifyStoryBlurb(story_blurb);
            });
        },

        "modifyStoryBlurb": function(story_blurb) {
            if(!(story_blurb && story_blurb.nodeType === 1)) return;

            var e_dt = story_blurb.querySelector("dt.chapters");
            var story_id = AO3.getStoryIDfromBlurb(story_blurb);
            if(e_dt && story_id) {
                e_dt.innerHTML = '<a href="/works/' + story_id + '/navigate">Chapters:</a>';
            }
        },

        "getStoryIDfromBlurb": function(story_blurb) {
            if(!(story_blurb && story_blurb.nodeType === 1)) return;

            var el_href = story_blurb.querySelector("h4.heading > a");
            var ret_val = false;
            if(el_href) ret_val = el_href.href.substring(el_href.href.lastIndexOf("/") + 1);

            return ret_val;
        },

        "start": function() {
            AO3.findStoryLists().forEach(function(story_list) {
                console.log("story_list:");
                console.log(story_list);
                AO3.iterateStoryList(story_list);
            });
        }
    };

    AO3.start();

})();