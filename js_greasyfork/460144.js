// ==UserScript==
// @name         Delete bumps - 2ch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Delete bump messages
// @author       You
// @match        https://2ch.hk/*/res/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2ch.hk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460144/Delete%20bumps%20-%202ch.user.js
// @updateURL https://update.greasyfork.org/scripts/460144/Delete%20bumps%20-%202ch.meta.js
// ==/UserScript==

window.addEventListener('scroll', autoDelete)
setTimeout(autoDelete, 2000)

const container = document.querySelector("main.cntnt__main")

function autoDelete(){
    const post = container.querySelector(".post.post_type_reply:not(.bump-checked)")
    if(post){
        const image = post.querySelector(".post__image")
        if(image){
            post.classList.add("bump-checked")
        }else{
            const postMessage = post.querySelector(".post__message").innerText.toLowerCase().replace(/[^a-z\u0430-\u044F]/g,'')
            if(postMessage != 'bump' &&
              postMessage != 'бамп'){
                post.classList.add("bump-checked")
            }else{
                post.remove()
                autoDelete()
            }
        }
    }
}
