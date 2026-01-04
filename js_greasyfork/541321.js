// ==UserScript==
// @name        GitCode跳转Github
// @description GitCode自动重定向到GitHub,修改自https://update.greasyfork.org/scripts/499081/去你的GitCode.user.js
// @namespace   Violentmonkey Scripts
// @author      fcwys
// @match       https://gitcode.com/*
// @grant       none
// @version     1.2
// @license     MIT  
// @downloadURL https://update.greasyfork.org/scripts/541321/GitCode%E8%B7%B3%E8%BD%ACGithub.user.js
// @updateURL https://update.greasyfork.org/scripts/541321/GitCode%E8%B7%B3%E8%BD%ACGithub.meta.js
// ==/UserScript==
function FuckGitcode() {
  if(location.pathname === '/' || location.pathname === '/GitCode-official-team/GitCode-Docs/issues/198'){
    return;
  }else {
    window.location.href = "https://github.com" + window.location.pathname;
  }
}

FuckGitcode();
