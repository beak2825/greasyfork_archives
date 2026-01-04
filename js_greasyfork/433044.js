// ==UserScript==
// @name         OPS Request Filter
// @namespace    https://greasyfork.org/en/users/819542-drd33m
// @version      0.1.1
// @description  Filter users on request page
// @author       DrD33M
// @match        https://orpheus.network/requests.php*
// @icon         https://www.google.com/s2/favicons?domain=orpheus.network
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/433044/OPS%20Request%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/433044/OPS%20Request%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    showFilter()
    addMenu()
    // Your code here...
})();


function showFilter(){
    const blacklist = getBlackList()
    var table = document.getElementById("request_table")
    var users = table.querySelectorAll('[href*="user.php?id="]');

    // Filter user if id found in blacklist array
    for(const user of users){
        let userId = user.href.slice(36)
        if(blacklist.includes(userId)){
            user.parentNode.parentNode.remove()
        }
        addBlacklistButton(user.parentNode, userId)
    }
}

function addMenu(){
    var thin = document.getElementsByClassName("thin")[0].childNodes[3]
    var newA = document.createElement('a')
    var newText = document.createTextNode('Blacklist');

    // Add styling and event
    newA.addEventListener('click', openBlacklist, false)
    newA.classList.add("brackets")
    newText.style = "cursor: pointer;"

    // Add to dom
    newA.appendChild(newText);
    thin.appendChild(newA)
}

function openBlacklist(){
}

function addBlacklistButton(element, userId){
    var tag = document.createElement('a')
    tag.addEventListener('click', addToBlackList, false)
    tag.id = userId

    var text = document.createTextNode(' [X] ')
    tag.appendChild(text)
    tag.style = "cursor: pointer;"
    element.appendChild(tag)
}
function addToBlackList(element){
    var settings = getBlackList()
    settings.push(element.target.id)
    window.localStorage.requestFilterSettings = JSON.stringify(settings)
    alert(`User: ${element.target.id} added to blacklist. Please reload to update page`)
}

function removeFromBlacklist(userId){
    var settings = getBlackList()
    removeItemOnce(settings, userId)
    window.localStorage.requestFilterSettings = JSON.stringify(settings)
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function getBlackList()
{
    var settings = window.localStorage.requestFilterSettings;
    if(!settings)
    {
        settings = [];
    }
    else {
        settings = JSON.parse(settings);
    }
    return settings;
}
