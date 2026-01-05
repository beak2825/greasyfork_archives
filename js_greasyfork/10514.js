// ==UserScript==
// @name            Show/Hide all posts on Voat
// @namespace       https://voat.co/user/Grischinka
// @version         0.1
// @description     Adds a button which will "unfold" all artikles on the current Voat page.
// @author          Grischinka
// @match           https://voat.co/*
// @grant           none
// @licence         Public Domain
// @downloadURL https://update.greasyfork.org/scripts/10514/ShowHide%20all%20posts%20on%20Voat.user.js
// @updateURL https://update.greasyfork.org/scripts/10514/ShowHide%20all%20posts%20on%20Voat.meta.js
// ==/UserScript==

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

// Add a button to the Header
var tabBar = getElementByXpath('//*[@id="header-banner"]/ul');
var toggleButton = document.createElement("BUTTON");
//toggleButton.className = 'contribute submit-text';
var toggleText = document.createTextNode("View/Hide All");
toggleButton.appendChild(toggleText);
toggleButton.style.border = 'none';

var tabListElement = document.createElement("li");


tabBar.appendChild(toggleButton);

toggleButton.onclick=function(){
    var expandobtns = document.getElementsByClassName('expando-button');
    for (i = 0; i < expandobtns.length; i++) {
        expandobtns[i].click();   
    }
}
