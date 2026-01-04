// ==UserScript==
// @name         Sextb enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sextb enhancer...
// @author       HappyTreeFriends
// @namespace    https://greasyfork.org/users/317047
// @match        https://sextb.net/*
// @icon         https://www.google.com/s2/favicons?domain=sextb.net
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/434770/Sextb%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/434770/Sextb%20enhancer.meta.js
// ==/UserScript==
(function() {
    'use strict';

    document.querySelectorAll('.episode_list .epButton').forEach(item => {
        if (item.innerText.includes('ST')) {
            proceed_streamtape(item.innerText, item.dataset.source, item.dataset.id);
        } else if (item.innerText.includes('FE') || item.innerText.includes('JP')) {
            proceed_fvsio(item.innerText, item.dataset.source, item.dataset.id);
        }
    });

})();

async function proceed_streamtape(name, source, episode) {
    //console.log(link);
    const sourcelink = await getIframesrc(source, episode);
    //console.log(sourcelink);

    let dom = 'Empty dom';
    const getStreamlink = new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://' + window.location.host,
            },
            url: sourcelink,
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
                //console.log(streamlink);
            },
            onerror: reject,
            ontimeout: reject,
        });
    });

    (async () => {
        const element = document.querySelector('.episode_list');
        const buttonDiv = document.createElement("div");
        makeBtn(buttonDiv, name, await getRedirect(await getStreamlink));
        //makeBtn(buttonDiv, 'Download streamtape', item.file);
        element.appendChild(buttonDiv);
    })();
}

async function proceed_fvsio(name, source, episode) {
    //console.log('source:'+source + ' episode:'+episode);

    const sourcelink = await getIframesrc(source, episode);
    //console.log(sourcelink);
    GM_xmlhttpRequest({
        url: sourcelink,
        method: "HEAD",
        onload: function(response) {
            const apiURL = new URL(response.finalUrl);
            //console.log('https://'+apiURL.hostname+'/api/source/'+apiURL.href.split('/').slice(-1)[0]);
            GM_xmlhttpRequest({
                method: "POST",
                url: 'https://' + apiURL.hostname + '/api/source/' + apiURL.href.split('/').slice(-1)[0],
                onload: function(response) {
                    const result = JSON.parse(response.responseText);
                    const items = result.data;
                    if(items != null){
                        const buttonDiv = document.createElement("div");
                        items.forEach(item => {
                            makeBtn(buttonDiv, name + ' ' + item.label, item.file);
                            //console.log(item.label);
                            //console.log(item.file);
                        })
                        document.querySelector('.episode_list').appendChild(buttonDiv);
                    }
                }
            });
        }
    });
}

async function getIframesrc(source, episode) {
    return await fetch('https://' + window.location.host + '/ajax/player', {
        method: 'POST',
        body: new URLSearchParams({
            'episode': episode,
            'filmId': source
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        }
    })
        .then(res => {
        return res.json();
    }).then(result => {
        const dom = new DOMParser().parseFromString(result.player, 'text/html')
        return dom.querySelector('iframe').src;
    });
}

function getFinalTitle(text) {
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
    button.style.cssText = 'all:unset';
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