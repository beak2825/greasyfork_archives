// ==UserScript==
// @name        gryffinwow black market
// @description Improves GryffinWow black market AH user experience
// @version     20250503
// @namespace   https://gryffinwow.com/en/black-market
// @match       https://gryffinwow.com/en/black-market
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/534835/gryffinwow%20black%20market.user.js
// @updateURL https://update.greasyfork.org/scripts/534835/gryffinwow%20black%20market.meta.js
// ==/UserScript==
// This is the auction listing table, where results are added
const outputTable = document.querySelector("table tbody");
async function fetchAndProcessPage(page) {
    // Fetch auction page
    const response = await fetch(`/en/black-market/${page}`);
    if (!response.ok)
        throw new Error("Error while fetching black market page");
    // Parse fetched HTML
    const parser = new DOMParser();
    const pageDocument = parser.parseFromString(await response.text(), "text/html");
    // Pick out auction list from HTML response
    const newRows = [...pageDocument.querySelectorAll("tbody tr")];
    // Add hover functionality for the fetched auctions
    newRows.forEach((row) => {
        // This scope is copied from GryffinWow's JS.
        // Copyrights? Whatever.
        const hoverElement = row.querySelector("[data-item]");
        $(hoverElement).hover(function (e) {
            $(document).bind("mousemove", TooltipExtended.addEvents.handleMouseMove);
            if (/^item=[0-9]*$/.test($(this).attr("data-item"))) {
                TooltipExtended.Item.get(this, function (data) {
                    TooltipExtended.show(data);
                    TooltipExtended.move(e);
                });
            }
        }, function () {
            $(document).unbind("mousemove", TooltipExtended.addEvents.handleMouseMove);
            $("#tooltip").hide();
            //if (TooltipExtended.Item.currentAjax != null)
            //    TooltipExtended.Item.currentAjax.abort();
        });
    });
    // Add fetched rows to the current page
    outputTable.append(...newRows);
    // If this wasn't the last page, fetch next page. Otherwise remove the paging elements at bottom of the page.
    if (pageDocument.querySelector(".next.page"))
        fetchAndProcessPage(page + 1);
    else
        document.querySelector(".pagination")?.remove();
}
// Start fetching from page 2, since the open page is 1.
fetchAndProcessPage(2);
// Add column sorting functionality
{
    const moneyMultipliers = {
        moneygold: 10000,
        moneysilver: 100,
        moneycopper: 1,
    };
    const sortSelectors = [
        (td) => td.querySelector('[class^="q"]').textContent.trim(),
        (td) => parseInt(td.textContent.trim(), 10),
        (td) => parseInt(td.textContent.trim(), 10),
        (td) => td.textContent.trim(),
        (td) => td.textContent.trim(),
        (td) => td.textContent.trim(),
        (td) => td.textContent.trim(),
        (td) => [...td.children].reduce((accumulator, span) => parseInt(span.textContent.trim(), 10) *
            moneyMultipliers[span.className], 0),
    ];
    document
        .querySelectorAll("thead tr th")
        .forEach((th, columnIndex) => {
        th.addEventListener("click", () => {
            const sortable = [...outputTable.children].map((row, rowIndex) => ({
                row,
                value: sortSelectors[columnIndex](row.children[columnIndex]),
            }));
            sortable.sort((a, b) => Number(b.value < a.value) - Number(a.value < b.value));
            sortable.forEach((sortResult, index) => {
                const children = [...outputTable.children];
                const currentIndex = children.indexOf(sortResult.row);
                if (currentIndex != index) {
                    outputTable.insertBefore(sortResult.row, children[index]);
                }
            });
        });
    });
}
