// ==UserScript==
// @name         aedownload helper
// @namespace    https://aedownload.com/
// @version      0.1
// @description  aedownload
// @author       cccp Huzzah Ура
// @match        https://aedownload.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404072/aedownload%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/404072/aedownload%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var postContainers = document.querySelectorAll(".excerpt-img");
    if(postContainers&&postContainers.length>0){
        [].forEach.call(postContainers, function(div) {
          // div.classList.remove('noSelect');
            var aTags = div.querySelectorAll("img");
            if (aTags&&aTags.length){
                    //aTags.forEach((elem) => {
                   [].forEach.call(aTags, function(elem) {
                   var href = elem.getAttribute('src');
                    if ( href.includes('i0.wp.com/aedownload.com') ) {
                        elem.setAttribute('src', href.replace('i0.wp.com/aedownload.com','aedownload.com'))
                    }
                      //i1.wp.com/aedownload.com
                    if ( href.includes('i1.wp.com/aedownload.com') ) {
                        elem.setAttribute('src', href.replace('i1.wp.com/aedownload.com','aedownload.com'))
                    }
                    if ( href.includes('i2.wp.com/aedownload.com') ) {
                        elem.setAttribute('src', href.replace('i2.wp.com/aedownload.com','aedownload.com'))
                    }
                });
            }

        });



    }



})();