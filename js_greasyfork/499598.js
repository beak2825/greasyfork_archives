
// ==UserScript==
// @name         Image Sheet Viewer
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Activate and place the mouse over the target image.
// @author       t.me/cocdos
// @match        https://arca.live/*
// @icon         https://secure.gravatar.com/avatar/d60d18ef7e5b46d1e5e0d4bc56d3282a?d=retro&f=y
// @grant        none
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/499598/Image%20Sheet%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/499598/Image%20Sheet%20Viewer.meta.js
// ==/UserScript==
/* globals $ */
(function() {
    'use strict';
    // Your code here...
    console.log('Image Album Viewer init...')

    let lockOn = [];
    let fitToHeight = true
    let imagePos = 0

    $('img').mouseover( e => startCountdown($(e.target)[0]))
    $('img').mouseout(endCountdown)

    // start sheet view
    function startCountdown(e) {
        lockOn.push(setTimeout(() => {
            endCountdown()
            startSheetView(e)
        }, 2000))
    }
    function endCountdown() {
        lockOn.forEach(l => {
            clearTimeout(l)
        })
        lockOn = []
    }

    function startSheetView (e) {
        console.log('START SHEET VIEW')

        /* init Element */
        // Create Background Element on the web
        const background = document.createElement('div')
        background.style.position = 'fixed'
        background.style.top = '0'
        background.style.left = '0'
        background.style.width = '100%'
        background.style.height = '100%'
        background.style.zIndex = '99999'
        background.style.backgroundColor = 'rgba(0,0,0,0.8)'
        document.body.appendChild(background)

        // Create Image Container
        const imageContainer = document.createElement('div')
        imageContainer.style.position = 'absolute'
        imageContainer.style.top = '50%'
        imageContainer.style.left = '50%'
        imageContainer.style.transform = 'translate(-50%, -50%)'
        background.appendChild(imageContainer)

        // Add image Element into Image Container with fitting image height and keep aspect ratio
        const image = new Image()
        image.addEventListener('click', () => endSheetView())
        imageContainer.appendChild(image)
        const preloadImage = new Image()
        const text = document.createElement('span')
        text.style.position = 'absolute'
        text.style.bottom = '10px'
        text.style.whiteSpace = "pre"
        background.appendChild(text)

        // find image position
        imagePos = 0
        for (let i = 0; i < $('img').length; i++) {
            if ($('img')[i].isEqualNode(e)) {
                imagePos = i
                break
            }
        }
        // show image
        showImage(imagePos)
        maximizeImageSize(image)
        setPositionText()

        /* init Callback */
        function showImage(pos) {
            imagePos = Math.max(0, Math.min($('img').length - 1, pos))
            image.src = $('img')[imagePos].src
            maximizeImageSize(image)
            setPositionText()

            // preloadImage
            preloadImage.src = $('img')[Math.max(0, Math.min($('img').length - 1, pos + 1))].src
        }
        function maximizeImageSize(image) { // Set image size to fit to window dimensions
            let windowHeight = window.innerHeight
            let windowWidth = window.innerWidth
            let aspectRatio = image.naturalHeight / image.naturalWidth
            let containerHeight = windowWidth * aspectRatio
            if (fitToHeight) {
                containerHeight = windowHeight
                image.style.width = 'auto'
                image.style.height = containerHeight + 'px'
            } else {
                image.style.width = windowWidth + 'px'
                image.style.height = 'auto'
            }
        }
        function setPositionText() { // Add text to background
            text.textContent = `${imagePos + 1} / ${$('img').length}\r\n`
            text.textContent += 'Press ESCAPE or Click Image to close.'
        }

        const keyControl = function(e) {
            if (e.keyCode === 27) { // ESC
                endSheetView()
            } else if (e.keyCode === 37 || e.keyCode === 38) { // ←, ↑
                e.preventDefault()
                showImage(imagePos - 1)
            } else if (e.keyCode === 39 || e.keyCode === 40) { // →, ↓
                e.preventDefault()
                showImage(imagePos + 1)
            } else if (e.keyCode === 32) { // SPACE BAR
                e.preventDefault()
                fitToHeight = !fitToHeight
                maximizeImageSize(image)
            }
            setPositionText()
        }
        let adjustSize = function(e) {
            e.preventDefault()
            maximizeImageSize(image)
        }
        let wheelControl = function(e) {
            e.preventDefault()
            e.stopPropagation()
            /* Determine the direction of the scroll (< 0 → up, > 0 → down). */
            var delta = ((e.deltaY || -e.wheelDelta || e.detail) >> 10) || 1;
            if (delta > 0) { // scroll up
                showImage(imagePos + 1)
            } else if (delta) { // scroll down
                showImage(imagePos - 1)
            }
            return false
        }

        function endSheetView() {
            background.remove()

            document.removeEventListener('keydown', keyControl)
            document.removeEventListener('keyup', adjustSize)
            document.removeEventListener('wheel', wheelControl)
            document.removeEventListener('mousewheel', wheelControl)
            document.removeEventListener('DOMMouseScroll', wheelControl)
            window.onresize = null
        }
        document.addEventListener('keydown', keyControl)
        document.addEventListener('keyup', adjustSize)
        document.addEventListener('wheel', wheelControl, {passive: false})
        document.addEventListener('mousewheel', wheelControl, {passive: false})
        document.addEventListener('DOMMouseScroll', wheelControl, {passive: false})
        window.onresize = maximizeImageSize(image)
    }
})();