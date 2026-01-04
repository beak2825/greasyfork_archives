// ==UserScript==
// @name              jQ EveryWhere
// @namespace         jQ EveryWhere
// @version           2020.12.31.5
// @description       Load jQuery quickly in every site without jQ loaded. Uses CDNJS API and JSCode Storage to make sure we uses the latest version and be also available in limited network. Uses GM storage function to store jQuery code, in order to decrease unneccessary networking and speed up browsing.
// @description:zh-CN 在没有jQuery库的网页上自动加载jQuery。程序使用来自CDNJS的jQuery库并使用CDNJS的API保证使用的jQuery库是最新版本。由于jQuery加载自CDNJS，所以没有翻墙也可以正常工作。使用了GM方法对jQuery的代码进行本地化存储，减少对同一版本的jQuery进行重复地网络请求，用以提升访问速度。
// @author            PY-DNG
// @match             http*://*/*
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @connect           cdnjs.cloudflare.com
// @connect           api.cdnjs.com
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/419404/jQ%20EveryWhere.user.js
// @updateURL https://update.greasyfork.org/scripts/419404/jQ%20EveryWhere.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!checkjQ()) {getLatest();};

    // Function: jQ, are you there?
    function checkjQ() {
        try {
            $();
            return true;
        } catch(e) {
            return false;
        }
    }

    // Function: Get latest jQ Library from CDNJS
    function getLatest() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.cdnjs.com/libraries/jquery?fields=version,latest',
            responseType : 'json',
            onload: function(request) {
                const reJson = request.response;
                const version = reJson['version'];
                const latestURL = reJson['latest'];
                insertjQ(latestURL, version);
            }
        })
    }

    // Function: Insert jQuery Library
    function insertjQ(jQURL, version) {
        // Try to load from local first
        let code = GM_getValue('jQ_Code', null);
        if (code && versionGreaterOrEaqualThan(GM_getValue('jQ_Version', ''), version)) {
            insertJSCode(code);
            console.log('jQ inserted from GM_LocalStorage.');
            return code;
        };

        // No local jQ stored. Get it from CDNJS.
        GM_xmlhttpRequest({
            method: 'GET',
            url: jQURL,
            responseType : 'text',
            onload: function(request) {
                code = request.responseText;
                // Insert jQ
                insertJSCode(code);
                console.log('jQ inserted from CDNJS.');
                // Store jQ code for next time
                GM_setValue('jQ_Code', code);
                // Store version if updated
                if (versionGreaterOrEaqualThan(version, GM_getValue('jQ_Version', ''))) {
                    console.log('jQ upgraded from ' + GM_getValue('jQ_Version') + ' to ' + version + ' from CDNJS');
                    GM_setValue('jQ_Version', version);
                }
            }
        })
    }

    // Function: Insert javascript code into this page
    function insertJSCode(code) {
        const script = document.createElement('script');
        script.innerHTML = code;
        document.head.appendChild(script);
    }

    // Function: Compare if ver_1 >= ver_2
    function versionGreaterOrEaqualThan(ver_1, ver_2) {
        // Split
        ver_1 = ver_1.split('.');
        ver_2 = ver_2.split('.');

        // Compare number
        const len = Math.min(ver_1.length, ver_2.length);
        for (let i = 0; i < len; i++) {
            if (ver_1[i] > ver_2[i]) {
                return true;
            } else if (ver_1[i] < ver_2[i]) {
                return false;
            }
        }

        // Compare length
        if (ver_1.length > ver_2.length) {
            return true;
        } else if (ver_1.length < ver_2.length) {
            return false;
        }
        return true;
    }
})();