// ==UserScript==
// @name         Brick Hill Avatar Preview
// @description  Check out you or others' avatars in 3d!
// @author       Noah Cool Boy
// @match        https://www.brick-hill.com/user/*
// @icon         https://www.google.com/s2/favicons?domain=brick-hill.com
// @grant        none
// @version 0.0.1.20211118185920
// @namespace https://greasyfork.org/users/725966
// @downloadURL https://update.greasyfork.org/scripts/435700/Brick%20Hill%20Avatar%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/435700/Brick%20Hill%20Avatar%20Preview.meta.js
// ==/UserScript==

function req(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function() {
            if (this.status == 200) {
                resolve(this.response);
            } else {
                reject(this.statusText);
            }
        };
        xhr.onerror = function() {
            reject(this.statusText);
        };
        xhr.send();
    })
}

async function loadAsset(assetId) {
    let data = await req(`https://api.brick-hill.com/v1/assets/getPoly/1/${assetId}`);
    data = JSON.parse(data.replace(/asset:\/\//g, ""))[0];
    return data;
}

async function loadAssets(avatarData) {
    window.ASSETDATA = {}
    let idsToLoad = Object.values(avatarData.items).flat().filter(v => v != 0);
    for (let i = 0; i < idsToLoad.length; i++) {
        window.ASSETDATA[idsToLoad[i]] = await loadAsset(idsToLoad[i]);
    }
}

setTimeout(async () => {
    let avatarData = await req("https://api.brick-hill.com/v1/games/retrieveAvatar?id=" + location.href.match(/\d+/)[0])
    avatarData = JSON.parse(avatarData);
    window.AVATARDATA = avatarData
    await loadAssets(avatarData);

    window.targetCanvas = document.createElement("canvas")
    window.targetCanvas.height = 350
    window.targetCanvas.width = 350
    let content = document.querySelector(".main-holder .col-6-12 .content")
    content.insertBefore(window.targetCanvas, content.querySelector(".user-description-box"))
    content.insertBefore(document.createElement("br"), window.targetCanvas)
    content.querySelector("img").remove()

    // Load the renderer
    var scriptElement = document.createElement( "script" );
    scriptElement.type = "module";
    scriptElement.src = "https://noah.ovh/files/CORS/BHAvPreview/avatarRenderer.js";
    document.body.appendChild( scriptElement );
}, 0);