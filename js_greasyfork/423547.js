// ==UserScript==
// @name        Discord Follows System Theme
// @description Automatically switch Discord theme based on your system theme.
// @version     1
// @grant       none
// @match       https://discord.com/*
// @run-at      document-idle
// @namespace https://greasyfork.org/users/749016
// @downloadURL https://update.greasyfork.org/scripts/423547/Discord%20Follows%20System%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/423547/Discord%20Follows%20System%20Theme.meta.js
// ==/UserScript==
(async function () {
  const modules = await getModules();

  let updateLocalSettings;
  for (const module of modules) {
    if ((updateLocalSettings = module.exports?.default?.updateLocalSettings)) {
      break;
    }
  }

  const updateTheme = (dark) => {
    updateLocalSettings({ theme: dark ? "dark" : "light" });
  };

  const query = matchMedia("(prefers-color-scheme: dark)");

  query.addEventListener("change", (event) => {
    updateTheme(event.matches);
  });

  setTimeout(() => updateTheme(query.matches), 1500);
})();

async function getModules() {
  // ✨✨✨
  const uid = Math.random().toString(36).substring(7);
  return Object.values(
    (
      await new Promise((resolve) => {
        window.webpackJsonp.push([
          [uid],
          { [uid]: (...args) => resolve(args) },
          [[uid]],
        ]);
      })
    )[2].c
  );
}
