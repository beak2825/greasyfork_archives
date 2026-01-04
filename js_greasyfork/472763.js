// ==UserScript==
// @name        Google Codelabs Marker
// @namespace   https://github.com/zjn0505
// @match       https://codelabs.developers.google.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @version     1.0
// @author      Jienan Zhang
// @run-at      document-end
// @description 8/9/2023, 11:11:06 AM
// @license     MIT
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/472763/Google%20Codelabs%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/472763/Google%20Codelabs%20Marker.meta.js
// ==/UserScript==


function updateCard(labElement) {
  let url = new URL(labElement.attributes.url.value)
  let title = labElement.attributes.displaytitle.value
  let timestamp = labElement.attributes.timestamp.value
  let pathname = url.pathname

  console.log(url.pathname)

  let lastDoneTimestamp = GM_getValue(pathname, null)

  let isDone = lastDoneTimestamp == timestamp
  let isUpdated = lastDoneTimestamp && lastDoneTimestamp < timestamp
  let buttonsDiv = labElement.firstChild.children[1].lastChild

  let status
  if (isUpdated) {
    status = "isUpdated"
  } else if (isDone) {
    status = "isDone"
  } else {
    status = "todo"
  }

  let currentStatus = buttonsDiv.getAttribute("status")

  if (status != currentStatus) {
    console.log(">>>", title, status, currentStatus)
    let addedButton
    if (buttonsDiv.childElementCount == 1) {
      addedButton = buttonsDiv.lastChild.cloneNode(true)
    } else {
      addedButton = buttonsDiv.lastChild
    }
    if (status == "todo" || status == "isUpdated") {
      console.log(">>> Done button", title, status)
      addedButton.textContent = "Done"
      addedButton.style.marginRight = "10px"
      addedButton.removeAttribute("href")
      addedButton.addEventListener("click", () => {
        console.log("Done", title, timestamp, pathname)
        GM_setValue(pathname, timestamp)
        if (status == "isUpdated") {
          console.log(">> unset color")
          buttonsDiv.parentElement.parentElement.querySelector(".devsite-card-date").style.color = ""
        }
        updateCard(labElement)
      }, { once: true });
      buttonsDiv.appendChild(addedButton)
      if (status == "isUpdated") {
        buttonsDiv.parentElement.parentElement.querySelector(".devsite-card-date").style.color = "red"
      }
    } else if (status == "isDone") {
      console.log(">>> Undo button", title, status)
      addedButton.textContent = "Undo"
      addedButton.style.marginRight = "10px"
      addedButton.removeAttribute("href")
      addedButton.addEventListener("click", () => {
        console.log("Undo", title, timestamp, pathname)
        GM_deleteValue(pathname)
        buttonsDiv.parentElement.parentElement.style.backgroundColor = ''
        updateCard(labElement)
      }, { once: true });
      buttonsDiv.appendChild(addedButton)
      buttonsDiv.parentElement.parentElement.style.backgroundColor = 'rgba(0, 128, 0, 0.3)'
    }
    buttonsDiv.setAttribute("status", status)
  }
}

const disconnect = VM.observe(document.body, () => {

  let url = new URL(document.baseURI)
  let path = url.pathname
  if (path == "/") {
    // console.log(">>>", path, "Main")
    let labs = document.getElementsByClassName("devsite-card-wrapper")
    let lenghtOfLabsAfterFilter = labs.length
    if (lenghtOfLabsAfterFilter > 0) {
      let visibleLabs = [...labs].filter((lab) => !lab.hidden)
      console.log("lenghtOfLabsAfterFilter", lenghtOfLabsAfterFilter, "visibleLabs", visibleLabs.length)

      for (var key in visibleLabs) {
        // console.log(key + ': ' + visibleLabs[key]);
        let labElement = visibleLabs[key]
        if (labElement) {
          updateCard(labElement)
        }
      }
    }
  } else {
    // console.log("->>>", path, "--> timestamp", GM_getValue(path))
//     (function() {
//       // Find the element you want to modify (replace with your selector)
//       var targetElement = document.querySelector('body[codelabs-content-type=paginated] google-codelab .no-return-url');

//       // Remove the style attribute from the element
//       if (targetElement) {
//           targetElement.removeAttribute('class');
//       }
//     })();
  }
});