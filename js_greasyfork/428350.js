// ==UserScript==
// @name        AO3: [Wrangling] Find the Tag in the Blurb
// @namespace   https://github.com/RhineCloud
// @version     1.2
// @description Make the tag of the page you're on (and up to 300 synonymous/meta/sub/parent/child tags) more visually distinct
// @grant       none
// @author      Rhine
// @include     /^https?:\/\/[^\/]*archiveofourown.org\/(works|bookmarks)\?.*tag_id=.+/
// @include     /^https?:\/\/[^\/]*archiveofourown.org\/tags\/[^\/]+(\/((works|bookmarks).*)?)?$/
// @exclude     /^https?:\/\/[^\/]*archiveofourown.org\/tags\/[^\/]+\/(edit|wrangle|comments|troubleshooting).*/
// @license     GPL-3.0 <https://www.gnu.org/licenses/gpl.html>
// @downloadURL https://update.greasyfork.org/scripts/428350/AO3%3A%20%5BWrangling%5D%20Find%20the%20Tag%20in%20the%20Blurb.user.js
// @updateURL https://update.greasyfork.org/scripts/428350/AO3%3A%20%5BWrangling%5D%20Find%20the%20Tag%20in%20the%20Blurb.meta.js
// ==/UserScript==


// CSS SETTINGS
// DO NOT change the first string in each line
// adjust the second string in each line as you like, any valid CSS works
// delete the entire line if you are not ever at all interested in having a specific kind of related tag highlighted
const STYLE_MAP = new Map([
    ["", "color: #fff; background: #900;"],
    ["synonym", "color: #fff; background: rgba(153, 0, 0, 75%);"],
    ["meta", "color: #fff; text-shadow: 0 0 5px #900;"],
    ["sub", "color: #fff; background: #c00;"],
    ["parent", "color: #fff; text-shadow: 0 0 5px #099; font-style: oblique;"],
    ["child", "color: #fff; background: #090; font-weight: bold;"]
]);

// CACHE SETTINGS
// set these to either true or false
// automatically cache related tags
const AUTO_CACHE_RELATED = false
// show the "Cache related tags" button
const SHOW_CACHE_BUTTON = true


// MAIN FUNCTION
// find matching tags in blurbs and add styling
const PATHNAME = window.location.pathname;
let tag_id = PATHNAME.startsWith("/tags/") ? PATHNAME.split("/")[2] :
    document.querySelector("#main h2.heading a.tag").getAttribute("href").split("/")[2];
style_tag(tag_id, STYLE_MAP.get(""));

if (1 < STYLE_MAP.size) {
    // find corresponding tag canonical if on tags landing page of a synonym
    if (document.querySelector("div.merger.module")) {
        tag_id = document.querySelector("div.merger.module a.tag").getAttribute("href").split("/")[2];
    }

    // automatically cache related tags if applicable
    if (AUTO_CACHE_RELATED && sessionStorage.getItem("cached_tag") !== tag_id) {
        cache_related_tags().then(() => {});
    }

    // find further related tags if applicable
    const button = document.createElement("li");
    if (sessionStorage.getItem("cached_tag") === tag_id) {
        button.innerHTML = `<span class="current">Cached related tags!</span>`;
        style_related_tags();
    } else {
        button.setAttribute("id", "cache_related_tags");
        button.innerHTML = "<a>Cache related tags</a>";
        button.addEventListener("click", cache_related_tags);
    }
    if (SHOW_CACHE_BUTTON) {
        document.querySelector("#main ul.navigation.actions").prepend(button);
    }
}


// HELPER FUNCTIONS
// apply styling to appearances of a specific tag in all blurbs
function style_tag(tag_id, style) {
    document.querySelectorAll(`li.blurb a.tag[href="/tags/${tag_id}/works"], li.blurb a.tag[href="/tags/${tag_id}/bookmarks"]`)
        .forEach(tag => tag.setAttribute("style", style));
}

// use sessionStorage to effectively cache info on related tags (per window/tab)
// and apply styling on related tags once they're cached
async function cache_related_tags() {
    const tag_home = 3 === PATHNAME.split("/").length ? document.querySelector("#main div.tag.home") :
        await fetch(`/tags/${tag_id}`).then(response => response.text()).then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            return doc.querySelector("#main div.tag.home");
        });

    for (let type of STYLE_MAP.keys()) {
        if (type) {
            cache_relation(type, tag_home);
        }
    }
    sessionStorage.setItem("cached_tag", tag_id);

    if (SHOW_CACHE_BUTTON) {
        document.querySelector("#cache_related_tags").innerHTML = `<span class="current">Cached related tags!</span>`;
        document.querySelector("#cache_related_tags").removeEventListener("click", cache_related_tags);
    }
    style_related_tags();
}

// cache one type of relation in sessionStorage
function cache_relation(type, tag_home) {
    let tags = tag_home.querySelectorAll(`div.${type} a.tag`);
    tags = nodes_to_strings(tags);
    sessionStorage.setItem(`cached_${type}_tags`, tags.join(","));
}

// transform list of nodes (linked tags from the page) into plain strings for sessionStorage
function nodes_to_strings(node_list) {
    const strings = [];
    for (let node of node_list.values()) {
        strings.push(node.getAttribute("href").split("/")[2]);
    }
    return strings;
}

// apply styling to all tags of all relation types in all blurbs
function style_related_tags() {
    for (let type of STYLE_MAP.keys()) {
        if (type) {
            sessionStorage.getItem(`cached_${type}_tags`).split(",")
                .forEach(tag => style_tag(tag, STYLE_MAP.get(type)));
        }
    }
}
