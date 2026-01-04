// ==UserScript==
// @name         grunkomatic
// @namespace    http://tampermonkey.net/
// @version      0.25
// @description  Hide posts below a threshold number of likes
// @author       crizzo
// @match        https://tattle.life/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tattle.life
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467651/grunkomatic.user.js
// @updateURL https://update.greasyfork.org/scripts/467651/grunkomatic.meta.js
// ==/UserScript==

// const reactionsBarSelector = 'a.reactionsBar-link'
const reactionsBarSelector='.reactionsBar', postSelector = 'article', pageNavSelector = '.pageNav-main .pageNav-page', titleSelector = '.p-body-header' // these may change over time...
var controlsGrunking, controlsNotGrunking // DOM elements to show/hide with status and tool controls
const logos=['🚀📚',''], appNames=['grunkomatic™','grunkomatic']

const showHide = (el,shouldShow=true)=>{el.style.display=['none',''][+shouldShow];return el} // show or hide an element

const filterSwitch = (arr,arrIsToShow)=>{
    if(!arr.length) return false
    arr.forEach(
        e=>{showHide(e.el.closest(postSelector),arrIsToShow)} // show/hide each post
    )
    showHide(controlsGrunking,!arrIsToShow)
    showHide(controlsNotGrunking,arrIsToShow)
}

(function() { // on page ready
    let debug = false // debug mode
    let plainText = false // plain text mode
    let logo = logos[+plainText]
    let appName = appNames[+plainText]

    let threshold = 30 // minimum likes to display a post
    let minPosts = 3 // minimum posts to show on a page
    let pagesCanRead = 15 // if this many pages no need to filter

    let posts = Array.from(document.querySelectorAll(reactionsBarSelector))

    let hash = location.href.includes('#')
    let threadIsReadable = Math.max(...Array.from(document.querySelectorAll(pageNavSelector)).map(e=>+e.textContent).filter(Boolean)) <= pagesCanRead // true means there are few enough pages to read it all!!!!1

    controlsGrunking = document.createElement('span'); controlsNotGrunking = document.createElement('span') // create DOM elements for status/controls
    let ident = document.createElement('span') // create beautiful container for both status/controls, only one will be visible
    ident.style=plainText?'background-color:#ffe; color:#666; padding:.5em; margin:.5em 0em; display:inline-block;':'border-radius:.5em; background-color:#89e; background-image:linear-gradient(45deg,#89e 0%,#f8e 50%,#fc7 100%); padding:.5em; margin:.5em 0em; display:inline-block; font-family:monospace; font-weight:bold;' // beautiful

    let title = document.querySelector(titleSelector)

    let withLikes = posts.map(
        el=>{
            let txt = el.textContent.replace(/(Reactions:)?\n*/g,'');
            let likes = (
                +txt // not logged in - just the number of likes
                || +txt.match(/and (?<count>\d+) others$/)?.groups.count+3) // more than 3 likes - "a, b, c and N others"
                || (+txt.match(/,| and /g)?.length+1 // 2 or 3 likes - "a and b" / "a, b and c"
                || +Boolean(txt.length) // 0 or 1 likes - "a" or nada
            )
            return (debug?{el,txt,likes}:{el,likes})
        }
    ).sort(
        (a,b)=>b.likes-a.likes // sort the array by number of likes, most first. this doesn't affect the DOM, just used to decide which to hide
    )

    if(debug) console.table(withLikes)
    var toHide = withLikes.filter(e=>e.likes<=threshold) // try all posts with >= threshold likes
    let numberToShow = withLikes.length-toHide.length

    let switchOn = document.createElement('a'), switchOff = document.createElement('a')
    switchOn.href=['','#'][+threadIsReadable]; switchOff.href=['#',''][+threadIsReadable]
    switchOn.append(plainText?'switch on.':'on'); switchOff.append(plainText?'switch off.':'off')
    switchOff.onclick=()=>filterSwitch(withLikes,true)
    switchOn.onclick=()=>filterSwitch(toHide,false)
    controlsGrunking.append(plainText?`${appName} is on. `:`${logo} ${appName}【🟢on│`,switchOff,plainText?'':'】')

    if(numberToShow<minPosts) { // if this isn't enough posts then top it up
        toHide = withLikes.slice(minPosts) // highest minPosts posts by likes
        numberToShow = withLikes.length - toHide.length
        controlsGrunking.append(`${plainText?' ':''}showing ${numberToShow} top post${numberToShow===1?'':'s'} on page (not enough ${plainText?`likes above `:`👍≥`}${threshold})`)
    } else { // show all posts with >= threshold likes
        controlsGrunking.append(`${plainText?' ':''}showing ${numberToShow}/${posts.length} posts with ${plainText?`likes above `:`👍≥`}${threshold} ${logo}`)
    }

    controlsNotGrunking.append(plainText?`${appName} is off. `:`${logo} ${appName}【`,switchOn,plainText?` showing all posts.`:`│🔴off】showing all posts`)
    if(threadIsReadable) {
        controlsNotGrunking.append(` (${plainText?`no more than `:`≤`}${pagesCanRead} pages) ${logo}`) // if under pagesCanRead pages, we can do this! let's read them all!
    } else {
        controlsNotGrunking.append(`${logo}`)
    }

    ident.append(
        showHide(controlsGrunking,hash!==threadIsReadable),
        showHide(controlsNotGrunking,hash===threadIsReadable)
    )
    title.prepend(ident)

    if(hash===threadIsReadable) {
        filterSwitch(toHide,false)
    }
})();