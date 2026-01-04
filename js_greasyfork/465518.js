// ==UserScript==
// @name        Youtube Embed Whatever Wherever
// @namespace   https://greasyfork.org/en/users/945115-unmatchedbracket
// @match       *://www.youtube.com/embed/*
// @match       *://www.youtube-nocookie.com/embed/*
// @grant       none
// @run-at      document-body
// @version     1.0.3
// @author      Unmatched Bracket
// @license     The Unlicense
// @description Forces Youtube embeds to play anywhere, even if UMG/SMG disagrees.
// @downloadURL https://update.greasyfork.org/scripts/465518/Youtube%20Embed%20Whatever%20Wherever.user.js
// @updateURL https://update.greasyfork.org/scripts/465518/Youtube%20Embed%20Whatever%20Wherever.meta.js
// ==/UserScript==
 
function modulate () {
  let player_response = JSON.parse(ytcfg.data_.PLAYER_VARS.embedded_player_response)
 
  if (player_response.previewPlayabilityStatus.status == "OK") return
  player_response.previewPlayabilityStatus.status = "OK"
  player_response.previewPlayabilityStatus.playableInEmbed = true
  delete player_response.previewPlayabilityStatus.reason
  delete player_response.previewPlayabilityStatus.errorScreen
 
  ytcfg.data_.PLAYER_VARS.embedded_player_response = JSON.stringify(player_response)
 
  ytcfg.data_.WEB_PLAYER_CONTEXT_CONFIGS.WEB_PLAYER_CONTEXT_CONFIG_ID_EMBEDDED_PLAYER.isEmbed = false
  ytcfg.data_.INNERTUBE_CONTEXT.client.originalUrl = `https://www.youtube.com/watch?v\u003d${ytcfg.data_.VIDEO_ID}`
}
 
function tick () {
  if (window.ytcfg) modulate()
  else requestAnimationFrame(tick)
}
 
if (window.ytcfg) modulate()
else tick()