// ==UserScript==
// @name         cosplayjav.pl Download Link Capturer.
// @namespace    https://github.com/ThanatosDi/Tampermonkey-Script/blob/master/cosplayjav.pl/cosplayjav.pl%20Download%20Link%20Capturer.user.js
// @version      1.0
// @description  fast to get the video download links.
// @author       ThanatosDi
// @match        cosplayjav.pl/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/381955/cosplayjavpl%20Download%20Link%20Capturer.user.js
// @updateURL https://update.greasyfork.org/scripts/381955/cosplayjavpl%20Download%20Link%20Capturer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var lists = $('.item-parts')
    var dlpage
    var dlink = [];
    var div = document.getElementsByClassName('item-parts')[0]
    for(var index=0; index < (lists.children()).length ; index++){
        dlpage = lists.children()[index].href
        var promise_obj = fetchAsync(dlpage)
        promise_obj
            .then(function(result){
            dlink.push(result)
            _dlen(dlink, index)
        })
    }
})();

function _dlen(Array,len){
    var div = document.getElementsByClassName('item-parts')[0]
    if(len==Array.length){
        for(var i=0;i<len;i++){
            addElement(div, Array[i], i+1)
            //print(i)
        }
        return Array
    }
}

/* the good old XMLHttpRequest */
function oldxhr(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = _ => JSON.parse(xhr.responseText);
    xhr.send();
}

/* new fetch api */
function fetchUrl(url) {
    fetch(url)
        .then(response => response.text())
        .then(data => data);
}

/* fetch with async/await */
async function fetchAsync(url) {
    const promise = await fetch(url);
    const link = $('a.btn.btn-primary.btn-download',await promise.text())[0].href
    return (Promise.resolve(link))
    //const data = await promise.json();
    //return data;
}

async function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}

function print(str){
    return console.log(str);
}

function addElement(parent, URL, index){
    var a = document.createElement('a');
    var p = document.createElement('p');
    a.href = URL;
    a.text = 'Download Link Part '+index
    p.appendChild(a)
    parent.appendChild(p)
}