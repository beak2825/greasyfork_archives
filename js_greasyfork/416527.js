// ==UserScript==
// @name         Google scholar sci-hub popup 
// @namespace    wang19891218
// @version      0.48
// @description  Save some time with sci-hub
// @author       coco
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js

// @include      https://ascelibrary.org/doi/pdf*
// @include      https://aip.scitation.org/doi/abs/*
// @include      https://journals.aps.org/pre/abstract/*
// @include      https://journals.sagepub.com/doi/abs/*
// @include      https://link.springer.com/article/*
// @include      https://link.springer.com/chapter/*
// @include      https://onlinelibrary.wiley.com/doi/epdf/*
// @include      https://www.sciencedirect.com/*
// @include      https://www.tandfonline.com/doi/abs/*
// @include      https://ieeexplore.ieee.org/document/*


// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416527/Google%20scholar%20sci-hub%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/416527/Google%20scholar%20sci-hub%20popup.meta.js
// ==/UserScript==

// Immediately-invoked function expression

function addSciHubElement () {
  // create a new div element
  const newDiv = document.createElement("div");
  newDiv.setAttribute("id", "frame-for-sci-hub");
  // and give it some content
  const newIframe = document.createElement('iframe');
  console.log(window.innerWidth)
  console.log(window.innerWidth / 2)
  newDiv.style.zIndex= 20;
  newDiv.style.width = "360px"
  newDiv.style.height = "600px"
  newDiv.style.position = "fixed"
  newDiv.style.top = 0
  newDiv.style.right = 0
  newIframe.style
  newIframe.style.width= '100%'
  newIframe.style.height= '100%'
  newIframe.src = 'https://sci-hub.st/' + window.location.href
  newIframe.style.overflow = "hidden"
  // add the text node to the newly created div
  newDiv.appendChild(newIframe);
  document.body.appendChild(newDiv);
  // console.log(newIframe.src)
  // console.log(newIframe)
  $("#frame-for-sci-hub").draggable({ handle:'.header'})
}

addSciHubElement()


// $("#frame-for-sci-hub").hide()



