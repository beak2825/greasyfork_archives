// ==UserScript==
// @name         SrrDB Search
// @namespace    Check scene
// @version      1.1
// @description  Check for Scene release
// @match        https://passthepopcorn.me/torrents.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432277/SrrDB%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/432277/SrrDB%20Search.meta.js
// ==/UserScript==
 
var toSearch
 
document.querySelectorAll("a[title='Download']").forEach(a => a.style.display = "none");
 
(function() {
    'use strict';
 
    var fileLists = document.querySelectorAll('div[id^="files_"] > div')
    for (var fileList of fileLists) {
        var fileName = fileList.childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[3].innerText.slice(1,-1)
        if (fileName !== "") {
            toSearch = fileName
        } else {
            toSearch = fileList.childNodes[1].childNodes[3].childNodes[1].childNodes[0].innerText.replace(new RegExp(/(\.iso)|(\.mkv)|(\.avi)|(\.mp4)/, "i"), "")
        }
        toSearch = toSearch.replace(new RegExp(/[&\/\\#,+()$~%_'":*?<>{}\]\[`]/, "g"), "").replace(/[\u0300-\u036f]/g, "")
        fileList.parentNode.parentNode.parentNode.previousElementSibling.childNodes[1].childNodes[1].childNodes[1].insertAdjacentHTML("beforebegin", `<a class="linkbox__link" target="_blank" href="http://www.dereferer.me/?https://www.srrdb.com/release/details/${toSearch}">SRRDB</a> | `)
    }
})();