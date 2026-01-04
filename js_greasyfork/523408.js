// ==UserScript==
// @name         PassEducation-downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  bypass pass-education paywall
// @author       Samuel PERRIER
// @match        https://www.pass-education.fr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pass-education.fr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523408/PassEducation-downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/523408/PassEducation-downloader.meta.js
// ==/UserScript==

let links = document.getElementsByClassName("auth-href");
if (links.length != 0)
{
    let urlB = new URL(links[0].getAttribute("href"));
    for (let i = 0; i < links.length; i++)
    {
        let url = new URL(links[i].getAttribute("href"));
        let attachment_id = url.searchParams.get("attachment_id");
        let type_mime = url.searchParams.get("type_mime");
        let new_link = `https://cdn.pass-education.fr/download.php?attachment_id=${attachment_id}&type_mime=${type_mime}`;
        links[i].setAttribute("href", new_link);
    }

    let all_links = document.getElementsByClassName("single-entry-meta pe-subheader");
    let parrent_id = urlB.searchParams.get("parent_id");
    let new_parent_link = `https://cdn.pass-education.fr/download.php?archive_id=${parrent_id}&type_mime=application/zip`;
    for (let j = 0; j < all_links.length; j++)
    {
        all_links[j].innerHTML = `<a href="${new_parent_link}">Télécharger les documents</a>`;
    }
}

function setNewUrl() {
    let buttons = document.getElementsByClassName("mfp-title");
    if (buttons != null && buttons[0].children.length === 2) {
        let url = new URL(buttons[0].children[0].getAttribute("href"));
        let attachment_id = url.searchParams.get("attachment_id");
        let parent_id = url.searchParams.get("parent_id");
        let new_link = `https://cdn.pass-education.fr/download.php?attachment_id=${attachment_id}`;
        let new_parent_link = `https://cdn.pass-education.fr/download.php?archive_id=${parent_id}&type_mime=application/zip`;
        buttons[0].children[0].setAttribute("href", new_link);
        buttons[0].children[1].setAttribute("href", new_parent_link);
    }

    let arrows = document.getElementsByClassName("mfp-arrow");
    for (let i = 0; i < arrows.length; i++)
    {
        arrows[i].addEventListener("click", function() {
            setNewUrl();
        });
    }
}

let fiches = document.getElementsByClassName("row thumb_fiches");
for (let i = 0; i < fiches.length; i++)
{
    fiches[i].addEventListener("click", function() {
        setNewUrl();
    });
}

let login = document.getElementsByClassName("callout warning");
for (let i = 0; i < login.length; i++)
{
    login[i].style.display = "none";
}