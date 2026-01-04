// ==UserScript==
// @name            Chaturbate Thumbnails Zoom
// @author          nima-r
// @namespace       https://greasyfork.org/en/users/846327-nima-rahbar
// @icon            https://www.google.com/s2/favicons?sz=64&domain=chaturbate.org
// @description     Make thumbnails zoom on mouse hover
// @copyright       2022, nima-r (https://greasyfork.org/en/users/846327-nima-rahbar)
// @license         MIT
// @version         1.2.6
// @homepageURL     https://greasyfork.org/en/scripts/437111-chaturbate-animate-thumbnail-re-layout
// @homepage        https://greasyfork.org/en/scripts/437111-chaturbate-animate-thumbnail-re-layout
// @supportURL      https://greasyfork.org/en/scripts/437111-chaturbate-animate-thumbnail-re-layout/feedback
// @require         https://cdn.jsdelivr.net/npm/jquery@3.6.0
// @require         https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1.0.9
// @match           *://*.chaturbate.com/*
// @run-at          document-idle
// @downloadURL https://update.greasyfork.org/scripts/437111/Chaturbate%20Thumbnails%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/437111/Chaturbate%20Thumbnails%20Zoom.meta.js
// ==/UserScript==

/* global $, VM */

// Immediately Invoked Function Expression (IIFE) to avoid polluting the global scope
(() => {
    // Create a <style> element to hold custom CSS rules
    const style = document.createElement('style');

     // Define your CSS rules for the enlargement button
     const css = `
    .enlargementBtn {
        display: inline-block;
        width: 16px;
        height: 16px;
        background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDIwLjggNDIwLjgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQyMC44IDQyMC44OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNNDAyLjQ1LDBoLTczLjNjLTkuOCwwLTE3LjksOC0xNy45LDE3LjljMCw5LjgsOCwxNy45LDE3LjksMTcuOWgzMi4xbC04OC44LDg4bC00OS42LTQ5LjZjLTcuMS02LjMtMTguOC02LjMtMjUsMA0KCQlMNzMuNjUsMTk4LjNjLTcuMSw3LjEtNy4xLDE3LjksMCwyNWw0OS42LDQ5LjZMMzYuMTUsMzYwdi0zMC40YzAtOS44LTgtMTcuOS0xNy45LTE3LjljLTkuOCwwLTE3LjksOC0xNy45LDE3Ljl2NzMuMw0KCQljMCw5LjgsOCwxNy45LDE3LjksMTcuOWg3My4zYzguOSwwLDE3LjktOCwxNy45LTE3LjljMC05LjgtOC0xNy45LTE3LjktMTcuOWgtMzEuMmw4Ny45LTg3LjFsNDkuNiw0OS42YzcuNiw3LjYsMTguNCw2LjYsMjUsMA0KCQlsMTI0LjItMTI0LjFjNi45LTYuOSw3LjYtMTcuNSwwLTI1bC00OS41LTQ5LjVsODcuMS04Ni40djI4LjdjMCw5LjgsOCwxNy45LDE3LjksMTcuOWM5LjgsMCwxNy45LTgsMTcuOS0xNy45VjE3LjkNCgkJQzQyMC4yNSw4LjEsNDEyLjI1LDAsNDAyLjQ1LDB6IE0yMTAuMzUsMzEwbC05OS4yLTk5LjJsOTkuMi05OS4ybDk5LjIsOTkuMkwyMTAuMzUsMzEweiIvPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=")
    }

    .enlargementBtn.off {
        background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KICAgICB2aWV3Qm94PSIwIDAgNDIwLjggNDIwLjgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQyMC44IDQyMC44OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCiAgICA8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNNDAyLjQ1LDBoLTczLjNjLTkuOCwwLTE3LjksOC0xNy45LDE3LjljMCw5LjgsOCwxNy45LDE3LjksMTcuOWgzMi4xbC04OC44LDg4bC00OS42LTQ5LjZjLTcuMS02LjMtMTguOC02LjMtMjUsMA0KICAgICAgICBMNzMuNjUsMTk4LjNjLTcuMSw3LjEtNy4xLDE3LjksMCwyNWw0OS42LDQ5LjZMMzYuMTUsMzYwdi0zMC40YzAtOS44LTgtMTcuOS0xNy45LTE3LjljLTkuOCwwLTE3LjksOC0xNy45LDE3Ljl2NzMuMw0KICAgICAgICBjMCw5LjgsOCwxNy45LDE3LjksMTcuOWg3My4zYzguOSwwLDE3LjktOCwxNy45LTE3LjljMC05LjgtOC0xNy45LTE3LjktMTcuOWgtMzEuMmw4Ny45LTg3LjFsNDkuNiw0OS42YzcuNiw3LjYsMTguNCw2LjYsMjUsMA0KICAgICAgICBsMTI0LjItMTI0LjFjNi45LTYuOSw3LjYtMTcuNSwwLTI1bC00OS41LTQ5LjVsODcuMS04Ni40djI4LjdjMCw5LjgsOCwxNy45LDE3LjksMTcuOWM5LjgsMCwxNy45LTgsMTcuOS0xNy45VjE3LjkNCiAgICAgICAgQzQyMC4yNSw4LjEsNDEyLjI1LDAsNDAyLjQ1LDB6IE0yMTAuMzUsMzEwbC05OS4yLTk5LjJsOTkuMi05OS4ybDk5LjIsOTkuMkwyMTAuMzUsMzEweiIvPg0KICAgIDxsaW5lIHgxPSIwIiB5MT0iMCIgeDI9IjQyMC44IiB5Mj0iNDIwLjgiIHN0cm9rZT0iI0ZGMDAwMCIgc3Ryb2tlLXdpZHRoPSI1MCIvPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=")
    }
    `;

    // Set the innerHTML of the <style> element to the defined CSS rules
    style.innerHTML = css;

    // Append the <style> element to the <head> of the document to apply the styles
    document.head.appendChild(style);

    // Retrieve the enlargement state from localStorage or set it to "on" if not found
    var enlargement = localStorage.getItem('enlargement') || localStorage.setItem('enlargement', "on");

    // When the document is ready
    $(document).ready(function () {
        // Add the enlargement button to the navigation bar after the "broadcast yourself" link
        $("#header #nav .broadcast-yourself").after(
             // Create the button with the current enlargement state
            `<li><a href="#" class="enlargementBtn ${enlargement}"></a></li>`
        );
    });

    // Event handler for click events on the enlargement button
    $("body").on("click", ".enlargementBtn", function (e) {
        e.preventDefault(); // Prevent the default action of the link
        // Toggle the enlargement state
        if (enlargement == "on") {
            enlargement = "off"; // Set to 'off'
            $(".enlargementBtn").addClass("off"); // Add 'off' class to the button
        } else {
            enlargement = "on"; // Set to 'on'
            $(".enlargementBtn").removeClass("off"); // Remove 'off' class from the button
        }
        // Save the new enlargement state to localStorage
        localStorage.setItem('enlargement', enlargement);
        location.reload(); // Reload the page to apply changes
    });

    // Observe changes in the document body
    VM.observe(document.body, () => {
        // Check if enlargement is enabled
        if (enlargement == "on") {
            // Select all room cards in the endless page template
            const rooms = $(".list.endless_page_template .roomCard");

            // If there are room cards present
            if (rooms.length > 0) {
                // Apply a transition effect to room cards for smooth scaling
                $(".list.endless_page_template .roomCard").css("transition", "transform .1s ease-in-out");
                // Disable text selection on iPad for better user experience
                $(".isIpad .list.endless_page_template *")
                    .css("user-select", "none")
                    .css("-webkit-touch-callout", "none");

                // Iterate over each room card
                $(rooms).each((index, element) => {
                    // Get the room name from the data attribute or username
                    const name = $(element).find("> a").data("room")
                        ? $(element).find("> a").data("room")
                        : $(element).find("> .user-info > .username > a").text().replace(/^\s/g, "");
                    const thumbnail = $(element).find("> a img"); // Get the thumbnail image

                    // Bind pointer events to the room card element
                    $(element)
                        .bind("pointerdown", (event) => {
                            // Release pointer capture on pointer down
                            element.releasePointerCapture(event.pointerId);
                        })
                        .bind("pointerenter", (event) => {
                            // Handle pointer enter event to scale the room card
                            var firstQ = $("body .list.endless_page_template").innerWidth() / 5, // Calculate first quadrant
                                lastQ = firstQ * 4, // Calculate last quadrant
                                origin = "center center", // Default transform origin
                                originX = "center", // Default horizontal origin
                                originY = "center"; // Default vertical origin

                            // Determine the horizontal origin based on pointer position
                            if (event.pageX < firstQ) {
                                originX = "left"; // Set to left if in the first quadrant
                            } else if (event.pageX > lastQ) {
                                originX = "right"; // Set to right if in the last quadrant
                            }
                            if (event.pageY < $(document).innerHeight() / 4) {
                                originY = "top"; // Set to top if in the upper quarter
                            } else if (event.pageY > $(document).innerHeight() / 4) {
                                originY = "bottom"; // Set to bottom if in the lower quarter
                            }
                            origin = originX + " " + originY; // Combine horizontal and vertical origins

                            if ($(element).parent(".list.endless_page_template").length > 0) {
                                // Scale only on room list
                                $(element)
                                    .css("transform-origin", origin) // Set the transform origin
                                    .css("transform", "translateX(0px) scale(1.5)") // Scale the room card
                                    .css("z-index", "999"); // Bring the room card to the front
                            }
                        })
                        .bind("pointerup pointerleave", (event) => {
                            // Reset the scaling when pointer is released or leaves the element
                            if ($(element).parent(".list.endless_page_template").length > 0) {
                                // Scale only on room list
                                $(element)
                                    .css("transform-origin", "center center") // Reset transform origin
                                    .css("transform", "translateX(0px) scale(1)") // Reset scale to normal
                                    .css("z-index", "0"); // Reset z-index
                            }
                        });
                });
                return false; // Prevent default behavior
            }
        }
    });
})();