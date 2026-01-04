// ==UserScript==
// @name         Cool papers abstract
// @namespace    http://tampermonkey.net/
// @version      2024-10-22
// @description  Collect paper titles with links to arXiv, sort by keywords, and display them in a single card with ordered numbering, matching margins of the page layout.
// @author       yorhaha
// @match        https://papers.cool/arxiv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=papers.cool
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512932/Cool%20papers%20abstract.user.js
// @updateURL https://update.greasyfork.org/scripts/512932/Cool%20papers%20abstract.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Step 1: Check if URL contains "?show=100", if not, add it
  if (!window.location.href.includes("?show=200")) {
    window.location.href = window.location.href + "?show=200";
    return; // Stop further execution as the page will reload
  }

  // Define the keywords for sorting
  const keywords = [
    "agent",
    "math",
    "reinforcement",
	"tool",
	"coding",
	"code",
	"reason",
	"reward",
	"align",

    "language model",
	"llm",

    "bench",

    "multimodal",
    "mllm",
    "vision language",
    "vision-language",
    "vlm",
    "visual",

    "rag",
    "retrieval-augmented generation",

	"inference",
	"kv cache",
	"efficient",
  ];

  // Step 2: Find all elements with class="title-link" and collect their innerText and IDs
  const titleElements = Array.from(document.querySelectorAll(".title-link")); // Convert NodeList to Array

  // Step 3: Sort titleElements by the presence of keywords
  const sortedTitleElements = titleElements.sort((a, b) => {
    const aTitle = a.innerText.toLowerCase();
    const bTitle = b.innerText.toLowerCase();

    // Function to check how early a keyword appears in the title, -1 if not found
    const getKeywordIndex = (title, keywords) => {
      for (let i = 0; i < keywords.length; i++) {
        const keywordIndex = title.indexOf(keywords[i]);
        if (keywordIndex !== -1) {
          return i; // Return the index of the keyword in the keywords array
        }
      }
      return keywords.length; // Return a large value if no keyword is found
    };

    const aIndex = getKeywordIndex(aTitle, keywords);
    const bIndex = getKeywordIndex(bTitle, keywords);

    return aIndex - bIndex; // Sort based on the earliest keyword match
  });

  // Step 4: Create a single card element to display all titles in a numbered list with links
  const card = document.createElement("div");
  card.style.border = "1px solid #ddd";
  card.style.borderRadius = "8px";
  card.style.padding = "20px";
  card.style.backgroundColor = "#fff";
  card.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
  card.style.marginTop = "20px"; // Add top margin for spacing

  // Create an ordered list <ol> to display the titles with numbering and links
  const ol = document.createElement("ol");
  ol.style.paddingLeft = "20px"; // Ensure proper indentation

  sortedTitleElements.forEach((element) => {
    const title = element.innerText; // Get the title text
    const arxivId = element.id.split("title-")[1]; // Extract the arXiv ID from the id attribute
    const arxivLink = `https://arxiv.org/abs/${arxivId}`; // Construct the arXiv URL

    // Create the list item <li>
    const li = document.createElement("li");
    li.style.marginBottom = "10px"; // Add space between each title

    // Create the anchor <a> element with the arXiv link
    const a = document.createElement("a");
    a.href = arxivLink;
    a.innerText = title;
    a.target = "_blank"; // Open link in a new tab
    a.style.textDecoration = "none";
    // a.style.color = '#1a0dab';
    a.style.color = "black";

    // Append the anchor <a> to the list item <li>
    li.appendChild(a);

    // Append the list item <li> to the ordered list <ol>
    ol.appendChild(li);
  });

  card.appendChild(ol);

  // Step 5: Insert the card before the element with class="papers"
  const papersElement = document.querySelector(".papers");
  if (papersElement) {
    papersElement.parentNode.insertBefore(card, papersElement);
  }

  // Step 6: Match the left and right margins of the first child of "#arxiv > div.papers"
  const firstChild = document.querySelector(
    "#arxiv > div.papers"
  ).firstElementChild;
  if (firstChild) {
    const computedStyle = window.getComputedStyle(firstChild);
    card.style.marginLeft = computedStyle.marginLeft;
    card.style.marginRight = computedStyle.marginRight;
  }
})();
