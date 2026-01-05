// ==UserScript==
// @name         Remove Red Masters
// @namespace    https://gist.github.com/Kadauchi
// @version      1.0.1
// @description  Removes red text from Masters qualification on exports
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://turkerhub.com/threads/*
// @include      http://www.mturkcrowd.com/threads/*
// @downloadURL https://update.greasyfork.org/scripts/29972/Remove%20Red%20Masters.user.js
// @updateURL https://update.greasyfork.org/scripts/29972/Remove%20Red%20Masters.meta.js
// ==/UserScript==

function removeRed (elem) {
  for (let red of elem.querySelectorAll(`[style*="color: red"]`))
	if (red.textContent.match(/Masters/))
	  red.style.color = ``;
}

for (let elem of document.getElementsByClassName(`ctaBbcodeTable`))
  removeRed(elem);

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
	for (let i = 0; i < mutation.addedNodes.length; i++)
	  for (let elem of mutation.addedNodes[i].getElementsByClassName(`ctaBbcodeTable`))
		removeRed(elem);
  });
});

observer.observe(document.getElementById(`messageList`), {childList: true});
