// ==UserScript==
// @name         SSL_DOMAIN
// @namespace    https://github.com/rixoye/demo_js
// @version      0.4
// @description  输出ssl的查询结果
// @author       rixoye
// @include      https://crt.sh/?Identity=*
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/453684/SSL_DOMAIN.user.js
// @updateURL https://update.greasyfork.org/scripts/453684/SSL_DOMAIN.meta.js
// ==/UserScript==

(() => {
    "use strict";
    let domain_set = new Set();
    setTimeout(() => {
        getDomain();
        addResult();
    }, 500);
    function getDomain(){
        const elements = document.querySelectorAll("table>tbody>tr>td>table tr td:nth-last-of-type(2)")
        if (elements.length > 0) {
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (element.childElementCount === 0) {
                    //只有一个子域名
                    const raw = element.innerText?.trim();
                    domain_set.add(raw);
                }else{
                    //有多个子域名
                    const nodes = element.childNodes;
                    for (let j = 0; j < nodes.length; j++) {
                        const node = nodes[j];
                        if (node.nodeType === Node.TEXT_NODE) {
                        const raw = node.textContent?.trim();
                        domain_set.add(raw);
                        }
                    }
                }
            }
        }


    }


    function addResult(){
        let tbArea = document.getElementsByClassName("copyright");
        let td = document.createElement("td");
        td.className = "outer";
        for(let d of domain_set){
            var oLi = document.createElement('li');
            td.appendChild(oLi);
            oLi.innerHTML = d;
        }
        document.body.insertBefore(td,tbArea[0]);
    }

})();