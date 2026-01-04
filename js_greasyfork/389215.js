// ==UserScript==
// @name         addlessphotopea
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Addless Photopea only for you!
// @author       You
// @match        https://www.photopea.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/389215/addlessphotopea.user.js
// @updateURL https://update.greasyfork.org/scripts/389215/addlessphotopea.meta.js
// ==/UserScript==

var bar;

function getBar() {
    if (bar) {
        return bar;
    };
    bar = document.querySelector('.panelblock.mainblock .block .panelhead');
}

function getBarMaxWitdth() {
    getBar();
    return bar.style.maxWidth;
}

function setBarMaxWitdth(value) {
    getBar();
    bar.style.maxWidth = value;
}

(function () {
    'use strict';
    var addremover = setInterval(() => {
        var mainSection = document.querySelector('.flexrow.photopea').childNodes;
        var mainpart = mainSection[0];
        var addpart = mainSection[1];
        if (addpart) {
            addpart.style.display = 'none';
            mainpart.style.width = '100%';
            document.querySelector('.panelblock.mainblock').style.width = '100%';
            console.log('Job done, script quit.')
            clearInterval(addremover);
        }
    }, 100);

    setInterval(() => {
        if (getBarMaxWitdth() !== '100%') {
            setBarMaxWitdth('100%');
        }
    }, 100)
})();
