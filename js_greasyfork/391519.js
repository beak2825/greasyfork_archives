// ==UserScript==
// @name        Remove YouTube Channel Video AutoPlay
// @namespace   RemoveYouTubeChannelVideoAutoPlay
// @description RemoveYouTubeChannelVideoAutoPlay
// @version     1.7
// @author      Yousif
// @match       https://www.youtube.com/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/391519/Remove%20YouTube%20Channel%20Video%20AutoPlay.user.js
// @updateURL https://update.greasyfork.org/scripts/391519/Remove%20YouTube%20Channel%20Video%20AutoPlay.meta.js
// ==/UserScript==
(function(listen, create) {
    (function check() {
      if (!listen && document.body) {
        if (!document.body.id) {
          listen = 1;
          addEventListener("spfpartprocess", function(ev) {
            if ((ev = ev.detail) && (ev = ev.part) && (ev = ev.data) && (ev = ev.swfcfg) &&
              (ev = ev.args) && (/^\/(channel|user)\//).test(ev.loaderUrl)) {
            document.querySelectorAll(".c4-player-container.c4-flexible-player-container")[0]= null
            }
          });
        }
      }
      if (window.yt && yt.player && yt.player.Application && yt.player.Application.create && !create) {
        create = yt.player.Application.create;
        yt.player.Application.create = function(player, config) {
        document.querySelectorAll(".c4-player-container.c4-flexible-player-container")[0] = null
        };
      } else setTimeout(check, 50);
    })();
  })();