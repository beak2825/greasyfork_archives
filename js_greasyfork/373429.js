// ==UserScript==
// @name        LINE Append String
// @namespace   lineappendstring
// @description Automatic generation of append string for BetterDiscord plugin
// @include     https://store.line.me/stickershop/product/*
// @include     https://store.line.me/emojishop/product/*
// @version     0.6.2
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/373429/LINE%20Append%20String.user.js
// @updateURL https://update.greasyfork.org/scripts/373429/LINE%20Append%20String.meta.js
// ==/UserScript==

(function() {
    'use strict'

    const title = document.querySelector('.mdCMN38Item01Ttl').innerHTML
    const firstItem = document.querySelector('.mdCMN09Image').style['background-image']
    const isEmojisPack = firstItem.includes('sticonshop')

    let id
    if (isEmojisPack) {
        id = firstItem.match(/sticon\/([a-z0-9]+)/)[1]
    } else {
        id = firstItem.match(/sticker\/(\d+)/)[1]
    }

    const length = document.querySelectorAll('.mdCMN09Li').length.toString()
    let animated
    let appendString
    if (isEmojisPack) {
        appendString = 'magane.appendEmojisPack(\'' + title + '\', \'' + id + '\', ' + length + ')'
    } else {
        animated = Boolean(document.querySelector('.MdIcoPlay_b') || document.querySelector('.MdIcoAni_b'))
        appendString = 'magane.appendPack(\'' + title + '\', ' + id + ', ' + length + ', ' + (animated ? 1 : 0) + ')'
    }

    const href = window.location.pathname.split('/')
    const locale = href[href.length - 1]

    const strings = {
        'title' : 'Title',
        'stickers_count': 'Stickers count',
        'emojis_count': 'Emojis count',
        'id': 'ID',
        'first_id': 'First ID',
        'animated': 'Animated',
        'append': 'Console command'
    }

    const inlineCSS = `background: #2e3136;
padding: 1em;
-webkit-border-radius: 3px;
border-radius: 3px;
font-family: monospace;
line-height: 16px;
color: rgba(255,255,255,.7);
margin: 10px 0;`

    const idString = isEmojisPack ? strings.id : strings.first_id

    let infoString = `${strings.title}: ${title}\n${idString}: ${id}`
    if (isEmojisPack) {
        infoString += `\n${strings.emojis_count}: ${length}`
    } else {
        infoString += `\n${strings.stickers_count}: ${length}\n${strings.animated}: ${String(animated)}`
    }
    infoString += `\n\n${strings.append}:\n${appendString}`

    console.log(infoString)
    document.querySelector('.mdCMN38Item01Txt').innerHTML += `<p style='${inlineCSS.replace(/\n/g, ' ')}'>${infoString.replace(/\n/g, '<br>')}</p>`
})();