// ==UserScript==
// @namespace    http://tampermonkey.net/
// @name         7 Cups - Listener sound options
// @description  Listener sound options
// @locale       en
// @author       RarelyCharlie
// @website      http://www.7cups.com/@RarelyCharlie
// @license      Open Software License version 3.0
// @match        https://www.7cups.com/*
// @noframes
// @run-at       document-idle
// @grant        none
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/406921/7%20Cups%20-%20Listener%20sound%20options.user.js
// @updateURL https://update.greasyfork.org/scripts/406921/7%20Cups%20-%20Listener%20sound%20options.meta.js
// ==/UserScript==
{
    let opts = JSON.parse(localStorage.getItem('rc_soundoptions')) || {chaturl: '', itemurl: '', muteitem: false},
        persist = () => localStorage.setItem('rc_soundoptions', JSON.stringify(opts))

    if (location.pathname == '/listener/editAccount.php') { // Settings page...
        let c = $('input[name=alertInConv]'), q = c.is(':checked')
        c.parent().after(
            '<input id="rc_chatsoundurl" class="form-control" placeholder="Optional sound file URL" value="' + opts.chaturl + '"'
              + 'spellcheck="false" style="margin-bottom: 1em; color: ' + (q? 'inherit' : 'lightgray') + '"' + (q? '' : ' disabled') + '>'
            )
        c.on('change', function () {
            var q = $(this).is(':checked')
            $('#rc_chatsoundurl').prop('disabled', !q).css('color', q? 'inherit' : 'lightgray')
            })
        $('#rc_chatsoundurl').on('keyup', function () {
            opts.chaturl = $(this).val().trim()
            persist()
            })

        c = $('input[name=alertNewItem]'), q = c.is(':checked')
        c.parent().after(
            '<input id="rc_itemsoundurl" class="form-control" placeholder="Optional sound file URL" value="' + opts.itemurl + '"'
            + 'spellcheck="false" style="margin-bottom: 1em;"' + (q? '' : ' disabled') + '>'
            + '<label class="custom-control custom-checkbox">'
              + '<input class="custom-control-input" id="rc_itemsoundmute" type="checkbox" ' + (opts.muteitem? 'checked="checked"' : '') + '>'
              + '<span class="custom-control-indicator"></span>'
              + '<span class="custom-control-description">Mute general request alerts</span>'
              + '</label>'
            )
        c.on('change', function () {
            var q = $(this).is(':checked')
            $('#rc_itemsoundurl, #rc_itemsoundmute').prop('disabled', !q).css('color', q? 'inherit' : 'lightgray')
            })
        $('#rc_itemsoundurl').on('keyup', function () {
            opts.itemurl = $(this).val().trim()
            persist()
            })
        $('#rc_itemsoundmute').on('change', function () {
            opts.muteitem = $(this).is(':checked')
            persist()
            })
        }

    if (opts.muteitem) { // only play newItem if there's a personal message...
        let p = soundManager.play
        soundManager.play = async function (b, e) {
            var ok = true
            if (b == 'newItem') {
                await new Promise(i => setTimeout(i, 0))
                ok = document.getElementById('newListPersonalStatusButton')
                }
            if (ok) p.apply(soundManager, arguments)
            }
        }

    // set up custom sounds...
    if (opts.chaturl) soundManager.getSoundById('chatConnected').url = opts.chaturl
    if (opts.itemurl) soundManager.getSoundById('newItem').url = opts.itemurl
    }