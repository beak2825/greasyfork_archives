// ==UserScript==
// @name         "Search with Reddit / HN" on Google
// @version      1.1
// @description  Adds a button to search Reddit posts with Google (inspired from Mario Ortiz)
// @author       Mael Primet
// @include      http*://www.google.*/search*
// @include      http*://google.*/search*
// @icon         https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png
// @license      MIT
// @run-at       document-end
// @namespace https://greasyfork.org/users/1366101
// @downloadURL https://update.greasyfork.org/scripts/507941/%22Search%20with%20Reddit%20%20HN%22%20on%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/507941/%22Search%20with%20Reddit%20%20HN%22%20on%20Google.meta.js
// ==/UserScript==

const queryRegex = /q=[^&]+/g;
const siteRegex = /\+site(?:%3A|\:).+\.[^&+]+/g;
const sitePrefix = '+site%3A';

(function () {
 // Creating the 'Search on Reddit' button
  const container = document.createElement('div');
  container.className = "search-btns-container";
  const listDiv = document.createElement('div');
  listDiv.className = "serach-btns-list";
  container.appendChild(listDiv);

  // Insert the button after the .logo element
  const insertEl = document.querySelector('.main');
  insertEl.parentNode.insertBefore(container, insertEl);

  // Add external CSS styling via <style> element
  const style = document.createElement('style');
  style.innerHTML = `
    .search-btns-container {
      display:flex;
      flex-direction:column;
      align-items:center;
      padding-top: 10px;
    }
    a.search-btn {
      display: inline-block;
      border-radius: 8px;
      padding: 10px 20px;
      color: white;
      text-decoration: none;
      font-family: sans-serif;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      margin: 0 5px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    a.search-btn:hover {
      opacity: 0.8;
      text-decoration: underline;
    }
  `;
  document.head.appendChild(style);

  const links = [
    {
      name: "Reddit",
      icon: "https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-60x60.png",
      site: "reddit.com",
      color: "#0057FF",
    },
    {
      name: "Hacker News",
      icon: "https://news.ycombinator.com/y18.svg",
      site: "news.ycombinator.com",
      color: "#FF5700",
    }
  ];

  links.forEach((siteLink) => {
    const link = document.createElement('a');
    link.className = 'search-btn';
    link.style.cssText = `background-color:${siteLink.color}`;

    //const icon = document.createElement('img');
    //icon.style.cssText = 'height:16px;width:16px;margin-right:8px;display:inline-block;';
    //icon.src = siteLink.icon;
    //link.appendChild(icon);

    link.appendChild(document.createTextNode('Search on ' + siteLink.name));
    link.href = window.location.href.replace(queryRegex, (match) => {
        return match.search(siteRegex) >= 0 ? match.replace(siteRegex, sitePrefix + siteLink.site) : match + sitePrefix + siteLink.site;
    });

    // Add the icon and the text to the link
    listDiv.appendChild(link);
  });
})();
