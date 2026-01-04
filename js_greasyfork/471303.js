// ==UserScript==
// @name         WeRead Resize(调整微信读书页面尺寸，获得更好体验)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  simple resize for WeRead. Better Enjoy!
// @author       You
// @match        https://weread.qq.com/web/reader/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471303/WeRead%20Resize%28%E8%B0%83%E6%95%B4%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E9%A1%B5%E9%9D%A2%E5%B0%BA%E5%AF%B8%EF%BC%8C%E8%8E%B7%E5%BE%97%E6%9B%B4%E5%A5%BD%E4%BD%93%E9%AA%8C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/471303/WeRead%20Resize%28%E8%B0%83%E6%95%B4%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E9%A1%B5%E9%9D%A2%E5%B0%BA%E5%AF%B8%EF%BC%8C%E8%8E%B7%E5%BE%97%E6%9B%B4%E5%A5%BD%E4%BD%93%E9%AA%8C%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // hide topbar
    document.getElementsByClassName('readerTopBar')[0].style.display = 'none';

    // resize container
    function resizeContainer(){
        let oContainer = document.getElementsByClassName('app_content')[0]
        oContainer.style.margin = 0
        oContainer.style.width = '100%'
        oContainer.style.maxWidth = '100%'
    }

    // resize sidebar
    function resizeSideBar(){
        document.getElementsByClassName('readerControls')[0].style.left = 'unset'
        document.getElementsByClassName('readerControls')[0].style.right = '2px'

        let btnList = document.querySelectorAll('.readerControls button, .readerControls .readerControls_fontSize')
        btnList.forEach((btn)=>{
            btn.style.width = '24px'
            btn.style.height = '24px'
        })

        document.getElementsByClassName('readerControls_fontSize')[0].style.justifyContent = 'center'
    }

    resizeContainer()
    resizeSideBar()
})();