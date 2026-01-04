// ==UserScript==
// @name        S1长图缩小
// @namespace   Violentmonkey Scripts
// @match       *://*.saraba1st.com/2b/*
// @grant       none
// @version     2.3
// @author      -
// @run-at      document-idle
// @description 2020/2/22 下午4:38:25
// @downloadURL https://update.greasyfork.org/scripts/396764/S1%E9%95%BF%E5%9B%BE%E7%BC%A9%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/396764/S1%E9%95%BF%E5%9B%BE%E7%BC%A9%E5%B0%8F.meta.js
// ==/UserScript==


function scale() {
    Array.from(document.querySelectorAll('.pct')).map(el => {
        Array.from(el.querySelectorAll('img')).map(pic => {
            if (pic.naturalHeight > 300 && pic.flag != 1) {
                pic.height = 300
                pic.removeAttribute('width')
            }
            else if(pic.naturalWidth > 300 && pic.naturalHeight > 300 && pic.flag != 1){
                pic.height = 300
                pic.removeAttribute('width')
            }
            pic.onclick = function () {
                large(this)
            }
            if (pic.parentElement.tagName == 'A') {
                pic.parentElement.removeAttribute('href')
            }
        })
    })
}

function large(pic) {
    if (pic.flag != 1 && pic.naturalWidth <= 800) {
        pic.viewWidth = pic.width
        pic.viewHeight = pic.height
        pic.width = pic.naturalWidth
        pic.height = pic.naturalHeight
        pic.flag = 1
    }
    else if (pic.flag != 1 && pic.naturalWidth > 800) {
        pic.viewWidth = pic.width
        pic.viewHeight = pic.height
        pic.width = 800
        pic.height = pic.naturalHeight / pic.naturalWidth * 800
        pic.flag = 1
    }

    else {     
        pic.width = pic.viewWidth
        pic.height = pic.viewHeight   
        pic.flag = 0
       // window.scrollBy(0, (pic.height - pic.naturalHeight)/3)
    }
}


scale()
window.addEventListener('scroll', scale)