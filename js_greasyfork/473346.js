// ==UserScript==
// @name         "Ship It" GIF button for Github Review
// @namespace    happyviking
// @version      1.7.0
// @grant        none
// @license      MIT
// @description  Adds a button to Github to add "Let's ship it!" GIFs when reviewing PRs
// @author       HappyViking
// @grant        none
// @match        https://github.com/*
// @require      https://cdn.jsdelivr.net/npm/tsparticles-confetti@2.12.0/tsparticles.confetti.bundle.min.js
// @require      https://unpkg.com/bundled-github-url-detector@1.0.0/index.js
// @downloadURL https://update.greasyfork.org/scripts/473346/%22Ship%20It%22%20GIF%20button%20for%20Github%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/473346/%22Ship%20It%22%20GIF%20button%20for%20Github%20Review.meta.js
// ==/UserScript==

const delay = (t) => new Promise((r) => setTimeout(r, t))

const randomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
}

const main = () => {
  attemptButtonSetup()
}

const attemptGetPRReviewSection = () => {
  const feedbackModal = document.getElementById("review-changes-modal")
  if (!feedbackModal) return null;
  const buttonPanelQuery = feedbackModal.getElementsByClassName("Overlay-footer Overlay-footer--alignEnd")
  if (buttonPanelQuery.length != 2) return null;
  return buttonPanel = buttonPanelQuery[1]
}

const attemptGetNewCommentSection = () => {
  const commentFormSection = document.getElementById("partial-new-comment-form-actions")
  if (!commentFormSection) return null;
  const sampleButton = commentFormSection.querySelector("button")
  if (!sampleButton) return null;
  return sampleButton.parentElement.parentElement
}

const attemptButtonSetup = () => {

  onClickTarget = ""
  buttonID = ""
  buttonParent = null

  if (!document.getElementById("shipitbuttonpr")) {
    buttonParent = attemptGetPRReviewSection()
    if (buttonParent) {
      onClickTarget = "#pull_request_review_body"
      buttonID = "shipitbuttonpr"
    }
  }

  if (!buttonParent && !document.getElementById("shipitbuttonissue")) {
    buttonParent = attemptGetNewCommentSection()
    if (buttonParent) {
      onClickTarget = "#new_comment_field"
      buttonID = "shipitbuttonissue"
    }
  }

  if (!buttonParent) return

  //Have to make it a div cuz some forms in Github have all buttons perform automatic logic, which I don't want
  const newButton = document.createElement("div")
  newButton.id = buttonID
  buttonParent.prepend(newButton)
  //Copying from the existing "submit" button
  //But if you want you can also look into more styles from:
  //https://github.githubassets.com/assets/primer-8f43f7721dc7.css
  //though I think the suffix to "primer" might change by the time you read this
  newButton.classList = "Button--primary Button--small Button float-left mr-1"
  const buttonContentHolder = document.createElement("span")
  buttonContentHolder.className = "Button-content"
  newButton.append(buttonContentHolder)
  const buttonLabel = document.createElement("span")
  buttonLabel.className = "Button-label"
  buttonContentHolder.append(buttonLabel)
  buttonLabel.innerHTML = "Ship that shit"

  const theme = window.getComputedStyle(newButton).getPropertyValue("color-scheme"); //Cant just access via "style" because it's passed down to the button; it's not inline
  if (theme == "light") {
    newButton.style.backgroundImage = "linear-gradient(319deg, rgba(255,126,1,1) 8%, rgba(229,110,21,1) 40%, rgba(179,52,4,1) 81%)"
  } else {
    newButton.style.backgroundImage = "linear-gradient(0deg, rgba(212,74,38,1) 0%, rgba(254,128,13,1) 100%)"
  }

  const template = document.createElement('template'); //<template /> is specifically meant for string->html logic
  //Taken fron https://tabler-icons.io/i/sailboat and slightly modified (no color information so github will take care of that)
  template.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
  <path d="M2 20a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1"></path>
  <path d="M4 18l-1 -3h18l-1 3"></path>
  <path d="M11 12h7l-7 -9v9"></path>
  <path d="M8 7l-2 5"></path>
  </svg>`

  const buttonIcon = template.content.firstChild;
  buttonIcon.className = "Button--visual"
  newButton.append(buttonIcon)

  newButton.addEventListener("click", (event) => {
    const textarea = document.querySelector(onClickTarget)
    textarea.value += `\n\n<img src="https://i.shipit.today" height=100/>\n<sup>Let's ship it! <a href="https://shipit.today/">Img source.<a/></sup>`
    confetti({
      angle: randomInRange(55, 125),
      spread: randomInRange(50, 70),
      particleCount: randomInRange(50, 100),
      position: { x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100},
      shapes: ["circle", "square", "line", "spiral", "star"],
    });
  })
}

attemptButtonSetup()
document.addEventListener("soft-nav:end", attemptButtonSetup); 
document.addEventListener("navigation:end", attemptButtonSetup);