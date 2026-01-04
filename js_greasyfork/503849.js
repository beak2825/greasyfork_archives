// ==UserScript==
// @name         Bandcamp Download Link Grabber
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Grab all download links from the bandcamp post-checkout download cart page
// @author       Maff
// @match        https://bandcamp.com/download?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bandcamp.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503849/Bandcamp%20Download%20Link%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/503849/Bandcamp%20Download%20Link%20Grabber.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var dataBindMatchStr = 'attr: { href: downloadUrl }, visible: downloadReady() && !downloadError()';
    var nDownloadables = {ready: 0, not: 0};

    function getBlock() {
        // Parent element for the whole thing
        return document.getElementsByClassName('download_list')[0];
    }

    function removeElementById(id) {
        // Remove a generic element
        let elem = document.getElementById('tm_js_GrabDlLinks_'+id);
        if(elem) {
            elem.remove();
        }
    }

    function createOrReplaceElementById(tag, id) {
        // Creates an element of the given tag, and sets its id, then returns it
        removeElementById(id);
        let elem = document.createElement(tag);
        elem.id = 'tm_js_GrabDlLinks_'+id;
        return elem;
    }

    function createContainer() {
        // Container for everything this script adds
        let container = createOrReplaceElementById('li', 'container');
        let par = getBlock();
        container.className = 'download_list_item';
        container.style.flexDirection = 'column';
        par.prepend(container);
        return container;
    }

    function getOrCreateContainer() {
        // Returns the container, creates it if it's missing
        let container = document.getElementById('tm_js_GrabDlLinks_container');
        if(container) {
            return container;
        }
        return createContainer();
    }

    function getLinksFromDocument(box) {
        // Iterates through all download items and gets the availability status and URL
        let elements = [].filter.call(getBlock().getElementsByTagName('a'), e => e.className == 'item-button');
        box.textContent = '';
        for(let link of elements) {
            if(link.hasAttribute('data-bind') && link.getAttribute('data-bind') == dataBindMatchStr) {
                if(link.href == '' || link.style.display == 'none') {
                    nDownloadables.not++;
                } else {
                    box.textContent += ''+link.href+'\n';
                    nDownloadables.ready++;
                }
            }
        }
    }

    function addLinkBlock() {
        let container = getOrCreateContainer();
        nDownloadables = {ready: 0, not: 0};
        let info = createOrReplaceElementById('span', 'info');
        let hint = createOrReplaceElementById('span', 'hint');
        let out = createOrReplaceElementById('textarea', 'output');
        out.style.minHeight = '800px';
        getLinksFromDocument(out);
        info.textContent = 'Ready to download: '+nDownloadables.ready+', preparing/failed: '+nDownloadables.not;
        hint.textContent = 'Download hint: wget --content-disposition -i <filename>';
        container.appendChild(info);
        container.appendChild(hint);
        container.appendChild(out);
    }

    function addButton() {
        let container = getOrCreateContainer();
        let link = createOrReplaceElementById('a', 'invoke');
        link.text = 'Get download links';
        link.onclick = addLinkBlock;
        container.prepend(link);
    }

    addButton();
})();