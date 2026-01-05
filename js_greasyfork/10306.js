// ==UserScript==
// @name         KissAnime/Cartoon Downloader 2
// @namespace    https://greasyfork.org/users/10036
// @version      0.05
// @description  Download kissanime videos. Note that KissAnime Downloader is required.
// @author       D. Slee
// @icon         http://kissanime.com/Content/images/favicon.ico
// @match        http*://********************.googlevideo.com/*
// @match        https://***************.c.docs.google.com/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10306/KissAnimeCartoon%20Downloader%202.user.js
// @updateURL https://update.greasyfork.org/scripts/10306/KissAnimeCartoon%20Downloader%202.meta.js
// ==/UserScript==
link = window.location.href;

if (link.split('#').length > 1){
    //Stop video
    $('body').remove();

    //Get title name
    title = decodeURIComponent(link.split('#')[1].split("|")[0])+".mp4";

    //Save
    SaveToDisk(link, title);
}

function SaveToDisk(fileURL, fileName) {
    var save = document.createElement('a');
    save.href = fileURL;
    save.target = '_blank';
    save.download = fileName || 'unknown';

    var event = document.createEvent('Event');
    event.initEvent('click', false, false);
    save.dispatchEvent(event);
    (window.URL || window.webkitURL).revokeObjectURL(save.download);
    window.parent.postMessage(link.split("|")[1], "http://kissanime.com"); //Iframe parent message
}