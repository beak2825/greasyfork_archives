// ==UserScript==
// @name         Narou Simple Hotkey
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ncode.syosetu.com/*/*/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/418452/Narou%20Simple%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/418452/Narou%20Simple%20Hotkey.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here
    window.addEventListener( 'load', function() {
        let key = "novel_honbun"
        let elem = document.getElementsByTagName("body")[0]
        elem.setAttribute("tabindex", "-1")
        elem.click()
        elem.focus()
    })
    let story_move = function(n) {
        let patharr = location.pathname.split("/")
        if (patharr.length != 4) return
        if (!(patharr[2] % 1 == 0)) return
        let story_no = (patharr[2] - 0)
        let next_no = story_no + n
        if (next_no <= 0) return
        location.href = "/" + patharr[1] + "/" + next_no + "/"
    }
    let story_up = function() {
        let patharr = location.pathname.split("/")
        if (patharr.length != 4) return
        location.href = "/" + patharr[1] + "/"
    }
    document.addEventListener("keydown" , function(e) {
        // n
        if ( (!e.shiftKey) && e.keyCode == 78) {
            story_move(1)
            return
        }
        // p
        if ( (!e.shiftKey) && e.keyCode == 80) {
            story_move(-1)
            return
        }
        // u
        if ( (!e.shiftKey) && e.keyCode == 85) {
            story_up()
            return
        }
        // b
        if ((!e.shiftKey) && e.keyCode == 66) {
            let elems = document.getElementsByClassName("bookmark_now set_siori")
            if (elems.length > 0) {
                elems[0].click()
            }
        }
    })
})();
