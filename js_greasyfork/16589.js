// ==UserScript==
// @name         Twitter Image 1-Click Download Background Space
// @version      0.4
// @description  Make the background area of a Twitter-hosted image (like an address ending in .jpg) a clickable download-prompt to image itself. Think of it like 'left click empty space == save-as'.
// @author       Cro
// @match        https://pbs.twimg.com/media/*
// @grant        none
// @namespace https://greasyfork.org/users/10865
// @downloadURL https://update.greasyfork.org/scripts/16589/Twitter%20Image%201-Click%20Download%20Background%20Space.user.js
// @updateURL https://update.greasyfork.org/scripts/16589/Twitter%20Image%201-Click%20Download%20Background%20Space.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var img = document.getElementsByTagName('img')[0];
    var body = document.getElementsByTagName('body')[0];

    if (img && body)
    {
        var src = img.getAttribute('src');

        if (src)
        {
            var a = document.createElement('a');

            a.setAttribute('href', src);
            a.setAttribute('download', src.substr(src.lastIndexOf('/') + 1).replace(/:.*/, ''));
            a.style.setProperty('position', 'absolute');
            a.style.setProperty('height', '100%');
            a.style.setProperty('width', '100%');
            a.style.setProperty('z-index', '-1');

            body.appendChild(a);
            body.onclick = function (evt)
            {
                if (evt.target == body)
                {
                    a.click();
                }
            };
        }
    }
})();