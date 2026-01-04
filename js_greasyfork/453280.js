// ==UserScript==
// @name         百度云批量保存
// @name:en_US   BDY Batch Saver
// @name:zh-CN   百度云批量保存
// @namespace    System233
// @version      0.3
// @description  批量保存百度云文件
// @author       System233
// @match        *://pan.baidu.com/s/*
// @match        *://yun.baidu.com/s/*
// @icon         https://t0.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://pan.baidu.com&size=64
// @grant        none
// @license      GPL-3.0-only
// @run-at       document-start
// @source       https://github.com/System233/PIGCATS
// @notes        20231226 v0.3 修复不识别新弹窗的问题
// @notes        20221117 v0.2 修复嵌套文件夹保存问题
// @downloadURL https://update.greasyfork.org/scripts/453280/%E7%99%BE%E5%BA%A6%E4%BA%91%E6%89%B9%E9%87%8F%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/453280/%E7%99%BE%E5%BA%A6%E4%BA%91%E6%89%B9%E9%87%8F%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==
// Copyright (c) 2022 System233
//
// This software is released under the GPL-3.0 License.
// https://opensource.org/licenses/GPL-3.0
(() => {
    const logger = Object.assign({}, console);
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const waitForSelector = async (selector, node, timeout) => new Promise((resolve, reject) => {
        node = node || document;
        timeout = timeout || 10000;
        const interval = 50;
        const limit = timeout / interval;
        ;
        let times = 0;
        const handler = () => {
            const el = node.querySelector(selector);
            if (el) {
                resolve(el);
            }
            else if (times++ > limit) {
                reject(new Error("waitForSelector timeout: " + selector));
            }
            else {
                setTimeout(handler, interval);
            }
        };
        handler();
    });
    function getSelectedFileList() {
        return Array.from(document.querySelectorAll('dd.JS-item-active'));
    }
    function getFileList() {
        return Array.from(document.querySelectorAll('dd[_position]'));
    }
    function select(node, selected) {
        const current = node.matches('.JS-item-active');
        if (current == selected) {
            return;
        }
        node.querySelector('span')?.click();
    }
    function isDir(el) {
        return el.querySelector('div[class*=dir]');
    }
    const getFileName = (node) => {
        return node.querySelector('a.filename').title;
    };
    const doSave = async (path) => {
        logger.log('正在保存', path);
        await sleep(2000);
        await waitForSelector('[node-type="shareSave"]', document).then(el => el.click());
        const waitForLoading = async () => {
            const list = await waitForSelector('.treeview-root-content', document);
            while (document.querySelector('.treeview-leaf-loading') != null || list.children.length == 0) {
                await sleep(100);
            }
        };
        let lastIndex = 0, index = 0;
        while (index < path.length) {
            index = path.indexOf('/', index + 1);
            if (index == -1) {
                index = path.length;
            }
            const current = path.substring(0, index);
            await waitForLoading();
            let node = document.querySelector(`[node-path="${current}"]`);
            if (node == null) {
                const name = path.substring(lastIndex + 1, index);
                await waitForSelector('.g-button[title="新建文件夹"]', document).then(el => el.click());
                await waitForSelector('input.shareFolderInput', document).then(el => el.value = name);
                await waitForSelector('span.shareFolderConfirm', document).then(el => el.click());
                node = await waitForSelector(`[node-path="${current}"]`, document);
            }
            lastIndex = index;
            node.click();
            node.scrollIntoView();
        }
        await waitForSelector('[node-type="confirm"]', document).then(el => el.click());
        await sleep(100);
        await waitForSelector('.module-canvas-special-cancel', document).then(el => el.click());
        while (true) {
            if (document.querySelector('.after-trans-dialog')) {
                logger.log('保存成功', path);
                return true;
            }
            const iframe = document.querySelector('iframe.buy-guide-iframe-coupon[src*=buy]');
            if (iframe && iframe.contentDocument.querySelector('[class*=close]')) {
                logger.log('保存失败', path);
                Array.from(iframe.contentDocument.querySelectorAll('[class*=close]'), (e) => e.click());
                return false;
            }
            if (document.querySelector('.vip-guide-intro-tip')) {
                logger.log('保存失败.old', path);
                await waitForSelector('.dialog-close', document).then(el => el.click());
                return false;
            }
            await sleep(50);
        }
    };
    const doJoinTransfer = async (file, path) => {
        const name = getFileName(file);
        const newPath = `${path}${path.endsWith('/') ? '' : '/'}${name}`;
        logger.log("进入目录", newPath);
        await waitForSelector('.filename', file).then(x => x.click());
        await sleep(100);
        let files = [], times = 0;
        for (let i = 0; i < 20 && times < 3; ++i) {
            await waitForSelector('[style*="visibility: hidden;"] .spinner', document);
            await sleep(100);
            let next = getFileList();
            if (next.length == files.length) {
                times++;
            }
            else {
                times = 0;
            }
            files = next;
        }
        logger.log("目录内容", files.length);
        // await doTransfer(files, newpath);
        const start = 0;
        const end = files.length - 1;
        const mid = Math.floor((start + end) / 2);
        await doTransfer(files, newPath, start, mid);
        await doTransfer(files, newPath, mid + 1, end);
        await waitForSelector('a[data-deep="-1"]', document).then(x => x.click());
        await sleep(50);
        logger.log("离开目录", newPath);
    };
    const doTransfer = async (files, path, start, end) => {
        if (start == null) {
            start = 0;
        }
        if (end == null) {
            end = files.length - 1;
        }
        if (end - start < 0) {
            return;
        }
        logger.log("保存路径", path, files.length, `[${start}:${end}]`);
        files.forEach((file, i) => select(file, i >= start && i <= end));
        if (!await doSave(path)) {
            logger.log("正在切分", path);
            if (files.length == 1 || start == end) {
                await doJoinTransfer(files[start], path);
            }
            else {
                const mid = Math.floor((start + end) / 2);
                await doTransfer(files, path, start, mid);
                await doTransfer(files, path, mid + 1, end);
            }
        }
        else {
            logger.log("保存成功", path);
        }
    };
    const getLastPath = async () => {
        const name = await waitForSelector('.user-name', document).then(x => x.innerHTML);
        return localStorage.getItem(`${name}_transfer_save_path`).split('?')[0];
    };
    const setLastPath = async (value) => {
        const name = await waitForSelector('.user-name', document).then(x => x.innerHTML);
        localStorage.setItem(`${name}_transfer_save_path`, `${value}?${Date.now()}`);
    };
    const getSelectedPath = async () => {
        if (document.querySelector('.save-path-item.check')) {
            return await getLastPath();
        }
        return await waitForSelector('.treeview-node-on [node-path]', document).then(x => x.getAttribute('node-path'));
    };
    const transfer = async () => {
        await waitForSelector('[node-type="shareSave"]', document).then(el => el.click());
        const confirm = await waitForSelector('[node-type="confirm"]', document);
        confirm.addEventListener('click', async (e) => {
            e.stopImmediatePropagation();
            waitForSelector('.dialog-control span', document).then(x => x.click()).catch(logger.error);
            try {
                const files = getSelectedFileList();
                const path = await getSelectedPath();
                logger.log("开始转存", files.length);
                await doTransfer(files, path);
                await setLastPath(path);
            }
            catch (err) {
                logger.error('发生错误', err);
            }
        }, true);
    };
    const load = () => {
        const html = `<a class="g-button" href="javascript:;" title="批量保存到网盘"><span class="g-button-right"><em class="icon icon-save-disk" title="批量保存到网盘"></em><span class="text" style="width: auto;">批量保存到网盘</span></span></a>`;
        const div = document.createElement('div');
        div.innerHTML = html;
        const a = div.children[0];
        a.addEventListener('click', transfer);
        waitForSelector('[node-type="shareSave"]', document).then(node => node.after(a));
    };
    load();
})();
