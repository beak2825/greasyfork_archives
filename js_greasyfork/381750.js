// ==UserScript==
// @name        KissAnime-External-Player
// @version     0.1
// @description Open KissAnime episodes in a external player
// @author      Jiiks - https://github.com/Jiiks/KissAnime-External-Player
// @include     http://kissanime.to/*
// @grant       none
// @namespace https://greasyfork.org/users/291415
// @downloadURL https://update.greasyfork.org/scripts/381750/KissAnime-External-Player.user.js
// @updateURL https://update.greasyfork.org/scripts/381750/KissAnime-External-Player.meta.js
// ==/UserScript==

const playerName = "Pot Player"; //Change these to your preferred player
const playerSchema = "potplayer://"; //Change these to your preferred player
var fallBackUrl = undefined;

$(document).ready(() => {
  if(document.location.search.indexOf("open=external") > -1) {
    var videoUrl = getVideoUrl();
    if(videoUrl != null) {
      window.location = videoUrl;
      window.close();
    } else {
      alert("Failed to locate video :(");
    }
  } else {
    $.each($(".listing a"), function() { 
      var t = $(this);
      var href = t.attr("href");
      t.parent().append("<span> - </span>").append(`<a target="_blank" href="${href}&open=external">Play with ${playerName}</a>`)
    });
    $("<a/>", {
      css: {
        "border": "1px solid #383838",
        "outline": "1px solid #000",
        "background": "#303030",
        "padding": "10px",
        "display": "inline-block",
        "margin-top": "5px",
        "margin-bottom": "5px",
        "cursor": "pointer"
      },
      text: `Play with ${playerName}`,
      click: (e) => {
        window.location = getVideoUrl();
        setTimeout(() => {
          $(".vjs-playing").click();
        }, 200);
      }
    }).insertBefore($("#switch").parent());
    fallBackUrl = getVideoUrl();
  }
});

function getVideoUrl() {
  var video = $("video");
  if(video.length > 0) {
    return `${playerSchema}${video.attr("src")}`;
  }
  if(fallBackUrl != undefined) {
    return fallBackUrl;
  }
  return null;
}

