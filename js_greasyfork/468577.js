// ==UserScript==
// @name        隐藏抖音顶左栏
// @namespace   鼠标显示隐藏抖音header搜索和左侧栏
// @match       https://www.douyin.com/*
// @namespace   476321082
// @license      MIT
// @grant       none
// @version     1.0.0.2
// @author      -
// @description 2023/6/12 19:20:21
// @downloadURL https://update.greasyfork.org/scripts/468577/%E9%9A%90%E8%97%8F%E6%8A%96%E9%9F%B3%E9%A1%B6%E5%B7%A6%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/468577/%E9%9A%90%E8%97%8F%E6%8A%96%E9%9F%B3%E9%A1%B6%E5%B7%A6%E6%A0%8F.meta.js
// ==/UserScript==

// Define CSS classes for the buttons
const buttonStyles = `
  .button {
    display: block;
    margin: 5px;
    width: 60px;
    height: 30px;
    background-color: black;
    color: gray;
  }
  .button-show:hover, .button-hide:hover {
    background-color: gray;
    color: black;
  }
`;

// Add the CSS to the page
const style = document.createElement('style');
style.textContent = buttonStyles;
document.head.appendChild(style);

// Get the header, target, and right container elements
const header = document.getElementById("douyin-header");
const target = document.getElementById("douyin-navigation");
const rightContainer = document.getElementById("douyin-right-container");

// Create a container for the buttons
const container = document.createElement("div");
container.style.position = "fixed";
container.style.right = "0px";
container.style.top = "300px";
container.style.zIndex = "9999";

// Create show and hide buttons
const showBtn = document.createElement("button");
showBtn.innerText = "显示";
showBtn.classList.add('button', 'button-show');

const hideBtn = document.createElement("button");
hideBtn.innerText = "隐藏";
hideBtn.classList.add('button', 'button-hide');

// Add buttons to the container
container.appendChild(showBtn);
container.appendChild(hideBtn);

// Add the container to the page
document.body.appendChild(container);

// Define show and hide functions
function showElements() {
  header.style.display = "block";
  target.style.display = "block";
  rightContainer.style.display = "";
}

function hideElements() {
  header.style.display = "none";
  target.style.display = "none";
  rightContainer.style.display = "contents";
}

// Add a single event listener to the container and use event delegation
container.addEventListener('click', (event) => {
  if (event.target === showBtn) {
    showElements();
  } else if (event.target === hideBtn) {
    hideElements();
  }
});

container.addEventListener('mouseover', (event) => {
  if (event.target === showBtn) {
    showElements();
  } else if (event.target === hideBtn) {
    hideElements();
  }
});

