// ==UserScript==
// @name        TFTV Thread Hider
// @description Allows for hiding of threads on TFTV
// @namespace   deetr
// @include     /^(http)?s?:\/\/(www)?\.teamfortress\.tv.*$/
// @version     2.01
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_getValue
// @grant       GM_deleteValue
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @require     https://code.jquery.com/ui/1.11.4/jquery-ui.js
// @downloadURL https://update.greasyfork.org/scripts/10671/TFTV%20Thread%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/10671/TFTV%20Thread%20Hider.meta.js
// ==/UserScript==
var currentPage = String(window.location);

// Add the settings button
var $settingsButton = $('<a href = "/threadhidersettings">Thread Hider Settings</a>');
$settingsButton.prependTo($('#user-menu'));

if (/^(http)?s?:\/\/(www)?\.teamfortress\.tv\/threadhidersettings.*$/.test(currentPage)) {
    generateSettingsPage();
} else if (/^(http)?s?:\/\/(www)?\.teamfortress\.tv\/user\/.*$/.test(currentPage)) {
    $('#filter-container').append('<a id = "block-player-btn" class = "btn page-btn depress" href = "javascript:void(0);">Silence User</a>');
    document.getElementById('block-player-btn').addEventListener("click", blockCurrentPagePlayer);

} else if (/^(http)?s?:\/\/(www)?\.teamfortress\.tv\/threads.*$/.test(currentPage) || /^https?:\/\/(www)?\.teamfortress\.tv\/forum\/.*$/.test(currentPage)) {
    hideThreads();
    if (GM_getValue("showHideThreadButton", true)) {
        var $hideButton = $('<input type="button" id="threadHideButton" value = "Hide Thread" class = "btn left submit" style="margin-left: 3px;">');
        $hideButton.appendTo($('#filter-container'));
        document.getElementById('threadHideButton').addEventListener("click", promptHideThread);
    }
} else if (/^(http)?s?:\/\/(www)?\.teamfortress\.tv\/\d*\/.*$/.test(currentPage)) {
    $('div.thread-frag-container.noselect').append('<span id = "hideCurrentThreadBtn" class = "btn noselect"></span>');
    if (isHiddenThread(currentPage)) {
        $('#hideCurrentThreadBtn').text('Unhide Thread');
        document.getElementById('hideCurrentThreadBtn').addEventListener("click", unhideCurrentThread);
    } else {
        $('#hideCurrentThreadBtn').text('Hide Thread');
        document.getElementById('hideCurrentThreadBtn').addEventListener("click", hideCurrentThread);
    }
}

