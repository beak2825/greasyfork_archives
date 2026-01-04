// ==UserScript==
// @name         Factorio mod downloader
// @version      0.1
// @description  Add a button to download a mod from Factorio mod Portal
// @author       dziubbas
// @match        https://mods.factorio.com/mod/*
// @namespace https://greasyfork.org/users/750477
// @downloadURL https://update.greasyfork.org/scripts/451028/Factorio%20mod%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451028/Factorio%20mod%20downloader.meta.js
// ==/UserScript==


// Yes this js is shit as fuck
function run() {
    'use strict';
    var target = document.querySelector('.text-right');
    var url = document.location;
    var button = new DOMParser().parseFromString('<div class="btn mod-download-button btn-download"> <a class="button-green text-center" href="https://1488.me/factorio/mods/#' + url + '">Download Free</a></div>',
                                                 "text/html").body.firstElementChild;


    target.append(button)





}
run();