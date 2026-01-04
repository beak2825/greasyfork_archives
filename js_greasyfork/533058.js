// ==UserScript==
// @name        HubSpot Deal Sync Check
// @namespace   https://violentmonkey.github.io
// @version     1.0.1
// @description Check which proposals exist as HubSpot deals from the proposals list.
// @author      Anton Grouchtchak
// @match       https://office.roofingsource.com/admin/WorkOrders.php*
// @icon        https://office.roofingsource.com/images/roofing-source-logo.png
// @license     GPLv3
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/533058/HubSpot%20Deal%20Sync%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/533058/HubSpot%20Deal%20Sync%20Check.meta.js
// ==/UserScript==

(async () => {
    "use strict";

    const IS_DEV = localStorage.getItem("dev_mode") === "true";

    if (IS_DEV) {
        console.warn("Running in dev mode.");
    }

    const $uiContainer = $(
        "<div id='hubspotSyncContainer' style='display: flex; align-items: center; margin-bottom: 20px; gap: 15px;'></div>"
    );

    const $messageBanner = $("<span id='messageBanner'></span>");
    const $checkButton = $("<button id='hubspotDealSyncCheckBtn'></button>");

    const defaultButtonLabel = "Check HubSpot Deals";

    const setMessage = (message, type = "info") => {
        const colors = {
            error: "red",
            success: "green",
            info: "blue"
        };

        $messageBanner.css("color", colors[type] || "black");
        $messageBanner.text(message);
    };

    const getAuthString = () => {
        return `${window.RS_USER_NAME}:${window.RS_USER_ID}:${window.location.hostname}`;
    };

    const collectProposalIds = () => {
        const cells = {};

        $("#list3 td[aria-describedby$='_wo_sid']").each((_, element) => {
            const id = $(element).text().trim();
            if (id) {
                cells[id] = $(element);
            }
        });

        return cells;
    };

    const checkHubspotDeals = (proposalIdCells) => {
        const proposalIds = Object.keys(proposalIdCells);

        if (!proposalIds || proposalIds.length === 0) {
            setMessage("No proposal IDs found in the current table view.", "error");
            return Promise.reject("No proposal IDs found");
        }

        const subdomain = IS_DEV ? "sandbox" : "hubspot";
        const userInfo = getAuthString();
        const url = `https://${subdomain}.pydebloatx.com/deals/hubspot/proposal-id`;

        return $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ proposal_ids: proposalIds }),
            headers: {
                "x-user-info": userInfo
            }
        });
    };

    const resetCellHighlighting = (proposalCells) => {
        Object.values(proposalCells).forEach(($cell) => {
            $cell.css("background-color", "");
        });
    };

    const applyHighlighting = (data, proposalCells) => {
        let existCount = 0;

        for (const [id, exists] of Object.entries(data)) {
            if (exists && proposalCells[id]) {
                proposalCells[id].css("background-color", "#c8e6c9"); // Light green
                existCount++;
            }
        }

        return existCount;
    };

    const highlightCells = (data, proposalCells) => {
        resetCellHighlighting(proposalCells);

        const existCount = applyHighlighting(data, proposalCells);
        const totalCount = Object.keys(proposalCells).length;

        const plural = totalCount === 1 ? "" : "s";

        setMessage(`${existCount} out of ${totalCount} proposal${plural} on this page exist in HubSpot.`, "success");
    };

    const setupCheckButton = () => {
        $checkButton
            .button({
                label: defaultButtonLabel,
                icons: { primary: "ui-icon-refresh" }
            })
            .click(handleCheckButtonClick);
    };

    const handleCheckButtonClick = async (event) => {
        const $button = $(event.currentTarget);

        const proposalIdCells = collectProposalIds();
        const proposalCount = Object.keys(proposalIdCells).length;

        const plural = proposalCount === 1 ? "" : "s";

        if (proposalCount === 0) {
            $button.button({
                label: defaultButtonLabel,
                disabled: false
            });

            setMessage("No proposal IDs found in the current table view.", "error");

            return;
        }

        $button.button({
            label: `Checking ${proposalCount} proposal${plural}...`,
            disabled: true
        });

        setMessage("");

        checkHubspotDeals(proposalIdCells)
            .then((data) => {
                highlightCells(data, proposalIdCells);
            })
            .fail((xhr) => {
                let errorText = "Error checking proposal sync status.";

                if (xhr.responseText) {
                    let result = null;

                    try {
                        result = JSON.parse(xhr.responseText);
                    } catch (e) {
                        console.error(e);
                    }

                    let reason = result?.detail?.reason || result?.detail?.body?.message || result?.detail;
                    if (typeof reason !== "string") reason = "Unknown reason";

                    errorText = `${errorText} ${reason}.`;
                }

                setMessage(errorText, "error");
            })
            .always(() => {
                $button.button({
                    label: defaultButtonLabel,
                    disabled: false
                });
            });
    };

    const initializeUI = () => {
        //const $proposalHeader = $("body > div:nth-child(6)");

        const $proposalHeader = $('div[style="margin: auto; width: 80%; clear: left; padding: 20px 0;"]');

        if (!$proposalHeader.length) return false;

        $proposalHeader[0].style.paddingTop = "0";

        $uiContainer.append($checkButton);
        $uiContainer.append($messageBanner);

        $proposalHeader.prepend($uiContainer);

        console.log($proposalHeader);

        return true;
    };

    const initialize = () => {
        if (initializeUI()) {
            setupCheckButton();
        } else {
            console.error("Could not find container element for HubSpot Deal Sync Check.");
        }
    };

    initialize();
})();
