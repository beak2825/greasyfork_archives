// ==UserScript==
// @name         Delete bumps - 2ch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Delete bump messages
// @author       You
// @match        https://2ch.hk/*/res/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://2ch.hk&size=64
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487870/Delete%20bumps%20-%202ch.user.js
// @updateURL https://update.greasyfork.org/scripts/487870/Delete%20bumps%20-%202ch.meta.js
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
