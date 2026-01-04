// ==UserScript==
// @name         Github Download
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  高速下载gihthub
// @author       Joye-bot
// @license      GPL-3.0 License
// @match        *://github.com/*
// @match        *://github*
// @icon         https://github.githubassets.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451642/Github%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/451642/Github%20Download.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    const cloneUrl = [
        ["https://kgithub.com", "kGithub", "该公益加速源由 [kGithub] 提供&#10;&#10; - 缓存: 无(时间很短)"],
        ["https://ghproxy.com/https://github.com", "ghproxy", "该公益加速源由 [ghproxy] 提供"],
        ["https://hub.njuu.cf", "njuu", "该公益加速源由 [LibraryCloud] 提供"],
        ["https://hub.yzuu.cf", "yzuu", "该公益加速源由 [LibraryCloud] 提供"],
    ];

    const downloadUrl = [
        // ["https://download.fastgit.org", "FastGit", "由KevinZonda推动的FastGit项目"],
        ["https://ghproxy.com/https://github.com", "ghproxy", "由 [ghproxy] 提供"],
        // ["https://gh.gh2233.ml/https://github.com", "gh2333", "由 [@X.I.U/XIU2] 提供"],
        // ["https://gh.ddlc.top/https://github.com", "ddlc", "由 [@mtr-static-official] 提供"]
        // ['https://gh2.yanqishui.work/https://github.com', 'yanqishui', '由 [@HongjieCN] 提供'],
        ['https://ghdl.feizhuqwq.cf/https://github.com', 'feizhuqwq', '由 [feizhuqwq.com] 提供'],
        // ['https://gh-proxy-misakano7545.koyeb.app/https://github.com', 'koyeb', ''],
        ['https://gh.flyinbug.top/gh/https://github.com', 'flyinbug', '由 [Mintimate] 提供'],
        ['https://github.91chi.fun/https://github.com', '91chi', ''],
    ];

    const sshUrl = [
        ["git@git.zhlh6.cn:", "zhlh6", "利用ucloud提供的GlobalSSH"],
    ];

    const svg = [
        '<svg class="octicon octicon-file-zip mr-2" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" d="M3.5 1.75a.25.25 0 01.25-.25h3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h2.086a.25.25 0 01.177.073l2.914 2.914a.25.25 0 01.073.177v8.586a.25.25 0 01-.25.25h-.5a.75.75 0 000 1.5h.5A1.75 1.75 0 0014 13.25V4.664c0-.464-.184-.909-.513-1.237L10.573.513A1.75 1.75 0 009.336 0H3.75A1.75 1.75 0 002 1.75v11.5c0 .649.353 1.214.874 1.515a.75.75 0 10.752-1.298.25.25 0 01-.126-.217V1.75zM8.75 3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM6 5.25a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5A.75.75 0 016 5.25zm2 1.5A.75.75 0 018.75 6h.5a.75.75 0 010 1.5h-.5A.75.75 0 018 6.75zm-1.25.75a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM8 9.75A.75.75 0 018.75 9h.5a.75.75 0 010 1.5h-.5A.75.75 0 018 9.75zm-.75.75a1.75 1.75 0 00-1.75 1.75v3c0 .414.336.75.75.75h2.5a.75.75 0 00.75-.75v-3a1.75 1.75 0 00-1.75-1.75h-.5zM7 12.25a.25.25 0 01.25-.25h.5a.25.25 0 01.25.25v2.25H7v-2.25z"></path></svg>',
        '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon d-inline-block"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path></svg><svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check js-clipboard-check-icon color-fg-success d-inline-block d-sm-none"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>',
        '<svg class="octicon octicon-cloud-download" aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M9 12h2l-3 3-3-3h2V7h2v5zm3-8c0-.44-.91-3-4.5-3C5.08 1 3 2.92 3 5 1.02 5 0 6.52 0 8c0 1.53 1 3 3 3h3V9.7H3C1.38 9.7 1.3 8.28 1.3 8c0-.17.05-1.7 1.7-1.7h1.3V5c0-1.39 1.56-2.7 3.2-2.7 2.55 0 3.13 1.55 3.2 1.8v1.2H12c.81 0 2.7.22 2.7 2.2 0 2.09-2.25 2.2-2.7 2.2h-2V11h2c2.08 0 4-1.16 4-3.5C16 5.06 14.08 4 12 4z"></path></svg>'
    ];

    const style = [
        'padding:0 6px; margin-right: -1px; border-radius: 2px; background-color: var(--XIU2-back-Color); border-color: rgba(27, 31, 35, 0.1); font-size: 11px; color: var(--XIU2-font-Color);'
    ];

    /**
     * 添加克隆列表
     */
    function addCloneList() {
        if (document.querySelector('.XIU2-GC')) return;
        let html = document.querySelector('[role="tabpanel"]:nth-child(2) div.input-group');
        if (!html) return
        let href_split = html.getElementsByTagName('input')[0].getAttribute('value').split(location.host);
        let url = '';
        let _html = '';

        for (let i = 0; i < cloneUrl.length; i++) {
            url = cloneUrl[i][0] + href_split[1]
            _html +=
                `<div class="input-group XIU2-GC" style="margin-top: 4px;" title="加速源: ${cloneUrl[i][1]} (点击可直接复制)">` +
                `<input value="${url}" aria-label="${url}" title="${cloneUrl[i][2]}" type="text" class="form-control input-monospace input-sm color-bg-subtle" data-autoselect="" readonly="">` +
                `<div class="input-group-button">` +
                `<clipboard-copy value="${url}" aria-label="Copy to clipboard" class="btn btn-sm js-clipboard-copy tooltipped-no-delay ClipboardButton" tabindex="0" role="button">` +
                `${svg[1]}` +
                `</clipboard-copy>` +
                `</div>` +
                `</div>`;
        }
        html.insertAdjacentHTML('afterend', _html);
    }

    /**
     * 添加ssh列表
     */
    function addSSHList() {
        if (document.querySelector('.XIU2-GCS')) return;
        let html = document.querySelector('[role="tabpanel"]:nth-child(3) div.input-group');
        if (!html) return;
        let href_split = html.getElementsByTagName('input')[0].getAttribute('value').split(':');
        let _html = '';
        for (let i = 0; i < sshUrl.length; i++) {
            _html +=
                ` <div class= "input-group XIU2-GCS" style = "margin-top: 4px;" title = "加速源: ${sshUrl[i][1]} (点击可直接复制)"> ` +
                ` <input value = "${sshUrl[i][0] + ':' + href_split[1]}" aria - label = "${sshUrl[i][0] + ':' + href_split[1]}" title = "${sshUrl[i][2]}" type = "text" class = "form-control input-monospace input-sm color-bg-subtle" data - autoselect = "" readonly = ""> ` +
                ` <div class = "input-group-button" > ` +
                ` <clipboard - copy value = "${sshUrl[i][0] + ':' + href_split[1]}" aria - label = "Copy to clipboard" class = "btn btn-sm js-clipboard-copy tooltipped-no-delay ClipboardButton" tabindex = "0" role = "button"> ` +
                `${svg[1]}` +
                ` </clipboard-copy>` +
                `</div>` +
                `</div>`;
        }
        html.insertAdjacentHTML('afterend', _html);
    }

    /**
     * 添加download zip
     */
    function addDownloadZip() {
        if (document.querySelector('.XIU2-DZ')) return;
        let html = document.querySelectorAll('.Box-row.Box-row--hover-gray.p-3.mt-0')[1];
        if (!html) return;
        let href = html.getElementsByTagName('a')[0].href;
        let url = '';
        let _html = '';

        for (let i = 0; i < downloadUrl.length; i++) {
            url = downloadUrl[i][0] + href.split(location.host)[1];
            _html +=
                `<li class = "Box-row Box-row--hover-gray p-3 mt-0" > ` +
                `<a class = "d-flex flex-items-center color-fg-default text-bold no-underline" rel = "nofollow" data - open - app = "link" href = "${url}" title = "${downloadUrl[i][2]}" > ` +
                `<svg aria - hidden = "true" height = "16" viewBox = "0 0 16 16" version = "1.1" width = "16" data - view - component = "true" class = "octicon octicon-file-zip mr-2" > ` +
                ` <path fill - rule = "evenodd" d = "M3.5 1.75a.25.25 0 01.25-.25h3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h2.086a.25.25 0 01.177.073l2.914 2.914a.25.25 0 01.073.177v8.586a.25.25 0 01-.25.25h-.5a.75.75 0 000 1.5h.5A1.75 1.75 0 0014 13.25V4.664c0-.464-.184-.909-.513-1.237L10.573.513A1.75 1.75 0 009.336 0H3.75A1.75 1.75 0 002 1.75v11.5c0 .649.353 1.214.874 1.515a.75.75 0 10.752-1.298.25.25 0 01-.126-.217V1.75zM8.75 3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM6 5.25a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5A.75.75 0 016 5.25zm2 1.5A.75.75 0 018.75 6h.5a.75.75 0 010 1.5h-.5A.75.75 0 018 6.75zm-1.25.75a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM8 9.75A.75.75 0 018.75 9h.5a.75.75 0 010 1.5h-.5A.75.75 0 018 9.75zm-.75.75a1.75 1.75 0 00-1.75 1.75v3c0 .414.336.75.75.75h2.5a.75.75 0 00.75-.75v-3a1.75 1.75 0 00-1.75-1.75h-.5zM7 12.25a.25.25 0 01.25-.25h.5a.25.25 0 01.25.25v2.25H7v-2.25z"> </path>` +
                `</svg>` +
                `Download` +
                `ZIP ${downloadUrl[i][1]}` +
                `</a>` +
                `</li>`;
        }
        html.insertAdjacentHTML('afterend', _html);
    }

    /**
     *  添加Releases列表
     */
    function addReleasesList() {
        let html = document.querySelectorAll('.Box-footer');
        let divDisplay = 'margin-left: -90px;';
        if (document.documentElement.clientWidth > 755) {
            divDisplay = 'margin-top: -3px; margin-left: 15px; display: inherit;';
        }

        for (const current of html) {
            if (current.querySelector('.XIU2-RS')) continue;
            current.querySelectorAll('li.Box-row a').forEach(function (_this) {
                let href = _this.href.split(location.host);
                let url = '';
                let _html = `<div class = "XIU2-RS" style = "${divDisplay}"></div>`;
                for (let i = 0; i < downloadUrl.length; i++) {
                    url = downloadUrl[i][0] + href[1];
                    if (location.host !== "github.com") url = url.replace(location.host, "github.com");
                    _html +=
                        `<a style="${style[0]}" class="btn" href="${url}" title="${downloadUrl[i][2]}" rel="noreferrer noopener nofollow">${downloadUrl[i][1]}</a>`;
                }
                _this.parentElement.nextElementSibling.insertAdjacentHTML('beforeend', _html + '</div>');
            }
            );
        }
    }

    /**
     * 添加Tags列表
     */
    function addTagsList() {
        let html = document.querySelectorAll('.Box-row.position-relative.d-flex')
        let divDisplay = 'margin-left: -90px;';
        if (document.documentElement.clientWidth > 755) {
            divDisplay = 'margin-top: -3px; margin-left: 15px; display: inherit;';
        }

        for (const current of html) {
            let k = 0;
            if (current.querySelector('.XIU2-TS')) return;
            current.querySelectorAll('li.d-inline-block.mt-1.mr-2 a[rel="nofollow"]').forEach(function (_this) {
                let href = _this.href.split(location.host);
                let url = '';
                let _html = `<div class="XIU2-TS" style="${divDisplay}"></div>`;
                for (let i = 0; i < downloadUrl.length; i++) {
                    url = downloadUrl[i][0] + href[1];
                    if (location.host !== "github.com") url = url.replace(location.host, "github.com");
                    _html +=
                        `<a style="${style[0]}" class="btn" href="${url}" title="${downloadUrl[i][2]}" rel="noreferrer noopener nofollow">${downloadUrl[i][1]}</a>`;
                }
                if (k == 0) {
                    _this.parentElement.nextElementSibling.insertAdjacentHTML('afterbegin', _html + '</div>');
                    k++;
                } else {
                    _this.parentElement.insertAdjacentHTML('beforeend', _html, '</div>')
                }

            });
        }
    }

    function run() {
        addCloneList();
        addSSHList();
        addDownloadZip();
        if (location.pathname.split("/")[3] === "releases") {
            addReleasesList();
        }
        if (location.pathname.split("/")[3] === "tags") {
            addTagsList();
        }

        if (window.onurlchange === undefined) {
            addUrlChangeEvent();
        }
        window.addEventListener('urlchange', function () {
            addCloneList();
            addSSHList();
            addDownloadZip();
            if (location.pathname.split("/")[3] === "releases") {
                addReleasesList();
            }
            if (location.pathname.split("/")[3] === "tags") {
                addTagsList();
            }
        });

        const callback = (mutationsList) => {
            if (location.pathname.indexOf('/releases') === -1) return;
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType !== 1) return;
                    if (target.tagName === 'DIV' && target.dataset.viewComponent === 'true' && target.classList[0] === 'Box') {
                        addReleasesList();
                    }
                }
            }
        };
        const observe = new MutationObserver(callback);
        const options = {
            childList: true,
            subtree: true
        };
        observe.observe(document, options);
    }

    run();

    /**
     * 添加url地址改变事件
     */
    function addUrlChangeEvent() {
        history.pushState = (f => function pushState() {
            let ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('urlchange'));
            return ret;
        })(history.pushState);

        history.replaceState = (f => function replaceState() {
            let ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('urlchange'));
            return ret;
        })(history.replaceState);

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('urlchange'));
        });
    }
})();
