// ==UserScript==
// @name         Find on Nyaa
// @namespace    MALFindNya
// @version      2.9
// @description  Will open nyaa on a new window and search for the anime title
// @author       Samu
// @match        https://myanimelist.net/anime/*
// @match        https://myanimelist.net/anime.php?id=*
// @match        https://anilist.co/*
// @match        https://kitsu.app/*
// @match        https://*.anime-planet.com/*
// @match        https://*.animenewsnetwork.com/*
// @match        https://anidb.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/379776/Find%20on%20Nyaa.user.js
// @updateURL https://update.greasyfork.org/scripts/379776/Find%20on%20Nyaa.meta.js
// ==/UserScript==

/**
  icon source
  https://icons8.com/icon/82838/external-link
**/

//** SETTINGS **//
let sortBy = "seeders";                       // "comments", "size", "id", "seeders", "leechers", or "downloads"
let filter = "0";                             // 0 = No Filter | 1 = No remakes | 2 = Trusted Only
let category = "AnimeEnglishTranslated";      // Check values below
let favoriteGroups = ["Judas", "Erai-raws"];  // List is ordered, favorite should be first
let searchPrefix = "";
let searchSufix = "";
//** END OF SETTINGS **//

// Category values
const cat = {
  Allcategories: "0_0",
  Anime: "1_0",
  AnimeMusicVideo: "1_1",
  AnimeEnglishTranslated: "1_2",
  AnimeNonEnglishTranslated: "1_3",
  Raw: "1_4",
  Audio: "2_0",
  Lossless: "2_1",
  Lossy: "2_2",
  Literature: "3_0",
  LiteratureEnglishTranslated: "3_1",
  LiteratureNonEnglishTranslated: "3_2",
  LiteratureRaw: "3_3",
  LiveAction: "4_0",
  LiveActionEnglishTranslated: "4_1",
  IdolPromotionalVideo: "4_2",
  LiveActionNonEnglishTranslated: "4_3",
  LiveActionRaw: "4_4",
  Pictures: "5_0",
  Graphics: "5_1",
  Photos: "5_2",
  Software: "6_0",
  Applications: "6_1",
  Games: "6_2",
};

const buttonId = "FindOnNyaaButtonId";
const imgKey = "ImgData";

let css = `
  #${buttonId} {
    margin-left: 10px;
    height: 10px;
    width: 10px;
    display: inline-flex;
    transform: scale(1.8);
    vertical-align: top;
    margin-top: 7px;
  }

  #${buttonId} svg {
    fill: #000;
  }

  #${buttonId}.dark-theme svg {
    fill: #fff;
  }
`;

GM_addStyle(css);

const sites = [
  {
    host: "myanimelist.net",
    selector: ".title-name",
    titleSelectors: [".title-name", ".title-english"],
    isDark: () => document.documentElement.classList.contains("dark-mode"),
  },
  {
    host: "anilist.co",
    path: "/anime/",
    selector: ".page-content .header .content > h1",
    isDark: () => document.body.classList.contains("site-theme-dark"),
  },
  {
    host: "kitsu.app",
    path: "/anime/",
    selector: ".media--title h3",
    isDark: () => {
      var theme = 'light';
      if (window.localStorage) {
        var cacheStorage = window.localStorage.getItem('storage:last-used');
        if (cacheStorage) {
          theme = JSON.parse(cacheStorage).theme || theme;
        }
      }
      return theme === "dark";
    },
  },
  {
    host: "anime-planet.com",
    path: "/anime/",
    selector: "#siteContainer h1",
    isDark: () => document.documentElement.classList.contains("darkmode"),
  },
  {
    host: "animenewsnetwork.com",
    path: "/encyclopedia/anime.php",
    selector: "#page_header",
    filter: /\([a-zA-Z0-9 ]+\)/,
    isDark: () => false,
  },
  {
    host: "anidb.net",
    path: "/anime/",
    selector: "h1.anime",
    filter: /^Anime:\s/,
    isDark: () => true,
  },
];


