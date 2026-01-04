// ==UserScript==
// @name         悬停翻译句子
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  鼠标悬停自动翻译句子
// @author       pipizhu
// @match        http*://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license 		 MIT
// @downloadURL https://update.greasyfork.org/scripts/503388/%E6%82%AC%E5%81%9C%E7%BF%BB%E8%AF%91%E5%8F%A5%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/503388/%E6%82%AC%E5%81%9C%E7%BF%BB%E8%AF%91%E5%8F%A5%E5%AD%90.meta.js
// ==/UserScript==

function wrapTextNodes(parent) {
  // Create a document fragment to hold the new structure
  const fragment = document.createDocumentFragment();
  const content = parent.innerHTML;
  function splitSentences(text) {
    if (!text) return [];
    // const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
    // return Array.from(segmenter.segment(text), (segment) => segment.segment);
    const regex =
      /(?=[^])(?:\P{Sentence_Terminal}|\p{Sentence_Terminal}(?!['"`\p{Close_Punctuation}\p{Final_Punctuation}\s]))*(?:\p{Sentence_Terminal}+['"`\p{Close_Punctuation}\p{Final_Punctuation}]*|$)/guy;
    return text.match(regex);
  }
  const sentences = splitSentences(content);

  sentences.forEach((sentence) => {
    const span = document.createElement("span");
    span.className = "sentence";
    span.innerHTML = sentence;
    parent.innerHTML = "";
    fragment.appendChild(span);
    fragment.appendChild(document.createTextNode(" ")); // Add space between sentences
  });

  return fragment;
}

const getDivs = () => {
  const targets = ["#text", "A", "BR"];
  const list = [...document.querySelectorAll("div")].filter(
    (d) =>
      d.textContent &&
      d.textContent.length > 15 &&
      ![...d.childNodes].find((n) => !targets.includes(n.nodeName)),
  );
  console.log("div list", list);
  list.forEach((d) => {
    if (document.documentElement.lang.includes("en")) {
      d.appendChild(wrapTextNodes(d));
    }
  });
};

const translateText = async (text, targetLanguage) => {
  return googleTranslate(text, targetLanguage);
};

const googleTranslate = async (text, targetLanguage) => {
  try {
    const url = `https://translate.googleapis.com/translate_a/t?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(
      text,
    )}&format=html`;
    const response = await fetch(url, {
      method: "POST",
    });
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

function init() {
  getDivs();
  // Get all <p> tags on the page
  const paragraphs = document.querySelectorAll("p, h1, h2, h3, h4");

  // Iterate through each <p> tag
  paragraphs.forEach((paragraph) => {
    if (document.documentElement.lang.includes("en")) {
      paragraph.appendChild(wrapTextNodes(paragraph));
    }
  });

  // Add a style element to the document head for the hover effect
  const style = document.createElement("style");
  style.innerHTML = `
    .sentence {
        position: relative;
        transition: border-bottom-color 0.3s ease;
        cursor: pointer;
    }
    .sentence:hover {
        border-bottom: 2px solid #32CD32; /* Beautiful green */
    }
    .t-popover {
        position: absolute;
        color: black;
        top: 100%;
        width: 100%;
        left: 0;
        min-width: 300px;
        background-color: #fff;
        padding: 5px 10px;
        border: 1px solid #ccc;
        border-radius: 3px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transform: translateY(10px);
        display: none;
    }
    .sentence:hover .t-popover {
        display: block;
    }
`;
  document.head.appendChild(style);

  // Apply the hover effect and translation using JavaScript
  document.querySelectorAll(".sentence").forEach((span) => {
    const greenColor = "#32CD32"; // Beautiful green color

    // Create a popover element
    const popover = document.createElement("div");
    popover.className = "t-popover";
    span.appendChild(popover);

    span.addEventListener("mouseover", function () {
      this.style.borderBottomColor = greenColor;
      // Check if the popover already contains translated text
      if (popover.innerText.trim() !== "") {
        return; // If it does, do nothing
      }

      // Get the original text
      const originalText = this.innerText;
      console.log("span", this.innerText);
      translateText(originalText, "zh")
        .then((data) => {
          console.log("result ", data);
          // Show the translated text in the popover
          popover.innerHTML = data;
        })
        .catch((error) => {
          popover.innerText = "Translation failed";
          console.error("Error:", error);
        });
    });

    span.addEventListener("mouseout", function () {
      this.style.borderBottomColor = "transparent";
    });
  });
}

// Function to handle route changes and initialize the script
const handleRouteChange = () => {
  init();
};

// Call init() on initial page load
init();

// Listen for route changes in single-page applications
if (typeof window.addEventListener === "function") {
  window.addEventListener("popstate", handleRouteChange);
  window.addEventListener("pushState", handleRouteChange);
  window.addEventListener("replaceState", handleRouteChange);
}

// Monkey patch history methods for better SPA support
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function () {
  originalPushState.apply(this, arguments);
  handleRouteChange();
};

history.replaceState = function () {
  originalReplaceState.apply(this, arguments);
  handleRouteChange();
};
