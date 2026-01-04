// ==UserScript==
// @name         MAL edit button on profile
// @namespace    MALProfEdit
// @version      0.6
// @description  try to take over the world!
// @author       Samu
// @match        https://myanimelist.net/profile/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39781/MAL%20edit%20button%20on%20profile.user.js
// @updateURL https://update.greasyfork.org/scripts/39781/MAL%20edit%20button%20on%20profile.meta.js
// ==/UserScript==


var buttonStyle = `
  color: #888888;
  cursor: pointer;
  background-color: #efefef;
  border-bottom: 1px solid #ebebeb;
  font-size: 10px;
  line-height: 1.0em;
  margin: 0;
  opacity: 1;
  padding: 2px 4px;
  -webkit-transition-duration: .3s;
  transition-duration: .3s;
  -webkit-transition-property: all;
  transition-property: all;
  -webkit-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
  display: inline-block;
  font-family: Avenir,lucida grande,tahoma,verdana,arial,sans-serif;
  height: 9px;
`;

var frameStyle = `
  position: fixed;
  top: 20px;
  width: 980px;
  height: 750px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100000000;
`;

var bgStyle = `
  position: fixed;
  top: 0;
  left: 0;
  background-color: black;
  opacity: 0.3;
  height: 100vh;
  width: 100vw;
  z-index: 100000000;
`;

var entity = document.getElementsByClassName("statistics-updates");
var isUserProfile = document.querySelector("#contentWrapper .h1 .header-right");


if (isUserProfile) {
  for (var i = 0; i < entity.length; i++) {
    var data = entity[i].querySelector(".data");
    var link = data.querySelector("a");
    var graph = data.querySelector(".graph-content");
    var id = link.href.replace(/^.*(?:manga|anime)\/([0-9]*)\/.*$/,"$1");
    var type = link.href.replace(/^.*(manga|anime)\/(?:[0-9]*)\/.*$/,"$1");

    var button = document.createElement("span");
    button.innerText = "Edit";
    button.setAttribute("style", buttonStyle);
    button.dataset.id = id;
    button.dataset.type = type;
    button.className = "edit-button";
    button.addEventListener("click", editEntity);

    data.insertBefore(button, graph);
  }
}

function editEntity() {
  var id = this.dataset.id;
  var type = this.dataset.type;

  var bg = document.createElement("div");
  var wrap = document.createElement("div");
  var editEntityFrame = document.createElement("iframe");

  wrap.id = "editEntityWrap";
  bg.id = "editEntityBG";
  bg.setAttribute("style", bgStyle);
  wrap.setAttribute("style", frameStyle);
  editEntityFrame.setAttribute("style", "height: 100%;width: 100%;");
  editEntityFrame.src = "https://myanimelist.net/ownlist/"+ type +"/"+ id +"/edit?hideLayout=1";

  bg.addEventListener("click", function closeEditFrame() {
    document.body.removeChild(wrap);
    document.body.removeChild(bg);
  });

  wrap.appendChild(editEntityFrame);
  document.body.appendChild(bg);
  document.body.appendChild(wrap);
}