// ==UserScript==
// @name         streamtape video redirector
// @namespace    https://tribbe.de
// @version      1.1.2
// @description  Redirect to link for streamtape videos
// @author       Tribbe
// @license      MIT
// @include        *streamtape.*/get_video?*
// @include        *streamtape.*/e/*
// @include        *strcloud.*
// @include        *tapecontent.*
// @include        *strtape.*
// @include        *strtpe.*
// @include        *adblockstrtech.*
// @require      https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/419943/streamtape%20video%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/419943/streamtape%20video%20redirector.meta.js
// ==/UserScript==
 
// Function to get the video from Node
function getVideoNode(jNode) {
    if (jNode[0].childNodes.length > 0 && jNode[0].childNodes[0].data.includes("get_video?"))
    {
        window.location.href = "https:" + jNode[0].childNodes[0].data;
    }
}
 
// Redirect to Video
waitForKeyElements ("#videolink", function(jNode) { getVideoNode(jNode) });
waitForKeyElements ("#ideoolink", function(jNode) { getVideoNode(jNode) });
waitForKeyElements ("#ideoooolink", function(jNode) { getVideoNode(jNode) });
waitForKeyElements ("#robotlink", function(jNode) { getVideoNode(jNode) });
waitForKeyElements ("#norobotlink", function(jNode) { getVideoNode(jNode) });
 
// Stop Autoplay
waitForKeyElements ("video[name*='media']", function(jNode) { jNode[0].autoplay = false; });