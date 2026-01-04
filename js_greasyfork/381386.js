// ==UserScript==
// @author        Odd
// @connect       jellyneo.net
// @description   Creates a list of your account's unlocked avatars.
// @grant         GM.xmlHttpRequest
// @grant         GM_xmlhttpRequest
// @include       file:///*
// @name          Avatar Lister (Offline)
// @namespace     Odd@Clraik
// @require       https://code.jquery.com/jquery-3.3.1.min.js
// @version       1.0.1
// @downloadURL https://update.greasyfork.org/scripts/381386/Avatar%20Lister%20%28Offline%29.user.js
// @updateURL https://update.greasyfork.org/scripts/381386/Avatar%20Lister%20%28Offline%29.meta.js
// ==/UserScript==

var Tries = 3;

(function () {

    var row = $(".row").filter(function () { return (this.textContent || "").match(/notable\x20+avatars/i); });

    if (row.length) {

        if (typeof GM_xmlhttpRequest == "undefined") GM_xmlhttpRequest = GM.xmlHttpRequest;

        var avatars = row.nextAll("img[src*='/avatars/']")
            .map(function (index, element) {

                element = $(element).remove();

                return { imageUrl: element.attr("src"), name: element.attr("title") };
            })
                .toArray();
        var timeoutID;
        var tries = Tries;

        row.after("<div class=\"avatar-wrapper\"></div>");

        row.find("> strong").html("Loading notable avatars...");

        function loadRetiredAvatars() {

            GM_xmlhttpRequest({

                onabort: onAbort,
                onerror: onError,
                onload: function (response) {

                    var retired = {};

                    for (var match, regex = /<img[^>]*src\=\"\/assets\/imgs\/avatars[^\"]*\"[^>]*alt\=\"([^\"]*)\"/gi; (match = regex.exec(response.responseText));)
                        retired[match[1].toLowerCase()] = 1;

                    var listWriters = [[], [], [], []];
                    var show = 0;
                    var wrapper = $(".avatar-wrapper");
                    var writer = [];

                    avatars.sort(function (avatar1, avatar2) {

                        if (avatar1.name > avatar2.name) return 1;

                        if (avatar1.name < avatar2.name) return -1;

                        return 0;
                    });

                    row.find("> strong").html("Notable avatars (" + (function () { var count = 0; for (var i = 0; i < avatars.length; i++) if (retired[avatars[i].name.toLowerCase()]) count++; return count; })() + " retired, " + avatars.length + " total):");

                    row.append("<br><a href=\"javascript:void;\" id=\"avatarsShowAll\">All</a><u>All</u> | <a href=\"javascript:void;\" id=\"avatarsShowRetired\">Retired</a><u>Retired</u> (<a href=\"javascript:void;\" id=\"avatarsShowImages\">Images</a><u>Images</u> | <a href=\"javascript:void;\" id=\"avatarsShowText\">Text</a><u>Text</u>)");

                    var showAll = $("#avatarsShowAll").css("display", "none");
                    var showImages = $("#avatarsShowImages").css("display", "none");
                    var showRetired = $("#avatarsShowRetired");
                    var showText = $("#avatarsShowText");

                    showRetired.next()
                        .css("display", "none");

                    showText.next()
                        .css("display", "none");

                    writer.push("<style>");

                    writer.push(".avatar-wrapper {");

                    writer.push("font: 11px verdana;");

                    writer.push("}");

                    writer.push(".avatar-wrapper > div > div {");

                    writer.push("display: inline-block;");

                    writer.push("margin: 8px;");

                    writer.push("vertical-align: top;");

                    writer.push("width: 200px;");

                    writer.push("}");

                    writer.push(".avatar-wrapper > div > div > div {");

                    writer.push("display: table-cell;");

                    writer.push("vertical-align: middle;");

                    writer.push("}");

                    writer.push(".avatar-wrapper > div > div > div:first-child,");

                    writer.push(".avatar-wrapper > div > div > div:first-child > img {");

                    writer.push("height: 50px;");

                    writer.push("width: 50px;");

                    writer.push("}");

                    writer.push(".avatar-wrapper > div > div > div:last-child {");

                    writer.push("font-weight: bold;");

                    writer.push("padding-left: 16px;");

                    writer.push("text-align: left;");

                    writer.push("}");

                    writer.push("</style>");

                    $("head").append(writer.join(""));

                    writer = [];

                    for (var i = 0; i < avatars.length; i++) {

                        if (retired[avatars[i].name.toLowerCase()]) {

                            listWriters[2].push("<div>");

                            listWriters[2].push("<div><img src=\"" + avatars[i].imageUrl + "\"></div>");

                            listWriters[2].push("<div>" + avatars[i].name + "</div>");

                            listWriters[2].push("</div>");

                            listWriters[3].push(avatars[i].name + "<br>");
                        }
                        else {

                            listWriters[0].push("<div>");

                            listWriters[0].push("<div><img src=\"" + avatars[i].imageUrl + "\"></div>");

                            listWriters[0].push("<div>" + avatars[i].name + "</div>");

                            listWriters[0].push("</div>");

                            listWriters[1].push(avatars[i].name + "<br>");
                        }
                    }

                    for (var i = 0; i < listWriters.length; i++) {

                        writer.push("<div" + ((i % 2) ? " style=\"display: none;\"" : "") + ">");

                        writer = writer.concat(listWriters[i]);

                        writer.push("</div>");
                    }

                    wrapper.html(writer.join(""));

                    //GreaseMonkey compatible click
                    document.getElementById(showAll.attr("id"))
                        .addEventListener("click", function () {

                            show &= ~1;

                            showAll.css("display", "none")
                                .next()
                                    .css("display", "");

                            showRetired.css("display", "")
                                .next()
                                    .css("display", "none");

                            wrapper.find("> div").hide();

                            wrapper.find("> div:nth-child(" + ((show & 2) ? 2 : 1) + ")").show();
                        });

                    document.getElementById(showImages.attr("id"))
                        .addEventListener("click", function () {

                            show &= ~2;

                            showImages.css("display", "none")
                                .next()
                                    .css("display", "");

                            showText.css("display", "")
                                .next()
                                    .css("display", "none");

                            wrapper.find("> div").hide();

                            wrapper.find("> div:nth-child(" + ((show & 1) ? 3 : 1) + ")").show();
                        });

                    document.getElementById(showRetired.attr("id"))
                        .addEventListener("click", function () {

                            show |= 1;

                            showAll.css("display", "")
                                .next()
                                    .css("display", "none");

                            showRetired.css("display", "none")
                                .next()
                                    .css("display", "");

                            wrapper.find("> div").hide();

                            wrapper.find("> div:nth-child(" + ((show & 2) ? 4 : 3) + ")").show();
                        });

                    document.getElementById(showText.attr("id"))
                        .addEventListener("click", function () {

                            show |= 2;

                            showImages.css("display", "")
                                .next()
                                    .css("display", "none");

                            showText.css("display", "none")
                                .next()
                                    .css("display", "");

                            wrapper.find("> div").hide();

                            wrapper.find("> div:nth-child(" + ((show & 1) ? 4 : 2) + ")").show();
                        });
                },
                ontimeout: onTimeout,
                timeout: 60000,
                url: "http://www.jellyneo.net/?go=avatars&id=retired"
            });
        }

        function onAbort() {

            if (tries) {

                --tries;

                timeoutID = setTimeout(loadRetiredAvatars, 500);

                return;
            }

            row.find("> strong").html("Failed to load avatars because our requests to JellyNeo were aborted.");
        }

        function onError() {

            if (tries) {

                --tries;

                timeoutID = setTimeout(loadRetiredAvatars, 500);

                return;
            }

            row.find("> strong").html("Failed to load avatars due to unexpected errors from JellyNeo.");
        }

        function onTimeout() {

            if (tries) {

                --tries;

                timeoutID = setTimeout(loadRetiredAvatars, 500);

                return;
            }

            row.find("> strong").html("Failed to load avatars - our requests to JellyNeo timed out.");
        }

        loadRetiredAvatars();
    }
})();