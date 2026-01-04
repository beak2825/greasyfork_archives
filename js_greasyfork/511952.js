// ==UserScript==
// @name           Gartic background change
// @description    Choose the desired image or gif for the Gartic background
// @version        1.0
// @author         STRAGON
// @license        N/A
// @match          *://gartic.io/*
// @match          *://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// @icon           https://static.cdnlogo.com/logos/s/96/st.svg
// @grant          GM_addStyle
// @namespace      https://greasyfork.org/en/users/1353946-stragon-x
// @downloadURL https://update.greasyfork.org/scripts/511952/Gartic%20background%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/511952/Gartic%20background%20change.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var imageUrl = localStorage.getItem('imageUrl');

    if (window.location.href.indexOf('https://gartic.io') !== -1) {
        if (imageUrl) {
            GM_addStyle('body { background: url("' + imageUrl + '") no-repeat fixed center; background-size: cover; }');
        }

       var button = document.createElement('button');

        button.textContent = 'Change Background';
        button.style.zIndex = '99999';
        button.style.backgroundColor = 'red';
        button.style.position = 'fixed';
        button.style.bottom = '0px';
        button.style.right = '0px';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.borderRadius = '5px';
        button.onclick = function() {
            var input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function() {
                var file = input.files[0];
                var reader = new FileReader();
                reader.onload = function(event) {
                    var newImageUrl = event.target.result;
                    localStorage.setItem('imageUrl', newImageUrl);
                    GM_addStyle('body { background: url("' + newImageUrl + '") no-repeat fixed center; background-size: cover; }');
                };
                reader.readAsDataURL(file);
            };
            input.click();
        };
        document.body.appendChild(button);
        document.getElementById('background').remove();

    }
})();