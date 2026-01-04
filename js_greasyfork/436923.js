// ==UserScript==
// @name         YouTube Restore Dislike Counters
// @version      1.1.0
// @description  A userscript to restore the dislike counts on YouTube. Not 100% accurate all the time, but stil pretty accurate.
// @author       Kyle Boyd
// @match        *://www.youtube.com/*
// @run_at       document_start
// @namespace https://greasyfork.org/users/826218
// @downloadURL https://update.greasyfork.org/scripts/436923/YouTube%20Restore%20Dislike%20Counters.user.js
// @updateURL https://update.greasyfork.org/scripts/436923/YouTube%20Restore%20Dislike%20Counters.meta.js
// ==/UserScript==

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function waitForElm(s) {
    while (!document.querySelector(s)) {
        await new Promise(r => requestAnimationFrame(r))
    }
    return;
}

async function init() {

    try {

    var data = document.querySelector("ytd-app").data;

        for (p = 0; p < data.response.contents.twoColumnWatchNextResults.results.results.contents.length; p++) {

            if (typeof data.response.contents.twoColumnWatchNextResults.results.results.contents[p].videoPrimaryInfoRenderer != 'undefined') {

                var vidroot = data.response.contents.twoColumnWatchNextResults.results.results.contents[p];

            }

        }

        if (vidroot.videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons[0].toggleButtonRenderer.isToggled) {

    var l = parseInt(vidroot.videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons[0].toggleButtonRenderer.toggledText.accessibility.accessibilityData.label.replace(/( likes|,)/g, ""));

        } else {


             var l = parseInt(vidroot.videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons[0].toggleButtonRenderer.defaultText.accessibility.accessibilityData.label.replace(/( likes|,)/g, ""));

        }
    var r = data.playerResponse.videoDetails.averageRating;

    function calculateDislikes(l, r) {
var d = Math.round(l*((5-r)/(r-1)));
        return d;
    }

    if (r != 0) {

    var dislikes = await calculateDislikes(l, r);

    } else {

        var dislikes = 0;

    }

    var dislikesfin = numberWithCommas(dislikes)
    var likesfin = numberWithCommas(l);
    // added bonus

        if (r != 0) {

    document.querySelector("yt-formatted-string#text.ytd-toggle-button-renderer").innerHTML = likesfin;

        } else {

            document.querySelector("yt-formatted-string#text.ytd-toggle-button-renderer").innerHTML = "0";

        }

    document.querySelectorAll("yt-formatted-string#text.ytd-toggle-button-renderer")[1].innerHTML = dislikesfin;

    var added = l + dislikes;

    var sentimentPercent = parseInt((((l / added) * 100 * 100) / 100)).toString();

    document.querySelector("ytd-sentiment-bar-renderer").removeAttribute("hidden");

    document.getElementById("like-bar").setAttribute("style", "width: " + sentimentPercent + "%;");

    } catch(e) {};

}

waitForElm("yt-formatted-string#text.ytd-toggle-button-renderer").then(() => init());

window.addEventListener('yt-page-data-updated', init, false);
const LIKED_STATE = "LIKED_STATE";
const DISLIKED_STATE = "DISLIKED_STATE";
const NEUTRAL_STATE = "NEUTRAL_STATE";
let previousState = 3; //1=LIKED, 2=DISLIKED, 3=NEUTRAL
let likesvalue = 0;
let dislikesvalue = 0;

let isMobile = location.hostname == "m.youtube.com";
let mobileDislikes = 0;
function cLog(text, subtext = "") {
  subtext = subtext.trim() === "" ? "" : `(${subtext})`;
  console.log(`[Return YouTube Dislikes] ${text} ${subtext}`);
}

function getButtons() {
  if (isMobile) {
    return document.querySelector(".slim-video-action-bar-actions");
  }
  if (document.getElementById("menu-container")?.offsetParent === null) {
    return document.querySelector("ytd-menu-renderer.ytd-watch-metadata > div");
  } else {
    return document
      .getElementById("menu-container")
      ?.querySelector("#top-level-buttons-computed");
  }
}

