// ==UserScript==
// @name         FastGit
// @version      0.8
// @description  GitHub Clone or download、Releases 下载加速
// @author       Vhxubo
// @license      MIT
// @icon         https://github.githubassets.com/favicon.ico
// @homepage     https://gist.github.com/vhxubo/d67fbd5bb3b7308b2e3690ca58e12c12
// @namespace    https://gist.github.com/vhxubo/d67fbd5bb3b7308b2e3690ca58e12c12
// @match        https://github.com/*/*
// @match        https://hub.fastgit.org/*/*
// @grant        none
// @note         2020.07.02_V0.8 适配新版 UI（Code）；修改 Releases 下载方式（更直观）；支持 hub.fastgit.org
// @note         2020.06.30_V0.7 修改 Releases 下载接口
// @note         2020.06.29_V0.6 Releases 界面点击文件体积下载，不支持 Source code 下载
// @note         2020.06.27_V0.5 适配新版 UI
// @note         2020.05.06_V0.4 新增: zipProxy - zip 下载链接
// @downloadURL https://update.greasyfork.org/scripts/402301/FastGit.user.js
// @updateURL https://update.greasyfork.org/scripts/402301/FastGit.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var gitProxy = 'https://hub.fastgit.org';
    var sshProxy = 'git@fastgit.org';
    var releaseProxy = 'https://download.fastgit.org';

    if (window.location.href.indexOf('releases') === -1) {
        var regex = /"((\/.*)+\.zip)"/;
        var domDownload = document.querySelector('span.d-flex')||document.querySelector('get-repo-controller')||document.querySelector('get-repo');
        if (domDownload !== null) {
            var oldHtml = domDownload.outerHTML;
            var zipLink = gitProxy + regex.exec(oldHtml)[1];
            var outHtml = oldHtml
            .replace('Clone or download', 'FastGit')
            .replace('Clone', 'FastGit')
            .replace('Code', 'FastGit')
            .replace(/https:\/\/github.com/g, gitProxy)
            .replace(regex, zipLink)
            .replace(/git@github.com/g, sshProxy)
            .replace('https%3A%2F%2Fgithub.com', 'https%3A%2F%2Fhub.fastgit.org');

            domDownload.insertAdjacentHTML('afterend', outHtml);
        }
    } else {
        var resDownload = document.querySelectorAll('.Box--condensed small');
        if (resDownload !== null) {
            var i;
            for (i = 0; i < resDownload.length; i++) {
                var resHref = resDownload[i].previousElementSibling.getAttribute('href');
                resDownload[i].insertAdjacentHTML(
                    'beforeend',
                    `<a title="FastGit 加速" class="pl-2 text-bold" href="${
            releaseProxy + resHref
                    }">Download</a>`
                    );
            }
        }
    }
})();
