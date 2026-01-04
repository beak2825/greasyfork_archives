// ==UserScript==
// @name         Tofugu Latest
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Wanikani dashboard extension to display latest articles from tofugu.com
// @author       Rex Walters (Rrwrex rw [at] pobox.com)
// @match        http*://wanikani.com
// @match        http*://www.wanikani.com
// @match        http*://preview.wanikani.com
// @match        http*://wanikani.com/dashboard
// @match        http*://www.wanikani.com/dashboard
// @match        http*://preview.wanikani.com/dashboard
// @license      MIT-0 https://opensource.org/licenses/MIT-0
// @copyright    2023 Rex Robert Walters
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432428/Tofugu%20Latest.user.js
// @updateURL https://update.greasyfork.org/scripts/432428/Tofugu%20Latest.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /*
   * User-modifiable variables
   */

  // How many articles do we want to display?
  const numberOfArticles = 3;

  // Log debugging info to the console?
  const debug = false;

  /*
   * End of user-modifiable variables
   */

  if (debug) {
    console.log("Loading Tofugu Latest");
  }

  // Styling
  const tlCSS = `
    .tofugu-latest {
      display: flex;
      font-family: "Ubuntu", Helvetica, Arial, sans-serif;
      font-size: 14px;
      background-color: var(--ED-surface-2, #d5d5d5);
      border-radius: 5px;
      padding: 5px;
      justify-content: space-between;
      align-content: center;
    }
    .tofugu-latest a {
      flex-basis: 20%;
      padding: 10px;
      display: flex;
      align-items: center;
    }
    .tofugu-latest table {
      flex-basis: 80%;
      width: 100%;
    }
    .tofugu-article a {
      display: block;
      text-decoration: none;
      text-align: left;
      color: var(--ED-text, #222222);
      }
    .tofugu-article a:visited {
      color: #999;
    }
    .tofugu-article a:hover {
      color: var(--ED-brand, #e50036);
    }
    td.tofugu-age {
      color: var(--ED-grayed, #999);
      text-align: left;
      padding-left: 1rem;
    }
    @media (max-width: 400px) {
      .tofugu-article a {
        width: 15em;
        padding: 3px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    @media (max-width: 380px) {
      .tofugu-article a {
        width: 10em;
        padding: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  `;

  // Append our styling to the head of the doucment
  const tlStyle = document.createElement("style");
  tlStyle.id = "tofuguLatest";
  tlStyle.innerHTML = tlCSS;
  document.querySelector("head").append(tlStyle);

  // Find an XML element by tag name
  function tag(entry, tagName) {
    return entry.getElementsByTagName(tagName)[0];
  }

  // today's date
  const today = new Date();

  // Determine how old an article entry is in days
  function daysAgo(entry) {
    let publishedDate = new Date(tag(entry, "published").textContent);
    let diff = (today.getTime() - publishedDate.getTime()) / (1000 * 3600 * 24); // divide by # milliseconds per day
    return Math.round(diff);
  }

  // Parse the feed xml, returning an array of table rows
  function parseXml(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const html = Array.from(xmlDoc.getElementsByTagName("entry")).map(
      (entry) => `<tr>
        <td class="tofugu-article">
          <a href="${tag(entry, "link").getAttribute("href")}">${
        tag(entry, "title").innerHTML
      }</a>
        </td>
      <td class="tofugu-age">${daysAgo(entry)}d</td>
      </tr>`
    );

    return html;
  }

  // The html to wrap our table
  const tlHTML = `
    <a href="https://www.tofugu.com">
      <img
        src="https://www.tofugu.com/images/layout/tofugu-text-logo-fbbfa75f.png"
        alt="tofugu logo"
      />
    </a>
    <table class="tofuguBlog">
    </table>
  `;

  // Now parse the feed from Tofugu and add it to the page
  fetch("https://www.tofugu.com/feed.xml")
    .then((response) => response.text())
    .then((xml) => {
      if (debug) {
        console.log("TL: parsing xml");
      }

      // parse the Tofugu feed.xml document
      const tableRows = parseXml(xml);

      // Create a section to hold the table
      const tlSection = document.createElement("Section");
      tlSection.classList.add("tofugu-latest");
      tlSection.innerHTML = tlHTML;

      // Add the most recent items from the feed to the html
      for (let i in tableRows.slice(0, numberOfArticles)) {
        let tr = document.createElement("tr");
        tr.innerHTML = tableRows[i];
        tlSection.querySelector(".tofuguBlog").append(tr);
      }

      if (debug) {
        console.log("TL: inserting tlSection");
      }

      // Now add our new div at the just before the forum list
      document.querySelector(".community-banner").before(tlSection);

      if (debug) {
        console.log("TL: exit");
      }
    });
})();
