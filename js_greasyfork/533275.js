// ==UserScript==
// @name         文档自动登录
// @version      1.0
// @description  helloworld
// @author       Keny
// @match        https://doc.runmefitserver.cn/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @namespace https://greasyfork.org/users/1407617
// @downloadURL https://update.greasyfork.org/scripts/533275/%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/533275/%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function changeReactInputValue(inputDom,newText){
        let lastValue = inputDom.value;
        inputDom.value = newText;
        let event = new Event('input', { bubbles: true });
        event.simulated = true;
        let tracker = inputDom._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        inputDom.dispatchEvent(event);
    }
    const input = document.querySelector("input")
    changeReactInputValue(input, "qingnan@istarmax.com")
    const btn = document.querySelector("button")
    btn.click()
})();