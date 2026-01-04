// ==UserScript==
// @name         Party II notifier
// @license      BSD
// @version      1.2
// @namespace    http://heyuri.net/
// @description  changes they title bar to the number of missed messages while you where tabbed out
// @author       grr
// @match        https://cgi.heyuri.net/party2/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heyuri.net
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/472434/Party%20II%20notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/472434/Party%20II%20notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var lastDate = null
    var messageCount = 0
    const messageElements = document.getElementsByClassName('message');


    function overwriteTitel(count) {
      document.title = count > 0 ? `(${count}) New Messages` : "@Party II";
    }

    function convertDate(dateString){
        const cleanedDateString = dateString.replace(/\(|\)/g, ''); // Remove parentheses
        const [datePart, timePart] = cleanedDateString.split(' '); // Split date and time parts
        const [year, month, day] = datePart.split('/').map(Number); // Extract year, month, and day
        const [hour, minute, second] = timePart.split(':').map(Number); // Extract hour and minute
        return new Date(year, month - 1, day, hour, minute, second); // Note: Months in Date are 0-indexed
    }

    function isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    function getChildElementFontSize(parentElement) {
        const childElements = parentElement.children;

        for (let i = 0; i < childElements.length; i++) {
            const childElement = childElements[i];
            const cSize = childElement.size
            if (cSize == 1){
                return childElement
            }
        }
        return null;
    }

    function setNewstDate(){
        lastDate = convertDate(getChildElementFontSize(messageElements[0]).innerHTML)
        localStorage.sd = lastDate
        //console.log("save" , lastDate)
    }

    function loadDate() {
        lastDate = Date.parse(localStorage.sd)
    }



    window.addEventListener('focus',setNewstDate);

    loadDate()
    //console.log("loaded",lastDate)
    if (document.hasFocus()){
        setNewstDate()
    }
    messageCount = 0
    for (let i = 0; i < messageElements.length; i++) {
        const messageEle = getChildElementFontSize(messageElements[i])
        if (messageEle == null) {continue}

        const messageTime = messageEle.innerHTML
        var cDate = convertDate(messageTime)

        if (lastDate < cDate) {
            //console.log(cDate)
            messageCount ++
        }
    }
    overwriteTitel(messageCount)

    })();