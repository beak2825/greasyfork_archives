// ==UserScript==
// @name         Wykop-axe filtrowanie po nickach i tagach dla serwisu Wykop
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ukrywa posty po nickach i tagach.
// @author       patsh
// @match        https://*.wykop.pl/*
// @grant        none
// @license MIT
/*jshint esversion: 6 */
// @downloadURL https://update.greasyfork.org/scripts/443193/Wykop-axe%20filtrowanie%20po%20nickach%20i%20tagach%20dla%20serwisu%20Wykop.user.js
// @updateURL https://update.greasyfork.org/scripts/443193/Wykop-axe%20filtrowanie%20po%20nickach%20i%20tagach%20dla%20serwisu%20Wykop.meta.js
// ==/UserScript==

const REMOVED_ELEMENT_CLASSNAME = "removed";
(function () {
  "use strict";

  const wk = {
    styles: `
          .wykop-block-icon {height: 80px; width:80px; position: fixed; top: 0; right: 0; z-index: 999; opacity: 0.2; padding: 20px;}
          .wykop-block-icon:hover {background-color: #22; margin-right: 20px; opacity: 1;}
          .wykop-block-menu {z-index: 9918; background-color: black; border-radius: 4px; padding: 4px;height: 380px;
          width:380px; position: fixed; bottom: 20px; right: 0; display: none;}
          .wk-list {height: 280px; width:380px;}
          .removed {display: none;}
          .wk-list-label {color: white; font-size: large; padding: 10px;}
          i { font-size: 40px;}

      `,
    prepare: () => {
      const bu = document.createElement("div");
      bu.className = "button big wykop-block-icon";
      const toggleButton = document.createElement("a");
      const wkIcon = document.createElement("i");
      wkIcon.innerHTML = "&#129683;";

      //ADD BUTTON
      bu.appendChild(toggleButton);
      toggleButton.appendChild(wkIcon);
      document.querySelector("body").appendChild(bu);

      bu.addEventListener("click", (e) => {
        e.preventDefault();
        wk.toggleMenu();
      });

      // ADD STYLES
      const styleWrapper = document.createElement("style");
      styleWrapper.innerHTML = wk.styles;
      document.querySelector("head").appendChild(styleWrapper);

      //ADD MENU
      const menu = document.createElement("div");
      menu.className = "wykop-block-menu";

      const wkListToBlock = document.createElement("textarea");
      wkListToBlock.className = "wk-list";
      wkListToBlock.setAttribute("id", "wk-list");
      wkListToBlock.setAttribute("spellcheck", "false");
      menu.appendChild(wkListToBlock);

      const wkListLabel = document.createElement("label");
      wkListLabel.className = "wk-list-label";
      wkListLabel.setAttribute("for", "wk-list");
      wkListLabel.innerHTML = "Nick ze znakiem @, tagi ze znakiem #";
      menu.appendChild(wkListLabel);

      document.querySelector("body").appendChild(menu);
      showAll();
      wk.loadData();
      wk.filter();
    },
    filter: () => {
      const wkListToBlock = document.querySelector(".wk-list");
      let rawArray = wkListToBlock.value.split(" ");
      let tags = [];
      let nicks = [];
      for (let el of rawArray) {
        if (el.charAt(0) == "@") {
          nicks.push(el.substring(1, el.length).toLowerCase());
        }
        if (el.charAt(0) == "#") {
          tags.push(el.substring(1, el.length).toLowerCase());
        }
      }

      wk.filterByTags(tags);
      wk.filterByNicks(nicks);
      wk.filterByNicksOnMikroblog(nicks);
      getArticlesFromMikroblogAndFilterThem(tags);
    },

    filterByNicks: (nicks) => {
      let articlesSelector = ".article.clearfix.dC";
      let filterList = nicks;
      let elementsExtractor = getNickFrom;
      filterArticlesUsingListOf(
        articlesSelector,
        filterList,
        elementsExtractor
      );
    },
    filterByNicksOnMikroblog: (nicks) => {
      let articlesSelector = "li.entry.iC";
      let filterList = nicks;
      let elementsExtractor = getNickOnMikroblog;
      filterArticlesUsingListOf(
        articlesSelector,
        filterList,
        elementsExtractor
      );
    },

    filterByTags: (tags) => {
      let articlesSelector = ".article.clearfix.dC";
      let filterList = tags;
      let elementsExtractor = getTagsFrom;
      filterArticlesUsingListOf(
        articlesSelector,
        filterList,
        elementsExtractor
      );
    },
    data: {
      list: "",
    },

    saveData: () => {
      const wkListToBlock = document.querySelector(".wk-list");
      wk.data.list = wkListToBlock.value;
      localStorage.setItem("wk-blocker", JSON.stringify(wk.data));
    },

    loadData: () => {
      const storage = localStorage.getItem("wk-blocker");
      const wkListToBlock = document.querySelector(".wk-list");
      if (storage) {
        const storageData = JSON.parse(storage);
        wk.data.list = storageData.list;
        wkListToBlock.value = wk.data.list;
      }
    },
    toggleMenu: () => {
      const x = document
        .querySelector("body")
        .getElementsByClassName("wykop-block-menu")[0];
      if (x.style.display === "none") {
        wk.loadData();
        x.style.display = "block";
      } else {
        x.style.display = "none";
        cleanFilters();
        wk.filter();
        wk.saveData();
      }
    },
  };

  wk.prepare();
})();
function hide(article) {
  article.classList.add(REMOVED_ELEMENT_CLASSNAME);
}

