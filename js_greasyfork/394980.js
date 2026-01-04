// ==UserScript==
// @name           Make GitHub Pull Request, Commit, and Blob pages full width
// @namespace      https://bitbucket.org/deadlydog/greasemonkeyscripts
// @description    Makes the GitHub Pull Request, Commit, and Blob pages span the full width of the browser, rather than maxing out at the default.
// @include        https://github.com/*/pull/*
// @include        https://github.com/*/commit/*
// @include        https://github.com/*/blob/*
// @grant          none
// @version        1.2.0
// @downloadURL https://update.greasyfork.org/scripts/394980/Make%20GitHub%20Pull%20Request%2C%20Commit%2C%20and%20Blob%20pages%20full%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/394980/Make%20GitHub%20Pull%20Request%2C%20Commit%2C%20and%20Blob%20pages%20full%20width.meta.js
// ==/UserScript==

function large() {
    elements = document.getElementsByClassName('container-lg');
    for (index = 0; index < elements.length; index++)
    {
    	elements[index].style.maxWidth="95%";	// Only 95% to leave room for the "add comment" tooltip icon.
    }

    elements = document.getElementsByClassName('container-xl');
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