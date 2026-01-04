// ==UserScript==
// @name         Wanikani Forums: Expand Tall Images
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  Expands tall images on the Wanikani forums
// @author       Kumirei
// @include      https://community.wanikani.com*
// @require      https://greasyfork.org/scripts/432418-wait-for-selector/code/Wait%20For%20Selector.js?version=974318
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372817/Wanikani%20Forums%3A%20Expand%20Tall%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/372817/Wanikani%20Forums%3A%20Expand%20Tall%20Images.meta.js
// ==/UserScript==

(function($, wfs) {
    //wait for images
    wfs.wait('.lightbox img', function(elem) {
        //get the infos
        var dim = [elem.width, elem.height];
        if (elem.height == 500) {//all images which need to be expanded are 500px height
            if ($(elem.nextSibling).find('.informations').length) {
                var infoElem = $(elem.nextSibling).find('.informations')[0];
                var ogDim = infoElem.innerHTML.split(' ')[0];
                if (ogDim.includes("x")) ogDim = ogDim.split('x');
                else if (ogDim.includes("×")) ogDim = ogDim.split('×');
                var scaledDim = [dim[0], Math.round(dim[0]/ogDim[0]*ogDim[1])]; //scales the height to the current width
                if (scaledDim[1] != 499 && dim[1] != scaledDim[1]) {//499 happened often, persumably because Discourse rounds up
                    var url = elem.closest('.lightbox').href;
                    elem.src = url;
                    elem.height = scaledDim[1];
                    elem.style = 'max-height: unset;';
                    infoElem.innerHTML += ' <small>Expanded as tall image</small>';
                }
            }
        }
    });
})(window.jQuery, window.wfs);
