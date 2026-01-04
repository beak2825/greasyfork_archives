// ==UserScript==
// @name         publink-huawei-certification-lift-estriction
// @namespace    http://tampermonkey.net/
// @version      2024-01-24-04
// @description  华为认证考试限制解除
// @author       huangbc
// @include      *://*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485536/publink-huawei-certification-lift-estriction.user.js
// @updateURL https://update.greasyfork.org/scripts/485536/publink-huawei-certification-lift-estriction.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    const hostname = window.location.hostname
    const isHuawei = hostname =="developer.huawei.com"

    console.log('isHuawei', isHuawei)

    if (!isHuawei) {
        return
    }

    const body = document.body
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {

             console.log('mutation', mutation)

            if (mutation.type !== 'childList') {
                return
            }

            const containerElement = document.querySelector('.cdk-overlay-container')

            console.log('containerElement', containerElement)

            if (!containerElement) {
                return
            }

            document.body.removeChild(containerElement)

        })
    })


setInterval(() => {
      const headContent = document.querySelector('.head-content')
  
  if (headContent) {
    const infoContent = document.querySelector('.info')
    if (infoContent) {
      headContent.removeChild(infoContent)
    }
  }
  
    const containerElement = document.querySelector('.cdk-overlay-container') 
      
    if (!containerElement) {
        return
    }
    
    document.body.removeChild(containerElement)
    
}, 1000)

})();