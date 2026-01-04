// ==UserScript==
// @name           Youtube exact upload
// @name:de        YouTube exakter Hochladezeitpunkt
// @description    Adds exact upload time to youtube videos
// @description:de Fügt YouTube-Videos den exakten Hochladezeitpunkt mit Uhrzeit hinzu
// @require        https://cdnjs.cloudflare.com/ajax/libs/luxon/3.5.0/luxon.min.js
// @version        0.19
// @match          https://www.youtube.com/*
// @grant          none
// @namespace      https://greasyfork.org/users/94906
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/424068/Youtube%20exact%20upload.user.js
// @updateURL https://update.greasyfork.org/scripts/424068/Youtube%20exact%20upload.meta.js
// ==/UserScript==

// luxon is for formatting and comparing dates and times

(function () {
  "use strict";
  console.log("YT EXACT UPLOAD LOADED");
  //Pre-Define Variables to prevent warning of redaclaration of variables
  const YT_API_KEY = "YouTube API-Key";
  let DATE_PATTERN,
    TIME_PATTERN,
    DATETIME_COMBINE_PATTERN,
    SCHEDULED_LIVESTREAM_START,
    SCHEDULED_PREMIERE_START,
    ONGOING_LIVESTREAM_START;
  let ONGOING_PREMIERE_START,
    ENDED_LIVESTREAM_START,
    ENDED_PREMIERE_START,
    DATETIME_UNTIL_PATTERN,
    SINCE,
    TODAY_AT;
  const AGE_RESTRICTED = " - FSK 18";
  const SHOW_REFRESH = true;
  const REFRESH_TIMESTAMP = "&#10227;";
  const SHOW_UNDERLINE_ON_TIMESTAMP = false;
  const BASE_URL =
    "https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails,contentDetails,localizations,player,statistics,status&key=" +
    YT_API_KEY;
  luxon.Settings.defaultLocale = document.documentElement.lang;
  if (document.documentElement.lang.startsWith("de")) {
    DATE_PATTERN = "dd.MM.yyyy"; // https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    TIME_PATTERN = "HH:mm:ss 'Uhr'"; // https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    DATETIME_COMBINE_PATTERN = " 'um' "; // https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    SCHEDULED_LIVESTREAM_START = "Livestream geplant für: ";
    SCHEDULED_PREMIERE_START = "Premiere geplant für: ";
    ONGOING_LIVESTREAM_START = "Aktiver Livestream seit ";
    ONGOING_PREMIERE_START = "Aktive Premiere seit ";
    ENDED_LIVESTREAM_START = "Livestream von ";
    ENDED_PREMIERE_START = "Premiere von ";
    DATETIME_UNTIL_PATTERN = " bis ";
    SINCE = "Seit";
    TODAY_AT = "Heute um ";
  } else if (document.documentElement.lang.startsWith("fr")) {
    DATE_PATTERN = "dd MMMM yyyy"; // https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    TIME_PATTERN = "HH:mm:ss"; // https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    DATETIME_COMBINE_PATTERN = " 'de' "; // https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    SCHEDULED_LIVESTREAM_START = "Direct planifié pour le ";
    SCHEDULED_PREMIERE_START = "Première planifiée pour le ";
    ONGOING_LIVESTREAM_START = "Direct en cours depuis ";
    ONGOING_PREMIERE_START = "Première en cours depuis ";
    ENDED_LIVESTREAM_START = "Direct diffusé le ";
    ENDED_PREMIERE_START = "Première diffusée le ";
    DATETIME_UNTIL_PATTERN = " à ";
    SINCE = "Depuis";
    TODAY_AT = "Aujourd'hui à ";
  } else if (document.documentElement.lang.startsWith("it")) {
    DATE_PATTERN = "dd MMMM yyyy"; // https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    TIME_PATTERN = "HH:mm:ss"; // https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    DATETIME_COMBINE_PATTERN = " 'alle' "; // https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    SCHEDULED_LIVESTREAM_START = "Diretta pianificata per il: ";
    SCHEDULED_PREMIERE_START = "Premiere pianificata per il: ";
    ONGOING_LIVESTREAM_START = "Diretta attiva dalle ";
    ONGOING_PREMIERE_START = "Premiere attiva dalle ";
    ENDED_LIVESTREAM_START = "Diretta del ";
    ENDED_PREMIERE_START = " Premiere del ";
    DATETIME_UNTIL_PATTERN = " fino ";
    SINCE = "Dalle";
    TODAY_AT = "Oggi alle ";
  } else {
    DATE_PATTERN = "dd.MM.yyyy"; // https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    TIME_PATTERN = "HH:mm:ss"; // https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    DATETIME_COMBINE_PATTERN = " 'at' "; // https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    SCHEDULED_LIVESTREAM_START = "Livestream scheduled for: ";
    SCHEDULED_PREMIERE_START = "Premiere scheduled for: ";
    ONGOING_LIVESTREAM_START = "Active Livestream since ";
    ONGOING_PREMIERE_START = "Active Premiere since ";
    ENDED_LIVESTREAM_START = "Livestream from ";
    ENDED_PREMIERE_START = "Premiere from ";
    DATETIME_UNTIL_PATTERN = " until ";
    SINCE = "Since";
    TODAY_AT = "Today at ";
  }
  let interval = null;
  let changeCheckTimer = null;
  let currentVideoId = null;
  function getVideoId() {
    return new URLSearchParams(globalThis.location.search).get("v");
  }
  function genUrl() {
    const videoId = getVideoId();
    if (videoId != null) {
      return BASE_URL + "&id=" + videoId;
    } else {
      return "";
    }
  }
  function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
  function formatMilliseconds(milliseconds) {
    const dur = luxon.Duration.fromMillis(milliseconds).shiftTo(
      "hours",
      "minutes",
      "seconds",
    );
    return [dur.hours, dur.minutes, dur.seconds].map((unit) =>
      String(unit).padStart(2, "0")
    ).join(":");
  }
  function updateOngoing(startTime) {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    interval = setInterval(function () {
      const durationInMilliseconds = luxon.Interval.fromDateTimes(
        startTime,
        luxon.DateTime.now(),
      ).length("milliseconds");
      const ongoingVideoDuration = document.getElementById(
        "ongoing-video-duration",
      );
      ongoingVideoDuration.innerHTML = formatMilliseconds(
        durationInMilliseconds,
      );
      if (ongoingVideoDuration.parentNode) {
        ongoingVideoDuration.parentNode.title =
          ongoingVideoDuration.parentNode.innerText;
      }
    }, 500);
  }
  async function updateLiveContent(premiere, livestream, data, dt) {
    let element = null;
    while (!element) {
      element = document.getElementById("primary-inner");
      await sleep(200);
    }
    let durationInMilliseconds = null;
    let ongoing = false;
    let innerHTML = "";
    if (!premiere && !livestream) {
      // normal video
      if (dt.hasSame(luxon.DateTime.now(), "day")) {
        // today
        innerHTML += `${TODAY_AT}${dt.toFormat(TIME_PATTERN)}`;
      } else {
        innerHTML += dt.toFormat(
          `${DATE_PATTERN}${DATETIME_COMBINE_PATTERN}${TIME_PATTERN}`,
        );
      }
    } else {
      if (!data.items[0].liveStreamingDetails.actualStartTime) {
        // planned
        dt = luxon.DateTime.fromISO(
          data.items[0].liveStreamingDetails.scheduledStartTime,
        );
        if (dt.hasSame(luxon.DateTime.now(), "day")) {
          // today
          if (livestream) {
            innerHTML += `${SCHEDULED_LIVESTREAM_START}${
              dt.toFormat(TIME_PATTERN)
            }`;
          } else if (premiere) {
            innerHTML += `${SCHEDULED_PREMIERE_START}${
              dt.toFormat(TIME_PATTERN)
            }`;
          } else {
            innerHTML += `${TODAY_AT}${dt.toFormat(TIME_PATTERN)}`;
          }
        } else {
          if (livestream) {
            innerHTML += `${SCHEDULED_LIVESTREAM_START}${
              dt.toFormat(
                DATE_PATTERH + DATETIME_COMBINE_PATTERN + TIME_PATTERN,
              )
            }`;
          } else if (premiere) {
            innerHTML += `${SCHEDULED_PREMIERE_START}${
              dt.toFormat(
                DATE_PATTERN + DATETIME_COMBINE_PATTERN + TIME_PATTERN,
              )
            }`;
          } else {
            innerHTML += `${TODAY_AT}${
              dt.toFormat(
                DATE_PATTERN + DATETIME_COMBINE_PATTERN + TIME_PATTERN,
              )
            }`;
          }
        }
      } else {
        // ongoing / ended
        const liveStreamingDetails = data.items[0].liveStreamingDetails;
        dt = luxon.DateTime.fromISO(liveStreamingDetails.actualStartTime);
        let endTime = null;
        if (liveStreamingDetails.actualEndTime) {
          endTime = luxon.DateTime.fromISO(liveStreamingDetails.actualEndTime);
        }
        if (endTime == null) {
          // ongoing
          ongoing = true;
          durationInMilliseconds = luxon.Interval.fromDateTimes(
            dt,
            luxon.DateTime.now(),
          ).length("milliseconds");
          if (dt.hasSame(luxon.DateTime.now(), "day")) {
            // today
            if (livestream) {
              innerHTML += `${ONGOING_LIVESTREAM_START}${
                dt.toFormat(TIME_PATTERN)
              } (<span id="ongoing-video-duration">${
                formatMilliseconds(durationInMilliseconds)
              }</span>)`;
            } else if (premiere) {
              innerHTML += `${ONGOING_PREMIERE_START}${
                dt.toFormat(TIME_PATTERN)
              } (<span id="ongoing-video-duration">${
                formatMilliseconds(durationInMilliseconds)
              }</span>)`;
            } else {
              innerHTML += `${SINCE} ${
                dt.toFormat(TIME_PATTERN)
              } (<span id="ongoing-video-duration">${
                formatMilliseconds(durationInMilliseconds)
              }</span>)`;
            }
          } else {
            if (livestream) {
              innerHTML += `${ONGOING_LIVESTREAM_START}${
                dt.toFormat(
                  DATE_PATTERN + DATETIME_COMBINE_PATTERN + TIME_PATTERN,
                )
              } (<span id="ongoing-video-duration">${
                formatMilliseconds(durationInMilliseconds)
              }</span>)`;
            } else if (premiere) {
              innerHTML += `${ONGOING_PREMIERE_START}${
                dt.toFormat(
                  DATE_PATTERN + DATETIME_COMBINE_PATTERN + TIME_PATTERN,
                )
              } (<span id="ongoing-video-duration">${
                formatMilliseconds(durationInMilliseconds)
              }</span>)`;
            } else {
              innerHTML += `${SINCE} ${
                dt.toFormat(
                  DATE_PATTERN + DATETIME_COMBINE_PATTERN + TIME_PATTERN,
                )
              } (<span id="ongoing-video-duration">${
                formatMilliseconds(durationInMilliseconds)
              }</span>)`;
            }
          }
        } else {
          // ended
          if (dt.hasSame(endTime, "day")) {
            // start date and end date are the same
            if (dt.hasSame(luxon.DateTime.now(), "day")) {
              // today
              if (livestream) {
                innerHTML += `${ENDED_LIVESTREAM_START}${
                  dt.toFormat(TIME_PATTERN)
                }${DATETIME_UNTIL_PATTERN}${endTime.toFormat(TIME_PATTERN)}`;
              } else if (premiere) {
                innerHTML += `${ENDED_PREMIERE_START}${
                  dt.toFormat(TIME_PATTERN)
                }${DATETIME_UNTIL_PATTERN}${endTime.toFormat(TIME_PATTERN)}`;
              } else {
                innerHTML += `${TODAY_AT}${dt.toFormat(TIME_PATTERN)}`;
              }
            } else {
              if (livestream) {
                innerHTML += `${ENDED_LIVESTREAM_START}${
                  dt.toFormat(
                    DATE_PATTERN + DATETIME_COMBINE_PATTERN + TIME_PATTERN,
                  )
                }${DATETIME_UNTIL_PATTERN}${endTime.toFormat(TIME_PATTERN)}`;
              } else if (premiere) {
                innerHTML += `${ENDED_PREMIERE_START}${
                  dt.toFormat(
                    DATE_PATTERN + DATETIME_COMBINE_PATTERN + TIME_PATTERN,
                  )
                }${DATETIME_UNTIL_PATTERN}${endTime.toFormat(TIME_PATTERN)}`;
              } else {
                innerHTML += `${
                  dt.toFormat(
                    DATE_PATTERN + DATETIME_COMBINE_PATTERN + TIME_PATTERN,
                  )
                }${DATETIME_UNTIL_PATTERN}${endTime.toFormat(TIME_PATTERN)}`;
              }
            }
          } else {
            if (dt.hasSame(luxon.DateTime.now(), "day")) {
              // today
              if (livestream) {
                innerHTML += `${ENDED_LIVESTREAM_START}${
                  dt.toFormat(TIME_PATTERN)
                }${DATETIME_UNTIL_PATTERN}${
                  endTime.toFormat(
                    DATE_PATTERN + DATETIME_COMBINE_PATTERN + TIME_PATTERN,
                  )
                }`;
              } else if (premiere) {
                innerHTML += `${ENDED_PREMIERE_START}${
                  dt.toFormat(TIME_PATTERN)
                }${DATETIME_UNTIL_PATTERN}${
                  endTime.toFormat(
                    DATE_PATTERN + DATETIME_COMBINE_PATTERN + TIME_PATTERN,
                  )
                }`;
              } else {
                innerHTML += `${TODAY_AT}${
                  dt.toFormat(TIME_PATTERN)
                }${DATETIME_UNTIL_PATTERN}${
                  endTime.toFormat(
                    DATE_PATTERN + DATETIME_COMBINE_PATTERN + TIME_PATTERN,
                  )
                }`;
              }
            } else {
              if (livestream) {
                innerHTML += `${ENDED_LIVESTREAM_START}${
                  dt.toFormat(
                    DATE_PATTERN + DATETIME_COMBINE_PATTERN + TIME_PATTERN,
                  )
                }${DATETIME_UNTIL_PATTERN}${
                  endTime.toFormat(
                    DATE_PATTERN + DATETIME_COMBINE_PATTERN + TIME_PATTERN,
                  )
                }`;
              } else if (premiere) {
                innerHTML += `${ENDED_PREMIERE_START}${
                  dt.toFormat(
                    DATE_PATTERN + DATETIME_COMBINE_PATTERN + TIME_PATTERN,
                  )
                }${DATETIME_UNTIL_PATTERN}${
                  endTime.toFormat(
                    DATE_PATTERN + DATETIME_COMBINE_PATTERN + TIME_PATTERN,
                  )
                }`;
              } else {
                innerHTML += `${
                  dt.toFormat(
                    DATE_PATTERN + DATETIME_COMBINE_PATTERN + TIME_PATTERN,
                  )
                }${DATETIME_UNTIL_PATTERN}${
                  endTime.toFormat(
                    DATE_PATTERN + DATETIME_COMBINE_PATTERN + TIME_PATTERN,
                  )
                }`;
              }
            }
          }
        }
      }
    }
    const contentRating = data.items[0].contentDetails.contentRating;
    if (contentRating.ytRating && contentRating.ytRating == "ytAgeRestricted") {
      innerHTML += AGE_RESTRICTED;
    }
    if (SHOW_REFRESH) {
      if (SHOW_UNDERLINE_ON_TIMESTAMP) {
        innerHTML +=
          ' <span id="dot" class="style-scope ytd-video-primary-info-renderer"></span> <span style="color: var(--yt-spec-text-secondary); text-decoration: underline var(--yt-spec-text-secondary); cursor: pointer;" onclick="document.dispatchEvent(new Event(\'refresh-clicked\'));">' +
          REFRESH_TIMESTAMP +
          "</span>";
      } else {
        innerHTML +=
          ' <span id="dot" class="style-scope ytd-video-primary-info-renderer"></span> <span style="color: var(--yt-spec-text-secondary); cursor: pointer;" onclick="document.dispatchEvent(new Event(\'refresh-clicked\'));">' +
          REFRESH_TIMESTAMP +
          "</span>";
      }
    }
    if (ongoing) updateOngoing(dt);
    const primaryInner = document.getElementById("primary-inner");
    let dateTimeValueElem = document.getElementById("exact-date-time");
    if (!dateTimeValueElem) {
      dateTimeValueElem = document.createElement("span");
      dateTimeValueElem.id = "exact-date-time";
      primaryInner.insertBefore(dateTimeValueElem, primaryInner.firstChild);
    }
    dateTimeValueElem.style.color = "white";
    dateTimeValueElem.style.position = "absolute";
    dateTimeValueElem.style.zIndex = "999";
    dateTimeValueElem.innerHTML = innerHTML;
    dateTimeValueElem.title = dateTimeValueElem.innerText;
    return ongoing;
  }
  function getExactUploadDate(forceRefresh = false) {
    let abort = false;
    const processEvent = async () => {
      await sleep(500);
      const videoId = getVideoId();
      if (videoId != null) {
        if (videoId == currentVideoId) {
          abort = true;
        } else {
          currentVideoId = videoId;
        }
      }
      if (forceRefresh) abort = false;
      if ((YT_API_KEY != "" || typeof YT_API_KEY != "undefined") && !abort) {
        const url = genUrl();
        if (url != "") {
          try {
            const data = await fetch(url).then((response) => response.json());
            if (data.pageInfo.totalResults > 0) {
              const addTime = async () => {
                const dt = luxon.DateTime.fromISO(
                  data.items[0].snippet.publishedAt,
                );
                console.log(dt);
                const payload = {
                  context: {
                    client: {
                      clientName: "WEB",
                      clientVersion: "2.20210614.06.00",
                      originalUrl: globalThis.location.href,
                      platform: "DESKTOP",
                      clientFormFactor: "UNKNOWN_FORM_FACTOR",
                      mainAppWebInfo: {
                        graftUrl: "/watch?v=" + currentVideoId,
                        webDisplayMode: "WEB_DISPLAY_MODE_BROWSER",
                        isWebNativeShareAvailable: false,
                      },
                    },
                    user: {
                      lockedSafetyMode: false,
                    },
                    request: {
                      useSsl: true,
                    },
                  },
                  videoId: currentVideoId,
                  racyCheckOk: false,
                  contentCheckOk: false,
                };
                const video_info = await fetch(
                  "https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8", /*InnerTube-API-Key*/
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                  },
                ).then((response) => response.json());
                try {
                  if (interval) {
                    clearInterval(interval);
                    interval = null;
                  }
                  if (changeCheckTimer) {
                    clearInterval(changeCheckTimer);
                    changeCheckTimer = null;
                  }
                  try {
                    const premiere = !!(video_info &&
                      !video_info.videoDetails.isLiveContent) &&
                      !!data.items[0].liveStreamingDetails;
                    const livestream = !!(video_info &&
                      video_info.videoDetails.isLiveContent);
                    updateLiveContent(premiere, livestream, data, dt);
                  } catch (ex) {
                    console.error(ex);
                  }
                } catch (error) {
                  console.error(
                    "YOUTUBE EXACT UPLOAD ERROR: " + error,
                    "\nget_video_info doesn't seem to work",
                  );
                }
              };
              addTime();
            }
          } catch (error) {
            console.error(
              "YOUTUBE EXACT UPLOAD ERROR: " + error,
              "\nINVALID API KEY?",
            );
          }
        }
      } else {
        if (!abort) {
          console.error("YOUTUBE EXACT UPLOAD ERROR: Undefined api key");
        }
      }
    };
    processEvent();
  }
  function refreshEventListener() {
    getExactUploadDate(true);
  }
  document.addEventListener("refresh-clicked", refreshEventListener);
  function main() {
    const ytdPlayer = document.getElementById("ytd-player");
    if (!ytdPlayer) {
      setTimeout(() => main(), 500);
    } else {
      ytdPlayer.addEventListener(
        "yt-player-updated",
        () => getExactUploadDate(),
      );
    }
  }
  main();
  if (getVideoId() != null) {
    getExactUploadDate();
  }
})();
