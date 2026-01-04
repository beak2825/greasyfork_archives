// ==UserScript==
// @name        appData display - hypixel.net
// @namespace   Violentmonkey Scripts
// @match       https://rewards.hypixel.net/claim-reward/*
// @grant       none
// @version     1.0
// @author      WarpMaster
// @description 22.03.2023, 20:31:07
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471290/appData%20display%20-%20hypixelnet.user.js
// @updateURL https://update.greasyfork.org/scripts/471290/appData%20display%20-%20hypixelnet.meta.js
// ==/UserScript==


function getId() {
  const url = window.location.pathname;
  return url.substring(url.lastIndexOf('/') + 1);
}

function invertHex(hex) {
  let num = Number(`0x${hex}`);
  if (num > 16 ** 6) {
    num = Math.floor(num / 256);
  }
  return (num ^ 0xFFFFFF).toString(16);
}

const div = document.createElement("div");
div.id = "myDiv";
const style = document.createElement("style");
style.appendChild(document.createTextNode(
`#myDiv {
  float: left;
  margin-left: 1em;
  margin-top: 8px;
}

#doneMsg {
  background: lightgreen;
  padding: 1px 0 2.95px 0;
  margin-left: 0.2em;
  border-radius: 2px;
}

#copyBtn {
  background: transparent;
  border: 1px solid #2f230e;
  border-radius: 2px;
  color: #e2b751;
  cursor: pointer;
  transition: background .2s;
}

#copyBtn:hover {
  background: #2f230e;
}

#colorLine {
  margin-top: 0.2em;
  line-height: normal;
}

#colorTxt {
  background: #2f230e;
  color: #e2b751;
  border-radius: 2px 0 0 2px;
}

#dailyColor {
  border-radius: 0 2px 2px 0;
}`));

const line1 = document.createElement("div");
line1.id = "btnLine";

const doneMsg = document.createElement("span");
doneMsg.id = "doneMsg";

const copyBtn = document.createElement("button");
copyBtn.id = "copyBtn";
copyBtn.innerHTML = "Copy appData";
copyBtn.onclick = async () => {
  await navigator.clipboard.writeText(window.appData);
  doneMsg.innerHTML = "Done!";
}
line1.append(copyBtn, doneMsg);

const id = getId();
const dailyColor = document.createElement("span");
dailyColor.id = "dailyColor";
dailyColor.innerHTML = `#${id}`.toUpperCase();
dailyColor.style.background = `#${id}`;
dailyColor.style.color = `#${invertHex(id)}`;

const wrapper = document.createElement("span");
wrapper.style.background = "white";
wrapper.style.borderRadius = "0 2px 2px 0";
wrapper.appendChild(dailyColor);

const line2 = document.createElement("div");
line2.id = "colorLine";
const txt = document.createElement("span");
txt.id = "colorTxt";
txt.innerHTML = "Daily Color:";
line2.append(txt, wrapper);

const header = document.querySelector("div[class^=index__header]");
header.appendChild(style);
header.appendChild(div).append(line1, line2);