// ==UserScript==
// @name        No Verbal on ČSFD.cz
// @namespace   mystrdat-userscripts
// @author      mystrdat
// @version     2.0.4
// @match       https://*.csfd.cz/*
// @run-at      document-end
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.addStyle
// @grant       GM.addElement
// @description Odstraní verbala a/nebo jiné vybrané uživatele z recenzí, hodnocení a diskuzí na ČSFD.cz
// @homepageURL https://github.com/mystrdat/csfd-no-verbal
// @icon        https://www.csfd.cz/favicon.ico
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/457765/No%20Verbal%20on%20%C4%8CSFDcz.user.js
// @updateURL https://update.greasyfork.org/scripts/457765/No%20Verbal%20on%20%C4%8CSFDcz.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(async () => {
  const className = "csfd-no-verbal--block";
  const icon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024' fill='%23000000' height='18' width='18'%3E%3Cpath d='M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5zm-63.57-320.64L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z'%3E%3C/path%3E%3Cpath d='M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z'%3E%3C/path%3E%3C/svg%3E";
  const users = await GM.getValue("users", ["verbal"]);
  const comments = document.querySelectorAll("#snippet--comments > article");
  const ratings = document.querySelectorAll(".aside-movie-profile .user-list li");
  const discussions = document.querySelectorAll("#topPost > .article-forum-item");
  const addBlockButton = () => {
    GM.addStyle(`.${className}{all:unset;display:block;width:18px;height:18px;margin-left:8px;background:var(--color-grey-dark);-webkit-mask-image:url("${icon}");mask-image:url("${icon}");cursor:pointer;}.${className}:hover{background:var(--color-red-text);}`);
    comments.forEach((comment) => {
      const user = comment.querySelector("a.user-title-name")?.textContent;
      const button = GM.addElement(comment.querySelector("h3.user-title"), "i", {
        role: "button",
        title: `Odstranit uživatele ${user}`,
        "aria-label": `Odstranit uživatele ${user}`,
        class: className
      });
      button.addEventListener("click", async () => {
        await GM.setValue("users", [...users, user]);
        window.location.reload();
      });
    });
  };
  const removeBlockedUserEntry = (elements, selector) => {
    elements.forEach((element) => {
      const author = element.querySelector(selector)?.textContent;
      users.includes(author) && element.remove();
    })
  };

  removeBlockedUserEntry([...comments, ...discussions], ".user-title-name");
  removeBlockedUserEntry(ratings, "a");
  addBlockButton();
})();