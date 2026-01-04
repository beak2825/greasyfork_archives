// ==UserScript==
// @name         Reddit Image Search Add-on
// @namespace    https://greasyfork.org/en/users/76021-dalimcodes
// @version      1.0
// @description  Create instant reverse image search links for image posts
// @author       DaLimCodes
// @match        https://*.reddit.com/*
// @require      https://cdn.rawgit.com/uzairfarooq/arrive/cfabddbd2633a866742e98c88ba5e4b75cb5257b/minified/arrive.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/40495/Reddit%20Image%20Search%20Add-on.user.js
// @updateURL https://update.greasyfork.org/scripts/40495/Reddit%20Image%20Search%20Add-on.meta.js
// ==/UserScript==

var extraCSS = document.createElement("style");
extraCSS.textContent = `
.clickable {
    color:green !important;
    cursor:pointer;
    font-weight: bold;
}
div.reverse-search-div{
    position: absolute;
    padding: 4px 20px;
    z-index: 1000;
    border: 1px solid black;
    background-color: white
}
div#reverse-search-setting-div {
    position: absolute;
    border: 1px solid black;
    background-color: white;
    padding: 4px 8px;
    z-index: 1001;
    display: none
}
div#debug-div {
    position: fixed,
    top: 40px,
    right: 40px,
    border: 1px solid black;
    background-color: red,
    padding: 8px,
    z-index: 1000
}
`;
document.head.appendChild(extraCSS);

const imageSupportedRegex = /\.(gif|jpe?g|png)/i;
const debug = false

$(document).ready(generateLinks)
$(document).arrive('div.sitetable', generateLinks)
$(document).ready(function () {
    var settingDiv = $(`<div id="reverse-search-setting-div" class="floatDiv"></div>`)
    settingDiv.append(`
<div> Display link:<br>
<input type="radio" name="display_setting" value="inline">In-line<br>
<input type="radio" name="display_setting" value="dropdown">Dropdown
</div>`)
    $("body").append(settingDiv)
    if (GM_getValue("link-display-setting") == "dropdown") {
        $('input[name=display_setting][value=dropdown]').prop('checked', true)
    } else {
        $('input[name=display_setting][value=inline]').prop('checked', true)
        GM_getValue("link-display-setting", "inline")
    }
    $('input:radio[name="display_setting"]').change(function () {
        changeLinkDisplaySetting($(this).attr("value"))
        settingDiv.toggle()
    });
})

if (debug) {
    var debugDiv = $(`<div id="debug-div" class="floatDiv"><label>Debug Panel:</label></div>`);
    $("body").append(debugDiv)

    debugDiv.append(`<div><button id="generatorButton">Generate Links</button></div>`)
    $("#generatorButton").click(generateLinks)

    debugDiv.append(`<div><button id="switchInlineButton">Switch Link Display to Inline</button></div>`)
    $("#switchInlineButton").click(function () {
        changeLinkDisplaySetting("inline")
    })

    debugDiv.append(`<div><button id="switchDropdownButton">Switch Link Display to Dropdown</button></div>`)
    $("#switchDropdownButton").click(function () {
        changeLinkDisplaySetting("dropdown")
    })
}

function changeLinkDisplaySetting(newSetting) {
    if (GM_getValue("link-display-setting") != newSetting) {
        GM_setValue("link-display-setting", newSetting)
        generateLinks()
    }
}

