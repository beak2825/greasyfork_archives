// ==UserScript==
// @name         MAM Audible Upload
// @namespace    https://greasyfork.org/en/users/886084
// @version      1.0.3
// @license      MIT
// @description  Adds button to copy audiobook data as json to Audible page and opens MAM upload
// @author       DrBlank
// @include      https://www.audible.com/pd/*
// @include      https://www.audible.com/ac/*
// @include      https://www.audible.in/pd/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504778/MAM%20Audible%20Upload.user.js
// @updateURL https://update.greasyfork.org/scripts/504778/MAM%20Audible%20Upload.meta.js
// ==/UserScript==

const RIPPER = "Libation"; // yours can be InAudible or Blank if Encoded
const CHAPTERIZED = true; // yours will be false if not properly ripped

const AVAILABLE_CATEGORIES = [
  "Art",
  "Biographical",
  "Business",
  "Crafts",
  "Fantasy",
  "Food",
  "History",
  "Horror",
  "Humor",
  "Instructional",
  "Juvenile",
  "Language",
  "Medical",
  "Mystery",
  "Nature",
  "Philosophy",
  "Recreation",
  "Romance",
  "Self-Help",
  "Western",
  "Young Adult",
  "Historical Fiction",
  "Literary Classics",
  "Science Fiction",
  "True Crime",
  "Urban Fantasy",
  "Action/Adventure",
  "Computer/Internet",
  "Crime/Thriller",
  "Home/Garden",
  "Math/Science/Tech",
  "Travel/Adventure",
  "Pol/Soc/Relig",
  "General Fiction",
  "General Non-Fic",
];

function getTitle() {
  let title = document.getElementsByTagName("h1")[0].innerText;
  return title;
}

function getSubtitle() {
  let sLoggedIn = document.querySelector(".subtitle");
  let sLoggedOut = document.querySelector("span.bc-size-medium");
  let subtitle = "";
  if (sLoggedIn) {
    subtitle = sLoggedIn.innerText;
  } else if (sLoggedOut) {
    subtitle = sLoggedOut.innerText;
  }

  if (!subtitle) return "";

  let series = getSeriesName().toLowerCase();
  let isSubtitleSeries = Boolean(
    series && subtitle.toLocaleLowerCase().includes(series)
  );
  if (isSubtitleSeries) return "";

  return subtitle;
}

function getTitleAndSubtitle() {
  let subtitle = getSubtitle();
  if (subtitle) {
    return `${getTitle()}: ${subtitle}`;
  }
  return getTitle();
}

function getAuthors() {
  let authorElements = document.querySelectorAll(".authorLabel a");
  let authors = [];
  for (let index = 0; index < authorElements.length; index++) {
    authors[index] = authorElements[index].innerHTML.replace(
      / - (foreword|afterword|translator|editor)/gi,
      ""
    );
  }
  return authors;
}

function getNarrators() {
  let narratorElements = document.querySelectorAll(".narratorLabel a");
  let narrators = [];
  for (let index = 0; index < narratorElements.length; index++) {
    narrators[index] = narratorElements[index].innerHTML;
  }
  return narrators;
}

function getSeriesName() {
  let series = "";
  let seriesElement = document.querySelector(".seriesLabel");
  if (seriesElement) {
    series = seriesElement.querySelector("a").innerHTML;
  }
  return series;
}

function getSeriesBookNumber() {
  let bookNumber = "";
  if (!getSeriesName()) {
    return "";
  }
  let seriesElement = document.querySelector(".seriesLabel");
  let patt = /Book\s*?(\d+\.?\d*-?\d*\.?\d*)/g;
  bookNumber = patt.exec(seriesElement.innerHTML);

  if (!bookNumber) {
    return "";
  }
  return bookNumber[1];
}

function getLanguage() {
  let languageElement = document.querySelector(".languageLabel");
  let patt = /\s*(\w+)$/g;
  let matches = patt.exec(languageElement.innerHTML.trim());
  return matches[1];
}

function getRunTime() {
  let runtimeElement = document.querySelector(".runtimeLabel").textContent;
  /* clean up unnecessary parts of string */
  let patt = new RegExp("Length:\n\\s+(\\d[^\n]+)");
  let matches = patt.exec(runtimeElement);
  /* The first capture group contains the actual runtime */
  return matches[1];
}

