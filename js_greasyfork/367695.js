// ==UserScript==
// @name        Arxiv Old Author Search
// @namespace   https://greasyfork.org/en/scripts/367695-arxiv-old-author-search
// @description Resets author links on the arxiv to use the old search
// @include     http://arxiv.org/*
// @include     https://arxiv.org/*
// @version     3
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/367695/Arxiv%20Old%20Author%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/367695/Arxiv%20Old%20Author%20Search.meta.js
// ==/UserScript==

var i;
var link_target;
var argument_start;
var author_name, fixed_author_name;

var arxiv_context = "";
var links = document.getElementsByTagName("a");
var header_links = document.getElementById("header").getElementsByTagName("a");

// We first need the context: hep-th, cond-mat and so on
for (i = 0; i < header_links.length; i++) {
        link_target = header_links[i].getAttribute("href");
        argument_start = link_target.indexOf("recent");
        if (argument_start < 0) continue;
        arxiv_context = header_links[i].innerHTML;
}

for (i = 0; i < links.length; i++) {
        link_target = links[i].getAttribute("href");
        if (link_target == null) continue;
        argument_start = link_target.indexOf("?searchtype=author&query=");
        if (argument_start < 0) continue;
        author_name = link_target.substring(argument_start + 25).replace(",+", "_").replace("%2C+", "_");
        // Limit the number of initials to one
        fixed_author_name = author_name.replace(/\+.*/, "");
        // Replace the link
        links[i].setAttribute("href", "https://arxiv.org/find/" + arxiv_context + "/1/au:+" + fixed_author_name + "/0/1/0/all/0/1");
}
