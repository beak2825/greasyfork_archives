// ==UserScript==
// @name         Download All Wawacity
// @namespace    https://greasyfork.org/fr/users/11667-hoax017
// @version      1.0.0
// @description  Permet de telecharger tout les episode d'une serie d'un simple clique (1fichier)
// @author       Hoax017
// @include      https://wlnk.ec/*
// @include      http*://*.wawacity.*/?p=serie&id=*
// @include      http*://wawacity.*/?p=serie&id=*
// @icon         https://www.wawacity.vip/favicon32.png
// @grant        none
// @esversion    6
// @downloadURL https://update.greasyfork.org/scripts/412275/Download%20All%20Wawacity.user.js
// @updateURL https://update.greasyfork.org/scripts/412275/Download%20All%20Wawacity.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var site = "1fichier"
    
    
    if (location.hostname.includes('wawacity')){
        var dlllinksDiv = document.querySelector('#DDLLinks')
        var titleDiv = dlllinksDiv.parentElement.querySelector('.wa-sub-block-title')
        titleDiv.innerHTML +=  '<span class="label" id="downloadAll">Tout telecharger</span>'
        var downloadButton = titleDiv.querySelector('#downloadAll')

        downloadButton.addEventListener('click', function() {
            var rows = dlllinksDiv.querySelectorAll('.link-row')
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].querySelectorAll('td')[1].innerText.trim() === site) {
                    var link = rows[i].querySelector('a.link').href;
                    open(link)
                }
            }
        })
    } else if (location.hostname.includes('wlnk')) {
        setTimeout(function() {
            document.querySelector('.g-recaptcha') && document.querySelector('.g-recaptcha').click()
            var interval = setInterval(function() {
            	if (!document.querySelector('.g-recaptcha') && document.querySelector('div.urls a')) {
            		window.location = document.querySelector('div.urls a').href
            		clearInterval(interval)
            	}
            }, 500)
       }, 2000)
    }
})();