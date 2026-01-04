// ==UserScript==
// @name        Youtube video anti-spoiler
// @description De-spoil videos by hiding the video length and the current playback status.
// @namespace   Violentmonkey Scripts
// @require     https://code.jquery.com/jquery-3.6.0.slim.min.js
// @match       https://www.youtube.com/*
// @run-at      document-idle
// @grant       GM_addStyle
// @version     2.2
// @author      Rs
// @description 5/10/2021, 7:18:13 PM
// @downloadURL https://update.greasyfork.org/scripts/427427/Youtube%20video%20anti-spoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/427427/Youtube%20video%20anti-spoiler.meta.js
// ==/UserScript==

// ---------------------------------------
// Settings
// ---------------------------------------

const spoilerFreeChannels = [
  // Part of the name of the channel (aka the code uses .contains instead of an exact match)
  // used for:
  //   1) the name as how it is presented on the page
  //   2) the name is it is in the url, for example @afreecatvesports432
  'AfreecaTV',
  'Artosis',
  'TastelessTV',
].map(channel => channel.toLowerCase());

// ---------------------------------------
// Css styles
// ---------------------------------------

const _spoilered = 'spoilered'
const addSpoilerClass = el => {
  console.log("apply class to", el)
  el.classList.add(_spoilered);
}
const removeSpoilerClasses = () => {
  const spoilered = $(`.${_spoilered}`);
  spoilered.removeClass(_spoilered);
}

const hideSeekbarStyles = () => {
  GM_addStyle(`
.${_spoilered} .ytp-tooltip-text-wrapper {
  display: none;
}

.${_spoilered} .ytp-play-progress,
.${_spoilered} .ytp-load-progress,
.${_spoilered} .ytp-scrubber-container {
  display: none;
}

.${_spoilered} .ytp-time-display {
  display: none;
}
.${_spoilered} ytd-thumbnail-overlay-time-status-renderer {
  display: none;
}
.${_spoilered} ytd-thumbnail-overlay-resume-playback-renderer {
  display: none;
}

.video-length {
  display: none;
}

  `)
};

const hideVideoPreviewStyles = () => {
  GM_addStyle(`
.${_spoilered} ytd-thumbnail-overlay-time-status-renderer,
.${_spoilered} .ytd-thumbnail-overlay-resume-playback-renderer {
  display: none;
}
  `)
};

// ---------------------------------------
// Helper Functions
// ---------------------------------------

const brokenScriptWarning = err => {
  console.error(`UserScript failed to load: ${err}`)
}

const retry = (f, onMaxAttempt, maxAttempts, delay) => {
  var subscription = undefined;

  const retry_ = (f, onMaxAttempt, maxAttempts, attempt) => {
    try { f(); }
    catch (err) {
      console.log("[antispoiler]", err, attempt, maxAttempts);

      if (attempt > maxAttempts) {
        onMaxAttempt(err);
        subscription = undefined;
      } else {
        subscription = setTimeout(() => retry_(f, onMaxAttempt, maxAttempts, attempt + 1), delay ?? 300);
      }
    }
  }

  retry_(f, onMaxAttempt, maxAttempts, 0);

  return () => {
    if (subscription != undefined) {
      clearTimeout(subscription);
    }
  }
}
const retryDefault = f => retry(f, brokenScriptWarning, 15);

const createChildListMutationObserver = targetElement => fn => {
  const observer = new MutationObserver(mutations => {
    fn(mutations.flatMap(mutation => Array.from(mutation.addedNodes)));
  });

  observer.observe(targetElement, {
    childList: true,
    subtree: false,
    characterDataOldValue: false
  });

  console.log('initial', targetElement.children)
  fn(Array.from(targetElement.children))

  return () => {
    observer.disconnect()
  };
}

const observeChildListNodesAdded = targetElement => fn => {
  if (targetElement === undefined) {
    throw 'Unable to register mutationObserver';
  }
  return createChildListMutationObserver(targetElement)(fn);
}

// ---------------------------------------
// Root
// ---------------------------------------

const containsSpoilerChannelName = (name, nameUndefinedFallback) => {
  if (name == undefined || name === "") {
    return nameUndefinedFallback ?? true;
  }

  const result = spoilerFreeChannels.find(channel => name.toLowerCase().indexOf(channel) != -1);
  return result != undefined
}

const videoTags = new Set(["YTD-GRID-VIDEO-RENDERER", "YTD-COMPACT-VIDEO-RENDERER", "YTD-VIDEO-RENDERER"]);
const isVideoTag = tag => videoTags.has(tag);
const findVideos = el =>
  Array.from(videoTags).flatMap(tag => $(el).find(tag).toArray());


