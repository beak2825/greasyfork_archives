// ==UserScript==
// @name        Autoload Recent Upload Details - torrentbd.com
// @namespace   Violentmonkey Scripts
// @match       https://www.torrentbd.com/torrents-upload.php
// @match       https://www.torrentbd.me/torrents-upload.php
// @match       https://www.torrentbd.org/torrents-upload.php
// @match       https://www.torrentbd.net/torrents-upload.php
// @grant       none
// @version     1.2
// @author      webdevz.sk | BENZiN | CONViKT
// @license	MIT
// @description 12/2/2022, 7:13:53 PM
// @downloadURL https://update.greasyfork.org/scripts/464878/Autoload%20Recent%20Upload%20Details%20-%20torrentbdcom.user.js
// @updateURL https://update.greasyfork.org/scripts/464878/Autoload%20Recent%20Upload%20Details%20-%20torrentbdcom.meta.js
// ==/UserScript==
function loadRecents(targetNode, storageVariable){
   if (window.localStorage.getItem(storageVariable)){

    if (targetNode.matches('select')) targetNode.value = window.localStorage.getItem(storageVariable)

    if (targetNode.matches('[type="checkbox"]')){
      if (window.localStorage.getItem(storageVariable) === 'true'){
          targetNode.checked = true
      } else {
          targetNode.checked = false
      }
    }
  }

  targetNode.addEventListener('change', function(event){
    // console.log(event.target.matches('[type="checkbox"]'))
    if (event.target.matches('select')) window.localStorage.setItem(storageVariable, targetNode.value)

    if (event.target.matches('[type="checkbox"]')) window.localStorage.setItem(storageVariable, targetNode.checked.toString())
  })
}


const saveObjects = [
  {
    targetNode: document.querySelector('#filter'),
    variable:   'filter'
  },
  {
    targetNode: document.querySelector('[name="lang"]'),
    variable:   'lang'
  },
  {
    targetNode: document.querySelector('#anonycheck'),
    variable:   'anonycheck'
  },
  {
    targetNode: document.querySelector('#seedbox_check'),
    variable:   'seedbox_check'
  }
]

for (let object of saveObjects){
  loadRecents(object.targetNode, object.variable)
}

//////////////////////////////////////////////////////////////////////////////
//Description Template
document.querySelector('#torr-descr').value =
``