// ==UserScript==
// @name down2transmission
// @namespace https://github.com/convexshiba/
// @copyright 2017, convexshiba
// @author convexshiba
// @icon https://media.giphy.com/media/cInsPcO4MijtwP1FMS/giphy.gif
// @license https://raw.githubusercontent.com/convexshiba/down2transmission/master/LICENSE
// @version 1.8
// @description Add a button in torrent sites to support adding torrent to Transmission directly.
// @supportURL https://github.com/convexshiba/down2transmission
// @match *://ccfbits.org/*
// @match *://totheglory.im/*
// @match *://thepiratebay.org/*
// @match *://iptorrents.com/*
// @require https://code.jquery.com/jquery-3.2.1.min.js
// @run-at document-end
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/28408/down2transmission.user.js
// @updateURL https://update.greasyfork.org/scripts/28408/down2transmission.meta.js
// ==/UserScript==

// Edit these before use.
// http://192.168.1.1 for local access, input ddns for external access.
// NO trailing slash(/).

// Authentication;
// support multiple server
var transmissions = [
  new Transmission(
    "Server1",
    "http://your.url.com",
    "9091",
    "/transmission/",
     "path_to_download",
    "user_name1",
    "pw1"
  ),
  new Transmission(
    "Server2",
    "http://your.server.com",
    "9092",
    "/transmission/",
    "path_to_download",
    "usename2",
    "pw2"
  ),
];

// Can be found in direct download rss.
var ipt_torrent_pass = "Can be found in direct download rss";

// Below is optional

// Useful when your transmission is hidden behind an authentication layer/reverse proxy
var custom_header = {
    // "CF-Access-Client-Id": "client_id_example",
    // "CF-Access-Client-Secret": "client_secret_example"
}

// DO NOT EDIT BELOW.

// server_name: name of the button
// url: your.server.url.com
// port: port, usually 9091
// rpc_bind_address: usually /transmission/
// download_dir: specify a special download address for this button. Provide null if want to use default path
// username: to your server
// pw: password to your server
function Transmission(server_name, url, port, rpc_bind_address, download_dir, username, pw) {
    this.name = server_name;
    this.url = url;
    this.port = port;
    this.rpc_bind_address = rpc_bind_address;
    this.username = username;
    this.pw = pw;
    this.download_dir = download_dir;
    this.rpc_url = function () {
        return "https://" + this.username + ":" + this.pw + "@" + this.url + ":" + this.port + this.rpc_bind_address + "rpc";
    };
}

var transmissions_map = transmissions.reduce(function (transmissions_map, obj) {
    transmissions_map[obj.name] = obj;
    return transmissions_map;
}, {});

console.log(transmissions_map);

var $ = window.jQuery;

var site = window.location.href;
var reCCF = /ccf/i;
var reTTG = /totheglory/i;
var rePira = /thepiratebay.org/i;
var reIpt = /iptorrents.com/i;
var baseURL = document.location.origin;
var target;
var buttonCSS = {
    "background-color": "#B6B6B6",
    "-moz-border-radius": "2px",
    "-webkit-border-radius": "2px",
    "border-radius": "5px",
    display: "inline-block",
    cursor: "pointer",
    color: "#000000",
    "font-family": "Verdana",
    "font-size": "12px",
    padding: "3px 5px 3px 3px",
    margin: "3px",
    "text-decoration": "none",
};

