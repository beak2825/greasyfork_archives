// ==UserScript==
// @name         Anilist more links (MAL/AniDB)
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.5.1
// @description  adds links to anilist/mal site to anilist (uses just the duckduckgo I'm feeling ducky feature with the anime name)
// @author       Alistair1231
// @match        https://anilist.co/*
// @icon         https://icons.duckduckgo.com/ip2/anilist.co.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439324/Anilist%20more%20links%20%28MALAniDB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439324/Anilist%20more%20links%20%28MALAniDB%29.meta.js
// ==/UserScript==

function createButton(linkcolor="#5B0BB5e0", link, text, iconDomain) {
  const anchorTag = document.createElement('a');
  anchorTag.setAttribute('data-v-c1b7ee7c', '');
  anchorTag.setAttribute('href', link);
  anchorTag.setAttribute('target', '_blank');
  anchorTag.setAttribute('class', 'external-link');
  anchorTag.setAttribute('style', `--link-color:${linkcolor};`);
  
  const divTag = document.createElement('div');
  divTag.setAttribute('data-v-c1b7ee7c', '');
  divTag.setAttribute('class', 'icon-wrap');
  divTag.setAttribute('style', `background:black;`);

  const imgTag = document.createElement('img');
  imgTag.setAttribute('data-v-c1b7ee7c', '');
  imgTag.setAttribute('src', 'https://icons.duckduckgo.com/ip2/' + iconDomain + '.ico');
  imgTag.setAttribute('class', 'icon');
  // min-width: 25px;
  imgTag.style.minWidth = "25px";
  
  const spanTag = document.createElement('span');
  spanTag.setAttribute('data-v-c1b7ee7c', '');
  spanTag.setAttribute('class', 'name');
  spanTag.textContent = text;
  
  divTag.appendChild(imgTag);
  anchorTag.appendChild(divTag);
  anchorTag.appendChild(spanTag);
  
  return anchorTag;
}

function run() {
  // if no external links there, add the div to the sidebar
  if (document.querySelectorAll("div.external-links h2~div").length === 0) {
    var myDiv = document.createElement("div");
    myDiv.setAttribute("data-v-7a1f9df8", "");
    myDiv.setAttribute("data-v-1c97ba07", "");
    myDiv.setAttribute("class", "external-links");
    myDiv.innerHTML = "<h2 data-v-7a1f9df8=\"\">External &amp; Streaming links<\/h2><div data-v-7a1f9df8=\"\" class=\"external-links-wrap\"><\/div>";
    document.querySelector("div.sidebar").appendChild(myDiv);
  }
  var linkBar = document.querySelectorAll("div.external-links h2~div");

  var name = document.querySelector(".content h1").innerText.replace(':','');
  var mal = "https://duckduckgo.com/?q=!myanimelist+" + name;
  var malButton = createButton(linkcolor="#5B0BB5e0", link=mal, text="MAL",iconDomain="myanimelist.net");
  var anidb = "https://duckduckgo.com/?q=!anidb+" + name;
  var anidbButton = createButton(linkcolor="#5B0BB5e0", link=anidb, text="AniDB",iconDomain="anidb.net");
  if (document.querySelectorAll("a.external-link[href*='https://duckduckgo.']").length === 0) {
    linkBar[0].prepend(malButton);
    linkBar[0].prepend(anidbButton);
  }
}


function checkReady() {
  var contentH1 = document.querySelector(".content h1");
  if (contentH1) {
    run();
  }
  else{
    console.log("title not loaded, trying again in 200ms");
    setTimeout(checkReady, 200);
  }
}

(function() {
  let url;
  let lastUrl = location.href;

  let mutationObserver = new MutationObserver(() => {
    url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      checkReady();
    }
  })

  mutationObserver.observe(document, { subtree: true, childList: true });
  checkReady();
})();