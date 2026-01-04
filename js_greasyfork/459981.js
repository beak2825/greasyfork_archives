// ==UserScript==
// @name		play_video_without_ad
// @description		Play videos without ad using some website like www.8090g.cn
// @namespace		liudonghua123
// @version        	0.1.0
// @include        	https://v.qq.com/x/*
// @license        	MIT
// @downloadURL https://update.greasyfork.org/scripts/459981/play_video_without_ad.user.js
// @updateURL https://update.greasyfork.org/scripts/459981/play_video_without_ad.meta.js
// ==/UserScript==

function process() {
    console.info(`[play_video_without_ad] starting... `)
    const play_url = `https://www.8090g.cn/?url=`;
    // see https://grrr.tech/posts/create-dom-node-from-html-string/ for more methods and cons and pros.
    const create_node = (html) => {
      const placeholder = document.createElement("div");
      placeholder.innerHTML = html;
      return placeholder.firstElementChild;
    };
    // const items = document.querySelectorAll(".episode-list-rect .episode-list-rect__list .episode-list-rect__item > div");
    const items = document.querySelectorAll(".episode-list div[data-vid][data-cid]");
    if (!items || items.length == 0) {
      console.info(`[play_video_without_ad] querySelectorAll items is empty!`);
    }
    // add a Play link to the right bottom of the item of play list and redirect to `https://www.8090g.cn/?url=https://v.qq.com/x/cover/${cid}/${vid}.html` in blank window
    for(const item of items) {
      // TODO: more params could be parsed using decodeURIComponent(document.querySelectorAll(".episode-list-rect .episode-list-rect__list .episode-list-rect__item>div")[0].getAttribute("dt-params")).split("&")
      const vid = item.getAttribute("data-vid");
      const cid = item.getAttribute("data-cid");
      const href = `${play_url}https://v.qq.com/x/cover/${cid}/${vid}.html`;
      const html = `<a href="${href}" target="_blank"><span style="position: absolute; right: -6px; bottom: -6px; cursor: pointer; font-size: 12px;">Play</span></a>`;
      const node = create_node(html);
      item.appendChild(node);
    }
    console.info(`[play_video_without_ad] finished... `)
};
// execute the code after some seconds in order to wait the page loaded.
// setTimeout(process, 10000);

// // https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState
// // Alternative to load event
document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    // setTimeout(process, 30000);
    process()
  }
};

// // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
// // Select the node that will be observed for mutations
// const targetNode = document.querySelectorAll(".episode-list-rect .episode-list-rect__list");
// // Options for the observer (which mutations to observe)
// const config = { attributes: true, childList: true, subtree: false };
// // Callback function to execute when mutations are observed
// const callback = (mutationList, observer) => {
//   process();
// };
// // Create an observer instance linked to the callback function
// const observer = new MutationObserver(callback);
// // Start observing the target node for configured mutations
// observer.observe(targetNode, config);
// // Later, you can stop observing
// observer. Disconnect();