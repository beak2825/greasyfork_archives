// ==UserScript==
// @name         Plotaroute - Thumbnails of my routes
// @namespace    https://github.com/bogdal/userscripts
// @version      0.1
// @description  Shows thumbnails directly on my routes page
// @author       Adam Bogdał
// @match        https://www.plotaroute.com/myroutes*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/403182/Plotaroute%20-%20Thumbnails%20of%20my%20routes.user.js
// @updateURL https://update.greasyfork.org/scripts/403182/Plotaroute%20-%20Thumbnails%20of%20my%20routes.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const thumbnailWidth = 200;
  const thumbnailHeight = 100;

  const getThumbnail = (routeId) => {
    return new Promise((resolve) => {
      const url = `https://www.plotaroute.com/Get_RouteThumbnail.asp?ID=${routeId}&height=${thumbnailHeight}&width=${thumbnailWidth}`;
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onload = (e) => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const regex = /<img.*?src=[""](.*?)[""]/;
            const imgSrc = regex.exec(xhr.responseText)[1];
            const img = new Image();
            img.onload = () => {
              resolve(img);
            };
            img.src = imgSrc;
            img.alt = routeId;
          }
        }
      };
      xhr.send(null);
    });
  };

  const loadThumbnail = async (routeId, container) => {
    const thumbnail = await getThumbnail(routeId);

    const editLink = document.createElement("a");
    editLink.setAttribute("href", `/map/${routeId}`);
    editLink.appendChild(thumbnail);

    container.childNodes.forEach((node) => container.removeChild(node));
    container.appendChild(editLink);
  };

  document.querySelectorAll(".thumbicon").forEach((thumbIcon) => {
    const routeId = thumbIcon.getAttribute("data-id");
    const container = thumbIcon.parentElement;
    thumbIcon.remove();
    container.style.height = `${thumbnailHeight + 20}px`;
    container.style.width = `${thumbnailWidth}px`;
    container.style.padding = 0;

    const spinner = document.createElement("i");
    spinner.classList.add("fa", "fa-spinner", "fa-spin", "fa-2x", "color_high");
    container.appendChild(spinner);

    loadThumbnail(routeId, container);
  });
})();
