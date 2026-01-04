// ==UserScript==
// @name         站酷网下载与复制Base64（支持批量命名）
// @namespace    zhanku-download
// @version      1.3.0
// @icon         https://static.zcool.cn/git_z/z/site/favicon.ico?version=1618914637608
// @description  提供站酷网原图下载与Base64复制功能，支持自动或手动命名，解除右键限制
// @author       修改：blog.z-l.top 原作者：sertraline
// @match        http*://www.zcool.com.cn/work/*
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539345/%E7%AB%99%E9%85%B7%E7%BD%91%E4%B8%8B%E8%BD%BD%E4%B8%8E%E5%A4%8D%E5%88%B6Base64%EF%BC%88%E6%94%AF%E6%8C%81%E6%89%B9%E9%87%8F%E5%91%BD%E5%90%8D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539345/%E7%AB%99%E9%85%B7%E7%BD%91%E4%B8%8B%E8%BD%BD%E4%B8%8E%E5%A4%8D%E5%88%B6Base64%EF%BC%88%E6%94%AF%E6%8C%81%E6%89%B9%E9%87%8F%E5%91%BD%E5%90%8D%EF%BC%89.meta.js
// ==/UserScript==

(function ($) {
    const IMG_SELECTOR = '.photoImage';
    const IMG_BOX_SELECTOR = '.photoInformationContent';
    const DOWNLOAD_BOX_SELECTOR = '.imageCollectIcons';
    const DOWNLOAD_ALL_BOX_SELECTOR = '.detailNavBox';
    const NAMESPACE = GM_info.script.namespace;

    const DOWNLOAD_ICON = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M229.4 452.7l258.5 195.1a39.9 39.9 0 0 0 48.2 0l258.5-195.1c12.2-9.2 5.7-28.7-9.6-28.7H612.9V168a40 40 0 0 0-40-40H451.1a40 40 0 0 0-40 40v256H239c-15.3 0-21.8 19.5-9.6 28.7zM856 656H619.6a4.4 4.4 0 0 0-2.5.8l-47.3 35.7a95.8 95.8 0 0 1-115.6 0l-47.3-35.7a4.4 4.4 0 0 0-2.5-.8H168a40 40 0 0 0-40 40v160a40 40 0 0 0 40 40h688a40 40 0 0 0 40-40V696a40 40 0 0 0-40-40zM688 808a32 32 0 1 1 32-32 32 32 0 0 1-32 32zm120 0a32 32 0 1 1 32-32 32 32 0 0 1-32 32z"/></svg>`;

    function uuid() {
        return Math.random().toString(36).substr(2);
    }
    function namespace(str) {
        return `${NAMESPACE}-${str}`;
    }
    function getNameFromUrl(url) {
        return new URL(url).pathname.split('/').pop().split('?')[0];
    }
    function getFileTypeFromUrl(url) {
        const name = getNameFromUrl(url);
        const res = name.split('.').pop();
        return res ? res.toLowerCase() : 'jpg';
    }
    function downloadFile(url, customName = null) {
        const defaultName = getNameFromUrl(url);
        const ext = getFileTypeFromUrl(url);
        const name = customName ? `${customName}.${ext}` : defaultName;
        GM_download({
            url,
            name,
            saveAs: true,
            onload: () => openToast(`下载成功：${name}`),
            onerror: () => openToast(`下载失败：${name}`)
        });
    }

    // Toast
    let toasts = [];
    let $toastContainer;
    const TOAST_CONTAINER_SELECTOR = `#${namespace("toast")}`;
    function initToast() {
        if (!$toastContainer) {
            $toastContainer = $(TOAST_CONTAINER_SELECTOR);
            if (!$toastContainer.length) {
                const toast = `<div id="${namespace("toast")}" class="${namespace("toast")}"></div>`;
                $toastContainer = $(toast);
                $("body").append($toastContainer);
            }
        }
    }
    function openToast(text, duration = 2000) {
        if (!text) return;
        initToast();
        const id = namespace(uuid() + "toast");
        const toast = {
            id,
            element: $.parseHTML(`<div id="${id}" class="${namespace("toast__item")}">${text}</div>`),
        };
        toasts.push(toast);
        $toastContainer.append(toast.element);
        setTimeout(() => {
            $(toast.element).remove();
            toasts = toasts.filter((t) => t.id !== toast.id);
        }, duration);
    }

    function createBtn({ id, text, callback, parent = "body", cls = "btns-item" }) {
        const _id = namespace(`${uuid()}-${id}`);
        if (document.getElementById(_id)) return;
        const btn = `<div id="${_id}" class="${namespace(cls)}">${text}</div>`;
        $(parent).append(btn);
        $(`#${_id}`).click(callback);
    }

    function main() {
        const sourceImgEls = document.querySelectorAll(IMG_BOX_SELECTOR);
        const titleEl = document.querySelector('.worksContent h2');
        const baseTitle = titleEl ? titleEl.textContent.trim().replace(/[\\/:*?"<>|]/g, '') : document.title;

        sourceImgEls.forEach((el, index) => {
            const src = el.querySelector(IMG_SELECTOR).src.split('?')[0];
            const autoName = `${baseTitle}_${index + 1}`;

            createBtn({
                id: `download-${index}`,
                text: `${DOWNLOAD_ICON}自动命名下载`,
                callback: () => downloadFile(src, autoName),
                parent: el.querySelector(DOWNLOAD_BOX_SELECTOR)
            });

            createBtn({
                id: `download-manual-${index}`,
                text: `📝手动命名下载`,
                callback: () => {
                    const inputName = prompt("请输入文件名（不含扩展名）：", autoName);
                    if (inputName) downloadFile(src, inputName.trim());
                },
                parent: el.querySelector(DOWNLOAD_BOX_SELECTOR)
            });

            createBtn({
                id: `copy-base64-${index}`,
                text: `📋复制Base64`,
                callback: async () => {
                    try {
                        const img = el.querySelector(IMG_SELECTOR);
                        const blob = await fetch(img.src.split('?')[0]).then(res => res.blob());
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const base64Data = reader.result;
                            navigator.clipboard.writeText(base64Data).then(() => {
                                openToast("已复制Base64图片数据");
                            }).catch(() => {
                                openToast("复制失败，请检查权限");
                            });
                        };
                        reader.readAsDataURL(blob);
                    } catch (e) {
                        openToast("处理失败");
                    }
                },
                parent: el.querySelector(DOWNLOAD_BOX_SELECTOR)
            });
        });

        // 批量下载按钮
        createBtn({
            id: 'download-all',
            text: DOWNLOAD_ICON,
            callback() {
                const mode = prompt("批量下载模式选择：\n输入【1】自动命名（如 标题_1）\n输入【2】手动命名（将加编号）", "1");
                if (!mode) return;

                const isAuto = mode.trim() === "1";
                const imgs = Array.from(document.querySelectorAll(IMG_BOX_SELECTOR));
                const baseTitleEl = document.querySelector('.worksContent h2');
                const baseTitle = baseTitleEl ? baseTitleEl.textContent.trim().replace(/[\\/:*?"<>|]/g, '') : document.title;

                let customBase = baseTitle;
                if (!isAuto) {
                    const inputName = prompt("请输入基础文件名（将自动加序号）：", baseTitle);
                    if (!inputName) return;
                    customBase = inputName.trim();
                }

                let count = 0;

                (function downloadNext(i) {
                    if (i >= imgs.length) {
                        openToast(`共处理 ${count} 张图片`);
                        return;
                    }
                    const el = imgs[i];
                    const url = el.querySelector(IMG_SELECTOR).src.split('?')[0];
                    const name = isAuto ? `${baseTitle}_${i + 1}` : `${customBase}_${i + 1}`;

                    downloadFile(url, name);
                    count++;
                    setTimeout(() => downloadNext(i + 1), 400);
                })(0);
            },
            parent: document.querySelector(DOWNLOAD_ALL_BOX_SELECTOR),
            cls: 'download-all-btns-item'
        });
    }

    function initStyles() {
        const styles = `
          <style>
            .imageCollectIcons{width:auto!important;}
            .${namespace('toast')}{position:fixed;top:50px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;z-index:99999999;}
            .${namespace('toast__item')}{padding:10px 20px;background:rgba(0,0,0,0.5);color:#fff;border-radius:5px;margin-bottom:10px;}
            .${namespace('btns-item')}{margin-left:4px;padding:0 10px;line-height:36px;font-size:14px;height:36px;border-radius:4px;background-color:rgba(0, 0, 0, 0.6);display:flex;align-items:center;color:#fff;cursor:pointer;}
            .${namespace('btns-item')}:hover{color:rgb(255, 242, 0);}
            .${namespace('btns-item')} svg{margin-right:4px;height:20px;fill:#fff;}
            .${namespace('btns-item')}:hover svg{fill:rgb(255, 242, 0);}
            .${namespace('download-all-btns-item')}{width:50px;height:50px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;box-sizing:border-box;position:relative;cursor:pointer;margin-top:16px;border:1px solid rgb(237, 237, 237);background-color:rgba(255, 255, 255, 0.9);}
            .${namespace('download-all-btns-item')} svg{height:24px;}
          </style>
      `;
        $('head').append(styles);
    }

    function removeRightClickLimit() {
        document.body.oncontextmenu = null;
        document.body.onselectstart = null;
        document.body.ondragstart = null;
        document.body.oncopy = null;
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            el.oncontextmenu = null;
            el.onselectstart = null;
            el.ondragstart = null;
            el.oncopy = null;
        });
    }

    // 启动
    $(function () {
        removeRightClickLimit();
        initStyles();
        main();
    });
})(jQuery);
