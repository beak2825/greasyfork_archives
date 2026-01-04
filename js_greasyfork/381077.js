// ==UserScript==
// @name     Mangadex-RPC
// @version  0.0.1M
// @author   Jinzulen
// @icon     https://mangadex.org/favicon-192x192.png
// @description Share your Mangadex reads with Discord RPC.
//
// @grant GM_notification
//
// @include https://mangadex.org/chapter/*
// @namespace https://greasyfork.org/users/287142
// @downloadURL https://update.greasyfork.org/scripts/381077/Mangadex-RPC.user.js
// @updateURL https://update.greasyfork.org/scripts/381077/Mangadex-RPC.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Grab chapter ID.
    var chapterID = ((window.location.href).replace("https://mangadex.org/chapter/", "")).split("/")[0];

    // Contact Mangadex API.
    var File = contactAPI("chapter", chapterID);
    var Manga = contactAPI("manga", File.manga_id).manga;

    // Establish DPS Connection.
    // WARNING: Having 2 readers open on different
    //          tabs confuses the RPC while having it
    //          altnerate between the two.
    var Socket = new WebSocket("ws://127.0.0.1:6680");

    var Execution = setInterval(() => {
        Socket.send(JSON.stringify(establishRPC(
            File, Manga,
            ((window.location.href).replace("https://mangadex.org/chapter/", "")).split("/")[1]
        )));
    }, 1000);

    Socket.onerror = function (Error)
    {
        console.error ("# [Mangadex-RPC] Error: " + Error);
    };

    Socket.onclose = function (Error)
    {
        console.error ("# [Mangadex-RPC] Error: " + Error);

        if (Error.code != "1000")
        {
            notifyUser("DPS Error", "It seems the DPS is not running on port 6680.");
        }
    };

    Socket.onopen = function ()
    {
        notifyUser(`Ch. ${File.chapter}`, "Establish DPS connection for " + Manga.title, "https://mangadex.org" + Manga.cover_url);
    };
})();

function establishRPC(File, Manga, Page)
{
    return {
        cid: "560723716435214357",

        rpc:
        {
            state: "Page",
            details: `${File.title ? "" : Manga.title + " -"} ${File.chapter ? "Ch. " + File.chapter : ""} ${File.title ? " - " + File.title : ""}`,

            partySize: Page,
            partyMax: (File.page_array).length,

            largeImageKey: "mangadex-512",
            largeImageText: File.title ? Manga.title : "",

            smallImageKey: "mangadex-512",
            smallImageText: "Mangadex RPC by Jinzulen."
        }
    };
};

function contactAPI(Endpoint, ID)
{
    try
    {
        // Formulate endpoint.
        Endpoint = "https://mangadex.org/api/" + Endpoint + "/" + ID;

        // Send GET request.
        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open("GET", Endpoint, false);
        xmlHTTP.send(null);

        // Parse & return JSON.
        return JSON.parse(xmlHTTP.responseText);
    } catch (E) {
        console.error (E);
    }
};

function notifyUser(Title, Message, Icon)
{
    Icon = Icon ? Icon : "https://mangadex.org/favicon-192x192.png";

    if (GM_info.scriptHandler === "Tampermonkey")
    {
        GM_notification(Message, Title, Icon);
    }

    if (GM_info.scriptHandler === "Greasemonkey")
    {
        if (!("Notification" in window))
        {
            console.log ("# [Mangadex-RPC] Error: This browser does not support desktop notifications.");
        }

        if (Notification.permission !== "denied")
        {
            Notification.requestPermission().then(function (Permission) {
                if (Permission === "granted")
                {
                    new Notification(Title, {
                        icon: Icon,
                        body: Message
                    });
                }
            });
        }
    }
};