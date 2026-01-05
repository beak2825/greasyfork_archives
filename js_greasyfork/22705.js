// ==UserScript==
// @name        Anime History
// @namespace   https://greasyfork.org/en/users/62848-klesus
// @description Highlights episodes that have been visited
// @include     https://twist.moe/a/*
// @version     2.0
// @grant       GM_getValue
// @grant       GM_setValue
// @license     https://www.gnu.org/licenses/gpl-3.0-standalone.html
// @downloadURL https://update.greasyfork.org/scripts/22705/Anime%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/22705/Anime%20History.meta.js
// ==/UserScript==
"use strict";

//wrap script in function scope
(function(){
//------------------------------Init------------------------------
//inject our own styling we're gonna apply
var node = document.createElement('style');
node.innerHTML = '.visited {background-color: #e53232 !important}' +
                 '.edit-Btn {display: inline-block; position: relative; margin-top: 16px; margin-right: 8px; transition: all .2s linear}' +
                 '.edit-on {border-right: 8px solid #e53232; border-left: 0 solid #444}' +
                 '.edit-off {border-left: 8px solid #444; border-right: 0 solid #e53232}' +
                 '.edit-on:active, .edit-off:active {border-right: 8px solid #e53232; border-left: 8px solid #444; transition: all .2s linear}';
document.body.appendChild(node);

//fetch which show we're watching and what episode
var aniep = window.location.pathname.split('/').splice(2);
var anime = aniep[0];
var currentEpisode = parseInt(aniep[1], 10);
var episodeElem = document.querySelector('.episode-list');
var episodeList = episodeElem.children[0].children;
var watchedEpisodes;
var hasMoreButton = (function(){
  var more = document.querySelector(".more");
  return more === null ? 0 : 1;
})();

//fetches watched episode-list
function getEpisodes(show) {
  var episodes = GM_getValue(show, "[]");
  return JSON.parse(episodes);
}

//populates list with watched episodes
function setEpisodes(show, episodes) {
  GM_setValue(show, JSON.stringify(episodes));
}

//check which episodes we've visited
watchedEpisodes = getEpisodes(anime);

//add the current episode to the list, but only if we haven't watched it before
if (!(watchedEpisodes.indexOf(currentEpisode) > -1)) {
  watchedEpisodes.push(currentEpisode);
}

//add the visited class to watched episodes
watchedEpisodes.forEach(function (episode) {
  episodeList[episode - 1 + hasMoreButton].children[0].classList.add('visited');
});

//overwrite the new updated watchlist to localstorage
setEpisodes(anime, watchedEpisodes);
  
//open the full episode-list if any episode after the 8th has been watched
for (var i = 0; i < watchedEpisodes.length; i++) {
  if (watchedEpisodes[i] > 8) {
    document.querySelectorAll(".episode-list")[0].classList.add("show-all");
    break;
  }
}

//----------------------------End init----------------------------
//------------------------Add Edit buttons------------------------
function toggleItem(elem, i) {
	elem.classList.toggle('visited');
  var index = watchedEpisodes.indexOf(i);
  if (index > -1){
    watchedEpisodes.splice(index, 1);
  } else {
  	watchedEpisodes.push(i);
  }
}

var ln = episodeList.length;
function toggleVisit(e) {
  //Don't toggle the more button
  if ((e.target === episodeList[0].children[0] || e.target === episodeList[0].children[0].children[0]) && hasMoreButton == 1) {
    return;
  }
  for (var i = 0; i < ln; i++){
    if (e.target === episodeList[i].children[0] || e.target === episodeList[i].children[0].children[0]){
      toggleItem(episodeList[i].children[0], i + 1 - hasMoreButton);
      setEpisodes(anime, watchedEpisodes);
      break;
    }
  }
  e.stopPropagation();
  e.preventDefault();
}

function resetAll() {
	watchedEpisodes = [];
	for (var i = 0; i < ln; i++){
     episodeList[i].children[0].classList.remove('visited');
  }
	setEpisodes(anime, watchedEpisodes);
}

function invertAll() {
	for (var i = 0; i < ln; i++){
    toggleItem(episodeList[i].children[0], i + 1 - hasMoreButton);
  }
  setEpisodes(anime, watchedEpisodes);
}

var toggle = "off";
function toggleEditMode() {
  if(toggle === "off") {
    toggle = "on";
    editButton.classList.remove('edit-off');
    editButton.classList.add('edit-on');
    episodeElem.children[0].addEventListener('click', toggleVisit, true);
  } else {
    toggle = "off";
    editButton.classList.remove('edit-on');
    editButton.classList.add('edit-off');
    episodeElem.children[0].removeEventListener('click', toggleVisit, true);
  }
}

var editButton = document.createElement('button');
editButton.classList.add("edit-Btn", "edit-off");
editButton.innerHTML = "Edit";
episodeElem.parentNode.insertBefore(editButton, episodeElem);
editButton.addEventListener('click', toggleEditMode);

var resetButton = document.createElement('button');
resetButton.classList.add("edit-Btn");
resetButton.innerHTML = "Reset";
episodeElem.parentNode.insertBefore(resetButton, episodeElem);
resetButton.addEventListener('click', resetAll);

var invertButton = document.createElement('button');
invertButton.classList.add("edit-Btn");
invertButton.innerHTML = "Invert";
episodeElem.parentNode.insertBefore(invertButton, episodeElem);
invertButton.addEventListener('click', invertAll);

//for some reason I have to put this last
//augment native ajax methods
if(viSupported()){
  var tmp = player.queue.load;
  player.queue.load = function(){
    var i = parseInt(arguments[0]) + 1;
    if (!(watchedEpisodes.indexOf(i) > -1)) {
        toggleItem(document.querySelector('.episode-list').children[0].children[i - 1 + hasMoreButton].children[0], i);
        setEpisodes(anime, watchedEpisodes);
    }
    tmp.apply(window.vi, arguments);
  }
}
})();