// ==UserScript==
// @name        Github Snake
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*
// @grant       none
// @version     1.3
// @author      -
// @description 17.11.2020, 16:25:10
// @downloadURL https://update.greasyfork.org/scripts/416295/Github%20Snake.user.js
// @updateURL https://update.greasyfork.org/scripts/416295/Github%20Snake.meta.js
// ==/UserScript==

const cells = document.querySelectorAll("rect")
if (!cells.length) throw "No commit calendar available - No snake for you!"

const lime = "var(--color-calendar-graph-day-L1-bg)"
const silver = "var(--color-calendar-graph-day-bg)"
const darkGreen = "var(--color-calendar-graph-day-L2-bg)"
const appleColor = "var(--color-calendar-graph-day-L4-bg)"

clear()

let snakeLen = 10
let last = 5, pos = 5
let dir = "right"
let lastMove
let tick = 300
let snakeGameStarted = false
let apple

const snake = [8, 15, 22, 23, 24, 31, 38]
const legend = document.querySelectorAll(".legend li")

const one = {
  right: i => cells[i + 7] ? i + 7 : null,
  left: i => cells[i - 7] ? i - 7 : null,
  up: i => i % 7 ? i - 1 : null,
  down: i => (i + 1) % 7 && i != 366 ? i + 1 : null
}

legend[0].onclick = () => tick = 1000
legend[1].onclick = () => tick = 500
legend[2].onclick = () => tick = 300
legend[3].onclick = () => tick = 180
legend[4].onclick = () => tick = 100

function drawSnake() {
  clear()
  snake.forEach(i => cells[i].style.fill = lime)
  cells[snake[snake.length - 1]].style.fill = darkGreen
}

function clear() {
  cells.forEach(rect => rect.style.fill = silver)
}

function moveSnake(dir) {
  const head = one[dir](snake[snake.length - 1])
  if (head !== null) {
    if (head == apple) {
      generateApple()
    } else {
      snake.shift()
    }
    snake.push(head)
  } else if (snake.length > 2) {
    snake.shift()
  }
}

function drawApple() {
  cells[apple].style.fill = appleColor
}

function draw() {
  clear()
  drawSnake()
  drawApple()
}

function generateApple() {
  apple = Math.floor(Math.random() * cells.length)
}

function render(timestamp) {
  if (!lastMove) {
    lastMove = timestamp
  } else {
    const diff = timestamp - lastMove
    if (diff > tick) {
      let shift = Math.floor(diff / tick)
      lastMove = timestamp - diff % tick
      
      while (shift--) {
        moveSnake(dir)
      }
      
      draw()
    }
  }
  
  requestAnimationFrame(render)
}

addEventListener("keydown", e => {
  if (snakeGameStarted && e.key.startsWith("Arrow")) {
    e.preventDefault()
    dir = e.key.slice(5).toLowerCase()
  }
})

generateApple()
draw()

setTimeout(() => {
  requestAnimationFrame(render)
  snakeGameStarted = true
  document.documentElement.style.scrollBehavior = "smooth"
  document.querySelector(".mt-4.position-relative").scrollIntoView()
}, 8000)