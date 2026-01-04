// ==UserScript==
// @name         Seek-BAdvertisers
// @namespace    https://github.com/BoKu/Seek-BAdvertisers
// @version      0.3
// @description  Hides agency adverts on Seek
// @homepage     https://github.com/BoKu/Seek-BAdvertisers
// @supportURL   https://github.com/BoKu/Seek-BAdvertisers/pulls
// @author       BoKu
// @match        *://*.seek.com.au/*
// @match        *://*.seek.co.nz/*
// @license 	 Creative Commons Attribution-ShareAlike 3.0 Unported License.
// @downloadURL https://update.greasyfork.org/scripts/445836/Seek-BAdvertisers.user.js
// @updateURL https://update.greasyfork.org/scripts/445836/Seek-BAdvertisers.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const jsonuri = 'https://raw.githubusercontent.com/BoKu/Seek-BAdvertisers/main/badvertisers.json';
    const strAdSection = "[data-search-sol-meta]";
    const strAdNameClass = ".l2mi890";

    var DeleteAds = function (badvertisers) {
        const JobsArray = document.querySelectorAll(strAdSection);
        if(badvertisers){
            JobsArray.forEach(Ad =>{
                const badvertiseName = Ad.querySelector(strAdNameClass).innerText;
                if(badvertisers.includes(badvertiseName)){
                    Ad.remove();
                    console.debug("Deleted Ad By:", badvertiseName);
                }
            })
        }
    };

    var xhr = new XMLHttpRequest();
    xhr.open('GET', jsonuri, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            console.debug(xhr.response);
            DeleteAds(xhr.response);
        } else {
            console.debug(status, xhr.response);
        }
    };
    xhr.send();

})();
