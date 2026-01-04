// ==UserScript==
// @name           testing
// @namespace      https://bitbucket.org/deadlydog/greasemonkeyscripts
// @description    testing code
// @include        https://github.com/*/pull/*
// @include        https://github.com/*/commit/*
// @include        https://github.com/*/blob/*
// @grant          none
// @version        0.0.1
// @downloadURL https://update.greasyfork.org/scripts/394986/testing.user.js
// @updateURL https://update.greasyfork.org/scripts/394986/testing.meta.js
// ==/UserScript==

function large() {
    elements = document.getElementsByClassName('container-lg');
    for (index = 0; index < elements.length; index++)
    {
    	elements[index].style.maxWidth="95%";	// Only 95% to leave room for the "add comment" tooltip icon.
    }
}
large();

var observer = new MutationObserver(large);

observer.observe(document.body, {
  childList: true
});

