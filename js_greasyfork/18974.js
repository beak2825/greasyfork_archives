// ==UserScript==
// @name           Comment Is Hidden
// @description:en Remove the Comment Is Free articles (and the whole Opinion section) from the Guardian's front page.
// @namespace      www.ballpointbanana.com
// @include        http://www.theguardian.com/uk
// @version        1
// @description Remove the Comment Is Free articles (and the whole Opinion section) from the Guardian's front page.
// @downloadURL https://update.greasyfork.org/scripts/18974/Comment%20Is%20Hidden.user.js
// @updateURL https://update.greasyfork.org/scripts/18974/Comment%20Is%20Hidden.meta.js
// ==/UserScript==

// Find the Opinion subsection.
var opinion = document.querySelector("section#opinion");
opinion.style = "display:none;"

// Find all the "items" on the Guardian.
var items = document.querySelectorAll("div.fc-item__container");

// Spin through them and hide all the divs containing a link to commentisfree.
for (var ii = 0; ii < items.length; ii++) {
    var thisdiv = items[ii];
    if (thisdiv.querySelector("a").href.indexOf("commentisfree") != -1) {
        thisdiv.style = "display: none;"
    }
}