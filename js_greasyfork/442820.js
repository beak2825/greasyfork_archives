// ==UserScript==
// @name         Discord Token Getter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Gets your token on discord.
// @author       You
// @match        https://*.discord.com/@me*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442820/Discord%20Token%20Getter.user.js
// @updateURL https://update.greasyfork.org/scripts/442820/Discord%20Token%20Getter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        let popup;
        popup = window.open('');
        if (!popup) return alert('Popup blocked! Please allow popups and try again.');
        popup.document.write("Getting token...")
        window.dispatchEvent(new Event('beforeunload'));
        window.tkn = JSON.parse(popup.localStorage.token);
        popup.close()
    }

    setInterval(function() {
        let userInfo = document.querySelector('div div[class*="children-"] div[class*="background-"] div[class*="fieldList"]');
        if(!userInfo) return;

        let editButton = userInfo.querySelector('button[class*="fieldButton-"]')

        let tokenField = document.getElementById("get-token-field");
        if(tokenField) {
            if(editButton) {
                tokenField.style.display = "";
            } else {
                tokenField.style.display = "none";
            }
            return;
        };

        tokenField = document.createElement("div")
        tokenField.id = "get-token-field"
        tokenField.className = editButton.parentElement.nextElementSibling.className

        let constrainedRow = document.createElement("div")
        constrainedRow.className = userInfo.querySelector('div[class*="constrainedRow-"]').className

        let tokenFieldTitle = document.createElement("h5")
        tokenFieldTitle.innerHTML = "TOKEN"
        tokenFieldTitle.className = editButton.parentElement.querySelector('h5').className

        let tokenFieldContent = document.createElement("span")
        tokenFieldContent.innerHTML = "Token"
        tokenFieldContent.className = editButton.parentElement.querySelector('div div span[class*="colorHeaderPrimary"]').className

        constrainedRow.appendChild(document.createElement("div")).appendChild(tokenFieldTitle).parentElement.appendChild(document.createElement("div")).appendChild(tokenFieldContent)
        tokenField.appendChild(constrainedRow)

        let fieldButtonList = document.createElement("div")
        fieldButtonList.className = userInfo.querySelector('div[class*="fieldButtonList"]').className

        let tokenFieldCopy = document.createElement("button")
        tokenFieldCopy.onclick = function() {
            if(tkn) {
                let tkn2 = tkn.split('')
                tkn2.shift()
                tkn2.pop()
                tkn2 = tkn2.join('')

                let popup = window.open("")

                popup.document.body.innerHTML = `Your token is <input placeholder="Token" readonly>.<br>To reset it, change your username or password.`
                popup.eval(`document.querySelector('input').value = "${tkn2}"`)
                popup.eval(`document.querySelector('input').onclick = function() {
                    let copy = document.querySelector('input')
                    copy.select();
                    copy.setSelectionRange(0, 99999);
                    document.execCommand("copy");

                    let token = copy.value
                    copy.value = "Copied!"

                    setTimeout(function() {
                        copy.value = token
                    }, 1000)
                }`)
            } else {
                alert("Error getting token. Please try again.")
            }
        }
        tokenFieldCopy.innerHTML = "Get"
        tokenFieldCopy.className = editButton.className
        fieldButtonList.appendChild(tokenFieldCopy)

        tokenField.appendChild(fieldButtonList)

        userInfo.appendChild(tokenField)
    }, 50)
})();