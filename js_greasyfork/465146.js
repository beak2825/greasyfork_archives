// ==UserScript==
// @name        video, faster
// @namespace   Violentmonkey Scripts
// @include     *://*/*
// @exclude     https://*svelte.dev*
// @version     5.4
// @author      KraXen72
// @description speed up video on any site
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/465146/video%2C%20faster.user.js
// @updateURL https://update.greasyfork.org/scripts/465146/video%2C%20faster.meta.js
// ==/UserScript==

const jumpVal = 5
const rates = [1, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.5]
const commands = {}
const barAborts = {}

// css & ui stuff
let vfStyleTag = null
const btnDefaults = { classList: "userscript-simple-btn" }
const vfCSS = /*css*/`
div.userscript-video-top-bar {
  box-sizing: border-box;
  background-color: black;
  color: white;
  width: 100%;
  height: 22px;
  padding: 0 16px;
  display: grid;
  column-gap: 16px;
  grid-template-columns: max-content max-content 1fr;
  grid-template-rows: min-content;
  overflow-x: auto;
  transition: opacity 0.2s ease-in-out;
  scrollbar-width: none;
  pointer-events: auto;
}
.userscript-video-top-bar::-webkit-scrollbar { display: none }

.userscript-video-top-bar button,
.userscript-simple-btn {
  margin: 0 3px;
  height: 100%;
  padding: 2px;
  font-size: 14px !important;
  line-height: 14px !important;
  width: max-content;
}
.userscript-bar-wrap {
  display: flex !important;
  position: relative !important;
  height: 22px !important;
  padding: 2px 0px !important;
  box-sizing: border-box;
}

.userscript-simple-btn {
  background: #262626 !important;
  border: 1px solid #191919 !important;
  border-radius: 2px;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
  font-weight: normal;
}
.userscript-simple-btn,
.userscript-simple-btn:hover,
.userscript-simple-btn:active {
  color: white !important;
  background-image: none !important;
  box-sizing: border-box !important;
  box-shadow: none !important;
  text-shadow: none !important;
}
.userscript-simple-btn:hover {
  background: #303030 !important;
  border-color: #383838 !important;
}
.userscript-simple-btn:active { opacity: 0.8; }

.userscript-hl-rate.userscript-simple-btn,
.userscript-hl-rate.userscript-simple-btn:hover,
.userscript-hl-rate.userscript-simple-btn:active {
  background-color: #3aa99fb2 !important;
  border-color: #3aa99f !important;
}

.userscript-bar-separator {
  border-left: 2px solid #616161e5;
  width: 0px;
  margin: 0 6px;
}
.userscript-cb-wrap {
  display: flex;
  white-space: nowrap;
  padding: 0 3px;
  align-items: center;
}
.userscript-cb-wrap,
.userscript-cb-wrap > * {
  width: max-content;
  margin-top: 0;
  margin-bottom: 0;
  user-select: none;
}
.userscript-cb-wrap > *:not(::last-child) {
  margin-right: 3px;
}

.userscript-speed-display {
  min-width: 0;
  max-width: max-content;
  pointer-events: none;
}
`
const pageCSS = /*css*/`
.userscript-hoverinv { opacity: 0; }
.userscript-hoverinv:hover { opacity: 1 }

.userscript-video-shadow-host {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100 !important;
  width: 100% !important;
  height: 22px !important;
  transition: opacity 0.2s ease-in-out !important;
  pointer-events: none;
}
.userscript-video-shadow-host::-webkit-scrollbar { display: none }
`
function ensureCSSInjected() {
  if (vfStyleTag !== null) return;
  vfStyleTag = GM_addStyle(pageCSS)
}