function getLikeButton() {
  return getButtons().children[0];
}

function getDislikeButton() {
  return getButtons().children[1];
}

function isVideoLiked() {
  if (isMobile) {
    return (
      getLikeButton().querySelector("button").getAttribute("aria-label") ==
      "true"
    );
  }
  return getLikeButton().classList.contains("style-default-active");
}

function isVideoDisliked() {
  if (isMobile) {
    return (
      getDislikeButton().querySelector("button").getAttribute("aria-label") ==
      "true"
    );
  }
  return getDislikeButton().classList.contains("style-default-active");
}

function isVideoNotLiked() {
  if (isMobile) {
    return !isVideoLiked();
  }
  return getLikeButton().classList.contains("style-text");
}

function isVideoNotDisliked() {
  if (isMobile) {
    return !isVideoDisliked();
  }
  return getDislikeButton().classList.contains("style-text");
}

function checkForUserAvatarButton() {
  if (isMobile) {
    return;
  }
  if (document.querySelector('#avatar-btn')) {
    return true
  } else {
    return false
  }
}

function getState() {
  if (isVideoLiked()) {
    return LIKED_STATE;
  }
  if (isVideoDisliked()) {
    return DISLIKED_STATE;
  }
  return NEUTRAL_STATE;
}

function setLikes(likesCount) {
  if (isMobile) {
    getButtons().children[0].querySelector(".button-renderer-text").innerText =
      likesCount;
    return;
  }
  getButtons().children[0].querySelector("#text").innerText = likesCount;
}

function setDislikes(dislikesCount) {
  if (isMobile) {
    mobileDislikes = dislikesCount;
    return;
  }
  getButtons().children[1].querySelector("#text").innerText = dislikesCount;
}

(typeof GM_addStyle != "undefined"
  ? GM_addStyle
  : (styles) => {
      let styleNode = document.createElement("style");
      styleNode.type = "text/css";
      styleNode.innerText = styles;
      document.head.appendChild(styleNode);
    })(`



  `);

function createRateBar(likes, dislikes) {
  if (isMobile) {
    return;
  }
  let rateBar = document.getElementById("return-youtube-dislike-bar-container");

  const widthPx =
    getButtons().children[0].clientWidth +
    getButtons().children[1].clientWidth +
    8;

  const widthPercent =
    likes + dislikes > 0 ? (likes / (likes + dislikes)) * 100 : 50;

  if (!rateBar) {
    document.getElementById("menu-container").insertAdjacentHTML(
      "beforeend",
      `
        <div class="ryd-tooltip" style="width: ${widthPx}px">
        <div class="ryd-tooltip-bar-container">
           <div
              id="return-youtube-dislike-bar-container"
              style="width: 100%; height: 2px;"
              >
              <div
                 id="return-youtube-dislike-bar"
                 style="width: ${widthPercent}%; height: 100%"
                 ></div>
           </div>
        </div>
        <tp-yt-paper-tooltip position="top" id="ryd-dislike-tooltip" class="style-scope ytd-sentiment-bar-renderer" role="tooltip" tabindex="-1">
           <!--css-build:shady-->${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}
        </tp-yt-paper-tooltip>
        </div>
`
    );
  } else {
    document.getElementById(
      "return-youtube-dislike-bar-container"
    ).style.width = widthPx + "px";
    document.getElementById("return-youtube-dislike-bar").style.width =
      widthPercent + "%";

    document.querySelector(
      "#ryd-dislike-tooltip > #tooltip"
    ).innerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}`;
  }
}

function setState() {
  cLog("Fetching votes...");
  let statsSet = false;

  fetch(
    `https://returnyoutubedislikeapi.com/votes?videoId=${getVideoId()}`
  ).then((response) => {
    response.json().then((json) => {
      if (json && !("traceId" in response) && !statsSet) {
        const { dislikes, likes } = json;
        cLog(`Received count: ${dislikes}`);
        likesvalue = likes;
        dislikesvalue = dislikes;
        setDislikes(numberFormat(dislikes));
        createRateBar(likes, dislikes);
      }
    });
  });
}

