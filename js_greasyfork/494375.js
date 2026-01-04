// ==UserScript==
// @name         Reddit Media Content Height Fix
// @namespace    http://tampermonkey.net/
// @version      2024-05-29
// @description  Sets the maximum height for embedded media to be 90% of the page height, so it doesn't span off the bottom of the screen (except when opened on the actual comment page)
// @author       You
// @match        https://www.reddit.com/*
// @exclude      https://www.reddit.com/r/*/comments/*/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494375/Reddit%20Media%20Content%20Height%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/494375/Reddit%20Media%20Content%20Height%20Fix.meta.js
// ==/UserScript==

function removePropertyFromElement(element,propertyName){
    element.style.removeProperty(propertyName);
}

function getAbsoluteHeight(el) {
    // Get the DOM Node if you pass in a string
    el = (typeof el === 'string') ? document.querySelector(el) : el;

    // Coalesce to 0 if the element doesn't exist
    if(el == null) {
        return 0;
    }

    var styles = window.getComputedStyle(el);
    var margin = parseFloat(styles.marginTop) +
        parseFloat(styles.marginBottom);

    return Math.ceil(el.offsetHeight + margin);
}

function applyNonMediaHeightVarToElement(el) {
    if(el.querySelector('.expando-button.expanded')){
        let offsets = el.querySelectorAll('.top-matter,.res-step-container,.crosspost-preview-header,.res-gallery-caption,.res-gallery-below,.res-caption,.res-expando-siteAttribution,.res-iframe-expando-drag-handle');
        var topHeight = 0;
        for (let t of offsets) {
            topHeight += getAbsoluteHeight(t);
        }

        // Add a little padding for funsies
        topHeight += 10;

        // Add space to see the next page segment
        topHeight += 30;

        var height = "calc(99vh - "+topHeight+"px)"
        var width = ""+el.offsetWidth+"px";

        var thing = el.querySelectorAll('.res-image-media');
        if(thing.length > 0){
            for(var t of thing) {
                t.style.height = height;
                removePropertyFromElement(t,"max-height");
                t.classList.add('heightAdjustedByScript');
            }
        }
        thing = el.querySelector('.media-embed');
        if(thing) {
            thing.style.setProperty('height',height);
            thing.style.setProperty('width',width);
            var c = el.querySelector('.crosspost-preview');
            if(c){
                c.classList.add('crosspost-preview-custom');
                c.classList.remove('crosspost-preview');
            }
        }
        thing = el.querySelector('.res-media-zoomable');
        if(thing) {
            thing.style.setProperty('height',height);
            thing.style.setProperty('max-width',"85vw");
            removePropertyFromElement(thing, "max-height");
        }
        thing = el.querySelector('.media-preview-content video');
        if(thing) {
            thing.style.setProperty('height',height);
            thing.style.setProperty('max-width',"85vw");
        }

        el.classList.add("heightAdjustedByScript");
    }
}

(function() {
    'use strict';

    var style = `.crosspost-preview-custom {
  border: 1px solid #C6C6C6;
    border-top-color: rgb(198, 198, 198);
    border-right-color: rgb(198, 198, 198);
    border-bottom-color: rgb(198, 198, 198);
    border-left-color: rgb(198, 198, 198);
  border-radius: 4px;
  max-width: 600px;
}`

    var styleSheet = document.createElement("style")
    styleSheet.innerText = style;
    document.head.appendChild(styleSheet);

    applyNonMediaHeightVar();
})();

function applyNonMediaHeightVar() {
    let e = document.querySelector('.entry.heightAdjustedByScript');
    if(e) {
        let ec = e.querySelector('.expando-button.collapsed');
        // Unset adjustedness if the expando is collapsed
        if(ec) {
            for (let t of e.querySelectorAll('.res-image-media,.media-embed,.res-media-zoomable')) {
                removePropertyFromElement(t,"width");
            }
            for (let t of e.querySelectorAll(".heightAdjustedByScript")) {
                t.classList.remove("heightAdjustedByScript");
            }
            e.classList.remove("heightAdjustedByScript");
        }
        // Reapply height adjust to entry if it contains unadjusted image media (to handle gallery images not existing in the DOM until first loaded)
        ec = e.querySelectorAll('.res-image-media:not(.heightAdjustedByScript)');
        if(ec.length > 0) {
            applyNonMediaHeightVarToElement(e);
        }
    }

    var els = document.querySelectorAll('.entry:not(.heightAdjustedByScript)');
    for( var el of els) {
        applyNonMediaHeightVarToElement(el);
    }



    setTimeout(applyNonMediaHeightVar,1000);
}