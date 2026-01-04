// ==UserScript==
// @name              Bilibili Old
// @name:zh-CN        旧版 Bilibili
// @version           0.5.4
// @description       Script has borken, try other script like 394296-bilibili-旧播放页
// @description:zh-CN 本脚本已经失效，请尝试其他脚本，如394296-bilibili-旧播放页
// @author            GForkMe.L
// @run-at            document-start
// @match             *://www.bilibili.com/*
// @match             *://search.bilibili.com/*
// @grant             GM_registerMenuCommand
// @namespace         https://greasyfork.org/users/12904
// @license           GPL v3
// @downloadURL https://update.greasyfork.org/scripts/464311/Bilibili%20Old.user.js
// @updateURL https://update.greasyfork.org/scripts/464311/Bilibili%20Old.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const MAX_AGE = 60 * 60 * 24 * 365;
  const PLAYER_CONF = "bpx_player_profile";
  const SCRIPT_STAT = "bili_old_video";

  class BiliOld {
    constructor() {
      // Use no feed bilibili homepage, old video page and stop autoplay.
      if (!document.cookie.includes("SESSDATA")) {
        if (!location.host.startsWith("search") && !localStorage.getItem(SCRIPT_STAT)) {
          // this.toggleNoFeeds();
          this.noVideoAutoplay();
          this.noRcmAutoplay();
          // this.toggleOldVideo();
        }
      }

      const menuItems = [
        [
          "No Video and Recommend Autoplay",
          () => {
            this.noVideoAutoplay();
            this.noRcmAutoplay();
          },
        ],
        //["No Video Autoplay", () => this.noVideoAutoplay()],
        //["No Recommend Autoplay", () => this.noRcmAutoplay()],
        // ["Toggle Feeds", () => this.toggleNoFeeds()],
        // ["Toggle Old Homepage", () => this.toggleOldHome()],
        // ["Toggle Old Searchpage", () => this.toggleOldSearch()],
        // ["Toggle Old Videopage", () => this.toggleOldVideo()],
      ];

      this.mId = [];
      for (let i = 0; i < menuItems.length; i++) {
        this.mId.push(GM_registerMenuCommand(menuItems[i][0], menuItems[i][1]));
      }
    }

    updateStat(arg) {
      const STAT = { no_v_autoplay: 0, no_rcmv_autoplay: 0, no_feeds: 0, old_home: 0, old_video: 0, old_search: 0 };

      Object.assign(STAT, JSON.parse(localStorage.getItem(SCRIPT_STAT)) ?? STAT);
      for (let key in STAT) {
        STAT[key] += arg[key] ? 1 : 0;
      }

      localStorage.setItem(SCRIPT_STAT, JSON.stringify(STAT));
    }

    noVideoAutoplay() {
      const CONF = JSON.parse(localStorage.getItem(PLAYER_CONF)) ?? { media: { autoplay: false } };
      if (!CONF.media.autoplay) {
        CONF.media.autoplay = false;
        localStorage.setItem(PLAYER_CONF, JSON.stringify(CONF));
      }
      this.updateStat({ no_v_autoplay: true });
    }

    noRcmAutoplay() {
      const CONF = JSON.parse(localStorage.getItem(PLAYER_CONF)) ?? { media: { handoff: 2 } };
      if (CONF.media.handoff != 2) {
        CONF.media.handoff = 2;
        localStorage.setItem(PLAYER_CONF, JSON.stringify(CONF));
      }
      if (localStorage.getItem("recommend_auto_play") !== "close") {
        localStorage.setItem("recommend_auto_play", "close");
      }
      this.updateStat({ no_rcmv_autoplay: true });
    }

    toggleNoFeeds() {
      this.updateStat({ no_feeds: this.#toggleCookie("i-wanna-go-feeds", "-1") });
    }

    toggleOldHome() {
      this.updateStat({ old_home: this.#toggleCookie("i-wanna-go-back", "2") });
    }

    toggleOldSearch() {
      this.updateStat({ old_search: this.#toggleCookie("nostalgia_conf", "2") });
    }

    toggleOldVideo() {
      this.updateStat({ old_video: this.#toggleCookie("go_old_video", "1") });
    }

    #toggleCookie(key, val) {
      let cookie = `${key}=${val}`;
      let attrib = "domain=bilibili.com; path=/; max-age=" + MAX_AGE;
      if (document.cookie.includes(cookie)) {
        document.cookie = `${key}=${-val}; ${attrib}`;
        return false;
      } else {
        document.cookie = `${cookie}; ${attrib}`;
        return true;
      }
    }
  }

  const goOld = new BiliOld();
})();
