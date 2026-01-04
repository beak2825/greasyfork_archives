// ==UserScript==
// @name         CcOoKkIiEeSs
// @namespace    http://malisima.info/
// @version      0.1
// @description  Cookie Clicker plugin that adjusts your current cookies to your CPS, features custom refresh rate.
// @author       You
// @match        https://orteil.dashnet.org/cookieclicker/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525970/CcOoKkIiEeSs.user.js
// @updateURL https://update.greasyfork.org/scripts/525970/CcOoKkIiEeSs.meta.js
// ==/UserScript==

(function() {
    // Create a container for the slider
    const sliderContainer = document.createElement('div');
    sliderContainer.style.position = 'fixed';
    sliderContainer.style.top = '10px';
    sliderContainer.style.left = '10px';
    sliderContainer.style.zIndex = '9999';
    sliderContainer.style.background = 'rgba(0, 0, 0, 0.7)';
    sliderContainer.style.color = '#fff';
    sliderContainer.style.padding = '10px';
    sliderContainer.style.borderRadius = '5px';
    sliderContainer.style.fontFamily = 'Arial, sans-serif';

    // Create a label for the slider
    const label = document.createElement('label');
    label.innerText = 'Refresh Rate: ';
    sliderContainer.appendChild(label);

    // Create the slider
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 1;
    slider.max = 60000; // max of 60 seconds (60000 ms)
    slider.value = 1000; // Default value set to 1 second (1000 ms)
    slider.style.width = '200px';
    slider.style.marginLeft = '10px';
    sliderContainer.appendChild(slider);

    // Create a label to display the slider value
    const valueLabel = document.createElement('span');
    valueLabel.innerText = `1s`;
    sliderContainer.appendChild(valueLabel);

    // Append the slider container to the document body
    document.body.appendChild(sliderContainer);

    // Function to update CPS to cookies
    function updateCpsToCookies() {
        const currentCookies = Game.cookies; // Get current cookies
        Game.cookiesPs = currentCookies; // Set CPS equal to the current cookie count
        Game.UpdateMenu(); // Update the UI (so CPS display refreshes)
    }

    // Function to handle slider changes
    let updateInterval = null; // Declare interval outside to clear it later

    function setRefreshRate(ms) {
        clearInterval(updateInterval); // Clear previous interval
        updateInterval = setInterval(() => {
            updateCpsToCookies();
            console.log(`Cookies set to CPS: ${Game.cookies}`); // Log the current cookies being set to CPS
        }, ms);
    }

    // Initial setup
    setRefreshRate(slider.value); // Set initial interval

    // Slider change listener
    slider.addEventListener('input', function() {
        const sliderValue = slider.value;
        const timeInSeconds = sliderValue / 1000;
        valueLabel.innerText = `${timeInSeconds}s`;

        // Update the refresh rate with the new slider value
        setRefreshRate(sliderValue);
    });

    // Update CPS to cookies immediately
    updateCpsToCookies();
})();
