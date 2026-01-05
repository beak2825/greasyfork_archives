/// <reference path="Typings/jquery.d.ts" />
/// <reference path="Typings/mixify.d.ts" />
// ==UserScript==
// @name        Fic - Mixify Auto Welcome Script (Tijn Remix)
// @namespace   Booth
// @include     http://www.mixify.com/*/live/*
// @version     1.7.2
// @grant       none
// @description This script can be used on Mixify.com while streaming your DJ set. The main reason why I created this script is that I couldn't see every single person who enters the stream so I thought it could be nice if a script can announce in chat who entered the stream with a warm welcome message.
// @downloadURL https://update.greasyfork.org/scripts/17022/Fic%20-%20Mixify%20Auto%20Welcome%20Script%20%28Tijn%20Remix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/17022/Fic%20-%20Mixify%20Auto%20Welcome%20Script%20%28Tijn%20Remix%29.meta.js
// ==/UserScript==
// TODO Split settings and implementation scripts
///////////////////////////////////////////////////////////
/////                    SETTINGS                     /////
///////////////////////////////////////////////////////////
/** Turn debug mode on/off (true/false) */
var debugMode = true;
/** Here are all the messages configured */
var messageConfiguration = {
    /** A collection of joining messages. {0} = placeholder for name of the user */
    onJoining: ["Hey {0}", "hey {0}", "sup {0}", "oi {0}", "Hai der, {0}", "hello {0}", "ayy {0}!", "Ermagerd! It's {0}"],
    /** A collection of rejoining messages. {0} = placeholder for name of the user */
    onRejoining: ["wb {0}"],
    /** A collection of messages for special users, based on ID and not on name */
    specialUsers: [
        { id: "world", onJoining: "Wow hello world", onRejoining: "Woot welcome back world!" }
    ]
};
/** Ignore these users by name */
var ignoredUsers = ["Guest"];
/** The minimum amount of time (in milliseconds) before a message gets send */
var messageDelay = 2000;
/** The maximum timespan (in milliseconds) in which the message will be send, after the delay */
var messageMaxTimespan = 18000;
/** Characters that can be removed from a name */
var trimmableCharacters = ["-", "_", "=", ".", ":", "[", "]", "<", ">"];
///////////////////////////////////////////////////////////
/////                   USER STUFF                    /////
///////////////////////////////////////////////////////////
/** Collection class for users */
var UserCollection = (function () {
    function UserCollection() {
        this.users = [];
        this.disallowedUsers = [];
    }
    /**
     * Add a new user
     * @param user User object
     */
    UserCollection.prototype.add = function (user) {
        logToConsole("Trying to add {0}".format(user.name.fullName));
        if (this.userIsAllowed(user)) {
            if (!this.userExists(user.id)) {
                this.users.push(user);
                logToConsole("Succesfully added {0} ({1})".format(user.name.fullName, user.id));
                user.message(messageConfiguration.onJoining);
            }
            else {
            }
        }
        else {
            logToConsole("{0} is not allowed to be added".format(user.name.fullName));
        }
    };
    /**
     * Check if an user is allowed
     * @param name Name of the user
     * @returns { User is allowed }
     */
    UserCollection.prototype.userIsAllowed = function (user) {
        var userAllowedByName = $.inArray(user.name.fullName, this.disallowedUsers) === -1;
        var userAllowedById = $.inArray(user.id, this.disallowedUsers) === -1;
        return userAllowedByName && userAllowedById;
    };
    /**
     * Check if user already exists in the array
     * @param id ID of the user
     * @returns { User exists }
     */
    UserCollection.prototype.userExists = function (id) {
        for (var _i = 0, _a = this.users; _i < _a.length; _i++) {
            var user = _a[_i];
            if (user.id === id) {
                return true;
            }
        }
        return false;
    };
    return UserCollection;
})();
/** User class */
var User = (function () {
    function User(id, name) {
        this.id = id;
        this.name = new Name(name);
        this.messageName = formatName(this.name);
        this.active = true;
        this.isDj = $("#djSilhouette").data("querystring").split("=")[1] === this.id;
    }
    /**
     * Greets an user
     * @param messages Array of possible greetings
     */
    User.prototype.message = function (messages) {
        var _this = this;
        // Determine timeout in ms
        var timeout = messageDelay + (Math.random() * messageMaxTimespan);
        window.setTimeout(function () {
            // First check if user is still in the room, would be silly if not!
            if (_this.isStillInRoom()) {
                logToConsole("Messaging {0} ({1})".format(_this.name.fullName, _this.id));
                // Pick a greeting and send it
                var message = messages[Math.floor(Math.random() * messages.length)];
                sendChatMessage(message.format(_this.messageName));
            }
        }, timeout);
    };
    /**
     * Checks if this user is still present in the room
     * @returns { user is in the room }
     */
    User.prototype.isStillInRoom = function () {
        if (this.isDj) {
            return true;
        }
        var searchResult = $('#avatar_{0}'.format(this.id));
        if (searchResult.length === 0) {
            this.active = false;
        }
        return searchResult.length > 0;
    };
    return User;
})();
///////////////////////////////////////////////////////////
/////                   NAME STUFF                    /////
///////////////////////////////////////////////////////////
var NameImportanceOptions;
(function (NameImportanceOptions) {
    NameImportanceOptions[NameImportanceOptions["None"] = 0] = "None";
    NameImportanceOptions[NameImportanceOptions["Low"] = 1] = "Low";
    NameImportanceOptions[NameImportanceOptions["Moderate"] = 2] = "Moderate";
    NameImportanceOptions[NameImportanceOptions["High"] = 3] = "High";
})(NameImportanceOptions || (NameImportanceOptions = {}));
/** Name implementation */
var Name = (function () {
    function Name(fullName) {
        this.fullName = fullName;
        this.capsAreMeaningful = this.setCapsAreMeaningful(fullName);
        this.createNameParts();
    }
    /**
     * Determines if uppercase characters mean anything in the grand scheme of things
     * @param text The text
     */
    Name.prototype.setCapsAreMeaningful = function (fullName) {
        var amountOfCaps = 0;
        var position = 0;
        var character;
        while (position < fullName.length) {
            character = fullName.charAt(position);
            if (!isNumeric(character) && isUpperCase(character)) {
                amountOfCaps++;
            }
            position++;
        }
        return amountOfCaps / fullName.length <= 0.5;
    };
    /** This extracts name parts out of full name, both parts with and without capital-processing */
    Name.prototype.createNameParts = function () {
        this.parts = [];
        this.fullParts = [];
        // First trim the full name, then split it on space-character, then filter out all zero-length entries
        var trimmedParts = trimText(this.fullName, trimmableCharacters).split(" ").filter(function (x) { return x.length > 0; });
        var parts = [];
        // Iterate over all the trimmed parts
        var position = 0;
        for (var _i = 0; _i < trimmedParts.length; _i++) {
            var trimmedPart = trimmedParts[_i];
            // Split each part on capitals and push them to the 'parts' collection
            this.splitPartsOnCapitals(trimmedPart).filter(function (x) { return x.length > 0; }).map(function (x) { return parts.push(x); });
            // Create a full name part and push it to the collection;
            var fullPart = new NamePart(trimmedPart, position, this);
            this.fullParts.push(fullPart);
            position++;
        }
        // Iterate over all the parts
        position = 0;
        for (var _a = 0; _a < parts.length; _a++) {
            var part = parts[_a];
            // Create a namepart and push it to the collection
            var namePart = new NamePart(part, position, this);
            this.parts.push(namePart);
            position++;
        }
    };
    Name.prototype.splitPartsOnCapitals = function (part) {
        var results = [];
        var remaining = part;
        var consecutiveCaps = 0;
        var position = 0;
        var character;
        while (remaining.length > 0) {
            if (position === remaining.length) {
                results.push(remaining);
                remaining = "";
            }
            character = remaining.charAt(position);
            if (!isNumeric(character) && isUpperCase(character)) {
                if (position !== 0 && consecutiveCaps === 0) {
                    // Add new part
                    results.push(remaining.substring(0, position));
                    // Reset
                    remaining = remaining.substring(position, remaining.length);
                    position = 0;
                    consecutiveCaps = 0;
                }
                else {
                    position++;
                    consecutiveCaps++;
                }
            }
            else {
                if (consecutiveCaps > 1) {
                    var adjustedPosition = position - 1;
                    results.push(remaining.substring(0, adjustedPosition));
                    // Reset
                    remaining = remaining.substring(adjustedPosition, remaining.length);
                    position = 0;
                }
                else {
                    position++;
                }
                consecutiveCaps = 0;
            }
        }
        return results;
    };
    return Name;
})();
/** Name part implementation */
var NamePart = (function () {
    function NamePart(value, position, parent) {
        this.value = value;
        this.position = position;
        this.parent = parent;
        this.setImportance();
    }
    NamePart.prototype.setImportance = function () {
        var importance;
        // Name parts of 1 characters are not important
        if (this.value.length <= 1) {
            importance = NameImportanceOptions.None;
        }
        else if (this.value.length <= 3) {
            // Name parts of 3 characters or less are either very important, or not at all
            if (this.value.toLowerCase() === "dj") {
                // 'DJ' is usually an important part
                importance = NameImportanceOptions.None;
            }
            else if (this.parent.capsAreMeaningful && textIsUppercase(this.value)) {
                // If caps are used meaninful in the name overall and the part has all caps, then it's probably important
                importance = NameImportanceOptions.High;
            }
            else if (this.position === 0 || (this.position !== 0 && this.parent.parts[this.position - 1].importance === NameImportanceOptions.None)) {
                // If the importance isn't determined yet and the word is at the start, high chance it's redundant
                importance = NameImportanceOptions.None;
            }
            else {
                // Else just set it on low importance
                importance = NameImportanceOptions.Low;
            }
        }
        else {
            // Nothing special
            importance = NameImportanceOptions.Moderate;
        }
        this.importance = importance;
    };
    return NamePart;
})();
/** Add a C#-like format function to string, if not already present */
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) { return (typeof args[number] != 'undefined'
            ? args[number]
            : match); });
    };
}
///////////////////////////////////////////////////////////
/////                 DOCUMENT READY                  /////
///////////////////////////////////////////////////////////
// Initialize a new UserCollection
var userList = new UserCollection();
var url;
var dataString;
// Run the script only if you're streaming
if ($('#eventBroadcaster').length > 0) {
    // Add ignored users and yourself
    userList.disallowedUsers = ignoredUsers;
    userList.disallowedUsers.push($('body').attr('data-user-id'));
    // Getting url to call AJAX
    var queryString = $("#specatorsDockItem").attr("data-querystring");
    url = "http://www.mixify.com/room/spectators/cache/1/?" + queryString;
    dataString = queryString.split("=")[1];
    if (sessionStorage.getItem("active") === null) {
        sessionStorage.setItem("active", "true"); /* You entered the stream for the first time */
    }
    else {
        retrieveAttendees();
    }
    var djQuery = $("#djSilhouette").data("querystring");
    var djId = djQuery.split("=")[1];
    var djName = getUsernameFromUserData(djQuery);
    userList.add(new User(djId, djName));
    // Everytime the DOM tree gets modified, fire this event
    // TODO Add NodeRemoved to detect a user that leaves
    $('#avatarContainer').bind("DOMNodeInserted", function (e) {
        var element = $(e.target);
        // Only continue if th element that is being added has the 'avatar' class
        if (element.attr("class") === "avatar") {
            // Get the ID
            var id = element.attr("id").split("_")[1];
            var querystring = element.attr("data-querystring");
            // Get the username
            var username = getUsernameFromUserData(querystring);
            userList.add(new User(id, username));
        }
    });
}
///////////////////////////////////////////////////////////
/////                  MIXIFY STUFF                   /////
///////////////////////////////////////////////////////////
/**
 * Retrieve all attendees
 * @todo Make it return a collection of users instead
 */