function generateSettingsPage() {
    $('head title', window.parent.document).text('Change Thread Hider Settings');
    $('#content-inner').find('img:first').hide();
    $('#content-inner').find("div").each(function(i, obj) {
        if (i == 0) {
            $(obj).text("TFTV Thread Hider").attr("id", "settings-title");
        } else if (i == 1) {
            $(obj).attr("id", "settings-subtitle").text("by deetr");
        } else if (i == 2) {
            $(obj).attr("id", "settings-body").text("").attr("style", "margin-top : 20px;display: block;font-size: 120%;");
        } else {
            $(obj).hide();
        }
    });
    $('#settings-body').append('<p id = "generalSettingsHeading" style = "text-align: center;font-size: 130%;margin-bottom: 10px;"><u>General</u></p>');
    $('#settings-body').append('<form action=""><input id = "showHideThreadButton" type="checkbox"> Show "Hide Thread" button on thread listings<br></form>');
    if (GM_getValue("showHideThreadButton", true)) {
        $('#showHideThreadButton').prop('checked', true);
    }
    $('#settings-body').append('<p id = "deleteData" style = "font-size: 120%;margin-bottom: 10px;margin-top: 10px;"><b><a href = "javascript:void(0);" style = "color: red;">Delete All Data</a></b></p>');
    document.getElementById('deleteData').addEventListener('click', clearData);
    document.getElementById('showHideThreadButton').addEventListener("click", toggleShowHideThreadBtn);
    $('#settings-body').append('<p id = "hiddenThreadHeading" style = "text-align: center;font-size: 130%;margin-bottom: 10px;margin-top: 10px;"><u>Hidden Threads</u></p>');
    $('#settings-body').append('<p id = "unhideAllThreads" style = "font-size: 120%;margin-bottom: 10px;"><b><a href = "javascript:void(0);" style = "color:red">Unhide All Threads</a></b></p>');
    document.getElementById('unhideAllThreads').addEventListener("click", resetHiddenThreadsFromSettings);
    $('#settings-body').append('<p id = "unhideThread" style = "font-size: 120%;margin-bottom: 10px;"><b><a href = "javascript:void(0);">Unhide Thread</a></b></p>');
    document.getElementById('unhideThread').addEventListener("click", promptUnhideThread);
    $('#settings-body').append('<p id = "hideThread" style = "font-size: 120%;margin-bottom: 10px;"><b><a href = "javascript:void(0);">Hide Thread</a></b></p>');
    document.getElementById('hideThread').addEventListener("click", promptHideThreadFromSettings);
    $('#settings-body').append('<p id = "listHiddenThreads" style = "font-size: 120%;margin-bottom: 10px;"><b><a href = "javascript:void(0);">List Hidden Threads</a></b></p>');
    document.getElementById('listHiddenThreads').addEventListener("click", populateAndShowHiddenThreads);
    $('#settings-body').append('<div id = "hiddenThreadList" style = "display: none;"></div>');
    $('#settings-body').append('<p id = "blockedUserHeading" style = "text-align: center;font-size: 130%;margin-top:10px; margin-bottom: 10px;"><u>Silenced Users</u></p>');
    $('#settings-body').append('<p id = "unblockAllPlayers" style = "font-size: 120%;margin-bottom: 10px;"><b><a href = "javascript:void(0);" style = "color: red;">Unsilence All Users</a></b></p>');
    document.getElementById('unblockAllPlayers').addEventListener('click', resetBlockedPlayersFromSettings);
    $('#settings-body').append('<p id = "unblockPlayer" style = "font-size: 120%;margin-bottom: 10px;"><b><a href = "javascript:void(0);">Unsilence Player</a></b></p>');
    document.getElementById('unblockPlayer').addEventListener("click", promptUnblockPlayer);
    $('#settings-body').append('<p id = "blockPlayer" style = "font-size: 120%;margin-bottom: 10px;"><b><a href = "javascript:void(0);">Silence Player</a></b></p>');
    document.getElementById('blockPlayer').addEventListener("click", promptBlockPlayer);
    $('#settings-body').append('<p id = "listBlockedPlayers" style = "font-size: 120%;margin-bottom: 10px;"><b><a href = "javascript:void(0);">List Silenced Players</a></b></p>');
    document.getElementById('listBlockedPlayers').addEventListener("click", populateAndShowBlockedPlayers);
    $('#settings-body').append('<div id = "blockedPlayerList" style = "display: none;"></div>');

}

// Actually hides the threads, might act strangely on pages that aren't proper thread listings
function hideThreads() {
    var currentThread;
    var hiddenThreads = eval(GM_getValue("hiddenThreads", "[]"));
    var blockedPlayers = eval(GM_getValue("blockedPlayers", "[]"));
    if (hiddenThreads.length == 0 && blockedPlayers.length == 0) {
        return;
    }
    $('.thread').each(function(i, obj) {
        currentThread = $(this).find(':first-child').find(':first-child').attr('data-thread-id');
        if (hiddenThreads.indexOf(parseInt(currentThread)) > -1) {
            $(this).hide();
        }
        if (blockedPlayers.length > 0) {
            for (var i = 0; i < blockedPlayers.length; i++) {
                desc = $(this).find('.main').find('.description').text();
                if (desc.indexOf(blockedPlayers[i]) >= 0) {
                    $(this).hide();
                }
            }
        }
    });
}

function toggleShowHideThreadBtn() {
    GM_setValue("showHideThreadButton", !GM_getValue("showHideThreadButton", true));
}

// Should only be called once generateSettingsPage has completed
function populateAndShowHiddenThreads() {
    var hiddenThreads = eval(GM_getValue("hiddenThreads", "[]"));
    if (hiddenThreads.length == 0) {
        $('#hiddenThreadList').text("You haven't hidden any threads.");
    }
    for (var i = 0; i < hiddenThreads.length; i++) {
        $('#hiddenThreadList').append('<p id = "' + hiddenThreads[i] + '"><a href = "http://www.teamfortress.tv/thread/' + hiddenThreads[i] + '">http://www.teamfortress.tv/thread/' + hiddenThreads[i] + '</a></p>');
    }
    $('#hiddenThreadList').slideDown();
    document.getElementById('listHiddenThreads').removeEventListener("click", populateAndShowHiddenThreads);
    document.getElementById('listHiddenThreads').addEventListener("click", unpopulateAndHideHiddenThreads);
}

