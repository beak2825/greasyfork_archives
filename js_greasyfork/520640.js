// ==UserScript==
// @name         WoD 角色选择下拉框
// @namespace    com.dobydigital.userscripts.wod
// @description  Adds a hero selection dropdown at the top of all World of Dungeons pages. Not all skins are supported.
// @author       XaeroDegreaz
// @home         https://github.com/XaeroDegreaz/world-of-dungeons-userscripts
// @supportUrl   https://github.com/XaeroDegreaz/world-of-dungeons-userscripts/issues
// @source       https://raw.githubusercontent.com/XaeroDegreaz/world-of-dungeons-userscripts/main/src/hero-switcher-dropdown.user.js
// @include      http*://*.world-of-dungeons.*/wod/spiel/*
// @include      http*://*.world-of-dungeons.*
// @icon         http://info.world-of-dungeons.net/wod/css/WOD.gif
// @require      https://gcore.jsdelivr.net/jquery/1.10.2/jquery.min.js
// @modifier     Christophero
// @version      2023.06.25.1
// @downloadURL https://update.greasyfork.org/scripts/520640/WoD%20%E8%A7%92%E8%89%B2%E9%80%89%E6%8B%A9%E4%B8%8B%E6%8B%89%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/520640/WoD%20%E8%A7%92%E8%89%B2%E9%80%89%E6%8B%A9%E4%B8%8B%E6%8B%89%E6%A1%86.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  const targetElement = $("td.gadget_table_cell.merged");
  if (!targetElement.length) {
    console.error(
      `Hero Selector Dropdown Userscript: Unable to find target element for dropdown.`,
      targetElement
    );
    return;
  }
  const SESSION_HERO_ID_KEY = "session_hero_id";
  const GOTO_KEY = "goto";
  const HERO_LIST_STORAGE_KEY =
    "com.dobydigital.userscripts.wod.heroswitcherdropdown.herolist";
  const USERSCRIPT_CONTAINER_ID =
    "xaerodegreaz_userscript_hero_select_container";
  const DROPDOWN_ID = "xaerodegreaz_userscript_hero_select";

  const storage = window.localStorage;
  const heroList = load(HERO_LIST_STORAGE_KEY);

  (function Main() {
    try {
      if (!heroList) {
        refreshHeroList();
      } else {
        displayHeroSelector(heroList);
      }
    } catch (e) {
      console.error("Hero Selector Dropdown Userscript: Uncaught exception", e);
    }
  })();

  function load(key) {
    try {
      const raw = storage.getItem(HERO_LIST_STORAGE_KEY);
      return raw ? JSON.parse(raw) : undefined;
    } catch (e) {
      console.error(
        `Hero Selector Dropdown Userscript: Unable to load key:${key}`,
        e
      );
      return undefined;
    }
  }

  function save(key, value) {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(
        `Hero Selector Dropdown Userscript: Unable to save key:${key}`,
        e
      );
    }
  }

  function refreshHeroList() {
    $(`div[id=${USERSCRIPT_CONTAINER_ID}]`).remove();
    fetch("/wod/spiel/settings/heroes.php")
      .then(function (res) {
        return res.text();
      })
      .then(function (text) {
        const jq = $(text);
        const inputs = jq.find("input[name=FIGUR]");
        if (!inputs.length) {
          console.error(
            'Hero Selector Dropdown Userscript: Unable to find hero list inputs on "heroes" page.',
            inputs
          );
          return;
        }
        const heroes = inputs
          .map(function () {
            const characterId = $(this).val();
            const characterName = $(this).parent().find("a").text();
            return { characterId, characterName };
          })
          .toArray();
        save(HERO_LIST_STORAGE_KEY, heroes);
        displayHeroSelector(heroes);
      });
  }

  function displayHeroSelector(heroes) {
    //# We could process the query parameters ahead of time, but, for a small amount of efficiency, I think it's best to defer so it can be done asynchronously.
    const rawVars = getUrlVars();
    //# We want to capture all query parameters so they can be passed when changing users. We don't want the session_hero_id, because we will be replacing that.
    const gotoFlag = rawVars[GOTO_KEY];
    const urlVars = rawVars
      .filter((key) => key !== SESSION_HERO_ID_KEY)
      .filter((key) => key != GOTO_KEY);
    let currentSessionHeroId = rawVars[SESSION_HERO_ID_KEY];
    //# Location without any query parameters
    let basePath = window.location.href.split("?")[0];
    if (window.location.pathname == "/") {
      basePath += "wod/spiel/news/news.php";
    }
    const remainingQueryParameters = urlVars
      .map((x) => `${x}=${rawVars[x]}`)
      .join("&");
    const querystring =
      urlVars.length > 0 ? `&${remainingQueryParameters}` : "";
    //# Begin generating new DOM elements.
    const newDiv = $(
      `<div id="${USERSCRIPT_CONTAINER_ID}" class="gadget"><label for="${DROPDOWN_ID}">切换英雄: </label></div>`
    );
    if (!currentSessionHeroId) {
      currentSessionHeroId = $('input[name="session_hero_id"]').val();
    }
    const index = heroes.findIndex(
      (hero) => hero.characterId == currentSessionHeroId
    );
    const addVal =
      gotoFlag == "prevactivehero" ? -1 : gotoFlag == "nextactivehero" ? 1 : 0;
    const realHeroId =
      heroes[(index + heroes.length + addVal) % heroes.length].characterId;
    const options = heroes
      .map((hero) => {
        const selected = hero.characterId === realHeroId ? "selected" : "";
        return `<option ${selected} value="${basePath}?${SESSION_HERO_ID_KEY}=${hero.characterId}${querystring}">${hero.characterName}</option>`;
      })
      .join("");
    const select = $(`<select id="${DROPDOWN_ID}">${options}</select>`).change(
      function () {
        window.location.href = $(this).val();
      }
    );
    const refreshButton = $(
      '<button class="button" title="Refresh Hero List">🗘</button>'
    ).click(function () {
      refreshHeroList();
    });
    newDiv.append(select, refreshButton);
    targetElement.prepend(newDiv);
  }

  function getHiddenInputValuesForSubPages() {
    return {
      //# items.php - cellar, treasure vault, etc
      view: $("input[type=hidden][name=view]").val(),
      //# trade.php - market, auctions, etc
      show: $("input[type=hidden][name=show]").val(),
    };
  }

  function getUrlVars() {
    const vars = [];
    const href = window.location.href;
    if (href.includes("?") && href.includes("&")) {
      const hashes = href
        .slice(window.location.href.indexOf("?") + 1)
        .split("&");
      for (let i = 0; i < hashes.length; i++) {
        const hash = hashes[i].split("=");
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
    }

    //# After performing a search on any of the items pages (cellar, treasure vault), the 'view' query parameter goes missing, so switching to another character
    //# will redirect to the general storage. We want to be able to capture that view value from the form inputs, and set the 'view' query param
    //# if it isn't already present.
    //# We see the same behaviour on the market / auction pages, only the query param is 'show' instead of view.
    const subPages = getHiddenInputValuesForSubPages();
    Object.keys(subPages).map((key) => {
      if (subPages[key] && !vars[key]) {
        vars.push(key);
        vars[key] = subPages[key];
      }
    });
    return vars;
  }
})();
