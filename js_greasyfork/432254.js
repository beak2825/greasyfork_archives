// ==UserScript==
// @name         Anime Songs - AniList Player
// @namespace    Openings and Endings Player
// @version      2.2.1
// @description  This Script allows You to play Openings and Endings directly on AniList
// @author       NurarihyonMaou
// @match        https://anilist.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.5.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/432254/Anime%20Songs%20-%20AniList%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/432254/Anime%20Songs%20-%20AniList%20Player.meta.js
// ==/UserScript==

const $ = window.jQuery;

let result;

let openings, endings;

let audioUrls = ['https://animethemes.moe/audio/', 'https://a.animethemes.moe/', 'https://beta.animethemes.moe/audio/'];
let videoUrls = ['https://animethemes.moe/video/', 'https://v.animethemes.moe/', 'https://beta.animethemes.moe/video/'];

let urlsIndex = GM_getValue("urlsIndex") ?? 1;

//let audioURLAddon = "-NCBD1080";

let url = "https://graphql.anilist.co";

let AnimeID;

let AniID = { id: parseInt(window.location.pathname.split("/")[2]) };

const VideoIcon = `<svg class="svg-inline--fa fa-solid fa-video"aria-hidden="true" data-fa-processed="" data-prefix="fa" data-icon="video" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>`;
const MusicIcon = `<svg class="svg-inline--fa fa-solid fa-music"aria-hidden="true" data-fa-processed="" data-prefix="fa" data-icon="music" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"/></svg>`;

const ToggleStyle = `.AudioMode {
	width:45px;
	height:15px;
	background-color: grey;
	position: relative;
	transition: ease-in-out 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
}
.circle {
	border-radius:50%;
	width: 30px;
	max-height: 30px;
	color:red;
	z-index: 9999;
	position: absolute;
	left:0;
	transition: ease-in-out 0.5s;
}
.circle svg {
	transition: ease-in-out 0.5s;
	color:red;
}
.active{
	left:50%;
}
`;

GM_addStyle(ToggleStyle);

let AudioMode = GM_getValue("AudioMode") ?? false;

async function getAID() {
  AniID = { id: parseInt(window.location.pathname.split("/")[2]) };

  let query = `
          query ($id: Int) {
          Media (id: $id, type: ANIME) {
          idMal
          }
          }
          `;

  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: query,
      variables: AniID,
    }),
  };

  await fetch(url, options)
    .then(handleResponse)
    .then(handleData)
    .catch(handleError);

  function handleResponse(response) {
    return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
    });
  }

  function handleData(data) {
    AnimeID = data.data.Media.idMal;
  }

  function handleError(error) {
    console.error(error);
  }
}

async function returnThemes() {
  await getAID();

  let response = $.ajax({
    url: `https://api.jikan.moe/v4/anime/${AnimeID}/themes`,
    method: "GET",
    success: function (data) {
      return data;
    },
    error: function (error) {
      alert("Something went wrong.\n" + error.errorMessage);
    },
  });
  return response;
}

function appendThemes() {
  if ($("body").find("div.openings").length == 0)
    $("body div.characters").after(
      "<div class='openings'><h2>Openings</h2></div>"
    );
  else {
    $("body div.characters").after($("body").find("div.openings"));
    $("body").find("div.openings").html("<h2>Openings</h2>");
  }
  if ($("body").find("div.endings").length == 0)
    $("body div.openings").after("<div class='endings'><h2>Endings</h2></div>");
  else {
    $("body div.openings").after($("body").find("div.endings"));
    $("body").find("div.endings").html("<h2>Endings</h2>");
  }

  themes.data.openings.forEach((opening) => {
    $("body").find("div.openings").append(`<ul class='tag'>${opening}</ul>`);
  });
  themes.data.endings.forEach((ending) => {
    $("body").find("div.endings").append(`<ul class='tag'>${ending}</ul>`);
  });

  if (parseInt(AniID.id) != 112323) {
    if ($("body").find("div.AudioMode").length == 0)
      $("body div.openings").before(
        `<input id="urlsIndex" type="range" value="${urlsIndex}" min="0" max="2"/> URL Slider - use this when the Player(s) don't work<div class="AudioMode"><button class="${
          !AudioMode ? "circle" : "circle active"
        }">${AudioMode ? MusicIcon : VideoIcon}</button></div></br>`
      );
    else $("body div.openings").before($("body").find("div.AudioMode"));
  }
}

$("body").on("click", "div.AudioMode", function () {
  AudioMode = !AudioMode;

  if (AudioMode) {
    $(this).children().addClass("active");
    $(this).children().html(MusicIcon);
  } else {
    $(this).children().removeClass("active");
    $(this).children().html(VideoIcon);
  }

  GM_setValue("AudioMode", AudioMode);

  $("body").find(".AnimeThemesPlayer").remove();

  loadVideos();
});