function checkBox(emoji, valueKey = "", title = "", defaultv = false) {
  const wrap = document.createElement("span")
  wrap.classList.add("userscript-simple-btn", "userscript-cb-wrap")
  wrap.textContent = emoji
  wrap.onclick = cancelEvent
  if (title) wrap.title = title

  const cb = Object.assign(document.createElement("input"), { type: "checkbox" })
  cb.style.marginLeft = "7px"
  cb.checked = valueKey ? GM_getValue(valueKey, defaultv) : false
  cb.onclick = (e) => {
    if (!valueKey) return;
    e.stopPropagation();
    GM_setValue(valueKey, e.target.checked)
  }
  wrap.appendChild(cb)
  return wrap
}

for (const r of rates) { commands[`${r}x`] = () => playbackRate(r) }

// utils
function get_uuid() {
  return window.btoa(String(new Date().getTime()))
}
function cancelEvent(e) {
  if (!e || e == null) return;
  e.preventDefault()
  e.stopPropagation()
}

// functions
function get_restoreSpeed(video) {
  const lastSpeed = GM_getValue("lastSpeed", 0)
  return {
    lastSpeed,
    restoreSpeed: () => playbackRate(Number(lastSpeed), null, video)
  }
}

function playbackRate(rate, e = null, video = null) {
  if (e != null) cancelEvent(e);

  const targetVideo = video || document.querySelector('video');
  if (targetVideo) {
    targetVideo.playbackRate = rate;
    // Store the last rate we set
    targetVideo._lastSetRate = rate;
  }
  GM_setValue("lastSpeed", rate);
}

function ff(vid = null, e) {
  cancelEvent(e);
  vid.currentTime += jumpVal;
}
function rw(vid = null, e) {
  cancelEvent(e);
  vid.currentTime -= jumpVal;
}
function pp(vid = null, e) { // play-pause
  cancelEvent(e);
  if (vid.paused) { vid.play() } else { vid.pause() }
}

function setupYouTubeNavigationListener(video) {
  // Check if we're on YouTube
  if (!window.location.hostname.includes('youtube.com')) return;

  // Listen for YouTube's navigation event
  document.addEventListener('yt-navigate-finish', (evt) => {
    // console.log("yt-navigate-finish", evt);

		// playlists get cross-refresh speed continuity regardless of rememberSpeed
    if (!window.location.href.includes("list=")) return;

    const lastSpeed = GM_getValue("lastSpeed", 1);
    setTimeout(() => {
      if (video && video.playbackRate !== lastSpeed) {
        video.playbackRate = lastSpeed;
        console.log(`Reapplied speed (${lastSpeed}x) after navigation`);
      }
    }, 1); // delay: Small delay to ensure video is ready
  });
}

