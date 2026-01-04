// ==UserScript==
// @name         More YouTube Hotkeys
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.3.70
// @license      AGPLv3
// @author       jcunews
// @description  Adds more keyboard shortcuts for YouTube. The list of all new shortcuts is added into new "More Shortcuts" section on YouTube's "Keyboard shortcuts" popup which can be accessed via "?" or SHIFT+/ key (on U.S. keyboards).
// @match        *://www.youtube.com/*
// @match        *://www.youtube-nocookie.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/383570/More%20YouTube%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/383570/More%20YouTube%20Hotkeys.meta.js
// ==/UserScript==

(ch => {

  //=== CONFIGURATION BEGIN
  /*
  `key` is the key name. If it's a letter, it must be in uppercase.
  `mods` is a zero or up to 3 modifier key characters (in any order): `A`=Alt, `C`=Control, `S`=Shift. Character case is ignored.
    e.g. "" (no modifier key), "s" (Shift), "Cs" (Control+Shift), "aSc" (Control+Shift+Alt).
  `desc` is the hotkey description which will be added onto YouTube's Hotkey List Popup (accessible via `?` or `SHIFT+/` key).
    If this property is empty or doesn't exist, the hotkey won't be included in YouTube's Hotkey List Popup.
  `keys` is an optional custom text representation for the keyboard keys which is useful to represent multiple hotkeys.
  `func` is the JavaScript function to execute with the activated hotkey object as the first argument.
  */

  var hotkeys = [
    {key: "`", mods: "",  desc: "Toggle guide / sidebar", func: a => eleClick('#guide-button')},
    {key: ";", mods: "",  desc: "Focus channel search box", func: a => eleClick('#tabs-container :is(ytd-expandable-tab-renderer,.ytd-expandable-tab-renderer):has(form[action*="/search"]) button.yt-icon-button')},
    {key: ":", mods: "S", desc: "Focus comment input box", func: a => eleClick('#simplebox-placeholder')},
    {key: "\\",mods: "",  desc: "Focus live chat input box", func: a => focusChatFrame('div#input')},
    {key: "\\",mods: "A", desc: "Focus live chat message list", func: a => focusChatFrame('#item-scroller')},
    {key: ")", mods: "S", desc: "Seek to specific point in the video (SHIFT+7 advances to 75% of duration)", keys: "SHIFT+0..SHIFT+9", func: a => videoSeekTo(0.05)},
    {key: "!", mods: "S", func: a => videoSeekTo(0.15)},
    {key: "@", mods: "S", func: a => videoSeekTo(0.25)},
    {key: "#", mods: "S", func: a => videoSeekTo(0.35)},
    {key: "$", mods: "S", func: a => videoSeekTo(0.45)},
    {key: "%", mods: "S", func: a => videoSeekTo(0.55)},
    {key: "^", mods: "S", func: a => videoSeekTo(0.65)},
    {key: "&", mods: "S", func: a => videoSeekTo(0.75)},
    {key: "*", mods: "S", func: a => videoSeekTo(0.85)},
    {key: "(", mods: "S", func: a => videoSeekTo(0.95)},
    {key: "J", mods: "A", desc: "Seek to previous chapter", func: a => videoSeekChapter(-1)},
    {key: "L", mods: "A", desc: "Seek to next chapter", func: a => videoSeekChapter(1)},
    {key: "C", mods: "S", desc: "Select preferred subtitle language", func: selectCaption},
    {key: "J", mods: "S", desc: "Rewind video by 30 seconds", func: a => videoSeekBy(-30)},
    {key: "L", mods: "S", desc: "Fast forward video by 30 seconds", func: a => videoSeekBy(30)},
    {key: "G", mods: "A", desc: "Decrease video quality", func: selectQuality},
    {key: "H", mods: "A", desc: "Increase video quality", func: selectQuality},
    {key: "Y", mods: "A", desc: "Set video quality to auto", func: selectQuality},
    {key: "E", mods: "",  desc: "Toggle like video", func: a => eleClick(['#segmented-like-button button', ':is(#info, #description-and-actions, #actions) #menu ytd-toggle-button-renderer:nth-of-type(1) button#button', '#info #menu #top-level-buttons-computed ytd-toggle-button-renderer:nth-of-type(1) button#button', '#actions like-button-view-model button'])},
    {key: "E", mods: "S", desc: "Toggle dislike video", func: a => eleClick(['#segmented-dislike-button button', ':is(#info, #description-and-actions, #actions) #menu ytd-toggle-button-renderer:nth-of-type(2) button#button', '#info #menu #top-level-buttons-computed ytd-toggle-button-renderer:nth-of-type(2) button#button', '#actions dislike-button-view-model button'])},
    {key: "H", mods: "",  desc: "Share video", func: a => eleClick([':is(#info, #description-and-actions) #menu ytd-button-renderer:nth-of-type(1) button#button,ytd-watch-metadata #menu :is(ytd-button-renderer,yt-button-view-model) button:has(div[style*="share"])', 'ytd-watch-metadata #menu :is(ytd-button-renderer,yt-button-view-model) button[aria-label="Share"]'])},
    {key: "N", mods: "",  desc: "Download video", func: a => doBtnOrMenu(['ytd-watch-metadata #menu ytd-button-renderer button:has(div[style*="download"])', '.ytd-download-button-renderer button'], '', 'primaryIconType', "OFFLINE_DOWNLOAD")},
    {key: "Q", mods: "S", desc: "Toggle YouTube video controls", func: toggleYtVideoControls},
    {key: "V", mods: "",  desc: "Save video into playlist", func: a => doBtnOrMenu(':is(#info, #description-and-actions) #menu ytd-button-renderer:last-of-type button#button,#actions button:has(div[style*="list_add"]),#actions button[title="Save"]', 'PLAYLIST_ADD')},
    {key: "U", mods: "",  desc: "Toggle subscription", func: a => eleClick('#meta ytd-subscribe-button-renderer>.ytd-subscribe-button-renderer:not(div),paper-button.ytd-subscribe-button-renderer,tp-yt-paper-button.ytd-subscribe-button-renderer,ytd-subscribe-button-renderer.ytd-watch-metadata button', true)},
    {key: "Y", mods: "",  desc: "Toggle subscription notification", func: a => eleClick(['ytd-watch-flexy #meta  .ytd-subscription-notification-toggle-button-renderer>button#button', 'ytd-watch-flexy #notification-preference-toggle-button > .ytd-subscribe-button-renderer'])},
    {key: "R", mods: "",  desc: "Toggle replay chat or chapter list", func: toggleChatChap},
    {key: "R", mods: "S", desc: "Toggle sponsored video list", func: a => eleClick('ytd-engagement-panel-section-list-renderer[target-id="ytbc-related-shelf"] #visibility-button .yt-icon-button')},
    {key: "X", mods: "",  desc: "Toggle autoplay of next non-playlist video", func: a => eleClick(['paper-toggle-button.ytd-compact-autoplay-renderer', 'button[data-tooltip-target-id="ytp-autonav-toggle-button"]'])},
    {key: "V", mods: "S", desc: "Go to user/channel video page", func: a => navUser("Videos", "videos")},
    {key: "Y", mods: "S", desc: "Go to user/channel playlists page", func: a => navUser("Playlists", "playlists")},
    {key: "`", mods: "C", desc: "Go to YouTube home page", func: a => eleClick('a#logo')},
    {key: "S", mods: "S", desc: 'Go to Subscriptions page', func: a => eleClick('a[href="/feed/subscriptions"]') || (location.href = "/feed/subscriptions")},
    {key: "F", mods: "S", desc: 'Go to Feeds ("You") page', func: a => eleClick('a[href="/feed/you"]') || (location.href = "/feed/you")},
    {key: "I", mods: "S", desc: "Go to History page", func: a => eleClick('a[href="/feed/history"]') || (location.href = "/feed/history")},
    {key: "W", mods: "S", desc: "Go to Watch Later page", func: a => eleClick('a[href="/playlist?list=WL"]') || (location.href = "/playlist?list=WL")},
    {key: "K", mods: "S", desc: "Go to Liked Videos page", func: a => eleClick('a[href="/playlist?list=LL"]') || (location.href = "/playlist?list=LL")},
    {key: "T", mods: "S", desc: "Go to Account page", func: a => eleClick('a[href="/account"]') || (location.href = "/account")}
  ];
  var subtitleLanguageCode = "en"; //2-letters language code for select preferred subtitle language hotkey

  //=== CONFIGURATION END

  var baseKeys = {};
  ("~`!1@2#3$4%5^6&7*8(9)0_-+={[}]:;\"'|\\<,>.?/").split("").forEach((c, i, a) => {
    if ((i & 1) === 0) baseKeys[c] = a[i + 1];
  });

  function isHidden(e) {
    while (e && e.style) {
      if (e.hidden || (getComputedStyle(e).display === "none")) {
        return true;
      }
      e = e.parentNode
    }
    return false
  }

  function eleClick(s, l, e) {
    if (s.some) {
      s.some(a => {
        if (e = document.querySelector(a)) {
          if (e.disabled || isHidden(e)) e = null
        }
        if (e) return true
      });
    } else if (l) {
      e = Array.from(document.querySelectorAll(s)).find(f => !f.disabled && !isHidden(f))
    } else if (e = document.querySelector(s)) {
      if (e.disabled || isHidden(e)) e = null
    }
    if (e) {
      e.click();
      return true
    }
  }

  function doBtnOrMenu(btnSel, menuIcon, propName, propVal, itms, elePopup, z) {
    if (
      eleClick(btnSel) || !(btnSel = document.querySelector('#actions ytd-menu-renderer #button-shape button')) || isHidden(btnSel)
    ) return;
    (elePopup = document.querySelector('ytd-popup-container')).style.display = "none";
    try {
      btnSel.click();
      setTimeout(() => {
        ((itms = elePopup?.querySelector('#items'))?.__dataHost?.__data?.data || itms?.__data)?.items?.some?.((itm, i) => {
          if (propName) {
            if (propName in itm) {
              if ((propVal === undefined) || (itm[propName] === propVal)) itms.children[i].firstElementChild.click()
              return true
            }
          } else if ((itm.menuServiceItemRenderer || itm.polymerController?.data)?.icon?.iconType === menuIcon) {
            itms.children[i].firstElementChild.click()
            return true
          }
        });
        elePopup.style.display = ""
      }, 0)
    } catch(z) {
      elePopup.style.display = ""
    }
  }

  function videoSeekBy(t, v) {
    (v = document.querySelector('.html5-video-player')) && v.seekBy(t);
  }

  function videoSeekTo(p, v) {
    (v = document.querySelector('.html5-video-player')) && v.seekTo(v.getDuration() * p);
  }

  function videoSeekChapter(d, v, s, t) {
    if (
      (v = document.querySelector('.html5-video-player')) && (s = v.getPlayerResponse().videoDetails) &&
      (s = s.shortDescription)
    ) {
      t = v.getCurrentTime();
      if (s = s.match(/(?:^(?:\s*\d+\.)?\s*|\s+)?(\d{1,2}:)?\d{1,2}:\d{1,2}\s*/gm)) {
        s = s.map(s => {
          s = s.match(/^(?:^(?:\s*\d+\.)?\s*|\s+)?(\d{1,2}:)?(\d{1,2}):(\d{1,2})/);
          s[1] = s[1] ? parseInt(s[1]) : 0;
          s[2] = s[2] ? parseInt(s[2]) : 0;
          s[3] = s[3] ? parseInt(s[3]) : 0;
          return (s[1] * 3600) + (s[2] * 60) + s[3]
        })
      }
    }
    if (
      (!s || !s.some || !s.length) &&
      (s = window["page-manager"]?.getCurrentData?.()?.response || self.movie_player?.getPlayerResponse?.()) &&
      (s = s.playerOverlays?.playerOverlayRenderer?.decoratedPlayerBarRenderer?.decoratedPlayerBarRenderer?.playerBar?.multiMarkersPlayerBarRenderer?.markersMap)
    ) {
      s.some(m => {
        if (/^(AUTO|DESCRIPTION)_CHAPTERS$/.test(m.key)) {
          if ((m = m.value) && (m = m.chapters) && m.length && m[0] && m[0].chapterRenderer && m[0].chapterRenderer) {
            s = m.map(a => Math.floor(a.chapterRenderer.timeRangeStartMillis / 1000))
          }
          return true
        }
      })
    }
    if (s && s.some) {
      if (s.length && (s[0] > 1)) s.unshift(0);
      s.some((c, i) => {
        if ((d < 0) && (c <= t) && (!s[i + 1] || (s[i + 1] > t))) {
          if ((c + 1) >= t) {
            v.seekTo(s[i - 1]);
          } else v.seekTo(c);
          return true
        } else if ((d > 0) && (c > t) && i) {
          v.seekTo(c);
          return true
        }
      })
    }
  }
  if (location.pathname.startsWith("/embed/")) {
    var jp = JSON.parse;
    JSON.parse = function() {
      var r = jp.apply(this, arguments), a;
      if (
        self.movie_player?.getPlayerResponse?.() &&
        r?.playerOverlays?.playerOverlayRenderer?.decoratedPlayerBarRenderer?.decoratedPlayerBarRenderer?.playerBar?.multiMarkersPlayerBarRenderer?.markersMap?.length
      ) movie_player.getPlayerResponse().playerOverlays =r.playerOverlays;
      return r;
    }
  }

  function selectQuality(i, v, e, c) {
    if ((v = document.querySelector('.html5-video-player')) && (v.getAvailableQualityLabels().length > 1)) {
      if (i.key === "Y") {
        v.setPlaybackQualityRange("auto", "auto");
      } else {
        (e = v.getAvailableQualityLevels()).pop();
        c = e.indexOf(v.getPlaybackQuality());
        i = i.key === "G" ? 1 : -1;
        if (e = e[c + i]) v.setPlaybackQualityRange(e, e);
      }
    }
  }

  function selectCaption(v, o, c, a) {
    if (
      (v = document.querySelector('.html5-video-player')) && (o = v.getPlayerResponse().captions) &&
      (o = o.playerCaptionsTracklistRenderer) && (o = o.captionTracks)
    ) {
      if ((c = v.getOption("captions", "track")) && c.vss_id) {
        if (c.vss_id === ("." + subtitleLanguageCode)) {
          a = o.find(ct => ct.vssId === ("a." + subtitleLanguageCode));
          if (!a) a = o.find(ct => ct.isTranslatable && (ct.vssId[0] === ".") && (ct.vssId.substr(1) !== subtitleLanguageCode));
          if (!a) a = o.find(ct => ct.isTranslatable && (ct.vssId[1] === ".") && (ct.vssId.substr(2) !== subtitleLanguageCode))
        }
        if (!a && (c.vss_id === ("a." + subtitleLanguageCode))) {
          a = o.find(ct => ct.isTranslatable && (ct.vssId[0] === ".") && (ct.vssId.substr(1) !== subtitleLanguageCode));
          if (!a) a = o.find(ct => ct.isTranslatable && (ct.vssId[1] === ".") && (ct.vssId.substr(2) !== subtitleLanguageCode))
        }
        if (!a && c.is_translateable && (c.vss_id[0] === ".") && (c.vss_id.substr(1) !== subtitleLanguageCode)) {
          a = o.find(ct => ct.isTranslatable && (ct.vssId[1] === ".") && (ct.vssId.substr(2) !== subtitleLanguageCode))
        }
      }
      if (!a) {
        a = o.find(ct => ct.vssId === ("." + subtitleLanguageCode));
        if (!a) a = o.find(ct => ct.vssId === ("a." + subtitleLanguageCode));
        if (!a) a = o.find(ct => ct.isTranslatable && (ct.vssId[0] === ".") && (ct.vssId.substr(1) !== subtitleLanguageCode));
        if (!a) a = o.find(ct => ct.isTranslatable && (ct.vssId[1] === ".") && (ct.vssId.substr(2) !== subtitleLanguageCode));
        if (!a) {
          a = o.find(ct => ct.isTranslatable && (
            ((ct.vssId[0] === ".") && (ct.vssId.substr(1) !== subtitleLanguageCode)) ||
            ((ct.vssId[1] === ".") && (ct.vssId.substr(2) !== subtitleLanguageCode))
          ))
        }
        if (!a) return
      }
      a = {
        languageCode: a.languageCode,
        languageName: a.name?.runs?.[0]?.text || a.name.simpleText || a.name,
        kind: a.kind,
        displayName: a.displayName?.runs?.[0]?.text || a.displayName?.simpleText || a.displayName || "",
        is_translateable: a.is_translateable || a.isTranslatable,
        vss_id: a.vssId
      };
      if (!c.languageCode) v.toggleSubtitles();
      v.setOption("captions", "track", a);
      setTimeout((a, v) => {
        if (a.languageCode !== subtitleLanguageCode) {
          v.getPlayerResponse().captions.playerCaptionsTracklistRenderer.translationLanguages.some(l => {
            if (l.languageCode === subtitleLanguageCode) {
              a.translationLanguage = {
                languageCode: subtitleLanguageCode,
                languageName: l.languageName.runs?.[0]?.text || l.languageName.simpleText || l.languageName || ""
              };
              return true
            }
          })
        }
        v.setOption("captions", "track", a)
      }, 0, a, v)
    }
  }

  function toggleChatChap(a) {
    if (!eleClick([
      '#chat-messages #close-button button',
      '#show-hide-button.ytd-live-chat-frame button',
      '#show-hide-button.ytd-live-chat-frame > ytd-toggle-button-renderer.ytd-live-chat-frame',
      'ytd-engagement-panel-section-list-renderer:is([target-id="engagement-panel-macro-markers-auto-chapters"],[target-id="engagement-panel-macro-markers-description-chapters"])[visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"] #visibility-button button',
      '.ytp-chapter-title'
    ]) && (a = document.querySelector('ytd-live-chat-frame:not([collapsed]) #chatframe'))) a.contentWindow.postMessage("myhujs_toggleChatChap")
  }

  function focusChatFrame(sel, a, b) {
    (a = document.querySelector('#chatframe')) && (b = a.contentDocument.querySelector(sel)) && (a.focus(), b.focus())
  }

  function toggleYtVideoControls(v) {
    if (v = document.querySelector('.html5-video-player')) {
      if (v.classList.contains("ytp-autohide-active")) {
        v.classList.remove("ytp-autohide-active")
      } else if (v.classList.contains("ytp-autohide")) {
        v.classList.remove("ytp-autohide")
      } else v.classList.add("ytp-autohide")
    }
  }

  function navUser(tn, tp, a, b, d) {
    if ((new RegExp(`^/(channel|user)/[^/]+/${tp}$`)).test(location.pathname)) {
      Array.from(document.querySelectorAll('.paper-tab')).some(e => {
        if (e.textContent.trim() === tn) {
          e.parentNode.click();
          return true;
        }
      });
    } else if (
      (a = document.querySelector(':is(.ytd-video-secondary-info-renderer,ytd-watch-metadata) yt-formatted-string.ytd-channel-name')) &&
      (
        ((d = a.__data) && (d = d.text) && (d = d.runs) && (d = d[0]) && (d = d.navigationEndpoint)) ||
        ((d = a.__dataHost) && (d = d.__data) && (d = d.channelName) && (d = d.runs) && (d = d[0]) && (d = d.navigationEndpoint))
      )
    ) {
      if (b = document.querySelector(".yt-page-navigation-progress")) {
        b.style.transform = "scaleX(.5)";
        b.parentNode.hidden = false
      }
      fetch(d.commandMetadata.webCommandMetadata.url, {credentials: "omit"}).then(r => r.text().then((h, x, ep, e, t, m) => {
        if ((h = h.match(/var ytInitialData = (\{.*?\});/)) && (h = JSON.parse(h[1]).contents.twoColumnBrowseResultsRenderer.tabs)) {
          x = new RegExp(`^\\/[^\\/]+(?:\\/[^\\/]+)?\\/${tp}$`);
          if (h.some((v, i, b) => {
            if ((b = v.tabRenderer) && !b.content && x.test((b = b.endpoint).commandMetadata.webCommandMetadata.url)) {
              e = (ep = d).browseEndpoint;
              t = d.clickTrackingParams;
              m = d.commandMetadata;
              d.browseEndpoint = b.browseEndpoint;
              d.clickTrackingParams = b.clickTrackingParams;
              d.commandMetadata = b.commandMetadata;
              return true
            }
          })) {
            a.firstElementChild.click();
            setTimeout(() => {
              ep.browseEndpoint = e;
              ep.clickTrackingParams = t;
              ep.commandMetadata = m;
            }, 20)
          }
        }
      }))
    } else if (a = window.movie_player?.getPlayerResponse?.()?.videoDetails?.channelId) location.href = "https://www.youtube.com/channel/" + a + "/video"
  }

  function checkHotkeyPopup(a, b, c, d, e) {
    if ((a = document.querySelector("#sections.ytd-hotkey-dialog-content")) && !a.querySelector(".more-hotkeys")) {
      a.__shady_native_appendChild(b = (d = a.firstElementChild).__shady_native_cloneNode(false)).classList.add("more-hotkeys");
      a.__shady_native_appendChild(d.__shady_native_cloneNode(false));
      b.__shady_native_appendChild(d.__shady_native_firstElementChild.__shady_native_cloneNode(false)).textContent = "More Hotkeys";
      c = b.__shady_native_appendChild(d.__shady_native_lastElementChild.__shady_native_cloneNode(false));
      d = d.__shady_native_lastElementChild.firstElementChild;
      hotkeys.forEach((h, e, f) => {
        if (h.desc) {
          e = c.__shady_native_appendChild(d.__shady_native_cloneNode(true));
          e.__shady_native_firstElementChild.textContent = h.desc;
          if (!(f = h.keys)) {
            if (h.ctrl || h.alt) {
              f = (h.ctrl ? "CTRL+" : "") + (h.shift ? "SHIFT+" : "") + (h.alt ? "ALT+" : "") + h.key;
            } else if (h.shift) {
              f = h.key + " (" + (h.shift ? "SHIFT+" : "") + (h.shift ? baseKeys[h.key] || h.key.toLowerCase() : h.key) + ")";
            } else f = h.key.toLowerCase();
          }
          e.__shady_native_lastElementChild.textContent = f;
        }
      });
    } else if (--ch) setTimeout(checkHotkeyPopup, 100);
  }

  function editable(e) {
    var r = false;
    while (e) {
      if (e.contentEditable === "true") return true;
      e = e.parentNode;
    }
    return r;
  }

  if (top !== self) {
    addEventListener("message", ev => (ev.data === "myhujs_toggleChatChap") && toggleChatChap())
  }

  hotkeys.forEach(h => {
    var a = h.mods.toUpperCase().split("");
    h.shift = a.includes("S");
    h.ctrl = a.includes("C");
    h.alt = a.includes("A");
  });
  addEventListener("keydown", (ev, a) => {
    if ((a = document.activeElement) && (editable(a) || (a.tagName === "INPUT") || (a.tagName === "TEXTAREA"))) return;
    if ((ev.key === "?") && ev.shiftKey && !ev.ctrlKey && !ev.altKey) {
      ch = 10;
      setTimeout(checkHotkeyPopup, 100);
    }
    hotkeys.forEach(h => {
      if ((ev.key.toUpperCase() === h.key) && (ev.shiftKey === h.shift) && (ev.ctrlKey === h.ctrl) && (ev.altKey === h.alt)) {
        ev.preventDefault();
        ("function" === typeof h.func) && h.func(h);
      }
    });
  }, true);

})();
