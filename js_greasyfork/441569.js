// ==UserScript==
// @name        Youtube Utils (shorts => regular view)
// @namespace   Violentmonkey Scripts
// @include     https://*.youtube.*
// @include     https://tube.cadence.moe*
// @version     2.3
// @author      KraXen72
// @grant       GM_registerMenuCommand
// @icon        https://cdn.discordapp.com/attachments/704792091955429426/1060287664668037195/yt_favicon.png
// @description Youtube utilities. also includes others' usercripts (check code)
// @downloadURL https://update.greasyfork.org/scripts/441569/Youtube%20Utils%20%28shorts%20%3D%3E%20regular%20view%29.user.js
// @updateURL https://update.greasyfork.org/scripts/441569/Youtube%20Utils%20%28shorts%20%3D%3E%20regular%20view%29.meta.js
// ==/UserScript==

const autoFixShorts = true

function shortsRegularView() {
  url = window.location.href
  parts = url.split("/")
    .filter(part => part !== "")
  shortsIndex = parts.indexOf("shorts")
  idIndex = shortsIndex + 1

  newurl = `https://youtube.com/watch?v=${parts[idIndex]}`
  window.location.href = newurl

  console.log("href:", parts)

}

function clipList() {
  console.log("clip grabber init")

  const itemHolder = document.querySelector("#items.style-scope.ytd-grid-renderer")
  const items = [...itemHolder.children].map(item => {
    return item.querySelector("ytd-thumbnail a#thumbnail").href
  })
  console.log(items)
  alert(`The links are:

  ${items.join("\n")}`)
}

function playbackRate(rate) {
  document.querySelector('video.html5-main-video, video.video#video').playbackRate = rate
}

function cadenceMoeLink() {
  const videoid = [...new URLSearchParams(window.location.href).values()][0]
  window.open(`https://tube.cadence.moe/watch?v=${videoid}`, '_blank')
}


// this is from q1k's script "YouTube - Stay Active and Play Forever". full credits to them.
// source: https://greasyfork.org/en/scripts/390352-youtube-stay-active-and-play-forever
// i just embedded it here so i don't have to have so many usercripts for youtube
Object.defineProperties(document, { 'hidden': {value: false}, 'webkitHidden': {value: false}, 'visibilityState': {value: 'visible'}, 'webkitVisibilityState': {value: 'visible'} });
setInterval(function(){
    document.dispatchEvent( new KeyboardEvent( 'keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 } ) );
}, 60000);


// register menu commands
GM_registerMenuCommand("shorts => regular view", shortsRegularView)
GM_registerMenuCommand("yt => cadence.moe", cadenceMoeLink)
// GM_registerMenuCommand("2x speed", () => { playbackRate(2) })
// GM_registerMenuCommand("2.5x speed", () => { playbackRate(2.5) })
// GM_registerMenuCommand("3x speed", () => { playbackRate(3) })
// GM_registerMenuCommand("3.5x speed", () => { playbackRate(3.5) })


// FIXME fix this hook, it does not redirect
// locationchange hook
;(function() {
    var pushState = history.pushState;
    var replaceState = history.replaceState;

    history.pushState = function() {
        pushState.apply(history, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
    };

    history.replaceState = function() {
        replaceState.apply(history, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
    };

    window.addEventListener('popstate', function() {
        window.dispatchEvent(new Event('locationchange'))
    });
})();


function afterUrlChanges() {
  if (window.location.href.includes("feed/clips")) GM_registerMenuCommand("grab clip list", clipList)
  if (window.location.href.includes("shorts") && autoFixShorts) shortsRegularView();
}

document.addEventListener("locationchange", afterUrlChanges)
afterUrlChanges()

