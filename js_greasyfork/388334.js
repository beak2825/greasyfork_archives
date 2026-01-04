// ==UserScript==
// @name         站酷网下载按钮
// @namespace    zhanku-download
// @version      1.0.2
// @icon         https://static.zcool.cn/git_z/z/site/favicon.ico?version=1618914637608
// @description  提供站酷网原图下载功能
// @author       sertraline
// @match        http*://www.zcool.com.cn/work/*
// @require      https://cdn.staticfile.org/jquery/3.6.2/jquery.min.js
// @grant    GM_openInTab
// @grant    GM_download
// @downloadURL https://update.greasyfork.org/scripts/388334/%E7%AB%99%E9%85%B7%E7%BD%91%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/388334/%E7%AB%99%E9%85%B7%E7%BD%91%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
const IMG_SELECTOR = '.photoImage'
const IMG_BOX_SELECTOR = '.photoInformationContent'
const DOWNLOAD_BOX_SELECTOR = '.imageCollectIcons'
const DOWNLOAD_ALL_BOX_SELECTOR = '.detailNavBox'
const INDEX_MODAL_SELECTOR = '.ReactModalPortal'
const NAMESPACE = GM_info.script.namespace
const DOWNLOAD_ICON = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M229.4 452.7l258.5 195.1a39.9 39.9 0 0 0 48.2 0l258.5-195.1c12.2-9.2 5.7-28.7-9.6-28.7H612.9V168a40 40 0 0 0-40-40H451.1a40 40 0 0 0-40 40v256H239c-15.3 0-21.8 19.5-9.6 28.7zM856 656H619.6a4.4 4.4 0 0 0-2.5.8l-47.3 35.7a95.8 95.8 0 0 1-115.6 0l-47.3-35.7a4.4 4.4 0 0 0-2.5-.8H168a40 40 0 0 0-40 40v160a40 40 0 0 0 40 40h688a40 40 0 0 0 40-40V696a40 40 0 0 0-40-40zM688 808a32 32 0 1 1 32-32 32 32 0 0 1-32 32zm120 0a32 32 0 1 1 32-32 32 32 0 0 1-32 32z"/></svg>`
function uuid() {
    return Math.random().toString(36).substr(2)
}
function namespace(str) {
    return `${NAMESPACE}-${str}`
}
let toasts = [];
let $toastContainer;
const TOAST_CONTAINER_SELECTOR = `#${namespace("toast")}`;
function initToast() {
    if (!$toastContainer) {
        $toastContainer = $(TOAST_CONTAINER_SELECTOR);
        if (!$toastContainer.length) {
            const toast = `
                <div id="${namespace("toast")}" class="${namespace("toast")}">
                </div>
            `;
            $toastContainer = $(toast);
            $("body").append($toastContainer);
        }
    }
}

function createBtn({ id, text, callback, parent = "body", cls = "btns-item" }) {
    const _id = namespace(`${uuid()}-${id}`)
    if (document.getElementById(_id)) return
    const btn = `<div id="${_id}" class="${namespace(cls)}">${text}</div>`
    $(parent).append(btn)
    $(`#${_id}`).click(callback)
}

function openToast(text, duration = 2000) {
    if (!text) return;

    initToast();
    const id = namespace(uuid + "toast")
    const toast = {
        id,
        element: $.parseHTML(`
            <div id="${id}" class="${namespace("toast__item")}">
                ${text}
            </div>
        `),
    };
    toasts.push(toast);

    $toastContainer.append(toast.element);
    setTimeout(() => {
        $(toast.element).remove();
        toasts = toasts.filter((t) => t.id !== toast.id);
    }, duration);
}

function getNameFromUrl(url) {
    const SPLIT_REGEXP = /\/|\?/
    return new URL(url).pathname.split(SPLIT_REGEXP).pop()
}
function getFileTypeFromUrl(url) {
    const name = getNameFromUrl(url)
    const SPLIT_REGEXP = /\./
    const res = name.split(SPLIT_REGEXP)[1]
    return res ? res.toUpperCase() : null
}
function downloadFile(url) {
    const name = getNameFromUrl(url)
    GM_download({
        url,
        name,
        saveAs: true,
        onload: () => {
            openToast('下载成功')
        },
        onerror: () => {
            openToast('下载失败')
        }
    })
}
function main() {
    const sourceImgEls = document.querySelectorAll(IMG_BOX_SELECTOR)
    sourceImgEls.forEach(el => {
        const src = el.querySelector(IMG_SELECTOR).src
        const _src = src.split('?')[0]
        createBtn({
            id: 'download',
            text: `${DOWNLOAD_ICON}下载原图`,
            callback() {
                downloadFile(_src)
            },
            parent: el.querySelector(DOWNLOAD_BOX_SELECTOR)

        })
    })
    createBtn({
        id: 'download-all',
        text: DOWNLOAD_ICON,
        callback() {
            const imgs = Array.from(sourceImgEls).map(el => el.querySelector(IMG_SELECTOR).src.split('?')[0])
            openToast(`开始下载${imgs.length}张图片`)
            imgs.forEach(img => {
                downloadFile(img)
            })
        },
        parent: document.querySelector(DOWNLOAD_ALL_BOX_SELECTOR),
        cls: 'download-all-btns-item'
    })
}
//
; (function ($) {
    initStyles()
    main()
})(jQuery)
function initStyles() {
    const styles = `
          <style>
            .imageCollectIcons{
                width:auto !important;
            }
            .${namespace('toast')}{
                position: fixed;
                top: 50px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                flex-direction: column;
                align-items: center;
                z-index: 99999999;
            }
            .${namespace('toast__item')}{
                padding: 10px 20px;
                background: rgba(0,0,0,0.5);
                color: #fff;
                border-radius: 5px;
                margin-bottom: 10px;
            }
            .${namespace('btns-item')} {
                margin-left: 4px;
                padding: 0 10px;
                line-height: 36px;
                font-size: 14px;
                height: 36px;
                border-radius: 4px;
                background-color: rgba(0, 0, 0, 0.6);
                display: flex;
                align-items: center;
                color: #fff;
            }
            .${namespace('btns-item')}:hover {
                color: rgb(255, 242, 0);
            }
            .${namespace('btns-item')} svg {
                margin-right: 4px;
                height: 20px;
                fill: #fff;
            }
            .${namespace('btns-item')}:hover svg{
                fill: rgb(255, 242, 0);
            }
            .${namespace('download-all-btns-item')} {
                width: 50px;
                height: 50px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                box-sizing: border-box;
                position: relative;
                cursor: pointer;
                margin-top: 16px;
                border: 1px solid rgb(237, 237, 237);
                background-color: rgba(255, 255, 255, 0.9);
            }
            .${namespace('download-all-btns-item')} svg{
                height: 24px;
            }
          </style>
      `
    $('head').append(styles)
}
