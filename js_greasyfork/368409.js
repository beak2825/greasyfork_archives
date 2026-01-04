// ==UserScript==
// @name Pennergame-Bandenchat
// @description Provides a shoutbox on every pennergame site.
// @namespace pg-chat.user.js
// @version  0.9.4
// @include https://www.pennergame.de/*
// @include http://www.pennergame.de/*
// @include https://atlantis.pennergame.de/*
// @include http://atlantis.pennergame.de/*
// @include https://koeln.pennergame.de/*
// @include http://koeln.pennergame.de/*
// @include https://sylt.pennergame.de/*
// @include http://sylt.pennergame.de/*
// @include https://malle.pennergame.de/*
// @include http://malle.pennergame.de/*
// @downloadURL https://update.greasyfork.org/scripts/368409/Pennergame-Bandenchat.user.js
// @updateURL https://update.greasyfork.org/scripts/368409/Pennergame-Bandenchat.meta.js
// ==/UserScript==
/* jslint asi: true, esversion: 6 */
document.addEventListener('DOMContentLoaded',
    (function() {
        var $profileContainer = document.querySelector('#my-profile-new')
        if (!$profileContainer) {
            console.log('Nicht angemeldet.');
            cnsole.log()
            return
        }
        if (screen.width < 1680) {
            var center = document.querySelector('#center')
            if (!center) {
                console.log('Bandenchat-Userscript wurde deaktiviert, weil der Bildschirm nicht groß genug ist.')
                return
            }
            else {
                center.className = ''
            }
        }
        var body = document.querySelector('#center')
        if (!body) {
            return
        }
        var div = document.createElement('div')
        var txt = document.createTextNode('Lade Bandenchat...')
        div.appendChild(txt)
        body.appendChild(div)
        div.id = 'pg-chat'
        div.style.width = '20%'
        div.style.maxWidth = '20%'
        div.style.overflow = 'hidden'
        div.style.position = 'absolute'
        div.style.right = '0'
        div.style.display = 'inline'
        div.style.color = 'white'
        div.style.fontSize = '12px'
        div.style.textAlign = 'left'

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                div.innerHTML = this.responseText
                var pagebar = div.querySelector('.pagebar')
                pagebar.remove()
                var textArea = div.querySelector('#f_text')
                var taParent = textArea.parentNode.parentNode.style.width = ''
                textArea.parentNode.parentNode.style.padding = '0'
                textArea.style.maxWidth = '90%'

                var images = document.querySelectorAll('#pg-chat img')
                let i = images.length
                while (i--) {
                    images[i-1].style.maxWidth = '100%'
                }
                console.log(images);
            }
        };
        xhttp.open("GET", 'https://' + window.location.hostname + '/gang/shoutbox_ajax/?' + Date.now(), true);
        xhttp.send();
    })()
)
