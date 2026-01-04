// ==UserScript==
// @name            Youtube Compilation Music Controls
// @description     Adds support for nexttrack, previoustrack from mediaSession API, as well as shuffle support, for youtube compilation videos with this.currentTrackLists in the description
// @author          Mattwmaster58 <mattwmaster58@gmail.com>
// @namespace       Mattwmaster58 Scripts
// @match           https://www.youtube.com/*
// @run-at          document-start
// @grant           GM_registerMenuCommand
// @version         0.1
// @downloadURL https://update.greasyfork.org/scripts/440279/Youtube%20Compilation%20Music%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/440279/Youtube%20Compilation%20Music%20Controls.meta.js
// ==/UserScript==


class YCMC {
  // if we're within this threshold of the track start and a seekPrevious is issued,
  // we go back to the previous track instead of the start of the current track
  static TRACK_START_THRESHOLD = 4;
  static PLAYER_SETUP_QUERY_INTERVAL_MS = 200;
  // anything this or less many tracks will not be considered a compilation
  static NOT_A_COMPILATION_THRESHOLD = 3;
  // if we find this amount of tracks or less, we should continue our search (eg, in the comments)
  static KEEP_SEARCHING_THRESHOLD = 6;
  static COMMENT_SEARCH_LIMIT = 10;

  recentlySeeked;
  shuffleOn;
  VIDEO_ID;
  defaultTrackList;
  currentTrackList;
  videoElement;
  descriptionElement;
  ogNextHandler;
  ogPreviousHandler;

