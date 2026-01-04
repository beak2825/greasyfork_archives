// ==UserScript==
// @name        Click to copy - Anaconda repo
// @namespace   Violentmonkey Scripts
// @match       https://anaconda.org/conda-forge/*
// @grant       GM_setClipboard
// @version     1.0
// @author      -
// @license     MIT
// @description 2/22/2023, 1:28:22 PM
// @downloadURL https://update.greasyfork.org/scripts/460490/Click%20to%20copy%20-%20Anaconda%20repo.user.js
// @updateURL https://update.greasyfork.org/scripts/460490/Click%20to%20copy%20-%20Anaconda%20repo.meta.js
// ==/UserScript==

nodes = document.querySelectorAll('code')
nodes.forEach(function(node){
  node.addEventListener('click', function(){
    content = node.textContent
    GM_setClipboard(content)
    alert('Text coppied: ' + content)
  })
})