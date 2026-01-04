// ==UserScript==
// @name                Github 快捷查找活跃的Forks列表
// @name:zh-CN          Github 快捷查找活跃的Forks列表
// @name:en             Github Find Active Forks
// @namespace           https://greasyfork.org/users/1298296
// @author              s0nd9r
// @homepageURL         https://github.com/s0nd9r
// @version             1.0
// @description         快捷查找活跃的Forks列表，可以快速了解各个分叉的热度，比如在主项目存档不维护时，就能知道有哪个新分叉有更新
// @description:zh-CN   快捷查找活跃的Forks列表，可以快速了解各个分叉的热度，比如在主项目存档不维护时，就能知道有哪个新分叉有更新
// @description:en      Allows you to find the most active forks of a repository.
// @icon       data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACEUExURUxpcRgWFhsYGBgWFhcWFh8WFhoYGBgWFiUlJRcVFRkWFhgVFRgWFhgVFRsWFhgWFigeHhkWFv////////////r6+h4eHv///xcVFfLx8SMhIUNCQpSTk/r6+jY0NCknJ97e3ru7u+fn51BOTsPCwqGgoISDg6empmpoaK2srNDQ0FhXV3eXcCcAAAAXdFJOUwCBIZXMGP70BuRH2Ze/LpIMUunHkpQR34sfygAAAVpJREFUOMt1U+magjAMDAVb5BDU3W25b9T1/d9vaYpQKDs/rF9nSNJkArDA9ezQZ8wPbc8FE6eAiQUsOO1o19JolFibKCdHGHC0IJezOMD5snx/yE+KOYYr42fPSufSZyazqDoseTPw4lGJNOu6LBXVUPBG3lqYAOv/5ZwnNUfUifzBt8gkgfgINmjxOpgqUA147QWNaocLniqq3QsSVbQHNp45N/BAwoYQz9oUJEiE4GMGfoBSMj5gjeWRIMMqleD/CAzUHFqTLyjOA5zjNnwa4UCEZ2YK3khEcBXHjVBtEFeIZ6+NxYbPqWp1DLKV42t6Ujn2ydyiPi9nX0TTNAkVVZ/gozsl6FbrktkwaVvL2TRK0C8Ca7Hck7f5OBT6FFbLATkL2ugV0tm0RLM9fedDvhWstl8Wp9AFDjFX7yOY/lJrv8AkYuz7fuP8dv9izCYH+x3/LBnj9fYPBTpJDNzX+7cAAAAASUVORK5CYII=
// @match               *://github.com/*
// @run-at              document-end
// @grant               none
// @license             LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/494365/Github%20%E5%BF%AB%E6%8D%B7%E6%9F%A5%E6%89%BE%E6%B4%BB%E8%B7%83%E7%9A%84Forks%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/494365/Github%20%E5%BF%AB%E6%8D%B7%E6%9F%A5%E6%89%BE%E6%B4%BB%E8%B7%83%E7%9A%84Forks%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function () {
    'use strict'
    function applyNodeActivefork () {
        var activeforkNode = document.querySelector("#active-forks-button-repo");
        if (activeforkNode == null) {
            var pageheadaction = document.querySelector(".pagehead-actions");
            if (pageheadaction != null) {
                var tempNode = document.createElement('li');
                var repositoryLinkNode = document.querySelector("main .pt-3 .mr-2 a");
                if (repositoryLinkNode != null) {
                    var repositoryLink = repositoryLinkNode.href;
                    tempNode.innerHTML = '<details class="details-reset details-overlay f5 position-relative"><summary id="active-forks-button-repo" class="btn btn-sm"><svg class="octicon octicon-graph UnderlineNav-octicon d-none d-sm-inline" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 1.75a.75.75 0 00-1.5 0v12.5c0 .414.336.75.75.75h14.5a.75.75 0 000-1.5H1.5V1.75zm14.28 2.53a.75.75 0 00-1.06-1.06L10 7.94 7.53 5.47a.75.75 0 00-1.06 0L3.22 8.72a.75.75 0 001.06 1.06L7 7.06l2.47 2.47a.75.75 0 001.06 0l5.25-5.25z"></path></svg><font><a href="https://techgaun.github.io/active-forks/index.html#'+ repositoryLink +'" target="_blank">Active Forks</a></font></summary></details>';
                    pageheadaction.appendChild(tempNode);
                }

            }
        }
    }


    var main = document.querySelector('main');
    if (main != null) {
        var observer = new MutationObserver(function (mutations, observer) {
            applyNodeActivefork();
        })
        observer.observe(main, {
            childList: true
        })
        applyNodeActivefork();
    }

})()