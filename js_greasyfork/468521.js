// ==UserScript==
// @name         Lemmings Fix
// @version      1.0
// @description  Redirect to your local Lemmy instance
// @author       @lemmy.world/u/soy
// @match        https://*/c/*
// @namespace    https://*/c/*
// @icon         https://join-lemmy.org/static/assets/icons/favicon.svg
// @downloadURL https://update.greasyfork.org/scripts/468521/Lemmings%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/468521/Lemmings%20Fix.meta.js
// ==/UserScript==

const localLemmy = "lemmy.world";

var isLemmy =
  document.head.querySelector("[name~=Description][content]").content ===
  "Lemmy";

if (isLemmy) {
  // Get URL info
  var splitUrl = location.href.split("/");
  var instanceUrl = splitUrl[2];
  var community = splitUrl[4];
  var localizedUrl =
    "https://" + localLemmy + "/c/" + community + "@" + instanceUrl;

  // Create redirect button if not on local
  if (instanceUrl !== localLemmy) {
    var zNode = document.createElement("div");
    zNode.innerHTML = "Open in local instance";
    zNode.setAttribute("id", "localizeContainer");
    // add styles to the button embedded
    zNode.setAttribute(
      "style",
      "cursor: pointer; padding: 16px; background-color: red; border-radius: 10%; border-width: 3px; border-style: solid; padding: 3px; z-index: 10;max-width:200px;position:fixed;top:0;right:0;"
    );
    zNode.addEventListener("click", onLocalize);
    document.body.appendChild(zNode);
  }
}

function onLocalize() {
  window.location.replace(localizedUrl);
}