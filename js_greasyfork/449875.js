// ==UserScript==
// @name         Long Bones NT Text.
// @version     0.3.1
// @namespace    https;//nitrotype.com/racer/jackslingeristoogood
// @description  Set Easy High-Speeds with this text. By far my favourite
// @author      TheGoatJack1
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nitrotype.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449875/Long%20Bones%20NT%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/449875/Long%20Bones%20NT%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';
const findReact = (dom, traverseUp = 0) => {
    const key = Object.keys(dom).find((key) => key.startsWith("__reactFiber$"))
    const domFiber = dom[key]
    if (domFiber == null) return null
    const getCompFiber = (fiber) => {
        let parentFiber = fiber?.return
        while (typeof parentFiber?.type == "string") {
            parentFiber = parentFiber?.return
        }
        return parentFiber
    }
    let compFiber = getCompFiber(domFiber)
    for (let i = 0; i < traverseUp && compFiber; i++) {
        compFiber = getCompFiber(compFiber)
    }
    return compFiber?.stateNode
}
    setInterval(function(){findReact(raceContainer)['state']['lessonContent']='Long bones such as the bones in your arms and legs, short bones such as the bones in your hands, feet and spine, flat bones which protect your organs and provide a place for muscles to attach, and irregular bones, which are simply all the bones that are not long, short or flat. A newborn baby has around 350 bones in their body. As they grow older, many of these bones fuse together. When two bones fuse together, they grow together, becoming one larger bone. An adult has approximately 206 bones. Nearly half of the bones in your body are found in your hands and in your feet.'},10);;
                          })();