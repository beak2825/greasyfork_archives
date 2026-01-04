// ==UserScript==
// @name        Github Stargazers
// @namespace   Violentmonkey Scripts
// @match       *://github.com/*/*
// @grant       none
// @version     1.0.1
// @author      Der_Floh
// @description Adds a tab to every Repository with which you can see which people have starred your Repository
// @license     MIT
// @icon        https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png
// @homepageURL https://greasyfork.org/de/scripts/468804-github-stargazers
// @supportURL  https://greasyfork.org/de/scripts/468804-github-stargazers/feedback
// @downloadURL https://update.greasyfork.org/scripts/468804/Github%20Stargazers.user.js
// @updateURL https://update.greasyfork.org/scripts/468804/Github%20Stargazers.meta.js
// ==/UserScript==

// jshint esversion: 8
console.info(`%cRunning: ${GM_info.script.name} v${GM_info.script.version}`, 'color: DodgerBlue');



const icon = '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star d-inline-block mr-2"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path></svg>';
createTabElem("Stars", icon, (event) => {
  const currentLocation = window.location.toString();
  const subpage = "stargazers";
  const link = `/${getUsername(currentLocation)}/${getRepositoryname(currentLocation)}/${subpage}`;
  window.location.href = link;
});



// | ------------+-------------------+------------ |
// | ------------|  Given Functions  |------------ |
// V ------------+-------------------+------------ V

/**
 * Gets the username of a github url
 * @param {string} url - The url from which to get the username
 * @returns {string} The username of the given github url
 */
function getUsername(url) {
  const parsedUrl = new URL(url);
  const pathSegments = parsedUrl.pathname.split('/');

  if (pathSegments.length >= 3)
    return pathSegments[1];

  return null;
}

/**
 * Gets the repositoryname of a github url
 * @param {string} url - The url from which to get the repositoryname
 * @returns {string} The repositoryname of the given github url
 */
function getRepositoryname(url) {
  const parsedUrl = new URL(url);
  const pathSegments = parsedUrl.pathname.split('/');

  if (pathSegments.length >= 3)
    return pathSegments[2];

  return null;
}

/**
 * Adds a new Tab to a Repository Page
 * @param {string} name - The name of the tab
 * @param {Element} svg - The svg element that specifies the icon of the tab
 * @param {Function} callback - function that specifies what should happen
 * @returns {Element} The created Tab
 */
async function createTabElem(name, svg, callback) {
  const isStargazers = await handleLocalStorage(name);
  const menubar = document.querySelector('ul[class="UnderlineNav-body list-style-none"]');
  const id = menubar.querySelectorAll('li[class="d-inline-flex"]').length;
  let li = document.createElement("li");
  li.dataset.dataViewComponent = true;
  const a = document.createElement("a");
  a.id = name.toLowerCase() + "-tab";
  a.dataset.tabItem = `i${id}${name}-tab`;
  a.dataset.pjax = "#repo-content-pjax-container";
  a.dataset.turboFrame = "repo-content-turbo-frame";
  a.dataset.hotkey = "g c";
  a.dataset.analyticsEvent = '{"category":"Underline navbar","action":"Click tab","label":"Settings","target":"UNDERLINE_NAV.TAB"}';
  a.dataset.viewComponent = "true";
  a.classList.add("UnderlineNav-item", "no-wrap", "js-responsive-underlinenav-item", "js-selected-navigation-item");
  a.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.setItem(name.toLowerCase(), true);
    callback(event);
  });
  if (isStargazers)
    a.setAttribute("aria-current", "page");

  if (svg && svg != "") {
    let svgElem;
    if (isElement(svg)) {
      svgElem = svg.cloneNode(true);
    } else if (svg.startsWith("http")) {
      svgElem = document.createElement("img");
      svgElem.src = svg;
    } else {
      svgElem = document.createElement("div");
      svgElem.innerHTML = svg;
      svgElem.style.display = "flex";
      svgElem.style.justifyContent = "center";
      svgElem.style.alignItems = "center";
    }
    svgElem.style.maxWidth = "16px";
    svgElem.style.maxHeight = "16px";
    a.appendChild(svgElem);
  }
  const span1 = document.createElement("span");
  span1.dataset.content = name;
  span1.textContent = name;
  a.appendChild(span1);
  const span2 = document.createElement("span");
  span2.id = "code-repo-tab-count";
  span2.dataset.pjaxReplace = "";
  span2.dataset.turboReplace = "";
  span2.title = "Not available";
  span2.dataset.viewComponent = true;
  span2.classList.add("Counter");
  a.appendChild(span2);
  li.appendChild(a);
  menubar.appendChild(li);
  return li;
}

/**
 * Handles the current selected tab inside the localStorage
 * @param {string} tabName - The tabname to handle
 * @returns {boolean} True if the tab is selected
 */
async function handleLocalStorage(tabName) {
  const isStargazers = localStorage.getItem(tabName.toLowerCase()) == "true";
  if (isStargazers)
    localStorage.removeItem(tabName.toLowerCase());

  window.addEventListener("load", () => {
    if (!isStargazers)
      return;
    const tab = document.getElementById(tabName.toLowerCase() + "-tab");
    const intervalId = setInterval(() => {
      if (tab.getAttribute("aria-current") == "page")
        clearInterval(intervalId);
      if (isStargazers)
        tab.setAttribute("aria-current", "page");
    }, 10);
  });

  return isStargazers;
}

/**
 * Checks wether a variable is an Element
 * @param {object} variable - The variable to check
 * @returns {boolean} True if variable is an Element
 */
function isElement(variable) {
  return variable instanceof Element;
}
