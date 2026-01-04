// ==UserScript==
// @name        Chujowa strona bypass - shinden.pl
// @namespace   Violentmonkey Scripts
// @match       https://shinden.pl/episode/*/view/*
// @grant       none
// @license     MIT
// @require https://code.jquery.com/jquery-3.6.4.min.js
// @version     1.0
// @author      Analyze & nx2
// @description 27.04.2023, 23:16:36
// @downloadURL https://update.greasyfork.org/scripts/465014/Chujowa%20strona%20bypass%20-%20shindenpl.user.js
// @updateURL https://update.greasyfork.org/scripts/465014/Chujowa%20strona%20bypass%20-%20shindenpl.meta.js
// ==/UserScript==

const apiUrl = "https://api4.shinden.pl"

function loadPlayer(playerId) {
  $.ajax({
    url: `${apiUrl}/xhr/${playerId}/player_load`,
    xhrFields: {
      withCredentials: true
    }
  })

  setTimeout(() => {
    $.ajax({
      url: `${apiUrl}/xhr/${playerId}/player_show?width=768&height=-1`,
      xhrFields: {
        withCredentials: true
      },
      success: (data) => {
          $('#player-block').html(data);
      }
    })
  }, 6000)
}

$(".change-video-player").on("click", event => {
  $('#player-block').html("<label>Proszę poczekać 6 sekund....</label>");

  dataEpisode = JSON.parse($(event.target).attr("data-episode"))
  loadPlayer(dataEpisode["online_id"])
})

