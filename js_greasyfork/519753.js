// ==UserScript==
// @name         ezClip
// @namespace    Holobox
// @version      2024-12-05
// @description  ytarchive와 yt-dlp로 유튜브 생방송/아카이브/영상 클립을 따기 쉽게 도와주는 툴
// @author       물먹는하마
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @run-at       document-start
// @icon         https://cutecafe.art/wp-content/uploads/2023/03/fauna01.gif
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519753/ezClip.user.js
// @updateURL https://update.greasyfork.org/scripts/519753/ezClip.meta.js
// ==/UserScript==

let { get: getter, set: setter } = Object.getOwnPropertyDescriptor(
    Object.prototype,
    "playerResponse"
  ) ?? {
    set(e) {
      this[Symbol.for("ezclip")] = e;
    },
    get() {
      return this[Symbol.for("ezclip")];
    },
  },
  isObject = (e) => null != e && "object" == typeof e,
  LEFT =
    (Object.defineProperty(Object.prototype, "playerResponse", {
      set(e) {
        var t, o;
        isObject(e) &&
          (({ streamingData: t, videoDetails: o } = e), isObject(o)) &&
          o.isLive &&
          !o.isLiveDvrEnabled &&
          ((o.isLiveDvrEnabled = !0), isObject(t)) &&
          delete t.serverAbrStreamingUrl,
          setter.call(this, e);
      },
      get() {
        return getter.call(this);
      },
      configurable: !0,
    }),
    -1),
  RIGHT = 1;
