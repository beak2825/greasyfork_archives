// ==UserScript==
// @version      2.0.0
// @author       Nmaster64
// @namespace    http://twitter.com/nmaster64
// @match        https://*.rainwave.cc/*
// @exclude      /rainwave.cc/(forums|pages|api)/
// @name         Rainwave v5: Pin Request Pane
// @description  Adds a pin/close button to the top-right of the requests pane. Pane stays fully open w/o hovering when pinned.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15671/Rainwave%20v5%3A%20Pin%20Request%20Pane.user.js
// @updateURL https://update.greasyfork.org/scripts/15671/Rainwave%20v5%3A%20Pin%20Request%20Pane.meta.js
// ==/UserScript==

// Helper Functions
var rwAddStyles = function(css) {
    var rwStyle = document.createElement('style');
    rwStyle.textContent = css.join("\n");
    document.head.appendChild(rwStyle);
}
var rwReady = function(cb) {
    if(document.readyState == "complete" || document.readyState == "loaded") {
        cb();
    } else {
        window.addEventListener("load", cb, false);
    }
};

// Style Updates
rwAddStyles([
    'body.full div.panel.requests.pinned { transform:translateX(-100%) !important; background: rgba(38, 39, 42, .9); }',
    'body.full div.panel.requests.pinned ul.request_icons li { visibility:visible; opacity:.5; }',
    'body.full div.panel.requests > div.close { display:block !important; }',
    'body.full div.panel.requests > div.close > img { display:none; }',
    'body.full div.panel.requests > div.close > img.pin  { display:block !important; }',
    'body.full div.panel.requests.pinned > div.close > img { display:block; }',
    'body.full div.panel.requests.pinned > div.close > img.pin {  display:none !important; }',
]);

// Pin Button
rwReady(function() {
    var requestsPane = document.querySelector('body.full div.panel.requests');
    var closeBtn = requestsPane.querySelector('div.close');

    var pinImg = document.createElement('img');
    pinImg.setAttribute('class', 'pin');
    pinImg.setAttribute('src', 'https://rainwave.cc/static/images4/request_pause.png');
    closeBtn.appendChild(pinImg);

    closeBtn.addEventListener('click', function(e) {
        requestsPane.classList.toggle('pinned');
    }, false);
});
