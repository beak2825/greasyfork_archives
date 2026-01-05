// ==UserScript==
// @name            [ALL] Block HTML5 Video
// @author
// @description     Block HTML5 video.
// @downloadURL
// @grant
// @homepageURL     https://bitbucket.org/INSMODSCUM/userscripts-scripts/src
// @icon
// @include         http*://*
// @namespace       insmodscum 
// @require
// @run-at          document-start
// @updateURL
// @version         1.0
// @downloadURL https://update.greasyfork.org/scripts/20691/%5BALL%5D%20Block%20HTML5%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/20691/%5BALL%5D%20Block%20HTML5%20Video.meta.js
// ==/UserScript==

(function(){
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.textContent = 'document.createElement("video").constructor.prototype.canPlayType = function(type){return ""}';
    document.documentElement.appendChild(script);
})();