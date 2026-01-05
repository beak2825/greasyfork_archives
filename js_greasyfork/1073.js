// ==UserScript==
// @name           JIRA Quick Search Submit Button
// @namespace      http://mailerdaemon.home.comcast.net
// @description    Really useful when used in conjunction with SubmitToTab
// @include        */jira.*
// @include        */jira/*
// @include        *.jira.*
// @version 0.0.1.20140517011138
// @downloadURL https://update.greasyfork.org/scripts/1073/JIRA%20Quick%20Search%20Submit%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/1073/JIRA%20Quick%20Search%20Submit%20Button.meta.js
// ==/UserScript==

if(form = document.forms.namedItem("quicksearch"))
{
	span = document.createElement("span");
	span.className="navItem";
	span.innerHTML = "<input type='submit' name='submit' value='S' class='quickSearchInput'/>";
	form.appendChild(span);
}