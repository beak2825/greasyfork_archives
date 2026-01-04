// ==UserScript==
// @name         Canvas Media Gallery Grabber
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  No more buffering!!
// @author       Pikachu
// @include      *
// @run-at document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/412861/Canvas%20Media%20Gallery%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/412861/Canvas%20Media%20Gallery%20Grabber.meta.js
// ==/UserScript==

// DISCLAIMER: This tool is intended only for accessing authorized content offline.
//             You shall NOT use this tool to COPY or REDISTRIBUTE any of the downloaded content.

// Have fun reading the docs ~
// https://developer.kaltura.com/api-docs/Deliver-and-Distribute-Media/playManifest-streaming-api.html

// Update Log:
// 0.2: Now support downloading video media with kaltura player from any page on Canvas besides playlists.
//      File names are finally, finally sorted out. Now downloaded file names will be automatically set to video name!


function addbutton(video_title, dl_link) {
    // Add button
    var link_div = document.createElement("div");
    link_div.innerHTML = '<a href="' + dl_link + '" download="' + video_title + '.mp4">Download ' + video_title + '</a>';
    link_div.setAttribute("id", "download_button_container");

    document.getElementById("mediaContainer").parentNode.insertBefore(link_div, document.getElementById("mediaContainer"));

    //GM_addStyle('.download_button_container { position: absolute; top: 0px; right: 0px }')
}

function getassets(video_title, video_src, entry_id) {
    // Retrive ks
    var ks = video_src.substr(video_src.indexOf("&ks=")+4, video_src.indexOf("&", video_src.indexOf("&ks=")+4)-video_src.indexOf("&ks=")-4);
    //console.log("ks=",ks);

    var video_info = {
        "p":null,
        "sp":null,
        "entryId":entry_id,
        "flavorIds":null,
        "format":null,
        "protocol":null
    };

    for (var key in video_info) {
        var value = video_src.substr(
            video_src.indexOf(key+"/")+key.length+1,
            video_src.indexOf("/", video_src.indexOf(key+"/")+key.length+1)-video_src.indexOf(key+"/")-key.length-1
        );
        video_info[key] = value;
    };

    // Modify format
    video_info["format"] = "url"

    //console.log(video_info["entryId"]);

    // Get the best resolution
    var assets = GM_xmlhttpRequest({
        method: "GET",
        url: "https://www.kaltura.com/api_v3/service/flavorasset/action/getWebPlayableByEntryId?entryId="+video_info["entryId"]+"&ks="+ks,
        onerror: function(r) {
            console.log("Error when retriving assets.", "Detail: \n", r.responseText);
        },

        onload: function(r) {
            var assets = parseassets(r.responseText);

            var chosenasset = null;
            var chosenassetprop = 0;

            // Choose the asset with highest resolution
            for (var entryid in assets) {
                if (assets[entryid]["width"] * assets[entryid]["height"] > chosenassetprop) {
                    chosenasset = entryid;
                    chosenassetprop = assets[entryid]["width"] * assets[entryid]["height"];
                }
            }

            video_info["flavorIds"] = assets[chosenasset]["id"];

            var dl_link = "https://cdnapisec.kaltura.com/p/"+video_info["p"]+"/sp/"+video_info["sp"]+"/playManifest";
            for (key in video_info) {
                if (key != "p" && key != "sp") {
                    dl_link += "/"+key+"/"+video_info[key];
                }
            }

            // Append header
            dl_link += "/name/" + encodeURI(video_title) + ".mp4?ks=" + ks;
            getdlink(video_title, dl_link);
        }
    })
    }

function getdlink(video_title, req) {
    var dlink = GM_xmlhttpRequest({
        method: "GET",
        url: req,
        onerror: function(r) {
            console.log("Error when retriving download link.", "Detail: \n", r.responseText);
        },

        onreadystatechange: function(r) {
            if (this.readyState == this.HEADERS_RECEIVED) {
                var final_dlink = req;
                if (r.status == 200) {
                    final_dlink = r.finalUrl;
                }
                // Stop loading before it actually loads
                dlink.abort();
                // Black magic. Somehow we cannot have any non alphanumeric characters besides underscore in the name, or we will get 404.
                final_dlink = final_dlink.replace("/name/a.mp4", "/name/" + video_title.replace(/[\W_]+/g, "_") + ".mp4");
                console.log(video_title + ": " + final_dlink,"\n");
                addbutton(video_title, final_dlink);
            }
        }
    })
    }

function parseassets(assets) {
    //console.log(assets);
    var parser = new DOMParser();
    var xmlassets = parser.parseFromString(assets, "text/xml");

    var asset = {};

    for (var i=0; i<xmlassets.getElementsByTagName("item").length; i++) {
        var item_dict = {}
        var item = xmlassets.getElementsByTagName("item")[i]

        for (var ii=0; ii<item.getElementsByTagName("*").length; ii++) {
            var tag = item.getElementsByTagName("*")[ii];
            item_dict[tag.tagName] = tag.textContent;
        }

        if ("id" in item_dict) {
            asset[item_dict["id"]] = item_dict;
        }
    }

    return asset;
}


(function() {
    'use strict';

    // Your code here...

    var video_src = null;
    var entry_id = null;
    var video_title = null;

    if (window.top != window.self) {
        var checkExist = setInterval(function() {
            if (document.getElementById("kplayer_ifp") != null) {
                var player_if = document.getElementById("kplayer_ifp").contentWindow;
                if (player_if.document.getElementById("pid_kplayer") != null) {
                    video_src = player_if.document.getElementById("pid_kplayer").getAttribute("src");
                    entry_id = player_if.document.getElementById("pid_kplayer").getAttribute("kentryid");
                    if (video_src != null && entry_id != null) {
                        //console.log("src=" + video_src);
                        clearInterval(checkExist);
                        if (player_if.document.querySelectorAll('[data-plugin-name="titleLabel"]').length > 0) {
                            video_title = player_if.document.querySelectorAll('[data-plugin-name="titleLabel"]')[0].getAttribute("title").trim();
                        }
                        else if (document.getElementsByClassName("entryTitle").length > 0) {
                            video_title = document.getElementsByClassName("entryTitle")[0].textContent.trim();
                        }
                        getassets(video_title, video_src, entry_id);
                    }
                }
            } else {
                //console.log("still waiting...")
            }
        }, 1000); // check every 1000ms
    } else {
        // Not running in iframe
    }


})();