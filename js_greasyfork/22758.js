// ==UserScript==
// @name         Slither.io Donuts
// @namespace    https://goo.gl/7XnfAz
// @version      1.0
// @description  Slither.io Donuts is a slither.io extension that allows you to create your own custom skins. Please, subscribe to the developer on YouTube: https://goo.gl/7XnfAz. If you use the extension for your videos, please, credit my channel.
// @author       Donut (subscribe on YouTube: https://goo.gl/7XnfAz)
// @include      http://slither.io/
// @include      http://slither.io/#*
// @run-at       document-end
// @grant        none
// @icon         https://googledrive.com/host/0B2idj5LI1QjHLVpGUEpIcGRIeVU/
// @downloadURL https://update.greasyfork.org/scripts/22758/Slitherio%20Donuts.user.js
// @updateURL https://update.greasyfork.org/scripts/22758/Slitherio%20Donuts.meta.js
// ==/UserScript==
(function(){
    var script = document.createElement('script');
    script.src = 'https://googledrive.com/host/0B2idj5LI1QjHNmxjRUN0NzdPQmc/';
    script.onload = function() {
        this.parentNode.removeChild(this);
    };
    document.head.appendChild(script);
})();