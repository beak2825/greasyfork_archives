// ==UserScript==
// @name         Monkey Dating
// @version      1.1
// @description  This greasy script analyzes the interests of any person's dating profile and the current time and automatically generates a message based on them. The message doesn't look computer-generated. It's better than sending a copy-and-paste message to users, as they'll be suspicious if there's nothing in the message pertaining to them personally. I've gotten many dates and two girlfriends using this sneaky script. You get the option to edit and decide whether you want to send the message.
// It works on Plenty Of Fish (pof.com), Match.com, and OkCupid.com. For POF, it has the added benefit of keeping track of profiles you've already sent messages to or clicked a client-side button that you're not interested, so they don't show up in search results again and waste your time. It is important that you customize the keywords and messages instead of using the default ones to your own personality and interests. They are found in the "introduction", "messages", and "closing" variables. This script is in beta. The websites change every few months and break the script, until someone maintains it. I cannot guarantee to always keep it up-to-date with keeping up with the website changes. You may also need to customize the hours used to compute the message about the morning/afternoon/evening/nigh depending on your location. I have only tested this script in Google Chrome with Tampermonkey.
// @namespace    Monkey Dating
// @include      http://www.pof.com/advancedsearch.aspx*
// @include      http://www.pof.com/basicsearch.aspx*
// @include      http://www.pof.com/viewprofile.aspx*
// @include      https://www4.match.com/profile/about*
// @include      https://www.okcupid.com/profile/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/28648/Monkey%20Dating.user.js
// @updateURL https://update.greasyfork.org/scripts/28648/Monkey%20Dating.meta.js
// ==/UserScript==

// Personalize the variables "introduction", "messages", and "closing"
var introduction = "Hey! What's up? Your profile caught my eye.";
var messages =
[
    ["adventure", "adventures", "What fun adventures have you been on recently?"],
    ["travel", "traveled", "travelled", "traveling", "travelling", "travels", "Where have you traveled? I really like traveling to new places."],
    ["hike", "hiked", "hiking", "hikes", "Where have you gone hiking at? I really like hiking."],
    ["bicycle", "bicycling", "cycling", "How long have you been bicycling? I really enjoy it for the scenery and exercise."],
    ["cook", "cooked", "cooking", "cooks", "bake", "baked", "baking", "bakes", "baker", "bakers", "culinary school", "cooking school", "pastry", "pastries", "grill", "grilling", "What foods do you like to cook the most? I enjoy cooking for others and making a ton of different meals."],
    ["tennis", "How long have you been playing tennis? Tennis is one of my favorite sports."],
    ["rock climbing", "What got you interested in rock climbing? I really enjoy the exercise and fun of rock climbing."],
    ["bouldering", "What got you interested in bouldering?  I really enjoy the exercise and fun of bouldering."],
    ["video game", "video gaming", "video games", "Xbox", "PS3", "PS4", "Playstation", "Wii", "Nintendo", "What kind of video games do you like?"],
    ["yoga", "How long have you been doing yoga? I enjoy the exercise and relaxing parts of yoga."],
    ["wine", "winery", "What are your favorite wines? I enjoy drinking wine and trying new bottles and types."],
    ["beer", "What are your favorite beers? I enjoy drinking beer and trying new types."],
    ["running", "How often do you go running? I enjoy running for the exercise and trying to find new trails."],
    ["football", "What got you interested in football?"],
    ["baseball", "What got you interested in baseball?"],
    ["basketball", "What got you interested in basketball?"],
    ["fishing", "How often do you go fishing each year?"],
    ["volleyball", "How long have you been playing volleyball? I enjoy the teamwork and fun of volleyball."],
    ["soccer", "What got you interested in soccer?"],
    ["swimming", "How long have you been swimming?"],
    ["camp", "camping", "Where have you gone camping?"],
    ["cat", "cats", "kitten", "kittens", "How many cats do you have?"],
    ["dog", "dogs", "puppy", "puppies", "How many dogs do you have?"]
];
var closing = "";

var resetStatusElement, sentMessageElement, notMatchElement, livesFarAwayElement, contentElement;

function getDate()
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var min = today.getMinutes();

    if (dd < 10)
    {
        dd = '0' + dd;
    }
    if (mm < 10)
    {
        mm = '0' + mm;
    }
    if (hh < 10)
    {
        hh = '0' + hh;
    }
    if (min < 10)
    {
        min = '0' + min;
    }
    return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min;
}

// Returns the value of a URL (GET) parameter.
function getURLParameter(name, url)
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp(regexS, "i");
    var results = regex.exec(url);
    if( results === null )
    {
        return "";
    }
    return unescape(results[1]);
}

var profileId;

