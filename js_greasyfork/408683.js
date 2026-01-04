// ==UserScript==
// @name         super annoying chat tag
// @namespace    FileFace
// @version      2.6.9
// @description  eh
// @author       shtos
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408683/super%20annoying%20chat%20tag.user.js
// @updateURL https://update.greasyfork.org/scripts/408683/super%20annoying%20chat%20tag.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var TAGS = ['','Donor','Superdonor','Ultradonor','Contributor','Financier','Investor']
    var currentTag = ''
    const lol = () =>{
        if (window.var_username){
            console.log('started')
            document.getElementById('chat-area-input').addEventListener('keydown', (event) => {changeTag(event); window.chatInput(event)})
        }else{
            setTimeout(lol, 1000)
        }
    }
    lol()

    function changeTag(event){
        if (!event.key || event.key == 'Enter'){
            let index = Math.ceil(Math.random()*7)
            if (TAGS[index] == ''){
                window.setOrBuyChatTag(currentTag, 'UNSET')
            }else{
                window.setOrBuyChatTag(TAGS[index], 'SET')
            }
            currentTag = TAGS[index]
            /*
            TAGS.pop()
            TAGS.unshift(currentTag)*/
        }
    }
})();