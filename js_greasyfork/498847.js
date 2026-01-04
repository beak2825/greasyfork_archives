// ==UserScript==
// @name         On-call SLA Labels
// @namespace    http://tampermonkey.net/
// @version      2024-04-29
// @description  script that shows Simt SLA banners
// @author       You
// @match        https://t.corp.amazon.com/*
// @license      KIO
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/498847/On-call%20SLA%20Labels.user.js
// @updateURL https://update.greasyfork.org/scripts/498847/On-call%20SLA%20Labels.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const label_formats = {
        "Completed":"#32CD32",
        "Pending":"#FF7F50",
        "Failed":"#FF0000"
    }



    setInterval(function() {
        try {
            const url = window.location.href
            const regex_taskid = /[DV][0-9]+/
            const taskid = url.match(regex_taskid)[0]
            GM.xmlHttpRequest({
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                url: 'https://maxis-service-prod-pdx.amazon.com/issues/' + taskid,
                onload: function(res) {
                    const sla_receipts = JSON.parse(res.response).slaReceipts
                    const label_container = document.querySelector(".title-container")
                    document.querySelectorAll(".sla-receipt-banner").forEach(b => b.remove())
                    for (let receipt of sla_receipts) {
                        if (receipt.status != "Canceled") {
                            let banner = document.createElement("div")
                            banner.innerHTML = receipt.type
                            banner.setAttribute("class","sla-receipt-banner")
                            banner.setAttribute("style",`background-color:${label_formats[receipt.status]};font-size:13px;padding:1px;font-weight:bold;margin: 3px;border-radius: 5px;width: max-content;height: 30px;top: 50%`)
                            label_container.appendChild(banner)
                        }
                    }
                }
            }

                             )

        } catch {}
    },2500)




})();