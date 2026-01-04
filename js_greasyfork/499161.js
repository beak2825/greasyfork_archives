// ==UserScript==
// @name        Synful
// @namespace   Violentmonkey Scripts
// @include     /^https://www\.empornium\.(me|sx|is)\/*/
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @version     1.0.4
// @author      vandenium
// @description Reverse parent tag look up by tag synonym
// @downloadURL https://update.greasyfork.org/scripts/499161/Synful.user.js
// @updateURL https://update.greasyfork.org/scripts/499161/Synful.meta.js
// ==/UserScript==
// Changelog:
// Version 1.0.4
// - Use "parent" instead of "official" tag
// Version 1.0.0
// - Initial Release!
// - Features:
//  - reverse lookup by synonyms
//  - smart look up by partial tag names
//  - synonym caching - updates weekly
//  - works on all Tag input boxes

const constants = {
  menuContainer: "synful-container",
  menuName: "synful-menu",
  menuId: "#synful-menu",
  menuItemClass: "synful-menu-item",
  empMenuIdName: "autoresults",
  empMenuId: "#autoresults",
  empSearchBoxId: "#searchbox_tags",
};

let enableMutationObserver;
let disableMutationObserver;
let empTagSearchInputBox;
let targetElement;
let currentKeyPressSourceEl;

GM_addStyle(`

.synful-tag-name {
  font-family: monospace;
  border-radius: 3px;
  background-color: gainsboro;
  padding: 1px;
  text-shadow: 1px 1px #fff;
  border: solid #ddd;
  padding: 0;
  color: black;
}

#synful-menu .synful-menu-item {
  padding-bottom: 0;
  border-radius: 3px;
  height: 18px;
  line-height: 14px;
  padding-top: 3px;
}

#synful-menu .synful-menu-item :hover{
  cursor: pointer;
}

.synful-menu-item .found {
    color: darkgreen;
    font-weight: bold;
    font-family: monospace;
    padding: 1px;
    border-radius: 3px;
    font-style: italic;
}

.${constants.menuItemClass}:focus {
  background-color: darkseagreen;
  color: white;
  height: 22px;
  cursor: pointer;
}
`);

let escapeKeyPressed = false;

function closeSynFulMenus() {
  const tag2SynMenu = document.querySelector(`#${constants.menuContainer}`);
  const empSearchContainer = document.querySelector(
    `.searchcontainer #${constants.menuContainer}`
  );
  tag2SynMenu?.remove();
  empSearchContainer?.remove();
}

function closeTagMenus() {
  disableMutationObserver();
  const empMenu = document.querySelector(constants.empMenuId);
  const tag2SynMenu = document.querySelector(`#${constants.menuContainer}`);
  const empSearchContainer = document.querySelector(
    `.searchcontainer #${constants.menuContainer}`
  );

  if (empSearchContainer) {
    empSearchContainer.remove();
  }

  if (tag2SynMenu) {
    tag2SynMenu.remove();
  }

  if (empMenu) {
    empMenu.style.display = "none";
  }
  enableMutationObserver();
}

function splitBySubstring(mainString, substring) {
  if (!mainString.includes(substring)) {
    return [mainString];
  }

  const parts = mainString.split(substring);
  const result = [];

  for (let i = 0; i < parts.length; i++) {
    result.push(parts[i]);
    if (i !== parts.length - 1) {
      result.push(substring);
    }
  }

  return result.filter((part) => part !== "");
}

