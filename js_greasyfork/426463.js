// ==UserScript==
// @name         humble-bundle-extra
// @namespace    https://humblebundle.com
// @version      1.6.0
// @description  User script for humble bundle. Adds steam store links to all games and marks already owned games
// @match        *://*.humblebundle.com/*
// @author       MrMarble
// @grant        GM_xmlhttpRequest
// @connect      api.steampowered.com
// @connect      store.steampowered.com
// @icon         https://humblebundle-a.akamaihd.net/static/hashed/47e474eed38083df699b7dfd8d29d575e3398f1e.ico
// @license      MIT
// @source       https://github.com/MrMarble/humble-bundle-extra
// @downloadURL https://update.greasyfork.org/scripts/426463/humble-bundle-extra.user.js
// @updateURL https://update.greasyfork.org/scripts/426463/humble-bundle-extra.meta.js
// ==/UserScript==
(function () {
  'use strict';

  const xtmlHttp = (options) => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        timeout: 3000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        ...options,
        onload: resolve,
        onabort: reject,
        ontimeout: reject,
        onerror: reject,
      });
    })
  };
  const decodeEntities = (() => {
    const element = document.createElement("div");
    function decodeHTMLEntities(str) {
      if (str && typeof str === "string") {
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, "");
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, "");
        element.innerHTML = str;
        str = element.textContent;
        element.textContent = "";
      }
      return str
    }
    return decodeHTMLEntities
  })();
  const sanitize = (str) => {
    return decodeEntities(str)
      .replace(/[\u{2122}\u{00AE}\n]/gu, "")
      .trim()
      .toLowerCase()
  };
  const htmlToElement = (html) => {
    var template = document.createElement("template");
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild
  };
  const isBundlePage = () => {
    return !!document.querySelector("div.inner-main-wrapper div.bundle-page")
  };
  const isChoicePage = () => {
    return !!document.querySelector(
      `div.inner-main-wrapper div.subscriber-hub,
    div.inner-main-wrapper .js-content-choices`
    )
  };
  const shouldUpdateCache = () => {
    const WEEK = 7 * 24 * 60 * 60 * 1000;
    const lastCached = localStorage.getItem("&&hh_cache&&");
    if (lastCached === null) {
      localStorage.setItem("&&hh_cache&&", Date.now());
      return true
    }
    if (Date.now() - lastCached > WEEK) {
      localStorage.setItem("&&hh_cache&&", Date.now());
      return true
    }
    return false
  };
  const closeModal =
    "(()=> document.querySelector('.charity-details-view.humblemodal-wrapper').remove())()";
  const createModal = (icon, title, text) =>
    htmlToElement(`
  <div class="charity-details-view humblemodal-wrapper" tabindex="0">
    <div class="humblemodal-modal humblemodal-modal--open" style="opacity: 1;">
      <span class="js-close-modal close-modal" onclick="${closeModal}">
        <i class="hb hb-times"></i>
      </span>
      <div class="charity-info-wrapper">
        <div class="charity-media">
          <div class="charity-logo">
            <i class="hb ${icon}" style="font-size:13em;color:#c9262c"></i>
          </div> 
        </div>
        <div class="charity-details">
          <div class="charity-title">
            <h2>${title}</h2>
          </div>
          <div class="charity-description">
            ${text}
          </div>
        </div>
        </div>
    </div>
</div>
  `);

  const CACHE_STEAM_APPS_KEY = "&&hh_extras&&";
  const CACHE_OWNED_APPS_KEY = "&&hh_extras_owned&&";
  const fetchSteamApps = async () => {
    const apps = {};
    try {
      const r = await xtmlHttp({
        url: "https://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json",
        method: "GET",
        timeout: 5000,
      });
      const { applist } = JSON.parse(r.responseText);
      applist?.apps?.forEach(({ name, appid }) => {
        apps[sanitize(name)] = appid;
      });
    } catch (error) {
      console.error(error);
    }
    return apps
  };
  const cacheSteamApps = async (force) => {
    let data = {};
    try {
      if (force) {
        data = await fetchSteamApps();
        localStorage.setItem(CACHE_STEAM_APPS_KEY, JSON.stringify(data));
      } else {
        if ((data = localStorage.getItem(CACHE_STEAM_APPS_KEY))) {
          data = JSON.parse(data);
        } else {
          data = await fetchSteamApps();
          localStorage.setItem(CACHE_STEAM_APPS_KEY, JSON.stringify(data));
        }
      }
    } catch (error) {
      console.error(error);
    }
    return data
  };
  const fetchOwnedApps = async () => {
    const r = await xtmlHttp({
      url: `https://store.steampowered.com/dynamicstore/userdata/?boost=${Date.now()}`,
      method: "GET",
    });
    const { rgOwnedApps } = JSON.parse(r.responseText);
    return rgOwnedApps
  };
  const cacheOwnedApps = async (force) => {
    let data = [];
    if (force) {
      data = await fetchOwnedApps();
      localStorage.setItem(CACHE_OWNED_APPS_KEY, JSON.stringify(data));
    } else {
      if ((data = localStorage.getItem(CACHE_OWNED_APPS_KEY))) {
        data = JSON.parse(data);
      } else {
        data = await fetchOwnedApps();
        localStorage.setItem(CACHE_OWNED_APPS_KEY, JSON.stringify(data));
      }
    }
    return data
  };
  const clearOwnedCache = () =>
    localStorage.removeItem(CACHE_OWNED_APPS_KEY);

  const HIDE_MODAL = "&&hh_extras_modal&&";
  function showModal() {
    const modal = createModal(
      "hb-exclamation-circle",
      "You are not logged in to the steam store or your profile is private",
      `<p>Information about games already in your library will not be available.</p>
    <p>You can login using this <a href="https://store.steampowered.com/login" target="_blank" rel="noopener">link</a>. Reload the page after login to load the games in your library.</p>
    <p><div class="cta-button rectangular-button button-v2 red js-hero-cta" onclick="(function(){localStorage.setItem('${HIDE_MODAL}',1)})();${closeModal}">Don't show again</div></p>`
    );
    document.querySelector("#site-modal").appendChild(modal);
  }
  async function bundle() {
    const apps = await cacheSteamApps();
    const owned = await cacheOwnedApps();
    const loggedIn = owned.length != 0;
    if (!loggedIn) {
      clearOwnedCache();
      if (!localStorage.getItem(HIDE_MODAL)) {
        showModal();
      }
    }
    document.querySelectorAll(".tier-item-view .item-title").forEach((el) => {
      let appid;
      if ((appid = apps[sanitize(el.textContent)])) {
        const url = `https://store.steampowered.com/app/${appid}`;
        el.innerHTML = `<a href="${url}" style="text-decoration:underline;color:#ecf1fe" target="_blank" rel="noopener" title="Visit Steam Store" onclick="(()=> window.open('${url}','_blank'))()">${el.textContent}</a>`;
        if (loggedIn && owned.includes(appid)) {
          el.firstChild.style.color = "#7f9a2f";
          el.parentElement.parentElement.style.opacity = "25%";
          el.parentElement.parentElement.style.order = parseInt(el.parentElement.parentElement.style.order)+100;
        }
      }
    });
  }
  async function choice() {
    const force = shouldUpdateCache();
    const apps = await cacheSteamApps(force);
    const owned = await cacheOwnedApps(force);
    const loggedIn = owned.length != 0;
    if (!loggedIn) {
      clearOwnedCache();
      if (!localStorage.getItem(HIDE_MODAL)) {
        showModal();
      }
    }
    document.querySelectorAll(".content-choice-title").forEach((el) => {
      let appid;
      if ((appid = apps[sanitize(el.textContent)])) {
        el.innerHTML = `<a href="https://store.steampowered.com/app/${appid}" style="text-decoration:underline;color:#ecf1fe" target="_blank" rel="noopener" title="Visit Steam Store">${el.textContent}</a>`;
        if (loggedIn && owned.includes(appid)) {
          el.firstChild.style.color = "#7f9a2f";
          el.parentElement.parentElement.style.opacity = "25%";
          el.parentElement.parentElement.style.order = parseInt(el.parentElement.parentElement.style.order)+100;
        }
      }
    });
  }
  if (isBundlePage()) {
    bundle();
  } else if (isChoicePage()) {
    choice();
  }

})();