const observeOnPageNavigated = onPageNavigated => {
  var currentHref = document.location.href;
  var subscriptions = onPageNavigated(document.location);

  retry(
    () => {
      var navigationProgressBar = document.getElementsByTagName("yt-page-navigation-progress")[0]

      if (navigationProgressBar === undefined) {
        throw 'Waiting for yt-page-navigation-progress';
      }

      const ATTRIBUTE_LOADPERCENTAGE = "aria-valuenow"

      new MutationObserver(mutations => {
        const loadPercentage = mutations[mutations.length - 1].target.attributes[ATTRIBUTE_LOADPERCENTAGE]?.value;
        const location = document.location
        const isDifferentPage = currentHref != location.href

        if (isDifferentPage && subscriptions != undefined) {
          console.log("[antispoiler]", "[SUBSCRIPTION] Clearing subscriptions:", subscriptions.length);
          subscriptions.forEach(s => s());
          subscriptions = undefined;
        }

        if (loadPercentage == "100") {
          console.log("[antispoiler]", `[NAVIGATION] Detected ${currentHref} -> ${location.href}`, location);

          if (isDifferentPage) {
            currentHref = location.href;
            subscriptions = onPageNavigated(location);
          }
        }
      }).observe(navigationProgressBar, {
        childList: false,
        subtree: false,
        attributes: true,
        attributeFilter: [ATTRIBUTE_LOADPERCENTAGE]
      });
    },
    brokenScriptWarning,
    20,
    500);
}

const observeContinuationAdded = onContinuationAdded => {
  var subscription = undefined;

  const loop = (f, maxLoops, i) => {
    f(i);

    if (i < maxLoops) {
      subscription = setTimeout(() => loop(f, maxLoops, i + 1), 500);
    }
    subscription = undefined;
  }

  var continuations = new Set();

  loop(i => {
    Array.from(document.getElementsByTagName('ytd-continuation-item-renderer'))
      .filter(el => !continuations.has(el.parentElement))
      .filter(el => $(el).is(":visible"))
      .forEach(el => {
        continuations.add(el.parentElement);
        onContinuationAdded(el.parentElement);
      })
  }, 10, 0);

  return () => {
    if (subscription != undefined) {
      clearTimeout(subscription);
    }
  }
}

const FIX_WatchingVideo = () => {
  const channelName = $('#meta-contents #channel-name #container')[0]?.innerText;

  if (channelName == undefined) {
    throw `No channelName yet`;
  }

  if (containsSpoilerChannelName(channelName, false)) {
    console.log("[antispoiler]", "hiding videoplayer status");
    addSpoilerClass($('#player-theater-container')[0]);
    addSpoilerClass(document.querySelector('#player.ytd-watch-flexy'));
  }
};

const videoRendererChannelName = nativeElem =>
  $(nativeElem).find('ytd-channel-name yt-formatted-string').first().text().trim();

const addSpoilerTagsToVideos = (videos, channelNameUndefinedFallback) => {
  videos
    .filter(video => containsSpoilerChannelName(videoRendererChannelName(video), channelNameUndefinedFallback))
    .forEach(addSpoilerClass);
};

const main = location => {
  removeSpoilerClasses();
  var subscriptions = [];
  var sections = location.pathname.split("/").splice(1);

  console.log('[antispoiler] [MAIN ENTRYPOINT]', 'url sections', sections);

  const isLegacyChannelPage = sections[0] == 'c' || sections[0] == 'channel' || sections[0] == 'user'
  const isChannelPage = sections[0] != undefined && sections[0][0] == "@"

  const channelName = isLegacyChannelPage
    ? sections[1]
    : isChannelPage
      ? sections[0]
      : undefined;

  const isSpoilerChannel = containsSpoilerChannelName(channelName, false);

  if (sections[0] == 'watch') {
    subscriptions.push(retry(() => FIX_WatchingVideo(), brokenScriptWarning, 25, 160));
  }
  else if (channelName !== undefined) {
    if (isSpoilerChannel) {
      console.log("[antispoiler]", `spoiler channel detected ${channelName}`);

      if (location.pathname.endsWith('videos') || location.pathname.endsWith('streams')) {
        retryDefault(() => {
          const channelVideoContainer = document.querySelector('ytd-rich-grid-renderer');
          if (!channelVideoContainer) {
            throw "ytd-section-list-renderer not ready yet";
          }
          addSpoilerClass(channelVideoContainer);
        })
      }
      else if (isChannelPage || location.pathname.endsWith('featured') ) {
        retryDefault(() => {
          const videoSections = document.querySelectorAll('ytd-item-section-renderer');
          if (!videoSections || videoSections.length == 0) {
            throw "ytd-item-section-renderer not ready yet";
          }
          videoSections.forEach(section => addSpoilerClass(section));
        })
      }

    } else {
      console.log("[antispoiler]", `Not a spoiler channel: ${channelName}`, spoilerFreeChannels);
    }
  }

  subscriptions.push(observeContinuationAdded(continuationParentElement => {
    const videosAdded = videos => {
      console.log("[antispoiler]", `videos added: ${videos.length}`, continuationParentElement)
      addSpoilerTagsToVideos(videos, isSpoilerChannel);
    };
    const sectionsAdded = sections => {
      console.log("[antispoiler]", `sections added: ${sections.length}`, $(continuationParentElement).find('#contents').first())
      addSpoilerTagsToVideos(findVideos(sections), isSpoilerChannel);
    };
    const onItemsAdded = isVideoTag(continuationParentElement.children[0].tagName)
      ? videosAdded
      : sectionsAdded;

    subscriptions.push(observeChildListNodesAdded(continuationParentElement)(onItemsAdded));
  }));

  return subscriptions;
}

hideVideoPreviewStyles();
hideSeekbarStyles();

observeOnPageNavigated(main);

