// ==UserScript==
// @name        Add decimal time column - clockify.me
// @namespace   K33p_Qu13t's scripts
// @include     https://app.clockify.me
// @match       https://app.clockify.me/tracker
// @grant       none
// @version     1.1
// @author      K33p_Qu13t
// @license     MIT
// @description Adds new cell after time duration cell with decimal representation of time duration
// @downloadURL https://update.greasyfork.org/scripts/473416/Add%20decimal%20time%20column%20-%20clockifyme.user.js
// @updateURL https://update.greasyfork.org/scripts/473416/Add%20decimal%20time%20column%20-%20clockifyme.meta.js
// ==/UserScript==

/** Class to find custom container with decimal time */
const customDecimalTimeContainerClassName = 'decimal-time';

/** Class to find custom value with decimal time */
const customDecimalTimeValueClassName = 'decimal-time-value';

/** Delay time in milliseconds before manipulating with page content */
const delayBeforeCalcs = 3000;

/** Color to fade-in then decimal time value is double clicked */
const fadeColor = '#4CAF50';

/** Function to add new div's to each row with representation of duration time in decimal */
const displayDecimalTimes = () => {
    // Find all rows' containers where the time cell is
    const rows = document.querySelectorAll('.cl-timetracker-list-actions');

    rows.forEach((row) => {
        // Find time string
        const timeNode = row.querySelector('.cl-input-time-wrapper');
        const timeInput = timeNode.querySelector('.cl-input-time-picker-sum');
        const timeString = timeInput.value;

        // Get time parts: hours, minutes, seconds
        const timePartValues = timeString
            .split(':')
            .map((timePart) => Number(timePart));
        // Convert time to decimal number
        const decimalTimeValue =
            timePartValues[0] +
            timePartValues[1] / 60 +
            timePartValues[2] / 3600;

        // Create div of new cell
        const decimalTimeDiv = document.createElement('div');
        decimalTimeDiv.className = `${customDecimalTimeContainerClassName} cl-component-divided-left cl-d-md-inline-flex cl-entry-duration cl-m-abs cl-remove-divider-mob`;

        // Create span with decimal time value
        const decimalTimeSpan = document.createElement('span');
        decimalTimeSpan.className = customDecimalTimeValueClassName;
        decimalTimeSpan.style.fontSize = '1.286rem';
        decimalTimeSpan.style.fontWeight = 500;
        decimalTimeSpan.style.userSelect = 'none';
        decimalTimeSpan.style.transition = 'color 0.2s ease';
        // Set it's text as decimal time value rounded to 3 digits after point
        decimalTimeSpan.textContent = decimalTimeValue.toFixed(3);
        decimalTimeSpan.addEventListener(
            'dblclick',
            onDecimalTimeValueDoubleClick
        );
        decimalTimeDiv.appendChild(decimalTimeSpan);

        // Insert new cell
        timeNode.insertAdjacentElement('afterend', decimalTimeDiv);
    });
};

/** Event of double clicking on decimal time value to put the value to clipboard */
const onDecimalTimeValueDoubleClick = (e) => {
    const value = Number(e.target.innerText);

    const defaultColor = e.target.style.color;
    e.target.style.color = fadeColor;
    setTimeout(() => {
        e.target.style.color = defaultColor;
    }, 200);

    navigator.clipboard.writeText(value).catch(console.log);
};

setTimeout(() => {
    displayDecimalTimes();

    // subscribe to switch pages buttons onClick to automatically display decimal times after switching pages
    const pageSwitchingButtons = document.querySelectorAll('.cl-page-link');
    pageSwitchingButtons.forEach((switchingButton) =>
        switchingButton.addEventListener('click', () =>
            setTimeout(displayDecimalTimes, delayBeforeCalcs)
        )
    );
}, delayBeforeCalcs);