function generateHtml(substring, parts) {
  return parts.reduce((acc, part) => {
    const className = part === substring ? "found" : "normal";
    acc += `<span class='${className}'>${part}</span>`;
    return acc;
  }, "");
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function render(inputText, arrSynonymObjs, searchBoxEl) {
  if (inputText.length === 0) {
    return;
  }

  closeSynFulMenus();

  if (escapeKeyPressed) {
    escapeKeyPressed = false;
    return;
  }

  if (arrSynonymObjs.length === 0) return;

  const resultsEl = document.querySelector(constants.empMenuId);
  const resultsDisplayed = resultsEl.checkVisibility();

  const div = document.createElement("div");
  div.id = constants.menuContainer;
  div.style.color = "#333";
  div.style.height = "50px;";
  div.style.border = "solid #333 1px";
  div.style.backgroundColor = "white";
  div.style.borderRadius = "4px";
  div.style.position =
    searchBoxEl.id === "searchbox_tags"
      ? "absolute"
      : resultsDisplayed
      ? "absolute"
      : "static";
  div.style.zIndex = 1;
  div.style.maxHeight = "30em";
  div.style.overflowY = "scroll";
  div.style.backgroundColor = "lightyellow";

  div.style.top = `${
    resultsDisplayed ? -1 : searchBoxEl.getBoundingClientRect().height
  }px`;
  div.style.left = `${
    resultsDisplayed ? resultsEl.getBoundingClientRect().width : 0
  }px`;

  const headerHtml = `
  <div style="
    padding: 2px;
    font-weight: bold;
    border-bottom: solid #ccc 1px;
    margin-bottom: 2px;
"><span style="
    padding-left: 8px;

">Synonym</span><span style="padding-left: 5px;">→</span><span style="padding-left: 5px;">Parent Tag</span></div>
  `;

  const header = document.createElement("div");
  header.innerHTML = headerHtml;

  const ul = document.createElement("ul");
  ul.id = constants.menuName;
  ul.style.padding = "2px";
  ul.style.width = "max-content";
  ul.style.top = 0;
  ul.style.listStyle = "none";
  ul.style.backgroundColor = "lightyellow";
  ul.style.borderRadius = "4px";
  ul.style.position = "static";
  ul.style.border = "none";
  ul.style.fontSize = "14px";

  arrSynonymObjs.forEach((v) => {
    const synonyms = v.synonyms;
    synonyms.forEach((b) => {
      if (b.includes(inputText)) {
        const li = document.createElement("li");
        li.className = constants.menuItemClass;
        li.setAttribute("tabindex", "0");

        const match = v.tagName.match(/^[^\s]+/);
        const tagName = match[0];
        li.setAttribute("data-tag-name", tagName);
        const parts = splitBySubstring(b, inputText);
        const partsHtml = generateHtml(inputText, parts);

        const liHtmlContent = `${partsHtml} → <span class='synful-tag-name'>${v.tagName}</span>`;
        li.innerHTML = liHtmlContent;

        li.addEventListener("click", (e) => {
          const textContent = searchBoxEl.value;
          const tokens = textContent.split(/\s+/g);
          tokens[tokens.length - 1] = `${tagName} `;
          searchBoxEl.value = tokens.join(" ");
          closeTagMenus();
          searchBoxEl.focus();
          setTimeout(() => {
            searchBoxEl.scrollLeft = searchBoxEl.scrollWidth;
          }, 0);
        });
        li.addEventListener("mouseover", function () {
          this.focus();
        });
        ul.append(li);
      }
    });
  });
  div.append(header.children[0]);
  div.append(ul);
  if (resultsDisplayed) {
    resultsEl.append(div);
  } else {
    insertAfter(div, searchBoxEl);
  }
}

function findObjectBySynonym(searchTerm, objectsArray) {
  return objectsArray.filter((obj) => {
    return obj.synonyms.some((syn) => {
      return syn.includes(searchTerm);
    });
  });
}

function getSyns(html) {
  const root = document.createElement("div");
  root.innerHTML = html;

  const synBlocks = Array.from(root.querySelector(".tagtable").children);
  const synData = synBlocks.map((entry) => {
    const key = entry.querySelector(".colhead").innerText.trim();
    const values = Array.from(entry.querySelectorAll(".rowa,.rowb")).map((e) =>
      e.innerText.trim()
    );
    return {
      tagName: key,
      synonyms: values,
    };
  });
  return synData;
}

function hasWeekPassed(timestamp) {
  const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  const currentTime = Date.now();
  return currentTime - timestamp >= oneWeekInMilliseconds;
}

function extractNumber(str) {
  const match = str.match(/\((\d+)\)/);
  return match ? parseInt(match[1], 10) : 0;
}

function sortSynonyms(unsorted) {
  return unsorted.toSorted((a, b) => {
    return extractNumber(b.tagName) - extractNumber(a.tagName);
  });
}

async function getAllSynonyms() {
  const syncacheText = GM_getValue("emp-tag-syns");
  const syncache = syncacheText ? JSON.parse(syncacheText) : {};
  const url = "https://www.empornium.is/tags.php?action=synonyms";
  if (Object.keys(syncache).length > 0 && !hasWeekPassed(syncache.time)) {
    console.log("Hit cache!");
    return syncache.synonyms;
  }
  return fetch(url)
    .then((response) => response.text())
    .then((data) => {
      const synonyms = getSyns(data);
      const sortedSynonyms = sortSynonyms(synonyms);
      const synData = {
        time: Date.now(),
        synonyms: sortedSynonyms,
      };
      GM_setValue("emp-tag-syns", JSON.stringify(synData));
      return sortedSynonyms;
    });
}

function takeN(arr, num) {
  return arr.slice(0, num);
}

async function renderSynonymMenu(synonymCache, searchBoxEl) {
  // const searchBoxEl = document.querySelector(constants.empSearchBoxId);
  const inputText = searchBoxEl.value;
  // Get the last word
  const lastWord = inputText.split(/\s+/).at(-1);
  const synonymObjs = findObjectBySynonym(lastWord, synonymCache);
  render(lastWord, synonymObjs, searchBoxEl);
}

// Function to simulate keypress event
function simulateKeypress(key, target) {
  const event = new KeyboardEvent("keydown", {
    key: key,
    keyCode: key.charCodeAt(0),
    code: `Key${key.toUpperCase()}`,
    which: key.charCodeAt(0),
    bubbles: true,
  });
  target.focus();
  target.dispatchEvent(event);
}

let selected;
let empMenuText;

// Function to initialize menu navigation
function initMenuNavigation() {
  document.addEventListener("keydown", function (event) {
    currentKeyPressSourceEl = event.target;

    if (event.key === "Escape") {
      escapeKeyPressed = true;
      closeSynFulMenus();
      return;
    }
  });

  // Set focus to the first menu item initially
  const firstMenuItem = document.querySelector(`.${constants.menuItemClass}`);
  if (firstMenuItem) {
    firstMenuItem.focus();
  }
}

const main = async () => {
  const config = { attributes: true, childList: true };
  window.setTimeout(async () => {
    empTagSearchInputBox = currentKeyPressSourceEl;

    // for mutation observer
    targetElement = document.querySelector(constants.empMenuId);

    const allSynonyms = await getAllSynonyms();

    let timeoutId;

    const mutationObserver = new MutationObserver((mutationsList, observer) => {
      const empMenu = document.querySelector(constants.empMenuId);
      for (let mutation of mutationsList) {
        if (escapeKeyPressed) {
          closeSynFulMenus();
          escapeKeyPressed = false;
          return;
        }

        // If Emp menu is closed but Syn menu is open, need to re-render the Syn Menu.
        if (
          mutation.type === "attributes" &&
          mutation.target.id === constants.empMenuIdName &&
          !empMenu.checkVisibility()
        ) {
          mutationObserver.disconnect();
          console.log("rendering synful menu1");
          renderSynonymMenu(allSynonyms, currentKeyPressSourceEl);
          mutationObserver.observe(targetElement, config);
          return;
        }

        if (
          mutation.type === "childList" ||
          (mutation.type === "attributes" && empMenu.checkVisibility())
        ) {
          clearTimeout(timeoutId);

          // clear/set timeout needed to execute only on the last mutation
          timeoutId = setTimeout(async () => {
            mutationObserver.disconnect();
            console.log("rendering synful menu2");
            renderSynonymMenu(allSynonyms, currentKeyPressSourceEl);
            mutationObserver.observe(targetElement, config);
          }, 0);
        }
      }
    });

    initMenuNavigation();

    document.addEventListener("click", (e) => {
      closeSynFulMenus();
    });

    enableMutationObserver = () =>
      mutationObserver.observe(targetElement, config);

    disableMutationObserver = () => mutationObserver.disconnect();

    mutationObserver.observe(targetElement, config);
  }, 200);
};

main();
