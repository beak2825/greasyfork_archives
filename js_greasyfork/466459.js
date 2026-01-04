// ==UserScript==
// @name Inspirational Quotes for Google Slides and Docs :)
// @namespace https://github.com/Wxlfixe
// @version 1.0
// @description Provides colorful inspirational quotes for Google Docs and Google Slides.
// @match https://docs.google.com/*, https://slides.google.com/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466459/Inspirational%20Quotes%20for%20Google%20Slides%20and%20Docs%20%3A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466459/Inspirational%20Quotes%20for%20Google%20Slides%20and%20Docs%20%3A%29.meta.js
// ==/UserScript==

// Quotes data
const quotes = [
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
];

// Create GUI elements
const quoteContainer = document.createElement("div");
quoteContainer.style.position = "fixed";
quoteContainer.style.top = "50%";
quoteContainer.style.left = "50%";
quoteContainer.style.transform = "translate(-50%, -50%)";
quoteContainer.style.padding = "20px";
quoteContainer.style.background = "linear-gradient(to bottom right, #FFD700, #FF69B4)";
quoteContainer.style.color = "#FFF";
quoteContainer.style.fontFamily = "Arial, sans-serif";
quoteContainer.style.fontSize = "18px";
quoteContainer.style.borderRadius = "10px";
quoteContainer.style.textAlign = "center";
quoteContainer.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.5)";
quoteContainer.style.zIndex = "9999";
quoteContainer.style.transition = "background 1s";
quoteContainer.style.cursor = "move";

const quoteText = document.createElement("span");
quoteText.style.display = "block";
quoteText.style.marginBottom = "10px";
quoteText.style.fontWeight = "bold";

const quoteAuthor = document.createElement("span");

quoteContainer.appendChild(quoteText);
quoteContainer.appendChild(quoteAuthor);
document.body.appendChild(quoteContainer);

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteText.textContent = randomQuote.text;
  quoteAuthor.textContent = "- " + randomQuote.author;
}

// Function to generate random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Function to update background color
function updateBackgroundColor() {
  const color1 = getRandomColor();
  const color2 = getRandomColor();
  quoteContainer.style.background = `linear-gradient(to bottom right, ${color1}, ${color2})`;
}

// Event listener to show quote on user interaction
document.addEventListener("keydown", () => {
  showRandomQuote();
  updateBackgroundColor();
});

document.addEventListener
("click", () => {
showRandomQuote();
updateBackgroundColor();
});

// Initial quote display
showRandomQuote();

// Initial background color
updateBackgroundColor();

// Draggable functionality
let isDragging = false;
let initialX = 0;
let initialY = 0;

quoteContainer.addEventListener("mousedown", (event) => {
isDragging = true;
initialX = event.clientX - quoteContainer.offsetLeft;
initialY = event.clientY - quoteContainer.offsetTop;
});

quoteContainer.addEventListener("mousemove", (event) => {
if (isDragging) {
const offsetX = event.clientX - initialX;
const offsetY = event.clientY - initialY;
quoteContainer.style.left = offsetX + "px";
quoteContainer.style.top = offsetY + "px";
}
});

quoteContainer.addEventListener("mouseup", () => {
isDragging = false;
});