function formatSecondsToHHMMSS(e) {
  var e = Math.floor(e),
    t = Math.floor(e / 3600),
    o = Math.floor((e % 3600) / 60),
    e = e % 60;
  return [
    t.toString().padStart(2, "0"),
    o.toString().padStart(2, "0"),
    e.toString().padStart(2, "0"),
  ].join(":");
}
function waitForElm(r) {
  return new Promise((t) => {
    var e = document.querySelector(r);
    if (e) return t(e);
    let o = new MutationObserver((e) => {
      document.querySelector(r) &&
        (t(document.querySelector(r)), o.disconnect());
    });
    o.observe(document, { childList: !0, subtree: !0 });
  });
}
async function ytExists(e) {
  e = `https://www.youtube.com/oembed?url=${e}&format=json`;
  try {
    return (await fetch(e)).ok;
  } catch (e) {
    return console.error("Error checking video existence:", e), !1;
  }
}
function formatDiffToRelativeTime(e) {
  var t = Math.floor(e / 3600),
    o = Math.floor((e % 3600) / 60),
    e = Math.floor(e % 60);
  return 0 < t ? t + `시간 ${o}분` : 0 < o ? o + `분 ${e}초` : e + "초";
}
(async () => {
  let [i, s, e] = await Promise.all([
    waitForElm("#movie_player"),
    waitForElm(".ytp-scrubber-button"),
    waitForElm(".ytp-live-badge"),
  ]);
  var t = document.querySelector(".ytp-progress-list");
  let c = document.createElement("div"),
    a =
      (t.appendChild(c),
      (c.id = "overlay"),
      (c.style.position = "absolute"),
      (c.style.top = "0"),
      (c.style.height = "100%"),
      (c.style.background = "rgba(255, 213, 44, 0.7)"),
      (c.style.zIndex = "1000"),
      (c.style.width = "0"),
      document.createElement("div")),
    d = ((a.id = "wave-container"), i.appendChild(a), console.log(a), null),
    u = null,
    o = Promise.resolve(),
    r = null,
    n = null,
    y = null,
    m = null,
    l;
  function g() {
    var e = document
        .querySelector("iframe#chatframe")
        ?.contentWindow.document.querySelector(
          "div#input.yt-live-chat-text-input-field-renderer"
        ),
      r = e?.parentElement.querySelector(
        "label#label.yt-live-chat-text-input-field-renderer"
      );
    if (
      (y &&
        e &&
        ((n = m() - i.getCurrentTime()) <= 7
          ? (e.setAttribute("contenteditable", "true"),
            (r.textContent = "구독자로 채팅..."))
          : ((n = formatDiffToRelativeTime(n)),
            e.setAttribute("contenteditable", "false"),
            (r.textContent = n + " 전 시점을 시청중입니다"))),
      null === d && null === u)
    )
      (c.style.width = "0"),
        (s.style.background = "var(--yt-spec-static-brand-red,#f03)");
    else {
      e = i.getCurrentTime();
      let t = m(),
        o = 43200 < t ? t - 43200 : 0;
      var [r, n, a] = [l(d), l(u), l(e)];
      function l(e) {
        return null === e ? null : ((e - o) / (t - o)) * 100;
      }
      d && u
        ? ((c.style.width = "auto"),
          (c.style.left = r + "%"),
          (c.style.right = 100 - n + "%"),
          e >= d && e <= u
            ? (s.style.background = "rgba(255, 213, 44, 0.9)")
            : (s.style.background = "var(--yt-spec-static-brand-red,#f03)"),
          (c.style.background = "rgba(255, 213, 44, 0.7)"))
        : d
        ? ((c.style.left = r + "%"),
          (c.style.right = ""),
          e >= d
            ? ((c.style.background = "rgba(255, 213, 44, 0.7)"),
              (c.style.width = "auto"),
              (s.style.background = "rgba(255, 213, 44, 0.9)"),
              (c.style.right = 100 - a + "%"))
            : ((c.style.width = Math.min(20, 100 - r) + "%"),
              (c.style.background =
                "linear-gradient(to right, rgba(255, 213, 44, 0.9), rgba(255, 213, 44, 0))"),
              (s.style.background = "var(--yt-spec-static-brand-red,#f03)")))
        : u &&
          ((c.style.left = ""),
          (c.style.right = 100 - n + "%"),
          e <= u
            ? ((c.style.width = "auto"),
              (c.style.background = "rgba(255, 213, 44, 0.7)"),
              (s.style.background = "rgba(255, 213, 44, 0.9)"),
              (c.style.left = a + "%"))
            : ((c.style.width = Math.min(20, n) + "%"),
              (c.style.background =
                "linear-gradient(to left, rgba(255, 213, 44, 0.9), rgba(255, 213, 44, 0))"),
              (s.style.background = "var(--yt-spec-static-brand-red,#f03)")));
    }
  }
  function v(e, t) {
    var o = t - e,
      r = i.getVideoUrl(),
      o = y
        ? `ytarchive --live-from ${formatSecondsToHHMMSS(
            e
          )} --capture-duration ${formatSecondsToHHMMSS(
            o
          )} --threads 3 ${r} best`
        : `yt-dlp --download-sections "*${formatSecondsToHHMMSS(
            e
          )}-${formatSecondsToHHMMSS(
            t
          )}" --concurrent-fragments 3 --merge-output-format mp4 ` + r;
    GM_setClipboard(o),
      console.log("Command generated and copied to clipboard:", o);
  }
  function f(t = LEFT) {
    if (i.classList.contains("ytp-autohide")) {
      var o = a.offsetHeight,
        r = (3 * o) / 5,
        n = -r / 2 - r / 5;
      let e = document.createElement("div");
      (e.className = "wave"),
        (e.style.width = r + "px"),
        (e.style.height = o + "px"),
        t === LEFT ? (e.style.left = n + "px") : (e.style.right = n + "px"),
        a.appendChild(e),
        e.addEventListener("animationend", () => e.remove());
    }
  }
  (t = new Promise((e) => {
    l = e;
  })),
    i.addEventListener("onStateChange", (e) => {
      o = o.then(() =>
        (async (e) => {
          var t;
          console.log(`state changed: ${r} -> ` + e),
            1 === e &&
              (t = i.getVideoData())?.video_id &&
              n !== t.video_id &&
              void 0 !== t.isLive &&
              (console.log("video cued"),
              (y = t.isLive),
              (m = await (async (e) => {
                let t = await (async () => {
                    let e;
                    for (; 0 === (e = i.getCurrentTime()); )
                      await new Promise((e) => setTimeout(e, 100));
                    return e;
                  })(),
                  o = new Date().getTime() / 1e3;
                if ((console.log("duration by currentTime: ", t), e))
                  return (
                    console.log("Load time set: " + o),
                    function () {
                      var e = new Date().getTime() / 1e3;
                      return t + (e - o);
                    }
                  );
                {
                  let e = i.getDuration();
                  return function () {
                    return e;
                  };
                }
              })(y)),
              null === n && l(),
              (n = t.video_id),
              (d = null),
              (u = null),
              g(),
              console.log("videoId: ", n),
              console.log("isLive: ", y)),
            (r = e);
        })(e)
      );
    }),
    o.catch((e) => {
      console.error("Error processing state change:", e);
    }),
    await t,
    setInterval(g, 1e3),
    e.addEventListener("click", g),
    document.addEventListener("mousedown", () => {
      document.addEventListener("mousemove", g);
    }),
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", g), g();
    }),
    document.addEventListener(
      "keydown",
      function (e) {
        var t;
        document.activeElement.isContentEditable ||
          "INPUT" === document.activeElement.tagName ||
          "TEXTAREA" === document.activeElement.tagName ||
          ((location.href.includes("youtube.com/embed/") ||
            location.href.includes("youtube.com/watch")) &&
            ("KeyE" !== e.code ||
            e.ctrlKey ||
            e.altKey ||
            e.shiftKey ||
            e.metaKey
              ? "KeyR" !== e.code ||
                e.ctrlKey ||
                e.altKey ||
                e.shiftKey ||
                e.metaKey
                ? ("KeyC" !== e.code ||
                    e.ctrlKey ||
                    e.altKey ||
                    e.shiftKey ||
                    e.metaKey ||
                    (e.preventDefault(),
                    e.stopPropagation(),
                    (d = null),
                    (u = null),
                    console.log("Start and end times reset"),
                    g()),
                  (t = i.getCurrentTime()),
                  "KeyD" !== e.code ||
                  e.ctrlKey ||
                  e.altKey ||
                  e.shiftKey ||
                  e.metaKey
                    ? "KeyF" !== e.code ||
                      e.ctrlKey ||
                      e.altKey ||
                      e.shiftKey ||
                      e.metaKey ||
                      (e.preventDefault(),
                      e.stopPropagation(),
                      null !== d && t <= d && (d = null),
                      (u = i.getCurrentTime()),
                      console.log("End time set to", u),
                      g(),
                      null !== d && v(d, u),
                      f(RIGHT))
                    : (e.preventDefault(),
                      e.stopPropagation(),
                      null !== u && t >= u && (u = null),
                      (d = i.getCurrentTime()),
                      console.log("Start time set to", d),
                      g(),
                      null !== u && v(d, u),
                      f(LEFT)))
                : (e.preventDefault(),
                  e.stopPropagation(),
                  y
                    ? (i.seekTo(m() + 1e3, !0),
                      console.log("Moved to live part of the stream"))
                    : null !== u &&
                      (i.seekTo(u, !0), console.log("Moved to end time", u)))
              : (e.preventDefault(),
                e.stopPropagation(),
                null !== d &&
                  (i.seekTo(d, !0), console.log("Moved to start time", d)))));
      },
      !0
    ),
    GM_addStyle(`
    #wave-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none; /* 클릭 이벤트 무시 */
      /*background: blue;*/
      /*z-index: 9999;*/
    }
  
    .wave {
      position: absolute;
      left: auto;
      right: auto;
      width: 300px;
      height: 500px;
      background: rgba(255, 222, 5, 0.8); /* wave color - yellow */
      border-radius: 50%;
      transform: scale(0);
      animation: wave 0.6s ease-out forwards;
      z-index: 100;
    }
  
    @keyframes wave {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(1.2);
        opacity: 0;
      }
    }
  `);
})();