function setCharAt(str, index, chr)
{
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

String.prototype.splice = function(idx, rem, s)
{
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

function getMessage()
{
    var fullMessage = introduction,
    addedAtLeastOneItem = false;

    // Turn on design mode so we can highlight results
    document.designMode = "on";

    // For each of the message arrays
    for (var i = 0; i < messages.length; i++)
    {
        var message = messages[i];

        // Check each word in the message array
        for (var j = 0; j < message.length - 1; j++)
        {
            var phrase = message[j];

            // Get the body element
            var selection = window.getSelection();
            selection.collapse(document.body, 0);

            // If we found the phrase
            var matchCase = false;
            var searchUpward = false;
            var wrapAround = true;
            var wholeWord = true;
            if (window.find(phrase, matchCase, searchUpward, wrapAround, wholeWord))
            {
                document.execCommand("HiliteColor", false, "#E0FF1F");
                selection.collapseToEnd();

                fullMessage += " ";
                var computedMessage = message[message.length - 1];

                if (addedAtLeastOneItem)
                {
                    fullMessage += "Also, ";
                    computedMessage = setCharAt(computedMessage, 0, computedMessage[0].toLowerCase());
                }

                fullMessage += computedMessage;
                addedAtLeastOneItem = true;
                break;
            }
        }
    }

    // Turn design mode back off
    document.designMode = "off";

    if (!addedAtLeastOneItem)
    {
        fullMessage += " What do you like to do for fun?";
    }

    fullMessage += " Hope you're having a good ";

    // Wish a good morning from 3am to 12pm, good day from 12pm to 5pm, and good evening 5pm-8pm, and good night at other times.
    var hours = new Date().getHours();
    if (hours <= 3 || hours >= 20)
    {
        fullMessage += "night";
    }
    else if (hours < 12)
    {
        fullMessage += "morning";
    }
    else if (hours < 17)
    {
        fullMessage += "day";
    }
    else if (hours < 20)
    {
        fullMessage += "evening";
    }
    else
    {
        alert("Unexpected error processing hour " + hours);
    }

    fullMessage += "! " + closing;

    return fullMessage;
}

function updateStatusLinks()
{
    var neutralColor = "#105F75", neutralBackground = "white", activeColor = "black", activeBackground = "red";

    resetStatusElement.style.color = neutralColor;
    sentMessageElement.style.color = neutralColor;
    notMatchElement.style.color = neutralColor;
    livesFarAwayElement.style.color = neutralColor;

    resetStatusElement.style.backgroundColor = neutralBackground;
    sentMessageElement.style.backgroundColor = neutralBackground;
    notMatchElement.style.backgroundColor = neutralBackground;
    livesFarAwayElement.style.backgroundColor = neutralBackground;

    sentMessageElement.innerHTML = "Sent message ";
    notMatchElement.innerHTML = "Not a match ";
    livesFarAwayElement.innerHTML = "Lives too far away ";

    var profileStatus = GM_getValue(profileId);
    if (profileStatus === undefined)
    {
        return;
    }
    if (profileStatus[0] == "s")
    {
        sentMessageElement.style.color = activeColor;
        sentMessageElement.style.backgroundColor = activeBackground;
        sentMessageElement.innerHTML += profileStatus.substring(2);
    }
    else if (profileStatus[0] == "n")
    {
        notMatchElement.style.color = activeColor;
        notMatchElement.style.backgroundColor = activeBackground;
        notMatchElement.innerHTML += profileStatus.substring(2);
    }
    else if (profileStatus[0] == "l")
    {
        livesFarAwayElement.style.color = activeColor;
        livesFarAwayElement.style.backgroundColor = activeBackground;
        livesFarAwayElement.innerHTML += profileStatus.substring(2);
    }
    else
    {
        alert("The profile status with the contents \"" + profileStatus + "\" was not understood.");
    }
}

function resetStatus()
{
    GM_deleteValue(profileId);
    updateStatusLinks();
    return false;
}

function sentMessage()
{
    GM_setValue(profileId, "s," + getDate());
    updateStatusLinks();
    return false;
}

function sentMessageButton()
{
    sentMessage();
    return true;
}

function notMatch()
{
    GM_setValue(profileId, "n," + getDate());
    updateStatusLinks();
    return false;
}

function livesFarAway()
{
    GM_setValue(profileId, "l," + getDate());
    updateStatusLinks();
    return false;
}

function importUserInfo()
{
    if (messageElement !== null)
    {
        var lines = messageElement.value.split("\n"), i;
        for (i = 0; i < lines.length; i++)
        {
             var line = lines[i];

            // Skip blank lines
            if (line.length === 0)
            {
                continue;
            }

            var pieces = line.split(",");
            if (pieces.length != 3)
            {
                alert("The input line \"" + line + "\" is invalid, so the import will be stopped.");
                break;
            }

            var profileId = pieces[0];
            if (!/^\d+$/.test(profileId))
            {
                alert("The profile ID \"" + profileId + "\" is not an integer, so the import will be stopped.");
                break;
            }
            var value = pieces[1] + "," + pieces[2];
            GM_setValue(profileId, value);
        }

        alert(i + " lines were imported.");
        updateStatusLinks();
    }

    return false;
}

function exportUserInfo()
{
    if (messageElement !== null)
    {
        messageElement.value = "";
        var values = GM_listValues();
        for (var i = 0; i < values.length; i++)
        {
            var key = values[i];
            messageElement.value += key + "," + GM_getValue(key);
            if (i < values.length - 1)
            {
                messageElement.value += "\n";
            }
        }
    }
    return false;
}

function getElementsStartsWithId(tagname, id)
{
    var children = document.body.getElementsByTagName(tagname);
    var elements = [], child;
    for (var i = 0, length = children.length; i < length; i++)
    {
        child = children[i];
        if (child.id.substr(0, id.length) == id)
            elements.push(child);
    }

    return elements;
}

try
{
    if (window.location.href.indexOf("pof.com/viewprofile.aspx") != -1)
    {
        profileId = getURLParameter("profile_id", window.location.href);
        contentElement = document.getElementById("container");

        // Generate message
        var messageElement = document.getElementsByName("message")[0];
        if (messageElement !== null)
        {
            var message = getMessage();

            // The previous function modifies the DOM, so we need to set the messageElement again
            messageElement = document.getElementsByName("message")[0];
            messageElement.value = message;
        }

        // Create elements for working with the profile's status
        document.getElementsByClassName("username-bar")[0].innerHTML += "<hr><br><span style='padding: 10px; font-size: 16pt;'><a id='resetStatus' href='#'>Reset status</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='sentMessage' href='#'>Sent message</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='notMatch' href='#'>Not a match</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='livesFarAway' href='#'>Lives too far away</a></span><br><br><div style='font-size: 8pt'><a id='importUserInfo' href='#'>Import all user info</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='exportUserInfo' href='#'>Export all user info</a></div>";
        resetStatusElement = document.getElementById("resetStatus");
        sentMessageElement = document.getElementById("sentMessage");
        notMatchElement = document.getElementById("notMatch");
        livesFarAwayElement = document.getElementById("livesFarAway");

        resetStatusElement.onclick = resetStatus;
        sentMessageElement.onclick = sentMessage;
        notMatchElement.onclick = notMatch;
        livesFarAwayElement.onclick = livesFarAway;

        updateStatusLinks();

        document.getElementById("importUserInfo").onclick = importUserInfo;
        document.getElementById("exportUserInfo").onclick = exportUserInfo;

        // Add a hook into the send message button so that the status is updated
        var sendMessageElement = document.getElementsByName("sendmessage")[1];
        if (sendMessageElement !== null)
        {
            sendMessageElement.onclick = sentMessageButton;
        }
    }
    else if (window.location.href.indexOf("pof.com/advancedsearch.aspx") != -1 || window.location.href.indexOf("pof.com/basicsearch.aspx") != -1)
    {
        var imgElements = document.getElementsByTagName("img");
        var resultsFiltered = 0;

        // Remove profiles that have a saved status
        for (var i = 0; i < imgElements.length; i++)
        {
            var imgElement = imgElements[i];
            var linkElement = imgElement.parentNode;
            if (linkElement.href !== null && linkElement.href !== undefined && linkElement.href.indexOf("viewprofile.aspx") != -1)
            {
                var profileId = getURLParameter("profile_id", linkElement.href);
                var profileStatus = GM_getValue(profileId);
                if (profileStatus !== undefined)
                {
                    var resultElement = linkElement.parentNode.parentNode.parentNode;
                    resultElement.style.display = "none";
                    resultsFiltered++;
                }
            }
        }

        var searchResultsElement = document.getElementById("searchresults");
        if (searchResultsElement !== null)
        {
            searchResultsElement.innerHTML = "<span style='background-color: lightblue; padding: 10px; font-size: 11pt;'>Results filtered: " + resultsFiltered + "</span><br><br>" + searchResultsElement.innerHTML;
        }
    }
    else if (window.location.href.toLowerCase().indexOf("https://www4.match.com/profile/about") != -1)
    {
        contentElement = document.getElementById("app");

        // Generate message
        var messageElement = document.getElementsByTagName("textarea")[0];

        if (messageElement !== null)
        {
            var message = getMessage();
            var messageElements = document.getElementsByTagName("textarea");
            for (var i = 0; i < messageElements.length; i++)
            {
                messageElements[i].value = message;
            }
        }
    }
    else if (window.location.href.indexOf("https://www.okcupid.com/profile/") != -1)
    {
        contentElement = document.getElementById("main_content");

        // Generate message
        var messageElement = getElementsStartsWithId("textarea", "message_");
        if (messageElement !== null && messageElement.length > 0)
        {
            var message = getMessage();
            messageElement = getElementsStartsWithId("textarea", "message_");
            messageElement[0].value = message;
        }
    }
}
catch (err)
{
    alert("An error occurred while running the Monkey Dating script:\r\n" + err);

    throw err;
}
