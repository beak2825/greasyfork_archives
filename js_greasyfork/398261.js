// ==UserScript==
// @name         vup.to video redirector
// @namespace    https://tribbe.de
// @version      1.0.0
// @description  Redirect vup.to links to direct watch on movie.tribbe.de
// @author       Tribbe
// @match        https://vup.to/*
// @downloadURL https://update.greasyfork.org/scripts/398261/vupto%20video%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/398261/vupto%20video%20redirector.meta.js
// ==/UserScript==


window.addEventListener("load", function(){
	window.location.href = "https://movie.tribbe.de/vup.to.php?url=" + holaplayer.cache_.src;
});