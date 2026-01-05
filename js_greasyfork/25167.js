// ==UserScript==
// @name         Better Danbooru Artist Search
// @version      3.8.0
// @description  Improve URL handling within the Danbooru artist search engine and automatically navigate to unambiguous wiki page.
// @author       ForgottenUmbrella
// @match        *://danbooru.donmai.us/artists?*
// @namespace    https://greasyfork.org/users/83187
// @downloadURL https://update.greasyfork.org/scripts/25167/Better%20Danbooru%20Artist%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/25167/Better%20Danbooru%20Artist%20Search.meta.js
// ==/UserScript==

"use strict";

// Navigates to results for URL search.
function submit(url) {
    let searchParams = new URLSearchParams(location.search);
    searchParams.set("search[url_matches]", url);
    location.search = searchParams.toString();
}

// Navigate to artist wiki page if there is only one result.
let artistsList = document.getElementsByTagName("tbody")[0];
if (artistsList.childElementCount === 1) {
    location.assign(artistsList.getElementsByTagName("a")[0].href);
}

const original = new URLSearchParams(location.search).get(
    "search[url_matches]"
);
let url = new URL(
    original.startsWith("http") ? original : `https://${original}`
);
// Adjust URL for consumption by Danbooru.
switch (url.hostname) {
case "www.pixiv.net":
    // Convert artist illustrations page URL to main artist page URL.
    if (url.searchParams.get("type") === "illust") {
        url.pathname = "/member.php";
        url.searchParams.delete("type");
    }
    break;
// Convert mobile niconico seiga URL to desktop version.
case "sp.seiga.nicovideo.jp":
    url.hostname = url.hostname.replace("sp.", "");
    // Convert mobile image URL to desktop version.
    if (url.hash.startsWith("#!/im")) {
        const imageId = url.hash.split("/")[1];
        url.pathname = url.pathname.concat(imageId);
        url.hash = "";
    }
    break;
}
// Avoid infinite reloading by only submitting the URL if it has changed.
if (url.href !== original) {
    submit(url.href);
}
