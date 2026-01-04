// ==UserScript==
// @name         Auto Refresher
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Automatically refresh websites with a config!
// @author       DeltAndy
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424932/Auto%20Refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/424932/Auto%20Refresher.meta.js
// ==/UserScript==


// ———————————————————————————————————— Config —————————————————————————————————————————


// The key is the website URL (with RegExp), and the value is the time in milliseconds
const reloadPages = {
    ".*://www.google.com/": 5000, // This will refresh google.com every 5000 ms (5s)
}


// —————————————————————————————— Do Not Modify Below ——————————————————————————————————


function regexMatches(arr, regex) {
    for (const i of arr) {
        var regexp = new RegExp(regex)
        if (i.replace(regexp, '') === '') return true
    }
    return false
}

function arrayMatches(regArr, str) {
    for (const i of regArr) {
        var regexp = new RegExp(i)
        if (str.replace(regexp, '') === '') return true
    }
    return false
}
function regexIndexOf(regArr, str) {
    var i = 0
    for (const reg of regArr) {
        const regex = new RegExp(reg)
        if (str.replace(regex, '') === '') return i
        i++
    }
    return -1
}


var urls = []
for(var key in reloadPages) urls.push(key)

const websiteRegex = new RegExp(reloadPages[window.location.href])


if (arrayMatches(urls, window.location.href)) {
    console.log(`Reloading page in ${Object.values(reloadPages)[regexIndexOf(urls, window.location.href)]} ms`)
    setTimeout(() => {
        window.location = window.location
    }, Object.values(reloadPages)[regexIndexOf(urls, window.location.href)]);
}
