// ==UserScript==
// @name         Reddit enchanced
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add shortcuts, hide after vote
// @author       You
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460195/Reddit%20enchanced.user.js
// @updateURL https://update.greasyfork.org/scripts/460195/Reddit%20enchanced.meta.js
// ==/UserScript==

let post = null, container = null
window.onload = (event) => {
    container = document.querySelector('#AppRouter-main-content > div > div > div > div[style="max-width:100%"] > div')
    document.addEventListener('keydown', pressShortcut)
    findPost()
}

async function pressShortcut(keyboardEvent){
    //console.log(keyboardEvent.code)
    const tag = keyboardEvent.target.tagName.toLowerCase()
	if(tag == 'input' || tag == 'textarea') return
    if(keyboardEvent.repeat) return
    if(!post){
        findPost()
        if(!post) return
    }

    let voteButton = null, link = null
    switch(keyboardEvent.code){
        case 'KeyW':
            voteButton = post.querySelector('button[aria-label="upvote"]')
            break
        case 'KeyS':
            voteButton = post.querySelector('button[aria-label="downvote"]')
            break
        case 'KeyD':
            hidePost()
            break
        case 'KeyE':
            link = post.querySelector('a[data-click-id="comments"]')
            break
        case 'KeyF':
            window.scroll(0, 2000)
            window.scroll(0, -2000)
            findPost()
            break
    }

    if(voteButton){
        findPost()
        voteButton.click()
        await sleep(100)
        hidePost()
    }
    else if(link){
        window.open(link, '_blank')
    }
}

function removeEmptyBlock(){
    const block = container.querySelector(':scope > div > div[style*="height"]')
    if(block && block.innerText.trim() == ''){
        block.remove()
        removeEmptyBlock()
    }
}

async function hidePost(){
    findPost()
    console.log(post)
    const moreButton = post.querySelector('button[aria-label="more options"]')
    if(moreButton){
        moreButton.click()
        const menuItems = Array.from(document.querySelectorAll('[role="menu"] [role="menuitem"]'))
        const hideButton = menuItems.find(menuItem => menuItem.innerText.toLowerCase() == 'hide')
        if(hideButton){
            hideButton.click()
            await sleep(100)
            //removeEmptyBlock()
            findPost()
            //await sleep(2000)
            //findPost()
        }
    }
}

function findPost(){
    if(!container) return
    post = container.querySelector('[data-testid="post-container"]')
    console.log(post)
    if(!post) return
    const textBlock = post.querySelector('[data-click-id="text"]')
    const mediaBlock = post.querySelector('[data-click-id="media"]')
    if(textBlock){
        textBlock.style.removeProperty('max-height')
        textBlock.style.cssText += '-webkit-mask-image: none;'
    }else if(mediaBlock){
        //if(mediaBlock.offsetWidth == 0 || mediaBlock.offsetHeight == 0) sleep(1000)
        const imageBlock = mediaBlock.querySelector('img')
        const playerBlock = mediaBlock.querySelector('shreddit-player')
        if(imageBlock){
            //console.log(imageBlock)
            //console.log(window.getComputedStyle(mediaBlock))
            imageBlock.style.cssText += 'max-height: 100%; max-width: 100%;'
            /*if(imageBlock.width > mediaBlock.offsetWidth){
                imageBlock.width = mediaBlock.offsetWidth
            }
            if(imageBlock.height > mediaBlock.offsetHeight){
                imageBlock.height = mediaBlock.offsetHeight
            }*/
            const seeFullButton = mediaBlock.querySelector('a > div.media-element > div:nth-child(2)')
            //console.log(seeFullButton.innerText.toLowerCase())
            if(seeFullButton && seeFullButton.innerText.toLowerCase() == 'see full image'){
                seeFullButton.remove()
            }
        }else if(playerBlock){
        }
    }
    const y = post.getBoundingClientRect().top + window.pageYOffset - 60
    window.scrollTo({top: y})
}

function sleep(ms){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}
