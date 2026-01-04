// ==UserScript==
// @name            WikiView: AQW Link Preview
// @namespace       https://github.com/biglavis/
// @version         2.0.5
// @description     Adds image previews for links on the official AQW Wiki, AQW character pages, and AQW account management.
// @match           http://aqwwiki.wikidot.com/*
// @match           https://account.aq.com/CharPage?id=*
// @match           https://account.aq.com/AQW/Inventory
// @match           https://account.aq.com/AQW/BuyBack
// @match           https://account.aq.com/AQW/WheelProgress
// @match           https://account.aq.com/AQW/House
// @exclude         http://aqwwiki.wikidot.com/book-of-lore-badges
// @exclude         http://aqwwiki.wikidot.com/character-page-badges
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @icon            https://www.aq.com/favicon.ico
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/488835/WikiView%3A%20AQW%20Link%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/488835/WikiView%3A%20AQW%20Link%20Preview.meta.js
// ==/UserScript==

// prevent jQuery conflicts between script and site
var $ = window.jQuery.noConflict(true);

var mousePos = { x: -1, y: -1 };
$(document).mousemove(function(event) {
    mousePos.x = event.clientX;
    mousePos.y = event.clientY;
});

var mouseHover = false; // flag to prevent spam
var controller = null;
var timeout = null;

// wiki links; char page
$("#page-content a, .card.m-2.m-lg-3 a").on({
    mouseover: function() { hovered(this.href); },
    mouseout: function() { unhovered(); }
});

// acct mgmt inventory; wiki recent changes
$("#inventoryRendered, #site-changes-list").on("mouseover", function() {
    $(this).find("a").on({
        mouseover: function() { hovered(this.href); },
        mouseout: function() { unhovered(); }
    });
});

// acct mgmt inventory, wheel, house
$("#listinvFull, #wheel, table.table.table-sm.table-bordered").on("mouseover", function() {
    $(this).find("tbody td:first-child").on({
        mouseover: function() { hovered("http://aqwwiki.wikidot.com/" + this.textContent.split(/\sx\d+/)[0]); },
        mouseout: function() { unhovered(); }
    });
});

// acct mgmt buyback
$("#listinvBuyBk2").on("mouseover", function() {
    $(this).find("tbody td:nth-child(2)").on({
        mouseover: function() { hovered("http://aqwwiki.wikidot.com/" + this.textContent); },
        mouseout: function() { unhovered(); }
    });
});

function hovered(link) {
    if (!mouseHover) {
        mouseHover = true;
        controller = new AbortController();

        // show preview if hovered for 100ms
        timeout = setTimeout(function() {
            showPreview(link, controller.signal);
        }, 100);
    }
}

function unhovered() {
    clearTimeout(timeout);
    mouseHover = false;
    controller.abort();
    removePreview();
}

async function fetchParse(url, signal) {
    const response = await fetch(url, { signal });
    const html = await response.text();

    const template = document.createElement('template');
    template.innerHTML = html; // parses HTML fragment, avoids DOMParser breaking page CSS in FireFox

    return template.content;
}

async function wikimg(url, signal) {
    if (!url.startsWith("http://aqwwiki.wikidot.com/")) return;

    if (window.location.hostname !== "aqwwiki.wikidot.com") {
        url = "https://api.codetabs.com/v1/proxy?quest=" + url; // use proxy to bypass CORS
    }

    // fetch and parse
    const doc = await fetchParse(url, signal).catch(() => undefined);
    if (!doc) {
        return;
    }

    // get page type
    const type = $(doc).find("#breadcrumbs > a:last").text();

    // get images
    switch (type) {
        case "AQWorlds Wiki":
            if ($(doc).find("#page-content span:first").text().includes("usually refers to")) {
                for (let link of $(doc).find("#page-content a")) {
                    var images = await wikimg("http://aqwwiki.wikidot.com" + $(link).attr("href"));
                    if (images) {
                        return images;
                    }
                }
            }
            return;

        case "World":
        case "Events":
        case "Factions":
        case "Game Menu":
        case "Quests":
        case "Shops":
        case "Hair Shops":
        case "Merge Shops":
        case "Enhancements":
            return;

        case "Book of Lore Badges":
        case "Character Page Badges":
            var image = $(doc).find("#page-content img:last");
            if (image.length) {
                return [image.prop("src")];
            }
            return;

        case "Classes":
        case "Armors":
            var image0 = $(doc).find("#wiki-tab-0-0:last img:first");
            var image1 = $(doc).find("#wiki-tab-0-1:last img:first");

            if (image0.length && image1.length) {
                return [image0.prop("src"), image1.prop("src")]
            }

        default:
            var image = $(doc).find("#page-content > img:last");
            if (image.length && !image.prop("src").includes("image-tags")) {
                return [image.prop("src")];
            }

            for (image of $(doc).find("#wiki-tab-0-0 img").toArray()) {
                if (!$(image).prop("src").includes("image-tags")) {
                    return [$(image).prop("src")];
                }
            }

            for (image of $(doc).find("#page-content > .collapsible-block img").toArray()) {
                if (!$(image).prop("src").includes("image-tags")) {
                    return [$(image).prop("src")];
                }
            }
    }
}

function showPreview(url, signal) {
    $("body").append('<div id="preview" style="position:fixed; display:flex"></div>');

    const maxwidth = $(window).width() * 0.45;
    const maxheight = $(window).height() * 0.65;

    // get images
    wikimg(url, signal).then((images) => {

        // return if no images found
        if (!images) return;

        // add images to new div
        images.forEach(src => {
            if (images.length === 1) {
                $("#preview").append(`<img style="max-width:${maxwidth}px; max-height:${maxheight}px; height:auto; width:auto;" src="${src}">`);
            } else {
                $("#preview").append(`<img style="height:${maxheight}px;" src="${src}">`);
            }
        });

        // wait for images to load
        waitForImagesToLoad("#preview img").then(() => {

            // scale images down if div width > max width
            const scale = Math.min(1, maxwidth / $("#preview").width());

            $("#preview img").each(function() {
                this.style.height = this.offsetHeight * scale + "px";
            });

            // position div
            $("#preview").css("top", mousePos.y - (mousePos.y / $(window).height()) * $("#preview").height() + "px");
            if (mousePos.x < $(window).width() / 2) {
                $("#preview").css("left", mousePos.x + Math.min(100, $(window).width() - $("#preview").width() - mousePos.x) + "px");
            } else {
                $("#preview").css("right", $(window).width() - mousePos.x + Math.min(100, mousePos.x - $("#preview").width()) + "px");
            }
        });
    })
}

function removePreview() {
    $("#preview").remove();
}

function waitForImagesToLoad(selector) {
  const imagePromises = $(selector).toArray().map(img => {

    // if the image is already complete, resolve immediately
    if (img.complete) {
      return Promise.resolve();
    }

    // else, wait for load or error
    return new Promise((resolve) => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    });
  });

  return Promise.all(imagePromises);
}
