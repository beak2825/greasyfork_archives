// ==UserScript==
// @name         Typeracer Floating Input
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to make long texts doable!
// @author       Ted Morin
// @match        https://play.typeracer.com/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/37549/Typeracer%20Floating%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/37549/Typeracer%20Floating%20Input.meta.js
// ==/UserScript==
/* jshint asi:true */

var lastCalled = Date.now()
var setupLoopRunning = false
var lastTargetOffset = 0
var inputPanel = function() { return $('table.inputPanel') }
var activeWord = function() { return $('.nonHideableWords > span:nth-child(2)') }
var completedText = function() { return $('.nonHideableWords > span:nth-child(1)') }
var inputBox = function() { return $('.inputPanel > tbody > tr:nth-child(2) > td:first-child') }
var commonPrefixLength = function(first, second) {
    for (var i = 0; i < first.length; i++) {
        if (first[i] !== second[i]) {
            return i
        }
    }
    return first.length
}
var inputBoxInput = function() { return $('.inputPanel input.txtInput') }
var updateProgressBar = function() {
    var progress = $('.floating-progress-bar')
    if (!progress.length) {
        inputBox().prepend('<div class="progress-bar-container"><div class="floating-progress-bar"></div></div>')
        var container = $('.progress-bar-container')
        container.css('width', '98%')
        container.css('border', '1px solid #eee')
        container.css('margin', '0 auto')
        container.css('margin-top', '3px')
        progress = $('.floating-progress-bar')
        progress.css('height', '5px')
        progress.css('background-color', 'rgba(50, 50, 50, 0.5)')
        progress.css('transition', 'all 150ms')
    }
    progress.css('width', quotePercentage() + '%')
    return progress
}
var quotePercentage = function() {
    var totalQuoteCharacters = $('.nonHideableWords').text().trim().length
    var completedQuoteCharacters = completedText().text().length
    var currentWordProgress = commonPrefixLength(activeWord().text(), inputBoxInput().val())
    return 100 * (completedQuoteCharacters + currentWordProgress) / totalQuoteCharacters
}
var relativeActiveWordOffset = function() {
    var inputPanelOffset = inputPanel().offset()
    var activeWordOffset = activeWord().offset()
    if (!inputPanelOffset || !activeWordOffset) return {}
    return { top: activeWordOffset.top - inputPanelOffset.top, left: activeWordOffset.left - inputPanelOffset.left }
}

var setup = function() {
    setupLoopRunning = true
    inputPanel().css('position', 'relative')
    inputBox().css('position', 'absolute')
    inputBox().css('width', '98%')
    inputBox().css('background-color', 'white')
    inputBox().css('transition', 'all 100ms')
    inputBox().css('box-shadow', '0px 0px 5px')
    inputBoxInput().on('keyup', moveInputBox)
    inputBoxInput().css('margin-left', '5px')
    if (!lastTargetOffset) {
        moveInputBox()
        setTimeout(setup, 1000)
    } else {
        setupLoopRunning = false
    }

}
var moveInputBox = function() {
    // Prevent lag by only making the modification within 50ms
    if ((Date.now() - lastCalled) < 50) return
    lastCalled = Date.now()

    var relativeOffset = relativeActiveWordOffset()
    var inputBoxOffset = inputBox().css('top')
    if (relativeOffset.top) {
        var targetTop = relativeOffset.top + 60
        if (inputBoxOffset.top !== targetTop) {
            lastTargetOffset = targetTop
            inputBox().css('top', targetTop)
        }
    }
    setTimeout(updateProgressBar, 50)
}

;(function() {
    'use strict';
    // Set whole quote + input table to position relative
    setup()
    setInterval(function() {
        if (inputBox().css('position') !== 'absolute' && !setupLoopRunning) {
            lastTargetOffset = 0
            setup()
        }
    }, 2000)
})();