// ==UserScript==
// @name         EdHaxx
// @namespace    evanb
// @version      0.8.3
// @description  Speed up, allow skipping, and stop auto-pausing on EdPuzzle.com.
// @author       Evan
// @license      GPL-3.0-only
// @include      *edpuzzle.com/lti/*
// @include      *edpuzzle.com/assignments/*
// @include      *edpuzzle.com/media/*
// @include      *youtube.com/embed*
// @include      *youtube-nocookie.com/embed*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/452200/EdHaxx.user.js
// @updateURL https://update.greasyfork.org/scripts/452200/EdHaxx.meta.js
// ==/UserScript==

function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

// Youtube.com listener
// We do it this way to avoid iframe cors
// This solution is really hacky, but for some reason edpuzzle doesn't change the playback speed back in this case.
if (window != window.top && ["youtube.com/embed/", "youtube-nocookie.com/embed/", "origin=https://edpuzzle.com"].some(v => window.location.href.indexOf(v) >= 0)) {
  window.addEventListener("click", function() {
    document.getElementsByTagName("video")[0].playbackRate = GM_getValue("speed", 1);
  });
  GM_addValueChangeListener("speed", () => {
    document.getElementById("movie_player").click()
    setTimeout(() => document.getElementById("movie_player").click(), 100)
  })
}

// Anti Auto-Pause
window.addEventListener("load", function() {
  const propArr = ["hidden", "mozHidden", "msHidden", "webkitHidden"].forEach(elm =>
    Object.defineProperty(document, elm, function() {
      value: false
    })
  )
});

function ui() {
  const EdHaxx = document.createElement('div')

  const edHaxxTitle = document.createElement('h3')
  edHaxxTitle.textContent = "EdHaxx"

  const edHaxxVersion = document.createElement("sup")
  edHaxxVersion.innerHTML = ` <abbr title="v${GM_info.script.version}">&#945;</abbr>`

  edHaxxTitle.append(edHaxxVersion)
  EdHaxx.append(edHaxxTitle)

  const speedChooserLabel = document.createElement("label")
  speedChooserLabel.for = "iamspeed"
  speedChooserLabel.textContent = "Player Speed"
  EdHaxx.append(speedChooserLabel)

  const speedChooser = document.createElement("input")
  speedChooser.type = "number"
  speedChooser.placeholder = "1"
  speedChooser.value = GM_getValue("speed",1)
  speedChooser.step = 0.25
  speedChooser.max = 16
  speedChooser.min = 0
  speedChooser.name = "iamspeed"
  speedChooser.onchange = () => {
    document.querySelector('iframe').contentWindow.postMessage(JSON.stringify({
      event: 'command',
      func: 'setPlaybackRate',
      args: [Number(speedChooser.value), true]
    }), '*')

    GM_setValue("speed", Number(speedChooser.value))
  }
  EdHaxx.append(speedChooser)

  const skipLabel = document.createElement("label")
  skipLabel.for = "imbored"
  skipLabel.textContent = "Allow Skipping"
  EdHaxx.append(skipLabel)

  const skipChooser = document.createElement("input")
  skipChooser.type = "checkbox"
  skipChooser.checked = GM_getValue("skip",true)
  skipChooser.name = "imbored"
  skipChooser.onchange = () => {
    GM_setValue("skip", skipChooser.checked)
    location.reload()
  }
  EdHaxx.append(skipChooser)

  document.body.append(EdHaxx)
}

function modifyRes(responseText) {
  if (GM_getValue("skip",true)) {
    return responseText.replace(`"allowSkipAhead":false`, `"allowSkipAhead":true`);
  } else {
    return responseText
  }
}

// Make it look like API says the instructor allows skipping
// Todo: Can this be simplified?
// Via: https://stackoverflow.com/a/28513219
function responseTextHook() {
  // firefox, ie8+
  var accessor = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText');

  Object.defineProperty(XMLHttpRequest.prototype, 'responseText', {
    get: function() {
      return modifyRes(accessor.get.call(this))
    },
    set: function(str) {
      return accessor.set.call(this, str);
    },
    configurable: true
  });

  // chrome, safari (accessor == null)
  var rawOpen = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function() {
    if (!this._hooked) {
      this._hooked = true;
      setupHook(this);
    }
    rawOpen.apply(this, arguments);
  }

  function setupHook(xhr) {
    function getter() {
      delete xhr.responseText;
      var ret = modifyRes(accessor.get.call(this));
      setup();
      return ret;
    }

    function setter(str) {
      console.log('set responseText: %s', str);
    }

    function setup() {
      Object.defineProperty(xhr, 'responseText', {
        get: getter,
        set: setter,
        configurable: true
      });
    }
    setup();
  }
}

if (window.location.hostname === "edpuzzle.com") {
  window.addEventListener("load", function() {
    waitForElm('main>div>div>div>div').then(ui)
  });
  responseTextHook()
}