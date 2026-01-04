// ==UserScript==
// @name         Hide Spam Messages
// @namespace    https://greasyfork.org/en/users/945115
// @version      0.2
// @description  Hides messages from a specific user list on willyoupressthebutton.com
// @author       Unmatched Bracket
// @match        *://www.willyoupressthebutton.com/*
// @match        *://willyoupressthebutton.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=willyoupressthebutton.com
// @grant        none
// @license      The Unlicence
// @downloadURL https://update.greasyfork.org/scripts/451651/Hide%20Spam%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/451651/Hide%20Spam%20Messages.meta.js
// ==/UserScript==

var oldSend = XMLHttpRequest.prototype.send
var oldOpen = XMLHttpRequest.prototype.open

// Block list. Messages from these usernames will be hidden.
const block_list = [
    "This_is_legal", // pure spam
    "SweetCandy98", // inaproppriate spamming
]

XMLHttpRequest.prototype.open = function(_, url) {
    if (url.includes("api/comments/get")) {
        this.doInject = true
    }
    oldOpen.call(this, ...arguments)
}

XMLHttpRequest.prototype.send = function() {
    if (this.doInject) {
        var oldReadyChange = this.onreadystatechange
        this.onreadystatechange = function () {
            //console.log(this.readyState, this.status, this.responseType)
            if (this.readyState == 4) {
                console.log(this.response)
                var respJson = JSON.parse(this.response)
                respJson.injected = true
                respJson.data = respJson.data.filter((comment) => {
                    return !comment.user || !block_list.includes(comment.user.name)
                })

                var newText = JSON.stringify(respJson)
                var newResp = () => {
                    return newText
                }
                this.__defineGetter__("responseText", newResp)
                this.__defineGetter__("response", newResp)
            }
            oldReadyChange.call(this, "debug text")
        }
    }
    oldSend.call(this)
}