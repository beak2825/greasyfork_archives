// ==UserScript==
// @name         USACO Language Selector
// @version      1.0
// @description  Automatically selects language to submit based on file extension
// @match        *usaco.org/index.php?page=viewproblem2&cpid=*
// @namespace https://greasyfork.org/users/731318
// @downloadURL https://update.greasyfork.org/scripts/420668/USACO%20Language%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/420668/USACO%20Language%20Selector.meta.js
// ==/UserScript==

const fileExtensionToLanguage = {
    c: 0, //C
    cpp: 2, //C++11
    java: 3, //Java
    pas: 4, //Pascal
    py: 6, //Python 3.4.0
}

const languageSelector = document.getElementsByName("language")[0]
const fileSelector = document.getElementsByName("sourcefile")[0]

fileSelector.onchange = function () {
    const files = fileSelector.files
    if (files.length > 0) {
        const file = files[0]
        const name = file.name
        const extension = name.substr(name.lastIndexOf(".") + 1)
        if (extension.toLowerCase() in fileExtensionToLanguage) {
            languageSelector.selectedIndex = fileExtensionToLanguage[extension]
        }
    }
}