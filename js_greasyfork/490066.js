// ==UserScript==
// @name        Dropout QOL Additions
// @namespace   Violentmonkey Scripts
// @match       https://www.dropout.tv/*
// @grant       GM.listValues
// @grant       GM.getValue
// @grant       GM.setValue
// @version     1.0
// @author      TheTornadotTian
// @description Enjoy enhanced convenience and organization with the Dropout QOL Additions script. Never lose track of your progress again!
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490066/Dropout%20QOL%20Additions.user.js
// @updateURL https://update.greasyfork.org/scripts/490066/Dropout%20QOL%20Additions.meta.js
// ==/UserScript==

(async function dropoutQOL() {
  if(!(await GM.getValue("watchedEpisodeIds"))) GM.setValue("watchedEpisodeIds", []);

  //Video Page Controls
  if(window.unsafeWindow.Page.PROPERTIES.VIEW_TYPE && window.unsafeWindow.Page.PROPERTIES.VIEW_TYPE === "video") {
    const videoId = window.unsafeWindow.Page.PROPERTIES.VIDEO_ID + "";
    const addToWatched = await GM.getValue("watchedEpisodeIds")
    
    if(!addToWatched.includes(videoId)) addToWatched.push(videoId);
    GM.setValue("watchedEpisodeIds", addToWatched);

    const ne = document.createElement("span");
    ne.style = "cursor: pointer"

    ne.onclick = async (e) => {
      const target = (e.target) ? e.target : e.srcElement;

      let watchedEpisodes = await GM.getValue("watchedEpisodeIds");

      if(watchedEpisodes.includes(videoId)) {
        watchedEpisodes = watchedEpisodes.filter(e => e !== videoId)
        target.innerText = "❌";
      } else {
        watchedEpisodes.push(videoId)
        target.innerText = "✅";
      }

      GM.setValue("watchedEpisodeIds", watchedEpisodes);
    }

    const watchedEpisodes = await GM.getValue("watchedEpisodeIds")
    ne.innerText = (watchedEpisodes.includes(videoId)) ? "✅" : "❌";

    document.querySelector("#watch-info > div > div > div.row.margin-vertical-medium > div.column.small-16.medium-8.large-10 > div.contain.margin-top-large.column.small-16 > h5").appendChild(ne);
  }

  //Episode Page Controls
  const episodeContainer = document.querySelector("body > main > section > section.episode-container.video-container.padding-bottom-large.padding-horizontal-medium > div:nth-child(2) > div > div > ul");
  if (episodeContainer)
    for (const ep of episodeContainer.children) {

      const ne = document.createElement("span");
      ne.style = "cursor: pointer"

      ne.onclick = async (e) => {
        const target = (e.target) ? e.target : e.srcElement;
        const epid = ep.getAttribute("data-item-id");

        let watchedEpisodes = await GM.getValue("watchedEpisodeIds");

        if(watchedEpisodes.includes(epid)) {
          watchedEpisodes = watchedEpisodes.filter(e => e !== epid)
          target.innerText = "❌";
        } else {
          watchedEpisodes.push(epid)
          target.innerText = "✅";
        }

        GM.setValue("watchedEpisodeIds", watchedEpisodes);
      }

      const watchedEpisodes = await GM.getValue("watchedEpisodeIds")
      ne.innerText = (watchedEpisodes.includes(ep.getAttribute("data-item-id"))) ? "✅" : "❌";
      ep.querySelector("div > div > div > span").appendChild(ne);

    }
})();