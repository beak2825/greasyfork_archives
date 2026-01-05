// ==UserScript==
// @name    Color Highlighter
// @description Highlights css compatible colors (rgb and hex) on the webpage
// @include /^https?://.*/
// @namespace   whiteabelincoln
// @author      whiteabelincoln
// @version     1.0
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/16806/Color%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/16806/Color%20Highlighter.meta.js
// ==/UserScript==
(function() {
'use strict';

let getHexComponents = (hex) => {
    let components = [];
    hex = hex.replace('#', '');
    if (hex.length == 3) {
        components = hex.match(/.{1,1}/g);
        components = components.map(e => {
            return ""+e+e;
        });
    } else if (hex.length == 6) {
        components = hex.match(/.{1,2}/g);
    }
    return components;
};
    
let contrast = (rgb) => {
    let c = rgb
    .map(e => { return e/255; })
    .map(e => {
        if (e <= 0.03928) return e / 12.92;
        else return Math.pow( (e+0.055) / 1.055, 2.4);
    });
    let l = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    if (l > 0.179)
        return [0,0,0];
    else
        return [255,255,255];
};

let colorize = () => {
    var hex = new RegExp(/#([a-f\d]{6}|[a-f\d]{3})\b/ig);
    var rgb = new RegExp(/rgb(?:a)?\((\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b[, ]*){3,4}\)/ig);
    var span = document.createElement('span');

    if (window.self !== window.top) { return; }  // don't execute in a frame

    var theElems = document.evaluate(
        './/text()[normalize-space() != "" '
        + 'and not(ancestor::style) '
        + 'and not(ancestor::script) '
        + 'and not(ancestor::textarea)]',
        document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    if (!theElems.snapshotItem(0)) { return; }      // end execution if no elements found

    for (let i = 0; i < theElems.snapshotLength; i++) {
        let node = theElems.snapshotItem(i);

        if (hex.test(node.nodeValue)) {
            let sp = span.cloneNode(true);
            let hexval = node.nodeValue.match(hex)[0];
            let rgb = getHexComponents(hexval).map(e => { return parseInt(e, 16); });
            let fontColor = contrast(rgb);
            let replaceString = `<span style="background-color: $&; color: rgb(${fontColor[0]}, ${fontColor[1]}, ${fontColor[2]})">$&</span>`;
            
            sp.innerHTML = node.nodeValue.replace(hex, replaceString);
            node.parentNode.replaceChild(sp, node);
        } else if (rgb.test(node.nodeValue)) {
            let sp = span.cloneNode(true);
            let match = node.nodeValue.match(rgb)[0];
            let components = match.replace(/rgb(?:a)?\(/, '').replace(')','').split(',');
            let decimal = components.map(e => { return parseInt(e); });
            let fontColor = contrast(decimal);
            let replaceString = `<span style="background-color: $&; color: rgb(${fontColor[0]}, ${fontColor[1]}, ${fontColor[2]})">$&</span>`;
            
            sp.innerHTML = node.nodeValue.replace(rgb, replaceString);
            node.parentNode.replaceChild(sp, node);
        }
    }

};
    
unsafeWindow.colorize = colorize;
})();
