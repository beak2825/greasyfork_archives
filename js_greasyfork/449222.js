// ==UserScript==
// @namespace    http://tampermonkey.net/
// @name         7 Cups - GIF freezer
// @description  GIF freezer
// @locale       en
// @author       RarelyCharlie
// @website      https://www.7cups.com/@RarelyCharlie
// @license      Open Software License version 3.0
// @match        https://www.7cups.com/*
// @noframes
// @run-at       document-start
// @version      1
// @downloadURL https://update.greasyfork.org/scripts/449222/7%20Cups%20-%20GIF%20freezer.user.js
// @updateURL https://update.greasyfork.org/scripts/449222/7%20Cups%20-%20GIF%20freezer.meta.js
// ==/UserScript==
{
    let s = document.head.appendChild(document.createElement('STYLE'))
    s.id = 'rc-giffreeze'
    s.textContent = '[src*=".gif"] {opacity: 0;}'
      + '.rc-gifbox {position: relative; max-width: 100%;}'
      + '.rc-gifbox img, .rc-gifbox canvas, .rc-giftag {position: absolute; top: 0; left: 0;}'
      + '.rc-gifbox:hover img {opacity: 1;}'
      + '.rc-gifbox:hover canvas, .rc-gifbox:hover .rc-giftag {opacity: 0;}'
      + '.rc-giftag {width: 100%; font-size: 60px; text-align: center; font-weight: bold; '
        + 'color: #fff; opacity: .8; text-shadow: 0 0 4px #000;}'
    }

addEventListener('DOMContentLoaded', () => {
    var freeze = async elem => {
        try {await elem.decode()} catch (e) {return}
        var img = $(elem), w = img.width(), h = img.height(),
            box = $('<div class="rc-gifbox"></div>'),
            can = $('<canvas></canvas>'),
            tag = $('<div class="rc-giftag"><i class="fas fa-snowflake"></i></div>')
        img.attr({style: '', class: ''}).css({width: '100%', height: '100%'})
        box.css({width: w + 'px', height: h + 'px'})
        can.attr({width: w, height: h})
        tag.css('margin-top', (h / 2 - 40) + 'px')
        box.append(img.replaceWith(box), can, tag)
        can[0].getContext('2d').drawImage(elem, 0, 0, w, h)
        }
    $('[src*=".gif"]').each(function () {freeze(this)})
    $('body').on('lazyloaded', '[src*=".gif"]', event => {freeze(event.target)})
    })