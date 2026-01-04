// ==UserScript==
// @name         для арен
// @namespace    http://tampermonkey.net/
// @version      2
// @description  try to take over the world!
// @author       You
// @run-at       document-start
// @match        http://petridish.pw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415486/%D0%B4%D0%BB%D1%8F%20%D0%B0%D1%80%D0%B5%D0%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/415486/%D0%B4%D0%BB%D1%8F%20%D0%B0%D1%80%D0%B5%D0%BD.meta.js
// ==/UserScript==

console.log("observer mutation")
var p = {};
var m = {
    registerObserver: function() {
        if (typeof(window.WebKitMutationObserver) == 'undefined') return;
        p.observer = new window.WebKitMutationObserver(function(mutationRecords) {
            mutationRecords.forEach(function(mutationRecord) {
                for (var i = 0; i < mutationRecord.addedNodes.length; ++i) {
                    checkNode(mutationRecord.addedNodes[i]);
                }
            });
        });
        p.observer.observe(window.document, {
            subtree: true,
            childList: true,
            attribute: false
        });
    }
};

m.registerObserver();
function checkNode(node) {


    var tag = node.parentElement ? node.parentElement.tagName : "";

    if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
            node.textContent = node.textContent.replace(/ > zoom/g, ' > zoom && false');
            node.textContent = node.textContent.replaceAll('if (isFB == 1) { event.preventDefault(); }', 'if(0 > zoom) { zoom = 0; }\nif (isFB == 0) { event.preventDefault(); }');
    }
if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
            node.textContent = node.textContent.replaceAll(' function drawBorders(ctx) {', `function drawBorders(ctx) {         ctx.save();
        ctx.beginPath();
        ctx.rect(-mapmaxX, -mapmaxY, mapmaxX * 3, mapmaxY);
        ctx.rect(mapmaxX, 0, mapmaxX, mapmaxY * 2);
        ctx.rect(-mapmaxX, 0, mapmaxX, mapmaxY * 2);
        ctx.rect(0, mapmaxY, mapmaxX, mapmaxY);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(0, 0, mapmaxX, mapmaxY);
        ctx.restore();`);
    }
 if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
            node.textContent = node.textContent.replaceAll(`if (users[i].name == 'Congratulations') {`, `if (users[i].name == 'Game starting in') {`);
    }
if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
            node.textContent = node.textContent.replace(`'black hole':'blackhole2',`, `'black hole':'geo1',`);
}
if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
            node.textContent = node.textContent.replaceAll(`anus`, `white hole`);
}};