function getBookCover() {
  return document.querySelector(".bc-image-inset-border").src;
}

function getAudibleCategory() {
  let categoryElement = document.querySelector(".categoriesLabel");
  if (categoryElement) return categoryElement.innerText;

  categoryElement = document.querySelector("nav.bc-breadcrumb");
  if (categoryElement) return categoryElement.innerText;

  return "";
}

function getMAMCategory() {
  /* TODO: Implement guessing of categories */
  let audibleCategory = getAudibleCategory().toLowerCase();
  let guesses = [];
  AVAILABLE_CATEGORIES.forEach((category) => {
    if (audibleCategory.includes(category.toLowerCase())) {
      guesses.push(`Audiobooks - ${category}`);
      return;
    }

    let separators = ["/", " "];
    separators.forEach((separator) => {
      let splits = category.split(separator);
      splits.forEach((split) => {
        if (audibleCategory.includes(split.toLowerCase())) {
          guesses.push(`Audiobooks - ${category}`);
          return;
        }
      });
    });
  });
  if (guesses.length) return guesses[0];
  return "";
}

function getDescription() {
  let element = document.querySelector(
    ".productPublisherSummary>div>div>span"
  );
  if (element == null) {
    return "";
  }
  /* In order: Remove excess whitespace, replace double quotes, remove empty p elements, add line break after every paragraph, and every list */
  return element.innerHTML
    .replace(/\s+/g, " ")
    .replace(/"/g, "'")
    .replace(/<p><\/p>/g, "")
    .replace(/<\/p>/g, "</p><br>")
    .replace(/<\/ul>/g, "</ul><br>");
}

function getReleaseDate() {
  let element = document.querySelector(".releaseDateLabel");
  let patt = /\d{2}-\d{2}-\d{2}/;
  let matches = patt.exec(element.innerText);
  return matches ? matches[0] : "";
}

function getPublisher() {
  return document.querySelector(".publisherLabel>a").innerText;
}

function getAdditionalTags() {
  let raw_tags = [];
  raw_tags.push(`Duration: ${getRunTime()}`);

  if (CHAPTERIZED) raw_tags.push("Chapterized");

  if (RIPPER) raw_tags.push(`${RIPPER} True Decrypt`);

  raw_tags.push(
    `Audible Release: ${getReleaseDate()}`,
    `Publisher: ${getPublisher()}`,
    getAudibleCategory()
  );
  // let tags = `Duration: ${getRunTime()} | Chapterized | Libation True Decrypt | ${getAudibleCategory()} | Audible Release: ${getReleaseDate()} | Publisher: ${getPublisher()}`;
  // return tags;
  return raw_tags.join(" | ");
}

function getSeries() {
  let seriesName = getSeriesName();
  if (seriesName) {
    let bookNumber = getSeriesBookNumber();
    return [{ name: seriesName, number: bookNumber }];
  }
  return [];
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      window.open("https://www.myanonamouse.net/tor/upload.php", "_blank");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

let buttonStr = `<div id="" class="bc-row bc-spacing-top-s1">
  <div class="bc-row">
    <div class="bc-trigger bc-pub-block">
      <span class="bc-button bc-button-primary">
        <button
          id="upload-to-mam"
          class="bc-button-text"
          type="button"
          tabindex="0" title="Copy book details as JSON"
        >
          <span class="bc-text bc-button-text-inner bc-size-action-large">
            Copy as JSON
          </span>
        </button>
      </span>
    </div>
  </div>
  </div>
  `;

let foo = document.createElement("foo");
foo.innerHTML = buttonStr.trim();

let button = foo.firstChild;
document.querySelector("#adbl-buy-box").appendChild(button);

button.addEventListener("click", function (event) {
  copyTextToClipboard(
    JSON.stringify({
      authors: getAuthors(),
      description: getDescription(),
      narrators: getNarrators(),
      tags: getAdditionalTags(),
      thumbnail: getBookCover(),
      title: getTitleAndSubtitle(),
      language: getLanguage(),
      series: getSeries(),
      category: getMAMCategory(),
    })
  );
});
