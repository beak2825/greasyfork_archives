// ==UserScript==
// @name     XKCD -- Easy Random
// @description Quicker and more reliable "random comic" button
// @license MIT
// @version  1
// @namespace https://keybase.io/jpaugh
// @support  Chat with me on Keybase
// @author   Jonathan Paugh
// @grant    none
// @match 	 https://xkcd.com/*
// @compatible firefox
// @compatible chrome
// @compatible IE11 --- not that it helps
// @downloadURL https://update.greasyfork.org/scripts/381577/XKCD%20--%20Easy%20Random.user.js
// @updateURL https://update.greasyfork.org/scripts/381577/XKCD%20--%20Easy%20Random.meta.js
// ==/UserScript==

var MAGICAL_BG_COLOR = "orangered"
var XKCDS_WHEN_CHECKED = 2134
var XKCD_CHECK_DATE = new Date(2019, 4, 9)
var COMICS_PER_WEEK = 3

function guestimateCurrentCount() {
  var now = new Date()
  var MILLI_PER_WEEK = 7 * 24 * 60 * 60 * 1000
  var weeksSinceChecked = (now.getTime() - XKCD_CHECK_DATE.getTime()) / MILLI_PER_WEEK
  return XKCDS_WHEN_CHECKED + Math.floor(weeksSinceChecked * COMICS_PER_WEEK) // Works for past and future dates! :-D
}

function getRandomComicInclusive(min, max) {
  min = Math.ceil(min) // Why did you give me a fractional min? You sneaky caller!
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

var min = 1
var max = guestimateCurrentCount()
// TODO: Add a fudge factor (+20) to the max, and then pre-load the new comic to ensure it exists.
// Maybe I should load it via AJAX and overwrite the current page? IDK

var randLinks = document.querySelectorAll("a[href^='//c.xkcd.com/random/comic']")
Array.prototype.forEach.call(randLinks, function (el) {
  el.style.backgroundColor = MAGICAL_BG_COLOR
  el.addEventListener("click", function (event) {
    (event.preventDefault)
      ? event.preventDefault()
      : (event.returnValue = false)
    window.location.href = "https://xkcd.com/" + getRandomComicInclusive(min, max)
  })
});