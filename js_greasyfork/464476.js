// ==UserScript==
// @name        All traffic referring sites
// @namespace   peasoft.github.io
// @match       https://github.com/*/*/graphs/traffic
// @grant       none
// @version     1.1
// @author      陆鎏澄
// @description 为 GitHub 仓库访问量统计（Insights -> Traffic）的所有域名（主要是 github.com）添加链接。
// @icon        https://github.com/favicon.ico
// @license     CC BY-NC-SA
// @downloadURL https://update.greasyfork.org/scripts/464476/All%20traffic%20referring%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/464476/All%20traffic%20referring%20sites.meta.js
// ==/UserScript==

function AllDomains(){
    if (location.search.includes("referrer")){
        return;
    }
    let toptable = document.getElementById("top-domains");
    if (!toptable){
        setTimeout(AllDomains, 1000);
        return;
    }
    let domains = toptable.querySelectorAll(".capped-list-label");
    if (domains.length == 0){
        setTimeout(AllDomains, 1000);
        return;
    }
    for (let i = 0; i < domains.length; i++) {
        const domain = domains[i];
        if (domain.childNodes.length == 3){
            const domainStr = domain.lastChild.data.trim()
            if (domainStr.includes('.')){
                domain.replaceChild(document.createTextNode(' '), domain.lastChild);
                let link = document.createElement("a");
                link.href = new String(location.pathname)+"?referrer="+domainStr+"#top-domains";
                link.innerText = domainStr;
                domain.appendChild(link)
            }
        }
    }
}
AllDomains();
