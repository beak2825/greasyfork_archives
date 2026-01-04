// ==UserScript==
// @name			YouTube HD Override
// @namespace		http://www.youtube.com/
// @version			2.9.4
// @description		Makes YouTube videos run in high definition + YouTube fixes
// @include			http://*.youtube.com/*
// @include			https://*.youtube.com/*
// @exclude			http://apiblog.youtube.com/*
// @exclude			https://apiblog.youtube.com/*
// @run-at			document-end
// @copyright		Prehistoricman Inc. 2015
// @downloadURL https://update.greasyfork.org/scripts/453694/YouTube%20HD%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/453694/YouTube%20HD%20Override.meta.js
// ==/UserScript==

console.log("YouTube HD Override loaded")
var CurrentVersion = 2.94
HDOSettings = {}
if (localStorage.HDOLastUpdate == undefined) {//|| parseFloat(localStorage.HDOLastUpdate) < CurrentVersion) { //No stats, reset all
	HDOSettings.HD = true
	HDOSettings.VideoAutoPlay = false
	HDOSettings.ChannelAutoPlay = false
	HDOSettings.DASHPlayback = false
	HDOSettings.PauseInvisible = true
	HDOSettings.HighestQuality = 9
	HDOSettings.CommentNewTab = true
	HDOSettings.DisableShareAfterVideo = true
	localStorage.HDOverride = JSON.stringify(HDOSettings)
	localStorage.HDOLastUpdate = CurrentVersion
	
} else if (parseFloat(localStorage.HDOLastUpdate) == 2.9) { //Smooth update for 2.9.x users
	HDOSettings = JSON.parse(localStorage.HDOverride)
	HDOSettings.DisableShareAfterVideo = true
	localStorage.HDOverride = JSON.stringify(HDOSettings)
	localStorage.HDOLastUpdate = CurrentVersion
	
} else if (parseFloat(localStorage.HDOLastUpdate) == 2.6) { //Smooth update for 2.8.3 users
	HDOSettings = JSON.parse(localStorage.HDOverride)
	HDOSettings.CommentNewTab = true
	HDOSettings.DisableShareAfterVideo = true
	localStorage.HDOverride = JSON.stringify(HDOSettings)
	localStorage.HDOLastUpdate = CurrentVersion
	
} else if (parseFloat(localStorage.HDOLastUpdate) < CurrentVersion) { //Reset stats for old versions
	HDOSettings.HD = true
	HDOSettings.VideoAutoPlay = false
	HDOSettings.ChannelAutoPlay = false
	HDOSettings.DASHPlayback = false
	HDOSettings.PauseInvisible = true
	HDOSettings.HighestQuality = 6
	HDOSettings.CommentNewTab = true
	HDOSettings.DisableShareAfterVideo = true
	localStorage.HDOverride = JSON.stringify(HDOSettings)
	localStorage.HDOLastUpdate = CurrentVersion
	
} else {
	HDOSettings = JSON.parse(localStorage.HDOverride)
}
function SaveHDOSettings() {
	localStorage.HDOverride = JSON.stringify(HDOSettings)
	console.log("Save successful")
}
if (typeof unsafeWindow != "undefined") {
	unsafeWindow.HDOSettings = HDOSettings
	unsafeWindow.SaveHDOSettings = SaveHDOSettings
}

var LastUrl = ""
var LastHREF = ""
var Qualities = {tiny : 1, small : 2, medium : 3, large : 4, hd720 : 5, hd1080 : 6, hd1440 : 7, highres : 8, hd2160 : 9}
var QArray = ["", "tiny", "small", "medium", "large", "hd720", "hd1080", "hd1440", "highres", "hd2160"]

var Debugging = false

if (Debugging) {
	console.trace()
}

function Print(output) { //It would be immoral to spam others' consoles.
	if (Debugging) {
		console.log(output)
	}
}

function DetectPageType() {
	if (location.href.substring(0, 31) == "https://www.youtube.com/channel" ||
	location.href.substring(0, 31) == "http://www.youtube.com/channel/"     ||
	location.href.substring(0, 28) == "https://www.youtube.com/user"        ||
	location.href.substring(0, 28) == "http://www.youtube.com/user/"        ||
	location.href.substring(0, 25) == "http://www.youtube.com/c/)"          ||
	location.href.substring(0, 26) == "https://www.youtube.com/c/"){
		return "channel"
	} else if (location.href.substring(0, 29) == "https://www.youtube.com/watch" ||
	location.href.substring(0, 29) == "http://www.youtube.com/watch?") {
		return "video"
	} else {
		return "else"
	}
}

function GetVideoElement() {
	if (DetectPageType() == "video") {
		return document.getElementById("movie_player")
	} else if (DetectPageType() == "channel") {
		return document.getElementById("c4-player")
	} else {
		return "nope"
	}
}

function PauseChannelVideo() {
	var PauseInterval = setInterval(function () {
		var ChannelPlayer = document.getElementById("c4-player")
		if (document.getElementById("c4-player")) {
			ChannelPlayer.pauseVideo()
			Print("Paused channel video")
			if (document.getElementById("c4-player").getPlayerState() == 2) {
				clearInterval(PauseInterval)
				Print("Pause interval stopped")
			}
		} else {
			Print("Channel player not found yet")
		}
	}, 30)
}

function GetOverrideQuality(QualityLevels) { //returns string
	var TargetQ = QArray[HDOSettings.HighestQuality] //string
	if (Qualities[QualityLevels[0]] >= HDOSettings.HighestQuality) { //Highest quality available higher than target
		return TargetQ
	} else {
		return QualityLevels[0]
	}
}

