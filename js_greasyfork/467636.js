// ==UserScript==
// @name         DEV grunkomatic
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  Hide posts below a threshold number of likes
// @author       crizzo
// @match        https://tattle.life/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tattle.life
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467636/DEV%20grunkomatic.user.js
// @updateURL https://update.greasyfork.org/scripts/467636/DEV%20grunkomatic.meta.js
// ==/UserScript==

var controlsGrunking, controlsNotGrunking, toHide=[]

const showAll = ()=>{
    Array.from(document.querySelectorAll('a.reactionsBar-link')).forEach(
        e=>{e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display=''}
    )
    controlsGrunking.style.display='none'
    controlsNotGrunking.style.display=''
}


(function() {
    let threshold = 30 // minimum likes to display a post
    let minPosts = 3 // minimum posts to show on a page
    let pagesCanRead = 15 // if this many pages no need to filter

    let hash = window.location.href.includes('#')

    let posts = Array.from(document.querySelectorAll('a.reactionsBar-link'))
    let threadIsReadable = Math.max(...Array.from(document.querySelectorAll('.pageNav-main .pageNav-page')).map(e=>+e.textContent).filter(Boolean)) <= pagesCanRead

    controlsGrunking = document.createElement('span'); controlsNotGrunking = document.createElement('span')

    let ident = document.createElement('span')
    ident.style='border-radius:.5em; background-color:#89e; background-image:linear-gradient(45deg,#89e 0%,#f8e 50%,#fc7 100%); padding:.5em; margin:.5em 0em; display:inline-block; font-family:monospace; font-weight:bold;'

    let title = document.querySelector('.p-body-header')

    let switchOn = document.createElement('a'), switchOff = document.createElement('a')
    switchOn.href=''; switchOff.href='#'
    switchOn.append('on'); switchOff.append('off')
    switchOff.onclick=showAll
    controlsGrunking.append(`🚀📚 grunkomatic™【🟢on│`,switchOff,`】`)

    if(threadIsReadable) {
        controlsGrunking.append(`showing all posts (≤${pagesCanRead} pages) 🚀📚`) // if under pagesCanRead pages, we can do this! let's read them all!
    } else {
        let withLikes = posts.map(
            e=>({
                el:e,
                likes:(
                    +e.textContent.match(/and (?<count>\d+) others$/)?.groups.count+3) // more than 3 likes - "a, b, c and N others"
                    ||(+e.textContent.match(/,| and /g)?.length+1 // 2 or 3 likes - "a and b" / "a, b and c"
                    ||+Boolean(e.textContent.length) // 0 or 1 likes - "a" or nada
                    )
            })
        ).sort(
            (a,b)=>b.likes-a.likes // sort the array by number of likes, most first. this doesn't affect the DOM, just used to decide which to hide
        )
        // console.table(withLikes)
        toHide = withLikes.filter(e=>e.likes<=threshold) // try all posts with >= threshold likes
        if((posts.length-toHide.length)<minPosts) { // if this isn't enough posts then top it up
            toHide = withLikes.slice(minPosts) // highest minPosts posts by likes
            controlsGrunking.append(`showing ${posts.length-toHide.length} top posts on page (not enough 👍≥${threshold})`)
        } else { // show all posts with >= threshold likes
            controlsGrunking.append(`showing ${posts.length-toHide.length}/${posts.length} posts with 👍≥${threshold} 🚀📚`)
        }
    }

    controlsNotGrunking.append(`🚀📚 grunkomatic™【`,switchOn,`│🔴off】showing all posts 🚀📚`)

    controlsGrunking.style.display=hash?'none':''
    controlsNotGrunking.style.display=hash?'':'none'

    ident.append(controlsGrunking,controlsNotGrunking)
    title.prepend(ident)

    if(!hash && toHide.length) {
        toHide.forEach(
            e=>{e.el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display='none'}
        )
    }
})();