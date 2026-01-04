// ==UserScript==
// @name         Mail recievers
// @namespace    http://tampermonkey.net/
// @version      2025-12-18
// @description  Adds recievers to your mail inbox
// @author       You
// @match        https://www.warzone.com/Discussion/MyMail*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515646/Mail%20recievers.user.js
// @updateURL https://update.greasyfork.org/scripts/515646/Mail%20recievers.meta.js
// ==/UserScript==
 
(function() {
    let rows = document.getElementsByClassName("region")[0].tBodies[0].rows;
    for (let row of Array.from(rows).slice(1)) {
        processRow(row);
    }
 
    async function processRow(row) {
        let children = row.cells[1].children;
        if (children) {
            let url = children[0].href;
            let toLine = "\nsend to: " + await getNames(url);
            children[2].innerText += toLine;
        }
    }
 
    async function getNames(url) {
        let parser = new DOMParser();
        let names = [];
        let doc = await fetch(url).then(reply => reply.text()).then(text => parser.parseFromString(text, 'text/html'));
        let cell = doc.getElementsByTagName("Table")[0].rows[0].cells[0];
        for (let child of Array.from(cell.children).slice(2)){
            if (child.tagName == "BR") break;
            names.push(child.innerText.trim());
        }
        return names.join(", ");
    }
})();
