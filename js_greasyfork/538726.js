// ==UserScript==
// @name         RR search
// @namespace    http://tampermonkey.net/
// @version      0.3.4.1
// @description  Handy search/find tool for royal road fictions.
// @author       Primordial Shadow
// @match        *://www.royalroad.com/fiction/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=royalroad.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538726/RR%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/538726/RR%20search.meta.js
// ==/UserScript==

/*
INSTRUCTIONS:
go to a fiction page in royalroad (chapter pages work too)
press "ù" or "shift U" to show/hide the interface (or click the icon)
type whatever you want to search and press enter (and wait first for the chapter content to get fetched, can take from a few seconds to minutes depending on internet connection and chapter count)
*/
(function() {
    'use strict';
// for access without hotkey
    let cache = [];
    let wait = false;
    let ver = "v0.3.4.1";
    let sideButton = document.createElement("img");
    sideButton.setAttribute("src", "https://github.com/shadowghost69/RoyalRoad-Fiction-Analysis/blob/main/img/icon.png?raw=true");
    sideButton.setAttribute("style", `
    display: none;
	position: fixed;
	right: 0;
	top: 10vh;
	width: 7vw;
	background-color: black;
	border: solid 1px;
	border-bottom-left-radius: 10% !important;
	border-top-left-radius: 10% !important;
	border-right-style: none !important;
	padding: 2px;
    cursor: pointer
 `);
    sideButton.setAttribute("title", "[Shortcut] -> Shift + U  / ù");
    sideButton.addEventListener("click", () => { root.style.left = "0px";});
    sideButton.addEventListener("load", () => { sideButton.style.display = "block";});
    document.getElementsByClassName("page-container-bg-solid")[0].appendChild(sideButton);

// anchor
    let root = document.createElement("div");
root.setAttribute("style", "width: 100vw ;height: 100vh; display: flex;justify-content: center; align-items: center; position: fixed; top: 0; left: 100vw;z-index: 100; transition: ease-in-out 0.5s;");
document.getElementsByClassName("page-container-bg-solid")[0].appendChild(root);

//main container
let main = document.createElement("div");
main.setAttribute("style", `background-color: black;
                            width: 100%;
                            height: 100%;
                            border: 5px solid whitesmoke;
                            border-radius: 2rem;
                            display: flex;
                            flex-direction: column;
                            color:whitesmoke;
                            font-size: 24px;
                            `);
root.appendChild(main);

// interface title
let title = document.createElement("h1");
title.appendChild(document.createTextNode("RR Search"));
title.setAttribute("style", `
	width: 100%;
	text-align: center;
	font-size: 3rem;
	border-bottom: 4px solid whitesmoke;
	position: relative;
	height: 15%;
	margin: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
    flex-shrink: 0;
`);

main.appendChild(title);

let version = document.createElement("span");
version.setAttribute("style", `
                             font-size:1rem;
                             float:right;
                             position: absolute;
                             right: 2px;
                             bottom: 1px;`);
version.appendChild(document.createTextNode(ver));
title.appendChild(version);
// for closing without hotkey
let close = document.createElement("span");
close.setAttribute("style", `cursor: pointer;
                             font-size:3rem;
                             float:right;
                             position: absolute;
                             right: 2px;
                             top: 1px;`);
close.appendChild(document.createTextNode("×"));
close.addEventListener("click", ()=>{root.style.left="100vw";});
title.appendChild(close);


// sub-container
let flex = document.createElement("div");
flex.setAttribute("style", `display:flex;
                            justify-content: flex-start;
                            align-items: center;
                            flex-direction: column;
                            flex-grow: 10;
                            overflow: auto;`);
main.appendChild(flex);
// search bar (duh)
    let searchBar = document.createElement("input");
    searchBar.setAttribute("type", "text");
searchBar.setAttribute("placeholder", "Search Term");
searchBar.setAttribute("style", "max-width: 200px;color: black; text-align:center");
    flex.appendChild(searchBar);
let options = document.createElement("div");
options.setAttribute("style", `width: 100%;
                            display:flex;
                            justify-content: space-around;
                            align-items: center;`);
let caseSense = document.createElement("div");
    caseSense.innerHTML = `<input type="checkbox" id="caseSense"/> <label>Case Sensitive</label>`
    options.appendChild(caseSense);
let independancy = document.createElement("div");
    independancy.innerHTML = `<input type="checkbox" id="independancy"/> <label>Independancy</label>`
    options.appendChild(independancy);
    flex.appendChild(options);
// result container so i can easily clear it
        let container = document.createElement("div");
    container.setAttribute("style", `display:flex;
                            justify-content: flex-start;
                            align-items: center;
                            flex-direction: column;`);
    flex.appendChild(container);

// search trigger on pressing enter
    searchBar.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
      if (!wait) {
    container.innerHTML= "";
    Search(location.href.match(/.+fiction\/\d+\/[^\/]+/), searchBar.value);
      }
  }
});
// hotkeys
function handleShortcut(event) {
    if (event.key === "ù" || (event.keyCode === 85 && event.shiftKey)) {
        event.preventDefault();
        if (root.style.left == "0px") root.style.left = "100vw";
        else root.style.left = "0px";
    }
}
document.addEventListener("keydown", handleShortcut);

async function fetchHTML(link) {
  const response = await fetch(link);
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc;
}

