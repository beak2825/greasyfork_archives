// ==UserScript==
// @name         cammedia auto accept TOS
// @namespace    https://www2.cammedia.com/1/chat/profile/copernicus
// @version      1.0
// @description  agrees to TOS after you click "enter"
// @author       Copernicus
// @match        https://www2.cammedia.com/*/chat.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434655/cammedia%20auto%20accept%20TOS.user.js
// @updateURL https://update.greasyfork.org/scripts/434655/cammedia%20auto%20accept%20TOS.meta.js
// ==/UserScript==

function isVisible(el){
    return el.offsetParent !== null
}

// libarary functions
function waitFor(checkFn, checkFrequencyMs, timeoutMs) {
    const startTimeMs = Date.now();
    return new Promise((res,rej)=>{
        const f = ()=>{
            const v = checkFn()
            if(v !== undefined && v !== false){
                return res(v);
            }
            if(timeoutMs && Date.now() - startTimeMs > timeoutMs) {
                return rej(new Error("Timeout exceeded"))
            }
            setTimeout(f, checkFrequencyMs)
        }
        setTimeout(f,0)
    })
}

(async function() {
    'use strict';

    let agreeBtn = await waitFor(()=> document.getElementById("t_agree") || undefined, 100, 120000)
    await waitFor(()=>isVisible(agreeBtn), 100, 120000)
    agreeBtn.click()

})();