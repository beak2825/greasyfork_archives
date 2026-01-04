// ==UserScript==
// @name         Hides all images
// @namespace    *://*/*
// @version      0.2
// @description  Hides all images with Ctrl+Alt+1
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40365/Hides%20all%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/40365/Hides%20all%20images.meta.js
// ==/UserScript==

window.hideAllImages = function () {

    document.body.style.setProperty('background', 'none', 'important');
    var allImgs = document.querySelectorAll('img, video, iframe, picture, svg');
    for (var i = 0; i < allImgs.length; i++) {
        allImgs[i].style.setProperty('display', 'none', 'important');
    }
    var elementNames = ['div', 'body', 'table', 'tr', 'td', 'span', 'a'];
    elementNames.forEach(function (tagName) {
        var tags    = document.getElementsByTagName(tagName);
        var numTags = tags.length;
        for (var i = 0; i < numTags; i++) {
            var tag = tags[i];
            if (getComputedStyle(tag, null).getPropertyValue('background').match('url')) {
                tag.style.setProperty('background', 'none', 'important');
            }
        }
    });
    var allYtIframes = document.querySelectorAll('iframe[src*="youtube"]');
    document.body.innerHTML = document.body.innerHTML.replace(/minecraft/ig, 'xkcd');
    for (var i = 0; i < allYtIframes.length; i++) {
        allYtIframes[i].style.setProperty('display', 'none', 'important');
    }
    var link  = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel  = 'shortcut icon';
    document.title = document.title.replace(/minecraft/ig, 'xkcd');
    link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oFFAADATTAuQQAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAEklEQVQ4y2NgGAWjYBSMAggAAAQQAAGFP6pyAAAAAElFTkSuQmCC';
    document.getElementsByTagName('head')[0].appendChild(link);
};

document.onkeyup = function (event) {
    event = event || window.event;
    if (event.altKey && event.ctrlKey && event.which == 49) { // Ctrl+Alt+1
        hideAllImages();
        return false;
    }
};
