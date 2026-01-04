// ==UserScript==
// @name         Fanfiction.net: Chapter Navigation Bar
// @namespace    https://greasyfork.org/en/users/705154-ben-jackson
// @version      4.5
// @description  Adds navigation bar to multi-chapter stories in Fanfiction.net.
// @author       sopens
// @match        https://www.fanfiction.net/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416788/Fanfictionnet%3A%20Chapter%20Navigation%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/416788/Fanfictionnet%3A%20Chapter%20Navigation%20Bar.meta.js
// ==/UserScript==

(function() {
  var topNavBar = document.getElementById("top");
  var btmNavBar = document.getElementById("bottom");

  if(topNavBar != null && btmNavBar != null) return;

  // Only multi-chapter stories has <SELECT> tags.
  var chapSelectTags = document.getElementsByTagName("SELECT");

  if (!chapSelectTags.length) {
    let allReviewsBtn = createReviewButton("All Reviews", true);

    let td = document.createElement("td");
    td.colSpan = "2";
    td.style.textAlign = "right";
    td.appendChild(allReviewsBtn);

    let tr = document.createElement("tr");
    tr.appendChild(td);

    let reviewSection = document.getElementById("review_review").parentElement.parentElement.parentElement;
    reviewSection.id = "tobdy";
    reviewSection.insertBefore(tr, reviewSection.childNodes[0]);

    return;
  }

  var currentChapter = Number(chapSelectTags[0][chapSelectTags[0].selectedIndex].value);
  var lastChapter = Number(chapSelectTags[0][chapSelectTags[0].length - 1].value);

  // Get data to make links
  var urlArr = window.location.href.split("/");
  var location = [urlArr.slice(0, 5).join("/"), "{0}", urlArr[6]].join("/");
  var reviewBaseLocation = [urlArr.slice(0, 3).join("/"), "r", urlArr[4]].join("/");
  var reviewLocation = [reviewBaseLocation, "{0}", 1].join("/");
  var ids = ["top", "bottom"];

  for (let i = 0; i < chapSelectTags.length; i++) {
    let navigatorBar = document.createElement("ul");
    navigatorBar.style.margin = "0px";
    navigatorBar.style.padding = "0px";

    let dropdown = chapSelectTags[i];
    let btnPrevChapter = dropdown.previousElementSibling;
    let btnNextChapter = dropdown.nextElementSibling;
    let parentNode = dropdown.parentNode;
    parentNode.id = ids[i];
    parentNode.style.float = "unset";
    parentNode.style.display = "block";
    parentNode.style.width = "100%";
    parentNode.style.textAlign = "right";
    parentNode.style.marginTop = "10px";

    if (currentChapter > 2) {
      let btnFirstChapter = createChapterButton("<< First", 1);
      let firstChapterListItem = createListItem("firstChapter", btnFirstChapter);
      navigatorBar.appendChild(firstChapterListItem);
    }

    if (currentChapter > 1) {
      let prevChapterListItem = createListItem("prevChapter", btnPrevChapter);
      navigatorBar.appendChild(prevChapterListItem);
    }

    let dropdownListItem = createListItem("chapters", dropdown);
    navigatorBar.appendChild(dropdownListItem);

    if (currentChapter < lastChapter) {
      let nextChapterListItem = createListItem("nextChapter", btnNextChapter);
      navigatorBar.appendChild(nextChapterListItem);
    }

    if (currentChapter < (lastChapter - 1)) {
      let btnLastChapter = createChapterButton("Last >>", lastChapter);
      let lastChapterListItem = createListItem("lastChapter", btnLastChapter);
      navigatorBar.appendChild(lastChapterListItem);
    }

    let chapterReviewsBtn = createReviewButton("Chapter " + currentChapter + " Reviews", false);
    let chapterReviewsListItem = createListItem("chapterReviews", chapterReviewsBtn);
    navigatorBar.appendChild(chapterReviewsListItem);

    let allReviewsBtn = createReviewButton("All Reviews", true);
    let allReviewsListItem = createListItem("allReviews", allReviewsBtn);
    navigatorBar.appendChild(allReviewsListItem);

    parentNode.appendChild(navigatorBar);
  }

  // Global Functions ---------------------------------------------------------

  function createButton(title) {
    let button = document.createElement("button");
    button.appendChild(document.createTextNode(title));
    button.className = "btn";

    return button;
  }

  function createChapterButton(title, chapter) {
    let button = createButton(title);
    button.onclick = function() {
      window.location.href = location.replace("{0}", chapter);
    }

    return button;
  }

  function createReviewButton(title, flagAllReviews) {
    let button = createButton(title);
    button.onclick = function() {
      let link;

      if (flagAllReviews) {
        link = reviewBaseLocation.concat("/");
      } else {
        link = reviewLocation.replace("{0}", chapter);
      }

      window.open(link, "_blank");
    }

    return button;
  }

  function createListItem(id, element) {
    let listItem = document.createElement("li");
    listItem.id = id;
    listItem.style.listStyle = "none";
    listItem.style.display = "inline-block";
    listItem.style.verticalAlign = "middle";
    listItem.style.marginLeft = "5px";
    listItem.appendChild(element);

    return listItem;
  }
})();
