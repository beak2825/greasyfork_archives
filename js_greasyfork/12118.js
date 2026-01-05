// ==UserScript==
// @name        Remove Netflix's Zoom on Hover
// @description This script will prevent movies listed in the sliders from enlarging when you hover over them, thus stopping movies from moving around and making the site easier to use.
// @namespace   https://zornco.com/
// @include     http*://*.netflix.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12118/Remove%20Netflix%27s%20Zoom%20on%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/12118/Remove%20Netflix%27s%20Zoom%20on%20Hover.meta.js
// ==/UserScript==

(function()
{
    var addGlobalStyle = function(css)
    {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    };

  var style = '\
.mainView .slider-item .bob-card {\
  transform: none !important;\
  width: 100% !important;\
  height: 100% !important;\
  top: 0 !important;\
  left: 0 !important;\
}\
.mainView .slider-item {\
  transform: none !important;\
}\
.bob-card .bob-overlay .bob-title {\
    font-size: 1vw !important;\
}\
.bob-card .bob-overlay .bob-info {\
    top: 0;\
}\
.bob-card .bob-overlay .bob-info .meta {\
    font-size: 0.8vw !important;\
}\
.bob-card .bob-overlay .bob-info .synopsis {\
    margin-top: 15px;\
    font-size: 0.7vw !important;\
}';

    addGlobalStyle(style);
})();