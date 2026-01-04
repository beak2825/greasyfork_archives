// ==UserScript==
// @name        Copy from Text Blaze
// @namespace   Violentmonkey Scripts
// @match       https://dashboard.blaze.today/snippet/*
// @run-at      document-end
// @grant       none
// @version     1.2
// @icon        https://dashboard.blaze.today/favicon.ico
// @author      The Myth
// @license     MIT
// @description A simple script that addes a copy button in dashboard of Text Blaze
// @downloadURL https://update.greasyfork.org/scripts/508393/Copy%20from%20Text%20Blaze.user.js
// @updateURL https://update.greasyfork.org/scripts/508393/Copy%20from%20Text%20Blaze.meta.js
// ==/UserScript==


const copyTorrentLinks = (output) => {
    const input = document.createElement("textarea");
    input.value = output
    document.body.appendChild(input);
    input.focus();
    input.select();
    let result = document.execCommand("copy");
    document.body.removeChild(input);
    if (result) alert("Torrent links copied to clipboard");
    else
        prompt("Failed to copy links. Manually copy from below\n\n", input.value);
};


function onClick() {
  var previewBtn = document.querySelector(
    "#root > div > div > div.MuiGrid-root.MuiGrid-item.css-1wxaqej > div > div > div > div:nth-child(2) > div > div > button:nth-child(2)"
  );
  if (previewBtn.ariaPressed == "false") {
    alert("Go to the preview section");
  } else {
    var mainDiv = document.querySelector(".form-sandbox");
    if (mainDiv) {
      let output = "\n";
      for (const element of mainDiv.childNodes) {
        if (element.childElementCount == 0) {
          output += "\n";
        } else {
          for (const insideElement of element.childNodes) {
            if (insideElement.tagName.toLowerCase() == "input") {
                if (insideElement.value=="") {
                    alert(`${insideElement.placeholder} is empty`)
                    return
                }else{
                    output+=`${insideElement.value}`
                }
            }else{
                output+=insideElement.textContent
            }
          }
          output+="\n"
        }
      }
      copyTorrentLinks(output)
    } else {
      alert("Main div not found");
    }
  }
}

function setupObserver() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.target.matches(
          "#root > div > div > div.MuiGrid-root.MuiGrid-item.css-1wxaqej > div > div > div > div:nth-child(2) > div > div > button:nth-child(2)"
        )
      ) {
        var btnGroup = mutation.target.parentElement;
        var copyBtn = document.createElement("button");
        copyBtn.textContent = "Copy";
        copyBtn.type = "button";
        copyBtn.style =
          "color:#00acc0;border:1px solid;font-family:Roboto, Helvetica, Arial, sans-serif;";
        copyBtn.onclick = () => {
          onClick();
        };
        btnGroup.appendChild(copyBtn);
        observer.disconnect();
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

setupObserver();
