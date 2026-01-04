// ==UserScript==
// @name         Mangakawaii++
// @namespace    Mangas
// @version      0.6.2
// @description  Une meilleure utilisation de Mangakawaii !
// @author       Smiley32
// @match        https://www.mangakawaii.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437901/Mangakawaii%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/437901/Mangakawaii%2B%2B.meta.js
// ==/UserScript==

function extendDefaults(source, defaultValues) {
    let property;
    for (property in source) {
        if (source.hasOwnProperty(property)) {
            defaultValues[property] = source[property];
        }
    }
    return defaultValues;
}

function checkSwipeEvent(element, params) {
    let default_params = {
        swipeStartCallback: null, // 1 param, swipeEvent
        swipeEndCallback: null, // 1 param, swipeEvent
        swipeUpdateCallback: null, // 1 param, swipeEvent
        minDistance: 150, // px
        maxDeviationDistance: 100, // px
        maxTime: 300, // ms
        stopPropagation: false,
        // lockHorizontal: false, // If true, it'll consider the event as horizontal only
        // lockVertical: false, // If true, it'll consider the event as vertical only
    }

    params = extendDefaults(params, default_params);

    let swipeEvent = {
        distanceX: 0,
        distanceY: 0,
        startX: 0,
        startY: 0,
        startTime: 0,
        direction: 'none',
        elapsedTime: 0
    }

    let started = false;

    // Add event listener for touch start
    element.addEventListener('touchstart', function(event) {
        // Let's create a new event
        let swipeStartEvent = {};
        swipeStartEvent.direction = 'none';
        swipeStartEvent.distanceX = 0;
        swipeStartEvent.distanceY = 0;

        let touched = event.changedTouches[0];
        swipeStartEvent.startX = touched.pageX;
        swipeStartEvent.startY = touched.pageY;

        swipeStartEvent.startTime = new Date().getTime();

        started = false;

        if (params.stopPropagation) {
            event.preventDefault();
        }
        swipeEvent = swipeStartEvent;
        // if (params.swipeStartCallback) {
        //     params.swipeStartCallback(swipeStartEvent);
        // }
    }, !params.stopPropagation);

    let updateTouchEvent = function(callback, event) {
        // Update swipe event
        let touched = event.changedTouches[0];
        let swipeMoveEvent = swipeEvent;
        swipeMoveEvent.distanceX = touched.pageX - swipeMoveEvent.startX;
        swipeMoveEvent.distanceY = touched.pageY - swipeMoveEvent.startY;

        // Check time
        swipeMoveEvent.elapsedTime = new Date().getTime() - swipeMoveEvent.startTime;

        swipeMoveEvent.direction = 'none';
        if (swipeMoveEvent.elapsedTime <= params.maxTime) {
            if (Math.abs(swipeMoveEvent.distanceX) >= params.minDistance && Math.abs(swipeMoveEvent.distanceY) <= params.maxDeviationDistance) {
                swipeMoveEvent.direction = (swipeMoveEvent.distanceX < 0) ? 'left' : 'right';
            }
            if (Math.abs(swipeMoveEvent.distanceY) >= params.minDistance && Math.abs(swipeMoveEvent.distanceX) <= params.maxDeviationDistance) {
                swipeMoveEvent.direction = (swipeMoveEvent.distanceY < 0) ? 'up' : 'down';
            }
        }

        swipeEvent = swipeMoveEvent;
        if (swipeEvent.direction !== 'none') {
            if (false === started) {
                started = true;
                if (params.swipeStartCallback) {
                    params.swipeStartCallback(swipeMoveEvent);
                }
            }
            if (callback) {
                callback(swipeMoveEvent);
            }
        }
    }

    // Touch move event
    element.addEventListener('touchmove', function(event) {
        if (params.stopPropagation) {
            event.preventDefault();
        }
        updateTouchEvent(params.swipeUpdateCallback, event);
    }, !params.stopPropagation);

    // Touch end event
    element.addEventListener('touchend', function(event) {
        if (params.stopPropagation) {
            event.preventDefault();
        }
        updateTouchEvent(params.swipeEndCallback, event);
    }, !params.stopPropagation);
}

function fullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen()
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
    }
}

function exitFullscreen(element) {
    if (document.exitFullscreen) {
        document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
    }
}

function isTouchScreen() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
}

function isVisible(element) {
    const rect = element.getBoundingClientRect()
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0)
}

function isVisibleHorizontal(element) {
    const rect = element.getBoundingClientRect()
    const viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth)
    return !(rect.left < 0 || rect.right - viewWidth >= 0)
}