function retrieveAttendees() {
    // Wait for fc() to be available
    // TODO Figure out if this can be done better
    if (fc() != null) {
        logToConsole("Retrieving attendance list");
        // Get data from the spectator cache
        jQuery.ajaxSetup({ async: false });
        var data = jQuery.get(url);
        var responseHtml = $(data.responseText);
        // Search for module-info elements in the response and iterate through it
        // TODO Turn into a more useful method
        $(responseHtml).find('.module-info').each(function (index, element) {
            // Find the username and id and initialize a new user based on it
            var jqueryElement = $(element);
            var username = jqueryElement.find('.username')[0].innerHTML;
            var id = jqueryElement.find('.bt-wrapper').attr('data-uuid');
            userList.add(new User(id, username));
        });
    }
}
/**
 * Sends message to chat
 * @param message Message
 */
function sendChatMessage(message) {
    fc().fc_sendChat(message, dataString);
}
/**
 * Logs to console, if debug mode is true
 * @param message Message to log
 * @param optionalParams Optional parameters
 */
function logToConsole(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    if (debugMode) {
        console.log(message, optionalParams);
    }
}
/**
 * Get the username from querying the user data
 * @param query query string
 * @returns { Username }
 */
function getUsernameFromUserData(query) {
    // Get the user data
    var data = getUserData(query);
    // Parse the response for the username
    var responseText = $(data.responseText);
    var usernameElement = $(responseText).find(".username");
    if (usernameElement.length === 0) {
        logToConsole("No username found for user using query {0}".format(query));
    }
    return usernameElement[0].innerHTML;
}
/**
 * Gets the user data with a query string
 * @param query query string
 * @returns { GET response }
 */
