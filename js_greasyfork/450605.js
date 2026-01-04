// ==UserScript==
// @name        kinorium automatic theme
// @name:ru     автоматическая тема для kinorium
// @description Automatically applies a dark/light theme matching a system theme on kinorium.com
// @description:ru Автоматически переключает темную/светлую тему на кинориуме в соответствии с системной темой
// @namespace   https://github.com/zenwarr
// @match       *://*.kinorium.com/*
// @grant       none
// @version     1.1
// @author      zenwarr
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/450605/kinorium%20automatic%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/450605/kinorium%20automatic%20theme.meta.js
// ==/UserScript==

const mediaQuery = matchMedia("(prefers-color-scheme: dark)");
setTheme(mediaQuery.matches);
mediaQuery.addEventListener("change", q => setTheme(q.matches));

async function setTheme(isDark) {
  const newThemeName = isDark ? "dark" : "light";
  const autoTheme = $.cookie("autoTheme");
  const themeCookie = $.cookie("theme");

  if (autoTheme === "1" || !themeCookie || themeCookie !== newThemeName) {
    alert(`auto theme: switching to ${ newThemeName } theme`);

    $.get("/handlers/changeUserSettings/", { key: "event_autotheme", value: 0 }, () => {
      $.cookie("theme", newThemeName, {
        expires: 365,
        domain: "." + host,
        path: "/"
      });

      $.cookie("autoTheme", 0, {
        expires: 1,
        domain: "." + host,
        path: "/"
      });

      document.location.reload();
    }, "json");
  }
}
