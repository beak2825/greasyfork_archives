// ==UserScript==
// @name         AO3: Full Navigation Bar
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Adds full navigation bar to AO3.
// @author       sopens
// @match        https://archiveofourown.org/works/*/chapters/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416100/AO3%3A%20Full%20Navigation%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/416100/AO3%3A%20Full%20Navigation%20Bar.meta.js
// ==/UserScript==

// selectedTag exists only when there are several chapters.
var selectedTag = document.getElementById("selected_id");
if (!selectedTag) return;

var ddValue = selectedTag.selectedIndex;
var ddSize = selectedTag.length;
var ddInnerHTML = selectedTag.innerHTML;

var TOP_AND_BOTTOM = false;

// Make hrefs to first and last chapter.
var mainChapterURL = window.location.pathname.split('/').slice(0, 4).join("/") + "/";
var firstHref = mainChapterURL + selectedTag.children[0].value + "#workskin";
var lastHref = mainChapterURL + selectedTag.children[ddSize - 1].value + "#workskin";
var fullPageHref = window.location.pathname.split('/').slice(0, 3).join("/") + "/navigate";

showNavigatorBar();

// Main Functions -------------------------------------------------------------------------

function showNavigatorBar() {
  let topNavBar = document.getElementById("top");
  let btmNavBar = document.getElementById("bottom");

  if (topNavBar != null && btmNavBar != null) return;

  topNavBar = getTopNavBar();
  btmNavBar = getBtmNavBar();

  let navigationTags;

  if (TOP_AND_BOTTOM) {
    navigationTags = [topNavBar, btmNavBar];
  } else {
    showButtonPanel();
    navigationTags = [btmNavBar];
  }

  for (let i = 0; i < navigationTags.length; i++) {
    let firstChapterBtm = createFirstChapterBtm();
    let firstChapterListItem = createListItem(firstChapterBtm, "first");

    let chapterDropdown = createChapterDropdown();
    let chapterDropdownListItem = createListItem(chapterDropdown, "dropdown");

    let lastChapterBtm = createLastChapterBtm();
    let lastChapterListItem = createListItem(lastChapterBtm, "last");

    let fullPageIndexBtm = createFullPageIndexBtm();
    let fullPageIndexListItem = createListItem(fullPageIndexBtm, "full-page-index");

    let navigatorBar = navigationTags[i];
    let entireWorkListItem = navigatorBar.getElementsByClassName("chapter entire")[0];
    let prevChapterListItem = navigatorBar.getElementsByClassName("chapter previous")[0];
    let nextChapterListItem = navigatorBar.getElementsByClassName("chapter next")[0];

    if (ddValue > 1) {
      entireWorkListItem.insertAdjacentElement("afterend", firstChapterListItem);
    }

    if (ddValue == 0) {
      entireWorkListItem.insertAdjacentElement("afterend", chapterDropdownListItem);
    } else {
      prevChapterListItem.insertAdjacentElement("afterend", chapterDropdownListItem);
    }

    if (ddValue < (ddSize - 2)) {
      nextChapterListItem.insertAdjacentElement("afterend", lastChapterListItem);
    }

    if (ddValue == (ddSize - 2)) {
      nextChapterListItem.insertAdjacentElement("afterend", fullPageIndexListItem);
    }

    if (ddValue < (ddSize - 1)) {
      lastChapterListItem.insertAdjacentElement("afterend", fullPageIndexListItem);
    }
  }
}

function showButtonPanel() {
  let buttonPanel = document.getElementById("button_panel");

  if (buttonPanel != null) return;

  let listHeader = document.createElement("dt");
  listHeader.appendChild(document.createTextNode("Navigation Panel:"));

  let listContent = document.createElement("dd");
  let buttonList = document.createElement("ul");
  listContent.appendChild(buttonList);

  buttonPanel = document.getElementsByClassName("work meta group")[0];
  buttonPanel.id = "button_panel";
  buttonPanel.appendChild(listHeader);
  buttonPanel.appendChild(listContent);

  let entireWorkBtm = createEntireWorkBtm();
  addStyle(entireWorkBtm);

  let entireWorkListItem = createListItem(entireWorkBtm, "entire");
  buttonList.appendChild(entireWorkListItem);

  if (ddValue > 1) {
    let firstChapterBtm = createFirstChapterBtm();
    addStyle(firstChapterBtm);

    let firstChapterListItem = createListItem(firstChapterBtm, "first");
    buttonList.appendChild(firstChapterListItem);
  }

  if (ddValue > 0) {
    let prevChapterBtm = createPrevChapterBtm();
    addStyle(prevChapterBtm);

    let prevChapterListItem = createListItem(prevChapterBtm, "previous");
    buttonList.appendChild(prevChapterListItem);
  }

  let chapterDropdown = createChapterDropdown();
  let chapterDropdownListItem = createListItem(chapterDropdown, "dropdown");

  buttonList.appendChild(chapterDropdownListItem);

  if (ddValue < (ddSize - 1)) {
    let nextChapterBtm = createNextChapterBtm();
    addStyle(nextChapterBtm);

    let nextChapterListItem = createListItem(nextChapterBtm, "previous");
    buttonList.appendChild(nextChapterListItem);
  }

  if (ddValue < (ddSize - 2)) {
    let lastChapterBtm = createLastChapterBtm();
    addStyle(lastChapterBtm);

    let lastChapterListItem = createListItem(lastChapterBtm, "last");
    buttonList.appendChild(lastChapterListItem);
  }

  let fullPageIndexBtm = createFullPageIndexBtm();
  addStyle(fullPageIndexBtm);

  let fullPageIndexListItem = createListItem(fullPageIndexBtm, "full-page-index");
  buttonList.appendChild(fullPageIndexListItem);
}

