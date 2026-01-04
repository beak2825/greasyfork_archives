// ==UserScript==
// @name         Sage Improvments
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  When clicking the button to punch in and out it sets default org to no and then on clicking a checkount type it sets the default to R&D coding.
// @author       Nathan Price
// @match        *sagehr.bisonline.com/sta/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396552/Sage%20Improvments.user.js
// @updateURL https://update.greasyfork.org/scripts/396552/Sage%20Improvments.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let mouseDownEvent = document.createEvent('MouseEvents')
    mouseDownEvent.initMouseEvent('mousedown', true, true, window)
    let onClickFunction = () => {
        setTimeout(()=>{
            document.querySelector('[name^="org_level_depth_5__"]').dispatchEvent(mouseDownEvent)
            document.querySelector('[name^="org_level_depth_5__"]').value = 1074
            document.querySelector('[name^="org_level_depth_3__"]').dispatchEvent(mouseDownEvent)
            document.querySelector('[name^="org_level_depth_3__"]').value = 1059
            if(confirm("Working From Home?")){
                document.querySelector('[name^="org_level_depth_4__"]').dispatchEvent(mouseDownEvent)
                document.querySelector('[name^="org_level_depth_4__"]').value = 1172
            } else {
                document.querySelector('[name^="org_level_depth_4__"]').dispatchEvent(mouseDownEvent)
                document.querySelector('[name^="org_level_depth_4__"]').value = 1170
            }
        },1000)
    }
    let defaultsFix = punchLink => {
        punchLink.addEventListener('click', () => {
            setTimeout(()=>{
                document.querySelector('[name="default_org"]').dispatchEvent(mouseDownEvent)
                document.querySelector('[name="default_org"]').value = 0
                document.querySelectorAll('[name^="punch_cat_"]').forEach( button=>{
                    button.removeEventListener('click', onClickFunction)
                    button.addEventListener('click', onClickFunction)
                })
            },1000)
        })
    }
	let intervalWrappingFunction = () => {
        let checkForPunchInOutLink = setInterval(() => {
            console.log('checking')
            let punchInOutLink = document.querySelector('.header_punch_link')
            if(punchInOutLink !== null){
                defaultsFix(punchInOutLink)
                clearInterval(checkForPunchInOutLink)
            }
        }, 5000)
    }

    window.addEventListener('hashchange', function() {
        intervalWrappingFunction()
    }, false);

    intervalWrappingFunction()
})();