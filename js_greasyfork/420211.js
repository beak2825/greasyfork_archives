// ==UserScript==
// @name        Twitch Pitch Change Fix
// @description Disables auto playback rate change to avoid sound pitch shifts.
// @version     1.0
// @author      beypazarigurusu
// @license     MIT
// @match       https://*.twitch.tv/*
// @grant       none
// @icon        https://www.google.com/s2/favicons?domain=twitch.tv
// @namespace https://greasyfork.org/users/727473
// @downloadURL https://update.greasyfork.org/scripts/420211/Twitch%20Pitch%20Change%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/420211/Twitch%20Pitch%20Change%20Fix.meta.js
// ==/UserScript==

const PLAYBACK_SPEED = 1 // Try slowing down to debug

const TAG = '[Twitch Pitch Fix]'
const DATA_ATTRIBUTE = 'data-pitchfix-attached'
const FOUND_IDENTIFIER = 'data-pitchfix-found'

const INDICATOR_NEXT_NEIGHBOR_SELECTOR = 'p[data-a-target="animated-channel-viewers-count"]'

let renderLatencyIndicatorCalled = false
let latencyIndicatorRendered = false
let latencyIndicatorInterval = null

function waitForKeyElements(identifier, selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
  if (typeof waitOnce === "undefined") {
    waitOnce = true
  }
  if (typeof interval === "undefined") {
    interval = 300
  }
  if (typeof maxIntervals === "undefined") {
    maxIntervals = -1
  }
  const targetNodes = (typeof selectorOrFunction === "function") ?
    selectorOrFunction() :
    document.querySelectorAll(selectorOrFunction)

  const targetsFound = targetNodes && targetNodes.length > 0
  if (targetsFound) {
    targetNodes.forEach(function (targetNode) {
      const alreadyFound = targetNode.getAttribute(identifier) || false
      if (!alreadyFound) {
        const cancelFound = callback(targetNode)
        if (cancelFound) {
          targetsFound = false
        }
        else {
          targetNode.setAttribute(identifier, true)
        }
      }
    })
  }

  if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
    maxIntervals -= 1
    setTimeout(function () {
      waitForKeyElements(identifier, selectorOrFunction, callback, waitOnce, interval, maxIntervals)
    }, interval)
  }
}

