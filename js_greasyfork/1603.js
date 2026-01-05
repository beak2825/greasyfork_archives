// ==UserScript==
// @name         Survivor Sucks Block Users
// @author       jkalderash
// @version      1.2
// @description  Creates a "Block" button on Sucks posts and hides all posts for
//               the user when the button is pressed. Also creates a list of blocked
//               users at the bottom of each page.
// @match        http://survivorsucks.com/*
// @match        http://survivorsucks.yuku.com/*
// @copyright    2013+, jkalderash
// @require      http://code.jquery.com/jquery-2.0.0.min.js
// @namespace    http://greasyfork.org/users/1076-jkalderash
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/1603/Survivor%20Sucks%20Block%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/1603/Survivor%20Sucks%20Block%20Users.meta.js
// ==/UserScript==

// hide all posts/threads/quotes/links for a blocked username
function hideAll(url) {
    // Hide all posts from the user.
    getPosts(url).hide();
    
    // Hide all threads from the user.
    getThreads(url).hide();
    
    // From MisterRisible! Removes the text from quotes of the blocked user.
    var quotedUsername = convertUrlToQuotedUsername(url);
    getBlockquotes(quotedUsername).each(function() {
        // Build a fake blockquote with a "click to show" button.
        var actualQuote = $(this);
        var fakeQuote = $("<blockquote class=\"jkalderash-blocked\"><strong class=\"quote-title\">"
                          + quotedUsername + " wrote:</strong>&nbsp;</blockquote>");
        var clickToShow = $('<a href=\"javascript:\">click to show</a>');
        clickToShow.click(function() {
            $(fakeQuote).detach();
            $(actualQuote).show();
        });
        fakeQuote.append(clickToShow);
        $(this).before(fakeQuote);
        $(this).hide();
    });
        
    // Hide "Last Comment" links for a user.
    getLastComments(url).each(function() {
        // Clicking on the "<BLOCKED>" link reveals the blocked username.
        var actualUserName = $(this);
        var fakeUserName = $('<a class=\"jkalderash-blocked\" href=\"javascript:\">&lt;BLOCKED&gt;</a>');
        fakeUserName.click(function() {
            $(fakeUserName).detach();
            $(actualUserName).show();
        });
        actualUserName.before(fakeUserName);
        actualUserName.hide();
    });
}

// unhide all posts/threads/quotes for an unblocked username
function unhideAll(url) {
    getPosts(url).show();
    getThreads(url).show();
    
    var quotedUsername = convertUrlToQuotedUsername(url);
    getBlockquotes(quotedUsername).each(function() {
        $(this).siblings(".jkalderash-blocked").detach();
        $(this).show();
    });
    
    getLastComments(url).each(function() {
        $(this).siblings(".jkalderash-blocked").detach();
        $(this).show();
    });
}

// get all of the posts by a user
function getPosts(url) {
    return $("td.poster-name").find("a[href='http://" + url + ".yuku.com']").closest("tbody");
}

// get all of the threads by a user
function getThreads(url) {
    return $("td.author").find("a[href='http://" + url + ".yuku.com']").closest("tr");
}

// gets all <blockquote> elements for quotes by a user
function getBlockquotes(quotedUsername) {
    return $("strong.quote-title").filter(function() {
        return $(this).text() === quotedUsername + " wrote:";
    }).parent();
}

// get all of the "Last Comment" links for a user
function getLastComments(url) {
    return $("td.latest ").find("a[href='http://" + url + ".yuku.com']");
}

// modify the permanent blacklist variable
function updateBlacklist() {
    GM_setValue("blacklist", blacklist.join(" "));
}

// inserts a username into the blacklist. returns true if the user was not
// already blacklisted. case insensitive.
function insertIntoBlacklist(username) {
    var usernameLower = username.toLowerCase();
    for (var i = 0; i < blacklist.length; i++) {
        otherUsernameLower = blacklist[i].toLowerCase();
        if (usernameLower == otherUsernameLower) {
            return false;
        }
        if (usernameLower < otherUsernameLower) {
            break;
        }
    }
    blacklist.splice(i, 0, username);
    console.log("New blacklist: " + blacklist.join(" "));
    updateBlacklist();
    return true;
}