function updateCurrentPage() {
    let navBar = document.querySelector('#bottom_nav_reader .container-fluid')
    let backToTopElement = document.querySelector('#backToTop')
    let resizeElement = document.querySelector('.nav-link.zoom-toggler.text-grey-light')
    let allItems = document.querySelectorAll('.nav-item')
    let chapterPagerItems = document.querySelectorAll('.chapter-pager>li>a')

    let size = 1
    let marginSize = 0.5
    while (isVisibleHorizontal(resizeElement) && !isVisibleHorizontal(backToTopElement)) {
        navBar.style.fontSize = '' + size + 'em'

        for (let itemIndex = 0; itemIndex < allItems.length; ++itemIndex) {
            allItems[itemIndex].style.setProperty('margin-right', '' + marginSize + 'rem', 'important')
            allItems[itemIndex].style.setProperty('margin-left', '' + marginSize + 'rem', 'important')
        }

        for (let itemIndex = 0; itemIndex < chapterPagerItems.length; ++itemIndex) {
            chapterPagerItems[itemIndex].style.setProperty('padding-right', '' + size + 'rem', 'important')
            chapterPagerItems[itemIndex].style.setProperty('padding-left', '' + size + 'rem', 'important')
        }

        size -= 0.05
        marginSize -= 0.025

        if (size < 0.5) {
            break
        }
    }

    let title = document.querySelector('h1 .text-light')
    let mangaName = title ? title.textContent + ' ' : '';

    let pageChangerElement = document.querySelector('.page_changer')
    if (pageChangerElement && !pageChangerElement.classList.contains('d-none')) {
        document.title = 'Page ' + current_page + mangaName + chapter_number
        return
    }

    let images = document.querySelectorAll('#data-wrapper img')
    if (!images) {
        return
    }

    // const currentScroll = window.scrollY
    for (let imageIndex = 0; imageIndex < images.length; ++imageIndex) {
        // const rect = images[imageIndex].getBoundingClientRect()
        // if (currentScroll >= rect.y && currentScroll <= rect.
        if (isVisible(images[imageIndex])) {
            document.title = 'Page ' + (imageIndex + 1) + mangaName + chapter_number
            history.replaceState(null, '', '' + (imageIndex + 1))
            return
        }
    }

    document.title = mangaName + chapter_number // Mk var
}

function enhanceNavigation() {

    let doubleClickTimeout = null;
    let onSingleClick = function(event) {
        doubleClickTimeout = null // Invalidate double click

        let pageChangerElement = document.querySelector('.page_changer')
        if (null === pageChangerElement || pageChangerElement.classList.contains('d-none')) {
            return
        }

        let offset = this.getBoundingClientRect()

        let internalPositionX = event.clientX - offset.left

        let direction = localStorage.getItem('custom-global-direction')
        if (null === direction) {
            direction = 'right'
        }

        if (direction === 'right') {
            if (internalPositionX <= 0.3 * offset.width) {
                // If click on the left of the screen, let's go back instead of forward
                prevPage() // Mk function
            } else {
                nextPage() // Mk function
            }
        } else {
            if (internalPositionX >= 0.7 * offset.width) {
                // If click on the right of the screen, let's go to the previous page (so this is the prevPage)
                prevPage() // Mk function
            } else {
                nextPage() // Mk function
            }
        }
    }

    let isInFullscreen = false
    let avoidClicks = false // small hack
    let onDoubleClick = function(event) {
        let fullscreenElement
        let pageChangerElement = document.querySelector('.page_changer')
        if (null === pageChangerElement || pageChangerElement.classList.contains('d-none')) {
            // fullscreenElement = document.querySelector('.indicator1').parentElement
            fullscreenElement = document.querySelector('.reader-page')
        } else {
            // fullscreenElement = document.querySelector('#ppp')
            fullscreenElement = document.querySelector('.reader-page')
        }

        doubleClickTimeout = null;
        if (isInFullscreen) {
            exitFullscreen(fullscreenElement)
            // fullscreenElement.style.overflowY = ''
        } else {
            // fullscreenElement.style.overflowY = 'scroll'
            fullscreen(fullscreenElement)
        }
        isInFullscreen = !isInFullscreen
    }

    let handleClick = function(event) {
        event.preventDefault()

        if (avoidClicks) {
            return
        }

        if (null === doubleClickTimeout) {

            doubleClickTimeout = setTimeout(onSingleClick.bind(this, event), 175)
        } else {
            clearTimeout(doubleClickTimeout)

            onDoubleClick.bind(this)(event)

            avoidClicks = true
            setTimeout(function() { avoidClicks = false }, 100)
        }
    }

    // Check if we are in single page mode
    let pageChangerElement = document.querySelector('.page_changer')
    if (null === pageChangerElement) {
        setTimeout(enhanceNavigation, 150)
    } else {
        // if (!pageChangerElement.classList.contains('d-none')) {
            // We are in single page mode since the pager isn't displayed

            let oldLink = document.querySelector('#ppp>a')
            oldLink.onclick = '' // remove default behavior
            oldLink.href = 'javascript: void(0)' // disable the link

            // Now we can add a new behavior
            // Will need to be update for each image change since we add the event on the image
            let image = document.querySelector('#ppp img')

            oldLink.addEventListener('click', handleClick, false)

            checkSwipeEvent(oldLink, {
                swipeEndCallback: function(event) {
                    let direction = localStorage.getItem('custom-global-direction')
                    if (null === direction) {
                        direction = 'right'
                    }

                    if (event.direction !== 'right' && event.direction !== 'left') {
                        return
                    }

                    if (direction === event.direction) {
                        prevPage()
                    } else {
                        nextPage()
                    }
                },
                maxTime: 600,
                minDistance: 75
            })

        // } else {

            // Let's add the fullscreen to the list view
            let dataWrapper = document.querySelector('#data-wrapper')
            dataWrapper.addEventListener('click', handleClick, false)
        // }
    }
}

