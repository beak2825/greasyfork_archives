// ==UserScript==
// @name         citrix
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  replace the meaningless VDI names
// @author       You
// @match        *.cloud.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cloud.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456984/citrix.user.js
// @updateURL https://update.greasyfork.org/scripts/456984/citrix.meta.js
// ==/UserScript==

let isSuccessful = false;
let lastInnerDivs = "";
let lastDesktophostnames = "";

function concatStrs(strs) {
    let result = "";
    for (let i = 0; i < strs.length; i++) {
        result += strs[i];
    }
    return result;
}

(function () {
    'use strict';

    // Your code here...
    // wait until the page is loaded
    const change = (function () {

        // if (isSuccessful) return;

        // iterate all div elements with `tabindex` attribute, find the elements whose class pattern is "resourceInfo.*"
        const innerDivs = [];
        // loop until `innerDivs` are not empty
        const divs = document.querySelectorAll("div[tabindex]");
        for (let i = 0; i < divs.length; i++) {
            const div = divs[i];
            if (div.className.match('wsui-vpvk0d esg0job0')) {
                // find its child div element whose class patter is "child_.*"
                const childDivs = div.querySelectorAll("div");
                for (let j = 0; j < childDivs.length; j++) {
                    const childDiv = childDivs[j];
                    if (childDiv.className.match('wsui-tu8wqc efe0csw0')) {
                        innerDivs.push(childDiv);
                    }
                }
            }
        }
        if (lastInnerDivs !== concatStrs(innerDivs)) console.log(innerDivs);
        lastInnerDivs = concatStrs(innerDivs);

        // sleep a while
        // this function should not block the main thread
        if (innerDivs.length === 0) {
            setTimeout(change, 1000);
            return;
        }

        // find the key in local storage starting with "cacheBucket-resources"
        let value = "";
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.match(/cacheBucket-resources.*/)) {
                value = localStorage.getItem(key);
                break;
            }
        }

        // parse value to JSON object
        const json = JSON.parse(value);
        const desktophostnames = {};

        // iterate json.data.resources
        for (let i = 0; i < json.data.resources.length; i++) {
            const resource = json.data.resources[i];
            desktophostnames[resource.id] = resource.desktophostname;
        }

        // replace "*SATX" with "Common VDI"
        for (const id in desktophostnames) {
            const desktophostname = desktophostnames[id];
            if (desktophostname.match(/.*SATX.*/)) {
                desktophostnames[id] = "MUST login Citrix as dataai.service";
            }
        }

        if (lastDesktophostnames !== JSON.stringify(desktophostnames)) console.log(desktophostnames);
        lastDesktophostnames = JSON.stringify(desktophostnames);

        // Find elements with data-testid starting with resource.id, then find their sibling with class "wsui-xd1djz e1kzv9or1" and update its innerHTML
        for (const id in desktophostnames) {
            const elements = document.querySelectorAll(`[data-testid^="${id}"]`);
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                const siblings = element.parentNode.children;
                for (let j = 0; j < siblings.length; j++) {
                    const sibling = siblings[j];
                    if (sibling.className === 'wsui-xd1djz e1kzv9or1') {
                        sibling.innerHTML = desktophostnames[id];
                        break;
                    }
                }
            }
        }
        isSuccessful = true;
        setTimeout(change, 1000)
    });

    change();
    // window.onload = change;
})();
