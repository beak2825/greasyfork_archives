// ==UserScript==
// @name         Kadaotery Time Tracker
// @version      1.34
// @description  Adds a header with a countdown to the next window where a refresh could occur. Allows you to update the refresh interval by inputting the last known refresh time. Supports desktop notifications to alert you when a new potential feeding window is about to occur.
// @author       darknstormy
// @match        http*://*.neopets.com/games/kadoatery/*
// @icon         https://images.neopets.com/games/kadoatery/island_happy.gif
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @namespace https://greasyfork.org/users/1328929
// @downloadURL https://update.greasyfork.org/scripts/526461/Kadaotery%20Time%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/526461/Kadaotery%20Time%20Tracker.meta.js
// ==/UserScript==
/* eslint-env jquery */

/**
 * Stored data keys
 */
const LAST_REFRESH_TIME_KEY = "lastRefreshTime"
const NOTIFICATION_OPT_IN_KEY = "notificationOptIn"
const HUNGRY_KADS_KEY = "hungryCount"

const DURATION_UNTIL_START_OF_MAIN_WINDOW_MS = 1680000 // 28 minutes
const DURATION_OF_MAIN_WINDOW_MS = 90000
const DURATION_OF_PENDING_WINDOWS_MS = 60000
const ONE_SECOND_IN_MS = 1000;
const MAXIMUM_TIME_BETWEEN_REFRESHES_MS = 4680000

/**
 * Timers - stored globally so we can clean them up if they are no longer valid
 */
var countdownInterval
var notificationTimeout

runScript()

function runScript() {
    hideHeaderText()

    addIdToKadaotiesTable()
    addMissingRefreshTimeAlert()
    addCountdownText()
    addMainRefreshTimestampText()
    addUpdateRefreshTimeInput()

    showCountdownForNextFeeding()
}

/*
 * UI Changes (hiding and adding elements for the script to operate with)
 */
function hideHeaderText() {
    let textContainer = $(':contains("The Kadoatery")')
    textContainer.contents().filter(function() {
        return this.nodeType===3;
    }).remove();

    $(textContainer).children('br').hide()
}

function addIdToKadaotiesTable() {
    let kadaotiesTableJquery = $('.content div table').first()
    kadaotiesTableJquery.attr("id","kadaotiesTable");
}

function addMissingRefreshTimeAlert() {
    $("<div id='windowMissingAlert' style='background: red; color: white; padding: 4px'><h1>Next refresh window missing!</h1><p>Windows cannot be calculated because the last refresh time is missing or out of date. Please update using the textbox below to start the timer.</p></div>")
        .insertBefore('#kadaotiesTable')
}

function addCountdownText() {
    $(`<div id="countdownText"></div>`).insertBefore('#kadaotiesTable')
}

function addMainRefreshTimestampText() {
    $(`<div id='lastKnownMainTimestamp' style="display: block; text-align: center;"><p>Last known main refresh occurred at <span id="mainWindowTime"></span> local time.</p></div>`)
        .insertAfter("#kadaotiesTable")
}

function addUpdateRefreshTimeInput() {
    $(`<div id="refreshTimeContainer" style="margin: 8px 0;"><label for="refreshTime" style="display: block; font-weight: bold;">Update Main Refresh Time</label><input type="text" id="refreshTimeInput" name="refreshTime" minlength="5" maxlength="8" placeholder="HH:MM:SS" style="margin: 4px; display: inline-block;"/><button id="updateRefreshTimestampBtn">Submit</button></div>`)
        .insertAfter("#lastKnownMainTimestamp")
    $("#updateRefreshTimestampBtn").on("click", updateLastRefreshedTime)
}

/*
 * Helper functions
 */
function now() {
    return new Date().getTime()
}

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function validNumberInRange(value, minInclusive, maxInclusive) {
    return isNumeric(value) && value <= maxInclusive && value >= minInclusive
}

function stopTimers() {
    if (countdownInterval) {
        clearInterval(countdownInterval)
    }

    if (notificationTimeout) {
        clearTimeout(notificationTimeout)
    }
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000).getTime();
}

/**
 * Formatting functions to make things pretty :)
 */
function formatTwoDigits(n) {
    return n < 10 ? '0' + n : n;
}

function formatCountdown(d) {
    let minutes = formatTwoDigits(d.getMinutes());
    let seconds = formatTwoDigits(d.getSeconds());
    return minutes + ":" + seconds;
}

function formatWindowTime(d) {
    let hours = formatTwoDigits(d.getHours());
    let minutes = formatTwoDigits(d.getMinutes());
    let seconds = formatTwoDigits(d.getSeconds());
    return hours + ":" + minutes + ":" + seconds;
}

/**
 * Functions to do with the last main refresh time - validating, saving, inputting, etc
 */
