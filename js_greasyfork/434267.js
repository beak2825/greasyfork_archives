// ==UserScript==
// @name         Zendesk Tag Comparison
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  Generates a more human readable tag comparison in the events menu.
// @author       You
// @match        https://*.zendesk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434267/Zendesk%20Tag%20Comparison.user.js
// @updateURL https://update.greasyfork.org/scripts/434267/Zendesk%20Tag%20Comparison.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function compareTags(previous_tags_string, current_tags_string) {
        let previous_tags = previous_tags_string.split(" ");
        let current_tags = current_tags_string.split(" ");

        let matching_tags = new Set();

        let new_tags = new Set();
        let lost_tags = new Set();

        if (previous_tags_string != "" && current_tags_string != "") {
            for (const previous_tag of previous_tags) {
                for (const current_tag of current_tags) {
                    if (previous_tag == current_tag) {
                        matching_tags.add(previous_tag);
                    }
                }
            }

            for (const current_tag of current_tags) {
                if (!matching_tags.has(current_tag)) {
                    new_tags.add(current_tag);
                }
            }

            for (const previous_tag of previous_tags) {
                if (!matching_tags.has(previous_tag)) {
                    lost_tags.add(previous_tag);
                }
            }
        }

        return {
            matching: matching_tags,
            new: new_tags,
            lost: lost_tags
        }
    }

    function replaceTags() {
        let xpath = "//li[@class='Change']/div/label[text()='Tags']/..";
        let result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);

        let found_node;
        let found_nodes = [];
        while (found_node = result.iterateNext()) {
            found_nodes.push(found_node);
        }

        for (let node of found_nodes) {
            let previous_tags = node.childNodes[9].innerText;
            let current_tags = node.childNodes[3].textContent;

            let comparison_data = compareTags(previous_tags, current_tags);
            let save_via = node.querySelector(".via");

            node.innerHTML = "<label>Tag Changes</label>";

            for (const tag of comparison_data.new) {
                node.innerHTML += "<div style=\"color:green;\">➕ " + tag + "</div>";
            }

            for (const tag of comparison_data.lost) {
                node.innerHTML += "<div style=\"color:red;\">➖ " + tag + "</div>";
            }
            node.innerHTML += "<div>" + current_tags + "</div>";
            node.innerHTML += "<div><del>" + previous_tags + "</del></div>";

            node.appendChild(save_via);
        }
    }

    setInterval(replaceTags, 1000);
})();