function getUserData(query) {
    // Get data from the user api
    jQuery.ajaxSetup({ async: false });
    return jQuery.get("http://www.mixify.com/user/info-basic/?{0}".format(query));
}
///////////////////////////////////////////////////////////
/////                  NAME FORMATTING                /////
///////////////////////////////////////////////////////////
function formatName(name) {
    // Get all the parts that we'll work with
    var nameParts = getSignificantNameParts(name.parts);
    // If all parts have 'none' importance, we'll try to get significant name parts using the full parts
    // These don't have the capital processed parts
    if (nameParts.every(function (x) { return x.importance === NameImportanceOptions.None; })) {
        nameParts = getSignificantNameParts(name.fullParts);
    }
    if (nameParts.length === 2) {
        return nameParts[0].value;
    }
    if (nameParts.length > 2) {
        if (nameParts.join("").length / nameParts.length > 5) {
            return nameParts.map(function (x) { return x.value[0].toUpperCase(); }).join("");
        }
        var firstLargestPart = nameParts[0];
        for (var _i = 0; _i < nameParts.length; _i++) {
            var namePart = nameParts[_i];
            if (namePart.value.length > firstLargestPart.value.length) {
                firstLargestPart = namePart;
            }
        }
        return firstLargestPart.value;
    }
    // Join all parts
    return nameParts.map(function (x) { return x.value; }).join(" ");
}
function getSignificantNameParts(nameParts) {
    // If there are any high important parts, return the first one
    // TODO: Determine if there are better alternatives to returning the first item
    var highImportance = nameParts.filter(function (value) { return value.importance === NameImportanceOptions.High; });
    if (highImportance.length > 0) {
        return [highImportance[0]];
    }
    // If there's only 1 moderate important part, return that one
    var moderateImportance = nameParts.filter(function (value) { return value.importance === NameImportanceOptions.Moderate; });
    if (moderateImportance.length === 1) {
        return moderateImportance;
    }
    // If the amount of low importance parts is higher than 0 and lower than the amount of moderate parts, then return low + moderate parts
    var lowImportance = nameParts.filter(function (value) { return value.importance === NameImportanceOptions.Low; });
    if (lowImportance.length > 0 && lowImportance.length < moderateImportance.length) {
        return nameParts.filter(function (value) { return value.importance === NameImportanceOptions.Moderate || value.importance === NameImportanceOptions.Low; });
    }
    // If at this point there are moderate parts, return those
    if (moderateImportance.length !== 0) {
        return moderateImportance;
    }
    if (lowImportance.length !== 0) {
        return lowImportance;
    }
    // Return whatever is left
    return nameParts;
}
///////////////////////////////////////////////////////////
/////                  GENERAL STUFF                  /////
///////////////////////////////////////////////////////////
/**
 * Checks if a text is all uppercase
 * @param text Text
 */
function textIsUppercase(text) {
    var position = 0;
    var character;
    while (position < text.length) {
        character = text.charAt(position);
        // If any character is a numeric, or matches a lowercase, then the text isn't fully uppercase
        if (isNumeric(character) || isLowerCase(character)) {
            return false;
        }
        position++;
    }
    return true;
}
function isLetter(character) {
    // Cheeky way to determine if it's a letter
    return character.toLowerCase() !== character.toUpperCase();
}
function isNumeric(character) {
    return (character >= "0" && character <= "9");
}
function isUpperCase(character) {
    return character === character.toUpperCase();
}
function isLowerCase(character) {
    return character === character.toLowerCase();
}
/**
 * Trims a string
 * @param text
 * @param trimCharacters
 */
function trimText(text, trimCharacters) {
    var processedName = text;
    for (var _i = 0; _i < trimCharacters.length; _i++) {
        var trimCharacter = trimCharacters[_i];
        processedName = processedName.split(trimCharacter).join(" ");
    }
    // Replace trailing numerics (regex) and trim
    return processedName.replace(/\d+$/, "").trim();
}
