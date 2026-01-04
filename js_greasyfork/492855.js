// ==UserScript==
// @name         SlowlyWebUtility
// @namespace    heshui
// @version      1.5
// @description  Add a button to download all letters in a text file
// @license      GPLv3
// @author       heshui
// @match        web.slowly.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slowly.app
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492855/SlowlyWebUtility.user.js
// @updateURL https://update.greasyfork.org/scripts/492855/SlowlyWebUtility.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const API_URL = `https://api.getslowly.com`

    /*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content. From: https://git.io/vMmuf
    */
    function waitForKeyElements(selectorTxt, /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce, /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector /* Optional: If set, identifies the iframe to
                        search.
                    */
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes = $(selectorTxt);
        else
            targetNodes = $(iframeSelector).contents().find(selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            /*--- Found target node(s).  Go through each and act if they
            are new.
        */
            targetNodes.each(function() {
                var jThis = $(this);
                var alreadyFound = jThis.data('alreadyFound') || false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction(jThis);
                    if (cancelFound)
                        btargetsFound = false;
                    else
                        jThis.data('alreadyFound', true);
                }
            });
        } else {
            btargetsFound = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval(timeControl);
            delete controlObj[controlKey]
        } else {
            //--- Set a timer, if needed.
            if (!timeControl) {
                timeControl = setInterval(function() {
                    waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
                }, 300);
                controlObj[controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }
    function download(filename, text) {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    function getFriends(token) {
        return fetch(API_URL + "/users/me/friends/v2?token=" + token).then((res)=>res.json()).then((res)=>res).catch((error)=>{
            throw error;
        }
        );
    }
    function getLetters(token, id, page) {
        return fetch(API_URL + "/friend/" + id + "/all?ver=70200&token=" + token + "&page=" + page).then((res)=>res.json()).then((res)=>res).catch((error)=>{
            throw error;
        }
        );
    }
    async function getAllLetters(token, id) {
        let page = 1
        let letters = await getLetters(token, id, page)
        while (letters.comments.next_page_url) {
            let nextLetters = await getLetters(token, id, ++page)
            letters.comments.data = letters.comments.data.concat(nextLetters.comments.data)
            letters.comments.next_page_url = nextLetters.comments.next_page_url
        }
        return letters
    }
    function parseLetter(letter, index, letters) {
        return `${index+1} / ${letters.length}\nSent: ${letter.created_at}\nDelivered: ${letter.deliver_at}\nFrom: ${letter.name}, ${letter.sent_from}\nStamp: ${letter.stamp}\n\n${letter.body}`
    }
    function loadMe(){
        var me = JSON.parse(JSON.parse(localStorage["persist:slowly"])['me'])
        return me
    }
    async function downloadAllLetters() {
        let me = loadMe()
        let token = me.token
        let friends = await getFriends(token)

        let currentFriendElem = document.getElementsByClassName('friend-header-wrapper')
        if (!currentFriendElem.length) {
            throw new Error('No friend selected')
        }
        let friendName = currentFriendElem[0].getElementsByClassName('text-primary')[0].textContent
        let friend = friends.friends.find(obj=>obj.name === friendName);
        let letters = await getAllLetters(token, friend.id)
        let lettersText = letters.comments.data.reverse().map(parseLetter).join('\n\n------------------------------------------------------\n')
        download(friendName + '.txt', lettersText)
    }

    waitForKeyElements(".h5.mb-1.ml-n1", addDownloadButton)
    waitForKeyElements(".table.table-borderless.profile-list.table-sm", addLetterCounter)

    function addDownloadButton() {
        var button = document.createElement("span")
          , btnStyle = button.style
        button.className = "badge badge-pill badge-primary badge-search link"
        button.innerHTML = `<i class="icon-download"></i>&nbsp; Download `
        button.onclick = downloadAllLetters
        var badgeList = document.getElementsByClassName("h5 mb-1 ml-n1")[0]
        if (!badgeList) {
            return;
        }
        badgeList.insertBefore(button, badgeList.children[0].nextSibling)
    }

    function addLetterCounter(){
        let me = loadMe()
        let ratioText = me.ratioText
        let ratio = me.ratio
        let profileTable = document.getElementsByClassName("table table-borderless profile-list table-sm")[0]
        if (!profileTable || !window.location.pathname.startsWith("/profile")) {
            return;
        }
        profileTable = profileTable.children[0]
        var ratioLine = document.createElement("tr")
        ratioLine.innerHTML = `<td class="icon-td"><i class="icon-stats text-calm"></i></td><td>Sent:Received Ratio ( ${ratioText} )</td>`
        profileTable.insertBefore(ratioLine, profileTable.children[3])
        var srLine = document.createElement("tr")
        srLine.innerHTML = `<td></td><td class="pt-0 mt-0 small muted text-lighter">Sent: ${ratio.sent} Received: ${ratio.received}</td>`
        profileTable.insertBefore(srLine, ratioLine.nextSibling)
    }
}
)();