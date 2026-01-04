// ==UserScript==
// @name         Youtube Downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Skl
// @match        https://www.youtube.com/*
// @match        https://ru.savefrom.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395591/Youtube%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/395591/Youtube%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(setDownloader, 1000);
    function setDownloader() {
        let info = document.getElementById('info');
        let infoText = document.getElementById('info-text');
        let buttonChoose = document.getElementById('buttonChoose');
        let choose = document.getElementById('choose');
        let newOption1 = new Option('360', '360');
        let newOption2 = new Option('720', '720');
        let link = document.querySelector('.link');
        let selected_Index;
        if (link) {
            window.onload = link.click();
        };
        if (!buttonChoose) {
            buttonChoose = document.createElement('button');
            buttonChoose.innerText = 'Download';
            buttonChoose.setAttribute('id', 'buttonChoose');
            buttonChoose.setAttribute('target', '_blank');
            document.querySelector('#info-text').appendChild(buttonChoose);
            choose = document.createElement('select');
            choose[0] = newOption1;
            choose[1] = newOption2;
            choose.setAttribute('id', 'choose');
            document.querySelector('#info-text').appendChild(choose);
        }
        let letDownload = 'https://ssyoutube.com/watch' + window.location.search;
        buttonChoose.onclick =
            function() {
            let newWindow = window.open(letDownload, '_blank');
            };
        info.style.overflove = 'visible';
        infoText.style.maxHeight = '4.1rem';
        infoText.style.overflove = 'visible';
        buttonChoose.style.background = '#46FF27';
        buttonChoose.style.padding = '3px';
        buttonChoose.style.borderRadius = '10px';
        buttonChoose.style.color = '#FF8703';
        buttonChoose.style.fontFamily = 'Ubuntu';
        buttonChoose.style.outline = 'none';
        buttonChoose.style.margin = '13px';
        choose.style.background = '#46FF27';
        choose.style.padding = '3px';
        choose.style.outline = 'none';
    }
    // Your code here...
})();