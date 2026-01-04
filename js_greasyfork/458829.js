// ==UserScript==
// @name         Google Lens autoopen translation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  https://github.com/srghma-chinese2/srghma-chinese2.github.io
// @author       srghma@gmail.com
// @match        https://lens.google.com/search*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458829/Google%20Lens%20autoopen%20translation.user.js
// @updateURL https://update.greasyfork.org/scripts/458829/Google%20Lens%20autoopen%20translation.meta.js
// ==/UserScript==


function doAsynclyOnce({ id, isValid, onValid, onInvalid }) {
    let retries = 300;

    const intervalID = setInterval(_ => {
        const element = document.getElementById(id);
        const valid = isValid(element);
        console.log('trying ', id, ', element=', element, ', valid=', valid)
        if (valid) onValid(element)
        else onInvalid && onInvalid()

        retries--;
        if(retries === 0 || valid) clearInterval(intervalID);
    }, 100);
}

(function() {
    'use strict';
    console.log('asdfasdf')

    doAsynclyOnce({
        id: "translate",
        isValid: spanWithButton => !!spanWithButton,
        onValid: spanWithButton => {
            console.log(spanWithButton)
            spanWithButton.querySelector('button').click()

            doAsynclyOnce({
                id: "ucc-4",
                isValid: element => !!element,
                onInvalid: () => { spanWithButton.querySelector('button').click() },
                onValid: element => {
                    element.click()
                    setTimeout(() => window.close(), 900)
                }
            })
        }
    })
})();