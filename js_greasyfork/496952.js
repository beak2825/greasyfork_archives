// ==UserScript==
// @name         BMS Seat and Show Counter
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds "Count Seats" and "Count Shows" buttons to BookMyShow for tracking seat availability and showtimes.
// @author       You
// @match        https://in.bookmyshow.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496952/BMS%20Seat%20and%20Show%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/496952/BMS%20Seat%20and%20Show%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create container, button group, count buttons, and count box
    const container = document.createElement("div");
    const buttonGroup = document.createElement("div");
    const countSeatsButton = document.createElement("button");
    const countShowsButton = document.createElement("button");
    const countBox = document.createElement("div");

    // Create toggle button
    const toggleButton = document.createElement("button");

    // Set button names
    countSeatsButton.innerHTML = "Count Seats";
    countShowsButton.innerHTML = "Count Shows";
    toggleButton.innerHTML = "Minimize";

    // Style container
    Object.assign(container.style, {
        position: "fixed", bottom: "0", left: "0", width: "100%", backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderTop: "1px solid #dee2e6", boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.1)", display: "flex",
        justifyContent: "space-between", alignItems: "center", padding: "10px", zIndex: "1000", flexWrap: "wrap",
        transition: "bottom 0.3s",
    });

    // Style button group
    Object.assign(buttonGroup.style, {
        display: "flex", gap: "10px"
    });

    // Style buttons
    const buttonStyle = {
        padding: "10px 20px", backgroundColor: "#007BFF", color: "white", border: "none",
        borderRadius: "5px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", cursor: "pointer",
        fontSize: "16px", fontWeight: "bold", transition: "background-color 0.3s, transform 0.3s", opacity: "0.9"
    };
    Object.assign(countSeatsButton.style, buttonStyle);
    Object.assign(countShowsButton.style, buttonStyle);
    Object.assign(toggleButton.style, buttonStyle);

    // Button hover effects
    const addHoverEffects = (button) => {
        button.onmouseover = () => { button.style.backgroundColor = "#0056b3"; button.style.transform = "scale(1.05)"; button.style.opacity = "1"; };
        button.onmouseout = () => { button.style.backgroundColor = "#007BFF"; button.style.transform = "scale(1)"; button.style.opacity = "0.9"; };
    };
    addHoverEffects(countSeatsButton);
    addHoverEffects(countShowsButton);
    addHoverEffects(toggleButton);

    // Style count box
    Object.assign(countBox.style, { padding: "10px", backgroundColor: "#F4D03F", border: "1px solid black", display: "none", flex: "0 1 auto", borderRadius: "5px" });

    // Append elements
    buttonGroup.append(countSeatsButton, countShowsButton);
    container.append(buttonGroup, countBox);
    document.body.appendChild(container);
    document.body.appendChild(toggleButton);

    // Position toggle button
    Object.assign(toggleButton.style, {
        position: "fixed", bottom: "90px", right: "10px", zIndex: "1001"
    });

    // Count seats button click event
    countSeatsButton.addEventListener("click", () => {
        const seatLayout = document.querySelector('.seat-layout');
        const blockedSeatsPC = document.querySelectorAll('a[class*="_blocked"]');
        const blockedSeatsMobile = seatLayout ? seatLayout.querySelectorAll('rect.seat.blocked') : [];
        const blockedCount = blockedSeatsPC.length + blockedSeatsMobile.length;

        blockedSeatsPC.forEach(seat => seat.style.border = "2px solid red");
        blockedSeatsMobile.forEach(seat => { seat.style.stroke = "red"; seat.style.strokeWidth = "2"; });

        const availableSeatsPC = document.querySelectorAll('a[class*="_available"]');
        const availableSeatsMobile = seatLayout ? seatLayout.querySelectorAll('rect.seat.available') : [];
        const availableSeatsMobileWhite = seatLayout ? seatLayout.querySelectorAll('rect[fill="white"]') : [];
        const availableCount = availableSeatsPC.length + availableSeatsMobile.length + availableSeatsMobileWhite.length;

        availableSeatsPC.forEach(seat => seat.style.border = "1px solid green");
        availableSeatsMobile.forEach(seat => { seat.style.stroke = "green"; seat.style.strokeWidth = "1"; });
        availableSeatsMobileWhite.forEach(seat => { seat.style.stroke = "green"; seat.style.strokeWidth = "1"; });

        const totalCount = blockedCount + availableCount;
        countBox.innerHTML = `Booked seats: ${blockedCount}<br>Available seats: ${availableCount}<br>Total seats: ${totalCount}`;
        countBox.style.display = "block";
    });

    // Count shows button click event
    countShowsButton.addEventListener("click", () => {
        const isMobile = window.innerWidth <= 600;
        let showCount = 0;

        if (isMobile) {
            const timeLists = document.querySelectorAll('.time-list');
            timeLists.forEach(timeList => {
                showCount += timeList.querySelectorAll('li').length;
            });
        } else {
            showCount = document.querySelectorAll('.showtime-pill').length;
        }

        countBox.innerHTML = `Total shows: ${showCount}`;
        countBox.style.display = "block";
    });

    // Toggle button click event
    toggleButton.addEventListener("click", () => {
        if (container.style.bottom === "0px") {
            container.style.bottom = "-90%";
            toggleButton.innerHTML = "Show Tool-Box";
        } else {
            container.style.bottom = "0";
            toggleButton.innerHTML = "Minimize";
        }
    });

    // Media queries for responsiveness
    const style = document.createElement('style');
    style.innerHTML = `
        @media (max-width: 600px) {
            button { font-size: 14px; padding: 8px 16px; }
            div { font-size: 14px; padding: 8px; }
        }
    `;
    document.head.appendChild(style);
})();