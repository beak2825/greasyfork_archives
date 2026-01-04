// ==UserScript==
// @name        Move youtube comment
// @namespace   nazo6.github.io
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0.3
// @author      nazo6
// @license     MIT
// @description Youtubeのコメント欄を右上の方に移動するスクリプト
// @downloadURL https://update.greasyfork.org/scripts/454579/Move%20youtube%20comment.user.js
// @updateURL https://update.greasyfork.org/scripts/454579/Move%20youtube%20comment.meta.js
// ==/UserScript==

let crr_path = null

const observer = new MutationObserver((mutations) => {
  execute()
})

observer.observe(document, {
    characterData: true,
    subtree: true
});

function sleep(n){
  return new Promise(function(resolve){
    setTimeout(resolve, 100);
  });
}

async function execute() {
  if(location.pathname.startsWith("/watch") || location.pathname.startsWith("/live")) {
    if (!document.getElementById("comment-toggle-button")) {
      const buttonInsertRef = document.querySelector("#top-row #menu > ytd-menu-renderer > *:last-child")
      if (buttonInsertRef) {
        buttonInsertRef.insertAdjacentHTML("beforebegin", `
          <button id="comment-toggle-button" style="margin:0 5px;">
            move
          </button>
        `)
        document.querySelector("#comment-toggle-button").onclick = toggleComment
      } else {
        console.warn("Failed to find reference element");
      }
    }
  }
}

function toggleComment() {
  const toggleButton = document.querySelector("#comment-toggle-button")
  const toggleButtonText = toggleButton.textContent

  if (toggleButtonText.trim() === "move") {
    const sectionHeight = document.querySelector("#player").clientHeight
    const newCommentSectionParent = document.querySelector("#related")
    newCommentSectionParent.insertAdjacentHTML("beforebegin", `
      <div style="height:${sectionHeight}px; overflow:scroll" id="new-comment-section-container"></div>
    `)
    document.getElementById('new-comment-section-container').appendChild(document.getElementById('comments'))

    toggleButton.textContent = "restore"
  } else if (toggleButtonText.trim() === "restore") {
    document.getElementById('below').appendChild(document.getElementById('comments'))
    document.getElementById('new-comment-section-container').remove()

    toggleButton.textContent = "move"
  }
}
