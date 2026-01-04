// ==UserScript==
// @name         Virus Websites Blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Protect from website viruses!
// @author       inon13
// @match        *://*youareanidiot.cc/*
// @match        *://*hurr-durr.cc/*
// @match        *://inon13.glitch.me/GooGle_Chr0me/*
// @icon         none
// @license      Copyright inon13
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466312/Virus%20Websites%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/466312/Virus%20Websites%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

setTimeout(function(){
// Disabling pop-ups
window.open = function(){console.log(
  "%cSuccess: %c\n Blocked Window pop-up Successfully",
  "font-weight: 900; color: #27ae60; font-size: 25px;",
  "color: #2ecc71; font-weight: normal; font-size: 13px;"
);};
// set some variables
var a = '';
var body = document.body;
var head = document.head;
var oldtitle = document.title;
var oldicon;
var linkIcon = document.querySelector('link[rel="shortcut icon"]');
if (linkIcon) {
  oldicon = linkIcon.href;
} else {
  var ogImageMeta = document.querySelector('meta[property="og:image"]');
  if (ogImageMeta) {
    oldicon = ogImageMeta.content;
  }
}
var url = location.href;
// Changing the head & calling the image on the icon as "unknown image" for disabling the icon by changing the icon to "unknown/not available icon"
head.innerHTML =`
<link rel="shortcut icon" type="image/png" href="/unknown_image.png"\>
<style>

h1 {
  font-size: 36px;
  margin-bottom: 20px;
}

h2 {
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
}

h3 {
  font-size: 20px;
  margin-bottom: 20px;
}

h4 {
  font-size: 15px;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  font-size: 23px;
  border: solid 1px black;
  border-radius: 3px;
  cursor: pointer;
  transition: 0.2s;
  margin: 12px;
}

button:hover {
  border-radius: 7px;
  transform: scale(1.2);
}

body {
  padding: 4px;
  padding-right: 5px;
}
h2 {
}
p {
  font-size: 1.4em;
}

a {
  text-decoration: none;
  transition: 0.2s;
}

#bottom-div {
  bottom: 0;
  position: fixed;
}

#DMB {
  left: 10px;
  bottom: 0;
  position: fixed;
} </style>
`;
body.style = 'padding: 10px 20px; font-size: 23px; transition: 0.2s; margin: 12px;';
body.innerHTML = `
<div>
  <center>
    <h1> This website blocked by Virus Websites Blocker! </h1>
    <h2> this website could harm your computer </h2>
  </center>
  <div style="justify-content: left; text-align: left;">
    <h3> about: </h3>
    <h4>Title: ${oldtitle} </h4>
    <h4>url: ${url} </h4>
    <h4>Icon: </h4><label><img src="${oldicon}"/></label>
  </div>
  <center>
  <h2> If you have another website that you want i'll add to the blocker talk to me on social media. </h2> <br><h2>visit my website: <button><a target="blank" href="https://inon13.glitch.me/">Here</a></button> </h2>
  <h3>This anti-virus may block part of my website and this is because I made my own virus website so it blocks it!</h3>
  </center>
  <div for="DMB" id="bottom-div">
    <button type="button" id="DMB">Dark Mode</button>
    </div>
</div>
`;
document.title = oldtitle+' (Blocked)';
setTimeout(function (){
const clonedBody = body.cloneNode(true);
body.parentNode.replaceChild(clonedBody, body);
var style = document.body.style;
var darkModeButton = document.getElementById("DMB");

if (isNaN(localStorage.getItem('DM'))) {localStorage.setItem("DM", '1')}
if (localStorage.getItem('DM') == null) {localStorage.setItem("DM", '1')}
darkModeButton.addEventListener("click", function () {
  if (localStorage.getItem('DM') == '0') {
    localStorage.setItem("DM", '1');
    activatedarkMode();
  } else if (localStorage.getItem('DM') == '1') {
    localStorage.setItem("DM", '0');
    activatelightMode();

  }
});

function activatedarkMode() {
  style.background = "linear-gradient(white, black)";
  style.color = "white";
  style.background = "#202124";
  darkModeButton.innerText = 'Light Mode';
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.style = 'border: solid 1px white; color: white; background: #202124;';
  });
  const links = document.querySelectorAll('a');
  links.forEach(a => {
    a.style = 'color: white; background: #202124;';
  });
}

function activatelightMode() {
  style.background = "linear-gradient(white, black)";
  style.color = "black";
  style.background = "white";
  darkModeButton.innerText = 'Dark Mode';
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.style = 'border: solid 1px black; color: black; background: white;';
  });
  const links = document.querySelectorAll('a');
  links.forEach(a => {
    a.style = 'color: black; background: white;';
  });
}
  if (localStorage.getItem('DM') == '0') {
    activatedarkMode();
  } else if (localStorage.getItem('DM') == '1') {
    activatelightMode();
  }
}, 2000)
alert('Blocked!');
console.log(
  "%cSuccess: %c\n Blocked website successfully",
  "font-weight: 900; color: #27ae60; font-size: 25px;",
  "color: #2ecc71; font-weight: normal; font-size: 13px;"
);
}, 1000)
})();