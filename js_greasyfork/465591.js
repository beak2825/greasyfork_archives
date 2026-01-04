// ==UserScript==
// @name         WTF Revives
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  To request a revive from WTF
// @author       HowsThat [1643014]
// @match        https://www.torn.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @connect      what-the-f.de
// @downloadURL https://update.greasyfork.org/scripts/465591/WTF%20Revives.user.js
// @updateURL https://update.greasyfork.org/scripts/465591/WTF%20Revives.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a semicolon after the width property
    GM_addStyle ( `
    .wtf{
        font-family: 'Helvetica', 'Arial', sans-serif;
        display: inline-block;
        font-size: 1em;
        padding: .1em .5em;
        width: 50px;  // Add semicolon here
        margin-top: 10px;
        margin-bottom: 10px;
        background-color: #ff962d;
        color: #000000;
        border-radius: 1px;
        border: 3px solid #000000;
        cursor: pointer;
        position: relative;
    }
    `);

    // Use setInterval instead of setTimeout
    setInterval(wtfrevive, 500);

    var wtfReviveLink = document.getElementById('wtf-revive-link');
    if (wtfReviveLink) {
        wtfReviveLink.removeEventListener('click', callWTFRevive);
        wtfReviveLink.parentNode.removeChild(wtfReviveLink);
    }

    var wtfReviveButt = `
    <div id="top-page-links-list" class="content-title-links" role="list" aria-labelledby="top-page-links-button">
        <a role="button" aria-labelledby="wtf-revive" class="wtf-revive t-clear h c-pointer  m-icon line-h24 right last" href="#" style="padding-left: 10px; padding-right: 10px" id="wtf-revive-link">
            <span class="icon-wrap svg-icon-wrap">
                <span class="link-icon-svg wtf-revive">
                    <div id="cf">
                    </div>
                </span>
            </span>
            <span id="wtf-revive" class="wtf">Call WTF</span>
        </a>
    </div>
    `;

    function wtfrevive() {
        if (!document.getElementById('wtf-revive-link')) {
            var sidebar = getSidebar();
            if (sidebar.statusIcons.icons.hospital) {
                let wtflink = document.querySelector('.links-footer') || document.querySelector('.content-title .clear') || document.querySelector('.tutorial-switcher') || document.querySelector('.links-top-wrap') || document.querySelector('.forums-main-wrap');
                if (wtflink) {
                    let wtfcontainer = wtflink.parentNode;
                    let newElement = document.createElement('span');
                    newElement.innerHTML = wtfReviveButt;
                    wtfcontainer.insertBefore(newElement, wtflink);

                    document.getElementById('wtf-revive-link').addEventListener('click', callWTFRevive);
                }
            }
        }
    }

    function callWTFRevive() {
        let get_sidebar = getSidebar();
        let userID = get_sidebar.user.userID;
        let userName = get_sidebar.user.name;
        let faction = get_sidebar.statusIcons.icons.faction.subtitle.split(' of ')[1];
        let requestChannel = "WTF Revive Button Script";
        let hospitalIcon = get_sidebar.statusIcons.icons.hospital;
        if (hospitalIcon == null) {
            console.error('You are no longer in the Hospital.');
            alert('You are no longer in the Hospital.');
        } else {
            var reviveRequestData = new Object();
            reviveRequestData.userID = userID;
            reviveRequestData.userName = userName;
            reviveRequestData.factionName = faction;
            reviveRequestData.requestChannel = requestChannel;
            var jsonString= JSON.stringify(reviveRequestData);
            const WTF_REVIVE_URL = 'https://what-the-f.de/wtfapi/revive';
            GM.xmlHttpRequest({
                method: 'POST',
                url: WTF_REVIVE_URL,
                data: jsonString,
                headers:    {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    if (response.status == '200') {
                        alert('Request sent to WTF. Revives cost $1,800,000 or 2 xanax.');
                    } else {
                        console.error(JSON.parse(response.responseText).reason);
                        alert(JSON.parse(response.responseText).reason);
                    }
                },
                onerror: function (error) {
                    console.error('An error has occurred, please contact WTF Leadership.', error);
                    alert('An error has occurred, please contact WTF Leadership.');
                }
            });
        }
    }

    function getSidebar() {
        let key = Object.keys(sessionStorage).find(key => /sidebarData\d+/.test(key));
        let sidebarData = JSON.parse(sessionStorage.getItem(key));
        return sidebarData;
    }
})();