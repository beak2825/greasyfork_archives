// ==UserScript==
// @name         Hide Threads on Bogleheads front page
// @namespace    https://www.bogleheads.org/
// @version      0.1
// @description  Allows you hide a thread on the Bogleheads front page by clicking an "x" button that appears on rollover of the right side of each row
// @author       ChatGPT
// @match https://www.bogleheads.org/*
// @exclude https://www.bogleheads.org/forum/*
// @exclude https://www.bogleheads.org/wiki/*
// @exclude https://www.bogleheads.org/blog/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459759/Hide%20Threads%20on%20Bogleheads%20front%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/459759/Hide%20Threads%20on%20Bogleheads%20front%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select the table with the ID of posts_table
    const table = document.getElementById("posts_table");
    if (!table) {
        return;
    }

    // Select all rows in the main thread list
    const rows = table.querySelectorAll("tbody tr");

    // Load the list of hidden thread titles from local storage
    const hiddenThreadTitles = JSON.parse(localStorage.getItem("hiddenThreadTitles") || "{}");

    // Iterate over each row
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        // ignore header rows by skipping rows with less than 5 td elements
        if (row.getElementsByTagName("td").length < 5) {
            continue;
        }

        // Select the first link in the row
        const link = row.querySelector("td a");
        if (!link) {
            continue;
        }

        // Get the text of the link
        const title = link.innerHTML;

        // If the link text is in the list of hidden thread titles, hide the row
        if (hiddenThreadTitles[title]) {
            row.style.display = "none";
        }

        // Create a span element to hold the button
        const span = document.createElement("span");
        span.style.float = "right";
        span.style.marginTop = "-0.5em";
        span.style.opacity = "0";
        span.style.display = "inline-block";

        // Create a button element
        const button = document.createElement("button");
        button.innerHTML = "&times;";
        button.style.background = "none";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.fontSize = "smaller";
        button.style.height = "1em";
        button.style.lineHeight = "1em";
        button.style.width = "1em";
        button.style.position = "relative";
        button.style.top = "5px";

        // Add the button to the span
        span.appendChild(button);

        // Add the span to the row
        row.appendChild(span);

        // Attach a hover event listener to the span
        span.addEventListener("mouseover", function() {
            // When the span is hovered over, show the button
            span.style.opacity = "1";
        });
        span.addEventListener("mouseout", function() {
            // When the mouse moves out of the span, hide the button
            span.style.opacity = "0";
        });

        // Attach a click event listener to the button
        button.addEventListener("click", function() {
            // When the button is clicked, hide the row
            row.style.display = "none";

            // Add the title of the hidden thread to the list of hidden thread titles
            hiddenThreadTitles[title] = true;

            // Store the list of hidden thread titles in local storage
            localStorage.setItem("hiddenThreadTitles", JSON.stringify(hiddenThreadTitles));
        });

        button.addEventListener("mouseenter", function() {
            row.style.backgroundColor = "#f2f2f2";
        });

        button.addEventListener("mouseleave", function() {
            row.style.backgroundColor = "";
        });

    }
})();