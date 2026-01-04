// ==UserScript==
// @name         Show PW Everywhere
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  show password value everywhere
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392277/Show%20PW%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/392277/Show%20PW%20Everywhere.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const chars = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*()_+{}|:"<>?,./;'[]\=-\`"`
    let has_started_typing = false
    const pw = document.querySelector('input[type="password"]')
    if(!pw){
        return false
    }
    const pw_show = document.createElement('div')
    pw_show.innerText = 'hide'
    //pw.insertAdjacentElement('afterend', pw_show)
    document.body.insertAdjacentElement('beforeend', pw_show)
    pw_show.classList.add('pw_show')
    var position = pw.getBoundingClientRect();
    console.log(position.left, position.bottom)
    const styles = {
                 position: 'absolute',
                'z-index': 1000,
                 background: 'rgb(234, 234, 234)',
                 padding: '2px 10px',
                 color: '#828282',
                 cursor: 'pointer',
                 left: `${position.left}px`,
                 top: `${position.bottom}px`
               }
    Object.assign(pw_show.style, styles)

    pw.addEventListener("keyup", (e) => {
        if(e instanceof KeyboardEvent && pw_show.dataset.show !== "false" && pw.value !== ''){
            if(chars.contains(e.key)){
            has_started_typing = true
            }
            if(has_started_typing){
                pw_show.innerText = pw.value
            }
        }
    }, true)
    pw_show.onclick = (e) => {
        pw_show.style.display = 'none'
        pw_show.dataset.show = false
    }
})();