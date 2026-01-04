// ==UserScript==
// @name        Copy as math image wrapped with in a editable link
// @namespace   Violentmonkey Scripts
// @match       https://shlappas.com/github-math/*
// @grant       none
// @version     1.0
// @author      -
// @description 12/28/2020, 11:01:45 AM
// @downloadURL https://update.greasyfork.org/scripts/419253/Copy%20as%20math%20image%20wrapped%20with%20in%20a%20editable%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/419253/Copy%20as%20math%20image%20wrapped%20with%20in%20a%20editable%20link.meta.js
// ==/UserScript==

const copyText = (e) => {
  var text = `<a href="${location.href}" target="_blank"><img src="${document.querySelector("img.Image").src}" title="${decodeURIComponent(location.hash.substring(1))}" />`;
  var input = document.getElementById("input");
  input.value = text;
  input.select(); 
  document.execCommand("copy");
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Event/stopPropagation
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault
  // https://vuejs.org/v2/guide/events.html#Event-Modifiers
  e.stopPropagation();
  console.info(`copied ${text}`);
}

const prepareTextareaCopy = () => {
  const textareaCopy = document.createElement('textarea');
  textareaCopy.id = 'input';
  textareaCopy.className = "Editor"
  const h1 = document.querySelector('h1');
  // insert textarea after h1
  h1.parentNode.insertBefore(textareaCopy, h1.nextSibling);
}

prepareTextareaCopy()
document.querySelector("img.Image").onclick = copyText