// Global Functions ------------------------------------------------------------------

function getTopNavBar() {
  let navBar = document.getElementById("chapter_index").parentElement.parentElement;
  navBar.id = "top";

  if (!TOP_AND_BOTTOM) {
    let entireWorkListItem = navBar.getElementsByClassName("chapter entire")[0];
    entireWorkListItem.remove();

    let prevChapterListItem = navBar.getElementsByClassName("chapter previous")[0];
    if (prevChapterListItem != null) prevChapterListItem.remove();

    let nextChapterListItem = navBar.getElementsByClassName("chapter next")[0];
    if (nextChapterListItem != null) nextChapterListItem.remove();
  }

  let topListItems = navBar.getElementsByTagName("li");

  for (let i = 0; i < topListItems.length; i++) {
    let topLink = topListItems[i].getElementsByTagName("a")[0];

    if (topLink.text.search("Chapter Index") != -1) {
      topListItems[i].remove();
      break;
    }
  }

  return navBar;
}

function getBtmNavBar() {
  let navBar = document.getElementById("feedback").getElementsByTagName("ul")[0];
  navBar.id = "bottom";

  let btmListItems = navBar.getElementsByTagName("li");

  for (let i = 0; i < btmListItems.length; i++) {
    let btmLink = btmListItems[i].getElementsByTagName("a")[0];

    if (btmLink == null) continue;

    if (btmLink.text.search("Top") != -1) {
      btmListItems[i].className = "chapter entire";
      continue;
    }

    if (btmLink.text.search("Previous") != -1) {
      btmListItems[i].className = "chapter previous";
      continue;
    }

    if (btmLink.text.search("Next") != -1) {
      btmListItems[i].className = "chapter next";
      break;
    }
  }

  return navBar;
}

function createListItem(element, className) {
  let listItem = document.createElement("li");
  listItem.className = "chapter " + className;
  listItem.appendChild(document.createTextNode("\n\n"));
  listItem.appendChild(element);
  listItem.appendChild(document.createTextNode("\n\n"));

  return listItem;
}

function createChapterDropdown() {
  let dropdown = document.createElement("select");
  addStyle(dropdown);
  dropdown.id = "chapter_list";
  dropdown.innerHTML = ddInnerHTML;
  dropdown.style.padding = ".18em .75em";
  dropdown.onchange = function() {
    let selectedValue = this.options[this.selectedIndex].value;
    window.location.href = mainChapterURL + selectedValue + "#workskin";
  }

  return dropdown;
}

function createEntireWorkBtm() {
  let href = window.location.pathname.split('/').slice(0, 3).join("/") + "?view_full_work=true";

  return createBtm(href, "Entire Work");
}  

function createFirstChapterBtm() {
  return createBtm(firstHref, "<< First Chapter");
}  

function createPrevChapterBtm() {
  let href = mainChapterURL + selectedTag.children[ddValue - 1].value + "#workskin";

  return createBtm(href, "< Previous Chapter");
}  

function createNextChapterBtm() {
  let href = mainChapterURL + selectedTag.children[ddValue + 1].value + "#workskin";

  return createBtm(href, "Next Chapter >");
}  

function createLastChapterBtm() {  
  return createBtm(lastHref, "Last Chapter >>");
}  

function createFullPageIndexBtm() {  
  return createBtm(fullPageHref, "Full-page Index");
}  

function createBtm(href, text) {
  let link = document.createElement("a");
  link.href = href;
  link.appendChild(document.createTextNode(text));

  return link;
}

function addStyle(element) {
  element.style.display = "inline-block";
  element.style.verticalAlign = "middle";
  element.style.backgroundColor = "#eee";
  element.style.color = "#444";
  element.style.width = "auto";
  element.style.fontSize = "100%";
  element.style.lineHeight = "1.286";
  element.style.padding = ".25em .75em";
  element.style.whiteSpace = "nowrap";
  element.style.overflow = "visible";
  element.style.position = "relative";
  element.style.cursor = "pointer";
  element.style.textDecoration = "none";
  element.style.backgroundImage = "linear-gradient(#fff 2%,#ddd 95%,#bbb 100%)";
  element.style.border = "1px solid #bbb";
  element.style.borderRadius = ".25em";
  element.style.boxShadow = "none";
  element.style.margin = "0px";
  element.style.font = "inherit";
}



