// ==UserScript==
// @name         gateHelper
// @namespace    http://tampermonkey.net/
// @version      0.6
// @license Amos
// @description  hack gate!
// @author       Amos
// @match        https://www.gate.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/442240/gateHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/442240/gateHelper.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

    let intervalId = setInterval(()=>{
        let el=document.querySelector('#noty_bottomLeft_layout_container')
        if(el){
            el.style.display='none'
        }
    },1000)

