// ==UserScript==
// @name         Get of extension from Chrome-WebStore [chrome.google.com]
// @version      0.2
// @description  Add button for get .crx of extension or theme from Chrome-WebStore
// @description  Bookmartklet version: http://bit.ly/get_crx_chrome_bookmarklet
// @author       Vyacheslav Vasiliev
// @include      *chrome.google.com/webstore/*
// @namespace    132-148-320
// @copyright    © 2017, Vyacheslav Vasiliev (vyach.vasiliev\аt\gmail\dоt\com)
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/29940/Get%20of%20extension%20from%20Chrome-WebStore%20%5Bchromegooglecom%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/29940/Get%20of%20extension%20from%20Chrome-WebStore%20%5Bchromegooglecom%5D.meta.js
// ==/UserScript==


(function () {
    var install_button = document.querySelector('[role="dialog"] div[role="button"][aria-label]');
    if (install_button) {
        var install_button_classes = install_button.className;
        var get_crx_button = document.createElement('a');
        get_crx_button.className = install_button_classes;
        get_crx_button = install_button.parentNode.insertBefore(get_crx_button, install_button);
        get_crx_button.innerText = "Get .crx file";
        get_crx_button.id = 'get-crx-file';
        var crx_param = getCRXParam();
        var crx_name = crx_param[0];
        var crx_url_download = crx_param[1];
        get_crx_button.setAttribute('download', crx_name+'.crx');
        get_crx_button.setAttribute('href', crx_url_download);

        // add style for button
        var get_crx_button_style = '#get-crx-file {margin-right:2px; } #get-crx-file:hover {opacity:0.8; }';
        addStyle(get_crx_button_style);
        // if not added style
        get_crx_button.style.marginRight = "2px";
    }
    function getCRXParam() {
        // console.info('press getCRX');
        var crx_url_download = 'https://clients2.google.com/service/update2/crx?response=redirect&prodversion=49.0&x=id%3D%ID_EXTENSION%%26installsource%3Dondemand%26uc';
        var id_extension = window.location.pathname.split('/').slice(-1);
        if (id_extension) {
            crx_url_download = crx_url_download.replace('%ID_EXTENSION%', id_extension);
            // console.info('Build get .crx of url: %s', crx_url_download);
        }
        var crx_name = document.title.split('-')[0].trim();
        if(!crx_name) crx_name = id_extension;
        return [crx_name, crx_url_download];
    }
    function addStyle(css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    }
})();