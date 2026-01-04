// ==UserScript==
// @name        Javbus tag助手
// @namespace   Javbus tag助手

// @include     http*://www.p26y.com/*
// @include     http*://www.k25m.com/*
// @include     http*://www.javlibrary.com/*
// @include     http*://www.javbus.com/*
// @include     http*://avmoo.online/*

// @require https://code.jquery.com/jquery-3.6.0.min.js
// @version     0.1
// @license MIT
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @description:zh-cn haha
// @description haha
// @downloadURL https://update.greasyfork.org/scripts/520206/Javbus%20tag%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/520206/Javbus%20tag%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

"use strict";

let movies = [];

let postNewMovies = async (movies) => {
  $.ajax({
    type: "POST",
    url: "https://www.mingren.life/av/general",
    contentType: "application/json", // Set the content type to application/json
    dataType: "json",
    data: JSON.stringify(movies),
    success: function (result) {
      console.log("Request succeeded:", result);
    },
    error: function (err) {
      console.error("Request failed:", err);
    },
  });
};

let checkAndAddMovie = (movie) => {
  return new Promise((resolve) => {
    $.ajax({
      url: `https://www.mingren.life/av/${movie.code}`,
      success: (result) => {
        if (!result) {
          // 如果电影不在服务器中，则通过 GM_xmlhttpRequest 获取详细信息
          GM_xmlhttpRequest({
            method: "GET",
            url: movie.url,
            onload: function (response) {
              let parser = new DOMParser();
              let htmlDoc = parser.parseFromString(
                response.responseText,
                "text/html"
              );
              let actorP = $(htmlDoc).find(
                "body > div.container > div.row.movie > div.col-md-3.info > .star-show"
              );
              // genres is <p> before actorP
              let genres = actorP.prev().find("span.genre");
              // actor is next <p> after actorP
              let actors = actorP.next().next().find("span.genre");
              let tagArray = [];
              let actorArray = [];

              let releaseDate = $(htmlDoc).find(
                "body > div.container > div.row.movie > div.col-md-3.info > p:nth-child(2)"
              );
              releaseDate = $(releaseDate).text().split(" ")[1];
              let director = $(htmlDoc)
                .find(
                  "body > div.container > div.row.movie > div.col-md-3.info > p:nth-child(4)"
                )
                .text();

              if (director.includes("導演:")) {
                director = director.replace("導演:", "").trim();
              } else {
                director = "";
              }

              genres.each(function (index, element) {
                tagArray.push($(element).text());
              });
              actors.each(function (index, element) {
                let actorText = $(element)
                  .text()
                  .replace(/[\t\n]/g, "")
                  .trim();
                actorArray.push(actorText);
              });

              let poster = $(htmlDoc)
                .find(
                  "body > div.container > div.row.movie > div.col-md-9.screencap > a > img"
                )
                .attr("src");
              // add domain to poster
              poster = window.location.origin + poster;
              let title = $(htmlDoc)
                .find(
                  "body > div.container > div.row.movie > div.col-md-9.screencap > a > img"
                )
                .attr("title");

              // 更新 movie 对象的详细信息
              movie.genres = tagArray;
              movie.director = director;
              movie.actors = actorArray;
              movie.title_jp = title;
              movie.release_date = releaseDate;
              movie.poster = poster;

              movies.push(movie);
              resolve();
            },
          });
        } else if (result.DownloadMovies && result.DownloadMovies.length > 0) {
          if (result.DownloadMovies[0].subtitle) {
            $(movie.element).css("background-color", "pink");
          } else {
            $(movie.element).css("background-color", "lightgreen");
          }
          resolve();
        } else {
          resolve();
        }
      },
      error: (error) => {
        console.error(`Error checking movie ${movie.code}:`, error);
        resolve(); // Proceed even if there is an error
      },
    });
  });
};

function applyTags(videoElement, genres) {
    // Logic to apply tags to the video element
    const tags = genres.join(', ');
    videoElement.setAttribute("data-toggle", "tooltip");
    videoElement.setAttribute("title", tags);
    if (hasCommonElement(genres, good)) {
        videoElement.style.color = "#e3a807"; // Example styling, adjust as necessary
    }
}

$(document).ready(function () {
  let videosComponents = $(".item");
  let codes = {};
  $(videosComponents).each(function (index, element) {
    let code = $($(element).find("date")[0]).text();
    codes[code] = {
      url: $(element).find("a")[0].href,
      element,
    };
  });

  let requests = Object.keys(codes).map((code) => {
    return new Promise((resolve) => {
      const movie = {
        code,
        url: codes[code].url,
        element: codes[code].element,
      };
      checkAndAddMovie(movie).then(() => resolve());
      applyTags($(video).find("a")[0], result.MovieGenres.map(genre => genre.Genres.name))
    });
  });

  Promise.all(requests).then(() => {
    if (movies.length > 0) {
      postNewMovies(movies);
    } else {
      console.log("No new movies to post.");
    }
  });
});
