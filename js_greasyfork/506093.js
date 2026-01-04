// ==UserScript==
// @name         輕小說機翻機器人 Mod
// @namespace    https://books.fishhawk.top/
// @version      1.0.4
// @description  apply css to novel page
// @author       You
// @match        https://books.fishhawk.top/*
// @icon         https://books.fishhawk.top/icon.svg
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506093/%E8%BC%95%E5%B0%8F%E8%AA%AA%E6%A9%9F%E7%BF%BB%E6%A9%9F%E5%99%A8%E4%BA%BA%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/506093/%E8%BC%95%E5%B0%8F%E8%AA%AA%E6%A9%9F%E7%BF%BB%E6%A9%9F%E5%99%A8%E4%BA%BA%20Mod.meta.js
// ==/UserScript==
 
(function() {
    'use strict'
 
    // Your code here...
    inject_css()
})()
 
$(document).on('keydown', function(e) {
    const currentY = $(window).scrollTop()
    const length = 600

    if (e.code === 'ArrowUp') {
        $('html,body').animate({
            scrollTop: currentY - length
        })

    } else if (e.code === 'ArrowDown') {
        $('html,body').animate({
            scrollTop: currentY + length
        })

    } else if (e.key === 'w') {
        document.dispatchEvent(new KeyboardEvent('keydown', {code: 'ArrowUp'}))

    } else if (e.key === 's') {
        document.dispatchEvent(new KeyboardEvent('keydown', {code: 'ArrowDown'}))

    } else if (e.key === 'a') {
        $('button[lable^=上一]').click()

    } else if (e.key === 'd') {
        $('button[lable^=下一]').click()
    }
})
 
function inject_css(){
    console.log('invoke')

    const bgColog = 'black'
    const colorBase = 'lightsteelblue'

    const cssBase = {
        'font-size': '30px',
        'font-family': 'Arial',
        'color': 'lightsteelblue'
    }

    $('#content').css({...cssBase, 'color': '#04AA6D'})
    $('#title').css({...cssBase, 'padding': '10px 0 20px'})

    $('html').css({'scrollbar-color': '#007 #bada55'})
    $('body').attr('bgcolor', bgColog)
    $('#headlink *, #footlink *').css({color: colorBase})

    $('#foottext a:nth-child(3), #foottext a:nth-child(4)').css({
        ...cssBase,
        'line-height': '2.5rem',
        'font-size': '2.5rem',
    })

    // remove ads
    $('div[id^="adv"]').remove()
    $('a[href$="game.php"]').remove()
}