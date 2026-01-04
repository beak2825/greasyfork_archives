// ==UserScript==
// @name        ServiceChannel One Click Accept
// @namespace   https://violentmonkey.github.io
// @version     0.1.1
// @description Accept ServiceChannel work orders with one click on the RSI service call creation page.
// @author      Anton Grouchtchak
// @match       https://office.roofingsource.com/admin/CaseAdd.php*
// @icon        https://office.roofingsource.com/images/roofing-source-logo.png
// @license     GPLv3
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/492861/ServiceChannel%20One%20Click%20Accept.user.js
// @updateURL https://update.greasyfork.org/scripts/492861/ServiceChannel%20One%20Click%20Accept.meta.js
// ==/UserScript==


(async () => {
    "use strict";

    const IS_DEV = localStorage.getItem("dev_mode") === "true";

    const BASE_URL = IS_DEV ? "https://sandbox.pydebloatx.com" : "https://servicechannel.teraskull.com";

    if (IS_DEV) {
        console.warn("Running in dev mode.");
    }

    const getAuthString = () => `${window.RS_USER_NAME}:${window.RS_USER_ID}:${window.location.hostname}`;

    const ajaxCall = (url, method, workOrderId) =>
        $.ajax({
            url: `${BASE_URL}/work-orders/${workOrderId}/${url}`,
            type: method,
            headers: { "x-user-info": getAuthString() }
        });

    const acceptWorkOrder = (workOrderId) => ajaxCall("status", "PUT", workOrderId);
    const rescheduleWorkOrder = (workOrderId) => ajaxCall("scheduledate", "PUT", workOrderId);

    const parseErrorMessage = (error) => {
        const message = error?.ErrorMessage || error?.detail[0]?.msg;  // Handle both SC API errors and FastAPI errors.

        if (message) {
            if (message.includes("Work Order is in status that not allow to perform this action")) { // Great grammar coming from the SC API.
                return "Current work order status does not allow changes";
            }
            if (message.includes("Scheduled date/time is greater than expiration date/time")) {
                return "Current work order does not allow rescheduling";
            }
            return message;
        }
        return "Error while accepting/rescheduling work order";
    };

    const setMessage = (message, type = "info") => {
        const colors = { error: "red", success: "green", info: "blue" };
        $("#messageBanner")
            .css("color", colors[type] || "black")
            .text(message);
    };

    const handleFail = (xhr) => {
        let errorText = "Error while accepting/rescheduling work order";
        if (xhr.status === 502 && !xhr.getResponseHeader("Server")?.includes("uvicorn")) {
            errorText = "Could not connect to server.";
        } else if (xhr.responseText) {
            const result = JSON.parse(xhr.responseText);
            errorText = parseErrorMessage(result);
            console.debug(result);
        } else {
            errorText = "Failed";
        }
        setMessage(errorText, "error");
    };

    const handleButtonClick = async (event) => {
        const $button = $(event.currentTarget);
        const workOrderId = $("#customer_po").val().trim();

        if (!workOrderId || isNaN(Number(workOrderId)) || workOrderId.trim().length !== 9) {
            setMessage("Invalid ServiceChannel work order ID", "error");
            return;
        }

        $button.button({ disabled: true, label: "Accepting..." });
        setMessage("");

        acceptWorkOrder(workOrderId)
            .then((data) => {
                console.log(data);
                if (data.result !== "") {
                    setMessage("Work order accepted", "success");
                }else {
                    setMessage("Work order already accepted", "success");
                }

                $button.button({ disabled: true, label: "Rescheduling..." });

                rescheduleWorkOrder(workOrderId)
                    .then((data) => {
                        if (data.id) setMessage("Rescheduled 5 days from now", "success");
                    })
                    .fail(handleFail)
                    .always(() => $button.button({ label: "Accept Work Order", disabled: false }));

            })
            .fail((xhr) => {
                handleFail(xhr);
                $button.button({ label: "Accept Work Order", disabled: false })
            });
    };

    const $AcceptBtn = $("<button>", {
        id: "AcceptButton",
        type: "button",
        style: "margin-right: 15px",
        click: handleButtonClick
    }).button({ label: "Accept Work Order", icons: { primary: "ui-icon-circle-plus" }, disabled: true });

    const $buttonFooter = $("#case-add > div")
        .css({
            display: "flex",
            "justify-content": "flex-end",
            "margin-bottom": "-10px"
        })
        .prepend($AcceptBtn)
        .prepend(
            $("<span>", {
                id: "messageBanner",
                style: "margin-right: 10px; align-self: center;"
            })
        );

    const $workOrderInput = $("#customer_po");

    $workOrderInput.on("input", (event) => {
        $AcceptBtn.button({ disabled: !event.target.value.trim() });
    });
})();

