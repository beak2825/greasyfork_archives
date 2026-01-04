// ==UserScript==
// @name         get-gaoding-material
// @namespace    get-gaoding-material
// @version      1.0
// @license      MIT
// @icon         https://gd-filems.dancf.com/gaoding/gaoding/0/c012b037-b933-4364-96d0-c7ed4e1588984217369.png
// @description  获取搞定设计画布所有素材
// @author       sertraline
// @match        https://www.gaoding.com/design*
// @require      https://cdn.staticfile.org/jquery/3.6.2/jquery.min.js
// @grant        GM_openInTab
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/456745/get-gaoding-material.user.js
// @updateURL https://update.greasyfork.org/scripts/456745/get-gaoding-material.meta.js
// ==/UserScript==
const SOURCE_IMG_SELECTOR = '.design-editor img'
const BTN_BOX_SELECTOR = `.editor-right-actions`
const NAMESPACE = GM_info.script.namespace
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

let btnBoxLoaded = false

function createBtn(id, text, callback) {
    const element = document.querySelector(BTN_BOX_SELECTOR)
    if (!element) {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const element = document.querySelector(BTN_BOX_SELECTOR)
                    if (element) {
                        observer.disconnect()
                        btnBoxLoaded = true
                        createBtn(id, text, callback)
                    }
                }
            }
        })
        observer.observe(document.body, {
            childList: true
        })
        return
    }

    const _id = namespace(id)
    if (document.getElementById(_id)) return

    const btn = `
    <div id="${_id}" class="${namespace('btns-item')}">${text}</div>
  `
    $(BTN_BOX_SELECTOR).append(btn)
    $(`#${_id}`).click(callback)
}

function createDrawer() {
    const drawer = `
        <div id="${namespace('drawer')}" class="${namespace('drawer')}">
            <div id="${namespace('drawer__mask')}" class="${namespace('drawer__mask')}"></div>
            <div id="${namespace('drawer__wrap')}" class="${namespace('drawer__wrap')}">
                <div id="${namespace('drawer__info')}" class="${namespace('drawer__info')}">
                </div>
                <div id="${namespace('drawer__content')}" class="${namespace('drawer__content')}">
                </div>
            </div>
        </div>
    `
    $('body').append(drawer)
    $(`#${namespace('drawer__mask')}`).click(function () {
        hideDrawer()
    })
    $(`#${namespace('drawer__content')}`).click(function (e) {
        const target = e.target
        if ($(target).hasClass(namespace('drawer__pic')) || $(target).parent().hasClass(namespace('drawer__pic'))) {
            const src = $(target).find('img').attr('src') || $(target).attr('src')
            if (src.indexOf('http') !== 0) {
                GM_openInTab(src, { active: true })
                return
            }
            downloadImg(src)
        }
    })
    hideDrawer()
}
function clearDrawer() {
    const _contentId = namespace('drawer__content')
    if (!$(`#${_contentId}`).length) return
    $(`#${_contentId}`).empty()
}
function hideDrawer() {
    const _drawerId = namespace('drawer')
    if (!$(`#${_drawerId}`).length) return
    $(`#${_drawerId}`).fadeOut()
}
function showDrawer() {
    const _drawerId = namespace('drawer')
    if (!$(`#${_drawerId}`).length) return
    $(`#${_drawerId}`).fadeIn()
}
function updateDrawerInfo() {
    const len = $(`#${namespace('drawer__content')}`).children().length
    $(`#${namespace('drawer__info')}`).text(`共${len}个素材`)
}
function pushImgItem(src) {
    const img = `
        <div class="${namespace('drawer__pic')}">
            <div class="${namespace('drawer__type')}">${getFileTypeFromUrl(src) || '未知'}</div>
            <img src="${src}">
        </div>
    `
    $(`#${namespace('drawer__content')}`).append(img)
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
function downloadImg(url) {
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
; (function ($) {
    initStyles()
    createDrawer()
    createBtn(
        'get-material',
        `<svg style="height: 20px;fill: #fff;marign-right: 5px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M362.667 256H832a42.667 42.667 0 0142.667 42.667V896A42.667 42.667 0 01832 938.667H362.667A42.667 42.667 0 01320 896V298.667A42.667 42.667 0 01362.667 256zm42.666 85.333v512h384v-512h-384zm256-170.666H234.667v554.666h-85.334V128A42.667 42.667 0 01192 85.333h469.333v85.334z"></path></svg>获取素材`,
        function () {
            const sourceImgEls = document.querySelectorAll(SOURCE_IMG_SELECTOR)
            if (!sourceImgEls.length) {
                openToast('请等待页面加载完成')
                return
            }
            clearDrawer()
            sourceImgEls.forEach(el => {
                pushImgItem(el.src)
            })
            updateDrawerInfo()
            showDrawer()
            openToast('素材获取成功')
        }
    )
})(jQuery)

function initStyles() {
    const styles = `
          <style>
              .${namespace('btns-item')} {
                margin-right: 10px;
                padding: 8px 16px;
                font-size: 14px;
                line-height: 24px;
                background: #2254f4;
                color: #fff;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
              }
              .${namespace('drawer')}{
                position: fixed;
                bottom: 0;
                left: 0;
                z-index: 100000;
              }
              .${namespace('drawer__mask')}{
                position: fixed;
                top: 0;
                left: 0;
                z-index: 99998;
                background: rgba(0,0,0,0.5);
                width: 100vw;
                height: 100vh;
              }
              .${namespace('drawer__info')}{
                padding: 15px 20px;
                background: #fff;
                font-size: 14px;
                line-height: 20px;
                color: #333;
                border-bottom: 1px solid #eee;
                margin-bottom: 10px;
              }
              .${namespace('drawer__wrap')}{
                position: fixed;
                bottom: 0;
                left: 0;
                z-index: 99999;
                background: #fff;
                width: 300px;
                height: 100vh;
              }
              .${namespace('drawer__content')}{
                height: calc(100% - 60px);
                padding: 15px 20px;
                overflow-y: auto;
            }
              .${namespace('drawer__pic')}{
                width: 100%;
                height: 100px;
                background: #f1f2f4;
                margin-bottom: 10px;
                padding: 10px 5px;
                cursor: pointer;
                position: relative;
                border-radius: 8px;
              }
              .${namespace('drawer__type')}{
                position: absolute;
                bottom: 5px;
                right: 5px;
                background: #2254f4;
                color: #fff;
                padding: 2px 10px;
                font-size: 12px;
                line-height: 16px;
              }
              .${namespace('drawer__pic')} img{
                width: 100%;
                height: 100%;
                object-fit: contain;
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
          </style>
      `
    $('head').append(styles)
}
