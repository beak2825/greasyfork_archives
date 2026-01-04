// ==UserScript==
// @name        audiobookbay.nl
// @namespace   audiobookbay.nl
// @description audiobookbay.nl hide unwanted books and highlight and auto next page
// @include     http://audiobookbay.nl/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/388323/audiobookbaynl.user.js
// @updateURL https://update.greasyfork.org/scripts/388323/audiobookbaynl.meta.js
// ==/UserScript==

var elements = document.querySelectorAll('div#page > div#content > div.re-ab');
for(i = 0; i < elements.length; ++i) {
  var element = elements[i];
  element.classList.remove("re-ab");
  element.innerHTML = atob(element.innerText);
  element.style.display = "block";
}

var elements = document.querySelectorAll('div#page > div#content > div.post'), i;
var elementsLength = elements.length;
var elementsCount = elementsLength;
for(i = 0; i < elementsLength; ++i) {
  var element = elements[i];
  var elementText = element.innerText+"\n";
  if(elementText.match(/Category:.*Gay|Keywords:.*(m\/m|Gay)/)) {
    element.parentNode.removeChild(element);
    elementsCount--;
  } else if(elementText.match(/Category:.*Romance/) && elementText.match(/Category:.*((Fantasy)|(Sci\-Fi)|(Paranormal))/)) {
    element.style.border = "3px solid #00FF7F"
  } else if(elementText.match(/Category:.*((Fantasy)|(Sci\-Fi)|(Paranormal))/)) {
    element.style.border = "3px solid gray"
  } else if(elementText.match(/Category:.*Romance/)) {
    element.style.border = "3px solid #DC143C"
  }
}

if(elementsCount < 1) {
  var pageUrl = window.location.href;
  var pageNum = pageUrl.match(/\d*\/$/).toString();
  var newPageNum = parseInt(pageNum.slice(0, -1)) + 1;
  var newPageUrl = pageUrl.replace(pageNum, newPageNum + "/");
  window.location.href = newPageUrl;
}
