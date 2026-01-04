// ==UserScript==
// @name         sis001 helper
// @namespace    https://sis001.com/
// @version      0.5
// @description  sis001 remove noSselect and replace all a tags domain to sis001.com
// @author       cccp Huzzah Ура
// @match        *://*.sis001.com/*
// @match        *://154.84.5.250/*
// @match        *://154.84.5.235/*
// @match        *://154.84.5.249/*
// @match        *://ecj.sisurl.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397216/sis001%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/397216/sis001%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var postContainers = document.querySelectorAll("div.t_msgfont");
    if(postContainers&&postContainers.length>0){
        [].forEach.call(postContainers, function(div) {
           div.classList.remove('noSelect');
            var aTags = div.querySelectorAll("a");
            if (aTags&&aTags.length){
                    //aTags.forEach((elem) => {
                   [].forEach.call(aTags, function(elem) {
                   var href = elem.getAttribute('href');
                    if ( href.includes('68.168.16.151') ) {
                        elem.setAttribute('href', href.replace('68.168.16.151','sis001.com'))
                    }
                    if(href.includes('69.4.239.124')){
                     elem.setAttribute('href', href.replace('69.4.239.124','sis001.com'))
                    }
                    if(href.includes('67.220.92.22')){
                     elem.setAttribute('href', href.replace('67.220.92.22','sis001.com'))
                    }
                    if(href.includes('67.220.91.29')){
                     elem.setAttribute('href', href.replace('67.220.91.29','sis001.com'))
                    }
                    if(href.includes('66.90.68.150')){
                     elem.setAttribute('href', href.replace('66.90.68.150','sis001.com'))
                    }
                     if(href.includes('38.103.161.149')){
                     elem.setAttribute('href', href.replace('38.103.161.149','sis001.com'))
                    }
                });
            }

        });



    }




})();