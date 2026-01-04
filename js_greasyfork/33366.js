// ==UserScript==
// @name        TypeRacer Private Racetrack Bot
// @namespace   morinted
// @description Preview texts, race alone, and keep a log of races by having this bot host a private racetrack.
// @include     https://play.typeracer.com/
// @version     5.3.2
// @grant       none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/33366/TypeRacer%20Private%20Racetrack%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/33366/TypeRacer%20Private%20Racetrack%20Bot.meta.js
// ==/UserScript==
/* jshint asi:true */

var nbsp = ' '

function getNumberOfUsers() {
  return $('.users-list .userNameLabel').length
}

function isBotInChat() {
  return !!$('.users-list .userNameLabel.userNameLabel-self').length
}

// Check number of users in race, but only if they are not finished and haven't left.
function getNumberOfRacingUsers() {
  return $('.scoreboard > tbody > tr').map((index, row) => {
    row = $(row)
    // .avatar-dead means they've left, if rank is empty they haven't finished the race.
    if (row.find('.avatar-dead').length || (row.find('div.rank')[0].textContent || '').trim()) {
      return 0
    }
    return 1
  }).get().reduce((result, x) => result + x)
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function postRaceResults() {
    var raceResults = $('.scoreboard > tbody > tr').map((index, row) => {
      row = $(row)
      if ((row.find('div.rank')[0].textContent || '').trim()) {
        var place = parseInt(row.find('div.rank')[0].textContent)
        var wpm = parseInt(row.find('.rankPanelWpm')[0].textContent)
        var username = (row.find('.lblUsername')[0].textContent || '').trim()
        username = username ? username.slice(1, -1) : 'Guest'
        return { place: place, wpm: wpm, username: username }
      }
      return null
    }).get().filter(x => x).sort((a, b) => a.place - b.place)
      .map((user, index) => {
        const badge = index === 0 ? '?' : index === 1 ? '?' : index === 2 ? '?' : '?'
        return [
            badge,
            user.username.split('_').map(x => capitalize(x)).join('_'),
            user.wpm + 'wpm'
        ].filter(x => x).join(' ')
      }).join(', ')
    if (raceResults) sendChatMessage(raceResults)
    var quitters = $('.scoreboard > tbody > tr').map((index, row) => {
      row = $(row)
      if (!(row.find('div.rank')[0].textContent || '').trim() &&
          row.find('.avatar-dead').length &&
          !row.find('.avatar-self').length) {
        var username = (row.find('.lblUsername')[0].textContent || '').trim()
        username = username ? username.slice(1, -1) : 'Guest'
        return username
      }
      return null
    }).get().filter(x => x).join(', ')
    if (quitters) sendChatMessage('? Quitters: ' + quitters)
}

function inRace() {
  // Check for presence and visibility of "(you)" label.
  return !!document.querySelector('.lblUsername[style=""]')
}

function getGameStatus() {
  return ((document.getElementsByClassName('gameStatusLabel') || [])[0] || {}).innerHTML || ''
}

function leaveRace() {
  document.querySelector('table.navControls > tbody > tr > td > a:first-child').click()
}

function fakeActivity() {
  // Ted: Huge thank you to *Nimble* for figuring this out. Drove me crazy!
  // Mouse move event clientX needs to be different from last event
  // to work as an activity event.
  // Emit 2 different events at once so this function can be stateless.
  document.dispatchEvent(new MouseEvent("mousemove", {
     'clientX': 0
  }));
  document.dispatchEvent(new MouseEvent("mousemove", {
     'clientX': 1
  }));
}

function joinRace() {
  (document.getElementsByClassName('raceAgainLink') || [])[0].click()
}

function getQuoteText() {
  return ((document.querySelector('table.inputPanel table tr:first-child') || {}).textContent || '').trim()
}

function rejoinRacetrack() {
  $('.lnkRejoin').click() // Rejoin
}

function isOnHomePage() {
  return !!(document.querySelector('.mainMenuItemText'))
}

function raceYourFriends() {
  return $(
    'div.mainViewport > div > table > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > a'
  ).click()
}

function leaveRacetrack() {
  $('.roomSection > table > tbody > tr > td > a.gwt-Anchor').click()
}

function status() {
  var gameStatus = getGameStatus()
  return {
    noRace: gameStatus.startsWith('Join'),
    waitingForOthers: gameStatus.startsWith('Waiting'),
    countingDown: gameStatus.startsWith('The race is about to start'),
    racing: gameStatus.startsWith('Go!') || gameStatus.startsWith('The race is on!'),
    raceOver: gameStatus.startsWith('The race has ended')
  }
}

function sendChatMessage(message) {
     var chatInput = $('input.txtChatMsgInput')
     chatInput.click()
     chatInput.val(message)
     chatInput.focus()
     var keyboardEvent = jQuery.Event('keydown')
     keyboardEvent.which = 13
     keyboardEvent.keyCode = 13
     chatInput.trigger(keyboardEvent)
}

function waitingForNewQuote() {
     return !!$('.mainViewport .timeDisplay .caption').length
}

function sendQuoteText() {
   var quoteText = getQuoteText()
   if (quoteText) {
     log('Sending quote text')
     log(quoteText)
     sendChatMessage('“' + quoteText + '”')
   }
}

function tick() {
    setTimeout(mainLoop, 500)
}

lastMessage = ''
function log(message) {
    if (message != lastMessage) {
      lastMessage = message
      console.log('BOT:', message)
    }
}

function refreshPage() {
 location.reload()
}

function mainLoop() {
    fakeActivity()
    if (isOnHomePage()) {
        log('on the homepage, going to private track')
        raceYourFriends()
        return tick()
    }
    if (!isBotInChat()) {
        // Check again in a second to be sure.
        setTimeout(function() {
          if (!isBotInChat()) {
            log('leaving the racetrack because it seems I am not in it anymore')
            if (inRace()) leaveRace()
              leaveRacetrack()
          }
          return tick()
        }, 1000)
        return
    }
    if (getNumberOfUsers() < 2) {
        if (inRace()) {
            log('alone, so leaving the current race')
            leaveRace()
            return tick()
        }
        log('alone on the private track')
        // No one but the bot in the track.
        return tick()
    }
    // We have another user in the track
    var trackIs = status()
    if (trackIs.noRace && !waitingForNewQuote()) {
        log('Joining race')
        // Give a little time just to try and avoid glitchy track issue.
        setTimeout(joinRace, 500)
        setTimeout(sendQuoteText, 700)
        setTimeout(tick, 1000)
        return
    }
    if (trackIs.waitingForOthers){
        log('waiting for others...')
        return tick()
    }
    if (trackIs.countingDown || trackIs.racing) {
        if (inRace() && getNumberOfRacingUsers() < 2) {
          log('leaving race because I am the only racer')
          postRaceResults()
          leaveRace()
          // Delay after leaving to allow new quote to queue.
          setTimeout(tick, 2000)
          return
        }
        if (inRace()) {
            log('in race, waiting for everyone to finish')
        } else {
            log('race is going, not in it...')
        }
        return tick()
    }
    if (trackIs.raceOver) {
        log('race over...')
        return tick()
    }
    log('unknown state')
    return tick()
}

function kickOffLoop() {
  if ($('.mainMenuItem').is(':visible')) {
      mainLoop()
  } else {
      setTimeout(kickOffLoop, 100)
  }
}
kickOffLoop()