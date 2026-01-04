// ==UserScript==
// @name        shin KGS timer sounds
// @namespace   Violentmonkey Scripts
// @match       https://shin.gokgs.com/*
// @description Plays a beeping noise every five minutes of your clock, as well as 1m left and every second when time is less than or equal to ten seconds
// @grant       none
// @version     1.0
// @license     CC-0
// @author      blechx
// @run-at      document-end
// @description 12/16/2024, 1:21:28 AM
// @downloadURL https://update.greasyfork.org/scripts/520947/shin%20KGS%20timer%20sounds.user.js
// @updateURL https://update.greasyfork.org/scripts/520947/shin%20KGS%20timer%20sounds.meta.js
// ==/UserScript==

var audio_context
var envelope
var freq = 420
var volume = 0.05
var decay = 0.1

function setup_context() {
	audio_context = new AudioContext()

	envelope = audio_context.createGain()
	envelope.gain.value = 0
	envelope.connect(audio_context.destination)

	var oscillator = audio_context.createOscillator()
	oscillator.type = "sine"
	oscillator.frequency.value = 420
	oscillator.connect(envelope)
	oscillator.start()
}

function play_click() {
	if (!audio_context) {
		setup_context();
	}

	var time = audio_context.currentTime

	envelope.gain.setValueAtTime(volume, time)
	envelope.gain.linearRampToValueAtTime(0.0, time + decay)

	console.log("play_click")
}

// global interval handle
var interval_handle

function setup_notifications() {
	// first username is always self user when logged in
	var target_div = document.querySelector(".UserName")

	if (!target_div) {
		console.log("No logged in user detected, trying again in a sec")

		window.setTimeout(setup_notifications, 1000)
		return
	}

	var target_name = target_div.innerText;

	console.log("setting up script for user", target_name)

	var last_checked_time = 0

	var countdown_divs = document.querySelectorAll(".GamePlayersInfo-color .TimeCountdown")

	console.log("countoown_divs", countdown_divs)

	var interval_ms = 50

	window.clearInterval(interval_handle)
	interval_handle = null;

	for (var countdown_div of countdown_divs) {
		var surrounding_div = countdown_div.closest(".GamePlayersInfo-color")
		var player_name = surrounding_div.querySelector('.UserName').innerText

		console.log("considering", player_name)

		if (player_name == target_name) {
			console.log("found player info", target_name)

			interval_handle = window.setInterval(function () {
				var time_string = countdown_div.innerText
				var min_sec = time_string.split(" ")[0].split(":")

				var minutes = Number(min_sec[0])
				var seconds = Number(min_sec[1])

				console.log(minutes, seconds)

				var total = minutes * 60 + seconds

				if (seconds != last_checked_time) {
					if ((minutes % 5) == 0 && seconds == 0)  { play_click() }
					if (minutes == 1       && seconds == 0)  { play_click() }
					if (minutes == 0       && seconds <= 10) { play_click() }

					last_checked_time = seconds
				}
			}, interval_ms)

			break
		}
	}

	if (!interval_handle) {
		console.log("could not find player clock, retrying")
		window.setTimeout(setup_notifications, 1000)
	}
}

setup_notifications()
