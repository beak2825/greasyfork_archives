// ==UserScript==
// @name         Milkie Thumbnails
// @namespace    dumpsterbaby.lol
// @version      0.0.0
// @description  Hover torrent link to preview thumbnails
// @author       egore
// @license      MIT
// @match        https://milkie.cc/browse*
// @icon         https://milkie.cc/assets/icons/logo.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520710/Milkie%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/520710/Milkie%20Thumbnails.meta.js
// ==/UserScript==

(function () {

  function newElement(tagName, attributes, content) {
    var tag = document.createElement(tagName);
    for (var key in attributes || {}) {
      if (attributes[key] !== undefined && attributes[key] !== null) {
        tag.setAttribute(key, attributes[key]);
      }
    }
    tag.innerHTML = content || "";
    return tag;
  }

  function findLinksByHref(urlFragment) {
    const links = Array.from(document.querySelectorAll('a')).filter(link => {
      return link.href.includes(urlFragment);
    });
    return links;
  }

  function iterateNodeList(nodeList, callback) {
    if (!(nodeList instanceof NodeList)) {
      throw new TypeError("Invalid NodeList provided.");
    }
    if (typeof callback !== "function") {
      throw new TypeError("Callback must be a function.");
    }
    for (let i = 0; i < nodeList.length; i++) {
      if (callback(nodeList[i]) === false) {
        break; //Stop iteration if callback returns false
      }
    }
  }

  function init() {
    const uls = document.querySelectorAll('.adult');

    const btns = document.querySelectorAll('.mat-icon.notranslate.download.material-icons.mat-icon-no-color');
    btns.forEach(btn => { btn.style.display = 'none' });

    if (interval) {
      clearInterval(interval);
      interval = undefined;
      window.setInterval(init, 5000);
    }

    iterateNodeList(uls, (node) => {
      const context = node.__ngContext__[115]

      const ln = findLinksByHref(`/browse/${context}`);
      const link = ln[0];

      const previewContainer = newElement("div", {
        style: `
          position: absolute;
        `
      });

      const previewContainer2 = newElement("div", {
        style: `
          position: absolute;
        `
      });

      const previewContainer3 = newElement("div", {
        style: `
          position: absolute;
        `
      });

      for (let i = 0; i < 2; i++) {
        const img = newElement("img", {
          src: `https://cdn.milkie.cc/t/${context}/o_${i}.jpg`,
          style: `
            display: none;
            position: absolute;
            left: ${0 + i * 452}px;
            top: 22px;
            max-width: 450px;
          `,
          loading: "lazy"
        });
        previewContainer.appendChild(img);
        link.parentNode.insertBefore(previewContainer, link.nextSibling);

        link.addEventListener('mouseover', () => {
          img.style.display = "block";
        });
        link.addEventListener('mouseout', () => {
          img.style.display = "none";
        });
      }

      for (let i = 2; i < 4; i++) {
        const img = newElement("img", {
          src: `https://cdn.milkie.cc/t/${context}/o_${i}.jpg`,
          style: `
            display: none;
            position: absolute;
            left: ${0 + (i - 2) * 452}px;
            top: 277px;
            max-width: 450px;
          `,
          loading: "lazy"
        });
        previewContainer2.appendChild(img);
        link.parentNode.insertBefore(previewContainer2, link.nextSibling);

        link.addEventListener('mouseover', () => {
          img.style.display = "block";
        });
        link.addEventListener('mouseout', () => {
          img.style.display = "none";
        });
      }

      for (let i = 4; i < 6; i++) {
        const img = newElement("img", {
          src: `https://cdn.milkie.cc/t/${context}/o_${i}.jpg`,
          style: `
            display: none;
            position: absolute;
            left: ${0 + (i - 4) * 452}px;
            top: 532px;
            max-width: 450px;
          `,
          loading: "lazy"
        });
        previewContainer3.appendChild(img);
        link.parentNode.insertBefore(previewContainer3, link.nextSibling);

        link.addEventListener('mouseover', () => {
          img.style.display = "block";
        });
        link.addEventListener('mouseout', () => {
          img.style.display = "none";
        });
      }

    });
  }

  let interval = window.setInterval(init, 500);

})();
