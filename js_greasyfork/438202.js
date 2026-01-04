// ==UserScript==
// @name         Custom aliyundrive
// @namespace    https://github.com/invobzvr
// @version      1.18
// @description  阿里云直链导出
// @author       invobzvr
// @match        *://www.aliyundrive.com/drive*
// @match        *://www.aliyundrive.com/s/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @connect      localhost
// @connect      *
// @require      https://greasyfork.org/scripts/443030-hook-js/code/Hookjs.js
// @require      https://greasyfork.org/scripts/447483-box-js/code/Boxjs.js
// @homepageURL  https://github.com/invobzvr/invotoys.js/tree/main/aliyundrive
// @supportURL   https://github.com/invobzvr/invotoys.js/issues
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/438202/Custom%20aliyundrive.user.js
// @updateURL https://update.greasyfork.org/scripts/438202/Custom%20aliyundrive.meta.js
// ==/UserScript==

(function () {
    const that = {
        Toast: Box.mixin({ toast: true, time: 3e3 }),
        a2config: GM_getValue('a2config', {
            host: '127.0.0.1',
            port: 6800,
            dir: 'Download',
        }),
        xhr: function (details) {
            return new Promise((res, rej) => {
                GM_xmlhttpRequest(Object.assign(details, {
                    onerror: rej,
                    onload: res,
                }));
            });
        },
        wait: function (selectors, key) {
            return new Promise(res => {
                let el = document.querySelector(selectors),
                    iid = setInterval(() => (el ? true : el = document.querySelector(selectors)) && (key ? el[key] : true) && (clearInterval(iid), res(el)), 100);
            });
        },
        install: async function () {
            that.inithook();
            addEventListener('pushstate', that.onPushState);
            that.rk = `__reactFiber$${Object.keys(await that.wait('#root', '_reactRootContainer')).find(ii => ii.startsWith('__reactContainer$')).split('$')[1]}`;
            that.tbwmo = new MutationObserver(that.tbwmc);
            that.ddmmo = new MutationObserver(that.ddmmc);
            that.ddmmo.observe(document.body, { childList: true });
            that.mmmo = new MutationObserver(that.mmmc);
            that.init();
        },
        inithook: function () {
            History.prototype.pushState.hook({
                scope: History.prototype,
                before: function () {
                    dispatchEvent(new CustomEvent('pushstate', { detail: arguments[2] }));
                },
            });
        },
        init: async function () {
            that.listModel = (await that.wait('[class*=node-list--]'))[that.rk].return.memoizedProps.listModel;
            that.tbwmo.observe(document.querySelector('[class*=page-content--]'), { childList: true });
        },
        tbwmc: function ([mr]) {
            if (mr.addedNodes.length && (that.tbwel = mr.addedNodes[0].querySelector('[class*=toolbar-wrapper]'))) {
                let btn = that.tbwel.firstChild;
                that.tbwel.insertAdjacentHTML('afterbegin', '<div style="background:#fff;height:30px;margin-left:8px;width:.1px"></div>');
                let dlBtn = that.tbwel.insertAdjacentElement('afterbegin', btn.cloneNode(true)),
                    a2Btn = that.tbwel.insertAdjacentElement('afterbegin', btn.cloneNode(true));
                dlBtn.title = 'Download';
                dlBtn.addEventListener('click', () => that.download(that.listModel.selectedItems, that.normal));
                a2Btn.title = 'Aria2';
                a2Btn.addEventListener('click', () => that.download(that.listModel.selectedItems, that.aria2, () => [...that.listModel.selectedIds].forEach(that.listModel.removeSelect)));
                a2Btn.addEventListener('contextmenu', evt => (evt.preventDefault(), that.configa2(true)));
            }
        },
        ddmmc: function ([mr]) {
            let ddm = mr.addedNodes.length && mr.addedNodes[0].querySelector('[class*=dropdown-menu--]');
            ddm && that.listModel && that.mmmo.observe(ddm, { attributes: true, attributeFilter: ['class'] });
        },
        mmmc: function ([mr]) {
            let el = mr.target;
            if (el.className.includes('-prepare')) {
                let props = el[that.rk].child.memoizedProps,
                    list = location.pathname.startsWith('/s/') ? [props.model] : props.fileModel ? [props.fileModel] : props.fileListModel ? props.fileListModel.selectedItems : null;
                if (!list) {
                    return;
                }
                let dlBtn, a2Btn,
                    ul = el.firstChild;
                if (!el.querySelector('[custom]')) {
                    let btn = ul.firstChild;
                    ul.insertAdjacentHTML('afterbegin', '<li class="ant-dropdown-menu-item-divider" custom></li>');
                    dlBtn = ul.insertAdjacentElement('afterbegin', btn.cloneNode(true));
                    dlBtn.setAttribute('custom', 'normal')
                    dlBtn.querySelector('[class*=menu-name--]').innerText = 'Download';
                    a2Btn = ul.insertAdjacentElement('afterbegin', btn.cloneNode(true));
                    a2Btn.setAttribute('custom', 'aria2')
                    a2Btn.querySelector('[class*=menu-name--]').innerText = 'Aria2';
                } else {
                    dlBtn = ul.querySelector('[custom=normal]');
                    a2Btn = ul.querySelector('[custom=aria2]');
                }
                dlBtn.onclick = () => (that.closeMenu(), that.download(list, that.normal));
                a2Btn.onclick = () => (that.closeMenu(), that.download(list, that.aria2));
                a2Btn.oncontextmenu = evt => (evt.preventDefault(), evt.stopPropagation(), that.closeMenu(), that.configa2(true));
            }
        },
        closeMenu: function () {
            setTimeout(() => document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })));
        },
        onPushState: function (evt) {
            if (evt.detail === '/drive/' || evt.detail.startsWith('/drive/folder') || evt.detail.startsWith('/s/')) {
                !that.listModel && that.init();
            } else {
                that.listModel = null;
                that.tbwmo.disconnect();
            }
        },
        download: async function (list, func, callback) {
            list.length !== (list = list.filter(ii => ii.type == 'file')).length && new that.Toast({
                type: 'warning',
                title: 'Folders are skipped',
            });
            list.length && await func(list) && callback && callback();
        },
        normal: async function (list) {
            if (list.length === 1) {
                location.href = await that.urlOf(list[0]);
            } else {
                new Box({
                    title: 'Urls',
                    html: `<textarea style="height:${window.innerHeight * .5}px;width:100%;white-space:nowrap"></textarea>`,
                    didBuild: async modal => {
                        modal.style.width = '50%';
                        modal.querySelector('textarea').value = (await Promise.all(list.map(ii => that.urlOf(ii)))).join('\n');
                    },
                });
            }
            return true;
        },
        aria2: async function (list) {
            let a2config;
            if (!that.a2config.remember) {
                let ret = await that.configa2(false, modal => {
                    let names = [...document.querySelectorAll('#root [class*=breadcrumb-item--]')];
                    names = names.slice(1, names.length / 2).map(ii => ii.dataset.label);
                    modal.querySelector('[name=dir]').insertAdjacentHTML('afterend', `<details>
    <summary><label class="box-option-item"><input class="box-input" name="wds" type="checkbox" onchange="this.closest('details').open = this.checked"><span class="box-label">with directory structure</span></label></summary>
    <input class="box-input" name="struct" value="${names.join('/')}">
</details>`);
                });
                if (ret) {
                    a2config = ret;
                } else {
                    new that.Toast({
                        type: 'warning',
                        title: 'Cancelled',
                    });
                    return false;
                }
            }
            !a2config && (a2config = that.a2config);
            let dir = a2config.dir;
            a2config.wds && (dir = `${dir}/${a2config.struct}`);
            let data = {
                id: 'INVOTOYS',
                jsonrpc: '2.0',
                method: 'system.multicall',
                params: [await Promise.all(list.map(async ii => ({
                    methodName: 'aria2.addUri',
                    params: [[await that.urlOf(ii)], {
                        dir: dir,
                        out: ii.name,
                        referer: 'https://www.aliyundrive.com/',
                        'user-agent': navigator.userAgent,
                    }],
                })))],
            };
            if (a2config.token) {
                let token = `token:${a2config.token}`;
                data.params[0].forEach(ii => ii.params.unshift(token));
            }
            let res = await that.xhr({
                method: 'post',
                responseType: 'json',
                url: `http${a2config.https ? 's' : ''}://${a2config.host}:${a2config.port}/jsonrpc`,
                data: JSON.stringify(data),
            }).catch(err => err);
            new that.Toast(res.status == 200 ? {
                type: 'success',
                title: 'Sent to Aria2 successfully',
            } : {
                type: 'error',
                title: 'Failed to connect to Aria2',
                text: res.error,
            });
            return true;
        },
        urlOf: async function (model) {
            return model.downloadUrl || model.url || await model.getDownloadUrl();
        },
        configa2: async function (save, didBuild) {
            let ret = await new Box({
                title: 'Aria2 Config',
                html: `<form>
    <div class="box-input-group"><span class="box-label">Host</span><input class="box-input" name="host" value="${that.a2config.host}"></div>
    <div class="box-input-group"><span class="box-label">Port</span><input class="box-input" name="port" value="${that.a2config.port}"></div>
    <div class="box-input-group"><span class="box-label">Dir</span><input class="box-input" name="dir" value="${that.a2config.dir}"></div>
    <div class="box-input-group"><span class="box-label">Token</span><input class="box-input" name="token" value="${that.a2config.token || ''}"></div>
    <div class="box-options">
        <label class="box-option-item"><input class="box-input" name="https" type="checkbox"><span class="box-label"${that.a2config.https ? ' checked' : ''}>Https</span></label>
        <label class="box-option-item"><input class="box-input" name="remember" type="checkbox"><span class="box-label"${that.a2config.remember ? ' checked' : ''}>Remember</span></label>
    </div>
</form>`,
                actions: {
                    OK: modal => Object.fromEntries(new FormData(modal.querySelector('form'))),
                },
                didBuild: didBuild,
            });
            ret && (save || ret.remember) && GM_setValue('a2config', that.a2config = ret);
            return ret;
        },
    };

    that.install();
})();