function SetHD() {
	var Target = ""
	var HDInterval = setInterval(function () {
		var OverridePlayer = document.getElementById("movie_player")
		if (OverridePlayer) {
			if (OverridePlayer.setPlaybackQuality) {
				if (Target == "" || Target == undefined) {
					Target = GetOverrideQuality(OverridePlayer.getAvailableQualityLevels())
					Print("Target quality is " + Target)
				}
				OverridePlayer.setPlaybackQuality(Target)
				OverridePlayer.setPlaybackQualityRange(Target)
				Print("HD'd video")
				
				if (!HDOSettings.DASHPlayback && ytplayer && ytplayer.config && ytplayer.config.args) {
					ytplayer.config.args.dash = "0"
					ytplayer.config.args.dashmpd = ""
					Print("Set DASH")
				} else if (!HDOSettings.DASHPlayback) { //if we can't find ytplayer
					Print("DASH set failed")
				}
				Print("Set quality")
			}
			if (OverridePlayer.getPlaybackQuality() == Target) {
				/*if (HDOSettings.PauseInvisible && document.visibilityState && document.visibilityState != "visible") {
				} else { //I apologise to all coders in the world. I am truly sorry.
					OverridePlayer.pauseVideo()
					OverridePlayer.playVideo()
				}*/
				clearInterval(HDInterval)
				Print("Quality interval stopped")
			} else {
				Print("check fail")
				Print(OverridePlayer.getPlaybackQuality())
				Print(OverridePlayer.getAvailableQualityLevels()[0])
			}
		} else {
			Print("Player not found yet")
		}
	}, 30)
}

function PauseInactive() {
	if (HDOSettings.PauseInvisible) {
		var Buffered = false
		var PauseInterval = setInterval(function () {
			var OverridePlayer = document.getElementById("movie_player")
			if (OverridePlayer) {
				if (OverridePlayer.getPlayerState) {
					if (!Buffered) {
						Print("Polling buffer")
						if (OverridePlayer.getPlayerState() == 1) {
							Buffered = true
							Print("Buffered")
						}
					}
					if (Buffered) {
						Print(document.visibilityState)
						if (document.visibilityState && document.visibilityState != "visible") { //A non-prefixed property on document? Is this the future??????
							OverridePlayer.pauseVideo()
							Print("Paused inactive tab")
						}
					}
				}
				if (OverridePlayer.getPlayerState() == 2 || document.visibilityState == "visible") { //2 is paused
					clearInterval(PauseInterval)
					Print("Pausing interval stopped")
				} else {
					Print("Not paused yet")
				}
			} else {
				Print("Player not found yet")
			}
		}, 30)
	}
}

function CommentLinks() { //Allows links in comments to open in a new window, credit to a friend :)
	if (HDOSettings.CommentNewTab) {
		var CommentBox = document.querySelector("#watch-discussion")
		Print("Comment box: " + CommentBox)
		if (CommentBox) {
			CommentBox.addEventListener("click", function (event) {
				if (!event.defaultPrevented) {
					var node = event.target
					while (node != null) {
						if (node instanceof HTMLAnchorElement) {
							window.open(node.href)
							event.preventDefault()
						}
						node = node.parentNode
					}
				}
			})
		}
	}
}

function DisableShare() {
	if (HDOSettings.DisableShareAfterVideo) {
		var ShareInterval = setInterval(function () {
			if (yt && yt.config_ && yt.config_.SHARE_ON_VIDEO_END == true) {
				yt.config_.SHARE_ON_VIDEO_END = false //I will share a video when I want to share a video, thanks
			}
		}, 30)
	}
}

function ApplyFixes() {
	Print("ApplyFixes at " + location.href)
	if (DetectPageType() == "channel") {
		if (!HDOSettings.ChannelAutoPlay) { //Everybody hates this shit
			PauseChannelVideo() //Pause video on channel pages
		}
	} else if (HDOSettings.HD && DetectPageType() == "video") {
		CommentLinks()
		SetHD() //Set HD on video pages
		PauseInactive()
		DisableShare()
	} else {
		Print("Who knows???")
		Print(location.href)
		Print(HDOSettings)
	}
}

if (GetVideoElement() && GetVideoElement() != "nope") {
	ApplyFixes()
}

setInterval(function () {
	if (location.href != LastHREF) { //href has changed
		LastHREF = location.href
		Print("Href change")
		var count = 0
		var ApplyInterval = setInterval(function () { //Waits for a new player to load
			count++
			Print("Apply interval for " + ApplyInterval)
			var getvid = GetVideoElement()
			if (getvid && getvid != "nope" && getvid.getVideoUrl() != LastUrl) {
				Print("applyinterval check pass for " + ApplyInterval)
				LastUrl = getvid.getVideoUrl()
				LastHREF = location.href
				ApplyFixes()
				clearInterval(ApplyInterval)
			} else if (getvid == "nope") {
				Print(getvid)
				LastUrl = ""
				Print("stopped on main page")
				clearInterval(ApplyInterval)
			}
			if (count > 70) {
				clearInterval(ApplyInterval) //No freaking excuses
				LastUrl = ""
				Print("stopped on timeout")
			}
		}, 30)
	}
}, 200)

setInterval(function () {
	var mov = document.getElementById("movie_player")
	if (!HDOSettings.VideoAutoPlay && mov && mov.setAutonavState) {
		mov.setAutonavState(1) //Disable auto-nav
	}
}, 1000)