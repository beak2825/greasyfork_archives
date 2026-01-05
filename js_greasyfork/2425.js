// ==UserScript==
// @name           Make the MSDN Forums pages full width
// @namespace      https://bitbucket.org/deadlydog/greasemonkeyscripts
// @description    Makes the MSDN Forums pages span the full width of the browser, rather than maxing out at the default ~960 pixels.
// @include        http://social.msdn.microsoft.com/Forums/*
// @grant          none
// @version        1.1
// @downloadURL https://update.greasyfork.org/scripts/2425/Make%20the%20MSDN%20Forums%20pages%20full%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/2425/Make%20the%20MSDN%20Forums%20pages%20full%20width.meta.js
// ==/UserScript==

// Make the page container span the full width.
element = document.getElementById('JelloExpander');
element.style.width="100%";

// Make the post contents grow to fill more of the page.
element = document.getElementById('threadPageContentContainer');
element.style.width="74%";
element.style.cssFloat="left";

// Make the title bar span the full width.
elements = document.getElementsByClassName('header-top-bar');
for (index = 0; index < elements.length; index++)
{
	elements[index].style.width="100%";
	elements[index].style.left="0px";
}

// Center the footer.
footer = document.querySelector('footer')
footer.style.marginLeft="auto";
footer.style.marginRight="auto";
footer.style.left="0px";

// The "dark" MSDN Forums theme requires this additional setting. Which theme you see depends on how you get to their site.
element = document.getElementById('JelloSizer');
element.style.setProperty('max-width', '100%', 'important');	// CSS properties have the "important" attribute, so to override them we also have to use the "important" attribute.
element.style.setProperty('width', '100%', 'important');		// CSS properties have the "important" attribute, so to override them we also have to use the "important" attribute.