(function () {
    "use strict";
    transmissions.forEach(addButtonForTransmissioin);
    $("[id^=transmission]:not([id*=result]").click(function () {
        var id = $(this).attr("id");
        var type = $(this).data("type");
        var resultText = $("#" + id + "_result");
        var transmission = transmissions_map[$(this).data("server-name")];
        var torrentURL;
        resultText.text("Submitting to Transmission...");
        console.log(id + " is clicked");
        var request;
        if (type.includes("ccf-main") || type.includes("ttg-main")) {
            console.log("main page");
            var torrentPage = $(this).data("detailurl");
            GM_xmlhttpRequest({
                method: "GET",
                url: torrentPage,
                onload: function (response) {
                    console.log("Start fetching torrent details");
                    if (type.includes("ccf-main")) {
                        torrentURL =
                            baseURL +
                            "/" +
                            $(response.responseText).find('a[href*=".torrent"]').attr("href");
                    }

                    if (type.includes("ttg-main")) {
                        torrentURL = $(response.responseText)
                            .find("td.heading:contains(种子链接)")
                            .next()
                            .children("a:first")
                            .attr("href");
                    }
                    console.log("Extracted torrent url: " + torrentURL);
                    var request = getRequest(transmission, torrentURL)
                    console.log("request: " + request);
                    addTorrent(transmission, $("#" + id), resultText, request);
                },
            });
        }
        if (type.includes("ccf-detail") || type.includes("ttg-detail")) {
            console.log("detail page");
            torrentURL =
                baseURL + "/" + $('a[class="index"]:contains("torrent")').attr("href");
            request = getRequest(transmission, torrentURL)
            addTorrent(transmission, $("#" + id), resultText, request);
        }
        if (type.includes("pira-main")) {
            console.log("pira-main page");
            torrentURL = $(this).siblings().filter('a[href^="magnet"]').attr("href");
            request = getRequest(transmission, torrentURL)
            addTorrent(transmission, $("#" + id), resultText, request);
        }
        if (type.includes("ipt-main")) {
            console.log("ipt-main");
            torrentURL = $(this).data("detailurl");
            request = getRequest(transmission, torrentURL)
            addTorrent(transmission, $("#" + id), resultText, request);
        }
        if (type.includes("ipt-detail")) {
            console.log("ipt-detail");
            torrentURL = $(this).data("detailurl");
            request = getRequest(transmission, torrentURL)
            addTorrent(transmission, $("#" + id), resultText, request);
        }
    });
})();

function getRequest(transmission, torrentURL) {
    torrentURL = encodeURI(torrentURL)
    if (transmission.download_path === null) {
        return {
            arguments: { cookies: getCookie(), filename: torrentURL },
            method: "torrent-add",
            tag: 80,
        };
    } else {
        return {
            arguments: { cookies: getCookie(), filename: torrentURL, "download-dir": transmission.download_dir },
            method: "torrent-add",
            tag: 80,
        };
    }
}

