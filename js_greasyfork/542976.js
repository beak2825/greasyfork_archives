// ==UserScript==
// @name         AO3: [Wrangling] To the bins!
// @namespace    N/A
// @version      1.0
// @description  Add links at the top of tag landing pages to the associated tag's bin(s).
// @author       Cascade
// @match        *://*.archiveofourown.org/tags/*
// @exclude      /^https?:\/\/.*\.?archiveofourown\.org\/tags\/[^\/]*\/.+/
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/542976/AO3%3A%20%5BWrangling%5D%20To%20the%20bins%21.user.js
// @updateURL https://update.greasyfork.org/scripts/542976/AO3%3A%20%5BWrangling%5D%20To%20the%20bins%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class BinPageButton {
        static construct_bin_url() {
            var current_page = window.location.href;
            return `${current_page}/wrangle`;
        }

        static add_nav_button() {
            var nav_node = document.querySelector("div.primary.header.module > ul.navigation.actions");
            var bin_button = document.createElement('li');
            var link = document.createElement('a');
            link.setAttribute('href', `${BinPageButton.construct_bin_url()}`);
            link.innerText = 'To Bins';
            bin_button.appendChild(link);
            nav_node.prepend(bin_button);
        }
    }

    BinPageButton.add_nav_button();
})();