function unpopulateAndHideHiddenThreads() {
    $('#hiddenThreadList').slideUp().text("");
    document.getElementById('listHiddenThreads').addEventListener("click", populateAndShowHiddenThreads);
    document.getElementById('listHiddenThreads').removeEventListener("click", unpopulateAndHideHiddenThreads);
}

function promptHideThread() {
    var thread = prompt("Enter a thread to hide");
    // Get the thread number
    thread = thread.replace(/[^\/\d]/g, '');
    var threadNo = 0;
    var threadSplit = thread.split("/");
    for (var i = 0; i < threadSplit.length; i++) {
        if (!threadSplit[i] == "") {
            threadNo = parseInt(threadSplit[i]);
            break;
        }
    }
    // Hide the thread
    addHiddenThread(threadNo);
    hideThreads();
}

function promptHideThreadFromSettings() {
    var thread = prompt("Enter a thread to hide");
    // Get the thread number
    thread = thread.replace(/[^\/\d]/g, '');
    var threadNo = 0;
    var threadSplit = thread.split("/");
    for (var i = 0; i < threadSplit.length; i++) {
        if (!threadSplit[i] == "") {
            threadNo = parseInt(threadSplit[i]);
            break;
        }
    }
    addHiddenThread(threadNo);
    unpopulateAndHideHiddenThreads();
    populateAndShowHiddenThreads();
}

function promptUnhideThread() {
    var thread = prompt("Enter a thread to unhide");
    // Get the thread number
    thread = thread.replace(/[^\/\d]/g, '');
    var threadNo = 0;
    var threadSplit = thread.split("/");
    for (var i = 0; i < threadSplit.length; i++) {
        if (!threadSplit[i] == "") {
            threadNo = parseInt(threadSplit[i]);
            break;
        }
    }
    removeHiddenThread(threadNo);
    unpopulateAndHideHiddenThreads();
    populateAndShowHiddenThreads();
}

// Only checks against hidden threads, not silenced users
function isHiddenThread(thread) {
    thread = thread.replace(/[^\/\d]/g, '');
    var threadNo = 0;
    var threadSplit = thread.split("/");
    for (var i = 0; i < threadSplit.length; i++) {
        if (!threadSplit[i] == "") {
            threadNo = parseInt(threadSplit[i]);
            break;
        }
    }
    var hiddenThreads = eval(GM_getValue("hiddenThreads", "[]"));
    if (hiddenThreads.indexOf(threadNo) > -1) {
        return true;
    }
    return false;
}

function unhideCurrentThread() {
    var thread = String(window.location);
    thread = thread.replace(/[^\/\d]/g, '');
    var threadNo = 0;
    var threadSplit = thread.split("/");
    for (var i = 0; i < threadSplit.length; i++) {
        if (!threadSplit[i] == "") {
            threadNo = parseInt(threadSplit[i]);
            break;
        }
    }
    removeHiddenThread(threadNo);
    document.getElementById('hideCurrentThreadBtn').addEventListener("click", hideCurrentThread);
    document.getElementById('hideCurrentThreadBtn').removeEventListener("click", unhideCurrentThread);
    $('#hideCurrentThreadBtn').text("Hide Thread");
}

function hideCurrentThread() {
    var thread = String(window.location);
    thread = thread.replace(/[^\/\d]/g, '');
    var threadNo = 0;
    var threadSplit = thread.split("/");
    for (var i = 0; i < threadSplit.length; i++) {
        if (!threadSplit[i] == "") {
            threadNo = parseInt(threadSplit[i]);
            break;
        }
    }
    addHiddenThread(threadNo);
    document.getElementById('hideCurrentThreadBtn').removeEventListener("click", hideCurrentThread);
    document.getElementById('hideCurrentThreadBtn').addEventListener("click", unhideCurrentThread);
    $('#hideCurrentThreadBtn').text("Unhide Thread");
}

function addHiddenThread(threadNo) {
    var threadsHidden = eval(GM_getValue("hiddenThreads", "[]"));
    threadsHidden.push(threadNo);
    threadsHidden = removeDuplicates(threadsHidden);
    GM_setValue("hiddenThreads", uneval(threadsHidden));
    if ($('#hiddenThreadList').is(':visible')) {
        unpopulateAndHideHiddenThreads();
        populateAndShowHiddenThreads();
    }
}

function removeHiddenThread(threadNo) {
    var threadsHidden = eval(GM_getValue("hiddenThreads", "[]"));
    var index = threadsHidden.indexOf(threadNo);
    if (index > -1) {
        threadsHidden.splice(index, 1);
    }
    GM_setValue("hiddenThreads", uneval(threadsHidden));
    if ($('#hiddenThreadList').is(':visible')) {
        unpopulateAndHideHiddenThreads();
        populateAndShowHiddenThreads();
    }
}

