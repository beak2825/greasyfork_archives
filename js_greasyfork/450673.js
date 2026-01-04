// ==UserScript==
// @name         auto-gen-tracking-number
// @namespace    http://tampermonkey.net/S
// @version      0.2
// @description  auto gen tracking number
// @author       zhouruifa
// @match        *fxg.jinritemai.com/ffa/morder/logistics/delivery*
// @match        *fxg-boe.bytedance.net/ffa/morder/logistics/delivery*
// @icon         https://lf1-fe.ecombdstatic.com/obj/eden-cn/upqphj/homepage/icon.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450673/auto-gen-tracking-number.user.js
// @updateURL https://update.greasyfork.org/scripts/450673/auto-gen-tracking-number.meta.js
// ==/UserScript==

window.addEventListener("load", function () {
    myInitCode()
});

function myInitCode() {
    const arr = document.querySelectorAll('input');
    if (arr.length < 5) {
        setTimeout(myInitCode, 1000);
        return
    }
    for (let i = 0; i < arr.length; i++) {
        let placeholder = '单号'
        let p = arr[i].getAttribute("placeholder");
        if (p != null && p.includes(placeholder) && arr[i].getAttribute("type") == "text") {
            setReactInputValue(arr[i], genSFTrackingNumber())
            setReactInputValue(document.getElementById("rc_select_1"), "顺丰速运")
            return
        }
    }
}

/**
 * See [Modify React Component's State using jQuery/Plain Javascript from Chrome Extension](https://stackoverflow.com/q/41166005)
 * See https://github.com/facebook/react/issues/11488#issuecomment-347775628
 * See [How to programmatically fill input elements built with React?](https://stackoverflow.com/q/40894637)
 * See https://github.com/facebook/react/issues/10135#issuecomment-401496776
 *
 * @param {HTMLInputElement} input
 * @param {string} value
 */
function setReactInputValue(input, value) {
    const previousValue = input.value;
    // eslint-disable-next-line no-param-reassign
    input.value = value;
    const tracker = input._valueTracker;
    if (tracker) {
        tracker.setValue(previousValue);
    }
    // 'change' instead of 'input', see https://github.com/facebook/react/issues/11488#issuecomment-381590324
    input.dispatchEvent(new Event('change', { bubbles: true }));
}

function genSFTrackingNumber() {
    // generate a random number length 13
    let num = Math.floor(1000000000000 + Math.random() * 9000000000000)
    return 'SF' + num
}