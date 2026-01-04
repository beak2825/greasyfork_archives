// ==UserScript==
// @name The Crag, Only Sport
// @description A script for filtering trad climbs on the crag.
// @locale en
// @namespace Violentmonkey Scripts
// @match https://www.thecrag.com/*
// @grant none
// @version 0.0.1.20190821021024
// @downloadURL https://update.greasyfork.org/scripts/389200/The%20Crag%2C%20Only%20Sport.user.js
// @updateURL https://update.greasyfork.org/scripts/389200/The%20Crag%2C%20Only%20Sport.meta.js
// ==/UserScript==
const storeValue = (key, value) => localStorage.setItem(key, value);
const getValue = (key) => {
  const json = localStorage.getItem(key);
  if (!json) return;
  
  return JSON.parse(json);
}

let showingTrad = getValue('showingTrad');

const addTradFilterButton = () => {
  const group = document.querySelector(".node-listview .btn-group-group");
  const button = document.createElement("small");
  button.className = "btn-group inline"
  
  const updateTradButton = () => {
    button.innerHTML = `
      <a class="btn btn-mini">
        <i class="icon-${showingTrad ? "minus" : "plus"}-sign"></i>
        ${showingTrad ? "Hide" : "Show"} Trad Routes
      </a>`;
  };

  button.addEventListener('click', () => {
    showingTrad = !showingTrad;
    setTradRouteVisibility(showingTrad);
    
    updateTradButton();
    storeValue('showingTrad', showingTrad);
  });
  
  updateTradButton();
  
  group.appendChild(button);
}

const getTradRoutes = () => {
  return Array.from(document.querySelectorAll('.title .tags.trad')).map(tag => tag.parentNode.parentNode.parentNode.parentNode.parentNode);
}

const setTradRouteVisibility = (visible) => {
  getTradRoutes().forEach(r => r.setAttribute("style", visible ? "" : "display: none;"))
}

setTradRouteVisibility(showingTrad);
addTradFilterButton();
