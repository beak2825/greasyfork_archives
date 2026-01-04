// ==UserScript==
// @name         MPGH Code Enhance
// @namespace    mpgh8otto
// @version      1.0
// @description  Add select, copy and download function to code sections.
// @author       8otto
// @match        https://www.mpgh.net/forum/showthread.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mpgh.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462634/MPGH%20Code%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/462634/MPGH%20Code%20Enhance.meta.js
// ==/UserScript==

window.selectText = (element, copy = false) => {
    var range = document.createRange();
    range.selectNodeContents(element);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    if (copy) document.execCommand('copy');
    return false;
}

window.downloadText = (element) => {
    const fileContent = element.textContent;
    const blob = new Blob([fileContent], {type: 'text/plain'});
    const tmp = document.createElement('a');
    tmp.href = window.URL.createObjectURL(blob);
    tmp.setAttribute('download', 'Code.txt');
    tmp.style.display = 'none';
    document.body.appendChild(tmp);
    tmp.click();
    document.body.removeChild(tmp);
    return false;
}

(function() {
    'use strict';
    const select = document.createElement("a");
    select.href = "#select";
    select.setAttribute("onclick", "return selectText(this.parentElement.nextElementSibling);");
    select.appendChild(document.createTextNode("[SELECT]"));
    const copy = document.createElement("a");
    copy.href = "#copy";
    copy.setAttribute("onclick", "return selectText(this.parentElement.nextElementSibling, true);");
    copy.appendChild(document.createTextNode("[COPY]"));
    const download = document.createElement("a");
    download.href = "#download";
    download.setAttribute("onclick", "return downloadText(this.parentElement.nextElementSibling);");
    download.appendChild(document.createTextNode("[DOWNLOAD]"));
    var bbdesc = document.getElementsByClassName("bbcode_description");
    for(var desc of bbdesc) if(desc.textContent=="Code:") desc.innerHTML += " " + select.outerHTML + "  " + copy.outerHTML + "  " + download.outerHTML;
})();