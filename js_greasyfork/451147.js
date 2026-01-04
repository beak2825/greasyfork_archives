// ==UserScript==
// @name         JPS Random Torrent
// @namespace    eu.jpopsuki.random
// @version      0.3
// @description  Adds random torrent url to the user info bar
// @match        *://jpopsuki.eu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpopsuki.eu
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451147/JPS%20Random%20Torrent.user.js
// @updateURL https://update.greasyfork.org/scripts/451147/JPS%20Random%20Torrent.meta.js
// ==/UserScript==

// localStorage to save/get latest known ID and epoch time
function getItem(id) {

    let item = isSaved(id);
    let storage = window.localStorage

    if (item == null) {
        return null
    } else {
        return item
    }

}

function isSaved(id) {
    let storage = window.localStorage
    return storage.getItem(id)
}

function saveItem(id, value) {
    let storage = window.localStorage
    return storage.setItem(id, value ? value : 0)
}

// if torrent doesn't not exists it will redirect to the main page
if(window.location.toString().includes('torrents.php')){
    if (document.body.innerHTML.match(/database\ error/gi)){
        window.location.href = "/"
    }
}

(function(){
    'use strict';
    // Adds container to the userinfo for the random url
    document.getElementById('userinfo_minor').innerHTML += '<li class="randomBtn"></li>';

    // function to make xmlHttpRequest syncronous with await returning a promise
    function gmReq(args) {
            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest(
                    Object.assign({
                        method: 'GET',
                    }, args.url ? args : { url: args }, {
                        onload: e => {

                            let res = {
                                response: e.response
                            };
                            res.status = e.status;
                            console.log(e)
                            return resolve(res)
                        },
                        onerror: reject,
                        ontimeout: reject
                    })
                );
            });
        }

    async function getLatestID(){

        let currentTime = new Date().getTime()
        let lastCurrentTime = getItem('jpsLastCheck')

        if(lastCurrentTime){
            // check again latest ID if there's an hour(3600000ms) of diference between currentTime and lastCurrentTime
            if( (currentTime - lastCurrentTime) >= 3600000){
                console.log('x time has transcurred since last check')
                let latestIDRequest = await gmReq({url: "/torrents.php"})
                if (latestIDRequest.status == 200){
                    saveItem('jpsLastCheck', currentTime)
                    saveItem('jpsLatestID', latestIDRequest.response.match(/torrents.php\?id=([0-9])+/gi)[0].match(/[0-9]+/gi)[0])
                    return getItem('jpsLatestID')
                }else{
                    saveItem('jpsLastCheck', currentTime)
                    saveItem('jpsLatestID', 357423)
                    return getItem('jpsLatestID')
                }
            }else{
                return getItem('jpsLatestID')
            }
        }else{
            saveItem('jpsLastCheck', currentTime)
            let latestIDRequest = await gmReq({url: "/torrents.php"})
            if (latestIDRequest.status == 200){
                let latestID = latestIDRequest.response.match(/torrents.php\?id=([0-9])+/gi)[0].match(/[0-9]+/gi)[0]
                saveItem('jpsLatestID', latestID)
                return latestID
            }else{
                saveItem('jpsLatestID', 357423)
                return 357423
            }
        }
    }

    async function addRandomURL(){
        let menuBar = document.getElementById('userinfo_minor')
        let btnContainer = menuBar.querySelector('.randomBtn')

        btnContainer.innerHTML = '<a href="/torrents.php?id=' + Math.floor(Math.random() * await getLatestID())+ '">Random</a>';
    }
    //Start script
    addRandomURL()

})()