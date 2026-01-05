// ==UserScript==
// @name         Skial Admin Toolset
// @namespace    D3xus
// @version      1.0.1
// @description  Adds useful tools and features for Skial administrators
// @author       D3xus
// @match        https://www.skial.com/threads/*
// @match        https://www.skial.com/sourcebans/*
// @match        https://stats.skial.com/*
// @match        http://stats.skial.com/*
// @match        stats.skial.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      skial.com
// @downloadURL https://update.greasyfork.org/scripts/21063/Skial%20Admin%20Toolset.user.js
// @updateURL https://update.greasyfork.org/scripts/21063/Skial%20Admin%20Toolset.meta.js
// ==/UserScript==
(function() {
    // Global variables for determining new ban lengths, given the old ban length

    // Array of acceptable ban length values
    var banLengthArray = ["1 d", "3 d", "1 wk", "1 mo", "Permanent"];

    // Each key here corresponds to a value in the above array. The value is the index that will be selected in SourceBans' "Ban Length" dropdown
    var banLengthObjectMap = {"1 d": 13, "3 d": 15, "1 wk": 19, "1 mo": 22, "Permanent": 0};
    // Skial Forums
    if (window.location.href.indexOf("skial.com/threads/") > -1) {
        // Only do anything if we're in the reports subforum
        if (document.querySelector("fieldset.breadcrumb > span > span:last-of-type span").innerHTML === "Reports") {
            // Variables accessible by entire if/else statement
            var post, username, steamID, reason;

            // Automatic Report made by Reporter, makes for consistent parsing of information
            if (document.querySelector(".username:first-of-type").innerHTML === "Reporter") {
                post = document.querySelector("li.message[data-author='Reporter'] blockquote");
                username = post.innerHTML.substr(0, post.innerHTML.indexOf("<br>")).trim();
                steamID = document.querySelector("li.message[data-author='Reporter'] blockquote a:first-of-type").innerHTML.trim();
                reason = document.querySelector("li.message[data-author='Reporter'] blockquote .UnhiddenContent:nth-of-type(2)").nextSibling.textContent.trim();
            }
            // User report, these are also consistent across all reports but in a different way
            else {
                post = document.querySelector("li.message:first-of-type blockquote");
                username = post.querySelector("br:nth-of-type(5)").previousSibling.textContent.trim();
                steamID = post.querySelector("br:nth-of-type(7)").nextSibling.textContent.trim();
                reason = post.querySelector("br:nth-of-type(1)").nextSibling.textContent.trim();
            }
            // Array of possible ban/silence reasons. These won't be the actual values used in SourceBans, but are used to sort the type of ban between a ban or silence.
            var banReasons = ["racist name", "grief", "griefing", "hack", "hacking", "aimbot", "silent aim", "avoiding afk manager", "friendly", "friendlying", "exploit", "map exploit", "map exploiting", "lr denial", "freekill"];
            var comReasons = ["racism", "racist", "n word", "mic spam", "micspam", "voice spam", "spam", "vote abuse", "voteabuse", "report abuse", "reportabuse", "report spam", "reportspam", "ghosting", "ghost", "vote spam", "n word", "racism (n word)"];
            var banType;

            // If the ban reason exists in the array of possible silence values, set the ban type equal to that
            if (comReasons.indexOf(reason.trim().toLowerCase()) > -1) {
                banType = "commslist";
            }
            // Fallback to treat it like a ban if it was not identified as a comm
            else {
                banType = "banlist";
            }

            // Intrapage variable to specify that we came from Skial Reports subforum
            GM_setValue("referrer", "reports");

            // Send our data to loadUserBans to load the appropriate information on the page
            loadUserBans(username, steamID, banType, reason);
        }
    }

    // Skial Stats
    else if (window.location.href.indexOf("stats.skial.com/#summary/player/SteamID/All") > -1) {
        // Skial Stats has a small lag between loading and actually displaying user information. Offset the function load by 1 millisecond
        window.setTimeout(function() {
            // Username/Steam ID is more straightforward to parse, but we don't have access to ban reason here, therefore no ban length can be determined.
            var username = document.querySelector("name-search-list table tbody tr:first-of-type td:nth-of-type(3) a").innerHTML.trim();
            var steamID = document.querySelector("name-search-list table tbody tr:first-of-type td:nth-of-type(2)").innerHTML.trim();

             // Intrapage variable to specify that we came from Skial Stats
            GM_setValue("referrer", "stats");

            // Insert a new row into the existing player table
            var banTable = document.querySelector("name-search-list table");
            var sourceBanRow = banTable.insertRow();

            // Add two new cells to this new row and add two new links (since we have no way of differentiating)
            sourceBanRow.insertCell().innerHTML = "Ban Links";
            sourceBanRow.insertCell().innerHTML = "<a href='https://skial.com/sourcebans/index.php?p=admin&c=bans&custom=true&source=stats'>Ban</a>";
            sourceBanRow.insertCell().innerHTML = "<a href='https://skial.com/sourcebans/index.php?p=admin&c=comms&custom=true&source=stats'>Silence</a>";
            sourceBanRow.insertCell().innerHTML = "<a href='https://skial.com/search/1/?q=" + steamID + "&o=date'>Search Steam ID on Skial Forums</a>";

            // Set intrapage values for SourceBans to later acquire
            GM_setValue("customBanInfo", true);
            GM_setValue("username", username);
            GM_setValue("steamID", steamID);
        }, 100);
    }
    // SourceBans
    else if (window.location.href.indexOf("skial.com/sourcebans/index.php?p=admin") > -1) {
        // Only go forward if we've set our internal variable and if a custom GET argument is present
        // That way it's possible to have multiple SourceBan windows open without combining multiple variable sessions
        if (GM_getValue("customBanInfo") === true && ($_GET("custom") === "true")) {
            // If the origin is the Skial Report Subforum (or if the user clicked on their Stats page and then went back to Skial Reports to click that link instead of the Stats one)
            if ((GM_getValue("referrer") === "reports" && $_GET("source") === "reports") || ((GM_getValue("referrer") === "stats") && $_GET("source") === "reports")) {
                // If the target action is communications
                if (GM_getValue("banDest") === "comms") {
                    // Edit the values in the HTML input form with our intrapage values
                    document.getElementById("nickname").value = GM_getValue("username");
                    document.getElementById("steam").value = GM_getValue("steamID");
                    document.querySelector("select.submit-fields").selectedIndex = 2;
                    document.getElementById("listReason").selectedIndex = 8;
                    document.getElementById("dreason").setAttribute("style", "display: block;");
                    document.getElementById("txtReason").value = GM_getValue("banReason");
                    document.getElementById("banlength").selectedIndex = banLengthObjectMap[GM_getValue("banLength")];
                }
                // The only other action is a ban, catch it and anything else here
                else {
                    // Edit the values in the HTML input form with our intrapage values
                    document.getElementById("nickname").value = GM_getValue("username");
                    document.getElementById("steam").value = GM_getValue("steamID");

                    // We can preselect an appropriate value in the dropdown here, based on the ban reason
                    switch (GM_getValue("banReason")) {
                        case "Aimbot":
                            document.getElementById("listReason").selectedIndex = 1;
                            break;
                        case "Griefing":
                            document.getElementById("listReason").selectedIndex = 16;
                            break;
                        case "Wallhack":
                            document.getElementById("listReason").selectedIndex = 3;
                            break;
                        case "Racist Name":
                            document.getElementById("listReason").selectedIndex = 13;
                            break;
                        default:
                            document.getElementById("listReason").selectedIndex = 22;
                            document.getElementById("dreason").setAttribute("style", "display: block;");
                            document.getElementById("txtReason").value = GM_getValue("banReason");
                            break;
                    }
                    document.getElementById("banlength").selectedIndex = banLengthObjectMap[GM_getValue("banLength")];
                }

                // Override existing onclick() function for the "Add Ban/Block" button
                document.getElementById("aban").onclick = function() {
                    ProcessBan(); // Internal SourceBans function to prepare and execute the action

                    // Delete our custom values from memory
                    GM_deleteValue("customBanInfo");
                    GM_deleteValue("username");
                    GM_deleteValue("steamID");
                    GM_deleteValue("banReason");
                    GM_deleteValue("banLength");
                    GM_deleteValue("referrer");
                };
            }

            // If we came from Skial Stats
            else if (GM_getValue("referrer") === "stats") {
                // Edit the values in the HTML input form with our intrapage values
                document.getElementById("nickname").value = GM_getValue("username");
                document.getElementById("steam").value = GM_getValue("steamID");

                // Override existing onclick() function for the "Add Ban/Block" button
                document.getElementById("aban").onclick = function() {
                    ProcessBan(); // Internal SourceBans function to prepare and execute the action

                    // Delete our custom values from memory
                    GM_deleteValue("customBanInfo");
                    GM_deleteValue("username");
                    GM_deleteValue("steamID");
                    GM_deleteValue("referrer");
                };
            }
        }
    }

    // Function to display ban information, in the form of an infobox on the forum & two links on stats page, to the admin
    function loadUserBans(username, steamID, banType, banReason) {
        // banReason and banType are optional arguments, set them equal to their original values or an empty string if they do or do not exist, respectively
        banReason = banReason || "";
        banType   = banType || "";

        // Execute an asynchronous call to the SourceBans page based on the identified ban type and user
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.skial.com/sourcebans/index.php?p=" + banType + "&searchText=" + steamID,
            onload: function(response) { // Callback function that we need to parse
                var banTable = document.createElement("html"); // Create empty HTML element to load our response object into, this is never seen by the user
                banTable.innerHTML = response.responseText; // Load banTable's code
                banTable = banTable.querySelector("#banlist table"); // Only grab the ban table of all user bans

                // Declaring some empty variables to be used later
                var banLength = null;
                var newBan = false;

                // If the user has never been banned before:
                if (banTable !== null) {
                    // Store all banTable rows as elements of an array, and remove useless rows inherent to SourceBan formatting
                    var banTableRows = [].slice.call(banTable.rows);
                    banTableRows = banTableRows.filter(function(row) {
                        return row.classList.contains("opener");
                    });

                    // userBan identifies a ban made by a human, not CONSOLE. False for now.
                    var userBan = false;

                    // Identify the most recent ban in order to get its length, which we will later increment to the next appropriate ban length
                    banTableRows.forEach(function(row) {
                        // The banTable is formatted differently for comm blocks versus normal bans (extra column of checkboxes in ban page, comms doesn't have this). We need to parse DOM differently as a result.
                        if (banType === "commslist") { // If the ban is a comm block
                            if ((row.querySelector("td:nth-of-type(4)").innerText.trim() !== "CONSOLE") && (userBan === false)) { // If this row's banner was not CONSOLE and we haven't already identified the most recent human ban
                                banLength = row.querySelector("td:nth-of-type(5)").innerText.trim(); // Parse DOM for the most recent ban length
                                userBan = true; // We've found a human ban
                            }
                        }
                        else { // If the ban is a normal player block
                            if ((row.querySelector("td:nth-of-type(5)").innerText.trim() !== "CONSOLE") && (userBan === false)) { // If this row's banner was not CONSOLE and we haven't already identified the most recent human ban
                                banLength = row.querySelector("td:nth-of-type(6)").innerText.trim(); // Parse DOM for the most recent ban length
                                userBan = true; // We've found a human ban
                            }
                        }
                    });

                    // If the user has been banned before but they were all CONSOLE bans, we'll set the first real ban to be 1 day and indicate as much
                    if (banLength === null) {
                        banLength = "1 d";
                        newBan = true;
                    }
                }
                // If the user has never been banned before at all, set their new ban length to be one day (this won't be overridden by our later code)
                else {
                    banLength = "1 d";
                    newBan = true;
                }

                // Arrays of possible alternative ban values, if their bans have expired or revoked
                var banLengthExpiredArray = ["1 d (Expired)", "3 d (Expired)", "1 wk (Expired)", "1 mo (Expired)", "Permanent"];
                var banLengthUnbannedArray = ["1 d (Unbanned)", "3 d (Unbanned)", "1 wk (Unbanned)", "1 mo (Unbanned)", "Permanent (Unbanned)"];

                // If the reason for the ban is Aimbot, Wallhack, or Hacking, set banLength to be permanent
                if (banReason === "Aimbot" || banReason === "Wallhack" || banReason === "Hacking") {
                    banLength = "Permanent";
                }
                // If the previously identified banLength is not permanent, and this is not the first time the user has been banned
                else if (banLength !== "Permanent" && newBan !== true) {
                    // Identify what their previous ban length was, and set the new ban length to be one greater than that value in the banLengthArray
                    if (banLengthArray.indexOf(banLength) > -1) {
                        banLength = banLengthArray[banLengthArray.indexOf(banLength) + 1];
                    }
                    else if (banLengthExpiredArray.indexOf(banLength) > -1) {
                        banLength = banLengthArray[banLengthExpiredArray.indexOf(banLength) + 1];
                    }
                    else if (banLengthUnbannedArray.indexOf(banLength) > -1) {
                        banLength = banLengthArray[banLengthUnbannedArray.indexOf(banLength) + 1];
                    }
                }

                // Ban Destination for SourceBans
                var banDest;

                // If the user will be silenced, set destination to be comms
                if (banType === "commslist") {
                    banDest = "comms";
                }
                // If the user will be banned, set destination to be comms
                else if (banType === "banlist") {
                    banDest = "bans";
                }

                // If the referrer of this function was Skial Reports subforum
                if (GM_getValue("referrer") === "reports") {

                    // Create the container for our custom HTML element and set some properties
                    var banInfoElement = document.createElement("div");
                    banInfoElement.setAttribute("class", "messageUserInfo");
                    var banInfoElementContainer = document.createElement("div");
                    banInfoElementContainer.setAttribute("class","messageUserBlock");
                    banInfoElementContainer.setAttribute("id","custom-ban-info");

                    // Header for the container
                    var customInfoH1 = document.createElement("h1");
                    customInfoH1.innerHTML = "Skial Custom Admin Info";

                    // Create an interior table, easier to organize content within it
                    var customInfoTable = document.createElement("table");
                    customInfoTable.setAttribute("id", "custom-ban-table");

                    // First row contains username
                    var username1Row = customInfoTable.insertRow();
                    var username2Row = customInfoTable.insertRow();
                    username1Row.insertCell().innerHTML = "Username: ";
                    username2Row.insertCell().innerHTML = username;

                    // Second row contains Steam ID
                    var steamID1Row = customInfoTable.insertRow();
                    var steamID2Row = customInfoTable.insertRow();
                    steamID1Row.insertCell().innerHTML = "Steam ID: ";
                    steamID2Row.insertCell().innerHTML = steamID;

                    // Third row contains Ban Reason
                    var banReason1Row = customInfoTable.insertRow();
                    var banReason2Row = customInfoTable.insertRow();
                    banReason1Row.insertCell().innerHTML = "Ban Reason: ";
                    banReason2Row.insertCell().innerHTML = banReason;

                    // Fourth row contains new Ban Length
                    var banLength1Row = customInfoTable.insertRow();
                    var banLength2Row = customInfoTable.insertRow();
                    banLength1Row.insertCell().innerHTML = "New Ban Length: ";
                    banLength2Row.insertCell().innerHTML = banLength;

                    // Last row contains a link to SourceBans with the destination (ban/comms) and custom GET variable.
                    var sourceBan1Row = customInfoTable.insertRow();
                    var sourceBan2Row = customInfoTable.insertRow();
                    sourceBan1Row.insertCell().innerHTML = "Sourceban Link: ";
                    sourceBan2Row.insertCell().innerHTML = "<a href='https://www.skial.com/sourcebans/index.php?p=admin&c=" + banDest + "&custom=true&source=reports'>" + (banDest === "bans" ? "Ban" : "Silence") + " Now</a>";

                    // Add everything to the DOM
                    banInfoElementContainer.appendChild(customInfoH1);
                    banInfoElementContainer.appendChild(customInfoTable);
                    banInfoElement.appendChild(banInfoElementContainer);
                    document.querySelector(".messageUserInfo:first-of-type").appendChild(banInfoElement);

                    // Set our intrapage values for SourceBans to later acquire
                    GM_setValue("customBanInfo", true);
                    GM_setValue("username", username);
                    GM_setValue("steamID", steamID);
                    GM_setValue("banReason", banReason);
                    GM_setValue("banLength", banLength);
                    GM_setValue("banDest", banDest);

                    // Set CSS properties of our custom infobox and inject them to DOM
                    var infoboxStyles = [
                        '#custom-ban-info {',
                        'margin-top: 20px;',
                        '}',
                        '#custom-ban-info h1 {',
                        'font-size: 15px;',
                        '}',
                        '#custom-ban-table {',
                        'width: 100%;',
                        '}',
                        '#custom-ban-table tr:nth-child(odd) td, #custom-ban-info h1 {',
                        'font-weight: bold;',
                        '}',
                        '#custom-ban-info h1:first-of-type {',
                        'background-color: #f0f7fc;',
                        'border-radius: 5px;',
                        'margin-bottom: 5px;',
                        'padding: 5px 0;',
                        '}'
                    ].join('');
                    GM_addStyle(infoboxStyles);
                }
            },
            onerror: function(err) { // Catch any errors
                console.log(err);
            }
        });
    }
    // Helper function to identify GET parameters, source: https://www.creativejuiz.fr/blog/en/javascript-en/read-url-get-parameters-with-javascript
    function $_GET(param) {
        var vars = {};
        window.location.href.replace( location.hash, '' ).replace(
            /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
            function( m, key, value ) { // callback
                vars[key] = value !== undefined ? value : '';
            }
        );

        if ( param ) {
            return vars[param] ? vars[param] : null;
        }
        return vars;
    }
})();