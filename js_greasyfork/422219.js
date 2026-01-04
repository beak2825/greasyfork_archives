// ==UserScript==
// @name        Pixiv Quick Preview
// @description Preview media without opening the post page.
// @namespace   relaxeaza/userscripts
// @author      relaxeaza
// @copyright   2021, Relaxeaza (https://gitlab.com/relaxeaza)
// @license     GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @version     1.0.6
// @grant       none
// @run-at      document-start
// @icon        https://gitlab.com/relaxeaza/userscripts/raw/master/share/pixiv-quick-preview.logo.png
// @include     https://www.pixiv.net*
// @homepageURL https://gitlab.com/relaxeaza/userscripts
// @noframes
// @require     https://cdnjs.cloudflare.com/ajax/libs/sizzle/2.3.5/sizzle.js
// @downloadURL https://update.greasyfork.org/scripts/422219/Pixiv%20Quick%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/422219/Pixiv%20Quick%20Preview.meta.js
// ==/UserScript==

const POSTS_SELECTOR = 'a[href^="/member_illust.php"]:not(.rlx):has(img), a[href^="/en/artworks/"]:not(.rlx):has(img)'
const $overlay = document.createElement('div')
const $loading = document.createElement('span')
const $media = document.createElement('img')

const setupSectionListeners = function () {
    for (let $post of Sizzle(POSTS_SELECTOR)) {
        $post.classList.add('rlx')
        $post.addEventListener('mouseenter', function () {
            const $img = $post.querySelector('img')
            showPreview($img.src, !!$post.querySelector('svg circle'))
        })
        $post.addEventListener('mouseleave', hidePreview)
    }
}

const getSource = function (url) {
    let match = url.match(/(?:img-master|custom-thumb)\/img(\/\d{4}\/(?:\d{2}\/){5})(\d+)_p0/)
    return match && match[1] ? `https://i.pximg.net/img-master/img${match[1]}${match[2]}_p0_master1200.jpg` : false
}

const showPreview = function (src, isVideo) {
    $media.src = isVideo ? src : getSource(src)
    $overlay.style.display = 'flex'
}

const hidePreview = function () {
    $overlay.style.display = 'none'
    $media.src = ''
}

document.addEventListener('DOMContentLoaded', function () {
    $overlay.style['position'] = 'fixed'
    $overlay.style['display'] = 'none'
    $overlay.style['place-content'] = 'center';
    $overlay.style['align-items'] = 'center';
    $overlay.style['top'] = '0px'
    $overlay.style['left'] = '0px'
    $overlay.style['width'] = '100%'
    $overlay.style['height'] = '100%'
    $overlay.style['font-size'] = '30px'
    $overlay.style['font-weight'] = 'bold'
    $overlay.style['color'] = '#0095F9'
    $overlay.style['text-shadow'] = '2px 2px 0px #000000'
    $overlay.style['pointer-events'] = 'none'
    $overlay.style['z-index'] = '1000'

    $loading.innerText = 'loading...'
    $loading.style['position'] = 'absolute'
    $loading.style['z-index'] = '1'

    $media.style['max-width'] = '90%'
    $media.style['max-height'] = '90%'
    $media.style['width'] = 'auto'
    $media.style['height'] = 'auto'
    $media.style['z-index'] = '2'
    $media.style['pointer-events'] = 'none'

    $overlay.appendChild($loading)
    $overlay.appendChild($media)
    document.body.appendChild($overlay)

    new MutationObserver(setupSectionListeners).observe(document.body, {
        childList: true,
        subtree: true
    })
    setupSectionListeners()

    let previousState = window.history.state
    setInterval(function() {
        if (previousState !== window.history.state) {
            previousState = window.history.state
            hidePreview()
        }
    }, 333)
})