function generateLinks() {
    if (debug) {
        console.log("Generating links!")
    }
    $(".reverse-search-button").remove()
    $(".reverse-search-div").remove()
    $(".reverse-search-link").remove()

    var hasRES = document.getElementsByClassName("res-ner-listing").length
    var obj, link, i, index = 0
    if (hasRES) {
        var things = $("div.thing.link")
        for (i = 0; i < things.length; i++) {
            obj = $(things[i])
            link = obj.attr("data-url")
            if (link.match("imgur.com") && !link.match("imgur.com/a/") && !link.match(imageSupportedRegex)) {
                link += ".jpg"
            }
            link = encodeURIComponent(link)
            if (link.match(imageSupportedRegex)) {
                index++
                // Check if it's a three or four letter image extension
                if (link.charAt(link.search(imageSupportedRegex) + 4).match(/[a-zA-Z]/)) {
                    link = link.substr(0, link.search(imageSupportedRegex) + 5)
                } else {
                    link = link.substr(0, link.search(imageSupportedRegex) + 4)
                }
                appendLinks(obj.find("ul.buttons"), link, GM_getValue("link-display-setting", "inline"), index)
                if (debug) {
                    console.log("Image link:", link)
                }
            } else {
                if (debug) {
                    console.log("Non-image link:", link)
                }
            }
        }
    } else {
        // first pass to find links inside expando
        entry = $("a.title")
        for (i = 0; i < entry.length; i++) {
            obj = $(entry[i])
            link = obj.attr("href")
            if (link.match("imgur.com") && !link.match("imgur.com/a/") && !link.match(imageSupportedRegex)) {
                link += ".jpg"
            }
            link = encodeURIComponent(link)
            if (link.match(imageSupportedRegex)) {
                index++
                // Check if it's a three or four letter image extension
                if (link.charAt(link.search(imageSupportedRegex) + 4).match(/[a-zA-Z]/)) {
                    link = link.substr(0, link.search(imageSupportedRegex) + 5)
                } else {
                    link = link.substr(0, link.search(imageSupportedRegex) + 4)
                }
                appendLinks(obj.closest("div.entry").find("ul.buttons"), link, GM_getValue("link-display-setting", "inline"), index)
                if (debug) {
                    console.log("Image link:", link)
                }
            } else {
                if (debug) {
                    console.log("Non-image link:", link)
                }
            }

        }

        // second pass to find links in the title
        var entry = $(".expando")
        for (i = 0; i < entry.length; i++) {
            obj = $(entry[i])
            if (obj.closest("div.entry").find("li.reverse-search-button").length == 0) {
                if (obj.attr("data-cachedhtml") !== undefined) {
                    var cachedhtml = $($.parseHTML(obj.attr("data-cachedhtml").trim()));
                    link = cachedhtml.find("a.may-blank").attr("href");
                    if (link !== undefined) {
                        index++;
                        if (link.match("imgur.com") && !link.match("imgur.com/a/") && !link.match(imageSupportedRegex)) {
                            link += ".jpg";
                        }
                        link = encodeURIComponent(link);
                        appendLinks(obj.closest("div.entry").find("ul.buttons"), link, GM_getValue("link-display-setting", "inline"), index)
                    }
                }
            }
        }
    }
}

function appendLinks(jQueryObjToAppend, imageLink, option, index) {
    var settingButton = $(`<li class="reverse-search-button"><a class="clickable">RIS Setting⚙</a></li>`)
    jQueryObjToAppend.append(settingButton);
    settingButton.on("click", settingButton, function () {
        $("#reverse-search-setting-div").toggle();
        $("#reverse-search-setting-div").css({
            'top': getOffset(settingButton[0]).top + settingButton.height() + "px",
            'left': -8 + getOffset(settingButton[0]).left + "px",
        });
    })
    if (option == "inline") {
        createLinks(jQueryObjToAppend, imageLink)
    } else if (option == "dropdown") {
        var element = $(`<li id="reverse-search-button_${index}" class="reverse-search-button" status="not open"><a class="clickable">Reverse Search <label>▾</label></a></li>`)
        jQueryObjToAppend.append(element)
        element.on("click", element, function () {
            if ($(this).attr("status") == "not open") {
                $(this).attr("status", "open")
                $($(this).find("label")[0]).text("▴")
                var linkDiv = $(`<div id="reverse-search-div_${index}" class="reverse-search-div floatDiv"></div>`)
                createLinks(linkDiv, imageLink)
                var pos = getOffset(this)
                linkDiv.css({
                    "top": pos.top + $(this).height() + "px",
                    "left": 8 + pos.left + "px",
                })
                $("body").append(linkDiv)
            } else {
                $(this).attr("status", "not open")
                $($(this).find("label")[0]).text("▾")
                var id = $(this).attr("id").split("_")[1]
                $("#reverse-search-div_" + id).remove()
            }
        })
    } else {
        console.log("error, no link appended")
    }
}

function createLinks(jQueryObjToAppend, imageLink) {
    jQueryObjToAppend.append(`<li class="reverse-search-link google"><a class="clickable" href="https://images.google.com/searchbyimage?image_url=${imageLink}" target="_blank">Google</a></li>`);
    jQueryObjToAppend.append(`<li class="reverse-search-link tineye"><a class="clickable" href="https://www.tineye.com/search?url=${imageLink}" target="_blank">TinEye</a></li>`);
    jQueryObjToAppend.append(`<li class="reverse-search-link saucenao"><a class="clickable" href="https://saucenao.com/search.php?url=${imageLink}" target="_blank">SauceNAO</a></li>`);
    jQueryObjToAppend.append(`<li class="reverse-search-link iqdb"><a class="clickable" href="http://iqdb.org/?url=${imageLink}" target="_blank">Iqdb</a></li>`);
}

// Credit to Adam Grant: http://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
function getOffset(el) {
    el = el.getBoundingClientRect()
    return {
        left: el.left + window.scrollX,
        top: el.top + window.scrollY
    }
}