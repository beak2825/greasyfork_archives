// ==UserScript==
// @name         Better wykop
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  Displays high resolution images on wykop.pl
// @description  Enables 2 column layout on home page
// @description  Fixes paddings in navbar
// @description  Sticky navbar

// @author       You
// @match        *://*.wykop.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398389/Better%20wykop.user.js
// @updateURL https://update.greasyfork.org/scripts/398389/Better%20wykop.meta.js
// ==/UserScript==

function debounce(func, wait, immediate = false) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) { func.apply(context, args); }
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) { func.apply(context, args); }
    };
};

const getSize = (url) => {
    let size = {
        x: null,
        y: null,
    }

    if (url.includes(',q40.')) { size = { x: '40px', y: '40px' } }
    if (url.includes(',w400.')) { size = { x: '100%' } }
    if (url.includes(',w113h64.')) { size = { x: '113px', y: '64px' } }
    if (url.includes(',w207h139.')) { size = { x: null, y: null } }
    if (url.includes(',w300h223.')) { size = { x: '300px', y: '223px' } }

    return size
}

const setSize = (image, url) => {
    const { x, y } = getSize(url)

    if (x !== null) { image.style['max-width'] = x }
    if (y !== null) { image.style['max-height'] = y }
}

const removeLowResolutionFromUrl = (url) => url
    .replace(',q40', '')
    .replace(',w400', '')
    .replace(',w113h64', '')
    .replace(',w207h139', '')
    .replace(',w300h223', '')

const updateImages = () => {
    const images = document.querySelectorAll('img');

    images.forEach((image) => {
        const src = image.getAttribute('src')
        const dataOriginal = image.getAttribute('data-original')
        const safeUrl = src || dataOriginal || ''

        if (image.classList.contains('lazy')) {
            // masonry breaks lazy loading
            if (window.location.pathname === '/') {
                image.setAttribute('src', safeUrl)
            } else {
                if (src) {
                    setSize(image, safeUrl)
                    image.setAttribute('src', removeLowResolutionFromUrl(src))
                }

                if (dataOriginal) {
                    setSize(image, safeUrl)
                    image.setAttribute('data-original', removeLowResolutionFromUrl(dataOriginal))
                }
            }

        }
    })
}

const debouncedUpdateImages = debounce(function () {
    updateImages()
}, 500);

const enableStickyNavbar = () => {
    let lastKnownScrollPosition = 0;
    let ticking = false;
    const nav = document.getElementById('nav')

    const doSomething = (scrollPosition) => {
        const diff = lastKnownScrollPosition - scrollPosition

        if (diff > 0) {
            // up
            nav.setAttribute('style', 'position: fixed !important')
            nav.style.top = 0;
            nav.style['max-width'] = '100vw';

            document.body.style['margin-top'] = '50px'
        }

        if (diff < 0) {
            // down
            nav.style.position = 'relative'
            document.body.style['margin-top'] = '0'
        }
    }

    window.addEventListener('scroll', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                doSomething(window.scrollY);
                lastKnownScrollPosition = window.scrollY;
                ticking = false;
            });

            ticking = true;
        }
    });

}

const injectHomePageStyles = () => {
    const style = document.createElement('style');

    style.innerHTML = `
        .better-wykop-column {
            display: inline-flex;
            flex-wrap: wrap;
            flex-direction: column;
            max-width: 49%;
        }

        .better-wykop-column > li {
            max-width: 100%;
        }

        .article.preview .media-content:not(.rwdImages) {
            background-color: unset !important;
        }

        .article.preview .media-content {
            min-height: unset;
        }
    `

    document.head.appendChild(style);
}

const injectNavbarStyles = () => {
    const style = document.createElement('style');

    style.innerHTML = `
        #nav .wrapper.nav {
            padding-left: 0;
        }

        #nav > div > ul li:first-child a {
            padding: 10px 30px 10px 20px !important;
        }

        #nav > div > ul li.active a {
            left: 45px;
            padding-left: 0 !important;
            margin-left: 10px !important;
        }

        #nav > div > ul:last-child li:first-child {
            right: 183px;
        }
    `

    document.head.appendChild(style);
}

const enableMasonryGrid = () => {
    const homepageItems = document.querySelectorAll('ul#itemsStream > li')
    const oldContainer = document.querySelector('ul#itemsStream')
    const mainGrid = document.querySelector('.grid-main')

    if (mainGrid && oldContainer && homepageItems.length > 0) {
        const column1 = document.createElement('ul')
        const column2 = document.createElement('ul')

        column1.setAttribute('class', 'comments-stream better-wykop-column')
        column2.setAttribute('class', 'comments-stream better-wykop-column better-wykop-column-2')

        mainGrid.insertBefore(column1, oldContainer)
        mainGrid.insertBefore(column2, oldContainer)

        homepageItems.forEach((item, i) => {
            i % 2 === 0
                ? column1.appendChild(item)
                : column2.appendChild(item)
        })

        mainGrid.removeChild(oldContainer)
    }
}

(() => {
    document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
            if (window.location.pathname === '/' || window.location.pathname.includes('/strona/')) {
                enableMasonryGrid()
                injectHomePageStyles()
            }

            injectNavbarStyles()
            updateImages()
            enableStickyNavbar()
            window.addEventListener('scroll', debouncedUpdateImages);
        }
    };
})()
