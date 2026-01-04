// ==UserScript==
// @name        GET stealer
// @namespace    caca
// @match       http*://soyjak.party/*
// @version     0.9
// @author      newGOD
// @license     MIT
// @description Get them hecking repeating digits
// @downloadURL https://update.greasyfork.org/scripts/470562/GET%20stealer.user.js
// @updateURL https://update.greasyfork.org/scripts/470562/GET%20stealer.meta.js
// ==/UserScript==
const board = document.querySelector("form[name='post'] input[name='board']").value
const postButton = document.querySelector("form[name='post'] input[name='post']")
const autoButton = document.createElement('input')
const diffDisplay = document.createElement('input')
const latestDisplay = document.createElement('input')

let target = 0
let latest
let diff

addButtons()
main()

async function main() {
  while(true) {
    poll()
    if (diff < 5 && diff > 0) {
      await sleep(200)
    }
    else if (diff > 25 || diff < 0){
      await sleep(3000)
    }
    else {
      await sleep(1000)
    }
  }
}

async function autoPost() {
  if (autoButton.checked == true && diff == 1) {
    postButton.click()
    autoButton.checked = false
    console.log("posted, hopefully you got that GET")
  }
}

async function poll() {
  latest = await getLatestPost(board)
  diff = target - latest

  autoPost()
  updateUI()
}

function updateUI() {
  latestDisplay.value = "No. " + latest
    if (target > latest) {
      diffDisplay.value = "Posts till GET: " + diff
    }
    else {
      diffDisplay.value = "Posts till GET: " + "N/A"
    }
}


async function getLatestPost(board) {
  let postNo = 0

  const url = document.location.origin + "/" + board + "/" + "0.json"
  const response = await fetch(url)

  data = await response.json()
  for (i = 0; i < data.threads.length - 1; i++) {
    const posts = data.threads[i].posts
    if (posts[posts.length - 1].no > postNo) {
      postNo = posts[posts.length - 1].no
    }
    else if (posts[0].sticky != 1) {
      break
    }
  }

   return postNo
}

function findNextRepeating(num, count) {
  num += 1
  const digits = getLastDigits(num, count)
  let repeating = true
  for (i = 0; i < digits.length-1; i++) {
    if (digits[i] != digits[i+1]) {
      repeating = false
      break
    }
  }
  if (repeating == false) {
    num = findNextRepeating(num, count)
  }
  return num
}

function getLastDigits(num, count) {
  const digits = Array(count)
  for (i = 1; i <= count; i++) {
    let digit = num % (10**i)
    if (i > 1) {
      digit = digit / (10**(i-1))
    }
    digits[i-1] = Math.trunc(digit)
  }
  return digits
}

function setRepeating(num) {
  target = findNextRepeating(latest, num)
  document.getElementById('target-input').value = target
  poll()
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addButtons() {
  const postForm = document.getElementsByName('post')[0]
  const container = document.createElement('div')
  container.setAttribute('style', 'margin-left : 25%; width: 50%; text-align: center')

  latestDisplay.setAttribute('id', 'latest-display')
  latestDisplay.setAttribute('readonly', true)
  latestDisplay.setAttribute('title', 'Latest post number')
  latestDisplay.value = "No. "

  diffDisplay.setAttribute('id', 'diff-display')
  diffDisplay.setAttribute('readonly', true)
  diffDisplay.value = "Posts till GET: "

  const targetInput = document.createElement('input')
  targetInput.setAttribute('name', 'target-input')
  targetInput.setAttribute('id', 'target-input')
  targetInput.setAttribute('type', 'number')
  targetInput.setAttribute('min', 1)
  targetInput.setAttribute('placeholder', 'Target Post Number')
  targetInput.addEventListener("input", function(){ target = targetInput.value; poll(); })

  autoButton.setAttribute('name', 'auto-button')
  autoButton.setAttribute('id', 'auto-button')
  autoButton.setAttribute('type', 'checkbox')
  const autoLabel = document.createElement('label')
  autoLabel.setAttribute('for', 'auto-button')
  autoLabel.innerHTML = "Auto Post"

  const dubsButton = document.createElement('input')
  dubsButton.setAttribute('id', 'dubs-button')
  dubsButton.setAttribute('type', 'button')
  dubsButton.setAttribute('value', 'Dubs')
  dubsButton.addEventListener("click", function(){ setRepeating(2); })

  const tripsButton = document.createElement('input')
  tripsButton.setAttribute('id', 'trips-button')
  tripsButton.setAttribute('type', 'button')
  tripsButton.setAttribute('value', 'Trips')
  tripsButton.addEventListener("click", function(){ setRepeating(3); })

  const quadsButton = document.createElement('input')
  quadsButton.setAttribute('id', 'quads-button')
  quadsButton.setAttribute('type', 'button')
  quadsButton.setAttribute('value', 'Quads')
  quadsButton.addEventListener("click", function(){ setRepeating(4); })

  container.appendChild(latestDisplay)
  container.appendChild(diffDisplay)

  container.appendChild(document.createElement('div'))

  container.appendChild(dubsButton)
  container.appendChild(tripsButton)
  container.appendChild(quadsButton)

  container.appendChild(targetInput)
  container.appendChild(autoButton)
  container.appendChild(autoLabel)

  postForm.parentNode.insertBefore(container, postForm.nextSibling)
}