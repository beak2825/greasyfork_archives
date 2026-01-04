// ==UserScript==
// @name         Instagram Utils
// @namespace    http://tampermonkey.net/
// @version      0.0.20
// @description  get user email
// @author       nibnil
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445086/Instagram%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/445086/Instagram%20Utils.meta.js
// ==/UserScript==

var zNode = document.createElement('div')
zNode.innerHTML = "<button id='myButton' type='button'>go</button>"
zNode.setAttribute('id', 'myContainer')
document.body.appendChild(zNode)
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
)

XMLHttpRequest.prototype.wrappedSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader
XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
    // Call the wrappedSetRequestHeader function first 
    // so we get exceptions if we are in an erronous state etc.
    this.wrappedSetRequestHeader(header, value)

    // Create a headers map if it does not exist
    if(!this.headers) {
        this.headers = {}
    }

    // Create a list for the header that if it does not exist
    if(!this.headers[header]) {
        this.headers[header] = []
    }

    // Add the value to the header
    this.headers[header].push(value)
}
var userId = ''
function getUserId (url) {
    let m
    let result = ''
    let regex = /https:\/\/i\.instagram\.com\/api\/v1\/feed\/user\/([0-9]+)\/story\//gm
    while ((m = regex.exec(url)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            // console.log(`Found match, group ${groupIndex}: ${match}`)
            result = match
        })
    }
    // console.log(url, result)
    return result
}

function getEmail (responseText) {
    let m
    let result = ''
    let regex = /"public_email":"((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))"/gm
    while ((m = regex.exec(responseText)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            // console.log(`Found match, group ${groupIndex}: ${match}`)
            if (match) {
                result = match
            }
        })
    }
    return result
}

function ButtonClickAction (zEvent) {
    let url = 'https://i.instagram.com/api/v1/users/' + userId + '/info/'
    runAsync(url).then(
        (result)=> {return result}).then(function(result){
            console.log(result)
            let email = getEmail(result)
            alert('userId: ' + userId + ',eamil: ' + email)
        })
}

function addXMLRequestCallback(callback){
    var oldSend, i;
    if( XMLHttpRequest.callbacks ) {
        // we've already overridden send() so just add the callback
        XMLHttpRequest.callbacks.push( callback )
    } else {
        // create a callback queue
        XMLHttpRequest.callbacks = [callback]
        // store the native send()
        oldSend = XMLHttpRequest.prototype.send
        // override the native send()
        XMLHttpRequest.prototype.send = function(){
            // process the callback queue
            // the xhr instance is passed into each callback but seems pretty useless
            // you can't tell what its destination is or call abort() without an error
            // so only really good for logging that a request has happened
            // I could be wrong, I hope so...
            // EDIT: I suppose you could override the onreadystatechange handler though
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i]( this )
            }
            // call the native send()
            oldSend.apply(this, arguments)
        }
    }
}

addXMLRequestCallback( function( xhr ) {
        xhr.addEventListener("load", function(){
        if ( xhr.readyState == 4 && xhr.status == 200 ) {
            let res = getUserId(xhr.responseURL)
            if ( res !== ''){
                console.log(xhr.headers)
                userId = res
            }
        }
    })
})

function runAsync(url){
    var p = new Promise((resolve, reject) => {
        let request = new XMLHttpRequest()
        request.withCredentials = true
        request.onreadystatechange = function(){
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    resolve(request.response)
                } else {
                    console.log(request.response)
                    reject(Error(this.response.status))
                }
            }
        }
        
        request.onerror = function() {
            reject(Error('error'))
        }
        request.open('get', url)
        request.setRequestHeader('x-ig-app-id', '936619743392459')
        request.send()
    })
    return p
}

GM_addStyle ( `
    #myContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              10px;
        background:             orange;
        border:                 3px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 20px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }
` )