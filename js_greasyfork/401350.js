// ==UserScript==
// @name         Giphy Download GIF
// @version      1.0.1
// @description  Allows you to download GIFs direcly from GIPHY
// @author       slashinfty (originally by Yoshitura)
// @match        https://*.giphy.com/gifs/*
// @match        http://*.giphy.com/gifs/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/521879
// @downloadURL https://update.greasyfork.org/scripts/401350/Giphy%20Download%20GIF.user.js
// @updateURL https://update.greasyfork.org/scripts/401350/Giphy%20Download%20GIF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var orig_url = window.location.pathname.split('/');
    var gif_url = (/(\d|\w)[^-]*$/).exec(orig_url[2])[0];
    var download_button = document.createElement('div');
    download_button.setAttribute('style','position:absolute;left:0;top:0;margin:5px;');
    download_button.innerHTML = "<a download style='text-decoration:none;color:#FFFFFF;' href='https://i.giphy.com/"+gif_url+".gif'>DOWNLOAD GIF</a>";
    document.body.appendChild(download_button);
})();