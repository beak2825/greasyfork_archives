// ==UserScript==
// @name         CleanFork
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Clean up greasyfork with some css edits
// @author       codingMASTER398
// @match        *://greasyfork.org/*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/428964/CleanFork.user.js
// @updateURL https://update.greasyfork.org/scripts/428964/CleanFork.meta.js
// ==/UserScript==

css = `
.list-option-group .list-current {
   border-left: none;
   box-shadow: none;
    margin: none;
    padding: .4em 1em .4em calc(1em - 3px);
    /* background: linear-gradient(#fff,#eee); */
}
body {
    font-family: monospace;
}
.list-option-group ul {
    list-style-type: none;
    padding: 1em 0;
    box-shadow: none;
    border: none;
    background-color: #fff;
}
#main-header {
    background-color: black;
    background-image: none;
    box-shadow: 0 0 15px 2px rgb(0 0 0 / 50%);
    padding: .25em 0;
}
li {
    box-shadow: none;
    border: none;
}
`
var styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = css
document.head.appendChild(styleSheet)