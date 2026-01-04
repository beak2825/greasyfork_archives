// ==UserScript==
// @name         YT快速鍵hotkeys
// @namespace    https://greasyfork.org/users/4839
// @version      1.3.4
// @license      AGPLv3
// @author       jcunews
// @description  YT快速鍵控制功能，說明鍵:[?]
// @match        https://*.youtube.com/*
// @grant        none
// @run-at       document-start
// @icon         https://www.youtube.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/487719/YT%E5%BF%AB%E9%80%9F%E9%8D%B5hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/487719/YT%E5%BF%AB%E9%80%9F%E9%8D%B5hotkeys.meta.js
// ==/UserScript==
//感謝原作者https://greasyfork.org/zh-TW/scripts/383570
/*
*[?](shift+/)打開說明欄
*快速鍵可代碼內自行修改
*本腳本無法突破YT限制(1.速度上限2x；2.LIVE直播若關閉回放則無法跳秒)
*搭配使用html5腳本
https://greasyfork.org/zh-TW/scripts/487825
*/

(ch => {
  /*
     `key` 必須輸入大寫。
     `mods`是零或最多3個修飾符鍵以任何順序）： `A`=Alt, `C`=Control, `S`=Shift.
         例如 “”（無修飾符鍵）, "s" (Shift), "Cs" (Control+Shift), "aSc" (Control+Shift+Alt).
  */
  var hotkeys = [
    {key: "S", mods: "", desc: "截圖(jpg)Screenshot >腳本https://greasyfork.org/scripts/488800", func: a => eleClick('#yt-ss-btn')},
    {key: "S", mods: "", desc: "截圖到剪貼簿clipboard Screenshot  >腳本https://greasyfork.org/scripts/512256", func: a => eleClick('#screenshotButton')},
    {key: "W", mods: "", desc: "Tabview資訊 >搭配腳本https://greasyfork.org/scripts/428651", func: a => eleClick('#tab-btn1')},
    {key: "E", mods: "", desc: "Tabview留言 >搭配腳本https://greasyfork.org/scripts/428651", func: a => eleClick('#tab-btn3')},
    {key: "W", mods: "S", desc: "Tabview播放清單 >搭配腳本https://greasyfork.org/scripts/428651", func: a => eleClick('#tab-btn5')},
    {key: "E", mods: "S", desc: "Tabview影片 >搭配腳本https://greasyfork.org/scripts/428651", func: a => eleClick('#tab-btn4')},
    {key: "ESCAPE", mods: "", desc: "[關閉YouTubeLiveClock筆記] >搭配擴充YouTubeLiveClock", func: a => eleClick('#ytlctn-close')},
    {key: "V", mods: "", desc: "回復展開 >搭配腳本https://greasyfork.org/scripts/533786", func: a => eleClick('.ytce-toggle-slider')},
    {key: "R", mods: "", desc: "已儲存進度 >搭配腳本https://greasyfork.org/scripts/487305", func: a => eleClick('.ytTextCarouselItemViewModelButton')},

    {key: "\\", mods: "",  desc: "焦點頻道搜尋框", func: a => eleClick('#tabs-container :is(ytd-expandable-tab-renderer,.ytd-expandable-tab-renderer):has(form[action*="/search"]) button.yt-icon-button')},
    {key: "'", mods: "", desc: "焦點評論輸入框", func: a => eleClick('#simplebox-placeholder')},
    {key: "/", mods: "",  desc: "焦點聊天室輸入框", func: a => focusChatFrame('#input.yt-live-chat-message-input-renderer')},
    {key: "N", mods: "", desc: "聊天室跳到最底↓", func: a => eleClick('#show-more')},
    {key: "B", mods: "", desc: "焦點即時聊天訊息列表+刷新", func: a => (focusChatFrame('tp-yt-paper-button') ,eleClick('tp-yt-paper-button'), eleClick('.iron-selected.yt-dropdown-menu'))},
    {key: "V", mods: "", desc: "聊天室貼圖按鈕", func: a => eleClick('#button.yt-live-chat-icon-toggle-button-renderer')},
    //{key: "\\", mods: "", desc: "聊天室輸入框Focus live chat input box", func: (a, b) => (a = document.querySelector('#chatframe')) && (b = a.contentDocument.querySelector('div#input')) && (a.focus(), b.focus())},

    {key: "G", mods: "", desc: "倒退 1 秒Rewind video by 1 seconds", func: a => videoSeekBy(-1)},
    {key: "H", mods: "", desc: "前進 1 秒forward video by 1 seconds", func: a => videoSeekBy(1)},
    {key: "G", mods: "S", desc: "前進 30 秒Rewind video by 30 seconds", func: a => videoSeekBy(-30)},
    {key: "H", mods: "S", desc: "倒退 30 秒forward video by 30 seconds", func: a => videoSeekBy(30)},
    {key: "G", mods: "SA", desc: "跳至開始go video 0%", func: a => videoSeekTo(0.00)},
    {key: "H", mods: "SA", desc: "跳至最後go video 100%", func: a => videoSeekTo(1.00)},
    {key: "F", mods: "S", desc: "跳至直播最新進度live current time", func: a => eleClick('.ytp-live-badge')},

    {key: "J", mods: "A", func: a => videoSeekChapter(-1), desc: "上一章節Seek to previous chapter"},
    {key: "L", mods: "A", func: a => videoSeekChapter(1), desc: "下一章節Seek to next chapter"},

    {key: "`", mods: "",  desc: "指南/側邊欄Toggle guide / sidebar", func: a => eleClick('#guide-button')},
    {key: "U", mods: "S", desc: "隱藏控制列Toggle YouTube video controls", func: toggleYtVideoControls},
    {key: "Y", mods: "S", desc: "個人中心Go to feed you page", func: a =>  (window.open("/feed/you"))},
    {key: "T", mods: "S", desc: "首頁Go to homepage", func: a =>  (window.open("/"))},
    {key: "R", mods: "", desc: "聊天室/章節Toggle replay chat or chapter list", func: toggleChatChap},
    {key: "Y", mods: "", desc: "按喜歡Toggle like video", func: a => eleClick(['#segmented-like-button button', ':is(#info, #description-and-actions, #actions) #menu ytd-toggle-button-renderer:nth-of-type(1) button#button', '#info #menu #top-level-buttons-computed ytd-toggle-button-renderer:nth-of-type(1) button#button', '#actions like-button-view-model button'])},
    {key: "V", mods: "S", desc: "Select preferred subtitle language", func: selectCaption},

    {key: "G", mods: "A", desc: "提高解析度Decrease video quality", func: selectQuality},
    {key: "H", mods: "A", desc: "降低解析度Increase video quality", func: selectQuality},

    {key: "<", mods: "S", desc: "加速(上限  2X )Decrease video playback speed by 0.25", func: a => adjustSpeed(-1)},
    {key: ">", mods: "S", desc: "減速(下限0.25X)Increase video playback speed by 0.25", func: a => adjustSpeed(1)},
    {key: "M", mods: "S", desc: "恢復原速Increase video playback speed by 1", func: a => adjustSpeed2()},
//禁用0-9的跳進度%
    {key: "0", mods: "",desc: "說明：已經禁用 0 - 9 跳進度 N %", func: a => videoSeekTo(none)},
    {key: "1", mods: "", func: a => videoSeekTo(none)},
    {key: "2", mods: "", func: a => videoSeekTo(none)},
    {key: "3", mods: "", func: a => videoSeekTo(none)},
    {key: "4", mods: "", func: a => videoSeekTo(none)},
    {key: "5", mods: "", func: a => videoSeekTo(none)},
    {key: "6", mods: "", func: a => videoSeekTo(none)},
    {key: "7", mods: "", func: a => videoSeekTo(none)},
    {key: "8", mods: "", func: a => videoSeekTo(none)},
    {key: "9", mods: "", func: a => videoSeekTo(none)},
  ];
  var subtitleLanguageCode = "zh-TW"; //2-letters language code for select preferred subtitle language hotkey

  var baseKeys = {};
  ("~`!1@2#3$4%5^6&7*8(9)0_-+={[}]:;\"'|\\<,>.?/").split("").forEach((c, i, a) => {
    if ((i & 1) === 0) baseKeys[c] = a[i + 1];
  });

  function focusChatFrame(sel, a, b) {
    (a = document.querySelector('#chatframe')) && (b = a.contentDocument.querySelector(sel)) && (a.focus(), b.focus())
  }

  function isHidden(e) {
    while (e && e.style) {
      if (getComputedStyle(e).display === "none") {
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
      if (s = s.match(/^(?:\s*\d+\.)?\s*(\d{1,2}:)?\d{1,2}:\d{1,2}\s+\S+.*/gm)) {
        s = s.map(s => {
          s = s.match(/^(?:\s*\d+\.)?\s*(\d{1,2}:)?(\d{1,2}):(\d{1,2})/);
          s[1] = s[1] ? parseInt(s[1]) : 0;
          s[2] = s[2] ? parseInt(s[2]) : 0;
          s[3] = s[3] ? parseInt(s[3]) : 0;
          return (s[1] * 3600) + (s[2] * 60) + s[3]
        })
      }
    }
    if (
      (!s || !s.some || !s.length) && (s = window["page-manager"]) && (s = s.getCurrentData()) && (s = s.response) && (s = s.playerOverlays) &&
      (s = s.playerOverlayRenderer) && (s = s.decoratedPlayerBarRenderer) && (s = s.decoratedPlayerBarRenderer) && (s = s.playerBar) &&
      (s = s.multiMarkersPlayerBarRenderer) && (s = s.markersMap)
    ) {
      s.some(m => {
        if (m.key === "AUTO_CHAPTERS") {
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
  //解析度修改
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
          if (!a) a = o.find(ct => ct.isTranslatable && (ct.vssId[1] === ".") && (ct.vssId.substr(2) !== subtitleLanguageCode));
        }
        if (!a && (c.vss_id === ("a." + subtitleLanguageCode))) {
          a = o.find(ct => ct.isTranslatable && (ct.vssId[0] === ".") && (ct.vssId.substr(1) !== subtitleLanguageCode));
          if (!a) a = o.find(ct => ct.isTranslatable && (ct.vssId[1] === ".") && (ct.vssId.substr(2) !== subtitleLanguageCode));
        }
        if (!a && c.is_translateable && (c.vss_id[0] === ".") && (c.vss_id.substr(1) !== subtitleLanguageCode)) {
          a = o.find(ct => ct.isTranslatable && (ct.vssId[1] === ".") && (ct.vssId.substr(2) !== subtitleLanguageCode));
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
          ));
        }
        if (!a) return;
      }
      a = {languageCode: a.languageCode, vss_id: a.vssId};
      if (a.languageCode !== subtitleLanguageCode) {
        v.getPlayerResponse().captions.playerCaptionsTracklistRenderer.translationLanguages.some(l => {
          if (l.languageCode === subtitleLanguageCode) {
            a.translationLanguage = {languageCode: subtitleLanguageCode};
            a.translationLanguage.languageName = l.languageName.simpleText;
            return true;
          }
        });
      }
      if (!c.languageCode) v.toggleSubtitles();
      v.setOption("captions", "track", a);
    }
  }
  //速度提示框
const SHOW_NOTIFICATIONS = true;
const NOTIFICATION_DURATION_MILLIS = 350;
var lastToastElement = null;
function showNotification(message) {
    if (!SHOW_NOTIFICATIONS) {return;}
    if (lastToastElement !== null) {lastToastElement.remove();lastToastElement = null;}
    const toast = document.createElement('tp-yt-paper-toast');
    toast.innerText = message;
    toast.classList.add('toast-open');
    toast.style.cssText= "font:normal 16pt/normal sans-serif;background:#444;color:#fff";
    const styleProps = {position: 'fixed',left: '0%',bottom: '2%',opacity: '1',};//outline: 'none',zIndex: '2202',
    for (const prop in styleProps) {toast.style[prop] = styleProps[prop];}
    document.body.appendChild(toast);
    lastToastElement = toast;
    setTimeout(() => {toast.style.display = 'block'; toast.style.transform = 'none';}, 0);
    setTimeout(() => {toast.style.display = 'none';}, Math.max(0, NOTIFICATION_DURATION_MILLIS));
}
  //速度修改
  function adjustSpeed(d, s) {
    if (s = Math.floor((movie_player.getPlaybackRate() * 4) + d) / 4) movie_player.setPlaybackRate(s)
          showNotification('Speed : ' + movie_player.getPlaybackRate(s) + ' X')
  }
  //速度復原1x
  function adjustSpeed2(d, s) {
    if (s = 1) movie_player.setPlaybackRate(s)
          showNotification('Speed : ' + movie_player.getPlaybackRate(s) + ' X')
  }

  //顯示隱藏聊天室/章節按鈕
  function toggleChatChap(a) {
    if (!eleClick([
      '#chat-messages #close-button button',
      '#show-hide-button.ytd-live-chat-frame button',
      '#show-hide-button.ytd-live-chat-frame > ytd-toggle-button-renderer.ytd-live-chat-frame',
      'ytd-engagement-panel-section-list-renderer:is([target-id="engagement-panel-macro-markers-auto-chapters"],[target-id="engagement-panel-macro-markers-description-chapters"])[visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"] #visibility-button button',
      '.ytp-chapter-title'
    ]) && (a = document.querySelector('ytd-live-chat-frame:not([collapsed]) #chatframe'))) a.contentWindow.postMessage("myhujs_toggleChatChap")
  }
  //影片控制列隱藏顯示
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
      (d = a.__data) && (d = d.text) && (d = d.runs) && (d = d[0]) && (d = d.navigationEndpoint)
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
    }
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