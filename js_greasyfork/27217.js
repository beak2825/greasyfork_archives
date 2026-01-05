// ==UserScript==
// @name         Github Private by Default
// @namespace    http://github.com/cswarth
// @version      0.5
// @description  Make Private Repos the default on github.com
// @author       Chris Warth
// @include http://*github.com/*/new
// @include https://*github.com/*/new
// @include http://*github.com/new
// @include https://*github.com/new
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/27217/Github%20Private%20by%20Default.user.js
// @updateURL https://update.greasyfork.org/scripts/27217/Github%20Private%20by%20Default.meta.js
// ==/UserScript==

$(function () {
    "use strict";

	// I'm serious as cancer - public repos by default are a terrible risk!
	// Don't even present the options to accidentaly create the repo as public.
	// By hiding the option entirely, you have to go through several steps
	// to make a repo public.
    waitForKeyElements ("#new_repository > div.with-permission-fields > div:nth-child(4)", hideElement);

    function hideElement (jNode) {
        jNode.hide();
    }

	// Synthesize mouse events to pre-select the private option.
    waitForKeyElements ("#repository_public_false", triggerMostButtons);

    function triggerMostButtons (jNode) {
        triggerMouseEvent (jNode[0], "mouseover");
        triggerMouseEvent (jNode[0], "mousedown");
        triggerMouseEvent (jNode[0], "mouseup");
        triggerMouseEvent (jNode[0], "click");
    }

    function triggerMouseEvent (node, eventType) {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent (eventType, true, true);
        node.dispatchEvent (clickEvent);
    }
});