(function() {
    'use strict';

    console.log("Mangakwaii++ by Aralos")


    if (document.querySelector('.nav-link.zoom-toggler.text-grey-light')) {

        setInterval(updateCurrentPage, 500)

        let addDirectionButton = function() {
            // Get the first navbar to add it our new button
            let rightNavbar = document.querySelector('.navbar-nav+.navbar-nav+.navbar-nav') // 3rd navbar, the one on the right

            let item = document.createElement('li')
            item.classList.add('nav-item')
            // item.classList.add('dropup')
            item.classList.add('mx-2')

            let link = document.createElement('a')
            link.href = 'javascript: void(0)'
            link.classList.add('nav-link')
            link.classList.add('custom-size')
            link.classList.add('text-grey-light')
            link.setAttribute('role', 'button')

            let iconArrow = document.createElement('i')
            iconArrow.classList.add('fas')

            let direction = localStorage.getItem('custom-global-direction')
            if (null === direction || 'right' === direction) {
                iconArrow.classList.add('fa-arrow-left')
            } else {
                iconArrow.classList.add('fa-arrow-right')

                let rightButton = document.querySelector('a.next-page')
                let leftButton = document.querySelector('a.prev-page')
                // Change navigation buttons, so the right button go to the previous and the left to the next
                rightButton.firstChild.textContent = 'préc '
                rightButton.onclick = null
                rightButton.href = 'javascript: void(0)'
                rightButton.addEventListener('click', prevPage)

                leftButton.lastChild.textContent = ' suiv'
                leftButton.onclick = null
                leftButton.href = 'javascript: void(0)'
                leftButton.addEventListener('click', nextPage)
            }

            link.append(iconArrow)
            item.append(link)
            rightNavbar.insertBefore(item, rightNavbar.firstChild)

            link.addEventListener('click', function() {
                let rightButton = document.querySelector('a.next-page')
                rightButton.removeEventListener('click', prevPage)
                rightButton.removeEventListener('click', nextPage)
                rightButton.onclick = null
                rightButton.href = 'javascript: void(0)'
                let leftButton = document.querySelector('a.prev-page')
                leftButton.removeEventListener('click', prevPage)
                leftButton.removeEventListener('click', nextPage)
                leftButton.onclick = null
                leftButton.href = 'javascript: void(0)'

                let direction
                if (iconArrow.classList.contains('fa-arrow-left')) {
                    // So we now want to read right-to-left
                    iconArrow.classList.remove('fa-arrow-left')
                    iconArrow.classList.add('fa-arrow-right')

                    direction = 'left'

                    // Change navigation buttons, so the right button go to the previous and the left to the next
                    rightButton.firstChild.textContent = 'préc '
                    rightButton.addEventListener('click', prevPage)

                    leftButton.lastChild.textContent = ' suiv'
                    leftButton.addEventListener('click', nextPage)

                } else {
                    iconArrow.classList.remove('fa-arrow-right')
                    iconArrow.classList.add('fa-arrow-left')

                    direction = 'right'

                    rightButton.firstChild.textContent = 'suiv '
                    rightButton.addEventListener('click', nextPage)

                    leftButton.lastChild.textContent = ' préc'
                    leftButton.addEventListener('click', prevPage)
                }

                localStorage.setItem('custom-global-direction', direction)

                // The behavior will be update automatically
            })
        }

        // Let's add a button to switch between left-to-right view and right-to-left view
        addDirectionButton()

        // To be able to click left to go left
        enhanceNavigation() // Should be called only once

        // We are in the viewer
        // Let's add a way to change the width

        // Fix header
        document.querySelector('header').style.position = 'initial'

        // Get the first navbar to add it our new button
        let firstNavbar = document.querySelector('.navbar-nav')

        let item = document.createElement('li')
        item.classList.add('nav-item')
        item.classList.add('dropup')
        item.classList.add('mx-2')

        let link = document.createElement('a')
        link.href = 'javascript: void(0)'
        link.classList.add('nav-link')
        link.classList.add('custom-size')
        link.classList.add('text-grey-light')
        link.setAttribute('role', 'button')

        let icon = document.createElement('i')
        icon.classList.add('fas')
        icon.classList.add('fa-image')

        link.append(icon)
        item.append(link)
        firstNavbar.append(item)

        // Now create the dropdown
        let dropdown = document.createElement('ul')
        dropdown.classList.add('dropdown-menu')
        // dropdown.classList.add('dropdown-menu-right')
        // dropdown.classList.add('show')

        // dropdown.style.left = '0';
        dropdown.style.right = 'auto';

        let dropdownItem = document.createElement('li')

        let textInput = document.createElement('input')
        textInput.type = 'text'
        textInput.style.color = '#eee'
        textInput.style.backgroundColor = 'inherit'
        textInput.style.border = '1px solid #222'
        textInput.style.margin = '5px 0 5px 15px'
        textInput.style.boderRadius = '3px 0 0 3px'

        // Check localstorage for a value
        const savedWidth = localStorage.getItem('custom-page-width')
        if (null !== savedWidth) {
            textInput.value = savedWidth;
        }

        let okButton = document.createElement('button')
        okButton.textContent = 'OK'

        okButton.style.color = '#eee'
        okButton.style.backgroundColor = 'inherit'
        okButton.style.border = '1px solid #222'
        okButton.style.marginRight = '15px'
        okButton.style.borderRadius = '0 3px 3px 0'


        dropdownItem.append(textInput)
        dropdownItem.append(okButton)
        dropdown.append(dropdownItem)
        item.append(dropdown)

        // item.innerHtml = '<a href="#" class="nav-link bookmark text-grey-light " role="button"><i class="fas fa-image "></i></a>'

        // Style element to overwrite the defaults
        // var styles = document.createElement('style')
        // styles.innerHTML = "body img .scan-page.img-fluid { width:200px!important; }";
        // document.body.appendChild(styles);

        if (!isTouchScreen()) {
            firstNavbar.append(item)
        } else {
            item.remove()
        }

        link.addEventListener('click', function(event) {
            dropdown.classList.toggle('show')
        }, false)

        let revertMargins = function() {
            let mysteriousDiv = document.querySelector('#page-content .container-fluid>.row>div')
            mysteriousDiv.style.paddingRight = ''
            mysteriousDiv.style.paddingLeft = ''

            let container = document.querySelector('#page-content .container-fluid')
            container.style.paddingRight = ''
            container.style.paddingLeft = ''
        }

        let removeMargins = function() {
            let mysteriousDiv = document.querySelector('#page-content .container-fluid>.row>div')
            mysteriousDiv.style.paddingRight = '0'
            mysteriousDiv.style.paddingLeft = '0'

            let container = document.querySelector('#page-content .container-fluid')
            container.style.setProperty('padding-right', '.7rem', 'important')
            container.style.setProperty('padding-left', '.7rem', 'important')
        }

        let updateWidth = function() {
            removeMargins()

            const width = textInput.value

            let allPages = document.querySelectorAll('.img-fluid')
            for (let pageIndex = 0; pageIndex < allPages.length; ++pageIndex) {
                // allPages[pageIndex].style.width = '' + width + 'px!important'
                allPages[pageIndex].style.setProperty('width', '' + width + 'px', 'important')
            }
        }

        let onValidation = function() {
            // Get value from input
            const width = Number(textInput.value)

            if (textInput.value === '') {
                revertMargins()

                localStorage.setItem('custom-page-width', '')

                let allPages = document.querySelectorAll('.img-fluid')
                for (let pageIndex = 0; pageIndex < allPages.length; ++pageIndex) {
                    allPages[pageIndex].style.width = ''
                }

                return
            }

            localStorage.setItem('custom-page-width', width)

            updateWidth()
        }

        textInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                onValidation()
            }
        })

        okButton.addEventListener('click', function(event) {
            onValidation()
        })

        // Check for new page added
        let wrapper = document.querySelector('#data-wrapper')
        wrapper.addEventListener('DOMNodeInserted', function() {
            updateWidth()
        })


        updateWidth()

        let ppp = document.querySelector('#ppp')
        ppp.addEventListener('DOMNodeInserted', function() {
            updateWidth()
        })

        // Fix navbar
        let ticking = false
        let bottomBar = document.querySelector('#bottom_nav_reader')
        let scrollBefore = 0
        document.addEventListener('scroll', function(event) {
            if (!ticking) {
                setTimeout(function() {
                    if (scrollBefore > window.scrollY) {
                        bottomBar.style.display = 'block'
                    } else {
                        bottomBar.style.display = 'none'
                    }

                    scrollBefore = window.scrollY

                    ticking = false;
                }, 150);

                ticking = true;
            }
        })
    }

})();