$("body").on("change", "input#urlsIndex", function () {

    urlsIndex = document.getElementById('urlsIndex').value;

    GM_setValue("urlsIndex", urlsIndex);

    $("body").find(".AnimeThemesPlayer").remove();

    loadVideos();
  });

function loadVideos() {
  let Song = 0;

  (function init() {
    openings = document.getElementsByClassName("openings");
    endings = document.getElementsByClassName("endings");
    if (openings.length > 0 || endings.length > 0) {
      GM_xmlhttpRequest({
        method: "GET",
        url:
          "https://api.animethemes.moe/anime?filter[has]=resources&filter[site]=MyAnimeList&filter[external_id]=" +
          AnimeID +
          "&include=animethemes.animethemeentries.videos,animethemes.song.artists",
        data: AnimeID,
        headers: { "Content-Type": "application/json" },
        onload: function (response) {
          result = JSON.parse(response.responseText);

          openings = openings.length > 0 ? openings : endings;
          if ($("body .AnimeThemesPlayer").length == 0) {
            $(openings).append(
              AudioMode
                ? "<audio style='display: none' class='AnimeThemesPlayer' width='500px' height='300' src=''controls autoplay/>"
                : "<video style='display: none' class='AnimeThemesPlayer' width='500px' height='300' src='' allowfullscreen controls autoplay/>"
            );
          }

          $("body div.IMOE").remove();

          if ($("body").find("a#AnimeThemesLink").length == 0)
            $("body")
              .find("div.openings")
              .before(
                `<a id="AnimeThemesLink" href="https://animethemes.moe/anime/${result.anime[0].slug}">AnimeThemes - Videos Source</a></br></br>`
              );

          for (Song; Song < result.anime[0].animethemes.length; Song++) {
            let CurrSongMatch = false;
            $("div.openings, div.endings")
              .children(".tag")
              .filter(function (x) {
                let entriesCount = $("div.openings, div.endings").children(
                  ".tag"
                ).length;
                let currSong = $(this);

                let safetyIndicator = result.anime[0].animethemes[Song]
                .animethemeentries[0].nsfw
                ? "NSFW"
                : "";
              safetyIndicator +=
                safetyIndicator == "NSFW"
                  ? result.anime[0].animethemes[Song].animethemeentries[0]
                      .spoiler
                    ? " && Spoilers "
                    : " "
                  : result.anime[0].animethemes[Song].animethemeentries[0]
                      .spoiler
                  ? "Spoilers "
                  : " ";

                if (
                  $(currSong)
                    .text()
                    .toLowerCase()
                    .split(" by ")[0]
                    .replace(/\(([^)]+)\)/, "")
                    .replace(/[“"”]+/g, "")
                    .replace(/\#\d*:/g, "")
                    .replace(/\d*\:/g, "")
                    .replace(/[^\w\s]/gi, " ")
                    .replace(/ /g, "")
                    .trim() ==
                  result.anime[0].animethemes[Song].song.title
                    .toLowerCase()
                    .replace(/\(([^)]+)\)/, "")
                    .replace(/\#\d*:/g, "")
                    .replace(/[^\w\s]/gi, " ")
                    .replace(/^0+/, "")
                    .replace(/ /g, "")
                    .trim()
                ) {

                  CurrSongMatch = true;
                  $(currSong).html(
                    AudioMode
                      ? "<span style='color: red;'>" +
                          safetyIndicator +
                          "</span><a href='"+audioUrls[urlsIndex]+
                          result.anime[0].animethemes[Song].animethemeentries[0]
                            .videos[0].filename +
                          ".ogg'>" +
                          $(currSong).text() +
                          "</a>"
                      : "<span style='color: red;'>" +
                          safetyIndicator +
                          "</span><a href='"+videoUrls[urlsIndex]+
                          result.anime[0].animethemes[Song].animethemeentries[0]
                            .videos[0].basename +
                          "'>" +
                          $(currSong).text() +
                          "</a>"
                  );
                }

                if (x == entriesCount - 1 && CurrSongMatch == false) {
                  if ($("div.IMOE").length == 0) {
                    if ($("div.endings").length > 0) {
                      $("div.endings").after(
                        '<div class="IMOE" style="margin-bottom: 30px;"><h2>Additional OPs and EDs</h2></div>'
                      );
                    } else if ("div.openings".length > 0) {
                      $("div.endings").after(
                        '<div class="IMOE" style="margin-bottom: 30px;"><h2>Additional OPs and EDs</h2></div>'
                      );
                    } else {
                      $("div.characters").after(
                        '<div class="IMOE" style="margin-bottom: 30px;"><h2>Additional OPs and EDs</h2></div>'
                      );
                    }
                  }
                  let CurrentSongArtists = "";
                  for (
                    let Artists = 0;
                    Artists <
                    result.anime[0].animethemes[Song].song.artists.length;
                    Artists++
                  ) {
                    CurrentSongArtists +=
                      result.anime[0].animethemes[Song].song.artists[Artists]
                        .name + " ";
                  }
                  if (CurrentSongArtists == "") CurrentSongArtists = "???";
                  $("div.IMOE").append(
                    AudioMode
                      ? "<span style='color: red;'>" +
                          safetyIndicator +
                          "</span><ul class='tag'><a href='"+audioUrls[urlsIndex]+
                          result.anime[0].animethemes[Song].animethemeentries[0]
                            .videos[0].filename +
                          ".ogg'>" +
                          result.anime[0].animethemes[Song].song.title +
                          " by " +
                          CurrentSongArtists +
                          "</a></ul>"
                      : "<span style='color: red;'>" +
                          safetyIndicator +
                          "</span><ul class='tag'><a href='"+videoUrls[urlsIndex]+
                          result.anime[0].animethemes[Song].animethemeentries[0]
                            .videos[0].basename +
                          "'>" +
                          result.anime[0].animethemes[Song].song.title +
                          " by " +
                          CurrentSongArtists +
                          "</a></ul>"
                  );
                  CurrentSongArtists = "";
                }
              });
          }
        },
        onerror: function (error) {
          console.log(error);
        },
      });
    } else {
      setTimeout(init, 0);
    }
  })();
}

function SetArifureta() {
  $("body").find(".AudioMode").remove();
  $("body").find("#AnimeThemesLink").remove();

  if ($("body iframe.AnimeThemesPlayer").length == 0) {
    $("body")
      .find("div.openings")
      .append(
        "<iframe style='display: none' class='AnimeThemesPlayer' width='500px' height='300' src='' allowfullscreen/>"
      );
  }

  if ($("body").find("a#MyYTChannel").length == 0)
    $("body")
      .find("div.openings")
      .before(
        `<a id="MyYTChannel" href="https://www.youtube.com/c/NurarihyonMaou">My YT Channel</a></br></br>`
      );

  $("div.openings")
    .children(".tag")
    .html(
      '<a href="https://www.youtube.com/embed/s0vm9JVjexY?autoplay=1">"Daylight" by MindaRyn</a>'
    );

  $("div.endings")
    .children(".tag")
    .html(
      '<a href="https://www.youtube.com/embed/5aJWWk9B78E?autoplay=1">"Gedou Sanka (外道讃歌)" by FantasticYouth</a>'
    );
}

let themes;

async function loadThemesAndVideos() {
  themes = await returnThemes();
  appendThemes();

  if (parseInt(AniID.id) == 112323) SetArifureta();
  else loadVideos();
}

$(window).on("load", async function () {
  if (window.location.pathname.split("/")[1] === "anime") {
    await loadThemesAndVideos();

    $("body").on("click", ".tag", function (e) {
      e.preventDefault();

      if ($(this).children().length == 0) {
        alert(
          "Sadly, this OP/ED is Missing or there's a bug in the Script (Check Instruction)"
        );
      } else if (
        $("body .AnimeThemesPlayer").css("display") == "none" ||
        $(this).children("a").attr("href") !=
          $("body .AnimeThemesPlayer").attr("src")
      ) {
        $("body .AnimeThemesPlayer").css("display", "block");

        $("body .AnimeThemesPlayer").attr(
          "src",
          $(this).children("a").attr("href")
        );
      } else if (
        $(this).children("a").attr("href") ==
        $("body .AnimeThemesPlayer").attr("src")
      ) {
        $("body .AnimeThemesPlayer").css("display", "none");
        $("body .AnimeThemesPlayer").attr("src", "");
      }
    });
  }
});

let oldURL;

(function () {
  let pushState = history.pushState;
  let replaceState = history.replaceState;

  history.pushState = function () {
    pushState.apply(history, arguments);
    window.dispatchEvent(new Event("pushstate"));
    window.dispatchEvent(new Event("locationchange"));
  };

  history.replaceState = function () {
    replaceState.apply(history, arguments);
    window.dispatchEvent(new Event("replacestate"));
    window.dispatchEvent(new Event("locationchange"));
  };

  window.addEventListener("popstate", function () {
    window.dispatchEvent(new Event("locationchange"));
  });

  $(window).on("load", function () {
    GM_setValue("oldURL", $(location).attr("pathname").split("/")[1]);
  });

  window.addEventListener("locationchange", function () {
    oldURL = GM_getValue("oldURL");

    if (
      oldURL != "anime" &&
      $(location).attr("pathname").split("/")[1] == "anime"
    ) {
      GM_setValue("oldURL", $(location).attr("pathname").split("/")[1]);
      location.reload();
    } else if (
      oldURL == "anime" &&
      $(location).attr("pathname").split("/")[1] == "anime"
    ) {
      loadThemesAndVideos();
    } else {
      GM_setValue("oldURL", $(location).attr("pathname").split("/")[1]);
    }
  });
})();
