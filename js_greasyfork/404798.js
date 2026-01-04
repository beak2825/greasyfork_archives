// ==UserScript==
// @name         nofollow
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  seo相关的插件，替换单独的“nofollow”插件 并 支持检测 rel='noopener noreferrer'
// @author       情歌总唱不厌
// @match       http://www.sunchen.xyz/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404798/nofollow.user.js
// @updateURL https://update.greasyfork.org/scripts/404798/nofollow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var oStyle=document.createElement("style");
    oStyle.setAttribute("type","text/css");
    oStyle.innerHTML=`a[rel~='nofollow'], a[rel~='sponsored'], a[rel~='ugc'] {outline: .14em dotted red !important;outline-offset: .2em;}
                                     a[rel='noopener noreferrer']:after{content:"";position:absolute;display:inline-block;width:16px;height:16px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAABlklEQVQ4T52SP0hVYRjGf++51zyc/gxBY1STQyCJ3dPSoEHQ0CJt4dLU0mDX4Z4jDmfJqyg6RgVFhEMiYgQRQrWfzwtJLQVBm0Nom165dh45FxXvvRHSN30fvL/vfZ/nfYz/PNbODSQqbvncBcYldjIYrcW20l7XBPeLy4gAa0JrO7uMnChw3WAKI5N4i8dnV7EXOdMEw2ld0h+WJB7isb5asW8tHRJ5/QFXChlv0sjOt4PPXWSD/5IcVvUzje3iscDLiU4FPssZ3CmItb+CEmXPuJfWGSGx7FqiM+pmRTDnYnvd0bFvRheKDV662AbCqh4LTjd8HnTV+Sgxtzpmr5petI/a/0Rd3iZfXWw9SBZOMg/cklFxkT3Lob4JnSt6fHCR9R5qzC+lST01411asWUWVCj94KaL7f2BWaWqZoANF1u1Beyd1snuXT6ZGE7H7PtRd8MJ3ZYRZWcZrN23RguYP65OqcfLF208CraZ/wV+4FMGhurixpfYfh982BG5fS2zBsN5ggSLWZ3ZWmJbR6foAI+b+T2WS6wP9vdT0gAAAABJRU5ErkJggg==);
                                    background-repeat:no-repeat;vertical-align:top;}`
    document.querySelector("head").appendChild(oStyle)
})();