// ==UserScript==
// @name         Stop the clock!
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds buttons to SIMs for faster KIO triage
// @author       abbelot
// @match        https://t.corp.amazon.com/*
// @icon         https://static-00.iconduck.com/assets.00/alarm-clock-icon-2048x2043-sixnq26w.png
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      KIO
// @downloadURL https://update.greasyfork.org/scripts/494511/Stop%20the%20clock%21.user.js
// @updateURL https://update.greasyfork.org/scripts/494511/Stop%20the%20clock%21.meta.js
// ==/UserScript==

(async function() {
    'use strict';




    let login = await get_login() //gets the login with graphql
    let url;
    let regex_taskid;
    let taskid;
    let button_nodes = []
    const regex_integcheck = /^[0-9]+$/


    let stc_button = document.createElement("button")
    stc_button.innerHTML = "Stop The Clock!"
    stc_button.setAttribute("class","stc_button")

    stc_button.onclick = async function () {
        const currentDate = new Date();
        let time_request = prompt(`Enter time in minutes spent to log for ${login}`, "30");


        if (time_request != null && time_request != "" && regex_integcheck.test(time_request)) {

            const final_guid = guid()


            const payload = {
                "pathEdits":[
                    {
                        "path":"/schedule/actualCompletionDate",
                        "editAction":"PUT",
                        "data":currentDate.toISOString()
                    },
                    {
                        "path": "/extensions/effort/actualEffortLog/time/" + final_guid,
                        "editAction": "PUT",
                        "data": {
                            "id": final_guid,
                            "effortLoggedDate": currentDate.toISOString(),
                            "value": parseInt(time_request),
                            "authorIdentity": "kerberos:" + login + "@ANT.AMAZON.COM"
                        }
                    }

                ]
            }

            httpreq(payload,".stc_button")
        }
    }

    let comm_button = document.createElement("button")
    comm_button.innerHTML = "Check in"
    comm_button.setAttribute("class","comm_button")

    comm_button.onclick = async function () {

        const final_guid = guid()


        const payload = {
            "pathEdits":[
                {
                    "path": "conversation/432b7d67-917f-425b-a23f-4a2164b25fb2",
                    "editAction": "PUT",
                    "data": {
                        "id": "432b7d67-917f-425b-a23f-4a2164b25fb2",
                        "message": "Acknowledged",
                        "contentType": "text/plain",
                        "messageType": "conversation"
                    }
                },
                {
                    "path": `/engagementList/kerberos:${login}@ANT.AMAZON.COM`,
                    "editAction": "PUT",
                    "data": {
                        "id": `kerberos:${login}@ANT.AMAZON.COM`,
                        "status": "Engaged"
                    }
                }

            ]
        }

        httpreq(payload,".comm_button")
    }

    let time_button = document.createElement("button")
    time_button.innerHTML = "Add Time"
    time_button.setAttribute("class","time_button")

    time_button.onclick = async function () {
        const currentDate = new Date();
        let time_request = prompt(`How much time do you want to log for ${login}`, "30");


        if (time_request != null && time_request != "" && regex_integcheck.test(time_request)) {

            const final_guid = guid()


            const payload = {
                "pathEdits":[
                    {
                        "path": "/extensions/effort/actualEffortLog/time/" + final_guid,
                        "editAction": "PUT",
                        "data": {
                            "id": final_guid,
                            "effortLoggedDate": currentDate.toISOString(),
                            "value": parseInt(time_request),
                            "authorIdentity": "kerberos:" + login + "@ANT.AMAZON.COM"
                        }
                    }

                ]
            }
            httpreq(payload,".time_button")
        }
    }






    //creates random guid
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }


    //add button to page if div exists
    let intv_id;
    if (!intv_id) {
        intv_id = setInterval(try_append_button, 2000);
    }

    button_nodes.push(stc_button,comm_button,time_button)
    function try_append_button() {
        if (document.querySelector(".interaction-buttons") != null){
            try {
                for (let button of button_nodes) {
                    if (document.querySelector(`.${button.className}`) == null) {
                        url = window.location.href
                        regex_taskid = /[A-Z][0-9]+/
                        taskid = url.match(regex_taskid)[0]
                        document.querySelector(".interaction-buttons").appendChild(button)
                    }
                }
            }
            catch (e) {console.log(e)}
        }
    }




    async function get_login() {
        let storedlogin = await GM.getValue("login","nothingstored")
        if (storedlogin != "nothingstored") {console.log("got stored login"); return storedlogin}

        const payload =
              `query fetchCurrentUserDetails {
        whoami {
            id
            identity {
            id
            name
            protocol
            __typename
            }
            login
            fullName
            email
            jobTitle
            department
            building
            city
            groups {
            id
            details {
                id
                label
                deleted
                __typename
            }
            __typename
            }
            __typename
        }
    }`


       let prom = $.ajax({
           method: "POST",
           url: "https://sim-ticketing-graphql-fleet.corp.amazon.com/graphql",
           dataType: "json",
           contentType: "application/json",
           origin:"https://t.corp.amazon.com",
           cache: false,
           async:true,
           xhrFields: {
               withCredentials: true
           },
           data: JSON.stringify([{
               extensions: {},
               operationName: "fetchCurrentUserDetails",
               query: payload,
               variables: {}
           }]),
           tryCount: 0,
           retryLimit: 10,
           error: function(xhr, textStatus, errorThrown ) {
               if (textStatus == 'timeout') {
                   this.tryCount++;
                   if (this.tryCount <= this.retryLimit) {
                       //try again
                       $.ajax(this);
                       return;
                   }
                   return;
               }
               if (xhr.status == 500) {
                   console.log("error 1")
               } else {
                   console.log("Error getting login. Trying again")
                   this.tryCount++;
                   if (this.tryCount <= this.retryLimit) {
                       //try again
                       $.ajax(this);
                       return;
                   }
               }
           }

       })



       let response = await prom
       console.log(response)
        const log = response[0].data.whoami.login
        GM.setValue("login",log)
        return log
    }


    function httpreq(payload,buttoncss) {
        GM.xmlHttpRequest({
            data: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            url: 'https://maxis-service-prod-pdx.amazon.com/issues/' + taskid + '/edits',
            onload: function(response) {
                if (response.status == 201) {
                    document.querySelector(buttoncss).setAttribute("style","background-color: #008000")
                }
                else if (response.status == 200) {
                    document.querySelector(buttoncss).setAttribute("style","background-color: #FF0000")
                }
                else {
                    document.querySelector(buttoncss).setAttribute("style","background-color: #FFA500")
                }
                setTimeout(function () {document.querySelector(buttoncss).style.removeProperty("background-color")},1000)

            }
        });







    }
})();