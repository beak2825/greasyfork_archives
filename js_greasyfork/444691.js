// ==UserScript==
// @name         Evernote, more like, Everubbish
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  Webdesigners can go fuck themselves with their retarded design standards
// @author       Heavy Weapons Guy
// @match        https://www.evernote.com/shard/*
// @icon         https://mrkleiner.github.io/source_tricks/assets/pink_panther.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444691/Evernote%2C%20more%20like%2C%20Everubbish.user.js
// @updateURL https://update.greasyfork.org/scripts/444691/Evernote%2C%20more%20like%2C%20Everubbish.meta.js
// ==/UserScript==

function fuck_evernote(ur)
{
    document.querySelector('#container').innerHTML = '';
    fetch(ur, {
		'headers': {
			'accept': '*/*',
			'cache-control': 'no-cache',
			'pragma': 'no-cache'
		},
		'referrerPolicy': 'strict-origin-when-cross-origin',
		'body': null,
		'method': 'GET',
		'mode': 'cors',
		'credentials': 'omit'
    })
        .then(function(response) {
        console.log(response.status);
        response.json().then(function(data) {
            console.log(data)
            var appender = document.createElement('div');
            appender.id = 'fuck_web_designers';
            appender.innerHTML = data['content'];
            document.querySelector('#container').append(appender);
            loadimgs(data);
            var stl = document.createElement('style');
            stl.innerHTML = `
                #fuck_web_designers
                {
                  width: 70vw;
                  margin-left: 100px;

                }

                #container
                {
                  overflow-x: hidden;
                }

                #fuck_web_designers table
                {
                  width: auto !important;
                }
            `;
            document.body.append(stl);
        });
    });
}

// Select the node that will be observed for mutations
const targetNode = document.querySelector('body');

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    if(document.querySelector('#app-root #container') != null){
        // get current location and then get the note ID
        var page_urlParams = new URLSearchParams(window.location.search);
        // the only paremeter we need is the note id
        window.note_guid = page_urlParams.get('noteGuid');
        // some sort of key??
        window.note_key = page_urlParams.get('noteKey');
        // compose
        window.split_current_loc = window.location.pathname.split('/');
        window.proper_path = (split_current_loc[1] + '/' + split_current_loc[2] + '/sh')
        fuck_evernote(window.location.origin + '/' + proper_path + '/' + note_guid + '/' + note_key + '?json=1&rdata=0')
        // stop observer
        observer.disconnect();

    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);


// response json as an input
function loadimgs(dt)
{
    for (var ld_img of dt['resources']){
        var img_ref = toHexString(Uint8ArrayFromBase64(ld_img['data']['bodyHashBase64']));
        var enmedia = document.querySelector('en-media[hash="' + img_ref + '"]');
        let img = document.createElement('img');
        img.src = window.location.origin + '/' + proper_path + '/' + note_guid + '/' + note_key + '/' + 'res/' + ld_img['guid'];
        enmedia.prepend(img)
    }
    /*
    document.querySelectorAll('en-media').forEach(function(userItem) {
        let img = document.createElement("img");
        img.src = "https://picsum.photos/200/301";
        userItem.append(img)
    });
    */

}

function Uint8ArrayFromBase64(base64)
{
    return Uint8Array.from(window.atob(base64), (v) => v.charCodeAt(0));
}

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}