function getLinks(doc) {
  let map = new Map();
  let i = 1;
  let a = new Set(doc.getElementsByTagName("td"));
  let b = new Set(doc.getElementsByClassName("text-right"));
  let c = a.difference(b);
  for (const elem of Array.from(c)) {
    let name = `(${i}) ` + elem.childNodes[1].textContent.replace(/\n | \s{2,}/g, "");
    let link = elem.childNodes[1].href === undefined ? elem.childNodes[3].href : elem.childNodes[1].href;
    map.set(name, link);
    i++
  }
  return map;
}
/*
function getMatches(doc, word, CaseSensitive, independancy) {
  let regex = new RegExp(independancy ? `.*\\b${word}\\b.*` : `.*${word}.*` ,CaseSensitive ? "g" : "gi");
  let countRegex = new RegExp(independancy ? `\\b${word}\\b` : `${word}` ,CaseSensitive ? "g" : "gi");
    console.debug(regex);
    console.debug(countRegex);
    cache.push({title: doc.getElementsByTagName("h1")[0].textContent, content: doc.getElementsByClassName("chapter-inner")[0].textContent});
  try {
    let title = doc.getElementsByTagName("h1")[0].textContent;
    let count = doc.getElementsByClassName("chapter-inner")[0].textContent.match(countRegex).length;
    let matches = doc.getElementsByClassName("chapter-inner")[0].textContent.match(regex);
    return {
      title: title,
      count: count,
      matches: matches
    }
  } catch (error) {
    console.debug(`found no matches`)
  }
}*/
function getMatchesFromCache(cacheArray, word, CaseSensitive, independancy) {
  let result = [];
  let regex = new RegExp(independancy ? `.*\\b${word}\\b.*` : `.*${word}.*` ,CaseSensitive ? "g" : "gi");
  let countRegex = new RegExp(independancy ? `\\b${word}\\b` : `${word}` ,CaseSensitive ? "g" : "gi");
//  let progress = document.createElement("h2");
//  progress.appendChild(document.createTextNode(`Searching... (0/${cacheArray.length})`));
//  container.appendChild(progress);
    for (const obj of cacheArray) {
try {
    let title = obj.title;
    let count = obj.content.match(countRegex).length;
    let matches = obj.content.match(regex);
    result.push({
      title: title,
      count: count,
      matches: matches,
      link: obj.link
    });
  } catch (error) {
    console.debug(`found no matches in ${obj.title}`)
  }
   // progress.innerText = progress.innerText.replace(progress.innerText.match(/\d+/)[0],`${+progress.innerText.match(/\d+/)[0] + 1}`);
    }
  //  progress.remove();
return result;
}
    async function getChapterData(map) {
    wait = true;
    let progress = document.createElement("h2");
    progress.appendChild(document.createTextNode(`Fetching Chapters... (0/${Array.from(map.values()).length})`));
   container.appendChild(progress);
  for (const [name, link] of map) {
    if (link != undefined) {
      let doc = await fetchHTML(link);
      cache.push({title: doc.getElementsByTagName("h1")[0].textContent, content: doc.getElementsByClassName("chapter-inner")[0].textContent, link: link});
      console.debug(`${name} Fetched`)
      progress.innerText = progress.innerText.replace(progress.innerText.match(/\d+/)[0],`${+progress.innerText.match(/\d+/)[0] + 1}`);
    }

  }
    progress.remove();
    wait = false;
    console.debug(cache);
    }
async function Search(url, word) {
  let result = [];
  let totalCount = 0;
    if (cache.length === 0 ) {
  let linkMap = getLinks(await fetchHTML(url));
  console.debug("links: Get");
  await getChapterData(linkMap);
    }
    result = getMatchesFromCache(cache, word,document.getElementById("caseSense").checked, document.getElementById("independancy").checked);
for (const find of result) totalCount+= find.count;
    let finalResult = {result:result, totalCount: totalCount};
      console.debug(finalResult);

    displayResult(finalResult, container, word);
}

function displayResult(result, parent, word) {
 parent.appendChild( document.createElement("h2").appendChild(document.createTextNode(`Found ${result.totalCount} matches in total`)));
  for (const match of result.result) {
    let innerHTML = `<details style="max-width: 75vw;">
  <summary style="text-align: center;background: grey;
  cursor: pointer;">${match.title} - ${match.count} ${match.count == 1 ? "match" : "matches"}</summary>`;
    for (const para of match.matches) {
      innerHTML += `<p style="font-size: 0.6em;">${para.replace(new RegExp(document.getElementById("independancy").checked ? `\\b(${word})\\b`:`(${word})` , document.getElementById("caseSense").checked ? "g" : "gi"), `<strong>$1</strong>`)}</p>`;
    }
    innerHTML += `</details> ${linkchar.replace("#",match.link)}`;
    let elem = document.createElement("div");
    elem.className= "find";
    elem.setAttribute("style",`display:flex;`);
    elem.innerHTML = innerHTML;
    elem.onclick = function(e) {
  if (e.ctrlKey) {for (const detail of document.getElementsByTagName("details")) detail.open = true}
    };
    parent.appendChild(elem);
  }
}
   let linkchar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width:2vw;cursor:pointer;margin-left:5px;" onclick="window.open('#', '_blank')"><path fill="#6f9cd6" d="M352 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9L370.7 96 201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L416 141.3l41.4 41.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6l0-128c0-17.7-14.3-32-32-32L352 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"/></svg>`
})();