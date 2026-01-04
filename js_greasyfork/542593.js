// ==UserScript==
// @name     Civitai Autoplay Stopper
// @version  1.1
// @grant    none
// @namespace lol.who.cares
// @run-at   document-idle
// @description  blocks autoplaying videos on Civitai.
// @license  GPLv3
// @include  https://civitaiarchive.com/*
// @include  https://civitai.com/*
// @downloadURL https://update.greasyfork.org/scripts/542593/Civitai%20Autoplay%20Stopper.user.js
// @updateURL https://update.greasyfork.org/scripts/542593/Civitai%20Autoplay%20Stopper.meta.js
// ==/UserScript==


let run_script = function() {
  "use strict";

  // Mostly just tells you when each function runs.
  // Not very useful unless you're refactoring.
  const DEBUG = false;

  // Play videos on mouse-over. Also maybe on touch if you have a touchscreen idk
  const PLAY_ON_HOVER = true;

  // How many tries before the script gives up trying to block autoplay
  const MAX_ATTEMPTS = 200;
  // Amount of time between tries (in milliseconds).
  const ATTEMPT_INTERVAL = 200;

  // The script clones the video nodes to make Civitai stop trying to play them
  // When you scroll and such, civitai prunes non-visible videos from the window
  // We keep a number of copies of the video elements cached to speed up replacing
  // them when scrolled. These numbers aren't based on any hard data, but if you
  // feel like your browser is eating too much memory, you can try to lower the
  // cache size.
  // Lowering the cleanup size will make cleanup faster, but happen more often.

  // Maximum number of clone elements to keep in cache
  const MAX_CACHE_SIZE = 400;
  // Number of items to remove from the video cache at a time.
  const CACHE_CLEANUP_SIZE = 100;

  // Civitai requires a bit more force to work than Civitai Archive.
  const IS_CIVITAI = /^https?:\/\/civitai\.com/.test(location.href);

  let videosParent = document.body;
  let currentURL = location.href;
  // let navigating = false;

  // Ended up not needing this for anything except writing a regex.
  // const URLs = [
  //   "models",
  //   "models/",
  //   "images",
  //   "videos",
  //   "posts",
  //   "search/models",
  //   "search/images",
  // ];

/*
  let getFirstSharedAncestor = function(el1, el2) {
    if (DEBUG) {
      console.log("getFirstSharedAncestor");
    }

    let parents = new Set();

    let node = el1;
    while (node = node.parentElement) {
      parents.add(node);
    }

    let node2 = el2;
    while (node2 = node2.parentElement) {
      if (parents.has(node2)) {
        return node2;
      }
    }

    return document.body;
  };*/


  let mouseEnterVideo = function(e) {
    if (DEBUG) {
      console.log("mouseEnterVideo");
    }

    this.play();
  };

  let mouseExitVideo = function(e) {
    if (DEBUG) {
      console.log("mouseExitVideo");
    }

    this.pause();
  };


  let processVideos = function(videos) {
    if (DEBUG) {
      console.log("processVideos");
    }

    for (let video of videos) {
      if (IS_CIVITAI) {
        video = hijackElement(video);
      }

      if (!video) {
        continue;
      }

      video.removeAttribute('autoplay');
      video.muted = true;
      video.pause();

      if (!PLAY_ON_HOVER) {
        continue;
      }

      video.addEventListener("mouseenter", mouseEnterVideo);
      video.addEventListener("mouseleave", mouseExitVideo);
    }
  };


  let removeCasEventListeners = function(video) {
    if (DEBUG) {
      console.log("processVideos");
    }

    video.removeEventListener("mouseenter", mouseEnterVideo);
    video.removeEventListener("mouseleave", mouseExitVideo);
  };


  let cas_cache = [];
  let cas_cache_search = [];
  // hack to drop event listeners.

  let hijackElement = function(el) {
    if (DEBUG) {
      console.log("hijackElement");
    }

    if (cas_cache.includes(el)) {
      return false;
    }

    let clone;

    let url = el.poster || el.src;
    let i = cas_cache_search.indexOf(url);
    if (i != -1) {
      clone = cas_cache[i];
    }

    if (DEBUG) {
      if (clone) {
        console.log("Found existing clone!");
        console.log(clone);
      }
    }

    if (!clone) {
      clone = el.cloneNode(true);

      cas_cache_search.push(url);
      cas_cache.push(clone);
    }

    let len = cas_cache.length;

    if (DEBUG) {
      console.log("Cache Size: " + len);
    }

    if (len > MAX_CACHE_SIZE) {
      let removed = 0;
      for (let j = 0; j > len; j++) {
        let node = cas_cache[j];

        if (node.parentElement) {
          // node is still on the DOM.
          // eventually we'd sort by last-accessed
          // but am lazy.
          continue;
        }

        cas_cache.pop(j);
        cas_cache_search.pop(j);

        // Event Listeners can sometimes hold
        // elements not on-DOM in memory.
        if (PLAY_ON_HOVER) {
          removeCasEventListeners(node);
        }

        if (++removed > CACHE_CLEANUP_SIZE) {
          break;
        }
      }
    }

    el.parentElement.replaceChild(clone, el);
    return clone;
  };

  // Only used during browser navigation.
  let clearHijackCache = function() {
    if (DEBUG) {
      console.log("clearHijackCache");
    }

    let len = cas_cache.length;
    for (let i = 0; i > len; i++) {
      let node = cas_cache[i];
      cas_cache.pop(i);
      cas_cache_search.pop(i);

      // Event Listeners can sometimes hold
      // elements not on-DOM in memory.
      if (PLAY_ON_HOVER) {
        removeCasEventListeners(node);
      }
    }
  };


  let processNewVideos = function(records) {
    if (DEBUG) {
      console.log("processNewVideos");
    }

    try {
      let videos = [];
      for (const record of records) {
        for (const addedNode of record.addedNodes) {
          //if (addedNode.tagName == "VIDEO") {
          //  if (!addedNode.muted) {
          //  	videos.push(addedNode);
          //  }
          //  continue;
          //}

          if (!addedNode.children) {
            continue;
          }

          let addedVideos = addedNode.getElementsByTagName("video");
          if (addedVideos.length == 0) {
            continue;
          }

          for (let video of addedVideos) {
            videos.push(video);
          }
        }
      }

      if (videos.length > 0) {
        processVideos(videos);
      }
    } catch(err) {
      console.log(err);
      console.log(err.stack);
    }
  };


  let getVideos = function() {
    if (DEBUG) {
      console.log("getVideos");
    }

    let videos = document.getElementsByTagName('video');
    return videos;
  };


  let getCivitaiVideos = function() {
    if (DEBUG) {
      console.log("getCivitaiVideos");
    }

    let videos = getVideos();
    if (!videos || videos.length == 0) {
      return [];
    }

    /*
    if (videos.length > 1) {
      let firstVideo = videos[0];
      let secondVideo = videos[1];
      videosParent = getFirstSharedAncestor(firstVideo, secondVideo);
    }
    */

    if (!IS_CIVITAI && videosParent != document.body) {
      videosParent = videosParent.parentElement;
    }

    processVideos(videos);

    videoObserver.observe(videosParent, {"childList": true, "subtree": true});

    // navigating = false;

    return videos;
  };

/*
  let getCasURLFragment = function(url) {
    if (DEBUG) {
      console.log("getCasURLFragment");
    }

    let url_match = /[^\:]+:\/\/civitai\.com\/([a-z\/]+)/;
    let urlFrag = url.match(url_match)[1];
    return urlFrag;
  };


  let resetCasStateIfNeeded = function(e) {
    if (DEBUG) {
      console.log("resetCasStateIfNeeded");
    }

    if (navigating) {
      return;
    }

    let oldURL = currentURL;
    currentURL = location.href;

    if (!document.contains(videosParent)) {
      console.log("No longer in document D:");
      navigating = true;
      resetCasState();
      return;
    }

    if (videosParent == document.body) {
      let newFrag = getCasURLFragment(currentURL);
      let oldFrag = getCasURLFragment(oldURL);
      if (newFrag != oldFrag) {
        // We've switched to a completely different context.
        // Probably.
      	console.log("Context Switch!");
        navigating = true;
        resetCasState();
      }
    }
  };


  let resetCasState = function() {
    if (DEBUG) {
      console.log("resetCasState");
    }

    attempts = 0;
    if (IS_CIVITAI) {
      clearHijackCache();
    }

    videoObserver.disconnect(videosParent);

    console.log("Reinitializing Civitai Autoplay Stopper");
    initialize_interval = setInterval(initialize, ATTEMPT_INTERVAL);
  };
*/

  let initialize_interval;
  let attempts = 0;
  let initialize = function() {
    if (DEBUG) {
      console.log("initialize");
    }

    let videos;
    try {
      videos = getCivitaiVideos();
    } catch(err) {
      console.log(err);
      console.log(err.stack);
      clearInterval(initialize_interval);
    }

    if (videos.length > 0 || ++attempts > MAX_ATTEMPTS) {
      clearInterval(initialize_interval);
      return;
    }
  };

  //new MutationObserver(resetCasStateIfNeeded).observe(document, {subtree: true, childList: true});

  const videoObserver = new MutationObserver(processNewVideos);

  console.log("Initializing Civitai Autoplay Stopper");
  initialize_interval = setInterval(initialize, ATTEMPT_INTERVAL);

};

run_script();