function removeHashFromArray(arr) {
  arr = arr.flat();
  arr = arr.map((a) => a.replace("#", ""));
  return arr;
}

function showAll() {
  let showMoreElements = document.querySelectorAll("a.show-more");
  for (const element of showMoreElements) {
    element.click();
  }
}

function getArticlesFromMikroblogAndFilterThem(tagsBlacklist) {
  const articleSelectorMikroblog = "li.entry.iC";
  const tagsFromMikroRegex = /#\b\w*\b/g;
  let articles = document.querySelectorAll(articleSelectorMikroblog);
  for (let article of articles) {
    let arr = [...article.innerText.matchAll(tagsFromMikroRegex)];
    let mikroArticleTags = removeHashFromArray(arr);
    if (isThereIntersection(tagsBlacklist, mikroArticleTags)) {
      hide(article);
    }
  }
}
function getTagsFrom(article) {
  let elementTags = [...article.querySelectorAll(".tag.affect")].map(function (
    x
  ) {
    return x.href.substring(25, x.href.length - 1);
  });
  elementTags = elementTags.slice(0, elementTags.length - 1);
  return elementTags;
}

function getNickFrom(article) {
  let regexForNick = "@.*a>";

  let rawNick = "";
  if (article.innerHTML.match(regexForNick) != null) {
    rawNick = [...article.innerHTML.matchAll(regexForNick)].flat()[0];
  }
  let replaceRegex = /@?<.{1,3}>/g;
  let nick = rawNick.replace(replaceRegex, "");
  nick = nick.toLowerCase();
  return [nick];
}

function getNickOnMikroblog(article) {
  let nick = article.querySelector(".author b").textContent;
  nick = nick.toLowerCase();
  return [nick];
}

function isThereIntersection(array1 = [], array2 = []) {
  const filteredArray = array1.filter((value) => array2.includes(value));
  return filteredArray.length != 0;
}

function cleanFilters() {
  removeClassFromAllElements(REMOVED_ELEMENT_CLASSNAME);
}

function removeClassFromAllElements(className) {
  Array.from(document.querySelectorAll("." + className)).forEach((el) =>
    el.classList.remove(className)
  );
}

function filterArticlesUsingListOf(
  articlesSelector,
  filterList,
  elementsExtractor
) {
  const articlesOnPage = [...document.querySelectorAll(articlesSelector)];
  for (let article of articlesOnPage) {
    let elementsFromArticle = elementsExtractor(article);
    if (isThereIntersection(filterList, elementsFromArticle)) {
      hide(article);
    }
  }
}