function addVideoTopBar(video) {
  if (video.dataset.vfUserscriptBar) return;
  if (video.previousElementSibling !== null && video.previousElementSibling.classList.contains("userscript-video-top-bar")) return;
  if (video.parentElement === document.body && [...video.parentElement.children].filter(node => node.nodeName && node.nodeName.toLowerCase() === "video").length === 1) return; // don't inject auto-generated video sites ???
  ensureCSSInjected()

  const videoUUID = get_uuid()
  barAborts[videoUUID] = new AbortController()
  const rateButtons = {} // so they're bound to the current bar
  const pe = video.parentElement
  // don't inject to shorts hover previews (might not work)
  if (pe.parentElement && pe.parentElement.classList.contains("ytp-inline-preview-mode") && pe.parentElement.classList.contains("ytp-tiny-mode")) return;

  // setting mode to "open" for now, not sure how well would the abortcontrollers or shadowHost hoverinv toggling work without it
  // if it causes, trouble, we can set it to closed later
  const shadowHost = document.createElement('div')
  const shadow = shadowHost.attachShadow({ mode: "open" });
  shadowHost.classList.add("userscript-video-shadow-host")

  const topBar = document.createElement('div');
  topBar.classList.add('userscript-video-top-bar')

  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(vfCSS)
  shadow.adoptedStyleSheets.push(styleSheet);

  const shouldBePinned = GM_getValue("pinned", false)
  if (!shouldBePinned) shadowHost.classList.add("userscript-hoverinv");

  const leftdiv = Object.assign(document.createElement("div"), { classList: "userscript-bar-wrap" })
  const centerdiv = Object.assign(document.createElement("div"), { classList: "userscript-bar-wrap" })
  const rightdiv = Object.assign(document.createElement("div"), { classList: "userscript-bar-wrap", style: "justify-content: end" })


  for (const r of rates) {
    const btn = document.createElement("button")
    btn.textContent = `${r}x`
    btn.classList = "userscript-simple-btn"
    btn.dataset.rate = r
    btn.onclick = (e) => playbackRate(Number(r), e, video)
    rateButtons[String(r)] = btn
    leftdiv.appendChild(btn)
  }

  centerdiv.appendChild(Object.assign(document.createElement("button"),
		{...btnDefaults, textContent: "<<", onclick: (e) => rw(video, e), title:`rewind ${jumpVal}s` }
	));
  centerdiv.appendChild(Object.assign(document.createElement("button"),
		{...btnDefaults, textContent: "⏯", onclick: (e) => pp(video, e), title:`play/pause` }
	));
  centerdiv.appendChild(Object.assign(document.createElement("button"),
		{...btnDefaults, textContent: ">>", onclick: (e) => ff(video, e), title:`forward ${jumpVal}s` }
	));

  const fallbackRateDisplay = Object.assign(document.createElement("span"), {
    classList: "userscript-speed-display userscript-simple-btn",
    textContent: `${video.playbackRate}x`,
    style: "opacity: 0"
  })
  // console.log(barAborts[videoUUID], barAborts[videoUUID].signal, videoUUID)

  video.addEventListener("ratechange", (e) => {
    const _rate = video?.playbackRate ?? e?.target?.playbackRate ?? 1; // current rate

    fallbackRateDisplay.textContent = `${_rate}x`
    shadow.querySelectorAll(".userscript-hl-rate").forEach(el => el.classList.remove("userscript-hl-rate"))

    if (rates.includes(_rate)) {
      fallbackRateDisplay.style.opacity = 0
      rateButtons[String(_rate)].classList.add("userscript-hl-rate")
      console.log("ratechange", _rate, rateButtons[String(_rate)], rateButtons[String(_rate)].classList.toString())
    } else {
      fallbackRateDisplay.style.opacity = 1
    }
  }, { signal: barAborts[videoUUID].signal })

  rightdiv.appendChild(fallbackRateDisplay)

  rightdiv.appendChild(checkBox("💾🐇", "rememberSpeed", "remember video speed across sites."))
  rightdiv.appendChild(Object.assign(document.createElement("button"), {
    ...btnDefaults,
    onclick: function(e) {
      cancelEvent(e);
      shadowHost.classList.toggle("userscript-hoverinv");
      const isPinned = !shadowHost.classList.contains("userscript-hoverinv")
      this.textContent = isPinned ? "📍" : "📌"
      this.title = isPinned ? "unpin" : "pin"
      GM_setValue("pinned", isPinned)
    },
    textContent: shouldBePinned ? "📍": "📌",
    title: shouldBePinned ? "unpin" : "pin",
    style: "postition: relative;"
  }))

  topBar.appendChild(leftdiv)
  topBar.appendChild(centerdiv)
  topBar.appendChild(rightdiv)

  video.dataset.vfUserscriptBar = videoUUID
  // topBar.dataset.vfUserscriptFor = videoUUID
  shadowHost.id = `vf-userscript-bar-${videoUUID}`

  // small video, yeet paddings
  if (video.clientWidth < 540) {
    topBar.style.paddingLeft = "4px";
    topBar.style.paddingRight = "4px";
    topBar.querySelectorAll(".userscript-bar-wrap").forEach(wrapper => { Object.assign(wrapper.style, { paddingLeft: 0, paddingRight: 0 })})
    topBar.style.columnGap = "8px"
  }

	// decide where to insert the video bar & insert it
  shadow.appendChild(topBar)
  if ([...pe.children].filter(node => node.nodeName && node.nodeName.toLowerCase() === "video").length > 1) { // wrapper-less videos
    shadowHost.style.position = "relative"
    video.addEventListener("resize", () => {
      shadowHost.style.width = `${video.clientWidth}px`;
    }, { signal: barAborts[videoUUID].signal })
    shadowHost.style.width = `${video.clientWidth}px`;
    pe.insertBefore(shadowHost, video);
  } else { // yt / yt embeds
    if (pe.classList.contains("html5-video-container") && (
      (pe?.parentElement?.classList?.contains("ytp-embed") ?? false) ||
      (Array.from(pe?.parentElement?.classList) ?? []).some(cl => cl.startsWith("ytp-"))
    )) {
      pe.parentElement.insertBefore(shadowHost, pe);
    } else { // rest
      if (pe.style.position !== 'relative') pe.style.position = 'relative'
      pe.insertBefore(shadowHost, video);
    }
  }

  const { lastSpeed, restoreSpeed } = get_restoreSpeed(video)
  // console.log(lastSpeed, restoreSpeed)

  if (GM_getValue("rememberSpeed", false) && lastSpeed) {
    if (!!video.paused) {
      video.addEventListener("play",
				() => {
					if (GM_getValue("rememberSpeed", false) === false) return;

					const { restoreSpeed } = get_restoreSpeed(video)
					setTimeout(restoreSpeed, 1) // hopefully run after any external code
				},
				{ once: true, signal: barAborts[videoUUID].signal }
			)

      video.addEventListener("loadeddata",
				() => {
					if (GM_getValue("rememberSpeed", false) === false) return;

					const { lastSpeed, restoreSpeed } = get_restoreSpeed(video)
					setTimeout(() => { if (video.playbackRate !== Number(lastSpeed)) restoreSpeed() }, 1)
				},
				{ once: true, signal: barAborts[videoUUID].signal }
			)
    } else {
      restoreSpeed()
    }
  }

  setupYouTubeNavigationListener(video);

  // site specific fixes
  if (window.location.origin === 'https://www.prageru.com') { video.style.height = 'unset' }
  console.log(`injected bar for newly added video, id: ${video.dataset.vfUserscriptBar}`)
}