function saveLastRefreshTime(date) {
    GM_setValue(LAST_REFRESH_TIME_KEY, date.getTime())
    $("#mainWindowTime").html(formatWindowTime(date))
    showCountdownForNextFeeding()
}

function hasValidLastRefreshTime() {
    let lastRefreshTime = getLastRefreshTime()
    let currentTime = now()

    if (!lastRefreshTime || lastRefreshTime > currentTime || ((currentTime - lastRefreshTime) > MAXIMUM_TIME_BETWEEN_REFRESHES_MS)) {
        $('#lastKnownMainTimestamp').hide()
        $('#countdownText').hide()
        $('#windowMissingAlert').show()
        return false
    } else {
        $('#lastKnownMainTimestamp').show()
        $('#countdownText').show()
        $('#windowMissingAlert').hide()
        $("#mainWindowTime").html(formatWindowTime(new Date(lastRefreshTime)))
        return true
    }
}

function updateLastRefreshedTime() {
    let inputtedTimes = $("#refreshTimeInput").val().split(":")

    let validationErrors = []

    if (inputtedTimes.length < 2) {
        validationErrors.push("You must supply at least the hour and minutes, with optional seconds, separated by a colon (##:##:##).");
    }

    let hour = inputtedTimes[0]

    if (!validNumberInRange(hour, 0, 23)) {
        validationErrors.push("Hour should follow 24 hour format and be a number between 0 and 23.")
    }

    let min = inputtedTimes[1]

    if (!validNumberInRange(min, 0, 59)) {
        validationErrors.push("Minutes must be a number between 0 and 59.")
    }

    // Default "seconds" input to 00 if it was not included
    var sec = "00"

    if (inputtedTimes.length > 2) {
        sec = inputtedTimes[2]
    }

    if (!validNumberInRange(sec, 0, 59)) {
        validationErrors.push("Seconds must be a number between 0 and 59.")
    }

    if (validationErrors.length > 0) {
        window.alert("Inputted refresh time was not correctly formatted. " + validationErrors.join(" "))
        return
    }

    var inputtedTime = new Date()

    // are we past midnight? there's a weird edge case where we have to fix the day here
    if (inputtedTime.getHours() <= 1 && hour === "23") {
        inputtedTime = new Date(inputtedTime.getTime() - 86400000) // get yesterday's date. We'll set all the values that matter after this.
    }

    inputtedTime.setHours(hour)
    inputtedTime.setMinutes(min)
    inputtedTime.setSeconds(sec)

    let currentTime = now()

    if (inputtedTime.getTime() > currentTime || (currentTime - inputtedTime.getTime()) > MAXIMUM_TIME_BETWEEN_REFRESHES_MS) {
        console.log("not valid input")
        window.alert("Inputted refresh time must be within the previous 78 minutes to be considered valid. Please try again.")
        return
    }

    saveLastRefreshTime(inputtedTime)
}

function getLastRefreshTime() {
    return GM_getValue(LAST_REFRESH_TIME_KEY)
}

/**
 * Functions to enable desktop notifications
 */
function addNotificationSupport(refreshAfter) {
    let optedInForNotifications = GM_getValue(NOTIFICATION_OPT_IN_KEY)

    if (optedInForNotifications) {
        notifyForNextWindow(refreshAfter)
    } else if ("Notification" in window && typeof optedInForNotifications === "undefined") {
        // The user has never opted in for notifications, so we need to ask for permission.
        $("#countdownText").append('<button id="notify" style="margin: 0px 0px 8px 0px;">Notify Me</button>')
        $('#notify')[0].onclick = function () {
             Notification.requestPermission().then((permission) => {
                 GM_setValue(NOTIFICATION_OPT_IN_KEY, permission === "granted")
                 addNotificationSupport(refreshAfter)
             })
        }
    }
}

function notifyForNextWindow(msTilNextWindowStart) {
    $('#notify').hide()
    $("#countdownText").append('<p style="font-weight: bold; color: green;">Notifications are turned on.</p>')

    // Give 10 seconds' heads up with the notification, if there are > 10 seconds remaining from the time the user requested the notification.
    // This allows for delay in the notification system so that you don't get notified too late and miss out potentially.
    if (msTilNextWindowStart > 10000) {
        notificationTimeout = setTimeout(function() {
            showNotification("Kadaotie Time Tracker", "A new refresh window is starting! Check for unfed Kadaoties now.")
        }, msTilNextWindowStart - 10000);
    } else {
        showNotification("Kadaotie Time Tracker", "A new refresh window is starting! Check for unfed Kadaoties now.")
    }
}

function showNotification(title, body) {
    let notification = new Notification(title, {
        body: body,
        icon: "https://images.neopets.com/games/kadoatery/island_happy.gif" })
    notification.onclick = () => {
        notification.close()
        window.focus()
    }
}

