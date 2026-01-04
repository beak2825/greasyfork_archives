// ==UserScript==
// @name         free-ss click QR
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       c4r
// @require      https://code.jquery.com/jquery-latest.js
// @match        https://free-ss.site/
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/394204/free-ss%20click%20QR.user.js
// @updateURL https://update.greasyfork.org/scripts/394204/free-ss%20click%20QR.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(`#tbss tr{transition: background-color 30s cubic-bezier(0, 0.7, 0.4, 0.8);}`)

    function clickQR(){
        $("i",this).click()
    }
    let anchor = document.getElementById('tbss')
    let qrAnchor = document.getElementById('qrcode')
    let timer, timer2

    function ssHelper(list, obs){
        //console.log('UI', list)
        $('#tbss tr:has(td:contains("US"))').css({
            'transition':'none',
            'background-color':'#76c8ff'
        })
        $('#tbss tr:has(td:contains("US"))').css({
            'transition':''
        })
        $('#tbss tr:has(td:contains("US")) i').on('click', function(){
            console.log(this)
            $(this.closest('tr')).css({
                //'background-color':'#becfda'
                'background-color':''
            })
        })
        //simulate click and stop it propagating
        $('#tbss tr').on('click', clickQR)
        $('#tbss i').on('click', function(){
            $('#tbss tr').off('click', clickQR)
            setTimeout(function(){
                $('#tbss tr').on('click', clickQR)
            })
        })
    }
    function urlHelper(list, obs){
        //console.warn(list)
        GM_setClipboard($('#qrcode>a').attr('href'))
    }
    let observer = new MutationObserver(ssHelper)
    if(anchor){
        observer.observe(anchor, {childList: true, subtree: true})
    }else{
        timer = setInterval(function(){
            if(anchor = document.getElementById('tbss')){
                clearInterval(timer)
                observer.observe(anchor, {childList: true, subtree: true})
            }
        }, 200)
    }
    let QRobserver = new MutationObserver(urlHelper)
    if(qrAnchor){
        QRobserver.observe(qrAnchor, {childList: true, subtree: true})
    }else{
        timer2 = setInterval(function(){
            if(qrAnchor = document.getElementById('qrcode')){
                clearInterval(timer2)
                QRobserver.observe(qrAnchor, {childList: true, subtree: true})
            }
        }, 200)
    }

})();