// ==UserScript==
// @name     Settings for my userscripts - clash.gg
// @version  3
// @grant    none
// @description Settings UI for my scripts, uses unsafeWindow, might have compatibility issues
// @license MIT
// @match https://clash.gg/
// @match https://clash.gg/*
// @namespace https://clash.gg
// @downloadURL https://update.greasyfork.org/scripts/496674/Settings%20for%20my%20userscripts%20-%20clashgg.user.js
// @updateURL https://update.greasyfork.org/scripts/496674/Settings%20for%20my%20userscripts%20-%20clashgg.meta.js
// ==/UserScript==
var style = `
.css-usralbo1 {
  
}
@keyframes open {
	from {
  	opacity: 0;
    scale: 70%;
  }
  to {
  	opacity: 1;
    scale: 100%;
  }
}
@keyframes close {
	from {
  	opacity: 1;
    scale: 100%;
  }
  to {
  	opacity: 0;
    scale: 70%;
  }
}
.css-usrdivvy {
	background-color: rgb(44 48 52);
  display: block;
  width: 150%;
  padding-left: 2%;
  padding-right: 2%;
  border: 0px solid;
  border-radius: 5px;
  align-content: center;
}
.css-usrdivvy:hover {
	opacity: 0.5;
  cursor: pointer;
}
#usrscrptsettings {
	z-index: 99;
  width: 100%;
  height: 100%;
  background-color: rgba(21, 23, 25, 0.4);
  min-height: 100%;
  border: 0px solid;
  top: 0;
	left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  position: fixed;
  box-sizing: border-box;
}
.css-usrmaindiv {
	z-index: 100;
  width: 30%;
  height: 80%;
  background-color: rgb(44, 48, 52);
  opacity: 1;
  border: 3px solid;
  border-color: rgb(21,23,25);
  position: absolute;
  margin-left: 35%;
  margin-top: 4%;
  border-radius: 5px;
  overflow: scroll;
}
.css-usrmaindiv.adding {
	animation-duration: 0.2s;
  animation-name: open;
}
.css-usrmaindiv.removing {
	animation-duration: 0.2s;
  animation-name: close;
}
.css-usrhead {
	font-weight: bold;
  text-align: center;
  align-content: center;
  padding-top: 1%;
  border: 3px solid;
  border-color: rgb(13, 14, 15);
  border-radius: 5px;
  padding-bottom: 1%;
  margin-bottom: 1%;
}
.css-tglbtn {
	margin-left: 75%;
  width: 10%;
  min-width: 10%;
  background-color: rgb(46, 48, 50);
  border: 1px solid;
  border-radius: 5px;
  margin-bottom: 2%;
}
.css-optiondiv1 {
	width: 70%;
  padding-left: 2%;
  padding-right: 2%;
  max-height: 10%;
  display:flex;
}
.css-ptxt1 {
	width: 70%;
  font-weight: bold;
  min-width: 60%;
  margin-left: 0%;
  padding-left: 0%;
  text-align: left;
}
body.noscroll {
	overflow: hidden;
}
`
function generateHeader(name, url) {
  var div = document.createElement("div");
 var a = document.createElement("a");
  a.innerText = name;
  a.style = "text-align: center; font-weight: bold; margin-bottom: 1%;";
  if (url) {
   a.href = url;
    a.style = "font-weight:bold;color:rgb(64, 94, 245);text-decoration:underline; text-align: center;margin-bottom: 1%;";
  }
  div.appendChild(a);
  div.className = "css-usrhead";
  return div;
}
function generateSwitch(val, def, sfunc) {
  var div = document.createElement("div");
  div.className = "css-optiondiv1";
  var s = document.createElement("p");
  s.innerText = val;
  s.className = "css-ptxt1";
  var btn1 = document.createElement("button");
  btn1.className = "css-tglbtn";
  btn1.innerText = "ON";
  if (def === false) {
   btn1.innerText = "OFF"; 
  }
  btn1.addEventListener("click", () => {
  	if (btn1.innerText === "ON") {
     btn1.innerText = "OFF";
    } else {
     btn1.innerText = "ON"; 
    }
    sfunc(btn1.innerText);
  })
 	div.appendChild(s);
  div.appendChild(btn1);
  return div;
}
const defaults = {
	link_officialcases: true,
  link_communitycases: true,
  show_getroi: true,
  show_opens: true,
  show_likes: true,
  show_commission: true,
  settings_dynamic: false
}
function getSetting(f) {
var unsafeWindow = ( function () {
        var dummyElem = document.createElement('p');
        dummyElem.setAttribute ('onclick', 'return window;');
        return dummyElem.onclick ();
    } ) ();
 var item = unsafeWindow.localStorage.getItem(`USRSCRPT_${f}`);
 if (item === undefined || item === null) {
  item = defaults[f];
 }
  if (item === "false") {item = false}
  if (item === "true") {item = true} //just some lil things
  return item;
}
function setSetting(f, b) {
var unsafeWindow = ( function () {
        var dummyElem = document.createElement('p');
        dummyElem.setAttribute ('onclick', 'return window;');
        return dummyElem.onclick ();
    } ) ();
  unsafeWindow.localStorage.setItem(`USRSCRPT_${f}`, b);
}
function onClick() {
  var div = document.createElement("div");
  var setts = document.createElement("p");
  setts.style = "font-weight: bold; text-align: center; padding-top: 1%;"
  setts.innerText = "SETTINGS";
  div.id = "usrscrptsettings";
  document.body.appendChild(div);
  div.onclick = (e) => {
   if (e.target === div) {
     div.firstChild.classList.add("removing");
     void div.firstChild.offsetWidth;
     document.body.classList.remove("noscroll");
     setTimeout(() => {div.parentNode.removeChild(div)}, 180);
   }
  }
  var div2 = document.createElement("div");
  div2.appendChild(setts);
  div2.scrollable = "yes";
  div2.className = "css-usrmaindiv";
  div.appendChild(div2);
  div2.classList.add("adding");
  void div2.offsetWidth;
  document.body.classList.add("noscroll");
  //var clinker = generateHeader("Case Linker (battles)", "https://greasyfork.org/en/scripts/496583-clash-gg-case-linker-battles");
  //div2.appendChild(clinker);
  //clinker.appendChild(generateSwitch("Link official cases", getSetting("link_officialcases"), (f) => {setSetting("link_officialcases", (f === "ON"))}));
  //clinker.appendChild(generateSwitch("Link community cases", getSetting("link_communitycases"), (f) => {setSetting("link_communitycases", (f === "ON"))}));
  var casepickerinfo = generateHeader("Case Picker Info", "https://greasyfork.org/en/scripts/496673-clash-gg-battle-case-picker-info-settings-version");
  div2.appendChild(casepickerinfo);
  casepickerinfo.appendChild(generateSwitch("Show \"Get ROI\" button", getSetting("show_getroi"), (f) => {setSetting("show_getroi", (f === "ON"))}));
  casepickerinfo.appendChild(generateSwitch("Show amount of opens", getSetting("show_opens"), (f) => {setSetting("show_opens", (f === "ON"))}));
  casepickerinfo.appendChild(generateSwitch("Show amount of likes", getSetting("show_likes"), (f) => {setSetting("show_likes", (f === "ON"))}));
  casepickerinfo.appendChild(generateSwitch("Show commission %", getSetting("show_commission"), (f) => {setSetting("show_commission", (f === "ON"))}));
  var stngs = generateHeader("Settings", "https://google.com/search?q=am%20i%20an%20idiot"); //dont mind?
  div2.appendChild(stngs);
  stngs.appendChild(generateSwitch("Dynamically refresh settings (won't need to refresh), has performance impact", getSetting("settings_dynamic"), (f) => {setSetting("settings_dynamic", (f === "ON"))}));
}
function load() {
  var styl = document.createElement("style");
  styl.appendChild(document.createTextNode(style));
  styl.type = "text/css";
  document.head.appendChild(styl);
  var c = document.body.querySelector(".ermyyjd0");
  if (c) {
   c.parentNode.appendChild(c.cloneNode(true));
  }
  var div = document.createElement("div");
  div.className = "css-usrdivvy";
  var pr = c.parentNode;
  pr.appendChild(div);
  var btn = document.createElement("button");
  btn.innerText = "Settings";
  btn.className = "css-usralbo1";
  div.addEventListener("click", onClick);
  div.appendChild(btn);
}
setSetting("ACTIVE_linker", false)
setSetting("ACTIVE_battleinfo", false)
window.addEventListener("load", load);