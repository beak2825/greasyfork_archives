// ==UserScript==
// @name         Prefill Free Trial
// @description  Prefills the form with test data, and a serialized email that (probably) hasn't been used already.
// @namespace    http://jonas.ninja
// @version      1.0.1
// @author       @i2nj3s
// @match        *://*.sentryone.com/download-trial/trial*
// @match        *://*.sentryone.com/download-trial/success*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/26299/Prefill%20Free%20Trial.user.js
// @updateURL https://update.greasyfork.org/scripts/26299/Prefill%20Free%20Trial.meta.js
// ==/UserScript==
/* jshint -W097 */
/* global $, GM_getValue, GM_setValue */
/* jshint asi: true, multistr: true */
'use strict';



var myUsername = 'igomes'
var myDomain   = 'webdev.test'









var lastDateKey = 'lastDate'
var lastCountKey = 'lastCount'
manageStoredUsernameAndDomain()

if (isSuccessPage()) {
  var email = document.getElementsByClassName('customerEmail')[0].textContent
  var date = email.slice(6,16)
  var letters = email.slice(16, email.indexOf('@'))
  var currentCount = GM_getValue(lastCountKey)
  GM_setValue(lastDateKey, date)
  GM_setValue(lastCountKey, numberFromLetters(letters))
} else {
  setFieldValue('FirstName')
  setFieldValue('LastName')
  setFieldValue('EmailAddress', getNextID())
  setFieldValue('CompanyName')
  setFieldValue('Phone', 1232351234)
  setFieldValue('Country', 182)
}

function getNextID() {
  var lastDate = GM_getValue(lastDateKey)
  var todayDate = (new Date()).toISOString().slice(0,10)

  // if the last date isn't set, just return the obvious first value
  // if the last date is in the past, also return first value
  // if the last date is today, generate a new value based on historical records
  if (typeof lastDate === 'undefined' || lastDate < todayDate) {
    return makeEmail('a')
  } else { // lastDate === todayDate
    return makeEmail(lettersFromNumber(GM_getValue(lastCountKey) + 1))
  }

  function makeEmail(letters) {
    return myUsername + todayDate + letters + '@'+ myDomain
  }
}

function setFieldValue(id, value) {
  document.getElementById(id).value = value || 'test'
}

function manageStoredUsernameAndDomain() {
  var usernameKey = 'username'
  var domainKey = 'domain'

  var storedUsername = GM_getValue(usernameKey)
  if (typeof storedUsername === 'undefined') {
    // this script has never been run before.
    if (myUsername === 'pleaseUpdateMe') {
      // the user has not set his first username. Use the default.
    } else {
      // the user has set his first username. Store it and use it.
      GM_setValue(usernameKey, myUsername)
    }
  } else {
    // We have stored a username before. See if it changed
    if (myUsername === storedUsername) {
      // the user has not changed their username
    } else {
      // the user saved a username, and it recently changed. BUT we don't know if this was intentional, or the script auto-updating.
      if (myUsername === 'pleaseUpdateMe') {
        // just a script update. Ignore the change an use what's saved.
        myUsername = storedUsername
      } else {
        // the user really did intentionally update his username. Persist it.
        GM_setValue(usernameKey, myUsername)
      }
    }
  }

  // logically equivalent to the above, but for the domain:
  var storedDomain = GM_getValue(domainKey)
  if ((typeof storedDomain === 'undefined' && myDomain !== 'someDomain.com') || (myDomain !== storedDomain && myDomain !== 'someDomain.com')) {
    GM_setValue(domainKey, myDomain)
  } else if (typeof storedDomain !== 'undefined' && myDomain !== storedDomain && myDomain === 'someDomain.com') {
    myDomain = storedDomain
  }
}

function isSuccessPage() {
  return window.location.href.indexOf('download-trial/trial') === -1
}

function lettersFromNumber(num) {
  if (num < 1 || isNaN(num)) {
    num = 1
  }
  num -= 1
  var lower = num % 26
  var upper = Math.floor(num  / 26)
  var letters = ''
  if (upper > 0) {
    letters += String.fromCharCode(upper + 96)
  }
  return letters += String.fromCharCode(lower + 97)
}

function numberFromLetters(letters) {
  var higher = 0
  var lower = letters.codePointAt(0) - 96
  if (letters.length > 1) {
    higher = lower
    lower = letters.codePointAt(1) - 96
  }
  return (higher * 26) + lower
}
