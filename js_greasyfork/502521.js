// ==UserScript==
// @name         Wenku8 Mod
// @namespace    https://www.wenku8.net
// @version      1.0.5
// @description  apply css to novel page
// @author       You
// @match        http*://www.wenku8.net/novel/*.htm
// @match        http*://www.wenku8.net/*reader.php*
// @exclude      /^.*?index.htm$/
// @icon         https://www.wenku8.net/favicon.ico
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502521/Wenku8%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/502521/Wenku8%20Mod.meta.js
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