function debounce(func, wait, immediate) {
  let timeout
  return function () {
    const context = this
    const args = arguments
    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

function init() {
  if (!document.URL.includes('twitch.tv/directory') && !document.URL.includes('/video')) {
    const videos = document.getElementsByTagName('VIDEO')
    if (videos.length > 0) {
      run(videos[0])
    }
    else {
      waitForKeyElements(FOUND_IDENTIFIER, 'video[src]', run, true)
    }
  }
}

function run() {
  const playerContainerEl = document.querySelector('.video-player')
  const found = search(playerContainerEl)
  const instances = Array.from(found.instances)
  if (instances.length > 0) {
    for (const inst of instances) {
      if (inst.props && inst.props && inst.props.mediaPlayerInstance) {
        const player = inst.props.mediaPlayerInstance
        // player.setLiveSpeedUpRate(1) // Not working anymore
        const el = player.getHTMLVideoElement()
        attach(el)
        if (player.getLiveLatency && !renderLatencyIndicatorCalled) {
          renderLatencyIndicatorCalled = true
          renderLatencyIndicator(player)
        }
      }
    }
  }
}

function renderLatencyIndicator(playerInst) {
  if (latencyIndicatorRendered) {
    return
  }
  const getLatency = () => playerInst.getLiveLatency().toFixed(2)
  waitForKeyElements('LIVE_TIME', INDICATOR_NEXT_NEIGHBOR_SELECTOR, (nextNeighborEl) => {
    latencyIndicatorRendered = true
    const indicatorEl = nextNeighborEl.cloneNode(false)
    indicatorEl.onclick = () => {
      playerInst.pause()
      playerInst.play()
    }
    indicatorEl.className = 'tw-strong latency-indicator'
    indicatorEl.title = 'Latency'
    const indicatorTextEl = document.createElement('span')
    indicatorTextEl.innerText = `Latency: ${getLatency()}s`
    indicatorEl.appendChild(indicatorTextEl)
    latencyIndicatorInterval = setInterval(() => {
      let latency = getLatency()
      indicatorTextEl.innerText = `Latency: ${getLatency()}s`
      if (latency > 5) {
        indicatorEl.classList.add("high-latency")
      }
      else {
        indicatorEl.classList.remove("high-latency")
      }
    }, 1000 * 3)
    const container = nextNeighborEl.parentNode
    container.insertBefore(indicatorEl, container.firstChild)
  }, true)
}

function attach(videoEl) {
  if (videoEl.getAttribute(DATA_ATTRIBUTE)) {
    return
  }
  console.debug(TAG, 'Attaching:', videoEl)
  videoEl.setAttribute(DATA_ATTRIBUTE, true)
  try {
    overrideSetPlaybackRate(videoEl)
    videoEl.onplaying = videoEl.onloadedmetadata = debounce(() => {
      overrideSetPlaybackRate(videoEl)
    }, 1000)
  }
  catch (e) {}
}

function overrideSetPlaybackRate(videoEl) {
  delete videoEl.playbackRate
  videoEl.playbackRate = PLAYBACK_SPEED
  Object.defineProperty(videoEl, 'playbackRate', {
    configurable: true,
    get: function () {
      return 1
    },
    set: function (val) {
      console.debug(TAG, 'Ignored setPlaybackRate request from Twitch:', val)
    }
  })
}

function findAccessor(element) {
  return Object.keys(element)
    .find(key => key.startsWith('__reactInternalInstance$'))
}

function getReactInstance(el) {
  const accessor = findAccessor(el)
  if (!accessor) {
    return
  }
  return el[accessor] ||
    (el._reactRootContainer && el._reactRootContainer._internalRoot && el._reactRootContainer._internalRoot.current) ||
    (el._reactRootContainer && el._reactRootContainer.current)
}

function search(node, depth = 0, data, traverseRoots = true) {
  if (!node) {
    node = null
  }
  else if (node._reactInternalFiber) {
    node = node._reactInternalFiber
  }
  else if (node instanceof Node) {
    node = getReactInstance(node)
  }

  const maxDepth = 1000
  const filterFn = c => c.props?.playerEvents && c.props?.mediaPlayerInstance

  if (!data) {
    data = {
      seen: new Set(),
      class: null,
      out: {
        cls: null,
        instances: new Set(),
        depth: null
      },
      maxDepth: depth
    }
  }

  if (!node || depth > maxDepth) {
    return data.out
  }

  if (depth > data.maxDepth) {
    data.maxDepth = depth
  }

  const inst = node.stateNode
  if (inst) {
    const cls = inst.constructor

    if (!data.seen.has(cls)) {
      if (filterFn(inst)) {
        data.class = data.out.cls = cls
        data.out.instances.add(inst)
        data.out.depth = depth
      }
      data.seen.add(cls)
    }
  }

  let child = node.child
  while (child) {
    search(child, depth + 1, data, traverseRoots)
    child = child.sibling
  }

  if (traverseRoots && inst && inst.props && inst.props.root) {
    const root = inst.props.root._reactRootContainer
    if (root) {
      let child = root._internalRoot && root._internalRoot.current || root.current
      while (child) {
        search(child, depth + 1, data, traverseRoots)
        child = child.sibling
      }
    }
  }

  return data.out
}

(function addStyle() {
  const style = `
    .latency-indicator {
      margin-right: 10px;
      color: var(--color-text-base);
      padding: 5px 8px 5px 8px;
      background: var(--color-background-button-secondary-default);
      border-radius: 5px;
      cursor: pointer;
    }
    .latency-indicator:hover {
      background: #9147ff;
      color: var(--color-text-button);
    }
    .latency-indicator:hover span {
      display: none;
    }
    .latency-indicator:hover:before {
      content: 'Reset Player';
    }
    .high-latency {
      color: var(--color-text-live);
    }
  `
  const styleSheet = document.createElement('style')
  styleSheet.innerText = style
  document.head.appendChild(styleSheet)
}())

const ogPushState = history.pushState
history.pushState = function() {
  ogPushState.apply(history, arguments)
  clearInterval(latencyIndicatorInterval)
  init()
}

const ogReplaceState = history.replaceState
history.replaceState = function() {
  ogReplaceState.apply(history, arguments)
  clearInterval(latencyIndicatorInterval)
  init()
}

window.addEventListener('popstate', function() {
  clearInterval(latencyIndicatorInterval)
  init()
})

init()
