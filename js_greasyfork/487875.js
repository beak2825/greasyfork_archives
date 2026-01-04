// ==UserScript==
// @name         Rutracker autosort by downloads, seeds
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Button for sorting by seeds and downloads on Rutracker
// @author       You
// @match        https://rutracker.org/forum/viewforum.php?f=*
// @match        https://pornolab.net/forum/viewforum.php?f=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rutracker.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487875/Rutracker%20autosort%20by%20downloads%2C%20seeds.user.js
// @updateURL https://update.greasyfork.org/scripts/487875/Rutracker%20autosort%20by%20downloads%2C%20seeds.meta.js
// ==/UserScript==


let sortButton = document.createElement('button')
sortButton.style = "position:fixed; top:479px; left:1028px; font-size: 14px; background-color: blue; padding: 4px;"
sortButton.class = "sort-button"
sortButton.innerHTML = "Sort DL"
document.body.appendChild(sortButton)
sortButton.onclick = sortByDonwloads

sortButton = document.createElement('button')
sortButton.style = "position:fixed; top:479px; left:1086px; font-size: 14px; background-color: blue; padding: 4px;"
sortButton.class = "sort-button"
sortButton.innerHTML = "Sort S"
document.body.appendChild(sortButton)
sortButton.onclick = sortBySeeds

function sortBySeeds(){
    const topics = Array.from(document.querySelectorAll('tr[id*="tr-"]'))
    const newTopics = Array.from(topics)
    for(let i = 0; i < newTopics.length; i++){
        const peersBlock = newTopics[i].querySelector('.seedmed b')
        if(peersBlock){
            newTopics[i] = [newTopics[i].innerHTML, +peersBlock.innerText.replace(/\D/g, "")]
        }else{
            newTopics[i] = 0
        }
    }
    newTopics.sort(compare)
    //console.log(newTopics)
    for(let i = 0; i < topics.length; i++){
        topics[i].innerHTML = newTopics[i][0]
    }
}

function sortByDonwloads(){
    const topics = Array.from(document.querySelectorAll('tr[id*="tr-"]'))
    const newTopics = Array.from(topics)
    for(let i = 0; i < newTopics.length; i++){
        const downloadsBlock = newTopics[i].querySelector('.tCenter.small.nowrap .med b')
        if(downloadsBlock){
            newTopics[i] = [newTopics[i].innerHTML, +downloadsBlock.innerText.replace(/\D/g, "")]
        }else{
            newTopics[i] = 0
        }
    }
    newTopics.sort(compare)
    for(let i = 0; i < topics.length; i++){
        topics[i].innerHTML = newTopics[i][0]
    }
}

function compare(topic1, topic2){
    if(topic1[1] > topic2[1]){
        return -1
    }else if(topic1[1] < topic2[1]){
        return 1
    }else{
        return 0
    }
}