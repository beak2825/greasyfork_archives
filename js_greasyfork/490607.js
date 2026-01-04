// ==UserScript==
// @name        HubSpot Deal Integration
// @namespace   https://violentmonkey.github.io
// @version     1.1.2
// @description Create HubSpot deals directly from the proposal page.
// @author      Anton Grouchtchak
// @match       https://office.roofingsource.com/admin/WorkOrderModify.php*
// @icon        https://office.roofingsource.com/images/roofing-source-logo.png
// @license     GPLv3
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/490607/HubSpot%20Deal%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/490607/HubSpot%20Deal%20Integration.meta.js
// ==/UserScript==

(async () => {
    "use strict";

    const IS_DEV = localStorage.getItem("dev_mode") === "true";

    if (IS_DEV) {
        console.warn("Running in dev mode.");
    }

    const getAuthString = () => {
        // I found this to be the best option between being user-friendly and somewhat secure (Secure enough for this purpose).
        //
        // Since I cannot hardcode API keys or any other auth methods in the frontend, I needed a way to prevent
        // unauthorized access to the API, without making the users authorize themselves.
        // Without supplying the exact user id, name, and hostname, the API won't process the request.
        // This is basically a simple password, that gets validated on the backend
        // by checking if a user exists in the db with that id and name and the hostname matches.
        //
        // These global variables are only accessible from inside RSI when logged in.
        // Unless the header name and the "password" format is known,
        // the attack vector is not as big.
        return `${window.RS_USER_NAME}:${window.RS_USER_ID}:${window.location.hostname}`;
    };

    const createDeal = (properties) => {
        const userInfo = getAuthString();

        const subdomain = IS_DEV ? "sandbox" : "hubspot";

        return $.ajax({
            url: `https://${subdomain}.pydebloatx.com/deals/hubspot`,
            type: "POST",
            data: JSON.stringify(properties),
            contentType: "application/json;charset=UTF-8",
            headers: {
                "x-user-info": userInfo
            }
        });
    };

    const fetchWorkProjectDetails = async (workProjectUrl) => {
        const response = await fetch(workProjectUrl);
        if (!response.ok) {
            throw new Error("Response was not ok.");
        }

        const htmlString = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");

        const closingPercentage = doc.querySelector("#ticket_closing_perc").value;

        const properties = {
            closing_percentage: closingPercentage
        };
        return properties;
    };

    const getProposalDetails = async () => {
        // RSI values.
        const params = new URL(document.location).searchParams;
        const proposalId = params.get("wosid"); // RSI Proposal ID.

        const $buildingAnchor = $("#wo-form > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > a");
        const buildingName = $buildingAnchor
            .contents()
            .filter((_, node) => node.nodeType === Node.TEXT_NODE)
            .first()
            .text()
            .trim();

        const defaultDealPercentage = "20"; // HubSpot's default deal probability is 20%.

        // Pydantic will attempt to coerce some values when validating the properties, since all input values here are strings.
        const properties = {
            building_name: buildingName,
            closing_percentage: defaultDealPercentage,
            sid: proposalId
        };

        const workProjectUrl = $("#wo-form > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > p > a").attr("href");

        // Get properties from the work project page.
        try {
            const workProjectProperties = await fetchWorkProjectDetails(workProjectUrl);
            Object.assign(properties, workProjectProperties);
        } catch (error) {
            console.log("Failed to fetch work project properties. Using the default values.");
            console.error(error);
        }

        return properties;
    };

    const $messageBanner = $("<span id='messageBanner' style='margin-left: 20px;'></span>");

    const setMessage = (message, type = "info") => {
        const colors = {
            error: "red",
            success: "green",
            info: "blue"
        };

        const $messageBanner = $("#messageBanner");
        $messageBanner.css("color", colors[type] || "black");
        $messageBanner.text(message);
    };

    const parseErrorMessage = (error) => {
        const message = error?.detail?.body?.message || error?.detail?.reason;

        if (message) {
            if (message.includes("already has that value")) {
                return "A HubSpot deal with this proposal ID already exists";
            }
            return message;
        }
        return "Error while creating deal";
    };

    const $hubspotBtn = $("<button id='hubspotButton' style='margin-left: 20px;'></button>")
        .button({
            label: "Create Deal in HubSpot",
            icons: { primary: "ui-icon-circle-plus" }
        })
        .click(async (event) => {
            const $button = $(event.currentTarget);

            $button.button({
                disabled: true,
                label: "Collecting Proposal Details..."
            });
            $messageBanner.text("");

            const properties = await getProposalDetails();

            console.debug(properties);

            $button.button({
                label: "Creating HubSpot Deal..."
            });

            createDeal(properties)
                .then((data) => {
                    if (data.created_at) {
                        setMessage("HubSpot Deal Created!", "success");
                    } else {
                        setMessage("Processed, but HubSpot did not create a deal.", "success"); // API Returned something else.
                    }
                })
                .fail((xhr) => {
                    const serverHeader = xhr.getResponseHeader("Server");
                    let errorText = "Error while creating deal";

                    if (xhr.status === 502 && !serverHeader?.includes("uvicorn")) {
                        errorText = "Could not connect to server.";
                    } else if (xhr.responseText) {
                        const result = JSON.parse(xhr.responseText);
                        errorText = parseErrorMessage(result);

                        console.debug(result);
                    } else {
                        errorText = "Failed to create a deal in HubSpot.";
                    }

                    setMessage(errorText, "error");
                })
                .always(() => {
                    $button.button({
                        label: "Create Deal in HubSpot",
                        disabled: false
                    });
                });
        });

    const $proposalHeader = $("div h1[style='margin-left: 30px;font-size: 20px']");
    $proposalHeader.append($hubspotBtn);
    $proposalHeader.append($messageBanner);
})();