// use a mutationObserver to auto-inject bars for any new videos
let observer = null;
if (observer === null) {
  observer = new MutationObserver(MOCallback)
  observer.observe(document.body, { childList: true, subtree: true });
} else {
  console.log("observer is already defined:", observer, "restarting it...")
  observer.disconnect() // script has re-ran, but the observer is defined. restart observer to be safe
  observer.observe(document.body, { childList: true, subtree: true })
}

function MOCallback(mutationsList, observer) {
  for(const mutation of mutationsList) {
    if (mutation.type !== 'childList') continue;
    mutation.addedNodes.forEach(node => {
      if (node.tagName && node.tagName.toLowerCase() === 'video') addVideoTopBar(node);
    });
    mutation.removedNodes.forEach(node => {
      if (!node.tagName || node.tagName.toLowerCase() !== "video") return;
      const uuid = node.dataset.vfUserscriptBar
      if (!uuid) return;
      try {
        document.getElementById(`vf-userscript-bar-${uuid}`).remove();
        barAborts[uuid].abort();
      } catch (e) {
        console.warn(`couldn't remove bar id: ${uuid}, was likely removed by site`);
      }
      if (uuid in barAborts) delete barAborts[uuid];
    })
  }
};

GM_registerMenuCommand('force add bars to all videos', () => document.querySelectorAll("video").forEach(addVideoTopBar));
document.querySelectorAll("video").forEach(addVideoTopBar)
