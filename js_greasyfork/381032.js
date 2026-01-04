// ==UserScript==
// @author        Odd
// @connect       jellyneo.net
// @description   Opens a new page containing a full list of your account's unlocked avatars.
// @grant         GM.xmlHttpRequest
// @grant         GM_xmlhttpRequest
// @include       http://www.neopets.com/neoboards/preferences.phtml*
// @name          Avatar Lister
// @namespace     Odd@Clraik
// @version       1.0.1
// @downloadURL https://update.greasyfork.org/scripts/381032/Avatar%20Lister.user.js
// @updateURL https://update.greasyfork.org/scripts/381032/Avatar%20Lister.meta.js
// ==/UserScript==

var Tries = 3;

(function () {

    if (typeof $ === "undefined") $ = unsafeWindow.$;

    if (typeof GM_xmlhttpRequest == "undefined") GM_xmlhttpRequest = GM.xmlHttpRequest;

    $("select[name='activeav' i]").closest("table")
        .after("<table cellpadding=\"4\" cellspacing=\"0\" id=\"avatarLister\" style=\"border: 1px #000 solid; float: left;\"><tr><td class=\"contentModuleHeaderAlt\" style=\"border-bottom: 1px #000 solid;\"><strong>List</strong></td></tr><tr><td style=\"height: 71px; text-align: center;\"><input disabled id=\"avatarListerClickMe\" type=\"button\" value=\"Click me!\"></td></tr></table><div style=\"clear: both;\"></div>")
        .css("float", "left")
        .css("margin-right", "16px");

    var popup;
    var retired = {};
    var tries = Tries;

    function loadRetiredAvatars() {

        GM_xmlhttpRequest({

            onabort: onAbort,
            onerror: onError,
            onload: function (response) {

                for (var match, regex = /<img[^>]*src\=\"\/assets\/imgs\/avatars[^\"]*\"[^>]*alt\=\"([^\"]*)\"/gi; (match = regex.exec(response.responseText));)
                    retired[match[1].toLowerCase()] = true;

                document.getElementById("avatarListerClickMe").disabled = false;
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

        alert("Failed to load retired avatars because our requests to JellyNeo were aborted.");
    }

    function onError() {

        if (tries) {

            --tries;

            timeoutID = setTimeout(loadRetiredAvatars, 500);

            return;
        }

        alert("Failed to load retired avatars due to unexpected errors from JellyNeo.");
    }

    function onTimeout() {

        if (tries) {

            --tries;

            timeoutID = setTimeout(loadRetiredAvatars, 500);

            return;
        }

        alert("Failed to retired load avatars - our requests to JellyNeo timed out.");
    }

    loadRetiredAvatars();

    //GreaseMonkey compatible click
    document.getElementById("avatarListerClickMe")
        .addEventListener("click", function () {

            if (popup) {

                popup.close();

                popup = null;
            }

            var avatars = [];
            var writer = [];

            for (var i = 0, options = $("select[name='activeav' i]")[0].options, unlocked; i < options.length; i++) {

                if (unlocked) {

                    avatars.push({ imageUrl: options[i].value, name: options[i].innerHTML });

                    continue;
                }

                unlocked = (options[i].innerHTML == "------");
            }

            avatars.sort(function (avatar1, avatar2) {

                if (avatar1.name > avatar2.name) return 1;

                if (avatar1.name < avatar2.name) return -1;

                return 0;
            });

            writer.push("<!DOCTYPE html>");

            writer.push("<html>");

            writer.push("<head>");

            writer.push("<script>");

            writer.push("window.addEventListener(\"load\", function () { var list = false; var show = 1; document.addEventListener(\"keydown\", function (e) { if (e.keyCode == 112) { document.getElementById(\"listAll\").style.display = document.getElementById(\"listRetired\").style.display = \"none\"; if (list = !list) { document.getElementById(\"avatars\").style.display = \"none\"; document.getElementById(\"list\" + ((show == 1) ? \"All\" : \"Retired\")).style.display = \"\"; } else { document.getElementById(\"avatars\").style.display = \"\"; } } }); document.getElementById(\"showAll\").addEventListener(\"click\", function () { show = 1; for (var i = 0, nonretired = document.querySelectorAll(\".nonretired\"); i < nonretired.length; i++) { nonretired[i].style.display = \"\"; } if (list) { document.getElementById(\"listAll\").style.display = \"\"; document.getElementById(\"listRetired\").style.display = \"none\"; } }); document.getElementById(\"showRetired\").addEventListener(\"click\", function () { show = 2; for (var i = 0, nonretired = document.querySelectorAll(\".nonretired\"); i < nonretired.length; i++) { nonretired[i].style.display = \"none\"; } if (list) { document.getElementById(\"listAll\").style.display = \"none\"; document.getElementById(\"listRetired\").style.display = \"\"; } }); });");

            writer.push("</script>");

            writer.push("<style>");

            writer.push("body, textarea { font: 11px verdana; }");

            writer.push("#avatars > div { display: inline-block; font-weight: bold; margin: 8px; vertical-align: top; }");

            writer.push("#avatars > div > table { width: 200px; }");

            writer.push("#avatars > div > table > tbody > tr > td:first-child, #avatars > div > table > tbody > tr > td:first-child > img { height: 50px; width: 50px; }");

            writer.push("#avatars > div > table > tbody > tr > td:last-child { padding-left: 16px; text-align: left; }");

            writer.push("textarea { height: 480px; width: 640px; }");

            writer.push("</style>");

            writer.push("<title>" + avatars.length + " Avatar(s) Collected!</title>");

            writer.push("</head>");

            writer.push("<body>");

            writer.push("<a href=\"javascript:void;\" id=\"showAll\">All</a> | <a href=\"javascript:void;\" id=\"showRetired\">Retired</a><br><br>");

            writer.push("<div id=\"avatars\">");

            for (var i = 0; i < avatars.length; i++)
                writer.push("<div" + (retired[avatars[i].name.toLowerCase()] ? "" : " class=\"nonretired\"") + "><table cellpadding=\"0\" cellspacing=\"0\"><tr><td><img src=\"http://images.neopets.com/neoboards/avatars/" + avatars[i].imageUrl + ".gif\"></td><td>" + avatars[i].name + "</td></tr></table></div>");

            writer.push("</div>");

            writer.push("<textarea id=\"listAll\" style=\"display: none;\">");

            for (var i = 0; i < avatars.length; i++) writer.push(avatars[i].name + "\r\n");

            writer.push("</textarea>");

            writer.push("<textarea id=\"listRetired\" style=\"display: none;\">");

            for (var i = 0; i < avatars.length; i++)
                if (retired[avatars[i].name.toLowerCase()]) writer.push(avatars[i].name + "\r\n");

            writer.push("</textarea>");

            writer.push("</body>");

            writer.push("</html>");

            popup = window.open("about:blank", "_blank");

            popup.document.write(writer.join(""));

            popup.document.close();
        });
})();