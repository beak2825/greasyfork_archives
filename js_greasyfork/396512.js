// ==UserScript==
// @namespace    http://tampermonkey.net/
// @name         7 Cups - Chat smiley menu
// @description  Smiley menu in chats
// @locale       en
// @author       RarelyCharlie
// @website      http://www.7cups.com/@RarelyCharlie
// @license      Open Software License version 3.0
// @match        https://www.7cups.com/listener/connect/conversation.php?c=*
// @match        https://www.7cups.com/member/connect/conversation.php?c=*
// @noframes
// @run-at       document-idle
// @grant        none
// @version      0.6
// @downloadURL https://update.greasyfork.org/scripts/396512/7%20Cups%20-%20Chat%20smiley%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/396512/7%20Cups%20-%20Chat%20smiley%20menu.meta.js
// ==/UserScript==
$('head').append(
    '<style id="rc-smilestyle">'
    + '#chatForm {position: relative;}'
    + '#rc-smile {width: 1em; height: 1em; border-radius: 50%; background: #fe4; border: 1px outset #ccc; cursor: pointer;'
      + 'box-shadow: 0 0 2px #000; position: absolute; top: 12px; left: 12px;}'
    + '#rc-smile:hover, #rc-smile.down {background: #fc2;}'
    + '#rc-smile.down {border-style: inset;}'
    + '#rc-smilemenu {width: 104px; height: 64px; background: #f4f4f4; border-radius: .5ex; position: absolute; top: -64px; left: 1em;'
      + 'padding: 2px; z-index: 1; box-shadow: 2px 2px 4px #aaa; cursor: pointer; display: none;}'
//  + '#rc-smilemenu img {width: 16px; height: 16px; margin: 2px; outline: solid 0 #49f; outline-offset: 2px;}'
//  + '#rc-smilemenu img.selected {outline-width: 1px;}'
    + '#rc-smilemenu .rc-emoji {display: inline-block; width: 16px; height: 16px; margin: 2px; outline: solid 0 #49f; outline-offset: 2px;}'
    + '#rc-smilemenu .rc-emoji.selected {outline-width: 1px;}'
    + '#rc-smiletag {padding: 4px; background: #fff; opacity: .8; box-shadow: 0 0 6px #999; position: absolute; display: none;}'
    + '</style>'
    )
$('#chatForm').prepend(
    '<div id="rc-smile" title="Smiley faces    Ctrl+I"></div>'
    + '<div id="rc-smilemenu" data-selected="0"><div id="rc-smiletag"></div></div>'
    )
$('#rc-smilemenu').append(
    ['Confused o.O 🤔', 'Crying :\'( 😢', 'Evil 3:) 😈', 'Gasp :O 😮', 'Glasses 8) 🤓', 'Grin :D 😀', 'Heart <3 ❤️', 'Kiss :* 💋',
        'Sad :( ☹️', 'Smile :) 😊', 'Sour >:( 😖', 'Sunglasses_small 8| 😎', 'Tongue :P 😛', 'Unsure :\\ 😕', 'Wink ;) 😉']
    .reduce((html, s) => {
        s = s.split(' ')
        return html + '<span class="rc-emoji" ' // was '<img src="https://d37v7cqg82mgxu.cloudfront.net/img/emoticons/' + s[0].toLowerCase() + '.png" '
          + 'data-title="' + s[0].split('_')[0] + '" '
          + 'data-key="' + s[2] + '">' + s[2] + '</span>' // was s[1]
        }, '')
    )
$('#rc-smilemenu')[0].rc_show = (show, key) => {
    var m = $('#rc-smilemenu')
    if (typeof(show) != 'boolean') show = m.is(':hidden')
    if (show) {
        m.show()
        m[0].rc_keymode = key
        $('#rc-smile').addClass('down')
        if (key) m[0].rc_select(null), $('#rc-smiletag').show()
        }
    else {
        m.hide()
        $('#rc-smile').removeClass('down')
        $('img.selected', m).removeClass('selected')
        $('#rc-smiletag').hide()
        }
    }
$('#rc-smilemenu')[0].rc_tag = (img) => {
    if (img) {
        var p = img.position()
        $('#rc-smiletag')
            .text(img.attr('data-title'))
            .css({'top': (p.top - 30) + 'px', 'left': (p.left + 20) + 'px'})
            .show()
        }
    else $('#rc-smiletag').hide()
    }
$('#rc-smilemenu')[0].rc_select = (n) => {
    if (typeof(n) == 'number') $('#rc-smilemenu').attr('data-selected', n)
    else n = parseInt($('#rc-smilemenu').attr('data-selected'))
    var s = $('#rc-smilemenu img').eq(n)
    s.addClass('selected')
    $('#rc-smilemenu')[0].rc_tag(s)
    }
$('#rc-smile').click(function () {
    $('#rc-smilemenu')[0].rc_show(null)
    })
$('#rc-smilemenu').on('mouseenter', '.rc-emoji', function () {
    var m = $('#rc-smilemenu')[0]
    if (m.rc_keymode) return
    m.rc_tag($(this))
    })
$('#rc-smilemenu').on('mouseout', '.rc-emoji', function () {
    var m = $('#rc-smilemenu')[0]
    if (m.rc_keymode) return
    m.rc_tag(null)
    })
$('#rc-smilemenu').on('click', '.rc-emoji', function () {
    var c = $('#Comment')[0],
        v = c.value,
        p = c.selectionStart,
        k = $(this).attr('data-key')
    if (p > 0 && v.charAt(p - 1) != ' ') k = ' ' + k
    if (v.charAt(c.selectionEnd) != ' ') k += ' '
    c.setRangeText(k)
    c.selectionStart += k.length
    $('#rc-smilemenu')[0].rc_show(false)
    c.focus()
    })
$('#Comment').click(function () {
    $('#rc-smilemenu')[0].rc_show(false)
    })
$('#Comment').keydown(function () {
    if ((event.ctrlKey || event.metaKey ) && event.key == 'i') {
        $('#rc-smilemenu')[0].rc_show(null, true)
        event.stopPropagation(), event.preventDefault()
        return
        }
    if ($('#rc-smilemenu').is(':hidden')) return
    var k = event.key,
        move = {
            ArrowLeft: (n => n % 5 == 0? n + 4 : n - 1),
            ArrowRight: (n => n % 5 == 4? n - 4 : n + 1),
            ArrowUp: (n => (n -= 5) < 0? n += 15 : n),
            ArrowDown: (n => (n += 5) > 14? n -= 15 : n),
            Enter: (n => (s.click(), -1)),
            Escape: (n => ($('#rc-smilemenu')[0].rc_show(false), -1))
            },
        s = $('#rc-smilemenu img.selected'),
        n = $('#rc-smilemenu img').index(s)
    if (['Spacebar', ' '].includes(k)) k = 'Enter'
    if (s.length && k in move) {
        s.removeClass('selected')
        n = move[k](n)
        if (n >= 0) $('#rc-smilemenu')[0].rc_select(n)
        event.stopPropagation(), event.preventDefault()
        }
    else $('#rc-smilemenu')[0].rc_show(false)
    })
{
    let s = window.sendMessage
    window.sendMessage = function () {
        if ($('#rc-smilemenu').is(':hidden')) return s.apply(window, arguments)
        }
    }