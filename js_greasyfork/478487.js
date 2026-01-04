// ==UserScript==
// @name         BT-QC Tools: Add parcel info from Basetao to BT-QC
// @version      0.1.5
// @namespace    https://www.reddit.com/user/BasetaoKaj
// @description  Adds BT-QC button next to Tips
// @author       BasetaoKaj
// @match        https://www.basetao.com/*my_account/parcel/*
// @match        https://basetao.com/*my_account/parcel/*
// @match        https://www.basetao.com/best-taobao-agent-service/my_account/support_tools.html
// @match        https://basetao.com/best-taobao-agent-service/my_account/support_tools.html
// @connect      bt-qc.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/478487/BT-QC%20Tools%3A%20Add%20parcel%20info%20from%20Basetao%20to%20BT-QC.user.js
// @updateURL https://update.greasyfork.org/scripts/478487/BT-QC%20Tools%3A%20Add%20parcel%20info%20from%20Basetao%20to%20BT-QC.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function showMessage(message, isError = false) {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = message;
        messageDiv.style.backgroundColor = isError ? "red" : "green";
        messageDiv.style.color = "white";
        messageDiv.style.padding = "10px";
        messageDiv.style.position = "fixed";
        messageDiv.style.top = "10px";
        messageDiv.style.right = "10px";
        messageDiv.style.borderRadius = "5px";
        messageDiv.style.zIndex = "9999";

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.display = "none";
        }, 5000);
    }

    function sendDataToServer(item) {
        const data = {
            sid: item.sid,
            uname: item.uname,
            oids: item.oids,
            freight: item.freight,
            countmoney: item.countmoney,
            serverfee: item.serverfee,
            customsfee: item.customsfee,
            operationfee: item.operationfee,
            totalfee: item.totalfee,
            deliveryname: item.deliveryname,
            Insurancefee: item.Insurancefee,
            countweight: item.countweight,
            actualWeight: item.actualWeight,
            actualFreight: item.actualFreight,
            iosstax: item.iosstax,
            iossdeclare: item.iossdeclare,
            rehearsal_fee: item.rehearsal_fee,
            packing_fee: item.packing_fee,
            insurance: item.insurance,
            waterproof_fee: item.waterproof_fee,
            corner_fee: item.corner_fee
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://bt-qc.com/api/add-parcel",
            data: JSON.stringify(data),
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                console.log('Server response:', response);

                try {
                    const result = JSON.parse(response.responseText);
                    if (result.success) {
                        showMessage("Data pushed to BT:QC!");
                    } else {
                        showMessage(result.error || "Unknown error occurred", true);
                        if (result.error && result.error.includes("Please login")) {
                            window.open('https://bt-qc.com/', '_blank');
                        }
                    }
                } catch (e) {
                    showMessage("Error parsing server response", true);
                    console.error('Parse error:', e, response.responseText);
                }
            },
            onerror: function(response) {
                console.error('Request error:', response);
                showMessage("Error sending request: " + response.statusText, true);
            }
        });
    }

    function addButtonsToTable(tableId) {
        const $container = $(tableId);

        $container.on("load-success.bs.table", (e, data) => {
            data.rows.forEach((item) => {
                if (!item.sid || item.sid === "") {
                    return;
                }

                const $item = $(`[data-uniqueid="${item.sid}"]`);
                $item.find("td:first-child span.btn-danger-soft.badge.listtipmodal").remove();
                const $orderBadge = $item.find("td:nth-child(1) > span.badge.bg-secondary.me-1");
                const $payId = $(`<a href="#" class="bg-info badge me-1">Push to BT-QC</a>`);

                $payId.click(function (event) {
                    event.preventDefault();
                    sendDataToServer(item);
                });

                $orderBadge.after($payId);
            });
        });
    }

    addButtonsToTable("#table");
    addButtonsToTable("#table2");
})();