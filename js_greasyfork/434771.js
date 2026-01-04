// ==UserScript==
// @name         Supjav enhancer
// @version      1.0
// @description  Supjav enhancer...
// @author       HappyTreeFriends
// @namespace    https://greasyfork.org/users/317047
// @match        https://supjav.com/*.html
// @icon         https://www.google.com/s2/favicons?domain=supjav.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/434771/Supjav%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/434771/Supjav%20enhancer.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const element = document.querySelector('.archive-title h1');
    const title = element.innerText;
    const button = document.createElement("button");
    button.innerHTML = 'Copy';
    button.onclick = function() {
        copyToClipboard(getFinalTitle(title))
    };
    element.prepend(button);

    document.querySelectorAll('.btnst .btn-server').forEach(item => {
        const link = atob(item.dataset.link);
        if (link.includes('streamtape')) {
            proceed_streamtape(link);
        } else if (link.includes('dood')) {
            //proceed_dood(link);
        }
    });
})();

function proceed_streamtape(link) {
    //console.log(link);
    let dom = 'Empty dom';
    const getStreamlink = new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://supjav.com/',
            },
            url: link,
            onload: function(response) {
                //console.log(response.response);
                if (response.response != '') dom = new DOMParser().parseFromString(response.response, 'text/html');
                //console.log(dom);
                dom.querySelectorAll("script").forEach(script => {
                    if (script.innerHTML.includes('ideoolink')) {
                        //console.log(script.innerHTML);
                        if(script.innerHTML.match(/id=\S+token=\w+/) != null){
                            resolve('https://streamtape.com/get_video?' + script.innerHTML.match(/id=\S+token=\w+/)[0]);
                        } else {
                            resolve(script.innerHTML.match(/document.+ideoolink.+\/\/.+com(.+)'/)[1].replace(/\".+xnftb/, '').replace(/get.{0,10}=/,'https://streamtape.com/get_video?id='));
                        }
                    }
                });
            },
            onerror: reject,
            ontimeout: reject,
        });
    });

    (async () => {
        const element = document.querySelector('.downs');
        const buttonDiv = document.createElement("div");
        const streamlink = await getStreamlink;
        console.log(streamlink);
        makeBtn(buttonDiv, 'Download streamtape', await getRedirect(streamlink));
        //makeBtn(buttonDiv, 'Download streamtape', item.file);
        element.appendChild(buttonDiv);
    })()
}

function proceed_dood(link) {
    //console.log(link);
    let dom = 'Empty dom';
    let finallink = 'Empty finallink';

    GM_xmlhttpRequest({
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': 'https://supjav.com/',
        },
        url: link,
        onload: function(response) {
            finallink = response.finalUrl;
            GM_xmlhttpRequest({
                method: "GET",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': 'https://supjav.com/',
                },
                url: finallink,
                onload: function(response) {
                    let passlink = 'Empty passlink';
                    //console.log(response.response);
                    if (response.response != '') dom = new DOMParser().parseFromString(response.response, 'text/html');
                    dom.querySelectorAll("script").forEach(script => {
                        if (script.innerHTML.includes('pass_md5')) {
                            passlink = 'https://dood.ws' + script.innerHTML.match(/\/pass_md5\/\S+\w/)[0];
                        }
                    });
                    //console.log(passlink);
                    GM_xmlhttpRequest({
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Referer': 'https://dood.ws/',
                        },
                        url: passlink,
                        onload: function(response) {
                            //console.log(response.response);
                            const streamlink = response.responseText + '?token=1';
                            //console.log(streamlink);
                            const element = document.querySelector('.downs');
                            const buttonDiv = document.createElement("div");
                            makeBtn(buttonDiv, 'Download dood', streamlink);
                            element.appendChild(buttonDiv);
                        }
                    });
                }
            });
        }
    });


}

function getFinalTitle(text){
    const reg1 = /\+\+\+ (\[HD\]|)/g;
    const reg2 = /[\<\>\:\"\/\\\|\?\*]/g;
    return text.replace(reg1, "").trim();
}

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

function makeBtn(element, text, url) {
    const button = document.createElement("button");
    button.innerHTML = text;
    button.onclick = function() {
        copyToClipboard(url.trim())
    };
    element.appendChild(button);
}

function makeCopyBtn(element1, element2 = null) {
    let title = element1.innerText;
    if (element2) title = title + " " + element2.innerText;
    const button = document.createElement("button");
    button.innerHTML = 'Copy';
    button.onclick = function() {
        copyToClipboard(title.trim())
    };
    if (element2) {
        element2.appendChild(button);
    } else {
        element1.appendChild(button);
    }
}