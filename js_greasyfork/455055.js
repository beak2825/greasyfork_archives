// ==UserScript==
// @name         Embed logic for local Webms
// @namespace    file:///
// @version      1.0
// @description  Adds embed capability for webms in local listing (Browser can handle Webms better than Windows)
// @author       DUVish
// @match        file:///*webms/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455055/Embed%20logic%20for%20local%20Webms.user.js
// @updateURL https://update.greasyfork.org/scripts/455055/Embed%20logic%20for%20local%20Webms.meta.js
// ==/UserScript==

let topLevelTable = document.querySelector("table");

let currentEmbeddedRowIdx = null;

if (topLevelTable) {
  let topLevelHead = topLevelTable.querySelector("thead");
  let topLevelHeadRow = topLevelHead.querySelector("tr");
  let newTableHeadCell = document.createElement("th");
  newTableHeadCell.innerText = "Embed";
  topLevelHeadRow.appendChild(newTableHeadCell);

  let topLevelBody = topLevelTable.querySelector("tbody")
  let totalRows = topLevelBody.children.length;

  let videoViewNode = document.createElement("div");
  videoViewNode.style.width = "90vw";
  videoViewNode.style.height = "90vh";
  videoViewNode.style.display = "none";
  videoViewNode.style.top = "2.5vh";
  videoViewNode.style.left = "2.5vw";
  videoViewNode.style.position = "fixed";
  videoViewNode.classList.add("videoViewNode");
  document.querySelector("body").appendChild(videoViewNode);
  let videoTitleNode = document.createElement("div");
  videoTitleNode.style.width = "100%";
  videoTitleNode.style.textAlign = "center";
  videoTitleNode.innerText = `[${currentEmbeddedRowIdx}/${totalRows - 1}]`;
  videoTitleNode.classList.add("videoTitleNode");
  videoViewNode.appendChild(videoTitleNode);
  videoViewNode.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "q") {
      Array.from(videoViewNode.children).forEach(child => child.tagName === "VIDEO" && child.remove());
      videoViewNode.style.display = "none";
      currentEmbeddedRowIdx = null;
    }

    if (key === "ArrowDown" || key === "ArrowUp") {
      if (typeof currentEmbeddedRowIdx === "number") {
        let changedFlag = false;
        if (key === "ArrowDown" && currentEmbeddedRowIdx < totalRows - 1) {
            currentEmbeddedRowIdx++;
            changedFlag = true;
        }
        if (key === "ArrowUp" && currentEmbeddedRowIdx > 0) {
            currentEmbeddedRowIdx--;
            changedFlag = true;
        }
        if (changedFlag) {
          let newVideoSrc = topLevelBody.children[currentEmbeddedRowIdx].querySelector("a").href;
          let currentVideoNode = document.querySelector(".videoNode");
          if (currentVideoNode) {
              currentVideoNode.src = newVideoSrc;
              updateTitle();
          }
        }
      }
    }
  });

  function updateTitle(idx) {
    let videoTitleNode = document.querySelector(".videoTitleNode");
    videoTitleNode.innerText = `[${currentEmbeddedRowIdx || idx}/${totalRows - 1}]`;
  }

  Array.from(topLevelBody.children).forEach((row, idx) => {
    let newCell = document.createElement("td");
    newCell.innerText = "Embed media";
    newCell.addEventListener("click", (e) => {
        let clickedCell = e.target;
        let fileName = clickedCell.parentNode.children[0].querySelector("a").href;
        let videoNode = document.createElement("video");
        videoNode.src = fileName;
        videoNode.controls = "true";
        videoNode.loop = "true";
        videoNode.autoplay = "true";
        videoNode.style.width = "95vw";
        videoNode.style.height = "95vh";
        videoNode.classList.add("videoNode");
        let videoViewNode = document.querySelector(".videoViewNode");
        console.log("in emebd click handler", videoViewNode, videoViewNode.style, videoViewNode.style.display);
        videoViewNode.style.display = "flex";
        videoViewNode.style.flexDirection = "column";
        videoViewNode.appendChild(videoNode);
        updateTitle(idx);
        currentEmbeddedRowIdx = idx;
    });
    row.appendChild(newCell);
  });
}

