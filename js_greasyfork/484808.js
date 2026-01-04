// ==UserScript==
// @name         Mangajp.top Double Page
// @namespace    http://tampermonkey.net/
// @version      2024-01-17
// @description  Double Page Mode for Mangajp.top
// @author       YellowPlus
// @license      MIT
// @match        https://mangajp.top/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangajp.top
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @resource     MATERIAL_ICONS https://fonts.googleapis.com/icon?family=Material+Icons
// @downloadURL https://update.greasyfork.org/scripts/484808/Mangajptop%20Double%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/484808/Mangajptop%20Double%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = unsafeWindow.jQuery
    const materialIcons = GM_getResourceText('MATERIAL_ICONS')

    GM_addStyle(materialIcons)
    GM_addStyle(`
        .icon-btn {
            cursor: pointer;
            padding: 3px;
            border-radius: 20px;
            color: white;
            background-color: #666;
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;
            z-index: 4;
        }
        .control-panel-btn {
            position: fixed;
            bottom: 5px;
            right: 5px;
        }
        .offset-spreads-btn {
            position: relative;
            left: 40px;
        }
        .magnify-btn {
            position: relative;
            left: 56px;
        }
        #readarea-overlay {
            display: flex;
            justify-content: center;
            position: fixed;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.8);
            z-index: 2;
        }
        #pageShadow {
            box-shadow: #000000 0px 0px 25px 6px, #a6a6a6 0px 0px 6px 1px;
            z-index: 2;
        }
        #pageNum {
            position: fixed;
            width: 80px;
        }
        #chapterNum {
            position: relative;
            width: 100px;
            right: 80px;
        }
        .controlPanel-component {
            color: #fff;
            background-color: #0e1726;
            padding: 3px;
            text-align: center;
        }
        #controlPanel {
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            bottom: 0px;
            width: 100%;
            height: 40px;
            background-color: #1b3a6f;
            z-index: 3;
        }
        #readarea-overlay img:nth-child(1) {
            height: calc(100vh - 40px);
            cursor: url('/wp-content/themes/mangastream/assets/img/arrow-left-circle.svg') 14 14,auto;
        }
        #readarea-overlay img:nth-child(3) {
            height: calc(100vh - 40px);
            cursor: url('/wp-content/themes/mangastream/assets/img/arrow-right-circle.svg') 14 14,auto;
        }
        .hiddenScrollBar {
            overflow: hidden !important;
        }
        .magnifier-glass {
              position: absolute;
              border: 3px solid #000;
              border-radius: 50%;
              cursor: none;
              width: 150px;
              height: 150px;
        }
    `)

    let currentPage = 1
    let overlay, magnifier, leftPage, rightPage

    function showOverlay() {
        overlay.show()
        $('body').addClass('hiddenScrollBar')
        GM_setValue('autoStart', true)
    }

    function hideOverlay() {
        overlay.hide()
        $('body').removeClass('hiddenScrollBar')
        GM_setValue('autoStart', false)
    }

    function prevChapter() {
        $('a.ch-prev-btn')[0]?.click()
    }

    function nextChapter() {
        $('a.ch-next-btn')[0]?.click()
    }

    function changePage(i) {
        if (i < 1 || i > $('#readerarea img').length) {
            if (i < 1) {
                GM_setValue('startAtLast', true)
                prevChapter()
            }
            if (i > $('#readerarea img').length) {
                nextChapter()
            }
            return
        }

        leftPage.attr('src', $(`#readerarea img:nth-child(${i + 1})`).attr('src'))
        rightPage.attr('src', $(`#readerarea img:nth-child(${i})`).attr('src'))

        let leftFilter = (i >= $('#readerarea img').length) ? 'brightness(0) invert(1)' : 'unset'
        let rightFilter = (i == 1) ? 'brightness(0) invert(1)' : 'unset'
        leftPage.css('filter', leftFilter)
        rightPage.css('filter', rightFilter)

        $('#pageNum').html(`${i}/${$('#readerarea img').length - 1}`)
        currentPage = i
    }

    function offsetToggle() {
        if (currentPage % 2 == 1) {
            currentPage++
            if (currentPage > $('#readerarea img').length) {
                currentPage = currentPage - 2
            }
            $('.offset-spreads-btn').css('box-shadow', '#ffa124 0px 0px 0px 20px inset')
            GM_setValue('offsetSpreads', true)
        } else {
            currentPage--
            $('.offset-spreads-btn').css('box-shadow', 'unset')
            GM_setValue('offsetSpreads', false)
        }
        changePage(currentPage)
    }

    function magnifyToggle() {
        if (magnifier.is(":visible")) {
            $('.magnify-btn').css('box-shadow', 'unset')
            magnifier.hide()
        } else {
            $('.magnify-btn').css('box-shadow', '#ffa124 0px 0px 0px 20px inset')
            magnifier.show()
        }
    }

    function nextPage() {
        changePage(currentPage + 2)
    }

    function prevPage() {
        changePage(currentPage - 2)
    }

    function controlPanelToggle() {
        if ($('#controlPanel').is(':visible')) {
            $('#controlPanel').hide()
            leftPage.css('height', '100vh')
            rightPage.css('height', '100vh')
            GM_setValue('controlPanel', true)
        } else {
            $('#controlPanel').show()
            leftPage.css('height', 'calc(100vh - 40px)')
            rightPage.css('height', 'calc(100vh - 40px)')
            GM_setValue('controlPanel', false)
        }
    }

    function moveMagnifier(e) {
        e.preventDefault()

        let x, y, px, py
        x = e.pageX
        y = e.pageY

        if (x < rightPage.offset().left) {
            magnifier.css('background-image', `url('${leftPage.attr('src')}')`)
            magnifier.css('background-size', `${leftPage.width() * 3}px ${leftPage.height() * 3}px`)
            px = x - leftPage.offset().left
            py = y - leftPage.offset().top
        } else {
            magnifier.css('background-image', `url('${rightPage.attr('src')}')`)
            magnifier.css('background-size', `${rightPage.width() * 3}px ${rightPage.height() * 3}px`)
            px = x - rightPage.offset().left
            py = y - rightPage.offset().top
        }
        if (x > leftPage.offset().left && x < rightPage.offset().left + rightPage.width()) {
            magnifier.offset({ top: y - 75, left: x - 75 })
            magnifier.css('background-position', `${-(px * 3 - 75 + 3)}px ${-(py * 3 - 75 + 3)}px`)
        }
    }

    // Preparing html elements
    overlay = $('<div id="readarea-overlay"></div>').hide().prependTo('body')
    overlay.click((e) => {
        if (e.target === e.currentTarget) hideOverlay()
    })

    $('#readerarea img:first-child').clone().prependTo('#readerarea')
    $('#readerarea img:first-child').css('filter', 'brightness(0) invert(1)')

    $('<a id="double-page-mode-btn" href="#" style="float: left; margin-right:10px;">Double Page Mode</a>').click(()=> { showOverlay() }).prependTo('.npv > .nextprev')

    // Block keydown during double page mode
    unsafeWindow.document.addEventListener('keydown', (e) => {
        if (overlay.css('display') == 'flex') {
            // 37 left 39 right 32 spacebar 27 esc
            if (e.keyCode == 39 || e.keyCode == 37 || e.keyCode == 32 || e.keyCode == 27) {
                e.stopImmediatePropagation();
                e.preventDefault();

                if (e.keyCode == 39) {
                    prevPage()
                }
                if (e.keyCode == 37) {
                    nextPage()
                }
                if (e.keyCode == 32) {
                    offsetToggle()
                }
                if (e.keyCode == 27) {
                    hideOverlay()
                }
            }
        }
    })

    if (GM_getValue('autoStart')) {
        $('#double-page-mode-btn').click()
    }

    // Main
    $('#readerarea img:first-child').one('load', () => {
        // Overlay
        $('<div id="pageShadow"></div>').prependTo(overlay)
        rightPage = $('#readerarea img:nth-child(1)').clone().click(() => { prevPage() }).appendTo(overlay)
        leftPage = $('#readerarea img:nth-child(2)').clone().click(() => { nextPage() }).prependTo(overlay)
        $('<span class="material-icons control-panel-btn icon-btn" title="Toggle Control Panel">menu</span>').click(() => {
            controlPanelToggle()
        }).appendTo(overlay)

        // Control Panel
        $('<div id="controlPanel"></div>').appendTo(overlay)
        $(`<div id="chapterNum" class="controlPanel-component">${$('#chapter').find(':selected').text()}</div>`).appendTo($('#controlPanel'))
        $(`<div id="pageNum" class="controlPanel-component">1/${$('#readerarea img').length - 1}</div>`).appendTo($('#controlPanel'))
        $('<span class="material-icons offset-spreads-btn icon-btn" title="Double Page Offset Spreads">import_contacts</span>').click(()=> {
            offsetToggle()
        }).appendTo($('#controlPanel'))
        $('<span class="material-icons magnify-btn icon-btn" title="Image Magnifier Glass">zoom_in</span>').click(()=> {
            magnifyToggle()
        }).appendTo($('#controlPanel'))

        // Magnifier Glass
        magnifier = $('<div class="magnifier-glass"></div>').on('mousemove', moveMagnifier).hide().css('backgroundRepeat', 'no-repeat').appendTo(overlay)
        $('#readarea-overlay img:nth-child(1)').on('mousemove', moveMagnifier)
        $('#readarea-overlay img:nth-child(3)').on('mousemove', moveMagnifier)

        // Misc
        $('#readerarea img:first-child').hide()
        $('#readarea-overlay img').on('dragstart', (e) => { e.preventDefault() })

        // Initialize
        if (GM_getValue('startAtLast')) {
            GM_setValue('startAtLast', false)
            changePage(($('#readerarea img').length % 2 == 1) ? $('#readerarea img').length : $('#readerarea img').length - 1)
        }

        if (GM_getValue('offsetSpreads')) {
            offsetToggle()
        }

        if (GM_getValue('controlPanel')) {
            controlPanelToggle()
        }

        // $('#readerarea').css('display', 'flex').css('flex-wrap', 'wrap').css('flex-direction', 'row-reverse').css('justify-content', 'center').css('max-width', 'unset').css('width', $('#readerarea img:first-child').width() * 2)
        // $('#readerarea img').css('margin', '0 0 30px')
    })
})();