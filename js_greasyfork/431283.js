// ==UserScript==
// @name         Change setTimeout
// @description  change default windows setTimeout function
// @author       kawais
// @namespace    kawais
// @include      http://www.ruanyifeng.com/*
// @version      2.1
// @run-at document-start
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/431283/Change%20setTimeout.user.js
// @updateURL https://update.greasyfork.org/scripts/431283/Change%20setTimeout.meta.js
// ==/UserScript==

var highestTimeoutId = unsafeWindow.setTimeout(";");
for (var i = 0 ; i < highestTimeoutId ; i++) {
    //unsafeWindow.clearTimeout(i); 
}


(function(window){

const oldSetTimeout = window.setTimeout;
// replace setTimeout with our hacked version
window.setTimeout = newSetTimeout;
/**
 *
 * @param {function} cb
 * @param {number} delay
 */
console.log('shit')
function newSetTimeout(cb, delay) {
console.log(cb.toString())
    // Check if callback contains string we know from the sourcecode
    if (cb && cb.toString().indexOf("function checker()")!=-1) {
        // misdeed done, restore normal setTimeout
        window.setTimeout = oldSetTimeout;
        throw new Error("Failing set timeout to kill unwanted script.");
    }
    // otherwise act as normal setTimeout
    else {
        return oldSetTimeout.call(window, arguments);
    }
}

})(window.unsafeWindow)
 

 