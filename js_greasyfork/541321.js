// ==UserScript==
// @name        GitCode跳转Github
// @description GitCode自动重定向到GitHub,修改自https://update.greasyfork.org/scripts/499081/去你的GitCode.user.js
// @namespace   Violentmonkey Scripts
// @author      fcwys
// @match       https://gitcode.com/*
// @grant       none
// @version     1.3
// @license     MIT  
// @downloadURL https://update.greasyfork.org/scripts/541321/GitCode%E8%B7%B3%E8%BD%ACGithub.user.js
// @updateURL https://update.greasyfork.org/scripts/541321/GitCode%E8%B7%B3%E8%BD%ACGithub.meta.js
// ==/UserScript==
function FuckGitcode() {
  if(location.pathname.includes("/gh_mirrors/")) {
    //获取原始Github地址
    let repoId = encodeURIComponent(location.pathname.slice(1));
    let url = `https://web-api.gitcode.com/api/v2/projects/${repoId}?repoId=${repoId}&statistics=true&view=all`
    try {
        fetch(url)
        .then(response => response.json())
        .then(json => {
            window.location.href = json.import_url.replace('.git','');
        })
    } catch (error) {
        console.error("[GitCode跳转Github] 获取Github原始地址接口请求失败:", error);
    }
  }
}

FuckGitcode();