function addButtonForTransmissioin(transmission) {
    console.log("Constructed url:" + transmission.rpc_url());

    var button_id_prefix = "transmission_";

    if (reCCF.test(site)) {
        if (site.includes("browse")) {
            // CCF main page
            target = $(
                "table[border=1][cellpadding=5]>>> td:nth-child(2):not([class])"
            );
            target.each(function (i) {
                var pageURL =
                    baseURL + "/" + $(this).find("a[title][href]").attr("href");
                var button = $("<a>", {
                    id: "transmission_" + transmission.name + i,
                    "data-detailurl": pageURL,
                    text: transmission.name,
                    "data-type": "ccf-main",
                    "data-server-name": transmission.name,
                });
                var resultText = $("<a>", {
                    id: "transmission_" + transmission.name + i + "_result",
                    text: "",
                    style: "padding-left:5px",
                    "data-type": "ccf-main",
                    "data-server-name": transmission.name,
                });
                button.css(buttonCSS);
                $(this).append(button);
                button.after(resultText);
            });
        }
        if (site.includes("details")) {
            // CCF detail page
            target = $('a[class="index"][href*=".torrent"]');
            var ccfTorrentUrl = baseURL + "/" + target.attr("href");
            var ccfDetailInsert = $("<a>", {
                id: "transmission_" + transmission.name,
                "data-detailurl": ccfTorrentUrl,
                text: transmission.name,
                "data-type": "ccf-detail",
                "data-server-name": transmission.name,
            });
            ccfDetailInsert.css(buttonCSS);
            target.after(ccfDetailInsert);
            ccfDetailInsert.after(
                $("<a>", {
                    id: "transmission_" + transmission.name + "_result",
                    text: "",
                    style: "padding-left:5px",
                    "data-type": "ccf-detail",
                    "data-server-name": transmission.name,
                })
            );
            target.after("<br>");
        }
    }

    if (reTTG.test(site)) {
        if (site.includes("browse")) {
            // TTG main page
            target = $("tr[id]> td:nth-child(2)");
            target.each(function (i) {
                var page = $(this).find("a[href]").attr("href");
                var el = $("<a>", {
                    id: "transmission_" + transmission.name + i,
                    "data-detailurl": baseURL + page,
                    text: transmission.name,
                    "data-type": "ttg-main",
                    "data-server-name": transmission.name,
                });
                el.css(buttonCSS);
                $(this).append(el);
                el.after(
                    $("<a>", {
                        id: "transmission_" + transmission.name + i + "_result",
                        text: "",
                        style: "padding-left:5px",
                        "data-type": "ttg-main",
                        "data-server-name": transmission.name,
                    })
                );
            });
        }
        if (site.includes("/t/")) {
            // TTG detail page
            target = $('a[class="index"][href*="zip"]');
            var ttgTorrentUrl =
                baseURL + "/" + $('a[class="index"][href*=".torrent"]').attr("href");
            var ttgDetailInsert = $("<a>", {
                id: "transmission_" + transmission.name,
                "data-detailurl": ttgTorrentUrl,
                text: transmission.name,
                "data-type": "ttg-detail",
                "data-server-name": transmission.name,
            });
            ttgDetailInsert.css(buttonCSS);
            target.after(ttgDetailInsert);
            ttgDetailInsert.after(
                $("<a>", {
                    id: "transmission_" + transmission.name + "_result",
                    text: "",
                    style: "padding-left:5px",
                    "data-type": "ttg-detail",
                    "data-server-name": transmission.name,
                })
            );
            target.after("<br>");
        }
    }

    if (rePira.test(site)) {
        if (site.includes("/search/")) {
            // piratebay main page
            target = $("#searchResult> tbody td:nth-child(2)");
            target.each(function (i) {
                var pageURL =
                    baseURL + "/" + $(this).find("a[title][href]").attr("href");
                var el = $("<a>", {
                    id: "transmission_" + transmission.name + i,
                    "data-detailurl": pageURL,
                    text: transmission.name,
                    "data-type": "pira-main",
                    "data-server-name": transmission.name,
                });
                el.css(buttonCSS);
                $(this).append(el);
                el.after(
                    $("<a>", {
                        id: "transmission_" + transmission.name + i + "_result",
                        text: "",
                        style: "padding-left:5px",
                        "data-type": "pira-main",
                        "data-server-name": transmission.name,
                    })
                );
                el.before("<br>");
            });
        }
    }

    if (reIpt.test(site)) {
        if (site.includes("/torrent.php")) {
            // torrent detail page
            target = $("td:has(> div.sub)");
            target.each(function (i) {
                var torrentURL =
                    baseURL +
                    $(this).parent().find("a:has(i.fa-download)").parent().attr("href") +
                    "?torrent_pass=" +
                    ipt_torrent_pass;
                var el = $("<a>", {
                    id: "transmission_" + transmission.name + i,
                    "data-detailurl": torrentURL,
                    text: transmission.name,
                    "data-type": "ipt-detail",
                    "data-server-name": transmission.name,
                });
                el.css(buttonCSS);
                $(this).append(el);
                el.after(
                    $("<a>", {
                        id: "transmission_" + transmission.name + i + "_result",
                        text: "",
                        style: "padding-left:5px",
                        "data-type": "ipt-main",
                        "data-server-name": transmission.name,
                    })
                );
                el.before("<br>");
            });
        } else if (site.includes("/t")) {
            // main page
            target = $("td:has(> div.sub)");
            target.each(function (i) {
                var torrentURL =
                    baseURL +
                    $(this).parent().find("a:has(i.fa-download)").attr("href") +
                    "?torrent_pass=" +
                    ipt_torrent_pass;
                var el = $("<a>", {
                    id: "transmission_" + transmission.name + i,
                    "data-detailurl": torrentURL,
                    text: transmission.name,
                    "data-type": "ipt-main",
                    "data-server-name": transmission.name,
                });
                el.css(buttonCSS);
                $(this).append(el);
                el.after(
                    $("<a>", {
                        id: "transmission_" + transmission.name + i + "_result",
                        text: "",
                        style: "padding-left:5px",
                        "data-type": "ipt-main",
                        "data-server-name": transmission.name,
                    })
                );
                el.before("<br>");
            });
        }
    }
}

