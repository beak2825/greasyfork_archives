// ==UserScript==
// @name            Steam | Display game languages
// @name:uk         Steam | Відобразити мови гри
// @namespace       http://tampermonkey.net/
// @version         06.06.2024
// @description     Display images of selected languages on store search steam page.
// @description:uk  Виводить обрані мови (svg картинка) на сторінці пошуку ігор в steam.
// @author          Black_Yuzia
// @match           https://store.steampowered.com/search*
// @match           https://store.steampowered.com/charts/*
// @icon            https://store.steampowered.com/favicon.ico
// @grant           GM_addStyle
// @grant           GM.xmlHttpRequest
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM.registerMenuCommand
// @grant           GM.notification
// @run-at          document-end
// @license         CC BY-NC-ND 4.0
// @license-url     https://creativecommons.org/licenses/by-nc-nd/4.0/
// @compatible      firefox
// @compatible      chrome
// @compatible      opera
// @compatible      safari
// @compatible      edge
// @connect         localhost:1500
// @connect         tm.starserv.net
// @downloadURL https://update.greasyfork.org/scripts/483582/Steam%20%7C%20Display%20game%20languages.user.js
// @updateURL https://update.greasyfork.org/scripts/483582/Steam%20%7C%20Display%20game%20languages.meta.js
// ==/UserScript==
(() => {
  // src/index.ts
  (async function() {
    "use strict";
    GM_addStyle(`
        .mr-2 {
            margin-right: 2px
        }
    `);
    const languages = await initLanguages();
    await registerMenuCommands();
    const leftcol = document.querySelector(".leftcol");
    const charts = waitForElement("div[class*=steamchartsshell_SteamChartsShell]");
    if (leftcol) {
      await proceedStoreGames();
      const searchObserver = new MutationObserver(proceedStoreGames);
      searchObserver.observe(leftcol, {
        childList: true,
        subtree: true
      });
    }
    if (await charts) {
      await proceedChartsGames();
      const chartsObserver = new MutationObserver(proceedChartsGames);
      chartsObserver.observe(await charts, {
        childList: true,
        subtree: true
      });
    }
    async function proceedStoreGames() {
      const games = [...document.querySelectorAll(".search_result_row:not(.sld_process)")];
      for (const game of games) {
        game.className += " sld_process";
      }
      if (games.length > 0) {
        const ids = games.map(parseGameID);
        const res = await GM.xmlHttpRequest({
          // @ts-expect-error
          url: `${"https://tm.starserv.net"}/steam/games/lang?id=${ids.join(",")}`,
          method: "GET",
          responseType: "json",
          fetch: true
        });
        if (res.status === 200) {
          const { response } = res;
          for (let i = 0; i < response.length; i++) {
            const items = response[i];
            if (items.length > 0) {
              for (const lang of languages) {
                if (items.includes(lang)) {
                  const game = games[i];
                  const img = document.createElement("img");
                  img.height = 20;
                  img.width = 20;
                  img.className = "mr-2";
                  img.src = `https://fastdl.starserv.net/languages/${lang}@2x.svg`;
                  game.querySelector(".platform_img")?.parentElement.prepend(img);
                }
              }
            }
          }
        }
      }
    }
    async function proceedChartsGames() {
      const games = [...document.querySelectorAll("tr[class*=weeklytopsellers_TableRow]:not(.sld_process)")];
      for (const game of games) {
        game.className += " sld_process";
      }
      if (games.length > 0) {
        const ids = games.map((game) => parseGameID(game.querySelector("a")));
        const res = await GM.xmlHttpRequest({
          // @ts-expect-error
          url: `${"https://tm.starserv.net"}/steam/games/lang?id=${ids.join(",")}`,
          method: "GET",
          responseType: "json",
          fetch: true
        });
        if (res.status === 200) {
          const { response } = res;
          for (let i = 0; i < response.length; i++) {
            const items = response[i];
            if (items.length > 0) {
              for (const lang of languages) {
                if (items.includes(lang)) {
                  const game = games[i];
                  const img = document.createElement("img");
                  img.height = 20;
                  img.width = 20;
                  img.className = "mr-2";
                  img.src = `https://fastdl.starserv.net/languages/${lang}@2x.svg`;
                  game.querySelector("div[class*=weeklytopsellers_GameName]")?.prepend(img);
                }
              }
            }
          }
        }
      }
    }
  })();
  function parseGameID(e) {
    const [id] = e?.href?.match(/\d+/) || [];
    return id;
  }
  async function initLanguages() {
    const notification = await GM.getValue("notification", false);
    const languages = await GM.getValue("languages", ["ukrainian", "russian"]);
    console.log("lang", languages);
    if (!notification) {
      GM.notification("Please choose languages in menu! Default lang: 'Ukrainian,\u0279ussian'", "Warning");
    }
    return languages.reverse();
  }
  async function registerMenuCommands() {
    await GM.registerMenuCommand("Set Languages", async () => {
      const languages = prompt("Set language(s) [example: Ukrainian,English,\u0279ussian]");
      if (languages) {
        await GM.setValue("notification", true);
        await GM.setValue("languages", languages.split(",").map((v) => v.trim().toLowerCase()));
      }
    });
  }
  function waitForElement(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      setTimeout(() => {
        resolve(null);
      }, 3e4);
    });
  }
})();
