// ==UserScript==
// @name         Kinopoisk folder exporter
// @name:ru      Кинопоиск экспорт папки
// @namespace    https://github.com/oklookat/kp2imdb
// @version      0.1
// @description  Export movies from Kinopoisk folder to JSON.
// @description:ru Экспорт фильмов из папки Кинопоиска в JSON.
// @author       oklookat
// @match        https://www.kinopoisk.ru/mykp/folders/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487107/Kinopoisk%20folder%20exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/487107/Kinopoisk%20folder%20exporter.meta.js
// ==/UserScript==

(function () {
  "use strict";
  window.addEventListener(
    "load",
    function () {
      addButton();
    },
    false
  );
})();

function addButton() {
  const filmsList = document.getElementsByClassName("filmsListTitle");
  if (filmsList.length == 0) {
    console.error("KP EXPORT: filmsListTitle not found");
    return;
  }

  const expButt = document.createElement("div");
  expButt.className = "KPX_exportButton";
  expButt.style.height = "100%";
  expButt.style.width = "200px";
  expButt.style.backgroundColor = "red";
  expButt.onclick = () => {
    exportMovies();
  };

  filmsList[0].append(expButt);
}

function exportMovies() {
  const ulList = document.getElementById("itemList");
  if (!ulList) {
    console.error("KP EXPORT: itemList not found");
    return;
  }

  const parsedLis = [];

  ulList.childNodes.forEach((node, key) => {
    const isElement = node.nodeType == node.ELEMENT_NODE;
    if (!isElement) {
      return;
    }
    /**
     * @type {HTMLLIElement}
     */
    parsedLis.push(parseLi(node));
  });

  const parsed = JSON.stringify(parsedLis);
  download(parsed, "kp_" + new Date().getTime() + ".json", "text/json");
}

function parseLi(liElement) {
  const obj = {
    id: "",
    name: "",
    alt_name: "",
    date_added: "",
  };

  /**
   * @type {HTMLLIElement}
   */
  const li = liElement;
  obj.id = li.getAttribute("data-id");

  const info = li.getElementsByClassName("info")[0];
  obj.name = info.getElementsByClassName("name")[0].textContent;
  obj.alt_name = info.getElementsByTagName("span")[0].textContent;

  obj.date_added = li.getElementsByTagName("span")[0].textContent;

  return obj;
}

// Function to download data to a file
function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
