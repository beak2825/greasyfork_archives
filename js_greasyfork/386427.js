// ==UserScript==
// @name          Wanikani SRS Item Totals
// @namespace     Mercieral
// @description   Display specific SRS item totals
// @include       /^https:\/\/(www|preview)\.wanikani\.com\/?(dashboard)?$/
// @version       1.0.3
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/386427/Wanikani%20SRS%20Item%20Totals.user.js
// @updateURL https://update.greasyfork.org/scripts/386427/Wanikani%20SRS%20Item%20Totals.meta.js
// ==/UserScript==

(async function() {
    // Require the WK open resource
    if (!window.wkof) {
        alert('The "Wanikani SRS Item Totals" script requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
        window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }

    let wkSRSTotals = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    try {
        await initWKOF();
        await loadData();
        await updateUI();
    } catch (e) {
        console.error('"Wanikani SRS Item Totals" failed!', e);
    }


    /**
    * Initializes the WKOF for ItemData
    */
    async function initWKOF () {
        window.wkof.include('ItemData');
        await window.wkof.ready('document,ItemData');
        if (window.wkof.ItemData == null) {
            throw new Error('WKOF ItemData does not exist!');
        }
    }

    /**
    * Loads and parses the item data from WKOF
    */
    async function loadData () {
        const data = await loadDataFromWKOF();
        await parseData(data);

        /**
        * Loads the data from WKOF
        */
        async function loadDataFromWKOF () {
            const config = {
                wk_items: {
                    options: {assignments: true}
                }
            };
            const processItems = await window.wkof.ItemData.get_items(config);
            if (!Array.isArray(processItems)) {
                throw new Error('WKOF call returned non-array');
            }

            return processItems;
        }

        /**
        * Parse the data once the document and WKOF data is ready
        */
        async function parseData (data) {
            // Loop through all items and accumulate the appropriate SRS stage counter
            for (let item of data) {
                const srsLevel = item && item.assignments && item.assignments.srs_stage;
                if (srsLevel != null) {
                    wkSRSTotals[srsLevel - 1]++;
                }
            }

        }
    }

    /**
     * Creates the UI elements
     */
    function updateUI () {
        initCSS();
        createSRSTotalsContainer('apprenticeTotalsContainer', 0, 3, $('#apprentice'));
        createSRSTotalsContainer('guruTotalsContainer', 4, 5, $('#guru'));
        createSRSTotalsContainer('masterTotalsContainer', 6, 6, $('#master'));
        createSRSTotalsContainer('enlightenedTotalsContainer', 7, 7, $('#enlightened'));
        createSRSTotalsContainer('burnTotalsContainer', 8, 8, $('#burned'));

        /**
        * Create the CSS style sheet and append it to the document
        */
        function initCSS() {
            $('head').append(`
                <style>
                    .srsTotal {
                        display: inline-block !important;
                        margin: 0 !important;
                        font-size: 12px !important;
                        font-weight: normal !important;
                    }

                    .srsTotalDiv {
                        padding: 2px 0 4px 0;
                        height: 20px
                    }

                    .srs-total-container {
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                        padding-bottom: 0 !important;
                    }

                    #apprenticeTotalsContainer span {
                        width: 25%;
                    }

                    #guruTotalsContainer span {
                        width: 50%;
                    }
                </style>
            `);
        }

        /**
        * Creates the individual srs stage total container and adds the text spans
        * @param {String} id - The ID for the SRS stage total text container
        * @param {Number} min - The minimum srs stage number (0 indexed) for this group
        * @param {Number} max - The maximum srs stage number (0 indexed) for this group
        * @param {Object} parent - The jquery DOM element to add the container to
        */
        function createSRSTotalsContainer (id, min, max, parent) {
            // Create the container for this srs group
            const totalsContainer = $(document.createElement("div"));
            totalsContainer.addClass("srsTotalDiv");
            totalsContainer.attr('id', id);
            parent.append(totalsContainer[0]);
            parent.addClass('srs-total-container');
            for (let srsStage = min; srsStage <= max; srsStage++) {
                // Create the span for this specific srs stage
                const srsTotalSpan = document.createElement("span");
                srsTotalSpan.className = 'srsTotal';
                srsTotalSpan.innerText = min === max ? "" : wkSRSTotals[srsStage];
                totalsContainer.append(srsTotalSpan);
            }
        }
    }
})();