function resetHiddenThreads() {
    GM_setValue("hiddenThreads", uneval([]));
    hideThreads();
    $('.thread').each(function(i, obj) {
        $(this).show();
    });
    if ($('#hiddenThreadList').is(':visible')) {
        unpopulateAndHideHiddenThreads();
        populateAndShowHiddenThreads();
    }
}

function resetHiddenThreadsFromSettings() {
    if (confirm("You are about to unhide all threads. This cannot be undone. Continue?")) {
        resetHiddenThreads();
        if ($('#hiddenThreadList').is(':visible')) {
            unpopulateAndHideHiddenThreads();
            populateAndShowHiddenThreads();
        }
    }
}

// Should only be called once generateSettingsPage has completed
function populateAndShowBlockedPlayers() {
    var blockedPlayers = eval(GM_getValue("blockedPlayers", "[]"));
    if (blockedPlayers.length == 0) {
        $('#blockedPlayerList').text("You haven't silenced any players.");
    }
    for (var i = 0; i < blockedPlayers.length; i++) {
        $('#blockedPlayerList').append('<p id = "' + hiddenThreads[i] + '"><a href = "http://www.teamfortress.tv/user/' + hiddenThreads[i] + '">http://www.teamfortress.tv/user/' + hiddenThreads[i] + '</a></p>');
    }
    $('#blockedPlayerList').slideDown();
    document.getElementById('listBlockedPlayers').removeEventListener("click", populateAndShowBlockedPlayers);
    document.getElementById('listBlockedPlayers').addEventListener("click", unpopulateAndHideBlockedPlayers);
}

function unpopulateAndHideBlockedPlayers() {
    $('#blockedPlayerList').slideUp().text("");
    document.getElementById('listBlockedPlayers').addEventListener("click", populateAndShowBlockedUsers);
    document.getElementById('listBlockedPlayers').removeEventListener("click", unpopulateAndHideBlockedUsers);
}

function promptBlockPlayer() {
    var player = prompt("Enter a player to block");
    if (player.indexOf("/") == -1) {
        blockPlayer(player);
    } else {
        var sPlayer = player.split("/");
        blockPlayers(sPlayer[sPlayer.length - 1]);
    }
}

function promptUnblockPlayer() {
    var player = prompt("Enter a player to unblock");
    unblockPlayer(player);
}

function blockPlayer(playerName) {
    var blockedPlayers = eval(GM_getValue("blockedPlayers", "[]"));
    blockedPlayers.push(playerName);
    blockedPlayers = removeDuplicates(blockedPlayers);
    GM_setValue("blockedPlayers", uneval(blockedPlayers));
    if ($('#blockedPlayerList').is(':visible')) {
        unpopulateAndHideBlockedPlayers();
        populateAndShowBlockedPlayers();
    }
}

function unblockPlayer(playerName) {
    var blockedPlayers = eval(GM_getValue("blockedPlayers", "[]"));
    var index = blockedPlayers.indexOf(threadNo);
    if (index > -1) {
        blockedPlayers.splice(index, 1);
    }
    GM_setValue("blockedPlayers", uneval(blockedPlayers));
    if ($('#blockedPlayerList').is(':visible')) {
        unpopulateAndHideBlockedPlayers();
        populateAndShowBlockedPlayers();
    }
}

function resetBlockedPlayers() {
    GM_setValue("blockedPlayers", uneval([]));
}

function resetBlockedPlayersFromSettings() {
    if (confirm("You are about to unsilence all players. This cannot be undone. Continue?")) {
        resetBlockedPlayers();
        if ($('#blockedPlayerList').is(':visible')) {
            unpopulateAndHideBlockedPlayers();
            populateAndShowBlockedPlayers();
        }
    }
}

function blockCurrentPagePlayer() {
    blockPlayer($('#profile-header').text().trim());
}

function removeDuplicates(array) {
    var fixedArray = [];
    $.each(array, function(i, obj) {
        if ($.inArray(obj, fixedArray) == -1)
            fixedArray.push(obj);
    });
    return fixedArray;
}

function clearData() {
    if (confirm("You are about to delete ALL data including ALL threads and silenced users. This cannot be undone. Continue?")) {
        var values = GM_listValues();
        for (var i = 0; i < values.length; i++) {
            GM_deleteValue(values[i]);
        }
    }
}