/**
 * The meat of the Kadaotie Time Tracking Logic starts here
 */
function checkForKadaotieRefresh() {
    let hungryKadaoties = $("#kadaotiesTable td:contains('is very sad')").length
    let previouslyHungryKadaoties = GM_getValue(HUNGRY_KADS_KEY, 0)
    GM_setValue(HUNGRY_KADS_KEY, hungryKadaoties)

    // If we have more hungry kadaoties than we stored previously...
    if (hungryKadaoties > previouslyHungryKadaoties) {
        // There's been a turnover.
        saveLastRefreshTime(new Date())

        if (GM_getValue(NOTIFICATION_OPT_IN_KEY)) {
            showNotification("HUNGRY KADAOTIES ARE WAITING!", "Hurry up and feed them before someone else does!")
        }
        return true
    }

    return false
}

function showCountdownForNextFeeding() {
    stopTimers() // In case we've had an invalidated window (because of user update), clear out any existing timers. They'll be started again when needed.

    if (!hasValidLastRefreshTime()) {
        return
    }

    let refreshed = checkForKadaotieRefresh()

    let mainWindow = getMainWindow()
    let pendingWindows = getPendingWindows()

    if (!refreshed) {
        let timeRemainingInWindow = getTimeRemainingInRefreshWindow(mainWindow, pendingWindows)
        if (timeRemainingInWindow > 0) {
            showPotentialWindowAlert(timeRemainingInWindow)
            return
        }
    }

    showCountdownToNextWindow(getNextWindowTime([mainWindow, ...pendingWindows]))
}

function showPotentialWindowAlert(timeRemainingInWindow) {

    var timeRemainingInSeconds = Math.round(timeRemainingInWindow / 1000)

    if (timeRemainingInSeconds == 0) {
        showCountdownToNextWindow(getNextWindowTime([getMainWindow(), ...getPendingWindows()]))
        return
    }

    $('#countdownText')[0].replaceChildren()
    $('#countdownText').append(`<h1 style="color: red">We're within the window for a refresh (<span id="secondsRemaining" style="color: green">${timeRemainingInSeconds}</span> seconds remain)! Keep refreshing for hungry Kadaoties!</h1><div>`);

    countdownInterval = setInterval(function() {
        $("#secondsRemaining").html(--timeRemainingInSeconds);
    }, ONE_SECOND_IN_MS)

    setTimeout(function() {
       showCountdownForNextFeeding()
   }, timeRemainingInWindow);
}

function showCountdownToNextWindow(nextWindow) {
    let nextWindowTime = formatWindowTime(new Date(nextWindow))
    var countdownToRefresh = nextWindow - now()

    $('#countdownText')[0].replaceChildren()
    $('#countdownText').append(`<h1>The next potential refresh time window begins at <span id='nextEstimatedFeeding' style='color: red'>${nextWindowTime}</span> (Local Time). You should begin refreshing in <span id="minutes" style='color: red'>${formatCountdown(new Date(countdownToRefresh))}</span> minutes.</h1></div>`);

    addNotificationSupport(countdownToRefresh)

    countdownInterval = setInterval(function() {
        countdownToRefresh = countdownToRefresh - 1000
        let timeRemaining = formatCountdown(new Date(countdownToRefresh))
        $("#minutes").html(timeRemaining);
    }, ONE_SECOND_IN_MS)

   setTimeout(function() {
       showCountdownForNextFeeding()
   }, countdownToRefresh);
}

function getMainWindow() {
    return getLastRefreshTime() + DURATION_UNTIL_START_OF_MAIN_WINDOW_MS
}

function getPendingWindows() {
    // Potential later windows could be every 7 minutes after the first window, so we will check for 1 minute each time
    var mainWindow = new Date(getMainWindow())

    var windows = new Array()

    for (var i = 1; i < 8; i++) {
        let pendingWindow = addMinutes(mainWindow, i * 7)
        windows.push(pendingWindow)
    }

    return windows
}

function getNextWindowTime(windows) {
    var currentTime = now()
    return windows.find((window) => currentTime <= window)
}

function getTimeRemainingInRefreshWindow(mainWindow, pendingWindows) {
    var currentTime = now()

    if (currentTime > mainWindow && currentTime < mainWindow + DURATION_OF_MAIN_WINDOW_MS) {
        return mainWindow + DURATION_OF_MAIN_WINDOW_MS - currentTime
    }

    var inWindow = pendingWindows.find((window) => currentTime >= window && currentTime < window + DURATION_OF_PENDING_WINDOWS_MS)

    if (inWindow) {
        return inWindow + DURATION_OF_PENDING_WINDOWS_MS - currentTime
    }

    return -1
}