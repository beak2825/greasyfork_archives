// ==UserScript==
// @name         MM9842 enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  MM9842 enhancer...
// @author       HappyTreeFriends
// @namespace    https://greasyfork.org/users/317047
// @match        https://mm9842.com/f*
// @match        https://www.watchjavnow.xyz/f*
// @icon         https://www.google.com/s2/favicons?domain=mm9842.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/434764/MM9842%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/434764/MM9842%20enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const element = document.querySelector('#downloads');
    const buttonDiv = document.createElement("div");
    makeCopyBtn(document.querySelector('h1.title'));
    GM_xmlhttpRequest({
        method: "POST",
        url: 'https://'+window.location.host+'/api/source/'+window.location.href.split('/').slice(-1)[0],
        onload: function(response) {
            const result = JSON.parse(response.responseText);
            const items = result.data;
            if(items != null){
                const buttonDiv = document.createElement("div");
                items.forEach(item => {
                    (async() => {
                        makeBtn(buttonDiv, item.label, item.file);
                        //makeBtn(buttonDiv, item.label, await getRedirect(item.file));
                    })()

                })
                element.appendChild(buttonDiv);
            }
        }
    });
})();


function getRedirect(link) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: link,
            method: "HEAD",
            onload: function(response) {
                //console.log(response.finalUrl);
                resolve(response.finalUrl);
            },
            onerror: reject,
            ontimeout: reject,
        });
    });
}

var copyToClipboard = function(secretInfo) {
    const tempInput = document.createElement('INPUT');
    document.body.appendChild(tempInput);
    tempInput.setAttribute('value', secretInfo)
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}

function makeBtn(element, text, url){
    const button = document.createElement("button");
    button.innerHTML = text;
    button.onclick = function(){ copyToClipboard(url.trim() )} ;
    element.appendChild(button);
}

function makeCopyBtn(element1, element2 = null){
    let title = element1.innerText;
    if(element2) title = title + " " + element2.innerText;
    const button = document.createElement("button");
    button.innerHTML = 'Copy';
    button.onclick = function(){ copyToClipboard(title.trim() )} ;
    if(element2){
        element2.appendChild(button);
    }else{
        element1.appendChild(button);
    }
}
