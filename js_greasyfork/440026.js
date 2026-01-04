// ==UserScript==
// @name         mdf goods's photots download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  download mdf goods's photots
// @author       You
// @match        https://stripe-club.com/*
// @icon         https://www.google.com/s2/favicons?domain=stripe-club.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440026/mdf%20goods%27s%20photots%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/440026/mdf%20goods%27s%20photots%20download.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // iconDownload made by https://www.flaticon.com/authors/freepik
    const iconDownload = `<svg width="24" height="24" viewBox="0 0 512 512" fill="#262626"><g><g><path d="M472,313v139c0,11.028-8.972,20-20,20H60c-11.028,0-20-8.972-20-20V313H0v139c0,33.084,26.916,60,60,60h392 c33.084,0,60-26.916,60-60V313H472z"></path></g></g><g><g><polygon points="352,235.716 276,311.716 276,0 236,0 236,311.716 160,235.716 131.716,264 256,388.284 380.284,264"></polygon></g></g></svg>`;

    setTimeout(addButton, 5000);

    function addButton() {
        // get panel
        const panel = document.getElementById('item-variation');
        setButton(panel, "download-set", iconDownload);
    }

    function setButton(panel, myClass, icon) {
        // create
        const button = document.createElement("button");
        button.className = `dCJp8 afkep ${myClass}`;
        button.innerHTML = icon;
        button.addEventListener("click", getPhotos);
        panel.lastElementChild.before(button);
    }

    function download(imageURL) {
        fetch(imageURL).then(t => {
                return t.blob().then(b => {
                    const a = document.createElement("a");
                    let name = imageURL.split("/").pop();
                    a.href = URL.createObjectURL(b);
                    a.setAttribute("download", name);
                    a.click();
                });
            });
    }
    
    function getPhotos() {
        const photos = document.querySelectorAll('a[href] > img[src]');
        for (let index = 0; index < photos.length; index++) {
            const element = photos[index];
            const link = element.currentSrc;
            console.log(link);
            let originSrc = link.split("?")[0];
            if (originSrc.includes('static')) {
                continue;
            } else {
                download(originSrc);
            }
        }
    }

})();