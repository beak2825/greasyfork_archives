// ==UserScript==
// @name         zaimanhua漫画页转长图
// @namespace    https://unlucky.ninja/
// @version      2025.9.17.1
// @description  打开某一话后点击标题右侧按钮生成长图
// @author       UnluckyNinja
// @license      MIT
// @match        https://manhua.zaimanhua.com/*
// @connect      images.zaimanhua.com
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @require      https://update.greasyfork.org/scripts/498113/1395364/waitForKeyElements_mirror.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idmzj.com
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/498114/zaimanhua%E6%BC%AB%E7%94%BB%E9%A1%B5%E8%BD%AC%E9%95%BF%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/498114/zaimanhua%E6%BC%AB%E7%94%BB%E9%A1%B5%E8%BD%AC%E9%95%BF%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // consts
    const store = {
        canvas_width: GM_getValue('canvas_width', 800),
        jpg_quality: GM_getValue('jpg_quality', 0.3),
        blob_revoke_timeout: GM_getValue('blob_revoke_timeout', 30000),
    }


    // return tarB in tarA/tarB=srcA/srcB
    function toRatioValue(srcA, srcB, tarA){
        return tarA/srcA * srcB
    }

    function getTotalHeight(images, width = 800){
        let totalH = 0
        for (let image of images){
            if (image instanceof HTMLImageElement) {
                const w = image.naturalWidth
                const h = image.naturalHeight
                totalH += Math.ceil(toRatioValue(w, h, width))
            } else if (image instanceof ImageBitmap) {
                const w = image.width
                const h = image.height
                totalH += Math.ceil(toRatioValue(w, h, width))
            } else {
                console.error('[漫画页转长图] 无效的图片参数', image)
                throw new Error('[漫画页转长图] 无效的图片参数')
            }
        }
        return totalH
    }

    async function corsGetAllImages(urls) {
        const images = []
        for (const url of urls) {
            const res = await GM.xmlHttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
            });
            const image = await createImageBitmap(res.response)
            images.push(image)
        }
        return images
    }

    async function genLongImageBlob(){
        const imageURLs = [...document.querySelectorAll(".comic_wraCon img").values()].slice(from.value-1, to.value).map(it=>it.src)
        const images = await corsGetAllImages(imageURLs)
        const canvas = document.createElement('canvas')
        const totalHeight = getTotalHeight(images, store.canvas_width)
        let targetWidth = store.canvas_width
        if (totalHeight > 32767) {
            let optimalWidth = Math.floor(32767 / totalHeight * store.canvas_width)
            const conti = confirm(`高度超出生成上限: ${totalHeight} / 32767, 若继续生成，则图片宽度将只有：${optimalWidth.toFixed(0)}px，是否继续生成？`)
            if (!conti) throw new Error('[漫画页转长图] 高度过大无法绘制')
            targetWidth = optimalWidth
        }
        canvas.width = targetWidth
        canvas.height = getTotalHeight(images, targetWidth)
        const context = canvas.getContext('2d')
        let curH = 0
        // const promises = images.map(it=>it.decode())
        // await Promise.all(promises)
        for (let image of images){
            let w, h
            if (image instanceof HTMLImageElement) {
                w = image.naturalWidth
                h = image.naturalHeight
            } else if (image instanceof ImageBitmap){
                w = image.width
                h = image.height
            } else {
                console.error('[漫画页转长图] 无效的图片参数', image)
                throw new Error('[漫画页转长图] 无效的图片格式')
            }
            const newH = Math.ceil(toRatioValue(w, h, targetWidth))
            context.drawImage(image, 0, curH, targetWidth, newH)
            curH += newH
        }
        return new Promise((resolve)=>{
            canvas.toBlob((blob)=>{
                resolve(blob)
            }, 'image/jpeg', store.jpg_quality)
        })
    }
    let downloadButton
    let previewButton

    async function openImage(){
        previewButton.innerText = '生成中...'
        previewButton.disabled = true
        try {
            const blob = await genLongImageBlob()
            const url = URL.createObjectURL(blob)
            window.open(url, '_blank')
            setTimeout(()=>{
                URL.revokeObjectURL(url)
            }, store.blob_revoke_timeout)
        } finally {
            previewButton.innerText = '预览长图'
            previewButton.disabled = false
        }
    }
    async function downloadImage(){
        downloadButton.innerText = '生成中...'
        downloadButton.disabled = true
        try {
            const blob = await genLongImageBlob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            const name = document.querySelector('.comic_wraCon h1').textContent
            const chapter = document.querySelector('.comic_wraCon h1 ~ span').textContent
            a.download = `${name}_${chapter}.jpg`
            a.click()
            //setTimeout(()=>{
            URL.revokeObjectURL(url)
            //}, 0)
        } finally {
            downloadButton.innerText = '下载长图'
            downloadButton.disabled = false
        }
    }
    let from
    let to
    function addButton(node){
        const wrapper = document.createElement('span')
        wrapper.style.position = 'relative'
        const div = document.createElement('div')
        div.style.display = 'flex'
        div.style.position = 'absolute'
        div.style.width = 'max-content'
        div.style.height = '100%'
        div.style.left = '100%'
        div.style.top = '0'

        previewButton = document.createElement('button')
        previewButton.innerText = '预览长图'
        previewButton.style.margin = '0 0.5rem'
        previewButton.addEventListener('click', openImage)
        div.append(previewButton)

        downloadButton = document.createElement('button')
        downloadButton.innerText = '下载长图'
        //downloadButton.style.margin = '0 0.5rem'
        downloadButton.addEventListener('click', downloadImage)
        div.append(downloadButton)

        // 前后页数跳过
        from = document.createElement('input')
        to = document.createElement('input')
        from.value = 1
        to.value = document.querySelectorAll(".comic_wraCon img").length
        from.type = 'number'
        to.type = 'number'
        from.style.width = '40px'
        from.style.marginLeft = '4px'
        to.style.width = '40px'
        to.style.marginLeft = '4px'

        const dash = document.createElement('span')
        dash.textContent = '-'
        dash.style.display = 'flex'
        dash.style.alignItems = 'center'

        div.append(from)
        div.append(dash)
        div.append(to)

        wrapper.append(div)
        node[0].parentElement.append(wrapper)
        console.log('[漫画页转长图] 控件已添加至',node[0])
    }

    waitForKeyElements('.comic_wraCon img', (images)=>{
        if (!window.location.href.match(/https?:\/\/manhua.zaimanhua.com\/.*\/.+/)) {
            console.info('[漫画页转长图] 非有效页面，跳过')
            return
        }
        console.log(images)
        // images[0].crossOrigin = 'anonymous'
    })
    waitForKeyElements('h1.hotrmtexth1', (nodes)=>{
        if (!window.location.href.match(/https?:\/\/manhua.zaimanhua.com\/.*\/.+/)) {
            console.info('[漫画页转长图] 非zaimanhua有效页面，跳过')
            return
        }
        console.info('[漫画页转长图] zaimanhua页面，开始添加按钮')
        addButton(nodes)
    })

    function registerMenuCommand(options){
        const {
            label,
            inputLabel,
            inputType,
            storeKey,
        } = options

        const isLabelFunction = typeof label === 'function'

        function onMenuHandle(){
            const value = promptForNumber({label: inputLabel, defaultValue: store[storeKey], type: inputType})
            if (value === null) return
            store[storeKey] = value
            GM_setValue(storeKey, value)
            if (isLabelFunction) {
                menu_id = GM_registerMenuCommand(label(), onMenuHandle, {
                    autoClose: false,
                    id: menu_id
                });
            }
        }
        let menu_id = GM_registerMenuCommand( isLabelFunction ? label() : label, onMenuHandle, {
            autoClose: false,
        });
    }
    registerMenuCommand({
        label(){
            return `修改图片宽度，当前：${store.canvas_width}px`
        },
        inputLabel: '输入新宽度',
        storeKey: 'canvas_width',
    });

    registerMenuCommand({
        label(){
            return `修改图片质量，当前：${store.jpg_quality}`
        },
        inputLabel: '输入新质量（0~1）',
        inputType: 'float',
        storeKey: 'jpg_quality',
    });
    registerMenuCommand({
        label(){
            return `修改预览过期时间，当前：${store.blob_revoke_timeout}ms`
        },
        inputLabel: '输入新时间（单位：毫秒）',
        storeKey: 'blob_revoke_timeout',
    });


})();


function promptForNumber(options = {}){
    const {label = '请输入一个数字', defaultValue = undefined, type = 'int' } = options || {}
    while(true){
        const input = prompt(label, defaultValue);
        if (input === null) {
            return null
        }
        let value
        try {
            if (type === 'float') {
                value = parseFloat(input)
            } else {
                value = parseInt(input)
            }
        } catch {
            alert(`请输入有效的数字`)
            continue
        }
        return value
    }
}