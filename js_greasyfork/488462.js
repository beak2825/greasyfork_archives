// ==UserScript==
// @name         Test Script
// @namespace    http://tampermonkey.net/
// @version      1.2.7
// @description  This is just a test for tampermonkey
// @author       ximwkz
// @match        https://garlandisd.instructure.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/488462/Test%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/488462/Test%20Script.meta.js
// ==/UserScript==

window.addEventListener('load', function() {

    function reaplaceAvatar(){
        document.querySelector(".menu-item ic-app-header__menu-list-item ").innerHTML = `
        <li class="menu-item ic-app-header__menu-list-item ">
            <a id="global_nav_profile_link" role="button" href="/profile/settings" class="ic-app-header__menu-list-link">
                <div class="menu-item-icon-container">
                    <div aria-hidden="true" class="fs-exclude ic-avatar ">
                        X
                    </div>
                    <span class="menu-item__badge"></span>
                </div>
                <div class="menu-item__text">
                    Injected By Xim
                </div>
            </a>
        </li>
        `
    }

    function createbutton() {
        let youtube = document.createElement('li')
        youtube.innerHTML = `
        <li class="menu-item ic-app-header__menu-list-item">
            <a id="global_nav_tampermonkey" role="button" href="https://www.youtube.com" class="ic-app-header__menu-list-link">
                <div class="menu-item-icon-container" aria-hidden="true">
                    <svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 49 49" xml:space="preserve" class="ic-icon-svg menu-item__icon svg-icon-help"><g><g><path d="M39.256,6.5H9.744C4.371,6.5,0,10.885,0,16.274v16.451c0,5.39,4.371,9.774,9.744,9.774h29.512c5.373,0,9.744-4.385,9.744-9.774V16.274C49,10.885,44.629,6.5,39.256,6.5z M47,32.726c0,4.287-3.474,7.774-7.744,7.774H9.744C5.474,40.5,2,37.012,2,32.726V16.274C2,11.988,5.474,8.5,9.744,8.5h29.512c4.27,0,7.744,3.488,7.744,7.774V32.726z"/><path d="M33.36,24.138l-13.855-8.115c-0.308-0.18-0.691-0.183-1.002-0.005S18,16.527,18,16.886v16.229c0,0.358,0.192,0.69,0.502,0.868c0.154,0.088,0.326,0.132,0.498,0.132c0.175,0,0.349-0.046,0.505-0.137l13.855-8.113c0.306-0.179,0.495-0.508,0.495-0.863S33.667,24.317,33.36,24.138z M20,31.37V18.63l10.876,6.371L20,31.37z"/></g></g></svg>
                </div>
                <div class="menu-item__text">Youtube</div>
            </a>
        </li>
        `
        document.querySelector(".ic-app-header__menu-list").appendChild(youtube)

        let temp1 = document.createElement('li')
        temp1.innerHTML = `
        <li class="menu-item ic-app-header__menu-list-item">
            <a id="global_nav_tampermonkey" role="button" href="https://www.youtube.com" class="ic-app-header__menu-list-link">
                <div class="menu-item-icon-container" aria-hidden="true">
                    TEMP
                </div>
                <div class="menu-item__text">temp1</div>
            </a>
        </li>
        `
        document.querySelector(".ic-app-header__menu-list").appendChild(temp1)

        let temp2 = document.createElement('li')
        temp2.innerHTML = `
        <li class="menu-item ic-app-header__menu-list-item">
            <a id="global_nav_tampermonkey" role="button" href="https://www.youtube.com" class="ic-app-header__menu-list-link">
                <div class="menu-item-icon-container" aria-hidden="true">
                    TEMP
                </div>
                <div class="menu-item__text">temp2</div>
            </a>
        </li>
        `
        document.querySelector(".ic-app-header__menu-list").appendChild(temp2)

        let temp3 = document.createElement('li')
        temp3.innerHTML = `
        <li class="menu-item ic-app-header__menu-list-item">
            <a id="global_nav_tampermonkey" role="button" href="https://www.youtube.com" class="ic-app-header__menu-list-link">
                <div class="menu-item-icon-container" aria-hidden="true">
                    TEMP
                </div>
                <div class="menu-item__text">temp3</div>
            </a>
        </li>
        `
        document.querySelector(".ic-app-header__menu-list").appendChild(temp3)

        let temp4 = document.createElement('li')
        temp4.innerHTML = `
        <li class="menu-item ic-app-header__menu-list-item">
            <a id="global_nav_tampermonkey" role="button" href="https://www.tampermonkey.net" class="ic-app-header__menu-list-link" target="_blank">
                <div class="menu-item-icon-container" aria-hidden="true">
                    <svg version="1.1" viewBox="0 0 250.67 250.67" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><title>tampermonkey_icon</title><metadata><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/><dc:title>tampermonkey_icon</dc:title><cc:license rdf:resource="https://www.gnu.org/licenses/gpl-3.0.html"/><dc:date>2016-05-26</dc:date><dc:creator><cc:Agent><dc:title>derjanb (https://github.com/derjanb)</dc:title></cc:Agent></dc:creator><dc:rights><cc:Agent><dc:title>https://www.gnu.org/licenses/gpl-3.0.html</dc:title></cc:Agent></dc:rights><dc:publisher><cc:Agent><dc:title>Marti Martz (https://github.com/Martii)</dc:title></cc:Agent></dc:publisher><dc:source>https://github.com/Tampermonkey/tampermonkey/blob/fb31096869523ecdec3b4ae06fbf21678eddb565/images/icon128.png</dc:source></cc:Work></rdf:RDF></metadata><path d="m62.115 0c-34.412 0-62.115 27.703-62.115 62.115v126.44c0 34.412 27.703 62.115 62.115 62.115h126.44c34.412 0 62.115-27.703 62.115-62.115v-126.44c0-34.412-27.703-62.115-62.115-62.115zm4.6758 132.58a51.124 51.124 0 0 1 5.1035 0.25586 51.124 51.124 0 0 1 5.0527 0.76367 51.124 51.124 0 0 1 4.9512 1.2637 51.124 51.124 0 0 1 4.8008 1.7539 51.124 51.124 0 0 1 4.6016 2.2226 51.124 51.124 0 0 1 4.3574 2.6699 51.124 51.124 0 0 1 4.0684 3.0938 51.124 51.124 0 0 1 3.7383 3.4824 51.124 51.124 0 0 1 3.373 3.8398 51.124 51.124 0 0 1 2.9727 4.1562 51.124 51.124 0 0 1 2.543 4.4336 51.124 51.124 0 0 1 2.0879 4.6641 51.124 51.124 0 0 1 1.6113 4.8496 51.124 51.124 0 0 1 1.1192 4.9863 51.124 51.124 0 0 1 0.61523 5.0723 51.124 51.124 0 0 1 0.12891 3.6172 51.124 51.124 0 0 1-0.25586 5.1035 51.124 51.124 0 0 1-0.76368 5.0527 51.124 51.124 0 0 1-1.2656 4.9512 51.124 51.124 0 0 1-1.752 4.8008 51.124 51.124 0 0 1-2.2227 4.6016 51.124 51.124 0 0 1-2.6699 4.3574 51.124 51.124 0 0 1-3.0938 4.0684 51.124 51.124 0 0 1-3.4824 3.7383 51.124 51.124 0 0 1-3.8398 3.373 51.124 51.124 0 0 1-4.1562 2.9727 51.124 51.124 0 0 1-4.4336 2.543 51.124 51.124 0 0 1-4.6641 2.0879 51.124 51.124 0 0 1-4.8496 1.6113 51.124 51.124 0 0 1-4.9863 1.1191 51.124 51.124 0 0 1-5.0723 0.61523 51.124 51.124 0 0 1-3.6172 0.12695 51.124 51.124 0 0 1-5.1035-0.2539 51.124 51.124 0 0 1-5.0527-0.76367 51.124 51.124 0 0 1-4.9512-1.2656 51.124 51.124 0 0 1-4.8008-1.752 51.124 51.124 0 0 1-4.6016-2.2227 51.124 51.124 0 0 1-4.3574-2.6719 51.124 51.124 0 0 1-4.0684-3.0918 51.124 51.124 0 0 1-3.7383-3.4824 51.124 51.124 0 0 1-3.373-3.8398 51.124 51.124 0 0 1-2.9727-4.1563 51.124 51.124 0 0 1-2.543-4.4336 51.124 51.124 0 0 1-2.0879-4.6641 51.124 51.124 0 0 1-1.6113-4.8496 51.124 51.124 0 0 1-1.1191-4.9863 51.124 51.124 0 0 1-0.61523-5.0742 51.124 51.124 0 0 1-0.12891-3.6152 51.124 51.124 0 0 1 0.25586-5.1035 51.124 51.124 0 0 1 0.76367-5.0527 51.124 51.124 0 0 1 1.2637-4.9531 51.124 51.124 0 0 1 1.7539-4.7988 51.124 51.124 0 0 1 2.2227-4.6016 51.124 51.124 0 0 1 2.6699-4.3574 51.124 51.124 0 0 1 3.0938-4.0684 51.124 51.124 0 0 1 3.4824-3.7383 51.124 51.124 0 0 1 3.8398-3.373 51.124 51.124 0 0 1 4.1562-2.9726 51.124 51.124 0 0 1 4.4336-2.543 51.124 51.124 0 0 1 4.6641-2.0879 51.124 51.124 0 0 1 4.8496-1.6113 51.124 51.124 0 0 1 4.9863-1.1191 51.124 51.124 0 0 1 5.0723-0.61524 51.124 51.124 0 0 1 3.6172-0.1289zm117.54 0a51.124 51.124 0 0 1 5.1035 0.25586 51.124 51.124 0 0 1 5.0527 0.76367 51.124 51.124 0 0 1 4.9531 1.2637 51.124 51.124 0 0 1 4.7988 1.7539 51.124 51.124 0 0 1 4.6016 2.2226 51.124 51.124 0 0 1 4.3574 2.6699 51.124 51.124 0 0 1 4.0684 3.0938 51.124 51.124 0 0 1 3.7383 3.4824 51.124 51.124 0 0 1 3.373 3.8398 51.124 51.124 0 0 1 2.9727 4.1562 51.124 51.124 0 0 1 2.543 4.4336 51.124 51.124 0 0 1 2.0879 4.6641 51.124 51.124 0 0 1 1.6113 4.8496 51.124 51.124 0 0 1 1.1191 4.9863 51.124 51.124 0 0 1 0.61523 5.0723 51.124 51.124 0 0 1 0.12891 3.6172 51.124 51.124 0 0 1-0.25586 5.1035 51.124 51.124 0 0 1-0.76367 5.0527 51.124 51.124 0 0 1-1.2637 4.9512 51.124 51.124 0 0 1-1.7539 4.8008 51.124 51.124 0 0 1-2.2227 4.6016 51.124 51.124 0 0 1-2.6699 4.3574 51.124 51.124 0 0 1-3.0938 4.0684 51.124 51.124 0 0 1-3.4824 3.7383 51.124 51.124 0 0 1-3.8398 3.373 51.124 51.124 0 0 1-4.1563 2.9727 51.124 51.124 0 0 1-4.4336 2.543 51.124 51.124 0 0 1-4.6641 2.0879 51.124 51.124 0 0 1-4.8496 1.6113 51.124 51.124 0 0 1-4.9863 1.1191 51.124 51.124 0 0 1-5.0723 0.61523 51.124 51.124 0 0 1-3.6172 0.12695 51.124 51.124 0 0 1-5.1035-0.2539 51.124 51.124 0 0 1-5.0527-0.76367 51.124 51.124 0 0 1-4.9512-1.2656 51.124 51.124 0 0 1-4.8008-1.752 51.124 51.124 0 0 1-4.6016-2.2227 51.124 51.124 0 0 1-4.3574-2.6719 51.124 51.124 0 0 1-4.0684-3.0918 51.124 51.124 0 0 1-3.7383-3.4824 51.124 51.124 0 0 1-3.373-3.8398 51.124 51.124 0 0 1-2.9726-4.1563 51.124 51.124 0 0 1-2.543-4.4336 51.124 51.124 0 0 1-2.0879-4.6641 51.124 51.124 0 0 1-1.6113-4.8496 51.124 51.124 0 0 1-1.1191-4.9863 51.124 51.124 0 0 1-0.61524-5.0742 51.124 51.124 0 0 1-0.12695-3.6152 51.124 51.124 0 0 1 0.25391-5.1035 51.124 51.124 0 0 1 0.76367-5.0527 51.124 51.124 0 0 1 1.2656-4.9531 51.124 51.124 0 0 1 1.752-4.7988 51.124 51.124 0 0 1 2.2226-4.6016 51.124 51.124 0 0 1 2.6719-4.3574 51.124 51.124 0 0 1 3.0918-4.0684 51.124 51.124 0 0 1 3.4824-3.7383 51.124 51.124 0 0 1 3.8398-3.373 51.124 51.124 0 0 1 4.1562-2.9726 51.124 51.124 0 0 1 4.4336-2.543 51.124 51.124 0 0 1 4.6641-2.0879 51.124 51.124 0 0 1 4.8496-1.6113 51.124 51.124 0 0 1 4.9863-1.1191 51.124 51.124 0 0 1 5.0742-0.61524 51.124 51.124 0 0 1 3.6152-0.1289z" fill="#222"/></svg>
                </div>
                <div class="menu-item__text">Tampermonkey</div>
            </a>
        </li>
        `
        document.querySelector(".ic-app-header__menu-list").appendChild(temp4)
    }

    function injected() {
        console.error(`
        ##################################################################################

        ▄█  ███▄▄▄▄        ▄█    ▄████████  ▄████████     ███        ▄████████ ████████▄
        ███  ███▀▀▀██▄     ███   ███    ███ ███    ███ ▀█████████▄   ███    ███ ███   ▀███
        ███▌ ███   ███     ███   ███    █▀  ███    █▀     ▀███▀▀██   ███    █▀  ███    ███
        ███▌ ███   ███     ███  ▄███▄▄▄     ███            ███   ▀  ▄███▄▄▄     ███    ███
        ███▌ ███   ███     ███ ▀▀███▀▀▀     ███            ███     ▀▀███▀▀▀     ███    ███
        ███  ███   ███     ███   ███    █▄  ███    █▄      ███       ███    █▄  ███    ███
        ███  ███   ███     ███   ███    ███ ███    ███     ███       ███    ███ ███   ▄███
        █▀    ▀█   █▀  █▄ ▄███   ██████████ ████████▀     ▄████▀     ██████████ ████████▀
                       ▀▀▀▀▀▀

        ##################################################################################
        `)
    }


    function changeHeaderBg() {
        document.querySelector(".ic-app-header__main-navigation").setAttribute('id', "red")
        document.getElementById("red").style.background = "linear-gradient(0deg, #7300a1, #ffffff)"
    }

    createbutton()
    changeHeaderBg()
    reaplaceAvatar()
    injected()
})
