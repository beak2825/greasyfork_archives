// ==UserScript==
// @name         Jellyfin/Emby 显示剧照 (Show Jellyfin/Emby images under the extrafanart folder)
// @namespace    http://tampermonkey.net/
// @version      1.2.6
// @description  Jellyfin/Emby 显示剧照
// @author       Squirtle
// @match        *://*/web/*
// @match        *://*/*/web/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489553/JellyfinEmby%20%E6%98%BE%E7%A4%BA%E5%89%A7%E7%85%A7%20%28Show%20JellyfinEmby%20images%20under%20the%20extrafanart%20folder%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489553/JellyfinEmby%20%E6%98%BE%E7%A4%BA%E5%89%A7%E7%85%A7%20%28Show%20JellyfinEmby%20images%20under%20the%20extrafanart%20folder%29.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    let startImageIndex = GM_getValue('startImageIndex', 2)
    let endImageIndex = 0
    let currentZoomedImageIndex = -1
    let startMenuEventId = null
    let itemId = null
    const imageMap = new Map()

    const imageContainer = createImageContainer()
    const zoomedMask = createZoomedMask()

    const zoomedImage = zoomedMask.querySelector('#jv-zoom-img')
    const zoomedImageWrapper = zoomedMask.querySelector('#jv-zoom-img-wrapper')
    const zoomedImageDescription = zoomedMask.querySelector('#jv-zoom-img-desc')
    const leftButton = zoomedMask.querySelector('.jv-left-btn')
    const rightButton = zoomedMask.querySelector('.jv-right-btn')

    function getCurrentItemId() {
        return location.hash.match(/id\=(\w+)/)?.[1] ?? null
    }

    function getBackgroundImageSrc(index) {
        const currentItemId = getCurrentItemId()
        return currentItemId && `${location.origin}/Items/${currentItemId}/Images/Backdrop/${index}?maxWidth=1280`
    }

    function createImageContainer() {
        const container = document.createElement('div')
        container.id = 'jv-image-container'
        return container
    }

    function createZoomedMask() {
        const mask = document.createElement('div')
        mask.id = 'jv-zoom-mask'
        mask.innerHTML = `
        <button class="jv-zoom-btn jv-left-btn"></button>
        <div id="jv-zoom-img-wrapper"><img id="jv-zoom-img" /><div id="jv-zoom-img-desc"></div></div>
        <button class="jv-zoom-btn jv-right-btn" /></button>
       `
        return mask
    }

    function setRectOfElement(element, rect) {
        ;['width', 'height', 'left', 'top'].forEach(key => {
            element.style[key] = `${rect[key]}px`
        })
    }

    function setDescription() {
        zoomedImageDescription.innerHTML = `${currentZoomedImageIndex - startImageIndex + 1} of ${endImageIndex - startImageIndex + 1}`
    }

    async function awaitTransitionEnd(element) {
        return new Promise(resolve => {
            element.addEventListener('transitionend', resolve, { once: true })
        })
    }

    function changeImageIndex(index) {
        const imageSrc = getBackgroundImageSrc(index)
        if (!imageSrc) return
        const imageElement = imageMap.get(index)
        if (!imageElement) return
        setRectOfElement(zoomedImageWrapper, {
            left: (zoomedMask.clientWidth - imageElement.naturalWidth) / 2,
            top: (zoomedMask.clientHeight - imageElement.naturalHeight) / 2,
            width: imageElement.naturalWidth,
            height: imageElement.naturalHeight
        })
        zoomedImage.src = imageSrc
        setDescription()
    }

    async function showZoomedMask(index) {
        const imageSrc = getBackgroundImageSrc(index)
        if (!imageSrc) return

        zoomedImageWrapper.classList.add('animate')
        zoomedImage.src = imageSrc

        const imageElement = imageMap.get(index)
        if (!imageElement) return
        const rect = imageElement.getBoundingClientRect()
        setRectOfElement(zoomedImageWrapper, rect)
        zoomedMask.style.display = 'flex'

        const action = () => {
            setRectOfElement(zoomedImageWrapper, {
                left: (zoomedMask.clientWidth - imageElement.naturalWidth) / 2,
                top: (zoomedMask.clientHeight - imageElement.naturalHeight) / 2,
                width: imageElement.naturalWidth,
                height: imageElement.naturalHeight
            })
        }

        if (document.startViewTransition) {
            const transition = document.startViewTransition(action)
            await transition.finished
        } else {
            action()
            await awaitTransitionEnd(zoomedImageWrapper)
        }

        setDescription()
        zoomedImageWrapper.classList.remove('animate')
    }

    async function hideZoomedMask() {
        zoomedImageDescription.innerHTML = ''
        zoomedImageWrapper.classList.add('animate')
        const action = () => {
            const imageElement = imageMap.get(currentZoomedImageIndex)
            if (!imageElement) return
            const rect = imageElement.getBoundingClientRect()
            setRectOfElement(zoomedImageWrapper, rect)
        }
        if (document.startViewTransition) {
            const transition = document.startViewTransition(action)
            await transition.finished
        } else {
            action()
            await awaitTransitionEnd(zoomedImageWrapper)
        }

        zoomedMask.style.display = 'none'
        currentZoomedImageIndex = -1
        zoomedImageWrapper.classList.remove('animate')
    }

    function createImageElement(index) {
        const imageSrc = getBackgroundImageSrc(index)
        const imageElement = document.createElement('img')
        imageElement.src = imageSrc
        imageElement.className = 'jv-image'
        imageElement.onclick = function () {
            currentZoomedImageIndex = index
            showZoomedMask(index)
        }
        return imageElement
    }

    function appendImagesToContainer(imageCount) {
        const imageFragment = document.createDocumentFragment()
        for (let index = startImageIndex; index <= imageCount; index++) {
            const imageElement = createImageElement(index)
            imageFragment.appendChild(imageElement)
            imageMap.set(index, imageElement)
        }
        imageContainer.appendChild(imageFragment)
    }

    function showContainer(imageCount) {
        if (imageCount <= 0) return
        const primaryDiv =
            document.querySelector('#itemDetailPage:not(.hide) #castCollapsible') || document.querySelector('.itemView:not(.hide) .peopleSection')
        if (!primaryDiv) return
        imageContainer.style.display = 'block'
        primaryDiv.insertAdjacentElement('afterend', imageContainer)
    }

    function isDetailsPage() {
        return location.hash.includes('/details?id=') || location.hash.includes('/item?id=')
    }

    async function getEndImageIndex() {
        if (typeof ApiClient !== 'undefined') {
            const response = await ApiClient.getItem(ApiClient._serverInfo.UserId, getCurrentItemId())
            return response.BackdropImageTags ? response.BackdropImageTags.length - 1 : 0
        }
        let left = startImageIndex
        let right = startImageIndex + 20
        let found = false
        while (left <= right) {
            let mid = Math.floor((left + right) / 2)
            const newSrc = getBackgroundImageSrc(mid)
            try {
                const response = await fetch(newSrc, { method: 'HEAD' })
                if (!response.ok) throw new Error('Image not found.')
                found = true
                left = mid + 1
            } catch (error) {
                right = mid - 1
            }
        }
        return found ? right : 0
    }

    async function loadImages() {
        if (!isDetailsPage()) return
        const currentItemId = getCurrentItemId()
        if (!currentItemId) return
        if (itemId !== currentItemId) {
            endImageIndex = await getEndImageIndex()
        }
        itemId = currentItemId
        imageContainer.innerHTML = ''
        imageMap.clear()
        appendImagesToContainer(endImageIndex)
        showContainer(endImageIndex)
    }

    function handleLeftButtonClick(e) {
        e.stopPropagation()
        if (currentZoomedImageIndex === -1) return
        if (currentZoomedImageIndex > startImageIndex) {
            currentZoomedImageIndex--
        } else {
            currentZoomedImageIndex = endImageIndex
        }
        changeImageIndex(currentZoomedImageIndex)
    }

    function handleRightButtonClick(e) {
        e.stopPropagation()
        if (currentZoomedImageIndex === -1) return
        if (currentZoomedImageIndex < endImageIndex) {
            currentZoomedImageIndex++
        } else {
            currentZoomedImageIndex = startImageIndex
        }
        changeImageIndex(currentZoomedImageIndex)
    }

    function handleKeydown(e) {
        if (currentZoomedImageIndex === -1) return
        e.stopPropagation()
        if (e.key === 'ArrowLeft') {
            handleLeftButtonClick(e)
        } else if (e.key === 'ArrowRight') {
            handleRightButtonClick(e)
        } else if (e.key === 'Escape') {
            hideZoomedMask()
        }
    }

    function clickMenu() {
        GM_unregisterMenuCommand(startMenuEventId)
        if (startImageIndex < 2) {
            startImageIndex++
        } else {
            startImageIndex = 0
        }
        GM_setValue('startImageIndex', startImageIndex)
        registerMenuListener()
        hideZoomedMask()
        loadImages()
    }

    function registerMenuListener() {
        startMenuEventId = GM_registerMenuCommand(`从第${startImageIndex + 1}张开始`, clickMenu, {
            autoClose: false,
            accessKey: 's',
            title: '第一、二张剧照一般是封面，可以选择是否显示它们'
        })
    }

    function registerEventListeners() {
        document.addEventListener('viewshow', () => setTimeout(loadImages))
        document.addEventListener('keydown', handleKeydown)
        leftButton.addEventListener('click', handleLeftButtonClick)
        rightButton.addEventListener('click', handleRightButtonClick)
        zoomedMask.addEventListener('click', hideZoomedMask)
        zoomedImageWrapper.addEventListener('click', handleRightButtonClick)
        zoomedMask.addEventListener('wheel', e => {
            e.preventDefault()
            e.stopPropagation()
            if (currentZoomedImageIndex === -1) return
            if (e.deltaY > 0) {
                handleRightButtonClick(e)
            } else {
                handleLeftButtonClick(e)
            }
        })
    }

    function start() {
        document.body.appendChild(zoomedMask)
        registerEventListeners()
        registerMenuListener()
    }

    start()

    // 注入css
    const css = `
        #jv-image-container {
            display: none;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            padding: 10px;
            border-radius: 25px;
        }

        .jv-image {
            max-height: 200px;
            margin: 10px;
            cursor: zoom-in;
            user-select: none;
        }

        #jv-zoom-mask {
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: none;
            justify-content: space-between;
            align-items: flex-start;
            padding: 20px;
            z-index: 1100;
            cursor: zoom-out;
        }

        #jv-zoom-img-wrapper {
            position: absolute;
            display: flex;
            flex-flow: column wrap;
            align-items: flex-end;
            user-select: none;
            cursor: pointer;
            
        }
        #jv-zoom-img-wrapper.animate {
            transition: left 0.4s ease, top 0.4s ease, width 0.4s ease;
        }

        #jv-zoom-img {
            width: 100%;
        }

        #jv-zoom-img-desc {
            color: #cccccc;
            font-size: 12px;
            position: absolute;
            bottom: 0;
            right: 0;
            transform: translate(0, calc(100% + 4px));
        }

        .jv-zoom-btn {
            padding: 20px;
            cursor: pointer;
            background: transparent;
            border: 0;
            outline: none;
            box-shadow: none;
            opacity: 0.7;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: auto;
            margin-bottom: auto;
        }

        .jv-zoom-btn:hover {
            opacity: 1;
        }

        .jv-zoom-btn:before {
            content: '';
            display: block;
            width: 0;
            height: 0;
            border: medium inset transparent;
            border-top-width: 21px;
            border-bottom-width: 21px;
        }

        .jv-zoom-btn.jv-left-btn:before {
            border-right: 27px solid white;
        }

        .jv-zoom-btn.jv-right-btn:before {
            border-left: 27px solid white;
        }
    `
    GM_addStyle(css)
})()
