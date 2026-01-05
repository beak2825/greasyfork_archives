// ==UserScript==
// @name        BvS Login Name Indicator
// @namespace   ns://yesterday.BvS.local
// @description Puts your login name on the screen in big bright letters.
// @include     http://*animecubed.com/billy/bvs/*
// @version     0.1
// @history     0.1 2014-09-11 Original version.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5021/BvS%20Login%20Name%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/5021/BvS%20Login%20Name%20Indicator.meta.js
// ==/UserScript==

(function(){
  const node = document.evaluate(
    "//input[@name='player']", document, null,
    XPathResult.ANY_UNORDERED_NODE_TYPE, null
  ).singleNodeValue;
  
  if (!node) return;
  
  const div = document.createElement("div");
  div.id = "login-name-indicator";
  div.style.float = "right";
  div.style.position = "fixed";
  div.style.right = "5px";
  div.style.top = "5px";
  div.innerHTML = "<span style='\
font-family: sans-serif; font-size: 48px; color: white; \
background-color: rgba(0,0,0,0.3); border:2px solid rgba(128,128,128,0.5); \
margin: 0px; padding: 0px 5px;'>NAME</span>";
  div.firstChild.firstChild.textContent = node.value;
  document.body.appendChild(div);
})();
