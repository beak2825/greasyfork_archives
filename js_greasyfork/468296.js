// ==UserScript==
// @name         挖地兔PDF
// @namespace
// @version      0.32
// @description  识别挖地兔report id ,在新窗口打开PDF
// @author       hunk
// @match        *://*.waditu.com/*
// @grant        none
// @license MIT

// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/468296/%E6%8C%96%E5%9C%B0%E5%85%94PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/468296/%E6%8C%96%E5%9C%B0%E5%85%94PDF.meta.js
// ==/UserScript==

sniffWaditu();
function sniffWaditu() {

    const { fetch: originalFetch } = window;
    window.fetch = async (...args) => {
        let [resource, config] = args;
        if(args[0]){
            console.log(args[0]);
            location.href=args[0];
        }

        let response = await originalFetch(resource, config);
        return response;
    };
}

