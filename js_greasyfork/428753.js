// ==UserScript==
// @name         fuckseo
// @namespace    https://github.com/k1995/fuckseo
// @version      0.2
// @description  Fucking SEO
// @author       Youhttps://github.com/k1995
// @match        *://www.google.com/search*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428753/fuckseo.user.js
// @updateURL https://update.greasyfork.org/scripts/428753/fuckseo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isMatch = function(s, p) {
        let dp = Array(s.length+1).fill(null).map(()=>Array(p.length+1).fill(false));
        dp[0][0] = true;

        // initialize first column (string)
        for (let i=1;i<=s.length;i++) {
            dp[i][0] = false;
        }

        // initialize first row (pattern)
        for (let i=1;i<=p.length;i++) {
            dp[0][i] = dp[0][i-1] && p[i-1] == "*";
        }

        for (let i=1;i<=s.length;i++) {
            for (let j=1;j<=p.length;j++) {
                if (p[j-1]=='*') {
                    dp[i][j] = dp[i-1][j] || dp[i][j-1]; // look top or left
                } else if (s[i-1] == p[j-1] || p[j-1]=='?') {
                    dp[i][j] = dp[i-1][j-1]; // inherit from previous result
                }
            }
        }
        return dp[s.length][p.length]
    }

    document.querySelectorAll("#rso .g").forEach((searchItem) => {
        const target = searchItem.querySelector(".yuRUbf>a")
        const blocklist = [
            "*://www.huaweicloud.com/articles/*",
            "*://cloud.tencent.com/developer/*",
            "*://qastack.cn/*",
            "*coder.work*",
            "*://www.aliyun.com/sswd/*",
            "*mlog.club*",
            "*://*.voidcc.com/*",
            "*://*.codeday.me/*",
            "*://*.voidcn.com/*",
            "*://*.codenong.com/*",
            "*://*.helplib.com/*",
            "*://*.jishuwen.com/*"
        ]
        for(let patten of blocklist) {
            if(isMatch(target.href, patten)) {
                searchItem.style.display = 'none';
                console.log("Fucking SEO: " + target.href);
            }
        }
    });
})();