// adds a "Block" link to each post
function addBlockLink(element, url) {
    var newItem = $('<li><a href=\"javascript:\">Block</a></li>');
    newItem.click(function() {
        console.log("BLOCK " + url);
        if (insertIntoBlacklist(url)) {
            hideAll(url);
            makeUnblockList();
            window.alert("Blocked " + convertUrlToThreadUsername(url));
        }
    });
    $(element).closest("tbody.thread-post").find("ul.reply-options").append(newItem);
}

// returns a link to unblock a blocked user
function makeUnblockLink(url) {
    var threadUsername = convertUrlToThreadUsername(url);
    var newItem = $("<a href=\"javascript:\">" + threadUsername + "</a>");
    newItem.click(function() {
        blacklist.splice(blacklist.indexOf(url), 1);
        console.log("New blacklist: " + blacklist.join(" "));
        updateBlacklist();
        $(this).hide();
        unhideAll(url);
        alert("Unblocked " + threadUsername);
    });
    return newItem;
}

// Helper function for sorting the unblock list at the bottom of the page.
function sortUnblockLinks(link1, link2) {
    s1 = link1.html().toLowerCase();
    s2 = link2.html().toLowerCase();
    if (s1 > s2) {
        return 1;
    }
    if (s2 > s1) {
        return -1;
    }
    return 0;
}

// Clear and rebuild the unblock list.
function makeUnblockList() {
    var list = $("#blacklist");
    list.find("a").detach();
    unblockLinks = blacklist.map(makeUnblockLink).sort(sortUnblockLinks);
    unblockLinks.forEach(function(unblockLink) {
        $(list).append(" ");
        $(list).append(unblockLink); 
    });
}

// get the username from the URL of the profile page.
// this is the username used in quote blocks, i.e. "Joe Schmoe wrote:"
function convertUrlToQuotedUsername(url) {
    // remove everything before the first dot
    var dot = url.indexOf(".");
    url = url.substr(0, dot);
    
    // replace hyphens with spaces
    url = url.replace(/-/g, " ");
    
    return url;
}

// get the username from the URL of the profile page.
// this is the username displayed next to the user's avatar.
function convertUrlToThreadUsername(url) {    
    // remove trailing ".u" or ".e"
    if (url.indexOf(".u", url.length - 2) > 0
        || url.indexOf(".e", url.length - 2) > 0) {
        url = url.substr(0, url.length - 2);
    }
    
    // remove trailing ".survivorsucks"
    var suffix = ".survivorsucks";
    if (url.indexOf(suffix, url.length - suffix.length) >= 0) {
        url = url.substring(0, url.length - suffix.length);
    }
    
    // replace hyphens with spaces
    url = url.replace(/-/g, " ");
    
    return url;
}

$(document).ready(function() {
    // retrieve the stored value of the blacklist
    window.blacklist = GM_getValue("blacklist", "").split(" ");
    console.log("Blacklist: " + blacklist.join(" "));
    if (blacklist.length == 1 && blacklist[0] == "") {
        // split() on an empty string returns [""]
        blacklist.pop();
    }
    
    // hide the posts of each blacklisted user
    blacklist.forEach(hideAll);
    
    // for each post, create a "Block" link
    $("span.user-name a").each(function() {
        var url = $(this).attr("href").substr(7);
        url = url.substr(0, url.length - 9);
        addBlockLink(this, url);
    });
    
    // create a list of blocked users at the end of the page
    var footer = $("div.myfooter");
    var list = $("<p id=\"blacklist\">LIST OF BLOCKED USERNAMES (click to unblock):</p>");
    footer.append(list);
    makeUnblockList();
    
    // create a link to wipe the blacklist.
    var clearAll = $("<p><a href=\"javascript:\">Click here to clear all blocked usernames</a></p>");
    clearAll.click(function() {
        window.blacklist = [];
        updateBlacklist();
        $("tbody.thread-post").show();
        $("tbody.post").show();
        $("td.author").closest("tr").show();
        $("blockquote.jkalderash-blocked").detach();
        $("strong.quote-title").parent().show();
        list.find("a").detach();
        alert("Cleared all blocked usernames");
    });
    footer.append(clearAll);
});