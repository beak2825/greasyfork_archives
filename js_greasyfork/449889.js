// ==UserScript==
// @name         MeetToConf
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Create conf title for the day from Google meet participant list
// @author       contorted212
// @match        https://meet.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449889/MeetToConf.user.js
// @updateURL https://update.greasyfork.org/scripts/449889/MeetToConf.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let today = function() {

        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formattedToday = dd + '/' + mm + '/' + yyyy;
        return formattedToday;
    }

    function copyToClipboard(text) {
        var dummy = document.createElement("textarea");
        // to avoid breaking orgain page when copying more words
        // cant copy when adding below this code
        // dummy.style.display = 'none'
        document.body.appendChild(dummy);
        //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }

    let handleClick = function() {
        let host = "";
        let ds = document.getElementsByTagName("span")
        for (let d of ds) {
            if(d.getAttribute("aria-label")&&d.getAttribute("aria-label").startsWith("In call")) { host = d } }
        if (host === "") {
            alert("Make sure participant list is loaded up!")
            return;
        }
        //console.log('host child',host.firstChild.firstChild.children[0].children[1].firstChild.firstChild.innerText)
        debugger;
        let hostNameE =host.firstChild.firstChild.children[0].children[1].firstChild.firstChild
        //host.nextSibling.firstChild.firstChild.children[1].firstChild.children[0]
        console.log("Meeting host: " + hostNameE.innerText);
        let cname = hostNameE.className;
        let r = document.getElementsByClassName(cname);
        let filteredR = []
        for (let c of r) {
             if(!(filteredR.includes(c.innerText))) filteredR.push(c.innerText)
        }
        let res = "";
        for (let x of filteredR) { res += x[0].toUpperCase() }
        res += (" - " + today())
        alert("Copied to clipboard: " + res);
        copyToClipboard(res);

    }

    console.log("Userscript running");
    let b = document.createElement("button")
    b.setAttribute("value", "Participants")
    b.setAttribute("id", "participants101")
    b.setAttribute("style", "position: absolute; z-index: 10000; top: 0; width: 100; height:50; opacity: 0.5")
    b.textContent = "👥"
    b.onclick = handleClick
    document.body.appendChild(b)
})();