// ==UserScript==
// @name         Spotify - Random Buttons
// @namespace    spotify-random-buttons
// @version      0.2
// @description  Add missing randomize features to Spotify (only random artist for now, more to come later).
// @author       Mark McEver
// @match        https://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/463176/Spotify%20-%20Random%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/463176/Spotify%20-%20Random%20Buttons.meta.js
// ==/UserScript==

GM_registerMenuCommand('Random Followed Artist', () => {
    new class{
        constructor(){
            const variables = encodeURIComponent(JSON.stringify({"filters":["Artists"],"order":null,"textFilter":"","features":["LIKED_SONGS","YOUR_EPISODES"],"limit":50,"offset":0,"flatten":false,"expandedFolders":[],"folderUri":null,"includeFoldersWhenFlattening":true,"withCuration":false}))
            const extensions = encodeURIComponent(JSON.stringify({"persistedQuery":{"version":1,"sha256Hash":"0cc9ca58bd1dad0ce11712768bf4357ca8a9c6dab1dc0b43331fe526c47ff885"}}))

            fetch('https://api-partner.spotify.com/pathfinder/v1/query?operationName=libraryV3&variables=' + variables + '&extensions=' + extensions, {
                headers: {
                    'Authorization': 'Bearer ' + JSON.parse(document.querySelector('#session').textContent).accessToken
                }
            })
                .then(response => response.json())
                .then(data => {
                const artists = data.data.me.libraryV3.items
                const artist = artists[this.rand(0, artists.length-1)]
                const id = artist.item.data.uri.split(':')[2]
                location.href = '/artist/' + id
            })
        }

        rand(min, max){
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
    }
})