function likeClicked() {
  if (checkForUserAvatarButton() == true) {
    if (previousState == 1) {
      likesvalue--;
      createRateBar(likesvalue, dislikesvalue);
      setDislikes(numberFormat(dislikesvalue));
      previousState = 3
    } else if (previousState == 2) {
      likesvalue++;
      dislikesvalue--;
      setDislikes(numberFormat(dislikesvalue))
      createRateBar(likesvalue, dislikesvalue);
      previousState = 1
    } else if (previousState == 3) {
      likesvalue++;
      createRateBar(likesvalue, dislikesvalue)
      previousState = 1
    }
  }
}

function dislikeClicked() {
  if (checkForUserAvatarButton() == true) {
    if (previousState == 3) {
      dislikesvalue++;
      setDislikes(numberFormat(dislikesvalue));
      createRateBar(likesvalue, dislikesvalue);
      previousState = 2
    } else if (previousState == 2) {
      dislikesvalue--;
      setDislikes(numberFormat(dislikesvalue));
      createRateBar(likesvalue, dislikesvalue);
      previousState = 3
    } else if (previousState == 1) {
      likesvalue--;
      dislikesvalue++;
      setDislikes(numberFormat(dislikesvalue));
      createRateBar(likesvalue, dislikesvalue);
      previousState = 2
    }
  }
}

function setInitialState() {
  setState();
}

function getVideoId() {
  const urlObject = new URL(window.location.href);
  const pathname = urlObject.pathname;
  if (pathname.startsWith("/clip")) {
    return document.querySelector("meta[itemprop='videoId']").content;
  } else {
    return urlObject.searchParams.get("v");
  }
}

function isVideoLoaded() {
  if (isMobile) {
    return document.getElementById("player").getAttribute("loading") == "false";
  }
  const videoId = getVideoId();

  return (
    document.querySelector(`ytd-watch-flexy[video-id='${videoId}']`) !== null
  );
}

function roundDown(num) {
  if (num < 1000) return num;
  const int = Math.floor(Math.log10(num) - 2);
  const decimal = int + (int % 3 ? 1 : 0);
  const value = Math.floor(num / 10 ** decimal);
  return value * 10 ** decimal;
}

function numberFormat(numberState) {
  let localeURL = Array.from(document.querySelectorAll("head > link[rel='search']"))
    ?.find((n) => n?.getAttribute("href")?.includes("?locale="))
    ?.getAttribute("href");

  const userLocales = localeURL ? new URL(localeURL)?.searchParams?.get("locale") : document.body.lang;

  const formatter = Intl.NumberFormat(
    document.documentElement.lang || userLocales || navigator.language,
    {
      notation: "compact",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }
  );

  return formatter.format(roundDown(numberState)).replace(/\.0|,0/, "");
}

function setEventListeners(evt) {
  let jsInitChecktimer;

  function checkForJS_Finish(check) {
    console.log();
    if (getButtons()?.offsetParent && isVideoLoaded()) {
      clearInterval(jsInitChecktimer);
      const buttons = getButtons();

      if (!window.returnDislikeButtonlistenersSet) {
        cLog("Registering button listeners...");
        buttons.children[0].addEventListener("click", likeClicked);
        buttons.children[1].addEventListener("click", dislikeClicked);
        window.returnDislikeButtonlistenersSet = true;
      }
      setInitialState();
    }
  }

  if (
    window.location.href.indexOf("watch?") >= 0 ||
    (isMobile && evt?.indexOf("watch?") >= 0)
  ) {
    cLog("Setting up...");
    jsInitChecktimer = setInterval(checkForJS_Finish, 111);
  }
}

(function () {
  "use strict";
  window.addEventListener("yt-navigate-finish", setEventListeners, true);
  setEventListeners();
})();
if (isMobile) {
  let originalPush = history.pushState;
  history.pushState = function (...args) {
    window.returnDislikeButtonlistenersSet = false;
    setEventListeners(args[2]);
    return originalPush.apply(history, args);
  };


  setInterval(() => {
    getDislikeButton().querySelector(".button-renderer-text").innerText =
      mobileDislikes;
  }, 1000);
}
