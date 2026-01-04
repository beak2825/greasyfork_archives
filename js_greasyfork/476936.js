// ==UserScript==
// @name         publink-jenkins-beautify
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  jenkins 样式美化
// @author       huangbc
// @include      *://*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476936/publink-jenkins-beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/476936/publink-jenkins-beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';

const hostName = window.location.hostname
const isJenkins = hostName == "jenkins.shb.ltd"
if (!isJenkins) return

let styleElement = document.createElement('style')
    styleElement.textContent = `
    #projectstatus-tabBar .tab { 
      margin-bottom: 8px;
    }
    #main-panel {
      padding-top: 8px;
    }
    #description {
      margin-bottom: 8px !important;  
    }
    #side-panel {
      padding-bottom: 20px !important;
    }
    #page-header,
    #safe-restart-msg {
      display: none !important;
    }
    .jenkins-buttons-row.jenkins-buttons-row--invert {
      display: none !important;
    }
    `

document.body.append(styleElement)

let tabBarStatusElement = document.getElementById('projectstatus-tabBar');
let tabBarElement = tabBarStatusElement.querySelector('.tabBar');

let tabElements = tabBarElement.querySelectorAll('.tab');

let frontTabElementIndex = 0;

let hideHref = [
  'DFNJ',
  'DFYH',
  'Geely',
  'Harmontronics',
  'XYGYL',
  'INSTA-360',
  'MKH',
  'newView'
]

for (let i = 0; i < tabElements.length; i++) {
  
  let tabElement = tabElements[i];
  let aElement = tabElement.querySelector('a');
  let href = aElement.getAttribute('href');
  
  for (let j = 0; j < hideHref.length; j++) {
    
    let hideHrefItem = hideHref[j];
    
    if (href.includes(hideHrefItem)) {
      // 删除元素
      tabBarElement.removeChild(tabElement);
    }
  }
  
  if (
    href.includes('bulid_front_code')
  ) {
    frontTabElementIndex = i;
    break;
  }
  
}

let frontTabElement = tabElements[frontTabElementIndex];

// 移动 frontTabElement 到 第二个
tabBarElement.insertBefore(frontTabElement, tabElements[1]);
// 删除之前的 frontTabElement
tabBarElement.removeChild(tabElements[frontTabElementIndex + 1]);


})();