// ==UserScript==
// @name Get Cover Image from Kakao
// @namespace flamekiller#2822
// @version  1.1.2
// @grant    none
// @license MIT
// @author flamekiller
// @description This script was written to get the cover image for series on kakaopage.
// @match *://page.kakao.com/*
// @connect page.kakao.com
// @downloadURL https://update.greasyfork.org/scripts/436416/Get%20Cover%20Image%20from%20Kakao.user.js
// @updateURL https://update.greasyfork.org/scripts/436416/Get%20Cover%20Image%20from%20Kakao.meta.js
// ==/UserScript==

let div = document.createElement('div')
div.setAttribute('id', 'contextMenu')
div.classList.add('context-menu')

div.setAttribute('style', 'position: absolute; text-align: center; background: lightgray; border: 1px solid black; z-index:690')

div.setAttribute('onmouseenter', 'enterBg(this)')

div.setAttribute('onmouseleave', 'exitBg(this)')

div.style.display = 'none'

let ul = document.createElement('ul')

ul.setAttribute('style', 'padding: 0px; margin: 0px; min-width: 150px; list-style: none;')

let li = document.createElement('li')

let li2 = document.createElement('li')

li2.innerText = 'Made by flamekiller'

li2.setAttribute('style', 'padding: 7px;')

li.setAttribute('style', 'padding: 7px;')

let hr = document.createElement('hr')

hr.style.margin = 0

let a = document.createElement('a')

a.setAttribute('style', 'text-decoration: none; color: black;')

a.target = '_blank'

a.innerText = 'Click here to open cover image!'

li.appendChild(a)

ul.appendChild(li)

ul.appendChild(hr)

ul.appendChild(li2)

div.appendChild(ul)

document.body.appendChild(div)

document.onclick = hideMenu;
document.oncontextmenu = rightClick;

function hideMenu() {
  document.getElementById(
    "contextMenu").style.display = "none"
}

function rightClick(e) {

  e.preventDefault();

  if (document.getElementById(
    "contextMenu").style.display == "block") {
    hideMenu();
  }
  else {
    let url = document.querySelector('img[alt="thumbnail"]').src.replace("&filename=th3", "")
    var menu = document
    .getElementById("contextMenu")
		menu.querySelector('a').href = url
    menu.style.display = 'block';
    menu.style.left = e.pageX + "px";
    menu.style.top = e.pageY + "px";
  }
}

function enterBg(x) {
  x.style.background = 'darkgrey'
}

function exitBg(x) {
  x.style.background = 'lightgrey'
}