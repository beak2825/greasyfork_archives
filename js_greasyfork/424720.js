// ==UserScript==
// @name         AO3: [Wrangling] Prevent Curly Quotes
// @description  Prevents canonical tags from being made if they contain curly quotes.
// @version      1.0

// @author       kaerstyne
// @namespace    https://github.com/kaerstyne/ao3-wrangling-scripts
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>

// @match        *://*.archiveofourown.org/tags/*/edit
// @match        *://*.archiveofourown.org/tags/new
// @match        *://*.archiveofourown.org/tags/*/wrangle?*
// @match        *://*.archiveofourown.org/tag_wranglings*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424720/AO3%3A%20%5BWrangling%5D%20Prevent%20Curly%20Quotes.user.js
// @updateURL https://update.greasyfork.org/scripts/424720/AO3%3A%20%5BWrangling%5D%20Prevent%20Curly%20Quotes.meta.js
// ==/UserScript==

function hasCurlyQuote(string) {
  return string.match(/[‘’“”]/);
}

function replaceCurlyQuotes(string) {
  return string.replace(/[‘’]/g, "'").replace(/[“”]/g, "\"");
}

function insertWarning(referenceNode, tag) {
  const warningNode = document.createElement("div");
  warningNode.classList.add("error");
  warningNode.innerHTML = "<h4>Curly quote alert!</h4><p>Use this instead: " + replaceCurlyQuotes(tag) + "</p>";
  return referenceNode.parentNode.insertBefore(warningNode, referenceNode.nextSibling);
}

// tag edit page
if (window.location.pathname.match(/tags\/.+\/edit/)) {
  const tagName = document.getElementById("tag_name");
  const canonicalCheckbox = document.getElementById("tag_canonical");
  const synonymOf = document.querySelector("ul.autocomplete");

  // warn if tag name has curly quotes and canonical checkbox is checked
  canonicalCheckbox.addEventListener("change", () => {
    if (canonicalCheckbox.checked && hasCurlyQuote(tagName.value)) {
      canonicalCheckbox.checked = false;
      canonicalCheckbox.disabled = true;
      insertWarning(tagName, tagName.value);
    }
  });

  // warn if a tag with curly quotes is entered in Synonym Of
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length && mutation.addedNodes[0].classList.contains("tag")) {
        const tagNode = mutation.addedNodes[0];
        const tagValue = tagNode.firstChild.textContent;
        if (hasCurlyQuote(tagValue)) {
          insertWarning(tagNode, tagValue);
        }
      }
      if (mutation.removedNodes.length && mutation.removedNodes[0].classList.contains("tag")) {
        synonymOf.querySelector(".error").remove();
      }
    }
  });
  observer.observe(synonymOf, { childList: true });

// new tag page
} else if (window.location.pathname.match(/tags\/new$/)) {

  // automatically convert to straight quotes when creating a canonical
  document.getElementById("new_tag").addEventListener("submit", (event) => {
    if (event.target.elements.tag_canonical.checked) {
      event.target.elements.tag_name.value = replaceCurlyQuotes(event.target.elements.tag_name.value);
    }
  });

// mass wrangle pages
} else if (window.location.href.match(/tags\/.+\/wrangle\?/) || window.location.pathname.match(/tag_wranglings/)) {

  // remove canonical checkbox for tags with curly quotes
  for (const tag of document.querySelectorAll("tbody tr")) {
    if (hasCurlyQuote(tag.querySelector("th label").innerText)) {
      tag.querySelector("td[title='canonical?']").innerHTML = "Curly Quote";
    }
  }
}
