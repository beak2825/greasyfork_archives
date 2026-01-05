// ==UserScript==
// @name        FIMFiction - Random Story
// @namespace   Selbi
// @include     http*://*fimfiction.net/*
// @version     2.0
// @description Adds a button to jump to a random story page
// @downloadURL https://update.greasyfork.org/scripts/1844/FIMFiction%20-%20Random%20Story.user.js
// @updateURL https://update.greasyfork.org/scripts/1844/FIMFiction%20-%20Random%20Story.meta.js
// ==/UserScript==

let chatButton = document.querySelector(".user_toolbar > ul:first-child > li:last-child");
let randomStoryButton = chatButton.cloneNode(true);
randomStoryButton.onclick = function() {
  randomStoryButton.querySelector("i").classList = "fa fa-spinner fa-spin fa-pulse";
  navigateToRandomStory()
};
randomStoryButton.querySelector("a").href = "#";
randomStoryButton.querySelector("i").classList = "fa fa-random";
randomStoryButton.querySelector("span").innerHTML = "Random Story";
chatButton.after(randomStoryButton);

function navigateToRandomStory() {
  let url = buildRandomStoryHref();
  window.location = url;
}

function buildRandomStoryHref() {
  let storyCount = getApproxTotalStoryCount();
  let url = randomValidStoryUrl(storyCount, 10);
  return url;
}

function getApproxTotalStoryCount() {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', "https://www.fimfiction.net/stories?order=latest", false);
  xhr.send();
  
  // Very dirty, this could be done with fancy XML parsing to find
  // the biggest story ID on the page, but we just care about a very
  // rough estimate count of all stories, so this probably works
  let firstStoryId = (/data-story-id="(\d+)"/m).exec(xhr.responseText)[1];
  return parseInt(firstStoryId);
}

function randomValidStoryUrl(storyCount, attemptsLeft) {
  if (attemptsLeft > 0) {
    let randomStoryId = Math.floor(storyCount * Math.random());
    let url = buildUrl(randomStoryId);
    if (isValidPage(url)) {
      return url;
    }
    return randomValidStoryUrl(storyCount, attemptsLeft - 1);
  }
  return buildUrl(1888); // MLD lul
}

function isValidPage(url) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.send();
  
  if (xhr.status === 200) {
    let title = (/<title>(.*?)<\/title>/m).exec(xhr.responseText)[1];
    return !title.startsWith("Login To Story");
  }
  return false;
}

function buildUrl(id) {
  return "https://www.fimfiction.net/story/" + id;
}
