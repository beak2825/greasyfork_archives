// ==UserScript==
// @name         Scratch 3 Developer Tools
// @namespace    Hans5958
// @version      1.0.0
// @description  To enhance your Scratch Editing Experience. Injects the code on the source code from https://github.com/griffpatch/Scratch3-Dev-Tools. (Deprecated: Use Scratch Addons instead.)
// @author       griffpatch (ported by Hans5958)
// @match        http*://scratch.mit.edu/projects/editor
// @match        http*://scratch.mit.edu/projects/*
// @match        http*://scratch.mit.edu/projects/*/editor
// @icon         https://cdn.jsdelivr.net/gh/griffpatch/Scratch3-Dev-Tools/bigIcon.png
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/Hans5958/userscripts
// @supportURL   https://github.com/Hans5958/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/444664/Scratch%203%20Developer%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/444664/Scratch%203%20Developer%20Tools.meta.js
// ==/UserScript==

var js = document.createElement('script')
js.src = 'https://cdn.jsdelivr.net/gh/griffpatch/Scratch3-Dev-Tools/inject3.js'

var css = document.createElement('link')
css.href = 'https://cdn.jsdelivr.net/gh/griffpatch/Scratch3-Dev-Tools/inject.css'
css.rel = 'stylesheet'

var head = document.getElementsByTagName('head')[0]
head.appendChild(js)
head.appendChild(css)