  resetInst() {
    this.recentlySeeked = this.shuffleOn = false;
    this.VIDEO_ID = (location.href.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&]{10,12})/
    ) || [null, null])[1];
    this.defaultTrackList =
      this.currentTrackList =
        this.videoElement =
          this.currentTrack =
            this.nextTrack =
              this.ogNextHandler =
                this.ogPreviousHandler =
                  null;
  }

  parseTextForTimings(desc_text) {
    let tracks = [];
    const timings = desc_text.matchAll(
      /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\D[\s\-:]*(.*)\s*/gim
    );
    [...timings].forEach((match, defaultIndex) => {
      let hh, mm, ss, start;
      [hh, mm, ss] = padArrayStart(
        match.slice(1, 4).filter(Boolean),
        3,
        0
      ).map((x) => parseInt(x, 10));
      start = (hh || 0) * 60 * 60 + (mm || 0) * 60 + ss;
      tracks.push({
        currentIndex: defaultIndex,
        defaultIndex,
        start,
        title: match[4],
      });
    });
    return tracks;
  }

  parseFromAnywhere() {
    let attempts = [];
    this.descriptionElement = document.querySelector(
      "#description yt-formatted-string"
    );
    const vidDesc = this.descriptionElement.textContent;
    _log(`attempted parse of YT description`);
    attempts.push(this.parseTextForTimings(vidDesc));
    // todo: make this trigger a comment loading via scroll events?
    // comments unloaded by default
    if (false && attempts[0].length <= YCMC.KEEP_SEARCHING_THRESHOLD) {
      // don't ask me why there's duplicate IDs
      for (const [idx, commentElem] of document
        .querySelectorAll("#contents #content #content-text")
        .entries()) {
        if (idx >= YCMC.COMMENT_SEARCH_LIMIT) {
          break;
        }
        _log(`attempted parse of comment ${idx}`);
        attempts.push(this.parseTextForTimings(commentElem.textContent));
        if (attempts[idx + 1].length > YCMC.KEEP_SEARCHING_THRESHOLD) {
          return attempts[idx + 1];
        }
      }
    }
    const max = attempts.reduce((prev, current) => {
      return prev.length > current.length ? prev : current;
    });
    if (max.length <= YCMC.NOT_A_COMPILATION_THRESHOLD) {
      _warn(
        `longest sequence of timestamps found was only ${max.length}, which is < ${YCMC.NOT_A_COMPILATION_THRESHOLD}`
      );
      return [];
    } else {
      return max;
    }
  }

  getNowPlaying() {
    const cur_time = this.videoElement.currentTime;
    for (const track of this.defaultTrackList || []) {
      if (track.start > cur_time) {
        return this.defaultTrackList[
          clamp(track.defaultIndex - 1, 0, this.defaultTrackList.length - 1)
          ];
      }
    }
  }

  toggleShuffle() {
    this.shuffleOn = !this.shuffleOn;
    if (this.shuffleOn) {
      _log(`shuffling ${this.currentTrackList.length} tracks`);
      // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
      let track_len = this.currentTrackList.length;
      while (track_len) {
        let idx = Math.floor(Math.random() * track_len--);
        let temp = this.currentTrackList[track_len];
        this.currentTrackList[track_len] = this.currentTrackList[idx];
        this.currentTrackList[idx] = temp;
      }
    } else {
      _log(`unshuffling currently shuffled list`);
      this.currentTrackList = [...this.defaultTrackList];
    }
    [...this.currentTrackList].forEach((track, idx) => {
      track.currentIndex = idx;
    });
  }

  seekTo(track) {
    if (track) {
      _log(`seeking to track ${JSON.stringify(track)}`);
      this.recentlySeeked = true;
      this.currentTrack = track;
      this.nextTrack = null;
      this.videoElement.currentTime = track.start;
      this.setNowPlaying(track);
    } else {
      _warn(`failed to seek. track is undefined`);
    }
  }

  setNowPlaying(track) {
    let nowPlaying = track || this.getNowPlaying();
    _log(`setting up now playing: ${JSON.stringify(nowPlaying)}`);
    if (nowPlaying?.title) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: nowPlaying.title,
        artist: this.channelName,
        artwork: [
          {
            src: `https://i.ytimg.com/vi/${this.VIDEO_ID}/mqdefault.jpg`,
            sizes: "320x180",
            type: "image/jpeg",
          },
        ],
      });
    }
  }

  seekNext = (event) => this.seekFromCurrent(1, event);
  seekPrevious = (event) => this.seekFromCurrent(-1, event);

  seekFromCurrent(offset, event) {
    const NEXT = 1,
      PREVIOUS = -1;
    _log(
      `received seek ${
        offset === PREVIOUS ? "previous" : "next"
      } command at ${this.videoElement.currentTime}`
    );
    let now_playing = this.getNowPlaying();
    if (now_playing) {
      // if going in reverse and
      if (
        offset === PREVIOUS &&
        this.videoElement.currentTime - now_playing.start >
        YCMC.TRACK_START_THRESHOLD
      ) {
        offset = 0;
      }
      let track = this.currentTrackList[now_playing.currentIndex + offset];
      if (!track) {
        if (offset === PREVIOUS && this.ogPreviousHandler) {
          this.ogPreviousHandler(event);
        } else if (offset === NEXT && this.ogNextHandler) {
          this.ogNextHandler(event);
        }
      }
      this.seekTo(track);
    } else {
      _warn(
        "could not resolve currently playing track, cannot seek relative to it"
      );
    }
  }

  setup() {
    this.defaultTrackList = this.parseFromAnywhere();
    this.currentTrackList = [...this.defaultTrackList];

    _log(`parsed ${this.defaultTrackList.length} tracks`);
    if (this.defaultTrackList.length) {
      GM_registerMenuCommand("shuffle", this.toggleShuffle.bind(this), "s");
      this.videoElement = document.querySelector("video");
      this.channelName = document
        .querySelector("#player ~ #meta .ytd-channel-name a")
        .textContent.trim();

      navigator.mediaSession.setActionHandler(
        "nexttrack",
        this.seekNext,
        true
      );
      navigator.mediaSession.setActionHandler(
        "previoustrack",
        this.seekPrevious,
        true
      );
      this.videoElement.addEventListener(
        "timeupdate",
        this.timeUpdateHandler.bind(this)
      );
      // in the past we've had a one time listener to update on play
      // i don't think this is necessary
    }
  }

  timeUpdateHandler() {
    if (!this.defaultTrackList) {
      return;
    }
    if (!this.currentTrack && !this.nextTrack) {
      this.setNowPlaying();
    }
    this.currentTrack = this.currentTrack || this.getNowPlaying();
    this.nextTrack =
      this.nextTrack ||
      (this.currentTrack &&
        this.defaultTrackList[this.currentTrack.defaultIndex + 1]);
    const curTimeAfterTrackStart =
      this.currentTrack &&
      this.videoElement.currentTime >= this.currentTrack.start;
    const curTimeBeforeNextTrackStart =
      (this.currentTrack &&
        this.nextTrack &&
        this.nextTrack.start > this.videoElement.currentTime) ||
      !this.nextTrack;
    if (
      !this.currentTrack ||
      (curTimeAfterTrackStart && curTimeBeforeNextTrackStart)
    ) {
      return;
    }
    if (this.recentlySeeked) {
      _log("recently seeked, ignoring player head boundary crossing");
      this.recentlySeeked = false;
      return;
    }
    _log(
      `currentTime ${this.videoElement.currentTime} out of range !(${this.currentTrack.start} <= ${this.videoElement.currentTime} < ${this.nextTrack.start}), updating track info`
    );
    if (this.shuffleOn) {
      // go to the next track in the shuffled playlist been shuffled
      _log(`shuffle is currently on, retrieving next track`);
      let next_shuffled_track =
        this.currentTrackList[this.currentTrack.currentIndex + 1];
      this.seekTo(next_shuffled_track);
    } else {
      // otherwise, just let the player progress automatically
      this.currentTrack = this.getNowPlaying();
      this.setNowPlaying(this.currentTrack);
    }
    this.nextTrack = null;
  }

  waitToSetup() {
    this.resetInst();
    _log("waiting for YT Player to load");
    window.setupPoller = window.setInterval(() => {
      if (!this.VIDEO_ID) {
        _log("parsing youtube video ID failed, presuming non-video page");
        window.clearInterval(setupPoller);
        return;
      }
      let descriptionElement = document.querySelector(
        "#description yt-formatted-string"
      );
      if (
        document.querySelector("ytd-watch-flexy") &&
        descriptionElement &&
        descriptionElement !== this.descriptionElement &&
        document.querySelector("video")
      ) {
        _log("found player, setting up");
        this.setup();
        window.clearInterval(setupPoller);
      } else if (descriptionElement) {
        // ie, we have all the elements but aren't confident the page has changed
        const observer = new MutationObserver((mutationsList, observer) => {
          if (mutationsList.length > 0) {
            // typically, takes about 30ms (!!) for the whole list of description span's to be added to the DOM
            // we triple that for safety: we wait 100ms after a childlist mutation happens
            // if another childlist mutation happens in that time period,
            // the current timeout is abandoned and replaced with another 100ms
            if (window.descMutTimeout) {
              window.clearTimeout(window.descMutTimeout);
            }
            window.descMutTimeout = window.setTimeout(() => {
              _log("found player + description, setting up");
              this.setup();
              window.descMutTimeout = null;
            }, 100);
          }
        });
        observer.observe(
          document.querySelector("#description yt-formatted-string"),
          {childList: true}
        );
        // we no longer care about a generic setup poller, watching the description
        // for changes is more effecient and suffices
        window.clearInterval(setupPoller);
      }
    }, YCMC.PLAYER_SETUP_QUERY_INTERVAL_MS);
  }

  hookMediaSessionSetActionHandler() {
    _log(`hooking mediaSession.setActionHandler`);
    const oSetActionHandler =
      window.navigator.mediaSession.setActionHandler.bind(
        window.navigator.mediaSession
      );
    navigator.mediaSession.setActionHandler =
      window.navigator.setActionHandler = (action, handler, friendly) => {
        if (friendly) {
          _log(
            `received friendly setActionHandler call ${action} ${handler}`
          );
          return oSetActionHandler(action, handler);
        }
        if (action === "nexttrack") {
          // noinspection EqualityComparisonWithCoercionJS
          if (this.ogNextHandler != handler) {
            _log(
              `set ogNextHandler from ${this.ogNextHandler} to ${handler}`
            );
          }
          this.ogNextHandler = handler;
        } else if (action === "previoustrack") {
          // noinspection EqualityComparisonWithCoercionJS
          if (this.ogPreviousHandler != handler) {
            _log(
              `set ogPreviousHandler from ${this.ogPreviousHandler} to ${handler}`
            );
          }
          this.ogPreviousHandler = handler;
        } else {
          return oSetActionHandler(action, handler);
        }
      };
  }
}

function clamp(number, min, max) {
  return Math.min(max, Math.max(number, min));
}

function _log(...args) {
  return console.log(...["%c[YCMC]", "color: green", ...args]);
}

function _warn(...args) {
  return console.log(...["%c[YCMC]", "color: yellow", ...args]);
}

// https://stackoverflow.com/a/63856062
function padArrayStart(arr, len, padding) {
  return Array(len - arr.length)
    .fill(padding)
    .concat(arr);
}

let ycmc = new YCMC();
ycmc.hookMediaSessionSetActionHandler();
window.addEventListener("yt-navigate-finish", () => {
  if (!/^\/watch/.test(location.pathname)) {
    _log("nav finished, but not onto watch page, ignoring");
    return;
  }
  ycmc.waitToSetup();
});