let buttonIcon = getIcon();

(function() {
  'use strict';

  GM_registerMenuCommand("Add Custom Icon", uploadImage, "h");
  if (typeof buttonIcon !== "string") {
    GM_registerMenuCommand("Remove Custom Icon", removeImage, "h");
  }

  let pushState = history.pushState;
  let replaceState = history.replaceState;

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

  let host = window.location.host;
  let path = window.location.pathname;

  window.addEventListener('locationchange', function() {
    path = window.location.pathname;
    lookForTitleElement(host, path);
  });

  lookForTitleElement(host, path);

})();

function lookForTitleElement(host, path) {

  for (let i = 0; i < sites.length; i++) {
    let site = sites[i];
    if (host.endsWith(site.host) && (site.path == undefined || path.startsWith(site.path))) {
      waitForElm(site.selector).then(elm => init(elm, site));
      break;
    }
  }

  let nyaaButton = document.getElementById(buttonId);
  if (nyaaButton != null) {
    nyaaButton.parentElement.removeChild(nyaaButton);
  }

}

function init(element, config) {
  let url = createUrl(element, config);
  let nyaaButton = document.getElementById(buttonId);
  if (nyaaButton == null) {
    nyaaButton = createButton(url);
    element.appendChild(nyaaButton);
  } else {
    nyaaButton.setAttribute("href", url);
  }

  if (config.isDark()) {
    nyaaButton.classList.add("dark-theme");
  }
}

function createButton(url) {
  let button = document.createElement("a");
  button.id = buttonId;
  button.setAttribute("href", url);
  button.setAttribute("target", "_blank");
  button.setAttribute("rel", "noopener");
  button.setAttribute("title", "Search on Nyaa");
  if (typeof buttonIcon === "string") {
    button.innerHTML = buttonIcon;
  } else {
    button.appendChild(buttonIcon);
  }
  return button;
}

function getTitles(config)
{
  return config.titleSelectors.map(x => fixTitle(document.querySelector(x)?.textContent, config.filter)).filter(x => typeof x != "undefined");
}

function fixTitle(title, filter) {
  return title?.replace(filter, "").trim().replace(/[^a-zA-Z0-9]+/g, "+").trim();
}

function createUrl(element, config) {
  let titles = config.titleSelectors?.length > 0
    ? "(" + getTitles(config).join(")|(") + ")"
    : fixTitle(element.textContent, config.filter);

  let textFragment = ":~:text=" + favoriteGroups.join("&text=");
  let query = [searchPrefix, titles, searchSufix].join(" ").trim();
  let queryURI = encodeURI(query);
  let baseUrl = "https://nyaa.si/";
  let path = `?f=${filter}&c=${cat[category]}&s=${sortBy}&o=desc&q=${queryURI}`;
  return baseUrl + path + "#" + textFragment;
}

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

function getIcon() {
  let userImg = GM_getValue(imgKey);

  if (userImg == null) {
    return `<svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M 5 3 C 3.9069372 3 3 3.9069372 3 5 L 3 19 C 3 20.093063 3.9069372 21 5 21 L 19 21 C 20.093063 21 21 20.093063 21 19 L 21 12 L 19 12 L 19 19 L 5 19 L 5 5 L 12 5 L 12 3 L 5 3 z M 14 3 L 14 5 L 17.585938 5 L 8.2929688 14.292969 L 9.7070312 15.707031 L 19 6.4140625 L 19 10 L 21 10 L 21 3 L 14 3 z"/></svg>`;
  }

  let imgElement = document.createElement("img");
  imgElement.src = userImg;
  return imgElement;
}

function uploadImage() {
  let input = document.createElement("input");
  input.type = "file";
  input.addEventListener("change", onImageUploaded);
  input.click();
}

function onImageUploaded(e) {
  let file = this.files[0];

  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
    .then(result => {
      GM_setValue(imgKey, result);
      window.location.reload();
    })
    .catch(err => alert(err));
}

function removeImage() {
  GM_setValue(imgKey, null);
  window.location.reload();
}
