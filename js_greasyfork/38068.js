// ==UserScript==
// @name         web+panda:// Metadata Inspector / Router
// @namespace    salembeats
// @version      1.7
// @description  Show all metadata for a web+panda:// link and choose a handler to use with it (if installed).
// @author       Cuyler Stuwe (salembeats)
// @include      https://worker.mturk.com/projects/registerWPMetadataInspector
// @include      https://worker.mturk.com/projects/handleWPMetadataInspector*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38068/web%2Bpanda%3A%20Metadata%20Inspector%20%20Router.user.js
// @updateURL https://update.greasyfork.org/scripts/38068/web%2Bpanda%3A%20Metadata%20Inspector%20%20Router.meta.js
// ==/UserScript==

document.head.innerHTML = "";

if(window.location.href.includes("/registerWPMetadataInspector")) {

    document.body.innerHTML = "Register protocol handler for web+panda:// Metadata Inspector";

    navigator.registerProtocolHandler("web+panda",
                                      "https://worker.mturk.com/projects/handleWPMetadataInspector?data=%s",
                                      "Web Panda Handler (Metadata Inspector)");
}
else {
    let parsedLandingURL = new URL(window.location.href);
    let parsedWebPandaURL = new URL(parsedLandingURL.searchParams.get("data"));

    let originalWebPandaLink = parsedWebPandaURL.href.replace("web+panda://web+panda://", "web+panda://"); // Seen this duplication issue in one link and never since, so this will fix it for now until I figure out why it happened.

    let gid = decodeURIComponent(parsedWebPandaURL.pathname)
        .replace("//", "")
        .replace("web+panda:"); // Once in a blue moon, it doesn't strip off this protocol, even though "pathname" usually does (and should). This monkey-patches that issue when it happens.

    let previewLink = `https://worker.mturk.com/projects/${gid}/tasks?ref=w_pl_prvw`;
    let acceptLink = `https://worker.mturk.com/projects/${gid}/tasks/accept_random?ref=w_pl_prvw`;

    let newPageHTML = `
<style>
div,span {
    word-wrap: break-word;
    overflow-wrap: break-word;
}
#container>div:nth-of-type(2n) {
    background: silver;
}
</style>
<div id='container'>
<div><div><span style="font-weight: bold">gid:</span> <span style="float: right;">${gid}</span></div></div>
`;

    for(let [key, value] of parsedWebPandaURL.searchParams.entries()) {
        newPageHTML += `<div><span style="font-weight: bold">${key}:</span> <span style="float: right;">${value}</span></div>`;
    }

    newPageHTML += `<div><span style="font-weight: bold">Preview:</span> <span style="float: right;"><a target="_blank" href="${previewLink}">Preview</a></span></div>`;
    newPageHTML += `<div><span style="font-weight: bold">Accept:</span> <span style="float: right;"><a target="_blank" href="${acceptLink}">Accept</a></span></div>`;

    newPageHTML += `<div><span style="font-weight: bold">Handle With:</span> <span style="float: right;"><a target="_self" href="https://worker.mturk.com/requesters/handleWebPanda?gid=${originalWebPandaLink}">Default</a> <a target="_self" href="https://worker.mturk.com/handlePCHwebpanda?url=${originalWebPandaLink}">Panda Crazy</a> <a target="_self" href="https://worker.mturk.com/requesters/pandaHamHandler?url=${originalWebPandaLink}">Ham</a></span></div>`;

    newPageHTML += "</div>";

    document.body.innerHTML = newPageHTML;

    let container = document.getElementById("container");

    const PADDING_MARGIN = 15;
    let last = document.querySelector("div:last-of-type");
    let {width, bottom: height} = last.getBoundingClientRect();
    console.log(height, last.getBoundingClientRect().bottom);
    width += (window.outerWidth - window.innerWidth) + PADDING_MARGIN;
    height += (window.outerHeight - window.innerHeight) + PADDING_MARGIN;

    window.resizeTo(width, height);
}