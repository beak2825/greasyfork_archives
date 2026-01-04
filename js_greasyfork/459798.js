// ==UserScript==
// @name         Better R34
// @namespace    https://rule34.xxx/index.php
// @version      0.5
// @description  Adds Next/Back button to rule34s Post site
// @author       <Nom/>#4491
// @match        https://rule34.xxx/index.php?page=post*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459798/Better%20R34.user.js
// @updateURL https://update.greasyfork.org/scripts/459798/Better%20R34.meta.js
// ==/UserScript==

(function() {
  //TODO: when navigating back to a post load previous postIDs & middleclick doesnt work scroll mobile scroll = next/back
  'use strict';

  //CONFIG:-------------------------
  const setKeybinds = true;
  //--------------------------------


  let currPostID = 0;
  let postIDs = localStorage.postIDs ? JSON.parse(localStorage.postIDs): [];
  let postOffset = localStorage.postOffset ? +JSON.parse(localStorage.postOffset) : 0;

  Element.prototype.getTreeElementByClass = function(className) {
    if (!this.parentElement) { return null; }
    if (this.classList.contains(className)) { return this; }
    else { return this.parentElement.getTreeElementByClass(className); }
  }

  async function createNavDiv(){
    let linkDiv = document.createElement("h4");
    linkDiv.innerHTML =
        `<a id="prevBtn" ${ !await getPrevPostID() ? '' : 'href=https://rule34.xxx/index.php?page=post&s=view&id='+await getPrevPostID() }><< Back</a>` +
        " | " +
        `<a id="nextBtn" ${ !await getNextPostID() ? '' : 'href=https://rule34.xxx/index.php?page=post&s=view&id='+await getNextPostID() }>Next >></a>`;
    linkDiv.classList.add("image-sublinks");
    return document.getElementsByClassName("image-sublinks")[0].insertBefore(linkDiv, null);
  }

  async function getPrevPostID(){
    if(postIDs.indexOf(currPostID)-1 === -1){ //previous site or first post of search
      await loadPrevPostIDs();
      return postIDs[postIDs.indexOf(currPostID)-1];
    }else{
      return postIDs[postIDs.indexOf(currPostID)-1];
    }
  }

  async function getNextPostID(){
    const currIndex = postIDs.indexOf(currPostID);
    if(currIndex+1 > postIDs.length-1){ //load more posts or last post of search
      await loadNextPostIDs();
      return postIDs[currIndex + 1];
    }else{
      return postIDs[currIndex+1];
    }
  }

  async function loadNextPostIDs(){
    if(localStorage.prompt){
      const response = await fetch(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=42&pid=${(postIDs.length+postOffset)/42}&${JSON.parse(localStorage.prompt)}`)
      await response.json().then((jsonR) => {
        if(jsonR.length === 0){
          console.log("last post reached");
          return;
        }
        console.log("load next postIDs");
        postIDs.push(...jsonR.map((post) => post.id.toString()));
        localStorage.postIDs = JSON.stringify(postIDs);
      })
    }
  }

  async function loadPrevPostIDs(){
    if(localStorage.prompt && postOffset > 0){
      console.log("load prev postIDs");
      const response = await fetch(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=42&pid=${(postIDs.length+postOffset)/42-2}&${JSON.parse(localStorage.prompt)}`)
      await response.json().then((jsonR) => {
        postIDs.unshift(...jsonR.map((post) => post.id.toString()));
        localStorage.postIDs = JSON.stringify(postIDs);
      });
    }else {
      console.log("first Post");
    }
  }

  //MAIN:
  if(window.location.search.includes("s=view")){ //post-view
    currPostID = window.location.href.match("id=([^&]+)")[1];
    createNavDiv().then(() => {
      if(setKeybinds){
        window.addEventListener("keydown", (event) => {
          if (event.code === "ArrowLeft") {
            document.getElementById("prevBtn").click();
          } else if (event.code === "ArrowRight") {
            document.getElementById("nextBtn").click();
          }
        })
      }
    });
  } else if(window.location.search.includes("s=list")){ //list-view
    localStorage.removeItem("postIDs");
    localStorage.removeItem("prompt");
    localStorage.removeItem("postOffset");
    [...document.getElementsByClassName("thumb")].forEach((elm) => {
      elm.addEventListener("click", () => {
        const postIDs = [...document.getElementsByClassName("thumb")].map((elm) => elm.id.slice(1));
        localStorage.postIDs = JSON.stringify(postIDs);
        localStorage.prompt = JSON.stringify(window.location.href.match("tags=([^&]+)")[0]);
        localStorage.postOffset = JSON.stringify(window.location.href.match("pid=([^&]+)").length > 0 ? window.location.href.match("pid=([^&]+)")[1] : 0);
      })
    })
  }
})();
