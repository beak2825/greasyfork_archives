// ==UserScript==
// @name         Neopets Gallery - Drag to Rank
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows you to drag-and-drop items in your Neopets Gallery to rank them instead of having to input rank numbers
// @author       Morde
// @match        https://www.neopets.com/gallery/index.phtml?msg=*&dowhat=rank&*
// @match        https://www.neopets.com/gallery/index.phtml?dowhat=rank&*
// @match        https://www.neopets.com/gallery/index.phtml?user_cat_g=*&dowhat=rank&*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465685/Neopets%20Gallery%20-%20Drag%20to%20Rank.user.js
// @updateURL https://update.greasyfork.org/scripts/465685/Neopets%20Gallery%20-%20Drag%20to%20Rank.meta.js
// ==/UserScript==

(function() {
    // Card group styling
    const css = `
    .card-group-qty {
        position: absolute;
        top: 66px;
        right: 26px;
        background: green;
        color: white;
        padding: 4px;
        border-radius: 4px;
    }

    .card-group-rank {
        display: none;
    }

    .card-group {
        position: relative;
        padding: 8px;
        margin: 2px;
        background: #eee;
        border: 1px solid #aaa;
        border-radius: 4px;
        cursor: grab;
    }

    .card-group * {
        pointer-events: none;
    }

    .card-group.dragging, .card-group:active {
        cursor: grabbing;
    }

    .card-groups {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        text-align: center;
    }
`;

    const style = document.createElement("style");

    document.head.appendChild(style);
    style.appendChild(document.createTextNode(css));

    // Remove dividers
    $("#gallery_form tr:nth-child(4n)").remove();

    // Group items/qtys/ranks
    let group = [];

    const groups = [];

    [1, 2, 3, 4].forEach((col, colIndex) => {
        $(`#gallery_form td:not([colspan]):nth-child(4n+${col})`).each((i, x) => {
            const $x = $(x);
            const inner = $x.html();
            const piece = i % 3;

            if (piece === 1)
                group.push(
                    `<div class="card-group-qty">${inner.replace("Qty:", "x")}</div>`
                );
            else if (piece === 2)
                group.push(`<div class="card-group-rank">${inner}</div>`);
            else group.push(`<div class="card-group-main">${inner}</div>`);

            if (group.length === 3) {
                const rowIndex = Math.floor(i / 3);
                // Save from column order to row order for the card divs
                groups[
                    colIndex + rowIndex * 4
                ] = `<div class="card-group" draggable=true>${group.join("")}</div>`;
                group = [];
            }
        });
    });

    // Remove old janky rows
    $(`#gallery_form tr:not(:last-of-type)`).remove();

    // Create grouped divs that will be draggable
    const $groups = $('<div class="card-groups" />');
    $("#gallery_form table").before($groups);

    $groups.html(groups.join(""));

    // Drag and drop handlers
    document.addEventListener("dragover", function (e) {
        e.preventDefault();
    });

    $(".card-group").each((i, x) => {
        x.ondrag = handleDrag;
        x.ondragend = handleDrop;
    });

    function handleDrag(event) {
        const selectedItem = event.target,
              list = selectedItem.parentNode,
              x = event.clientX,
              y = event.clientY;

        selectedItem.classList.add("dragging");
        let swapItem =
            document.elementFromPoint(x, y) === null
        ? selectedItem
        : document.elementFromPoint(x, y);

        if (list === swapItem.parentNode) {
            swapItem =
                swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
            list.insertBefore(selectedItem, swapItem);
        }
    }

    function handleDrop(event) {
        event.target.classList.remove("dragging");
        $('input.glry_rank').each((i, x) => x.value = i + 1); // Re-rank
    }
})();