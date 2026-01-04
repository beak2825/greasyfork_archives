// ==UserScript==
// @name         Plotaroute - Bookmarks manager
// @namespace    https://github.com/bogdal/userscripts
// @version      0.1
// @description  Manage bookmarks directly on my routes page
// @author       Adam Bogdał
// @match        https://www.plotaroute.com/myroutes*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/403862/Plotaroute%20-%20Bookmarks%20manager.user.js
// @updateURL https://update.greasyfork.org/scripts/403862/Plotaroute%20-%20Bookmarks%20manager.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const getBookmarkedRoutes = () => {
    return new Promise((resolve) => {
      const url = "https://www.plotaroute.com/get_bmroutes.asp";
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onload = (e) => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          }
        }
      };
      xhr.send(null);
    });
  };

  const setBookmark = (routeId, isBookmarked) => {
    return new Promise((resolve) => {
      const url = "https://www.plotaroute.com/post_bookmarkroute.asp";
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.onload = (e) => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          }
        }
      };
      xhr.send(`ID=${routeId}&Bookmark=${isBookmarked ? 1 : 0}`);
    });
  };

  const setIconSpinner = (icon) => {
    icon.classList.add("fa-spinner", "fa-spin");
  };

  const setIconBookmark = (icon, isBookmarked) => {
    icon.classList.remove("fa-spinner", "fa-spin");
    icon.classList.add("fa-bookmark");
    if (isBookmarked) {
      icon.classList.remove("fa-bookmark-o");
    } else {
      icon.classList.add("fa-bookmark-o");
    }
  };

  const loadBookmaredRoutes = async () => {
    const routes = await getBookmarkedRoutes();
    const routeIds = routes.Routes.map(({ id }) => id);

    document.querySelectorAll(".bm-route-icon").forEach((icon) => {
      const routeId = icon.getAttribute("data-route-id");
      const isBookmarked = routeIds.includes(parseInt(routeId));
      setIconBookmark(icon, isBookmarked);
    });
  };

  const toggleBookmark = async (event) => {
    const icon = event.target;
    if (!icon.classList.contains("fa-spinner")) {
      const routeId = icon.getAttribute("data-route-id");
      const isBookmarked = !icon.classList.contains("fa-bookmark-o");
      setIconSpinner(icon);
      await setBookmark(routeId, !isBookmarked);
      setIconBookmark(icon, !isBookmarked);
    }
  };

  document.querySelectorAll("#MyRoutesRows tr").forEach((tr) => {
    const regex = new RegExp("\\d+$");
    const routeId = regex.exec(tr.id)[0];
    const container = tr.childNodes[1];

    const icon = document.createElement("i");
    icon.className =
      "bm-route-icon fa fa-spinner fa-spin color_high right text20 pointer";
    icon.setAttribute("data-route-id", routeId);
    icon.addEventListener("click", toggleBookmark);

    const iconWrapper = document.createElement("div");
    iconWrapper.style.width = "20px";
    iconWrapper.classList.add("right");
    iconWrapper.appendChild(icon);

    container.appendChild(iconWrapper);
  });

  loadBookmaredRoutes();
})();