function addTorrent(transmission, button, result, request, sessionId, tries) {
    console.log("adding torrent to:", transmission);
    console.log("setting download path");
    request.arguments
    if (!tries) {
        tries = 0;
    }
    if (tries === 3) {
        alert(
            "p2transmission: Too many Error 409: Conflict.\nCheck your transmission installation"
        );
        return;
    }
    console.log("sending torrent with sessionid: ->" + sessionId);
    console.log("sending: " + JSON.stringify(request));
    GM_xmlhttpRequest({
        method: "POST",
        url: transmission.rpc_url(),
        data: JSON.stringify(request),
        headers: Object.assign({}, custom_header, {
            "X-Transmission-Session-Id": sessionId,
        }),
        onload: function (response) {
            console.log(
                "Got response:\n" +
                [response.status, response.statusText, response.responseText].join(
                    "\n"
                )
            );
            var resultText;
            var success = false;
            var unclickable = false;
            var error = false;
            switch (response.status) {
                case 200: // status OK
                    var rpcResponse = response.responseText;
                    var rpcJSON = JSON.parse(rpcResponse);
                    if (rpcJSON.result.toLowerCase() === "success") {
                        if ("torrent-duplicate" in rpcJSON.arguments) {
                            resultText =
                                "Already added: " + rpcJSON.arguments["torrent-duplicate"].name;
                        } else {
                            resultText = "Added: " + rpcJSON.arguments["torrent-added"].name;
                        }
                        success = true;
                    } else {
                        resultText = "ERROR: " + rpcJSON.result;
                        error = true;
                    }
                    unclickable = true;
                    break;
                case 401:
                    resultText = "Your username/password is not correct.";
                    error = true;
                    break;
                case 409:
                    console.log("Setting sessionId");
                    var headers = response.responseHeaders.split("\n");
                    console.log(headers.join("; "));
                    for (var i in headers) {
                        var header = headers[i].split(":");
                        if (header[0].toLowerCase() == "x-transmission-session-id") {
                            sessionId = header[1].trim();
                            console.log("Got new Session ID: (" + sessionId);
                            addTorrent(
                                transmission,
                                button,
                                result,
                                request,
                                sessionId,
                                tries + 1
                            );
                        }
                    }
                    break;
                default:
                    resultText = "Unknown Transmission Response";
                    error = true;
                    alert(
                        "Unknown Transmission Response: " +
                        response.status +
                        " " +
                        response.statusText
                    );
            }
            console.log(resultText);
            result.text(resultText);
            if (unclickable) {
                button.unbind("click");
                button.css("cursor", "default");
            }
            if (success) {
                button.css("background-color", "#8FFFA6");
            }
            if (error) {
                button.css("background-color", "#FFBAC2");
            }
        },
    });
}

function getCookie() {
    // from https://github.com/bulljit/Transmission-Add-Torrent-Bookmarkelet Thanks folks.
    var sCookie = "";
    var aCookie = document.cookie.split(/;[\s\xA0]*/);
    if (aCookie !== "") {
        for (var i = 0; i < aCookie.length; i++) {
            if (aCookie[i].search(/(^__utm|^__qc)/) == -1) {
                sCookie = sCookie + aCookie[i] + "; ";
            }
        }
    }
    sCookie = sCookie.replace(/;\s+$/, "");
    return sCookie;
}


