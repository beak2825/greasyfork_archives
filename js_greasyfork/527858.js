// ==UserScript==
// @name        Lemmynsfw Style/UX improvement
// @namespace   tv.azzurite
// @match       https://lemmynsfw.com/*
// @match       https://media.redgifs.com/*
// @match       https://files.redgifs.com/*
// @grant       none
// @version     1.0
// @author      Azzurite
// @description Screen-fitting images, automatic video playback
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/527858/Lemmynsfw%20StyleUX%20improvement.user.js
// @updateURL https://update.greasyfork.org/scripts/527858/Lemmynsfw%20StyleUX%20improvement.meta.js
// ==/UserScript==

const UNMUTE_VIDEOS = true;

if (UNMUTE_VIDEOS && location.host.includes(`redgifs.com`) && location.href.includes(`-silent.mp4`)) {
    location.href = location.href.replaceAll(`-silent.mp4`, `.mp4`);
}
const style = document.createElement(`style`);
style.innerHTML = `
.post-listing .img-expanded {
  max-width: 100vw !important;
  height: auto !important;
  width: 100vw !important;
  max-height: 100vh !important;
  object-fit: contain;
  margin: auto;
}
 .post-listings  .offset-sm-3 {
  margin-left: 0 !important;
  }
  .container-lg {
  margin-right: 0 !important;
  margin-left: 0 !important;
  max-width: 100% !important;
  }

  body {
    overflow-x: hidden;
  }
  main {
    width: 100% !important;
  }
  .row {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .row > * {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .container, .container-fluid, .container-lg {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
`;
document.head.appendChild(style);

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            entry.target.volume = 1;
            entry.target.play();
        }
        if (!entry.isIntersecting) {
            entry.target.pause();
            entry.target.currentTime = 0;
        }
        if (entry.intersectionRatio < 0.5) {
            entry.target.volume = 0;
        }
    });
}, { threshold: [0, 0.5] });


function init(vid) {
    if (UNMUTE_VIDEOS) {
        vid.muted = false;
        vid.volume = 1;
    }
    vid.loop = true;
    vid.pause();
    observer.observe(vid);
}
for (const vid of document.getElementsByTagName(`video`)) {
    init(vid);
}
const mut = new MutationObserver((records) => {
    for (const record of records) {
        for (const removed of record.removedNodes) {
            if (removed.tagName === `VIDEO`) {
                observer.unobserve(removed);
            }
        }
        for (const added of record.addedNodes) {
            if (added.tagName === `VIDEO`) {
                init(added);
            }
            if (added instanceof HTMLElement) {
                for (const child of added.getElementsByTagName(`video`) || []) {
                    init(child);
                }
            }
        }
    }
});
mut.observe(document.body, { subtree:true, childList: true });