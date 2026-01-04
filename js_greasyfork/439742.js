// ==UserScript==
// @name        Quick drop titles
// @namespace   Anilist.co Scripts
// @match       https://anilist.co/search/anime
// @grant       none
// @version     1.0
// @author      KiD Fearless
// @license MIT
// @description Adds a dropped button to the quick tab for anilist
// @downloadURL https://update.greasyfork.org/scripts/439742/Quick%20drop%20titles.user.js
// @updateURL https://update.greasyfork.org/scripts/439742/Quick%20drop%20titles.meta.js
// ==/UserScript==


document.onreadystatechange = () =>
{
  document.onreadystatechange = null;
  
  setInterval(() => 
  {
    let cards = document.querySelectorAll(".media-card");
    for(let card of cards)
    {
      let actions = card.querySelector(".quick-actions");

      // cheap check if we've already ran
      if(actions.lastElementChild.onclick)
      {
        continue;    
      }

      let vue = card.__vue__;

      // don't know if this changes between updates. Just grab it dynamically
      let data = `data-v-${Object.keys(actions.dataset)[0].substring(1).toLowerCase()}`;

      actions.innerHTML += 
        `<div ${data}="" label="Add to Dropped" class="btn">
            <svg ${data}="" aria-hidden="true" focusable="false" data-prefix="fas" class="icon svg-inline--fa fa-w-14" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path ${data}=""  fill="currentColor"d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"/></svg>
         </div>`;

      actions.lastElementChild.onclick = (event) =>
      {
        event.preventDefault();
        vue.$store.dispatch("medialistEditor/save", {status: "DROPPED", mediaId: vue.media.id});
      };
    }
  }, 300);
};

