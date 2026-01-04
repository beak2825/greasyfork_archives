// ==UserScript==
// @name            Company filter@1point3acres.com
// @description     To filter company by keywords in 1point3acres
// @icon            https://www.1point3acres.com/bbs/favicon.ico
// @author          jaychsu
// @version         1.0.0
// @license         WTFPL
// @match           https://www.1point3acres.com/bbs/forum.*
// @namespace https://greasyfork.org/users/420771
// @downloadURL https://update.greasyfork.org/scripts/397122/Company%20filter%401point3acrescom.user.js
// @updateURL https://update.greasyfork.org/scripts/397122/Company%20filter%401point3acrescom.meta.js
// ==/UserScript==


(function() {
  'use strict'
  
  const interests = [
    'google', '谷歌', '狗', '咕',
    'facebook', 'fb', '脸', '臉',
    // 'amazon', '亚麻', '玄学',
  ]
  
  
  
  const table = document.querySelector("#threadlisttableid")
  
  let i = table.children.length
  let id, $company, $title, text

  while (i--) {
    id = table.children[i].id
    
    $company = document.querySelector(`#${id} .common span u b:last-child font`)
    text = ($company) ? $company.innerText.toLowerCase() : ''
    
    if (text && ~interests.indexOf(text)) {
      continue
    }
    
    if (text && interests.some(topic => !!~text.indexOf(topic))) {
      continue
    }
    
    $title = document.querySelector(`#${id} .common > a.s.xst`)
    text = ($title) ? $title.innerText.toLowerCase() : ''
    
    if (text && interests.some(topic => !!~text.indexOf(topic))) {
      continue
    }
    
    
    
    table.children[i].remove()
  }
})()