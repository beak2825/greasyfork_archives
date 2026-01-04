// ==UserScript==
// @name        leo virus
// @namespace   Violentmonkey Scripts
// @match       https://mckinnonsc-vic.compass.education/*
// @match       https://*.google.com/*
// @match       https://*.gmail.com/*
// @grant       none
// @version     1.3
// @author      -
// @description 23/06/2025, 11:32:58
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/540681/leo%20virus.user.js
// @updateURL https://update.greasyfork.org/scripts/540681/leo%20virus.meta.js
// ==/UserScript==

setTimeout(() => {
  // Check if the current site is the Compass Education site
  if (window.location.hostname.includes('compass.education')) {
    // Update the home-pageWelcome element text for Compass
    const element = document.querySelector(".home-pageWelcome");
    if (element) {
      element.textContent = "PETER";
    }

    // Update the home-schoolNameWrapper h3 text for Compass
    const element2 = document.querySelector(".home-schoolNameWrapper h3");
    if (element2) {
      element2.textContent = "WELCOME BACK PEDRO!!!!!";
    }

    // Update the compass-day-calendar-tb-datefield text for Compass
    const element3 = document.getElementById("compass-day-calendar-tb-datefield");
    if (element3) {
      element3.textContent = "STUPID IDIOT DAY!";
    }
  }

  // Loop through all <p> elements and modify them (works on any site)
  let elements = document.querySelectorAll("p");
  for (let i = 0; i < elements.length; i++) {
    console.log(elements[i].textContent);
    // Modify each <p> element's text content
    elements[i].textContent = "PEDRO PONY!";

    // Apply infinite spinning animation and scaling effect to the element
    elements[i].style.animation = "spin 2s linear infinite, grow 5s ease-in-out infinite";
    elements[i].style.fontSize = "2em";  // Initial size
  }

  // Loop through all <span> elements and modify them (works on any site)
  let elements2 = document.querySelectorAll("span");
  for (let i = 0; i < elements2.length; i++) {
    console.log(elements2[i].textContent);
    // Modify each <span> element's text content
    elements2[i].textContent = "PETER PETER PETER!";

    // Apply infinite spinning animation and scaling effect to the element
    elements2[i].style.animation = "spin 2s linear infinite, grow 5s ease-in-out infinite";
    elements2[i].style.fontSize = "2em";  // Initial size
  }

  let elements3 = document.querySelectorAll("img");
  for (let i = 0; i < elements3.length; i++) {
    elements3[i].src = "https://lh3.googleusercontent.com/a-/ALV-UjW7xKtn6geBpgC0soq9qqc6zncJQH2MkoZr2CzhHDw52B8IpxrulPcr8lXw1GRzyjA_FTIKDsH_-QaD_kwqyM62wb5HfiAvgZleuHZC-L7Z1t1myCdbTS9y4eJyXOwIDnUpA5PpOSDHHlHSKbk6S98EDoV8RUYNnLRmjmPjw53z5Zlhgn5uwV-gsZlor2uEmtntlDlMS3w1GAQrCqbsVEeRR1Mtjs1iHN45d_0g1n8cZ_W-Iog5UcMK4xK2R4-gGbLx5vPnaBL8K7SwkJfRV7rdJP7T3a6KPMyPfHxEFz-1eV7VK74ZKMPOTk62CjkRgUTxFHtvqOhAvmBFqUG6pQo4faF4_4v4z5_HJ-HTTSMKyWj8RHzpwfqWyWPXdsvREW3-nESZ87zRJ5muYquDZ1dUD2onOvKgzd5bVuz0WhmsBBhxSTMZbQ2imKAvN8cKk2gZ4Yzj48obTqBmOLtb25lKw3E_ev1lm4QgT7jkbUxjBOLWccdsQAuajdv372otXjZU-LPtsY_SdEITNNEOyY6ATnDyf-FsKwnNVtvlEjndZ1ikJ2-67ejFf_pyjhiNHAFdJExD6a53EMFgWLhR3bKKDU0OD3Pj1RkcqBeEjRer9OumJlIoaZv_gDsRx9auMDp2Wtbqe3LcwLm2ozQWJLh-KwOfNsVNJmEpmrlNffunOjBjXy4Kr82UMghvFR1b2woSSM5jy9TvMhAFFJbVRP9tco3xv9UpOIwvXgxjlZHxa5IMsEGOKm30LesObc-PJn973SgtyQE68VLLZJ-ZVtbUf0T7UFQE_9673idlh4Mk3i_ghtU_nNUXxXj6yYR4_rR2Ibxjnklj2UdftBNGRN-3KvQ-hZEOV_dHAaW2GE9Yjs3tRaNat8p9wZC-z4HC7LItUYSL5x64YQrbsENLgyRD-9596EhYRhXoqN7bGAK4A5sxssXIsQiD24FEuoJ13QCmwfz0cqpftX8AZYNGt0iJt4-QJsA=s32-c"
  }

  let schoolLogo = document.querySelector(".home-schoolLogo");
  schoolLogo.style = "background-image: url(https://lh3.googleusercontent.com/a-/ALV-UjW7xKtn6geBpgC0soq9qqc6zncJQH2MkoZr2CzhHDw52B8IpxrulPcr8lXw1GRzyjA_FTIKDsH_-QaD_kwqyM62wb5HfiAvgZleuHZC-L7Z1t1myCdbTS9y4eJyXOwIDnUpA5PpOSDHHlHSKbk6S98EDoV8RUYNnLRmjmPjw53z5Zlhgn5uwV-gsZlor2uEmtntlDlMS3w1GAQrCqbsVEeRR1Mtjs1iHN45d_0g1n8cZ_W-Iog5UcMK4xK2R4-gGbLx5vPnaBL8K7SwkJfRV7rdJP7T3a6KPMyPfHxEFz-1eV7VK74ZKMPOTk62CjkRgUTxFHtvqOhAvmBFqUG6pQo4faF4_4v4z5_HJ-HTTSMKyWj8RHzpwfqWyWPXdsvREW3-nESZ87zRJ5muYquDZ1dUD2onOvKgzd5bVuz0WhmsBBhxSTMZbQ2imKAvN8cKk2gZ4Yzj48obTqBmOLtb25lKw3E_ev1lm4QgT7jkbUxjBOLWccdsQAuajdv372otXjZU-LPtsY_SdEITNNEOyY6ATnDyf-FsKwnNVtvlEjndZ1ikJ2-67ejFf_pyjhiNHAFdJExD6a53EMFgWLhR3bKKDU0OD3Pj1RkcqBeEjRer9OumJlIoaZv_gDsRx9auMDp2Wtbqe3LcwLm2ozQWJLh-KwOfNsVNJmEpmrlNffunOjBjXy4Kr82UMghvFR1b2woSSM5jy9TvMhAFFJbVRP9tco3xv9UpOIwvXgxjlZHxa5IMsEGOKm30LesObc-PJn973SgtyQE68VLLZJ-ZVtbUf0T7UFQE_9673idlh4Mk3i_ghtU_nNUXxXj6yYR4_rR2Ibxjnklj2UdftBNGRN-3KvQ-hZEOV_dHAaW2GE9Yjs3tRaNat8p9wZC-z4HC7LItUYSL5x64YQrbsENLgyRD-9596EhYRhXoqN7bGAK4A5sxssXIsQiD24FEuoJ13QCmwfz0cqpftX8AZYNGt0iJt4-QJsA=s32-c)"

  // Add the CSS keyframes for spinning and growing
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes grow {
      0% { transform: scale(1); }
      100% { transform: scale(2); }
    }
  `;
  document.head.appendChild(style);

}, 5000);
