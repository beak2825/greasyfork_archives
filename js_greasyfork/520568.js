// ==UserScript==
// @name         lizhiweike
// @namespace    https://github.com/alanwhy
// @version      0.0.1
// @description  荔枝微课浏览器全屏
// @author       wuhaoyuan
// @match        *://*.lizhiweike.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520568/lizhiweike.user.js
// @updateURL https://update.greasyfork.org/scripts/520568/lizhiweike.meta.js
// ==/UserScript==

(function() {
    'use strict';


    setTimeout(()=>{
        var btn = document.createElement('div')

        btn.innerText = "浏览器内全屏"
        btn.id = 'lizhi-why'
        btn.style.position = 'fixed'
        btn.style.top = '10px'
        btn.style.left = '10px'
        btn.style.zIndex = "999999"
        btn.style.background = "#fff"
        btn.style.padding = "5px 10px"
        btn.style.borderRadius = "5px"
        btn.style.border = "1px solid #999"

        document.body.appendChild(btn)

        btn.addEventListener('mouseenter',()=>{
            btn.style.background = "#ccc"
            btn.style.cursor = "pointer"
        })

        btn.addEventListener('mouseleave',()=>{
            btn.style.background = "#fff"
        })

        btn.onclick = function(){
            document.getElementById('App').style.maxWidth = "100%"
            document.getElementsByClassName('HeaderVideo-container')[0].style.height = "100vh"
            document.getElementsByClassName('CommentInput-container')[0].style.display = "none"
            document.getElementsByClassName('FloatingWindow-box-more')[0].style.display = "none"

            btn.style.display = 'none'
        }
    },500)
})();