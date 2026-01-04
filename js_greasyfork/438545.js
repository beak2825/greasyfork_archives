// ==UserScript==
// @name         Twitch Report Underage
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a Button which lets you Report Underage (12 Years) Content on Twitch with a single click.
// @author       ChoosenEye
// @match        https://www.twitch.tv/*
// @grant        GM.xmlHttpRequest
// @grant        GM.addStyle
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/438545/Twitch%20Report%20Underage.user.js
// @updateURL https://update.greasyfork.org/scripts/438545/Twitch%20Report%20Underage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }


    GM.addStyle(".reportbutton { line-height: 20px; text-align: center; border-radius: 0.4rem; color: white; width: max-content; background-color: rgb(255, 20, 20); padding: 5px 10px; margin: 0 8px; display:inline-flex; }")
    GM.addStyle(".reportbutton:hover { background-color: rgb(200, 20, 20); }");

    //wait for pageload
    window.addEventListener('load', function() {
        setTimeout(() => {
            AddButton("Underage (12y)");
        }, 3500);
    }, false);

    const AddButton = (name) => {
    //define Button for Reporting
        let image = 'https://cdn.frankerfacez.com/emoticon/427168/1';
        let button = document.createElement('div');
        button.innerHTML = `<button id="${name}" class="reportbutton"><img style="margin-right: 5px;width:auto;height:20px;" src="${image}" /> ${name} </button>`;
        document.querySelector(".metadata-layout__support > div:nth-child(2)").appendChild(button);
        document.getElementById(name).addEventListener("click", clickButton);
    }

    const clickButton = () => {
            sendGQLReq();
        }


    const getChannelId = () => {
        let twitchgqlurl = '//gql.twitch.tv/gql'
        return new Promise((resolve) => {
            GM.xmlHttpRequest({
                method: "POST",
                headers: {
                    'Authorization': `OAuth ${getCookie('auth-token')}`,
                    'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko'
                },
                url: `https:${twitchgqlurl}`,
                data:  `{"query": "{user(login: \\"${window.location.pathname.substring(1)}\\", lookupType: ALL) {id}}"}`,
                dataType: 'json',
                contentType: 'application/json',
                overrideMimeType: 'application/json',
                onload: (req) => {
                    console.log(JSON.parse(req.responseText).data.user.id);
                    resolve(JSON.parse(req.responseText).data.user.id);
                }
            });
        });
    }


   const sendGQLReq = async () => {
       let ChannelID = await getChannelId();
       let twitchgqlurl = '//gql.twitch.tv/gql';

       GM.xmlHttpRequest({
           method: "POST",
           headers: {
               'Authorization': `OAuth ${getCookie('auth-token')}`,
               'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko'
           },
           url: `https:${twitchgqlurl}`,
           data:  `{"operationName":"ReportUserModal_ReportUser","variables":{"input":{"description":"report context: USER_REPORT\\n\\nvideo > video more options > underage\\n\\ndescription: child under 12","reason":"underaged","content":"LIVESTREAM_REPORT","contentID":"","extra":"","targetID":"${ChannelID}","wizardPath":["video","video more options","underage"]}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"dd2b8f6a76ee54aff685c91537fd75814ffdc732a74d3ae4b8f2474deabf26fc"}}}`,
           dataType: 'json',
           contentType: 'application/json',
           overrideMimeType: 'application/json',
           onload: (req) => {
               let resp = JSON.parse(req.responseText);
               if (resp.data.reportContent.contentID === ""){
                   alert("reported successfully.");
               } else {
                   alert("error occured: " . resp.data.reportContent.contentID);
               }
           }
       });
   }


})();