// ==UserScript==
// @name         Creed's Style Maker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  User Interface to change Creed CSS. Customize your Creed's styles today!
// @author       inTech (https://github.com/tejaboy)
// @match        https://pokemoncreed.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.js
// @downloadURL https://update.greasyfork.org/scripts/389946/Creed%27s%20Style%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/389946/Creed%27s%20Style%20Maker.meta.js
// ==/UserScript==

loadStylesheet("https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.css");

$(document).ready(() => {
    refreshStyle();

    $("body").append('<div id="creedStyle"><div id="settings"></div></div><div id="toggleBtn">⚙️</div>');

    // CSS
    $("#creedStyle, #toggleBtn").css("position", "fixed");
    $("#creedStyle, #toggleBtn").css("top", "20px");
    $("#creedStyle, #toggleBtn").css("font-size", "30px");
    $("#creedStyle, #toggleBtn").css("color", "black");
    $("#creedStyle, #toggleBtn").css("background-color", "white");

    $("#creedStyle").css("left", "-250px");
    $("#toggleBtn").css("left", "0");
    $("#toggleBtn").css("border-radius", "0 10px 10px 0");
    $("#creedStyle, #toggleBtn").css("cursor", "pointer");

    $("#settings").css("width", "250px");
    $("#settings").css("font-size", "20px");
    $("#settings").css("text-align", "right");

    // Content
    $("#settings").append('<span id="style-bg-image">Background Image</span><br />');
    $("#settings").append('<span id="style-content-color">Text Color <input type="text" id="input-content-color" /></span><br />');
    $("#settings").append('<span id="style-content-bg-color">Content BG Color <input type="text" id="input-content-bg-color" /></span><br />');
    $("#settings").append('<span id="style-link-default">Link Default <input type="text" id="input-link-default" /></span><br />');
    // $("#settings").append('<span id="style-content-bg-color">Link Hover <input type="text" id="input-link-hover" /></span><br />'); // bugged
    $("#settings").append('<span id="style-menu-bg-color">Menu BG Color <input type="text" id="input-menu-bg-color" /></span><br />');
    $("#settings").append('<span id="style-title-bg-image">Title BG Image</span>');

    // Toggle Button
    $("#toggleBtn").on("click", () => {
        if ($("#toggleBtn").html() == "⚙️")
        {
            $("#toggleBtn").html("✖");

            $("#creedStyle, #toggleBtn").animate({
                left: "+=250"
            }, 1000);
        }
        else
        {
            $("#toggleBtn").html("⚙️");

            $("#creedStyle, #toggleBtn").animate({
                left: "-=250px"
            }, 1000);
        }
    });

    /***     Settings     ***/
    // background-image
    $("#style-bg-image").on("click", () => {
        GM_setValue("background-image", prompt('Enter Image URL', GM_getValue("background-image")));

        refreshStyle();
    });

    // title-background-image
    $("#style-title-bg-image").on("click", () => {
        GM_setValue("title-background-image", prompt('Enter Image URL', GM_getValue("title-background-image")));

        refreshStyle();
    });

    // Color Pickers
    enableColorPicker("content-color", ".contentcontent", "color", "#fff");
    enableColorPicker("content-bg-color", ".contentcontent", "background-color", "rgba(0, 0, 0, 0.6)");
    enableColorPicker("link-default", "a", "color", "#fc0");
    enableColorPicker("link-hover", "a", "color", "#fc0");
    enableColorPicker("menu-bg-color", "div.leftmenu ul li a", "background-color", "rgba(0, 0, 0, 0.6)");
});

function refreshStyle()
{
    // default background-images
    if (GM_getValue("title-background-image") == null)
        GM_setValue("title-background-image", "styles/1/col2_head.jpg");

    if (GM_getValue("background-image") == null)
            GM_setValue("background-image", "styles/1/homebody.jpg");

    // background-image
    $("body").css("background-image", "url('" + GM_getValue("background-image") + "')");

    // title-background-image
    $(".title").css("background-image", "url('" + GM_getValue("title-background-image") + "')");

    // content-color
    $(".contentcontent").css("color", GM_getValue("content-color"));

    // content-bg-color
    $(".contentcontent").css("background-color", GM_getValue("content-bg-color"));

    // link-default
    $("a").css("color", GM_getValue("link-default"));

    // link-hover - bugged
    /*
    $("a").on("mouseenter", () => {
        $(this.element).css("color", GM_getValue("link-hover"));
    });
    */

    // menu-bg-color
    $("div.leftmenu ul li a").css("background-color", GM_setValue("menu-bg-color"));
}

function enableColorPicker(element, cssSelector, cssAttribute, defaultColor)
{
    $("#input-" + element).spectrum({
        color: (GM_getValue(element) != undefined) ? GM_getValue(element) : defaultColor,
        showAlpha: true,
        move: (color) => {
           $(cssSelector).css(cssAttribute, color.toRgbString());
        },
        change: (color) => {
            GM_setValue(element, color.toRgbString());

            refreshStyle();
        }
    });
}

// HELPERS
// https://stackoverflow.com/questions/574944/how-to-load-up-css-files-using-javascript
function loadStylesheet(url)
{
    var link = document.createElement("link");
    link.href = url;
    link.type = "text/css";
    link.rel = "stylesheet";

    document.head.appendChild(link);
}